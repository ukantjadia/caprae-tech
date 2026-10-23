// Headless check of a page in this machine's Chrome (the connected automation browser is on another
// computer, so it can't reach localhost here). Loads the URL, waits, runs a JS expression in the
// page, saves a screenshot and reports page errors.
//   bun testing-results/analysis/cdp-check.js <url> <out.png> [gpu|sw|none] [waitMs] [width] [height] [jsFile]
// The JS file's last expression is returned (top-level await allowed); omit it for the default check.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const [url, out, mode = 'gpu', waitMs = '6000', w = '1440', h = '900', jsFile] = process.argv.slice(2)
if (!url || !out) { console.error('usage: <url> <out.png> [gpu|sw|none] [waitMs] [width] [height] [jsFile]'); process.exit(1) }
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(p => fs.existsSync(p))
const FLAGS = {
  gpu: [],
  sw: ['--disable-gpu', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  none: ['--disable-gpu', '--disable-webgl', '--disable-3d-apis'],
}[mode]
const port = 9300 + Math.floor(Math.random() * 500)
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-check-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${w},${h}`, '--no-first-run', '--hide-scrollbars', ...FLAGS, 'about:blank'], { stdio: 'ignore' })
const cleanup = () => { try { chrome.kill() } catch {} ; try { fs.rmSync(profile, { recursive: true, force: true }) } catch {} }

const sleep = ms => new Promise(r => setTimeout(r, ms))
let target
for (let i = 0; i < 50 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page') } catch {}
  if (!target) await sleep(200)
}
if (!target) { console.error('chrome did not start'); cleanup(); process.exit(1) }

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0
const pending = new Map(), errors = []
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
  if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails?.exception?.description?.split('\n')[0] || m.params.exceptionDetails?.text)
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error: ' + m.params.args.map(a => a.value ?? a.description).join(' '))
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push(`${m.params.entry.source}: ${m.params.entry.text} ${m.params.entry.url || ''}`.trim())
})
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: +w < 600 })
await send('Page.navigate', { url })
await sleep(+waitMs)

const DEFAULT = `(() => { const c = document.querySelector('canvas.particle-field'); let r = null
  try { const g = c && c.getContext('webgl2'); const d = g && g.getExtension('WEBGL_debug_renderer_info'); r = d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : null } catch {}
  return { title: document.title.slice(0, 50), canvas: !!c, quality: c ? c.dataset.quality : null, renderer: r, dom: document.getElementsByTagName('*').length } })()`
const expr = jsFile ? fs.readFileSync(jsFile, 'utf8') : DEFAULT
const res = await send('Runtime.evaluate', { expression: `(async () => { return ${jsFile ? `await (async () => { ${expr} })()` : expr} })()`, awaitPromise: true, returnByValue: true })
const shot = await send('Page.captureScreenshot', { format: 'png' })
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
console.log(JSON.stringify({ mode, url, result: res.result?.result?.value ?? res.result?.exceptionDetails?.exception?.description ?? res.result?.exceptionDetails?.text ?? res.error ?? res.result, errors }, null, 1))
ws.close(); cleanup(); process.exit(0)
