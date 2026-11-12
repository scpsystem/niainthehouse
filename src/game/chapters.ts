import type { ChapterId, Step } from './types';

/**
 * Skrip berstruktur untuk setiap bab. Enjin (useGameEngine) menjalankan
 * langkah demi langkah: dialog -> pilihan -> pergerakan -> aktiviti -> perubahan persekitaran.
 * Teks boleh menggunakan {nama} untuk nama panggilan pemain.
 */

// Kedudukan penting (peratus ruang permainan)
const BEDROOM_MESSY_STAND = { x: 92, y: 99, h: 0.5 };
const TIDY_FLOOR = { y: 96, h: 0.46 };
const BATH = { y: 97, h: 0.5, sinkX: 30, tubHideX: 69, tubHideY: 84 };

export const CHAPTERS: Record<ChapterId, Step[]> = {
  // ───────────────────────── Bab 1: Bangun pagi + kemas katil ─────────────────────────
  bangun: [
    { t: 'scene', scene: 'bedroomMessy', nia: { pose: 'sleep', x: 42, y: 62, h: 0.25 } },
    { t: 'wait', ms: 2200 },
    { t: 'nia', patch: { pose: 'stand', ...BEDROOM_MESSY_STAND, fx: null, anim: 'pop' }, wait: 900 },
    { t: 'say', text: 'Selamat pagi! Saya baru bangun tidur. Wah, hari dah cerah!', emotion: 'happy' },
    { t: 'say', text: 'Hai {nama}! Saya Nia! Boleh awak bantu saya hari ini?', emotion: 'happy' },
    {
      t: 'ask',
      text: 'Hmm, katil saya masih bersepah. Apa yang patut saya buat?',
      emotion: 'think',
      choices: [
        {
          label: 'Kemas katil',
          icon: '🛏️',
          correct: true,
          reply: 'Betul! Jom bantu saya kemaskan katil!',
        },
        {
          label: 'Pergi bermain',
          icon: '🧸',
          hint: 'Bermain seronok, tapi katil masih bersepah. Kita kemas katil dahulu, ya!',
        },
        {
          label: 'Tidur semula',
          icon: '😴',
          hint: 'Tidur semula? Hari dah cerah! Cuba pilih sesuatu yang membantu bilik jadi kemas.',
        },
      ],
    },
    { t: 'activity', id: 'makeBed' },
    { t: 'stars', n: 1 },
    { t: 'scene', scene: 'bedroomTidy', nia: { pose: 'stand', x: 45, y: TIDY_FLOOR.y, h: TIDY_FLOOR.h, anim: 'idle' } },
    { t: 'nia', patch: { anim: 'happy' }, wait: 1000 },
    { t: 'say', text: 'Yeay! Katil saya dah kemas. Terima kasih, {nama}!', emotion: 'happy' },
    { t: 'say', text: 'Sekarang saya nak ke bilik air untuk bersihkan diri.', emotion: 'neutral' },
    { t: 'move', x: 112, ms: 3000 },
    { t: 'chapterEnd', next: 'bersih' },
  ],

  // ───────────────────────── Bab 2: Kebersihan diri ─────────────────────────
  bersih: [
    { t: 'scene', scene: 'bathroom', nia: { pose: 'stand', x: -10, y: BATH.y, h: BATH.h, anim: 'idle' } },
    { t: 'move', x: BATH.sinkX, ms: 2400 },
    {
      t: 'ask',
      text: 'Sekarang saya nak bersihkan diri. Apa yang perlu saya buat dahulu?',
      emotion: 'think',
      choices: [
        {
          label: 'Gosok gigi',
          icon: '🪥',
          correct: true,
          reply: 'Betul! Selepas bangun tidur, kita gosok gigi dahulu. Jom!',
        },
        {
          label: 'Mandi',
          icon: '🚿',
          hint: 'Kita akan mandi nanti. Tapi mulut kita pun perlu dibersihkan dahulu. Cuba lagi!',
        },
        {
          label: 'Bermain air',
          icon: '💦',
          hint: 'Bermain air seronok, tapi sekarang kita perlu jaga kebersihan diri. Apa yang kita buat pada gigi?',
        },
      ],
    },
    { t: 'scene', scene: 'sinkClose', nia: { pose: 'hidden' } },
    { t: 'say', text: 'Saya perlu gosok gigi langkah demi langkah. Boleh awak susunkan langkahnya?', emotion: 'think' },
    { t: 'activity', id: 'brushTeeth' },
    { t: 'stars', n: 1 },
    {
      t: 'scene',
      scene: 'bathroom',
      nia: { pose: 'stand', x: BATH.sinkX, y: BATH.y, h: BATH.h, anim: 'happy' },
      camera: { z: 1.9, ox: 24, oy: 66, ms: 0 },
    },
    { t: 'say', text: 'Yeay! Gigi saya dah bersih! Sekarang saya nak basuh muka.', emotion: 'happy' },
    { t: 'activity', id: 'washFace' },
    { t: 'stars', n: 1 },
    { t: 'camera', camera: { z: 1, ox: 50, oy: 50, ms: 900 } },
    { t: 'say', text: 'Muka saya dah segar! Sekarang masa untuk mandi.', emotion: 'happy' },
    { t: 'move', x: 56, ms: 2600 },
    { t: 'fg', on: true },
    { t: 'move', x: BATH.tubHideX, y: BATH.tubHideY, ms: 1000 },
    { t: 'nia', patch: { silhouette: true, anim: 'idle' } },
    { t: 'say', text: 'Saya dah berada di ruang mandi. Tolong buka pancuran air untuk saya, ya!', emotion: 'neutral' },
    { t: 'activity', id: 'shower' },
    { t: 'nia', patch: { silhouette: false } },
    { t: 'fg', on: false },
    { t: 'move', x: 56, y: BATH.y, ms: 1000 },
    { t: 'nia', patch: { anim: 'happy', fx: 'sparkle' }, wait: 1200 },
    { t: 'stars', n: 1 },
    { t: 'say', text: 'Wah, sekarang saya dah bersih!', emotion: 'happy' },
    { t: 'say', text: 'Jom ke bilik untuk pilih baju bersih.', emotion: 'neutral' },
    { t: 'nia', patch: { fx: null } },
    { t: 'chapterEnd', next: 'pakaian' },
  ],

  // ───────────────────────── Bab 3: Memilih pakaian ─────────────────────────
  pakaian: [
    { t: 'scene', scene: 'bedroomTidy', nia: { pose: 'stand', x: -10, y: TIDY_FLOOR.y, h: TIDY_FLOOR.h, anim: 'idle' } },
    { t: 'move', x: 72, ms: 3000 },
    {
      t: 'say',
      text: 'Saya dah mandi! Sekarang saya nak pakai baju yang bersih. Boleh awak bantu saya pilih?',
      emotion: 'happy',
    },
    {
      t: 'tap',
      prompt: 'Tekan almari untuk melihat baju.',
      targets: [{ id: 'almari', rect: { x: 84, y: 8, w: 16, h: 76 }, label: 'Almari' }],
    },
    { t: 'scene', scene: 'wardrobe', nia: { pose: 'hidden' } },
    { t: 'outfit', prompt: 'Wah, banyak baju! Pilih baju yang bersih dan sesuai untuk waktu pagi.', accept: ['asal', 'pink'] },
    {
      t: 'scene',
      scene: 'bedroomTidy',
      nia: { pose: 'stand', x: 72, y: TIDY_FLOOR.y, h: TIDY_FLOOR.h, anim: 'idle' },
    },
    { t: 'applyOutfit' },
    { t: 'stars', n: 1 },
    { t: 'say', text: 'Yeay! Saya dah siap!', emotion: 'happy' },
    { t: 'nia', patch: { anim: 'hungry', fx: 'hungry' } },
    { t: 'say', text: 'Saya rasa lapar la...', emotion: 'hungry' },
    { t: 'chapterEnd', next: 'fasa1Tamat' },
  ],

  // ───────────────────────── Penutup Fasa 1 ─────────────────────────
  fasa1Tamat: [{ t: 'end' }],
};

export const CHAPTER_TITLES: Record<ChapterId, string> = {
  bangun: 'Bangun Pagi',
  bersih: 'Kebersihan Diri',
  pakaian: 'Memilih Pakaian',
  fasa1Tamat: 'Tamat Fasa 1',
};

export const CHAPTER_ORDER: ChapterId[] = ['bangun', 'bersih', 'pakaian'];
