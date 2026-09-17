import { ArrowRight } from '../components/icons.jsx'
import HeroMedia from '../components/HeroMedia.jsx'
import './pages.css'

/* The conversion mechanism is [OPEN] (Q17): booking link, form or email is not
   yet decided. Until it is, the page uses the one channel that is verified to
   exist, the partners address, rather than a form that posts nowhere. */
const steps = [
  ['01', 'Call', 'Thirty minutes. What you are building, what is in the way.'],
  ['02', 'Scope', 'A written scope with a number in it, inside a week.'],
  ['03', 'Build', 'You meet the engineers, not an account manager.'],
]

const faqs = [
  [
    'How fast can you start?',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder copy pending a real answer.',
  ],
  [
    'Do you work fixed-scope or monthly?',
    'Both. Dedicated engineers monthly, or a fixed-scope project with a written number in it.',
  ],
  [
    'What do you not take?',
    'Sed do eiusmod tempor incididunt. Placeholder pending the real list of what we turn down.',
  ],
  [
    'Where are the engineers?',
    'Ut enim ad minim veniam. Placeholder pending confirmed headcount and locations.',
  ],
]

export default function Contact() {
  return (
    <>
      <section className="pagehead" id="contact-opening" data-signal="Contact">
        <HeroMedia short />
        <div className="shell">
          <p className="eyebrow">Contact</p>
          <h1 className="display">Talk to the people<br />who would <em>build it</em></h1>
          <p className="lede pagehead__lede">
            Thirty minutes. What you are building, and what is in the way.
          </p>
          <a className="btn btn--flame pagehead__cta" href="mailto:partners@capraecapital.com">
            partners@capraecapital.com
            <span className="btn__dot" aria-hidden="true"><ArrowRight /></span>
          </a>
        </div>
      </section>

      <section className="band shell" id="next" data-signal="Next">
        <p className="eyebrow">What happens next</p>
        <h2 className="section">Three steps</h2>
        <ul className="cardgrid cardgrid--3">
          {steps.map(([n, t, d]) => (
            <li key={n} className="card">
              <span className="card__n">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="band band--hair shell" id="questions" data-signal="Questions">
        <p className="eyebrow">Questions</p>
        <h2 className="section">Before you write</h2>
        <ul className="faq">
          {faqs.map(([q, a]) => (
            <li key={q}>
              <h3>{q}</h3>
              <p className="lorem">{a}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
