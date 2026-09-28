// Block 06: three more products. Card shell follows ref/block-06; the screenshot slot is a hairline panel of real data.
import content from '../../../../_shared/content.json'
import './Integrate.css'

// Bankers Edge: "Attribution permission pending", so it shows only what content.json says, nothing more.
const NAMES = ['Cold Call Killers', 'CLOVER', 'Bankers Edge']
const PRODUCTS = NAMES.map((n) => content.work.builtByUs.find((x) => x.name === n))

const mask = { maskImage: 'linear-gradient(45deg, #000 50%, rgba(0,0,0,0) 100%)' }

function Panel({ p }) {
  return (
    <div aria-hidden="true" className="flex h-[196px] flex-col justify-between rounded-2xl border border-(--rs-s4) p-[24px]" style={{ ...mask, background: 'linear-gradient(160deg, #111113 0%, #050505 100%)' }}>
      <span className="text-sm uppercase tracking-wide text-(--rs-g11)">{p.name}</span>
      {p.metrics.length ? (
        <div className="flex gap-[24px]">
          {p.metrics.map((m) => <span key={m.label} className="font-abc-favorit text-[1.75rem] leading-none tracking-tight text-(--rs-s12)">{m.value}</span>)}
        </div>
      ) : p.stack.length ? (
        <div className="flex flex-wrap gap-1.5">{p.stack.map((s) => <span key={s} className="rounded-full bg-(--rs-s5) px-3 py-1 text-sm">{s}</span>)}</div>
      ) : (
        <svg width="100%" height="48" viewBox="0 0 300 48" preserveAspectRatio="none" fill="none" stroke="rgba(255,255,255,0.14)"><path d="M0 40 C 80 38, 140 20, 300 6" /><path d="M0 47.5H300" stroke="rgba(255,255,255,0.08)" /></svg>
      )}
    </div>
  )
}

export default function BeyondEditing() {
  return (
    <section data-block="06" className="mx-auto px-[24px] py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl">
      <div className="grid grid-cols-1 gap-[48px] md:gap-[32px] lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <article key={p.name} className="relative flex flex-col gap-[16px] rounded-3xl border border-b-0 border-(--rs-s6) pb-[40px]">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[150px] max-w-full -translate-x-1/2 -translate-y-1/2" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(143,143,143,0.67) 50%, rgba(0,0,0,0) 100%)' }} />
            <div aria-hidden="true" className="pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]" style={{ backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 50%, #000 100%)' }} />
            <div className="relative z-10 overflow-hidden pt-[48px] pl-[32px] pr-[16px]">
              <Panel p={p} />
            </div>
            <div className="z-10 flex flex-col gap-[12px] px-6 md:px-[32px]">
              <span className="text-sm text-(--rs-g11)">{p.kicker}</span>
              <h3 className="font-abc-favorit effect-font-styling text-xl leading-[130%] text-(--rs-s12)">{p.name}</h3>
              <p className="text-sm leading-[1.6] text-(--rs-g11)">{p.body}</p>
              {p.metrics.length > 0 && (
                <ul className="flex flex-col gap-1 text-sm">
                  {p.metrics.map((m) => (
                    <li key={m.label}><span className="text-(--rs-s12)">{m.value}</span> <span className="text-(--rs-g11)">{m.label}</span></li>
                  ))}
                </ul>
              )}
              {p.href && (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-sm text-(--rs-g12) transition duration-150 ease-in-out hover:text-white focus-visible:ring-2 focus-visible:ring-(--rs-s8) outline-hidden motion-reduce:transition-none">
                  {new URL(p.href).hostname.replace(/^www\./, '')}<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
