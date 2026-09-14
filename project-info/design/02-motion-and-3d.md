# 02. Motion and 3D

Where motion goes, what builds it, and what it is not allowed to cost.

Nothing here is decided. This is the option set for the decision recorded in
`DECISION.md`.

## Candidate stack

### 3D and WebGL

| Tool | Good for | Cost |
|---|---|---|
| **Three.js + React Three Fiber** | Full control, custom geometry and shaders, the credible choice for a site selling engineers | Largest bundle, most build time |
| **Spline** | Fast to produce, designer-friendly, embeds cleanly | Heavy runtime, a designer tool rather than an engineering one, and that shows |
| **Raw WebGL / GLSL shader** | A single striking full-bleed effect at tiny weight | Narrow, needs shader skill |
| **CSS 3D transforms** | Depth and parallax with near-zero cost | Not actually 3D, ceiling is low |

Leaning: React Three Fiber for the one hero moment, CSS transforms everywhere
else. On a site whose product is engineering talent, hand-written Three.js is
part of the pitch in a way that an embedded Spline scene is not.

### Scroll and animation

| Tool | Good for | Note |
|---|---|---|
| **GSAP + ScrollTrigger** | Precise scroll choreography, timelines, pinning | The `gpt-taste` skill is built around exactly this |
| **Framer Motion** | React component transitions, layout animation, gestures | Natural fit if the site is React |
| **Lenis** | Smooth scroll | Use with care. Smooth scroll is the most common way to make a page feel broken to a 60-year-old on a trackpad |
| **CSS scroll-driven animations** | Reveals, progress effects, zero JS | Native, cheap, well supported now. First choice for anything simple |
| **Lottie** | Vector motion, icons, small loops | Good for detail, wrong for hero |

Leaning: native CSS scroll-driven animation for reveals, GSAP ScrollTrigger
reserved for the one or two choreographed moments. Skip Lenis unless there is a
specific reason, and if it goes in, it must be disabled under
`prefers-reduced-motion`.

## Where motion goes

Four places. Everything else is static.

**1. Hero, contained 3D.** Sits beside the headline. Does not push the CTA below
the fold. Loads progressively with a static poster frame first so the page is
readable before the canvas is ready. Idle animation only, no scroll dependency.

**2. Work section, the flex.** This is the one place to spend. Four live
products with real URLs. The interaction should make a visitor want to click
through to SaaSquatch Leads or Cold Call Killers. Showing off here is the
argument, not decoration.

**3. Section reveals.** Restrained. Short distance, short duration, on entry
only, never repeating. Native CSS where possible.

**4. Micro-interactions.** Button, link, form field, card hover. Fast, under
150ms. These carry more perceived quality per byte than any hero effect.

## Where motion does not go

- Behind body copy
- Anything that moves while the user is reading
- Scroll-jacking, wheel hijacking, pinned sections that trap the user
- Animated numeric counters, the single most-copied pattern on the internet
- Page transitions that delay the CTA
- Parallax on the primary CTA

## Performance budget

Hard limits. A slow site from a technical vendor refutes its own claim.

| Metric | Budget |
|---|---|
| Largest Contentful Paint | under 2.0s on 4G |
| Cumulative Layout Shift | under 0.05 |
| Interaction to Next Paint | under 200ms |
| Total JS, initial | under 200KB gzipped |
| 3D bundle | lazy-loaded, outside the initial payload |
| Hero readable | before any canvas initialises |
| Frame rate | 60fps on integrated graphics, not just on a dev machine |

The 3D element must be lazy, deferred, and must never block first paint. If it
cannot hit these numbers, it gets cut. The proof section survives without it.
The speed does not survive without the budget.

## Degradation path

Three tiers, all of which must be a good page.

1. **Full**: 3D hero, scroll choreography, micro-interactions
2. **Reduced motion**: static hero image, instant reveals, micro-interactions
   only. Triggered by `prefers-reduced-motion`. Must read as deliberate, not broken
3. **No JS or WebGL unavailable**: static hero, all copy, all proof links, working
   CTA. Still converts

Tier 3 is the real test. If the page is worthless without WebGL, the content is
too thin.

## Verification

Motion claims get checked in a browser, not asserted.

- `browse` or `qa` skills to drive the real page
- Lighthouse against the budget above, on throttled 4G
- Test at 400px width and at 1920px
- Test with `prefers-reduced-motion: reduce` forced on
- Test on a machine without a discrete GPU

## Open

- Which 3D tool, Q24
- Whether smooth scroll goes in at all, Q25
- What the hero 3D element actually depicts, Q26. This is a content question,
  not a technical one, and it is unanswered. An abstract blob is the default
  failure. It should mean something: deal flow, a network, a pipeline, data.
