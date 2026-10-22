// Body of an async function run by cdp-check.js: long tasks and rAF frame intervals over 10 s from
// the moment it runs (the engine starts after first paint), then once more after a scroll.
const longs = []
new PerformanceObserver(l => { for (const e of l.getEntries()) longs.push(Math.round(e.duration)) }).observe({ type: 'longtask', buffered: true })
const frames = []
let last = performance.now(), run = true
const tick = () => { const n = performance.now(); frames.push(Math.round(n - last)); last = n; if (run) requestAnimationFrame(tick) }
requestAnimationFrame(tick)
await new Promise(r => setTimeout(r, 10000))
const idle = { longTasks: longs.length, longTotalMs: longs.reduce((a, b) => a + b, 0), longMax: Math.max(0, ...longs), frames: frames.length, medianFrameMs: frames.slice().sort((a, b) => a - b)[Math.floor(frames.length / 2)] }
longs.length = 0; frames.length = 0
scrollTo(0, innerHeight * 1.5) // wake the field: the shape moves to the next section
await new Promise(r => setTimeout(r, 6000))
run = false
const c = document.querySelector('canvas.particle-field')
return { quality: c && c.dataset.quality, firstTenSeconds: idle, afterScroll6s: { longTasks: longs.length, longTotalMs: longs.reduce((a, b) => a + b, 0), longMax: Math.max(0, ...longs), frames: frames.length } }
