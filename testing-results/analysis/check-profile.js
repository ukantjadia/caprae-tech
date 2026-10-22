// Body of an async function run by cdp-check.js on the DEV server: times each part of a frame of
// the particle engine (window.__stage is exposed in dev only), forcing the GPU work to finish
// (gl.finish) so software WebGL time is counted where it happens.
for (let i = 0; i < 100 && !window.__stage; i++) await new Promise(r => setTimeout(r, 200))
const s = window.__stage
if (!s) return 'no __stage (not the dev server?)'
await new Promise(r => setTimeout(r, 4000))
const gl = s.renderer.getContext()
const time = (fn, n = 5) => { gl.finish(); const t0 = performance.now(); for (let i = 0; i < n; i++) { fn(); gl.finish() } return +((performance.now() - t0) / n).toFixed(1) }
const c = document.querySelector('canvas.particle-field')
const pr = s.renderer.getPixelRatio(), size = s.renderer.getSize(new (s.camera.position.constructor)(0, 0, 0))
return {
  quality: c.dataset.quality, pixelRatio: pr, drawingBuffer: `${gl.drawingBufferWidth}x${gl.drawingBufferHeight}`,
  bloomEnabled: s.post.bloom.enabled,
  ms_physicsStep: time(() => s.field.update(1, 1 / 30)),
  ms_sceneRenderOnly: time(() => s.renderer.render(s.scene, s.camera)),
  ms_postRenderFull: time(() => s.post.render(1)),
  ms_dustUpdate: time(() => s.dust.update(1)),
  triangles: s.renderer.info.render.triangles, calls: s.renderer.info.render.calls,
}
