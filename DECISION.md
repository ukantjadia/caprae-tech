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
