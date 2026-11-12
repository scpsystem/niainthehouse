import { createContext, useContext } from 'react';

export interface StageSize {
  w: number;
  h: number;
}

/** Saiz piksel sebenar ruang permainan 16:9 (digunakan untuk saiz sprite). */
export const StageContext = createContext<StageSize>({ w: 960, h: 540 });
export const useStage = () => useContext(StageContext);

/** Elemen DOM di panel bawah/tepi tempat aktiviti boleh memaparkan kawalan (melalui portal). */
export const PanelSlotContext = createContext<HTMLElement | null>(null);
export const usePanelSlot = () => useContext(PanelSlotContext);
