import { useEffect, useState } from 'react';
import { Burst, WaterDrops } from '../components/Effects';
import { InteractiveObject } from '../components/InteractiveObject';
import { sfx } from '../game/sfx';
import type { ActivityCtx, Rect } from '../game/types';
import { PanelPortal, StepChips, type StepChip } from './shared';

// Koordinat dalam ruang bilik air (kamera sudah dizoom ke sinki oleh skrip bab).
const FAUCET: Rect = { x: 19.5, y: 44, w: 5.5, h: 10 };
const FACE: Rect = { x: 26.5, y: 47, w: 7, h: 12 };
const TOWEL: Rect = { x: 5.5, y: 32, w: 7, h: 22 };
const SCRUBS_NEEDED = 3;

/** Basuh muka: buka paip -> tekan muka 3 kali -> lap dengan tuala. */
export function WashFace({ ctx }: { ctx: ActivityCtx }) {
  const [step, setStep] = useState(0); // 0 paip, 1 basuh, 2 tuala, 3 siap
  const [scrubs, setScrubs] = useState(0);
  const [water, setWater] = useState(false);
  const [splash, setSplash] = useState(0);
  const [sparkle, setSparkle] = useState(0);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    ctx.say('Langkah 1: tekan paip untuk membuka air.', 'happy');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step >= 3) return;
    const id = window.setTimeout(() => {
      setStuck(true);
      ctx.say('Tekan tempat yang bersinar, ya!', 'think');
    }, 9000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, scrubs]);

  const openTap = () => {
    sfx.splash();
    setWater(true);
    setStep(1);
    ctx.say('Air dah mengalir! Langkah 2: tekan muka Nia 3 kali untuk membasuh.', 'happy');
  };

  const scrub = () => {
    sfx.splash();
    setSplash((k) => k + 1);
    ctx.setNia({ anim: 'wash' });
    window.setTimeout(() => ctx.setNia({ anim: 'idle' }), 800);
    const n = scrubs + 1;
    setScrubs(n);
    if (n >= SCRUBS_NEEDED) {
      sfx.correct();
      setWater(false);
      setStep(2);
      ctx.say('Muka dah bersih! Langkah 3: tekan tuala untuk mengelap muka.', 'happy');
    } else {
      ctx.say(`Gosok lembut-lembut… ${n} daripada ${SCRUBS_NEEDED}!`, 'happy');
    }
  };

  const dry = () => {
    sfx.swoosh();
    setSparkle((k) => k + 1);
    setStep(3);
    ctx.setNia({ anim: 'happy' });
    ctx.say('Muka saya dah bersih dan segar!', 'happy');
    window.setTimeout(() => sfx.star(), 500);
    window.setTimeout(() => ctx.done(), 1900);
  };

  const chips: StepChip[] = [
    { label: 'Buka paip', icon: '🚰', state: step > 0 ? 'done' : 'current' },
    { label: 'Basuh muka', icon: '💦', state: step > 1 ? 'done' : step === 1 ? 'current' : 'locked' },
    { label: 'Lap dengan tuala', icon: '🧺', state: step > 2 ? 'done' : step === 2 ? 'current' : 'locked' },
  ];

  return (
    <>
      {water && <WaterDrops x={22.4} y={53} fall={4.5} n={5} spreadX={0.004} />}
      {step === 0 && <InteractiveObject rect={FAUCET} label="Paip" onClick={openTap} strong={stuck} />}
      {step === 1 && <InteractiveObject rect={FACE} label="Muka" onClick={scrub} strong={stuck} showHint />}
      {step === 2 && <InteractiveObject rect={TOWEL} label="Tuala" onClick={dry} strong={stuck} />}

      <Burst x={30} y={53} tick={splash} emoji="💦" n={8} spread={0.05} />
      <Burst x={30} y={52} tick={sparkle} emoji="✨" n={8} spread={0.05} />

      <PanelPortal>
        <StepChips chips={chips} />
      </PanelPortal>
    </>
  );
}
