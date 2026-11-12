import { useMemo } from 'react';
import { useStage } from './StageContext';

/** Letupan emoji/bintang pada koordinat peratus ruang permainan. Tukar `tick` untuk mengulang. */
export function Burst({
  x,
  y,
  tick,
  emoji = '✨',
  n = 8,
  spread = 0.09,
}: {
  x: number;
  y: number;
  tick: number;
  emoji?: string;
  n?: number;
  spread?: number;
}) {
  const { w } = useStage();
  const items = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + tick;
        const d = w * spread * (0.7 + ((i * 37) % 10) / 20);
        return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, key: i };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, n, w, spread],
  );
  if (!tick) return null;
  return (
    <div
      key={tick}
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: 55, fontSize: w * 0.035 }}
    >
      {items.map((it) => (
        <span
          key={it.key}
          className="fx-burst absolute"
          style={{ ['--dx' as string]: `${it.dx}px`, ['--dy' as string]: `${it.dy}px` }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/** Titisan air jatuh dari satu titik. */
export function WaterDrops({
  x,
  y,
  fall,
  n = 6,
  spreadX = 0,
}: {
  x: number;
  y: number;
  fall: number;
  n?: number;
  spreadX?: number;
}) {
  const { w, h } = useStage();
  return (
    <div className="pointer-events-none absolute" style={{ left: `${x}%`, top: `${y}%`, zIndex: 44 }}>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="fx-drop absolute block rounded-full"
          style={{
            left: (i - n / 2) * (spreadX * w) / n,
            width: w * 0.007,
            height: w * 0.014,
            background: 'linear-gradient(#bfe6ff,#4aa8ff)',
            ['--fall' as string]: `${(fall / 100) * h}px`,
            ['--dur' as string]: `${0.55 + (i % 3) * 0.12}s`,
            ['--delay' as string]: `${(i * 0.09) % 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Gelembung sabun naik ke atas dalam satu kawasan. */
export function Bubbles({ rect, n = 10 }: { rect: { x: number; y: number; w: number; h: number }; n?: number }) {
  const { w, h } = useStage();
  return (
    <div
      className="pointer-events-none absolute overflow-visible"
      style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%`, zIndex: 44 }}
    >
      {Array.from({ length: n }, (_, i) => {
        const s = w * (0.012 + ((i * 7) % 5) * 0.004);
        return (
          <span
            key={i}
            className="fx-bubble absolute block rounded-full"
            style={{
              left: `${(i * 97) % 90}%`,
              bottom: 0,
              width: s,
              height: s,
              background: 'radial-gradient(circle at 30% 30%, #fff, rgba(190,235,255,.75))',
              border: '1.5px solid rgba(255,255,255,.95)',
              ['--rise' as string]: `${(rect.h / 100) * h * 0.9}px`,
              ['--sway' as string]: `${(i % 2 ? 1 : -1) * w * 0.01}px`,
              ['--dur' as string]: `${1.8 + (i % 4) * 0.4}s`,
              ['--delay' as string]: `${(i * 0.23) % 1.6}s`,
            }}
          />
        );
      })}
    </div>
  );
}
