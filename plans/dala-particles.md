# Plan: Dala-level particle hero for Caprae

Research: `research/dala/01-code-teardown.md` (how it works), `02` (studio, references),
`03` (code to learn from, skills), `04` (stack options). Decision: D-052.

## Stack

Vite + vanilla three.js 0.186 (already in Direction R) + `GPUComputationRenderer`
(ships with three) + GSAP ScrollTrigger (vendored, D-040) + Lenis.
Dala's own packages (Laravel Mix, ASScroll) are dead. We use the same techniques on
maintained tools. Laravel adds nothing here: Dala only used its build tool.

## Steps

1. **Shapes.** Pick 4 Caprae shapes (open question below). Model or source GLBs, then
   a bun script samples 40,000 points per shape with `MeshSurfaceSampler` and writes one
   400x400 float texture (4 quadrants), plus per-point colour and scale.
   → verify: preview PNG of each quadrant, like `study/dala/assets/preview-pos-all.png`.
2. **Simulation.** `GPUComputationRenderer`, velocity and position variables, spring
   0.006 + random, friction 0.892, staggered 4-shape blend on `u_progress` 0..3.
   → verify: debug page where a slider scrubs `u_progress` and the shapes morph.
3. **Particles.** InstancedMesh of 40k tiny pyramids reading the position texture.
   Mouse wobble.
   → verify: screenshot matches the Dala look at the same angle.
4. **Scroll.** Lenis + ScrollTrigger. Each section eases `u_progress`, `u_show`, `u_explode`.
   → verify: GIF of a full scroll.
5. **Look.** Grain overlay, then DOF. Try per-particle size and alpha by depth first,
   BokehShader2 second, and keep whichever matches Dala.
   → verify: side-by-side screenshots with Dala.
6. **Measure.** fps on this laptop's Intel UHD, JS size, load time. Report the numbers,
   do not cut the effect over them (D-052).

## Open questions for the user

- The 4 shapes. Dala morphs brain → lightbulb → sphere → blocks. What should Caprae's be?
- Build it as a new direction folder, or put it in Direction R's hero?
- Install the official GSAP skills and `threejs-devtools-mcp`?
