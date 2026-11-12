import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' supaya boleh dideploy ke GitHub Pages (https://nama.github.io/<repo>/)
// tanpa perlu menukar nama repo.
export default defineConfig({
  base: './',
  plugins: [react()],
});
