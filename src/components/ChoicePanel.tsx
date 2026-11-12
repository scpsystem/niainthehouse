import { useState } from 'react';
import type { Choice } from '../game/types';

interface Props {
  choices: Choice[];
  highlight?: number | null;
  onChoose: (i: number) => void;
}

/** Pilihan jawapan bersaiz besar. Jawapan salah menggoncang butang sahaja (tiada penalti). */
export function ChoicePanel({ choices, highlight = null, onChoose }: Props) {
  const [shake, setShake] = useState<{ i: number; k: number } | null>(null);

  return (
    <div className="slide-up flex flex-wrap gap-2" role="group" aria-label="Pilihan jawapan">
      {choices.map((c, i) => {
        const isShake = shake?.i === i;
        return (
          <button
            key={`${i}-${isShake ? shake?.k : 0}`}
            type="button"
            onClick={() => {
              if (!c.correct) setShake((s) => ({ i, k: (s?.k ?? 0) + 1 }));
              onChoose(i);
            }}
            className={`btn btn-white min-w-[130px] flex-1 flex-col !gap-0 !py-2 ${isShake ? 'shake' : ''} ${
              highlight === i ? 'glow-pulse !bg-sun' : ''
            }`}
          >
            {c.icon && (
              <span aria-hidden style={{ fontSize: 'clamp(1.6rem, 4.2vw, 2.4rem)', lineHeight: 1.1 }}>
                {c.icon}
              </span>
            )}
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
