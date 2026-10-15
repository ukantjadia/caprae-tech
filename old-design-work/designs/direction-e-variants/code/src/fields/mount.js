/* Mounts the field. Everything expensive happens in the worker; this file only
 * hands over a canvas and then gets out of the way.
 *
 * Deliberately NOT doing any of these, because each one is a main-thread tax:
 *   - no per-frame framework state
 *   - no per-frame DOM writes
 *   - no scroll listener driving the animation
 * The fade-in below the hero is a CSS scroll-driven animation on `opacity`,
 * which runs on the compositor. See origination.css.
 */
export function mountField(canvas, kind, colors) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    && !location.search.includes('motion=on');
  const coarse = matchMedia('(pointer: coarse)').matches;

  function size() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    const dpr = Math.max(1, Math.min(coarse ? 1.5 : 2, devicePixelRatio || 1,
      Math.sqrt(2200000 / (w * h))));
    return { w: Math.round(w * dpr), h: Math.round(h * dpr), dpr };
  }

  const { w, h, dpr } = size();

  if (!canvas.transferControlToOffscreen || typeof Worker === 'undefined') {
    /* No OffscreenCanvas: leave the static CSS ground alone rather than run a
       heavy loop on the main thread. Tier 3 is a designed page, not a fallback
       nobody looked at. */
    canvas.dataset.skipped = 'no-offscreen';
    return null;
  }

  let worker;
  try {
    /* Resolve against THIS module's URL, not document.baseURI: the page lives
       at /dist/<variant>/ while the worker sits at /dist/, so baseURI 404s. */
    worker = new Worker(new URL('./field.worker.js', import.meta.url), { type: 'classic' });
  } catch (err) {
    canvas.dataset.skipped = 'worker-blocked';
    return null;
  }

  const off = canvas.transferControlToOffscreen();
  worker.postMessage({ type: 'init', canvas: off, kind, colors, w, h, dpr, reduced }, [off]);
  canvas.dataset.field = kind;

  let last = w + 'x' + h;
  addEventListener('resize', () => {
    const s = size();
    const key = s.w + 'x' + s.h;
    if (key === last) return;            // only when the size actually CHANGED
    last = key;
    worker.postMessage({ type: 'resize', ...s });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    worker.postMessage({ type: 'vis', hidden: document.hidden });
  });

  window.__field = { kind, reduced, worker, get skipped() { return canvas.dataset.skipped || null; } };
  return worker;
}
