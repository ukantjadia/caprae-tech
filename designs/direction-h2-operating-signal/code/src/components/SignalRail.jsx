import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useLocation } from 'react-router-dom'
import './SignalRail.css'

export default function SignalRail() {
  const { pathname } = useLocation()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.3 })
  const [sections, setSections] = useState([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const stages = [...document.querySelectorAll('.route-stage')]
    const stage = stages.at(-1)
    const items = [...(stage?.querySelectorAll('[data-signal]') || []), ...document.querySelectorAll('.foot[data-signal]')]
    setSections(items.map((node) => ({ id: node.id, label: node.dataset.signal })))
    setActive(items[0]?.id || '')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-25% 0px -58%', threshold: [0.1, 0.35, 0.7] },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <aside className="signal" aria-label="Page sections">
      <div className="signal__track" aria-hidden="true">
        <motion.span className="signal__progress" style={{ scaleY: progress, scaleX: progress }} />
      </div>
      <ol>
        {sections.map((section) => (
          <li key={section.id} className={active === section.id ? 'is-active' : ''}>
            <button type="button" onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}>
              <span>{section.label}</span><i aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </aside>
  )
}
