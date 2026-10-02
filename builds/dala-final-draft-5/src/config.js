// Final draft 5: draft 2's content in new layouts (D-083). Draft C's shapes, the hero shape on the right.
// Shared by the bake (shapes) and the page (everything else).

export const DRAFT = 'c'

// Particle slots = SIDE * SIDE (Dala: 100 -> 10,000). Changing it needs a re-bake.
export const SIDE = 100

// Minimum distance between particles, in world units. Blue noise puts the median neighbour
// gap at ~1.1x this, so 0.16 gives ~0.18 = 1.8x the median particle edge (0.10): Dala's
// gap ratio at 1.5x Dala's particle size (D-065). Each shape's world size is its radius.
export const SPACING = 0.16

// Scroll order: hero, logo (Why), bulb (What we build), geometry set (Pricing). D-063.
export const SHAPES = [
  { type: 'text', text: 'C', depth: 0.45, radius: 3.2 }, // extruded C, fitted into the hero's left-side box
  // placeholder Caprae mark until the logo SVG arrives: a "C" arc, gap facing right
  { type: 'TorusGeometry', args: [1, 0.3, 24, 160, Math.PI * 1.55], rotate: [0, 0, Math.PI * 0.225], radius: 3.6 },
  { type: 'lathe', profile: [
    [0, 1.6], [0.35, 1.57], [0.65, 1.45], [0.88, 1.22], [1, 0.9], [1.02, 0.6], [0.95, 0.3], [0.8, 0.02],
    [0.6, -0.25], [0.46, -0.45], [0.44, -0.55],
    [0.48, -0.62], [0.44, -0.7], [0.48, -0.78], [0.44, -0.86], [0.48, -0.94], [0.44, -1.02],
    [0.4, -1.1], [0.25, -1.2], [0.12, -1.26], [0, -1.27],
  ], radius: 4 },
  { type: 'geometrySet', radius: 5 },
]

export const CAMERA = { fov: 50, z: 10 } // Dala: fov 50, z 10

export const SIM = {
  spring: 0.006, springRand: 0.004, friction: 0.892, // Dala's physics, per 1/60 s
  stagger: 5,            // spread of the morph wave (Dala desktop 5)
  cloud: [11, 6, 6],     // half-size of the exploded cloud
  particleScale: 0.2325, // 1.5x Dala's 0.155: median edge ~0.10 world (D-065)
}

// Dala's front cones, same frame mesh, 1.5x Dala's 0.075
export const DUST = { count: 250, scale: 0.1125 }

// Section Lab palette (D-065) in Dala's proportions: one dominant, one second, accents
export const PALETTE = [
  ['#9281f7', 0.40], // iris
  ['#9a54dc', 0.25], // iris-2
  ['#70b8ff', 0.13], // blue
  ['#3ad389', 0.11], // green
  ['#ffca16', 0.11], // amber
]

export const SECTION_SELECTOR = 'section[data-section]'
export const HERO_ANCHOR = '.hero-mark' // the hero shape is fitted into this box

// Choreography: p = section index + fraction scrolled past the top (0 hero, 1 why,
// 2 what we build, 3 proof, 4 how, 5 pricing, 6 founders, 7 team, 8 faq, 9 book).
// Each ramp adds its deltas as p goes from `from` to `to`. D-063 order: hero word ->
// logo at Why -> bulb at What we build -> cloud -> geometry set at Pricing -> cloud.
// x, y and scale of the hero shape come from HERO_ANCHOR at runtime; these are fallbacks
export const BASE = { x: 0, y: 2.6, rotY: 0, scale: 1, explode: 0, shape: 0 }
// The Lab's content fills the width, so formed shapes sit in the side margins, part off-screen
// (x = +-7.6 at scale 0.8), and the cloud centres behind everything.
export const RAMPS = [
  [0.35, 0.95, { shape: 1, x: b => 7.6 - b.x, y: b => -b.y, scale: b => 0.8 - b.scale }], // C -> logo, right of Why
  [1.55, 2.05, { shape: 1, x: -15.2 }],            // logo -> bulb, left of What we build
  [2.6, 3.1, { explode: 1, x: 7.6, scale: 0.2 }],   // bulb -> cloud behind Proof and How
  [4.55, 5.05, { explode: -1, shape: 1, x: 7.6, scale: -0.2 }], // cloud -> geometry set, right of Pricing
  [5.45, 5.95, { explode: 1, x: -7.6, scale: 0.2 }], // -> cloud as Pricing ends, before Founders
]

// D-079: particles under the page text dim to the floor value (Lab look, refined: particles fade to 12% under text)
export const TEXT_MASK = {
  selector: 'main :is(h1, h2, h3, h4, p, li, dt, dd, td, th, label, .btn, .tag, .mono, .num, .panel, input, textarea), .split-line',
  floor: 0.12,
}
