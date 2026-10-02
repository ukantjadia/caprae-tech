// The engine lives in ../dala-lab-engine (shared by drafts a, b, c). Vite may serve it, and
// every `three` import, including the engine's, resolves to this draft's copy.
import { fileURLToPath } from 'node:url'

export default {
  base: process.env.BASE_PATH || '/', // set by designs/scripts/build-pages.mjs for GitHub Pages
  resolve: { alias: { three: fileURLToPath(new URL('./node_modules/three', import.meta.url)) } },
  server: { fs: { allow: ['..'] } },
}
