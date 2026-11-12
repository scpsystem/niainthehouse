import { NIA } from '../game/assetManifest';
import type { OutfitId } from '../game/types';

export function PhaseEnd({
  name,
  stars,
  outfit,
  onRestart,
  onMenu,
}: {
  name: string;
  stars: number;
  outfit: OutfitId;
  onRestart: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="pastel-bg absolute inset-0 z-[90] flex items-center justify-center overflow-auto p-3">
      <div className="slide-up flex max-h-full w-full max-w-3xl flex-col items-center gap-2 rounded-[2rem] border-4 border-ink bg-cream p-4 text-center shadow-2xl sm:flex-row sm:gap-6 sm:p-6">
        <img
          src={NIA.stand[outfit]}
          alt="Nia"
          draggable={false}
          className="menu-bob h-32 shrink-0 object-contain sm:h-72"
        />
        <div className="flex flex-col gap-2">
          <h2 className="m-0 text-2xl font-extrabold sm:text-4xl">🎉 Hebat, {name}!</h2>
          <p className="m-0 text-lg font-bold sm:text-xl">
            Anda sudah membantu Nia bangun tidur, mengemas katil, membersihkan diri dan memilih baju.
          </p>
          <p className="m-0 text-2xl font-extrabold">
            {'⭐'.repeat(Math.min(stars, 10))} <span className="text-lg">({stars} bintang)</span>
          </p>
          <p className="m-0 text-base font-bold text-ink/80">Nia sudah lapar! Dapur, ruang tamu dan kerja sekolah akan menyusul di fasa seterusnya.</p>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <button className="btn btn-green" onClick={onRestart}>
              🔄 Main semula
            </button>
            <button className="btn btn-white" onClick={onMenu}>
              🏠 Menu utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
