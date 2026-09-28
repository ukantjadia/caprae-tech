// Block 05: #work, the SaaSquatch Leads feature. Frame follows ref/block-05 (toolbar, header rows, band, body).
import content from '../../../../_shared/content.json'
import './Integrate.css'
import { Tile3D } from './Integrate'

const { work } = content
const p = work.builtByUs.find((x) => x.name === 'SaaSquatch Leads')
const host = new URL(p.href).hostname.replace(/^www\./, '')

export default function Editor() {
  return (
    <section id="work" data-block="05" className="mx-auto px-6 py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl">
      <Tile3D kind="work" />
      <h2 className="font-abc-favorit effect-font-styling text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] effect-font-gradient mb-2 text-center text-balance">{work.h2}</h2>
      <p className="text-base md:text-[1.125rem] md:leading-[1.5] text-(--rs-g11) font-normal text-balance text-center">{work.sub}</p>
      <div className="w-full md:w-[90%] mx-auto">
        <div className="relative mt-[64px] rounded-2xl border border-(--rs-s6) pb-[64px]"
          style={{ background: 'radial-gradient(41.07% 8.33% at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%), linear-gradient(180deg, #101010 0%, rgba(0,0,0,0.80) 100%)' }}>
          <div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-[300px] -translate-x-1/2 pointer-events-none blur-[3px] md:w-[600px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff 50%, rgba(255,255,255,0) 100%)' }} />
          <div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-[300px] -translate-x-1/2 pointer-events-none md:w-[600px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #9B7CFF 50%, rgba(255,255,255,0) 100%)' }} />
          <div className="text-sm relative flex items-center justify-between gap-3 h-[64px] w-full px-6 border-b border-(--rs-s4)">
            <span className="truncate rounded-md border border-(--rs-s5) bg-(--rs-s2) px-2 py-1.5 text-(--rs-g11)">{p.kicker}</span>
            <h3 className="hidden md:block absolute left-1/2 -translate-x-1/2 text-(--rs-g11)">{p.name}</h3>
            <a href={p.href} target="_blank" rel="noopener noreferrer"
              className="shrink-0 rounded-md border border-white bg-white px-3 py-1.5 text-black outline-hidden transition-colors duration-150 hover:bg-(--rs-g12) focus-visible:ring-2 focus-visible:ring-(--rs-s8) motion-reduce:transition-none">
              {host}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <div className="mt-6 md:mt-10 w-[calc(100%-32px)] md:w-[60%] mx-auto overflow-hidden rounded-2xl border border-[#262A2D] bg-black">
            <dl className="px-6 md:px-[32px] pt-2 text-sm">
              <div className="flex items-center py-3 border-b border-(--rs-s6)">
                <dt className="w-[96px] shrink-0 text-(--rs-g11)">Product</dt><dd>{p.name}</dd>
              </div>
              <div className="flex items-start py-3">
                <dt className="w-[96px] shrink-0 pt-1 text-(--rs-g11)">Stack</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => <span key={s} className="rounded-full bg-(--rs-s5) px-3 py-1">{s}</span>)}
                </dd>
              </div>
            </dl>
            {/* ponytail: hairline band stands in for the header image until our own 3D exists */}
            <svg aria-hidden="true" className="block h-[160px] w-full border-y border-(--rs-s4)" preserveAspectRatio="none" viewBox="0 0 600 160" fill="none"
              style={{ background: 'radial-gradient(50% 90% at 75% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%), #0a0a0a' }}>
              {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${-80 + k * 50} 160 L${40 + k * 50} 0`} stroke="rgba(255,255,255,0.06)" />)}
              <circle cx="450" cy="80" r="52" stroke="rgba(255,255,255,0.18)" />
              <circle cx="450" cy="80" r="30" stroke="rgba(186,167,255,0.35)" />
            </svg>
            <div className="px-6 md:px-[48px] py-[32px]">
              <p className="text-base leading-[1.6] text-(--rs-s11)">{p.body}</p>
              <dl className="mt-[32px] grid grid-cols-2 gap-[16px]">
                {p.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col-reverse gap-1 border-t border-(--rs-s6) pt-[16px]">
                    <dt className="text-sm text-(--rs-g11)">{m.label}</dt>
                    <dd className="font-abc-favorit text-[2rem] leading-none tracking-tight text-(--rs-s12)">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
