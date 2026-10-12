// Text mask (D-079): particles dim where page text sits on top of them. A small canvas,
// 192 px wide, is painted white over every text box on screen, softened, and read by the
// particle shaders (field.js underText). Text boxes are measured in page coordinates when the
// layout or the Lab's DOM changes, so a scroll frame only repaints the canvas.
import * as THREE from 'three'

export function createTextMask({ selector, floor = 0.15, pad = 14 }) {
  const W = 192
  const canvas = document.createElement('canvas')
  const g = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false

  let rects = [], dirty = true, lastY = NaN
  const measure = () => {
    const y = scrollY
    rects = []
    for (const el of document.querySelectorAll(selector)) {
      const r = el.getBoundingClientRect()
      if (r.width && r.height) rects.push([r.left, r.top + y, r.width, r.height])
    }
    dirty = true
  }
  const size = () => { canvas.width = W; canvas.height = Math.max(1, Math.round(W * innerHeight / innerWidth)); dirty = true }

  // re-measure at most every 250 ms while the Lab re-renders (tabs, filters, FAQ). The hero's
  // typing line changes every few frames and never moves a box, so its mutations are ignored.
  let timer = 0
  const later = () => { if (!timer) timer = setTimeout(() => { timer = 0; measure() }, 250) }
  new MutationObserver(muts => {
    if (muts.some(m => !(m.target.nodeType === 1 ? m.target : m.target.parentElement)?.closest('.rotor'))) later()
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'open', 'style'] })
  new ResizeObserver(later).observe(document.body)
  addEventListener('resize', () => { size(); later() })
  document.fonts?.ready.then(measure)
  size(); measure()

  return {
    uniforms: { tMask: texture, uMaskOn: 1, uMaskFloor: floor },
    // repaint only when the page has scrolled or the boxes changed
    update() {
      const y = scrollY
      if (!dirty && y === lastY) return
      dirty = false; lastY = y
      const s = W / innerWidth, top = y - pad, bottom = y + innerHeight + pad
      g.clearRect(0, 0, canvas.width, canvas.height)
      g.filter = 'blur(2px)' // soft edges, so particles fade in and out of a box instead of popping
      g.fillStyle = '#fff'
      for (const [x, ry, w, h] of rects) {
        if (ry + h < top || ry > bottom) continue
        g.fillRect((x - pad) * s, (ry - y - pad) * s, (w + pad * 2) * s, (h + pad * 2) * s)
      }
      texture.needsUpdate = true
    },
  }
}
