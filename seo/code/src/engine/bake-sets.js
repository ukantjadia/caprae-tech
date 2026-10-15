// Bakes the inner pages' shape sets (site/shapes.js) into public/shapes/<set>.bin, one file
// per set, plus src/shape-extents.json. Same sampling and file format as bake.js (blue noise at
// one world spacing, Uint16 x4 per point, N slots per shape), so field.js reads either.
//   bun run bake
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import opentype from 'opentype.js'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const root = process.cwd()
const { SIDE, SPACING } = await import(pathToFileURL(path.join(root, 'src/config.js')).href)
const { SETS } = await import(pathToFileURL(path.join(root, 'site/shapes.js')).href)
const N = SIDE * SIDE

// ---------- helpers ----------
const clean = g => { g = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k); return g }
const merge = parts => mergeGeometries(parts.map(clean))
const plate = (shape, depth = 0.12, bevel = 0) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 32 })
const roundRect = (w, h, r) => {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
  return s
}
const lathe = (profile, segments = 96) => new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), segments)

// ---------- shape builders ----------

// the home page's extruded letter (bake.js text())
function text({ text, font = '@fontsource/inter/files/inter-latin-700-normal.woff', depth = 0.3 }) {
  const b = fs.readFileSync(require.resolve(font))
  const f = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length))
  const sp = new THREE.ShapePath()
  sp.userData = { style: { fillRule: 'nonzero' } }
  let x = 0, prev = null
  for (const ch of text) {
    const g = f.charToGlyph(ch)
    if (prev) x += f.getKerningValue(prev, g) / f.unitsPerEm
    for (const c of g.getPath(x, 0, 1).commands) {
      if (c.type === 'M') sp.moveTo(c.x, -c.y)
      else if (c.type === 'L') sp.lineTo(c.x, -c.y)
      else if (c.type === 'Q') sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y)
      else if (c.type === 'C') sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y)
    }
    x += g.advanceWidth / f.unitsPerEm
    prev = g
  }
  return new THREE.ExtrudeGeometry(sp.toShapes(false), { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.012, bevelSegments: 2, curveSegments: 10 })
}

// Dashboards: five rising bars on a base plate
function bars() {
  const parts = [new THREE.BoxGeometry(3.4, 0.1, 1).translate(0, -1.05, 0)]
  const hs = [0.8, 1.3, 1.0, 1.75, 2.3]
  hs.forEach((h, i) => parts.push(new THREE.BoxGeometry(0.46, h, 0.46).translate(-1.2 + i * 0.6, -1 + h / 2, 0)))
  return merge(parts)
}

// Deal & financial tools: three stacks of coins, short to tall, and one coin on its edge
function coins() {
  const coin = () => new THREE.CylinderGeometry(0.5, 0.5, 0.11, 48)
  const parts = []
  ;[[-1.15, 4], [0, 7], [1.15, 10]].forEach(([x, n], s) => {
    for (let i = 0; i < n; i++) parts.push(coin().translate(x + Math.sin(i * 1.7 + s) * 0.04, -1.1 + i * 0.13, Math.cos(i * 1.3) * 0.04))
  })
  parts.push(coin().rotateX(Math.PI / 2).rotateY(0.5).translate(-0.6, -0.55, 0.75))
  return merge(parts)
}

// AI assistants: an icosahedron network, nodes and links, around a core
function network() {
  const ico = new THREE.IcosahedronGeometry(1.3, 0)
  const p = ico.attributes.position, verts = []
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i)
    if (!verts.some(u => u.distanceTo(v) < 1e-4)) verts.push(v)
  }
  const parts = [new THREE.IcosahedronGeometry(0.32, 2)]
  for (const v of verts) parts.push(new THREE.SphereGeometry(0.13, 16, 12).translate(v.x, v.y, v.z))
  const edge = verts[0].distanceTo(verts.reduce((b, u) => (u !== verts[0] && (b === verts[0] || u.distanceTo(verts[0]) < b.distanceTo(verts[0])) ? u : b), verts[0]))
  const link = (a, b, r) => {
    const len = a.distanceTo(b), mid = a.clone().add(b).multiplyScalar(0.5)
    const g = new THREE.CylinderGeometry(r, r, len, 6, 1, true)
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()))
    return g.translate(mid.x, mid.y, mid.z)
  }
  for (let i = 0; i < verts.length; i++) for (let j = i + 1; j < verts.length; j++)
    if (Math.abs(verts[i].distanceTo(verts[j]) - edge) < 1e-3) parts.push(link(verts[i], verts[j], 0.022))
  for (const v of verts.filter((_, i) => i % 2 === 0)) parts.push(link(new THREE.Vector3(), v, 0.015)) // spokes to the core
  return merge(parts)
}

// Internal tools: a ten-tooth gear with a hub hole
function gear() {
  const teeth = 10, ro = 1.05, ri = 0.84, s = new THREE.Shape()
  for (let i = 0; i < teeth; i++) {
    const a = i / teeth * Math.PI * 2, w = Math.PI / teeth
    const pts = [[ri, a - w * 0.55], [ro, a - w * 0.32], [ro, a + w * 0.32], [ri, a + w * 0.55]]
    pts.forEach(([r, t], k) => (i === 0 && k === 0 ? s.moveTo : s.lineTo).call(s, r * Math.cos(t), r * Math.sin(t)))
  }
  s.closePath()
  const hole = new THREE.Path(); hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true); s.holes.push(hole)
  return plate(s, 0.34, 0.03)
}

// Pricing: an hourglass with its frame (priced in hours)
function hourglass() {
  const glass = lathe([[0.001, 1.12], [0.72, 1.12], [0.76, 0.9], [0.66, 0.55], [0.36, 0.22], [0.09, 0.04], [0.09, -0.04], [0.36, -0.22], [0.66, -0.55], [0.76, -0.9], [0.72, -1.12], [0.001, -1.12]])
  const cap = y => new THREE.CylinderGeometry(0.98, 0.98, 0.12, 48).translate(0, y, 0)
  const parts = [glass, cap(1.2), cap(-1.2)]
  for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2 + 0.5; parts.push(new THREE.CylinderGeometry(0.05, 0.05, 2.3, 10).translate(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9)) }
  parts.push(lathe([[0.001, -1.12], [0.6, -1.12], [0.3, -0.82], [0.001, -0.7]], 48)) // the sand that has run
  return merge(parts)
}

// How it works, call: a speech bubble with three dots
function bubble() {
  const s = roundRect(2.6, 1.6, 0.45)
  const tail = new THREE.Shape([new THREE.Vector2(-0.75, -0.7), new THREE.Vector2(-0.2, -0.7), new THREE.Vector2(-0.95, -1.3)])
  const parts = [plate(s, 0.3, 0.04), plate(tail, 0.3, 0.04)]
  for (const x of [-0.55, 0, 0.55]) parts.push(new THREE.SphereGeometry(0.17, 20, 14).translate(x, 0, 0.42))
  return merge(parts)
}

// How it works, scope: a list with ticked boxes
function checklist() {
  const parts = [plate(roundRect(2.2, 2.8, 0.18), 0.08)]
  ;[0.85, 0.15, -0.55].forEach((y, i) => {
    const box = roundRect(0.36, 0.36, 0.06); const inner = new THREE.Path(); inner.absarc(0, 0, 0.001, 0, Math.PI * 2, true)
    parts.push(plate(box, 0.1).translate(-0.62, y, 0.1))
    parts.push(plate(roundRect(1.05, 0.16, 0.07), 0.08).translate(0.32, y, 0.1))
    if (i < 2) { // the tick, two bars
      parts.push(new THREE.BoxGeometry(0.12, 0.3, 0.1).rotateZ(0.7).translate(-0.7, y + 0.02, 0.26))
      parts.push(new THREE.BoxGeometry(0.12, 0.5, 0.1).rotateZ(-0.6).translate(-0.53, y + 0.1, 0.26))
    }
  })
  return merge(parts)
}

// How it works, build: a brick wall, its top course still going up (a wall, not a solid cube:
// a cube's hidden inner faces stacked thousands of glowing points behind each other)
function blocks() {
  const parts = [], w = 0.62, h = 0.3, d = 0.3, gap = 0.05
  const rows = [5, 5, 5, 3]
  rows.forEach((n, row) => {
    const off = row % 2 ? (w + gap) / 2 : 0
    for (let i = 0; i < n; i++) parts.push(new THREE.BoxGeometry(w, h, d).translate(-1.4 + off + i * (w + gap), -0.6 + row * (h + gap), 0))
  })
  parts.push(new THREE.BoxGeometry(w, h, d).rotateZ(-0.25).translate(1.15, 0.95, 0.1)) // the next brick, on its way in
  return merge(parts)
}

// How it works, launch: a rocket with three fins
function rocket() {
  const body = lathe([[0.001, 1.6], [0.18, 1.35], [0.36, 0.9], [0.44, 0.3], [0.44, -0.6], [0.36, -0.9], [0.001, -0.9]])
  const nozzle = lathe([[0.22, -0.9], [0.3, -1.15], [0.001, -1.15]], 48)
  const parts = [body, nozzle]
  const fin = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0.55, -0.45), new THREE.Vector2(0.55, -0.8), new THREE.Vector2(0, -0.45)])
  for (let i = 0; i < 3; i++) parts.push(plate(fin, 0.05).translate(0.38, -0.25, -0.025).rotateY(i / 3 * Math.PI * 2))
  parts.push(new THREE.TorusGeometry(0.2, 0.04, 8, 32).translate(0, 0.45, 0.4)) // window
  return merge(parts)
}

const BUILD = { text, bars, coins, network, gear, hourglass, bubble, checklist, blocks, rocket, lathe: s => lathe(s.profile) }
function geometryFor(s) {
  let g = BUILD[s.type](s)
  if (s.rotate) g.rotateX(s.rotate[0]).rotateY(s.rotate[1]).rotateZ(s.rotate[2])
  return clean(g)
}

// ---------- sampling (bake.js) ----------
function normalise(g) {
  g.computeBoundingBox()
  const c = g.boundingBox.getCenter(new THREE.Vector3())
  g.translate(-c.x, -c.y, -c.z)
  const p = g.attributes.position
  let r = 0
  for (let i = 0; i < p.count; i++) r = Math.max(r, Math.hypot(p.getX(i), p.getY(i), p.getZ(i)))
  return g.scale(1 / r, 1 / r, 1 / r)
}
function blueNoise(mesh, d) {
  const sampler = new MeshSurfaceSampler(mesh).build(), q = new THREE.Vector3()
  const grid = new Map(), kept = [], d2 = d * d, key = (x, y, z) => x + ',' + y + ',' + z
  for (let i = 0; i < N * 16 && kept.length < N; i++) {
    sampler.sample(q)
    const cx = Math.floor(q.x / d), cy = Math.floor(q.y / d), cz = Math.floor(q.z / d)
    let ok = true
    for (let a = -1; a <= 1 && ok; a++) for (let b = -1; b <= 1 && ok; b++) for (let c = -1; c <= 1 && ok; c++) {
      for (const j of grid.get(key(cx + a, cy + b, cz + c)) ?? []) {
        const ex = kept[j][0] - q.x, ey = kept[j][1] - q.y, ez = kept[j][2] - q.z
        if (ex * ex + ey * ey + ez * ez < d2) { ok = false; break }
      }
    }
    if (!ok) continue
    const k = key(cx, cy, cz)
    grid.has(k) ? grid.get(k).push(kept.length) : grid.set(k, [kept.length])
    kept.push([q.x, q.y, q.z])
  }
  return kept
}
const spread = v => { v &= 1023; v = (v | v << 16) & 0x30000ff; v = (v | v << 8) & 0x300f00f; v = (v | v << 4) & 0x30c30c3; return (v | v << 2) & 0x9249249 }
const morton = ([x, y, z]) => { const m = v => Math.round((v * 0.5 + 0.5) * 1023); return spread(m(x)) | spread(m(y)) << 1 | spread(m(z)) << 2 }
const q16 = v => Math.max(0, Math.min(65535, Math.round((v * 0.5 + 0.5) * 65535)))

// ---------- bake every set; a shape used by several sets is sampled once ----------
const cache = new Map(), extents = {}
const sample = shape => {
  const id = JSON.stringify(shape)
  if (cache.has(id)) return cache.get(id)
  const geo = normalise(geometryFor(shape))
  geo.computeBoundingBox()
  const bb = geo.boundingBox
  const pts = blueNoise(new THREE.Mesh(geo), SPACING / shape.radius).sort((a, b) => morton(a) - morton(b))
  const out = { pts, ext: [+bb.max.x.toFixed(3), +bb.max.y.toFixed(3), +bb.max.z.toFixed(3)] }
  cache.set(id, out)
  console.log(`  ${shape.type}${shape.text ? ' "' + shape.text + '"' : ''}: ${pts.length} points`)
  return out
}
fs.mkdirSync(path.join(root, 'public/shapes'), { recursive: true })
for (const [name, shapes] of Object.entries(SETS)) {
  const out = new Uint16Array(N * 4 * shapes.length)
  extents[name] = []
  shapes.forEach((shape, s) => {
    const { pts, ext } = sample(shape)
    extents[name].push(ext)
    const count = pts.length
    for (let slot = 0; slot < N; slot++) {
      const idx = Math.min(count - 1, Math.floor(slot * count / N))
      const visible = Math.floor(slot * count / N) !== Math.floor((slot - 1) * count / N) || slot === 0
      const o = (s * N + slot) * 4
      out[o] = q16(pts[idx][0]); out[o + 1] = q16(pts[idx][1]); out[o + 2] = q16(pts[idx][2]); out[o + 3] = visible ? 65535 : 0
    }
  })
  fs.writeFileSync(path.join(root, `public/shapes/${name}.bin`), out)
  console.log(`public/shapes/${name}.bin: ${shapes.length} shapes, ${(out.byteLength / 1024).toFixed(0)}KB`)
}
fs.writeFileSync(path.join(root, 'src/shape-extents.json'), JSON.stringify(extents))
