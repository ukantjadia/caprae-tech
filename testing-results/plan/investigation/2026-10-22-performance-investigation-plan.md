# Investigation and fix plan: capraetech.io performance and accessibility

Based on `../../analysis/README.md` (the verdict) and its four reports. Nothing here has been changed on the
site yet. Every fix keeps the particle 3D for visitors with a working graphics card (D-052: measure, don't cut
the effect); the fixes remove waste and protect visitors whose browser can't run it well.

## Where we stand

- The PageSpeed 25 s blocking time is a test-machine artifact (software 3D). GTmetrix's 85% rated the page with no
  3D at all. Neither shows a real visitor.
- On ordinary integrated graphics the home page still blocks for about 0.5 to 1.4 s on PageSpeed's mobile settings
  (Google's "good" line is 0.2 s), mostly the 3D engine's setup script, plus 0.5 s building 20 hidden Lab sections.
- The server answers slowly (0.4 to 1.5 s) because Cloudflare never caches the HTML.
- Four accessibility issues are real and small.

## Part 1. Investigations (find out before or while fixing)

| # | Question | How | Who | Why it matters |
|---|---|---|---|---|
| I1 | What do real visitors experience? | Open Cloudflare dashboard > Web Analytics > Core Web Vitals for capraetech.io (the beacon is already on the page) | Whoever has the Cloudflare login | The only real-visitor data we can get today; the reports have none |
| I2 | What is Google's official score now? | Create a Google Cloud API key, call the PageSpeed API with `&key=...` for mobile and desktop, 3 runs each, on `/`, `/pricing/`, `/what-we-build/mvp-development/` | You (key) + me (runs) | Keyless calls now have a quota of 0; this is the number Google shows people |
| I3 | Why is layout shift 0.07 to 0.24 locally but 0.004 / 0.04 in the reports? | Lighthouse trace with fonts preloaded vs not; check whether the loader screen hides the shift in some runs; check `section#hero .wrap` with "web font loaded" as cause | Me | Desktop 0.16 to 0.19 is above Google's 0.1 line if it is real |
| I4 | Frame rate and smoothness on real hardware | Visible (not automated) Chrome on this laptop with the performance panel, home page scrolled top to bottom; one mid-range Android phone; one older office laptop if available | Me (laptop) + you (phone) | The audience is 50+ on work laptops; every lab number so far is emulated |
| I5 | Why is the server sometimes 700 ms slower? | On the EC2 server: nginx access log with `$request_time` and `$upstream_response_time`, check where the instance runs vs Cloudflare colos | Whoever runs the server | Server time is bimodal (fast 370 to 730 ms, slow 1,150 to 1,560 ms from India) |
| I6 | Which Cloudflare extras do we keep? | Review Email Obfuscation, Web Analytics auto-inject, Bot Fight Mode JS Detections, Speed Brain | You decide | Each adds requests; the bot script costs Best Practices 100 to 81 |

## Part 2. Code fixes (in `seo/code`, need a deploy on the server afterwards)

Ordered by impact for the cost. File:line references from `../../analysis/03-code-root-causes.md`.

| # | Fix | Where | Effort | Expected effect | Verify by |
|---|---|---|---|---|---|
| C1 | Refuse software 3D: add `failIfMajorPerformanceCaveat: true` to the renderer options; the existing fallback removes the canvas | `src/engine/stage.js:21` | S | No visitor ever gets the 25 to 40 s freeze; PageSpeed should score the no-3D page (like GTmetrix) | Lighthouse with software GL: TBT under 200 ms, no shapes.bin |
| C2 | Stop drawing when nothing changes: skip compute and render when the footer covers the canvas, and under reduced motion when there is no scroll or pointer change; optionally `compileAsync` | `src/engine/stage.js:156-222` | S | Lower CPU and GPU use, battery and fan on every page; respects reduced motion properly | Performance panel: no frames while idle at the footer |
| C3 | Delete the 20 hidden Lab sections from the home page, plus the inline script and CSS that only feed them | `index.html` (variants, script lines 756-963, inline styles) | M | DOM about 2,017 to about 940; removes the 0.5 s task before first paint; 2 hidden extra `<h1>` gone | DOM count, LCP, Lighthouse "Avoid long main-thread tasks" |
| C4 | Load the 3D engine later instead of preloading it with the page | `src/home.js:17,28` (dynamic import) | S | The 168 KB engine no longer competes with CSS and fonts on mobile | Network waterfall: stage js after first paint |
| C5 | Latin-only fonts, drop unused weights; preload the heading font | `src/home.js:3-10`, `src/inner.css:4-11`, `site/plugin.js` (preload links) | S | About 15 KB less CSS; heading paints sooner; may fix I3 | Unused CSS audit, LCP |
| C6 | Remove the section fade-in from opacity 0 on load | `index.html:81` (`.variant.on` animation) | S | Heading visible on first paint; LCP down | LCP render delay |
| C7 | Contrast: `--iron` from #6e727a to #7a7e86 (5.16:1 on black), mobile label from `--charcoal` to `--iron` | `index.html:12,213`, `src/home-styles.css:10,159` | S | Clears the contrast failures (15 spots) | Accessibility audit |
| C8 | Add `<main id="main">` to the home page and point the skip link at `#main` | `index.html:157-748`, `site/chrome.js:117-119` | S | Screen-reader landmark | Accessibility audit |
| C9 | "Feature library" `h4` to `h3` (home and pricing) | `index.html:550-551`, `pricing/index.html:34-35`, `.zone h4` selectors | S | Heading order passes | Accessibility audit |
| C10 | DROPPED 2026-10-22 (preview left the first line off-centre; shift is only 0.004 to 0.04). Was: hero typing word with a fixed width | `src/engine/final.css:5` | S | Fewer layout shifts | CLS |
| C11 | Loader fade: animate opacity only | `site/chrome.js:55` | S | Fade runs off the main thread, can't freeze over the CTA | "Non-composited animations" audit |
| C12 | Hash `shapes.bin` through Vite (import with `?url`) so it gets the 1-year cache | `src/engine/field.js:99`, `public/shapes.bin` | S | Repeat visits skip 313 KB | Response headers |
| C13 | Same "Book a call" target everywhere (decide: on-page form or the page) | `site/chrome.js:123-124`, `index.html:190` | S | Clear link purpose | Accessibility audit (informative) |
| C14 | Source maps (`build.sourcemap: true`) | `vite.config.js` | S | Best Practices audit; no user effect | Best Practices audit |

## Part 3. Server and Cloudflare fixes (need server or dashboard access)

| # | Fix | Where | Effort | Expected effect |
|---|---|---|---|---|
| S1 | Cache the HTML at Cloudflare: Cache Rule for `capraetech.io` excluding `/api/`, edge TTL 1 day, purge on deploy; turn on Tiered Cache (Smart Topology) | Cloudflare dashboard + `~/deploy-capraetech.sh` (purge step) | S | HTML from the edge in tens of ms instead of 0.4 to 1.5 s from the server |
| S2 | Stop re-checking small static files every request: `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` for svg/png/webp/ico/bin | nginx on the EC2 server | S | Removes the ~340 ms favicon-style waits |
| S3 | Proper compression: brotli or at least `gzip_comp_level 6`; compress `shapes.bin` (`gzip_types application/octet-stream` for that file) | nginx | S | stage js -32% (brotli), shapes.bin 320 KB to 64 to 86 KB |
| S4 | Turn off Email Address Obfuscation (removes a synchronous script) | Cloudflare > Scrape Shield | S | PageSpeed estimated 850 ms render-blocking on mobile |
| S5 | Decide on Bot Fight Mode JS Detections and Web Analytics auto-inject (I6) | Cloudflare | S | Best Practices back to 100; fewer requests |
| S6 | Put the server's nginx site config and the contact backend (`seo/code/server/`, without secrets) in git | EC2 server + repo | S | Today neither is in git; if the server is lost, so are they |
| S7 | Security headers: HSTS on in Cloudflare (6 months, no preload yet); nginx `Cross-Origin-Opener-Policy: same-origin`; `Content-Security-Policy-Report-Only` first, enforce after a week without reports | Cloudflare + nginx | S to M | Clears PageSpeed rows P27 to P29 (High, informational); basic hardening |

## Order of work

1. **Now, no access needed:** C1, C2, C7, C8, C9 (all small, all in our code), then C3 (the biggest real win), C4, C5, C6.
2. **In parallel, needs access:** I1 (real-visitor data), S1 to S4, S6, by whoever has the Cloudflare and server logins.
3. **Re-measure** with the protocol below after each deploy, then I2 (official PageSpeed with a key) once the fixes are live.
4. **Then** I3 (layout shift) and I4 (real hardware), which decide whether further 3D tuning is needed.

## Re-measurement protocol (so before and after are comparable)

- Lighthouse 13.5.0, `bunx lighthouse@13.5.0`, home + `/pricing/` + `/what-we-build/mvp-development/`, 3 runs each, one run at a time.
- Mobile with PageSpeed's settings: `--throttling.cpuSlowdownMultiplier=1.2` (PageSpeed's own setting, read from the saved report).
- Desktop: `--preset=desktop`.
- Three graphics setups per page: real GPU (`--headless=new`), software (`--headless=new --disable-gpu`), none (`--disable-webgl`).
- Record performance score, FCP, LCP, TBT, CLS, SI, main-thread "Other", stage js CPU, whether shapes.bin loads, DOM size.
- Save raw JSON next to the earlier runs in `../../analysis/raw/` with a date in the name.

## Decisions needed from you

1. Who makes the server and Cloudflare changes (S1 to S6), and who deploys code fixes to capraetech.io?
2. Keep or drop the Cloudflare extras (I6, S4, S5)?
3. A Google API key for official PageSpeed runs (I2)?
4. Start with the code fixes C1, C2, C7, C8, C9 now?
