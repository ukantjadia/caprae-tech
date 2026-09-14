# Option 4, Editorial Hybrid: Colour

## Position

Light editorial base, same Pole B reasoning as Option 1. The difference is one
dark inset panel for the 3D, which creates the contrast that carries the page.

Cooler paper than Option 1, warmer accent. The two options should be
distinguishable at thumbnail size in the gallery, or the comparison is worthless.

## Palette

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F6F5F2` | Page background. Cooler and slightly darker than Option 1 |
| `--paper-raised` | `#FCFBF9` | Cards, raised surfaces |
| `--ink` | `#101010` | Body and headings |
| `--ink-muted` | `#56544F` | Secondary text, labels, the 3D point field |
| `--rule` | `#DCD9D2` | Hairlines |
| `--panel` | `#0B0C0E` | The 3D inset only. Near-black, very slightly blue |
| `--panel-ink` | `#E8E6E1` | Any text inside the panel |
| `--accent` | `#B4541F` | Burnt amber. CTA, resolved path in the 3D, live dots |
| `--accent-hover` | `#96441A` | CTA hover |
| `--accent-dim` | `#7A3814` | Accent on the dark panel, where full amber glares |
| `--flag` | `#A8321E` | PLACEHOLDER marks only |

## Why these

**Burnt amber, not blue and not purple.** Every fintech site is navy. Every AI
site is violet. Amber is warm, reads as considered rather than corporate, and
survives on both the light paper and the dark panel with one tonal adjustment.
It is also the only hue on the page, which makes the resolved path in the 3D the
single most saturated thing a visitor sees. That is where attention should go.

**The panel is near-black, not black.** `#0B0C0E` has a trace of blue so the
amber path reads as warm against it. Pure `#000` would make the panel a hole in
the page.

**Cooler paper than Option 1.** `#F6F5F2` against Option 1's `#FBFAF7`. Small in
isolation, clearly different side by side, which is what the gallery is for.

**Still no gradients, still no shadows** on light surfaces. The dark panel is the
only depth cue the page gets, and it works because it is the only one.

## Contrast

Against `--paper` `#F6F5F2` unless noted.

| Pair | Ratio | Standard |
|---|---|---|
| `--ink` on `--paper` | ~16.3:1 | AAA |
| `--ink-muted` on `--paper` | ~6.9:1 | AA body, AAA large |
| `--accent` on `--paper` | ~5.1:1 | AA body, AAA large |
| `--paper` on `--accent` | ~5.1:1 | AA, CTA label |
| `--panel-ink` on `--panel` | ~14.9:1 | AAA |
| `--accent-dim` on `--panel` | ~3.4:1 | Large text and graphics only |
| `--flag` on `--paper` | ~6.2:1 | AA |

`--accent` at 5.1:1 passes AA for body but is the weakest pair on the page. It
is therefore restricted: never used for running text, only for CTA fills, rules,
dots and the 3D path. Re-verified at build; the build fails on any body pair
under 4.5:1.

`--accent-dim` on `--panel` at 3.4:1 is below body threshold by design. It only
ever renders as a 1px graphic line inside the canvas, which falls under the 3:1
non-text rule.

## Dark mode

Not shipped, same reasoning as Option 1. The dark panel is a design element, not
a theme. `color-scheme: light` declared.

## Usage rules

- Amber appears at most three times per viewport: CTA, the 3D path, live dots.
  Three is the cap, and the 3D path counts as one even while animating.
- The dark panel appears exactly once on the page. If a second dark section
  appears, this has become Option 2 and should be relabelled.
- `--flag` red is placeholders only. Never decorative.
- Portfolio logos monochrome at 60%, same as Option 1.

## Fonts

Self-hosted, subset, woff2, preloaded. Different from Option 1 so the two are
distinguishable at a glance.

| Face | Role | Licence |
|---|---|---|
| **Instrument Serif** | Display only, H1 H2, Refuse section, stat values | OFL, free |
| **Geist Sans** | Body, UI | OFL, free, Vercel |
| **Geist Mono** | Labels, eyebrows, indices, stack tags | OFL, free |

Instrument Serif ships one weight with very high stroke contrast. It is built for
large display sizes and is unreadable small, which enforces the discipline of
keeping it out of body copy. Geist is a modern grotesque with a slightly
engineered character, which suits a page whose claim is that these people build
software.

Deliberately avoided: Inter, Poppins, Montserrat, Playfair Display, and anything
that ships as a framework default.

## The 3D colour spec

| Element | Colour | Note |
|---|---|---|
| Panel background | `--panel` | Flat, no gradient, no vignette |
| Resting points | `--ink-muted` at 15 to 45% opacity | Varying by depth |
| Resolving points | `--accent-dim` at 90% | The ~12 selected |
| The path line | `--accent-dim` | 1px, no glow, no bloom |
| Fog | None | Depth is carried by opacity alone |

No bloom. No emissive. No post-processing. A glowing particle field is the exact
look this page is trying not to have, and it is also where the frame budget goes
to die.
