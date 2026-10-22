// Body of an async function run in the home page by cdp-check.js. Confirms the Step 1 and 2 changes
// and that the Lab script's visible parts still work after the hidden variants were removed.
const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)]
const c = q('canvas.particle-field')
const out = {
  canvas: !!c, quality: c ? c.dataset.quality : null,
  variants: qa('.variant').length, variantsOn: qa('.variant.on').length, h1: qa('h1').length,
  main: !!q('main#main'), skip: q('.cx-skip')?.getAttribute('href'), navCta: q('.cx-cta')?.getAttribute('href'),
  heroCta: q('#hero .btn-white')?.getAttribute('href'),
  iron: getComputedStyle(document.documentElement).getPropertyValue('--iron').trim(),
  devShopColor: q('#cmpB td:nth-child(2)') ? getComputedStyle(q('#cmpB td:nth-child(2)')).color : null,
  zoneH3: qa('.zone h3').length, zoneH4: qa('.zone h4').length, dom: document.getElementsByTagName('*').length,
  rotor: q('#rotor')?.textContent, marqueeItems: qa('#marquee > *').length, cmpRows: qa('#cmpB tr').length,
  workCards: qa('#workGrid .wcard').length, workChips: qa('#workChips button').length,
  poolChips: qa('#poolA .fchip').length, flips: qa('#fcC .flip').length, faqBubbles: qa('#faqC .bub').length,
  forms: qa('[data-form]').length, sectionFadeAnim: getComputedStyle(q('.variant.on')).animationName,
}
// interactions: work filter, pricing chip move, faq "show more"
const chip = qa('#workChips button')[1]
if (chip) { chip.click(); out.workAfterFilter = qa('#workGrid .wcard').filter(e => !e.classList.contains('hide')).length }
const pc = q('#poolA .fchip')
if (pc) { const before = q('#hrsA')?.textContent; pc.click(); await new Promise(r => setTimeout(r, 50)); out.pricingHours = `${before} -> ${q('#hrsA')?.textContent}` }
const more = q('#chatMore')
if (more) { more.click(); out.faqAfterMore = qa('#faqC .bub').length }
scrollTo(0, 0)
return out
