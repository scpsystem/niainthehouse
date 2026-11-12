/** Bunyi ringkas dijana dengan WebAudio (tiada fail audio tambahan diperlukan). */
let ctx: AudioContext | null = null;
let on = true;

function ac(): AudioContext | null {
  if (!on) return null;
  if (!ctx) {
    const C =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t0 = c.currentTime + at;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(at: number, dur: number, vol = 0.08) {
  const c = ac();
  if (!c) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 1800;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(c.destination);
  s.start(c.currentTime + at);
}

export const sfx = {
  setEnabled(v: boolean) {
    on = v;
  },
  unlock() {
    ac();
  },
  tap: () => tone(620, 0, 0.09, 'triangle', 0.1),
  correct() {
    tone(523, 0, 0.14, 'triangle');
    tone(659, 0.1, 0.14, 'triangle');
    tone(784, 0.2, 0.22, 'triangle');
  },
  wrong() {
    tone(260, 0, 0.18, 'sine', 0.1);
    tone(220, 0.14, 0.22, 'sine', 0.08);
  },
  star() {
    [880, 1175, 1568].forEach((f, i) => tone(f, i * 0.09, 0.2, 'sine', 0.1));
  },
  pop: () => tone(400, 0, 0.12, 'square', 0.05),
  swoosh: () => noise(0, 0.25, 0.06),
  splash: () => noise(0, 0.35, 0.09),
  alarm() {
    [0, 0.25, 0.5].forEach((t) => tone(1046, t, 0.12, 'square', 0.04));
  },
};
