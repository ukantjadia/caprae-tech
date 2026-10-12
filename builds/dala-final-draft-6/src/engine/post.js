// Dala's post chain (research/dala/05-particle-spec.md 3.6): bloom 0.4 / radius 1 /
// threshold 0.159, then vignette (offset 0.3, darkness 4) and film grain in one pass.
// No depth of field and no MSAA: those were ~95% of the old builds' frame (D-065).
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const FINISH = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      // three's VignetteShader with Dala's values: offset 0.3, darkness 4
      vec2 uv = (vUv - 0.5) * 0.3;
      col = mix(col, vec3(1.0 - 4.0), dot(uv, uv));
      col = max(col, 0.0);
      // grain, Dala's layer: alpha 0.149, brightness 0.252, re-jittered every frame
      float g = hash(vUv * uRes + fract(uTime) * 97.1) * 0.252;
      col = mix(col, vec3(g), 0.149 * g * 4.0);
      gl_FragColor = vec4(col, 1.0);
    }`,
}

export function createPost(renderer, scene, camera) {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 1, 0.159)
  composer.addPass(bloom)
  const finish = new ShaderPass(FINISH)
  composer.addPass(finish)
  return {
    composer, bloom, finish,
    setSize(w, h) {
      composer.setPixelRatio(renderer.getPixelRatio())
      composer.setSize(w, h)
      finish.uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio())
    },
    render(time) { finish.uniforms.uTime.value = time; composer.render() },
  }
}
