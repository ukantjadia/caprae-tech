import { useEffect, useRef, useState } from 'react'

// A live 3D view laid over its static fallback. The fallback (SVG) is what no-JS and
// no-WebGL visitors see. three.js is fetched only once a view nears the viewport.
let engine
const loadEngine = () => (engine ??= import('./engine.js'))
const hasWebGL = () => {
  try { return !!document.createElement('canvas').getContext('webgl2') } catch { return false }
}

export default function View({ kind, fallback, className = '' }) {
  const ref = useRef(null)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !hasWebGL()) return
    let dispose, cancelled = false
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      loadEngine().then((m) => { if (!cancelled) dispose = m.addView(canvas, kind, () => setLive(true)) }).catch(() => {})
    }, { rootMargin: '400px' })
    io.observe(canvas)
    return () => { cancelled = true; io.disconnect(); dispose?.() }
  }, [kind])
  return (
    <div className={(className.split(' ').includes('absolute') ? '' : 'relative ') + className}>
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: live ? 0 : 1 }}>{fallback}</div>
      <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full transition-opacity duration-700" style={{ opacity: live ? 1 : 0 }} />
    </div>
  )
}
