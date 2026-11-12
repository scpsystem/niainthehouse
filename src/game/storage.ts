import type { SaveData } from './types';

const KEY = 'nias-in-the-house:save:v1';

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<SaveData>;
    if (!d.name || !d.chapter) return null;
    return {
      name: String(d.name),
      chapter: d.chapter,
      stars: Number(d.stars) || 0,
      outfit: d.outfit ?? 'asal',
      updatedAt: Number(d.updatedAt) || Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeSave(d: Omit<SaveData, 'updatedAt'>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...d, updatedAt: Date.now() }));
  } catch {
    /* penyimpanan penuh / mod peribadi: permainan tetap boleh dimainkan */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}
