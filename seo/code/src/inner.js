// Every page except home: the home page's look without the particle stage (no WebGL), so
// inner pages stay light. Same fonts, same component styles, same button (inner.css).
import './inner.css'
import { startMenu } from './menu.js'
import { startWidgets } from './widgets.js'
import { loadChat } from './chat-loader.js'

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

// MVP page: the "What we leave out of v1" case-study carousel
const v1Car = document.querySelector('[data-carousel]')
if (v1Car) import('./v1-carousel.js').then(m => m.startV1Carousel(v1Car))

// Dashboards page: the CRM screenshot gallery and the screen recordings
const gallery = document.querySelector('[data-gallery]')
const autoVids = document.querySelectorAll('video[data-autoplay]')
if (gallery || autoVids.length) import('./gallery.js').then(m => { if (gallery) m.startGallery(gallery); if (autoVids.length) m.startAutoplay(autoVids) })

// the particle field: after the page has painted, so the content never waits for WebGL
// Off for now: the particle shape runs on the home page only (2026-10-23).
// const stage = () => import('./inner-stage.js')
// if (document.readyState === 'complete') stage()
// else addEventListener('load', stage, { once: true })

// the site assistant's chat icon, once the page has loaded
loadChat()
