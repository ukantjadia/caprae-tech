import { defineConfig } from 'astro/config';

/* No React, no Three.js. The three background fields are Canvas 2D running in a
 * Web Worker via OffscreenCanvas, and every DOM animation is CSS on transform
 * and opacity only. Nothing animates on the main thread. */
export default defineConfig({
  base: process.env.BASE_PATH || '/direction-e-variants/code/dist/',
  build: { assets: 'assets' },
  vite: { build: { cssCodeSplit: false } },
});
