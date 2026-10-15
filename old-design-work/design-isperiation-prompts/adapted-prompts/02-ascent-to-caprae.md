# LOAD BEARING — adapted from `ascent.md`

Adapted 2026-09-14. Source: `../ascent.md`. Source untouched.

Stack for this one is different from `01-orrery-to-caprae.md` by instruction:
Astro with a React island, React Three Fiber and drei, 3D lazy-loaded.

This file is a build prompt. Everything below the rule is the prompt.

---

Build LOAD BEARING — a scroll-scrubbed page for **Caprae Tech**, the
in-house engineering team of a private equity firm, sold as an outside
engagement. Astro, one React island, React Three Fiber with drei. Package
manager `bun`. The 3D never ships in the initial payload and never ships at all
to a reader who asked for reduced motion.

The buyer is an owner, banker, searcher or acquirer, 25 to 70, on a work laptop
with integrated graphics. They check things. The page is the work sample.

---

## WHAT THE SOURCE ARGUES, AND WHAT SURVIVES THE TRANSFER

`ascent.md` is restraint as authority. Three lines of copy across an entire
scroll, and a deliberately empty band in the middle where the footage carries
alone: *"That silence is what makes it feel authored; do not fill it."*

Three things transfer intact:

1. **The scrub is the hero.** Not a hero plus a scrub. One sticky stage, first
   element on the page, and scroll position is the only thing that moves it.
2. **Frame 0 is the landing state.** Nothing plays by itself, ever.
3. **Three lines, and the silence between them is deliberate.**

One thing does not transfer, and pretending otherwise would be dishonest.
ascent sells alpine equipment to people who already want it; a page of three
lines and a product shot works. Caprae sells credibility to a buyer who checks,
and a page carrying no proof is a page that fails its own tier-3 test. So the
scrub stage is the hero and holds the three lines; **the record runs below it as
a compact document.** That is a departure from the source and it is named here
rather than smuggled in.

---

## ⛔ THE NINE SILENT FAILURES

**1. ANYTHING THAT PLAYS BY ITSELF.** The source states this as its own start-over
condition and it is the same here. No autoplay, no idle loop, no ambient drift,
no `useFrame` that advances a clock. If the scene moves when the reader does not
scroll, you built an ambient hero with a scrub bolted under it — two sections
where there should be one. Start over.

**2. A SINE INSTEAD OF A DEFLECTION CURVE.** The tell that separates this from a
decorative wobble. A sine peaks at midspan and looks approximately right, which
is exactly why it is the trap: its curvature is wrong at the supports, where a
real simply-supported beam has zero bending moment and therefore zero curvature.
Use the closed form for uniform load:

```
y(x) = (w / (24·E·I)) · (x⁴ − 2·L·x³ + L³·x)
```

It is one line. It is checkable against any engineering table. It is the
difference between a structure and a ripple.

**3. THE READ-OUT DESCRIBING THE BUSINESS.** Carried unchanged from the orrery
adaptation, because it is the rule this audience enforces. Live computed values
may describe **the render**: load as a fraction of rated, midspan deflection,
scrub percentage, bay count. They may never describe the company. Business
figures are static, quoted, and provenance-marked. No animated counters.

**4. CLAIMING ZERO FAILURES.** The source's spec row reads `600m the wall /
9.2kN rated / 0 failures`. Caprae has **no verified uptime, reliability or
failure figure of any kind**. Shipping "0 failures", "99.9%", or any availability
number is inventing a number about production systems, in front of the one
audience that will ask for the monitoring. The spec row carries verified figures
only. See the copy block.

**5. THE CTA BELOW THE FOLD.** The stage is the first element on the page, so
there is no hero block to put a button in. The primary action therefore lives in
the fixed nav, where it is visible at every scroll depth and every breakpoint.
This is how the constraint and the source's structure reconcile; it is not
optional and it is not a compromise.

**6. FILLING THE SILENCE.** Beats sit at `0.00–0.15`, `0.26–0.40` and
`0.74–0.90`. The band from roughly `0.42` to `0.72` is EMPTY on purpose. Do not
add a fourth beat, a progress label, a floating card, or a scroll cue. The
structure carries it alone. That emptiness is the authored part.

**7. THE 3D IN THE INITIAL PAYLOAD.** React, R3F, three and drei are roughly
200KB gzipped between them — the entire initial-JS budget, before a line of app
code. The island therefore hydrates off the critical path and the scene module
is imported dynamically. The stage's static plate, the three beats, the record
and the CTA are server-rendered HTML and are readable before any script runs.

**8. SHIPPING THE 3D TO A READER WHO ASKED FOR REDUCED MOTION.** Do not hydrate
and then branch inside the component: by then the bundle is already downloaded.
Gate the island at the framework level with
`client:media="(prefers-reduced-motion: no-preference)"`, so a reduced-motion
reader never fetches three at all. The owner of this project runs reduced motion,
so this tier is the one that gets seen.

**9. A STATIC TIER THAT IS A SCREENSHOT.** The reduced-motion and no-JS tiers get
a real drawing: an SVG of the structure at rated load, its curve computed at
build time **from the same closed form** as the live scene. Same maths, different
renderer. A blurred still of the canvas is the failure Direction C was warned
about and it is not acceptable here.

Banned outright, from the project's craft floor: no wheel hijacking, no
smooth-scroll library, no gradients on surfaces, no box-shadows, no bloom or
post-processing, no eyebrow above a heading, no grid of same-size cards, and the
accent never appears as a fill.

---

## THE SCROLL MECHANIC

The sticky stage is the FIRST element on the page.

```
<section class="stage">        height 420vh
  <div class="sticky">         position: sticky, top: 0, height: 100vh
```

420vh, not the source's 700vh. The source is selling a climb and can afford the
length; this project's standing rule is against tall scroll-heavy layouts, and
420vh is the shortest run that still lets three beats breathe with a real gap
between them.

A sticky child inside a tall section is **not** scroll-jacking and does not trap
the page: the scrollbar stays honest, native scrolling is untouched, the wheel is
never intercepted, and scrolling back up unwinds exactly. This is the same call
D-022 already made for Direction D.

Progress, and the damped follow that makes it glide rather than snap:

```
target  = clamp(-stageRect.top / (stageHeight - innerHeight), 0, 1)
current += (target - current) * 0.12
```

Read the stage rect by polling inside the frame loop. Not a `scroll` listener and
not behind an `IntersectionObserver` — both have already failed in this repo, the
observer by silently killing the loop when the stage starts below the fold.

`current` is the single source of truth. The camera, the load, the deflection,
the rail and the two-digit percentage are all pure functions of it. Nothing
accumulates. Reverse is therefore free and no beat can re-fire.

---

## THE SHOT

One continuous take along a structure under rising load. The reader is not
watching a structure fail; they are watching it hold at rated load. That is the
argument: you are buying load-bearing engineering, and the proof is that it does
not move when it matters.

**Geometry.** A simply supported truss, 34 bays across a span `L`. Per bay: top
chord, bottom chord, vertical, diagonal. Four members × 34 bays = 136 segments,
built as ONE `InstancedMesh` of a unit cylinder — one draw call, matrices written
once on mount and again only when the deflection changes.

**Deflection.** Every node's `y` comes from the closed form in Silent Failure 2,
normalised so that midspan deflection at rated load is a visible but structural
`L/240` — the span-over-deflection ratio a real serviceability limit uses. Not
`L/20`, which reads as rubber, and not `L/2000`, which is invisible.

**Load.** `w = wRated · current`. At `current = 1` the structure is at rated load
and holding. It never breaks. There is no failure animation, because a failure
animation would be a claim.

**Camera.** Dollies along the span, `z = lerp(zNear, zFar, current)`, with a
slight look-ahead toward midspan. No orbit controls, no user camera. The reader
drives one axis and one axis only.

**drei** earns its weight on exactly three things and nothing else:
`<PerspectiveCamera>`, `<Instances>`/`<Instance>` if it produces a cleaner tree
than a raw `InstancedMesh`, and `<AdaptiveDpr>` so the frame rate holds on
integrated graphics. If a drei helper is imported and not used, remove it.

**Frame budget.** `dpr={[1, 2]}` clamped, `frameloop="demand"` with an explicit
`invalidate()` when `current` changes — so a reader who stops scrolling costs
nothing. That is the R3F expression of "nothing plays by itself" and it is the
same idea as failure 1, enforced by the renderer.

---

## THE BEATS

Three lines, absolutely positioned over the stage, `opacity: 0`, gaining `.on`
inside their window. Nothing else is ever on the stage.

```
0.00 – 0.15   upper third   "Three weeks. Twelve hundred users."
0.26 – 0.40   lower         "Three hundred thousand calls. Five countries."
0.74 – 0.90   lower         "The team that built them is the team you hire."
```

Every figure in beats one and two is `[VERIFIED]` and each carries its source as
a mono provenance line beneath it, at half the beat's size. Beat three carries no
figure, so it carries no mark.

`0.42 – 0.72` stays empty. See Silent Failure 6.

---

## FIXED CHROME

Outside the stage, fixed, above it.

- **Nav**, top: wordmark `CAPRAE ENGINEERING`, mono links `The record` and
  `The team`, and the primary action `Book a call` as a filled pill at the right.
  The pill is `--paper` on `--ink`, never accent-filled.
- **Scrub rail**, bottom left: a two-digit percentage and a hairline rail whose
  width is `current`. Mono, tabular figures.
- **Spec row**, bottom centre, verified figures only:
  `300,000+ calls · 4 products live · 1 open source`
- Below 820px the nav links and the spec row are hidden. The CTA never is.

---

## THE RECORD

Below the stage, a compact document in a `min(1320px, 92vw)` container, no
panels and no cards. Corrected 2026-09-14 from a 44rem column for the reason
given in `01-orrery-to-caprae.md`: a narrow centred measure is an editorial
choice and this is not an editorial page. Running prose stays at
`--measure: 38rem`; plates, people, steps and figures span. Contents:
the four products with provenance, the five people with their real titles, the
three engagement steps, the four firm figures each carrying "Caprae Capital,
firm-wide", and the footer. Copy is identical to
`01-orrery-to-caprae.md` — use that block verbatim, including its prohibition on
the four unconfirmed product names.

---

## THEME

```
ink     #0B0B0C     the ground
paper   #EDEDEA     type, CTA fill, structural members
soft    #8C9098     secondary type only, verify against ink
rule    rgba(237,237,234,.14)
AMBER   #E0A95C     the accent
```

Amber is the colour of an instrument lamp and it appears on exactly four things:
the load rail, the scrub rail, the provenance marks, and the load figure at rated
load. Never a fill.

Two families only, which is the source's own discipline:

```
Inter Tight 500/600   display and the beats, clamp(30px, 4.6vw, 62px),
                      letter-spacing -0.035em
Inter Tight 400       running text in the record, 17px minimum
JetBrains Mono 400/500  nav links, spec row, scrub percentage, every read-out
```

17px is a floor. The audience runs to 70.

---

## THE THREE TIERS

**Full.** As above.

**Reduced motion.** The island never hydrates, so three is never fetched. The
stage collapses to `height: auto`, the sticky child goes static, the build-time
SVG plate renders at rated load, and all three beats show at once in document
order. It must read as a designed page, not a disabled one.

**No JS, or WebGL unavailable.** Identical to the reduced-motion tier, because
both are the same server-rendered HTML. Every word of the record, every product
link and the working CTA are present before any script runs.

---

## ⛔ VERIFY BEFORE YOU CALL IT DONE

Measured, not asserted. Screenshots or it did not happen.

1. **Nothing plays by itself.** Load the page, do not touch the scroll, wait ten
   seconds. Nothing on the stage may change. Then confirm `frameloop="demand"` is
   actually demanding: count renders while idle. It must be zero.
2. **Frame 0 is the landing state.** On load the structure is at zero load and
   the first beat is already visible at `current = 0`.
3. **The deflection is the closed form.** Sample the rendered midspan `y` at five
   values of `current` and compare against `y(L/2)` computed independently. They
   must agree to within a pixel. A sine will not.
4. **Purity.** Scroll to the end of the stage and back. `current` returns to 0,
   every beat is hidden again, and no beat re-fired on the way up.
4b. **Reviewing the full tier on a reduced-motion machine.** The gate is a media
   query in BOTH the Astro client directive and the CSS, so on such a machine the
   full tier is invisible and therefore unreviewable. `bun run review` writes
   `dist/index.fullmotion.html` with both neutralised. It is a review artifact
   and never a shipping page.
5. **Reduced motion ships no 3D.** Load with `prefers-reduced-motion: reduce` and
   inspect the network panel. Zero requests for three, R3F or drei. This is the
   check most likely to be skipped and it is the one the owner will see.
6. **Initial JS.** Measure the gzipped bytes that block first paint. Under 200KB,
   and the 3D chunk must not be among them. Report the real number.
7. **No invented figures.** Grep with WORD BOUNDARIES for `uptime`,
   `availability`, `SLA`, `99\.\d`, `0 failures`. Zero hits.
   Then Vault, Searcher Coach, Simba Studio. Zero hits.
   Two corrections to an earlier draft of this check, both found by running it:
   banning the `%` glyph outright is wrong, because the scrub legitimately reads
   "load 0% of rated", which describes the render, and "20%+ MoM growth" is a
   verified figure carrying its firm-wide label. And a substring search for
   `SLA` matches `tranSLAte` and Astro's own `astro-slot`. Boundaries, not
   substrings.
8. **Provenance.** Every business figure carries its source inline; every
   firm-wide figure carries its scope label.
9. **The fold.** The CTA is visible at 390px, 768px, 1280px and 1920px, at the
   top of the page and at the bottom. Screenshot each.
10. **No horizontal overflow at 390px**, and the stage still reads at that width.
11. **Budget.** 60fps on integrated graphics. LCP under 2.0s on throttled 4G.
    CLS under 0.05 — a sticky stage with a canvas is a classic CLS offender, so
    reserve its box. Console clean.

---

## VOICE

Three lines across the whole scroll and not one word more. The structure carries
it. Everything else this page has to say, it says below the fold in a document,
in plain sentences, with a source attached to every number.
