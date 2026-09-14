/* The Core. Scroll is descent; descent is the record.
 *
 * Contract: designs/DIRECTIONS.md, seed fb60c0c1, re-roll 1, index 4.
 *
 * The visitor drives the instrument. GSAP ScrollTrigger scrubs a single
 * timeline from the scroll position, so scrolling back unwinds cleanly and
 * nothing re-triggers. No wheel hijacking, no pin that traps the page: the
 * canvas is position:sticky inside a tall section, so normal scrolling always
 * works and the scrollbar never lies about where you are.
 */

import * as THREE from 'three';

/* No GSAP. bun installs a corrupt package.json for it on this machine (2550
   bytes of unparseable content, reproducible across a forced clean install),
   so Rollup cannot resolve the bare specifier. The scrub below is the same
   contract ScrollTrigger's `scrub` gives: progress is a pure function of
   scroll position, damped toward its target, so reverse is free and nothing
   re-fires. Dropping the dependency is also the smaller diff. */
function scrubber(el) {
  let target = 0, current = 0;
  function measure() {
    const r = el.getBoundingClientRect();
    const total = el.offsetHeight - innerHeight;
    target = total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total));
  }
  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure);
  measure();
  return {
    get target() { return target; },
    // damped follow. 0.12 reads as mass without feeling laggy on a trackpad.
    step() { current += (target - current) * 0.12; return current; },
    get raw() { return target; },
  };
}

const STAGE = document.getElementById('stage');
const CANVAS_WRAP = document.getElementById('core-canvas');
const READOUT = document.getElementById('depth-readout');
const STRATA = [...document.querySelectorAll('[data-stratum]')];

// Depth in metres for each stratum, oldest deepest. Depth is time.
const MARKS = STRATA.map((el) => ({
  el,
  depth: parseFloat(el.dataset.depth),
  label: el.dataset.stratum,
}));
const MAX_DEPTH = Math.max(...MARKS.map((m) => m.depth)) + 8;

function skip() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced-motion';
  if (document.documentElement.dataset.motion === 'off') return 'motion-off';
  if ((navigator.hardwareConcurrency || 8) < 4) return 'low-core';
  if (navigator.connection && navigator.connection.saveData) return 'save-data';
  if (innerWidth < 700) return 'narrow';
  try {
    const c = document.createElement('canvas');
    if (!c.getContext('webgl2') && !c.getContext('webgl')) return 'no-webgl';
  } catch (e) { return 'no-webgl'; }
  return null;
}

/* The depth readout and the rail marks are NOT part of the 3D. They run on
   scroll alone, so the instrument still reads correctly with no WebGL at all. */
const scrub = scrubber(STAGE);

function paintReadout(p) {
  const d = p * MAX_DEPTH;
  READOUT.textContent = d.toFixed(1);
  // A doubled line outranks its neighbours: the stratum being read is
  // marked by line form, never by colour.
  let current = null;
  for (const m of MARKS) if (d >= m.depth - 3) current = m;
  for (const m of MARKS) m.el.classList.toggle('reading', m === current);
}

/* The readout runs on scroll alone, with no WebGL involved, so the instrument
   still reads correctly when the 3D never starts. */
function wireReadout() {
  let queued = false;
  function tick() {
    queued = false;
    paintReadout(scrub.raw);
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true });
  paintReadout(0);
}

function init() {
  wireReadout();

  const why = skip();
  if (why) { CANVAS_WRAP.dataset.skipped = why; return; }

  const w = CANVAS_WRAP.clientWidth;
  const h = CANVAS_WRAP.clientHeight;
  if (!w || !h) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(w, h, false);
  CANVAS_WRAP.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 200);
  camera.position.set(0, 0, 13);

  const column = new THREE.Group();
  scene.add(column);

  // --- the core column -------------------------------------------------
  // One cylinder carrying a vertex-coloured strata band pattern. Two draw
  // calls total: the core body and the cut face rings.

  const H = 64;                       // world height of the whole core
  const R = 1.55;
  const geo = new THREE.CylinderGeometry(R, R, H, 48, 512, true);

  // Band the column by depth. Sodium marks only the shipped strata; every
  // other tone is graphite. Colour exists only here, against the dark mass.
  const GRAPHITE = new THREE.Color('#1B1C20');
  const GRAPHITE_HI = new THREE.Color('#33353C');
  const SODIUM = new THREE.Color('#D8A23A');

  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const shipped = MARKS.map((m) => m.depth / MAX_DEPTH);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = 1 - (y + H / 2) / H;            // 0 at top, 1 at bottom
    // sedimentary banding: layered noise, not a gradient
    const band = Math.sin(t * 190) * 0.5 + 0.5;
    const coarse = Math.sin(t * 27.3 + 1.1) * 0.5 + 0.5;
    c.copy(GRAPHITE).lerp(GRAPHITE_HI, band * 0.55 + coarse * 0.3);

    // a shipped stratum reads as a bright seam a few centimetres thick
    for (const s of shipped) {
      const d = Math.abs(t - s);
      if (d < 0.006) c.lerp(SODIUM, 1 - d / 0.006);
    }
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const core = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
  );
  column.add(core);

  // cut-face rings every 4 metres, so descent is legible as distance
  const ringPts = [];
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a) * R * 1.005, 0, Math.sin(a) * R * 1.005));
  }
  const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
  const ringMat = new THREE.LineBasicMaterial({ color: '#4A4D55', transparent: true, opacity: 0.75 });
  const rings = new THREE.Group();
  for (let d = 0; d <= MAX_DEPTH; d += 4) {
    const l = new THREE.Line(ringGeo, ringMat);
    l.position.y = H / 2 - (d / MAX_DEPTH) * H;
    rings.add(l);
  }
  column.add(rings);

  column.rotation.z = 0.045;   // the core is not perfectly plumb

  // --- scrubbed descent -------------------------------------------------
  // One timeline, scrubbed. Reverse is free because the timeline is a
  // function of scroll position, not a sequence of fired events.

  const startY = -H / 2 + 5;
  const endY = H / 2 - 5;
  column.position.y = startY;

  // descent and rotation are both pure functions of scrub progress
  function applyScrub(p) {
    column.position.y = startY + (endY - startY) * p;
    column.rotation.y = Math.PI * 1.35 * p;
  }
  applyScrub(0);

  // --- loop, only while the stage is on screen --------------------------
  let running = false, raf = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    applyScrub(scrub.step());
    renderer.render(scene, camera);
  }
  function start() { if (!running) { running = true; frame(); } }
  function stop() { if (running) { running = false; cancelAnimationFrame(raf); } }

  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(STAGE);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault(); stop(); CANVAS_WRAP.dataset.skipped = 'context-lost';
  });

  let rt;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const nw = CANVAS_WRAP.clientWidth, nh = CANVAS_WRAP.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    }, 140);
  }).observe(CANVAS_WRAP);

  CANVAS_WRAP.dataset.live = 'true';
}

init();
