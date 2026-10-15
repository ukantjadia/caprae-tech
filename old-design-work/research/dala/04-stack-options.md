# 04. Stack options for a Dala-level build

Checked 2026-09-29. Dala is https://dala.craftedbygc.com/.

## 1. What this repo has now

**Stack in use.** There is no single stack. D-005 is still marked open. D-020
chose Astro with React islands, and directions B to F and "next-four" are Astro.
The newest directions left Astro:

| Direction | Build | 3D |
|---|---|---|
| H3 | Vite 8 + React 19 | OGL shader in the footer (D-045) |
| R (latest, `designs/direction-r-resend-structure/code`) | Vite 8 + React 19 + Tailwind v4 | three 0.186.1, vanilla, no R3F |
| F | Astro + React 18 | R3F 8 + drei 9, the only R3F build |
| E-variants | Astro | three in a Web Worker on OffscreenCanvas (D-039) |

So option (d) as written, "React Three Fiber, our current direction", does not
match the repo. The current direction is Vite + React for the page and
hand-written three.js for the scene. R3F appears once, in F.

Hosting: GitHub Pages, one static gallery built by
`.github/workflows/deploy-pages.yml` with `bun install` and
`bun run build:pages`. No server anywhere.

Tooling constraints on record:

- D-040: `bun add gsap` writes 116 of 118 files as NUL bytes on this machine.
  GSAP must be vendored from the CDN if used. `three` and `ogl` install clean (D-046).
- D-013: no smooth-scroll library. D-043: scroll motion goes in native CSS
  `animation-timeline`.
- D-023/D-025: the scrub is written directly, scroll position polled per frame.

**Reusable for 3D.**

| Piece | Where | What it gives a Dala rebuild |
|---|---|---|
| Shared-context engine | `direction-r-resend-structure/code/src/three/engine.js` | One `WebGLRenderer`, `powerPreference: 'low-power'`, DPR capped at 1.5, pause offscreen and on hidden tab, one still frame under reduced motion |
| Lazy view wrapper | `direction-r-resend-structure/code/src/three/View.jsx` | WebGL2 check, IntersectionObserver with 400px margin, dynamic `import()` of the engine, SVG fallback cross-faded out. Initial JS 80KB gzip, engine chunk 137KB gzip (D-051) |
| Worker renderer | `direction-e-variants/code/src/fields/field.worker.js`, `mount.js` | three on OffscreenCanvas in a Worker, scroll sent as one message per frame (D-039) |
| Scroll scrub | Directions D, E (D-022, D-025) | Progress as a pure function of scroll, damped, reverse-safe, no GSAP |
| three addons | already in `node_modules/three@0.186.1` | `misc/GPUComputationRenderer.js` (the GPGPU FBO sim), `shaders/BokehShader2.js`, `postprocessing/BokehPass.js`, `loaders/EXRLoader.js`, `GLTFLoader.js`, `DRACOLoader.js`. Every loader and shader Dala uses ships with the version we already have |

Nothing new needs installing to reproduce Dala's 3D pipeline.

## 2. What Laravel is doing on Dala

Evidence, from `curl` on 2026-09-29:

- Response is `content-type: text/html` with a fixed `last-modified: Tue, 05 May 2026`. That is a file on disk, not a rendered view.
- No `Set-Cookie`. A Laravel app on its default `web` middleware sets
  `laravel_session` and `XSRF-TOKEN` on every response. Neither is present.
- No `<form>` on the page.
- Assets are `/scripts/manifest.js?id=…`, `/scripts/vendor.js?id=…`,
  `/scripts/theme.js?id=…`, `/css/style.css?id=…`. The `?id=` hash is
  `mix.version()`, the manifest/vendor split is `mix.extract()`.
- Server header is `nginx-rc`, RunCloud's nginx build.

Conclusion: Laravel Mix is present, the Laravel framework probably is not. Mix
is a webpack config wrapper that runs standalone without Laravel. Dala is
webpack output served as static files by nginx. The site gets nothing from
Laravel at runtime.

## 3. Options compared

| | (a) Laravel + Mix + ASScroll + three | (b) Laravel + Vite + Lenis + three | (c) Vite + vanilla three + GSAP + Lenis, static | (d) Vite + React + three (R3F or vanilla) |
|---|---|---|---|---|
| Maintenance 2026 | Mix: last release 6.0.49 on 2022-06-09, repo last pushed 2024-01-24. Laravel moved new apps to Vite in 9.19 (2022); the Laravel 13 skeleton ships `vite ^8` and `laravel-vite-plugin ^3.1`, no Mix. ASScroll: archived 2023-08-09, last release 2.0.11 on 2022-07-10, README tells users to switch to Lenis | Laravel 13 current. Vite 8.3.1 released 2026-09-24. Lenis 1.3.26 released 2026-08-05 | Vite 8.3.1, three 0.186.1 (2026-09-24), GSAP 3.15.0 (2026-04-13), Lenis 1.3.26. All active | three 0.186.1, R3F 9.8.1 (2026-09-24). Active |
| What it gives | A byte-level match of Dala's toolchain | PHP backend: routes, Blade, form validation, mail, CSRF, queues. A CMS if Filament or Statamic is added | Dala's runtime with a current bundler | What (c) gives, plus React for the page, the Tailwind/token system and components already in R, and `content.json` wiring |
| Cost | Webpack 5 builds, a dead dependency on the scroll path, a PHP host for no runtime purpose | A PHP host and its upkeep (patching, deploys, a server for a mostly static page). A second language in the repo | Rewrite of the page shell that R already has. GSAP must be vendored (D-040) | R3F adds a reconciler and a second mental model on top of three. Vanilla three inside React (what R does) avoids it |
| Fit for a static marketing site | Poor. Unmaintained parts, no benefit over (c) | Only if the site needs server-side forms or a CMS. Neither is asked for now | Good | Good. Already built and deployed |
| Hosting | PHP host (RunCloud on a VPS, Forge). Not GitHub Pages | PHP host (Forge, Laravel Cloud, VPS). Not GitHub Pages | Any static host, current GitHub Pages workflow unchanged | Current GitHub Pages workflow unchanged |

**What Laravel would add for us.** Contact form handling with validation, CSRF
and outbound mail; a CMS through Filament or Statamic so non-engineers edit
copy; server-side analytics or lead routing. None of these is an open
requirement in `project-info/`. A single contact form does not need a PHP
server: a form endpoint service or a small serverless function covers it and
keeps static hosting. If a CMS becomes a requirement, Laravel becomes worth its
host. Until then it is a build wrapper, which is the only role it has on Dala.

**On Lenis.** It is the maintained replacement for ASScroll and the one its own
author recommends. It is still a smooth-scroll library: it retimes the wheel.
D-013 and D-043 rejected it for this audience. Dala's particle morph is driven
by scroll progress, which native scroll supplies. Smooth scroll is part of
Dala's feel, not part of its effect.

## 4. Project rules against a Dala-level build

Dala measured live (coordinator, 2026-09-29): Intel UHD integrated GPU, canvas
1503x680 at DPR 1.25, 36 to 38 fps. Transfer about 1.75MB: JS 245KB, images
1.3MB, fonts 152KB, EXR 275KB, GLBs 9KB. The GLBs are the per-particle pyramid;
the brain shape comes from the EXR. DOMContentLoaded 2.1s, load 3.6s, CLS 0. CTA
above the fold. A preloader hides content for about 2s.

| Rule | Dala as shipped | Can the effect meet it | Real risk |
|---|---|---|---|
| 60fps on integrated graphics | Fails, 36 to 38 fps on Intel UHD | Probably, by cutting pixels: DPR cap 1.0 on low-power GPUs, render the DOF pass at half resolution, fewer particles (sim texture 256² instead of larger). Not verified until measured | DOF (BokehShader2) is a full-screen multi-tap pass per frame; it is the most likely cost. The particle count Dala uses is unmeasured. If 60fps needs too few particles, the brain shape reads as sparse |
| LCP under 2.0s on 4G | Likely fails: the preloader hides content for about 2s, so the LCP element paints after it | Yes, if the preloader goes. Text and CTA paint first, canvas fades in over a poster, as R already does | The preloader exists so the particle field appears fully formed. Without it the field has to assemble on screen, which is a design problem, not a performance one |
| Initial JS under 200KB gzip | Fails on transfer: 245KB JS before assets | Yes. R's shell is 80KB gzip, the three engine loads as a lazy chunk (137KB gzip in R) after first paint | The lazy chunk grows with GPUComputationRenderer, EffectComposer and EXRLoader. Budget counts initial JS only, so this passes the rule, but it is still bytes on a 4G link before the effect runs |
| CLS under 0.05 | Passes, CLS 0 | Yes | None, if the canvas box is sized in CSS before the engine loads |
| CTA above the fold | Passes | Yes | None |
| No scroll-jacking (D-013, D-043) | ASScroll smooths the wheel, which the project counts as scroll-jacking | Yes, drop smooth scroll and drive the sim from native scroll progress | Loss of Dala's gliding feel. The effect survives, the feel changes |
| Three tiers: full, reduced motion, no-JS | Not measured on Dala. The preloader suggests no-JS gets little or nothing | Yes. R's pattern: SVG or poster fallback under the canvas, one still frame under `prefers-reduced-motion`, copy in the HTML | A still frame of a particle brain may read as a stock render. The poster needs art direction of its own |
| GSAP (D-040, not a rule but a constraint) | Dala uses GSAP 3.11 + ScrollTrigger | Yes: vendor GSAP 3.15.0 from the CDN, or keep the native scrub from D-025 | Pinning is ScrollTrigger's main use on sites like Dala, and pinned traps are banned. Without pinning, GSAP is only a timeline helper |
| Audience 50+ on work laptops | Dala targets a design-award audience | Yes, within the fps and preloader changes above | Work laptops may have hardware acceleration off or WebGL blocked by policy. The no-WebGL tier is the page they see |

## 5. Recommendation

**Keep (d) as it exists in R: Vite + React for the page, vanilla three.js for the
scene (no R3F), native scroll, GSAP only if vendored, static on GitHub Pages.**
Every Dala technique (GPGPU sim, Bokeh DOF, EXR and DRACO loaders) is already in
the installed three 0.186.1, R already solves lazy loading and the three tiers,
and Laravel on Dala is only a webpack wrapper we would pay a PHP host to copy.

Revisit Laravel (option b) only if a CMS or server-side lead handling becomes a
requirement.

## Sources

- ASScroll repository, archived 2023-08-09, README recommends Lenis: https://github.com/ashthornton/asscroll
- Laravel Mix repository: https://github.com/laravel-mix/laravel-mix
- npm registry, release dates quoted above: https://registry.npmjs.org/laravel-mix, https://registry.npmjs.org/@ashthornton/asscroll, https://registry.npmjs.org/lenis, https://registry.npmjs.org/three, https://registry.npmjs.org/gsap, https://registry.npmjs.org/@react-three/fiber, https://registry.npmjs.org/vite
- Laravel skeleton `package.json` (Vite 8, laravel-vite-plugin 3.1, no Mix): https://github.com/laravel/laravel/blob/master/package.json
- Laravel Vite docs: https://laravel.com/docs/12.x/vite
- Mix to Vite migration guide: https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md
- Vite as default since Laravel 9.19: https://laravel.com/framework/docs/9.x/vite, https://christoph-rumpel.com/2022/6/moving-a-laravel-webpack-project-to-vite
- Lenis repository: https://github.com/darkroomengineering/lenis
- Dala response headers and asset URLs: `curl -sI https://dala.craftedbygc.com/`, run 2026-09-29
