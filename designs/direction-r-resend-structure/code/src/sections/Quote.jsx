// Block 09, the people intro. Centred where the ref's quote sat; the logo disc keeps a neutral mark.
import content from '../../../../_shared/content.json'
import './tail.css'

const { h2, sub } = content.people

export default function Quote() {
  return (
    <section id="people" data-block="09" className="relative flex flex-col items-center justify-center gap-[48px] pt-[96px] md:pb-[96px]">
      <div aria-hidden="true" className="t-glow-line pointer-events-none absolute left-1/2 top-0 h-px w-[300px] max-w-full -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="t-glow-cone pointer-events-none absolute -top-1 left-1/2 h-[200px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[400px]" />
      <div aria-hidden="true" className="flex h-[100px] w-[100px] items-center justify-center rounded-full" style={{ background: 'radial-gradient(rgba(200,200,200,0.15) 0%, #000 90%)' }}>
        <div className="h-[36px] w-[36px] rounded-full border border-white/25" />
      </div>
      <div className="mx-auto max-w-[620px] px-6 text-center text-balance">
        <h2 className="t-display t-gradient m-0 mb-[16px] text-[3rem] font-normal leading-[120%] tracking-tighter md:text-[3.5rem]">{h2}</h2>
        <p className="m-0 text-base leading-[1.5] text-[#a1a4a5] md:text-[1.125rem]">{sub}</p>
      </div>
    </section>
  )
}
