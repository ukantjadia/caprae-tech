/* 3D fields for E-4 and E-5, rendered by Three.js inside a Web Worker on an
 * OffscreenCanvas.
 *
 * Running WebGL in the worker is the reason these can be large without costing
 * scroll smoothness. The main thread never touches the render loop, so a stall
 * in the page cannot stutter the field and the field cannot stutter the page.
 *
 *   spine      E-4. A deep well of thin plates registered to one vertical line.
 *   overprint  E-5. Two dot plates in real 3D space, drifting out of register.
 *              The moiré is genuine interference between two surfaces, not a
 *              texture trick.
 *
 * Both are pure functions of (attributes, time). Nothing accumulates.
 */
import * as THREE from 'three';

let renderer, scene, camera, kind = 'spine';
let running = false, last = 0, clock = 0, reduced = false;
let scroll = 0, scrollTarget = 0;
let plates = null, plateData = null;
let gridA = null, gridB = null;
let W = 1, H = 1, DPR = 1;

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/* ---------------------------------------------------------------- E-4 spine */
/* Thin plates hanging off one vertical line, receding into depth. The line is
   the constant; how far each plate reaches from it is what varies. Same rule
   the page layout follows, carried into three dimensions. */
const PLATE_N = 190;

function buildSpine(colors) {
  const r = rng(0x5EED0004);
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colors.ink), roughness: 0.62, metalness: 0.04,
    emissive: new THREE.Color(colors.emissive), emissiveIntensity: 1,
    transparent: true, opacity: 0.92,
  });
  plates = new THREE.InstancedMesh(geo, mat, PLATE_N);
  plates.frustumCulled = false;
  plateData = [];
  for (let i = 0; i < PLATE_N; i++) {
    plateData.push({
      y: (i / PLATE_N) * 46 - 23,          // stacked along the spine
      reach: 0.5 + Math.pow(r(), 1.7) * 6.2, // how far it extends. never mirrored
      side: r() > 0.22 ? 1 : -1,           // mostly right of the line
      z: (r() - 0.5) * 3.4,
      tilt: (r() - 0.5) * 0.22,
      thick: 0.012 + r() * 0.03,
      h: 0.05 + r() * 0.12,
      hot: r() > 0.955,
      drift: 0.4 + r() * 1.5,
    });
  }
  scene.add(plates);

  const hotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.accent) });
  const hot = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), hotMat, 24);
  hot.frustumCulled = false;
  hot.name = 'hot';
  scene.add(hot);

  /* the spine itself, the one thing that never moves */
  const lineGeo = new THREE.BoxGeometry(0.014, 60, 0.014);
  const lineMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colors.accent), transparent: true, opacity: 0.30,
  });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.name = 'spine';
  scene.add(line);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xfff3e0, 2.4); key.position.set(3, 4, 5);
  const fill = new THREE.DirectionalLight(0x9fb4d0, 0.8); fill.position.set(-4, -1, -3);
  scene.add(key, fill);
  scene.fog = new THREE.Fog(new THREE.Color(colors.ground), 9, 34);
}

function drawSpine(t) {
  const hot = scene.getObjectByName('hot');
  let hi = 0;
  const travel = scroll * 30;
  for (let i = 0; i < PLATE_N; i++) {
    const p = plateData[i];
    let y = p.y + travel;
    /* wrap: pure function of (y, travel), so scrubbing back is exact */
    const span = 46;
    y = ((y + span / 2) % span + span) % span - span / 2;
    const sway = Math.sin(t * 0.22 * p.drift + i) * 0.11;
    _v.set(p.side * (p.reach * 0.5) + sway, y, p.z);
    _e.set(0, 0, p.tilt + sway * 0.12);
    _q.setFromEuler(_e);
    _s.set(p.reach, p.h, p.thick);
    _m.compose(_v, _q, _s);
    plates.setMatrixAt(i, _m);
    if (p.hot && hi < 24) {
      _s.set(p.reach * 1.02, 0.008, p.thick * 1.2);
      _m.compose(_v, _q, _s);
      hot.setMatrixAt(hi++, _m);
    }
  }
  plates.instanceMatrix.needsUpdate = true;
  hot.count = hi;
  hot.instanceMatrix.needsUpdate = true;

  camera.position.set(3.1, Math.sin(t * 0.06) * 0.5, 9.4 - scroll * 1.6);
  camera.lookAt(0, 0, 0);
}

/* ----------------------------------------------------------- E-5 overprint */
/* Two dot plates in real 3D space. One drifts out of register against the
   other, and the moiré you see is genuine interference between two surfaces at
   slightly different angles. That is what misregistration actually is. */
const GX = 132, GY = 88;

function buildPlate(color, opacity) {
  const geo = new THREE.CircleGeometry(0.5, 10);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color), transparent: true, opacity,
    blending: THREE.NormalBlending, depthWrite: false,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, GX * GY);
  mesh.frustumCulled = false;
  let i = 0;
  const w = 26, h = 17;
  for (let x = 0; x < GX; x++) {
    for (let y = 0; y < GY; y++) {
      _v.set((x / (GX - 1) - 0.5) * w, (y / (GY - 1) - 0.5) * h, 0);
      _q.identity();
      _s.set(0.075, 0.075, 1);
      _m.compose(_v, _q, _s);
      mesh.setMatrixAt(i++, _m);
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

function buildOverprint(colors) {
  gridA = buildPlate(colors.inkA, 0.62);
  gridB = buildPlate(colors.inkB, 0.66);
  scene.add(gridA, gridB);
  scene.background = null;
}

function drawOverprint(t) {
  /* plate A is the key and holds still. plate B is the one out of register. */
  gridA.position.set(0, 0, 0);
  gridA.rotation.set(0, 0, 0);

  const slip = 0.010 + scroll * 0.055;
  gridB.position.set(
    Math.sin(t * 0.13) * 0.16 + scroll * 0.5,
    Math.cos(t * 0.11) * 0.12,
    0.55,
  );
  gridB.rotation.set(0, 0, slip + Math.sin(t * 0.07) * 0.004);

  camera.position.set(
    Math.sin(t * 0.05) * 0.5,
    Math.cos(t * 0.043) * 0.32,
    13.5 - scroll * 2.2,
  );
  camera.lookAt(0, 0, 0);
}

/* ------------------------------------------------------------------ loop */
function frame(now) {
  if (!running) return;
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  clock += dt;
  scroll += (scrollTarget - scroll) * (1 - Math.pow(0.02, dt));
  paint(clock);
}

function paint(t) {
  if (kind === 'spine') drawSpine(t); else drawOverprint(t);
  renderer.render(scene, camera);
}

function resize(w, h, dpr) {
  W = w; H = h; DPR = dpr;
  renderer.setPixelRatio(1);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

self.onmessage = (e) => {
  const d = e.data;
  if (d.type === 'init') {
    kind = d.kind; reduced = d.reduced;
    renderer = new THREE.WebGLRenderer({
      canvas: d.canvas, antialias: false, alpha: true, powerPreference: 'low-power',
    });
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, d.w / d.h, 0.1, 120);
    if (kind === 'spine') buildSpine(d.colors); else buildOverprint(d.colors);
    resize(d.w, d.h, d.dpr);
    if (reduced) {
      scroll = scrollTarget = 0.25;
      paint(7.4);                 // one composed still, chosen and checked
    } else {
      running = true; last = performance.now();
      requestAnimationFrame(frame);
    }
  } else if (d.type === 'resize') {
    resize(d.w, d.h, d.dpr);
    if (reduced) paint(7.4);
  } else if (d.type === 'scroll') {
    scrollTarget = d.p;
  } else if (d.type === 'vis') {
    if (d.hidden) running = false;
    else if (!reduced && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }
};
