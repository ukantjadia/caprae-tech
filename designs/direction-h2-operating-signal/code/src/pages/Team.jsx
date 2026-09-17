import HeroMedia from '../components/HeroMedia.jsx'
import './pages.css'

/* The five names and titles are [VERIFIED] against public sources and LinkedIn.
   Only Kevin Hong founded Caprae, so the other four are described by their real
   role and their own firm. Do not call these five "five founders": this audience
   checks, and three of these titles belong to other companies.

   The short bios are PLACEHOLDER copy, marked .lorem, and must be replaced
   before this ships. Headcount is [OPEN] (Q12), so no number appears here. */
const leaders = [
  {
    name: 'Kevin Hong',
    role: 'Founder and Managing Partner, Caprae Capital',
    school: 'Chicago Booth',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    linkedin: 'https://www.linkedin.com/in/kevinhshong/',
  },
  {
    name: 'Eric Nehrlich',
    role: 'Chief of Staff, Caprae Capital',
    school: 'Google',
    bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    linkedin: null,
  },
  {
    name: 'Felix I. Odigie',
    role: 'Deal Advisor. Founder and Managing Director, Quoin Advisors',
    school: 'Wharton',
    bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
    linkedin: null,
  },
  {
    name: 'Hereford Johnson',
    role: 'Principal Adviser. Founder, Third Equity Partners',
    school: 'Kellogg',
    bio: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
    linkedin: null,
  },
  {
    name: 'Zackary Beckham',
    role: 'Partner for Strategic Investments. Founder, ITSco',
    school: 'Arizona State',
    bio: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    linkedin: 'https://www.linkedin.com/in/zackarybeckham/',
  },
]

const disciplines = [
  ['Full-stack', 'Application development across the stack.'],
  ['ML and AI', 'Enrichment, scoring and model workflows.'],
  ['Data', 'Pipelines, scrapers and warehousing.'],
  ['Telephony', 'Dialers, routing and call intelligence.'],
  ['Platform', 'Infrastructure, deploys and observability.'],
  ['Open source', 'Public code, in the open.'],
]

export default function Team() {
  return (
    <>
      <section className="pagehead" id="team-opening" data-signal="Team">
        <HeroMedia short />
        <div className="shell">
          <p className="eyebrow">The team</p>
          <h1 className="display">Who they<br /><em>report to</em></h1>
          <p className="lede pagehead__lede">
            Not a stock advisory board. The people our engineers actually sit with.
          </p>
        </div>
      </section>

      <section className="band shell" id="leadership" data-signal="Leadership">
        <ul className="people">
          {leaders.map((p) => (
            <li key={p.name} className="person">
              <div className="person__plate" aria-hidden="true">
                <span>{p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              </div>
              <h2>{p.name}</h2>
              <p className="person__role">{p.role}</p>
              <p className="person__school">{p.school}</p>
              <p className="person__bio lorem">{p.bio}</p>
              {p.linkedin && (
                <a className="person__link" href={p.linkedin} target="_blank" rel="noopener">
                  LinkedIn
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="band band--hair shell" id="disciplines" data-signal="Disciplines">
        <p className="eyebrow">Disciplines</p>
        <h2 className="section">What the engineers actually do</h2>
        <ul className="cardgrid cardgrid--3">
          {disciplines.map(([t, d], i) => (
            <li key={t} className="card">
              <span className="card__n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
