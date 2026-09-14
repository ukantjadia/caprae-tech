# 03. Skills

Which skills to invoke, in what order, for what. All are installed globally at
`C:\Users\Ukant\.claude\skills\`, verified present 2026-09-14.

## Warning before relying on this list

These skills are on disk but **did not appear in the current session's skill
listing**. The listing showed pstack and mattpocock skills only. On disk the
count is 117 directories, including every design skill below.

Likely a stale or partial session load after the ECC uninstall. Before a design
session, restart Claude Code and confirm the design skills appear. If they still
do not, the files are readable directly and their instructions can be followed by
hand. The knowledge is not lost either way, but invoking beats reading.

## The two heavyweights

### `impeccable`

The broadest design skill installed. 17MB, with `reference/` and `scripts/`
directories, which means it carries real material rather than a prompt.

Covers design, redesign, critique, audit, polish, visual hierarchy, information
architecture, cognitive load, accessibility, performance, responsive behaviour,
theming, typography, spacing, colour, motion, micro-interactions, UX copy, error
states, edge cases, and design tokens. Explicitly covers "ambitious visual
effects that should feel technically extraordinary," which is this brief.

Has four dedicated agents: `impeccable-asset-producer`,
`impeccable-documenter`, `impeccable-finish-reviewer`,
`impeccable-manual-edit-applier`.

**Use as the spine of the build.** If only one skill runs, this is it.

### `gpt-taste`

Purpose-built for exactly the motion brief: GSAP ScrollTriggers including
pinning, stacking and scrubbing, strict AIDA page structure, wide editorial
typography with a ban on six-line wraps, gapless bento grids, inline
micro-images, and large section spacing.

**Use for the scroll choreography.** One caution: it enforces massive section
spacing, which collides head-on with the global rule against tall scroll-heavy
layouts. Take its motion technique, argue with its spacing. The conflict is
documented in `01-direction.md`.

## Direction and system

### `design-consultation`

Researches the landscape, proposes a full design system covering aesthetic,
typography, colour, layout, spacing and motion, and generates font and colour
preview pages. Writes `DESIGN.md` as the project's design source of truth.

**Run this first.** Nothing else should start before the system exists.

### `brandkit`

Brand guideline boards, logo systems, identity decks. Relevant only if this
becomes its own brand rather than a Caprae sub-brand. Blocked on Q2.

### `high-end-visual-design`

Defines the specific fonts, spacing, shadows, card structures and animations
that make a site feel expensive, and blocks the defaults that make it look
cheap. Narrow and opinionated.

**Use as a checklist against the output of the heavyweights.**

### `design-taste-frontend`

Anti-slop skill aimed at landing pages specifically. Reads the brief, infers a
direction, avoids templated output. Overlaps with `impeccable`. Use whichever
produces the better first pass, not both at once.

### `frontend-design`

General distinctive-frontend skill. The fallback if the more specific ones do
not fit.

## Style references, pick at most one

- `minimalist-ui` — warm monochrome, typographic contrast, flat bento, no
  gradients, no heavy shadows. The closest fit to an institutional finance tone.
- `industrial-brutalist-ui` — Swiss print meets military terminal, rigid grid,
  extreme type-scale contrast. Wrong for a 60-year-old banker, right if the site
  leans hard into the engineering identity. Probably too much.

These are mutually exclusive. Choosing one is a `DECISION.md` entry.

## Implementation

- `shadcn-ui` — component layer if the site is React. Sensible default for
  forms, dialogs and the booking flow.
- `design-html` — turns an approved mockup into production HTML and CSS. Use if
  the build stays framework-free.
- `remotion` — programmatic video. Only if the site needs motion assets rendered
  as video rather than run live.

## Review, in order

Run all four before shipping. Each catches what the previous one misses.

1. `plan-design-review` — rates each design dimension 0 to 10 and fixes the plan.
   Runs **before** implementation, not after.
2. `design-review` — designer's eye QA on the live page. Finds spacing
   inconsistency, hierarchy problems, AI-slop patterns, slow interactions, then
   fixes them with before and after screenshots.
3. `web-design-guidelines` — audits the code against the Web Interface
   Guidelines. Accessibility and interaction correctness.
4. `browse` or `qa` — drives the real page in a headless browser. Verifies the
   performance budget in `02-motion-and-3d.md` rather than trusting it.

## Writing

- `pstack-unslop` — mandatory on all site copy per the global rules. The
  audience is bankers and operators. "Innovative solutions" loses them.
- `copywriting` — landing page and hero copy, value proposition, CTA text.
- `copy-editing` — passes over existing copy.

## Suggested order

```
1. design-consultation        -> DESIGN.md exists          verify: file written, tokens defined
2. pick style reference       -> one of two, recorded      verify: DECISION.md entry
3. copywriting + pstack-unslop-> copy drafted              verify: no adjectives without a number
4. impeccable                 -> layout and system built   verify: renders at 400px and 1920px
5. gpt-taste                  -> scroll choreography       verify: CTA still above fold
6. high-end-visual-design     -> polish checklist          verify: every item answered
7. plan-design-review         -> rated, plan fixed         verify: no dimension under 8
8. build
9. design-review              -> live QA, fixes applied    verify: before and after screenshots
10. web-design-guidelines     -> a11y and interaction      verify: no failures
11. browse / qa               -> perf budget               verify: LCP under 2.0s on throttled 4G
```

Steps 1 and 2 block everything. Step 7 blocks the build.

## Agents worth using

- `impeccable-finish-reviewer` — reviews the finished build against the direction
  contract and returns an ordered list of material fixes
- `impeccable-documenter` — writes `DESIGN.md` from the shipped artifact rather
  than from intentions, which is the honest version
- `UI Designer`, `UX Architect`, `Accessibility Auditor` — available as general
  agents if a second opinion is wanted on a specific dimension
