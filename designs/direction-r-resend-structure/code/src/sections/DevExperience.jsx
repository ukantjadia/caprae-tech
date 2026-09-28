// Block 04: the four wedge points as cards. Card shell follows ref/block-04.
import content from '../../../../_shared/content.json'
import './Integrate.css'

const { points } = content.wedge

export default function DevExperience() {
  return (
    <section data-block="04" className="mx-auto px-6 py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl">
      <div className="grid grid-cols-1 gap-[48px] md:gap-[32px] lg:grid-cols-2">
        {points.map((point, i) => (
          <div key={i} className="relative flex flex-col gap-[16px] rounded-3xl border border-b-0 border-(--rs-s6) pb-[40px]">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[150px] max-w-full -translate-x-1/2 -translate-y-1/2"
              style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(143,143,143,0.67) 50%, rgba(0,0,0,0) 100%)' }} />
            <div aria-hidden="true" className="pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              style={{ backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 50%, #000 100%)' }} />
            {/* ponytail: hairline placeholder for a future 3D/visual per card */}
            <div aria-hidden="true" className="relative z-10 h-[180px] overflow-hidden"
              style={{ background: 'radial-gradient(70% 80% at center 0%, rgba(255,255,255,0.06) 3%, rgba(255,255,255,0) 70%)' }}>
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 600 180" fill="none" stroke="rgba(255,255,255,0.07)">
                {[30, 60, 90, 120, 150].map((y) => <path key={y} d={`M0 ${y}H600`} />)}
                <path d="M0 170 Q 300 60 600 170" stroke="rgba(186,167,255,0.3)" />
              </svg>
              <span className="font-commit-mono absolute left-6 top-6 text-sm text-(--rs-s10) md:left-[40px]">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <p className="z-10 max-w-[36ch] px-6 font-abc-favorit text-xl leading-[140%] text-(--rs-s12) md:px-[40px]">{point}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
