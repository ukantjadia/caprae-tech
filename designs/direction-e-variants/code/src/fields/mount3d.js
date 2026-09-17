/* Hands the canvas to the 3D worker and gets out of the way.
 *
 * Scroll is the ONLY thing sent per interaction, and it is throttled to one
 * message per animation frame with a passive listener. No layout reads, no
 * per-frame DOM writes, no framework state. Everything else happens in the
 * worker.
 */
export function mount3D(canvas, kind, colors) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    && !location.search.includes('motion=on');
  const coarse = matchMedia('(pointer: coarse)').matches;

  function size() {
    const de = document.documentElement;
    const w = de.clientWidth, h = de.clientHeight;
    const dpr = Math.max(1, Math.min(coarse ? 1.25 : 1.75, devicePixelRatio || 1,
      Math.sqrt(1900000 / (w * h))));
    return { w: Math.round(w * dpr), h: Math.round(h * dpr), dpr };
  }

  if (!canvas.transferControlToOffscreen || typeof Worker === 'undefined') {
    canvas.dataset.skipped = 'no-offscreen';
    return null;
  }

  let worker;
  try {
    worker = new Worker(new URL('./three.worker.js', import.meta.url), { type: 'module' });
  } catch (err) {
    canvas.dataset.skipped = 'worker-blocked';
    return null;
  }

  const off = canvas.transferControlToOffscreen();
  const s = size();
  worker.postMessage({ type: 'init', canvas: off, kind, colors, reduced, ...s }, [off]);
  canvas.dataset.field = kind;

  let key = s.w + 'x' + s.h;
  addEventListener('resize', () => {
    const n = size();
    const k = n.w + 'x' + n.h;
    if (k === key) return;
    key = k;
    worker.postMessage({ type: 'resize', ...n });
  }, { passive: true });

  /* one message per frame at most, and the scroll read is a single cheap
     property access rather than a layout measurement */
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      worker.postMessage({ type: 'scroll', p: max > 0 ? scrollY / max : 0 });
    });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    worker.postMessage({ type: 'vis', hidden: document.hidden });
  });

  window.__field = { kind, reduced, worker, get skipped() { return canvas.dataset.skipped || null; } };
  return worker;
}
