// GPGPU particle field, same model as Dala (research/dala/01-code-teardown.md):
// velocity and position live in float textures, each particle springs toward its
// point in the current target shape, and the blend between shapes is staggered per
// particle so the morph travels as a wave.
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { SIDE, SHAPES, SIM, PALETTE, FIELD_COLORS, CAMERA } from './config.js'
import { DEPTH_SCALE } from './post.js'

const N = SIDE * SIDE
const COUNT = SHAPES.length

// Shared by the velocity pass. Shapes are stacked vertically in one tall texture.
const TARGET = /* glsl */ `
uniform sampler2D tShapes;
uniform sampler2D tRand;
uniform float uProgress;
uniform float uShow;
uniform float uExplode;
uniform float uScale;
uniform float uStagger;
uniform vec3 uCloud;

vec3 shapeAt(vec2 uv, float i) {
  return (texture2D(tShapes, vec2(uv.x, (uv.y + i) / ${COUNT}.0)).xyz * 2.0 - 1.0) * uScale;
}

vec3 targetAt(vec2 uv, vec4 r) {
  vec3 t = shapeAt(uv, 0.0);
  for (int k = 1; k < ${COUNT}; k++) {
    float i = float(k);
    // each particle leaves at its own moment (r.x), so the morph is a wave
    float p = clamp((uProgress - (i - 1.0)) * (1.0 + uStagger) - uStagger * r.x, 0.0, 1.0);
    t = mix(t, shapeAt(uv, i), p);
  }
  t *= mix(1.0 + r.z * 3.0, 1.0, uShow);   // intro: start scattered, gather in
  // explode: each particle leaves for its own spot in a screen-wide cloud, staggered like the morph
  vec3 cloud = (vec3(r.y, r.z, r.w) * 2.0 - 1.0) * uCloud;
  float e = clamp(uExplode * (1.0 + uStagger) - uStagger * r.y, 0.0, 1.0);
  return mix(t, cloud, e);
}
`

const VELOCITY = TARGET + /* glsl */ `
uniform float uSpring;
uniform float uSpringRand;
uniform float uFriction;
uniform float uStep; // 1 = one 60 fps frame, so physics keeps its speed on a slow GPU (D-067)
uniform vec3 uMouse;
uniform float uMouseRadius;
uniform float uMouseForce;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  vec4 r = texture2D(tRand, uv);

  vel += (targetAt(uv, r) - pos) * (uSpring + r.w * uSpringRand) * uStep;

  vec3 d = pos - uMouse;
  float l = length(d);
  vel += d / max(l, 1e-4) * smoothstep(uMouseRadius, 0.0, l) * uMouseForce;

  vel *= pow(uFriction, uStep);
  gl_FragColor = vec4(vel, 1.0);
}
`

const POSITION = /* glsl */ `
uniform float uStep;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = vec4(texture2D(texturePosition, uv).xyz + texture2D(textureVelocity, uv).xyz * uStep, 1.0);
}
`

const VERT = /* glsl */ `
attribute vec2 aRef;
attribute vec4 aRand;
uniform sampler2D tPos;
uniform sampler2D tVel;
uniform float uTime;
uniform float uSize;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec3 vColor;
varying vec3 vNormal;
varying float vDepth;

mat3 rotation(vec3 axis, float a) {
  float s = sin(a), c = cos(a), oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
    oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
    oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c);
}

void main() {
  vec3 p = texture2D(tPos, aRef).xyz;
  vec3 v = texture2D(tVel, aRef).xyz;
  mat3 R = rotation(normalize(aRand.xyz - 0.5 + 1e-3), uTime * (0.3 + aRand.y) + aRand.x * 6.2832);
  float s = uSize * (0.55 + aRand.w * 0.9) * (1.0 + min(length(v) * 8.0, 1.0)); // fast particles swell
  vec4 mv = modelViewMatrix * vec4(p + R * position * s, 1.0);
  gl_Position = projectionMatrix * mv;
  vNormal = normalize(normalMatrix * (R * normal));
  // colour regions that drift slowly over the surface, sampled at the particle's position
  float n = sin(p.x * 2.3 + uTime * 0.15) * sin(p.y * 1.9 - uTime * 0.1) + sin(p.z * 2.7 + uTime * 0.07) * 0.5;
  vec3 col = mix(uColorA, uColorB, smoothstep(0.3, 0.8, n));
  col = mix(col, uColorC, smoothstep(0.35, 0.95, -n) * 0.85);
  vColor = aRand.w > 0.93 ? vec3(1.0) : col;
  vDepth = -mv.z;
}
`

// alpha carries view depth for the DOF pass in post.js
const FRAG = /* glsl */ `
uniform float uFocus;
varying vec3 vColor;
varying vec3 vNormal;
varying float vDepth;

void main() {
  float light = 0.35 + 0.65 * max(dot(vNormal, normalize(vec3(0.4, 0.8, 0.6))), 0.0);
  float fade = smoothstep(7.0, 0.0, abs(vDepth - uFocus)); // far from focus = a little darker
  gl_FragColor = vec4(vColor * light * mix(0.45, 1.25, fade), vDepth / ${DEPTH_SCALE.toFixed(1)});
  #include <colorspace_fragment>
}
`

// Loose particles drifting in front of and behind the shape, for depth. Dala's "front cones".
const DUST_VERT = /* glsl */ `
attribute vec4 aRand;
attribute vec3 aColor;
attribute vec3 aOffset;
uniform float uTime;
varying vec3 vColor;
varying vec3 vNormal;
varying float vDepth;
${VERT.match(/mat3 rotation[\s\S]*?\n}\n/)[0]}
void main() {
  vec3 p = aOffset + vec3(sin(uTime * 0.2 + aRand.x * 6.28), cos(uTime * 0.17 + aRand.y * 6.28), 0.0) * 0.25;
  mat3 R = rotation(normalize(aRand.xyz - 0.5 + 1e-3), uTime * (0.2 + aRand.w * 0.5));
  vec4 mv = modelViewMatrix * vec4(p + R * position * (0.05 + aRand.w * 0.1), 1.0);
  gl_Position = projectionMatrix * mv;
  vNormal = normalize(normalMatrix * (R * normal));
  vColor = aColor;
  vDepth = -mv.z;
}
`

export async function createField(renderer) {
  // two byte planes (low bytes, then high bytes), see scripts/bake.js
  const bytes = new Uint8Array(await (await fetch(`${import.meta.env.BASE_URL}shapes.bin`)).arrayBuffer())
  const M = N * 3 * COUNT
  if (bytes.length !== M * 2) throw new Error('shapes.bin does not match config, run `bun run bake`')
  const raw = new Uint16Array(M)
  for (let i = 0; i < M; i++) raw[i] = bytes[i] | bytes[M + i] << 8

  // undo the bake's per-shape delta coding (running sum, wrapping at 16 bits)
  const shapeData = new Float32Array(N * 4 * COUNT)
  const acc = [0, 0, 0]
  for (let i = 0; i < N * COUNT; i++) {
    if (i % N === 0) acc.fill(0)
    for (let c = 0; c < 3; c++) {
      acc[c] = (acc[c] + raw[i * 3 + c]) & 0xffff
      shapeData[i * 4 + c] = acc[c] / 1023 // QMAX in scripts/bake.js
    }
    shapeData[i * 4 + 3] = 1
  }
  const tShapes = new THREE.DataTexture(shapeData, SIDE, SIDE * COUNT, THREE.RGBAFormat, THREE.FloatType)
  tShapes.needsUpdate = true

  const randData = new Float32Array(N * 4).map(Math.random)
  const tRand = new THREE.DataTexture(randData, SIDE, SIDE, THREE.RGBAFormat, THREE.FloatType)
  tRand.needsUpdate = true

  const gpu = new GPUComputationRenderer(SIDE, SIDE, renderer)
  const pos0 = gpu.createTexture(), vel0 = gpu.createTexture()
  for (let i = 0; i < N; i++) {
    // start scattered around the first shape
    const spread = 1 + randData[i * 4 + 2] * 3
    for (let c = 0; c < 3; c++) pos0.image.data[i * 4 + c] = (shapeData[i * 4 + c] * 2 - 1) * SIM.scale * spread
    pos0.image.data[i * 4 + 3] = 1
  }

  const velVar = gpu.addVariable('textureVelocity', VELOCITY, vel0)
  const posVar = gpu.addVariable('texturePosition', POSITION, pos0)
  gpu.setVariableDependencies(velVar, [posVar, velVar])
  gpu.setVariableDependencies(posVar, [posVar, velVar])

  const u = velVar.material.uniforms
  Object.assign(u, {
    tShapes: { value: tShapes }, tRand: { value: tRand },
    uProgress: { value: 0 }, uShow: { value: 0 }, uExplode: { value: 0 },
    uScale: { value: SIM.scale }, uStagger: { value: SIM.stagger }, uCloud: { value: new THREE.Vector3(...SIM.cloud) },
    uSpring: { value: SIM.spring }, uSpringRand: { value: SIM.springRand }, uFriction: { value: SIM.friction },
    uMouse: { value: new THREE.Vector3(99, 99, 99) }, uMouseRadius: { value: SIM.mouseRadius }, uMouseForce: { value: SIM.mouseForce },
  })
  u.uStep = { value: 1 }
  posVar.material.uniforms.uStep = u.uStep
  const err = gpu.init()
  if (err) throw new Error(err)

  // one tiny pyramid per particle, instanced
  const base = new THREE.TetrahedronGeometry(1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.setAttribute('position', base.getAttribute('position'))
  geo.setAttribute('normal', base.getAttribute('normal'))
  geo.instanceCount = N

  const ref = new Float32Array(N * 2), rand = new Float32Array(N * 4)
  for (let i = 0; i < N; i++) {
    ref[i * 2] = (i % SIDE + 0.5) / SIDE
    ref[i * 2 + 1] = (Math.floor(i / SIDE) + 0.5) / SIDE
    for (let c = 0; c < 4; c++) rand[i * 4 + c] = Math.random()
  }
  geo.setAttribute('aRef', new THREE.InstancedBufferAttribute(ref, 2))
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rand, 4))

  const [colorA, colorB, colorC] = FIELD_COLORS.map(c => new THREE.Color(c))
  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      tPos: { value: null }, tVel: { value: null },
      uTime: { value: 0 }, uSize: { value: SIM.size }, uFocus: { value: 6 },
      uColorA: { value: colorA }, uColorB: { value: colorB }, uColorC: { value: colorC },
    },
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false // positions come from a texture, the bounding sphere is meaningless

  return {
    mesh,
    uniforms: u,
    update(time, dt = 1 / 60) {
      u.uStep.value = Math.min(dt * 60, 3)
      gpu.compute()
      material.uniforms.tPos.value = gpu.getCurrentRenderTarget(posVar).texture
      material.uniforms.tVel.value = gpu.getCurrentRenderTarget(velVar).texture
      material.uniforms.uTime.value = time
    },
    setFocus(z) { material.uniforms.uFocus.value = z },
    // dev: read n particles back from the GPU
    sample(n = 5) {
      const out = {}
      for (const [k, v] of [['pos', posVar], ['vel', velVar]]) {
        const buf = new Float32Array(SIDE * 4)
        renderer.readRenderTargetPixels(gpu.getCurrentRenderTarget(v), 0, 0, SIDE, 1, buf)
        out[k] = [...buf.slice(0, n * 4)].map(x => +x.toFixed(3))
      }
      out.shape0 = [...shapeData.slice(0, n * 4)].map(x => +((x * 2 - 1) * SIM.scale).toFixed(3))
      return out
    },
  }
}

export function createDust(count = 250) {
  const base = new THREE.TetrahedronGeometry(1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.setAttribute('position', base.getAttribute('position'))
  geo.setAttribute('normal', base.getAttribute('normal'))
  geo.instanceCount = count

  const offset = new Float32Array(count * 3), rand = new Float32Array(count * 4), color = new Float32Array(count * 3)
  const palette = PALETTE.map(c => new THREE.Color(c))
  for (let i = 0; i < count; i++) {
    offset[i * 3] = (Math.random() * 2 - 1) * 13
    offset[i * 3 + 1] = (Math.random() * 2 - 1) * 7.5
    // behind the shape or in front of it, never beside it where it would read as confetti
    offset[i * 3 + 2] = Math.random() < 0.7 ? -14 + Math.random() * 9 : 5 + Math.random() * 3
    for (let c = 0; c < 4; c++) rand[i * 4 + c] = Math.random()
    palette[Math.floor(Math.random() * palette.length)].toArray(color, i * 3)
  }
  geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offset, 3))
  geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rand, 4))
  geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(color, 3))

  const material = new THREE.ShaderMaterial({
    vertexShader: DUST_VERT,
    fragmentShader: FRAG,
    uniforms: { uTime: { value: 0 }, uFocus: { value: CAMERA.z } },
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false
  return { mesh, update(time) { material.uniforms.uTime.value = time } }
}
