# Results on branch perf/keep-3d-fixes (2026-10-22)

Home page, Lighthouse 13.5.0, local `vite preview` builds, this Windows machine. Base is
`b871b69` (what capraetech.io serves). What changed and why: D-100, D-101 in `DECISION.md`.
The 3D stays for every visitor; no setup removes it.

This machine's speed drifts a lot between runs (Lighthouse benchmark index 386 to 1710), so
only runs at a similar index, taken interleaved, are compared directly.

## GPU (most visitors): mobile, 1.2x CPU like PageSpeed

Base and branch interleaved (base, new, new, base, ...), benchmark 1333 to 1710
(`raw/ab2-*.json`, script `ab-base.sh`):

| | Performance | TBT (ms) | FCP (s) | LCP (s) |
|---|---|---|---|---|
| Base | 57, 66, 58, 59 | 1989, 1149, 1798, 1956 | 2.14 to 2.93 | 2.89 to 3.08 |
| Branch | 67, 66, 67, 67 | 1105, 1134, 1051, 1077 | 2.12 to 2.16 | 2.92 to 2.94 |

One more branch run from `measure.sh` (`raw/fix-final2-home-gpu-1.json`, benchmark 626):
Performance 87, TBT 459 ms, FCP 1.54 s, LCP 2.02 s. One run only: the system stopped that
measurement for low memory, and the other five runs could not load the page (deleted).

What made the difference: the long task of the first frame went from 423 to 915 ms to 156 to
188 ms. Shaders now compile ahead of the first frame in the variant they draw with, and the
page makes one WebGL context instead of three (`check-startup-profile.js`). The engine setup
task is the same size as in base (0.94 to 1.02 s, base 0.78 to 1.19 s); in the CPU profile
most of it is creating the WebGL context.

An earlier version of the branch measured no better than base on GPU (TBT 1.09 to 2.63 s, at mixed machine speed,
`raw/fix-after12-*`, `raw/fix-final-home-gpu-*`, `raw/ab-*`); D-101 has the cause.

## Software WebGL (what PageSpeed's test machine uses) and no WebGL

Measured on commit `aaf6859`, before the shader and context fix (`raw/fix-base-*`,
`raw/fix-final-*`, script `measure.sh`):

| Setup | | Performance | TBT (ms) | LCP (s) | Accessibility |
|---|---|---|---|---|---|
| Software WebGL (desktop preset) | Base | 58, 59 | 40,180, 40,078 | 0.64, 0.63 | 90 |
| | Branch | 96, 99 | 159, 107 | 0.47, 0.54 | 97 |
| No WebGL (mobile, 1.2x) | Base | 94, 93 | 0, 0 | 2.74, 2.74 | 94 |
| | Branch | 92, 98 | 4, 0 | 2.96, 2.00 | 100 |

- Software 97: the navbar dropdown arrows were 22 px wide where the link overlapped them. Fixed
  after these runs; a desktop accessibility run then scored 100.
- The shader and context fix has no Lighthouse runs in these two setups (stopped for low
  memory). Checked in headless Chrome instead: software starts at the light level and draws,
  no WebGL shows the still image, no page errors, on home and /what-we-build/mvp-development/.

## Other numbers

- DOM elements on home: 1,979 to 1,983 (base), 909 to 910 (branch).
- Best Practices 100 and SEO 100 in all six `fix-final` runs. Base: SEO 100, Best Practices 100
  except 96 without WebGL (three.js logged three console errors while failing; the branch
  checks for WebGL2 before starting three).

## Screenshots (`ui-preview/step1-2/`)

| File | Shows |
|---|---|
| `home-gpu-final.png`, `mvp-gpu-final.png` | Full quality after the shader and context fix |
| `home-gpu-dev.png` | Full quality, earlier in the branch |
| `home-software-light.png` | The light level under software WebGL |
| `home-no-webgl-still.png`, `mvp-no-webgl-still.png` | The still image without WebGL |

## Not measured

- The live site and PageSpeed itself: the branch is not deployed.
- Real phones and real visitors.
- Software and no-WebGL Lighthouse runs of the last engine change.
