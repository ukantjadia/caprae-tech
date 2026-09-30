// Direction R, rebuilt with the Section Lab content: three static pages (a, b, c), one per
// Lab variant, from one codebase. No React: the Lab's own script drives the interactions.
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const page = p => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  base: process.env.BASE_PATH || '/', // set by designs/scripts/build-pages.mjs for GitHub Pages
  plugins: [tailwindcss()],
  build: { rollupOptions: { input: { index: page('./index.html'), a: page('./a/index.html'), b: page('./b/index.html'), c: page('./c/index.html') } } },
  // the claim markers and a11y fixes are shared with the Dala Lab drafts (builds/dala-lab-engine)
  server: { fs: { allow: ['../../..'] } },
})
