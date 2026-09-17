import { defineConfig } from 'astro/config';

export default defineConfig({
  base: '/',
  build: { assets: 'assets' },
  vite: { build: { cssCodeSplit: false } },
});
