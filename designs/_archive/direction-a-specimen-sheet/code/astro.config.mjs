import { defineConfig } from 'astro/config';

// Served from a subpath under the gallery's static server, so the build has to
// emit relative asset URLs rather than root-absolute ones.
export default defineConfig({
  base: '/direction-a-specimen-sheet/code/dist/',
  build: { assets: 'assets' },
});
