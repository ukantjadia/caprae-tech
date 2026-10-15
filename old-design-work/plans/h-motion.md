# Direction H — motion plan

Written 2026-09-18 against the live build at
`https://ukantjadia.github.io/caprae-tech/h/`.

## What H actually has right now

Measured, not remembered. Every motion rule in `direction-h-caprae-tech/code`:

| Where | What | Trigger |
|---|---|---|
| `Home.css:100` | `rise` on four hero elements, staggered 0.06 / 0.14 / 0.2 / 0.28s | page load |
| `HeroMedia.css:13` | video fades and settles in over 1.1s / 2.4s | video ready |
| `Footer.css:16` | same fade on the footer video | intersection |
| `pages.css:60` | card lifts 3px | hover |
| `globals.css:65` | button transform | hover |
| `Navbar.css:56` | nav pill colour | hover |

So: **one entry animation, two fades, three hover states, and nothing at all
tied to scroll.** The complaint is correct. Home is 3180px tall and 2600 of
those pixels are motionless.

## Two things motion will not fix, and both are visible

Fix these first or the animation sits on top of a defect.

1. **The fixed navbar has no backdrop.** Scrolled to 900px, the eyebrow "…V
   SHOP CANNOT COPY" runs straight under the logo. At 1900px "All services"
   does the same. `Navbar.jsx` already tracks a scrolled state; it just does
   not apply a plate.
2. **Dead vertical gaps between bands.** Roughly 300px of nothing between the
   services band and the figures band. The global UX rule is density over empty
   space, and this is the opposite. Tightening it also shortens the scroll the
   animation has to carry.

## The spine: native CSS scroll-driven animation, zero JS

Seven moments. All of them compositor-only (`transform` and `opacity`), so
none can move layout and none can touch CLS. All of them cost 0 KB of
JavaScript.

Support is Chrome/Edge 115+, Safari 18+, Firefox 132+ **behind a flag in
stable** — roughly 84% globally, not yet Baseline, and it is an Interop 2026
priority. So every block is wrapped:

```css
@supports (animation-timeline: view()) { … }
```

Outside that, the page is exactly what it is today. That is the no-JS tier and
the Firefox tier for free.

### 1. Reading hairline under the navbar

One div, no JS, no listener.

```css
.progress {
  position: fixed; inset: 56px 0 auto 0; height: 1px;
  background: var(--flame-lit); transform-origin: 0 50%;
  transform: scaleX(0);
  animation: grow linear both;
  animation-timeline: scroll(root block);
}
@keyframes grow { to { transform: scaleX(1); } }
```

This is the highest value per line on the list. It is the one motion an M&A
buyer on a work laptop reads as competence rather than decoration, and it
answers "how much of this is left", which on a 3180px page is a real question.

### 2. Rules that draw themselves

H's whole visual language is hairlines: `.points li`, `.svc__item`,
`.rec__item`, `.figures li`, `.faq li` all carry a `border-top`. Replace the
static border with a pseudo-element that scales from 0 to 1 on
`animation-timeline: view()`, `animation-range: entry 20% cover 35%`.

The rule drawing itself is the section asserting itself. It is on-brand in a
way a generic fade never is, because the rule was already the design.

### 3. Staggered card entry

`.card`, `.person`, `.rec__item`, `.svc__item`. `translateY(16px) → 0` plus
`opacity .35 → 1`, `animation-range: entry 5% cover 25%`.

Stagger without JS, via the existing markup:

```css
.cardgrid li:nth-child(2) { animation-delay: 60ms; }
.cardgrid li:nth-child(3) { animation-delay: 120ms; }
```

16px, not 40px. At 40px it reads as a template. At 16px it reads as the page
settling.

### 4. The four figures wipe, they do not count

`$110M+`, `20%+`, `8`, `40+` on the home page. `clip-path: inset(0 0 100% 0)`
to `inset(0 0 0 0)` as the band enters view, 240ms apart left to right.

Explicitly **not** a counting animation. `project-info` bans animated counters,
and it is right to: a number that spins is a number the audience stops
believing. A wipe reveals the figure, it does not perform it.

### 5. Hero scrim deepens with scroll

`.heromedia__scrim` opacity from its current value to ~0.9 across the first
viewport, `animation-timeline: scroll(root block)`, `animation-range: 0 100vh`.

Direction G already proved this reads well. Here it does double duty: it is the
reason the interior-page headline stays legible once the page moves.

### 6. Hero video parallax

`.heromedia__video` `translateY(0 → -6%)` over the first viewport. Six percent,
not twenty. Enough to separate the plate from the type, not enough to notice as
an effect.

### 7. Footer watermark drift

`CAPRAE TECH` translating ~40px horizontally on `view()` as the footer enters.
Slow, one axis, no rotation.

## The one piece of JavaScript worth adding

**Cross-route view transitions.** H is a five-page routed site whose route
change is currently a hard cut plus `scrollTo(0, 0)`.

`react-router-dom@7.18.4` is already installed and the `viewTransition` prop is
stable in v7. The whole change:

```jsx
<Link to="/services" viewTransition>All services</Link>
```

plus a `::view-transition-old/new(root)` cross-fade in CSS, plus
`view-transition-name` on the hero plate so the footage stays put across the
navigation instead of blinking.

That last part is the payoff. The hero is now the same footage on every tab, so
a shared-element transition makes the video look continuous while the page
around it changes. Nothing else on this list buys that much for eight lines.

Firefox has not shipped it; there it stays a hard cut, which is today's
behaviour. Zero risk, zero bytes.

## The WebGL slot: spend it subtracting, not adding

H carries **25.4MB of video** — 11.1MB hero, 14.3MB footer — against an LCP
budget of 2.0s on throttled 4G. That budget is already lost, and stacking a
shader on top of it would be the decoration a template adds.

So the WebGL proposal is a swap, not an addition:

**Replace the 14.3MB footer video with a fragment shader.** One full-screen
quad, one draw call, a slow flow in the flame hue seeded by scroll offset.
OGL's core is 8KB gzipped and for a full-screen shader the scene graph and
camera can be dropped entirely, so this lands near 5KB.

- −14.3MB, +5KB
- The footer stops being stock footage and starts being something only this
  team could have put there, which is the entire thesis of the site
- Render at 0.5x resolution and upscale; integrated graphics will hold 60fps on
  a single fragment-bound quad
- Guard with `prefers-reduced-motion` and a static gradient fallback

If a shader in the footer is the wrong place, the second candidate is the
figures band on Home. But the footer is where the byte argument is.

## What I would not do, and why

The scroll-animation ecosystem in 2026 will happily sell all of these. Each one
collides with something this project already decided.

| Option | Verdict |
|---|---|
| **Lenis** momentum scroll (3KB) | Conflicts with the project's no-scroll-jacking rule. Lenis is the honest one — native scroll, sticky and Intersection Observer keep working, the scrollbar is real — but it still intercepts the wheel and retimes the scroll. A 60-year-old on a work laptop notices that their mouse feels wrong before they notice it feels smooth. **Your call, but I would decline.** |
| **GSAP ScrollTrigger** pinning | Banned outright by the project: no pinned sections that trap the user. GSAP itself went free in April 2025, but `bun add gsap` is broken on this machine (D-040) and would have to be vendored from CDN. ~70KB gzipped to do what `view()` does in zero. |
| **Animated counters** | Banned in `project-info`. See §4. |
| **Card stacking on scroll** | Needs pinning. Same ban. |
| **Scrubbed word-by-word text reveal** | Makes the buyer scroll to finish a sentence. This audience skims for proof. |
| **Magnetic cursor / custom cursor** | Reads as agency showreel. Wrong signal for a firm selling engineering to bankers. |

The `gpt-taste` skill was consulted for this and pushed toward pinned sections,
`py-32 md:py-48` cinematic spacing, and scrubbed text reveals. Three of its core
moves are banned here and a fourth contradicts the density rule, so it
contributed the motion catalogue and nothing else. Naming the conflict rather
than quietly picking a side, per the project brief.

## Budget

| | Now | After |
|---|---|---|
| JS, gzipped | 88.4 KB | ~88.5 KB (view transitions), ~94 KB with OGL |
| Video | 25.4 MB | 11.1 MB |
| Budget ceiling | 200 KB JS gz | unchanged |

Everything in the spine is 0 KB. The only bytes on this list buy back 14MB.

## Order to build

1. Navbar backdrop and gap tightening — the defects
2. Reading hairline — one div, biggest perceived change
3. Rules and card entry — the bulk of "the page is alive now"
4. Figures wipe, hero scrim, hero parallax, footer drift
5. View transitions across routes
6. Footer shader, replacing the video

Steps 1–4 are one CSS file and no dependencies. Stop there if the result is
already enough.
