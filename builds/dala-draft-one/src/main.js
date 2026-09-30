import * as THREE from 'three'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createField, createDust } from './particles.js'
import { createPost } from './post.js'
import { BASE, RAMPS, CAMERA } from './config.js'

gsap.registerPlugin(ScrollTrigger)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

// Lenis runs on GSAP's ticker so smooth scroll and ScrollTrigger read the same frame
if (!reduced) {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

const canvas = document.querySelector('.field')
const sections = [...document.querySelectorAll('[data-section]')]

// Dala's sectionProgress: each section adds 0..1 while it scrolls past the top of the
// screen, so the sum is "section index + fraction through it".
const passes = sections.map(trigger => ScrollTrigger.create({ trigger, start: 'top top', end: 'bottom top' }))
const sectionProgress = () => passes.reduce((sum, s) => sum + s.progress, 0)

// Evaluate the RAMPS table in config.js at progress p
const clamp01 = v => Math.min(1, Math.max(0, v))
const timeline = p => {
  const out = { ...BASE }
  for (const [from, to, delta] of RAMPS) {
    const f = clamp01((p - from) / (to - from))
    for (const key in delta) out[key] += delta[key] * f
  }
  return out
}

// Text: hero lines rise in once the loader finishes, every other block as it enters
let heroIntro = null
if (!reduced) {
  sections.forEach((section, i) => {
    const parts = section.querySelectorAll('.section__body > *, .section__body li')
    const from = { y: 36, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07 }
    if (i === 0) heroIntro = gsap.from(parts, { ...from, delay: 0.2, paused: true })
    else gsap.from(parts, { ...from, scrollTrigger: { trigger: section.querySelector('.section__body') || section, start: 'top 80%', toggleActions: 'play none none reverse' } })
  })
}

let renderer
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
} catch {
  canvas.remove() // no WebGL: the page is plain text on black, still complete
}

if (renderer) start()
else heroIntro?.play()

// Dala's loader, as observed live: a 4-square spinner over a two-line tagline, "Loading"
// bottom-left, a small counter bottom-right that eases toward real progress. At 100 the
// tagline leaves, the label reads "Completed", then the overlay fades.
// Made by JS, so visitors without JS or WebGL never see it.
function createLoader() {
  const el = document.createElement('div')
  el.className = 'loader'
  el.setAttribute('aria-hidden', 'true')
  el.innerHTML = `
    <div class="loader__center">
      <span class="loader__spinner"><i></i><i></i><i></i><i></i></span>
      <p class="loader__line">Engineers who already build</p>
      <p class="loader__line">for operators.</p>
    </div>
    <span class="loader__label">Loading</span>
    <span class="loader__count">0</span>`
  document.body.append(el)
  const count = el.querySelector('.loader__count'), label = el.querySelector('.loader__label')
  let shown = 0, target = 0, finish
  const done = new Promise(r => { finish = r })
  const tick = () => {
    shown += (target - shown) * 0.12
    if (target >= 100 && shown > 99.5) {
      count.textContent = '100'
      label.textContent = 'Completed'
      el.classList.add('is-complete') // tagline out, counter dims
      setTimeout(() => el.classList.add('is-done'), 500) // then the overlay fades
      setTimeout(() => el.remove(), 1200)
      return setTimeout(finish, 500)
    }
    count.textContent = String(Math.floor(shown))
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  return { set: p => { target = Math.max(target, p * 100) }, done, get target() { return target } }
}

async function start() {
  renderer.setPixelRatio(1) // cost grows with DPR squared; DPR 1 like Dala (D-067)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 60)
  camera.position.z = CAMERA.z

  const loader = reduced ? null : createLoader()
  const field = await createField(renderer, p => loader?.set(p * 0.9)) // download = 0-90%
  const dust = createDust()
  const post = createPost(renderer)
  if (import.meta.env.DEV) window.__field = { field, renderer, gsap, sectionProgress, loader }
  const group = new THREE.Group()
  group.add(field.mesh)
  scene.add(group, dust.mesh)

  const resize = () => {
    const w = innerWidth, h = innerHeight
    renderer.setSize(w, h, false)
    post.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  addEventListener('resize', resize)
  resize()

  // pointer -> ray onto the field's plane -> field-local point for the repulsion
  const ndc = new THREE.Vector2(), ray = new THREE.Raycaster(), plane = new THREE.Plane()
  const hit = new THREE.Vector3(), normal = new THREE.Vector3()
  let pointer = false
  addEventListener('pointermove', e => {
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    pointer = true
  })
  document.addEventListener('pointerleave', () => { pointer = false })

  const u = field.uniforms
  const now0 = timeline(sectionProgress())
  const cur = { ...now0 } // eased values, start where the page is (scroll restore)
  let last = performance.now(), t = 0, show = 0

  const frame = (fixedDt) => {
    const now = performance.now()
    const dt = fixedDt ?? Math.min((now - last) / 1000, 0.05)
    last = now
    t += dt
    const k = 1 - Math.exp(-dt * 6) // Dala eases 0.1 per frame at 60fps

    const target = timeline(sectionProgress())
    for (const key in cur) cur[key] += (target[key] - cur[key]) * k

    show = Math.min(1, show + dt / 2.2)
    u.uShow.value = 1 - Math.pow(1 - show, 3)
    u.uProgress.value = cur.shape
    u.uExplode.value = cur.explode

    // phones: shape stays centred above the text, smaller
    const wide = innerWidth > 760
    group.position.set(wide ? cur.x : cur.x * 0.12, wide ? cur.y : cur.y + 2.6, 0)
    group.scale.setScalar(cur.scale * (wide ? 1 : 0.55))
    group.rotation.y = cur.rotY + (reduced ? 0 : Math.sin(t * 0.25) * 0.12) + ndc.x * 0.12
    group.rotation.x = -ndc.y * 0.08
    group.updateMatrixWorld()

    if (pointer) {
      ray.setFromCamera(ndc, camera)
      plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(normal).negate(), group.position)
      if (ray.ray.intersectPlane(plane, hit)) u.uMouse.value.copy(group.worldToLocal(hit))
    } else u.uMouse.value.set(99, 99, 99)

    // slight camera parallax so the dust layers slide past each other
    const kc = 1 - Math.exp(-dt * 12) // pointer follows faster than scroll easing (D-067)
    camera.position.x += (ndc.x * 0.4 - camera.position.x) * kc
    camera.position.y += (ndc.y * 0.25 - camera.position.y) * kc
    camera.lookAt(0, 0, 0)

    const focus = camera.position.distanceTo(group.position) // keep the shape sharp
    field.setFocus(focus)
    post.uniforms.uFocus.value = focus
    field.update(t, dt)
    dust.update(t)
    post.render(scene, camera, t)
  }
  await document.fonts.ready
  loader?.set(0.95)
  renderer.compile(scene, camera) // shaders compile behind the loader, not on the first frame
  loader?.set(1)
  loader ? loader.done.then(() => heroIntro?.play()) : heroIntro?.play()

  renderer.setAnimationLoop(() => frame())
  // dev: advance n frames by hand, for checking in a background tab where rAF is paused
  if (import.meta.env.DEV) window.__field.step = (n = 60) => { ScrollTrigger.update(); for (let i = 0; i < n; i++) frame(1 / 60) }
}
