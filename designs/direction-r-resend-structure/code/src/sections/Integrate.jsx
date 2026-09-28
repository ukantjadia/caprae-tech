// Block 03: the wedge. Layout follows ref/block-03 (3D tile, centred h2, wide hairline panel).
import content from '../../../../_shared/content.json'
import './Integrate.css'

const { wedge } = content

// ponytail: static stand-in for the 170px 3D icon slot, swapped for our own 3D later.
export function Tile3D() {
  return (
    <div aria-hidden="true" className="mx-auto mb-[16px] flex h-[170px] w-[170px] items-center justify-center">
      <div
        className="relative flex h-[146px] w-[146px] items-center justify-center overflow-hidden rounded-[36px] border border-(--rs-s5)"
        style={{ background: 'radial-gradient(60% 40% at 50% 100%, rgba(146,129,247,0.22) 0%, rgba(146,129,247,0) 100%), linear-gradient(160deg, #161618 0%, #070708 70%)' }}
      >
        <svg width="84" height="84" viewBox="0 0 84 84" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1">
          <path d="M42 8 72 25v34L42 76 12 59V25Z" />
          <path d="M12 25 42 42 72 25M42 42v34" />
          <path d="M27 16.5 57 33.5M57 16.5 27 33.5" stroke="rgba(255,255,255,0.12)" />
        </svg>
      </div>
    </div>
  )
}

export default function Integrate() {
  return (
    <section data-block="03" className="mx-auto px-6 py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl">
      <Tile3D />
      <h2 className="font-abc-favorit effect-font-styling text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] effect-font-gradient mb-[48px] text-center text-balance">
        {wedge.h2}
      </h2>
      <div className="relative mx-auto max-w-5xl rounded-3xl border border-(--rs-s6) px-6 py-[48px] md:px-[64px] md:py-[64px]"
        style={{ background: 'radial-gradient(40% 12% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%), #000' }}>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[300px] -translate-x-1/2 md:w-[600px]"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)' }} />
        <p className="font-abc-favorit mx-auto max-w-[46ch] text-[1.25rem] md:text-[1.5rem] leading-[1.5] text-(--rs-s11) text-balance text-center">
          {wedge.body}
        </p>
      </div>
    </section>
  )
}
