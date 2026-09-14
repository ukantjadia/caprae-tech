# Option 1, Institutional: Architecture

## The bet

Zero 3D. Zero scroll choreography. The page earns credibility through
typography, density and proof. If this beats Option 4, the 3D was never the
argument and we saved the budget.

This is the control in the experiment.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5** | Ships zero JS by default. For a page with no interactive island, the output is effectively static HTML and CSS. |
| Styling | **Tailwind v4** | CSS-first config, tokens live in `@theme`. No JS config file. |
| Content | `../_shared/content.json` | Imported at build time. Identical data to Option 4. |
| Motion | Native CSS only | `@starting-style`, `transition`, `animation-timeline: view()` for reveals. No library. |
| Fonts | Self-hosted woff2, subset | No Google Fonts request. One less DNS lookup, no third-party dependency on a site selling engineering competence. |
| Package manager | **bun** | Per global rules. |
| Deploy | Static output | Any host. Target TBD, Q18. |

Total expected JS: **0 KB** beyond Astro's islandless output. That is the point.

## Component tree

```
Layout.astro
├── Head            meta, JSON-LD Organization, font preload
├── Nav             fixed, 56px, logo + one CTA. Same position every page
└── main
    ├── Hero              eyebrow, h1, sub, CTA pair, trust line
    ├── ProofStrip        4 product names as links, inline, at the fold edge
    ├── Wedge             h2 + body + 4 points, two-column
    ├── People            5 rows, name / role / credential / detail
    ├── Work              4 live products + placeholder grid + portfolio strip
    ├── Engagement        3 steps, numbered
    ├── Refuse            list. Highest-trust section on the page
    ├── Firm              4 stats + scope disclaimer
    └── Contact           h2, CTA, email fallback
└── Footer          legal, links
```

Nine sections. No section exists that does not carry a fact.

## Data flow

Single import, build time, no runtime fetch.

```
content.json ──build──> Astro components ──> static HTML
```

Placeholder rendering is enforced in one place:

```astro
<!-- PlaceholderMark.astro -->
{item.placeholder && (
  <span class="placeholder-mark" data-note={item.note}>PLACEHOLDER</span>
)}
```

The mark is a red outline plus a label. It cannot be styled away by accident
because it is a shared component, and a build check greps the output for the
string `PLACEHOLDER` and fails the production build if any remain.

## Accessibility

Built in, not audited afterwards.

- Semantic landmarks, one `h1`, no heading level skipped
- 17px body minimum, 1.6 line-height
- Focus rings visible, never `outline: none` without a replacement
- Every link reachable and labelled without hover
- Colour contrast checked at build, see `color-scheme.md`
- No motion that is not a `transition` under 200ms

## Performance targets

| Metric | Target | Expected |
|---|---|---|
| LCP, throttled 4G | under 2.0s | under 1.0s |
| CLS | under 0.05 | 0 |
| INP | under 200ms | negligible |
| Initial JS | under 200KB | ~0KB |
| Total page weight | — | under 250KB including fonts |

Option 1 should be embarrassingly fast. That is a finding in itself when
compared against Option 4.

## Build commands

```
bun create astro@latest .
bun add -d @tailwindcss/vite tailwindcss
bun run dev
bun run build
```

## Risks

- **Risk:** reads as plain rather than considered. Mitigation is entirely in the
  typography and the spacing rhythm. There is nothing else to hide behind.
- **Risk:** the owner wanted 3D and this has none. It is the control. If it
  loses, it has done its job.
