# 01. Design Direction

## The stated goal

Outstanding design. 3D. Animation. Scroll-driven motion. [STATED 2026-09-14]

## The conflict, stated plainly

Three inputs to this project point in different directions.

**Input 1, the design goal.** 3D, scroll animation, motion. Big, impressive,
technically show-off.

**Input 2, the global UX rules** in `~/.claude/CLAUDE.md`:

> Never create tall scroll-heavy layouts. Prefer density over empty space.
> Fold all primary actions above the fold. No scrolling to reach the CTA.
> Use compact spacing, 8 to 12px gaps. Reserve generous whitespace only for
> editorial content.

**Input 3, the audience** in `../03-audience.md`. Age 25 to 70. Owners,
bankers, board members, M&A professionals. A meaningful share are 50+.

A scroll-driven 3D experience is, by construction, a tall scroll-heavy layout
with generous whitespace and the CTA below the fold. It is the exact thing rule
2 forbids. And the buyer most likely to write the cheque is the one least likely
to enjoy scroll-jacking on a work laptop.

This is not a reason to abandon the 3D. It is a reason to aim it.

## Proposed resolution

Not yet approved. See Q23 in `../05-open-questions.md`.

**Motion is the proof, not the packaging.**

- The hero is a contained 3D or WebGL element that loads fast and sits beside
  the headline, not behind it. It does not push the CTA down.
- The primary CTA stays above the fold at every breakpoint. Non-negotiable.
- Scroll animation is reveal and transition, not narrative. No pinned sections
  that trap the user. No scroll-jacking. No hijacked wheel events.
- One, at most two, moments of genuine technical spectacle. Placed at the work
  section, where showing off is the argument.
- Everything else is restrained, dense, and fast.

The rule of thumb: a visitor who scrolls zero pixels still sees who you are,
what you sell, the proof, and the button. Everyone else gets rewarded for
scrolling. Nobody is held hostage by it.

## What "exceptional" means here

Not maximal. The failure mode for this brief is a site that looks like a
web-design agency's own showreel: gradient mesh, floating glass cards, particle
field, four scroll-triggered counters. That reads as a vendor trying to be
impressive, which is the opposite of a firm that already closed $110M in deals.

Exceptional for this audience means:

- **Restraint that costs money.** Real typography, correct optical alignment,
  one deliberate accent colour, generous line-height in body copy. The things a
  template cannot fake.
- **Proof density.** Four live products with real URLs, above the fold or one
  scroll below. Names and numbers, not adjectives.
- **One technical flex, executed perfectly.** A single 3D or WebGL moment that
  is genuinely good is worth more than five that are competent. It is also the
  argument: you are selling engineers, and the site is their work sample.
- **Speed.** A slow site from a technical services vendor is a self-refuting
  claim. The performance budget in `02-motion-and-3d.md` is a design
  constraint, not a nice-to-have.

## Tone

Closer to a fund's site than a startup's. Institutional, confident, quiet.
The 3D provides the contrast. If the typography is also loud, the page has
nothing left to say.

Reference direction is not set. Q15 asks for one or two sites to sit next to.

## Accessibility as a functional requirement

With a 25 to 70 ICP this is conversion work, not compliance work.

- Body copy 17px minimum, 1.6 line-height
- Contrast at least 4.5:1 for body, 3:1 for large text, checked not guessed
- No interaction that only exists on hover
- `prefers-reduced-motion` honoured properly. Motion off means motion off, and
  the page must still make sense and still convert
- Keyboard reachable CTA, visible focus rings
- No text baked into images

## Non-negotiables carried from the global rules

- One primary action per screen. Never two equal-weight buttons.
- Navigation position identical on every page.
- Compact spacing by default, 8 to 12px. Whitespace is spent deliberately on
  the hero and the work section, not sprayed everywhere.
- Progressive disclosure. Common action visible, detail folded away.
