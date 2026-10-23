// One fixed WebGL canvas behind the whole page (D-063). Scroll progress is Dala's model:
// section index + fraction scrolled past the top of the screen, fed through the draft's
// RAMPS table. Section offsets are cached and refreshed on layout change, so a frame reads
// nothing from the DOM but scrollY. Native scroll only: the Lab relies on CSS smooth
// scrolling and anchor links, which a smooth-scroll library would fight (D-068).
import * as THREE from 'three'
import { createField, createDust } from './field.js'
import { createPost } from './post.js'
import { createTextMask } from './mask.js'

// stands in for the passes' full-screen triangle when compiling: three builds a different program
// for a geometry with other attributes, so this has theirs (position and uv, no normal)
const QUAD = new THREE.BufferGeometry()
  .setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(9), 3))
  .setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(6), 2))

export async function startStage(cfg) {
  const canvas = document.createElement('canvas')
  canvas.className = 'particle-field'
  let lastShift = 0
  canvas.setAttribute('aria-hidden', 'true')
  document.body.prepend(canvas)

  // One WebGL context, made here and handed to three (each extra context costs a GPU browser
  // 25 to 300 ms of main thread, D-101). Asked first to refuse a "major performance caveat",
  // which only a browser drawing WebGL in software does (SwiftShader, llvmpipe, WARP); that
  // browser is asked again without it. No WebGL2 at all skips three, which would log three
  // console errors while failing (D-100).
  let renderer, gl, softwareGL = false
  try {
    // three's own context attributes; Dala renders at DPR 1 with no antialias: that is its look and its speed (D-065)
    const attrs = { alpha: true, depth: true, stencil: false, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' }
    gl = canvas.getContext('webgl2', { ...attrs, failIfMajorPerformanceCaveat: true })
    if (!gl) { softwareGL = true; gl = canvas.getContext('webgl2', attrs) }
    if (!gl) throw new Error('no WebGL2')
    renderer = new THREE.WebGLRenderer({ canvas, context: gl })
  } catch {
    canvas.remove() // no WebGL: the Lab page on black is complete without it
    // D-100: ...and still shows the particles: a still of the formed hero shape in its box,
    // captured from the live engine (scripts/make-posters.js). `screen` blending drops its black.
    const box = cfg.POSTER && cfg.HERO_ANCHOR && document.querySelector(cfg.HERO_ANCHOR)
    if (box) {
      const img = new Image()
      Object.assign(img, { src: cfg.POSTER, alt: '', decoding: 'async', className: 'particle-still' })
      img.setAttribute('aria-hidden', 'true')
      box.append(img)
    }
    return
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  // D-100: the particles show for every visitor; only how much each frame costs changes.
  // Quality: 2 = full (bloom, DPR 1), 1 = DPR 0.75, 0 = light (DPR 0.5, no bloom, and the field
  // settles: it redraws only while something changes). A browser that draws WebGL in software
  // starts at 0 (the caveat test above): full quality would cost it 0.4 to 1 s per frame.
  // A second signal is the renderer's own name, where the browser shares it: Chrome started with
  // --enable-unsafe-swiftshader accepts the caveat test, but still calls itself SwiftShader.
  if (!softwareGL) try {
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    softwareGL = /swiftshader|llvmpipe|softpipe|software|basic render|warp/i.test(String(name))
  } catch {}
  const DPR = [0.5, 0.75, 1]
  let level = softwareGL ? 0 : 2
  if (import.meta.env.DEV) { const q = new URLSearchParams(location.search).get('quality'); if (q in DPR) level = +q } // dev only: preview a level
  let dpr = DPR[level]
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 1)
  canvas.dataset.quality = level

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(cfg.CAMERA.fov, 1, 0.1, 60)
  camera.position.z = cfg.CAMERA.z
  const field = await createField(renderer, cfg)
  const dust = createDust(cfg)
  const group = new THREE.Group()
  group.add(field.mesh)
  scene.add(group, dust.mesh)
  const post = createPost(renderer, scene, camera)
  post.bloom.enabled = level > 0
  field.setLite(level === 0)
  // D-079: drafts that set TEXT_MASK dim the particles under the page text
  const mask = cfg.TEXT_MASK && createTextMask(cfg.TEXT_MASK)
  if (mask) for (const m of [field.material, dust.material]) for (const k in mask.uniforms) m.uniforms[k].value = mask.uniforms[k]

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
  // ---- inner pages (D-096): the page's [data-stop] elements instead of the Lab's sections ----
  // Stop 0 is the hero (its shape fitted into .hero-mark). Each later stop eases in while its
  // top travels from 80% to 35% of the screen: "cloud" scatters the current shape behind the
  // content, "<k>" forms shape k at data-side, "last" forms the C behind the Book a call band.
  const stopEls = cfg.STOPS ? [...document.querySelectorAll('[data-stop]')] : []
  let stopTops = []
  const measureStops = () => { stopTops = stopEls.map(el => el.getBoundingClientRect().top + scrollY) }
  if (cfg.STOPS) { new ResizeObserver(measureStops).observe(document.body); measureStops() }
  const stopProgress = () => {
    let p = 0
    for (let i = 1; i < stopTops.length; i++) p += Math.min(1, Math.max(0, (scrollY + innerHeight * 0.8 - stopTops[i]) / (innerHeight * 0.45)))
    return p
  }
  const stopStates = () => {
    const halfH = cfg.CAMERA.z * Math.tan(THREE.MathUtils.degToRad(cfg.CAMERA.fov / 2)), halfW = halfH * innerWidth / innerHeight
    const wide = innerWidth > 760, out = [{ ...base }]
    for (let i = 1; i < stopEls.length; i++) {
      const el = stopEls[i], d = el.dataset.stop, prev = out[i - 1]
      if (d === 'cloud') { out.push({ ...prev, explode: 1, x: 0, y: 0, scale: 1 }); continue }
      const k = d === 'last' ? cfg.SHAPES.length - 1 : +d
      const [ex, ey] = cfg.EXTENTS[k], r = cfg.SHAPES[k].radius
      if (d === 'last') {
        const sc = Math.min(halfH * 0.44 / (ey * r), halfW * (wide ? 0.4 : 0.8) / (ex * r))
        out.push({ ...prev, shape: k, explode: 0, x: 0, y: -halfH * 0.27, scale: sc }) // on the band's centre
      } else {
        const sc = Math.min(halfH * 0.34 / (ey * r), halfW * (wide ? 0.2 : 0.8) / (ex * r)) // margin-sized: whole, readable, beside the content
        const x = wide ? (el.dataset.side === 'left' ? -1 : 1) * halfW * 0.84 : 0
        out.push({ ...prev, shape: k, explode: 0, x, y: wide ? 0 : halfH * 0.4, scale: wide ? sc : sc * 0.75 })
      }
    }
    return out
  }
  const stopTimeline = p => {
    const st = stopStates(), i = Math.min(st.length - 1, Math.floor(p)), f = Math.min(1, p - i)
    const a = st[i], b = st[Math.min(st.length - 1, i + 1)], o = {}
    for (const k in a) o[k] = a[k] + (b[k] - a[k]) * f
    return o
  }

  const timeline = p => {
    if (cfg.STOPS) return stopTimeline(p)
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
  const progress = cfg.STOPS ? stopProgress : sectionProgress
  const cur = timeline(progress())
  let t = 0, prev = performance.now(), show = reduced ? 1 : 0

  // D-100: quality steps. Frame intervals are measured only between frames that were actually
  // drawn back to back; if they average under 24 fps (30 Hz screens stay put) over 20 frames or
  // one second of frames, whichever comes first, the field drops one level. It never steps back
  // up, so it can't oscillate. Timing starts once the shaders are compiled (below).
  const setLevel = l => { level = l; dpr = DPR[l]; post.bloom.enabled = l > 0; field.setLite(l === 0); canvas.dataset.quality = l; resize() }
  let startedAt = Infinity
  let lastDrawn = 0, acc = 0, cnt = 0
  // The settle window (light level and reduced motion): the field runs while something changes
  // (the intro, a scroll, a resize, the footer moving), draws its final state, then holds it.
  let awakeUntil = Infinity // set when the loop starts: the intro, particles gather in over 2.4 s
  let settled = false, lastDraw = 0
  const wake = () => { awakeUntil = performance.now() + 2500; settled = false }
  addEventListener('scroll', wake, { passive: true })
  addEventListener('resize', wake)
  document.addEventListener('visibilitychange', () => { lastDrawn = 0 })

  const frame = (fixedDt) => {
    const now = performance.now()
    // the field ends at the footer: once the footer's top edge is on screen, the fixed canvas
    // moves up with it, so the shape scrolls away with the content above and nothing is behind the footer
    const foot = document.querySelector('.cx-foot')
    const shift = foot ? Math.max(0, Math.min(innerHeight, innerHeight - foot.getBoundingClientRect().top)) : 0
    if (shift !== lastShift) { canvas.style.transform = shift ? `translateY(${-shift}px)` : ''; lastShift = shift; wake() }
    // nothing visible would change: the canvas is fully off screen, or the field has settled
    const settles = level === 0 || reduced
    if (fixedDt === undefined && (shift >= innerHeight || (settles && settled))) { prev = now; lastDrawn = 0; return }
    const closing = settles && now > awakeUntil // the window's last frame: draw the final state, then hold
    // the light level draws few frames a second: it follows real time (up to 0.5 s a frame), so
    // the intro, the easing and the physics (below) finish on time instead of in slow motion
    const dt = fixedDt ?? Math.min((now - prev) / 1000, level === 0 ? 0.5 : 0.1)
    prev = now
    t += reduced ? 0 : dt
    const k = 1 - Math.exp(-dt * 6)

    const target = timeline(progress())
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
    if (cfg.STOPS) { // inner pages: stop states already carry the phone layout
      group.position.set(cur.x, cur.y, 0)
      group.scale.setScalar(cur.scale)
    } else {
      group.position.set(wide || onHero ? cur.x : 0, wide || onHero ? cur.y : cur.y * 0.4 + 1.6, 0)
      group.scale.setScalar(onHero ? cur.scale : cur.scale * Math.min(wide ? 1 : 0.6, fit))
    }
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
    mu.uQuiet.value = cfg.STOPS ? cloud : Math.min(1, pastHero * (0.6 + 0.4 * cloud)) // how much the text column clears, 0..1
    mu.uFocus.value = camera.position.distanceTo(group.position)

    // light level: physics in steps of at most 1/30 s, so a long frame doesn't overshoot the
    // springs; the other levels keep one step a frame, as before
    const steps = level === 0 ? Math.min(15, Math.max(1, Math.ceil(dt * 30))) : 1
    for (let i = 0; i < steps; i++) field.update(t, dt / steps)
    dust.update(t)
    if (closing) settled = true

    // Draw every frame, except at the light level: there the physics keeps running every frame
    // (it costs ~0 ms), but presenting a drawn frame costs a software-WebGL browser ~230 ms of
    // main thread (measured 2026-10-22, testing-results/analysis/check-cost-split.js). So it
    // draws the intro's formed shape once, at the end of the intro (a 1 fps gather-in would only
    // look like jumping dots), then once a second while a scroll moves the shape, and once more
    // as each window closes.
    const inIntro = now < startedAt + 3500
    if (level > 0 || closing || fixedDt !== undefined || (!inIntro && now - lastDraw >= 1000)) {
      mask?.update(shift)
      post.render(t)
      lastDraw = now
      if (lastDrawn && now - startedAt > 1500) {
        acc += now - lastDrawn; cnt++
        if (cnt >= 20 || acc > 1000) {
          if (level > 0 && acc / cnt > 1000 / 24) setLevel(level - 1)
          acc = 0; cnt = 0
        }
      }
      lastDrawn = now
    }
  }
  // Compile every shader the first frame draws with before it, without blocking the page where
  // the browser compiles in parallel. three builds one program for drawing into a render target
  // and another for the canvas, so each compiles where it draws: the scene, bloom and physics
  // into a render target, the finish pass onto the canvas. Compiling the scene for the canvas
  // only built two programs nothing drew with, and the first frame still waited ~0.7 s (D-101).
  const quads = ms => ms.reduce((g, m) => g.add(new THREE.Mesh(QUAD, m)), new THREE.Group())
  const b = post.bloom, offscreen = [...field.compute]
  if (b.enabled) offscreen.push(b.materialHighPassFilter, ...b.separableBlurMaterials, b.compositeMaterial, b.blendMaterial)
  renderer.setRenderTarget(post.composer.readBuffer)
  const ready = [renderer.compileAsync(scene, camera), renderer.compileAsync(quads(offscreen), camera)]
  renderer.setRenderTarget(null)
  ready.push(renderer.compileAsync(quads([post.finish.material]), camera))
  await Promise.all(ready)
  startedAt = performance.now(); awakeUntil = startedAt + 3500; prev = lastDraw = startedAt
  renderer.setAnimationLoop(() => frame())

  if (import.meta.env.DEV) window.__stage = { renderer, field, dust, post, scene, camera, sectionProgress, step: n => { for (let i = 0; i < n; i++) frame(1 / 60) } }
}
