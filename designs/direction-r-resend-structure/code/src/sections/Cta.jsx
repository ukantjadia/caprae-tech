// Block 12, contact. Same headline, button and large outlined wordmark as the ref, with our name as SVG text.
import { useState } from 'react'
import content from '../../../../_shared/content.json'
import './tail.css'

const EMAIL = content.contact.fallback
const NAME = content.meta.title
const W = 377, H = 81

// Name at 5% white, plus a cursor-following stroke glow (hover only, so no reduced-motion gate needed).
function Wordmark() {
  const [p, setP] = useState(null)
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setP({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H })
  }
  const c = p || { x: W / 2, y: H / 2 }
  const text = (props) => (
    <text x="0" y="60" textLength={W} lengthAdjust="spacingAndGlyphs" fontSize="74" style={{ fontFamily: 'var(--font-domaine)' }} {...props}>{NAME}</text>
  )
  return (
    <div aria-hidden="true" className="relative hidden aspect-377/81 overflow-hidden bg-black sm:block" onPointerMove={move} onPointerLeave={() => setP(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="pointer-events-none absolute inset-0 h-full w-full select-none">
        {text({ fill: 'rgba(255, 255, 255, 0.05)' })}
      </svg>
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-opacity duration-500 ease-out ${p ? 'opacity-100' : 'opacity-0'}`}>
        <defs>
          <radialGradient id="cta-glow" cx={c.x} cy={c.y} r="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,1)" /><stop offset="10%" stopColor="rgba(255,255,255,0.5)" /><stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </radialGradient>
          <filter id="cta-glow-f" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur result="b1" stdDeviation="2" /><feGaussianBlur result="b2" stdDeviation="25" />
            <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter="url(#cta-glow-f)">{text({ stroke: 'url(#cta-glow)', strokeWidth: 0.3 })}</g>
      </svg>
    </div>
  )
}

export default function Cta() {
  return (
    <section id="contact" data-block="12" className="relative mx-auto max-w-5xl px-6 py-[48px] text-center sm:mb-0 sm:py-[96px] sm:pb-0 md:max-w-7xl">
      <h2 className="t-gradient t-hero mx-auto mb-[16px] max-w-[14ch] pb-3 text-center font-domaine text-[3.5rem] font-normal leading-[100%] tracking-[-0.01em] md:text-[4.8rem]">
        {content.contact.h2}
      </h2>
      <div className="my-[32px] mb-[96px] flex flex-col items-center justify-center gap-[16px]">
        <a
          href={`mailto:${EMAIL}`}
          className="group relative inline-flex h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-white/5 bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1)_100%)] bg-origin-border px-5 text-base font-semibold text-white no-underline shadow-sm backdrop-blur-[25px] transition-all duration-200 ease-in-out select-none hover:bg-white/90 hover:text-black hover:shadow-[0_0_4px_#ffffff0f,0_1px_14px_#ffffff1f,0_3px_32px_#ffffff2e] focus-visible:bg-white/90 focus-visible:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
        >
          {content.hero.cta.label}
          <span className="-mr-2 text-[#70757E] transition-all group-hover:invert">
            <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14"><path fill="currentColor" d="M10.707 6.293a1 1 0 1 0-1.414 1.414l3.586 3.586a1 1 0 0 1 0 1.414l-3.586 3.586a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414z" /></svg>
          </span>
        </a>
        <a href={`mailto:${EMAIL}`} className="font-commit-mono text-sm text-[#a1a4a5] no-underline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">{EMAIL}</a>
      </div>
      <Wordmark />
    </section>
  )
}
