# E-7 STRESS LEDGER — E × F Load Bearing

This file is a build prompt. It combines E's origination model with F's
load-bearing thesis, but rejects F's literal truss and its failed cinematic
rewrite.

---

Build **STRESS LEDGER**, an Astro website for Caprae Tech. It looks and behaves
like a structural engineer's calculation ledger prepared for an investment
committee: asymmetric columns, ruled calculations, one live load diagram, and a
plain-language decision beside every technical result.

The central claim is not that Caprae's software never fails. No reliability data
exists. The claim is that this team can translate operating pressure into a
system that holds. The page demonstrates the reasoning method without inventing
an SLA, uptime figure, client result, or engineering certification.

## Thesis

Every engagement begins as an uneven load case: deadlines, changing scope,
messy data, founder judgment, and limited attention. Caprae Tech turns those
loads into an explicit system of decisions. The website is the ledger in which
those decisions remain inspectable.

Memory test: “the page where the business pressures visibly redistributed
through a precise structural ledger.” It must not be remembered as a bridge,
truss, wireframe, or finance dashboard.

## Governing composition

- A 12-column desktop grid with widths `2/3/5/2`, never four equal columns.
- A fixed left calculation margin carries section numbers and provenance only.
- The main reading column changes width by section; the right result column
  stays narrow and vertically aligned.
- One diagonal datum travels through the document from upper left to lower
  right. It is formed by content edges and the projected load path, not a CSS
  decorative line.
- No centered hero, no card grid, no equal metric blocks, no repeated bands.
- At mobile sizes, the ledger becomes a single reading column with the result
  column inserted immediately after the statement it resolves. Preserve the
  calculation margin as a 16px rail.

## First viewport

Left two-thirds:

> Built for the pressure between decision and delivery.

Beneath it, a short explanation of the founder-trained-engineer wedge and one
primary action. Right third: a live but initially still load diagram showing
four named synthetic load types—scope, time, data, and coordination—distributed
across an irregular spatial frame. A clear label states `Illustrative load
model`, preventing it from reading as measured client data.

One verified proof sits on the fold line: `1,200+ beta signups in three weeks`,
with inline provenance. The visitor sees the CTA before interacting.

## The structural mechanism

Do not rebuild the old planar truss. Use an asymmetric **space frame** whose
topology is derived from the page's four column proportions. The frame has real
depth, triangulated lateral bracing, visible pin and roller constraints, and
four load application points.

Use Three.js directly. Use `three-mesh-bvh` only if raycasting the result nodes
cannot meet the interaction budget without it; do not add it pre-emptively. Use
no physics engine—the deformation is analytic and deterministic.

Model rules:

- 96–140 members rendered in one instanced mesh.
- Nodes deform using a precomputed stiffness solution generated at build time
  from a clearly labelled illustrative frame. Runtime interpolates between the
  unloaded and loaded displacement vectors.
- Four load cases are vectors, not animated counters. Scroll changes their
  combination; reverse scroll restores the exact earlier state.
- Stress is shown by member thickness and dash density, not a rainbow heatmap.
- Caprae gold identifies the governing load path only. Compression and tension
  remain distinguishable in line form so the diagram works without colour.
- The model never breaks or claims a factor of safety. It reaches the final
  illustrative load case and holds.

The diagram is not a structural certification. Keep the words `Illustrative
load model — not project performance data` adjacent to it at every breakpoint.

## Scroll choreography

The page uses normal native scrolling. A sticky diagram may persist for at most
180vh while three ledger entries pass beside it:

1. `INPUT / operating pressure` — identify the four synthetic loads.
2. `TRANSLATION / engineering decision` — show loads redistributing through the
   space frame while the copy explains how ambiguity becomes architecture.
3. `RECORD / shipped proof` — settle the diagram and transition into clickable
   product evidence.

After the sticky interval the diagram becomes a static ledger figure and the
rest of the page flows normally. Do not create a 400–700vh spectacle. No idle
camera orbit, autoplay, smooth scroll, wheel interception, or repeating reveals.

## Product evidence

The record section is more important than the diagram. Use four unequal entries:

- SaaSquatch Leads: link, verified signup figure, stack where verified.
- Cold Call Killers: link, verified call and country figures.
- CLOVER: explain open-source status and link only when the repository URL is
  confirmed.
- Bankers Edge: include only after attribution permission is confirmed.

Every entry shows `constraint → decision → shipped artifact` where those facts
exist. Do not invent a case-study narrative to fill the pattern.

## Visual system

- Paper ground `#F2F0EA`, ink `#101010`, graphite `#65645F`, Caprae gold
  `#F9D360` used as a plate/mark rather than small text.
- IBM Plex Sans Condensed or Archivo Narrow for display, Source Serif 4 for
  explanatory prose, JetBrains Mono for calculations and provenance. Pin and
  self-host the selected families.
- Hairline rules, numbered equations, registration crosses, and small result
  stamps. No fake blueprints, torn paper, grunge, shadows, glass, gradients, or
  rounded dashboard panels.
- Body copy at least 17px. Calculation labels may be 12–13px only when they are
  supplementary and meet contrast requirements.

## Architecture and loading

- Astro renders the full ledger, copy, links, SVG static diagram, and CTA.
- A small React island may coordinate accessibility state and diagram controls;
  it must not receive per-frame updates.
- Three.js is dynamically imported after first paint.
- Use `frameloop`-equivalent invalidation: render only when scroll progress,
  viewport, focus, or pointer selection changes.
- Initial JS under 100KB gzipped. Deferred 3D reported separately.
- No post-processing. Correct geometry, orthographic/perspective choice, light,
  and material orientation must create the depth.

## Three tiers

**Full:** deterministic 3D frame and scroll-controlled load cases.

**Reduced motion:** no Three.js request. Server-render an SVG of the final load
case from the same build-time displacement vectors; show all three ledger entries
in reading order.

**No JS / WebGL unavailable:** same semantic ledger and SVG. Interactive node
inspection becomes an adjacent HTML definition list.

## Silent failures

1. Reusing F's flat zigzag truss.
2. Using a physics engine for a deterministic four-state diagram.
3. Showing red-to-green stress colours or an unexplained rainbow heatmap.
4. Implying the structure represents Caprae uptime or client performance.
5. Letting the cinematic stage overshadow clickable product proof.
6. Rendering continuously while idle.
7. Centering the page or turning calculations into dashboard cards.
8. Hiding the CTA until after the sticky section.

## Verification

1. Independently recompute five node positions for each load case and compare
   them with the rendered transforms.
2. Reverse through the scroll positions; the node matrices and load vectors must
   return exactly.
3. Confirm supports, depth bracing, and alternating triangulation from front,
   side, and oblique test cameras; ship only the authored camera.
4. Idle after settling: zero new frames over ten seconds.
5. Reduced motion and no-JS tiers contain the same proof and working CTA and
   fetch no Three.js bundle.
6. CTA visible at 390, 768, 1280, and 1920px on initial load.
7. No horizontal overflow, body copy at least 17px, keyboard-visible node
   selection, and no hover-only information.
8. LCP under 2.0s on throttled 4G, CLS under 0.05, INP under 200ms, integrated
   graphics stable at the chosen quality tier.
9. Grep for invented reliability language: `uptime`, `availability`, `SLA`,
   `failure rate`, `99.`. Zero business-claim hits.

## Voice

Plain enough for an owner, exact enough for an engineer, and free of theatrical
engineering language. The calculation is visible; the copy explains why the
decision mattered.
