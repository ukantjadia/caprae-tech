import { defineConfig } from 'astro/config';
export default defineConfig({ base: process.env.BASE_PATH || '/direction-c-event-display/code/dist/', build: { assets: 'assets' } });
