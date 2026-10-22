// The Caprae Tech site: one HTML file per URL (index.html at each route's folder), with the
// navbar, footer and meta filled in by site/plugin.js. Every page runs the particle engine in
// src/engine (a copy of ../dala-lab-engine, extended for the inner pages, D-096).
import { fileURLToPath } from 'node:url'
import { sitePages, preloadFonts } from './site/plugin.js'

const root = fileURLToPath(new URL('.', import.meta.url))
const base = process.env.BASE_PATH || '/' // set by .github/workflows/deploy-pages.yml for GitHub Pages

export default {
  base,
  plugins: [sitePages({ root, base }), preloadFonts({ base })],
  // source maps for the live JS: easier debugging; the repo is public, so nothing new is exposed (D-100)
  build: { sourcemap: true },
}
