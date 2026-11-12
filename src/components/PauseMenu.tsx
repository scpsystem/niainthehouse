export function PauseMenu({
  onResume,
  onRestart,
  onMenu,
}: {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Jeda"
    >
      <div className="slide-up flex w-full max-w-sm flex-col gap-3 rounded-[2rem] border-4 border-ink bg-cream p-5 text-center shadow-2xl">
        <h2 className="m-0 text-3xl font-extrabold">⏸ Jeda</h2>
        <button className="btn btn-green" onClick={onResume} autoFocus>
          ▶ Sambung bermain
        </button>
        <button className="btn btn-sun" onClick={onRestart}>
          🔄 Ulang bab ini
        </button>
        <button className="btn btn-white" onClick={onMenu}>
          🏠 Menu utama
        </button>
        <p className="m-0 text-sm font-bold text-ink/70">Kemajuan disimpan setiap kali satu bab selesai.</p>
      </div>
    </div>
  );
}
