// Particle shapes for the inner pages (D-096). Each page opens with its subject formed in the
// hero, scatters into a cloud behind the content, and re-forms as the Caprae C at the closing
// Book a call band. The C is the home page's hero shape. Baked by `bun run bake`
// (src/engine/bake-sets.js) into public/shapes/<set>.bin; the page loads only its own set.

const C = { type: 'text', text: 'C', depth: 0.45, radius: 3.2 }
// the home page's lightbulb (src/config.js, What we build): an idea becoming a product
const BULB = [
  [0, 1.6], [0.35, 1.57], [0.65, 1.45], [0.88, 1.22], [1, 0.9], [1.02, 0.6], [0.95, 0.3], [0.8, 0.02],
  [0.6, -0.25], [0.46, -0.45], [0.44, -0.55],
  [0.48, -0.62], [0.44, -0.7], [0.48, -0.78], [0.44, -0.86], [0.48, -0.94], [0.44, -1.02],
  [0.4, -1.1], [0.25, -1.2], [0.12, -1.26], [0, -1.27],
]

// the last shape of every set is the C: the stage forms it at the Book a call band
export const SETS = {
  brand: [C],
  mvp: [{ type: 'lathe', profile: BULB, radius: 3.4 }, C],     // idea -> product
  dashboards: [{ type: 'bars', radius: 3.4 }, C],               // numbers on one screen
  deal: [{ type: 'coins', radius: 3.4 }, C],                    // valuing and buying
  ai: [{ type: 'network', radius: 3.4 }, C],                    // connected automation
  tools: [{ type: 'gear', radius: 3.4 }, C],                    // the workflow machine
  pricing: [{ type: 'hourglass', radius: 3.4 }, C],             // priced in hours
  how: [                                                        // call, scope, build, launch
    { type: 'bubble', radius: 3.2 }, { type: 'checklist', radius: 3.2 },
    { type: 'blocks', radius: 3.2 }, { type: 'rocket', radius: 3.4 }, C,
  ],
}

// which set a page uses (default: brand), and for pages that change shape along the way, the
// stops for its content sections in order: "<shape index>@<left|right>" or "cloud"
export const PAGES = {
  '/what-we-build/mvp-development/': { set: 'mvp' },
  '/what-we-build/business-dashboards/': { set: 'dashboards' },
  '/what-we-build/deal-financial-tools/': { set: 'deal' },
  '/what-we-build/ai-assistants/': { set: 'ai' },
  '/what-we-build/internal-tools/': { set: 'tools' },
  '/pricing/': { set: 'pricing' },
  // How it works: the call (hero), then scope at the four steps, build at the week, launch at
  // the first call, then the cloud for the team chart and the FAQ
  '/how-it-works/': { set: 'how', stops: ['1@right', '2@left', '3@right', 'cloud'] },
}

export const pageShapes = route => ({ set: 'brand', stops: null, ...PAGES[route] })
