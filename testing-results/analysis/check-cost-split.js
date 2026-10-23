// Body of an async function run by cdp-check.js on the DEV server: is the cost of a software
// WebGL frame in our code (physics, drawing) or in presenting the canvas to the page?
// Waits for the engine to settle (light level sleeps after the intro), then runs 3 s of
// physics only, then 3 s of drawing, each on rAF, and counts long tasks in each window.
for (let i = 0; i < 100 && !window.__stage; i++) await new Promise(r => setTimeout(r, 200))
const s = window.__stage
if (!s) return 'no __stage'
await new Promise(r => setTimeout(r, 7000)) // past the 3.5 s intro: the light level is asleep now
const longs = []
new PerformanceObserver(l => { for (const e of l.getEntries()) longs.push(Math.round(e.duration)) }).observe({ type: 'longtask' })
const run = (fn, ms) => new Promise(done => { const end = performance.now() + ms; let n = 0
  const tick = () => { if (performance.now() > end) return done(n); fn(); n++; requestAnimationFrame(tick) }; requestAnimationFrame(tick) })
const sum = a => a.reduce((x, y) => x + y, 0)
const idle0 = longs.length
await new Promise(r => setTimeout(r, 2000))
const idle = { longTasks: longs.length - idle0 }
let k = longs.length
const physFrames = await run(() => s.field.update(1, 1 / 30), 3000)
const phys = { frames: physFrames, longTasks: longs.length - k, longMs: sum(longs.slice(k)) }
k = longs.length
const drawFrames = await run(() => s.post.render(1), 3000)
const draw = { frames: drawFrames, longTasks: longs.length - k, longMs: sum(longs.slice(k)), longMax: Math.max(0, ...longs.slice(k)) }
return { quality: document.querySelector('canvas.particle-field').dataset.quality, idle2s: idle, physicsOnly3s: phys, drawOnly3s: draw }
