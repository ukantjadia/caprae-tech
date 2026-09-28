# 03. Code, learning material and agent skills for a Dala-style particle build

Checked 2026-09-29. Star counts and last-push dates come from the GitHub API on
that day. "No license" means the repo has no LICENSE file: read it, learn from
it, do not paste it. Closeness to Dala is scored 1 to 5 (5 = same technique end
to end).

Target technique, restated: N instanced particles; position and velocity in two
float textures updated by ping-pong FBOs; velocity springs toward a target
texture (`spring 0.006`, `friction 0.892`); targets sampled from GLB meshes or
baked to EXR; ScrollTrigger progress drives morph and explode uniforms; mouse
repulsion; BokehShader2 DOF plus film grain.

The core update, so the scores below mean something:

```glsl
// velocity pass
vec3 pos = texture2D(tPos, uv).xyz;
vec3 vel = texture2D(tVel, uv).xyz;
vec3 target = mix(texture2D(tShapeA, uv).xyz, texture2D(tShapeB, uv).xyz, uMorph);
target += normalize(target) * uExplode * rand(uv);
vel += (target - pos) * 0.006;                       // spring
vec3 d = pos - uMouse; vel += normalize(d) * uRepel * smoothstep(uRadius, 0.0, length(d));
vel *= 0.892;                                        // friction
// position pass: pos += vel
```

## 1. Code and demos

| # | Source | License | What it shows | Dala 1-5 | Notes |
|---|---|---|---|---|---|
| A | [three.js `GPUComputationRenderer`](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/misc/GPUComputationRenderer.js) with [`webgl_gpgpu_birds`](https://threejs.org/examples/webgl_gpgpu_birds.html), [`webgl_gpgpu_birds_gltf`](https://threejs.org/examples/webgl_gpgpu_birds_gltf.html), [`webgl_gpgpu_protoplanet`](https://threejs.org/examples/webgl_gpgpu_protoplanet.html) | MIT. three.js 116k stars, r186 released 2026-09-24 | Position and velocity textures, ping-pong, dependency wiring between the two passes, instanced render reading the texture | 4 | The canonical scaffold. Birds is exactly the pos/vel pair Dala needs; swap the flocking rules for the spring. Matches our repo: Direction R already runs vanilla three 0.186.1 |
| B | [Codrops, Crafting a Dreamy Particle Effect with Three.js and GPGPU](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/) (Dominik Fojcik, 2024-12-19), repo [DGFX/codrops-dreamy-particles](https://github.com/DGFX/codrops-dreamy-particles), [demo](https://tympanus.net/Tutorials/DreamyParticles/) | No license. 32 stars, last push 2024-12-18 | `GPUComputationRenderer` with separate velocity and position shaders, spring back to `MeshSurfaceSampler` positions (`vel += dir * 0.0003; vel *= 0.7`), mouse repulsion via raycast with three-mesh-bvh, custom velocity-driven bloom | 4 | Closest physics to Dala. Missing: multiple targets, scroll, DOF. Renders `THREE.Points`, not instances |
| C | [chrismaldona2/tsl-morphing-particles](https://github.com/chrismaldona2/tsl-morphing-particles) | No license. 16 stars, last push 2026-03-18 | R3F 9 + TSL (WebGPU). 16k particles, 9+ GLBs sampled with `MeshSurfaceSampler` into one `DataArrayTexture` (one layer per shape, 128x128), `InstancedMesh`, curl noise | 3 | Best multi-target data layout found. No velocity state: it mixes A to B in the vertex shader, so no spring and no mouse inertia. Take the layer-per-shape idea, not the code |
| D | [Maxime Heckel, The magical world of Particles with React Three Fiber and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/) (2022-11-08). Blog source [MaximeHeckel/blog.maximeheckel.com](https://github.com/MaximeHeckel/blog.maximeheckel.com), MIT, 740 stars | MIT (blog repo) | Eight interactive scenes up to an R3F FBO: drei `useFBO`, `createPortal` sim scene, `mix()` morph between box and sphere DataTextures, depth-attenuated `gl_PointSize` | 3 | Clearest explanation of the FBO loop. Position-only sim, no velocity. Follow-up: [Field Guide to TSL and WebGPU](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/) |
| E | [Three.js Journey, GPGPU Flow Field Particles](https://threejs-journey.com/lessons/gpgpu-flow-field-particles-shaders) (2h22) and [Particles Morphing Shader](https://threejs-journey.com/lessons/particles-morphing-shader) (1h35), Bruno Simon | Paid course | GPGPU lesson: `GPUComputationRenderer` seeded from a loaded model's vertex positions, persistent state across frames. Morph lesson: shader-only morph between GLB shapes | 3 | Best pedagogy for the two halves. Paid. Bruno also posted the flow field ported to TSL `compute()` ([X](https://x.com/bruno_simon/status/1803396292984410465)) |
| F | [Codrops, FBO Particles with Three.js](https://tympanus.net/codrops/2021/05/31/fbo-particles-with-three-js/) (Yuri Artiukh, akella, 2021 stream, [setup gist](https://gist.github.com/akella/a19954c9ee42e3ae85b76d0e06977535)); [akella workshop, Dynamic GPGPU particles with Three.js and R3F](https://threejs-workshops.com/workshop/dynamic-gpgpu) | Gist: none stated. Workshop: paid | Live-coded FBO particle cloud replicating Visualdata; the workshop covers dynamic GPGPU in R3F | 3 | Akella's GitHub (202 repos) holds only small, old particle repos (`fbo-test`, 2019). The value is the streams on [YouTube](https://www.youtube.com/@akella_/streams), not a repo |
| G | [nicoptere/FBO](https://github.com/nicoptere/FBO) with article [FBO particles, barradeau.com](https://barradeau.com/blog/?p=621) | No license. 181 stars, last push 2021-05-25 | The original minimal FBO particle write-up in three.js | 2 | Historical reference. API calls are dated |
| H | [Wawa Sensei, GPGPU particles with TSL and WebGPU](https://wawasensei.dev/courses/react-three-fiber/lessons/tsl-gpgpu); [wass08/wawa-vfx](https://github.com/wass08/wawa-vfx) | Lesson paid. wawa-vfx MIT, 146 stars, push 2025-09-23 | Lesson: `instancedArray` storage buffers, init and update compute, morph to models and text, `SpriteNodeMaterial`. wawa-vfx is an emitter engine | 3 (lesson), 1 (wawa-vfx) | wawa-vfx is bursts and trails, not shape morphing. Skip it |
| I | [three.js `webgpu_compute_particles`](https://threejs.org/examples/webgpu_compute_particles.html), [`webgpu_tsl_compute_attractors_particles`](https://threejs.org/examples/webgpu_tsl_compute_attractors_particles.html), [`webgpu_compute_texture_pingpong`](https://threejs.org/examples/webgpu_compute_texture_pingpong.html) | MIT | 500k compute-updated particles in storage buffers; attractor forces; texture ping-pong in TSL | 3 | The WebGPU path if we ever take it. See section 5 |
| J | [mmdalipour/particle-morph](https://github.com/mmdalipour/particle-morph) | No license. 15 stars, push 2025-11-05 | R3F 8 component: GLTF to particles, morph between shapes, scroll progress hook, glow via postprocessing | 2 | Vertex-shader morph with per-particle damping, not GPGPU state. Old R3F 8 / three 0.160 |
| K | [sebastien-lempens/r3f-flow-field-particles](https://github.com/sebastien-lempens/r3f-flow-field-particles) | MIT, 63 stars, push 2026-08-16 | GPGPU flow field in R3F, can seed from a model | 2 | Flow field, not spring-to-target. Useful as a licensed R3F GPGPU reference |
| L | [lightest/gpuparticles](https://github.com/lightest/gpuparticles), [tuqire/three.js-fbo](https://github.com/tuqire/three.js-fbo), [Alex-DG/threejs-glb-particles-animation](https://github.com/Alex-DG/threejs-glb-particles-animation) | No license; 7, 11, 7 stars; last push 2024, 2022, 2021 | GLB drag-drop GPU particles; small FBO module; GLB points + GSAP | 1-2 | Low signal. Listed so nobody re-searches them |

Case study worth reading for scroll choreography, no code: [ducklin.de particle portfolio](https://ducklin.de/case-studies/particles.html) (point clouds dissolve on ScrollTrigger).

No public write-up of Dala's own code was found. Green Chameleon's [Dribbble project](https://dribbble.com/unseenstudio/projects/5419063-Dala) and a [screen recording](https://www.youtube.com/watch?v=EDM0cm399b0) show output only.

## 2. Authoring target shapes

**Runtime sampling (default).** [`MeshSurfaceSampler`](https://threejs.org/docs/#examples/en/math/MeshSurfaceSampler) (`three/addons/math/MeshSurfaceSampler.js`) returns uniform random surface points, optionally weighted by an attribute. The mesh need not be rendered. Tutorial: [Codrops, Surface Sampling in Three.js](https://tympanus.net/codrops/2021/08/31/surface-sampling-in-three-js/) (Louis Hoebregts, 2021). Sample every shape to the same count (for example 128x128 = 16,384), write each into an RGBA32F `DataTexture`, or into one `DataArrayTexture` layer per shape (pattern from row C). Cost: GLB download plus a one-off CPU loop at load.

**Offline bake (ship positions, not meshes).** Saves the GLB bytes and the sampling time, which matters for LCP.

- Raw binary: dump a `Float32Array` or half-float array to `.bin`, load with `fetch().arrayBuffer()`, wrap in `DataTexture`. A 128x128 RGBA16F shape is 128KB before HTTP compression. Simplest path, no loader.
- EXR: three.js [`EXRLoader`](https://threejs.org/docs/pages/EXRLoader.html) reads half and full float. Use when an artist bakes from Blender or Houdini.
- Blender: Geometry Nodes "Distribute Points on Faces", then a short `bpy` script that reads the evaluated points and writes them into `bpy.data.images.new(..., float_buffer=True)` saved as OpenEXR. Walkthroughs by thefrontdev: [storing XYZ in a texture for R3F](https://www.thefrontdev.co.uk/storing-positional-xyz-values-in-a-texture-and-reading-in-a-r3f-shader-material/), [exporting particle animations via images](https://www.thefrontdev.co.uk/exporting-particle-animations-from-blender-via-images-for-use-in-r3f-and-three.js/), [particle transition in Blender to R3F](https://www.thefrontdev.co.uk/creating-an-amazing-particle-transition-in-blender-and-exporting-to-react-three-fiber/).
- Blender VAT (when a target is animated, not static): [sharpen3d/openvat](https://github.com/sharpen3d/openvat) (GPL-3.0 add-on, 287 stars, push 2026-09-10, outputs 16-bit PNG or half EXR plus glTF, site [openvat.org](https://openvat.org/)); [flement/VAT-blender-addon](https://github.com/flement/VAT-blender-addon) (no license, 23 stars, push 2026-09-27, targets three.js, can also bake GPU storage buffers). GPL applies to the add-on, not to the textures it outputs.
- Houdini: Scatter SOP, then SideFX Labs Vertex Animation Textures ROP, or a Python SOP writing EXR. [arqtiq/houTHREEni](https://github.com/arqtiq/houTHREEni) (no license, 73 stars, push 2024-05) is a Houdini exporter plus three.js importer. [Design Quest's point-cloud workflow](https://designquest.com.hk/blog/workflow-of-point-cloud-effect) packs Houdini positions into 16-bit PNG RGB.

Recommendation: sample at build time with a bun script (`bun run scripts/bake-shapes.ts`, loading the GLB with three's GLTFLoader in Node and `MeshSurfaceSampler`), write half-float `.bin`. Same code as runtime sampling, no DCC dependency, no EXR decoder in the bundle.

## 3. Bokeh depth of field

| Option | How | Cost | Fit |
|---|---|---|---|
| [BokehShader2](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/BokehShader2.js), demo [`webgl_postprocessing_dof2`](https://threejs.org/examples/webgl_postprocessing_dof2.html) | Full-screen, full-resolution gather. Port of Martins Upitis' shader. Needs `tColor` and `tDepth`; the example renders a separate depth pass. Uniforms include `focalDepth`, `focalLength`, `fstop`, `maxblur`, `threshold`, `gain`, `fringe`, `pentagon`, `noise`, `dithering` | Highest. Ring `i` takes `i * SAMPLES` taps, so defaults (`RINGS 3`, `SAMPLES 4`) give 24 taps plus centre, each tap 3 fetches with `fringe` on: about 75 texture reads per pixel at full res, plus the extra depth render | What Dala uses. Best-looking highlights. Too heavy for integrated graphics at DPR 1.5 |
| [pmndrs/postprocessing `DepthOfFieldEffect`](https://pmndrs.github.io/postprocessing/public/docs/class/src/effects/DepthOfFieldEffect.js~DepthOfFieldEffect.html) (Zlib, 2,868 stars, push 2026-09-27; R3F wrapper [react-postprocessing](https://github.com/pmndrs/react-postprocessing), MIT) | CoC pass, near/far bokeh blur, `resolutionScale` default 0.5, `bokehScale`. Replaced the older `RealisticBokehEffect` ([issue #198](https://github.com/pmndrs/postprocessing/issues/198)). `NoiseEffect` in the same `EffectPass` gives grain for free | Medium. Half-res blur, effects merged into one pass | The sane full-screen choice. Adds the library to the bundle |
| three.js TSL DOF, [`webgpu_postprocessing_dof`](https://threejs.org/examples/webgpu_postprocessing_dof.html), [`_dof_basic`](https://threejs.org/examples/webgpu_postprocessing_dof_basic.html) | Node-based DOF for `WebGPURenderer` | Medium | Only if we move to WebGPU |
| Per-particle sprite bokeh | In the particle vertex shader: `coc = abs(viewZ - uFocus) * uAperture`; scale the quad by `coc`, scale alpha by `1 / coc^2` so energy stays constant, soft disc in the fragment shader | Lowest. No extra pass, no depth texture. Cost is overdraw, growing with blurred size squared, so clamp max size | Best for a particles-only scene. Every blurred "bokeh ball" Dala shows is a particle anyway |

Which is cheaper: per-particle, by a wide margin, as long as the particles are the only thing that needs blur. Two traps with full-screen DOF on particles: additive, `depthWrite: false` particles leave nothing in the depth buffer, so the CoC reads the background; and `gl_PointSize` has a GPU-dependent max (`ALIASED_POINT_SIZE_RANGE`), which is another reason to render instanced quads rather than `THREE.Points` when sizes grow with blur. Grain: a few lines in the final composite, or pmndrs `NoiseEffect`.

Plan: per-particle bokeh on every tier; BokehShader2 or pmndrs DOF only as an opt-in on a strong GPU, and only if a side-by-side shows it is worth it.

## 4. Smooth scroll

- ASScroll: [ashthornton/asscroll](https://github.com/ashthornton/asscroll), MIT, 924 stars, archived 2023-08-09. README: no longer maintained, "I would recommend switching to Lenis". Do not use.
- Lenis: [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis), MIT, 16,067 stars, push 2026-09-22. Native scroll underneath, so `position: sticky` and ScrollTrigger keep working. Standard wiring, one RAF for both:

```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

- Project conflict: D-013 says no smooth-scroll library and D-043 puts scroll motion in CSS `animation-timeline` (see `04-stack-options.md`). Lenis would need a new decision that supersedes D-013. It is also not needed for the look: ScrollTrigger `scrub: 1` already eases the uniforms, and the 0.006 / 0.892 spring eases the particles on top. Native scroll plus scrubbed uniforms gets Dala's feel without touching the wheel, which also keeps the no-scroll-jacking rule clean.
- GSAP on this machine: D-040 records `bun add gsap` writing NUL bytes, so GSAP is vendored from the CDN. Since the scene only needs one progress value, a 10-line scroll-progress read feeding the uniforms (the D-023/D-025 pattern already in the repo) replaces ScrollTrigger entirely.

## 5. WebGPU and TSL compute

- API: `import { WebGPURenderer } from 'three/webgpu'`; state in `instancedArray(count, 'vec3')`; logic in `Fn(() => { ... })().compute(count)`; `renderer.compute(node)` per frame. Replaces `GPUComputationRenderer` and the texture packing. References: rows H and I, Maxime Heckel's [Field Guide to TSL and WebGPU](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/), Codrops [Interactive Text Destruction with Three.js, WebGPU, and TSL](https://tympanus.net/codrops/2025/07/22/interactive-text-destruction-with-three-js-webgpu-and-tsl/) (2025-07-22) and [WebGPU Gommage Effect](https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/) (2026-01-28, step-by-step commits).
- `WebGPURenderer` falls back to a WebGL2 backend when WebGPU is missing. Compute on that backend is emulated and narrower; verify the exact update shader runs there before relying on it.
- Browser support, from the [gpuweb implementation status](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) on 2026-09-29:

| Browser | Shipping |
|---|---|
| Chrome / Edge, Windows x64, macOS, ChromeOS | 113 |
| Chrome Android 12+ (ARM, Qualcomm, Intel) | 121 |
| Chrome Linux | Intel Gen12+ from 144; NVIDIA on Wayland from 147 |
| Chrome Windows ARM64 | Behind flag |
| Firefox Windows | 141 |
| Firefox macOS Apple Silicon | 145 on macOS 26, 147 on all versions |
| Firefox Linux, Android | Nightly / flag, expected 2026 |
| Safari macOS, iOS, iPadOS 26 | 26 |

- For our audience (work laptops, many on Windows Chrome or Edge, some on older macOS where Safari is below 26): WebGPU covers most, not all. The WebGL2 path is needed regardless. Our engine (`direction-r-resend-structure/code/src/three/engine.js`) is a shared `WebGLRenderer`, and 16k to 65k particles is trivial for WebGL2 GPGPU. Verdict: build on `GPUComputationRenderer`. Revisit TSL only if particle count goes past about 250k, and measure the `three/webgpu` chunk against the 200KB budget first.

## 6. Agent skills and MCP servers

### Installed locally

`C:/Users/Ukant/.claude/skills` has no three.js, R3F, GSAP or WebGL skill. The 3D skills come from the `claude-design-skillstack` marketplace; two bundles are installed (`installed_plugins.json`): `core-3d-animation` and `meta-skills`.

| Skill | Installed | Covers | GPGPU / FBO coverage |
|---|---|---|---|
| `core-3d-animation:threejs-webgl` | yes | Scene, camera, renderer, geometry, materials, lights, textures, render targets, performance, pitfalls | Two lines: "Use `GPUComputationRenderer` for particle simulations". Nothing on ping-pong, float textures or particles |
| `core-3d-animation:react-three-fiber` | yes | R3F components, hooks, drei helpers, integration, performance | None |
| `core-3d-animation:gsap-scrolltrigger` | yes | Tweens, timelines, ScrollTrigger pin, scrub, parallax, Three.js integration patterns | No Lenis mention |
| `core-3d-animation:motion-framer`, `babylonjs-engine` | yes | Motion for React; Babylon.js | Not relevant |
| `meta-skills:web3d-integration-patterns` | yes | Architecture for combining three, GSAP, R3F, Motion; state, performance, decision matrix | None |
| `meta-skills:modern-web-design` | yes | General modern web design | None |
| `lightweight-3d-effects`, `locomotive-scroll`, `scroll-reveal-libraries`, `blender-web-pipeline`, `substance-3d-texturing` | in marketplace cache, not installed | Zdog/Vanta/Tilt; Locomotive; AOS; Blender glTF export and bpy; Substance | `blender-web-pipeline` covers glTF export, not VAT or EXR point bakes |

Takeaway: nothing installed teaches the GPGPU core. The installed skills are fine for GSAP and scene hygiene.

### Available online

| Source | Stars / push | License | Covers | Worth installing |
|---|---|---|---|---|
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills), official | 15,762 / 2026-07-29 | MIT | `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-frameworks`, `gsap-performance`, `llms.txt` | Yes, replaces the third-party GSAP skill. Install: `/plugin marketplace add greensock/gsap-skills` in Claude Code, or `bunx skills add https://github.com/greensock/gsap-skills` |
| [CloudAI-X/threejs-skills](https://github.com/cloudai-x/threejs-skills) | 3,408 / 2026-07-09 | No license | `threejs-fundamentals`, `-geometry`, `-materials`, `-shaders`, `-textures`, `-postprocessing`, `-loaders`, `-animation`, `-interaction`, `-lighting` | Maybe. `threejs-shaders` and `threejs-postprocessing` are the relevant ones. No license |
| [dgreenheck/webgpu-claude-skill](https://github.com/dgreenheck/webgpu-claude-skill) | 1,223 / 2026-04-10 | No license | WebGPU and TSL with three.js (Dan Greenheck, [write-up](https://threejsroadmap.com/blog/claude-code-skill-for-threejs-webgpu-and-tsl-development)) | Only if we take the TSL path |
| [Impertio-Studio/Three.js-Claude-Skill-Package](https://github.com/Impertio-Studio/Three.js-Claude-Skill-Package) | 18 / 2026-07-08 | MIT | 24 skills: WebGL, WebGPU, R3F, drei, physics, IFC | Low adoption, skip |
| [majidmanzarpour/threejs-game-skills](https://github.com/majidmanzarpour/threejs-game-skills) | 2,225 / 2026-09-28 | MIT | Three.js browser games | Off target |
| [MengTo/Skills](https://github.com/MengTo/Skills) | 6,376 / 2026-09-28 | MIT | Design and build skills, general | Off target |
| [DmitriyGolub/threejs-devtools-mcp](https://github.com/DmitriyGolub/threejs-devtools-mcp), MCP | 109 / 2026-04-07 | MIT | 59 tools to inspect and edit a live three.js or R3F scene: objects, materials, shaders, textures, perf, memory | Yes for debugging. Lets the agent read the live uniforms and FBO textures instead of guessing |
| [Three.js Resources MCP](https://threejsresources.com/mcp) | n/a | n/a | GLSL (including Shadertoy) to TSL conversion via the official transpiler | Only for a TSL port |

## 7. Top 5 starting points to build from

1. **three.js `GPUComputationRenderer` plus `webgl_gpgpu_birds`** (MIT). The scaffold: pos/vel textures, ping-pong, instanced render. It is in `three` already (0.186.1 in Direction R), costs no new dependency, and is the only top candidate with a license we can copy from. Replace the flocking shader with the spring above.
2. **DGFX/codrops-dreamy-particles and its Codrops article.** Closest physics to Dala: velocity pass, spring to sampled positions, damping, mouse repulsion. Read it for the shader structure and the mouse path. No license, so rewrite rather than copy. Replace the three-mesh-bvh raycast with a ray-plane hit unless particles must react on the mesh surface.
3. **chrismaldona2/tsl-morphing-particles, for its data layout only.** Fixed-count `MeshSurfaceSampler` sampling into one `DataArrayTexture` layer per shape gives any-to-any morphs with one uniform. Feed that layer pair into item 1's target, not its vertex-shader mix. Port from TSL to GLSL.
4. **Per-particle sprite bokeh, with `webgl_postprocessing_dof2` (BokehShader2) as the visual reference.** Cheapest DOF that holds on integrated graphics and needs no depth texture. Keep BokehShader2, or pmndrs `DepthOfFieldEffect` with `NoiseEffect`, as an A/B on a strong GPU only.
5. **Maxime Heckel's particles post, then Three.js Journey's GPGPU and Morphing lessons, as the learning path.** Maxime explains the FBO loop and the morph in free, interactive form; Bruno's paid lessons cover GLB-seeded GPGPU state in depth. Use them to understand items 1 to 3, not as code to ship.

Tooling to add alongside: `greensock/gsap-skills` (official) and `threejs-devtools-mcp`. Skip Lenis unless a new decision supersedes D-013; scrubbed uniforms plus the spring already give the smoothing.

## Sources

Every URL is linked in place above. GitHub metadata was pulled from `api.github.com/repos/<owner>/<repo>` on 2026-09-29.
