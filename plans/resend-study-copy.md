# Plan: Resend study copy (private, local only)

Goal: a runnable local copy of resend.com's homepage, built on the Refero exports in
`styles-refreo/resend/`, with the same 3D. Later it gets rebranded into the Caprae site.

## Where and what

- `study/resend/`: Vite + React + Tailwind v4. Gitignored, never deployed.
- Theme: `styles-refreo/resend/tailwind-v4.css` + `variables.css`, imported unedited.
- Fonts: Resend's own woff2 files, loaded from resend.com at runtime.
- 3D: the hero loads Resend's own Spline scene (`/static/cube.splinecode`) with
  `@splinetool/runtime`, with `cube.mp4` as the fallback. Section icons are their MP4 loops.
  All media is fetched from resend.com at runtime, and none of it is copied into the repo.
- Reference: `study/resend/ref/` has per-section HTML, PNG screenshots and Resend's CSS
  (14 blocks, 1440px viewport).

## Build split (4 parallel agents, each owns its files)

| Agent | Blocks | Files |
|---|---|---|
| A | 00 header, 01 hero + Spline cube, 02 logo wall | Header, Hero, Logos |
| B | 03 integrate, 04 dev experience, 05 editor | Integrate, DevExperience, Editor |
| C | 06 beyond editing, 07 React email, 08 deliverability | BeyondEditing, ReactEmail, Deliverability |
| D | 09 quote, 10 control, 11 testimonials, 12 CTA, 13 footer | Quote, Control, Testimonials, Cta, Footer |

## Verify

1. Each agent: `node tools/shot.mjs NN` against `ref/block-NN.png` until close.
2. Integration: full-page screenshot next to `ref/full.png`, no console errors, `bun run build` passes.
3. Hero: Spline canvas renders; with reduced motion, the MP4 or poster shows instead.

## Later (not now)

Rebrand into Caprae: own cube (Three.js), own copy, own fonts. At that point the
Resend assets and fonts are removed.
