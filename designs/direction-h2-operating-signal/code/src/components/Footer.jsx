import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, partners } from './icons.jsx'
import './Footer.css'

/* The footer carries its own looping footage, faded in the same way the hero
 * does: `is-ready` is flipped by onCanPlay so a still frame never sits there
 * half-decoded. It only starts once the footer is actually near the viewport,
 * because decoding a second video on page load costs the hero its bandwidth.
 */
const sitemap = [
  {
    title: 'Company',
    items: [
      { label: 'Services', to: '/services' },
      { label: 'Work', to: '/work' },
      { label: 'Team', to: '/team' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'SaaSquatch Leads', href: 'https://www.saasquatchleads.com/' },
      { label: 'Cold Call Killers', href: 'https://coldcallkillers.io/' },
      { label: 'Bankers Edge', href: 'https://bankersedgeadvisory.com' },
      { label: 'CLOVER', to: '/work' },
    ],
  },
]

export default function Footer() {
  const hostRef = useRef(null)
  const videoRef = useRef(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: hostRef, offset: ['start end', 'end end'] })
  const markX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -38, 0])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setNear(true); io.disconnect() } },
      { rootMargin: '400px 0px' },
    )
    io.observe(host)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    const video = videoRef.current
    if (!video) return
    const play = video.play()
    if (play?.catch) play.catch(() => {})
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      setReady(true)
    }
  }, [near])

  return (
    <footer className="foot" id="site-contact" data-signal="Contact" ref={hostRef}>
      <div className="foot__media" aria-hidden="true">
        {near && (
          <video
            ref={videoRef}
            className={`foot__video ${ready ? 'is-ready' : ''}`}
            src={`${import.meta.env.BASE_URL}footer-loop.mp4`}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onCanPlay={() => setReady(true)}
          />
        )}
        <div className="foot__scrim" />
      </div>

      <div className="shell foot__inner">
        <div className="foot__pitch">
          <p className="eyebrow">Start here</p>
          <h2 className="section foot__title">
            Talk to the people<br />who would <em>build it</em>
          </h2>
          <p className="lede">
            Thirty minutes. What you are building, and what is in the way.
          </p>
          <Link className="btn btn--flame foot__cta" to="/contact" viewTransition>
            Book a call
            <span className="btn__dot" aria-hidden="true"><ArrowRight /></span>
          </Link>
        </div>

        <div className="foot__maps">
          {sitemap.map((group) => (
            <nav key={group.title} className="foot__map" aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.to
                      ? <Link to={item.to} viewTransition>{item.label}</Link>
                      : <a href={item.href} target="_blank" rel="noopener">{item.label}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="foot__map">
            <h3>Contact</h3>
            <ul>
              <li><a href="mailto:partners@capraecapital.com">partners@capraecapital.com</a></li>
              <li><a href="https://www.capraecapital.com/" target="_blank" rel="noopener">capraecapital.com</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shell foot__partners">
        <span className="foot__partners-label">Built by this team</span>
        <ul>
          {partners.map((partner) => (
            <li key={partner.name}>{partner.mark}<span>{partner.name}</span></li>
          ))}
        </ul>
      </div>

      <div className="foot__rule" />

      <div className="shell foot__base">
        <motion.span className="foot__mark" style={{ x: markX }}>CAPRAE TECH</motion.span>
        <span className="foot__fine">
          Part of Caprae Capital · Four products live, one open source
        </span>
      </div>
    </footer>
  )
}
