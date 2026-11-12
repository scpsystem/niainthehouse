import { useState } from 'react';
import { BG, NIA } from '../game/assetManifest';
import { sfx } from '../game/sfx';
import { useSpeechStatus } from '../game/speech';
import type { SaveData } from '../game/types';

interface Props {
  save: SaveData | null;
  onStart: (name: string) => void;
  onContinue: () => void;
}

function Modal({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center overflow-auto bg-ink/60 p-3"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <div
        className="slide-up max-h-full w-full max-w-lg overflow-auto rounded-[2rem] border-4 border-ink bg-cream p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function MainMenu({ save, onStart, onContinue }: Props) {
  const [modal, setModal] = useState<null | 'name' | 'how'>(null);
  const [name, setName] = useState('');
  const speech = useSpeechStatus();
  const clean = name.trim().slice(0, 14);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img src={BG.halaman} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-white/25" />

      <div className="relative flex h-full flex-col items-center justify-center gap-2 overflow-auto p-3 sm:flex-row sm:gap-8">
        <img
          src={NIA.stand.asal}
          alt="Nia"
          draggable={false}
          className="menu-bob order-2 h-[28dvh] shrink-0 object-contain drop-shadow-xl sm:order-1 sm:h-[70dvh]"
        />
        <div className="order-1 flex flex-col items-center gap-2 text-center sm:order-2">
          <div className="rounded-[2rem] border-4 border-ink bg-cream/95 px-5 py-3 shadow-xl">
            <h1
              className="m-0 font-extrabold leading-none text-grape-dark"
              style={{ fontSize: 'clamp(2rem, 7vw, 4.2rem)', textShadow: '0 3px 0 #fff' }}
            >
              NIA'S IN THE HOUSE
            </h1>
            <p className="m-0 mt-1 font-extrabold text-ink" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.9rem)' }}>
              Jom Bantu Nia Berdikari!
            </p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <button
              className="btn btn-green"
              onClick={() => {
                sfx.unlock();
                setModal('name');
              }}
            >
              ▶ Mula Bermain
            </button>
            <button className="btn btn-sun" onClick={() => setModal('how')}>
              ❓ Cara Bermain
            </button>
            <button
              className="btn btn-primary"
              disabled={!save}
              onClick={() => {
                sfx.unlock();
                onContinue();
              }}
            >
              ⏩ Sambung Permainan
            </button>
            {save && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold">
                Simpanan: {save.name} · ⭐ {save.stars}
              </span>
            )}
          </div>
        </div>
      </div>

      {modal === 'name' && (
        <Modal label="Nama panggilan" onClose={() => setModal(null)}>
          <h2 className="m-0 mb-2 text-center text-2xl font-extrabold">Siapa nama panggilan awak?</h2>
          <p className="m-0 mb-3 text-center font-bold">Nama ini akan ada pada sijil nanti.</p>
          <input
            autoFocus
            value={name}
            maxLength={14}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && clean && onStart(clean)}
            placeholder="Taip nama di sini"
            aria-label="Nama panggilan"
            className="w-full rounded-2xl border-4 border-ink bg-white px-4 py-3 text-center text-2xl font-extrabold"
            style={{ userSelect: 'text' }}
          />
          {save && <p className="m-0 mt-2 text-center text-sm font-bold text-ink/70">Permainan baharu akan menggantikan simpanan lama.</p>}
          <div className="mt-4 flex gap-2">
            <button className="btn btn-white flex-1" onClick={() => setModal(null)}>
              Batal
            </button>
            <button className="btn btn-green flex-1" disabled={!clean} onClick={() => onStart(clean)}>
              Mula! ▶
            </button>
          </div>
        </Modal>
      )}

      {modal === 'how' && (
        <Modal label="Cara bermain" onClose={() => setModal(null)}>
          <h2 className="m-0 mb-3 text-center text-2xl font-extrabold">Cara Bermain</h2>
          <ol className="m-0 flex list-none flex-col gap-2 p-0 text-lg font-bold">
            <li>👧 Awak ialah pembantu Nia. Dengar dan baca apa yang Nia cakap.</li>
            <li>▶ Tekan <b>Seterusnya</b> untuk teruskan.</li>
            <li>👆 Tekan benda yang <b>bersinar</b> untuk membantu Nia.</li>
            <li>✅ Pilih jawapan yang betul. Kalau salah, Nia beri petunjuk. Cuba lagi, tiada hukuman!</li>
            <li>⭐ Kumpul bintang di setiap aktiviti.</li>
            <li>🔊 Tekan <b>Dengar</b> untuk mendengar Nia bercakap.</li>
          </ol>
          {speech === 'unavailable' && (
            <p className="mt-3 rounded-xl bg-[#fff3c4] p-2 text-sm font-bold">
              Peranti ini tiada suara Bahasa Melayu, jadi Nia tidak akan bersuara. Teks masih dipaparkan.
            </p>
          )}
          <button className="btn btn-green mt-4 w-full" onClick={() => setModal(null)}>
            Faham!
          </button>
        </Modal>
      )}
    </div>
  );
}
