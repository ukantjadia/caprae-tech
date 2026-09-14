# Option 1, Institutional: Colour

## Position

Light mode, deep typographic contrast. This follows the 2026 consensus for
traditional asset managers and PE firms: dark mode reads as growth-equity or
technology, light mode reads as institutional credibility. Our buyer is Pole B.

One accent. Everything else is paper, ink and rule.

## Palette

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FBFAF7` | Page background. Warm off-white, not `#FFF`. Paper, not screen |
| `--paper-sunk` | `#F3F1EC` | Section alternation, card fill |
| `--ink` | `#141414` | Body and headings. Not pure black, which vibrates on warm paper |
| `--ink-muted` | `#5C5A55` | Secondary text, labels, disclaimers |
| `--rule` | `#DEDAD2` | Hairlines, borders, dividers |
| `--accent` | `#2D4A3E` | Deep moss. CTA fill, link underline, live dot |
| `--accent-hover` | `#233B31` | CTA hover |
| `--accent-wash` | `#EAEEE9` | Accent-tinted background, used once at most |
| `--flag` | `#A8321E` | PLACEHOLDER marks only. Never decorative |

## Why these

**Warm paper over white.** `#FBFAF7` against `#141414` reads as printed matter.
Pure white with pure black is a screenshot of a text editor. The warmth is 3
points of yellow, invisible on its own and obvious in comparison.

**Deep moss, not navy.** Navy is the default for every financial site and would
make this indistinguishable. Moss carries the same seriousness without the
category cliché. It is also dark enough to pass contrast as a text colour, which
a mid-tone blue would not.

**No gradient anywhere.** Not in the hero, not on the CTA, not on a card. A
gradient is the single fastest signal that a template generated the page.

**No shadows.** Depth is carried by hairline rules and the sunk paper tone.
Box-shadow on cards is the other template tell.

## Contrast

Checked at design time, verified at build. All against `--paper` `#FBFAF7`.

| Pair | Ratio | Standard |
|---|---|---|
| `--ink` on `--paper` | ~15.8:1 | AAA body |
| `--ink-muted` on `--paper` | ~6.4:1 | AA body, AAA large |
| `--accent` on `--paper` | ~8.1:1 | AAA body |
| `--paper` on `--accent` | ~8.1:1 | AAA, CTA label |
| `--rule` on `--paper` | ~1.3:1 | Non-text, decorative only |
| `--flag` on `--paper` | ~6.0:1 | AA |

Ratios above are computed from the hex values and get re-verified in the build
step. Any pair under 4.5:1 for body text fails the build.

Given the 25 to 70 audience, `--ink-muted` is the floor for any text a buyer
needs to read. Anything lighter is decoration and carries no information.

## Dark mode

**Not shipped.** A deliberate decision, not an omission.

The research says light mode signals institutional credibility for this buyer
type. Shipping a dark variant of an institutional design usually produces a
worse version of both. If a dark mode is wanted later it should be its own
design pass, which is closer to Option 2.

`color-scheme: light` is declared so the browser does not invent one.

## Usage rules

- Accent appears at most four times per viewport: nav CTA, hero CTA, live dots,
  link underlines. If a fifth use appears, something else should lose it.
- `--accent-wash` is allowed in exactly one section. Currently the Refuse
  section, because it is the highest-trust moment and deserves one signal.
- Placeholder `--flag` is never used for anything else. Seeing red on the page
  must mean exactly one thing.
- Product logos in the portfolio strip render in `--ink-muted` at 60% opacity,
  monochrome. Colour logos would pull more attention than the products this team
  actually built.

## Fonts

Self-hosted, subset to Latin, woff2, preloaded.

| Face | Role | Licence |
|---|---|---|
| **Newsreader** | Display, H1 H2, stat values | OFL, free |
| **Public Sans** | Body, UI | OFL, free, USWDS |
| **JetBrains Mono** | Labels, eyebrows, stack tags, numbers | OFL, free |

Newsreader has real optical sizing and an editorial serif character without the
period costume of a Caslon. Public Sans is institutionally neutral without being
Inter, which now reads as a default rather than a choice. Deliberately avoided:
Inter, Poppins, Montserrat, and any variable grotesque that ships as a framework
default.
