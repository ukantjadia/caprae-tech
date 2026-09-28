// Reference: ref/block-13.png
import content from '../../../../_shared/content.json'
import { Wordmark } from './Header.jsx'
import { CONTACT_HREF } from './Hero.jsx'
import './tail.css'

const COLS = [
  ['Sections', [['Work', '#work'], ['How it works', '#how'], ['People', '#people'], ['Firm', '#firm']]],
  ['Contact', [[content.hero.cta.label, CONTACT_HREF]]],
]

const focus = 'outline-none transition duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-white/60'

export default function Footer() {
  return (
    <div data-block="13" className="relative z-20 -mt-[9vh] overflow-hidden border-t border-[#d3edf81d] bg-black">
      <div aria-hidden="true" className="t-glow-line pointer-events-none absolute left-1/2 top-0 h-px w-[40%] max-w-full -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="t-glow-cone pointer-events-none absolute -top-1 left-1/2 h-[100px] w-[70%] max-w-full -translate-x-1/2 -translate-y-1/2 md:h-[300px]" />
      <footer className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-36 md:max-w-7xl md:flex-row md:gap-8">
        <div className="flex min-w-48 flex-col justify-start gap-6 md:min-w-[18.75rem]">
          <a href="#" className={`${focus} w-fit rounded-md text-bone-white`}><Wordmark /></a>
          <a href={CONTACT_HREF} className={`${focus} w-fit rounded-md text-xs text-[#a1a4a5] hover:text-[#fcfdffef] no-underline`}>{content.contact.fallback}</a>
        </div>
        <div className="grid w-full grid-cols-2 gap-8 lg:grid-cols-5">
          {COLS.map(([head, links]) => (
            <div key={head} className="flex flex-col gap-4">
              <p className="m-0 mb-2 ml-1 text-sm font-normal text-[#f0f0f0]">{head}</p>
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className={`${focus} rounded-md px-1 py-0.5 text-sm text-[#f1f7feb5] no-underline hover:text-[#fcfdffef] focus-visible:text-[#fcfdffef]`}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
