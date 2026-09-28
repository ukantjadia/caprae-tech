// Reference: ref/block-02.png. The logo wall becomes the parent firm's portfolio, set as type.
import content from '../../../../_shared/content.json'

const { label, names, disclaimer } = content.work.portfolio

export default function Logos() {
  return (
    <section data-block="02" aria-labelledby="portfolio-label" className="mx-auto px-6 py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl relative rounded-3xl border-t border-[#d6ebfd30] mt-[80px] flex flex-col items-center">
      <div aria-hidden="true" className="left-1/2 top-0 w-[300px] pointer-events-none absolute h-px max-w-full -translate-x-1/2 -translate-y-1/2" style={{ background: 'linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.0) 0%, rgba(143, 143, 143, 0.67) 50%, rgba(0, 0, 0, 0) 100%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 -top-1 left-1/2 h-[200px] w-full max-w-[200px] md:max-w-[400px]" style={{ background: 'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #000 50%),radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)' }} />
      <h2 id="portfolio-label" className="m-0 text-base md:text-[1.125rem] md:leading-[1.5] text-ash-gray font-normal mb-10 max-w-lg text-center text-balance">{label}</h2>
      <ul className="m-0 p-0 list-none w-5/6 gap-x-[16px] grid grid-cols-2 items-center sm:grid-cols-3 lg:grid-cols-5">
        {names.map(n => (
          <li key={n} className="flex h-[64px] sm:h-[96px] items-center justify-center text-center font-abc-favorit font-semibold text-[17px] sm:text-[20px] tracking-[-0.02em] text-bone-white/75">{n}</li>
        ))}
      </ul>
      <p className="m-0 mt-10 text-sm text-ash-gray text-center text-balance">{disclaimer}</p>
    </section>
  )
}
