# Dala: studio, stack, and comparable sites

Researched 2026-09-29. "Observed" means read directly from the live site with curl on that date. Everything else carries a URL.

## 1. Who built Dala

### Studio

- `craftedbygc` is Green Chameleon, a Bristol studio that rebranded to **Unseen Studio** (announced Nov 2022). Social handles moved to `@uns__nstudio`, the X handle `@craftedbygc` redirects. Sources: https://unseen.co/ (footer links), https://medium.com/unseenstudio/green-chameleon-has-evolved-db2861e11845, https://bristolcreativeindustries.com/members/green-chameleon/, https://www.instagram.com/craftedbygc/
- Founder quote, "started right after university": https://www.topinteractiveagencies.com/digital/agency/leaders/tom-anderson-we-always-try-to-create-something-refreshingly-unexpected/ (Tom Anderson, co-founder and creative director per that interview).
- Unseen's own case study: https://unseen.co/projects/dala/ . Dated Winter 2021. Services listed: Branding, CGI, Website Design, WebGL, Development. It says "a WebGL particle system for Dala which sits at the epicentre of the website", with the fragments "morphing them to form different visual metaphors". No individual names on that page.

### People

- **Mathis Biabiany** (French creative technologist, freelance, Switzerland) is the credited collaborator on both Awwwards and CSSDA. Sources: https://www.awwwards.com/sites/dala, https://cssdesignawards.com/sites/dala/40151/
- His portfolio lists Dala tagged **"WebGL / Houdini"**: https://www.mathis-biabiany.fr/ . This is the only public source tying Houdini to Dala. Whether Houdini produced the point data or only the CGI stills is unconfirmed.
- **Ash Thornton**, Lead Creative Developer at Unseen, author of ASScroll (used on Dala): https://github.com/ashthornton . His involvement in Dala specifically is unconfirmed.
- Split of work (who wrote the particle simulation vs the site shell) is unconfirmed. No dev talk, blog post, or tweet thread about Dala's tech was found.

### Awards and posts

| Where | Result | URL |
|---|---|---|
| Awwwards | SOTD, 25 Dec 2021. Dev 7.85, Animations 8.60, WPO 8.20, Accessibility 7.40 | https://www.awwwards.com/sites/dala |
| CSS Design Awards | Website of the Day, 4 Dec 2021, judges 8.00 | https://cssdesignawards.com/sites/dala/40151/ |
| FWA | SOTD claimed by Unseen. FWA entry not located (fwa.com now redirects elsewhere), so unconfirmed independently | https://unseen.co/projects/dala/ |
| One Page Love | Feature, claimed by Unseen, not checked | https://unseen.co/projects/dala/ |
| Dribbble | 3 shots, Jan to Feb 2022 (site, early brand/web concepts, business cards) | https://dribbble.com/unseenstudio/projects/5419063-Dala |
| YouTube | "web ignite ~ 91" screen recording, third-party | https://www.youtube.com/watch?v=EDM0cm399b0 |
| Behance, LinkedIn, Codrops | No Dala-specific post found | https://www.behance.net/unseen-studio |

### Dala's tech, observed in the shipped bundle

Files: `https://dala.craftedbygc.com/scripts/vendor.js` (696 KB raw), `theme.js` (266 KB raw), `mix-manifest.json`.

- **three.js** with GLTFLoader, DRACOLoader, KTX2Loader (basis transcoder path), EXRLoader, EffectComposer, UnrealBloomPass.
- **GPGPU particle sim**: two ping-pong passes named `_simulationPos` and `_simulationSpring`, uniforms `t_position`, `t_oTarget`, `t_velocity`, `t_params`. Render target is **200 x 200 = 40,000 particles**, full float on desktop and a lower-precision type on mobile (`type: isDesktop ? A : B`).
- **Shape targets are baked textures, not runtime mesh sampling**: `/images/pos-33.exr` (position), `/images/sc-33.png` (scale), `/images/cd-33.png` (colour), plus `pos.png`, `sc-8.png`, `cd-8.png`. Texture ids are `cone_position_exr`, `cone_scale`, `cone_color`. Consistent with a Houdini point export (unconfirmed).
- **Geometry**: `pyramid.glb`, `piramed-faces.glb`, `piramed-lines.glb`, 8 LODs `py-lod0..7.glb`, and `py-monbile.glb` (mobile).
- **Bokeh**: BokehPass with BokehShader2-style params (`focalDepth .125, focalLength 27, fstop 2509, maxblur 10`), bloom `threshold .159, strength .4, radius 1`. Background uses `dof-2k-*.jpg` pre-blurred plates and `noise.jpg`, `gradient-noise.jpg` for a two-blob gradient shader (`uPosA`, `uPosB`, `uColorA`, `uColorB`).
- **Scroll**: ASScroll (`asscroll-container` in the HTML) plus GSAP ScrollTrigger.
- Fonts: PP Neue Montreal, Acronym.

## 2. The studio's stack

### Is Laravel their standard?

No. Their standard is **Laravel Mix** (the webpack wrapper), used as a build tool only. The PHP Laravel framework was not observed on any site.

- Dala: `manifest.js?id=`, `vendor.js?id=`, `theme.js?id=` plus a `mix-manifest.json` at the root. The HTML is a static file: `content-type: text/html`, a `last-modified` header, no session or XSRF cookies, `/index.php` returns 404. Server `nginx-rc` (the RunCloud nginx build). Observed.
- unseen.co: **WordPress**. Same Mix trio under `/wp-content/themes/unseen/public/scripts/`, ASScroll present. WP REST exposes a `project` post type (`/wp-json/wp/v2/project`). Observed.
- lewahouse.com: WordPress, same Mix trio under `/wp-content/themes/lewa/public/scripts/`, ASScroll. Observed. Unseen case study: https://unseen.co/projects/lewa-house/
- organimo.com: WordPress + WooCommerce, `data-taxi` attributes (Taxi is Unseen's own PJAX library). Observed. Case study: https://unseen.co/projects/organimo/
- bluemarinefoundation.com: WordPress, jQuery, Lottie. Observed. Build authorship by Unseen assumed from https://unseen.co/projects/blue-marine-foundation/ , current theme not confirmed as theirs.
- 2018.craftedbygc.com (Awwwards SOTM, https://www.awwwards.com/2018-year-in-review-by-green-chameleon-wins-site-of-the-month-march.html): plain webpack chunks `npm.three.*.js`, `npm.gsap.*.js`. Observed. Source: https://github.com/craftedbygc/2018-in-review
- Recent work is on other stacks: blueyard.com is **Nuxt on Netlify**, illoca.com is **Nuxt**. Observed. Whether Unseen built the current versions of those two is inferred from their case study list, not confirmed. Superlist, Contra, and Quai now run on Framer or Next.js, likely not Unseen's build (unconfirmed).

Pattern: WordPress (or static HTML) + Laravel Mix + three.js + GSAP + ASScroll + Taxi, 2019 to about 2023. Nuxt appears later. No evidence of Laravel doing anything server-side.

### Their open source (github.com/craftedbygc)

Observed via `api.github.com/orgs/craftedbygc/repos`: `taxi` (PJAX transitions), `e` (event bus), `backstage` (motion design editor, TypeScript), `fsv` (fast scrubbing video format), `three-fluid-fx`, `stylized-webgl-components` (Next.js + R3F), `organimo-clouds-rnd`, `kikk-24-generator` (GLSL), `theatre-website`. ASScroll lives on Ash Thornton's account and is archived: https://github.com/ashthornton/asscroll

## 3. Comparable sites: particle clouds that change shape

Only Elimar and Dala are confirmed as "same cloud, new shape, driven by scroll". The rest are close relatives, with the trigger noted.

| # | Site | Built by | Award | Trigger | Stack | Sources |
|---|---|---|---|---|---|---|
| 1 | https://elimar.lmigroupintl.com/ | OddCommon | Awwwards SOTD 22 Apr 2025 | Scroll. One point cloud morphs between portrait, starfield, near-IR canvas texture, other artworks | Next.js on Vercel (observed), WebGL | https://www.awwwards.com/sites/elimar, https://www.webgpu.com/showcase/elimar-van-gogh-particle-system/ |
| 2 | https://www.igloo.inc/ | Abeto with Bureaux | Awwwards SOTD 23 Jul 2024 | Click on link section forms different models. Scroll drives the rest of the site | three.js, three-mesh-bvh, Svelte, GSAP, Vite, Houdini, Blender, custom VDB exporter | https://www.awwwards.com/sites/igloo-inc, https://www.awwwards.com/igloo-inc-case-study.html |
| 3 | https://le-voyage-azarien.art/ | Joseph Azar, Félix Péault | Awwwards SOTD + Developer Award | LiDAR-scanned scenes as morphing particles, trigger not documented | React (Create React App chunks observed), three.js, GLSL | https://www.awwwards.com/sites/le-voyage-azarien, https://www.awwwards.com/inspiration/le-voyage-azarien-immersive-experience-with-morphing-particles-3d-scans-of-scenes |
| 4 | https://www.mathis-biabiany.fr/ | Mathis Biabiany (Dala's WebGL collaborator) | Awwwards SOTD (earlier version), FWA SOTD | Earlier version: 2^18 particles form images with a tunnel transition between them. Current version: WebGPU strand systems | Nuxt on Vercel (observed), three.js | https://www.awwwards.com/sites/mathis-biabiany-portfolio, https://thefwa.com/cases/mathis-biabiany-portfolio, https://tympanus.net/codrops/2020/10/26/particles-image-animation-from-mathis-biabianys-website/ |
| 5 | https://everstride.ch/ | Gridonic | Awwwards Nominee only | Scroll, 3D particle object | Nuxt (observed), DatoCMS | https://www.awwwards.com/sites/everstride, https://www.awwwards.com/inspiration/3d-particle-object-on-scroll-animation-everstride, https://www.datocms.com/partners/gridonic/showcase/everstride |
| 6 | https://colorver.se/ | Studio JT (Korea) | No award found | Scroll, particles morph via custom shader and morph targets | three.js, GLTF. Site did not respond on 2026-09-29 | https://discourse.threejs.org/t/colorverse-website-particles-morphing-on-scroll-with-custom-shader/43847 |
| 7 | https://www.untillabs.com/ | basement.studio | Awwwards Honorable Mention 22 Nov 2025 | Not a morph. Photo rebuilt as 60k fBM-driven particles, point cloud packed into ~604 KB of textures | Next.js, three.js, R3F, Vercel (observed) | https://www.awwwards.com/sites/until-labs, https://tympanus.net/codrops/2025/12/10/simulating-life-in-the-browser-creating-a-living-particle-system-for-the-untillabs-website/ |

Unconfirmed: a search summary said Until Labs won SOTD on 9 Sep 2026. The Awwwards page shows Honorable Mention, which is what the table uses.

Tutorials for the same technique: Three.js Journey "Particles Morphing Shader" (https://threejs-journey.com/lessons/particles-morphing-shader) and Codrops "Crafting a Dreamy Particle Effect with Three.js and GPGPU" (https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/).

## 4. What Dala is

An AI workplace search tool that finds "anything or anyone from any workplace system" (https://www.awwwards.com/sites/dala). Whether the product still exists is unconfirmed.
