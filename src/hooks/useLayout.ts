import { RefObject, useEffect, useLayoutEffect, useState } from 'react';
import type { StageSize } from '../components/StageContext';

/** Muatkan ruang 16:9 sebesar mungkin di dalam elemen pembungkus. */
export function useStageFit(ref: RefObject<HTMLElement>): StageSize {
  const [size, setSize] = useState<StageSize>({ w: 640, h: 360 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = (cw: number, ch: number) => {
      const w = Math.max(160, Math.floor(Math.min(cw, (ch * 16) / 9)));
      setSize((s) => (s.w === w ? s : { w, h: Math.round((w * 9) / 16) }));
    };
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      fit(r.width, r.height);
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    fit(r.width, r.height);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export type LayoutMode = 'bottom' | 'side';

/** Telefon mendatar (ketinggian rendah) -> panel dialog di sebelah kanan supaya ruang permainan tidak kecil. */
export function useLayoutMode(): { mode: LayoutMode; portraitPhone: boolean } {
  const calc = () => ({
    mode: (window.innerWidth > window.innerHeight && window.innerHeight <= 520 ? 'side' : 'bottom') as LayoutMode,
    portraitPhone: window.innerHeight > window.innerWidth && window.innerWidth < 600,
  });
  const [v, setV] = useState(calc);
  useEffect(() => {
    const on = () => setV(calc());
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
    };
  }, []);
  return v;
}
