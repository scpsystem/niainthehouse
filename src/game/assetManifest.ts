import type { OutfitId } from './types';

/** Laluan aset relatif kepada `base` Vite (sesuai untuk GitHub Pages). */
const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`;

export const BG = {
  bilikBersepah: asset('bg/bilik-bersepah.webp'), // katil bersepah
  bilikKemas: asset('bg/bilik-kemas.webp'), // katil kemas
  almari: asset('bg/almari.webp'),
  bilikAir: asset('bg/bilik-air.webp'),
  sinki: asset('bg/sinki.webp'),
  // Fasa seterusnya
  dapurDepan: asset('bg/dapur-depan.webp'),
  dapurAtas: asset('bg/dapur-atas.webp'),
  atasMeja: asset('bg/atas-meja.webp'),
  notaIbu: asset('bg/nota-ibu.webp'),
  halaman: asset('bg/halaman.webp'),
  ruangBersepah: asset('bg/ruang-bersepah.webp'),
  ruangKemas: asset('bg/ruang-kemas.webp'),
  ruangBelajar: asset('bg/ruang-belajar.webp'),
} as const;

export const NIA = {
  stand: {
    asal: asset('nia/stand-asal.webp'),
    pink: asset('nia/stand-pink.webp'),
    tidur: asset('nia/stand-tidur.webp'),
  } as Record<OutfitId, string>,
  sleep: asset('nia/sleep.webp'),
  sit: asset('nia/sit.webp'),
  sitTop: asset('nia/sit-top.webp'),
  brushCloseup: asset('nia/brush-closeup.webp'),
  face: asset('nia/face.webp'),
} as const;

export const ITEMS = {
  bajuCantik: asset('items/baju-cantik.webp'),
  bajuTidur: asset('items/baju-tidur.webp'),
  tshirtUngu: asset('items/tshirt-ungu.webp'),
  bajuLain: asset('items/baju-lain.webp'), // belum ada versi Nia memakainya
  bakulBajuKotor: asset('items/bakul-baju-kotor.webp'),
  sikat: asset('items/sikat.webp'),
} as const;

/** Nisbah lebar/tinggi sprite (lihat tools/prepare_assets.py). */
export const NIA_STAND_ASPECT = 306 / 760;
export const NIA_SLEEP_ASPECT = 900 / 346;

/** Aset yang dimuat dahulu sebelum permainan bermula (Fasa 1). */
export const PRELOAD_PHASE1: string[] = [
  BG.bilikBersepah,
  BG.bilikKemas,
  BG.almari,
  BG.bilikAir,
  BG.sinki,
  NIA.stand.asal,
  NIA.stand.pink,
  NIA.stand.tidur,
  NIA.sleep,
  NIA.brushCloseup,
  NIA.face,
  ITEMS.bajuCantik,
  ITEMS.bajuTidur,
  ITEMS.tshirtUngu,
];

export function preloadImages(urls: string[], onProgress?: (done: number, total: number) => void): Promise<void> {
  let done = 0;
  return Promise.all(
    urls.map(
      (u) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          const fin = () => {
            done += 1;
            onProgress?.(done, urls.length);
            resolve();
          };
          img.onload = fin;
          img.onerror = fin; // jangan sekat permainan jika satu gambar gagal
          img.src = u;
        }),
    ),
  ).then(() => undefined);
}
