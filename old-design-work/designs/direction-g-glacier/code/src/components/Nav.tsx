import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* The Glacier glass dock, kept, but it now does a job: each pill is a section
 * and the sliding highlight follows the reader down the page. The highlight is
 * the same layoutId spring from the Glacier build.
 */
const sections = [
  { id: 'record', label: 'Record' },
  { id: 'wedge', label: 'Why us' },
  { id: 'team', label: 'Team' },
  { id: 'process', label: 'Process' },
]

export default function Nav() {
  const [active, setActive] = useState('record')

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (vis) setActive(vis.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div style={{ position: 'fixed', top: '26px', left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 8px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          boxShadow: '0 12px 44px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.16)',
        }}
      >
        <a
          href="#top"
          className="mono"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px 0 8px',
            fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#fff', textDecoration: 'none',
            borderRight: '1px solid rgba(255,255,255,0.14)', marginRight: '4px', height: '30px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M4 9 H20 M12 2 V22 M8 9 L12 22 L16 9" stroke="#fff" strokeWidth="0.7" opacity="0.55" />
          </svg>
          Caprae Tech
        </a>

        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="mono"
              style={{
                position: 'relative', padding: '0 15px', height: '30px', borderRadius: '999px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                transition: 'color 0.2s ease',
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="dock-active"
                  style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: 'rgba(0,0,0,0.34)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{s.label}</span>
            </a>
          )
        })}

        <a
          href="#contact"
          className="mono"
          style={{
            marginLeft: '4px', padding: '0 16px', height: '30px', borderRadius: '999px',
            display: 'flex', alignItems: 'center',
            fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', textDecoration: 'none',
            background: '#F9D360', color: '#04070A',
          }}
        >
          Book a call
        </a>
      </motion.nav>
    </div>
  )
}
