import { useEffect, useState } from 'react';
import { Bubbles, WaterDrops } from '../components/Effects';
import { InteractiveObject } from '../components/InteractiveObject';
import { sfx } from '../game/sfx';
import type { ActivityCtx, Rect } from '../game/types';
import { PanelPortal, StepChips, type StepChip } from './shared';

const KNOB: Rect = { x: 90, y: 47, w: 8, h: 11 };
const CURTAIN_AREA: Rect = { x: 61, y: 20, w: 17, h: 55 };

/**
 * Mandi: pemain membuka pancuran. Nia berada di belakang tirai (hanya bayang samar kelihatan),
 * jadi visual sentiasa sopan. Air mengalir dan gelembung sabun naik.
 */
export function Shower({ ctx }: { ctx: ActivityCtx }) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    ctx.say('Tekan pancuran air untuk membukanya.', 'happy');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'ready') return;
    const id = window.setTimeout(() => {
      setStuck(true);
      ctx.say('Tekan tempat yang bersinar di sebelah kanan, ya!', 'think');
    }, 9000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    sfx.splash();
    const t: number[] = [];
    t.push(window.setTimeout(() => ctx.say('Sabun dahulu… sental badan dengan lembut!', 'happy'), 200));
    t.push(window.setTimeout(() => ctx.say('Sekarang syampu untuk rambut… busa-busa!', 'happy'), 2300));
    t.push(window.setTimeout(() => ctx.say('Akhir sekali, bilas sampai bersih!', 'happy'), 4400));
    t.push(window.setTimeout(() => sfx.splash(), 2300));
    t.push(
      window.setTimeout(() => {
        setPhase('done');
        sfx.star();
        ctx.say('Siap mandi! Tutup pancuran air.', 'happy');
      }, 6600),
    );
    t.push(window.setTimeout(() => ctx.done(), 8200));
    return () => t.forEach((x) => window.clearTimeout(x));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const chips: StepChip[] = [
    { label: 'Buka pancuran', icon: '🚿', state: phase === 'ready' ? 'current' : 'done' },
    { label: 'Sabun, syampu & bilas', icon: '🫧', state: phase === 'running' ? 'current' : phase === 'done' ? 'done' : 'locked' },
  ];

  return (
    <>
      {phase === 'ready' && (
        <InteractiveObject
          rect={KNOB}
          label="Pancuran"
          strong={stuck}
          onClick={() => {
            sfx.tap();
            setPhase('running');
          }}
        />
      )}
      {phase === 'running' && (
        <>
          {/* Air dari kepala pancuran */}
          <WaterDrops x={91.2} y={24} fall={32} n={9} spreadX={0.022} />
          {/* Air mengalir pada tirai */}
          <WaterDrops x={70} y={15} fall={58} n={14} spreadX={0.15} />
          <Bubbles rect={CURTAIN_AREA} n={14} />
        </>
      )}
      <PanelPortal>
        <StepChips chips={chips} />
      </PanelPortal>
    </>
  );
}
