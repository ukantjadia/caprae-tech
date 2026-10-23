# GTmetrix report vs live capraetech.io: network verification

Measured 2026-10-22, 10:44 to 11:05 UTC, from India (Jio, Cloudflare colos HKG / SIN, once MRS), curl 7.88.1 (HTTP/2, brotli, zstd) plus headless Chrome 143 for two DOM and request checks. Saved report: GTmetrix, Seattle, Chrome 154, Lighthouse 12.6.1, desktop, 2026-10-21 13:15 UTC. Live build is b871b69 (HTML `last-modified: Wed, 21 Oct 2026 21:52:10 GMT`, so it went live after the GTmetrix run).

## Summary

1. The slow-server finding holds. HTML is never served from Cloudflare's cache (`cf-cache-status: DYNAMIC`, origin sends `no-cache, must-revalidate`), so every visit pays the trip to the EC2 origin: 546 ms in Seattle, 374 to 1,564 ms server-side from India.
2. The missing `/shapes.bin` is explained and reproduced. `stage.js` fetches it only after `new THREE.WebGLRenderer()` succeeds. Headless Chrome with WebGL disabled makes no `/shapes.bin` request and no canvas, the same as GTmetrix. So 85% / TBT 40 ms describe the no-3D fallback page, not a GPU visitor.
3. Hashed `/assets/*` get `public, max-age=31536000, immutable`, as they should. Every other static file (`favicon.svg`, `shapes.bin`, `og-image.png`, `/team/*.webp`, `robots.txt`) gets `max-age=14400, must-revalidate` and is REVALIDATED against the origin on every request.
4. Compression is weak. Origin gzip runs at level 1 (byte-exact match) and Cloudflare passes it through, so `stage.js` ships at 171,787 B where brotli-11 gives 116,731 B (-32%). `shapes.bin` (320,000 B) ships uncompressed; brotli-11 gives 63,869 B (-80%).
5. DOM claim confirmed: 1,957 then, 2,017 today post-JS (985 in the served HTML before JS). The 20 hidden Lab variants hold 1,074 of the 2,017 (53%). Verdicts: 17 CONFIRMED, 2 CHANGED, 0 NOT REPRODUCED, 7 CAN'T VERIFY.

## Claims

Sizes in the GTmetrix columns are KiB including response headers. Measured sizes are body bytes. "Server" means TTFB minus TLS-done (curl), which matches GTmetrix's "Backend" (TTFB minus connect). Both include one client-to-edge round trip: a few ms in Seattle, a median 144 ms from India (measured on `/cdn-cgi/trace`, which Cloudflare answers at the edge). So raw India totals are not comparable to Seattle; the server-side part is.

| # | Claim (GTmetrix) | Saved value | Measured now | Verdict | Evidence |
|---|---|---|---|---|---|
| 1 | Build under test | `home-DlD48uTK.css`, `home-DAKUGxCq.js` | `home-B8CsL-aD.css`, `home-Wvpm71il.js`; `stage-B32UjMJF.js`, `menu-Cs6NEOHi.js` and all 6 fonts unchanged | CHANGED | b871b69 deployed 21 Oct 21:52 UTC, after the 13:15 UTC test. Same chunk graph, two new hashes. |
| 2 | TTFB 610 ms = connect 64 + backend 546 | 610 / 64 / 546 ms | Home server-side median 1,363 ms (range 374 to 1,564, n=12). Minus the 144 ms edge baseline, the origin part is about 1,220 ms median; fast-mode samples come to 230 to 570 ms | CONFIRMED | `raw/network-ttfb-home.txt`, `raw/network-ttfb-summary.txt`. Bimodal: fast mode about 370 to 730 ms, slow mode about 1,150 to 1,560 ms. The roughly 700 ms gap fits Cloudflare opening a new long-haul connection to the origin. Seattle's 546 ms sits inside the measured range. Origin region unknown (no record in repo). |
| 3 | Reduce initial server response time: root document 546 ms | 546 ms | HTML `cf-cache-status: DYNAMIC` on 32 of 32 HTML requests; `cache-control: no-cache, must-revalidate`, no ETag | CONFIRMED | `raw/network-home-headers.txt`. Cache-busted `/?nocache=N`: median 707 ms, also DYNAMIC (the query string makes no difference, HTML is never cached). Inner page `/pricing/` (6.7 KB): median 415 ms, also DYNAMIC. Edge-only `/cdn-cgi/trace`: median 144 ms. |
| 4 | Use a CDN (pass) | pass | `server: cloudflare`, colos HKG, SIN, MRS | CONFIRMED | `raw/network-cdn-cgi-trace.txt`. The CDN serves assets; it does not serve the HTML (row 3). |
| 5 | Use HTTP/2 for all resources (pass) | pass | Every request HTTP/2; `alt-svc: h3=":443"` offered | CONFIRMED | `raw/network-asset-table.tsv`, column `http`. |
| 6 | Enable text compression (pass) | pass | HTML br (or zstd for Chrome); JS, CSS and SVG gzip, at level 1 | CONFIRMED | `raw/network-compression-savings.txt`. The audit passes because every text type is compressed. It does not look at compression level, or at `shapes.bin` (`application/octet-stream`, 320,000 B, uncompressed). |
| 7 | Cache policy: Cloudflare beacon TTL 24 h | 24 h, 10.2 KB | `cache-control: public, max-age=86400`, 10,264 B gzip | CONFIRMED | `raw/network-asset-headers.txt`. Served by `static.cloudflareinsights.com`, so the site cannot change it. |
| 8 | Cache policy: `email-decode.min.js` TTL 1 day | 1 day, 967 B | `cache-control: public` (no max-age), `expires` 48 h ahead; 611 B br | CHANGED | PSI on Oct 21 showed TTL "None" for the same file. Cloudflare sets this header, so the value can't be fixed at origin. |
| 9 | Hashed assets not flagged by the cache audit | not flagged | All 10 hashed `/assets/*`: `public, max-age=31536000, immutable` | CONFIRMED | `raw/network-asset-table.tsv`. ETags are weak (`W/`) on gzip'd files and strong on woff2. |
| 10 | Total 374 KB: JS 183, fonts 136, HTML 30.3, CSS 23.5, other 948 B | 374 KB | Same URL set today: 376,565 B of bodies (367.7 KiB) + headers. JS 185,630 B; fonts 136,716 B; HTML 29,917 B; CSS 23,883 B; favicon 419 B | CONFIRMED | Sum of `bytes_wire` in `raw/network-asset-table.tsv`. Decoded HTML grew from 107 KiB (109,568 B) to 112,929 B (+3.4 KB, likely b871b69's in-text links plus the injected Cloudflare tags). |
| 11 | 15 requests | 15 | The same 15 URLs are still requested (3 with new hashes) | CONFIRMED | Headless no-WebGL run (`raw/network-headless-nowebgl-urls.txt`) also shows 3 Cloudflare JS Detections requests (`/cdn-cgi/challenge-platform/...`, a 302 then 10,973 B br), `/cdn-cgi/speculation`, and 8 lazy `/team/*.webp`. None of these appear in either Oct 21 lab run. See raw-data notes. |
| 12 | Largest payload: `stage-B32UjMJF.js` 168 KB transfer, 552 KB raw | 168 / 552 KB | 171,787 B gzip / 564,882 B raw (167.8 / 551.6 KiB) | CONFIRMED | Same hash, byte-identical. |
| 13 | DOM: 1,957 elements, max depth 12 (`<span>`), `body#top` 22 children | 1,957 / 12 / 22 | Post-JS (headless Chrome, WebGL off): 2,017 elements, depth 12 at `<span>`, body 24 children. Served HTML before JS: 985 | CONFIRMED | `raw/network-dom-count.txt`, `raw/network-dom-count-postjs*.txt`. The +60 elements are likely b871b69's added links (not verified on the old build). Hidden-variant share: see "DOM and the Lab variants" below. |
| 14 | Critical request chains: 9 chains, max latency 1.3 s | 9 / 1.3 s | Served HTML has the same structure: HTML > CSS > 6 woff2 (no font preload), HTML > home module, HTML > `email-decode.min.js`, HTML > beacon | CONFIRMED | Saved waterfall (`raw/network-gtmetrix-waterfall-parsed.txt`): the last font ends at 784 + 513 = 1,297 ms, which is the 1.3 s. Latency was not re-measured. |
| 15 | 4 long tasks (496 ms at 776 ms, 138, 69, 55 ms) | 4 | not measurable with network tools | CAN'T VERIFY | Side evidence in the saved waterfall: 5 of the 6 fonts were requested at 784 ms but sat in "blocking" for 487 to 495 ms, ending at about 1,271 ms. That is the end of the 496 ms task (776 + 496 = 1,272). The long task delayed font fetches, and with them the hero text paint. |
| 16 | Unused CSS 18.7 KB of 23.2 KB | 18.7 KB | CSS now 58,786 B raw / 23,883 B gzip | CAN'T VERIFY | Needs coverage in a browser. Plausible: the bundle carries styles for all 3 variants per section, plus `@font-face` rules for latin-ext, cyrillic, greek and vietnamese subsets that the page never uses. |
| 17 | Unused JS 110 KB of 168 KB in `stage.js` | 110 KB | not measurable with network tools | CAN'T VERIFY | The figure is inflated by the missing WebGL: with no context, `startStage` returns right after the renderer constructor throws, so most of three.js never runs. A GPU visitor runs far more of it. |
| 18 | Legacy JS: beacon polyfills (`Array.prototype.at`, `findLast`, `includes`), 10.2 KB | 10.2 KB | `beacon.min.js/vce70182...`, 31,853 B raw; injected as `<script type="module" ... data-cf-beacon>` right before `</body>` | CONFIRMED | Cloudflare Web Analytics automatic injection. It is injected only when the request's `Accept` header contains `text/html` (browsers do; curl's `*/*` does not). It is not in the repo. |
| 19 | Render-blocking: only the CSS (19 ms savings) | CSS only | `<head>` holds JSON-LD, one `type="module"` script (deferred) and one stylesheet, so the CSS is the only head blocker | CONFIRMED | Caveat: `email-decode.min.js` is a classic synchronous script (`data-cfasync="false"`, no async or defer) at line 397 of 606, after all sections and before the main inline script. GTmetrix did not flag it; PSI mobile did (850 ms). |
| 20 | Third-party: Cloudflare 10.2 KB (+181 B chrome-extension) | 10.4 KB | Beacon as above | CONFIRMED | The `chrome-extension://...gaoptout_signal.js` row belongs to GTmetrix's own browser (Google Analytics Opt-out add-on), not the site. |
| 21 | LCP = hero `<h1 class="display" style="margin-top:20px">`, 1,870 ms, 67% render delay | 1.9 s | The h1 exists in the served HTML (line 88), text-only, no image | CAN'T VERIFY | Render timing needs a browser trace. With TTFB 610 ms and 0 ms load time, the remaining 1.26 s is CSS + fonts + main thread (see row 15). |
| 22 | 15 layout shifts on the hero h1, each < 0.01; CLS 0.04 | 15 | The `#rotor` inside the h1 types and deletes text every 40 to 85 ms, starting 2.2 s after the inline script runs | CAN'T VERIFY | The count needs a trace, but the mechanism is in the served code (line 488). GTmetrix's captured LCP text "Software for se" is mid-typing. |
| 23 | Scores and lab metrics: Performance 85%, Structure 98%, FCP 1.4 s, TTI 1.5 s, SI 1.7 s, TBT 40 ms | as listed | not measurable with network tools | CAN'T VERIFY | These hold only for a browser without WebGL (see "Why no shapes.bin"). PSI mobile in the same hour, with WebGL, got TBT 25,420 ms. |
| 24 | Onload 1.6 s, fully loaded 2.0 s | 1.6 / 2.0 s | not measurable with network tools | CAN'T VERIFY | Consistent with the waterfall: the last request (`favicon.svg`) ends at 1,977 ms. |
| 25 | No `/shapes.bin` request | absent | Not requested without WebGL; requested with WebGL | CONFIRMED | Reproduced in headless Chrome, see below. |
| 26 | Waterfall: `favicon.svg` waited 338 ms for a 658 B file | 338 ms | 8 requests: 1 MISS, 1 EXPIRED, 6 REVALIDATED, never HIT; 378 to 1,153 ms server-side from India | CONFIRMED | `raw/network-ttfb-static.txt`, `raw/network-asset-table.tsv`. The edge keeps the file but checks back with the origin on every request. |

Counts: 17 CONFIRMED, 2 CHANGED, 0 NOT REPRODUCED, 7 CAN'T VERIFY.

## DOM and the Lab variants

| Measure | Served HTML (before JS) | Post-JS, headless Chrome 143, WebGL off |
|---|---|---|
| All elements | 985 | 2,017 |
| `div.variant` total / shown (`on`) / hidden | 30 / 10 / 20 | 30 / 10 / 20 |
| Elements inside hidden variants | 372 (38% of 985) | 1,074 (53% of 2,017) |
| Elements inside shown variants | 313 | 648 |

The inline Lab script (lines 484 to 590) fills about 30 containers with `innerHTML`, for example `#workGrid`, `#slides` and `#workRows` (all three Work variants), `#fcA`, `#spotList` and `#fcC` (Founders), and `#faqA`, `#faqB` and `#faqC`. It builds them all whether or not the variant is visible, which is why the hidden share grows from 372 to 1,074 after JS. Applied to GTmetrix's figure, the hidden variants explain about 1,000 to 1,050 of the 1,957 (the share was not measured on the Oct 21 build). Dropping them would leave about 940 elements, under Lighthouse's 1,400 error level but still over its 800 warning level. Side effect: the page has 3 `<h1>` elements, 2 of them in hidden hero variants.

## Caching and compression table

Request 1 sent `Accept-Encoding: br, gzip`. "Chrome enc." is what the edge returns for Chrome's real header (`gzip, deflate, br, zstd`). cf-cache-status shows request 1 / a repeat request; consecutive requests often land on different colos (HKG vs SIN), which each keep their own cache.

| Asset | Status | Type | Enc. (br,gzip) | Wire B | Decoded B | Chrome enc. | Cache-Control | ETag / Last-Modified | cf-cache-status | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 200 h2 | text/html | br | 29,917 | 112,929 | zstd (31,552) | `no-cache, must-revalidate` | none / Wed 21 Oct 21:52:10 | DYNAMIC / DYNAMIC | Never edge-cached. zstd is 5% larger than br here. brotli-11 would be 24,689. |
| `/pricing/` | 200 h2 | text/html | br | 6,708 | 25,587 | zstd (7,228) | `no-cache, must-revalidate` | none / same | DYNAMIC / DYNAMIC | Same policy on inner pages. |
| `/assets/home-Wvpm71il.js` | 200 h2 | application/javascript | gzip | 1,937 | 4,427 | gzip | `public, max-age=31536000, immutable` | `W/"6ad9340a-114b"` | HIT / MISS | Good TTL. Origin gzip level 1, br-11 would be 1,626. |
| `/assets/stage-B32UjMJF.js` | 200 h2 | application/javascript | gzip | 171,787 | 564,882 | gzip | same | `W/"6ad9340a-89e92"` | MISS / HIT | gzip-1 byte-exact. gzip-9 141,229 (-18%), br-11 116,731 (-32%). |
| `/assets/menu-Cs6NEOHi.js` | 200 h2 | application/javascript | gzip | 1,031 | 2,294 | gzip | same | `W/"6ad9340a-8f6"` | MISS / HIT | br-11 835. |
| `/assets/home-B8CsL-aD.css` | 200 h2 | text/css | gzip | 23,883 | 58,786 | gzip | same | `W/"6ad9340a-e5a2"` | HIT / HIT | gzip-1 byte-exact. br-11 20,428 (-14%). |
| `/assets/inter-latin-400-normal-C38fXH4l.woff2` | 200 h2 | font/woff2 | none | 23,664 | 23,664 | none | same | `"6ad9340a-5c70"` | MISS / HIT | woff2 is already compressed, correct. |
| `/assets/inter-latin-500-normal-Cerq10X2.woff2` | 200 h2 | font/woff2 | none | 24,272 | 24,272 | none | same | `"6ad9340a-5ed0"` | MISS / HIT | |
| `/assets/inter-latin-600-normal-LgqL8muc.woff2` | 200 h2 | font/woff2 | none | 24,452 | 24,452 | none | same | `"6ad9340a-5f84"` | MISS / HIT | |
| `/assets/instrument-serif-latin-400-normal-DnYpCC2O.woff2` | 200 h2 | font/woff2 | none | 21,032 | 21,032 | none | same | `"6ad9340a-5228"` | MISS / HIT | |
| `/assets/instrument-serif-latin-400-italic-DKMiL14s.woff2` | 200 h2 | font/woff2 | none | 22,128 | 22,128 | none | same | `"6ad9340a-5670"` | MISS / HIT | |
| `/assets/jetbrains-mono-latin-400-normal-V6pRDFza.woff2` | 200 h2 | font/woff2 | none | 21,168 | 21,168 | none | same | `"6ad9340a-52b0"` | MISS / HIT | |
| `/shapes.bin` | 200 h2 | application/octet-stream | none | 320,000 | 320,000 | none | `max-age=14400, must-revalidate` | `"6ad93409-4e200"` / Wed 21 Oct 21:52:09 | REVALIDATED / REVALIDATED | Uncompressed. gzip-9 85,754 (-73%), br-11 63,869 (-80%). Not hashed, so it can't be immutable. |
| `/favicon.svg` | 200 h2 | image/svg+xml | gzip | 419 | 658 | gzip | `max-age=14400, must-revalidate` | `"6ad93409-292"` | REVALIDATED / REVALIDATED | Origin round trip on every request (row 26). |
| `/og-image.png` | 200 h2 | image/png | none | 158,203 | 158,203 | none | `max-age=14400, must-revalidate` | `"6ad93409-269fb"` | MISS / REVALIDATED | Only fetched by link-preview crawlers. |
| `/apple-touch-icon.png` | 200 h2 | image/png | none | 4,794 | 4,794 | none | `max-age=14400, must-revalidate` | `"6ad93409-12ba"` | MISS / REVALIDATED | |
| `/team/*.webp`, `/robots.txt` | 200 h2 | image/webp, text/plain | none | n/a | n/a | n/a | `max-age=14400, must-revalidate` | n/a | REVALIDATED | `raw/network-extra-static-headers.txt` |
| `/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js` | 200 h2 | application/javascript | br | 611 | 1,239 | zstd (661) | `public` + `expires` 48 h | none | (edge-generated) | Cloudflare Email Address Obfuscation. Sync script in body. |
| `static.cloudflareinsights.com/beacon.min.js/vce70182...` | 200 h2 | text/javascript | gzip | 10,264 | 31,853 | gzip | `public, max-age=86400` | `W/"2026.10.1"` / Thu 15 Oct 2026 | n/a | Cloudflare Web Analytics (RUM). Then `POST /cdn-cgi/rum` returns 204. |
| `/cdn-cgi/challenge-platform/scripts/jsd/main.js` | 302 h2 | n/a | n/a | 0 | n/a | n/a | `max-age=300, swr=10800, public` | n/a | n/a | Redirects to `/cdn-cgi/challenge-platform/h/b/scripts/jsd/d2d3316b729e/main.js` (200, br, 10,973 B, `max-age=14400`). Bot Fight Mode / JS Detections, loaded inside a hidden iframe. |

How the root-file headers come about (inferred, since only Cloudflare's output is visible): the HTML's origin header `no-cache, must-revalidate` evidently also applies to every non-`/assets` file. Cloudflare's Browser Cache TTL (4 h) rewrites the browser-facing value to `max-age=14400` and keeps `must-revalidate`. The edge still honours the origin's `no-cache` and revalidates every hit. The whole-site nginx config is not in the repo (only `seo/code/deploy/nginx-ai-information.conf`), so this needs a look at `/etc/nginx` on the server.

Whether the HTML is cacheable at Cloudflare today: no. `cf-cache-status: DYNAMIC` means Cloudflare's default (don't cache HTML) applies, and even with a cache rule the current origin header would force a revalidation on every hit.

## Why no shapes.bin in GTmetrix

Code path, all at b871b69:

1. `seo/code/src/home.js:28` calls `startStage` after the first paint, via `requestAnimationFrame(() => setTimeout(...))`.
2. `seo/code/src/engine/stage.js:19-25` runs `new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })` inside `try`. On failure the catch runs `canvas.remove(); return`.
3. three r186 (`node_modules/three/src/renderers/WebGLRenderer.js`) asks for a `webgl2` context and throws `Error creating WebGL context` when it gets `null`.
4. The only `shapes.bin` fetch is `seo/code/src/engine/field.js:99`, inside `createField`, which `stage.js:34` calls only after the renderer exists.

So a browser without a usable WebGL2 context never requests `/shapes.bin`, never adds the canvas, and runs almost none of `stage.js`. That last point is also why GTmetrix calls 110 KB of it unused.

Direct test (headless Chrome 143 on this machine, net-log on, `raw/network-headless-*-urls.txt`):

| Run | Flags | `/shapes.bin` requested | Canvas in DOM |
|---|---|---|---|
| WebGL off | `--disable-gpu --disable-3d-apis` | no | no |
| Software WebGL | `--use-angle=swiftshader --enable-unsafe-swiftshader` | yes | yes, `data-engine="three.js r186"` |
| Default (this machine has a GPU) | none | yes | yes |

Timing rules out "GTmetrix stopped too early". The module runs at about 1.4 s, and a fetch would have been issued within a frame or two. Requests at 1,630 ms (`/cdn-cgi/rum`) and 1,632 ms (`favicon.svg`) were captured, and GTmetrix keeps recording until the network goes quiet.

Verdict: "no GPU/WebGL in GTmetrix's browser" explains it fully and reproduces exactly. I can't see GTmetrix's GPU configuration directly. The PageSpeed run had a WebGL context, almost certainly software-rendered: it fetched `shapes.bin` (313.3 KiB) and logged TBT 25,420 ms as the CPU drew the particle field. Consequence: GTmetrix's 85% and TBT 40 ms rate the static fallback page. They say nothing about the cost of the 3D on a real visitor's machine.

## Raw-data notes

- Files, all in `testing-results/analysis/raw/`:
  - `network-gtmetrix-waterfall-parsed.txt`: the saved `har.html` waterfall turned into per-request phases. Scale is 19.77 ms per bar-percent, calibrated on the document row (611 ms).
  - `network-home-headers.txt`, `network-cdn-cgi-trace.txt`
  - `network-ttfb-home.txt`, `network-ttfb-home-nocache.txt`, `network-ttfb-inner-pricing.txt`, `network-ttfb-edge-baseline.txt`, `network-ttfb-static.txt`, `network-ttfb-summary.txt`
  - `network-asset-headers.txt` (full headers per asset), `network-asset-table.tsv`, `network-extra-static-headers.txt`
  - `network-compression-savings.txt` (gzip levels 1/2/4/6/9, brotli 5/11, zstd 19 on the decoded bodies)
  - `network-dom-count.txt` (served HTML), `network-dom-count-postjs.txt`, `network-dom-count-postjs-nowebgl-full.txt` (per-variant breakdown), `network-dom-postjs-nowebgl.html`
  - `network-headless-nowebgl-urls.txt`, `network-headless-swiftshader-urls.txt`
- Method: each timing sample is a fresh curl process (new DNS, TCP and TLS), HTTP/2, a Chrome UA, a browser `Accept` header, and `Accept-Encoding: br, gzip`. Medians from India: DNS 8 to 25 ms, TCP 116 to 143 ms, TLS 126 to 185 ms. Those are client-side costs that a Seattle probe does not pay.
- Bimodal server time: 8 of 12 plain-home samples, 3 of 10 cache-busted and 3 of 10 `/pricing/` samples fell in the slow mode (+about 700 ms). The plain-home median is higher than the cache-busted one only because of that mode mix. The HTML is DYNAMIC in both cases.
- Edge caches are per colo. `home-B8CsL-aD.css` was a MISS on first touch at both HKG and SIN before turning HIT, `home-Wvpm71il.js` went HIT then MISS on back-to-back requests, and a cold MISS cost 1.4 to 1.7 s server-side. Indian traffic spread over HKG, SIN and MRS keeps hit ratios low until Tiered Cache is on.
- Cloudflare features injected into the HTML: Email Address Obfuscation (rewrites the footer email and adds `email-decode.min.js`), Web Analytics (beacon), Bot Fight Mode / JS Detections (an inline script that creates a hidden iframe and loads `/cdn-cgi/challenge-platform/...`), and Speed Brain (`speculation-rules: "/cdn-cgi/speculation"` header). JS Detections, `/cdn-cgi/speculation` and the `/team/*.webp` loads show up in my headless run but in neither Oct 21 lab run. I can't tell whether these features were switched on later or are skipped for GTmetrix and PSI traffic. The team images are `loading="lazy"`; headless `--dump-dom` with a virtual-time budget loaded them, while a real 1366x768 load would not.
- HTML for curl's default `Accept: */*` lacks the beacon (112,562 B vs 112,929 B), so any size check of the HTML must send a browser `Accept` header.
- Sizes: GTmetrix "KB" are KiB including response headers, which is why 23,664 B of body shows as 23.6 KB transferred and 23.1 KB uncompressed.

## Recommended server/CDN fixes

1. **Cache the HTML at the edge.** Add a Cloudflare Cache Rule for `http.host eq "capraetech.io" and not starts_with(http.request.uri.path, "/api/")`: Eligible for cache, Edge TTL "ignore origin, 1 day" (or have nginx send `Cache-Control: public, max-age=0, s-maxage=86400` for HTML), Browser TTL "respect origin". Purge the cache in the deploy step. Also turn on Tiered Cache, Smart Topology (free on all plans). Expected: HTML TTFB drops to the edge round trip. A HIT on `home-B8CsL-aD.css` returned its first byte in 0.39 to 0.50 s total from India, against 0.62 to 2.13 s for the HTML today; in Seattle the 546 ms backend should go to tens of ms.
2. **Stop per-request revalidation of root static files.** In nginx, `location ~* \.(svg|png|webp|ico|bin)$ { add_header Cache-Control "public, max-age=86400, stale-while-revalidate=604800"; }`. Or move `shapes.bin` under Vite's hashing (import it with `?url`) so it falls under the immutable `/assets/` rule. Each `favicon.svg`, `shapes.bin` and team-photo request then stops paying about 380 ms of origin trip.
3. **Compress properly at origin.** Origin gzip runs at level 1 (byte-exact). Pre-compress at build (`.br` at q11, `.gz` at -9) and serve with `brotli_static on; gzip_static on;` (ngx_brotli for brotli). At minimum set `gzip_comp_level 6;`, and compress `shapes.bin` (`location = /shapes.bin { gzip on; gzip_types application/octet-stream; }`). Compressing it is safe: `field.js` reads the decoded stream and checks the decoded byte count. Savings: `stage.js` -55 KB with brotli; `shapes.bin` -256 KB with brotli (-234 KB with gzip-9).

Next in line: turn off Cloudflare Email Address Obfuscation (Scrape Shield). It removes a synchronous script from the body, which PSI estimated at 850 ms render-blocking on mobile. Also decide whether Web Analytics auto-injection (a 10 KB beacon with legacy polyfills) and Bot Fight Mode JS Detections (3 requests and a hidden iframe) are worth keeping.
