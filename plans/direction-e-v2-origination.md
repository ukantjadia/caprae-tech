# Plan — Direction E v2, ORIGINATION on Three.js, multi-screen

Date: 2026-09-15
Contract: `design-isperiation-prompts/adapted-prompts/01-orrery-to-caprae.md`
Supersedes the renderer and layout clauses of D-026.

## Decisions taken by the owner, 2026-09-15

1. Multi-page, not one long page. Q16 answered: four screens.
2. Move the field from raw WebGL2 to Three.js.
3. Amend D-015 to permit an exposure/tone roll-off pass. Bloom, glow and blur
   stay banned.

## What is being given up, stated once

E v1 is 12.8KB gzipped, no library, no build step, and "hand-written WebGL is
itself part of the pitch" was D-007's reasoning. Three.js is ~170KB gzipped.
That argument leaves E. Mitigation: the 3D chunk lazy-loads and never blocks
first paint, same as Direction F. E v1 is archived and stays runnable so the two
can be compared rather than one silently replacing the other.

## Screens

| Route | Carries |
|---|---|
| `/` | Hero, the field at full strength, the wedge |
| `/work` | The record, four products |
| `/team` | Who they report to, how it works |
| `/contact` | Firm figures, contact |

The canvas is ONE instance that survives navigation via `<ClientRouter />` and
`transition:persist`. Route change re-targets the camera and the focal plane; it
does not tear down or re-seed the field. Same seed, same bodies, continuous
clock. That continuity is the reason to be multi-page at all.

## Build order

1. Archive E v1 to `designs/_archive/direction-e-origination-v1/`.
2. Astro project, four routes, shared layout, ClientRouter, copy ported verbatim
   from v1 including every provenance mark and firm-wide label.
3. Port the field to Three.js: same attributes, same cycle law, same stage
   weights, same five bands, same dropAt skew. Position stays a PURE FUNCTION of
   (attributes, time). No GPGPU, no transform feedback, no simulation state.
   - verify: stage distribution still 8/12/15/48/17 within one point
   - verify: cycle law still monotonic, small deals ~2.6x faster
4. Tier 1 rendering:
   - velocity-stretched streaks, instanced quads oriented along analytic velocity
   - depth of field from circle of confusion, focal plane driven by scroll/route
   - resolved path as a tapering camera-facing ribbon with a travelling head
5. Exposure roll-off pass, half res, behind a flag so both can be screenshotted.
6. Hover picking against the ~420 survivors, CPU side, analytic. Readout shows
   band, cycle length, stage.
7. Tier 3 substrate: faint in-shader reference plane.
8. Verify at 390 / 768 / 1440 / 1920, plus reduced-motion and no-JS tiers.

## Rules that do not move

- CTA above the fold on every route and every breakpoint.
- Only [VERIFIED] copy. Four products, never eight. Firm figures keep their
  scope label. Every number keeps its inline provenance mark.
- Three tiers must each be a good page. Reduced motion ships no three.js.
- No bloom, no glow, no blur, no gradients on surfaces, no cards.
- No wheel hijacking, no smooth-scroll library, no pinned section that traps.
- Body text 17px minimum.

## Open

- Frame rate on integrated graphics and LCP on throttled 4G remain unmeasured
  across every direction. This build should be the one that fixes that.
