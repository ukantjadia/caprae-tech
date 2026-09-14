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
