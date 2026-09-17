import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

export default function AnimatedNumber({ value, prefix = '', suffix = '', duration = 0.75 }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, amount: 0.65 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!visible) return
    if (reduced) { setDisplay(value); return }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [duration, reduced, value, visible])

  return <b ref={ref} aria-label={`${prefix}${value}${suffix}`}>{prefix}{display}{suffix}</b>
}
