# Decisions

Append only. Newest at the bottom. A reversed decision gets a new entry that
supersedes the old one, it does not get deleted.

Format defined in `.claude/CLAUDE.md`.

---

## D-001. Project documentation lives in `project-info/`

Date: 2026-09-14
Decision: All research, objective, audience and proof material goes in
`project-info/`, split across numbered files, with design material in
`project-info/design/`.
Alternatives: A single README. A `docs/` folder.
Why: The content has distinct audiences. Copy work needs the audience and proof
files. Design work needs the design folder. One file would be read by nobody.
Reversible: yes

---

## D-002. Every claim carries a verification tag

Date: 2026-09-14
Decision: Facts are tagged [VERIFIED], [STATED], or [OPEN]. Only [VERIFIED]
reaches the website.
Alternatives: Write everything as fact and check later.
Why: The buyer is a banker or an acquirer. They check things. One wrong title or
inflated number on a trust-selling page costs more than it saves. Research on
2026-09-14 already caught three founder titles that were wrong.
Reversible: no, this is a standing rule

---

## D-003. The wedge is founder-trained developers, not the tech stack

Date: 2026-09-14
Decision: The site leads with the fact that these developers already work with
real founders daily. It does not lead with technologies, rates, or a service
menu.
Alternatives: Lead with the stack. Lead with price. Lead with the AI angle.
Why: Every dev shop claims business understanding. Caprae can prove it, because
the engineers report into a PE firm that closes deals with operators and sit in
recurring meetings with them. That is not copyable by a competitor.
Reversible: expensive, it determines the entire page structure

---

## D-004. Portfolio logos are split into two labelled strips

Date: 2026-09-14
Decision: Two strips. "Built by our team" carries SaaSquatch Leads, Cold Call
Killers, CLOVER and Bankers Edge. "Caprae Capital portfolio" carries the holding
company names including RetailMeNot, Caviar, LTSE and the rest.
Alternatives: One combined strip, which is what "use any logos" implied. Omit
the holding company names entirely.
Why: The owner approved using any logos, and they will be used. But RetailMeNot
and Caviar are recognisable companies with their own engineering history. Under
a "what we built" heading they are a claim that fails on the first sales call.
Split strips keep every logo on the page and keep every claim defensible.
Reversible: yes

---

## D-005. Stack

Date: not yet
Status: **open**
Blocked on: Q18

---

## D-006. Style reference

Date: not yet
Status: **open**
Candidates: `minimalist-ui`, `industrial-brutalist-ui`, or neither
Blocked on: Q15

---

## D-007. 3D tooling

Date: not yet
Status: **open**
Candidates: React Three Fiber, Spline, raw GLSL, CSS 3D only
Leaning: React Three Fiber, because hand-written Three.js is itself part of the
pitch on a site selling engineers
Blocked on: Q24

---

## D-008. How motion and the anti-scroll rules are reconciled

Date: not yet
Status: **open**
Proposal in `project-info/design/01-direction.md`: motion is proof not
packaging, CTA stays above the fold, one or two spectacle moments at the work
section, no scroll-jacking.
Blocked on: Q23. This blocks all design work.

---

## D-009. The five are described by institution and firm, not as "five founders"

Date: 2026-09-14
Decision: Copy names Kevin Hong as founder of Caprae and describes the other four
by their actual role and their own firm. Institutions get named: Chicago Booth,
Kellogg, Wharton, Google.
Alternatives: Call all five founders, as originally briefed. Use the Caprae site
titles verbatim. Drop the list.
Why: Research confirmed only Kevin Hong founded Caprae. Zackary Beckham's own
LinkedIn headline says "Partner for Strategic Investments," not founder. Three
carry Founder titles for their own companies. The ICP checks LinkedIn. The
accurate version is also the stronger one, because four named institutions
outrank the word founder for a Pole B buyer.
Reversible: yes, but the inaccurate version should not ship

---

## D-010. Build Option 1 and Option 4 first

Date: 2026-09-14
Decision: Two builds this round. **Option 1 Institutional** and
**Option 4 Editorial Hybrid**. Options 2 and 3 deferred.
Alternatives: All four at once. Options 1 and 3 for maximum contrast.
Why: Owner confirmed the buyer is Pole B, institutional. Options 1 and 4 are the
two Pole B positions and they differ on exactly the open question: whether any 3D
belongs on the page at all. Option 1 answers no, Option 4 answers yes but
contained. Option 3 is a Pole A build for a Pole B buyer, which the owner has now
ruled out as a primary direction.
Reversible: yes, 2 and 3 can still be built

---

## D-011. Unknown product names ship as flagged placeholders

Date: 2026-09-14
Decision: The four unconfirmed products get placeholder names in
`_shared/content.json`, each carrying `"placeholder": true`. The build renders
placeholders with a visible marker so they cannot ship by accident.
Alternatives: Invent names and use them silently. Omit the four products.
Why: The owner asked me to pick names. These are real products with real names I
do not have. A silently invented name on a live page is a factual error about the
company's own product line, and it is the kind that gets noticed by the person
who built it. Flagged placeholders let the layout be designed at full content
weight and make the replacement step impossible to forget.
Reversible: yes, one edit to content.json each

---

## D-012. The hero 3D concept is a deal-flow field

Date: 2026-09-14
Decision: The hero 3D element is a slowly rotating point field where particles
represent companies. Most drift unsorted. A thin connecting path resolves through
a subset, forming and reforming, representing origination and the deal path from
search to close. Monochrome with a single accent on the resolved path.
Alternatives: Abstract blob or mesh gradient. Network graph. Rotating globe with
arcs. Literal 3D product screenshots.
Why: It has to mean something to a searcher or acquirer on first look, not just
look expensive. Deal flow is the one visual metaphor every person in this ICP
lives in daily. It also directly depicts CLOVER, which is origination routing, so
the hero and the work section argue the same thing. Abstract blobs and mesh
gradients are the default AI-site look and would undercut the entire pitch.
Rejected the globe because it says "global," which is not the claim.
Reversible: yes, it is one island component

---

## D-013. No smooth-scroll library

Date: 2026-09-14
Decision: No Lenis, no Locomotive Scroll. Native scrolling in both options.
Alternatives: Lenis for the "premium" feel. Locomotive, which is available in
the installed skill set.
Why: Smooth scroll overrides the OS scroll the user already knows. On trackpads
and for older users it reads as lag, not polish. The ICP is 25 to 70 on work
laptops. The cost is a feel some designers like; the risk is the page feeling
broken to the person writing the cheque.
Reversible: yes, one dependency

---

## D-014. Typography and palette per option

Date: 2026-09-14
Decision:
Option 1: Newsreader display, Public Sans body, JetBrains Mono labels. Warm
paper `#FBFAF7`, ink `#141414`, deep moss accent `#2D4A3E`.
Option 4: Instrument Serif display, Geist Sans body, Geist Mono labels. Cooler
paper `#F6F5F2`, ink `#101010`, near-black panel `#0B0C0E`, burnt amber accent
`#B4541F`.
Alternatives: Inter, Poppins, Montserrat. Navy or violet accent. Dark mode.
Why: Light mode with deep typographic contrast is the 2026 consensus for
institutional finance buyers, which is Pole B. Navy is the category default and
violet is the AI-site default; both would make the page look generated. Moss and
amber carry the same seriousness without the cliché. Inter now reads as a
framework default rather than a choice. Every face is OFL and self-hosted, so
there is no third-party font request on a site selling engineering competence.
The two palettes are deliberately distinguishable at thumbnail size so the
gallery comparison is meaningful.
Reversible: yes

---

## D-015. No gradients, no shadows, no bloom

Date: 2026-09-14
Decision: Neither option uses a gradient, a box-shadow on a light surface, or
post-processing in the 3D. Depth comes from hairline rules, a sunk paper tone,
and one dark panel.
Alternatives: The usual card shadows and hero gradient.
Why: Gradient hero plus shadowed cards plus glowing particles is the exact
signature of a generated page. On a site whose entire claim is engineering
competence, looking generated refutes the claim. Bloom is also where the frame
budget dies on integrated graphics.
Reversible: yes, but it should not be

---

## D-016. Comparison builds are static HTML and CSS, not Astro

Date: 2026-09-14
Decision: Both option builds under `designs/*/code/` are hand-written HTML, CSS
and one ES module. No bundler, no node_modules, no install step. Three.js loads
from jsDelivr as an ES module. The Astro plus Tailwind stack in both
`architecture.md` files stands for the production build of whichever option wins.
Alternatives: Two full Astro projects, as originally specified.
Why: A build step buys nothing for a side-by-side comparison and costs two
installs and two dev servers. Static files serve instantly from one
`python -m http.server`, which is what the gallery needs. Option 1 has zero JS
anyway, so Astro would emit exactly this. Flagging rather than silently
substituting: the specs were not wrong, they were written for production.
Reversible: yes, the winner gets rebuilt in Astro

---

## D-017. The 3D field uses --panel-ink, not --ink-muted

Date: 2026-09-14
Decision: Resting points in the deal-flow field render in `--panel-ink`
`#E8E6E1` at 10 to 42% alpha. Selected points use `--accent` `#B4541F`. The
path line stays `--accent-dim` `#7A3814`.
Alternatives: `--ink-muted` `#56544F`, as `color-scheme.md` originally specified.
Why: Verified in a browser. `--ink-muted` is a light-page token; on `--panel` it
sits at roughly 1.4:1 and the field was invisible. Only the path line rendered.
Depth is still carried entirely by per-point alpha, so the field reads grey
rather than white, which was the point of the original choice.
Also fixed in the same pass: point size was resolving to about 2px because the
perspective divisor was an order out, and the poster-hide was a detached
double-rAF that never fires if the tab is hidden when init runs. It now hides
after the first actual render inside the loop.
Reversible: yes, but the original values do not render

---

## D-018. Options 1 and 4 archived, not deleted

Date: 2026-09-14
Decision: Both earlier builds moved to `designs/_archive/`. The gallery hides
them behind a "Show archived" toggle and still runs them.
Why: They are the only calibration available for whatever comes next. Deleting
them would make the new directions unjudgeable.
Reversible: yes

---

## D-019. Three new directions chosen under the impeccable protocol

Date: 2026-09-14
Decision: Direction A "Specimen Sheet" (assigned, index 7), Direction B
"Tearsheet" (Impeccable's pick, offered not led), Direction C "Event Display"
(fused challenger, competitive). Recorded in `designs/DIRECTIONS.md`.
Alternatives: Six catalog challengers, weighed and verdicted. My own seven
grounded directions.
Why: The seed script assigned index 7 of my own ranked list, which is the
anti-rut mechanism: my top-ranked direction is what every run would ship. No
challenger beat the assignment on both axes, so three declined challengers
donated discipline instead of clothes: idea-before-caption from Fletcher,
inline provenance from Jacquard, hairline-only colour from the cloud edge.
Reversible: yes, re-roll eliminates all three

---

## D-020. Stack confirmed as Astro with React islands

Date: 2026-09-14
Decision: Astro, React only inside islands that need it, bun, Tailwind-free
token CSS. Confirmed by the owner via the init interview.
Why: Owner's choice, asked because the skill requires the stack to be a user
decision on a greenfield build. Zero JS by default suits three mostly-static
marketing pages with at most one heavy interactive island each.
Reversible: expensive once three builds exist

---

## D-021. Direction A rejected and re-rolled; Direction D built

Date: 2026-09-14
Decision: Direction A, the specimen sheet, is archived as rejected. Re-rolled
under the impeccable protocol: seed fb60c0c1, re-roll 1, assigned index 4,
giving Direction D, "The Core". Directions B and C survive the re-roll because
the owner pinned them.
Alternatives: Amend A with motion bolted on.
Why: The owner's objection was that A was too quiet and had nothing to hold a
visitor. Adding motion to a direction whose whole thesis is stillness would be
splitting the difference, which the skill explicitly refuses. The re-roll also
eliminates every earlier candidate, so the new grounded list had to come from
unexplored angles; every one of them treats scroll as a mechanism.
Reversible: yes, A is archived and still runs

---

## D-022. Scroll is the mechanism, not a reveal trigger

Date: 2026-09-14
Decision: In Direction D, scroll position drives descent through the core.
Depth is time. The readout, the strata state and the 3D column are all pure
functions of one scroll-derived progress value.
Alternatives: Entry reveals, as in Direction A and both archived options.
Why: The owner's pin is "3D means scrollable effects", not decorative 3D. A
pure function of scroll gives reverse for free, never re-fires, and keeps the
scrollbar honest. No wheel hijacking and no pin that traps the page: the canvas
is sticky inside a tall section.
Reversible: expensive, it is the direction's thesis

---

## D-023. GSAP dropped; the scrub is written directly

Date: 2026-09-14
Decision: No GSAP or ScrollTrigger dependency. The scrub is about fifteen lines
in `core.js`.
Alternatives: Fight the install.
Why: bun writes a corrupt `package.json` for gsap on this machine, 2550 bytes
of unparseable content, reproducible across a forced clean install with an
emptied lockfile. `three` installs correctly, so it is specific to that package.
The skill's semantics are what matter and they are preserved: progress is a pure
function of scroll, damped toward target, reverse-safe. Dropping the dependency
is also the smaller diff.
Reversible: yes, if the install is ever fixed

---

## D-024. Directions B and C built; C has one open defect

Date: 2026-09-14
Decision: Ship B and C into the gallery alongside D. C's layer readout is
recorded as a known defect rather than hidden.
Why: B and D are verified. C builds, lays out correctly at 400 and 1440, has no
horizontal overflow, and its track list carries every fact as plain HTML. Its
scroll-driven layer readout does not update, and after several attempts the root
cause is not found. On the standalone page `scrollY` changes while no scroll
event dispatches to window, and replacing the scroll listener with a
requestAnimationFrame poll did not fix it either. Calling C finished would be
false; hiding it would waste the direction.
Reversible: yes, the defect is in one file

---

## D-025. Scroll position is polled, never event-driven. D-024 closed.

Date: 2026-09-14
Decision: Both D and C derive scroll progress from a `requestAnimationFrame`
loop that reads `getBoundingClientRect()` each frame, gated only on document
visibility. No scroll listeners, no IntersectionObserver gate on the readout.
Supersedes the approach in D-022's implementation and closes the defect in
D-024.
Alternatives: Scroll events. An IntersectionObserver-gated poll.
Why: Root cause of the frozen readout in C, found on the third attempt. The
stage starts below the fold, so the IntersectionObserver fired
`isIntersecting: false` on load and stopped the loop before it ever read a
non-zero position, then did not reliably restart. The earlier rAF attempt kept
that gate, which is why it failed identically and misled the diagnosis.
Scroll events are also unreliable on this machine: `scrollY` changes while no
scroll event dispatches to window, verified with a listener added live.
Polling is immune to both. Cost is one `getBoundingClientRect` per frame while
the tab is visible; the expensive WebGL render loop keeps its own
IntersectionObserver gate, which is correct there because it only needs to run
when its canvas is on screen.
Verified: C reads 0.00 / 1.56 / 3.12 / 5.20 and back to 1.82 across the layers;
D reads 0 / 15.0 / 30.0 / 45.0 / 60.0m and back to 18.0m.
Reversible: yes

---

## D-026. Reference prompts are adapted, not reskinned

Date: 2026-09-14
Decision: `design-isperiation-prompts/adapted-prompts/` holds Caprae versions of
the three reference prompts. Originals are never edited. First adaptation is
`01-orrery-to-caprae.md`, from `orrery.md`.

Four sub-decisions inside it:

1. **Orrery adapted first.** Its thesis, that the mechanism is the proof and the
   audience will check, is already this project's thesis. It is also the only one
   of the three needing no asset. `ascent.md` needs a video and `ascend.md` needs
   a commissioned halftone illustration; neither exists and Q19 is still open.
2. **Dark ground kept**, `#07080A`. Owner's call, taken against the research
   finding that light signals institutional credibility to a Pole B buyer. Same
   flagged risk Direction C already carries, now carried knowingly.
3. **Subject is deal flow**, per D-012, not a new metaphor. Kepler orbits map onto
   a size-dependent deal cycle almost directly, and it depicts CLOVER, so the
   field and the record argue the same thing.
4. **Output is one self-contained HTML file**, per the D-016 precedent, so it
   drops into the existing gallery beside B, C and D without an install step.

Alternatives: reskin orrery by swapping nouns and colours. Adapt all three at
once. Write a stack-agnostic spec with no output format named.

Why: the transferable part of those files is their structure, not their subject.
Every one of them names a mechanism in its first sentence, then spends most of
its length on negative constraints that pre-empt the default output. Swapping
astronomy for finance and keeping the Kepler maths would produce a page whose
motion means nothing, which is exactly the failure D-012 rejected abstract blobs
for.

Two things were inverted rather than copied. Orrery computes its ephemeris live
because sidereal time is true for every visitor. Caprae cannot animate a figure
about itself: an animated business number is either unsourced or reads as
unsourced, and this ICP treats those identically. So the live read-out describes
the render only, and every business figure stays static, quoted and
provenance-marked. That is Silent Failures 1 and 2 in the adapted file, and both
are failures of honesty rather than of craft.

Reversible: yes, nothing is built against it yet

---

## D-027. Direction E, ORIGINATION, built from the adapted prompt

Date: 2026-09-14
Decision: `designs/direction-e-origination/code/index.html`, one self-contained
file, raw WebGL2, no library, no asset of any kind. Added to the gallery as the
first entry. 12.8KB gzipped including all JS.

Six defects were found by measurement during the build, not by eye. Four were in
the build, two were in the prompt that specified it.

**In the build:**

1. The r0 band ranges were contiguous, so the field had no gaps. That is Silent
   Failure 5 reproduced in the build that declared it. Ranges separated.
2. `theta` was derived from `phase0`, which made angular position a linear
   function of cycle phase: every body at the same stage sat in the same arc and
   the field collapsed into one rotating lobe. Measured, not guessed: the
   alpha-weighted screen centroid was at 55.95% of viewport width on a centred
   layout. `theta0` is now its own attribute. Recorded in the contract as a new
   Silent Failure 9.
3. The drawing buffer was sized from `innerWidth`, which includes the scrollbar,
   while the canvas lays out at `clientWidth`. The field was stretched about 1%
   horizontally.
4. The firm figures were a bordered grid of opaque cells, which is a panel, and
   the contract bans panels. They are ruled rows now, and the field shows
   through.

**In the prompt:**

5. Verification check 2 demanded diligence outweigh the other four stages
   combined. At a 48% weight that is arithmetically impossible. The check was
   wrong, not the build. Rewritten to what the weights actually assert.
6. The drag hint shipped in tiers where drag is disabled, and the drag itself
   selected text over the body copy. Both fixed; the drag now applies only in
   the first viewport or the side margins, so selection keeps working in the
   reading document.

Two departures from the source prompt, both deliberate and both recorded in it:
a second draw call for the resolved path, because the path is the metaphor
rather than decoration; and a `?motion=on` override, because this project's own
machine runs reduced motion and without it the full tier cannot be reviewed here.

One limitation is stated rather than hidden: the field is rotationally symmetric
about its own axis, so yaw is very nearly a visual no-op. Only pitch and the
resolved path give the drag visible feedback.

Reversible: yes, it is one file and one gallery line

---

## D-028. Direction F, LOAD BEARING, on Astro + React + R3F

Date: 2026-09-14
Decision: `designs/direction-f-load-bearing/code/`, adapted from `ascent.md` via
`adapted-prompts/02-ascent-to-caprae.md`. Astro with one React island, React
Three Fiber and drei, three lazy-loaded. Added to the gallery as the first card.

Stack chosen by the owner: Astro plus React islands, which HONOURS D-020 rather
than superseding it. Next.js was offered and declined. D-007 is hereby closed:
React Three Fiber with drei.

**The budget question, answered with numbers.** React, R3F, three and drei total
**220.66KB gzipped** in one chunk — more than the whole 200KB initial-JS budget
on their own. Resolution, which the project's own motion spec already specified:
the island is gated with `client:media="(prefers-reduced-motion: no-preference)"`
and the scene module is a dynamic import. Measured result:

- Initial JS that can block first paint: **49.2KB gzipped** (index 2.73 +
  React runtime 44.01 + island 2.43). Budget holds.
- Reduced-motion readers fetch **zero JavaScript**. Verified in the network
  panel: HTML, one stylesheet, two fonts, nothing else. Not three, not R3F, not
  drei, not React.

That last number is the strongest argument for this direction. The owner runs
reduced motion, so the tier they will actually see costs nothing and is a real
build-time SVG drawing of the structure, not a screenshot of a canvas.

**Two departures from the source, both named in the contract.** `ascent.md` runs
700vh; this runs 420vh, because the standing rule is against tall scroll-heavy
layouts. And ascent carries three lines and nothing else, whereas this keeps the
full record below the stage, because a page with no proof fails this project's
own tier-3 test. Restraint belongs in the hero, not in the evidence.

**One figure refused outright.** The source's spec row reads "0 failures".
Caprae has no verified uptime, reliability or failure figure, so the spec row
carries verified figures only: 300,000+ calls, 4 products live, 1 open source.

**The deflection is exaggerated, and says so.** A true L/240 deflection is 0.4%
of the span and invisible at any camera distance that still shows the structure.
Engineering deflection diagrams are conventionally drawn to an exaggerated
vertical scale and label it. So the read-out reports the real 50.0mm over a 12m
span and the drawing prints "deflection drawn x20" beside it. The alternative
was an unlabelled lie about a number.

Reversible: yes, it is one directory and one gallery line

---

## D-029. The record spans the page; it is not a centred 44rem column

Date: 2026-09-14
Supersedes the layout clause of D-026 and the one in D-028.

Decision: Directions E and F use a container of `min(1320px, 92vw)` with a
separate `--measure: 38rem` for running prose. Products become full-width
two-column plates, people run two-up, steps three-up, firm figures four-up,
wedge points two-up.

Alternatives: leave it. Widen the column but keep one measure, which would put
body text on 1300px lines.

Why: the owner asked why everything was centred with large empty margins, and
the answer is that I carried `44rem` straight across from orrery, where a narrow
centred column is deliberate because an observatory's printed matter is a column
of dates. It is an editorial choice and this is not an editorial page. It
contradicted the standing rule, density over empty space with generous
whitespace reserved for editorial content, and it contradicted this repo's own
craft floor, which requires products to be full-width plates rather than a
narrow stack. So the narrow column was wrong against two rules already written
down here, and I did not check either when adapting.

Measured at a 1425px viewport: side gutter went from about 360px to 53px, and
the record, people, steps and figures now carry structure across the width
instead of stacking. Verified at 1440 and 390 on both builds: no horizontal
overflow, body text still 17px, single column below 900px.

Reversible: yes, it is one token and a handful of grid rules per build

---

## D-030. D-015 amended: exposure roll-off is permitted, bloom is not

Date: 2026-09-15
Supersedes the post-processing clause of D-015. The rest of D-015 stands.

Decision: a tone/exposure roll-off pass is allowed in the 3D. Bloom, glow and
blur passes remain banned.

Why: D-015's stated reason was that a gradient hero plus shadowed cards plus
glowing particles is the signature of a generated page. Exposure roll-off does
the opposite of glow. Additive blending maps density to brightness with no
ceiling, so the dense diligence band clips to white and loses the structure
exactly where structure matters. A roll-off removes blowout rather than adding
light. Owner approved the amendment.

Status: **approved but NOT YET BUILT.** E v2 currently controls blowout by
capping per-point alpha and by the depth-of-field energy split. The pass is the
outstanding Tier 1 item.

Reversible: yes

---

## D-031. Direction E rebuilt as v2: Three.js, four screens, persistent field

Date: 2026-09-15
Supersedes the renderer, layout and single-page clauses of D-026.
Plan: `plans/direction-e-v2-origination.md`

Decision: E is now an Astro project with four routes and a React island running
Three.js. E v1 is archived at `designs/_archive/direction-e-origination-v1/` and
stays runnable in the gallery.

Owner decisions, 2026-09-15: multi-page rather than one long page, which answers
Q16 at last; Three.js rather than raw WebGL2; exposure roll-off permitted.

**What was given up, recorded rather than glossed.** E v1 is 12.8KB gzipped with
no library and no build step, and D-007's reasoning was that hand-written WebGL
is itself part of the pitch. That argument has left E. Measured cost: the scene
chunk is 119.94KB gzipped. It is lazy and never blocks first paint, and it is
still well under Direction F's 220.65KB because there is no R3F and no drei and
`three` tree-shakes to core.

Measured initial JS: 2.73 index + 5.28 ClientRouter + 44.01 React + 4.93 island
= **56.95KB gzipped**. Budget holds.

**What multi-page bought.** One canvas instance survives navigation via
`ClientRouter` and `transition:persist`. Route change re-targets camera, focal
plane, streak length and substrate; it never re-seeds. Verified: navigating from
`/` to `/work` carried the clock and the cycle count forward, 13 to 77, with no
reset. That continuity is the only thing multi-page buys that a long page cannot,
and it is the justification for the structure.

**The 3D upgrade, three things v1 did not do.**
1. Bodies are velocity-stretched instanced quads oriented along their own
   analytic velocity, so the cycle law is VISIBLE. v1 proved in the console that
   inner bands run 2.6x faster and showed none of it on screen.
2. Depth of field is built from the particles: a circle of confusion drives size
   up and alpha down so energy is conserved. No blur pass.
3. The resolved route is a tapering camera-facing ribbon with a travelling head,
   replacing a 1px aliased polyline.
Plus a faint ring substrate, and hover picking against the survivors using the
same analytic position function, so the page can now be inspected rather than
only asserted.

**Model integrity survived the renderer change**, which was the real risk. The
field model is renderer-agnostic in `src/lib/field.js` and is called by the
scene, the picking and the build-time static tier alike. Verified after the port:
cycle law 0.783 to 2.45 and monotonic, stage distribution 8.0 / 12.2 / 14.8 /
47.8 / 17.3 against the declared 8 / 12 / 15 / 48 / 17.

Reversible: expensive. v1 is archived and still runs.

---

## D-032. Caprae's real palette, sampled rather than invented

Date: 2026-09-15
Decision: the three E variants use colours read off the live capraecapital.com,
not a palette I chose.

```
grounds  #0A0A0A  #141414  #1A1A1A  #2A2A2A
type     #FFFFFF  #E0E0E0  #B0B0B0  #888888
accent   #F9D360   the only hue on the entire parent site
rules    #F9D360 (23 uses)  #3A3A3A  #2A2A2A
faces    Cormorant Garamond, Newsreader, Inter
```

WebFetch could not see the CSS, so the values were sampled by computing styles
in a browser against the live site.

One constraint falls straight out and shapes E-2 entirely: gold measures
**13.7:1 on #0A0A0A and 1.3:1 on paper**. So on any light variant gold can be a
fill, a rule or a mark, and never type. Also worth noting the parent site
already ships Newsreader, which D-014 had independently picked for archived
Option 1. That is a real brand link, now used deliberately.

Reversible: no, these are the client's colours

---

## D-033. Motion architecture: no new library, and no Three.js for the variants

Date: 2026-09-15
Decision: the three E variants animate with Canvas 2D in a Web Worker via
OffscreenCanvas, plus native CSS scroll-driven animations. No GSAP, no Lenis, no
Three.js, no React.

Alternatives: GSAP with ScrollTrigger; Lenis for smooth scroll; reuse the
Three.js field from E v2.

Why, from the research:
- The field runs in a WORKER, so it cannot be stuttered by the main thread and
  cannot stutter it. This is the largest smoothness win available and it costs
  one file.
- Reveals use `animation-timeline: view()` and the field fade uses
  `scroll(root block)`. Both run on the compositor, both cost 0KB, and they
  replace ScrollTrigger for everything this page needs.
- Only `transform` and `opacity` are animated anywhere. Nothing touches width,
  height, top or left, so nothing forces layout.
- No framework state updates during animation at all. E v2's per-frame React
  setState was the main-thread tax and it is simply absent here.
- Three.js was dropped because dashes, halftone and ticker lanes are 2D. That
  is 120KB to 220KB gzipped saved against E v2 and F for a better result.

**Lenis stays banned, and D-013 stands.** The recommended pro setup syncs it to
`gsap.ticker`, which measures the DOM after mutating it and runs style recalc
twice per frame, and it overrides the OS scroll a 25-to-70 audience already
knows. GSAP remains available if a sequenced timeline ever needs it; nothing
here does.

Reversible: yes

---

## D-034. Three E variants: Assay, Impression, Tape

Date: 2026-09-15
Decision: `designs/direction-e-variants/code/` serves three variants from one
project at `/assay`, `/impression` and `/tape`. Content components, the field
worker and base structure are shared; colour, type, hero architecture and the
background field differ.

Structural rule the owner set, applied to all three: **the hero carries no
animation.** Each hero is a static built graphic, and the field begins below it.
Implemented with a scroll timeline rather than JavaScript.

| | E-1 Assay | E-2 Impression | E-3 Tape |
|---|---|---|---|
| ground | #0A0A0A | #F4F2ED paper | #141414 |
| display | Newsreader | Cormorant Garamond | Inter Tight |
| hero | four static assay plates | standing column + register | giant figure + tick row |
| field | oriented dashes on a curl field | halftone under a travelling wave | ticker lanes + scan rule |
| accent role | rules, marks, type | FILL ONLY, never type | ticks and the CTA |

None of the three is a starfield, which was the explicit brief. Each field
carries two or three layers rather than one.

Reversible: yes

---

## D-035. Reduced motion must not be an unreviewable cliff

Date: 2026-09-15
Decision: every direction gets a `?motion=on` override, honoured in BOTH the
JavaScript gate and the CSS.

Why: this is the fourth time it has cost real work. Direction D was reported as
broken when `core.js` was correctly skipping the 3D for `prefers-reduced-motion`,
which is set on the owner's machine. C has the same gate. E v2 and F each needed
a separate hand-built review copy. The owner has been judging every build by its
static tier without knowing.

In the variants the reduced-motion CSS is scoped `html:not([data-motion="on"])`
and an inline script stamps the attribute before first paint. The reduced-motion
tier also no longer forces the field visible: those readers still get a hero
clear of it, and a composed still below rather than a loop.

Reversible: yes, and it should not be

---

## D-036. The sub-brand is Caprae Tech

Date: 2026-09-15
Supersedes the naming in D-026 and D-031.
Decision: "Caprae Engineering" becomes "Caprae Tech" across the variants.
Alternatives: "Tech Caprae", which the owner also said aloud.
Why: owner's call. Recorded rather than assumed, because the message could have
meant either. One string to flip if it is the other one.
Reversible: yes

---

## D-037. E-1 to E-3 rejected. Asymmetry becomes a standing rule

Date: 2026-09-15
Decision: the owner rejected all three earlier variants. From now on: no centred
containers, no equal columns, no mirrored layouts.

Why they failed, which is worth keeping because it was a structural fault and
not a colour one: every section in E-1, E-2 and E-3 is a full-width horizontal
band of the same width with a heading at top left. Every hero is two equal
columns or four equal cards. That arrangement is the most common one on the web,
so the page reads as a template whatever colour sits on it. E-3 was worst: a
giant figure beside a headline is the default SaaS metrics hero.

The colour failure was separate. Sampling Caprae's gold and black faithfully and
then putting gold on black produces the most worn pairing in finance design. I
optimised for brand accuracy and ignored distinctiveness.

The rule that replaces it: asymmetry needs a governing constant or it reads as
carelessness. Each variant gets one thing that never moves and one thing that
varies.

Reversible: no, this is a standing rule

---

## D-038. E-4 Spine and E-5 Overprint

Date: 2026-09-15

**E-4 Spine.** One vertical rule at 34% from the left runs the whole document
and never moves. Headings hang left and align their right edge to it. Body
starts at it. Product entries cross it. Nothing is centred. What varies is how
far each element reaches from the line, which is the same rule carried into the
3D field. Gold sits on under 2% of the page so that it lands. Hierarchy is
carried by two brightness levels instead of by hue.
Type: Archivo Expanded, Archivo, JetBrains Mono.

**E-5 Overprint.** Five columns of fixed unequal widths, 8/5/13/3/8 of 37. Each
section takes a different span, so the right edge of the page is ragged the
whole way down. Two inks, Caprae's near-black and Caprae's gold, multiplied. The
overlap makes a bronze the designer never chose, because the press makes it.
Gold measures 1.3:1 on paper so it is never type here, only a plate.
Type: Fraunces with the wonk axis, Archivo, JetBrains Mono.

Both keep the earlier rule: the hero carries no animation and the field starts
below it.

Reversible: yes

---

## D-039. 3D runs inside a Web Worker

Date: 2026-09-15
Decision: E-4 and E-5 render Three.js into an OffscreenCanvas inside a Web
Worker. The main thread never touches the render loop.

Why: it is what lets the 3D be large without costing scroll smoothness. A stall
in the page cannot stutter the field and the field cannot stutter the page.
Scroll is the only thing sent across, throttled to one message per frame from a
passive listener, and it carries a single property read rather than a layout
measurement.

three is fetched by dynamic import, so the 2D variants never download it.

E-4's field is a deep well of thin plates registered to the same 34% line the
layout uses. E-5's is two dot plates in real 3D space drifting out of register
against each other, so the moire is genuine interference between two surfaces
rather than a texture trick.

Reversible: yes

---

## D-040. GSAP cannot be installed with bun on this machine. Vendor it instead

Date: 2026-09-15
Supersedes D-023, which blamed package.json and was incomplete.

Finding: `bun add gsap` writes **116 of 118 files as pure NUL bytes**. Correct
file sizes, zero content, including every dist build and every plugin. It is not
a manifest problem, it is the whole package. Reproduced on 2026-09-15 with
gsap@3.15.0.

The same check on `three` found 0 of 5 build files zeroed, so this is specific
to gsap rather than a general bun fault.

The CDN copy arrives intact: gsap@3.13.0 from jsDelivr returned a valid 72,435
byte file.

Decision: if GSAP is adopted, vendor the needed files into the repo from the CDN
rather than depending on the install. No runtime third-party request, which
matters because D-014 rejected third-party font requests on the same grounds.

Also recorded: **GSAP became free in April 2025**, including every previously
paid plugin, after Webflow acquired GreenSock in October 2024. An earlier note
in this session treated it as merely available and understated that.

Reversible: yes, if the install is ever fixed

