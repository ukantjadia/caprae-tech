// One fixed WebGL canvas behind the whole page (D-063). Scroll progress is Dala's model:
// section index + fraction scrolled past the top of the screen, fed through the draft's
// RAMPS table. Section offsets are cached and refreshed on layout change, so a frame reads
// nothing from the DOM but scrollY. Native scroll only: the Lab relies on CSS smooth
// scrolling and anchor links, which a smooth-scroll library would fight (D-068).
import * as THREE from 'three'
import { createField, createDust } from './field.js'
import { createPost } from './post.js'

export async function startStage(cfg) {
  const canvas = document.createElement('canvas')
  canvas.className = 'particle-field'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.prepend(canvas)

  let renderer
  try {
    // Dala renders at DPR 1 with no antialias: that is its look and its speed (D-065)
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  } catch {
    canvas.remove() // no WebGL: the Lab page on black is complete without it
    return
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  let dpr = 1
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(cfg.CAMERA.fov, 1, 0.1, 60)
  camera.position.z = cfg.CAMERA.z
  const field = await createField(renderer, cfg)
  const dust = createDust(cfg)
  const group = new THREE.Group()
  group.add(field.mesh)
  scene.add(group, dust.mesh)
  const post = createPost(renderer, scene, camera)

  const resize = () => {
    renderer.setPixelRatio(dpr)
    renderer.setSize(innerWidth, innerHeight, false)
    post.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
  }
  addEventListener('resize', resize)
  resize()

  // ---- scroll: cached section boxes ----
  const sections = [...document.querySelectorAll(cfg.SECTION_SELECTOR)]
  let boxes = []
  const measure = () => { boxes = sections.map(s => [s.offsetTop, Math.max(1, s.offsetHeight)]) }
  new ResizeObserver(() => { measure(); anchor() }).observe(document.body)
  measure()
  const sectionProgress = () => {
    const y = scrollY
    let p = 0
    for (const [top, h] of boxes) p += Math.min(1, Math.max(0, (y - top) / h))
    return p
  }
  // The hero shape is fitted into the page's .hero-mark box (cfg.HERO_ANCHOR), measured at
  // load and on resize, so it sits in its band at every width. A ramp delta may be a
  // function of that base (b => -b.y), so later shapes land where the config says.
  let base = { ...cfg.BASE }
  const anchor = () => {
    const el = cfg.HERO_ANCHOR && document.querySelector(cfg.HERO_ANCHOR)
    if (!el) return
    const r = el.getBoundingClientRect(), top = r.top + scrollY
    const halfH = cfg.CAMERA.z * Math.tan(THREE.MathUtils.degToRad(cfg.CAMERA.fov / 2)), halfW = halfH * innerWidth / innerHeight
    // box edges in world units on the z = 0 plane
    const toX = px => (px / innerWidth * 2 - 1) * halfW, toY = py => (1 - py / innerHeight * 2) * halfH
    const L = toX(r.left), R = toX(r.right), T = toY(top), B = toY(top + r.height)
    const cx = (L + R) / 2, cy = (T + B) / 2
    const hero = cfg.SHAPES[0], [ex, ey, ez = 0] = cfg.EXTENTS[0] // half extents in radius units (bake)
    // Fit the front face. It sits ez * radius * scale nearer the camera, so perspective pushes
    // it away from the screen centre by m = z / (z - front): an off-centre shape grows more on
    // its outer edge. Each edge must stay inside the box: (c +- half) * m within [L, R], [B, T].
    let scale = 1
    for (let i = 0; i < 4; i++) {
      const m = cfg.CAMERA.z / (cfg.CAMERA.z - ez * hero.radius * scale)
      const hx = Math.min(R / m - cx, cx - L / m), hy = Math.min(T / m - cy, cy - B / m)
      scale = Math.max(0.05, Math.min(hx / (ex * hero.radius), hy / (ey * hero.radius)))
    }
    base = { ...cfg.BASE, x: cx, y: cy, scale }
  }
  const timeline = p => {
    const out = { ...base }
    for (const [from, to, delta] of cfg.RAMPS) {
      const f = Math.min(1, Math.max(0, (p - from) / (to - from)))
      for (const k in delta) out[k] += (typeof delta[k] === 'function' ? delta[k](base) : delta[k]) * f
    }
    return out
  }

  // ---- pointer: world point on the z = 0 plane, plus eased speed for Dala's hover ----
  const ndc = new THREE.Vector2(), last = new THREE.Vector2()
  let pointer = false, speed = 0
  addEventListener('pointermove', e => {
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    pointer = true
  }, { passive: true })
  document.addEventListener('pointerleave', () => { pointer = false })

  const u = field.uniforms, mu = field.material.uniforms
  anchor()
  const cur = timeline(sectionProgress())
  let t = 0, prev = performance.now(), show = reduced ? 1 : 0
  let slow = 0, frames = 0

  const frame = (fixedDt) => {
    const now = performance.now()
    const dt = fixedDt ?? Math.min((now - prev) / 1000, 0.1)
    prev = now
    t += reduced ? 0 : dt
    const k = 1 - Math.exp(-dt * 6)

    const target = timeline(sectionProgress())
    for (const key in cur) cur[key] += (target[key] - cur[key]) * k
    show = Math.min(1, show + dt / 2.4)
    u.uShow.value = 1 - Math.pow(1 - show, 3)
    u.uProgress.value = cur.shape
    u.uExplode.value = cur.explode

    // phones: shape centred, smaller, never wider than 92% of the screen
    const wide = innerWidth > 760
    const halfH = cfg.CAMERA.z * Math.tan(THREE.MathUtils.degToRad(cfg.CAMERA.fov / 2)), halfW = halfH * camera.aspect
    const fit = halfW * 2 * 0.92 / (2 * cfg.SHAPES[Math.min(cfg.SHAPES.length - 1, Math.round(cur.shape))].radius * cur.scale)
    const onHero = cur.shape < 0.5 && cur.explode < 0.5 && cfg.HERO_ANCHOR
    group.position.set(wide || onHero ? cur.x : 0, wide || onHero ? cur.y : cur.y * 0.4 + 1.6, 0)
    group.scale.setScalar(onHero ? cur.scale : cur.scale * Math.min(wide ? 1 : 0.6, fit))
    group.rotation.y = cur.rotY + (reduced ? 0 : Math.sin(t * 0.25) * 0.1)
    group.updateMatrixWorld()

    // Dala turns the camera up to 0.075 rad toward the pointer. Our shapes sit near the
    // screen edges, where perspective turns that into a ~200 px shift, so ours turns 0.03.
    const km = 1 - Math.exp(-dt * 12)
    camera.rotation.y += (-0.03 * ndc.x - camera.rotation.y) * km
    camera.rotation.x += (0.02 * ndc.y - camera.rotation.x) * km

    // hover: pointer on the z = 0 plane in world units, speed eased toward 0
    const move = pointer ? last.distanceTo(ndc) / Math.max(dt, 1e-3) : 0
    last.copy(ndc)
    speed += (Math.min(move * 0.25, 2) - speed) * km
    mu.uMouse.value.set(pointer ? ndc.x * halfW : 99, pointer ? ndc.y * halfH : 99, 0)
    mu.uDelta.value = speed
    const cloud = Math.min(1, Math.max(0, cur.explode))
    const pastHero = Math.min(1, Math.max(0, cur.shape / 0.6, cloud)) // 0 while the hero shape shows
    mu.uCloudAmount.value = cloud
    mu.uQuiet.value = Math.min(1, pastHero * (0.6 + 0.4 * cloud)) // how much the text column clears, 0..1
    mu.uFocus.value = camera.position.distanceTo(group.position)

    field.update(t, dt)
    dust.update(t)
    post.render(t)

    // adaptive resolution: if frames run slow for ~1.5 s, render fewer pixels
    frames++
    if (dt > 1 / 50) slow++
    if (frames >= 90) {
      if (slow > 45 && dpr > 0.6) { dpr = Math.max(0.6, dpr - 0.15); resize() }
      frames = 0; slow = 0
    }
  }
  renderer.compile(scene, camera)
  renderer.setAnimationLoop(() => frame())

  if (import.meta.env.DEV) window.__stage = { renderer, field, dust, post, scene, camera, sectionProgress, step: n => { for (let i = 0; i < n; i++) frame(1 / 60) } }
}
