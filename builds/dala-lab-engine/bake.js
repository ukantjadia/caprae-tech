// Bakes a draft's SHAPES into <draft>/public/shapes.bin. Run from the draft folder:
//   bun ../dala-lab-engine/bake.js
// Each shape is fitted into radius 1, drawn at its own world radius (shape.radius), and
// sampled with blue noise at one fixed WORLD spacing (SPACING in the draft's config), so
// every shape shows the same even gaps on screen whatever its size. A shape with
// room for fewer than N points parks its spare particles on itself, invisible (w = 0).
// Output: Uint16 x4 per point (x, y, z in 0..65535 over -1..1, w = 0 or 65535), shapes back to back.
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import opentype from 'opentype.js'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const draft = process.cwd()
const { SIDE, SHAPES, SPACING } = await import(pathToFileURL(path.join(draft, 'src/config.js')).href)
const N = SIDE * SIDE

// ---------- shape builders ----------

// Font outlines -> extruded solid. Glyph by glyph (advance + kerning): opentype's shaper
// fails on some fonts' GSUB tables. SVGLoader.createShapes applies nonzero fill, so the
// counters in A, P, R come out as holes.
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
  // depth is in em units: 0.3 em reads as a solid 3D block when the word turns
  return new THREE.ExtrudeGeometry(sp.toShapes(false), { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.012, bevelSegments: 2, curveSegments: 10 })
}

// A profile of [x, y] points spun around the y axis (the lightbulb)
const lathe = ({ profile, segments = 96 }) => new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), segments)

// Geometry instrument set: set-square, protractor, ruler and compass, laid out as one group.
// All outlines are our own, extruded to thin plates like the real tools.
function geometrySet() {
  const plate = (shape, depth = 0.12) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 48 })
  const parts = []

  // set-square: right triangle with a triangular window
  const sq = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(1.5, 0), new THREE.Vector2(0, 1.5)])
  sq.holes.push(new THREE.Path([new THREE.Vector2(0.28, 0.2), new THREE.Vector2(0.28, 0.85), new THREE.Vector2(0.93, 0.2)].reverse()))
  parts.push(plate(sq).translate(-1.55, -0.95, 0))

  // protractor: half ring
  const pr = new THREE.Shape()
  pr.absarc(0, 0, 0.95, 0, Math.PI, false)
  pr.lineTo(-0.72, 0)
  pr.absarc(0, 0, 0.72, Math.PI, 0, true)
  pr.lineTo(0.95, 0)
  parts.push(plate(pr).translate(0.55, 0.35, 0.02))

  // ruler: long thin bar with tick notches along one edge
  const ru = new THREE.Shape()
  ru.moveTo(0, 0); ru.lineTo(2.6, 0); ru.lineTo(2.6, 0.32)
  for (let i = 12; i >= 1; i--) { const x = i * 0.2; ru.lineTo(x + 0.02, 0.32); ru.lineTo(x + 0.02, i % 5 === 0 ? 0.2 : 0.25); ru.lineTo(x - 0.02, i % 5 === 0 ? 0.2 : 0.25); ru.lineTo(x - 0.02, 0.32) }
  ru.lineTo(0, 0.32); ru.lineTo(0, 0)
  parts.push(plate(ru).rotateZ(-0.12).translate(-1.3, -1.45, 0.04))

  // compass: two legs from a round hinge, opened in a V
  const leg = len => { const s = new THREE.Shape(); s.moveTo(-0.045, 0); s.lineTo(0.045, 0); s.lineTo(0.012, -len); s.lineTo(-0.012, -len); s.lineTo(-0.045, 0); return s }
  const hinge = new THREE.Shape(); hinge.absarc(0, 0, 0.11, 0, Math.PI * 2, false)
  const cx = 1.25, cy = 0.1
  parts.push(plate(leg(1.35), 0.06).rotateZ(0.32).translate(cx, cy, 0.06))
  parts.push(plate(leg(1.35), 0.06).rotateZ(-0.32).translate(cx, cy, 0.06))
  parts.push(plate(hinge, 0.08).translate(cx, cy, 0.05))
  parts.push(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 12).translate(cx, cy + 0.25, 0.09))

  return mergeGeometries(parts.map(g => g.toNonIndexed()).map(g => { for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k); return g }))
}

function geometryFor(s) {
  let g
  if (s.type === 'text') g = text(s)
  else if (s.type === 'lathe') g = lathe(s)
  else if (s.type === 'geometrySet') g = geometrySet()
  else g = new THREE[s.type](...(s.args ?? []))
  if (s.rotate) g.rotateX(s.rotate[0]).rotateY(s.rotate[1]).rotateZ(s.rotate[2])
  g = g.index ? g.toNonIndexed() : g
  for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k)
  return g
}

// ---------- sampling ----------

// fit into radius 1 around the bounding-box centre
function normalise(g) {
  g.computeBoundingBox()
  const c = g.boundingBox.getCenter(new THREE.Vector3())
  g.translate(-c.x, -c.y, -c.z)
  const p = g.attributes.position
  let r = 0
  for (let i = 0; i < p.count; i++) r = Math.max(r, Math.hypot(p.getX(i), p.getY(i), p.getZ(i)))
  return g.scale(1 / r, 1 / r, 1 / r)
}

// Dart throwing at a fixed minimum distance d over 16N random surface candidates, with a hash grid.
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

// interleave three 10-bit coordinates into one 30-bit Morton code
const spread = v => { v &= 1023; v = (v | v << 16) & 0x30000ff; v = (v | v << 8) & 0x300f00f; v = (v | v << 4) & 0x30c30c3; return (v | v << 2) & 0x9249249 }
const morton = ([x, y, z]) => { const m = v => Math.round((v * 0.5 + 0.5) * 1023); return spread(m(x)) | spread(m(y)) << 1 | spread(m(z)) << 2 }

function medianNN(pts) {
  const n = Math.min(pts.length, 1500), ds = []
  for (let i = 0; i < n; i++) {
    let best = Infinity
    for (let j = 0; j < pts.length; j++) if (j !== i) {
      const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], dz = pts[i][2] - pts[j][2]
      best = Math.min(best, dx * dx + dy * dy + dz * dz)
    }
    ds.push(Math.sqrt(best))
  }
  return ds.sort((a, b) => a - b)[ds.length >> 1]
}

// ---------- bake ----------

const out = new Uint16Array(N * 4 * SHAPES.length)
const extents = []
const q16 = v => Math.max(0, Math.min(65535, Math.round((v * 0.5 + 0.5) * 65535)))

for (const [s, shape] of SHAPES.entries()) {
  const geo = normalise(geometryFor(shape))
  geo.computeBoundingBox()
  const bb = geo.boundingBox
  extents.push([+(bb.max.x).toFixed(3), +(bb.max.y).toFixed(3), +(bb.max.z).toFixed(3)])
  const mesh = new THREE.Mesh(geo)
  if (!shape.radius) throw new Error(`shape ${s}: set a world radius`)
  const pts = blueNoise(mesh, SPACING / shape.radius).sort((a, b) => morton(a) - morton(b)) // neighbours in file = neighbours in space
  const count = pts.length
  // spread the visible points evenly over the N slots; the gaps get parked copies, w = 0
  for (let slot = 0; slot < N; slot++) {
    const idx = Math.min(count - 1, Math.floor(slot * count / N))
    const visible = Math.floor(slot * count / N) !== Math.floor((slot - 1) * count / N) || slot === 0
    const o = (s * N + slot) * 4
    out[o] = q16(pts[idx][0]); out[o + 1] = q16(pts[idx][1]); out[o + 2] = q16(pts[idx][2])
    out[o + 3] = visible ? 65535 : 0
  }
  const vis = [...Array(N).keys()].filter(i => out[(s * N + i) * 4 + 3]).length
  if (vis !== count) throw new Error(`shape ${s}: ${vis} visible slots for ${count} points`)
  console.log(`shape ${s} ${shape.type}${shape.text ? ' "' + shape.text + '"' : ''}: ${count} points${count === N ? ' (capped at N)' : ''}, median NN ${(medianNN(pts) * shape.radius).toFixed(3)} world at radius ${shape.radius}`)
}

fs.mkdirSync(path.join(draft, 'public'), { recursive: true })
fs.writeFileSync(path.join(draft, 'public/shapes.bin'), out)
// half-width, half-height and half-depth of each fitted shape (radius-1 units), read by the page
fs.writeFileSync(path.join(draft, 'src/extents.json'), JSON.stringify(extents))
console.log(`public/shapes.bin: ${SHAPES.length} shapes x ${N} slots, ${(out.byteLength / 1024).toFixed(0)}KB`)
