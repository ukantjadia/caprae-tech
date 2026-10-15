/* The Event Display. One frozen deal event, held and inspectable.
 *
 * Contract: designs/DIRECTIONS.md, Direction C, user-pinned.
 *
 * The contract refuses scroll-as-narrative, and the owner's standing pin is
 * scroll-driven 3D. Both are honoured: scroll moves the camera OUTWARD through
 * detector layers, which is navigation through space, not a story advancing.
 * Selection is the other axis: click a track to isolate it and read its
 * numbers. Neither mode needs the other.
 */

import * as THREE from 'three';

const WRAP = document.getElementById('display');
const STAGE = document.getElementById('stage');
const LAYER_OUT = document.getElementById('layer-name');
const RADIUS_OUT = document.getElementById('layer-radius');
const TRACKS = [...document.querySelectorAll('[data-track]')];

const LAYERS = [
  { r: 0.0, name: 'Beamline' },
  { r: 1.4, name: 'Origination' },
  { r: 2.6, name: 'Screening' },
  { r: 3.9, name: 'Diligence' },
  { r: 5.2, name: 'Close' },
];

const VACUUM = '#08090B';
const STEEL = '#2E3844';
const SOURCED = '#4FC3D9';   // tracks still in flight
const CLOSED = '#E0B23C';    // tracks that reached the outer layer

function skip() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced-motion';
  if (document.documentElement.dataset.motion === 'off') return 'motion-off';
  if ((navigator.hardwareConcurrency || 8) < 4) return 'low-core';
  if (navigator.connection && navigator.connection.saveData) return 'save-data';
  if (innerWidth < 760) return 'narrow';
  try {
    const c = document.createElement('canvas');
    if (!c.getContext('webgl2') && !c.getContext('webgl')) return 'no-webgl';
  } catch (e) { return 'no-webgl'; }
  return null;
}


/* Position polling, not scroll events. On this machine scrollY changes without
   a scroll event dispatching to window, so an event-driven readout silently
   freezes. A rAF loop gated to the stage being on screen is immune to which
   element actually scrolls, and repaints only when the value changes. */
function watch(el, onChange) {
  let last = -1, raf = 0, running = false;
  function read() {
    if (!running) return;
    const total = el.offsetHeight - innerHeight;
    const p = total <= 0 ? 0 : Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
    if (Math.abs(p - last) > 0.0005) { last = p; onChange(p); }
    raf = requestAnimationFrame(read);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(read); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
  return { get raw() { return last < 0 ? 0 : last; }, _alive() { return running; } };
}

let damped = 0;
const scrub = watch(STAGE, paintLayer);
// verification hook: proves which build is loaded and that the loop is running
window.__core = { build: 'poll-v2', get p() { return scrub.raw; }, get alive() { return scrub._alive(); } };
function step() { damped += (scrub.raw - damped) * 0.1; return damped; }

/* The layer readout runs on scroll alone. With no WebGL the page still tells
   you which layer you are in, and the track list is plain HTML throughout. */
function paintLayer(p) {
  const r = p * LAYERS[LAYERS.length - 1].r;
  let cur = LAYERS[0];
  for (const l of LAYERS) if (r >= l.r - 0.35) cur = l;
  LAYER_OUT.textContent = cur.name;
  RADIUS_OUT.textContent = r.toFixed(2);
  TRACKS.forEach((t) => t.classList.toggle('at', t.dataset.layer === cur.name));
}

paintLayer(0);

function init() {
  const why = skip();
  if (why) { WRAP.dataset.skipped = why; return; }

  const w = WRAP.clientWidth, h = WRAP.clientHeight;
  if (!w || !h) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(w, h, false);
  renderer.setClearColor(VACUUM, 1);
  WRAP.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 200);
  const group = new THREE.Group();
  scene.add(group);

  // --- detector rings: the compositional law ---------------------------
  const ringMat = new THREE.LineBasicMaterial({ color: STEEL, transparent: true, opacity: 0.85 });
  for (const l of LAYERS) {
    if (l.r === 0) continue;
    const pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * l.r, Math.sin(a) * l.r, 0));
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat));
  }

  // --- tracks: one curve per deal, out of one collision ------------------
  // Deterministic, not random: the same event every load.
  const trackObjs = [];
  const N = 26;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2 + 0.21;
    const bend = ((i % 7) - 3) * 0.09;          // charge and momentum
    const reach = 1.1 + ((i * 37) % 100) / 100 * 4.1;
    const closed = i % 6 === 0;                  // a sixth reach the close
    const pts = [];
    const steps = 46;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const r = t * (closed ? LAYERS[4].r : reach);
      const a = a0 + bend * t * t * 2.4;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, (i % 5 - 2) * 0.06 * r));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({
      color: closed ? CLOSED : SOURCED,
      transparent: true,
      opacity: closed ? 0.92 : 0.4,
    });
    const line = new THREE.Line(g, m);
    line.userData = { closed, base: closed ? 0.92 : 0.4 };
    group.add(line);
    trackObjs.push(line);
  }

  // the collision itself
  const seed = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]),
    new THREE.PointsMaterial({ color: '#F2F5F8', size: 5, sizeAttenuation: false })
  );
  group.add(seed);

  // --- scroll moves the camera outward through the layers ---------------
  function applyScrub(p) {
    camera.position.set(0, 0, 7.2 + p * 8.6);     // outward, not through a story
    camera.lookAt(0, 0, 0);
    group.rotation.z = p * 0.55;
    group.rotation.x = -0.34 + p * 0.30;
    // tracks brighten as their layer is reached
    const reach = p * LAYERS[4].r;
    for (const t of trackObjs) {
      const want = t.userData.closed && reach > LAYERS[4].r * 0.8 ? 1 : t.userData.base;
      t.material.opacity += (want - t.material.opacity) * 0.08;
    }
  }
  applyScrub(0);

  // --- selection: the other axis ----------------------------------------
  // Hovering a track row in the list isolates that track in the display.
  TRACKS.forEach((row, i) => {
    const line = trackObjs[i % trackObjs.length];
    function on() { trackObjs.forEach((t) => (t.material.opacity = t === line ? 1 : 0.07)); }
    function off() { trackObjs.forEach((t) => (t.material.opacity = t.userData.base)); }
    row.addEventListener('pointerenter', on);
    row.addEventListener('focus', on);
    row.addEventListener('pointerleave', off);
    row.addEventListener('blur', off);
  });

  let running = false, raf = 0;
  function frame() { raf = requestAnimationFrame(frame); applyScrub(step()); renderer.render(scene, camera); }
  function start() { if (!running) { running = true; frame(); } }
  function stop() { if (running) { running = false; cancelAnimationFrame(raf); } }

  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 }).observe(STAGE);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); WRAP.dataset.skipped = 'context-lost'; });

  let rt;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const nw = WRAP.clientWidth, nh = WRAP.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    }, 140);
  }).observe(WRAP);

  WRAP.dataset.live = 'true';
}

init();
