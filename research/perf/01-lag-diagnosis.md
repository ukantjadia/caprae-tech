# 01. Lag diagnosis: the four Dala builds

Date: 2026-09-30
Scope: `builds/dala-caprae` (v1), `builds/dala-caprae-wordmark` (v2), `builds/dala-draft-one` (v3), `builds/dala-modified-particles` (v4). No build code was changed.

## Short answer

The frame is GPU-bound, and almost none of the GPU time goes to particles. Two 4x MSAA resolves and a 33-tap full-resolution DOF pass take about 95% of it. At DPR 1.25 a synced frame costs 35 to 43 ms (23 to 29 fps). The simulation is stepped once per frame with no dt scaling, so at 29 fps the particles and their mouse repulsion also move at half speed in wall time. That plus about 100 ms of input-to-photon latency is the "cursor takes a long time to get there" symptom.

## How it was measured

- Machine: Intel UHD (0x9B41), Chrome, `ANGLE (Intel, Intel(R) UHD Graphics (0x00009B41) Direct3D11 vs_5_0 ps_5_0, D3D11)`.
- v4 and v3 dev servers (`bun run dev`, ports 5198 and 5197), driven through the Chrome extension. The tab reported `visibilityState: hidden`, so rAF was paused and every number below is a hand-stepped frame.
- Each stage was timed as `performance.now()` around the draw, followed by a 1x1 `gl.readPixels` on the canvas to force the GPU to finish. 4 warm-up runs, median of 25. Sync overhead alone: 0.4 to 0.7 ms.
- Canvas forced to 1878x850 CSS, which gives a 2347x1062 buffer at DPR 1.25. The scene target, camera and post scene were captured by wrapping `renderer.render` for one `__field.step(1)`.
- These synced numbers come out about 2x the 17 to 18 ms reported earlier. The earlier figure likely did not wait for the GPU. The ratios between stages are the useful part. The absolute values also depend on power state (battery or plugged in).

## 1. GPU cost per stage

### v4 (5,625 framed particles, 180 dust, uMaxBlur 4), 1878x850 canvas

| Stage | DPR 1 | DPR 1.25 | DPR 1.5 | DPR 2 |
|---|---|---|---|---|
| Simulation, 2 passes on 75x75 | 1.3 | 1.0 | 0.8 | 0.9 |
| Scene target: clear + draw + 4x HalfFloat resolve | 11.8 | 16.4 | 22.4 | 40.2 |
| Same target, clear + resolve with **nothing drawn** | 13.7 | 15.1 | 19.5 | 34.9 |
| DOF quad to canvas (includes canvas MSAA resolve) | 11.6 | 17.3 | 24.5 | 44.1 |
| **Full `frame()`** | **25.3** | **37.7** | **50.0** | **91.4** |

All values are ms. A second run of the full frame gave 23.0 at DPR 1 and 34.6 at DPR 1.25.

### Breakdown at DPR 1.25 (2347x1062 = 2.49 M pixels)

| Variant | ms |
|---|---|
| Scene into 4x MSAA HalfFloat target (current, `post.js:54`) | 15.8 |
| Scene into 2x MSAA HalfFloat | 12.3 |
| Scene into 4x MSAA UnsignedByte | 15.1 |
| Scene into **non-MSAA** HalfFloat | **1.4** |
| Scene into non-MSAA HalfFloat, half resolution | 1.1 |
| Clear only, any target (no resolve) | 0.5 to 0.6 |
| DOF 32 taps, to canvas (`antialias: true`, `main.js:52`) | 19.9 |
| DOF 32 taps, to a plain RGBA8 target | 13.7 |
| DOF 32 taps, uMaxBlur = 0 (every tap hits one texel) | 12.9 |
| DOF 12 taps, full resolution | 6.1 |
| DOF 32 taps, half resolution | 6.8 |
| DOF 12 taps, half resolution | 3.7 |
| Canvas clear + resolve with nothing drawn | 4.0 |
| Particles only (dust hidden) vs dust only vs both | 16.5 / 13.9 / 15.8 (all inside resolve noise) |
| FrontSide instead of DoubleSide | 16.2 (no change) |

### v3 (10,000 wire particles, DoubleSide, 250 dust, uMaxBlur 8), DPR 1.25

| Stage | ms |
|---|---|
| Full frame | 42.9 |
| Scene into 4x MSAA target | 19.3 |
| Scene into non-MSAA target | 2.4 |
| Same, FrontSide | 3.3 (noise, not cheaper) |
| DOF 32 taps to plain target | 16.6 (vs 13.7 in v4: radius 8 spreads taps across more cache lines) |
| Simulation, 100x100 | 1.3 |

### What dominates

1. **MSAA resolve of the scene target, 14 to 15 ms.** `post.js:54` creates `{ type: HalfFloatType, samples: 4 }`. three resolves it with `blitFramebuffer` at the end of every `renderer.render` into it (`post.js` render, line 77). With the target cleared and nothing drawn, clear + resolve still costs 15.1 ms, while drawing all particles into a non-MSAA target costs 1.4 ms. Under ANGLE on D3D11 this Intel part resolves a 4x 2347x1062 surface in about 14 ms. The 4x HalfFloat surface is 2347 x 1062 x 4 samples x 8 B = 80 MB per frame to read.
2. **DOF gather, 13.7 ms.** `post.js:36` loops 32 times plus the centre tap: 33 fetches x 2.49 M px = 82 M fetches per frame. With uMaxBlur = 0 the cost barely drops (12.9 ms), so the cost is fetch and ALU count, not cache misses. Cost scales with tap count (12 taps: 6.1 ms) and pixel count (half res: 6.8 ms).
3. **Canvas MSAA, about 6 ms.** `main.js:52` passes `antialias: true`, but the only thing drawn to the canvas is one full-screen quad (`post.js:79`). The canvas gets a 4x buffer that is resolved on present and buys nothing (19.9 vs 13.7 ms for the same quad).
4. The particle draw itself is 1 to 2.5 ms. Overdraw, `discard` (`particles.js:129-130` in v3, `:139-142` in v4) and DoubleSide (`particles.js:179-181`) do not register. At 0.065 world size and a 10-unit camera, a particle covers about 10 to 20 px, so 10k x 4 faces x 2 sides is under 1 M fragments against 2.49 M for each full-screen pass. The one interaction worth knowing: `discard` forces MSAA to shade per pixel and write coverage per sample. That only matters while MSAA stays on.
5. The simulation is 1 ms: two passes on 75x75 or 100x100 texels. It is not a factor.

### DPR scaling

Cost is almost entirely per pixel, so a frame scales with DPR squared: 25 ms at DPR 1, 38 at 1.25, 50 at 1.5, 91 at 2 (`main.js:98`, `Math.min(devicePixelRatio, 2)`). A user on a 150% Windows scale sits at about 50 ms (20 fps). At 200% it is about 91 ms (11 fps).

## 2. Input latency: the "cursor moves slowly" symptom

| Candidate | Evidence | Verdict |
|---|---|---|
| (a) OS cursor stutters because the GPU is saturated | Windows draws the arrow on a hardware cursor plane that DWM composes separately. It usually stays smooth even at 100% 3D load. | Unlikely, but easy to check: if the arrow itself jumps, not the scene, this is it. |
| (b) Intentional easing and frame-rate-dependent physics | See below | **Most likely** |
| (c) Lenis smoothing | Lenis 1.x damps with dt, so it keeps pace at low fps. It only affects scroll, not pointer. | Not the pointer symptom. It does make scroll feel heavy at 25 fps. |
| (d) Main-thread work in `frame()` | CPU time to issue one frame, median 0.4 ms (max 5.7 ms, one outlier). `timeline()` allocates one small object per frame (`main.js:30-37`). `sectionProgress()` reads cached `ScrollTrigger.progress`, no layout (`main.js:26`). The pointermove handler only writes `ndc` (`main.js:126-129`). No `getBoundingClientRect`. | Negligible |

Breakdown of (b), with v3 line numbers (v4 is identical in `main.js`):

- **Pipeline latency.** Chrome delivers pointermove once per rAF. At 35 ms GPU frames plus one queued frame and a vsync, the time from moving the mouse to anything on screen is about 1 frame (event wait) + 1 to 2 frames (GPU) + 16 ms. That is 85 to 120 ms at DPR 1.25 and 200 to 280 ms at DPR 2.
- **Camera parallax is eased** (`main.js:167-168`) with `k = 1 - exp(-dt*6)` (`main.js:142`). Time constant 167 ms, 90% settled after 384 ms. This one is dt-correct.
- **Group tilt is instant** (`main.js:156-157`, `ndc.x * 0.12`, `-ndc.y * 0.08`). This part responds within one frame.
- **Mouse repulsion runs on per-frame physics with no dt** (`particles.js:58-64`): spring 0.006 to 0.010 per frame, `mouseForce` 0.03 per frame, friction 0.892 per frame (`config.js` SIM). The spring's natural period is 2π/√0.006 ≈ 81 frames, 1.35 s at 60 fps. At 29 fps the same 81 frames take 2.8 s. Particles pushed by the cursor, and every scroll morph, move at `fps / 60` of the intended speed. At DPR 2 (11 fps) that is 5.5x slower.

So on the user's machine the scene answers the cursor late (about 100 ms of latency, plus 384 ms of camera easing), and the particle field then drifts toward it at half speed or worse. This matches "takes a lot of time to move from one position to another". Fixing frame time fixes most of it. Scaling the simulation by dt keeps it right on any machine that stays slow.

## 3. Frame pacing

- **Two rAF loops**: `renderer.setAnimationLoop` (`main.js:184`) and `gsap.ticker` running Lenis (`main.js:16`), plus the loader's own rAF (`main.js:80-93`) until it finishes. All three are callbacks in the same browser rAF, so they do not fight or double-render. The ticker is registered at module load, before `start()`, so Lenis and ScrollTrigger update before `frame()` reads `sectionProgress()` in the same tick. `lagSmoothing(0)` (`main.js:17`) is fine. One real effect: `ScrollTrigger.update` runs from the Lenis scroll event, so scroll-driven work is triggered by Lenis, not twice.
- **dt clamp**: `Math.min(..., 0.05)` (`main.js:139`). Below 20 fps (DPR 1.5 and up on this GPU), eased values also fall behind wall time, on top of the per-frame physics.
- **Stalls**: v3 and v4 call `renderer.compile` once behind the loader (`main.js:180`). v1 and v2 do not, so their first frame compiles about 10 programs in view: a one-off hitch, not ongoing lag. The only `readRenderTargetPixels` is dev-only `sample()` (`particles.js:283-291`). `renderer.info` shows 10 programs and no recompiles between frames.
- **Minor**: `post.setSize` passes `w * dpr` unrounded (`post.js:67-71`), so at DPR 1.25 the target is 2347.5 px wide. Harmless.
- No pause when the tab is hidden beyond rAF itself (fine). No pause when the scene is idle, but the field animates continuously, so that is by design.

## 4. Gallery page (`designs/gallery/index.html`)

- Iframes start without `src` (`:166`). Clicking a panel's shade sets `src` (`:195`) and **nothing ever unsets it**. Only the fullscreen view is released (`about:blank`, `:216`). Clicking all four panels leaves four WebGL contexts and four full pipelines running. Opening fullscreen with panels loaded adds a fifth.
- Each panel iframe is laid out at the preset viewport (1440x900 CSS by default, `:144`, `:180-182`) and only shrunk with `transform: scale()`. The build inside sees `innerWidth = 1440` and renders a 1440x900 x DPR canvas with both MSAA resolves and the full DOF, even though it shows as a thumbnail. At DPR 1.25 that is about 2.0 M px per panel, roughly 30 ms of GPU each on this laptop. Two loaded panels already drop everything to about 15 fps. Chrome may throttle panels scrolled fully offscreen, but visible ones all run.
- The note on the page, "Only one WebGL context runs at a time" (`:116`), is not true after a second click.
- `?motion=off` (`:147`) is read by nothing. The builds only check `matchMedia('(prefers-reduced-motion)')` (`main.js:10`).

## 5. Ranked fixes

Savings are measured at DPR 1.25, 1878x850, on v4, unless marked estimated. Savings overlap: cheaper passes make the DPR cap save less.

| # | Fix | Where | Saves | Visual cost | Effort |
|---|---|---|---|---|---|
| 1 | Drop MSAA on the scene target: `samples: 0` | `post.js:54` | **~14.5 ms** (15.8 to 1.4). `samples: 2` saves only 3.5 ms. | Edge aliasing on particles. Mostly hidden by DOF and grain. The 1 px wire and frame edges in v3 and v4 may shimmer in motion. Check in a browser. If it shows, add FXAA on the final quad (about 1 ms) rather than bring MSAA back. | 1 line |
| 2 | `antialias: false` on the renderer | `main.js:51/52` | **~6 ms** (19.9 to 13.7) | None. Only a full-screen quad reaches the canvas. | 1 line |
| 3 | Cap DPR at 1 (or 1.25) | `main.js:59/98` | 11.6 ms today (34.6 to 23.0). About 5 ms after fixes 1 and 2 (estimated). On a 150% or 200% display: 27 to 68 ms. | Slightly softer particles. DOM text is unaffected. The canvas is blurred by DOF anyway. | 1 line |
| 4 | Cheaper DOF: 12 taps (7.6 ms saved), or half resolution (6.9 ms saved), or both (10 ms saved) | `post.js:36-44` | 7 to 10 ms | Fewer taps: grainier bokeh, which the film grain partly masks. Half res: needs a composite or upsample, about 1 ms extra, and the in-focus shape must come from the full-res texture or it softens. | Small to medium |
| 5 | dt-scale the simulation: per-step `spring*dt*60`, `friction^(dt*60)`, `mouseForce*dt*60`, or fixed 60 Hz substeps | `particles.js:58-64`, `field.update` | 0 ms | None. Repulsion and morphs keep their designed speed at any fps. Directly fixes the "slow to follow" feel on slow machines. | Small |
| 6 | Adaptive quality: average frame time over 30 frames, step DPR 1.25 to 1 to 0.75 when over about 20 ms, back up when under about 12 ms | `main.js` frame | Holds 60 fps where 1 to 4 are not enough | Resolution drops on weak GPUs only | Small |
| 7 | Gallery: unload other panels when one is clicked, and load panels at `?dpr=0.5` or a smaller preset | `designs/gallery/index.html:187-196` | 30 ms per extra loaded panel (estimated) | None | Small |
| 8 | Snappier pointer response: pointer-driven camera rate 12 instead of 6 (τ 83 ms, 90% in 190 ms), leaving scroll easing at 6 | `main.js:167-168` | 0 ms, about 190 ms less perceived lag | Parallax feels less floaty | 1 line |
| 9 | Pre-compile in v1 and v2 (`renderer.compile` before `setAnimationLoop`) | `main.js:138/141` | One first-frame hitch | None | 1 line |

Not worth it on this evidence:

- Fewer particles or dust, single-sided wire, removing `discard`: 1 to 2 ms combined, and they cost the look.
- Removing per-frame DOM reads or allocations: `frame()` spends 0.4 ms on the CPU.

Projected result after fixes 1 to 3 (estimated from the stage table): sim 1 + scene 1 + DOF about 8.8 (13.7 x 0.64 at DPR 1) + present about 1, so **about 12 ms**. Adding fix 4 gives **about 6 to 7 ms**. That is 60 fps on this Intel UHD with headroom, against 35 to 43 ms now. Verify by driving the build in a visible tab with a real rAF trace after applying the fixes.
