# PageSpeed Insights report: verification against the live site

Checked 2026-10-22 (10:43 to 11:01 UTC) against the live build of commit b871b69 (`home-B8CsL-aD.css`, `home-Wvpm71il.js`, `menu-Cs6NEOHi.js`, `stage-B32UjMJF.js`). The saved report is `testing-results/pagespeed/PageSpeed Insights.html` (Oct 21, 6:42 PM IST, Lighthouse 13.5.0, mobile).

## Summary

1. No fresh PSI runs exist. The PSI API refused every keyless call with HTTP 429 and a daily quota of `0` (`raw/psi-api-429-error.json`), so I ran the same Lighthouse 13.5.0 locally with PSI's mobile settings (1.2x CPU, simulated Slow 4G, 412x823) instead.
2. Most saved claims hold on the live build: FCP, LCP, unused JS and CSS, the 313 KiB `/shapes.bin`, the two render-blocking files, and all four accessibility failures.
3. The 25 s TBT and 39 s main-thread figures reproduce only when WebGL runs in software (SwiftShader): 37.6 to 40.1 s TBT, 92 to 95% "Other" time, 20 long tasks all from `stage.js`. That matches the saved report almost exactly. With the laptop's Intel UHD GPU, TBT is 0.5 to 1.4 s.
4. With WebGL switched off, the page behaves like the GTmetrix run: TBT 61 ms and no `/shapes.bin` request. GTmetrix most likely had no WebGL at all, not a fast GPU.
5. Changed since the saved run: a Cloudflare-injected script now drops Best Practices to 81 locally, `llms.txt` now passes, the DOM has about 20 more elements, the payload is 12 KiB larger, and CLS varies from 0.004 to 0.19 because the hero's web fonts swap in.

Verdicts: 18 CONFIRMED (6 of them only under software WebGL), 3 CHANGED, 2 NOT REPRODUCED, 2 CAN'T VERIFY.

## How the fresh numbers were produced

| Mode | Chrome flags | WebGL renderer it got (probe page, same flags) | Runs |
|---|---|---|---|
| GPU | `--headless=new` | ANGLE (Intel UHD Graphics 0x9B41, Direct3D11) | home mobile x3, home desktop x2, /pricing/ mobile, /what-we-build/mvp-development/ mobile, agentic category x1 |
| Software WebGL | `--headless=new --disable-gpu` | ANGLE (Vulkan 1.3.0, SwiftShader Device (Subzero)) | home mobile x3 (2 hung with `PAGE_HUNG`), home desktop x1 |
| No WebGL | `--headless=new --disable-gpu --disable-webgl` | none, context creation fails | home mobile x1 |

All mobile runs: `bunx lighthouse@13.5.0 <url> --only-categories=performance,accessibility,best-practices,seo --throttling.cpuSlowdownMultiplier=1.2`. Desktop runs: `--preset=desktop`. Host: Windows 10, HeadlessChrome 143, axe-core 4.14.0. The saved PSI run used HeadlessChromium 153.0.8010.36, benchmarkIndex 968 and axe-core 4.13.0 (read from the saved HTML footer). The local benchmarkIndex ranged from 565 to 1,731 because another agent was running Lighthouse on the same machine at the same time (`raw/lh-A-1.json` to `raw/lh-E-1.json`, 10:46 to 10:53 UTC). Timings carry that noise. The GPU versus software TBT gap is roughly 30x or more, far larger than that noise.

Verdicts compare like with like. For the main-thread claims (rows 1, 8, 10 to 13) the saved PSI run is compared with the software-WebGL runs, because the saved trace has the same shape as those runs and not the GPU runs (see the last section). "Mobile" means home page, mobile settings.

## Claim by claim

| # | Claim (saved report) | Saved value | Fresh runs (mobile min–max) | Desktop | Verdict | Evidence |
|---|---|---|---|---|---|---|
| 1 | Performance score | 51 | GPU 56–76; software GL 43 | GPU 55–61; software GL 53 | CONFIRMED (software GL only) | Score is dominated by TBT, which is maxed out in both the saved run and the software run. With a GPU it rises to 56–76. |
| 2 | Accessibility score | 93 | 94 (all 5 completed home mobile runs) | 90 | CONFIRMED | Same three failing audits as the saved run (rows 19–21). The 1-point gap was not traced; axe-core differs (4.14.0 local, 4.13.0 PSI). Desktop also fails `target-size`. |
| 3 | Best Practices score | 100 | 81 in WebGL runs, 77 with WebGL off | 81 | NOT REPRODUCED | `deprecations` fails on `/cdn-cgi/challenge-platform/scripts/jsd/main.js` (`StorageType.persistent`). That is Cloudflare's bot-detection script, injected into today's HTML (confirmed with curl) and absent from both saved reports. Not site code. Whether PSI's Chrome 153 would flag it was not tested. The 77 run also fails `errors-in-console` (three.js cannot create a WebGL context). |
| 4 | SEO score | 100 | 100 | 100 | CONFIRMED | No failing SEO audits in any run. |
| 5 | Agentic Browsing | 2/2, llms.txt "not applicable" | category score 99; accessibility tree pass, CLS 0.97, llms.txt pass | n/a | CHANGED | `llms.txt` was added in b871b69 and now passes; it was not applicable in the saved run. The CLI JSON has no "x/y" display, so "2/2" itself was not reproduced. |
| 6 | First Contentful Paint | 2.6 s | GPU 1.96–2.73 s; software GL 2.45 s | 0.72–0.86 s | CONFIRMED | |
| 7 | Largest Contentful Paint | 3.0 s | GPU 2.86–2.94 s; software GL 3.89 s | 0.92–0.93 s | CONFIRMED | |
| 8 | Total Blocking Time | 25,420 ms | GPU 472–1,395 ms; software GL 40,101 ms (2 more software runs hung) | GPU 545–888 ms; software GL 37,569 ms | CONFIRMED (software GL only) | With a GPU, TBT is 18x to 54x lower. Lighthouse aborted 2 of 3 software mobile runs with `PAGE_HUNG` (page stopped responding). |
| 9 | Cumulative Layout Shift | 0.004 | 0.004–0.100 | 0.157–0.186 | NOT REPRODUCED | 0.004 is the low end. Fresh runs show `section#hero .wrap` shifting with cause "Web font loaded" (Inter, Instrument Serif, JetBrains Mono). Desktop is above the 0.1 "good" line in all 3 runs. |
| 10 | Speed Index | 12.2 s | GPU 6.2–7.3 s; software GL 19.2 s | GPU 2.7–2.9 s; software GL 4.1 s | CONFIRMED (software GL only) | Slow frames delay visual completeness. With a GPU it roughly halves. |
| 11 | Main-thread work, mostly "Other" | 39.4 s, Other 38,339 ms (97%) | GPU 1.5–3.4 s, Other 10–12%; software GL 48.4 s, Other 44,643 ms (92%) | GPU 1.6–2.7 s; software GL 41.8 s, Other 95% | CONFIRMED (software GL only) | The same "Other" share appears only when WebGL runs in software. |
| 12 | `stage-B32UjMJF.js` CPU time | 38,837 ms total, 496 ms scripting | GPU 554–1,484 ms total, 492–1,380 ms scripting; software GL 44,761 ms total, 1,052 ms scripting | GPU 736–1,243 ms; software GL 40,295 ms total, 538 ms scripting | CONFIRMED (software GL only) | In the software runs, as in the saved run, about 98% of stage.js time is not JavaScript. With a GPU, 89 to 93% of it is scripting. |
| 13 | Long tasks | 20, all but the first from stage.js, about 400 ms each | GPU 3–8 total, 1–2 from stage.js (282–871 ms); software GL 20, all stage.js, median 704 ms | GPU 4–7; software GL 20, median 933 ms | CONFIRMED (software GL only) | 20 is Lighthouse's display cap (`DISPLAYED_TASK_COUNT = 20` in `long-tasks.js`), so "20" means "20 or more". |
| 14 | Unused JavaScript | 60 KiB, all in stage.js | 57.5–60.4 KiB, all in stage.js | 46.6–60.4 KiB | CONFIRMED | |
| 15 | Unused CSS | 17 KiB in home css | 13.2–17.2 KiB in `home-B8CsL-aD.css` (one run reported 0) | 0–15.2 KiB | CONFIRMED | Filename changed with the later deploys; the waste did not. |
| 16 | DOM size | 1,964 elements | 1,982–1,986 | 1,982–1,986 | CHANGED | About 20 more elements. `index.html` changed in 387753c (form fields) and b871b69 (in-text links). |
| 17 | Render-blocking requests | home css + `email-decode.min.js`, est. 280 ms | same two files; est. 150 ms in 3 runs, no savings estimate in the others | home css in all 3; `email-decode.min.js` in 2 of 3 | CONFIRMED | `email-decode.min.js` is Cloudflare's email obfuscation script. |
| 18 | Total payload, incl. `/shapes.bin` | 689 KiB; shapes.bin 313.3 KiB; stage.js 168.5 KiB | 701–703 KiB; shapes.bin 313.1 KiB; stage.js 168.2 KiB | 702 KiB | CHANGED | The extra 12 KiB is the Cloudflare challenge scripts (11.4 + 0.6 + 0.2 KiB), a Cloudflare setting rather than a code deploy. The shapes.bin and stage.js sizes are unchanged. |
| 19 | Contrast failures | 6 `<td>` cells in the dev-shop table | same 6 cells fail (4.35:1, `#6e727a` on `#000`) plus 9 more nodes in the same grey: dashboard mock labels (Active users, Conversion, MRR, 4.19:1), MON to FRI (4.15:1), "drag or tap →" (4.24:1) | same 15 nodes | CONFIRMED | The saved report understates the scope. These nodes also exist in 0a2deeb, the last commit before the saved report, so the extra findings are probably the axe-core version or reveal timing, not new markup. |
| 20 | Heading order | `h4` "Feature library" | same `h4` | same | CONFIRMED | Markup at `seo/code/index.html:550`. |
| 21 | No main landmark | `landmark-one-main` fails | fails in every run | fails | CONFIRMED | The live HTML has no `<main>` (curl). |
| 22 | Identical links, different targets | "Book a call" `/book-a-call/` vs "Book a call →" `#book` | same pair | same pair | CONFIRMED | Informative audit, unscored. |
| 23 | Missing source maps | stage.js | stage.js flagged in every run | same | CONFIRMED | Weight 0, so it does not move the score. |
| 24 | Lab data only, CrUX "No Data" | No field data | not checked | not checked | CAN'T VERIFY | The PSI and CrUX APIs both need a key now. |
| 25 | Test environment: Moto G Power emulation, HeadlessChromium 153, benchmarkIndex 968, 1.2x CPU | as listed | local Chrome 143, benchmarkIndex 565–1,731, 1.2x CPU forced to match | n/a | CAN'T VERIFY | The values come from the saved HTML footer. Without a fresh PSI run there is nothing to compare them against. |

### Inner pages (GPU mode, mobile, one run each)

| Page | Perf | A11y | BP | FCP | LCP | TBT | CLS | SI | Payload | Shapes file | DOM | A11y fails |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| /pricing/ | 75 | 95 | 81 | 1.9 s | 2.0 s | 670 ms | 0.002 | 6.5 s | 563 KiB | `/shapes/pricing.bin` 157 KiB | 457 | contrast (7 nodes, incl. "drag or tap →", "FEATURE", "HOURS"), heading order (same "Feature library" `h4`) |
| /what-we-build/mvp-development/ | 71 | 95 | 81 | 2.0 s | 2.0 s | 1,026 ms | 0.064 | 5.4 s | 562 KiB | `/shapes/mvp.bin` 157 KiB | 490 | contrast (7 nodes) |

Inner pages run the same particle engine with their own shapes file. They were not tested under software WebGL.

## What this test can and cannot tell us

**Lab versus real users.** Every number here comes from one synthetic page load. The saved report has no field data ("No Data" for CrUX), so nothing here says what real visitors experience. Cloudflare Web Analytics is on the page (`static.cloudflareinsights.com/beacon.min.js`, `/cdn-cgi/rum`), so its dashboard may have real-visitor timings.

**Emulation.** PSI's "Moto G Power" is a server running headless Chromium with a phone-sized screen, a phone user agent, simulated Slow 4G and a 1.2x CPU slowdown. No phone GPU is emulated. Whatever graphics stack the server has is what WebGL gets.

**Software rendering: what was established.**

- PSI had a working WebGL context. `/shapes.bin` is only fetched by `createField()` (`seo/code/src/engine/field.js:99`), which runs only after `new THREE.WebGLRenderer()` succeeds (`stage.js:19-25`). The saved report lists a 313 KiB `/shapes.bin`, so the context existed.
- The saved trace has the shape of a software-rendered run. In the saved report and in both local SwiftShader runs, main-thread time is 39 to 48 s, 92 to 97% of it is "Other" (not JavaScript), stage.js accounts for nearly all of it with only 0.5 to 1.0 s of actual scripting, and every long task comes from stage.js. In the GPU runs, main-thread time is 1.5 to 3.4 s and "Other" is 10 to 12%.
- In a controlled test where only the GL backend changed (same machine, same Lighthouse, same settings), TBT went from 0.5 to 1.4 s (Intel UHD) to 37.6 to 40.1 s, or the page hung (SwiftShader).
- With no WebGL at all, the engine bails out (console: "THREE.WebGLRenderer: Error creating WebGL context"), `/shapes.bin` is never requested, TBT is 61 ms and the payload is 391 KiB. That matches GTmetrix (TBT 40 ms, no shapes.bin, 374 KB).

**Software rendering: what was not established.**

- PSI's actual GL renderer string. PSI does not report it. Its JSON `environment` block holds only `hostUserAgent`, `benchmarkIndex` and `credits`, so even a fresh PSI run would give only the fingerprint evidence above, not proof.
- Which real visitors, if any, get software WebGL. A visitor on integrated graphics (the Intel UHD case) sees TBT around 0.5 to 1.4 s under mobile emulation, not 25 s. A visitor whose GPU Chrome refuses may get no WebGL (fine, like GTmetrix) or software WebGL (like PSI). That depends on their Chrome version and flags, and was not tested in headful Chrome.
- Phone GPUs were not tested. Emulated mobile on a laptop GPU is not a phone.

**One code fact relevant to the above (not tested on the site).** The renderer is created without `failIfMajorPerformanceCaveat` (`stage.js:21`), so it accepts a software context. On the probe page, `getContext('webgl2', { failIfMajorPerformanceCaveat: true })` returned null under SwiftShader and a context on the Intel GPU. Once running, the render loop never stops (`renderer.setAnimationLoop`, `stage.js:222`); the adaptive-resolution step only lowers the pixel ratio to 0.6.

**Other limits.** Local Chrome is 143, PSI's was 153. axe-core differs (4.14.0 versus 4.13.0). Another agent's Lighthouse runs shared the CPU during part of this work. Two of three software mobile runs ended in `PAGE_HUNG`, so the software mobile figures rest on one completed run plus one desktop run.

**To get real PSI numbers:** add `&key=<Google API key>` to the PSI URL. Keyless calls currently have a quota of 0 per day.

## Raw files

All in `testing-results/analysis/raw/`. The files are named `lh-local-*` rather than `psi-*` because they are local Lighthouse runs, not PSI.

| File | What it is |
|---|---|
| `psi-api-429-error.json` | PSI API response: 429, `quota_limit_value: "0"`, limit `defaultPerDayPerProject` |
| `lh-local-home-gpu-mobile-1.json`, `-2`, `-3` | Home, mobile, Intel UHD GPU |
| `lh-local-home-gpu-desktop-1.json`, `-2` | Home, desktop preset, Intel UHD GPU |
| `lh-local-home-swiftshader-mobile-1.json`, `-2` | Home, mobile, SwiftShader: `PAGE_HUNG`, no metrics |
| `lh-local-home-swiftshader-mobile-3.json` | Home, mobile, SwiftShader: completed |
| `lh-local-home-swiftshader-desktop-1.json` | Home, desktop preset, SwiftShader |
| `lh-local-home-nowebgl-swiftshader-mobile-1.json` | Home, mobile, WebGL disabled (GTmetrix-like control) |
| `lh-local-pricing-gpu-mobile-1.json` | /pricing/, mobile, GPU |
| `lh-local-mvp-development-gpu-mobile-1.json` | /what-we-build/mvp-development/, mobile, GPU |
| `lh-local-home-gpu-mobile-agentic-1.json` | Home, mobile, GPU, Agentic Browsing category only |

`lh-A-1.json` to `lh-E-1.json` and the `network-*` files in the same folder come from another agent, not this verification.
