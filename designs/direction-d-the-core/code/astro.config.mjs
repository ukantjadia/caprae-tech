import { defineConfig } from 'astro/config';
export default defineConfig({
  base: process.env.BASE_PATH || '/direction-d-the-core/code/dist/',
  build: { assets: 'assets' },
});
