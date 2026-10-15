import { defineConfig } from 'astro/config';
export default defineConfig({ base: process.env.BASE_PATH || '/direction-b-tearsheet/code/dist/', build: { assets: 'assets' } });
