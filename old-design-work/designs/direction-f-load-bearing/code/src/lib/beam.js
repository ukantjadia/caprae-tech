/* The closed form for a simply supported beam under uniform load w.
 *
 *   y(x) = (w / (24 EI)) * (x^4 - 2 L x^3 + L^3 x)
 *
 * This is the whole reason the shot is not a decorative wobble. A sine peaks at
 * midspan too, which is exactly why it is the trap: its curvature is wrong at
 * the supports, where a real beam has zero bending moment and therefore zero
 * curvature. One line, and it is checkable against any engineering table.
 *
 * Used by BOTH renderers: the React island at runtime and the Astro page at
 * build time for the static plate. Same maths, different renderer.
 */
export const SPAN = 34;          // bays
export const L = 1;              // normalised span

/** Unnormalised shape. Zero at both supports, max at midspan. */
export function shape(x, l = L) {
  return x * x * x * x - 2 * l * x * x * x + l * l * l * x;
}

/** shape() at midspan, used to normalise so peak deflection is exactly `peak`. */
export const SHAPE_MAX = shape(L / 2);

/**
 * Deflection at position x for a load fraction in [0,1].
 * Normalised so that at load = 1 the midspan deflection is L/240, the
 * span-over-deflection ratio a real serviceability limit uses. L/20 reads as
 * rubber; L/2000 is invisible.
 */
export const RATED_RATIO = 240;
export function deflection(x, load, l = L) {
  return (shape(x, l) / SHAPE_MAX) * (l / RATED_RATIO) * load;
}

/* A true L/240 deflection is 0.4% of the span and is invisible at any camera
 * distance that still shows the structure. Engineering deflection diagrams are
 * conventionally drawn to an exaggerated vertical scale and they SAY SO on the
 * drawing. Same here: the read-out reports the real millimetres, the drawing
 * exaggerates by this factor, and the factor is printed next to it. */
export const EXAG = 20;

/** Midspan deflection in millimetres for the read-out, for a 12.0 m span. */
export const SPAN_METRES = 12.0;
export function midspanMm(load) {
  return (SPAN_METRES * 1000 / RATED_RATIO) * load;
}
