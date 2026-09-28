// Usage: node tools/shot.mjs <block NN> [NN...]   (dev server must be running on :5191)
// Writes shots/block-NN.png of the local build, to compare with ref/block-NN.png
import { chromium } from 'file:///C:/Users/Ukant/.claude/skills/gstack/node_modules/playwright/index.mjs'
const ids = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
p.on('pageerror', e => errors.push(e.message)); p.on('console', m => m.type() === 'error' && errors.push(m.text()))
await p.goto('http://localhost:5191/', { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(2500)
for (const id of ids) {
  const el = p.locator(`[data-block="${id}"]`).first()
  await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200)
  await el.screenshot({ path: `shots/block-${id}.png` })
  const box = await el.boundingBox()
  console.log(`block-${id}: ${Math.round(box.width)}x${Math.round(box.height)} (ref: see ref/index.json)`)
}
if (errors.length) console.log('PAGE ERRORS:\n' + errors.join('\n'))
await b.close()
