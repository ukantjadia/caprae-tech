# Dala: how the particle effect works

Source: live bundle of https://dala.craftedbygc.com/ (theme.js, vendor.js), read 2026-09-29.
Raw shaders and assets are in `study/dala/` (gitignored, private study only).
Everything here is our own description. We rebuild it, we do not ship their code.

## The whole pipeline

```
pos-33.exr (400x400 float, 4 shapes as quadrants)
        |
        v
[sim-spring pass]  target = blend(shape1..shape4 by u_progress, staggered per particle)
                   vel = (vel + (target - pos) * spring) * friction
        |  ping-pong FBO (velocity)
        v
[sim-position pass] pos += vel
        |  ping-pong FBO (position)
        v
[particles]  InstancedMesh, 40,000 tiny pyramids (py-lod*.glb, ~2KB each)
             vertex shader reads position texture by a_id, adds mouse wobble,
             colour from cd-33.png, scale from sc-33.png
        |
        v
[post] depth pass + BokehShader2 DOF, then grain layer (noise.jpg)
```

## 1. Target shapes: one EXR, four shapes

`pos-33.exr` is 400x400 float RGB. Each 200x200 quadrant stores one shape's XYZ points,
normalised to 0..1:

| Quadrant | UV offset | Shape |
|---|---|---|
| 1 | (0, 0) | brain |
| 2 | (0.5, 0) | lightbulb |
| 3 | (0, 0.5) | sphere |
| 4 | (0.5, 0.5) | abstract blocks |

200 x 200 = 40,000 particles. Particle `i` reads the same pixel in every quadrant, so
particle `i` in the brain becomes particle `i` in the bulb. That one-to-one mapping is the
whole morph. Previews: `study/dala/assets/preview-pos-*.png`.

The shader unpacks each point: `p = (p - 0.5) * 2 * radius`.

`sc-33.png` holds per-point scale and `cd-33.png` holds per-point colour, in the same
layout. The points were probably baked from meshes in Houdini (Mathis Biabiany's
portfolio tags Dala "WebGL / Houdini"). A Blender Geometry Nodes export or a bun script
using `MeshSurfaceSampler` does the same job.

## 2. Scroll → shape

`u_progress` runs 0 → 3 over the page. In the spring pass:

```
target = mix(shape1, shape2, stagger(u_progress,     rand.x))
target = mix(target, shape3, stagger(u_progress - 1, rand.y))
target = mix(target, shape4, stagger(u_progress - 2, rand.z))
stagger(p, r) = clamp(p * (1 + d * (N - 1)) - d * r * N, 0, 1)   // d = 0.0005 desktop, 0.000025 mobile
```

Each particle has a random delay, so particles leave the shape in a wave instead of all
at once. That wave is the "flowing" look.

Scroll does not set `u_progress` directly. JS eases it every frame
(`v += (target - v) * easing`), and `target` comes from `clamp(map(scroll, a, b, 0, 1))`
per section. Other uniforms get the same treatment: `u_show` (intro assemble) and
`u_explode` (scatter, `pos *= rand`).

## 3. Physics

The spring pass writes velocity. The position pass adds it.

```
spring   = 0.006 + rand.w          // every particle springs at a slightly different rate
vel      = (vel + (target - pos) * spring) * 0.892
pos     += vel
```

On the first frame (`u_rendered == 0`) positions are written straight from the target,
with no velocity.

## 4. Drawing

- One `InstancedMesh` of a tiny pyramid. The LOD GLBs are the particle's own geometry,
  not target shapes. Mobile gets `py-monbile.glb`.
- Instance attributes: `a_id` (pixel UV into the sim textures), `a_random`, `a_angle`,
  `a_color`, `a_param`. They are injected with `onBeforeCompile` into a standard material
  (`particles.project_vertex.glsl`).
- The vertex shader rotates each pyramid to face along its motion and wobbles particles
  near the cursor: `pos.xy += dist * sin/cos(time * rand) * (rand * 0.35 + mouseDelta)`.
- There is a second, separate field of floating "front cones" with its own injected
  shader.

## 5. Post-processing

- Linear depth render, then the BokehShader2 DOF pass (RINGS 4, SAMPLES 6,
  `focalDepth` 1.2, `fstop` 0.9, `maxblur` 1). This is the heaviest step.
- A grain/noise layer on top (`grain-layer.frag.glsl`).
- `dof-2k-10.jpg` is a pre-blurred bokeh sprite for background particles.

## 6. Page shell

- Static HTML, Laravel Mix bundles, ASScroll smooth scroll driving GSAP ScrollTrigger.
- An asset preloader shows a "LOADING" screen until the EXR, GLBs and textures arrive.
- DOM sections are ScrollTrigger triggers. Their progress feeds the eased uniforms above.

## 7. Measured live (Intel UHD, 1503x680 canvas, DPR 1.25)

36 to 38 fps. About 1.75MB transferred (JS 245KB, images 1.3MB, fonts 152KB, EXR 275KB,
GLBs 9KB). Load finished at 3.6s. CLS 0.

## Rebuild checklist

1. Bake 4 shapes → one 400x400 float texture (or `DataArrayTexture`, one layer per shape).
2. `GPUComputationRenderer` with two variables: velocity (spring + friction) and position.
3. Per-particle random texture: delay, spring offset, explode scale.
4. InstancedMesh of 40k tiny pyramids reading the position texture in the vertex shader.
5. Scroll → eased `u_progress` 0..3, `u_show`, `u_explode`.
6. Mouse wobble in the vertex shader.
7. DOF: start with per-particle size and alpha by depth. Add BokehShader2 only if the look needs it.
8. Grain overlay.
