# Dala vs dala-caprae: differences to fix

Compared 2026-09-29. Source for Dala: its live DOM and `study/dala/theme.pretty.js`
(the scroll formulas in `_updatePosition`, `_updateRotation`, `_updateMobilePosition`).
Status: [ ] open, [x] fixed.

## 1. Page length and pacing ("empty scroll")

| | Dala | Ours |
|---|---|---|
| Page height | 8,391px = 12.3 screens | about 5 screens |
| Sections | 7, sized 1 / 1.5 / 3 / 1.5 / 1.5 / 2.3 / 1 screens | 4 × 1 screen |
| Scroll per shape change | a long hold, then a short sharp window | continuous, one change per screen |

Dala's section 2 is a 3-screen block of big manifesto statements with the particles
scattered as a background cloud behind them. That's the "empty scroll".

- [x] Rebuilt with Dala's rhythm: hero 1, intro 1.5, manifesto 3 (the four wedge points as big statements), work 1.5, how it works 1.5, people 2.3, contact 1. Page is now 12.1 screens (Dala 12.3).

## 2. Choreography: explode → hold → re-form

Dala drives everything from one number, `sectionProgress` = section index + fraction
scrolled through it. Every property is a sum of clamped ramps over short windows:

| sectionProgress | Dala does |
|---|---|
| 0 → 1 | brain slides right to left (x 3 → -4.5), turns -90°, grows |
| 1.1 → 2.2 | brain **explodes** into a screen-wide cloud |
| 2.2 → 2.7 | cloud holds behind the manifesto text |
| 2.7 → 3.0 | cloud **re-forms** as the lightbulb, left side |
| 3.3 → 3.5 | bulb → sphere, jumps to the right, turns 45° |
| 4.5 → 5.0 | sphere explodes again |
| 5.7 → 6.0 | cloud forms the logo, rises (y +1.75) above the footer |

Ours goes straight from shape to shape with a small bulge, and nothing ever scatters.

- [x] Section progress (ScrollTrigger per section, summed) plus the `BASE` + `RAMPS` table in `config.js`, using Dala's windows (1.1 to 2.2 explode, 2.7 to 3 re-form, 3.3 to 3.5 shape swap, 4.5 to 5 explode, 5.7 to 6 logo).
- [x] Explode scatters every particle to its own spot in a 22x12x12 cloud, staggered per particle.

## 3. Density

| | Dala | Ours |
|---|---|---|
| Particles | **10,000** desktop, 7,000 mobile (100×100 read from the 200×200 EXR) | 40,000 |
| Shape size | radius 4.35 at camera distance 10, fov 50: fills ~93% of half-height | radius 1.35 at distance 6, fov 35: ~71% |

Four times the particles in a smaller shape is why ours looks compacted and the
silhouette reads as a solid carpet.

- [x] 10,000 particles, radius 3.6 at camera distance 10 with fov 50, particle size 0.042. Individual pyramids now read, with gaps between them. Shape data 110KB gzip.

## 4. Blur

Dala's background dust is soft, but its shapes stay crisp and readable, even the parts
further back. Ours blurs the shape's far half and blurs the dust too heavily.

- [x] In-focus band +-3.8 (the shape radius), background blur max 8px, near particles blur 2x harder, like a lens close up.

## 5. Formation is visible

On Dala you watch a shape assemble: particles fly in from the cloud over a noticeable
stretch of scroll, with the stagger spread across particles (`d * N` ≈ 5 on desktop).
Ours changes within a small scroll and completes too fast to follow.

- [x] Stagger 5. Shapes re-form from the cloud, so every particle is seen travelling in.

## 6. The logo as the last shape

Dala's 4th shape is its own logo (`dala-d.png`: quarter circle, square, arc), built from
particles above the footer CTA.

- [x] The last shape is a placeholder Caprae mark ("C" arc, radius halved, lifted above the CTA). **No Caprae logo file exists yet** (Q19, brand kit, is open), so a placeholder "C" arc stands in. Swap in the real mark as a GLB in `shapes/` when we have it.

## 7. Floating dust

Dala: 250 "front cones", clearly shaped, lightly blurred. Ours: 450, heavily blurred.

- [x] 250 dust particles, rescaled to the new camera.

## 8. Still to compare visually (needs the Chrome window in front)

Both tabs report `hidden`, so Dala never leaves its loading screen and nothing animates.
Once the window is in front: particle size and brightness, lighting, colour regions,
mid-transition look, mobile layout.

The earlier "mirror hang" in `study/dala/mirror` was the same thing: a hidden tab, not a broken copy.
