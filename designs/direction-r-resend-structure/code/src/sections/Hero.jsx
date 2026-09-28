// Reference: ref/block-01.png
import content from '../../../../_shared/content.json'
import './Hero.css'

const { hero, contact } = content
// ponytail: booking link is TBD (Q17), so every "Book a call" goes to the fallback inbox
export const CONTACT_HREF = `mailto:${contact.fallback}`

export const GlassButton = ({ href, className = '', children }) => (
  <a href={href} className={'glass-btn relative inline-flex items-center justify-center select-none rounded-2xl font-semibold text-white ' + className}>{children}</a>
)

// Static isometric 3x3x3 cube, a stand-in for our own 3D later. viewBox matches the old 3D slot.
const S = 76, C = Math.cos(Math.PI / 6) * S, O = [324, 47]
const P = (x, y, z) => [O[0] + (x - y) * C, O[1] + (x + y) * S / 2 + (3 - z) * S]
const quad = (...pts) => pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')
const inset = 0.06
const FACES = []
for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
  const lo = inset, hi = 1 - inset, k = (i * 7 + j * 3) % 5
  FACES.push({ f: 'top', k, pts: quad(P(i + lo, j + lo, 3), P(i + hi, j + lo, 3), P(i + hi, j + hi, 3), P(i + lo, j + hi, 3)) })
  FACES.push({ f: 'left', k: (k + 2) % 5, pts: quad(P(i + lo, 3, j + lo), P(i + hi, 3, j + lo), P(i + hi, 3, j + hi), P(i + lo, 3, j + hi)) })
  FACES.push({ f: 'right', k: (k + 4) % 5, pts: quad(P(3, i + lo, j + lo), P(3, i + hi, j + lo), P(3, i + hi, j + hi), P(3, i + lo, j + hi)) })
}
const TONES = { top: ['#1a1a1b', '#161617', '#1d1d1e', '#141415', '#19191a'], left: ['#0e0e0f', '#111112', '#0c0c0d', '#101011', '#0d0d0e'], right: ['#08080a', '#0a0a0b', '#070708', '#0b0b0c', '#09090a'] }
const hull = quad(P(0, 0, 3), P(3, 0, 3), P(3, 0, 0), P(3, 3, 0), P(0, 3, 0), P(0, 3, 3))

const Cube = ({ className = '' }) => (
  <svg viewBox="0 0 648 550" className={className} aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="cube-glow" cx="50%" cy="45%" r="50%"><stop offset="0" stopColor="#fff" stopOpacity=".06" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      <linearGradient id="cube-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".5" stopColor="#fff" stopOpacity=".02" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
    </defs>
    <ellipse cx="324" cy="275" rx="320" ry="270" fill="url(#cube-glow)" />
    <polygon points={hull} fill="#050506" stroke="#ffffff14" strokeWidth=".75" strokeLinejoin="round" />
    {FACES.map((q, n) => <polygon key={n} points={q.pts} fill={TONES[q.f][q.k]} stroke="#ffffff1a" strokeWidth=".75" strokeLinejoin="round" />)}
    {/* one catch-light facet, like the gloss on the original */}
    <polygon points={FACES[1].pts} fill="url(#cube-sheen)" />
  </svg>
)

export default function Hero() {
  return (
    <div data-block="01" className="relative z-20 pt-[40px] md:h-screen md:max-h-[950px] md:pt-0 overflow-hidden">
      <div aria-hidden="true" className="hero-bg pointer-events-none absolute inset-x-0 top-0 hidden h-screen md:block" />
      <svg aria-hidden="true" className="hero-mask pointer-events-none absolute inset-x-0 top-0 hidden h-screen w-full md:block" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="streak" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".35" stopColor="#fff" stopOpacity=".22" /><stop offset=".7" stopColor="#fff" stopOpacity=".08" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <filter id="streak-blur" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <path d="M-40 690 C 380 560, 900 540, 1480 740" fill="none" stroke="url(#streak)" strokeWidth="10" filter="url(#streak-blur)" />
        <path d="M-40 690 C 380 560, 900 540, 1480 740" fill="none" stroke="url(#streak)" strokeWidth="1" />
      </svg>
      <section className="mx-auto max-w-5xl px-6 pb-[32px] md:h-screen md:max-h-[950px] md:max-w-7xl">
        <div className="flex h-full flex-col items-center justify-between md:flex-row md:pb-[48px]">
          <div className="hero-text relative max-w-[40rem] md:shrink lg:pl-[64px]">
            <div className="flex items-center justify-center md:inline-flex">
              <span className="hero-pill mb-[24px] md:mb-[32px] inline-flex items-center justify-center rounded-full relative text-sm leading-none text-bone-white">
                <span className="inline-flex items-center whitespace-nowrap px-3 py-1 m-[1px] rounded-full">{hero.eyebrow}</span>
              </span>
            </div>
            <h1 className="hero-title m-0 font-domaine font-normal text-[3.25rem] sm:text-[4rem] md:text-[6rem] tracking-[-0.01em] leading-[100%] relative text-center md:text-left pb-3 text-balance">{hero.h1}</h1>
            <p className="text-base md:text-[1.125rem] md:leading-[1.5] text-ash-gray font-normal relative mb-[28px] md:mb-[32px] mt-2 max-w-[32rem] text-center leading-7 md:text-left text-pretty">{hero.sub}</p>
            <div className="flex flex-col justify-center gap-[12px] md:gap-[16px] md:flex-row md:justify-start">
              <GlassButton href={CONTACT_HREF} className="text-base h-[48px] gap-1 px-5">{hero.cta.label}</GlassButton>
              <a href={hero.ctaSecondary.href} className="relative inline-flex items-center justify-center rounded-2xl border border-transparent text-ash-gray hover:text-bone-white outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:text-bone-white transition ease-in-out duration-200 text-base h-[48px] gap-1 px-5 font-semibold">{hero.ctaSecondary.label}</a>
            </div>
            <p className="m-0 mt-[20px] md:mt-[28px] text-center md:text-left text-[13px] leading-5 text-ash-gray/80 text-balance">{hero.trustLine}</p>
          </div>
          <div className="hero-cube-open relative ml-10 hidden h-[550px] w-[648px] shrink-0 items-center justify-center lg:flex">
            <Cube className="h-full w-full" />
          </div>
        </div>
      </section>
    </div>
  )
}
