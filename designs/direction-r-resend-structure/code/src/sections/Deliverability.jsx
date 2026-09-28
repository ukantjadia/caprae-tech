// Block 08, "The firm behind the team". Same top-right glow and grid as the ref; the nine feature cells become four static stats.
// Spacing uses arbitrary px: the @theme redefines --spacing-4/8/12/16/... as px.
import content from '../../../../_shared/content.json'

const { h2, stats, disclaimer } = content.firm
const FF = "font-abc-favorit [font-feature-settings:'ss01','ss04','ss05','ss11']"

export default function Deliverability() {
  return (
    <section id="firm" data-block="08" className="relative mx-auto mt-[48px] max-w-5xl overflow-hidden rounded-3xl border-t border-[#d6ebfd30] px-[24px] py-[80px] sm:py-[96px] md:mt-0 md:max-w-7xl">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[300px] max-w-full -translate-x-1/2 -translate-y-1/2 sm:left-auto sm:right-1" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0) 0%, rgba(143,143,143,0.67) 50%, rgba(0,0,0,0) 100%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -top-1 left-1/2 h-[300px] w-[320px] max-w-full -translate-x-1/2 -translate-y-1/2 sm:left-auto sm:right-1" style={{ background: 'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #000 50%),radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]" style={{ backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 50%, #000 100%)' }} />
      <h2 className={`${FF} relative z-20 mb-[48px] max-w-md text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] bg-[linear-gradient(to_bottom_right,#fff_30%,#ffffff80)] bg-clip-text text-transparent`}>{h2}</h2>
      <dl className="relative z-20 m-0 mt-[48px] grid w-full grid-cols-1 gap-[48px] sm:grid-cols-2 md:gap-[80px] lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-[8px]">
            <dt className="order-2 text-sm leading-[1.6] text-[#fcfdffef]">{s.label}</dt>
            <dd className={`${FF} order-1 m-0 text-[2.5rem] leading-none tracking-tight text-[#fcfdffef]`}>{s.value}</dd>
            <dd className="order-3 m-0 text-sm leading-[1.6] text-ash-gray">{s.scope}</dd>
          </div>
        ))}
      </dl>
      <p className="relative z-20 m-0 mt-[48px] border-t border-[#d6ebfd30] pt-[24px] text-sm leading-[1.6] text-ash-gray">{disclaimer}</p>
    </section>
  )
}
