import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Base matches where the gallery serves this build from, the same convention
// Directions B, C and D already use.
export default defineConfig({
  integrations: [react()],
  base: process.env.BASE_PATH || '/direction-f-load-bearing/code/dist/',
  build: { assets: 'assets', inlineStylesheets: 'never' },
  vite: { build: { cssCodeSplit: false } },
});
