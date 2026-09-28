// Bakes SHAPES into public/shapes.bin: SIDE*SIDE surface points per shape, xyz as
// 10 bits (0..1023 maps to -1..1), Morton-sorted and delta-coded per shape, written as two
// byte planes (all low bytes, then all high bytes) so gzip can squash the near-empty high half.
// The page stacks the shapes into one tall texture.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { SIDE, SHAPES } from '../src/config.js'

const N = SIDE * SIDE
const QMAX = 1023 // 10 bits per axis, grid step ~0.003 vs particle size 0.014; must match particles.js

// interleave three 10-bit coordinates into one 30-bit Morton code
const spread = v => { v &= 1023; v = (v | v << 16) & 0x30000ff; v = (v | v << 8) & 0x300f00f; v = (v | v << 4) & 0x30c30c3; return (v | v << 2) & 0x9249249 }
const morton = (x, y, z) => spread(x) | spread(y) << 1 | spread(z) << 2

async function geometryFor(shape) {
  // a profile of [x, y] points spun around the y axis (the lightbulb)
  if (shape.type === 'lathe') return new THREE.LatheGeometry(shape.profile.map(([x, y]) => new THREE.Vector2(x, y)), shape.segments ?? 96)
  if (typeof shape !== 'string') {
    const g = new THREE[shape.type](...shape.args)
    if (shape.rotate) g.rotateX(shape.rotate[0]).rotateY(shape.rotate[1]).rotateZ(shape.rotate[2])
    return g
  }
  const buf = await Bun.file(new URL(`../shapes/${shape}`, import.meta.url)).arrayBuffer()
  const gltf = await new GLTFLoader().parseAsync(buf, '')
  gltf.scene.updateMatrixWorld(true)
  const parts = []
  gltf.scene.traverse(o => {
    if (!o.isMesh) return
    const g = o.geometry.clone().applyMatrix4(o.matrixWorld)
    for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k)
    parts.push(g.index ? g.toNonIndexed() : g)
  })
  if (!parts.length) throw new Error(`${shape}: no meshes`)
  return mergeGeometries(parts)
}

const out = new Uint16Array(N * 3 * SHAPES.length)
const p = new THREE.Vector3()

for (const [s, shape] of SHAPES.entries()) {
  const mesh = new THREE.Mesh(await geometryFor(shape))
  const sampler = new MeshSurfaceSampler(mesh).build()
  const pts = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) { sampler.sample(p); p.toArray(pts, i * 3) }

  // centre on the bounding box, fit the largest extent into radius 1
  const box = new THREE.Box3().setFromArray(pts), c = box.getCenter(new THREE.Vector3())
  let r = 0
  for (let i = 0; i < N; i++) r = Math.max(r, p.fromArray(pts, i * 3).sub(c).length())

  const q = new Uint16Array(N * 3)
  for (let i = 0; i < N * 3; i++) q[i] = Math.round(((pts[i] - c.getComponent(i % 3)) / r * 0.5 + 0.5) * QMAX)

  // Sort points along a Morton curve: neighbours in the file are neighbours in space, so
  // particle i travels between matching regions of each shape, and the deltas compress.
  const order = [...Array(N).keys()].map(i => [morton(q[i * 3], q[i * 3 + 1], q[i * 3 + 2]), i])
  order.sort((a, b) => a[0] - b[0])
  const prev = [0, 0, 0]
  order.forEach(([, i], j) => {
    for (let k = 0; k < 3; k++) {
      out[s * N * 3 + j * 3 + k] = (q[i * 3 + k] - prev[k]) & 0xffff // delta, undone in particles.js
      prev[k] = q[i * 3 + k]
    }
  })

  // self-check: decoding the deltas gives back every sorted point exactly
  const sum = [0, 0, 0]
  order.forEach(([, i], j) => {
    for (let k = 0; k < 3; k++) {
      sum[k] = (sum[k] + out[s * N * 3 + j * 3 + k]) & 0xffff
      if (sum[k] !== q[i * 3 + k]) throw new Error(`shape ${s}: delta round-trip failed at point ${j}`)
    }
  })
  console.log(`shape ${s}: ${typeof shape === 'string' ? shape : shape.type}, ${N} points`)
}

const planes = new Uint8Array(out.length * 2)
for (let i = 0; i < out.length; i++) { planes[i] = out[i] & 255; planes[out.length + i] = out[i] >> 8 }
await Bun.write(new URL("../public/shapes.bin", import.meta.url), planes)
console.log(`public/shapes.bin: ${SHAPES.length} shapes, ${(out.byteLength / 1024).toFixed(0)}KB`)
