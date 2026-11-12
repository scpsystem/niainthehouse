import type { ActivityCtx, ActivityId } from '../game/types';
import { BrushTeeth } from './BrushTeeth';
import { MakeBed } from './MakeBed';
import { Shower } from './Shower';
import { WashFace } from './WashFace';

/** Pendaftar aktiviti. Aktiviti baharu (CookingGame, CleaningGame, ...) didaftar di sini. */
export function ActivityHost({ id, ctx }: { id: ActivityId; ctx: ActivityCtx }) {
  switch (id) {
    case 'makeBed':
      return <MakeBed ctx={ctx} />;
    case 'brushTeeth':
      return <BrushTeeth ctx={ctx} />;
    case 'washFace':
      return <WashFace ctx={ctx} />;
    case 'shower':
      return <Shower ctx={ctx} />;
  }
}
