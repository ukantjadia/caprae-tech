/* Deal-flow field. The one 3D island. Spec: ../layout.md, D-012.
 *
 * Points are companies. Most drift unsorted. Every 8 to 12 seconds a subset
 * brightens and a path threads through them to a single point: origination,
 * then a close.
 *
 * Budget per ../architecture.md: 2 draw calls, 0 textures, no post-processing,
 * DPR capped, 60fps on integrated graphics.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const PANEL = document.getElementById('panel');
const POSTER = document.getElementById('poster');

const COUNT = 2600;          // points in the field
const PATH_N = 12;           // points in a resolved path
const CYCLE = 10.0;          // seconds between resolutions
const DRAW = 1.2;            // path draw duration
const HOLD = 2.0;            // path hold duration
const FADE = 1.0;            // path fade duration

// Resting points use --panel-ink, not --ink-muted. --ink-muted is a light-page
// token; on --panel it renders at roughly 1.4:1 and disappears. Depth is still
// carried by per-point alpha, so the field reads grey, not white.
const FIELD = new THREE.Color('#E8E6E1');
const ACCENT = new THREE.Color('#B4541F');      // selected points
const ACCENT_DIM = new THREE.Color('#7A3814');  // the path line

// ---- kill switches. Any one of these leaves the poster in place. ----

function shouldSkip() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced-motion';
  if (document.documentElement.dataset.motion === 'off') return 'motion-off';
  if ((navigator.hardwareConcurrency || 8) < 4) return 'low-core';
  const c = navigator.connection;
  if (c && c.saveData) return 'save-data';
  if (window.innerWidth < 480) return 'too-narrow';
  try {
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2') && !probe.getContext('webgl')) return 'no-webgl';
  } catch (e) { return 'no-webgl'; }
  return null;
}

function init() {
  const skip = shouldSkip();
  if (skip) { PANEL.dataset.skipped = skip; return; }

  const w = PANEL.clientWidth, h = PANEL.clientHeight;
  if (!w || !h) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));  // capped, not unbounded
  renderer.setSize(w, h, false);
  renderer.setClearColor('#0B0C0E', 1);
  PANEL.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  // ---- draw call 1: the field ----------------------------------------

  const pos = new Float32Array(COUNT * 3);
  const alpha = new Float32Array(COUNT);
  const size = new Float32Array(COUNT);
  const flare = new Float32Array(COUNT);   // 0 resting, 1 selected

  for (let i = 0; i < COUNT; i++) {
    // Uneven radial distribution so the field clusters rather than reading
    // as a uniform sphere of dots.
    const r = 3.4 * Math.cbrt(Math.random()) * (0.55 + 0.45 * Math.random());
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.25;
    pos[i * 3 + 1] = r * Math.cos(ph) * 1.35;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    alpha[i] = 0.10 + Math.random() * 0.32;   // depth via opacity, no fog
    size[i] = 1.0 + Math.random() * 1.4;
    flare[i] = 0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aFlare', new THREE.BufferAttribute(flare, 1));

  const pointsMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uDpr: { value: renderer.getPixelRatio() },
      uRest: { value: FIELD },
      uHot: { value: ACCENT },
    },
    vertexShader: `
      attribute float aAlpha, aSize, aFlare;
      varying float vAlpha; varying float vFlare;
      uniform float uDpr;
      void main() {
        vAlpha = aAlpha; vFlare = aFlare;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (aSize + aFlare * 1.6) * uDpr * (20.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vAlpha; varying float vFlare;
      uniform vec3 uRest, uHot;
      void main() {
        // round point, hard-ish edge. No glow, no bloom.
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        vec3 c = mix(uRest, uHot, vFlare);
        float a = mix(vAlpha, 0.9, vFlare);
        gl_FragColor = vec4(c, a);
      }`,
  });

  const points = new THREE.Points(geo, pointsMat);
  group.add(points);

  // ---- draw call 2: the resolved path --------------------------------

  const pathGeo = new THREE.BufferGeometry();
  pathGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PATH_N * 3), 3));
  const pathMat = new THREE.LineBasicMaterial({ color: ACCENT_DIM, transparent: true, opacity: 0 });
  const path = new THREE.Line(pathGeo, pathMat);
  path.frustumCulled = false;
  group.add(path);

  // ---- the resolution cycle -------------------------------------------

  let selected = [];
  let tCycle = CYCLE - 2.5;   // first resolution comes soon after load

  function pickPath() {
    // Start from an outer point, walk inward by nearest neighbour, end near
    // the centre-bottom. Search is a bounded sample, not a full O(n) scan.
    const out = [];
    let cur = -1, best = -1;
    for (let k = 0; k < 40; k++) {
      const i = (Math.random() * COUNT) | 0;
      const d = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
      if (d > best) { best = d; cur = i; }
    }
    out.push(cur);
    const used = new Set(out);
    for (let s = 1; s < PATH_N; s++) {
      let pick = -1, pd = Infinity;
      const cx = pos[cur * 3], cy = pos[cur * 3 + 1], cz = pos[cur * 3 + 2];
      for (let k = 0; k < 160; k++) {
        const i = (Math.random() * COUNT) | 0;
        if (used.has(i)) continue;
        // Bias inward and downward: the path resolves toward a close.
        const dx = pos[i * 3] - cx, dy = pos[i * 3 + 1] - cy, dz = pos[i * 3 + 2] - cz;
        const step = dx * dx + dy * dy + dz * dz;
        const inward = pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2;
        const score = step * 2.2 + inward * 0.30 + (pos[i * 3 + 1] > cy ? 0.9 : 0);
        if (score < pd) { pd = score; pick = i; }
      }
      if (pick < 0) break;
      used.add(pick); out.push(pick); cur = pick;
    }
    return out;
  }

  function writePath(n) {
    const a = pathGeo.attributes.position.array;
    for (let s = 0; s < PATH_N; s++) {
      const i = selected[Math.min(s, selected.length - 1)];
      const src = (s < n) ? i : selected[Math.max(0, Math.min(n - 1, selected.length - 1))];
      a[s * 3] = pos[src * 3]; a[s * 3 + 1] = pos[src * 3 + 1]; a[s * 3 + 2] = pos[src * 3 + 2];
    }
    pathGeo.attributes.position.needsUpdate = true;
  }

  // ---- pointer parallax, damped, max 6 degrees -------------------------

  let px = 0, py = 0, tx = 0, ty = 0;
  PANEL.addEventListener('pointermove', (e) => {
    const r = PANEL.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }, { passive: true });
  PANEL.addEventListener('pointerleave', () => { tx = 0; ty = 0; }, { passive: true });

  // ---- loop, paused when offscreen or tab hidden -----------------------

  const MAX_TILT = 6 * Math.PI / 180;
  const clock = new THREE.Clock();
  let running = false, raf = 0, painted = false;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);

    group.rotation.y += dt * 0.055;
    px += (tx - px) * 0.045; py += (ty - py) * 0.045;
    group.rotation.x = -py * MAX_TILT;
    group.rotation.z = px * MAX_TILT * 0.35;

    tCycle += dt;
    const fl = geo.attributes.aFlare.array;

    if (tCycle >= CYCLE) {
      tCycle = 0;
      for (const i of selected) fl[i] = 0;
      selected = pickPath();
      writePath(0);
    }

    if (selected.length) {
      if (tCycle < DRAW) {
        const p = tCycle / DRAW;
        const n = Math.max(2, Math.ceil(p * selected.length));
        writePath(n);
        pathMat.opacity = 0.85;
        for (let s = 0; s < n; s++) fl[selected[s]] = 1;
      } else if (tCycle < DRAW + HOLD) {
        pathMat.opacity = 0.85;
      } else if (tCycle < DRAW + HOLD + FADE) {
        const p = (tCycle - DRAW - HOLD) / FADE;
        pathMat.opacity = 0.85 * (1 - p);
        for (const i of selected) fl[i] = 1 - p;
      } else {
        pathMat.opacity = 0;
        for (const i of selected) fl[i] = 0;
      }
      geo.attributes.aFlare.needsUpdate = true;
    }

    renderer.render(scene, camera);
    if (!painted) { painted = true; POSTER.classList.add('hide'); }
  }

  function start() { if (!running) { running = true; clock.getDelta(); frame(); } }
  function stop() { if (running) { running = false; cancelAnimationFrame(raf); } }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
  io.observe(PANEL);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault(); stop(); painted = false; POSTER.classList.remove('hide');
  });

  // resize
  let rt;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const nw = PANEL.clientWidth, nh = PANEL.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
      pointsMat.uniforms.uDpr.value = renderer.getPixelRatio();
    }, 120);
  }).observe(PANEL);

}

// LCP is the hero copy. The canvas waits for idle, and only then mounts.
if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 2500 });
else setTimeout(init, 1200);
