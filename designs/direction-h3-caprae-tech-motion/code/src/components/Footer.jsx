import { useRef } from 'react'
import { Link } from 'react-router-dom'
import FooterField from './FooterField.jsx'
import { ArrowRight, partners } from './icons.jsx'
import './Footer.css'

/* H shipped a second 14.3MB video here. H1 replaces it with a shader that
 * costs about 5KB, which is the only place on this site where adding motion
 * also removes weight. FooterField owns its own visibility, resize and
 * reduced-motion handling, so this component is back to being markup.
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

  return (
    <footer className="foot" ref={hostRef}>
      <div className="foot__media" aria-hidden="true">
        <FooterField hostRef={hostRef} />
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
        <span className="foot__mark">CAPRAE TECH</span>
        <span className="foot__fine">
          Part of Caprae Capital · Four products live, one open source
        </span>
      </div>
    </footer>
  )
}
