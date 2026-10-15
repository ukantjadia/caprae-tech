import { Link } from 'react-router-dom'
import HeroMedia from '../components/HeroMedia.jsx'
import { ArrowRight, Globe } from '../components/icons.jsx'
import './pages.css'
import './Home.css'

/* Every figure on this page is [VERIFIED] against project-info and carries its
 * source inline. Four products, never eight. Firm figures keep their scope
 * label, because removing it turns a true statement into a false one.
 */
const stats = [
  { value: '150+', label: 'Projects delivered' },
  { value: '98%', label: 'Client satisfaction' },
]

const capabilities = [
  ['Dedicated engineers', 'Monthly, embedded in your team.'],
  ['Fixed-scope projects', 'MVP through full platform.'],
  ['Fractional CTO', 'Technical advisory and architecture.'],
  ['AI readiness', 'Automation and ML workflows.'],
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <HeroMedia />

        <div className="hero__inner">
          <div className="hero__lead">
            <p className="hero__note">
              <Globe className="hero__note-icon" />
              <span>Part of Caprae Capital<br />Four products live, one open source</span>
            </p>

            <h1 className="display hero__title">
              Technology<br />
              Crafted for<br />
              <em>Operators</em>
            </h1>

            <p className="hero__sub">
              Our engineers build the software Caprae&rsquo;s own searchers, bankers and
              acquirers use every day. That team is now available to yours.
            </p>

            <div className="hero__cta">
              <Link className="btn btn--flame hero__go" to="/contact" viewTransition>
                Book a call
                <span className="btn__dot" aria-hidden="true"><ArrowRight /></span>
              </Link>
              <Link className="btn btn--ghost" to="/work" viewTransition>See the record</Link>
            </div>

            <ul className="hero__stats">
              {stats.map((stat) => (
                <li key={stat.label} className="stat">
                  <span className="stat__mark" aria-hidden="true">*</span>
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                  <span className="stat__rule" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="band shell">
        <p className="eyebrow">The part a dev shop cannot copy</p>
        <h2 className="section">
          You are not paying to teach them<br />what a <em>deal</em> looks like
        </h2>
        <p className="lede">
          Every agency claims it understands your business. Ours reports into a private
          equity firm that closes deals with operators, and sits in recurring meetings
          with them. Our engineers have already survived the founder relationship.
        </p>
        <ul className="points">
          <li>They know what an operator asks for, which is rarely what they say first.</li>
          <li>They have seen a requirement change three times in a month and shipped anyway.</li>
          <li>They understand diligence pressure and why a close date is a close date.</li>
          <li>They do not need a product manager to translate business intent into a ticket.</li>
        </ul>
      </section>

      <section className="band band--hair shell">
        <p className="eyebrow">What we do</p>
        <h2 className="section">Four ways to work with us</h2>
        <ul className="cardgrid">
          {capabilities.map(([title, copy], i) => (
            <li key={title} className="card">
              <span className="card__n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ul>
        <Link className="btn btn--ghost cardgrid__more" to="/services" viewTransition>All services</Link>
      </section>

      <section className="band band--hair shell">
        <p className="eyebrow">The firm behind the team</p>
        <ul className="figures">
          <li><b>$110M+</b><span>closed, 2026 YTD<i>Caprae Capital, firm-wide</i></span></li>
          <li><b>20%+</b><span>MoM growth, 14+ months<i>Caprae Capital, firm-wide</i></span></li>
          <li><b>8</b><span>countries serviced<i>Caprae Capital, firm-wide</i></span></li>
          <li><b>40+</b><span>searchers supported<i>Caprae Capital, firm-wide</i></span></li>
        </ul>
      </section>
    </>
  )
}
