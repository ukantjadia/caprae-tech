// The particle field on inner pages (D-096): the home page's engine and look, with the page's
// own shape set. Loaded after the page has painted (inner.js), so it never delays the content.
import * as base from './config.js'
import EXTENTS from './shape-extents.json'
import { SETS } from '../site/shapes.js'
import { startStage } from './engine/stage.js'

const set = document.body.dataset.shapes
if (set && SETS[set]) {
  startStage({
    ...base,
    SHAPES: SETS[set],
    EXTENTS: EXTENTS[set],
    SHAPES_URL: `${import.meta.env.BASE_URL}shapes/${set}.bin`,
    POSTER: `${import.meta.env.BASE_URL}posters/${set}.webp`, // no WebGL: a still of the hero shape (D-100)
    STOPS: true,
    SECTION_SELECTOR: '[data-stop]',
    HERO_ANCHOR: '.pg-hero .hero-mark',
    // particles fade under the page's text, as on home (D-079); the hero's glass panel is left
    // out so the shape shows through it
    TEXT_MASK: {
      selector: 'main :is(h1, h2, h3, p, li, td, th, summary, label, .eyebrow, .pill, .btn, .tag, .num-big, .todo, .card:not(.pg-aside), .sheet, .cmp, .day, .org-node, .fchip, .zone), .cx-band :is(h2, p, .btn, .eyebrow)',
      floor: 0.12,
    },
  })
}
