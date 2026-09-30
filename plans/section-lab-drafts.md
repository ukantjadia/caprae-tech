# Plan: three Section Lab drafts with Dala particles, fast

Date: 2026-09-30. Status: **answers in, waiting for the go** (decisions D-063 to D-067). Nothing built yet.

Research this plan rests on:
- `research/section-lab/01-inventory.md`: all 30 variants, verbatim text, animations, claims check
- `research/perf/01-lag-diagnosis.md`: why the current builds lag
- `research/dala/05-particle-spec.md`: Dala's particles, measured from its GLB, EXR and PNGs

## 1. What the research found

### Why the current four builds lag
About 95% of each frame is three full-screen passes, not the particles:

| Cost | Where | ms/frame (Intel UHD, 1878x850, DPR 1.25) |
|---|---|---|
| 4x MSAA on the scene target | `post.js:54` | ~14.5 |
| 33-tap depth-of-field pass | `post.js:36` | ~13.7 |
| Canvas `antialias: true` resolve | `main.js:52` | ~6 |
| Particles, dust, simulation | everything else | ~1.5 to 2.5 |

A full frame is 35 to 43 ms (about 25 fps). Cost grows with DPR squared: about 91 ms at DPR 2. The cursor feels slow because the physics advances per frame, not per second, so at 25 fps particles react at 40% speed, and the camera parallax takes about 0.4 s to settle. The gallery also keeps every clicked panel's WebGL running.

### What Dala's particles actually are
| | Dala | Our v4 |
|---|---|---|
| Mesh | tetrahedral frame shell: each face has a triangular window 0.586 of the face, struts 0.12 of the edge | barycentric discard, struts 0.052 of the edge (2.3x thinner) |
| Rendering | DPR 1, no antialias, then bloom, so sub-pixel struts become bright 1px lines that glow | MSAA at up to DPR 2, struts average down to dim lines |
| Size | median edge 4.8px at 1503x680 (7.6px at 1080p), a 3.7x spread (p5 1.8px, p95 8.8px) | about 10px, narrow spread |
| Spacing | neighbour distance / edge = 1.81 median | 0.89 (1.9x too big for the gap) |
| Material | `MeshBasicMaterial`, transparent, depthWrite on, front side, alpha = depth fade over black | opaque, colour darkened by depth |
| Motion | every particle spins at 1 rad/s around (0,1,1), phase set by a noise field | slow field rotation |
| Colour | regions, gold 41%, lilac-grey 25%, teal 10%, purple 10%, rose 9%, slate 6%, no white | violet/amber regions plus speckle |
| Post | bloom (0.4 / radius 1 / threshold 0.159), vignette, grain; DOF is effectively off | heavy DOF gather |
| Dust | 250 same frames between the shape and camera, 7 to 26px, random alpha, spinning | 180, blurred |

Dala's own performance comes from the same choice that gives its look: DPR 1, no antialias, cheap bloom instead of DOF.

### The Section Lab
10 sections x 3 variants. Draft A = every A, draft B = every B, draft C = every C. 56 factual claims checked: 16 verified, 2 verified with caveats, 2 stated, 3 open, 4 contradicted by the proof files, 29 not found. See the inventory for the list.

## 2. Architecture

```
builds/
  dala-lab-a/   draft A  (names to confirm)
  dala-lab-b/   draft B
  dala-lab-c/   draft C
```

Each draft:
- **Page:** the Lab's markup, CSS and JS for its variant letter only, with the lab chrome removed (lab bars, idea notes, dock, Copy picks). The inventory lists the cross-section CSS and JS that has to come along (fadeIn, toast, accordion helpers) and the script's null-check crash risk when a variant is removed.
- **Particle engine:** one shared module, rebuilt to Dala's spec below, used by all three drafts.
- **Canvas:** fixed behind the page (as in the current builds), unless the answer to Q-L2 says otherwise.

### Particle engine, rebuilt to Dala's spec
1. Frame mesh generated in code (20 vertices, 48 triangles, window 0.586), replacing the discard trick.
2. `MeshBasicMaterial`-style shader: transparent, depthWrite on, front side, alpha = `smoothstep(-4.5, 4, z)`.
3. Size from a Dala-like distribution (median edge ~4.8px at 1503x680, spread 3.7x), bigger overall only if Q-P2 says so. Spacing ratio 1.8 with blue-noise sampling, so gaps are even.
4. Spin 1 rad/s per particle, phase from a noise field.
5. Hover in the vertex shader (Dala's radius 1.25 plus mouse speed), not a repulsion force.
6. Physics scaled by frame time, so it never slows on a slow GPU.
7. Post: bloom + vignette + grain. Drop DOF and MSAA.
8. Renderer: DPR 1, `antialias: false`, adaptive resolution if frame time exceeds 16 ms.

Target: under 10 ms per frame on this laptop's Intel UHD at 1920x1080, measured with a GPU sync and a visible-tab rAF trace.

## 3. Build order (after answers)
1. Engine: rebuild the particles and post to spec in one draft, and measure against the 10 ms target.
2. Shapes: bake the agreed shapes (wordmark, logo, bulb/tools, maths set).
3. Pages: port draft A's variants, then B, then C.
4. Verify: screenshots of every section, phone width, fps trace, claims check.
5. Gallery: add to the new gallery and push, only with your go-ahead.

## 4. Decisions (user answers 2026-09-30)

| Topic | Decision |
|---|---|
| Particle style | one style everywhere: Dala's hollow frame pyramid |
| Shapes | hero word, Caprae logo, lightbulb, geometry instrument set |
| Hero | A: CAPRAE across the top (cube replaced), B: C on the right, C: C on the left |
| Shape sections | logo at Why, bulb at What we build, geometry set at Pricing |
| Logo | SVG from the user; placeholder C until then |
| Size | 1.5x Dala, Dala's gap ratio |
| Rendering | DPR 1, no antialias, bloom + vignette + grain, no DOF |
| Colours | Lab palette |
| Fonts | Lab fonts, self-hosted |
| Placement | one canvas fixed behind the whole page |
| Claims | copy as-is, mark the 33 unbacked claims "to confirm" |
| Founder-led | keep the Lab wording |
| Lab notes | stripped |
| Placeholders | kept visible, marked |
| Book form | mock copied exactly |
| Lab gaps | fixed with the same look (reduced motion, keyboard/ARIA, timer, mobile menu) |
| Old builds | speed fixes to v1 to v4; gallery runs one panel at a time |
| Folders | builds/dala-lab-a, -b, -c; add to the gallery and push via ukantjadia after review |
