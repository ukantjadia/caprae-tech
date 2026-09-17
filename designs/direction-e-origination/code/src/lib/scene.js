/* ORIGINATION — the Three.js scene.
 *
 * Loaded dynamically so three never blocks first paint, and never fetched at
 * all by a reader who asked for reduced motion.
 *
 * Three things v1 did not do, and they are the whole upgrade:
 *   1. Bodies are velocity-stretched streaks, not dots, so the cycle law is
 *      VISIBLE rather than merely true. v1 proved in the console that inner
 *      bands move 2.6x faster and showed none of it on screen.
 *   2. Depth of field is built FROM the particles: a circle of confusion drives
 *      size up and alpha down so energy is conserved. No blur pass.
 *   3. The resolved path is a tapering camera-facing ribbon with a travelling
 *      head, not a 1px aliased polyline.
 */
import * as THREE from 'three';
import { buildField, positionAt, routeOf, TAU } from './field.js';

const PAPER = new THREE.Color('#E8E6E1');
const STAMP = new THREE.Color('#D4482E');
const WARM = new THREE.Color('#F2D4A8');
const COOL = new THREE.Color('#C7D2DE');

/* ---------------------------------------------------------------- streaks */
/* One instanced quad per body, oriented along its own analytic velocity.
   42k instances, two triangles each, one draw call. */
const STREAK_VS = /* glsl */ `
precision highp float;
attribute vec3 position;         // unit quad corner, -0.5..0.5 in xy
attribute vec3 aPos;             // world position this frame
attribute vec3 aVel;             // analytic velocity
attribute vec4 aMeta;            // alpha, size, warm, isClose

uniform mat4 uProj, uView;
uniform float uPx;               // pixel scale
uniform float uFocus;            // focal distance
uniform float uAperture;         // CoC strength
uniform float uStreak;           // global streak length multiplier
uniform float uDim;              // legibility step-back behind running text

varying float vAlpha;
varying vec3 vCol;
varying vec2 vUv;
varying float vCoc;

void main() {
  vec4 mv = uView * vec4(aPos, 1.0);
  float dist = max(0.25, -mv.z);

  /* Circle of confusion. Out-of-focus bodies get BIGGER and DIMMER so total
     energy is roughly conserved: that is what makes it read as defocus rather
     than as fade. Built from the particles, no blur pass. */
  float coc = clamp(abs(dist - uFocus) * uAperture, 0.0, 1.0);
  /* The close is the focal subject: it never defocuses into a bokeh disc
     large enough to sit on top of the running copy. */
  coc *= (1.0 - aMeta.w * 0.85);
  vCoc = coc;

  /* Size is written in VIEW space, so it must scale with distance to hold a
     constant apparent size. Without that factor the near bodies render as
     slabs and the far ones vanish. */
  float world = uPx * dist;
  float size = aMeta.y * world * (1.0 + coc * 3.0);
  /* Energy is roughly conserved: a defocused body spreads and dims, which is
     what makes it read as defocus rather than as a fade. */
  float alpha = aMeta.x / (1.0 + coc * 2.6);

  /* Velocity in view space, projected to screen. The streak is the body's own
     displacement, so a faster body is visibly a longer mark. */
  vec4 mvTip = uView * vec4(aPos + aVel, 1.0);
  vec2 dir = mvTip.xy - mv.xy;
  float speed = length(dir);
  vec2 axis = speed > 1e-6 ? dir / speed : vec2(1.0, 0.0);
  vec2 perp = vec2(-axis.y, axis.x);

  /* Capped: past roughly 3x the field stops reading as motion and starts
     reading as an explosion. */
  float len = size * (1.0 + min(speed * uStreak / max(size, 1e-5), 3.0));
  len = mix(len, size, aMeta.w);            // the close is never stretched

  vec2 offset = axis * (position.x * len) + perp * (position.y * size);
  mv.xy += offset;

  vUv = position.xy * 2.0;
  vAlpha = alpha * uDim;
  vCol = mix(vec3(0.780, 0.822, 0.886), vec3(0.949, 0.831, 0.639), aMeta.z);
  vCol = mix(vCol, vec3(1.0), aMeta.w);
  gl_Position = uProj * mv;
}`;

const STREAK_FS = /* glsl */ `
precision highp float;
varying float vAlpha;
varying vec3 vCol;
varying vec2 vUv;
varying float vCoc;

void main() {
  /* Along the streak the falloff is soft; across it, tight. A defocused body
     loses its core and keeps only the halo, which is how real bokeh behaves. */
  float across = abs(vUv.y);
  float along  = abs(vUv.x);
  float r = max(across, along * 0.55);
  if (r > 1.0) discard;
  float core = exp(-r * 5.2) * (1.0 - vCoc * 0.80);
  float halo = exp(-r * 1.7) * (0.30 + vCoc * 0.55);
  gl_FragColor = vec4(vCol, (core + halo) * vAlpha);
}`;

/* ----------------------------------------------------------------- ribbon */
const RIBBON_VS = /* glsl */ `
precision highp float;
attribute vec3 position;         // the route point
attribute vec3 aNext;
attribute vec2 aSide;            // x: side -1/1, y: t along route 0..1
uniform mat4 uProj, uView;
uniform float uWidth, uHead, uAspect;
varying float vT, vEdge;
void main() {
  vec4 a = uView * vec4(position, 1.0);
  vec4 b = uView * vec4(aNext, 1.0);
  vec2 d = normalize((b.xy - a.xy) + vec2(1e-6));
  vec2 n = vec2(-d.y, d.x);
  /* Taper from rim to close, and swell slightly at the travelling head. */
  float t = aSide.y;
  float taper = mix(0.35, 1.0, smoothstep(0.0, 0.35, t)) * mix(1.0, 0.45, smoothstep(0.75, 1.0, t));
  float headBoost = 1.0 + 2.2 * exp(-pow((t - uHead) * 14.0, 2.0));
  a.xy += n * aSide.x * uWidth * taper * headBoost;
  vT = t;
  vEdge = aSide.x;
  gl_Position = uProj * a;
}`;

const RIBBON_FS = /* glsl */ `
precision highp float;
uniform float uHead, uFade;
varying float vT, vEdge;
void main() {
  float edge = 1.0 - abs(vEdge);
  float body = smoothstep(0.0, 0.55, edge);
  float head = exp(-pow((vT - uHead) * 12.0, 2.0));
  float a = (0.34 * body + 0.80 * head * body) * uFade;
  a *= smoothstep(0.0, 0.10, vT);
  gl_FragColor = vec4(0.831, 0.282, 0.180, a);
}`;

/* ------------------------------------------------------------- substrate */
/* A faint reference plane so the disc sits in space instead of floating in
   void. This is the instrument register: it is what separates a measured field
   from a screensaver. Rings only, no fill, no gradient on a surface. */
function makeSubstrate() {
  const g = new THREE.BufferGeometry();
  const pts = [];
  const rings = [0.5, 0.9, 1.3, 1.7];
  for (const r of rings) {
    const seg = 180;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * TAU, a1 = ((i + 1) / seg) * TAU;
      pts.push(Math.cos(a0) * r, Math.sin(a0) * r, 0, Math.cos(a1) * r, Math.sin(a1) * r, 0);
    }
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const m = new THREE.LineBasicMaterial({
    color: PAPER, transparent: true, opacity: 0.052, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.LineSegments(g, m);
}

/* ------------------------------------------------------------------ scene */
export function createScene(canvas, opts = {}) {
  const N = opts.count || 42000;
  const { bodies, survivors } = buildField(N);

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: false, alpha: true, powerPreference: 'low-power',
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  /* ---- streak geometry ---- */
  const quad = new Float32Array([
    -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0,
    -0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
  ]);
  const geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(quad, 3));
  const aPos = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
  const aVel = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
  const aMeta = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4);
  aPos.setUsage(THREE.DynamicDrawUsage);
  aVel.setUsage(THREE.DynamicDrawUsage);
  aMeta.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('aPos', aPos);
  geo.setAttribute('aVel', aVel);
  geo.setAttribute('aMeta', aMeta);
  geo.instanceCount = N;

  const streakMat = new THREE.RawShaderMaterial({
    vertexShader: STREAK_VS, fragmentShader: STREAK_FS,
    transparent: true, depthTest: false, depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor,
    uniforms: {
      uProj: { value: camera.projectionMatrix },
      uView: { value: camera.matrixWorldInverse },
      uPx: { value: 0.0027 },
      uFocus: { value: 4.6 },
      uAperture: { value: 0.14 },
      uStreak: { value: 0.55 },
      uDim: { value: 1.0 },
    },
  });
  const streaks = new THREE.Mesh(geo, streakMat);
  streaks.frustumCulled = false;
  scene.add(streaks);

  /* ---- ribbon ---- */
  const RN = 96;
  const rGeo = new THREE.BufferGeometry();
  const rP = new Float32Array(RN * 2 * 3);
  const rNext = new Float32Array(RN * 2 * 3);
  const rSide = new Float32Array(RN * 2 * 2);
  for (let i = 0; i < RN; i++) {
    rSide[(i * 2) * 2] = -1; rSide[(i * 2) * 2 + 1] = i / (RN - 1);
    rSide[(i * 2 + 1) * 2] = 1; rSide[(i * 2 + 1) * 2 + 1] = i / (RN - 1);
  }
  const idx = [];
  for (let i = 0; i < RN - 1; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, b, c, b, d, c);
  }
  rGeo.setAttribute('position', new THREE.BufferAttribute(rP, 3));
  rGeo.setAttribute('aNext', new THREE.BufferAttribute(rNext, 3));
  rGeo.setAttribute('aSide', new THREE.BufferAttribute(rSide, 2));
  rGeo.setIndex(idx);
  const ribbonMat = new THREE.RawShaderMaterial({
    vertexShader: RIBBON_VS, fragmentShader: RIBBON_FS,
    transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor,
    uniforms: {
      uProj: { value: camera.projectionMatrix },
      uView: { value: camera.matrixWorldInverse },
      uWidth: { value: 0.016 }, uHead: { value: 0 }, uFade: { value: 1 },
      uAspect: { value: 1 },
    },
  });
  const ribbon = new THREE.Mesh(rGeo, ribbonMat);
  ribbon.frustumCulled = false;
  scene.add(ribbon);

  const substrate = makeSubstrate();
  scene.add(substrate);

  /* ---- per-frame state ---- */
  const posArr = aPos.array, velArr = aVel.array, metaArr = aMeta.array;
  const tmp = { x: 0, y: 0, z: 0, s: 0, u: 0 };
  const tmp2 = { x: 0, y: 0, z: 0, s: 0, u: 0 };
  /* The lookahead that becomes the streak. Long lookaheads make the inward
     convergence dominate and the field reads as a starburst instead of a
     market in motion. */
  const DT = 0.026;

  let pathBody = survivors[0] || null;
  let hovered = null;

  function setRoute(b) {
    if (!b) return;
    pathBody = b;
    const pts = routeOf(b, RN);
    for (let i = 0; i < RN; i++) {
      const j = Math.min(RN - 1, i + 1);
      for (let k = 0; k < 3; k++) {
        rP[(i * 2) * 3 + k] = pts[i * 3 + k];
        rP[(i * 2 + 1) * 3 + k] = pts[i * 3 + k];
        rNext[(i * 2) * 3 + k] = pts[j * 3 + k];
        rNext[(i * 2 + 1) * 3 + k] = pts[j * 3 + k];
      }
    }
    rGeo.attributes.position.needsUpdate = true;
    rGeo.attributes.aNext.needsUpdate = true;
  }
  setRoute(pathBody);

  function writeBodies(t) {
    for (let i = 0; i < N; i++) {
      const b = bodies[i];
      positionAt(b, t, tmp);
      positionAt(b, t + DT, tmp2);
      const o3 = i * 3, o4 = i * 4;
      posArr[o3] = tmp.x; posArr[o3 + 1] = tmp.y; posArr[o3 + 2] = tmp.z;
      velArr[o3] = tmp2.x - tmp.x; velArr[o3 + 1] = tmp2.y - tmp.y; velArr[o3 + 2] = tmp2.z - tmp.z;

      let a;
      if (b.close) a = 1;
      else {
        a = 0.18 + 0.52 * ((b.seed * 13.7) % 1);
        if (tmp.s >= b.drop) {
          const g = Math.min(1, Math.max(0, (tmp.s - b.drop) / 0.16));
          a *= 1 - g * g * (3 - 2 * g);
        }
      }
      const large = b.close ? 0 : (((b.seed * 7.1) % 1) > 0.985 ? 1 : 0);
      if (hovered && b === hovered) a = Math.min(1, a * 3.4);
      metaArr[o4] = a;
      metaArr[o4 + 1] = b.close ? 11 : 1 + large * 3.1;
      metaArr[o4 + 2] = large;
      metaArr[o4 + 3] = b.close ? 1 : 0;
    }
    aPos.needsUpdate = true;
    aVel.needsUpdate = true;
    aMeta.needsUpdate = true;
  }

  const api = {
    renderer, scene, camera, bodies, survivors,
    get route() { return pathBody; },
    setRoute,
    setHover(b) { hovered = b; },
    setFocus(d, aperture) {
      streakMat.uniforms.uFocus.value = d;
      if (aperture != null) streakMat.uniforms.uAperture.value = aperture;
    },
    setStreak(v) { streakMat.uniforms.uStreak.value = v; },
    setDim(v) { streakMat.uniforms.uDim.value = v; },
    setRibbon(head, fade) {
      ribbonMat.uniforms.uHead.value = head;
      ribbonMat.uniforms.uFade.value = fade;
    },
    setSubstrate(o) { substrate.material.opacity = o; },
    resize(w, h, dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      ribbonMat.uniforms.uAspect.value = w / h;
      /* hold apparent size across viewport heights */
      streakMat.uniforms.uPx.value = 0.0027 * (755 / Math.max(360, h));
    },
    render(t) {
      writeBodies(t);
      camera.updateMatrixWorld();
      renderer.render(scene, camera);
    },
    dispose() {
      geo.dispose(); streakMat.dispose();
      rGeo.dispose(); ribbonMat.dispose();
      substrate.geometry.dispose(); substrate.material.dispose();
      renderer.dispose();
    },
  };
  return api;
}
