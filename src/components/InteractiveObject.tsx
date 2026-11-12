import type { Rect } from '../game/types';
import { useStage } from './StageContext';

interface Props {
  rect: Rect;
  label: string;
  onClick: () => void;
  /** Tunjuk jari + label. */
  showHint?: boolean;
  /** Tanda siap (✅). */
  done?: boolean;
  /** Jari yang lebih besar apabila pemain tersangkut. */
  strong?: boolean;
}

/** Kawasan yang boleh ditekan pada ruang permainan; sekurang-kurangnya 48px supaya mudah disentuh. */
export function InteractiveObject({ rect, label, onClick, showHint = true, done = false, strong = false }: Props) {
  const { w } = useStage();
  const wExpr = `max(${rect.w}%, 48px)`;
  const hExpr = `max(${rect.h}%, 48px)`;

  if (done) {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute flex items-center justify-center"
        style={{
          left: `calc(${rect.x}% + ${rect.w / 2}%)`,
          top: `calc(${rect.y}% + ${rect.h / 2}%)`,
          transform: 'translate(-50%, -50%)',
          fontSize: w * 0.05,
          zIndex: 46,
        }}
      >
        ✅
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="glow-pulse absolute rounded-2xl border-[3px] border-white"
      style={{
        left: `calc(${rect.x}% + ${rect.w / 2}% - ${wExpr} / 2)`,
        top: `calc(${rect.y}% + ${rect.h / 2}% - ${hExpr} / 2)`,
        width: wExpr,
        height: hExpr,
        background: 'rgba(255,255,255,0.14)',
        zIndex: 45,
      }}
    >
      {showHint && (
        <span
          className="finger-bounce absolute left-1/2 top-1/2 select-none"
          style={{ fontSize: w * (strong ? 0.065 : 0.045), marginTop: '-0.45em', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))' }}
        >
          👆
        </span>
      )}
      <span
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 font-extrabold text-ink shadow"
        style={{ bottom: '-0.2em', fontSize: Math.max(11, w * 0.017), border: '2px solid #2b2350' }}
      >
        {label}
      </span>
    </button>
  );
}
