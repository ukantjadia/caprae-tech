// Reference: ref/block-00.png
import { useEffect, useState } from 'react'
import { GlassButton, CONTACT_HREF } from './Hero.jsx'
import content from '../../../../_shared/content.json'
import './Hero.css'

export const Wordmark = ({ className = 'text-[19px]' }) => (
  <span className={'font-abc-favorit font-semibold tracking-[-0.03em] leading-none whitespace-nowrap ' + className}>
    Caprae<span className="text-ash-gray font-medium"> Tech</span>
  </span>
)

const NAV = [['Work', '#work'], ['How it works', '#how'], ['People', '#people'], ['Firm', '#firm']]
const navItem = 'h-[58px] flex items-center py-1 text-sm font-medium text-ash-gray hover:text-bone-white rounded-md outline-none transition duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-white/60'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const cta = content.hero.cta.label
  return (
    <header data-block="00" className="site-header sticky top-0 z-40">
      {/* ponytail: the blurred black bar fades in once the page scrolls */}
      <div aria-hidden="true" className={'pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity ' + (scrolled ? 'opacity-100' : 'opacity-0')} />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:max-w-7xl">
        <div className="flex w-full items-center py-[12px] md:hidden">
          <a className="flex-auto text-bone-white rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/60" href="#"><Wordmark /></a>
          <GlassButton href={CONTACT_HREF} className="h-10 px-[16px] text-sm whitespace-nowrap">{cta}</GlassButton>
        </div>
        <nav aria-label="Main" className="mx-auto hidden h-[58px] w-full items-center md:flex">
          <div className="flex flex-1 lg:w-[225px]">
            <a className="py-1 text-bone-white rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/60" href="#"><Wordmark /></a>
          </div>
          <ul className="m-0 flex list-none items-center p-0">
            {NAV.map(([label, href]) => (
              <li key={href}><a className={navItem + ' px-2 lg:px-[16px]'} href={href}>{label}</a></li>
            ))}
          </ul>
          <div className="flex flex-1 justify-end">
            <GlassButton href={CONTACT_HREF} className="h-10 px-[16px] text-sm whitespace-nowrap">{cta}</GlassButton>
          </div>
        </nav>
      </div>
    </header>
  )
}
