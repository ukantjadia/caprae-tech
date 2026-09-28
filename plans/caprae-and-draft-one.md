# Plan: two variants of dala-caprae

Date: 2026-09-29. Status: **built 2026-09-29**, except the brain model (needs download approval).

User decisions: folders get a `dala-` prefix; the wordmark says CAPRAE only; the loader goes in v3 only (not v2).

## Folders (done)

```
builds/
  dala-caprae/   v1, untouched, the current site
  dala-caprae-wordmark/  v2, CAPRAE wordmark hero (no loader)
  dala-draft-one/        v3, Dala's shape set (brain, bulb, sphere, logo) + hollow particles + loader
```

Both copies were made from `dala-caprae` without `node_modules` or `dist`. Each needs
`bun install` once. Dev ports: v1 5195, v2 5196, v3 5197, so all three can run side by side.
All servers are stopped.

Assumption: "capra" = `caprae`, "draft one" = `draft-one`. Renaming is one command.

Everything else is shared. Both variants keep the same engine (`particles.js`, `post.js`,
`main.js`) and change only what's listed below.

---

## v2 `caprae`: CAPRAE wordmark hero + loader

### What the visitor sees

```
0%  ─ black screen, a 000→100 counter bottom-left, particles drifting as a loose cloud
100% ─ counter fades, the cloud flies together into  C A P R A E  across the top of the hero
      headline + "Book a call" sit below it (CTA stays above the fold)
scroll ─ the letters break apart into the cloud ("fed off"), which re-forms as the next
        sections' shapes, same choreography as v1
```

### How

1. **Wordmark shape.** A new bake entry `{ type: 'text', text: 'CAPRAE', font: 'fonts/InterTight-Medium.ttf' }`.
   - The bake reads the font with `opentype.js` (MIT, runs in bun), turns each glyph's outline into `THREE.Shape`s, and builds a flat `ShapeGeometry` for the letter faces plus a thin `ExtrudeGeometry` for the edges.
   - Points: 85% on the front faces, so the letters read crisply, and 15% on the extruded edges for depth.
   - The TTF comes from Inter Tight's OFL release, so it's licensed for this. It lives in `shapes/fonts/`.
   - Shapes become `[CAPRAE, icosahedron, sphere, C mark]`. Any can still be swapped in config.
2. **Hero layout.** The wordmark centres in the top half of the hero (about 60% of the screen width), with the headline and CTA below it. The `RAMPS` table gets a new first row: `BASE` x = 0, y = +1.6. The hero ramp explodes the wordmark over the hero scroll (0 → 1) instead of sliding it sideways. Later rows stay as they are.
   - Screen readers get a real `<h1>` with "Caprae". The particles stay `aria-hidden`.
3. **Loader.**
   - `shapes.bin` is fetched as a stream, so the counter shows real bytes: 0 to 90% is the download, 90 to 100% is the fonts plus first shader compile.
   - Markup: a fixed overlay with a 3-digit counter, like Dala's `js-site-loader-progress-digit`, plus the line "Loading".
   - At 100% the overlay fades out over 0.6s and `uShow` starts, so the cloud gathers into the wordmark over about 2.5s.
   - Reduced motion: no counter animation. The overlay fades and the wordmark appears already formed.
   - No-JS or no WebGL: the overlay is never shown, because it's added by JS.
4. **Verify.** Screenshots at 0%, 50% and 100% of the loader, the wordmark formed, mid-break, and each later phase. Letters must be readable at 1440, 1024 and 390 wide.

### v2 open question

- Is the wordmark the brand name only ("CAPRAE"), or "CAPRAE TECH"? The plan assumes "CAPRAE".

---

## v3 `draft-one`: Dala's shape set + hollow particles

### Shapes: brain → lightbulb → sphere → logo

- **Sphere:** already a primitive.
- **Logo slot:** the Caprae mark (placeholder "C" until the brand kit, Q19).
- **Brain and lightbulb:** we need 3D models. We should **not** ship Dala's `pos-33.exr`, which is their artwork. We'll source free models and bake them ourselves with the existing GLB path in `scripts/bake.js`:
  - brain: the NIH 3D library (3d.nih.gov) has brain meshes that are public domain.
  - lightbulb: a CC0 model from Poly Pizza or Sketchfab's CC0 filter.
  - I'll check each licence before downloading, and I'll ask you before any download (filename, source, size).
- If a mesh is heavy, `bunx @gltf-transform/cli simplify` shrinks it first. The bake only needs the surface.

### Hollow particles: edges only

Today each particle is a solid tetrahedron: 4 filled, lit faces. The plan is to keep the same 4 faces and draw only a thin band along the edges, so you see the whole wire pyramid, front and back edges, with the middle empty. That's the "just the angles or the borders" look.

How:
1. **Barycentric attribute.** Each face vertex gets `(1,0,0)`, `(0,1,0)` or `(0,0,1)` (`aBary`). Across a face, the fragment shader receives the interpolated value. It's near 0 on one component exactly at an edge.
2. **Fragment shader:** `edge = min(aBary.x, aBary.y, aBary.z)`, and the pixel is `discard`ed where `edge` is wider than about 1.2 screen pixels (`fwidth`). The line width stays constant on screen whatever the particle size.
3. **Draw both sides** (`side: DoubleSide`), so back edges show through the empty faces.
4. **Lighting:** edges keep the colour regions but lose the face shading, so brightness comes from colour, plus a small boost so thin lines don't look dim.
5. **Depth and blur keep working.** `discard` still writes depth for the edge pixels, so the depth-of-field pass is unchanged.
6. **Switch in config:** `PARTICLE_STYLE: 'wire'` in v3, `'solid'` in v1 and v2, so v2 can adopt it later with one line.

Cost: same triangle count as now (4 per particle). Thin lines alias a little, so the 4x MSAA target stays on. If the edges still look too thin at 10k particles, the fallback is to raise `SIM.size` about 1.5x.

Why this fixes what you saw: solid pyramids hide each other, so while a shape breaks apart the front ones cover the back ones and it reads as a mass moving forward. Wire pyramids let you see through the whole cloud at once.

### Verify

- Zoomed screenshots of single particles, both solid and wire.
- Mid-explode compared with v1 at the same scroll point.
- Frame time on Intel UHD against v1's 18ms.

---

## Order of work (after approval)

1. v3 hollow particles. Smallest, and you can judge the look quickly.
2. v2 wordmark bake (opentype.js), then the hero layout, then the loader.
3. v3 brain and bulb models. Needs your yes on each download.
4. Screenshot passes on all three, then an update to `DIFFERENCES.md` in each folder.

## What I need from you

1. Approve this plan, or change it.
2. Folder names OK (`caprae`, `draft-one`)?
3. "CAPRAE" or "CAPRAE TECH" for the wordmark?
4. Loader in both v2 and v3 (Dala has one), or v2 only? The plan puts it in v2 only.
