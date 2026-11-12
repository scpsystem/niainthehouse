import { useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { MainMenu } from './components/MainMenu';
import { PRELOAD_PHASE1, preloadImages } from './game/assetManifest';
import { cancelSpeech } from './game/speech';
import { loadSave, writeSave } from './game/storage';
import type { SaveData } from './game/types';

type Screen = { name: 'menu' } | { name: 'loading'; pct: number; save: SaveData } | { name: 'game'; save: SaveData; key: number };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'menu' });
  const [save, setSave] = useState<SaveData | null>(() => loadSave());

  const begin = (s: SaveData) => {
    setScreen({ name: 'loading', pct: 0, save: s });
    void preloadImages(PRELOAD_PHASE1, (d, t) => setScreen({ name: 'loading', pct: Math.round((d / t) * 100), save: s })).then(() =>
      setScreen({ name: 'game', save: s, key: Date.now() }),
    );
  };

  const newGame = (name: string) => {
    const fresh = { name, chapter: 'bangun' as const, stars: 0, outfit: 'asal' as const };
    writeSave(fresh);
    const s = loadSave();
    setSave(s);
    begin(s ?? { ...fresh, updatedAt: Date.now() });
  };

  const toMenu = () => {
    cancelSpeech();
    setSave(loadSave());
    setScreen({ name: 'menu' });
  };

  if (screen.name === 'loading') {
    return (
      <div className="pastel-bg flex h-full flex-col items-center justify-center gap-3">
        <div className="menu-bob text-6xl">🏠</div>
        <p className="m-0 text-2xl font-extrabold">Menyediakan rumah Nia…</p>
        <div className="h-5 w-64 overflow-hidden rounded-full border-4 border-ink bg-white">
          <div className="h-full bg-[#17754a] transition-all" style={{ width: `${screen.pct}%` }} />
        </div>
      </div>
    );
  }

  if (screen.name === 'game') {
    return (
      <GameScreen
        key={screen.key}
        save={screen.save}
        onExit={toMenu}
        onNewGame={() => newGame(screen.save.name)}
      />
    );
  }

  return <MainMenu save={save} onStart={newGame} onContinue={() => save && begin(save)} />;
}
