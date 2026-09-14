# Option 1, Institutional: Layout

## Grid

12 columns, 1200px max content width, 72px gutters at desktop.
Body copy never exceeds 8 columns, roughly 68 characters. Long measure is the
most common way an institutional site becomes unreadable.

| Breakpoint | Columns | Margin | Base size |
|---|---|---|---|
| 400px | 4 | 20px | 17px |
| 768px | 8 | 40px | 17px |
| 1200px | 12 | 72px | 18px |
| 1600px+ | 12, capped | auto | 18px |

## Above the fold, the hard constraint

At 1440x800 and at 400x700, visible without scrolling:

1. Nav with CTA
2. Eyebrow
3. H1
4. Subhead
5. Primary CTA
6. Trust line
7. Top edge of the proof strip

Seven elements. The proof strip peeking above the fold is deliberate: it is the
scroll invitation, and it means a zero-scroll visitor still sees that real
products exist.

**Verification:** screenshot at both sizes, CTA must be fully visible. This is a
build gate, not a preference.

## Section order and rhythm

Vertical rhythm is tight per the global rules. Section padding is 64px at
desktop, 48px mobile, not the 120px a marketing template would use.

| # | Section | Layout | Height budget |
|---|---|---|---|
| 1 | Hero | Left-aligned, 7 cols. No image. Type carries it | 100vh minus nav, capped 720px |
| 2 | Proof strip | Single row, 4 product names as underlined links + "live" dot | 88px |
| 3 | Wedge | Two-column. h2 + body left 5 cols, 4 points right 6 cols | auto |
| 4 | People | 5 rows. Name and credential left 4 cols, role and detail right 7 cols. Hairline rule between | auto |
| 5 | Work | 4 live products as a 2x2 grid of large cards. Placeholders in a visually separate 4-up row below | auto |
| 6 | Engagement | 3 columns, numbered 01 02 03 | auto |
| 7 | Refuse | Single column, 6 cols, large type. Deliberately short | auto |
| 8 | Firm | 4 stats in a row, disclaimer beneath in small type | auto |
| 9 | Contact | Centred, one CTA, email below | auto |

## Type scale

Modular, 1.25 ratio, clamped. No fluid nonsense that produces 61px on one
laptop and 48px on another.

| Role | Desktop | Mobile | Face |
|---|---|---|---|
| H1 | 64px / 1.05 / -0.02em | 40px | Newsreader, 500 |
| H2 | 40px / 1.15 | 30px | Newsreader, 500 |
| H3 | 24px / 1.25 | 21px | Public Sans, 600 |
| Body | 18px / 1.6 | 17px | Public Sans, 400 |
| Small | 15px / 1.5 | 15px | Public Sans, 400 |
| Stat value | 56px / 1 | 40px | Newsreader, 500, tabular |
| Label, eyebrow | 13px / 1.4 / 0.08em, uppercase | 13px | JetBrains Mono, 500 |

Mono is for numbers, labels and stack tags only. It signals data, not decoration.

## The people section, specifically

This is where Option 1 does its heaviest lifting, because it has no 3D to lean
on. Five rows, hairline separated, each one scannable in two seconds:

```
Kevin Hong                    Founder and Managing Partner, Caprae Capital
CHICAGO BOOTH                 $130M+ closed by members. 400K+ M&A cold calls.
─────────────────────────────────────────────────────────────────────────────
Eric Nehrlich                 Chief of Staff, Caprae Capital
GOOGLE                        Six years running strategy and ops for Google
                              Search Ads. Ten years engineer and PM before that.
─────────────────────────────────────────────────────────────────────────────
```

The credential sits in mono caps under the name. Four institutions stacked
down the left edge, reading BOOTH, GOOGLE, WHARTON, KELLOGG. That column is
the argument.

## Work section

Four live products, 2x2. Each card:

```
SaaSquatch Leads                                          LIVE ↗
B2B lead generation and enrichment

Built in-house from zero. Three-week beta drew 1,200+
signups. Public at $20/month.

1,200+  beta signups        $20/mo  public pricing
Flask · Vite · React · TypeScript · ML · AWS
```

Whole card is the link. The `↗` and `LIVE` dot signal it opens a working
product, which is the single most persuasive thing on the page.

Placeholders sit below in a 4-up row, visually demoted, each with the red
PLACEHOLDER mark. Portfolio strip is last, in small type, under its own
disclaimer label.

## Motion

Almost none, and that is a position not an omission.

- Section reveal: 12px rise, 240ms, opacity, on entry, once. Native
  `animation-timeline: view()`
- Link and button: 120ms colour and underline
- Card hover: 1px border darken, no lift, no shadow, no scale

Under `prefers-reduced-motion: reduce` the reveals become instant. Nothing else
changes, because nothing else moves.

## Responsive behaviour

- Two-column sections stack at 768px, text first
- Work grid 2x2 becomes 1-up at 768px
- People rows stack name above role at 768px
- Stats row wraps 2x2 at 600px
- Nav CTA stays visible at 400px, label shortens to "Book"
- No horizontal scroll at any width. Tables and code get their own overflow box
