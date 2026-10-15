// Usage: node tools/check.mjs   (dev server on :5191)
// Prints fonts in use, hero CTA position, brand leaks, off-site requests and page errors,
// and writes full-page shots at 1440 and 375.
import { chromium } from 'file:///C:/Users/Ukant/.claude/skills/gstack/node_modules/playwright/index.mjs'
const b = await chromium.launch()
for (const [w, h] of [[1440, 900], [375, 812]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  const ext = [], errs = []
  p.on('request', r => { const u = new URL(r.url()); if (u.protocol.startsWith('http') && !['localhost', '127.0.0.1'].includes(u.hostname)) ext.push(r.url()) })
  p.on('pageerror', e => errs.push(e.message))
  p.on('console', m => m.type() === 'error' && errs.push(m.text()))
  await p.goto('http://localhost:5191/', { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  const info = await p.evaluate(() => ({
    h1: getComputedStyle(document.querySelector('h1')).fontFamily,
    body: getComputedStyle(document.body).fontFamily,
    loaded: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))],
    ctaBottom: Math.round(document.querySelector('[data-block="01"] a[href^="mailto"]')?.getBoundingClientRect().bottom),
    height: document.body.scrollHeight,
    hscroll: document.documentElement.scrollWidth > innerWidth,
    resend: (document.body.innerText.match(/resend/gi) || []).length,
  }))
  console.log(w, JSON.stringify(info), '| external:', ext, '| errors:', errs)
  for (let y = 0; y < info.height; y += 700) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(120) }
  await p.evaluate(() => scrollTo(0, 0))
  await p.screenshot({ path: `shots/full-${w}.png`, fullPage: true })
  await p.close()
}
await b.close()
