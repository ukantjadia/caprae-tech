import HeroMedia from '../components/HeroMedia.jsx'
import './pages.css'

/* [VERIFIED] only. Four products. Four further products exist but their names
   are unconfirmed, so they do not appear here in any form, and there is no
   "and more" line standing in for them. */
const products = [
  {
    n: '01', name: 'SaaSquatch Leads', href: 'https://www.saasquatchleads.com/',
    kicker: 'B2B lead generation and enrichment',
    body: 'Built in-house from zero. Three-week beta drew 1,200+ signups. Public at $20/month.',
    src: 'saasquatchleads.com · live and public',
    stack: ['Flask', 'Vite', 'React', 'TypeScript', 'ML pipeline', 'AWS'],
  },
  {
    n: '02', name: 'Cold Call Killers', href: 'https://coldcallkillers.io/',
    kicker: 'Full-funnel B2B outbound system', date: 'Launched Jun 2026',
    body: 'Human callers, robodialing, number screening, call intelligence, email, LinkedIn and physical mail in one engine. 300,000+ calls across 5 countries.',
    src: 'coldcallkillers.io · live',
    stack: ['Telephony', 'Sentiment analysis', 'Data pipeline'],
  },
  {
    n: '03', name: 'CLOVER', href: null,
    kicker: 'Closed-Loop Origination via Exclusive Referrals', date: 'Open source · beta',
    body: 'Lets searchers reassign deals that are too big, too small or off-thesis, and earn a success fee on what they pass. Origination routing, in the open.',
    src: null, stack: ['Open source', 'Beta'],
  },
  {
    n: '04', name: 'Bankers Edge', href: 'https://bankersedgeadvisory.com',
    kicker: 'Advisory platform',
    body: 'Client build, live in production.',
    src: 'bankersedgeadvisory.com', stack: [],
  },
]

const portfolio = [
  'RetailMeNot', 'Caviar', 'LTSE', 'Veggie Grill', 'Kintarra',
  'SubGen', 'Creamistry', 'StandDesk', 'ITSco', 'IV Nutrition',
]

export default function Work() {
  return (
    <>
      <section className="pagehead">
        <HeroMedia short />
        <div className="shell">
          <p className="eyebrow">The record</p>
          <h1 className="display">Four products.<br />Live, paid, and open<br />in a <em>new tab</em></h1>
          <p className="lede pagehead__lede">Not case studies. Software strangers use.</p>
        </div>
      </section>

      <section className="band shell">
        <ul className="rec">
          {products.map((p) => (
            <li key={p.n} className="rec__item">
              <div className="rec__head">
                <span className="rec__n">{p.n}</span>
                <h2>
                  {p.href
                    ? <a href={p.href} target="_blank" rel="noopener">{p.name}</a>
                    : p.name}
                </h2>
                <p className="rec__kicker">{p.kicker}</p>
                {p.date && <p className="rec__date">{p.date}</p>}
              </div>
              <div className="rec__body">
                <p>{p.body}</p>
                {p.src && <p className="pv">{p.src}</p>}
                {p.stack.length > 0 && (
                  <ul className="rec__stack">
                    {p.stack.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="band band--hair shell">
        <p className="eyebrow">Caprae Capital portfolio</p>
        <h2 className="section">Holding company, not our builds</h2>
        <p className="lede">
          These are portfolio companies of the parent firm. They are listed for context and
          are not work by this engineering team.
        </p>
        <ul className="chips">
          {portfolio.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </section>
    </>
  )
}
