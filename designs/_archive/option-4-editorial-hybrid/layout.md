# Option 4, Editorial Hybrid: Layout

Same nine sections, same content, same grid system as Option 1. This file covers
only what differs. Read `../option-1-institutional/layout.md` for the shared base.

## Grid

Identical 12-column, 1200px, but Option 4 uses asymmetric splits where Option 1
uses symmetric ones. 7/5 and 5/7, never 6/6. Symmetry reads as a template.

## Hero, the one real difference

Split. Copy left 6 columns, 3D panel right 6 columns, both vertically centred.

```
┌─────────────────────────────────┬────────────────────────────┐
│ CAPRAE CAPITAL                  │  ┌──────────────────────┐  │
│                                 │  │                      │  │
│ Engineers who                   │  │   deal-flow field    │  │
│ already build                   │  │   dark inset panel   │  │
│ for operators.                  │  │   4:5 portrait       │  │
│                                 │  │                      │  │
│ Our team builds the software    │  │                      │  │
│ Caprae's own searchers...       │  └──────────────────────┘  │
│                                 │                            │
│ [ Book a call ]  See our work   │                            │
│                                 │                            │
│ $110M+ closed · 8 countries     │                            │
└─────────────────────────────────┴────────────────────────────┘
         proof strip peeking above the fold edge
```

**The CTA sits left, at the same height it would be in Option 1.** The 3D panel
is beside it, never behind it and never above it. This is the whole resolution to
Q23: the 3D costs zero vertical space in the fold.

Panel is a fixed 4:5 portrait box with `aspect-ratio` set in CSS so the poster
and canvas reserve identical space. CLS stays 0.

**At 768px and below the panel moves below the CTA**, at 16:10, height capped at
320px. The copy and button never move down to make room for it. If the viewport
is short, the panel is what gets cut.

## The deal-flow field, visual spec

What it depicts, per D-012.

**Resting state.** 2,000 to 4,000 points in a slowly rotating volume. Uneven
density, some clustering. Each point is a company. Points are small, 1 to 2px,
in `--ink-muted` at varying opacity so the field has depth without fog.

**The resolution.** Every 8 to 12 seconds, a subset of roughly 12 points
brightens to `--accent` and a thin line threads through them in sequence, from
one edge of the volume toward a single point near the centre-bottom. The line
draws over about 1.2s, holds for 2s, then fades. The points return to the field.

That is origination: many companies, a path found through a few, one close. It
is also literally what CLOVER does, which is why the hero and the work section
argue the same thing.

**Interaction.** Pointer position applies a slow parallax to the volume,
maximum 6 degrees, heavily damped. Nothing else responds to the pointer. No
click target, no orbit controls, no scroll coupling.

**What it must never be:** a blob, a mesh gradient, a sphere of dots with no
event, or anything that reads as decoration in the first three seconds. If a
reviewer cannot say what it represents without being told, it has failed.

## Type scale

Larger display, tighter body than Option 1. Editorial contrast.

| Role | Desktop | Mobile | Face |
|---|---|---|---|
| H1 | 76px / 0.98 / -0.03em | 44px | Instrument Serif, 400 |
| H2 | 48px / 1.1 / -0.02em | 32px | Instrument Serif, 400 |
| H3 | 22px / 1.3 | 20px | Geist Sans, 600 |
| Body | 18px / 1.6 | 17px | Geist Sans, 400 |
| Small | 15px / 1.5 | 15px | Geist Sans, 400 |
| Stat value | 64px / 1 | 44px | Instrument Serif, tabular |
| Label, eyebrow | 12px / 1.4 / 0.1em, uppercase | 12px | Geist Mono, 500 |

Instrument Serif has one weight and very high stroke contrast. At 76px it is
striking; at 18px it would be unreadable, which is why it never touches body
copy. That restriction is the design, not a limitation.

## Section deltas from Option 1

| Section | Change |
|---|---|
| Proof strip | Same, but with a 1px accent rule above it |
| Wedge | 7/5 asymmetric instead of 5/6. Points get a hanging mono index `01–04` |
| People | Credential moves to a right-aligned column so BOOTH / GOOGLE / WHARTON / KELLOGG / ASU stack as a hard right edge against the ragged detail text |
| Work | 2x2 becomes a staggered 2-column masonry, cards offset 48px vertically. GSAP reveals them in sequence, 80ms stagger, once |
| Refuse | Set in Instrument Serif at H2 size. Largest type on the page after the H1. Saying no, loudly, is the trust moment |
| Firm | Stats separated by vertical hairlines rather than gaps |

## Motion

| Element | Motion | Reduced-motion |
|---|---|---|
| Hero 3D | Continuous, described above | Static poster |
| Section reveal | 16px rise, 320ms, once | Instant |
| Work cards | GSAP stagger 80ms, once | Instant, no stagger |
| Links, buttons | 140ms | Same |
| Card hover | Border darken plus 2px rise | No rise |

No pin. No scrub. No smooth scroll. No counters.

## Responsive

As Option 1, plus:

- Hero splits to stacked at 768px, 3D below the CTA
- 3D panel hidden entirely below 480px. A poster at that size costs bandwidth
  and shows nothing legible
- Staggered work masonry collapses to a single column at 768px, offsets removed
- Instrument Serif H1 drops to 44px at 400px, still the largest thing on screen
