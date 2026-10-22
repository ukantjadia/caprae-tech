# GPU vs software WebGL: Lighthouse experiment

Date: 2026-10-22. Target: https://capraetech.io/ (live, git b871b69). Lighthouse 13.5.0, Chrome 143.0.7499.109, this Windows laptop.

## Summary

1. The hypothesis holds. Software WebGL (SwiftShader) reproduces the PageSpeed Insights signature: TBT in the tens of seconds, main-thread time almost all "Other", every long task in `stage-*.js`, `/shapes.bin` requested, and Lighthouse warning that the page never finished loading.
2. Changing only the GL backend to the real Intel GPU, with the same mobile preset and throttling, cuts median TBT from 156.7 s to 2.0 s and "Other" from 165 s to 0.7 s. On desktop it goes from 37.1 s to 229 ms.
3. Disabling WebGL reproduces the GTmetrix signature: no `/shapes.bin` request, `stage-*.js` never runs, TBT 0 to 10 ms (GTmetrix: 40 ms). GTmetrix's 374 KB page weight with 948 B of "Other" agrees: a 313 KB `shapes.bin` would have shown up.
4. With a real GPU the engine still costs something: about 2.0 s TBT on the 4x-throttled mobile preset and 229 to 441 ms on desktop. That cost is script setup (`stage-*.js` is about 90% Script Evaluation), not per-frame rendering.
5. This machine's SwiftShader run is about 6x worse than PSI's (157 s vs 25.4 s TBT), so the numbers show the mechanism and its direction. They do not reproduce PSI's exact figure.

## Results

Medians of 3 runs, (min-max). TBT, "Other" and stage CPU are Lighthouse's simulated values: the mobile preset multiplies observed CPU time by 4, the desktop preset by 1. "stage js CPU" is `bootup-time` total for `stage-B32UjMJF.js`.

| Variant | Device | WebGL renderer | Perf | FCP | LCP | TBT | CLS | SI | "Other" main-thread | stage js CPU | shapes.bin? | runs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | mobile | SwiftShader (ANGLE/Vulkan, CPU) | 54 (52-57) | 1.9 s (1.9-2.0) | 2.7 s (1.9-2.8) | 156.7 s (155.9-160.9) | 0.082 (0.071-0.096) | 14.0 s (12.5-15.5) | 165.3 s (164.2-169.7) | 166.9 s (165.6-171.2) | yes | 3 |
| B | mobile | Intel UHD (ANGLE/D3D11) | 62 (59-62) | 2.0 s (2.0-2.1) | 2.7 s (2.1-2.9) | 1,985 ms (1,546-2,233) | 0.093 (0.066-0.093) | 5.3 s (5.2-6.8) | 702 ms (600-751) | 1,923 ms (1,798-2,085) | yes | 3 |
| C | desktop | SwiftShader (ANGLE/Vulkan, CPU) | 53 (48-54) | 0.8 s (0.6-1.1) | 1.1 s (0.8-1.1) | 37.1 s (36.0-37.4) | 0.177 (0.154-0.242) | 3.0 s (2.7-3.4) | 41.4 s (40.3-41.5) | 41.6 s (40.4-41.7) | yes | 3 |
| D | desktop | Intel UHD (ANGLE/D3D11) | 55 (51-76) | 1.3 s (0.8-2.2) | 1.8 s (0.9-2.8) | 229 ms (229-441) | 0.173 (0.156-0.234) | 2.9 s (2.7-3.1) | 170 ms (163-184) | 448 ms (427-448) | yes | 3 |
| E | desktop | none (WebGL disabled) | 89 (74-90) | 0.8 s (0.5-1.5) | 1.0 s (0.8-2.2) | 0 ms (0-10) | 0.180 (0.173-0.186) | 1.5 s (1.3-1.7) | 97 ms (94-103) | 0 ms | no | 3 |
| PSI (reported) | mobile | unknown | 51 | 2.6 s | 3.0 s | 25,420 ms | 0.004 | 12.2 s | 38,339 ms | 38,837 ms | yes | 1 |
| GTmetrix (reported) | desktop | unknown | 85% | 1.4 s | 1.9 s | 40 ms | 0.04 | 1.7 s | n/r | n/r | no | 1 |

Other per-run facts:

- Software GL (A, C): all 3 runs of each carry the warning "The page loaded too slowly to finish within the time limit". The trace ends at Lighthouse's 45 s cap (observed trace end 45.0 to 45.4 s) because the render loop never lets the main thread go idle. Lighthouse's long-task list (capped at 20 entries) is entirely `stage-*.js`: about 1.5 s each on mobile and about 0.75 s each on desktop. PSI's `stage-*.js` long tasks were 388 to 975 ms, so PSI's SwiftShader host renders a frame several times faster than this laptop.
- Real GPU (B, D): trace ends at 5.4 to 7.0 s, no warning. `stage-*.js` time is about 90% Script Evaluation (B: 1.6 to 1.9 s of 1.8 to 2.1 s; D: about 0.4 s of 0.45 s). In A and C, script is about 1% of `stage-*.js` time and the rest is "Other". The largest long tasks in B are `stage-*.js` setup (0.9 to 1.2 s) and `home-*.js` (0.5 to 1.0 s).
- No WebGL (E): `stage-*.js` has no bootup entry and no `/shapes.bin` request. That matches `seo/code/src/engine/stage.js`: when `new THREE.WebGLRenderer()` throws, it removes the canvas and returns before `createField()`, which is the only caller of the `shapes.bin` fetch (`field.js` line 99).
- Machine: Intel Core i5-10210U (4 cores, 8 threads, 1.6 GHz base, 2019 laptop part), Intel UHD Graphics (integrated). Lighthouse benchmarkIndex across the 15 clean runs: 1,288 to 1,990, median about 1,800.
- CLS sits at 0.07 to 0.24 in every variant here, including E with no WebGL, against 0.004 on PSI and 0.04 on GTmetrix. That is unrelated to WebGL and was not investigated.

## Renderer verification

Lighthouse does not report the WebGL renderer, so each flag set was checked with a separate headless Chrome run (same binary, same flags, throwaway profile) that loads a local page and prints `WEBGL_debug_renderer_info`:

| Flags | Renderer reported |
|---|---|
| A/C: `--headless=new --disable-gpu --use-angle=swiftshader --enable-unsafe-swiftshader` | `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`, WebGL2 |
| B/D: `--headless=new --use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist` | `ANGLE (Intel, Intel(R) UHD Graphics (0x00009B41) Direct3D11 vs_5_0 ps_5_0, D3D11)`, WebGL2 |
| E: `--headless=new --disable-webgl --disable-3d-apis` | no context (`getContext` returns null) |
| `--headless=new` with no GPU flags | Intel UHD, D3D11 (new headless uses the hardware GPU on this machine) |
| `--headless=new --disable-gpu` (no unsafe flag) | SwiftShader, WebGL2 |

Headful mode was not needed: new headless gets the hardware GPU here. The Lighthouse results back the probe up. Only the software variants show "Other" in the tens of seconds, and only E has no `stage-*.js` activity.

## What this means for real visitors

What the numbers show:

- PSI's 25 s TBT measures SwiftShader rendering the particle field on a CPU, frame after frame, inside a 4x CPU-throttled simulation. It does not measure what a visitor with a working GPU experiences. On this laptop's integrated GPU the same page and preset give about 2 s TBT, and desktop gives about 0.2 to 0.4 s.
- GTmetrix's 40 ms TBT measures the page without the engine. It understates the cost for any visitor whose browser does run WebGL.
- With a GPU, the remaining cost sits in setup (building the field in `stage-*.js` plus `home-*.js`), not in the render loop. That is the part to work on if lab TBT on mobile matters.

What they do not show:

- This is one 2019 laptop with Intel UHD integrated graphics, which is close to a typical work laptop. But the runs are headless, plugged in, with a fresh profile and no other tabs. A 50+ buyer's managed work laptop may be older, on battery saver, behind corporate GPU policy, or on a driver Chrome blocklists. None of those cases were tested.
- A visitor whose GPU Chrome blocklists falls back to either software WebGL (variant A/C behaviour: the page keeps the main thread busy) or no WebGL (variant E: the page works without particles). Which one depends on Chrome version and policy. Chrome 143 headless here still fell back to SwiftShader with `--disable-gpu` alone. A headful browser on a blocklisted GPU was not tested.
- Variant B is a laptop GPU behind a simulated 4x CPU slowdown. It is not a phone. A mid-range phone's GPU and thermal limits were not measured.
- Lighthouse measures one page load with no scrolling. It says nothing about frame rate during scroll, input latency after load, or battery drain. Field data (CrUX, or RUM on the site) is the only source for what real buyers get.
- Other agents ran Lighthouse and network tests on this machine at the same time. Runs that overlapped another Chrome were discarded and repeated (see Method), but background network load may still have added noise to FCP and LCP. TBT and "Other" are CPU measures and varied little between runs.

## Method and commands

Every run went through a guard script. It waits until no other headless or temp-profile Chrome is running, starts Lighthouse, polls `wmic` every 2 s during the run, and repeats the run if a second Chrome browser process appeared. A first unguarded pass overlapped another agent's Lighthouse runs (benchmarkIndex in that pass fell to 410 to 1,344). That pass was thrown away and all 15 runs were redone with the guard. In the guarded pass, A-1 needed 3 attempts and every other run was clean on the first. Run order was interleaved (A1 B1 C1 D1 E1 A2 ...), one Chrome at a time.

Lighthouse (run from the repo root; `<flags>` per variant as below):

```
bunx lighthouse@latest https://capraetech.io/ --only-categories=performance \
  --output=json --output-path=testing-results/analysis/raw/lh-<V>-<n>.json --quiet \
  --chrome-flags="<flags>"                       # A, B (mobile is the default preset)
bunx lighthouse@latest https://capraetech.io/ --only-categories=performance --preset=desktop \
  --output=json --output-path=testing-results/analysis/raw/lh-<V>-<n>.json --quiet \
  --chrome-flags="<flags>"                       # C, D, E
```

- A, C: `--headless=new --disable-gpu --use-angle=swiftshader --enable-unsafe-swiftshader`
- B, D: `--headless=new --use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist`
- E: `--headless=new --disable-webgl --disable-3d-apis`

Renderer probe (same flags, throwaway profile, local HTML page that writes `UNMASKED_RENDERER_WEBGL` into the DOM):

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir=<scratch profile> --no-first-run \
  --no-default-browser-check <flags> --dump-dom file:///<scratch>/gl.html
```

Overlap guard (counts Chrome browser processes that are headless or use a non-default profile):

```
wmic process where "name='chrome.exe'" get CommandLine | grep -v -- '--type=' \
  | grep -E -- '--headless|--user-data-dir' | grep -v 'User Data' | wc -l
```

Hardware: `Get-CimInstance Win32_VideoController` (Intel(R) UHD Graphics) and `Get-CimInstance Win32_Processor` (Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz).

Extraction: `uv run python -I extract.py` reads `categories.performance.score`, the `first-contentful-paint`, `largest-contentful-paint`, `total-blocking-time`, `cumulative-layout-shift` and `speed-index` numericValues, the `mainthread-work-breakdown` items with group `other`, `bootup-time` rows whose URL contains `stage-`, `network-requests` for `/shapes.bin`, and `environment.benchmarkIndex`. The scripts live in the session scratchpad (`gpu-exp/`), not in the repo.

## Raw files

All in `testing-results/analysis/raw/`:

- `lh-A-1.json`, `lh-A-2.json`, `lh-A-3.json` (mobile, SwiftShader)
- `lh-B-1.json`, `lh-B-2.json`, `lh-B-3.json` (mobile, Intel GPU)
- `lh-C-1.json`, `lh-C-2.json`, `lh-C-3.json` (desktop, SwiftShader)
- `lh-D-1.json`, `lh-D-2.json`, `lh-D-3.json` (desktop, Intel GPU)
- `lh-E-1.json`, `lh-E-2.json`, `lh-E-3.json` (desktop, WebGL disabled)

The `lh-local-home-*.json` files in the same folder come from another agent and are not part of this experiment.
