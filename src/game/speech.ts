import { useSyncExternalStore } from 'react';

/**
 * Web Speech API — hanya suara Bahasa Melayu (ms-MY).
 * Jika peranti tiada suara Melayu, TIADA suara bahasa lain digunakan secara senyap;
 * teks kekal dipaparkan dan pemain dimaklumkan.
 */
export type SpeechStatus = 'unknown' | 'ok' | 'unavailable';

let status: SpeechStatus = 'unknown';
let enabled = true;
let voice: SpeechSynthesisVoice | null = null;
const listeners = new Set<() => void>();

const synth = (): SpeechSynthesis | null =>
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

const norm = (l: string) => l.toLowerCase().replace('_', '-');

function setStatus(s: SpeechStatus) {
  if (s === status) return;
  status = s;
  listeners.forEach((l) => l());
}

function refreshVoices() {
  const s = synth();
  if (!s) return;
  const vs = s.getVoices();
  if (!vs.length) return; // senarai belum dimuat; cuba lagi nanti
  voice = vs.find((v) => norm(v.lang) === 'ms-my') ?? vs.find((v) => norm(v.lang).startsWith('ms')) ?? null;
  setStatus(voice ? 'ok' : 'unavailable');
}

export function initSpeech() {
  const s = synth();
  if (!s) {
    setStatus('unavailable');
    return;
  }
  refreshVoices();
  s.addEventListener?.('voiceschanged', refreshVoices);
  // Sesetengah pelayar tidak menghantar voiceschanged: semak semula sebentar lagi.
  window.setTimeout(refreshVoices, 500);
  window.setTimeout(refreshVoices, 1500);
}

const stripForSpeech = (t: string) =>
  t
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

export function speak(text: string, onEnd?: () => void) {
  const s = synth();
  cancelSpeech();
  if (!s || !enabled || status === 'unavailable') {
    onEnd?.();
    return;
  }
  const u = new SpeechSynthesisUtterance(stripForSpeech(text));
  u.lang = 'ms-MY';
  if (voice) u.voice = voice;
  u.rate = 0.85;
  u.pitch = 1.1;
  u.onend = () => onEnd?.();
  u.onerror = (e) => {
    if (e.error === 'language-unavailable' || e.error === 'voice-unavailable') setStatus('unavailable');
    onEnd?.();
  };
  s.speak(u);
}

export function cancelSpeech() {
  synth()?.cancel();
}

export function setSpeechEnabled(on: boolean) {
  enabled = on;
  if (!on) cancelSpeech();
}

export function isSpeechEnabled() {
  return enabled;
}

export function useSpeechStatus(): SpeechStatus {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
    () => 'unknown' as SpeechStatus,
  );
}
