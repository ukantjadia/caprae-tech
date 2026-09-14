# Option 4, Editorial Hybrid: Architecture

## The bet

Light editorial base, identical content and structure to Option 1, plus exactly
one piece of real 3D: the deal-flow field in the hero (D-012).

If this beats Option 1, the 3D earned its place. If it does not, we learned that
for ~200KB and a week of work, which is cheap compared to finding out after
launch.

## Stack

Same as Option 1 except where the 3D forces a change.

| Layer | Choice | Delta from Option 1 |
|---|---|---|
| Framework | **Astro 5** | Same. Islands architecture is why this is viable |
| Styling | **Tailwind v4** | Same |
| Content | `../_shared/content.json` | Same file, same data |
| 3D | **React Three Fiber** + `three` | New. One island, `client:visible` |
| Motion | Native CSS + **GSAP ScrollTrigger** | GSAP for the work section only |
| Fonts | Self-hosted woff2 | Different faces, see `color-scheme.md` |

React is present only to host the R3F island. No other component uses it.

## Component tree

```
Layout.astro
├── Head
├── Nav
└── main
    ├── Hero
    │   ├── HeroCopy.astro          eyebrow, h1, sub, CTA, trust line
    │   └── DealFlowField.tsx       ← the only island. client:visible
    │       ├── poster.avif          static first frame, always painted first
    │       └── canvas               R3F, mounts after poster, after idle
    ├── ProofStrip
    ├── Wedge
    ├── People
    ├── Work                         GSAP ScrollTrigger, reveal only
    ├── Engagement
    ├── Refuse
    ├── Firm
    └── Contact
└── Footer
```

Same nine sections as Option 1. The only structural difference is the hero split
and the island inside it.

## The 3D island: how it stays cheap

This is the part that decides whether Option 4 is viable.

**Load order, strictly enforced:**

1. HTML and CSS paint. Hero copy and CTA are readable. **LCP fires here.**
2. A static `poster.avif` of the field occupies the panel. Correct aspect ratio,
   so CLS stays 0.
3. `client:visible` plus `requestIdleCallback` mounts the R3F canvas.
4. Canvas cross-fades over the poster in 400ms.

The 3D is never the LCP element. If step 3 or 4 never happens, the page is
complete and correct.

**Kill switches, any one of which stops at the poster:**

- `prefers-reduced-motion: reduce`
- `navigator.hardwareConcurrency < 4`
- `navigator.connection.saveData === true`
- WebGL context creation fails or is lost
- Tab not visible: `IntersectionObserver` plus `visibilitychange` pause the loop

**Geometry budget:**

| Item | Budget |
|---|---|
| Points | 2,000 to 4,000, single `BufferGeometry` |
| Draw calls | 2. One for the point field, one for the resolved path line |
| Materials | 2, both custom `ShaderMaterial` |
| Textures | 0 |
| Post-processing | None |
| Frame loop | `frameloop="demand"` where possible, capped 60fps |
| DPR | `[1, 1.75]` capped, not `window.devicePixelRatio` unbounded |

No `EffectComposer`, no bloom, no environment map. Bloom is where a 2,000-point
field turns into a 40fps page on integrated graphics.

**Bundle:** `three` core only, no `drei` unless a specific helper justifies it.
Target under 160KB gzipped for the island, lazy, outside the initial payload.

## Motion beyond the hero

GSAP ScrollTrigger, used for reveals and one staged sequence in the work
section. Rules that are not negotiable:

- No `pin`. No `scrub` on anything that traps scrolling.
- No smooth-scroll library. D-013 records this: Lenis and similar are the most
  common way a page feels broken to a 60-year-old on a trackpad.
- Every ScrollTrigger has `once: true`.
- All ScrollTriggers are killed under `prefers-reduced-motion`.

## Performance targets

Tighter than Option 1's actuals, because Option 4 has to justify the weight.

| Metric | Target | Fail condition |
|---|---|---|
| LCP, throttled 4G | under 2.0s | 3D counted as LCP element |
| CLS | under 0.05 | poster aspect ratio wrong |
| INP | under 200ms | frame loop blocking input |
| Initial JS | under 200KB gz | island not lazy |
| 3D island | under 160KB gz | `drei` pulled in wholesale |
| Frame rate | 60fps on integrated graphics | measured, not assumed |

**If the island misses its budget, the island is cut, not the budget.** Option 4
without the 3D is Option 1 with different type, which is still a valid page.

## Build commands

```
bun create astro@latest .
bun add -d @tailwindcss/vite tailwindcss
bun add three @react-three/fiber react react-dom gsap
bun astro add react
bun run build
```

## Risks

- **Risk:** the field reads as decorative anyway. Mitigation is in the motion.
  Particles must visibly *resolve* into a path, not drift. If it does not read as
  deal flow in three seconds it has failed and becomes a blob, which is D-012's
  named failure mode.
- **Risk:** four WebGL contexts in the gallery grid. Handled by the gallery,
  only one context live at a time.
- **Risk:** scope creep into Option 3. Hard line: one island, one hero, no
  second 3D moment anywhere on the page.
