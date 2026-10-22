// CPU-profiles (headless Chrome on the dev server, e.g. bunx vite --port 5207 --host 127.0.0.1) the first N ms of a page load in headless Chrome (GPU) and prints inclusive time
// for named functions plus the top self-time functions.  bun check-startup-profile.js <url> <ms> [names,...]
import { spawn } from 'node:child_process'
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'
const [url, ms = '8000', names = ''] = process.argv.slice(2)
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const port = 9700 + Math.floor(Math.random() * 100), prof = fs.mkdtempSync(path.join(os.tmpdir(), 'prof-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--window-size=412,823', '--no-first-run', 'about:blank'], { stdio: 'ignore' })
const sleep = t => new Promise(r => setTimeout(r, t))
let target; for (let i = 0; i < 50 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page') } catch {} ; if (!target) await sleep(200) }
const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pending = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
await send('Page.enable'); await send('Profiler.enable'); await send('Profiler.setSamplingInterval', { interval: 200 })
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__lt=[];new PerformanceObserver(l=>{for(const e of l.getEntries())__lt.push([Math.round(e.startTime),Math.round(e.duration)])}).observe({type:'longtask',buffered:true})` })
await send('Profiler.start'); await send('Page.navigate', { url }); await sleep(+ms)
const { profile } = (await send('Profiler.stop')).result
const page = (await send('Runtime.evaluate', { expression: `JSON.stringify({lt:__lt,q:document.querySelector('canvas')?.dataset.quality})`, returnByValue: true })).result.result.value
ws.close(); chrome.kill(); try { fs.rmSync(prof, { recursive: true, force: true }) } catch {}
const byId = new Map(profile.nodes.map(n => [n.id, n])), parent = new Map()
for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id)
const key = n => `${n.callFrame.functionName || '(anon)'} ${n.callFrame.url.replace(/^.*\/(node_modules\/\.vite\/deps\/|src\/)/, '')}:${n.callFrame.lineNumber + 1}`
const incl = new Map(), self = new Map()
profile.samples.forEach((s, i) => {
  const dt = (profile.timeDeltas[i] || 0) / 1000; let n = byId.get(s); self.set(key(n), (self.get(key(n)) || 0) + dt)
  const seen = new Set(); while (n) { const k = key(n); if (!seen.has(k)) { seen.add(k); incl.set(k, (incl.get(k) || 0) + dt) } n = byId.get(parent.get(n.id)) }
})
console.log('page', page)
const want = names.split(',').filter(Boolean)
console.log('-- inclusive (ms) for named functions')
for (const [k, v] of [...incl].filter(([k]) => want.some(w => k.startsWith(w + ' '))).sort((a, b) => b[1] - a[1]).slice(0, 40)) console.log(Math.round(v).toString().padStart(6), k)
console.log('-- top self (ms)')
for (const [k, v] of [...self].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(Math.round(v).toString().padStart(6), k)
process.exit(0)
