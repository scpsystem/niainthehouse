import type { ReactNode } from 'react';
import { CURTAIN_CLIP, SCENES } from '../game/scenes';
import type { Camera, NiaView, OutfitId, SceneId } from '../game/types';
import { NiaCharacter } from './NiaCharacter';

interface Props {
  scene: SceneId;
  nia: NiaView;
  outfit: OutfitId;
  camera: Camera;
  /** Tirai mandi di hadapan Nia. */
  fgOn: boolean;
  /** Tabir pudar semasa bertukar babak. */
  veil: boolean;
  children?: ReactNode;
}

/**
 * Melukis latar, Nia dan lapisan interaktif. Semua kedudukan ialah peratus,
 * jadi ia kekal betul pada sebarang saiz skrin. "Kamera" ialah zoom CSS pada seluruh lapisan.
 */
export function SceneRenderer({ scene, nia, outfit, camera, fgOn, veil, children }: Props) {
  const def = SCENES[scene];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#cfe0ff' }}>
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${camera.z})`,
          transformOrigin: `${camera.ox}% ${camera.oy}%`,
          transition: camera.ms > 0 ? `transform ${camera.ms}ms ease-in-out` : 'none',
        }}
      >
        <img
          key={def.bg}
          src={def.bg}
          alt={def.label}
          draggable={false}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
        />
        <NiaCharacter view={nia} outfit={outfit} />
        {scene === 'bathroom' && fgOn && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              zIndex: 30,
              backgroundImage: `url(${def.bg})`,
              backgroundSize: '100% 100%',
              clipPath: CURTAIN_CLIP,
            }}
          />
        )}
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: '#fff3fb', opacity: veil ? 1 : 0, transition: 'opacity 0.4s ease', zIndex: 80 }}
      />
    </div>
  );
}
