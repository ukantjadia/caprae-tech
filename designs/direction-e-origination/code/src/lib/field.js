/* ORIGINATION — the field model.
 *
 * Renderer-agnostic on purpose. The Three.js scene, the hover picking and the
 * verification harness all call the same functions, so a rendering change can
 * never silently drift from the model that was already verified in v1.
 *
 * Position is a PURE FUNCTION of (attributes, time). No simulation state, no
 * feedback buffer, no transform feedback. Scrubbing the clock backwards is
 * exact and the field can never drift. That is the argument, not a trick, and
 * it is why GPGPU was refused: it would trade the property away for a headline.
 */

export const TAU = Math.PI * 2;

/* Five size bands. The r0 ranges must NOT touch: contiguous ranges give a
   smear, and the space between them is the structure. v1 shipped them
   contiguous and the field read as noise until it was fixed. */
export const BANDS = [
  { w: 0.30, size: [0.05, 0.18], r0: [1.66, 1.92], lo: 0.18 },
  { w: 0.26, size: [0.18, 0.34], r0: [1.32, 1.52], lo: 0.22 },
  { w: 0.20, size: [0.34, 0.55], r0: [1.00, 1.18], lo: 0.26 },
  { w: 0.14, size: [0.55, 0.78], r0: [0.72, 0.86], lo: 0.30 },
  { w: 0.10, size: [0.78, 1.00], r0: [0.46, 0.58], lo: 0.34 },
];

/* Time weights per stage, cumulative. Real M&A spends most of the clock in
   diligence; equal stage durations are the falsehood this ICP is qualified to
   spot. Measured against the render in v1: 7.9 / 12.1 / 15.0 / 47.9 / 17.1. */
export const CUM = [0.0, 0.08, 0.20, 0.35, 0.83, 1.0];
export const STAGES = ['Sourced', 'Screened', 'LOI', 'Diligence', 'Close'];

/* cycle = 0.55 + 1.9 * size^0.70.
   The exponent is a calibration, not a physical law, and is not presented as
   one. What is non-negotiable is that it is strictly monotonic. */
export function cycleOf(size) {
  return 0.55 + 1.9 * Math.pow(size, 0.70);
}

/** u is TIME through the cycle; s is DISTANCE along the pipeline. Not the same. */
export function stageOf(u) {
  if (u <= 0.08) return 0.0 + 0.2 * (u - 0.00) / 0.08;
  if (u <= 0.20) return 0.2 + 0.2 * (u - 0.08) / 0.12;
  if (u <= 0.35) return 0.4 + 0.2 * (u - 0.20) / 0.15;
  if (u <= 0.83) return 0.6 + 0.2 * (u - 0.35) / 0.48;
  return 0.8 + 0.2 * (u - 0.83) / 0.17;
}

export function stageName(u) {
  return STAGES[Math.min(4, Math.floor(stageOf(u) * 5))];
}

const smooth = (t) => t * t * (3 - 2 * t);

/**
 * World position of one body at time t. The single source of truth.
 * `out` is written in place to keep this allocation-free in hot loops.
 */
export function positionAt(b, t, out) {
  const u = ((b.ph + t / b.cyc) % 1 + 1) % 1;
  const s = stageOf(u);
  const k = smooth(Math.min(1, Math.max(0, s)));
  let R = b.r0 + (0.05 - b.r0) * k;
  const th = b.th0 * TAU + t * (0.30 / b.cyc);
  const z = b.scat * (1 - 0.82 * k);
  let x = R * Math.cos(th), y = R * Math.sin(th);
  if (s >= b.drop) {
    const m = 1 + (s - b.drop) * 5.2;
    x *= m; y *= m;
  }
  out.x = x; out.y = y; out.z = z; out.s = s; out.u = u;
  return out;
}

/** Alpha for a body at time t, including the attrition fade. */
export function alphaAt(b, t) {
  const u = ((b.ph + t / b.cyc) % 1 + 1) % 1;
  const s = stageOf(u);
  if (s < b.drop) return 1;
  const g = Math.min(1, Math.max(0, (s - b.drop) / 0.16));
  return 1 - smooth(g);
}

function pickBand(r, cum) {
  for (let i = 0; i < cum.length; i++) if (r <= cum[i]) return i;
  return cum.length - 1;
}
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Build the population. Deterministic for a given seed so every reload, every
 * route and every screenshot shows the same field.
 */
export function buildField(N, seed = 0x9E3779B9) {
  let s = seed >>> 0;
  const rnd = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  const cum = [];
  let acc = 0;
  for (const b of BANDS) { acc += b.w; cum.push(acc); }

  const bodies = new Array(N);
  const survivors = [];

  /* Index 0 is THE CLOSE: pinned to the origin, never dimmed, never dropped.
     The one body the whole field converges on. */
  bodies[0] = { i: 0, size: 1, r0: 0, scat: 0, ph: 0, th0: 0, drop: 9,
                cyc: 1, band: -1, seed: -1, close: true };

  for (let i = 1; i < N; i++) {
    const bi = pickBand(rnd(), cum), B = BANDS[bi];
    const size = lerp(B.size[0], B.size[1], rnd());
    const r0 = lerp(B.r0[0], B.r0[1], rnd());
    /* Two uniforms, not one: a real field bunches toward the plane with thin
       wings. One uniform gives a slab. */
    const scat = (rnd() + rnd() - 1) * 0.22 * (1.25 - size);
    const ph = rnd();
    /* Skewed so most leave early and roughly 1% survive to the close. The 1.02
       ceiling keeps survivors off the s = 1 boundary. */
    const drop = B.lo + (1.02 - B.lo) * Math.pow(rnd(), 2.2);
    /* th0 is INDEPENDENT of ph. Deriving the angle from the phase makes angular
       position a function of pipeline stage, so every body at the same stage
       sits in the same arc and the field collapses into one rotating lobe.
       Measured in v1: it pushed the screen centroid to 55.95% of viewport
       width on a centred layout. */
    const th0 = rnd();
    const cyc = cycleOf(size);
    const b = { i, size, r0, scat, ph, th0, drop, cyc, band: bi, seed: rnd(), close: false };
    bodies[i] = b;
    if (drop > 1.0) survivors.push(b);
  }
  return { bodies, survivors };
}

/** Cycles that have crossed s = 1 since t = 0. A fact about the render. */
export function resolvedCount(survivors, t) {
  let n = 0;
  for (let j = 0; j < survivors.length; j++) {
    const b = survivors[j];
    n += Math.floor(b.ph + t / b.cyc) - Math.floor(b.ph);
  }
  return n;
}

/** The complete route of one survivor, rim to close. Time cancels exactly. */
export function routeOf(b, n = 96) {
  const pts = new Float32Array(n * 3);
  for (let j = 0; j < n; j++) {
    const u = j / (n - 1);
    const s = stageOf(u);
    const k = smooth(s);
    const R = b.r0 + (0.05 - b.r0) * k;
    const th = b.th0 * TAU + (u - b.ph) * 0.30;
    pts[j * 3] = R * Math.cos(th);
    pts[j * 3 + 1] = R * Math.sin(th);
    pts[j * 3 + 2] = 0;
  }
  return pts;
}

export const TIERS = { desktop: 42000, tablet: 22000, mobile: 11000 };
export function tierFor(width, coarse) {
  if (width >= 1100 && !coarse) return TIERS.desktop;
  return width >= 700 ? TIERS.tablet : TIERS.mobile;
}
