import { defineConfig } from 'astro/config';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  build: { assets: 'assets' },
  vite: { build: { cssCodeSplit: false } },
});
