import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePanelSlot } from '../components/StageContext';

/** Memaparkan kawalan aktiviti di panel dialog (bukan di atas ruang permainan). */
export function PanelPortal({ children }: { children: ReactNode }) {
  const slot = usePanelSlot();
  return slot ? createPortal(children, slot) : null;
}

export interface StepChip {
  label: string;
  icon: string;
  state: 'done' | 'current' | 'locked';
}

/** Senarai langkah ringkas dengan tanda siap / semasa / belum. */
export function StepChips({ chips }: { chips: StepChip[] }) {
  return (
    <div className="slide-up flex flex-wrap gap-2" aria-label="Langkah aktiviti">
      {chips.map((c, i) => (
        <div
          key={i}
          className={`flex min-w-[120px] flex-1 items-center gap-2 rounded-2xl border-[3px] px-3 py-2 font-extrabold ${
            c.state === 'done'
              ? 'border-[#17754a] bg-[#dff6e9] text-[#0f5233]'
              : c.state === 'current'
                ? 'glow-pulse border-ink bg-[#fff3c4]'
                : 'border-ink/30 bg-white/70 text-ink/60'
          }`}
          style={{ fontSize: 'clamp(0.9rem, 1.9vw, 1.2rem)' }}
        >
          <span aria-hidden style={{ fontSize: '1.5em' }}>
            {c.state === 'done' ? '✅' : c.icon}
          </span>
          <span>
            {i + 1}. {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
