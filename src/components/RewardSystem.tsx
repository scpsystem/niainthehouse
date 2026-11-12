import { useStage } from './StageContext';

/** Paparan bintang di bar atas. Nombor berdenyut apabila bertambah. */
export function StarCounter({ stars }: { stars: number }) {
  return (
    <div
      className="flex items-center gap-1 rounded-full border-[3px] bg-white px-3 py-1 text-xl font-extrabold"
      style={{ borderColor: '#2b2350' }}
      aria-label={`${stars} bintang`}
    >
      <span aria-hidden>⭐</span>
      <span key={stars} className="fx-pop-in-simple inline-block min-w-[1.2ch] text-center">
        {stars}
      </span>
    </div>
  );
}

/** Tiga bintang melambung di tengah ruang permainan setiap kali pemain mendapat ganjaran. */
export function StarBurst({ tick }: { tick: number }) {
  const { w } = useStage();
  if (!tick) return null;
  return (
    <div key={tick} className="pointer-events-none absolute inset-0" style={{ zIndex: 70 }} aria-hidden>
      {[28, 50, 72].map((l, i) => (
        <span
          key={l}
          className="fx-star-fly absolute"
          style={{ left: `${l}%`, top: '55%', fontSize: w * (i === 1 ? 0.12 : 0.085), animationDelay: `${i * 0.12}s` }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
