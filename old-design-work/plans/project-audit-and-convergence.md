# Plan — Caprae Tech project audit and design convergence

Date: 2026-09-17
Status: proposed; no implementation authorised yet

## What this project is actually doing

Caprae Tech is a credibility-led service website that turns Caprae Capital's
in-house engineering team into an external offering. It is not primarily a
portfolio, a generic agency landing page, or a technology showcase. Its job is
to make an owner, operator, searcher, banker, investor, or acquisition
professional believe two things quickly:

1. this team can ship serious software; and
2. this team understands founder and deal context without needing a translator.

The differentiated claim is structural, not stylistic: these engineers already
work inside a private-equity and operator environment. The website itself is
also a work sample, so its motion, performance, accessibility, copy accuracy,
and degradation behaviour are part of the sales argument.

The immediate objective is credibility, not conversion optimisation. It should
be useful as a link from LinkedIn, a prospect follow-up, or a visual aid during a
call. One clear above-the-fold action is still required, but no conversion
target currently justifies funnel experimentation.

## What has already been tried

The work has explored four broad methodologies, not merely different colour
schemes.

### 1. Institutional and editorial calibration

- **Option 1 — Institutional:** warm paper, restrained typography, moss accent,
  conventional credibility.
- **Option 4 — Editorial Hybrid:** editorial type and a contained dark technical
  moment, with burnt amber as the accent.

Method: establish a safe Pole-B baseline for an older, authority-bearing finance
audience. These were archived as calibration points, not failures to erase.

### 2. Impeccable protocol: semantic page-worlds

- **A — Specimen Sheet:** products treated as measured specimens with inline
  provenance. Rejected because stillness was the thesis and the result lacked a
  reason to keep exploring.
- **B — Tearsheet:** the site adopts a document the buyer already knows how to
  scan. Strongest for legibility and audience recognition, weakest for memory.
- **C — Event Display:** origination shown as a particle-detector event. Strong
  mechanism and product clarity, but a risky dark, technical world for the ICP.
- **D — The Core:** scroll becomes depth through an evidentiary core sample.
  This established the important principle that scroll must operate the
  mechanism rather than trigger decorative reveals.

Method: generate grounded metaphors, compare them on audience identification
and product clarity, use a seeded anti-rut selection, then re-roll rather than
patch a rejected thesis.

### 3. Reference-prompt adaptation and technical prototyping

- **E v1 — Origination:** the Orrery reference was structurally adapted to deal
  flow, first in raw WebGL2. It proved the field model, stage distribution, and
  progressive-enhancement discipline at very low weight.
- **F — Load Bearing:** the Ascent reference became an engineering truss with
  scroll-driven loading, built in Astro, React, React Three Fiber, and drei. It
  proved the static/reduced-motion architecture and lazy-loading budget, but its
  visual 3D execution remained weak and a later rewrite failed before being
  reverted.
- **E v2:** Origination moved to Astro, four routes, a persistent Three.js scene,
  velocity streaks, depth of field, picking, and a shared renderer-independent
  model. It became technically richer but visually understated, and the content
  routes initially suffered from field legibility problems.

Method: transfer the source prompt's conceptual structure and negative
constraints, not its subject matter or surface styling; measure the model and
payload instead of judging only by screenshots.

### 4. Brand-grounded variant exploration

- **E-1 Assay, E-2 Impression, E-3 Tape:** used Caprae's sampled palette and
  Canvas 2D workers/native CSS motion. All three were rejected because their
  equal columns, repeated horizontal bands, and centred structures still read
  as templates. Brand accuracy alone did not create distinctiveness.
- **E-4 Spine:** one fixed vertical rule at 34% governs the entire asymmetric
  composition and the 3D field.
- **E-5 Overprint:** an unequal 8/5/13/3/8 column system and two physical ink
  plates create controlled irregularity and real interference.

Method: respond to rejection by changing the compositional system, not by
reskinning. The resulting standing rule is that asymmetry needs one governing
constant and one controlled variable.

## What the exploration has taught us

The durable design principles are now clearer than the winning mockup:

- Proof must be clickable, attributed, and more prominent than service claims.
- Motion must explain origination, diligence, loading, or another real mechanism.
- Scroll may drive a reversible model; it must never hijack the wheel or trap the
  visitor.
- The CTA, positioning, and core proof must survive in the first viewport.
- Full motion, reduced motion, no-JS, narrow screens, and integrated graphics are
  product tiers, not cleanup tasks.
- The page should be wide and compositionally active while prose retains a
  readable measure.
- Centred heroes, equal columns, repeated card grids, generic gold-on-black
  finance styling, decorative starfields, gradients, bloom, and smooth-scroll
  libraries are rejected patterns.
- The parent brand is an input, not a creative answer. Its gold should be scarce
  and functional.
- More 3D complexity does not automatically make the site a stronger engineering
  proof. A simple, legible, meaningful mechanism is better than a sophisticated
  scene that fails visually.

## Recommendation before building anything else

Stop generating new directions. Use **E-4 Spine as the lead candidate** and
**E-5 Overprint as the only challenger**. They are the first directions that
directly answer the owner's repeated structural objection: template-like
centering and equal bands.

Use B, D, E v1/v2, and F as a parts library rather than as additional finalists:

- take B's information density and scanability;
- take D's reversible scroll-as-instrument model;
- take E's defensible origination data model and worker-based rendering;
- take F's load-bearing language only where it helps explain engineering;
- retain Option 1 as the conservative credibility control.

Do not combine their visual worlds. The production direction needs one governing
metaphor and one compositional law.

## Execution plan

### Phase 1 — Freeze facts and the conversion contract

1. Resolve the remaining shipping blockers: final CTA destination, permitted
   Bankers Edge attribution, CLOVER repository URL, correct names/URLs for the
   four speech-derived products, exact service boundary with the parent site's
   AI-readiness offer, and externally confirmed use of the name “Caprae Tech.”
2. Produce one content inventory containing only verified claims and clearly
   labelled firm-wide figures.
3. Define the first-viewport contract at desktop and mobile: identity,
   differentiated claim, one proof item, and one primary action.

Verify: every shipping sentence maps to a source; no placeholder product name
or undecided CTA remains in the candidate builds.

### Phase 2 — Run a controlled E-4 versus E-5 comparison

1. Normalize both candidates to identical copy, proof, route structure, and CTA.
2. Keep their compositional systems genuinely different; do not hybridize them.
3. Capture the same five states for each: desktop first viewport, desktop proof
   section, mobile first viewport, reduced motion, and no-WebGL fallback.
4. Score them against a fixed rubric:
   - audience trust and legibility — 25%
   - differentiated memorability — 20%
   - proof clarity and clickability — 20%
   - meaningful motion/3D — 15%
   - accessibility and degradation — 10%
   - measured performance — 10%
5. Ask a small number of target-like reviewers to answer concrete recall and
   trust questions rather than “which looks nicer?”

Verify: one candidate wins the weighted rubric and qualitative review. If the
result is tied, choose E-4 because its governing rule is simpler to maintain and
its information hierarchy is less dependent on the decorative premise.

### Phase 3 — Turn the winner into a production system

1. Write a compact `DESIGN.md` from the winning artifact: grid, typography,
   colour roles, spacing, motion, breakpoints, focus states, and degradation.
2. Consolidate the winner into the agreed Astro structure with React only where
   an island is necessary.
3. Keep one rendering architecture. Prefer the worker-based Three.js approach if
   its browser support and fallback pass; otherwise use the already successful
   Canvas 2D worker rather than adding another library.
4. Remove review-only routes and motion overrides from production output while
   retaining a development-only way to exercise all tiers.
5. Preserve archived directions as research evidence; do not keep them in the
   production dependency graph.

Verify: one source of truth for content and tokens, no duplicated live direction
code, all routes build with `bun`, and the three experience tiers remain useful.

### Phase 4 — Finish the sales experience

1. Tighten copy around the founder-trained-engineer wedge and remove language
   that merely describes technical capability.
2. Make live products the primary evidence and services the secondary
   explanation.
3. Add the chosen contact mechanism with the shortest credible path to a call.
4. Confirm the relationship between the main Caprae Capital site and this
   sub-brand so scope and pricing cannot conflict.

Verify: a first-time visitor can state what Caprae Tech sells, why it is
different, what it has built, and what to do next after a short scan.

### Phase 5 — Browser, accessibility, and performance gate

1. Test at 375/400px, a common laptop viewport, 1440px, and 1920px.
2. Test keyboard navigation, visible focus, contrast, reduced motion, no JS,
   WebGL failure, and slow loading.
3. Measure on throttled 4G and integrated graphics: LCP under 2.0s, CLS under
   0.05, INP under 200ms, initial JS under 200KB gzipped, and stable interactive
   frame rate.
4. Verify every external link and every public claim immediately before launch.

Verify: the page meets the recorded budgets in a driven browser. If the 3D
misses the budget, simplify or remove the 3D rather than relaxing the budget.

## Explicit non-goals

- No new visual direction until E-4 and E-5 have been compared under identical
  content and conditions.
- No additional animation library merely for reveals.
- No pricing invention, conversion target invention, testimonial invention, or
  unverified product naming.
- No production cleanup of archived experiments.
- No attempt to merge every successful experiment into one page.

## Decision required from the owner

Approve this convergence approach, then supply or explicitly defer the Phase 1
facts. Implementation should begin with the controlled E-4/E-5 comparison, not
with another concept.
