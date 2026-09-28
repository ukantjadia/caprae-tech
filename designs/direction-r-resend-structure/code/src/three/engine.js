// One WebGL context for the whole page. Each <View> owns a plain 2D canvas; every frame the
// shared renderer draws a visible view's scene into a corner of its buffer and the pixels are
// copied across. Integrated GPUs cap live WebGL contexts, so six renderers would fail there.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const DPR = Math.min(window.devicePixelRatio || 1, 1.5)
const MAX_W = 648, MAX_H = 550 // largest view (the hero)
const reduced = matchMedia('(prefers-reduced-motion: reduce)')

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
renderer.setPixelRatio(DPR)
renderer.setSize(MAX_W, MAX_H, false)
renderer.setClearColor(0x000000, 0)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setScissorTest(true)

const pmrem = new THREE.PMREMGenerator(renderer)
const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

// ---- surfaces: the three finishes on the original cube (gloss, grain, perforated mesh)
function canvasTexture(size, paint) {
  const c = document.createElement('canvas'); c.width = c.height = size
  paint(c.getContext('2d'), size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}
const grain = canvasTexture(256, (g, s) => {
  const img = g.createImageData(s, s)
  for (let i = 0; i < img.data.length; i += 4) { const v = 110 + Math.random() * 110; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255 }
  g.putImageData(img, 0, 0)
})
const perforated = canvasTexture(256, (g, s) => {
  g.fillStyle = '#fff'; g.fillRect(0, 0, s, s); g.fillStyle = '#000'
  const step = s / 24
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) { g.beginPath(); g.arc((x + 0.5 + (y % 2) * 0.5) * step, (y + 0.5) * step, step * 0.26, 0, Math.PI * 2); g.fill() }
})

const FINISH = {
  gloss: new THREE.MeshPhysicalMaterial({ color: 0x070708, roughness: 0.3, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.2, envMap, envMapIntensity: 0.5 }),
  satin: new THREE.MeshPhysicalMaterial({ color: 0x101012, roughness: 0.62, metalness: 0.05, roughnessMap: grain, bumpMap: grain, bumpScale: 0.6, envMap, envMapIntensity: 0.55 }),
  mesh: new THREE.MeshPhysicalMaterial({ color: 0x0d0d0f, roughness: 0.75, metalness: 0.2, bumpMap: perforated, bumpScale: 1.4, envMap, envMapIntensity: 0.5 }),
  violet: new THREE.MeshPhysicalMaterial({ color: 0x14111f, roughness: 0.35, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.25, envMap, envMapIntensity: 0.8, emissive: 0x2a1f66, emissiveIntensity: 0.35 }),
}
// hash, so neighbouring cubelets don't fall into stripes of one finish; gloss is the rarest, like the original
const pick = (i) => { const h = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1; return FINISH[h < 0.22 ? 'gloss' : h < 0.62 ? 'satin' : 'mesh'] }

function lights(scene, rim = 0xffffff) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.08))
  const key = new THREE.DirectionalLight(0xffffff, 1.9); key.position.set(-3, 5, 4); scene.add(key)
  const back = new THREE.DirectionalLight(rim, 1.6); back.position.set(4, 1.5, -4); scene.add(back)
  const fill = new THREE.PointLight(0xffffff, 6, 12); fill.position.set(2.5, -1.5, 3); scene.add(fill)
  return key
}
const cubelet = (size, finish) => new THREE.Mesh(new RoundedBoxGeometry(size, size, size, 4, size * 0.09), finish)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// ---- scenes. Each returns { scene, camera, update(t, dt, pointer) }
function hero() {
  const scene = new THREE.Scene(); const key = lights(scene)
  const camera = new THREE.PerspectiveCamera(28, MAX_W / MAX_H, 0.1, 50); camera.position.set(0, 0, 11)
  const root = new THREE.Group(); scene.add(root)
  const cubes = []
  let n = 0
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    const m = cubelet(0.96, pick(n++)); m.position.set(x, y, z); root.add(m); cubes.push(m)
  }
  root.rotation.set(0.55, -0.72, 0.18)
  const pivot = new THREE.Group(); root.add(pivot)
  const AXES = ['x', 'y', 'z']
  let turn = null, nextTurn = 1.6
  function startTurn() {
    const axis = AXES[Math.floor(Math.random() * 3)], layer = Math.floor(Math.random() * 3) - 1
    pivot.rotation.set(0, 0, 0); pivot.updateMatrixWorld()
    const members = cubes.filter((c) => Math.round(c.position[axis]) === layer)
    members.forEach((c) => pivot.attach(c))
    turn = { axis, members, t: 0, dir: Math.random() < 0.5 ? -1 : 1 }
  }
  function endTurn() {
    pivot.updateMatrixWorld()
    turn.members.forEach((c) => {
      root.attach(c)
      c.position.set(Math.round(c.position.x), Math.round(c.position.y), Math.round(c.position.z))
      const e = new THREE.Euler().setFromQuaternion(c.quaternion)
      c.rotation.set(...['x', 'y', 'z'].map((a) => Math.round(e[a] / (Math.PI / 2)) * (Math.PI / 2)))
    })
    turn = null
  }
  return {
    scene, camera,
    update(t, dt, p) {
      root.rotation.y = -0.72 + t * 0.12 + p.x * 0.18
      root.rotation.x = 0.55 + Math.sin(t * 0.35) * 0.06 + p.y * 0.12
      key.position.x = -3 + Math.sin(t * 0.4) * 2.2 // the moving key light
      if (!turn && t > nextTurn) startTurn()
      if (turn) {
        turn.t = Math.min(1, turn.t + dt / 1.3)
        pivot.rotation[turn.axis] = turn.dir * easeInOut(turn.t) * Math.PI / 2
        if (turn.t === 1) { endTurn(); nextTurn = t + 2.2 + Math.random() * 1.6 }
      }
    },
  }
}

// Tiles: one object each, sitting in the 170px slot like the original 3D icons.
function tile(build, { rim = 0x9281f7, spin = 0.35 } = {}) {
  return () => {
    const scene = new THREE.Scene(); lights(scene, rim)
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50); camera.position.set(0, 0, 6.2)
    const obj = build(); scene.add(obj)
    const base = obj.rotation.clone()
    return {
      scene, camera,
      update(t, dt, p) {
        obj.rotation.y = base.y + Math.sin(t * spin) * 0.45 + p.x * 0.2
        obj.rotation.x = base.x + Math.sin(t * spin * 0.8 + 1) * 0.12 + p.y * 0.15
        obj.userData.animate?.(t)
      },
    }
  }
}

const SCENES = {
  hero,
  // 03 the wedge: a 2x2x2 block with one corner cubelet lifted out.
  wedge: tile(() => {
    const g = new THREE.Group(); let n = 0; let lifted
    for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) {
      const m = cubelet(0.94, x + y + z === 3 ? FINISH.violet : pick(n++)); m.position.set(x - 0.5, y - 0.5, z - 0.5); g.add(m)
      if (x + y + z === 3) lifted = m
    }
    g.rotation.set(0.6, -0.75, 0)
    g.userData.animate = (t) => { const k = 0.18 + Math.sin(t * 0.9) * 0.12; lifted.position.set(0.5 + k, 0.5 + k, 0.5 + k) }
    return g
  }),
  // 05 work: product layers, a stack of slabs drifting apart and back.
  work: tile(() => {
    const g = new THREE.Group(); const slabs = []
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(new RoundedBoxGeometry(1.45, 0.24, 1.45, 4, 0.06), i === 3 ? FINISH.violet : pick(i)); g.add(m); slabs.push(m)
    }
    g.rotation.set(0.5, -0.7, 0)
    g.userData.animate = (t) => slabs.forEach((m, i) => { m.position.y = (i - 1.5) * (0.34 + Math.sin(t * 0.8) * 0.06) })
    return g
  }),
  // 07 how it works: three steps rising, call -> scope -> build.
  how: tile(() => {
    const g = new THREE.Group(); const steps = []
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.6 + i * 0.55, 0.8, 4, 0.07), i === 2 ? FINISH.violet : pick(i)); g.add(m); steps.push(m)
    }
    g.rotation.set(0.35, -0.65, 0)
    g.userData.animate = (t) => steps.forEach((m, i) => { const h = 0.6 + i * 0.55; m.position.set((i - 1) * 0.92, h / 2 - 0.9 + Math.max(0, Math.sin(t * 1.1 - i * 0.7)) * 0.08, 0) })
    return g
  }),
  // 09 people: a sphere held in a ring.
  people: tile(() => {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 32), FINISH.gloss))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.09, 24, 96), FINISH.violet); ring.rotation.x = Math.PI / 2.6; g.add(ring)
    g.userData.animate = (t) => { ring.rotation.z = t * 0.5 }
    return g
  }, { spin: 0.25 }),
  // 10 the five people: five cubelets orbiting in a ring.
  team: tile(() => {
    const g = new THREE.Group(); const five = []
    for (let i = 0; i < 5; i++) { const m = cubelet(0.62, i === 0 ? FINISH.violet : pick(i)); g.add(m); five.push(m) }
    g.rotation.set(0.5, 0, 0)
    g.userData.animate = (t) => five.forEach((m, i) => { const a = t * 0.35 + (i / 5) * Math.PI * 2; m.position.set(Math.cos(a) * 1.25, Math.sin(t + i) * 0.06, Math.sin(a) * 1.25); m.rotation.set(a, a * 0.7, 0) })
    return g
  }, { spin: 0.2 }),
}

// ---- the loop
const views = new Set()
const pointer = { x: 0, y: 0 }
addEventListener('pointermove', (e) => { pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = e.clientY / innerHeight * 2 - 1 }, { passive: true })

function draw(v, t, dt) {
  const w = v.canvas.clientWidth, h = v.canvas.clientHeight
  if (!w || !h) return
  const pw = Math.round(Math.min(w, MAX_W) * DPR), ph = Math.round(Math.min(h, MAX_H) * DPR)
  if (v.canvas.width !== pw || v.canvas.height !== ph) { v.canvas.width = pw; v.canvas.height = ph }
  v.s.camera.aspect = w / h; v.s.camera.updateProjectionMatrix()
  v.s.update(t, dt, reduced.matches ? { x: 0, y: 0 } : pointer)
  const cw = pw / DPR, ch = ph / DPR
  renderer.setViewport(0, 0, cw, ch); renderer.setScissor(0, 0, cw, ch)
  renderer.render(v.s.scene, v.s.camera)
  // WebGL's origin is bottom-left, so the view sits at the bottom of the drawing buffer
  const src = renderer.domElement
  v.ctx.clearRect(0, 0, pw, ph)
  v.ctx.drawImage(src, 0, src.height - ph, pw, ph, 0, 0, pw, ph)
  if (!v.shown) { v.shown = true; v.onFirstFrame() }
}

let last = 0, clock = 0, raf = 0
function frame(now) {
  raf = 0
  const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; clock += dt
  let any = false
  for (const v of views) if (v.visible) { draw(v, clock, dt); any = true }
  if (any && !reduced.matches && !document.hidden) raf = requestAnimationFrame(frame)
}
const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame) } }
document.addEventListener('visibilitychange', () => { if (!document.hidden) kick() })

// Reduced motion: one still frame per view, settled mid-pose, no loop.
export function addView(canvas, kind, onFirstFrame) {
  const v = { canvas, ctx: canvas.getContext('2d'), s: SCENES[kind](), visible: false, shown: false, onFirstFrame }
  views.add(v)
  const io = new IntersectionObserver(([e]) => { v.visible = e.isIntersecting; if (v.visible) { if (reduced.matches) draw(v, 2.4, 0); else kick() } }, { rootMargin: '100px' })
  io.observe(canvas)
  return () => { io.disconnect(); views.delete(v); v.s.scene.traverse((o) => o.geometry?.dispose()) }
}
