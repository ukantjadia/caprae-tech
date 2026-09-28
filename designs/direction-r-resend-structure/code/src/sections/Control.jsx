// Block 10, the five people. Same tab row + large panel as the ref; the dashboard screenshot becomes the selected person's card.
import { useState } from 'react'
import View from '../three/View.jsx'
import content from '../../../../_shared/content.json'
import './tail.css'

const { members } = content.people
const LINE = 'border-[#d6ebfd30]'
const initials = (name) => name.split(' ').filter((w) => !w.endsWith('.')).map((w) => w[0]).join('')

const Initials = ({ name, big }) => (
  <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full border ${LINE} font-commit-mono text-[#fcfdffef] ${big ? 'h-[72px] w-[72px] text-lg' : 'h-10 w-10 text-xs'}`}>{initials(name)}</span>
)

export default function Control() {
  const [active, setActive] = useState(0)
  const m = members[active]
  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    const next = (active + d + members.length) % members.length
    setActive(next)
    e.currentTarget.parentElement.children[next].focus()
  }
  return (
    <section data-block="10" aria-label="People" className="mx-auto max-w-5xl px-6 py-[48px] sm:py-[96px] md:max-w-7xl">
      <div className="t-tile t-tile-3d relative overflow-hidden mb-[32px] md:mb-[64px]" aria-hidden="true"><View kind="team" className="absolute inset-0" fallback={<div className="flex h-full w-full items-center justify-center"><span className="t-tile-mark" /></div>} /></div>
      <div role="tablist" aria-label="People" className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mb-[32px] md:gap-6 lg:grid-cols-5">
        {members.map((t, i) => {
          const on = i === active
          return (
            <button
              key={t.name} type="button" role="tab" id={`ctl-tab-${i}`} aria-controls="ctl-panel"
              aria-selected={on} tabIndex={on ? 0 : -1} data-active={on ? '' : undefined}
              onClick={() => setActive(i)} onKeyDown={onKey}
              className="group relative flex h-[3.75rem] cursor-pointer overflow-hidden rounded-2xl border-0 bg-[#d6ebfd30] p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:h-[5.625rem]"
            >
              <span aria-hidden="true" className="t-disco absolute inset-0 z-0 scale-x-[1.5] blur-xs" />
              <span className={`absolute inset-px rounded-2xl ${on ? 'bg-[linear-gradient(180deg,#141414_0%,#000_100%)]' : 'bg-black'}`} />
              <div className="relative flex h-full w-full items-center gap-3 px-[16px] py-2 text-left">
                <Initials name={t.name} />
                <h3 className="t-display m-0 text-base font-normal tracking-tighter text-[#fcfdffef]">{t.name}</h3>
              </div>
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id="ctl-panel" aria-labelledby={`ctl-tab-${active}`} tabIndex={0}
        className={`rounded-2xl border ${LINE} bg-[#0a0a0a] p-6 outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:p-[48px]`}>
        <div key={active} className="motion-safe:animate-[t-fade_.5s_ease-in-out]">
          <div className="mb-[32px] flex items-center gap-6 md:mb-[48px]">
            <Initials name={m.name} big />
            <div>
              <p className="t-display m-0 text-2xl text-[#fcfdffef] md:text-[2rem]">{m.name}</p>
              <p className="m-0 mt-1 text-sm leading-[1.6] text-[#a1a4a5]">{m.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3 md:gap-6">
            <div className={`rounded-2xl border ${LINE} p-6`}>
              <p className="m-0 mb-[16px] text-xs uppercase tracking-wide text-[#a1a4a5]">Credential</p>
              <p className="t-display m-0 text-2xl text-[#fcfdffef]">{m.credential}</p>
            </div>
            <div className={`rounded-2xl border ${LINE} p-6 md:col-span-2`}>
              <p className="m-0 mb-[16px] text-xs uppercase tracking-wide text-[#a1a4a5]">Background</p>
              <p className="m-0 text-base leading-[1.6] text-[#fcfdffef] md:text-[1.125rem]">{m.detail}</p>
            </div>
          </div>
          {m.linkedin && (
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 py-2 pl-[16px] pr-3 text-sm text-white/80 no-underline transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14"><path fill="currentColor" d="M10.707 6.293a1 1 0 1 0-1.414 1.414l3.586 3.586a1 1 0 0 1 0 1.414l-3.586 3.586a1 1 0 0 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414z" /></svg>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
