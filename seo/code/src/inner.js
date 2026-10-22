// Every page except home: the home page's look without the particle stage (no WebGL), so
// inner pages stay light. Same fonts, same component styles, same button (inner.css).
import './inner.css'
import { startMenu } from './menu.js'
import { startWidgets } from './widgets.js'

startMenu()
startWidgets()

// the small result pictures (final.css .fx, .mock-bars) run only while on screen, as on home
const io = new IntersectionObserver(es => { for (const e of es) e.target.classList.toggle('in', e.isIntersecting) }, { threshold: 0.25 })
for (const el of document.querySelectorAll('[data-io]')) io.observe(el)

// Privacy and Terms: highlight the section being read in the contents list
const legalToc = document.querySelector('.legal-sec .legal-toc')
if (legalToc) import('./legal-toc.js').then(m => m.startLegalToc(legalToc))

// Facility cleaning: the quote calculator demo
const quoteCalc = document.querySelector('[data-calc]')
if (quoteCalc) import('./quote-calc.js').then(m => m.startQuoteCalc(quoteCalc))

// the particle field: after the page has painted, so the content never waits for WebGL
const stage = () => import('./inner-stage.js')
if (document.readyState === 'complete') stage()
else addEventListener('load', stage, { once: true })
