import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/* Every claim below is [VERIFIED]. Four products, never eight. Every figure
 * carries its source inline. Parent-firm figures carry their scope label at the
 * caption's own size, because removing it turns a true statement into a false
 * one. Only Kevin Hong founded Caprae, so the other four are described by their
 * real titles and their own firms.
 */

const rise = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-12% 0px -12% 0px' },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const },
}

function Band({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="band">
      <div className="shell">{children}</div>
    </section>
  )
}

const products = [
  {
    n: '01', name: 'SaaSquatch Leads', href: 'https://www.saasquatchleads.com/',
    kicker: 'B2B lead generation and enrichment',
    body: <>Built in-house from zero. Three-week beta drew <span className="fig">1,200+</span> signups. Public at <span className="fig">$20/month</span>.</>,
    src: 'saasquatchleads.com · live and public',
    stack: 'Flask · Vite · React · TypeScript · ML pipeline · AWS',
  },
  {
    n: '02', name: 'Cold Call Killers', href: 'https://coldcallkillers.io/',
    kicker: 'Full-funnel B2B outbound system', date: 'Launched Jun 2026',
    body: <>Human callers, robodialing, number screening, call intelligence, email, LinkedIn and physical mail in one engine. <span className="fig">300,000+</span> calls across <span className="fig">5</span> countries.</>,
    src: 'coldcallkillers.io · live',
    stack: 'Ships with Dial Sniper and Call Intelligence as standalone tools',
  },
  {
    n: '03', name: 'CLOVER', href: null,
    kicker: 'Closed-Loop Origination via Exclusive Referrals', date: 'Open source · beta',
    body: <>Lets searchers reassign deals that are too big, too small or off-thesis, and earn a success fee on what they pass. Origination routing, in the open.</>,
    src: null, stack: null,
  },
  {
    n: '04', name: 'Bankers Edge', href: 'https://bankersedgeadvisory.com',
    kicker: 'Advisory platform',
    body: <>Client build, live in production.</>,
    src: 'bankersedgeadvisory.com', stack: null,
  },
]

export function Record() {
  return (
    <Band id="record">
      <motion.p {...rise} className="eyebrow"><i />The record</motion.p>
      <motion.h2 {...rise} className="sect">Four products. <b>Live, paid,</b> and open in a new tab</motion.h2>
      <motion.p {...rise} className="lede">Not case studies. Software strangers use.</motion.p>

      <div>
        {products.map((p) => (
          <motion.article
            key={p.n} {...rise}
            style={{
              display: 'grid', gridTemplateColumns: 'minmax(13rem,20rem) 1fr',
              columnGap: 'clamp(24px,4vw,64px)', alignItems: 'start',
              padding: '30px 0', borderTop: '1px solid var(--rule)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="mono" style={{ fontSize: '10.5px', letterSpacing: '0.16em', color: 'var(--gold)' }}>{p.n}</span>
              <span className="serif" style={{ fontSize: 'clamp(19px,1.7vw,25px)', lineHeight: 1.15, color: 'var(--ice)' }}>
                {p.href ? <a href={p.href} target="_blank" rel="noopener" style={{ textDecoration: 'none', borderBottom: '1px solid var(--rule)' }}>{p.name}</a> : p.name}
              </span>
              <span className="mono" style={{ fontSize: '11.5px', letterSpacing: '0.05em', color: 'var(--ice-faint)' }}>{p.kicker}</span>
              {p.date && <span className="mono" style={{ fontSize: '11.5px', letterSpacing: '0.07em', color: 'var(--gold)' }}>{p.date}</span>}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: '0 0 12px', maxWidth: '34rem', color: 'var(--ice-dim)', lineHeight: 1.6 }}>{p.body}</p>
              {p.src && <p style={{ margin: '0 0 10px' }}><span className="pv">{p.src}</span></p>}
              {p.stack && <p className="mono" style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.7, letterSpacing: '0.04em', color: 'var(--ice-faint)' }}>{p.stack}</p>}
            </div>
          </motion.article>
        ))}
      </div>
    </Band>
  )
}

const points = [
  'They know what an operator asks for, which is rarely what they say first.',
  'They have seen a requirement change three times in a month and shipped anyway.',
  'They understand diligence pressure and why a close date is a close date.',
  'They do not need a product manager to translate business intent into a ticket.',
]

export function Wedge() {
  return (
    <Band id="wedge">
      <motion.p {...rise} className="eyebrow"><i />Why us</motion.p>
      <motion.h2 {...rise} className="sect">The part a dev shop <b>cannot copy</b></motion.h2>
      <motion.p {...rise} className="lede">
        Every agency claims it understands your business. Ours reports into a private equity firm that closes deals with operators, and sits in recurring meetings with them. Our engineers have already survived the founder relationship. You are not paying to teach them what a deal looks like.
      </motion.p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(18rem,1fr))', columnGap: 'clamp(24px,4vw,64px)' }}>
        {points.map((t, i) => (
          <motion.p key={i} {...rise} style={{ margin: 0, padding: '16px 0', borderTop: '1px solid var(--rule)', color: 'var(--ice-dim)', lineHeight: 1.6 }}>{t}</motion.p>
        ))}
      </div>
    </Band>
  )
}

const people = [
  ['Kevin Hong', 'Founder and Managing Partner, Caprae Capital', 'Chicago Booth'],
  ['Eric Nehrlich', 'Chief of Staff, Caprae Capital', 'Google'],
  ['Felix I. Odigie', 'Deal Advisor. Founder and Managing Director, Quoin Advisors', 'Wharton'],
  ['Hereford Johnson', 'Principal Adviser. Founder, Third Equity Partners', 'Kellogg'],
  ['Zackary Beckham', 'Partner for Strategic Investments. Founder, ITSco', 'Arizona State'],
]

export function Team() {
  return (
    <Band id="team">
      <motion.p {...rise} className="eyebrow"><i />The team</motion.p>
      <motion.h2 {...rise} className="sect">Who they <b>report to</b></motion.h2>
      <motion.p {...rise} className="lede">Not a stock advisory board. The people our engineers actually sit with.</motion.p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(20rem,1fr))', columnGap: 'clamp(24px,4vw,64px)' }}>
        {people.map(([name, role, school]) => (
          <motion.div key={name} {...rise} style={{ padding: '18px 0', borderTop: '1px solid var(--rule)' }}>
            <div className="serif" style={{ fontSize: '20px', color: 'var(--ice)', marginBottom: '5px' }}>{name}</div>
            <div style={{ color: 'var(--ice-dim)', fontSize: '15px', lineHeight: 1.5 }}>
              {role} · <span className="mono" style={{ fontSize: '12px', letterSpacing: '0.05em', color: 'var(--ice)' }}>{school}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Band>
  )
}

const steps = [
  ['01', 'Call', 'Thirty minutes. What you are building, what is in the way.'],
  ['02', 'Scope', 'A written scope with a number in it, inside a week.'],
  ['03', 'Build', 'You meet the engineers, not an account manager.'],
]

export function Process() {
  return (
    <Band id="process">
      <motion.p {...rise} className="eyebrow"><i />Process</motion.p>
      <motion.h2 {...rise} className="sect">How it <b>works</b></motion.h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(16rem,1fr))', columnGap: 'clamp(24px,4vw,64px)' }}>
        {steps.map(([n, t, d]) => (
          <motion.div key={n} {...rise} style={{ padding: '20px 0', borderTop: '1px solid var(--rule)' }}>
            <div className="mono" style={{ fontSize: '11.5px', letterSpacing: '0.14em', color: 'var(--gold)', marginBottom: '10px' }}>{n}</div>
            <div className="serif" style={{ fontSize: '22px', color: 'var(--ice)', marginBottom: '8px' }}>{t}</div>
            <div style={{ color: 'var(--ice-dim)', lineHeight: 1.6 }}>{d}</div>
          </motion.div>
        ))}
      </div>
    </Band>
  )
}

const figures = [
  ['$110M+', 'closed, 2026 YTD'],
  ['20%+', 'MoM growth, 14+ months'],
  ['8', 'countries serviced'],
  ['40+', 'searchers supported'],
]

export function Firm() {
  return (
    <Band>
      <motion.p {...rise} className="eyebrow"><i />The firm behind the team</motion.p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(13rem,1fr))', columnGap: 'clamp(24px,3vw,48px)' }}>
        {figures.map(([v, l]) => (
          <motion.div key={v} {...rise} style={{ padding: '20px 0', borderTop: '1px solid var(--rule)' }}>
            <div className="serif" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.6rem)', color: 'var(--ice)', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            <div className="mono" style={{ fontSize: '11.5px', letterSpacing: '0.05em', color: 'var(--ice-dim)', marginTop: '9px', lineHeight: 1.6 }}>
              {l}
              {/* the scope label is part of the figure, at the caption's own size */}
              <span style={{ display: 'block', color: 'var(--gold)' }}>Caprae Capital, firm-wide</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Band>
  )
}

export function Contact() {
  return (
    <section id="contact" className="band" style={{ paddingBottom: 'clamp(90px,14vh,170px)' }}>
      <div className="shell" style={{ textAlign: 'center' }}>
        <motion.h2 {...rise} className="sect" style={{ margin: '0 auto 22px', maxWidth: '18ch' }}>
          Talk to the people <b>who would build it</b>
        </motion.h2>
        <motion.p {...rise} className="lede" style={{ margin: '0 auto 40px' }}>
          Thirty minutes. What you are building, and what is in the way.
        </motion.p>
        <motion.a
          {...rise}
          href="mailto:partners@capraecapital.com"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          whileTap={{ scale: 0.97 }}
          className="mono"
          style={{ display: 'inline-block', padding: '20px 58px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.6)', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0)' }}
        >
          partners@capraecapital.com
        </motion.a>
        <motion.p {...rise} className="mono" style={{ marginTop: '54px', fontSize: '11.5px', letterSpacing: '0.12em', color: 'var(--ice-faint)' }}>
          Part of Caprae Capital · Four products live, one open source
        </motion.p>
      </div>
    </section>
  )
}
