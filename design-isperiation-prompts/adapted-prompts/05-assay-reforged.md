# E-1R ASSAY REFORGED — rebuild, not reskin

This file is a build prompt for replacing E-1 Assay. Preserve the assay premise
and verified content; replace its template-like four-card hero, generic gold on
black treatment, and flat Canvas field.

---

Build **ASSAY REFORGED**, a Caprae Tech landing page in Astro. An assay does not
decorate a material; it subjects a sample to controlled tests and records what
survives. The page treats each shipped product as a sample whose public evidence
can be inspected.

This is not “E-1 with Three.js.” The earlier direction failed structurally:
four equal hero cards, a centered text block, repeated full-width bands, and the
most familiar gold-on-black finance palette. Replace the composition and the
interaction model before improving rendering fidelity.

## Thesis

Claims enter as rough samples. Verifiable artifacts survive the assay and are
stamped into the record. The 3D experience lets the visitor inspect the evidence
plane; it does not turn products into floating cards or imply a quantitative
quality score.

Memory test: “I could move through layers of real product evidence, and each
claim locked into a physical record.” If the memory is “gold particles,” it
failed.

## Composition

- Desktop uses an asymmetric `7/12 + 3/12 + 2/12` grid. The H1 occupies the
  first seven columns; the action and proof occupy the final five at different
  vertical positions.
- A vertical assay index occupies the far-right 2/12 and persists through the
  first three sections. It lists four samples with unequal line lengths.
- Product evidence is one continuous staggered record. No four-up plates, card
  grid, carousel, equal columns, or centered container.
- Each product section contains one dominant artifact region, one short factual
  statement, its verified figure, provenance, and a direct link.
- On mobile the index becomes a horizontal numbered rail below the CTA; samples
  remain sequential and unequal rather than becoming identical cards.

## First viewport

Headline:

> Put the work under pressure.

Supporting copy explains that Caprae's engineers already build tools used by
searchers, bankers, and operators. The primary action appears before 480px from
the top. A single evidence sample—SaaSquatch Leads and its verified signup
figure—cuts into the lower-right edge of the viewport as an inspectable 3D slab.

There is no eyebrow and no four-product summary grid. The remaining sample names
appear only in the assay index.

## Better 3D, with a bounded library strategy

Use current Three.js modules directly. Prefer `WebGPURenderer` when the runtime
supports it and use its WebGL 2 fallback path where the installed Three.js
version officially supports that behavior. Pin the exact Three.js version and
verify the renderer initialization against its official documentation at build
time; if the fallback contract is not available in that version, use an explicit
WebGLRenderer adapter instead of shipping a WebGPU-only page.

Use Three.js Shading Language/node materials only when the pinned version
supports the same material graph on both render backends. Otherwise keep a small
pair of equivalent WGSL/GLSL materials behind one interface. Do not bet the
whole page on an experimental API without the fallback test.

Do not use R3F, drei, a physics engine, GSAP, Lenis, or a general post-processing
framework. They do not solve this scene's problem. React may mount the island but
must not own the frame loop or receive per-frame state.

### Scene

- Four irregular sample slabs occupy different depths along a diagonal assay
  plane. They are not product cards: each is a thin extruded surface with an
  etched index, a data notch, and one material response.
- The slabs are generated geometry; product names and evidence remain semantic
  HTML aligned with their projected anchors. Never bake essential text into the
  canvas.
- A scanning plane passes only while the user scrolls through that sample. It
  reveals internal layers using a clipping plane and physically coherent
  roughness/normal response, not a glow.
- The active sample separates into three layers: artifact, verified evidence,
  and provenance. The separation is controlled by scroll progress and reverses
  exactly.
- Pointer or keyboard selection changes the active sample. Camera motion is a
  constrained dolly of less than 12 degrees; no orbit controls.
- A subtle filmic exposure/tone roll-off is allowed to prevent dense highlights
  clipping. Bloom, chromatic aberration, depth-of-field blur, noise overlays, and
  lens flares remain banned.

The scene must visibly improve on E-1 through depth separation, material
orientation, occlusion, inspection, and exact scroll response—not through more
particles or brighter light.

## Motion model

All scene state is a pure function of `(activeSample, localProgress,
pointerOffset)`. There is no autonomous clock after the entrance settles.

- `0.00–0.20`: sample enters as one slab.
- `0.20–0.55`: scan plane traverses and exposes the internal layers.
- `0.55–0.82`: layers separate and the matching HTML proof locks to its anchor.
- `0.82–1.00`: sample receives a restrained assay stamp and yields to the next.

Use native scroll position. Each sample may hold the scene for at most 120vh.
The document remains scrollable, reversible, and readable without the scene.

## Visual system

- Warm mineral ground `#E9E4D8`, carbon ink `#11110F`, graphite `#68645C`.
- Caprae gold `#F9D360` is a physical assay foil used on a small stamp and focus
  state, never the page ground and never paragraph text.
- One deep oxide `#5A2B22` may distinguish the active cutting plane. This is a
  functional second hue, not decoration.
- Newsreader for display continuity with the parent brand, Archivo for body,
  JetBrains Mono for indices/provenance. Self-host in production.
- Surface texture comes from shader-scale roughness and authored geometry, not a
  CSS grain image. No gradients on interface surfaces, shadows around cards,
  rounded containers, glass, or finance-dashboard chrome.

## Content order

1. First viewport and first sample.
2. Four-sample assay record using only confirmed products.
3. Founder-trained-engineer wedge.
4. Engagement models.
5. Verified people/institutions.
6. Firm-wide figures, clearly scoped.
7. Contact close.

Bankers Edge ships only with attribution permission. CLOVER links only after the
repository URL is confirmed. The four speech-derived product names never appear.

## Progressive enhancement

Server-render a purpose-built SVG/isometric drawing of the four assay slabs from
the same geometry parameters used by the live scene.

**Full:** deferred Three.js, backend selected after capability detection,
scroll-driven inspection, pointer and keyboard sample selection.

**Reduced motion:** no Three.js request. Show the SVG with all four samples in a
composed exploded state; no animated scan plane.

**No JS / WebGL unavailable:** same SVG, semantic sample list, provenance, links,
and CTA. Capability failure swaps cleanly before any loading veil appears.

The canvas is never the only place where a product name, figure, or provenance
can be read.

## Performance contract

- Hero HTML and SVG paint before renderer initialization.
- Initial JS under 100KB gzipped; Three.js is a deferred chunk and its real size
  is reported.
- Render only on scroll, resize, focus, and pointer changes. Zero idle frames
  after settling.
- One geometry/material family reused across slabs. Keep total draw calls under
  12 and triangles under 120k at the high tier.
- DPR capped by device type and a 2.2M-pixel ceiling. Add medium/low geometry
  tiers selected from measured frame time, not user-agent strings.
- No blocking font or third-party runtime request in production.

## Silent failures

1. Keeping E-1's four equal assay cards and merely adding a canvas behind them.
2. A starfield, particle cloud, network, floating glass slabs, or gold-on-black
   finance treatment.
3. Essential labels rendered only in WebGL.
4. WebGPU without a tested fallback.
5. Adding bloom or depth-of-field to signal “better 3D.”
6. An idle animation that moves while the visitor reads.
7. A scan percentage, quality score, or pass/fail number that looks like company
   performance.
8. Per-frame React state or layout reads.
9. Hover-only inspection.

## Verification

1. Run the full tier under both available renderer backends and capture the same
   four authored progress states. Geometry, anchors, and material intent must
   match; minor antialiasing differences are acceptable.
2. Force WebGPU initialization failure. The fallback must appear without losing
   content, trapping focus, or leaving a loading overlay.
3. Compare projected anchors to their semantic HTML labels at 390, 768, 1440,
   and 1920px; maximum drift 4px after settling.
4. Reverse every sample through all four progress bands. Layer transforms and
   stamp state must return exactly.
5. Idle for ten seconds after settling: zero rendered frames.
6. Reduced motion and no-JS fetch no Three.js chunk and retain all proof, links,
   and the CTA.
7. CTA appears above the fold at all tested widths; no horizontal overflow;
   body copy is at least 17px; all controls work by keyboard.
8. LCP under 2.0s on throttled 4G, CLS under 0.05, INP under 200ms, and stable
   frame pacing on integrated graphics.
9. Every business figure has inline provenance; firm figures are labelled
   `Caprae Capital, firm-wide`; no unresolved product names appear.

## Voice

An assay report, not an agency manifesto. Short statements, named evidence,
plain conclusions. The materials and inspection behavior carry the expression.
