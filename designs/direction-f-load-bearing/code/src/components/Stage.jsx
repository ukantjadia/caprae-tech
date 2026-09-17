/* Direction F — LOAD BEARING, the scrubbed stage.
 *
 * Contract: design-isperiation-prompts/adapted-prompts/02-ascent-to-caprae.md
 *
 * Nothing here plays by itself. `frameloop="demand"` plus an explicit
 * invalidate() on scroll change is the renderer-level enforcement of the
 * source prompt's start-over condition: if the scene moves when the reader is
 * not scrolling, it is an ambient hero with a scrub bolted under it.
 *
 * three / R3F / drei are imported dynamically below, so they are not in the
 * chunk that blocks first paint. The island itself is gated at the Astro level
 * with client:media so a reduced-motion reader never fetches them at all.
 */
import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { deflection, midspanMm, SPAN, RATED_RATIO, EXAG } from '../lib/beam.js';

const Scene = lazy(() => import('./Scene.jsx'));

/* Progress is a pure function of scroll position, damped toward its target.
 * Polled inside the frame loop: not a scroll listener, and not behind an
 * IntersectionObserver. Both have already failed in this repo, the observer by
 * silently killing the loop when the stage starts below the fold. */
function useScrub(ref) {
  const [p, setP] = useState(0);
  const cur = useRef(0);
  useEffect(() => {
    let raf = 0, alive = true;
    const read = () => {
      if (!alive) return;
      const el = ref.current;
      if (el) {
        const total = el.offsetHeight - innerHeight;
        const t = total <= 0 ? 0 : Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
        cur.current += (t - cur.current) * 0.12;
        if (Math.abs(cur.current - t) < 0.0002) cur.current = t;
        setP((prev) => (Math.abs(prev - cur.current) > 0.0004 ? cur.current : prev));
      }
      raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [ref]);
  return p;
}

const BEATS = [
  { from: 0.00, to: 0.15, pos: 'up', text: 'Three weeks. Twelve hundred users.',
    src: 'saasquatchleads.com · 1,200+ beta signups in three weeks' },
  { from: 0.26, to: 0.40, pos: 'low', text: 'Three hundred thousand calls. Five countries.',
    src: 'coldcallkillers.io · 300,000+ calls, launched June 2026' },
  /* 0.42 – 0.72 is empty on purpose. The structure carries it alone. Do not add
     a fourth beat, a progress label, or a scroll cue here. */
  { from: 0.74, to: 0.90, pos: 'low', text: 'The team that built them is the team you hire.',
    src: null },
];

export default function Stage({ children }) {
  const ref = useRef(null);
  const p = useScrub(ref);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  /* The plate MUST lift. Relying only on a callback from inside the Canvas
     has now failed twice: with frameloop="demand" there is no guaranteed
     frame to hang it on, and a plate that never lifts hides the entire
     scene behind a still image. This is the backstop. */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const load = p;
  const mm = midspanMm(load);
  const pct = Math.round(load * 100);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__loadbearing = {
        build: 'load-bearing-v1',
        get p() { return p; },
        get mm() { return mm; },
        deflection, ratedRatio: RATED_RATIO, bays: SPAN,
        get sceneReady() { return ready; },
      };
    }
  }, [p, mm, ready]);

  return (
    <section className="stage" ref={ref}>
      <div className="sticky">
        <div className="canvas-box">
          <Suspense fallback={null}>
            <Scene progress={p} onReady={onReady} />
          </Suspense>
        </div>

        {/* The build-time plate stays in the DOM until the scene has actually
            drawn, so there is never a blank stage and never a layout shift. */}
        <div className={'plate' + (ready ? ' gone' : '')}>{children}</div>

        <div className="beats" aria-hidden="true">
          {BEATS.map((b, i) => (
            <p key={i}
               className={'beat ' + b.pos + (p >= b.from && p <= b.to ? ' on' : '')}>
              <span>{b.text}</span>
              {b.src && <em>{b.src}</em>}
            </p>
          ))}
        </div>

        <div className="rail">
          <span className="pct">{String(pct).padStart(2, '0')}</span>
          <span className="track"><i style={{ width: (load * 100).toFixed(2) + '%' }} /></span>
          <span className="rd">load {(load * 100).toFixed(0)}% of rated</span>
          <span className="rd">midspan {mm.toFixed(1)} mm</span>
          <span className="rd">deflection drawn &times;{EXAG}</span>
        </div>
      </div>
    </section>
  );
}
