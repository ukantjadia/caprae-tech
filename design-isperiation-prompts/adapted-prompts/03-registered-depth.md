# E-6 REGISTERED DEPTH — E × E-4 Spine

This file is a build prompt. Hand it to a build agent whole. It extends the
ORIGINATION model and E-4 Spine's governing composition; it is not a reskin.

---

Build **REGISTERED DEPTH**, a Caprae Tech service website in Astro. The page is
organized by one vertical registration axis at exactly 34% of the usable
desktop width. That axis exists simultaneously as a typographic rule, a depth
plane in the Three.js scene, the alignment origin of every product record, and
the scroll progress instrument. It never moves. Everything else crosses,
approaches, or resolves against it.

The visitor is an owner, operator, banker, searcher, investor, or acquirer aged
25–70, usually on a work laptop. The first viewport must prove disciplined
engineering, not merely announce it. The CTA, differentiating claim, and one
piece of verified proof are visible without scrolling.

## Thesis

Origination is not a cloud of leads. It is the act of bringing an irregular
field into register. Most opportunities remain misaligned; a small number cross
the governing line and become inspectable. The 3D scene demonstrates this
without pretending to be Caprae's real funnel.

Memory test: an hour later, the visitor describes “the page with the vertical
line that organized both the information and the 3D field.” If they remember
particles, darkness, or gold instead, the build failed.

## Non-negotiable composition

- Desktop container: `min(1440px, 94vw)`. No centered content column.
- The spine sits at `34%`; use one shared CSS custom property and send the same
  normalized value to the renderer. Duplicating `34%` in CSS and JavaScript is a
  defect.
- Headings hang to the left of the spine and align their right edges to it.
  Explanatory copy begins to its right.
- Product records cross the spine by unequal amounts. No equal cards, mirrored
  columns, or repeated full-width horizontal bands.
- Running prose stays under `40rem` even when the composition spans the screen.
- Below 760px the spine becomes a 20px left registration rail. It does not
  disappear and it does not become a centered mobile layout.
- No kicker or eyebrow above the H1. The headline leads.

## First viewport

The spine enters at the top edge and continues below the fold. On the left,
right-aligned to it:

> Engineers already inside the operating room.

On the right: two sentences explaining that Caprae's in-house team builds for
searchers, bankers, and operators, followed by the primary action. Under that,
one verified proof line: `300,000+ calls across five countries`, with inline
provenance. The 3D field begins behind and below the proof line, never behind the
headline or CTA.

The hero has no idle animation. The initial field is a composed still until the
visitor scrolls or drags inside its explicit interaction area.

## The 3D mechanism

Use Three.js directly in an ES module loaded by an Astro island. Do not use R3F
or drei: this scene has one renderer, one camera, two instanced geometries, and
one ribbon; a React scene graph adds weight without clarifying it.

Move rendering into a module Web Worker with `OffscreenCanvas` when supported.
On unsupported browsers, render the same scene on the main thread at the medium
tier; never show an empty canvas merely because OffscreenCanvas is unavailable.

Scene geometry:

- 18,000 desktop / 8,000 tablet / 3,500 mobile thin rectangular plates, not
  points and not stars.
- Each plate carries independent `theta0`, radius, depth, stage, `dropAt`, and
  seed attributes derived from the existing renderer-independent field model.
- The 34% spine is a real depth plane. Plates begin on five irregular depth
  shelves and progressively rotate edge-on as they approach the plane.
- One verified route is shown as an accent hairline ribbon. “Verified” describes
  the selected synthetic path in the scene, not a business outcome.
- Scroll changes inspection depth and alignment tolerance. It does not speed up
  an autonomous clock. Reverse scrolling must return the exact prior state.
- Pointer movement within the canvas shifts the inspection angle by at most
  four degrees. No free orbit control and no camera tumbling.

The scene is a pure function of immutable attributes and normalized scroll
progress. There is no accumulating simulation state.

## Interaction sequence

1. `0.00–0.18`: wide field, spine already present, the first verified product
   record crosses the line.
2. `0.18–0.46`: depth shelves separate; product records become the dominant
   reading layer while the field moves into the right two-thirds.
3. `0.46–0.72`: diligence holds the largest spatial interval. The scene slows
   because the model allocates 48% of its normalized time to diligence.
4. `0.72–1.00`: one route registers; the contact action reappears as the closing
   document block, not as a floating duplicate button.

No scroll-jacking, wheel interception, smooth scrolling, or section whose
sticky duration exceeds 220vh. Prefer a fixed scene behind normally flowing
content over a long pinned stage.

## Information architecture

1. First viewport: wedge, CTA, one proof, registration mechanism.
2. Built record: SaaSquatch Leads, Cold Call Killers, CLOVER, and Bankers Edge
   only if attribution permission is confirmed.
3. Why founder-trained engineers behave differently.
4. Engagement models: dedicated engineers, fixed-scope project, fractional CTO,
   AI-readiness/automation—without contradicting the parent offer.
5. People and institutions, using only verified roles.
6. Caprae Capital firm-wide proof, explicitly labelled firm-wide.
7. Contact close.

Use the shared content source. Never invent the four unresolved product names.

## Visual system

- Ground: `#0A0A0A`; primary ink: `#F2F0EA`; secondary ink: `#A7A7A2`.
- Caprae gold `#F9D360` appears on less than 2% of the screen: the selected
  route, provenance marks, focus states, and one registration tick. Never as a
  large fill or paragraph text.
- Archivo Expanded for display, Archivo for body, JetBrains Mono for measures.
  Self-host in production.
- Two rule weights only: 1px document rules and a 2px spine.
- No gradients, glow, bloom, glass, rounded cards, box shadows, or decorative
  noise. If depth does not read from geometry, lighting, and occlusion, fix the
  scene rather than adding effects.

## Rendering and performance

- Pin exact compatible versions of Three.js and the build tooling at build time;
  do not copy API assumptions from an older prototype.
- Dynamic-import the renderer after first paint. Server-render all copy, links,
  CTA, and the static plate.
- One instanced draw for field plates, one for registration ticks, one ribbon.
- Clamp DPR by both device class and a 2.2M-pixel ceiling.
- Pause rendering while offscreen or hidden; render on progress/pointer changes,
  not continuously while idle.
- Initial JavaScript under 90KB gzipped. The deferred 3D chunk stays outside the
  initial budget and its measured size is reported.

## Three complete tiers

**Full:** worker-rendered 3D, scroll inspection, bounded pointer parallax.

**Reduced motion:** do not hydrate the 3D island. Render a build-time SVG section
of the registered plates computed from the same model. All content remains in
normal document flow.

**No JS / no WebGL:** identical semantic HTML and SVG. CTA and product links
work. The page cannot rely on the canvas to explain its claim.

Support `?motion=on` in development only so the owner can inspect the full tier
on a reduced-motion machine. Strip or disable the override in production.

## Silent failures

1. A generic starfield or network graph.
2. The spine existing only in CSS and not governing the scene.
3. Centering the mobile layout.
4. Letting particles cross copy or reduce contrast.
5. Labelling synthetic stage distribution as company performance.
6. Animating continuously while the visitor is idle.
7. Using gold as the visual idea rather than registration.
8. Turning product records into equal cards.

## Verification

Measure, do not assert:

1. The CSS spine and projected 3D plane differ by no more than 2px at 390, 768,
   1440, and 1920px.
2. CTA, differentiating claim, and one verified proof are visible in the first
   viewport at those widths.
3. Scroll to five progress values, reverse through them, and compare camera and
   plate transforms. Values must match within floating-point tolerance.
4. Idle for ten seconds: zero frames after settling.
5. Reduced motion fetches no Three.js chunk.
6. No horizontal overflow at 390px; body copy is at least 17px.
7. LCP under 2.0s on throttled 4G, CLS under 0.05, INP under 200ms.
8. Every business number has inline provenance and every parent-company number
   says `Caprae Capital, firm-wide`.

## Voice

Measured, exact, and quietly forceful. The registration system supplies the
drama. Copy does not describe the design and never calls the work innovative.
