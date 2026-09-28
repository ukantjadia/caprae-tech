// Every knob for the particle field. Shared by the bake script and the page.

// Particles = SIDE * SIDE. Dala: 100 -> 10,000 on desktop. Changing it needs a re-bake.
export const SIDE = 100

// Target shapes, in scroll order. A string is a GLB file in shapes/, an object is a
// three.js primitive (optional `rotate` in radians). Swap any entry and run `bun run bake`.
export const SHAPES = [
  // hero wordmark: `text` shapes are baked from a font's outlines (opentype.js), OFL font from npm
  { type: 'text', text: 'CAPRAE', font: '@fontsource/inter-tight/files/inter-tight-latin-600-normal.woff' },
  { type: 'TorusKnotGeometry', args: [0.62, 0.2, 240, 32] },
  { type: 'IcosahedronGeometry', args: [1, 0] },
  { type: 'SphereGeometry', args: [1, 96, 64] },
  // placeholder Caprae mark: a "C" arc, gap facing right. Replace with the real logo GLB (Q19).
  { type: 'TorusGeometry', args: [1, 0.3, 24, 160, Math.PI * 1.55], rotate: [0, 0, Math.PI * 0.225] },
]

// Physics and stagger, same model as Dala (their values in comments).
export const SIM = {
  spring: 0.006,    // Dala 0.006, plus a small random per particle
  springRand: 0.004,
  friction: 0.892,  // Dala 0.892
  stagger: 5,       // spread of the wave. Dala desktop 0.0005 * 10,000 = 5
  scale: 3.6,       // world radius of a shape. Dala 4.35
  size: 0.042,      // particle size
  cloud: [11, 6, 6], // half-size of the exploded cloud
  mouseRadius: 1.4,
  mouseForce: 0.03,
}

export const CAMERA = { fov: 50, z: 10 } // Dala: fov 50, z 10

// Scroll choreography, Dala's model. `p` = section index + fraction scrolled through it
// (section 0 = hero). Each ramp adds `delta` to a value as p goes from `from` to `to`.
// Values start at BASE. Edit this table to re-time the page, no code changes.
// v2: the CAPRAE wordmark sits centred at the top of the hero, big, facing front.
export const BASE = { x: 0, y: 2.35, rotY: 0, scale: 1.5, explode: 0, shape: 0 }
export const RAMPS = [
  // hero scrolls away: the wordmark breaks apart into the cloud
  [0.15, 0.9, { explode: 1 }],
  [0.5, 0.9, { y: -2.35, scale: -0.5, x: -3.2 }],
  // intro: the cloud forms shape 1 on the left, beside the text
  [0.9, 1.25, { explode: -1, shape: 1 }],
  // then explodes again into the manifesto cloud, centred
  [1.5, 2.2, { explode: 1, x: 3.2 }],
  // manifesto holds the cloud, then it re-forms as shape 2 on the left
  [2.7, 3, { explode: -1, shape: 1, x: -3.2, rotY: Math.PI / 2 }],
  // feature: shape 2 -> shape 3, jumps to the right
  [3.3, 3.5, { shape: 1, x: 6.4, rotY: Math.PI / 4 }],
  // second feature: explodes again
  [4.5, 5, { explode: 1, x: -3.2, rotY: -Math.PI }],
  // team: cloud forms the logo, rises above the footer; rotY totals 0 so it faces front
  [5.7, 6, { explode: -1, shape: 1, y: 2.1, scale: -0.5, rotY: Math.PI / 4 }],
]

// Particle colours. Shape: regions that drift over the surface (base, band, accent),
// with a few white sparkles. Dust: picked at random per particle.
export const FIELD_COLORS = ['#8052ff', '#ffb829', '#15846e']
export const PALETTE = ['#8052ff', '#8052ff', '#ffb829', '#15846e', '#ffffff', '#a494af']
