import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTERS } from '../game/chapters';
import { CAM_DEFAULT, DEFAULT_NIA, OUTFITS, PRAISE, RETRY } from '../game/scenes';
import { sfx } from '../game/sfx';
import { cancelSpeech, speak } from '../game/speech';
import { writeSave } from '../game/storage';
import type {
  ActivityCtx,
  ActivityId,
  Camera,
  ChapterId,
  DialogueState,
  Emotion,
  NiaView,
  OutfitId,
  Phase,
  SaveData,
  SceneId,
  Step,
  Target,
} from '../game/types';

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

/**
 * Mesin keadaan permainan. Setiap bab ialah senarai langkah (lihat game/chapters.ts).
 * Enjin menjalankan satu langkah pada satu masa; langkah interaktif (dialog, pilihan,
 * tekan objek, aktiviti, pilih baju) menunggu input pemain sebelum bergerak ke langkah seterusnya.
 */
export function useGameEngine(initial: SaveData) {
  const playerName = initial.name;
  const fmt = useCallback((s: string) => s.split('{nama}').join(playerName), [playerName]);

  const [chapterId, setChapterId] = useState<ChapterId>(initial.chapter);
  const [stepIndex, setStepIndex] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const [scene, setScene] = useState<SceneId>('bedroomMessy');
  const [nia, setNia] = useState<NiaView>(DEFAULT_NIA);
  const [camera, setCamera] = useState<Camera>(CAM_DEFAULT);
  const [fgOn, setFgOn] = useState(false);
  const [veil, setVeil] = useState(true);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [phase, setPhaseState] = useState<Phase>('busy');
  const [targets, setTargets] = useState<Target[] | null>(null);
  const [activity, setActivity] = useState<ActivityId | null>(null);
  const [outfitOpen, setOutfitOpen] = useState(false);
  const [outfit, setOutfit] = useState<OutfitId>(initial.outfit);
  const [stars, setStars] = useState(initial.stars);
  const [starBurst, setStarBurst] = useState(0);
  const [ended, setEnded] = useState(false);

  const phaseRef = useRef<Phase>('busy');
  const stepRef = useRef<Step | null>(null);
  const starsRef = useRef(stars);
  const outfitRef = useRef(outfit);
  const pendingOutfit = useRef<OutfitId>(initial.outfit);
  const chapterStart = useRef({ stars: initial.stars, outfit: initial.outfit });
  const wrongRef = useRef(0);
  const dialogueRef = useRef<DialogueState | null>(null);
  const ephemeral = useRef<number[]>([]);
  starsRef.current = stars;
  outfitRef.current = outfit;
  dialogueRef.current = dialogue;

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  const after = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    ephemeral.current.push(id);
  }, []);

  useEffect(
    () => () => {
      ephemeral.current.forEach((id) => window.clearTimeout(id));
      cancelSpeech();
    },
    [],
  );

  const cheer = useCallback(
    (emotion: Emotion) => {
      if (emotion !== 'happy') return;
      setNia((n) => (n.pose === 'stand' && n.anim === 'idle' ? { ...n, anim: 'happy' } : n));
      after(() => setNia((n) => (n.anim === 'happy' ? { ...n, anim: 'idle' } : n)), 1100);
    },
    [after],
  );

  const showLine = useCallback(
    (d: DialogueState) => {
      setDialogue(d);
      speak(d.text);
    },
    [],
  );

  const nextStep = useCallback(() => {
    setPhase('busy');
    setStepIndex((i) => i + 1);
  }, [setPhase]);

  // ───────────── Pelaksana langkah ─────────────
  useEffect(() => {
    const step = CHAPTERS[chapterId][stepIndex];
    stepRef.current = step ?? null;
    if (!step) return;

    let dead = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!dead) fn();
      }, ms);
      timers.push(id);
    };
    const next = () => {
      if (!dead) nextStep();
    };

    switch (step.t) {
      case 'scene': {
        setPhase('busy');
        setTargets(null);
        setOutfitOpen(false);
        setVeil(true);
        later(() => {
          setScene(step.scene);
          setNia((n) => ({ ...n, anim: 'idle', fx: null, silhouette: false, moveMs: 0, ...step.nia }));
          setCamera({ ...CAM_DEFAULT, ...step.camera });
          setFgOn(false);
          setVeil(false);
          later(next, 450);
        }, 420);
        break;
      }
      case 'say': {
        setPhase('say');
        showLine({ text: fmt(step.text), emotion: step.emotion ?? 'neutral', kind: 'say' });
        cheer(step.emotion ?? 'neutral');
        break;
      }
      case 'ask': {
        wrongRef.current = 0;
        setPhase('ask');
        showLine({
          text: fmt(step.text),
          emotion: step.emotion ?? 'think',
          kind: 'ask',
          choices: step.choices,
          highlight: null,
        });
        break;
      }
      case 'move': {
        setPhase('busy');
        setNia((n) => ({ ...n, x: step.x, y: step.y ?? n.y, moveMs: step.ms, anim: 'walk' }));
        later(() => {
          setNia((n) => ({ ...n, anim: 'idle' }));
          next();
        }, step.ms + 80);
        break;
      }
      case 'nia': {
        setPhase('busy');
        setNia((n) => ({ ...n, moveMs: 0, ...step.patch }));
        if (step.patch.pose === 'stand') sfx.pop();
        later(next, step.wait ?? 50);
        break;
      }
      case 'camera': {
        setPhase('busy');
        setCamera((c) => ({ ...c, ...step.camera }));
        later(next, (step.camera.ms ?? CAM_DEFAULT.ms) + 100);
        break;
      }
      case 'fg': {
        setFgOn(step.on);
        next();
        break;
      }
      case 'wait': {
        setPhase('busy');
        later(next, step.ms);
        break;
      }
      case 'tap': {
        setPhase('tap');
        setTargets(step.targets);
        showLine({ text: fmt(step.prompt), emotion: step.emotion ?? 'neutral', kind: 'prompt' });
        break;
      }
      case 'activity': {
        setPhase('activity');
        setActivity(step.id);
        break;
      }
      case 'outfit': {
        setPhase('outfit');
        setOutfitOpen(true);
        showLine({ text: fmt(step.prompt), emotion: 'happy', kind: 'prompt' });
        break;
      }
      case 'applyOutfit': {
        setPhase('busy');
        setNia((n) => ({ ...n, fx: 'poof' }));
        sfx.pop();
        later(() => setOutfit(pendingOutfit.current), 600);
        later(() => {
          setNia((n) => ({ ...n, fx: null }));
          sfx.star();
          next();
        }, 1500);
        break;
      }
      case 'stars': {
        setPhase('busy');
        setStars((s) => s + step.n);
        setStarBurst((k) => k + 1);
        sfx.star();
        later(next, 1000);
        break;
      }
      case 'chapterEnd': {
        writeSave({
          name: playerName,
          chapter: step.next,
          stars: starsRef.current,
          outfit: outfitRef.current,
        });
        chapterStart.current = { stars: starsRef.current, outfit: outfitRef.current };
        setPhase('busy');
        setChapterId(step.next);
        setStepIndex(0);
        break;
      }
      case 'end': {
        setPhase('busy');
        setEnded(true);
        break;
      }
    }

    return () => {
      dead = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, stepIndex, runKey]);

  // ───────────── Tindakan pemain ─────────────
  const advance = useCallback(() => {
    if (phaseRef.current !== 'say') return;
    cancelSpeech();
    sfx.tap();
    nextStep();
  }, [nextStep]);

  const choose = useCallback(
    (i: number) => {
      const st = stepRef.current;
      if (phaseRef.current !== 'ask' || st?.t !== 'ask') return;
      const c = st.choices[i];
      if (!c) return;
      if (c.correct) {
        sfx.correct();
        setPhase('say');
        showLine({ text: fmt(c.reply ?? pick(PRAISE)), emotion: 'happy', kind: 'say' });
        cheer('happy');
      } else {
        sfx.wrong();
        wrongRef.current += 1;
        const correctIdx = st.choices.findIndex((x) => x.correct);
        const text = fmt(c.hint ?? pick(RETRY));
        setDialogue((d) =>
          d ? { ...d, text, emotion: 'think', highlight: wrongRef.current >= 2 ? correctIdx : null } : d,
        );
        speak(text);
      }
    },
    [cheer, fmt, setPhase, showLine],
  );

  const tapTarget = useCallback(
    (_id: string) => {
      if (phaseRef.current !== 'tap') return;
      sfx.tap();
      setTargets(null);
      nextStep();
    },
    [nextStep],
  );

  const pickOutfit = useCallback(
    (id: OutfitId) => {
      const st = stepRef.current;
      if (phaseRef.current !== 'outfit' || st?.t !== 'outfit') return;
      const def = OUTFITS[id];
      if (st.accept.includes(id)) {
        sfx.correct();
        pendingOutfit.current = id;
        setOutfitOpen(false);
        setPhase('say');
        showLine({ text: fmt(def.reply), emotion: 'happy', kind: 'say' });
      } else {
        sfx.wrong();
        const text = fmt(def.hint ?? pick(RETRY));
        setDialogue((d) => (d ? { ...d, text, emotion: 'think' } : d));
        speak(text);
      }
    },
    [fmt, setPhase, showLine],
  );

  const finishActivity = useCallback(() => {
    if (phaseRef.current !== 'activity') return;
    setActivity(null);
    nextStep();
  }, [nextStep]);

  const activityCtx: ActivityCtx = useMemo(
    () => ({
      say: (text, emotion = 'neutral') => {
        showLine({ text: fmt(text), emotion, kind: 'feedback' });
        cheer(emotion);
      },
      setNia: (patch) => setNia((n) => ({ ...n, ...patch })),
      done: finishActivity,
      playerName,
    }),
    [cheer, fmt, finishActivity, playerName, showLine],
  );

  const replay = useCallback(() => {
    const d = dialogueRef.current;
    if (d) speak(d.text);
  }, []);

  const restartChapter = useCallback(() => {
    cancelSpeech();
    ephemeral.current.forEach((id) => window.clearTimeout(id));
    setStars(chapterStart.current.stars);
    setOutfit(chapterStart.current.outfit);
    pendingOutfit.current = chapterStart.current.outfit;
    setActivity(null);
    setTargets(null);
    setOutfitOpen(false);
    setFgOn(false);
    setEnded(false);
    setDialogue(null);
    setCamera(CAM_DEFAULT);
    setPhase('busy');
    setStepIndex(0);
    setRunKey((k) => k + 1);
  }, [setPhase]);

  return {
    chapterId,
    scene,
    nia,
    camera,
    fgOn,
    veil,
    dialogue,
    phase,
    targets,
    activity,
    outfitOpen,
    outfit,
    stars,
    starBurst,
    ended,
    activityCtx,
    advance,
    choose,
    tapTarget,
    pickOutfit,
    replay,
    restartChapter,
  };
}
