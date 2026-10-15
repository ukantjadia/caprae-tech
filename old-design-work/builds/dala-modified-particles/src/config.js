// Every knob for the particle field. Shared by the bake script and the page.

// Particles = SIDE * SIDE. Dala: 100 -> 10,000 on desktop. Changing it needs a re-bake.
export const SIDE = 75 // 5,625: fewer, bigger particles with visible gaps, like Dala's brain

// Target shapes, in scroll order. A string is a GLB file in shapes/, an object is a
// three.js primitive (optional `rotate` in radians). Swap any entry and run `bun run bake`.
// v3: Dala's sequence, brain -> lightbulb -> sphere -> logo, all from our own sources.
export const SHAPES = [
  // brain slot: the knot stands in until a CC0 brain model is approved and dropped into shapes/
  { type: 'TorusKnotGeometry', args: [0.62, 0.2, 240, 32] },
  // lightbulb, built here with no download: globe, neck, screw threads, tip, spun on its axis
  { type: 'lathe', profile: [
    [0, 1.6], [0.35, 1.57], [0.65, 1.45], [0.88, 1.22], [1, 0.9], [1.02, 0.6], [0.95, 0.3], [0.8, 0.02],
    [0.6, -0.25], [0.46, -0.45], [0.44, -0.55],
    [0.48, -0.62], [0.44, -0.7], [0.48, -0.78], [0.44, -0.86], [0.48, -0.94], [0.44, -1.02],
    [0.4, -1.1], [0.25, -1.2], [0.12, -1.26], [0, -1.27],
  ] },
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
  size: 0.085,      // particle size: ~10px on screen with ~8px gaps, measured off Dala's brain
  cloud: [11, 6, 6], // half-size of the exploded cloud
  mouseRadius: 1.4,
  mouseForce: 0.03,
}

export const CAMERA = { fov: 50, z: 10 } // Dala: fov 50, z 10

// Scroll choreography, Dala's model. `p` = section index + fraction scrolled through it
// (section 0 = hero). Each ramp adds `delta` to a value as p goes from `from` to `to`.
// Values start at BASE. Edit this table to re-time the page, no code changes.
export const BASE = { x: 3.3, y: 0, rotY: 0, scale: 1, explode: 0, shape: 0 }
export const RAMPS = [
  // hero scrolls away: shape crosses to the left, turns, grows a little
  [0, 1, { x: -6.6, rotY: -Math.PI / 2, scale: 0.15 }],
  // intro: shape explodes into a screen-wide cloud and centres
  [1.1, 2.2, { explode: 1 }],
  [1.25, 1.5, { x: 3.3, scale: -0.15 }],
  // manifesto holds the cloud, then it re-forms as shape 1 on the left
  [2.7, 3, { explode: -1, shape: 1, x: -3.2, rotY: Math.PI / 2 }],
  // feature: shape 1 -> shape 2, jumps to the right
  [3.3, 3.5, { shape: 1, x: 6.4, rotY: Math.PI / 4 }],
  // second feature: explodes again
  [4.5, 5, { explode: 1, x: -3.2, rotY: -Math.PI }],
  // team: cloud forms the logo, rises above the footer; rotY totals -2π so it faces front
  [5.7, 6, { explode: -1, shape: 1, y: 2.1, scale: -0.5, rotY: -Math.PI * 1.25 }],
]

// Particle colours. Shape: regions that drift over the surface (base, band, accent),
// with a few white sparkles. Dust: picked at random per particle.
export const FIELD_COLORS = ['#8052ff', '#ffb829', '#15846e']
export const PALETTE = ['#8052ff', '#8052ff', '#ffb829', '#15846e', '#ffffff', '#a494af']

// 'wire' = hollow pyramids, edges only (this variant). 'solid' = filled, lit faces (v1, v2).
export const PARTICLE_STYLE = 'wire'
