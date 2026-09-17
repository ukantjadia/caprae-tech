import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/icons.jsx'
import HeroMedia from '../components/HeroMedia.jsx'
import './pages.css'

/* Service descriptions are PLACEHOLDER copy, marked with .lorem in the markup
   so they can never be mistaken for approved messaging. Pricing is deliberately
   absent: the parent site publishes its own figures and inventing one here
   would contradict it. */
const services = [
  {
    n: '01',
    title: 'Dedicated engineers',
    lead: 'Monthly, embedded in your team.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Engineers join your standups, your board and your repo, and stay long enough to hold context.',
    items: ['Full-stack application development', 'Data pipelines and scrapers', 'Telephony and outbound systems'],
  },
  {
    n: '02',
    title: 'Fixed-scope projects',
    lead: 'MVP through full platform.',
    body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A written scope with a number in it, inside a week, and a build that ends when the scope says it ends.',
    items: ['Discovery and written scope', 'Design and build', 'Handover with documentation'],
  },
  {
    n: '03',
    title: 'Fractional CTO',
    lead: 'Technical advisory and architecture.',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco. Diligence support, architecture review, and the technical half of a decision you are about to make.',
    items: ['Technical diligence', 'Architecture and platform review', 'Hiring and team design'],
  },
  {
    n: '04',
    title: 'AI readiness',
    lead: 'Automation and ML workflows.',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit. Where a model genuinely helps, and where a rule and a queue would have been cheaper and better.',
    items: ['Workflow automation', 'ML and enrichment pipelines', 'Evaluation and guardrails'],
  },
]

const steps = [
  ['01', 'Call', 'Thirty minutes. What you are building, what is in the way.'],
  ['02', 'Scope', 'A written scope with a number in it, inside a week.'],
  ['03', 'Build', 'You meet the engineers, not an account manager.'],
]

export default function Services() {
  return (
    <>
      <section className="pagehead">
        <HeroMedia short />
        <div className="shell">
          <p className="eyebrow">Services</p>
          <h1 className="display">Four ways to<br />work with <em>us</em></h1>
          <p className="lede pagehead__lede">
            The same engineers who build Caprae&rsquo;s own products, on your side of the table.
          </p>
        </div>
      </section>

      <section className="band shell">
        <ul className="svc">
          {services.map((s) => (
            <li key={s.n} className="svc__item">
              <div className="svc__head">
                <span className="svc__n">{s.n}</span>
                <h2>{s.title}</h2>
                <p className="svc__lead">{s.lead}</p>
              </div>
              <div className="svc__body">
                <p className="lorem">{s.body}</p>
                <ul>
                  {s.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="band band--hair shell">
        <p className="eyebrow">How it works</p>
        <h2 className="section">Three steps, no account manager</h2>
        <ul className="cardgrid cardgrid--3">
          {steps.map(([n, t, d]) => (
            <li key={n} className="card">
              <span className="card__n">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
        <Link className="btn btn--flame cardgrid__more" to="/contact">
          Book a call
          <span className="btn__dot" aria-hidden="true"><ArrowRight /></span>
        </Link>
      </section>
    </>
  )
}
