// Particle field built to Dala's measured spec (research/dala/05-particle-spec.md, D-065):
// a tetrahedral FRAME mesh (not a discard trick), flat colour x1.3, real alpha fading with
// depth over black, depthWrite on, front side, 1 rad/s spin phased by a noise field, hover
// handled in the vertex shader. Positions live on the GPU (velocity + position passes);
// physics is scaled by frame time so it never slows on a slow GPU.
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

// ---------- frame mesh ----------
// Tetrahedral frame, one triangular window per face: 4 outer corners, 4 inner corners,
// 3 window corners per face = 20 verts, 48 tris. window 0.586 gives bars 0.12 of the edge,
// Dala's ratio. Winding checked so every triangle faces out (outer ring) or in (inner ring).
export function frameTetra({ radius = 0.77, inner = 0.82, window = 0.586, sink = 0.024 } = {}) {
  const q = Math.sqrt
  const U = [[0, 1, 0], [-q(8 / 9), -1 / 3, 0], [q(2 / 9), -1 / 3, q(2 / 3)], [q(2 / 9), -1 / 3, -q(2 / 3)]].map(a => new THREE.Vector3(...a))
  const O = U.map(u => u.clone().multiplyScalar(radius))
  const I = U.map(u => u.clone().multiplyScalar(radius * inner))
  const edge = O[0].distanceTo(O[1])
  const verts = [...O, ...I], tris = []
  const tri = (a, b, c, out) => {
    const n = new THREE.Vector3().subVectors(verts[b], verts[a]).cross(new THREE.Vector3().subVectors(verts[c], verts[a]))
    const m = verts[a].clone().add(verts[b]).add(verts[c])
    tris.push(...((n.dot(m) > 0) === out ? [a, b, c] : [a, c, b]))
  }
  for (let k = 0; k < 4; k++) {
    const f = [0, 1, 2, 3].filter(i => i !== k)
    const g = f.reduce((s, i) => s.add(O[i]), new THREE.Vector3()).divideScalar(3)
    const n = g.clone().normalize()
    const h = f.map(i => { verts.push(g.clone().lerp(O[i], window).addScaledVector(n, -sink * edge)); return verts.length - 1 })
    for (let e = 0; e < 3; e++) {
      const a = f[e], b = f[(e + 1) % 3], ha = h[e], hb = h[(e + 1) % 3]
      tri(a, b, hb, true); tri(a, hb, ha, true)
      tri(a + 4, b + 4, hb, false); tri(a + 4, hb, ha, false)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts.flatMap(v => v.toArray()), 3))
  geo.setIndex(tris)
  return geo
}

function instanced(count) {
  const base = frameTetra(), geo = new THREE.InstancedBufferGeometry()
  geo.setAttribute('position', base.getAttribute('position'))
  geo.setIndex(base.getIndex())
  geo.instanceCount = count
  return geo
}

// Dala's per-point scale distribution (inverse CDF of its brain scale texture)
const Q = [[0, 0.004], [0.05, 0.126], [0.25, 0.275], [0.5, 0.345], [0.75, 0.404], [0.95, 0.463], [1, 0.494]]
function sizeFromU(u) {
  for (let i = 1; i < Q.length; i++) if (u <= Q[i][0]) {
    const [u0, s0] = Q[i - 1], [u1, s1] = Q[i]
    return s0 + (s1 - s0) * (u - u0) / (u1 - u0)
  }
  return Q[Q.length - 1][1]
}

// hex -> linear-free 0..1 triplet: Dala writes colour x1.3 straight to the canvas, no encoding
const rgb = hex => { const n = parseInt(hex.slice(1), 16); return new THREE.Vector3((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255) }

const ROTATION = /* glsl */ `
mat3 rotation(vec3 axis, float a) {
  float s = sin(a), c = cos(a), oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
    oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
    oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c);
}
// smooth low-frequency field, stands in for Dala's snoise(pos * 0.619)
float field(vec3 p) {
  p *= 0.619;
  return sin(p.x * 1.7 + sin(p.y * 1.3)) + sin(p.y * 1.9 + sin(p.z * 1.1)) + sin(p.z * 1.5 + sin(p.x * 1.2));
}
`

// ---------- field ----------
export async function createField(renderer, cfg, onProgress = () => {}) {
  const { SIDE, SHAPES, SIM, PALETTE } = cfg
  const N = SIDE * SIDE, COUNT = SHAPES.length

  // shapes.bin: Uint16 x4 per point (see bake.js), streamed so the loader can show progress
  const bytes = new Uint8Array(N * 4 * COUNT * 2)
  const reader = (await fetch(`${import.meta.env.BASE_URL}shapes.bin`)).body.getReader()
  for (let got = 0; ;) {
    const { done, value } = await reader.read()
    if (done) { if (got !== bytes.length) throw new Error('shapes.bin does not match config, run `bun run bake`'); break }
    if (got + value.length > bytes.length) throw new Error('shapes.bin does not match config, run `bun run bake`')
    bytes.set(value, got); got += value.length; onProgress(got / bytes.length)
  }
  const raw = new Uint16Array(bytes.buffer)
  const shapeData = new Float32Array(N * 4 * COUNT)
  for (let i = 0; i < raw.length; i++) shapeData[i] = i % 4 === 3 ? raw[i] / 65535 : raw[i] / 65535 * 2 - 1
  const tShapes = new THREE.DataTexture(shapeData, SIDE, SIDE * COUNT, THREE.RGBAFormat, THREE.FloatType)
  tShapes.needsUpdate = true
  const randData = new Float32Array(N * 4).map(Math.random)
  const tRand = new THREE.DataTexture(randData, SIDE, SIDE, THREE.RGBAFormat, THREE.FloatType)
  tRand.needsUpdate = true

  const radii = SHAPES.map(s => s.radius)
  const TARGET = /* glsl */ `
  uniform sampler2D tShapes;
  uniform sampler2D tRand;
  uniform float uProgress, uExplode, uShow, uStagger;
  uniform float uRadius[${COUNT}];
  uniform vec3 uCloud;
  vec4 shapeAt(vec2 uv, int i) {
    vec4 s = texture2D(tShapes, vec2(uv.x, (uv.y + float(i)) / ${COUNT}.0));
    return vec4(s.xyz * uRadius[i], s.w);
  }
  // xyz = target position, w = target visibility
  vec4 targetAt(vec2 uv, vec4 r) {
    vec4 t = shapeAt(uv, 0);
    for (int k = 1; k < ${COUNT}; k++) {
      float p = clamp((uProgress - float(k - 1)) * (1.0 + uStagger) - uStagger * r.x, 0.0, 1.0);
      t = mix(t, shapeAt(uv, k), p);
    }
    t.xyz *= mix(1.0 + r.z * 3.0, 1.0, uShow); // intro: gather in from scattered
    vec3 cloud = (vec3(r.y, r.z, r.w) * 2.0 - 1.0) * uCloud;
    float e = clamp(uExplode * (1.0 + uStagger) - uStagger * r.y, 0.0, 1.0);
    return vec4(mix(t.xyz, cloud, e), mix(t.w, 1.0, e)); // the cloud shows every particle
  }`

  const VELOCITY = TARGET + /* glsl */ `
  uniform float uSpring, uSpringRand, uFriction, uStep;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 pos = texture2D(texturePosition, uv).xyz;
    vec4 vel = texture2D(textureVelocity, uv);
    vec4 r = texture2D(tRand, uv);
    vec4 t = targetAt(uv, r);
    // Dala's spring + friction, applied per 1/60 s so a slow frame does not slow the motion
    vec3 v = (vel.xyz + (t.xyz - pos) * (uSpring + r.w * uSpringRand) * uStep) * pow(uFriction, uStep);
    float vis = mix(vel.w, t.w, 1.0 - pow(0.9, uStep)); // fade visibility in and out smoothly
    gl_FragColor = vec4(v, vis);
  }`
  const POSITION = /* glsl */ `
  uniform float uStep;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = vec4(texture2D(texturePosition, uv).xyz + texture2D(textureVelocity, uv).xyz * uStep, 1.0);
  }`

  const gpu = new GPUComputationRenderer(SIDE, SIDE, renderer)
  const pos0 = gpu.createTexture(), vel0 = gpu.createTexture()
  for (let i = 0; i < N; i++) {
    const spread = 1 + randData[i * 4 + 2] * 3
    for (let c = 0; c < 3; c++) pos0.image.data[i * 4 + c] = shapeData[i * 4 + c] * radii[0] * spread
    pos0.image.data[i * 4 + 3] = 1
    vel0.image.data[i * 4 + 3] = shapeData[i * 4 + 3]
  }
  const velVar = gpu.addVariable('textureVelocity', VELOCITY, vel0)
  const posVar = gpu.addVariable('texturePosition', POSITION, pos0)
  gpu.setVariableDependencies(velVar, [posVar, velVar])
  gpu.setVariableDependencies(posVar, [posVar, velVar])
  const u = velVar.material.uniforms
  Object.assign(u, {
    tShapes: { value: tShapes }, tRand: { value: tRand },
    uProgress: { value: 0 }, uExplode: { value: 0 }, uShow: { value: 0 }, uStagger: { value: SIM.stagger },
    uRadius: { value: radii }, uCloud: { value: new THREE.Vector3(...SIM.cloud) },
    uSpring: { value: SIM.spring }, uSpringRand: { value: SIM.springRand }, uFriction: { value: SIM.friction },
    uStep: { value: 1 },
  })
  posVar.material.uniforms.uStep = u.uStep
  const err = gpu.init()
  if (err) throw new Error(err)

  // ---------- shape particles ----------
  const geo = instanced(N)
  const ref = new Float32Array(N * 2), rand = new Float32Array(N * 4), size = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    ref[i * 2] = (i % SIDE + 0.5) / SIDE
    ref[i * 2 + 1] = (Math.floor(i / SIDE) + 0.5) / SIDE
    for (let c = 0; c < 4; c++) rand[i * 4 + c] = Math.random()
    size[i] = sizeFromU(Math.random())
  }
  geo.setAttribute('aRef', new THREE.InstancedBufferAttribute(ref, 2))
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rand, 4))
  geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 1))

  // palette as cumulative shares, Dala's balance: one dominant ~40%, one ~25%, accents
  const cols = PALETTE.map(([hex]) => rgb(hex)), cuts = []
  PALETTE.reduce((acc, [, share]) => { cuts.push(acc + share); return acc + share }, 0)

  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: true, depthTest: true, side: THREE.FrontSide,
    uniforms: {
      tPos: { value: null }, tVel: { value: null }, uTime: { value: 0 }, uFocus: { value: 10 },
      uScale: { value: SIM.particleScale }, uMouse: { value: new THREE.Vector3(99, 99, 0) }, uDelta: { value: 0 },
      uCols: { value: cols }, uCuts: { value: cuts },
    },
    vertexShader: /* glsl */ `
      attribute vec2 aRef;
      attribute vec4 aRand;
      attribute float aSize;
      uniform sampler2D tPos, tVel;
      uniform float uTime, uFocus, uScale, uDelta;
      uniform vec3 uMouse;
      uniform vec3 uCols[${cols.length}];
      uniform float uCuts[${cols.length}];
      varying vec3 vColor;
      varying float vAlpha;
      ${ROTATION}
      void main() {
        vec3 p = texture2D(tPos, aRef).xyz;
        float vis = texture2D(tVel, aRef).w;
        // hover, as Dala does it in the vertex shader: particles near the cursor wobble and grow
        vec4 wp = modelMatrix * vec4(p, 1.0);
        float hover = smoothstep(1.25 + uDelta, 0.0, distance(wp.xy, uMouse.xy));
        p.x += hover * sin(uTime * (1.0 + aRand.y * 3.0)) * (aRand.z * 0.35 + uDelta) * 0.6;
        p.y += hover * cos(uTime * (1.0 + aRand.y * 3.0)) * (aRand.z * 0.35 + uDelta) * 0.6;
        // 1 rad/s around (0,1,1), phase from a smooth field so neighbours turn together
        mat3 R = rotation(normalize(vec3(0.0, 1.0, 1.0)), mod(field(p) + uTime, 6.2832));
        float s = uScale * aSize + hover * 0.075;
        vec4 mv = modelViewMatrix * vec4(p + R * position * s, 1.0);
        gl_Position = projectionMatrix * mv;
        // colour regions from a slow field over position, cut at the palette shares
        float v = fract(0.5 + 0.5 * sin(field(p * 0.35) * 1.3 + aRand.x * 0.35));
        vec3 col = uCols[${cols.length - 1}];
        for (int k = ${cols.length - 1}; k >= 0; k--) if (v < uCuts[k]) col = uCols[k];
        vColor = mix(col, vec3(0.45), hover * 0.6);
        // Dala: alpha = smoothstep(-4.5, 4, z) with z measured from the shape's centre
        vAlpha = smoothstep(-4.5, 4.0, mv.z + uFocus) * vis;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        if (vAlpha < 0.02) discard; // parked or faded particles must not write depth
        gl_FragColor = vec4(vColor * 1.3, vAlpha);
      }`,
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false

  return {
    mesh, uniforms: u, material,
    // dev: current particle positions and visibility, read back from the GPU
    readPositions() {
      const p = new Float32Array(N * 4), v = new Float32Array(N * 4)
      renderer.readRenderTargetPixels(gpu.getCurrentRenderTarget(posVar), 0, 0, SIDE, SIDE, p)
      renderer.readRenderTargetPixels(gpu.getCurrentRenderTarget(velVar), 0, 0, SIDE, SIDE, v)
      return { p, v, N }
    },
    update(time, dt) {
      u.uStep.value = Math.min(dt * 60, 3) // 1 = one 60fps frame
      gpu.compute()
      material.uniforms.tPos.value = gpu.getCurrentRenderTarget(posVar).texture
      material.uniforms.tVel.value = gpu.getCurrentRenderTarget(velVar).texture
      material.uniforms.uTime.value = time
    },
  }
}

// ---------- front cones (Dala's floating dust): same frame, between the shape and the camera ----------
export function createDust(cfg) {
  const { DUST, PALETTE, CAMERA } = cfg
  const n = DUST.count
  const geo = instanced(n)
  const off = new Float32Array(n * 3), rand = new Float32Array(n * 4), col = new Float32Array(n * 3)
  const halfH = CAMERA.z * Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2))
  const accents = PALETTE.slice(0, 4).map(([hex]) => rgb(hex))
  for (let i = 0; i < n; i++) {
    const z = 0.1 + Math.random() * 9, spread = halfH * 2.1 * THREE.MathUtils.lerp(1, 0.4, z / 9.1)
    off[i * 3] = (Math.random() * 2 - 1) * spread * 1.1
    off[i * 3 + 1] = (Math.random() * 2 - 1) * spread * 0.6
    off[i * 3 + 2] = z
    for (let c = 0; c < 4; c++) rand[i * 4 + c] = Math.random()
    accents[i % accents.length].toArray(col, i * 3)
  }
  geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(off, 3))
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rand, 4))
  geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(col, 3))
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: true, side: THREE.FrontSide,
    uniforms: { uTime: { value: 0 }, uScale: { value: DUST.scale } },
    vertexShader: /* glsl */ `
      attribute vec3 aOffset;
      attribute vec4 aRand;
      attribute vec3 aColor;
      uniform float uTime, uScale;
      varying vec3 vColor;
      varying float vAlpha;
      ${ROTATION}
      void main() {
        vec3 p = aOffset + vec3(sin(uTime * 0.2 + aRand.x * 6.28), cos(uTime * 0.17 + aRand.y * 6.28), 0.0) * 0.15;
        mat3 R = rotation(normalize(aRand.xyz - 0.5 + 1e-3), uTime * (0.17 + aRand.w * 0.3) + aRand.x * 6.28);
        vec4 mv = modelViewMatrix * vec4(p + R * position * uScale, 1.0);
        gl_Position = projectionMatrix * mv;
        vColor = aColor;
        vAlpha = aRand.w; // Dala: random alpha 0..1 per cone
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        if (vAlpha < 0.02) discard;
        gl_FragColor = vec4(vColor * 1.3, vAlpha);
      }`,
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false
  return { mesh, update(time) { material.uniforms.uTime.value = time } }
}
