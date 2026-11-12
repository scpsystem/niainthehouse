# Nia's in the House — Jom Bantu Nia Berdikari!

Permainan pendidikan 2D (React + TypeScript + Vite + Tailwind) untuk MBPK masalah pembelajaran, 7–9 tahun.

## Jalankan
```bash
npm install
npm run dev      # pembangunan
npm run build    # bina ke dist/
```

## Deploy ke GitHub Pages
1. Cipta repo di GitHub dan tolak (push) kod ke cabang `main`.
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Setiap push akan membina dan menerbitkan permainan (`.github/workflows/deploy.yml`).
`vite.config.ts` menggunakan `base: './'`, jadi nama repo tidak perlu ditetapkan.

## Struktur
- `src/game/chapters.ts` — skrip bab (dialog, pilihan, pergerakan, aktiviti). **Tambah babak baharu di sini.**
- `src/hooks/useGameEngine.ts` — mesin keadaan yang menjalankan skrip.
- `src/activities/` — aktiviti interaktif (MakeBed, BrushTeeth, WashFace, Shower).
- `src/game/assetManifest.ts` — semua laluan aset. Aset di `public/assets/`.
- `tools/prepare_assets.py` — menjana aset WebP daripada OBJECT.zip.

## Fasa 1 (siap)
Menu, nama, dialog + suara ms-MY, bangun pagi, kemas katil, gosok gigi (susun urutan + animasi), basuh muka, mandi (di belakang tirai), pilih pakaian (tukar sprite sebenar), simpan kemajuan.
