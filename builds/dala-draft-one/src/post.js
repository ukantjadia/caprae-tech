// Depth of field + grain in one full-screen pass. The scene renders into a float
// target with view depth in alpha (see FRAG in particles.js), because three's
// BokehPass renders depth with an override material that ignores our GPU positions.
import * as THREE from 'three'

export const DEPTH_SCALE = 20.0 // alpha = viewDepth / DEPTH_SCALE, shared with particles.js

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
uniform sampler2D tScene;
uniform vec2 uRes;
uniform float uFocus;
uniform float uRange;
uniform float uMaxBlur;
uniform float uTime;
varying vec2 vUv;

// sharp band of +-3.8 around focus (the shape radius) so the whole shape stays crisp, then ramps to max blur
// particles nearer than focus blur harder than the background, like a real lens close up
float coc(float a) {
  float d = a * ${DEPTH_SCALE.toFixed(1)} - uFocus;
  return smoothstep(3.8, uRange, abs(d)) * uMaxBlur * (d < 0.0 ? 2.0 : 1.0);
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec4 c = texture2D(tScene, vUv);
  vec3 acc = c.rgb;
  float wsum = 1.0;
  // golden-angle disc; a sample counts only if its own blur reaches this pixel,
  // so sharp particles never bleed and blurred ones spread into soft discs
  for (int i = 0; i < 32; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / 32.0) * uMaxBlur * 2.0; // disc covers the stronger near blur
    float a = fi * 2.39996;
    vec4 s = texture2D(tScene, vUv + vec2(cos(a), sin(a)) * r / uRes);
    float w = smoothstep(r - 1.5, r + 1.5, coc(s.a));
    acc += s.rgb * w;
    wsum += w;
  }
  vec3 col = acc / wsum;
  col *= 1.0 - 0.35 * pow(length(vUv - 0.5) * 1.3, 2.5);          // vignette
  col += (hash(vUv * uRes + fract(uTime) * 91.7) - 0.5) * 0.018;     // film grain
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

export function createPost(renderer) {
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }) // no MSAA: its resolve cost ~14.5 ms a frame (D-067)
  const uniforms = {
    tScene: { value: target.texture },
    uRes: { value: new THREE.Vector2(1, 1) },
    uFocus: { value: 6 }, uRange: { value: 11 }, uMaxBlur: { value: 8 }, uTime: { value: 0 },
  }
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, depthTest: false }))
  const postScene = new THREE.Scene().add(quad)
  const postCamera = new THREE.Camera()
  const clear = new THREE.Color(0, 0, 0)

  return {
    uniforms,
    setSize(w, h) {
      const dpr = renderer.getPixelRatio()
      target.setSize(w * dpr, h * dpr)
      uniforms.uRes.value.set(w * dpr, h * dpr)
    },
    render(scene, camera, time) {
      uniforms.uTime.value = time
      renderer.setRenderTarget(target)
      renderer.setClearColor(clear, 1) // alpha 1 = far, so empty sky counts as fully blurred
      renderer.clear()
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.render(postScene, postCamera)
    },
  }
}
