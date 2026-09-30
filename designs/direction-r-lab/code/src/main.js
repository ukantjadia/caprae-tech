// A Direction R page with the Section Lab content. The page (a|b|c/index.html) is generated
// by scripts/port.js; the Lab's own inline script builds its sections and interactions.
import './styles/app.css'
import { startClaimMarkers } from '../../../../builds/dala-lab-engine/claims.js'
import { applyA11yFixes } from '../../../../builds/dala-lab-engine/a11y.js'

// R's header: the blurred bar fades in once the page scrolls
const header = document.querySelector('[data-r-header]')
const onScroll = () => header?.classList.toggle('scrolled', scrollY > 8)
addEventListener('scroll', onScroll, { passive: true })
onScroll()

// R's 3D views (three/View.jsx without React): three.js loads only when a view nears the
// viewport, one shared WebGL context draws them all, and the fallback shows until it does
const hasWebGL = () => { try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false } }
if (hasWebGL()) {
  let engine
  const load = () => (engine ??= import('./three/engine.js'))
  for (const el of document.querySelectorAll('[data-view]')) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      load().then(m => m.addView(el.querySelector('canvas'), el.dataset.view, () => el.classList.add('live'))).catch(() => {})
    }, { rootMargin: '400px' })
    io.observe(el)
  }
}

applyA11yFixes()
startClaimMarkers()
