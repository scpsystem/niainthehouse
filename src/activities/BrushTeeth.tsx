import { useEffect, useMemo, useState } from 'react';
import { NIA } from '../game/assetManifest';
import { Burst } from '../components/Effects';
import { useStage } from '../components/StageContext';
import { sfx } from '../game/sfx';
import type { ActivityCtx } from '../game/types';
import { PanelPortal } from './shared';

interface BrushStep {
  id: string;
  icon: string;
  label: string;
  /** Petunjuk untuk langkah ini (diberi apabila pemain memilih langkah lain dahulu). */
  clue: string;
  praise: string;
}

/** Urutan betul. Cadangan: boleh dilaraskan mengikut panduan guru. */
const STEPS: BrushStep[] = [
  {
    id: 'ambil',
    icon: '🪥',
    label: 'Ambil berus gigi',
    clue: 'Kita perlukan alat untuk gosok gigi dahulu. Apa yang kita pegang?',
    praise: 'Betul! Saya dah pegang berus gigi.',
  },
  {
    id: 'ubat',
    icon: '🧴',
    label: 'Letak ubat gigi',
    clue: 'Berus dah ada. Apa yang perlu diletakkan supaya gigi bersih dan wangi?',
    praise: 'Bagus! Sedikit sahaja ubat gigi, sebesar kacang hijau.',
  },
  {
    id: 'gosok',
    icon: '🦷',
    label: 'Gosok semua gigi',
    clue: 'Sekarang berus ada ubat gigi. Masa untuk gosok gigi atas, bawah, depan dan belakang!',
    praise: 'Pandai! Gigi digosok sehingga bersih.',
  },
  {
    id: 'kumur',
    icon: '💧',
    label: 'Kumur dengan air',
    clue: 'Lepas gosok, ada buih di dalam mulut. Apa yang kita buat dengan air?',
    praise: 'Betul! Kumur untuk buang semua buih.',
  },
  {
    id: 'bilas',
    icon: '🚰',
    label: 'Bilas berus & simpan',
    clue: 'Langkah terakhir: jaga berus gigi supaya bersih untuk esok.',
    praise: 'Hebat! Berus dah bersih dan disimpan.',
  },
];

/** Susunan kad yang dipaparkan (sengaja bercampur). */
const DISPLAY_ORDER = [2, 4, 0, 3, 1];
const ZONES = ['atas', 'bawah', 'depan', 'belakang'];

/**
 * Gosok gigi: (1) pemain menyusun urutan yang betul dengan petunjuk berperingkat,
 * (2) animasi Nia memberus gigi pada paparan dekat sinki.
 */
export function BrushTeeth({ ctx }: { ctx: ActivityCtx }) {
  const { w } = useStage();
  const [phase, setPhase] = useState<'order' | 'brushing'>('order');
  const [done, setDone] = useState<number>(0); // bilangan langkah betul
  const [wrong, setWrong] = useState(0);
  const [shakeId, setShakeId] = useState<{ id: string; k: number } | null>(null);
  const [pop, setPop] = useState<{ icon: string; k: number } | null>(null);
  const [zone, setZone] = useState(0);

  useEffect(() => {
    ctx.say('Pilih langkah pertama untuk gosok gigi. Tekan kad di bawah.', 'think');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remaining = useMemo(() => DISPLAY_ORDER.filter((idx) => idx >= done), [done]);

  const choose = (idx: number) => {
    if (phase !== 'order') return;
    const expected = STEPS[done];
    const picked = STEPS[idx];
    if (picked.id === expected.id) {
      sfx.correct();
      setWrong(0);
      setPop((p) => ({ icon: picked.icon, k: (p?.k ?? 0) + 1 }));
      const n = done + 1;
      setDone(n);
      if (n === STEPS.length) {
        ctx.say('Semua langkah betul! Tengok saya gosok gigi!', 'happy');
        window.setTimeout(() => setPhase('brushing'), 1200);
      } else {
        ctx.say(`${picked.praise} Apa langkah seterusnya?`, 'happy');
      }
    } else {
      sfx.wrong();
      setWrong((x) => x + 1);
      setShakeId((s) => ({ id: picked.id, k: (s?.k ?? 0) + 1 }));
      ctx.say(`Hmm, belum lagi. ${expected.clue}`, 'think');
    }
  };

  // Animasi memberus gigi: 4 zon gigi, kemudian selesai.
  useEffect(() => {
    if (phase !== 'brushing') return;
    sfx.swoosh();
    const timers: number[] = [];
    ZONES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setZone(i);
          sfx.pop();
        }, i * 1500),
      );
    });
    timers.push(window.setTimeout(() => ctx.say('Yeay! Gigi saya dah bersih!', 'happy'), ZONES.length * 1500));
    timers.push(window.setTimeout(() => sfx.star(), ZONES.length * 1500));
    timers.push(window.setTimeout(() => ctx.done(), ZONES.length * 1500 + 1800));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <>
      {phase === 'order' && (
        <>
          {/* Papan urutan di atas ruang permainan */}
          <div
            className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 gap-[1.2%]"
            style={{ top: '4%', zIndex: 46 }}
            aria-hidden
          >
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-center rounded-full border-4 font-extrabold"
                style={{
                  width: w * 0.085,
                  height: w * 0.085,
                  fontSize: w * (i < done ? 0.04 : 0.032),
                  background: i < done ? '#dff6e9' : 'rgba(255,255,255,.85)',
                  borderColor: i < done ? '#17754a' : '#2b2350',
                  color: '#2b2350',
                  transition: 'all .3s',
                }}
              >
                {i < done ? s.icon : i + 1}
              </div>
            ))}
          </div>
          {pop && (
            <div
              key={pop.k}
              className="fx-pop-in pointer-events-none absolute"
              style={{ left: '50%', top: '52%', fontSize: w * 0.18, zIndex: 47, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))' }}
            >
              {pop.icon}
            </div>
          )}
          <Burst x={50} y={52} tick={pop?.k ?? 0} n={8} />
        </>
      )}

      {phase === 'brushing' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 46, background: 'rgba(255,255,255,.35)', backdropFilter: 'blur(5px)' }}
        >
          <div className="relative h-[94%]" style={{ aspectRatio: '3 / 4' }}>
            <div className="brush-wiggle h-full w-full overflow-hidden rounded-3xl ring-4 ring-ink">
              <img src={NIA.brushCloseup} alt="Nia menggosok gigi" draggable={false} className="h-full w-full object-cover" />
            </div>
            {/* Buih berhampiran mulut */}
            <div className="pointer-events-none absolute" style={{ left: '46%', top: '35%' }}>
              {Array.from({ length: 7 }, (_, i) => (
                <span
                  key={i}
                  className="fx-bubble absolute block rounded-full"
                  style={{
                    left: (i - 3) * w * 0.007,
                    width: w * (0.01 + (i % 3) * 0.004),
                    height: w * (0.01 + (i % 3) * 0.004),
                    background: 'radial-gradient(circle at 30% 30%, #fff, #dff2ff)',
                    border: '1.5px solid #fff',
                    ['--rise' as string]: `${w * 0.05}px`,
                    ['--sway' as string]: `${(i % 2 ? 1 : -1) * w * 0.008}px`,
                    ['--dur' as string]: `${0.9 + (i % 3) * 0.3}s`,
                    ['--delay' as string]: `${i * 0.13}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Penerang zon gigi */}
          <div
            className="absolute left-[3%] top-1/2 -translate-y-1/2 rounded-3xl border-4 border-ink bg-white p-[1.2%] text-center shadow-xl"
            style={{ width: '25%' }}
          >
            <div className="font-extrabold" style={{ fontSize: w * 0.022 }}>
              Gosok gigi…
            </div>
            <div className="mt-1 flex flex-col gap-1">
              {ZONES.map((z, i) => (
                <div
                  key={z}
                  className="rounded-xl border-2 border-ink font-extrabold"
                  style={{
                    fontSize: w * 0.022,
                    background: i === zone ? '#ffd54a' : i < zone ? '#dff6e9' : '#f3efff',
                    transition: 'background .25s',
                  }}
                >
                  {i < zone ? '✅ ' : ''}
                  {z[0].toUpperCase() + z.slice(1)}
                </div>
              ))}
            </div>
          </div>
          <span className="fx-twinkle absolute" style={{ right: '8%', top: '25%', fontSize: w * 0.08 }}>
            ✨
          </span>
          <span className="fx-twinkle absolute" style={{ right: '14%', top: '58%', fontSize: w * 0.06, animationDelay: '.5s' }}>
            🦷
          </span>
        </div>
      )}

      <PanelPortal>
        {phase === 'order' ? (
          <div className="slide-up flex flex-wrap gap-2" role="group" aria-label="Langkah gosok gigi">
            {remaining.map((idx) => {
              const s = STEPS[idx];
              const shake = shakeId?.id === s.id;
              const hint = wrong >= 2 && STEPS[done].id === s.id;
              return (
                <button
                  key={`${s.id}-${shake ? shakeId?.k : 0}`}
                  type="button"
                  onClick={() => choose(idx)}
                  className={`btn btn-white min-w-[120px] flex-1 flex-col !gap-0 !py-1 ${shake ? 'shake' : ''} ${
                    hint ? 'glow-pulse !bg-sun' : ''
                  }`}
                  style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
                >
                  <span aria-hidden style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.2rem)', lineHeight: 1.1 }}>
                    {s.icon}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="slide-up rounded-2xl bg-white/80 p-3 text-center text-lg font-extrabold">
            👀 Tengok Nia gosok gigi!
          </div>
        )}
      </PanelPortal>
    </>
  );
}
