import { BG } from './assetManifest';
import type { Camera, NiaView, OutfitId, SceneId } from './types';

export interface SceneDef {
  bg: string;
  label: string;
}

export const SCENES: Record<SceneId, SceneDef> = {
  bedroomMessy: { bg: BG.bilikBersepah, label: 'Bilik Tidur' },
  bedroomTidy: { bg: BG.bilikKemas, label: 'Bilik Tidur' },
  bathroom: { bg: BG.bilikAir, label: 'Bilik Air' },
  sinkClose: { bg: BG.sinki, label: 'Sinki' },
  wardrobe: { bg: BG.almari, label: 'Almari Pakaian' },
};

/** Lapisan depan (klon latar yang dipotong) supaya Nia boleh berada "di belakang" tirai mandi. */
export const CURTAIN_CLIP = 'inset(10% 20% 12% 60%)';

export const DEFAULT_NIA: NiaView = {
  x: 50,
  y: 96,
  h: 0.5,
  pose: 'hidden',
  anim: 'idle',
  moveMs: 0,
  fx: null,
  silhouette: false,
};

export const CAM_DEFAULT: Camera = { z: 1, ox: 50, oy: 50, ms: 900 };

export interface OutfitDef {
  id: OutfitId;
  label: string;
  /** Respons Nia apabila memilih pakaian ini. */
  reply: string;
  /** Petunjuk jika pakaian tidak sesuai untuk pagi hari. */
  hint?: string;
}

export const OUTFITS: Record<OutfitId, OutfitDef> = {
  asal: {
    id: 'asal',
    label: 'T-shirt ungu',
    reply: 'T-shirt ungu! Ini baju kegemaran saya. Terima kasih, pilihan yang bagus!',
  },
  pink: {
    id: 'pink',
    label: 'Baju cantik',
    reply: 'Wah, baju cantik warna merah jambu! Saya suka. Terima kasih!',
  },
  tidur: {
    id: 'tidur',
    label: 'Baju tidur',
    reply: 'Baju tidur untuk waktu malam.',
    hint: 'Hmm, itu baju tidur. Sekarang waktu pagi, jadi saya nak pakai baju untuk buat aktiviti. Cuba pilih baju lain!',
  },
};

export const PRAISE = [
  'Betul! Pandainya awak!',
  'Hebat! Awak memang pembantu terbaik!',
  'Yeay! Tepat sekali!',
];

export const RETRY = [
  'Oops, cuba fikir sekali lagi. Saya yakin awak boleh!',
  'Hampir! Cuba lagi, ya!',
  'Tak apa, kita cuba sekali lagi!',
];
