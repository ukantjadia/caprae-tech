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


---

## D-041. One hero plate, five pages, and it is the same footage on every tab

Date: 2026-09-17
Decision: the hero footage moved out of the home page into a shared
`HeroMedia` component. Home renders it full height, the four interior pages
render `<HeroMedia short />`, which crops to `object-position: 60% 38%` and
darkens the scrim further so headline type stays readable over a busier part of
the frame.
Alternatives: a different image per section, which was the first build; a flat
gradient on interior pages, which is what shipped before this; no footage at all
below the home page.
Why: the user asked for it directly. It also costs nothing, the file is already
decoded and cached by the time an interior page is reached, so the interior
pages get a video plate for zero extra bytes.
Reversible: yes

---

## D-042. Direction H deploys as a routed SPA, so the gallery gets a 404 shim

Date: 2026-09-17
Decision: the multi-page site ships as `designs/direction-h-caprae-tech/code`
at Pages route `/h/`. `designs/gallery/404.html` splits any missing path on
`/h/` and hands the remainder to H's index as `?p=`, which H's inline script
restores with `history.replaceState` before React Router reads the URL.
Alternatives: `HashRouter`, which puts `#` in every shared link; a static export
per route, which needs a framework this project does not use; accepting that
deep links 404.
Why: every other direction is a single static page, so this is the first one
where a direct hit on an interior URL can miss. Verified against a local server
that reproduces Pages behaviour: `/caprae-tech/h/team` resolves to the team page
with both videos loading from `/caprae-tech/h/`.
Reversible: yes. The shim names `/h/` explicitly, so a second routed direction
needs a line added.

---

## D-043. H3 puts the motion in CSS, not in a scroll library

Date: 2026-09-18
Decision: Direction H3 is a copy of H carrying seven scroll-driven moments
written in native CSS: a reading hairline on `scroll(root block)`, hairline
rules that draw themselves on `view()`, staggered card entry, a clip-path wipe
on the four figures, a deepening hero scrim, 6% hero parallax, and a drifting
footer watermark. Zero JavaScript, zero dependencies, guarded by
`@supports (animation-timeline: view())`.
Alternatives: Lenis, which is 3KB and the most honest momentum library there
is; GSAP ScrollTrigger, free since April 2025; framer-motion `whileInView`,
already in the repo via Direction G.
Why: the project bans scroll-jacking, and Lenis retimes the wheel even though
it leaves the scrollbar native. ScrollTrigger's best trick is pinning, also
banned. Both cost bytes to do what `view()` does for nothing. Support is about
84%: Firefox stable still has it behind
`layout.css.scroll-driven-animations.enabled`, so the `@supports` guard leaves
Firefox with exactly the page H already is.
Reversible: yes. The whole spine is one file, `src/styles/motion.css`.

---

## D-044. Stagger is animation-range, and reduce needs its own switch

Date: 2026-09-18
Decision: staggering is done by shifting `animation-range` per `nth-child`, not
by `animation-delay`. The reduced-motion tier is handled by declaring the whole
spine inside `@media (prefers-reduced-motion: no-preference)`, plus an explicit
`animation-timeline: auto !important` in the existing reduce block.
Why: both are consequences of the same fact. A scroll-driven animation takes
its progress from scroll position, not from elapsed time, so a time delay does
nothing and the project's existing reduce block, which collapses
`animation-duration` to 0.001ms, also does nothing. Left as it was, a reduce
viewer would have been stuck looking at every card frozen at `opacity: 0.25`.
Reversible: yes

---

## D-045. The footer video is replaced by a shader, which is the only place
motion removes weight

Date: 2026-09-18
Decision: H's 14.3MB `footer-loop.mp4` is gone. In its place is one fullscreen
triangle running a domain-warped fbm in the flame hue, on OGL.
Measured cost: JS went 88.44KB to 103.04KB gzipped, so OGL is **14.4KB
gzipped**, not the ~5KB estimated in `plans/h-motion.md`. Total page weight
still falls by 14.3MB.
Alternatives: keeping the video; adding a shader on top of it; raw WebGL with
no dependency.
Why: H spends its entire motion budget on 25.4MB of video against a 2.0s LCP
target that was already lost. Adding a shader to that is decoration. Swapping
one out is the only move here that makes the page both better and lighter, and
a firm selling engineering should not end its site on footage it licensed.
The loop runs only while the footer intersects, renders at half resolution, and
draws a single frame under reduced motion.
Reversible: yes, but the video is deleted from this direction, so reversing it
means restoring the file.

---

## D-046. OGL installs clean under bun, unlike gsap

Date: 2026-09-18
Finding: `bun add ogl@1.0.11` produced 64 JavaScript files with **zero**
all-NUL files. D-040 recorded that `bun add gsap` zeroed 116 of 118 files.
So the bun corruption is specific to gsap rather than general, which is what
D-040 suspected but had only `three` as a second data point.
Reversible: n/a, this is a measurement

---

## D-047. Named H3, not H1, because H2 arrived first

Date: 2026-09-18
Decision: this direction is H3 at Pages route `h3`.
Why: it was built as H1, but a parallel session committed
`direction-h2-operating-signal` while it was in progress. Shipping an H1
underneath an existing H2 would imply an order that is not the build order.
Also folded in: the 404 shim now carries a list, `['h2', 'h3', 'h']`, with the
bare `h` last so it cannot truncate `/h2/` or `/h3/` to `/h/`. That replaces
the pairwise check H2 added, which could not extend to a third.
Reversible: yes, expensive only in that the route name appears in the gallery

## D-048. Resend study copy lives in `study/resend/`, gitignored, loading Resend's assets at runtime
Date: 2026-09-28
Decision: A private local copy of resend.com, outside the `designs/` workspace so the
Pages build never picks it up. `study/` is in `.gitignore`. Resend's Spline cube,
videos, images and fonts are loaded from resend.com at runtime (all served with
`access-control-allow-origin: *`) and never copied into the repo.
Alternatives: vendor their files (rejected, it's their work and this repo publishes to Pages);
rebuild the cube in Three.js now (deferred to the Caprae rebrand, since the user wants the exact look first).
Why: User asked for a private study copy first, then conversion into our site.
Reversible: yes

## D-049. Study copy stack: Vite + React + Tailwind v4, themed by the Refero exports unedited
Date: 2026-09-28
Decision: Same Vite + React base as the direction builds. Tailwind v4 with
`styles-refreo/resend/tailwind-v4.css` as the `@theme`. `@splinetool/runtime` for the hero.
Alternatives: import Resend's compiled 480KB CSS and paste their markup (closer, but it
teaches nothing about the extracted tokens, which is the point of the exercise).
Why: The user wants to see what the extracted resources can build.
Reversible: yes

## D-050. Direction R: Caprae copy on the Resend layout, published; the Resend-branded copy stays private
Date: 2026-09-28
Decision: `designs/direction-r-resend-structure/` goes to Pages at `/r/`. It keeps
Resend's layout, spacing, type scale and dark look, themed by the Refero exports. All copy
comes from `designs/_shared/content.json` ([VERIFIED] only). There are no Resend names,
logos, quotes, code or files. Fonts are self-hosted free substitutes (Instrument Serif
for Domaine, Inter for aBC Favorit, Commit Mono). The hero cube is a static SVG placeholder
until our own 3D exists. The testimonial section is cut (Q13 open).
Alternatives: publish the Resend-branded study copy (rejected, a public URL would pass as
Resend's site); build our own Three.js cube first (the user chose the placeholder to go live sooner).
Why: The user wants to see it live, and chose the placeholder-cube route.
Reversible: yes

## D-051. Direction R gets its own three.js 3D, one shared WebGL context, lazy-loaded
Date: 2026-09-29
Supersedes the placeholder-cube part of D-0050.
Decision: A 3x3x3 hero cube made of rounded cubelets in three finishes (gloss, grain,
perforated mesh). It tumbles slowly under a moving key light, turns a random layer every few
seconds, and tilts toward the pointer. Five tile objects in the same material language: a
block with one violet cubelet lifting out (03), product layers (05), three rising steps (07),
a sphere in a ring (09), and five orbiting cubes (10). One WebGLRenderer draws every visible
view and copies it into each view's own 2D canvas. three.js loads as a separate chunk once a
view nears the viewport, so the initial JS stays at 80KB gzip (engine chunk 137KB gzip).
Views pause offscreen and when the tab is hidden. Reduced motion renders one still frame. The
SVG placeholders stay as the fallback for no JS and no WebGL.
Alternatives: Resend's own Spline cube and 3D videos (rejected, that's their artwork on a
public page); a separate renderer per view (rejected, integrated GPUs cap live WebGL
contexts); Spline runtime (646KB and needs an authored scene we don't have).
Why: The user asked for real 3D in the hero and in every icon tile.
Reversible: yes

## D-052. Dala sets the bar; the performance budget and the smooth-scroll ban are lifted
Date: 2026-09-29
Decision: The target is Dala-level 3D (https://dala.craftedbygc.com/). The performance budget in `.claude/CLAUDE.md` and `02-motion-and-3d.md` (LCP 2.0s, 200KB JS, 60fps, "cut the 3D") becomes measure-and-report, not a veto. The three-tier rule is dropped from CLAUDE.md. Smooth scroll (Lenis) is allowed, which supersedes D-013. Kept: CTA above the fold (the user's global rule, and Dala meets it), no trapping pinned sections, no animated counters, verified claims only, verify in a browser.
Alternatives: Keep the budget and tune Dala's effect down to fit it (fewer particles, no DOF). Copy Dala's exact stack (Laravel Mix + ASScroll).
Why: The user asked to remove the limits and match the reference. Measured Dala on Intel UHD: 36 to 38fps, 245KB JS, 1.75MB total, CLS 0, CTA above the fold, so it was close to the old budget anyway. Laravel Mix (last release 2022) and ASScroll (archived 2023) are dead, so "exact stack" means the same techniques on maintained tools, not the same packages. Research: `research/dala/01` to `04`.
Reversible: yes

## D-053. Build lives in `builds/dala-caprae`; shapes are data, stored as N texture layers
Date: 2026-09-29
Decision: The Dala-technique build goes in `builds/dala-caprae/` (user's choice). Target shapes are baked from GLBs by a bun script into a `DataArrayTexture`, one layer per shape, with `u_progress` running 0..N-1. Placeholder primitives until Caprae's shapes are chosen. No Laravel or PHP.
Alternatives: Dala's fixed layout of 4 shapes as quadrants in one EXR. A Laravel shell.
Why: Layers let shape count, order and content change without touching shader code, so the shapes don't need deciding now. Dala uses Laravel only as a build tool. Its page is static.
Reversible: yes

## D-054. Inter Tight replaces PP Neue Montreal; body at 300, not Dala's 200
Date: 2026-09-29
Decision: Inter Tight Variable (OFL, free, self-hosted via @fontsource-variable/inter-tight) for all text in `builds/dala-caprae`. Body text at weight 300.
Alternatives: PP Neue Montreal (paid Pangram Pangram licence, the user declined to pay for now). Geist or plain Inter.
Why: The user wants no font spend for now. Inter Tight is the closest free neo-grotesk, tight enough for Dala's -0.04em display tracking, and Refero lists Inter as Dala's fallback. Weight 200 body on black is too thin for the 50+ readers in `03-audience.md`, so body goes to 300.
Reversible: yes, one CSS variable

## D-055. dala-caprae scroll mapping uses native rect math, not GSAP ScrollTrigger
Date: 2026-09-29
Decision: Scroll progress is summed from each section's `getBoundingClientRect()` every frame and eased in JS. Lenis provides the smooth scroll. No GSAP for now.
Alternatives: GSAP ScrollTrigger as Dala does, vendored from the CDN (D-040).
Why: Five lines do the mapping, and GSAP still installs corrupted under bun (D-040). Add ScrollTrigger when we need timelines or scrubbed DOM animation.
Reversible: yes

## D-056. GSAP installs with bun again: the fault was one corrupted cache entry. Supersedes D-040 and D-055
Date: 2026-09-29
Finding: `bun add gsap` zeroed 162 of 166 files and skipped 13. The registry tarball is fine (`tar` extracts 179 intact files). `--backend=copyfile` and `--no-cache` changed nothing. A fresh `BUN_INSTALL_CACHE_DIR`, on C: or D:, installed all 179 files cleanly. Root cause: the global cache entry `~/.bun/install/cache/gsap@3.15.0@@@1` was corrupted by an earlier failed extraction and could not be replaced, because Windows held its files in a delete-pending state ("Directory not empty" on an empty folder). Bun kept linking from the broken entry. `--no-cache` only skips the manifest cache, not extracted packages. Defender logged no detections.
Fix: moved the entry aside (`_broken-gsap-3.15.0`, deletable after a reboot releases the handles). `bun add gsap` now gives 179 of 179 files.
Decision: GSAP 3.15.0 from bun in `builds/dala-caprae`. ScrollTrigger drives the shape stages and the section text reveals, and Lenis runs on GSAP's ticker. Vendoring from the CDN is no longer needed.
If it recurs: `bun pm cache` to find the folder, move the bad `<pkg>@<ver>@@@1` entry aside, reinstall.
Reversible: yes

## D-057. dala-caprae copies Dala's choreography model: section progress + ramp table, 10k particles
Date: 2026-09-29
Decision: Scroll drives one number, section index + fraction (ScrollTrigger per section, summed), and every particle property is the sum of clamped ramps in `RAMPS` in `src/config.js`, with Dala's windows. The page has Dala's 7-section rhythm (12.1 screens). 10,000 particles (Dala's desktop count), camera fov 50 at z 10, shape radius 3.6. Explode scatters to a screen-wide cloud. The last shape is the logo, currently a placeholder "C" until the brand kit (Q19) arrives.
Alternatives: The earlier continuous one-shape-per-screen morph with 40k particles, which the user found too dense and too fast.
Why: The user compared against Dala and asked for its pacing, clarity and visible formation. The numbers come straight from Dala's `_updatePosition` and `_nb`. Frame time fell from 25ms to 18ms on Intel UHD.
Reversible: yes, all in config

## D-058. Variant folders: dala-caprae-wordmark (v2) and dala-draft-one (v3)
Date: 2026-09-29
Decision: v2 = `builds/dala-caprae-wordmark`: CAPRAE wordmark hero, no loader, solid particles. v3 = `builds/dala-draft-one`: Dala's shape order (brain slot, lightbulb, sphere, logo), hollow wire particles, Dala-style loader. v1 `builds/dala-caprae` is unchanged. Ports 5195, 5196, 5197.
Alternatives: `caprae` / `draft-one` without the prefix.
Why: The user asked for a `dala` prefix. `dala-caprae` was already v1, so v2 gets `-wordmark`. The loader is v3 only, per the user. Hollow particles are v3 only, per the user.
Reversible: yes

## D-059. v3 particles are hollow: barycentric edges, not line geometry
Date: 2026-09-29
Decision: Same 4-triangle tetrahedron, with a per-corner barycentric attribute. The fragment shader discards everything more than 1px (via `fwidth`) from a face edge, drawn `DoubleSide`. Switch: `PARTICLE_STYLE` in config. Particle size 0.065 (1.5x), wire brightness 1.1.
Alternatives: `LineSegments` (1px, can't be sized, no depth-of-field alpha), thin-box edge geometry (18x the triangles).
Why: No extra triangles. Measured 17.0ms per frame against 18.0 for solid. Back edges show through, so a breaking shape reads as a see-through cloud.
Reversible: yes, one config value

## D-060. v3 lightbulb is procedural; the brain waits for a CC0 model
Date: 2026-09-29
Decision: The lightbulb is a `LatheGeometry` profile (globe, neck, screw threads, tip) built in the bake, with no download. The brain slot uses the torus knot until the user approves downloading the Science Museum Group's CC0 brain (25MB GLB, mediawiki3d.org).
Alternatives: Dala's `pos-33.exr` (their artwork, not ours to ship). Poly Pizza's bulb (CC-BY 3.0, needs attribution).
Why: The shapes are ours or public domain. Nothing is downloaded without the user's yes.
Reversible: yes

## D-061. v4 dala-modified-particles follows Dala's particle spec, read from its GLB and shaders
Date: 2026-09-29
Decision: New `builds/dala-modified-particles`, copied from v3. Findings from Dala's `py-lod*.glb` and `particles.*.glsl`: the particle is a tetrahedron frame (inner tetra inset, 48 triangles), colour is flat, the back of the shape fades with `smoothstep(-4.5, 4, z)`, orientation comes from a noise field so neighbours align, and scale varies per point. Ours now: barycentric frame at 6% of the face with a 1px floor, flat colour, back fade, trig-noise orientation field, blue-noise (Poisson-disk) sampling in the bake for even gaps, 5,625 particles at size 0.085 (~10px) with a narrow size range on the shape, dust with a wide range (up to ~0.56), about a third of particles speckled white/teal/pink, wider amber regions, background blur max 4px.
Alternatives: Keep v3's constant 1px wire (read as scratchy haze at 7px particles). Larger 14px particles (overlapped about 9x on the knot).
Why: The user compared a Dala screenshot with v3 and asked for Dala's particle look, spacing and size spread. Tested in Chrome: blur off proved the haze was overlap, not depth of field. Sphere and knot checked after each change.
Reversible: yes

## D-062. GitHub Pages: new gallery at the root, old gallery at /old/, Dala builds under /dala/
Date: 2026-09-29
Decision: `designs/gallery/index.html` becomes the new gallery (the 4 Dala builds, same viewer UI). The previous gallery moves to `designs/gallery/old/index.html` with every `./x/` rewritten to `../x/`, so every earlier direction keeps its URL. `build-pages.mjs` installs and builds `builds/dala-*` with `BASE_PATH=/caprae-tech/dala/<name>/`. Each Dala build got `vite.config.js` (`base` from `BASE_PATH`) and fetches `shapes.bin` from `import.meta.env.BASE_URL`.
Alternatives: A separate repo or Pages site for the Dala builds.
Why: The user asked to reuse the existing repo, with the new gallery first and everything earlier under an old gallery. Verified locally under `/caprae-tech/`: new gallery loads, Dala 4 fetches shapes.bin (200), all 23 old-gallery routes return 200.
Reversible: yes

## D-063. Three Section Lab drafts (dala-lab-a/b/c) on one rebuilt particle engine
Date: 2026-09-30
Decision: `builds/dala-lab-a`, `-b`, `-c` = every Section Lab A, B and C variant. Lab text copied verbatim; lab chrome and the 16 yellow notes stripped. One particle canvas fixed behind the whole page. Shapes: hero (A: CAPRAE across the top, B: a C on the right, C: a C on the left), then the Caprae logo at "Why founder-led", the lightbulb at "What we build", a geometry instrument set (compass, protractor, set-square, ruler) at "Pricing", with the cloud elsewhere. Hero A's CSS cube is replaced by the particles. Placeholder C until the user's logo SVG arrives. Added to the new gallery and pushed via ukantjadia once the user has seen them.
Alternatives: One particle style per draft; hero-only particles; keeping the cube; copying Lab behaviour gaps as-is.
Why: User answers, 2026-09-30.
Reversible: yes

## D-064. Unverified Lab claims ship marked; "founder-led" wording kept (supersedes D-009 for these drafts)
Date: 2026-09-30
Decision: All Lab text is kept. The 29 claims not found in the proof files and the 4 the proof files contradict each get a visible "to confirm" marker. The Lab placeholders ("[Add the client's problem]", "[domain rate]", "set on the call") stay visible and marked. "Founder-led" and "Built by founders" are kept as written.
Alternatives: Fix the 4 contradicted claims; apply D-009's wording; hide the placeholders.
Why: User choice. The page is public, so the markers keep the drafts honest. D-009 is superseded for these drafts only.
Reversible: yes

## D-065. Particle engine rebuilt to Dala's measured spec, rendered like Dala
Date: 2026-09-30
Decision: One style everywhere (shape and dust): a procedural tetrahedral frame (20 verts, 48 tris, window 0.586, struts 0.12 of the edge). Transparent, depthWrite on, front side, alpha = smoothstep(-4.5, 4, z). Size 1.5x Dala's (median edge ~7 px at 1503x680) with Dala's 3.7x spread and spacing ratio ~1.8 via blue noise. 1 rad/s noise-phased spin. Hover in the vertex shader. Physics scaled by frame time. Post: bloom + vignette + grain; no DOF, no MSAA. Renderer: DPR 1, antialias off, adaptive resolution over 16 ms. Colours: the Lab palette (#9281f7, #9a54dc, #3ad389, #ffca16, #70b8ff). Fonts: Instrument Serif, Inter and JetBrains Mono, self-hosted.
Alternatives: Keep v4's barycentric wire and DOF; DPR up to 1.5 for sharper retina; Dala's gold-led palette; Google-hosted fonts.
Why: `research/dala/05-particle-spec.md` shows Dala's look comes from this exact setup, and `research/perf/01-lag-diagnosis.md` shows MSAA, DOF and canvas AA are ~95% of our frame. Target under 10 ms per frame at 1920x1080 on Intel UHD.
Reversible: yes

## D-066. Lab behaviour gaps fixed with the same look; booking stays a mock
Date: 2026-09-30
Decision: Add reduced-motion handling (cube, rotor, marquee), keyboard and ARIA on the drag compare, accordions, checklist and tabs, a Hero B timer that respects an early click, and a mobile menu under 860 px. The booking form, validation, mock calendar and toast are copied exactly; nothing is sent.
Alternatives: Copy the gaps as-is; a mailto fallback or email draft on submit.
Why: User choice. The 50+ audience needs keyboard and reduced-motion support.
Reversible: yes

## D-067. Speed fixes applied to v1 to v4, and the gallery runs one panel at a time
Date: 2026-09-30
Decision: In v1 to v4: scene target without MSAA, canvas antialias off, DPR cap, physics scaled by frame time, faster pointer easing, renderer.compile in v1 and v2. Gallery: unload other panels when one loads, and correct its "one context" note.
Alternatives: Leave the old builds untouched; fix only the gallery.
Why: User choice, after the lag diagnosis.
Reversible: yes

## D-068. Lab drafts run on native scroll, without Lenis or GSAP
Date: 2026-09-30
Decision: `builds/dala-lab-*` use native scrolling. The particle stage reads `scrollY` against section offsets cached on layout change (a ResizeObserver catches accordions and tabs). No Lenis, no GSAP ScrollTrigger.
Alternatives: Lenis + ScrollTrigger as in v1 to v4.
Why: The Lab relies on CSS `scroll-behavior: smooth` and anchor links, which a smooth-scroll library fights. The particles are already eased. Two fewer libraries and no per-frame DOM reads.
Reversible: yes

## D-069. Shared engine for the Lab drafts, and the Lab is ported by script
Date: 2026-09-30
Decision: `builds/dala-lab-engine/` holds the particle field, post, stage, bake, claim markers, a11y fixes and `port-lab.js`. Each draft imports it (a Vite alias points `three` at the draft's own copy). `port-lab.js` generates each draft's index.html from `Caprae_Tech_Section_Lab.html` with Bun's HTMLRewriter plus exact-once text patches. It keeps every variant's markup (hidden), because the Lab script fills all of them by id with no null checks.
Alternatives: Three copies of the engine; hand-copying the Lab markup per draft.
Why: One source for the look. Re-running the port picks up any Lab edit, and a patch that stops matching fails loudly.
Reversible: yes

## D-070. Fixed world spacing per shape; spare particles park invisibly
Date: 2026-09-30
Decision: Every shape is sampled with blue noise at one world spacing (0.16 minimum distance, median neighbour gap 0.168, about 1.7x the median particle edge). The particle count per shape follows from its surface area: CAPRAE 2,815, C 2,707, logo placeholder 1,516, bulb 2,913, geometry set 1,190 of 10,000 slots. Unused slots are parked on the shape with visibility 0 and fade in only for the exploded cloud. Shapes have their own world radius in the config.
Alternatives: A fixed count per shape (v4), which makes small shapes crowded and big ones sparse.
Why: The user asked for visible, even gaps on every shape.
Reversible: yes

## D-071. The hero shape is fitted into a .hero-mark box, perspective included; camera turn 0.03 rad
Date: 2026-09-30
Decision: The porter adds an empty `.hero-mark` box (A: a band across the top of the hero, height 16vh, hero top padding trimmed to keep the CTA above the fold; B: right side; C: left side). The stage fits the hero shape inside it at every width, accounting for the perspective enlargement of an extruded shape's front face off-centre. The pointer camera turn is cut from Dala's 0.075 / 0.05 rad to 0.03 / 0.02.
Alternatives: Fixed world coordinates (overlapped the headline at narrow widths); Dala's full camera turn (shifted edge shapes ~200 px).
Why: Measured in Chrome: the C overflowed its box by 1.5x until both corrections were in. After them it projects 1100 to 1481 px against a 1078 to 1458 box.
Reversible: yes

## D-072. "To confirm" markers cover every non-VERIFIED claim (refines D-064)
Date: 2026-09-30
Decision: Markers go on every claims-table row that isn't VERIFIED: not found, contradicted, stated and open, plus the Lab placeholders. The exceptions are the "founder-led" framing (wording kept by the user) and the "Caprae Tech" name (a naming decision). They're applied to the live DOM and re-applied when tabs or sliders re-render. Each marker carries the reason and the inventory row number as its tooltip.
Alternatives: D-064's narrower 33 rows (not found and contradicted only).
Why: The user said "mark unverified". Stated and open claims aren't verified either.
Reversible: yes

## D-073. Text over the particle field stays readable: thinner, quieter cloud, clear text column, text halo
Date: 2026-09-30
Decision: In the Lab drafts' engine:
- The exploded cloud keeps only the current shape's particles (~1-3k), not all 10,000.
- The cloud drops to 45% alpha.
- Particles in the middle of the screen, where the text runs, fade by `uQuiet`: 0 for the hero shape, 0.6 for later formed shapes, 1 for the cloud. The edges keep full sparkle.
- Dust alpha tops out at 0.6 and fades in the middle too.
- Text gets a soft black halo (`text-shadow`), except the markers and the gradient text, which has a transparent fill.
- The cloud forms as Pricing ends (5.45 to 5.95), not during Founders.
Alternatives: Opaque scrims behind text blocks (changes the Lab's look); fewer particles everywhere (weakens the hero).
Why: The user's screenshot of Lab A Founders: bios unreadable over a full-brightness 10,000-particle cloud. Checked in Chrome after the change: Founders, Why and the hero all read clearly, and the hero wordmark keeps full brightness.
Reversible: yes

## D-074. R-A, R-B, R-C: Direction R's look and 3D, with the Section Lab's sections and text
Date: 2026-10-01
Decision: New `designs/direction-r-lab/code` builds three static pages (`r-lab/a/`, `b/`, `c/`) plus a picker. `scripts/port.js` takes the Lab (through the shared `builds/dala-lab-engine/lab-source.js`) and, per variant, swaps in R's glass header, puts R's live 3D cube in Hero A's cube slot and an R 3D tile above Hero B and C, adds R's portfolio logo strip after the hero, and opens Why, How, Founders and Team with R's 3D tiles (wedge, how, people, control), using R's own `three/engine.js` unchanged. `skin.css` restyles the Lab's classes in R's look (gradient display type, hairline panels, glass buttons, pill ring, section glow lines), scoped to `body.r-skin`. The Lab's CSS sits in cascade layer `lab`, between Tailwind's base and utilities, declared first in `<head>`. The Lab's script runs unchanged, so every interaction works. Claim markers and a11y fixes are shared with the Lab drafts. No React.
Alternatives: Keep R's 13 sections and pour Lab text into them (drops pricing, team and FAQ); hand-port 30 variants into React.
Why: User answers 2026-10-01: R's look with the Lab's 10 sections, one version per Lab variant, interactions restyled, same markers. Porting the Lab's markup keeps the text exact. Page JS is 3.3 KB gzip, and three.js (137 KB gzip) loads only when a 3D view nears the screen.
Reversible: yes

## D-075. R-A, R-B, R-C: no "to confirm" markers, no border on the 3D icon tiles
Date: 2026-10-01
Decision: Remove the claim markers from the three R versions (main.js no longer runs claims.js; the .tc style is gone). Remove the border from R's 3D icon tiles and redraw the static cube fallback without the X on its top face. This supersedes D-072 and D-074 for the R versions only; the Dala Lab drafts keep their markers.
Alternatives: Keep the markers (D-072); fix the border colour instead of removing it.
Why: User, 2026-10-01: this is a test site on GitHub Pages, not the real site, so no confirmation markers, keep it simple, no borders on the icons. The border showed as solid white because `--rs-s5` is not defined in this build, so it fell back to the text colour.
Reversible: yes

## D-076. R-A, R-B, R-C: the portfolio strip shows the real company logos
Date: 2026-10-01
Decision: The portfolio strip shows the 10 logo files from https://capraecapitalpartners.com/#portfolio (assets/portfolio/*-logo.png|jpg), stored as-is in `designs/direction-r-lab/code/public/logos`, 64px tall and 120px wide with object-fit contain, the company name below each one, no border. The strip keeps the label and the "Not builds by this team" line.
Alternatives: Names set as type (D-074); logos recoloured to one tone (the source files are flat colour squares and white-background JPGs, so recolouring would distort them).
Why: User, 2026-10-01: take the logos from the Caprae Capital Partners portfolio section and use them on all three versions. The source site has an 11th logo (SaaSquatch Leads) that is not in our content's portfolio list, so it is left out.
Reversible: yes

## D-077. Final draft 1: the user's section picks, on the Dala engine and on R
Date: 2026-10-01
Decision: One picks string per page, in the Lab's own `?picks=` order (hero, why, services, work, how, pricing, founders, team, faq, book). Final draft 1 = `cbaabacccb`: Hero C, Why B, What we build A, Work A, How B, Pricing A, Founders C, Team C, FAQ C, Book B. `labRewriter` takes one letter or a picks string. Two pages: `builds/dala-final-draft-1` at `/final-draft-1/` (Dala particles, Draft C's shapes and choreography, because the hero is C), and `r-lab/final-draft-1/` (R's look, 3D, logos). Neither has claim markers (D-075).
Alternatives: Hand-assemble the sections into a new page; put the R version at its own top-level route.
Why: User, 2026-10-01: build the Dala site with these picks as /final-draft-1, and the same for the R (black cube) site. R's version sits inside the existing r-lab build, so no second toolchain is needed.
Reversible: yes

## D-078. Final draft 1 (R): the Rubik cube behind the hero, not in a tile
Date: 2026-10-01
Decision: On `r-lab/final-draft-1/` only, R's hero cube renders behind the hero text: an absolute layer in the hero, a 648x550 box (the engine's largest render size, so nothing stretches) scaled 1.35x, at 60% opacity, with a soft dark radial behind the headline. The small hero tile is gone, which also puts the hero CTA back above the fold. R-A/B/C are unchanged.
Alternatives: A fixed cube behind the whole page while scrolling (the user's first ask). It would render on every scroll frame, behind every section's text, and the user said the hero was fine. Opacity 1 (tested: competes with the headline). Opacity 0.55 (tested: the dark cube nearly vanishes).
Why: User, 2026-10-01: wants the cube as a background, whole page or the hero, and wants it fast. In the hero, the cube stops rendering as soon as the hero leaves the screen (the engine's IntersectionObserver).
Reversible: yes

## D-079. Particles dim under page text (text mask)
Date: 2026-10-02
Decision: Drafts that set `TEXT_MASK` in config get a 192 px wide mask canvas (builds/dala-lab-engine/mask.js), painted white over every text box on screen (headings, paragraphs, buttons, cards, the statement band), padded 14 px and blurred. Both particle shaders (field and dust) read it and fade particles under text to a floor: 12% in Final draft 2, 22% in Final draft 3. Boxes are measured in page coordinates when the layout or the Lab's DOM changes (throttled to 250 ms, typing hero ignored), so a scroll frame only repaints the small canvas. Drafts without TEXT_MASK draw as before.
Alternatives: CSS backdrop-filter blur behind every text block (expensive over a full-screen WebGL canvas on integrated graphics); stronger text halos only (already in place, not enough over bright clusters, per the user's screenshots).
Why: User, 2026-10-02: text over the particles is unreadable; dim or blur the shapes where text comes over them.
Reversible: yes

## D-080. Final drafts 2 and 3: the user's content changes, two looks on the particle site
Date: 2026-10-02
Decision: Both drafts use picks cbaabacccb on the Dala engine (Draft C's shapes) with builds/dala-lab-engine/final.js (`port-lab.js <picks> <title> final`):
- the hero C industry word types and deletes;
- a statement band after the hero ("Dev shops build what you ask. Founders build what sells.");
- each What we build box carries the matching proof result with a CSS picture that runs only on screen (Dashboards: Caprae CRM 1 click; Deal tools: Bankers Edge live; AI assistants: Lead QA 30 → 10 hrs/wk; Internal tools: Recruitment pipeline ~20 hrs/wk; MVPs: the dashboard's bars grow in);
- proof cards get a source button with the domain (searched: capraecapitalpartners.com for the Caprae builds, bankersedgeadvisory.com, itsco.com, destroydrive.com; Simba has no site found, so no button);
- Build team C becomes crew cards with photo slots (initials until photos arrive) and call signs: Overwatch, Pointman, Recon, Sapper;
- the form loses the calendar, its button reads "Book a call →", the hint reads "Four fields. We'll email you to set the time.", and the thank-you names the email;
- a stronger primary button.
Draft 2 keeps the Lab look (serif, iris, opaque panels). Draft 3 is glass: Inter headlines with a silver fill, frosted panels, a silver particle palette. Final draft 1 (Dala and R) is unchanged.
Alternatives: Draft 2 on Dala and Draft 3 on R (offered; the user chose both on Dala). Animated counters for the results (ruled out by D-052).
Why: User, 2026-10-02, answers: both drafts on the particle site, suggested call signs and photo slots, the statement as a band after the hero, results matched to each box.
Reversible: yes
