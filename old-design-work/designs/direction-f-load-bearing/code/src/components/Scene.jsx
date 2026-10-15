/* The R3F scene. Imported dynamically by Stage.jsx, so three / R3F / drei sit
 * in their own chunk and never block first paint.
 *
 * One InstancedMesh of a unit cylinder carries all 136 members. Matrices are
 * rewritten only when progress changes, and `frameloop="demand"` means a reader
 * who stops scrolling costs zero frames.
 */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { deflection, L, SPAN, EXAG } from '../lib/beam.js';

const DEPTH = 0.16;          // truss depth, world units
const MEMBERS = SPAN * 4;    // top chord, bottom chord, vertical, diagonal per bay

/* node positions for the deflected shape at a given load */
function nodes(load) {
  const top = [], bot = [];
  for (let i = 0; i <= SPAN; i++) {
    const x = (i / SPAN) * L;
    const y = -deflection(x, load) * EXAG;   // stated exaggeration, see beam.js
    top.push(new THREE.Vector3(x - L / 2, y + DEPTH / 2, 0));
    bot.push(new THREE.Vector3(x - L / 2, y - DEPTH / 2, 0));
  }
  return { top, bot };
}

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _scale = new THREE.Vector3();

function place(mesh, idx, a, b, thickness) {
  _dir.subVectors(b, a);
  const len = _dir.length();
  _mid.addVectors(a, b).multiplyScalar(0.5);
  _q.setFromUnitVectors(_up, _dir.normalize());
  _scale.set(thickness, len, thickness);
  _m.compose(_mid, _q, _scale);
  mesh.setMatrixAt(idx, _m);
}

function Truss({ progress }) {
  const ref = useRef();
  const invalidate = useThree((s) => s.invalidate);

  const geo = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 6, 1, true), []);
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#EDEDEA', transparent: true, opacity: 0.86 }),
    []
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const { top, bot } = nodes(progress);
    let i = 0;
    for (let b = 0; b < SPAN; b++) {
      place(mesh, i++, top[b], top[b + 1], 0.0012);      // top chord
      place(mesh, i++, bot[b], bot[b + 1], 0.0012);      // bottom chord
      place(mesh, i++, top[b], bot[b], 0.00085);         // vertical
      place(mesh, i++, bot[b], top[b + 1], 0.00065);     // diagonal
    }
    mesh.instanceMatrix.needsUpdate = true;
    invalidate();
  }, [progress, invalidate]);

  return <instancedMesh ref={ref} args={[geo, mat, MEMBERS]} frustumCulled={false} />;
}

/* The load rail: one amber line along the bottom chord whose length is the
   load fraction. The only accent-coloured thing in the scene. */
function LoadRail({ progress }) {
  const ref = useRef();
  const invalidate = useThree((s) => s.invalidate);
  const geo = useMemo(() => new THREE.BufferGeometry(), []);

  useLayoutEffect(() => {
    const n = 64;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      if (f > Math.max(progress, 0.001)) break;
      const x = f * L;
      pts.push(x - L / 2, -deflection(x, progress) * EXAG - DEPTH / 2 - 0.014, 0);
    }
    if (pts.length < 6) pts.push(-L / 2, -DEPTH / 2 - 0.012, 0, -L / 2, -DEPTH / 2 - 0.012, 0);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    geo.computeBoundingSphere();
    invalidate();
  }, [progress, geo, invalidate]);

  return (
    <line ref={ref} geometry={geo} frustumCulled={false}>
      <lineBasicMaterial color="#E0A95C" transparent opacity={0.95} />
    </line>
  );
}

const FOV = 34;
function Rig({ progress }) {
  const cam = useRef();
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const c = cam.current;
    if (!c) return;
    /* fov is VERTICAL, so the distance that fits the span depends on aspect.
       Hard-coding z made the span sit at 47% of frame width on a wide viewport
       and overflow on a narrow one. Derive it. */
    const aspect = Math.max(0.35, size.width / Math.max(1, size.height));
    const zFit = (L * 0.60) / (Math.tan((FOV * Math.PI) / 360) * aspect);
    /* Dolly along the span with a slight look-ahead toward midspan. One axis,
       driven by the reader. No orbit controls. */
    /* Close enough to read as one continuous take along the structure, far
       enough that the members read as members rather than slabs. */
    /* Near enough to perpendicular that both supports and the sag stay legible.
       A raking view along the span looks cinematic and reads as a fence. The
       travel is a dolly in: the whole structure unloaded, then closer as the
       load rises. */
    const x = THREE.MathUtils.lerp(-L * 0.07, L * 0.05, progress);
    const y = THREE.MathUtils.lerp(0.11, -0.13, progress) * Math.min(1.4, zFit);
    const z = THREE.MathUtils.lerp(zFit, zFit * 0.76, progress);
    c.position.set(x, y, z);
    c.lookAt(THREE.MathUtils.lerp(0, L * 0.02, progress),
             THREE.MathUtils.lerp(-0.004, -0.07, progress), 0);
    c.updateProjectionMatrix();
    invalidate();
  }, [progress, invalidate, size]);
  return <PerspectiveCamera ref={cam} makeDefault fov={FOV} near={0.01} far={40} />;
}

/* Mount-only. An effect keyed on the callback identity re-ran on every scrub
   tick and cancelled its own pending frame, so the plate never lifted. */
function Ready({ onReady }) {
  const cb = useRef(onReady);
  cb.current = onReady;
  useEffect(() => {
    const id = requestAnimationFrame(() => cb.current && cb.current());
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}

export default function Scene({ progress, onReady }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AdaptiveDpr pixelated={false} />
      <Rig progress={progress} />
      <Truss progress={progress} />
      <LoadRail progress={progress} />
      <Ready onReady={onReady} />
    </Canvas>
  );
}
