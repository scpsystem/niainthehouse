import { useEffect, useState } from 'react';
import { BG } from '../game/assetManifest';
import { Burst } from '../components/Effects';
import { InteractiveObject } from '../components/InteractiveObject';
import { sfx } from '../game/sfx';
import type { ActivityCtx, Rect } from '../game/types';
import { PanelPortal, StepChips, type StepChip } from './shared';

const BLANKET: Rect = { x: 38, y: 52, w: 46, h: 36 };
const PILLOWS: Rect[] = [
  { x: 14, y: 23, w: 24, h: 26 },
  { x: 43, y: 32, w: 25, h: 17 },
];
const BED: Rect = { x: 9, y: 20, w: 78, h: 72 };

const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/**
 * Aktiviti mengemas katil (klik berurutan).
 * Tiada imej selimut/bantal berasingan, jadi tiada seret-lepas: setiap langkah ialah klik
 * pada kawasan bersinar. Selepas langkah akhir, bilik "disapu" menjadi bilik kemas.
 */
export function MakeBed({ ctx }: { ctx: ActivityCtx }) {
  const [step, setStep] = useState(0); // 0 selimut, 1 bantal, 2 katil, 3 siap
  const [pillows, setPillows] = useState([false, false]);
  const [burst, setBurst] = useState({ x: 50, y: 50, tick: 0 });
  const [misses, setMisses] = useState(0);
  const [wipe, setWipe] = useState(false);

  const progress = `${step}-${pillows.filter(Boolean).length}`;

  useEffect(() => {
    ctx.say('Jom kemas katil! Langkah 1: tekan selimut biru untuk melipatnya.', 'happy');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bantuan berperingkat: jika pemain tersangkut, Nia mengingatkan dan jari menjadi lebih besar.
  useEffect(() => {
    if (step >= 3) return;
    const id = window.setTimeout(() => {
      setMisses((m) => Math.max(m, 2));
      ctx.say('Tekan tempat yang bersinar, ya!', 'think');
    }, 9000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const pop = (r: Rect) => {
    const c = center(r);
    setBurst((b) => ({ x: c.x, y: c.y, tick: b.tick + 1 }));
  };

  const foldBlanket = () => {
    sfx.swoosh();
    sfx.correct();
    pop(BLANKET);
    setStep(1);
    ctx.say('Selimut dah terlipat! Langkah 2: tekan kedua-dua bantal.', 'happy');
  };

  const fixPillow = (i: number) => {
    sfx.pop();
    pop(PILLOWS[i]);
    const next = pillows.map((p, j) => (j === i ? true : p));
    setPillows(next);
    if (next.every(Boolean)) {
      sfx.correct();
      setStep(2);
      ctx.say('Bantal dah tersusun! Langkah 3: tekan katil untuk melicinkan cadar.', 'happy');
    } else {
      ctx.say('Satu lagi bantal!', 'happy');
    }
  };

  const smoothBed = () => {
    sfx.swoosh();
    pop(BED);
    setStep(3);
    ctx.say('Katil dah licin dan kemas!', 'happy');
    window.setTimeout(() => setWipe(true), 250);
    window.setTimeout(() => sfx.star(), 1500);
    window.setTimeout(() => ctx.done(), 2300);
  };

  const chips: StepChip[] = [
    { label: 'Lipat selimut', icon: '🧺', state: step > 0 ? 'done' : 'current' },
    { label: 'Susun bantal', icon: '🛏️', state: step > 1 ? 'done' : step === 1 ? 'current' : 'locked' },
    { label: 'Kemaskan katil', icon: '✨', state: step > 2 ? 'done' : step === 2 ? 'current' : 'locked' },
  ];

  const strong = misses >= 2;

  return (
    <>
      {/* Bilik kemas "disapu" masuk dari kiri ke kanan (di bawah Nia) */}
      <img
        src={BG.bilikKemas}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          zIndex: 15,
          clipPath: `inset(0 ${wipe ? 0 : 100}% 0 0)`,
          transition: 'clip-path 1.4s ease-in-out',
        }}
      />
      {wipe && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 h-full"
          style={{
            zIndex: 16,
            width: '3%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)',
            animation: 'wipe-bar 1.4s ease-in-out forwards',
          }}
        />
      )}

      {/* Tekan di tempat lain = bantuan */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 40 }}
        onClick={() => {
          if (step >= 3) return;
          setMisses((m) => {
            if (m + 1 === 2) ctx.say('Tekan tempat yang bersinar, ya!', 'think');
            return m + 1;
          });
        }}
      />

      {step === 0 && <InteractiveObject rect={BLANKET} label="Selimut" onClick={foldBlanket} strong={strong} />}
      {step === 1 &&
        PILLOWS.map((r, i) =>
          pillows[i] ? (
            <InteractiveObject key={i} rect={r} label="Bantal" onClick={() => undefined} done />
          ) : (
            <InteractiveObject key={i} rect={r} label="Bantal" onClick={() => fixPillow(i)} strong={strong} />
          ),
        )}
      {step === 2 && <InteractiveObject rect={BED} label="Katil" onClick={smoothBed} strong={strong} />}

      <Burst x={burst.x} y={burst.y} tick={burst.tick} emoji="✨" n={9} />
      <Burst x={burst.x} y={burst.y} tick={burst.tick} emoji="⭐" n={5} spread={0.06} />

      <PanelPortal>
        <StepChips chips={chips} />
      </PanelPortal>
    </>
  );
}
