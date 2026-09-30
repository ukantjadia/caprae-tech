// Builds a/index.html, b/index.html, c/index.html: the Section Lab's variant A, B or C
// content in Direction R's look, with R's 3D. Run from designs/direction-r-lab/code:
//   bun scripts/port.js
// Lab handling (chrome removal, patches, variant switch) is shared with the Dala Lab drafts
// in builds/dala-lab-engine/lab-source.js. This adds R's header, 3D slots and logo strip.
import fs from 'node:fs'
import { labText, labRewriter } from '../../../../builds/dala-lab-engine/lab-source.js'

const content = JSON.parse(fs.readFileSync(new URL('../../../_shared/content.json', import.meta.url), 'utf8'))

// ---- R pieces, as static markup ----
const WORDMARK = '<span class="font-abc-favorit font-semibold tracking-[-0.03em] leading-none whitespace-nowrap text-[19px]">Caprae<span class="text-ash-gray font-medium"> Tech</span></span>'
const BOOK = (cls) => `<a href="#book" class="glass-btn relative inline-flex items-center justify-center select-none rounded-2xl font-semibold text-white ${cls}">Book a call</a>`
const NAV = [['Why founders', '#why'], ['Work', '#work'], ['How it works', '#how'], ['Pricing', '#pricing'], ['People', '#founders']]
const navItem = 'h-[58px] flex items-center py-1 text-sm font-medium text-ash-gray hover:text-bone-white rounded-md outline-none transition duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-white/60 px-2 lg:px-[16px]'
const HEADER = `<header class="site-header sticky top-0 z-40" data-r-header>
  <div aria-hidden="true" class="r-header-bg pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity opacity-0"></div>
  <div class="relative z-10 mx-auto w-full max-w-5xl px-6 md:max-w-7xl">
    <div class="flex w-full items-center py-[12px] md:hidden">
      <a class="flex-auto text-bone-white rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/60" href="#hero">${WORDMARK}</a>
      ${BOOK('h-10 px-[16px] text-sm whitespace-nowrap')}
    </div>
    <nav aria-label="Main" class="mx-auto hidden h-[58px] w-full items-center md:flex">
      <div class="flex flex-1 lg:w-[225px]"><a class="py-1 text-bone-white rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/60" href="#hero">${WORDMARK}</a></div>
      <ul class="m-0 flex list-none items-center p-0">${NAV.map(([l, h]) => `<li><a class="${navItem}" href="${h}">${l}</a></li>`).join('')}</ul>
      <div class="flex flex-1 justify-end">${BOOK('h-10 px-[16px] text-sm whitespace-nowrap')}</div>
    </nav>
  </div>
</header>`

// a live R 3D view over its static fallback (the fallback is what no-WebGL visitors see)
const CUBE_SVG = '<svg width="84" height="84" viewBox="0 0 84 84" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1" stroke-linejoin="round"><path d="M42 10 70 26v32L42 74 14 58V26Z"/><path d="M14 26 42 42 70 26M42 42v32"/></svg>'
const view = (kind, cls = 'absolute inset-0') => `<div class="r-view ${cls}" data-view="${kind}"><div class="r-fallback absolute inset-0 flex items-center justify-center">${CUBE_SVG}</div><canvas aria-hidden="true" class="absolute inset-0 h-full w-full"></canvas></div>`
// R's 170px 3D icon tile (Integrate.jsx Tile3D)
const TILE = kind => `<div aria-hidden="true" class="r-tile mx-auto mb-[16px] flex h-[170px] w-[170px] items-center justify-center">
  <div class="relative h-[146px] w-[146px] overflow-hidden rounded-[36px]" style="background: radial-gradient(60% 40% at 50% 100%, rgba(146,129,247,0.22) 0%, rgba(146,129,247,0) 100%), linear-gradient(160deg, #161618 0%, #070708 70%)">${view(kind)}</div>
</div>`

// R's logo strip (Logos.jsx), the parent firm's portfolio set as type
const { label, names, disclaimer } = content.work.portfolio
const LOGOS = `<section data-block="logos" aria-labelledby="portfolio-label" class="r-logos mx-auto px-6 py-[48px] sm:py-[96px] max-w-5xl md:max-w-7xl relative rounded-3xl border-t border-[#d6ebfd30] mt-[40px] flex flex-col items-center">
  <div aria-hidden="true" class="t-glow-line left-1/2 top-0 w-[300px] pointer-events-none absolute h-px max-w-full -translate-x-1/2 -translate-y-1/2"></div>
  <h2 id="portfolio-label" class="m-0 text-base md:text-[1.125rem] md:leading-[1.5] text-ash-gray font-normal mb-10 max-w-lg text-center text-balance">${label}</h2>
  <ul class="m-0 p-0 list-none w-5/6 gap-x-[16px] grid grid-cols-2 items-center sm:grid-cols-3 lg:grid-cols-5">${names.map(n => `<li class="flex h-[64px] sm:h-[96px] items-center justify-center text-center font-abc-favorit font-semibold text-[17px] sm:text-[20px] tracking-[-0.02em] text-bone-white/75">${n}</li>`).join('')}</ul>
  <p class="m-0 mt-10 text-sm text-ash-gray text-center text-balance">${disclaimer}</p>
</section>`

// which R 3D tile opens which Lab section (R's own mapping: wedge, how, people, the five)
const SECTION_TILES = { why: 'wedge', how: 'how', founders: 'people', team: 'control' }

for (const letter of ['a', 'b', 'c']) {
  let rw = labRewriter(letter)
    .on('nav.site-nav', { element: e => e.replace(HEADER, { html: true }) })
    .on('body', { element: e => e.setAttribute('class', 'r-skin') })
    .on('title', { element: e => e.setInnerContent(`Caprae Tech · R ${letter.toUpperCase()}`) })
    // hero 3D: R's cube takes the Lab A cube's place; B and C get the cube as a tile on top
    .on('div.variant[data-v="a"] div.cube-stage', { element: e => { if (letter === 'a') e.setInnerContent(`<div class="hero-cube-open relative h-full w-full">${view('hero')}</div>`, { html: true }) } })
    .on(`div.variant[data-v="${letter}"] div.hB`, { element: e => e.prepend(TILE('hero'), { html: true }) })
    .on(`div.variant[data-v="${letter}"] div.hC`, { element: e => e.prepend(TILE('hero'), { html: true }) })
    .on('section#hero', { element: e => e.after(LOGOS, { html: true }) })
  for (const [sec, kind] of Object.entries(SECTION_TILES))
    rw = rw.on(`section#${sec} div.variant[data-v="${letter}"] div.sec-pad > div.wrap`, { element: e => e.prepend(TILE(kind), { html: true }) })
  // The Lab's CSS goes into cascade layer "lab", ordered after Tailwind's base and before its
  // utilities (src/styles/app.css): the Lab's layout still beats the reset, and R's utility
  // classes win where they are used. Unlayered, the Lab's *{padding:0} beat every utility.
  const src = labText('/src/main.js').replaceAll('<style>', '<style>@layer lab{').replaceAll('</style>', '}</style>')
    // layer order is fixed by the first place a layer name appears, so declare it before any
    // of the Lab's inline styles (app.css repeats it for the picker page)
    .replace('<head>', '<head>\n<style>@layer theme, base, lab, components, utilities;</style>')
  const out = await rw.transform(new Response(src)).text()
  fs.mkdirSync(letter, { recursive: true })
  fs.writeFileSync(`${letter}/index.html`, out)
  const count = s => out.split(s).length - 1
  console.log(`${letter}/index.html: ${count('class="variant on"')} sections on, 3D views ${count('data-view=')}, lab bars ${count('lab-bar"')}`)
}

// the folder root: pick a version
fs.writeFileSync('index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Caprae Tech · R with the Section Lab</title></head>
<body class="r-skin r-index">
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6">
    <h1 class="t-display t-gradient m-0 text-[3rem] tracking-tighter leading-[110%]">Direction R, with the Section Lab content</h1>
    <p class="m-0 text-ash-gray">Same R design and 3D. Each version uses one set of Lab designs and text.</p>
    <div class="flex flex-wrap gap-3">${['a', 'b', 'c'].map(l => `<a class="glass-btn inline-flex h-12 items-center rounded-2xl px-5 font-semibold text-white" href="./${l}/">Version ${l.toUpperCase()}</a>`).join('')}</div>
  </main>
  <script type="module" src="/src/index.js"></script>
</body></html>
`)
console.log('index.html: version picker')
