# Build plan: dala-caprae

Supersedes `plans/dala-particles.md` for the build location (builds/dala-caprae).

## What is fixed and what can change later

Everything below is data or config. None of it is baked into the architecture.

| Thing | Can it change later? | How |
|---|---|---|
| Which shapes | yes, any time | swap a GLB in `shapes/`, run `bun run bake` |
| How many shapes | yes | we store shapes as texture layers (`DataArrayTexture`) and `u_progress` runs 0..N-1. Dala hard-coded 4 quadrants. We don't |
| Particle count | yes | one number in config (Dala: 200x200 = 40,000) |
| Order of shapes | yes | order of files in `shapes/` |
| Which section shows which shape | yes | a scroll-map array in config |
| Colours per particle | yes | palette in config, or per-shape colour data from the bake |
| Spring, friction, stagger | yes | uniforms in config (Dala: 0.006, 0.892, 0.0005) |

So the shapes don't need to be decided now. We start with placeholder shapes and swap them later.

## Steps

1. **Scaffold.** Vite + three + gsap (vendored if bun still fails, D-040) + lenis.
   → verify: `bun run dev` serves a black page with a canvas.
2. **Bake script.** `scripts/bake.js`: for each GLB in `shapes/`, sample N points with
   `MeshSurfaceSampler`, normalise to 0..1, and write `public/shapes.bin` (half-float,
   one layer per shape) plus per-point colour and scale. Also write a preview PNG.
   → verify: preview PNG shows every shape, like `study/dala/assets/preview-pos-all.png`.
3. **Simulation.** `GPUComputationRenderer`, velocity pass (spring + friction + staggered
   blend between layers) and position pass.
   → verify: debug slider scrubs `u_progress`, and the shapes morph with the wave.
4. **Particles.** InstancedMesh of tiny pyramids reading the position texture. Mouse wobble.
   → verify: screenshot next to Dala at the same angle.
5. **Scroll.** Lenis + ScrollTrigger. Each section eases `u_progress`, `u_show`, `u_explode`.
   → verify: GIF of a full scroll.
6. **Look.** Grain overlay, then depth of field. Try per-particle size and alpha by depth
   first, BokehShader2 second, and keep whichever matches Dala.
   → verify: side-by-side screenshots with Dala.
7. **Page.** Caprae copy (verified claims only), CTA above the fold, Dala's type and spacing system.
   → verify: screenshots at 1440, 1024, 390 wide.
8. **Measure.** fps on Intel UHD, JS size, load time. Report the numbers (D-052).

## Placeholder shapes

We start with free primitives from three.js itself, so nothing is blocked on a decision:
sphere, torus knot, icosahedron, box. Swap in Caprae's shapes when chosen.

## Open

- Final shapes (not blocking).
- Font licence: PP Neue Montreal or a substitute (not blocking the prototype).
