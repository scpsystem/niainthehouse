import { NIA } from '../game/assetManifest';
import type { DialogueState, Emotion } from '../game/types';

const EMOJI: Record<Emotion, string> = {
  neutral: '🙂',
  happy: '😄',
  sad: '😢',
  hungry: '🤤',
  think: '🤔',
  sleepy: '😴',
};

interface Props {
  dialogue: DialogueState | null;
  canNext: boolean;
  onNext: () => void;
  onListen: () => void;
}

/** Kotak dialog Nia: nama, teks ringkas, butang Dengar dan Seterusnya. */
export function DialogueBox({ dialogue, canNext, onNext, onListen }: Props) {
  const emotion = dialogue?.emotion ?? 'neutral';
  return (
    <div
      className="slide-up flex items-stretch gap-3 rounded-[1.6rem] border-4 bg-white p-2 shadow-lg sm:p-3"
      style={{ borderColor: '#2b2350' }}
      role="status"
      aria-live="polite"
    >
      <div className="relative shrink-0 self-center">
        <div
          className="overflow-hidden rounded-full border-4 bg-[#efe6ff]"
          style={{ borderColor: '#6d3fc0', width: 'clamp(52px, 9vw, 84px)', height: 'clamp(52px, 9vw, 84px)' }}
        >
          <img src={NIA.face} alt="Nia" draggable={false} className="h-full w-full object-cover" />
        </div>
        <span className="absolute -bottom-1 -right-1 rounded-full bg-white text-lg leading-none shadow" style={{ padding: 2 }}>
          {EMOJI[emotion]}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="w-fit rounded-full bg-grape px-3 text-sm font-extrabold text-white sm:text-base">Nia</span>
        <p
          className="m-0 font-bold leading-snug"
          style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.55rem)', minHeight: '2.6em', color: '#2b2350' }}
        >
          {dialogue?.text ?? '…'}
        </p>
      </div>

      <div className="flex shrink-0 flex-col justify-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-white"
          onClick={onListen}
          aria-label="Dengar semula"
          disabled={!dialogue}
        >
          🔊<span className="hidden sm:inline">Dengar</span>
        </button>
        {canNext && (
          <button type="button" className="btn btn-sm btn-green" onClick={onNext} autoFocus>
            Seterusnya ▶
          </button>
        )}
      </div>
    </div>
  );
}
