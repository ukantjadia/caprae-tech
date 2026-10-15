import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Close, Logo, Menu } from './icons.jsx'
import './Navbar.css'

const links = [
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  /* The bar is transparent over the hero, which is the point. Past the hero it
     was sitting on live text: at 900px the eyebrow ran straight under the logo.
     This is a defect rather than decoration, so it does not go in motion.css
     behind the scroll-timeline guard. Firefox has to get it too. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // a route change must close the sheet, or it hangs over the new page
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <Link className="nav__brand" to="/" viewTransition>
        <Logo className="nav__logo" />
        <span>Caprae Tech</span>
      </Link>

      <nav className="nav__pill" aria-label="Primary">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} viewTransition className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav__actions">
        <Link className="btn btn--light nav__cta" to="/contact" viewTransition>Book a call</Link>
        <button
          className="nav__burger"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          <ul>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} viewTransition>{link.label}</NavLink>
              </li>
            ))}
          </ul>
          <Link className="btn btn--flame nav__sheet-cta" to="/contact" viewTransition>Book a call</Link>
        </div>
      )}

      <div className="progress" aria-hidden="true" />
    </header>
  )
}
