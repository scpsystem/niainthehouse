import { useRef, useState } from 'react';
import { ActivityHost } from '../activities';
import { CHAPTER_TITLES } from '../game/chapters';
import { sfx } from '../game/sfx';
import { cancelSpeech, setSpeechEnabled, useSpeechStatus } from '../game/speech';
import type { SaveData } from '../game/types';
import { useGameEngine } from '../hooks/useGameEngine';
import { useLayoutMode, useStageFit } from '../hooks/useLayout';
import { ChoicePanel } from './ChoicePanel';
import { DialogueBox } from './DialogueBox';
import { InteractiveObject } from './InteractiveObject';
import { OutfitSelector } from './OutfitSelector';
import { PauseMenu } from './PauseMenu';
import { PhaseEnd } from './PhaseEnd';
import { StarBurst, StarCounter } from './RewardSystem';
import { SceneRenderer } from './SceneRenderer';
import { PanelSlotContext, StageContext } from './StageContext';

export function GameScreen({ save, onExit, onNewGame }: { save: SaveData; onExit: () => void; onNewGame: () => void }) {
  const eng = useGameEngine(save);
  const [paused, setPaused] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  const [hideNotice, setHideNotice] = useState(false);
  const [hideRotate, setHideRotate] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stage = useStageFit(wrapRef);
  const { mode, portraitPhone } = useLayoutMode();
  const speechStatus = useSpeechStatus();
  const side = mode === 'side';

  const toggleAudio = () => {
    const v = !audioOn;
    setAudioOn(v);
    setSpeechEnabled(v);
    sfx.setEnabled(v);
  };

  const topBar = (
    <div className="flex shrink-0 items-center gap-2 px-2 py-1">
      <button className="btn btn-sm btn-white" onClick={() => { cancelSpeech(); setPaused(true); }} aria-label="Jeda">
        ⏸<span className="hidden sm:inline">Jeda</span>
      </button>
      <span className="hidden truncate rounded-full bg-white/80 px-3 py-1 text-base font-extrabold sm:inline">
        {CHAPTER_TITLES[eng.chapterId]}
      </span>
      <div className="flex-1" />
      <StarCounter stars={eng.stars} />
      <button className="btn btn-sm btn-white" onClick={toggleAudio} aria-label={audioOn ? 'Matikan bunyi' : 'Hidupkan bunyi'}>
        {audioOn ? '🔊' : '🔇'}
      </button>
    </div>
  );

  const notices = (
    <>
      {speechStatus === 'unavailable' && !hideNotice && (
        <div className="mx-2 mb-1 flex items-center gap-2 rounded-xl bg-[#fff3c4] px-3 py-1 text-sm font-bold">
          <span className="flex-1">🔈 Suara Bahasa Melayu tiada pada peranti ini. Anda masih boleh membaca teks Nia.</span>
          <button className="font-extrabold" onClick={() => setHideNotice(true)} aria-label="Tutup">✕</button>
        </div>
      )}
      {portraitPhone && !hideRotate && (
        <div className="mx-2 mb-1 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1 text-sm font-bold">
          <span className="flex-1">📱 Putar telefon secara mendatar untuk skrin yang lebih besar.</span>
          <button className="font-extrabold" onClick={() => setHideRotate(true)} aria-label="Tutup">✕</button>
        </div>
      )}
    </>
  );

  const panel = (
    <div className="flex flex-col gap-2">
      <DialogueBox
        dialogue={eng.dialogue}
        canNext={eng.phase === 'say'}
        onNext={eng.advance}
        onListen={eng.replay}
      />
      {eng.phase === 'ask' && eng.dialogue?.choices && (
        <ChoicePanel choices={eng.dialogue.choices} highlight={eng.dialogue.highlight} onChoose={eng.choose} />
      )}
      {eng.outfitOpen && <OutfitSelector onPick={eng.pickOutfit} />}
      <div ref={setSlot} className="empty:hidden" />
    </div>
  );

  return (
    <div className={`pastel-bg relative flex h-full w-full ${side ? 'flex-row' : 'flex-col'}`}>
      <div className={side ? 'flex min-w-0 flex-1 flex-col' : 'contents'}>
        {topBar}
        {notices}
        <div ref={wrapRef} className="flex min-h-0 min-w-0 flex-1 items-center justify-center p-1">
          <div
            className="relative shrink-0 overflow-hidden rounded-3xl shadow-xl ring-4 ring-ink"
            style={{ width: stage.w, height: stage.h }}
          >
            <StageContext.Provider value={stage}>
              <PanelSlotContext.Provider value={slot}>
                <SceneRenderer
                  scene={eng.scene}
                  nia={eng.nia}
                  outfit={eng.outfit}
                  camera={eng.camera}
                  fgOn={eng.fgOn}
                  veil={eng.veil}
                >
                  {eng.targets?.map((t) => (
                    <InteractiveObject key={t.id} rect={t.rect} label={t.label} onClick={() => eng.tapTarget(t.id)} />
                  ))}
                  {eng.activity && slot && <ActivityHost id={eng.activity} ctx={eng.activityCtx} />}
                </SceneRenderer>
                <StarBurst tick={eng.starBurst} />
              </PanelSlotContext.Provider>
            </StageContext.Provider>
          </div>
        </div>
      </div>

      <div
        className={side ? 'w-[40%] max-w-[420px] shrink-0 overflow-y-auto p-2' : 'shrink-0 overflow-y-auto px-2 pb-2'}
        style={side ? undefined : { height: 'clamp(200px, 36dvh, 340px)' }}
      >
        {panel}
      </div>

      {paused && (
        <PauseMenu
          onResume={() => setPaused(false)}
          onRestart={() => {
            setPaused(false);
            eng.restartChapter();
          }}
          onMenu={onExit}
        />
      )}
      {eng.ended && (
        <PhaseEnd
          name={save.name}
          stars={eng.stars}
          outfit={eng.outfit}
          onRestart={onNewGame}
          onMenu={onExit}
        />
      )}
    </div>
  );
}
