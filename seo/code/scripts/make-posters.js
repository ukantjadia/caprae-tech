// Captures the still images that browsers without WebGL see in the hero (D-100): the formed
// hero shape of the home page and of each inner-page shape set, from the live engine.
//   bun run dev -- --host 127.0.0.1        (in another terminal; the dev build exposes __stage)
//   bun scripts/make-posters.js [http://127.0.0.1:5207]
// Writes public/posters/<home|set>.webp: the hero box plus 15% on each side, at the engine's
// full quality, with the text mask off so the shape is whole and the grain pass off so the
// background is pure black. Re-run after a shape changes.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ORIGIN = process.argv[2] || 'http://127.0.0.1:5207'
const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = path.join(root, 'public', 'posters')
fs.mkdirSync(outDir, { recursive: true })

// home, plus one page per inner shape set (the set each route uses comes from site/shapes.js)
const { ROUTES } = await import('../site/routes.js')
const { pageShapes } = await import('../site/shapes.js')
const targets = [['home', '/', '.hero .hero-mark']]
for (const route of Object.keys(ROUTES)) {
  if (route === '/') continue
  const { set } = pageShapes(route)
  if (set && !targets.some(t => t[0] === set)) targets.push([set, route, '.pg-hero .hero-mark'])
}

const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => fs.existsSync(p))
const port = 9800 + Math.floor(Math.random() * 100)
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'posters-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--window-size=1440,900', '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
const sleep = ms => new Promise(r => setTimeout(r, ms))
let target
for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page') } catch {} ; if (!target) await sleep(200) }
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

// runs in the page: draw one frame with the text mask off, then copy the hero box (+15%) out of
// the WebGL canvas in the same task, before the drawing buffer is cleared
const capture = sel => `(async () => {
  for (let i = 0; i < 100 && !window.__stage; i++) await new Promise(r => setTimeout(r, 100))
  const s = window.__stage, box = document.querySelector(${JSON.stringify(sel)})
  if (!s || !box) return { error: !s ? 'no __stage (dev server?)' : 'no hero box' }
  scrollTo(0, 0)
  await new Promise(r => setTimeout(r, 6500)) // the intro: particles gather in over 2.4 s, then settle
  for (const m of [s.field.material, s.dust.material]) if (m.uniforms.uMaskOn) m.uniforms.uMaskOn.value = 0
  // no grain or vignette: the background must be pure black, or screen blending shows a grey box
  s.post.finish.enabled = false
  const r = box.getBoundingClientRect(), g = s.renderer.domElement, k = g.width / innerWidth, m = 0.15
  const x = r.left - r.width * m, y = r.top - r.height * m, w = r.width * (1 + 2 * m), h = r.height * (1 + 2 * m)
  s.post.render(1)
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k)
  const ctx = c.getContext('2d')
  ctx.drawImage(g, x * k, y * k, w * k, h * k, 0, 0, c.width, c.height)
  // the bloom leaves a faint floor (~7/255) everywhere: take it out, so empty space is pure black
  // and disappears under screen blending, while the particles and their glow keep their level
  const d = ctx.getImageData(0, 0, c.width, c.height), p = d.data
  let lit = 0
  for (let i = 0; i < p.length; i += 4) {
    for (let j = 0; j < 3; j++) p[i + j] = Math.max(0, (p[i + j] - 8) * 255 / 247)
    if (p[i] + p[i + 1] + p[i + 2] > 60) lit++
  }
  ctx.putImageData(d, 0, 0)
  return { url: c.toDataURL('image/webp', 0.86), size: c.width + 'x' + c.height, quality: g.dataset.quality, lit }
})()`

for (const [name, route, sel] of targets) {
  let res
  for (let attempt = 1; attempt <= 3; attempt++) { // a capture taken before the first frame is blank: retry
    await send('Page.navigate', { url: ORIGIN + route })
    await sleep(1500 * attempt)
    res = (await send('Runtime.evaluate', { expression: capture(sel), awaitPromise: true, returnByValue: true })).result?.result?.value
    if (res?.lit > 1000) break
  }
  if (!res || res.error || !res.url?.startsWith('data:image/webp') || !(res.lit > 1000)) { console.log(`${name} (${route}): failed`, res?.error || `lit pixels ${res?.lit}`); continue }
  const buf = Buffer.from(res.url.split(',')[1], 'base64')
  fs.writeFileSync(path.join(outDir, `${name}.webp`), buf)
  console.log(`${name} (${route}): ${res.size}, ${Math.round(buf.length / 1024)} KB, engine quality ${res.quality}`)
}
ws.close(); chrome.kill(); try { fs.rmSync(profile, { recursive: true, force: true }) } catch {}
process.exit(0)
