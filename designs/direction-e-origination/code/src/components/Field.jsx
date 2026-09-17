/* The persistent field island.
 *
 * Mounted ONCE and kept alive across route changes by Astro's ClientRouter and
 * `transition:persist`. Navigation re-targets the camera and the focal plane;
 * it never tears down or re-seeds the field. Same seed, same bodies, one
 * continuous clock. That continuity is the only thing multi-page buys that a
 * long page cannot, and it is the reason this is multi-page.
 *
 * three is imported dynamically, so it is not in the chunk that blocks first
 * paint, and the island is gated at the Astro level so a reduced-motion reader
 * never fetches it at all.
 */
import { useEffect, useRef, useState } from 'react';
import { stageName, resolvedCount, positionAt } from '../lib/field.js';

/* Per-route camera and optical targets. Position stays a pure function of
   (route, scroll); nothing here accumulates. */
const SHOTS = {
  '/':        { dist: 5.0, pitch: 0.58, focus: 4.9, aperture: 0.13, streak: 0.42, sub: 0.052, offY: -0.30, dim: 1.00 },
  '/work':    { dist: 3.9, pitch: 0.82, focus: 3.6, aperture: 0.20, streak: 0.34, sub: 0.026, offY: 0.08, dim: 0.26 },
  '/team':    { dist: 4.4, pitch: 0.34, focus: 4.3, aperture: 0.16, streak: 0.38, sub: 0.026, offY: -0.04, dim: 0.24 },
  '/contact': { dist: 3.1, pitch: 0.68, focus: 2.9, aperture: 0.26, streak: 0.26, sub: 0.018, offY: 0.0, dim: 0.30 },
};

function routeKey() {
  if (typeof location === 'undefined') return '/';
  const p = location.pathname.replace(/\/+$/, '');
  for (const k of ['/work', '/team', '/contact']) if (p.endsWith(k)) return k;
  return '/';
}

const lerp = (a, b, t) => a + (b - a) * t;

export default function Field() {
  const canvasRef = useRef(null);
  const [rd, setRd] = useState({ n: 0, diligence: null, resolved: 0, t: '00:00', stage: '—', hover: null });

  useEffect(() => {
    let alive = true, api = null, raf = 0, disposed = false;
    const canvas = canvasRef.current;
    /* /review/* is the review-only escape hatch: it forces the live tier so
       the full experience can be seen on a machine with reduced motion on.
       Never reachable from a shipping route. */
    const reviewing = location.pathname.includes('/review');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches && !reviewing;
    const coarse = matchMedia('(pointer: coarse)').matches;

    (async () => {
      const [{ createScene }, field] = await Promise.all([
        import('../lib/scene.js'),
        import('../lib/field.js'),
      ]);
      if (!alive) return;

      const de = document.documentElement;
      const count = field.tierFor(de.clientWidth, coarse);
      api = createScene(canvas, { count });
      /* The build-time plate is the static tier. Once the live scene exists it
         must go, or it shows through the transparent canvas and doubles the
         field. */
      document.documentElement.classList.add('live');

      /* ---- state, all derived ---- */
      let clock = still ? 18.4 : 0;
      let p = 0, pTarget = 0;
      let cur = { ...SHOTS['/'] };
      let want = { ...SHOTS['/'] };
      let yaw = 0, vYaw = 0, pitchOff = 0, vPitch = 0, dragging = false, lx = 0, ly = 0;
      let route = routeKey();
      let nextSeed = 14, fade = 1, head = 0;
      let vw = 0, vh = 0, dpr = 1;
      let hovered = null, mouse = null;
      const pickTmp = { x: 0, y: 0, z: 0, s: 0, u: 0 };

      function applyRoute() {
        route = routeKey();
        want = { ...(SHOTS[route] || SHOTS['/']) };
      }
      applyRoute();
      cur = { ...want };

      function resize() {
        const w = de.clientWidth, h = de.clientHeight;
        const d = Math.max(1, Math.min(coarse ? 1.5 : 2, devicePixelRatio || 1,
          Math.sqrt(2200000 / (w * h))));
        if (w === vw && h === vh && d === dpr) return;
        vw = w; vh = h; dpr = d;
        api.resize(w, h, d);
      }
      resize();

      function readScroll() {
        const total = de.scrollHeight - innerHeight;
        pTarget = total <= 0 ? 0 : Math.min(1, Math.max(0, scrollY / total));
      }

      /* The field lies in the XY plane with +Z as its thin axis, so `pitch` is
         the polar angle measured from the disc normal: 0 is face-on, and the
         bands only read face-on. Yaw spins the disc about its OWN normal, which
         is why it is a scene rotation rather than a camera orbit, and also why
         yaw is close to a visual no-op on a rotationally symmetric field. */
      function placeCamera() {
        const cam = api.camera;
        const pitch = Math.min(1.35, Math.max(0.16, cur.pitch + pitchOff));
        const d = cur.dist;
        cam.position.set(0, d * Math.sin(pitch), d * Math.cos(pitch));
        cam.up.set(0, 1, 0);
        cam.lookAt(0, 0, 0);
        api.scene.rotation.z = yaw;
        /* On the landing route the convergence must not sit behind the
           headline: the hero shows the unsorted rim and the close rises into
           frame as the reader descends. */
        const x = Math.min(1, Math.max(0, p / 0.6));
        const heroDrop = route === '/' ? -0.95 + 0.95 * (x * x * (3 - 2 * x)) : 0;
        api.scene.position.y = cur.offY + heroDrop;
      }

      /* Hover picking runs against the survivors only, ~1% of the field, using
         the same analytic position function the renderer uses. No picking
         buffer, no raycast against 42k instances. */
      function pick() {
        if (!mouse || coarse) { hovered = null; api.setHover(null); return; }
        const cam = api.camera;
        let best = null, bestD = 0.035;
        for (const b of api.survivors) {
          positionAt(b, clock, pickTmp);
          const pr = project(cam, pickTmp);
          if (!pr) continue;
          const dx = pr.x - mouse.x, dy = pr.y - mouse.y;
          const dd = Math.hypot(dx, dy);
          if (dd < bestD) { bestD = dd; best = b; }
        }
        hovered = best;
        api.setHover(best);
      }

      function project(cam, v) {
        const e = cam.matrixWorldInverse.elements;
        const x = e[0] * v.x + e[4] * v.y + e[8] * v.z + e[12];
        const y = e[1] * v.x + e[5] * v.y + e[9] * v.z + e[13];
        const z = e[2] * v.x + e[6] * v.y + e[10] * v.z + e[14];
        if (z > -0.05) return null;
        const pj = cam.projectionMatrix.elements;
        const cx = pj[0] * x, cy = pj[5] * y, cw = -z;
        return { x: cx / cw, y: cy / cw };
      }

      /* ---- input ---- */
      const onDown = (e) => {
        if (e.pointerType === 'touch' || e.target.closest('a,button')) return;
        if (scrollY > innerHeight * 0.92 && e.target.closest('main')) return;
        e.preventDefault(); dragging = true; lx = e.clientX; ly = e.clientY;
      };
      const onMove = (e) => {
        mouse = { x: (e.clientX / innerWidth) * 2 - 1, y: -(e.clientY / innerHeight) * 2 + 1 };
        if (!dragging) return;
        vYaw += Math.max(-60, Math.min(60, e.clientX - lx)) * 0.0042;
        vPitch += Math.max(-60, Math.min(60, e.clientY - ly)) * 0.0030;
        lx = e.clientX; ly = e.clientY;
      };
      const onUp = () => { dragging = false; };
      if (!still && !coarse) {
        addEventListener('pointerdown', onDown);
        addEventListener('pointermove', onMove);
        addEventListener('pointerup', onUp);
        addEventListener('pointercancel', onUp);
      }
      const onSwap = () => { applyRoute(); resize(); };
      document.addEventListener('astro:after-swap', onSwap);

      /* ---- readout: describes the RENDER, never the business ---- */
      let lastRd = 0;
      function paintReadout(now) {
        if (now - lastRd < 1000) return;
        lastRd = now;
        const t = Math.floor(clock);
        /* Diligence share replaces the raw cycle counter. The counter moved
           too fast to read and carried no meaning; the share is the fact the
           mechanism exists to show, and it barely moves. Still a statement
           about the render, never about the business. */
        let dil = 0;
        for (let i = 1; i < api.bodies.length; i += 7) {
          const b = api.bodies[i];
          const u = ((b.ph + clock / b.cyc) % 1 + 1) % 1;
          if (u > 0.35 && u <= 0.83) dil++;
        }
        setRd({
          n: count,
          diligence: (100 * dil / Math.ceil((api.bodies.length - 1) / 7)).toFixed(1),
          resolved: resolvedCount(api.survivors, clock),
          t: String((t / 60) | 0).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'),
          stage: api.route ? stageName(((api.route.ph + clock / api.route.cyc) % 1 + 1) % 1) : '—',
          hover: hovered
            ? { band: hovered.band + 1, cyc: hovered.cyc.toFixed(2),
                stage: stageName(((hovered.ph + clock / hovered.cyc) % 1 + 1) % 1) }
            : null,
        });
      }

      if (still) {
        /* One composed frame, chosen and checked. The loop never starts. */
        readScroll(); p = pTarget;
        api.setFocus(cur.focus, cur.aperture);
        api.setStreak(0);
        api.setDim(1);
        api.setSubstrate(cur.sub);
        api.setRibbon(0.62, 1);
        placeCamera();
        api.render(clock);
        paintReadout(1e9);
        addEventListener('resize', () => { resize(); placeCamera(); api.render(clock); });
        return;
      }

      let prev = performance.now();
      const loop = (now) => {
        if (disposed) return;
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - prev) / 1000); prev = now;

        resize();
        readScroll();
        p += (pTarget - p) * 0.12;

        /* Scroll runs the clock faster. The subject is throughput over time. */
        /* Scroll still runs the clock faster, but 5.5x made the read-out
           sprint and read as noise rather than as measurement. */
        clock += dt * (0.55 + p * 1.7);

        /* Route targets are eased, so navigation is a camera move rather than
           a cut. Nothing accumulates: cur chases want. */
        const k = 1 - Math.pow(0.06, dt);
        for (const key of Object.keys(want)) cur[key] = lerp(cur[key], want[key], k);

        yaw += vYaw; pitchOff += vPitch;
        const decay = Math.pow(0.0016, dt);
        vYaw *= decay; vPitch *= decay;
        if (!dragging) pitchOff += (0 - pitchOff) * (1 - Math.pow(0.12, dt));

        api.setFocus(cur.focus + p * 1.1, cur.aperture);
        api.setStreak(cur.streak);
        /* Accessibility here is conversion work. Below the hero the column
           carries dense running text over the field, so the field steps
           back. The close stays the brightest thing on the canvas. */
        /* Legibility is conversion work on this audience, so the field steps
           back wherever running text lives. Per-route, because a short page
           never reaches a scroll threshold: /team barely scrolls and the
           convergence was landing on a person's name. */
        const d = Math.min(1, Math.max(0, (p - 0.04) / 0.16));
        api.setDim(cur.dim * (1 - 0.55 * (d * d * (3 - 2 * d))));
        api.setSubstrate(cur.sub);

        nextSeed -= dt;
        head = (head + dt * 0.14) % 1;
        if (nextSeed <= 0.6 && nextSeed > 0) fade = Math.max(0, nextSeed / 0.6);
        if (nextSeed <= 0) {
          const s = api.survivors;
          api.setRoute(s[(Math.random() * s.length) | 0]);
          nextSeed = 14; fade = 0; head = 0;
        }
        if (fade < 1 && nextSeed > 0.6) fade = Math.min(1, fade + dt / 0.6);
        api.setRibbon(head, fade);

        placeCamera();
        pick();
        api.render(clock);
        paintReadout(now);
      };
      raf = requestAnimationFrame(loop);

      window.__origination = {
        build: 'origination-v2-three',
        get count() { return count; },
        get clock() { return clock; },
        get p() { return p; },
        get route() { return route; },
        get resolved() { return resolvedCount(api.survivors, clock); },
        survivors: api.survivors.length,
        api, field,
      };

      api.__cleanup = () => {
        removeEventListener('pointerdown', onDown);
        removeEventListener('pointermove', onMove);
        removeEventListener('pointerup', onUp);
        document.removeEventListener('astro:after-swap', onSwap);
      };
    })();

    return () => {
      alive = false; disposed = true;
      cancelAnimationFrame(raf);
      if (api) { api.__cleanup && api.__cleanup(); api.dispose(); }
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="field" aria-hidden="true" />
      <div id="vig" aria-hidden="true" />
      <ul className="readout" id="readout">
        <li><dt>Bodies tracked</dt><dd>{rd.n.toLocaleString('en-US')}</dd></li>
        <li><dt>In diligence</dt><dd>{rd.diligence ?? '—'}%</dd></li>
        <li><dt>Field elapsed</dt><dd>{rd.t}</dd></li>
        <li><dt>{rd.hover ? 'Inspecting' : 'Stage'}</dt>
          <dd>{rd.hover ? `band ${rd.hover.band} · ${rd.hover.cyc}s · ${rd.hover.stage}` : rd.stage}</dd></li>
      </ul>
    </>
  );
}
