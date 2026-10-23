# Are the GTmetrix and PageSpeed reports true? Verdict

Checked 2026-10-22 against the live site (https://capraetech.io, build b871b69) and the code in `seo/code`.
Four agents worked in parallel; their full reports are in this folder. I re-checked the key claims myself
(code lines, response headers, contrast ratios, throttling settings).

## The two reports

| | PageSpeed Insights | GTmetrix |
|---|---|---|
| Saved file | `../pagespeed/PageSpeed Insights.html` | `../gtmetrix/Latest Performance Report for_ ...html` |
| When | Oct 21 2026, 6:42 PM IST | Oct 21 2026, 6:45 PM IST (6:15 AM Seattle) |
| Device | Mobile: emulated Moto G Power, Slow 4G, 1.2x CPU slowdown | Desktop, Seattle, Chrome 154 |
| Tool | Lighthouse 13.5.0, HeadlessChromium 153 | Lighthouse 12.6.1 |
| Scores | Performance **51**, Accessibility 93, Best Practices 100, SEO 100 | Performance **85%**, Structure 98% |
| Total Blocking Time | **25,420 ms** | **40 ms** |
| LCP / FCP / CLS | 3.0 s / 2.6 s / 0.004 | 1.9 s / 1.4 s / 0.04 |
| Page weight | 689 KiB, including `/shapes.bin` 313 KiB | 374 KB, **no `/shapes.bin`** |
| Real-visitor data | None ("No Data") | None |

Correction: on 2026-10-22 I first told you PageSpeed was "Performance 93, Accessibility 100". That came from
a rough text scrape that misaligned the numbers. The real figures are the ones above.

## Short answer

**Both reports measured correctly, but each measured a different page, and neither one is what a real visitor sees.**

- **PageSpeed's 25 s of blocking is a test-machine artifact.** Its test browser had no graphics card, so it drew the particle
  3D in software on the CPU. Each frame became a 0.4 to 1 s task, forever. Reproduced locally: switching only the
  graphics backend to software gives 37 to 40 s of blocking (and 2 of 3 runs hung); on this laptop's Intel UHD
  graphics the same test gives 0.5 to 1.4 s (`01-pagespeed-verification.md`, `04-gpu-vs-software-experiment.md`).
- **GTmetrix's 85% and 40 ms are also an artifact, the other way.** Its browser had no WebGL at all, so the
  particle engine gave up at once and never downloaded `/shapes.bin`. It rated the page *without* the 3D.
  Reproduced locally: with WebGL off, blocking is 0 to 61 ms and `/shapes.bin` is never requested (`02-...`, `04-...`).
- **The truth for a visitor with ordinary integrated graphics sits in between:** about 0.5 to 1.4 s of blocking on
  PageSpeed's mobile settings, about 2 s on a harsher 4x slow-phone setting, 0.2 to 0.4 s on desktop. That is
  still above Google's 0.2 s "good" line on mobile, so there is real work to do. The engine's setup script is most
  of that cost, not the frame drawing (`04-...`).
- **Almost every other finding is real** and reproduced on the live site today (tables below).

## Verdict on the main claims

| Claim | Report | Verdict | Why |
|---|---|---|---|
| Performance 51, TBT 25.4 s, main thread 39 s, 20 long tasks | PageSpeed | TRUE for its test machine, NOT what visitors see | Software WebGL. Same pattern reproduced (37 to 40 s); with a GPU, 0.5 to 1.4 s |
| Performance 85%, TBT 40 ms | GTmetrix | TRUE for a browser without 3D, NOT what visitors see | No WebGL, engine never ran, no shapes.bin; reproduced (0 to 61 ms) |
| LCP 3.0 s mobile / 1.9 s desktop on the hero heading | Both | TRUE | Reproduced 2.9 s mobile; cause: 0.5 s script building hidden sections, heading fade-in from opacity 0, fonts not preloaded |
| Server response 546 ms | GTmetrix | TRUE | Cloudflare never caches the HTML (`DYNAMIC`, origin `no-cache`), every visit goes to the AWS server |
| DOM ~1,960 elements | Both | TRUE | 2,017 today; **1,074 (53%) are the 20 hidden Lab sections** (two agents measured the same 1,074) |
| Unused JS 60 to 110 KB in the 3D file | Both | TRUE, low impact | Bytes three.js's renderer costs. GTmetrix's 110 KB is inflated because the engine never ran there |
| Unused CSS ~17 KB | Both | TRUE | Font files for Cyrillic, Greek and Vietnamese the site never uses (44 font rules, 6 used) |
| Render-blocking CSS and `email-decode.min.js` | Both | TRUE | The script is Cloudflare's Email Obfuscation setting, not our code |
| Cache policy on Cloudflare scripts | GTmetrix | TRUE, not fixable by us | Cloudflare sets those headers |
| Low contrast in the comparison table | PageSpeed | TRUE, and under-reported | #6e727a on black = 4.35:1 (needs 4.5:1); same grey fails on 9 more spots; mobile label 2.35:1 |
| Heading order (h4 "Feature library") | PageSpeed | TRUE | `index.html:550`, also on `/pricing/` |
| No `<main>` landmark on home | PageSpeed | TRUE | Home has none; inner pages do |
| Two "Book a call" links, different targets | PageSpeed | TRUE (informative) | Nav goes to `/book-a-call/`, hero goes to `#book` |
| CLS 0.004 / 0.04 | Both | NOT REPRODUCED | Local runs show 0.07 to 0.24 (desktop 0.16 to 0.19), cause "web font loaded" on the hero. Needs investigation |
| Best Practices 100 | PageSpeed | CHANGED | Now 81 locally: Cloudflare's bot-detection script (added since) uses a deprecated API |
| Source maps missing | PageSpeed | TRUE, no user impact | |

Counts across the four reports: PageSpeed 18 confirmed (6 only under software 3D), 3 changed, 2 not reproduced,
2 can't verify. GTmetrix/network 17 confirmed, 2 changed, 7 can't verify with network tools. Code: 7 real
problems, 1 test artifact, 7 minor.

## What none of the reports showed (found while verifying)

1. **The 3D never stops drawing.** It keeps computing and rendering behind the footer, after the scene settles, and
   even with "reduce motion" on (`stage.js:222`, only a hidden tab pauses it). Battery and fan cost on every page.
2. **There is no check for slow software 3D** (`stage.js:21` has no `failIfMajorPerformanceCaveat`). A visitor whose
   Chrome falls back to software rendering gets the 25-second freeze. One flag fixes it.
3. **`shapes.bin` is sent uncompressed:** 320 KB that compresses to 64 KB. The server's gzip runs at level 1 (weakest).
4. **Small static files are re-checked with the server on every request** (`max-age=14400, must-revalidate`, Cloudflare
   `REVALIDATED`), which is why GTmetrix shows a 338 ms wait for a 658-byte favicon.
5. **Cloudflare injects four extras** into every page: email obfuscation, the analytics beacon, bot-detection JS and
   Speed Brain. Each adds requests; the bot script is new since the reports.
6. **All 38 inner pages run the same engine,** so they will show the same PageSpeed pattern. On a GPU: /pricing/ TBT
   670 ms, /what-we-build/mvp-development/ 1,026 ms.

## Limits of this check

- No fresh PageSpeed run from Google: its API now needs a key (quota 0 without one). Local Lighthouse 13.5.0 with
  PageSpeed's exact settings was used instead.
- One laptop (i5-10210U, Intel UHD). Not a phone, not a 50+ buyer's work laptop, no real-visitor data.
  Cloudflare Web Analytics (already on the site) may hold real-visitor timings.
- The CLS difference (0.004 in PageSpeed vs up to 0.24 locally) is not explained yet.

## Files

| File | What |
|---|---|
| `00-pagespeed-extract.txt`, `00-gtmetrix-extract.txt` | Clean text of the two saved reports |
| `01-pagespeed-verification.md` | PageSpeed, claim by claim, with local Lighthouse runs |
| `02-gtmetrix-network-verification.md` | GTmetrix, claim by claim, with header, caching, compression and DOM measurements |
| `03-code-root-causes.md` | Every finding traced to file and line, with the smallest fix |
| `04-gpu-vs-software-experiment.md` | The GPU vs software vs no-WebGL experiment |
| `05-all-issues-by-report.md` | Every issue and weak number from both reports, with the reason and the fix ID (33 PageSpeed, 28 GTmetrix, 9 found only while verifying) |
| `06-what-changes-on-screen.md`, `ui-preview/` | What each fix changes on screen, with before/after screenshots from the live site |
| `07-branch-results.md` | Before and after on branch perf/keep-3d-fixes (D-100, D-101), with the scripts that measured it (`measure.sh`, `ab-base.sh`, `cdp-check.js`, `check-*.js`) |
| `raw/` | 65 Lighthouse JSON runs (28 from the verification; `fix-*`, `ab-*`, `ab2-*`, `ab-c4-*` from the branch, see 07), curl measurements, DOM counts (31 MB) |
