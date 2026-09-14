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
