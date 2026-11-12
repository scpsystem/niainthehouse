import { NIA, NIA_SLEEP_ASPECT, NIA_STAND_ASPECT } from '../game/assetManifest';
import type { NiaFx, NiaView, OutfitId } from '../game/types';
import { useStage } from './StageContext';

function Fx({ fx, w, h }: { fx: NiaFx; w: number; h: number }) {
  if (fx === 'poof') {
    return (
      <>
        {[
          [20, 18],
          [70, 16],
          [45, 38],
          [25, 62],
          [68, 60],
          [48, 82],
        ].map(([l, t], i) => (
          <span
            key={i}
            className="fx-puff absolute rounded-full"
            style={{
              left: `${l}%`,
              top: `${t}%`,
              width: w * 0.9,
              height: w * 0.9,
              marginLeft: -w * 0.45,
              marginTop: -w * 0.45,
              background: 'radial-gradient(circle, #fff 30%, rgba(255,255,255,.55) 65%, transparent 72%)',
              animationDelay: `${i * 0.06}s`,
              zIndex: 5,
            }}
          />
        ))}
        {['✨', '⭐', '✨'].map((e, i) => (
          <span
            key={e + i}
            className="fx-twinkle absolute"
            style={{ left: `${10 + i * 38}%`, top: `${5 + (i % 2) * 40}%`, fontSize: w * 0.5, animationDelay: `${i * 0.2}s` }}
          >
            {e}
          </span>
        ))}
      </>
    );
  }
  if (fx === 'hungry') {
    return (
      <>
        <span
          className="absolute rounded-full border-4 bg-white text-center shadow"
          style={{
            left: '58%',
            top: -h * 0.02,
            fontSize: w * 0.62,
            padding: `${w * 0.05}px ${w * 0.18}px`,
            borderColor: '#2b2350',
          }}
        >
          🍽️
        </span>
        <span
          className="absolute font-extrabold"
          style={{ left: '-30%', top: '48%', fontSize: w * 0.42, color: '#8a2d00', whiteSpace: 'nowrap' }}
        >
          grrr…
        </span>
      </>
    );
  }
  if (fx === 'sparkle') {
    return (
      <>
        {['✨', '✨', '⭐', '✨'].map((e, i) => (
          <span
            key={i}
            className="fx-twinkle absolute"
            style={{
              left: `${[-10, 85, 5, 78][i]}%`,
              top: `${[10, 22, 52, 62][i]}%`,
              fontSize: w * 0.55,
              animationDelay: `${i * 0.25}s`,
            }}
          >
            {e}
          </span>
        ))}
      </>
    );
  }
  return null;
}

export function NiaCharacter({ view, outfit }: { view: NiaView; outfit: OutfitId }) {
  const stage = useStage();
  if (view.pose === 'hidden') return null;

  const sleeping = view.pose === 'sleep';
  const hpx = view.h * stage.h;
  const wpx = hpx * (sleeping ? NIA_SLEEP_ASPECT : NIA_STAND_ASPECT);
  const src = sleeping ? NIA.sleep : NIA.stand[outfit];

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${view.x}%`,
        top: `${view.y}%`,
        width: wpx,
        height: hpx,
        transform: 'translate(-50%, -100%)',
        transition: view.moveMs > 0 ? `left ${view.moveMs}ms ease-in-out, top ${view.moveMs}ms ease-in-out` : 'none',
        zIndex: view.silhouette ? 35 : 20,
        willChange: 'left, top',
      }}
    >
      <div
        className={`nia-anim nia-${view.anim === 'none' ? 'idle' : view.anim}`}
        style={{
          width: '100%',
          height: '100%',
          filter: view.silhouette ? 'brightness(0) opacity(0.28) blur(2px)' : 'drop-shadow(0 4px 3px rgba(43,35,80,.25))',
        }}
      >
        <img src={src} alt="Nia" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      {!view.silhouette && <Fx fx={view.fx} w={wpx} h={hpx} />}
    </div>
  );
}
