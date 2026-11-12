import { ITEMS } from '../game/assetManifest';
import { OUTFITS } from '../game/scenes';
import type { OutfitId } from '../game/types';

/**
 * Susunan sengaja tidak mengikut "jawapan": baju tidur di tengah.
 * Hanya pakaian yang ada gambar Nia memakainya disenaraikan, supaya pertukaran visual benar-benar berlaku.
 */
const OPTIONS: { id: OutfitId; img: string }[] = [
  { id: 'pink', img: ITEMS.bajuCantik },
  { id: 'tidur', img: ITEMS.bajuTidur },
  { id: 'asal', img: ITEMS.tshirtUngu },
];

export function OutfitSelector({ onPick }: { onPick: (id: OutfitId) => void }) {
  return (
    <div className="slide-up grid grid-cols-3 gap-2" role="group" aria-label="Pilih pakaian">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onPick(o.id)}
          className="btn btn-white flex-col !gap-1 !px-2 !py-2"
        >
          <img
            src={o.img}
            alt={OUTFITS[o.id].label}
            draggable={false}
            style={{ height: 'clamp(54px, 11vh, 110px)', maxWidth: '100%', objectFit: 'contain' }}
          />
          <span style={{ fontSize: 'clamp(0.95rem, 2vw, 1.3rem)' }}>{OUTFITS[o.id].label}</span>
        </button>
      ))}
    </div>
  );
}
