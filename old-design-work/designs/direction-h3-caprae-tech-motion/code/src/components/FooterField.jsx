import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

/* The footer field, which replaces the 14.3MB looping video H shipped.
 *
 * The trade is the whole argument for it: minus 14.3MB of stock footage, plus
 * a measured 14.4KB gzipped of OGL, and the footer stops being something
 * anyone could have bought and starts being something this team wrote. A site
 * selling engineering should not end on a video it licensed.
 *
 * Importing the four names from the package root costs exactly what importing
 * them from ogl/src/* does, byte for byte, so the barrel stays.
 *
 * One fullscreen triangle, one draw call, no scene graph and no camera. Cost
 * is entirely in the fragment stage, so it is bounded by the pixel count
 * rather than by the geometry, which is why rendering at half resolution and
 * letting the browser upscale keeps a laptop on integrated graphics at 60fps.
 *
 * The loop only runs while the footer is on screen. A shader burning a core
 * behind three viewports of content is exactly the kind of thing that makes a
 * technical vendor's own site refute them.
 */

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = /* glsl */ `
precision mediump float;

varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform vec2 uRes;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Four octaves is the ceiling here. A fifth is invisible at this scale and
// costs another full-screen pass of the hash.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uRes.x / max(uRes.y, 1.0);

  // 0.035 is slow on purpose. This is a footer read by people in their
  // sixties, not a demo reel.
  float t = uTime * 0.035;

  vec2 warp = vec2(
    fbm(uv * 2.0 + vec2(0.0, t)),
    fbm(uv * 2.0 + vec2(5.2, 1.3) - t)
  );

  // arriving at the footer pushes the field, so it answers the scroll rather
  // than looping indifferently behind it
  float f = fbm(uv * 2.4 + warp * 1.7 + vec2(0.0, uScroll * 0.6));

  vec3 deep = vec3(0.07, 0.016, 0.0);
  vec3 flame = vec3(1.0, 0.239, 0.0);
  vec3 lit = vec3(1.0, 0.541, 0.122);

  // fbm sits around 0.5, so thresholds above that clip the whole field to the
  // base colour. Measured: with the old 0.40/0.80 window every sampled pixel
  // came back under 0.03 once the scrim landed on it, which is black.
  vec3 col = mix(deep, flame, smoothstep(0.26, 0.68, f));
  col = mix(col, lit, smoothstep(0.52, 0.86, f) * 0.72);

  // the top edge has to meet the page's own background, and the band under the
  // sitemap has to stay dark enough to read links off
  float fade = smoothstep(0.0, 0.46, vUv.y);
  col *= 0.30 + 0.70 * fade;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function FooterField({ hostRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef?.current
    if (!canvas || !host) return

    let renderer
    try {
      renderer = new Renderer({ canvas, alpha: false, antialias: false, dpr: 1 })
    } catch {
      // no WebGL. The footer keeps the gradient it already had.
      return
    }

    const gl = renderer.gl
    if (gl.isContextLost()) return
    gl.clearColor(0.07, 0.016, 0.0, 1)

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uRes: { value: [1, 1] },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    // Half resolution, upscaled by the browser. The field has no hard edges,
    // so there is nothing in it for the extra pixels to resolve.
    const SCALE = 0.5
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      renderer.setSize(Math.max(1, w * SCALE), Math.max(1, h * SCALE))
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      program.uniforms.uRes.value = [w, h]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = false
    let lost = false

    const draw = (ms) => {
      frame = requestAnimationFrame(draw)
      const rect = host.getBoundingClientRect()
      // 0 as the footer's top reaches the bottom of the viewport, 1 once it has
      // travelled a full viewport past it
      const progress = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight))
      program.uniforms.uScroll.value = progress
      program.uniforms.uTime.value = ms * 0.001
      renderer.render({ scene: mesh })
    }

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const start = () => {
      if (frame || lost) return
      frame = requestAnimationFrame(draw)
    }

    const renderOnce = () => {
      program.uniforms.uTime.value = 0
      program.uniforms.uScroll.value = 0.5
      renderer.render({ scene: mesh })
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) { stop(); return }
      if (reduced.matches) renderOnce()
      else start()
    })
    io.observe(host)

    const onMotionChange = () => {
      if (!visible) return
      if (reduced.matches) { stop(); renderOnce() } else start()
    }
    reduced.addEventListener('change', onMotionChange)

    // A lost context on a long-lived page leaves a black rectangle behind the
    // sitemap, which is worse than no field at all.
    const onLost = (event) => {
      event.preventDefault()
      lost = true
      stop()
      canvas.style.display = 'none'
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      reduced.removeEventListener('change', onMotionChange)
      canvas.removeEventListener('webglcontextlost', onLost)
      /* Deliberately not calling WEBGL_lose_context here. React reuses the same
         canvas node across a StrictMode unmount/remount, so losing the context
         on cleanup left the second mount holding a dead one: verified, every
         readPixels came back 0,0,0,0 with isContextLost() true. Dropping the
         canvas is what releases the context, and React does that itself. */
    }
  }, [hostRef])

  return <canvas ref={canvasRef} className="foot__field" aria-hidden="true" />
}
