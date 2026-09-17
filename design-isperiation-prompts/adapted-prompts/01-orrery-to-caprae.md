# ORIGINATION — adapted from `orrery.md`

Adapted 2026-09-14. Source: `../orrery.md`. Source untouched.

This file is a build prompt, not a design note. It is written to be handed to a
build agent whole. Everything below the rule is the prompt.

---

Build ORIGINATION — a landing page for **Caprae Tech**, the in-house
engineering team of a private equity firm, sold as an outside engagement. Behind
the whole document, forty-two thousand companies advance through a deal pipeline
on a size-dependent cycle law, rendered in WebGL2. ONE self-contained HTML file:
inline `<style>`, inline `<script>`, fonts by `<link>`. Raw WebGL2, no three.js,
no library. No image, video or mesh anywhere on the page.

The buyer is an owner, banker, searcher or acquirer, aged 25 to 70, on a work
laptop with integrated graphics. They will open LinkedIn and check a title. They
will click a product link and use it. The page is the work sample: if it looks
generated, the claim is refuted before a word is read.

---

## ⛔ THE NINE SILENT FAILURES

Each produces a page that looks approximately right and is wrong. Seven are
mechanical. Two are failures of honesty, and on this page those are worse.

**1. THE FIELD IMPLYING A CONVERSION RATE.** The most dangerous tell. The field
depicts origination as a mechanism. It is NOT a chart of Caprae's funnel and no
figure in it is sourced. The instant you put an axis, a count, a percentage or a
label on the field, you have published an unverified claim to an audience that
checks. The field carries no numbers. Every number on this page lives in the type
and carries a provenance mark. There is no third option.

**2. A LIVE READ-OUT THAT DESCRIBES THE BUSINESS.** The read-out rule is inverted
from the obvious one: computed values may describe **the render** — bodies in
field, cycles resolved since load, session elapsed, the stage holding the most
bodies. They may never describe the company. Business figures are static, quoted
from the copy block below, and marked. A page that animates a client-count ticker
is the one thing this audience distrusts on sight. No animated counters anywhere.

**3. A CONSTANT CYCLE LENGTH.** The obvious mechanical tell. If every company
advances at the same rate the field reads as a conveyor belt, not a market. A
$50M deal does not close in the time a $2M deal closes. Cycle time scales with
deal size: `cycle = 0.55 + 1.9 · pow(size, 0.70)`. Be honest about what that is —
the exponent is a calibration, not a physical law, and it is not presented as
one. What is non-negotiable is that it is strictly monotonic and that the spread
between the innermost and outermost band is visible within three seconds.

**4. UNIFORM STAGE DURATIONS.** Real M&A spends most of the clock in diligence.
If the five stages take equal time the field pulses evenly and diligence reads as
no harder than screening — which every person in this ICP knows is false, and it
is the specific falsehood they are qualified to spot. The time weights are
`0.08 / 0.12 / 0.15 / 0.48 / 0.17`. Diligence alone outweighs the other four
combined. That asymmetry is the point of the mechanism.

**5. A UNIFORM CLOUD.** A field with no gaps is a smear. Five size bands with
clear space between them is what makes it read as a market with structure rather
than noise.

**6. A FLAT RANDOM SCATTER.** Use the sum of two uniforms, not one, so the field
bunches toward the plane with thin wings. One uniform gives you a slab.

**7. NO NEAR/FAR CUE.** A face-on field at uniform alpha is a flat annulus. Fade
the far half slightly — `smoothstep` on the rotated z — and it becomes a volume.

**8. A LIGHT-PAGE TOKEN ON THE DARK GROUND.** This project has shipped this bug
once already and caught it in a browser. A muted grey chosen against paper sits
at roughly 1.4:1 on the void and the field disappears; only the path renders.
Resting points use `--paper` at low alpha, never a mid grey. Verify in a browser,
not by eye in the editor.

**9. THE ANGLE DERIVED FROM THE PHASE.** Found in the first build of this
direction, by measurement rather than by eye. If `theta = phase0 * TAU + ...`,
then angular position is a linear function of cycle phase, so every body at the
same pipeline stage occupies the same arc. The field stops being a populated
market and becomes one rotating lobe — and because diligence holds 48% of the
clock, that lobe is enormous. It pushed the alpha-weighted screen centroid to
55.95% of viewport width on a page whose layout is centred. `theta0` is its own
independent random attribute. The resolved path still works: for a single body
time cancels out of `theta0 * TAU + (u - phase0) * 0.30` exactly as before.

Banned outright, carried from the project's craft floor: no gradients on
surfaces, no box-shadows, no bloom or post-processing, no kicker or eyebrow line
above a heading, no grid of same-size cards, no smooth-scroll library, no wheel
hijacking, no pinned section that traps the page, and the accent hue never
appears as a fill.

---

## THE SIMULATION

There is no simulation state and no feedback buffer. Position is a PURE FUNCTION
of `(attributes, time)`. Scrubbing the clock backwards is exact, the field can
never drift, and the whole thing costs one static buffer.

This is not a performance trick, it is the argument: a page selling engineers
demonstrates a system correct by construction rather than one that happens to
look stable.

```
N = 42 000 desktop · 22 000 tablet · 11 000 mobile · one static frame at reduced motion
```

Per-body static attributes, two vec4s:

```
aDeal1 = vec4(size, r0, scatter, phase0)
aDeal2 = vec4(dropAt, theta0, cycle, seed)   // theta0 independent of phase0
```

Cycle and progress:

```
cycle = 0.55 + 1.9 · pow(size, 0.70)
u     = fract(phase0 + t / cycle)        // fraction of this body's cycle elapsed
```

Stage mapping. `u` is time; `s` is distance along the pipeline. They are not the
same, and conflating them is Silent Failure 4. Time weights cumulate to
`c = [0.00, 0.08, 0.20, 0.35, 0.83, 1.00]`; the five stages occupy equal spatial
fifths `[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]`. Unroll five `mix` steps, no loop:

```
s = 0.0
s = mix(s, mix(0.0, 0.2, (u - 0.00) / 0.08), step(0.00, u) * step(u, 0.08))
s = mix(s, mix(0.2, 0.4, (u - 0.08) / 0.12), step(0.08, u) * step(u, 0.20))
s = mix(s, mix(0.4, 0.6, (u - 0.20) / 0.15), step(0.20, u) * step(u, 0.35))
s = mix(s, mix(0.6, 0.8, (u - 0.35) / 0.48), step(0.35, u) * step(u, 0.83))
s = mix(s, mix(0.8, 1.0, (u - 0.83) / 0.17), step(0.83, u))
```

Stage names, in order, for the static legend in the type: **Sourced · Screened ·
LOI · Diligence · Close**. Diligence is the fourth and it holds the field for
nearly half of every cycle.

Position. The field converges: radius contracts and scatter tightens as a company
advances, so a wide unsorted rim resolves into a single bright point at the
centre.

```
k     = smoothstep(0.0, 1.0, s)
R     = mix(r0, 0.05, k)
theta = theta0 * TAU + t * (0.30 / cycle)    // NOT phase0, see failure 9
z     = scatter * (1.0 - 0.82 * k)
p     = vec3(R * cos(theta), R * sin(theta), z)
```

Attrition. Most companies never reach close. `dropAt` is the value of `s` at
which a body leaves the pipeline; past it, it drifts outward and fades:

```
dead   = step(dropAt, s)
p.xy  *= 1.0 + dead * (s - dropAt) * 5.2
alpha *= 1.0 - dead * smoothstep(0.0, 0.16, s - dropAt)
```

Five size bands, weighted `0.30 / 0.26 / 0.20 / 0.14 / 0.10` — small deals are
the many, large deals are the few:

```
band 1  size 0.05–0.18  r0 1.66–1.92  dropAt from 0.18
band 2  size 0.18–0.34  r0 1.32–1.52  dropAt from 0.22
band 3  size 0.34–0.55  r0 1.00–1.18  dropAt from 0.26
band 4  size 0.55–0.78  r0 0.72–0.86  dropAt from 0.30
band 5  size 0.78–1.00  r0 0.46–0.58  dropAt from 0.34

The r0 ranges must NOT touch. Contiguous ranges reproduce Silent Failure 5 —
the first build of this direction had them contiguous and the field was a
smear. The space between bands is the structure.

dropAt is skewed, not uniform: `lo + (1.02 - lo) * pow(rand, 2.2)`, so most
companies leave early and roughly 1% survive to the close. The 1.02 ceiling
keeps survivors off the s = 1 boundary.

scatter = (u1 + u2 - 1) * 0.22 * (1.25 - size)     // two uniforms, not one
```

**Index 0 is THE CLOSE.** Negative seed, pinned to the origin, twenty-six times
the point size, `--paper` near-white, never dimmed, never dropped. It is the one
body the whole field is converging on.

**The resolved path.** A second draw, `gl.LINE_STRIP`, 64 vertices, tracing one
body's complete route from `s = 0` to `s = 1` in the accent. This is a deliberate
departure from the source prompt's single-draw-call discipline, and it is taken
because the resolved path is the metaphor, not decoration: most companies drift,
one route resolves. The path re-seeds to a different body every 14 seconds with a
1.2s crossfade. It is the only accent-coloured thing on the canvas.

---

## THE DRAW

`gl.POINTS`, additive `(SRC_ALPHA, ONE)`, no depth test.

```
gl_PointSize = uPx * (close ? 26.0 : 1.0 + large * 3.1) * (26.0 / max(2.0, cp.w))
uPx          = 0.62 * DPR

vA = (0.18 + 0.52 * fract(seed * 13.7))
   * (1.0 + large * 2.0)
   * (0.62 + 0.38 * smoothstep(-1.6, 1.6, -w.z))     // the near/far cue
```

Resting bodies render `--paper` at 10–42% alpha; depth is carried entirely by
per-point alpha, so the field reads grey rather than white. Roughly 1.5% are
`large` and shade warm. The close is the only pure-white thing on the canvas. The
accent exists on the resolved path and nowhere else in WebGL.

Fragment: a tight core `exp(-d * 6.5)` plus a wide halo `exp(-d * 1.7) * 0.3`,
discard outside the disc.

The vignette is a fixed `radial-gradient` layer above the canvas. Never a CSS
`filter` on the canvas — that forces a readback every frame.

---

## THE FRAME

DPR clamped twice:

```
max(1, min(coarse ? 1.5 : 2, devicePixelRatio, sqrt(2_200_000 / (w * h))))
```

Resize only when the size actually CHANGED. ONE `requestAnimationFrame` loop,
`dt` clamped to 0.05s.

**SCROLL RUNS THE CLOCK FASTER** — `dt × (0.85 + p · 5.5)` — rather than moving a
camera down the page. The subject is throughput over time, and a reader further
down the record has watched more cycles resolve. This preserves the project's
standing contract: progress is a pure function of scroll position, damped toward
target, so reverse is free and nothing re-fires. No wheel hijacking. The canvas is
fixed behind the document; no section is ever pinned.

**Where the drag applies.** Below the fold this page is a reading document and
text selection must keep working, so the field takes the drag only in the first
viewport or in the side margins beside the column. Links and buttons never take
it. Per-move delta is clamped so one flick cannot spin the field.

**Known limitation, stated rather than hidden:** the field is rotationally
symmetric about its own axis, so yaw is very nearly a visual no-op. Only pitch
and the resolved path give the drag visible feedback. Do not claim the drag does
more than it does.

**DRAG ROTATES THE FIELD**, with inertia: yaw and pitch velocities decayed by
`pow(0.0016, dt)`, pitch clamped to `[0.16, π − 0.16]`, pitch easing back toward
its scroll-driven rest when the pointer is up. Touch drags rotate; they never
capture the page scroll.

Read scroll position by polling inside the rAF loop, not from a `scroll` event
listener and not behind an `IntersectionObserver` gate. Both have already failed
in this project: the observer silently kills the loop when the stage starts below
the fold, and the scroll event has proved unreliable on the standalone page.

The canvas must never block first paint. The hero type and the CTA render and are
readable before WebGL initialises. Hold a minimal mono preloader open until the
first frame is drawn, with 4.0s of patience, then lift it. If WebGL is
unavailable, lift it immediately and show the page without the field.

---

## LAYOUT

**A FULL-WIDTH RECORD.** The canvas is fixed at z-index 0, the vignette at 1,
the page at 2 in a container of `min(1320px, 92vw)` with NO panels and NO cards
anywhere.

Corrected 2026-09-14. This originally specified a single centred **44rem**
column, carried across from orrery's "centred almanac". That was wrong for this
page and the owner called it: orrery is an observatory's printed matter, where a
narrow measure is the point, and at 1440px a 44rem column leaves roughly 360px
of dead gutter on each side. The project's standing rule is density over empty
space, with generous whitespace reserved for editorial content, and a sales page
is not editorial. The narrow column also contradicted this repo's own craft
floor, which requires products to be **full-width plates, not a narrow stack**.

So: the container spans, and the horizontal axis carries structure.

- Running prose keeps a readable measure, `--measure: 38rem`. A 1300px line of
  body text is its own bug; widening the container is not licence to widen the
  measure.
- Each product is a full-width plate on a two-column split: name, kicker and
  date at the left, body and figures at the right, hairline-separated. Still not
  a card, and now it uses the page.
- The five people run two-up, the three engagement steps three-up, the four firm
  figures four-up, the wedge points two-up.
- Below 1080px the plates and steps collapse to one column; below 900px
  everything does. Measured gutter at 1440px: 53px each side, from 360px.

The primary action sits inside the first viewport at every breakpoint, no more
than 480px from the top edge. That is a hard constraint; the field works around
it, never the other way round.

Bands, in order:

1. Centred hero — H1, sub, CTA, hint
2. A four-cell read-out rule
3. **The record** — four dated product entries
4. **The wedge** — one statement, four lines
5. **Who they report to** — five people
6. **How it works** — three steps
7. **The firm** — four figures, labelled firm-wide
8. Footer

---

## THE READ-OUT

Computed, never written — but computed about **the render**, never about the
business. Re-read Silent Failure 2 before writing this.

```
Bodies tracked   {N, localised}                                        live
Cycles resolved  {count crossing s = 1 since load}                     live
Field elapsed    {mm:ss of the scaled clock, not the wall clock}       live
Stage            {name of the stage holding the most bodies this frame} live
```

All four are true statements about the canvas. None is a claim about Caprae.

Every business figure in the type carries a provenance mark: a superscript
numeral and a rule leading to its source, set inline in the sentence, never in a
footer. A number without a provenance mark does not ship. Figures belonging to
the parent firm carry the scope label "Caprae Capital, firm-wide" in the mark
itself, not in small print elsewhere.

---

## TYPE

```
Display  Switzer 500/700        H1 at clamp(1.9rem, 4.3vw, 3.4rem),
                                line-height 1.22, letter-spacing -0.025em,
                                text-wrap: balance
Body     Public Sans 400/500    17px minimum, never smaller, anywhere
Mono     JetBrains Mono 400/500 chrome, read-outs, dates, measurements,
                                provenance marks

https://api.fontshare.com/v2/css?f[]=switzer@500,700&display=swap
https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap
```

All three are OFL and self-hostable. The prototype may link them; production
self-hosts, because a site selling engineering competence does not make a
third-party font request. Mono is measurement, not costume: it appears on
read-outs, dates and figures, never on running prose.

17px is a floor, not a starting point. The audience runs to 70.

---

## COLOUR

```
void    #07080A    the ground
paper   #E8E6E1    type, resting bodies, the close, CTA fill
soft    #8A8F98    secondary type only — verify contrast, Silent Failure 8
rule    rgba(232,230,225,.14)
STAMP   #D4482E    the accent
```

One hue. The stamp red is the colour of a mark made on an executed document — the
close date, and the deal that got there. It appears on exactly four things: the
resolved path in the canvas, the eyebrow dot, the dates in the record, and the
provenance marks. Never a fill, never a button background, never a panel. The
primary action is `--paper` filled with `--void` text.

---

## COPY (verbatim)

Every line traces to a `[VERIFIED]` fact. Do not add, invent, round or
extrapolate a number. Where a figure belongs to the parent firm, the label
travels with it.

**Nav** — The record · The team — CAPRAE ENGINEERING — Book a call

**Eyebrow** — Part of Caprae Capital · Four products live, one open source

**H1** — Engineers who already | build for operators.

**Sub** — Our team builds the software Caprae's own searchers, bankers and
acquirers use every day. Four products live, one open source. That team is now
available to yours.

**CTA** — Book a call  **Hint** — Drag the field

**Read-out** — Bodies tracked {live} · Cycles resolved {live} · Field elapsed
{live} · Stage {live}

**H2** — The part a dev shop | cannot copy

Every agency claims it understands your business. Ours reports into a private
equity firm that closes deals with operators, and sits in recurring meetings with
them. Our engineers have already survived the founder relationship. You are not
paying to teach them what a deal looks like.

- They know what an operator asks for, which is rarely what they say first.
- They have seen a requirement change three times in a month and shipped anyway.
- They understand diligence pressure and why a close date is a close date.
- They do not need a product manager to translate business intent into a ticket.

**H2** — Four products. Live, | paid, and open | in a new tab

Not case studies. Software strangers use.

```
SaaSquatch Leads   B2B lead generation and enrichment
                   saasquatchleads.com
                   Built in-house from zero. Three-week beta drew 1,200+
                   signups. Public at $20/month.
                   Flask · Vite · React · TypeScript · ML pipeline · AWS

Cold Call Killers  Full-funnel B2B outbound system
                   coldcallkillers.io · launched June 2026
                   Human callers, robodialing, number screening, call
                   intelligence, email, LinkedIn and physical mail in one
                   engine. Ships with Dial Sniper and Call Intelligence as
                   standalone tools.
                   300,000+ calls across 5 countries

CLOVER             Closed-Loop Origination via Exclusive Referrals
                   Open source, in beta
                   Lets searchers reassign deals that are too big, too small
                   or off-thesis, and earn a success fee on what they pass.
                   Origination routing, in the open.

Bankers Edge       Advisory platform
                   bankersedgeadvisory.com
                   Client build, live in production.
```

Four further products exist. Their names are unconfirmed and they DO NOT appear
on this page in any form. Do not invent a name, do not write "and more", do not
leave a placeholder entry. Four is the record.

**H2** — Who they report to

Not a stock advisory board. The people our engineers actually sit with.

```
Kevin Hong        Founder and Managing Partner, Caprae Capital · Chicago Booth
Eric Nehrlich     Chief of Staff, Caprae Capital · Google
Felix I. Odigie   Deal Advisor. Founder and Managing Director,
                  Quoin Advisors · Wharton
Hereford Johnson  Principal Adviser. Founder, Third Equity Partners · Kellogg
Zackary Beckham   Partner for Strategic Investments. Founder, ITSco ·
                  Arizona State
```

Only Kevin Hong founded Caprae. Do not call these five "five founders" — the
audience checks LinkedIn and three of these titles belong to other firms. The
institutions are the proof and they are already named.

**H2** — How it works

```
01  Call   Thirty minutes. What you are building, what is in the way.
02  Scope  A written scope with a number in it, inside a week.
03  Build  You meet the engineers, not an account manager.
```

No price appears on this page. Pricing for this surface is undecided and the
parent site publishes its own figures; inventing one here would contradict it.

**H2** — The firm behind the team

```
$110M+  closed, 2026 YTD          Caprae Capital, firm-wide
20%+    MoM growth, 14+ months    Caprae Capital, firm-wide
8       countries serviced        Caprae Capital, firm-wide
40+     searchers supported       Caprae Capital, firm-wide
```

These are the parent firm's deal business, not engineering-team output. The label
is part of the figure and is set at the same size as the figure's own caption,
not smaller. Removing it turns a true statement into a false one.

**Footer** — partners@capraecapital.com · Part of Caprae Capital · Four products
live, one open source

---

## THE THREE TIERS

All three must be a good page. If the page is worthless without WebGL, the
content is too thin.

**Full.** As specified above.

**Reduced motion.** `prefers-reduced-motion: reduce`, and also reachable at
`?motion=off` for review. The field renders ONE static frame at `t = 18.4` — a
composed state, chosen and checked, not a frozen accident — and the loop never
starts. The resolved path draws once, complete. Scroll does not drive the clock.
Drag is disabled. Every entrance state is its final state. This tier is designed,
not disabled: the project owner runs reduced motion, so it is the tier that gets
seen.

**No JS, or WebGL unavailable.** The canvas never appears; the void ground and
the vignette remain. Every word of the record, every product link, every name and
the working CTA are plain HTML, already in the document before any script runs.
The page still converts.

---

## RESPONSIVE

Below 900px: drop the nav links, keep the wordmark and the CTA. Column goes full
width less a 20px gutter. Point count drops to the mobile tier. The CTA stays
inside the first viewport — check this at 390px specifically, it is where it
breaks.

No horizontal overflow at 390px. Anything wider than the column gets its own
`overflow-x: auto` container; the body never scrolls sideways.

---

## ⛔ VERIFY BEFORE YOU CALL IT DONE

Measured, not asserted. Screenshots or it did not happen.

1. **The cycle law.** Freeze the clock. Read the angular position of one band-1
   body and one band-5 body a second apart. The band-1 body must have advanced
   further. If they move together, the size-cycle relation is missing and the
   field is a conveyor.
2. **Stage asymmetry.** Instrument a frame: count bodies per stage. The measured
   distribution must match the declared weights `8 / 12 / 15 / 48 / 17` to within
   one point, and diligence must hold more than twice the next largest stage. If
   the five come out roughly even, the time weights were not applied.
   (An earlier draft of this check demanded diligence outweigh the other four
   *combined*. At 48% that is arithmetically impossible — the check was wrong,
   not the build. Fixed 2026-09-14.)
3. **Purity.** Scroll to the bottom, then back to the top. The field must return
   to a state identical to the one it left. Any drift means hidden state — find
   it and remove it.
4. **Centroid.** Compute the alpha-weighted screen-x centroid of the field
   analytically. It must sit within one point of 50% of viewport width. Anything
   further means the angle is correlated with something it should not be.
5. **Drag.** Release the pointer. The field keeps turning and settles. It must
   not stop dead, and pitch must ease back to its scroll-driven rest.
6. **Provenance.** Grep the rendered document for a digit outside the live
   read-out. Every hit must carry a provenance mark. Every parent-firm figure
   must carry its scope label. Zero exceptions.
7. **No invented names.** Grep for Vault, Searcher Coach, Simba Studio, Signal.
   Zero hits. Four products in the record, not eight.
8. **Contrast.** Sample `--soft` and the dimmest resting body against `--void`
   with a real contrast tool. Body text at 4.5:1 or better. If the field is
   invisible, Silent Failure 8 happened again.
9. **The fold.** CTA within 480px of the top edge at 390px, 768px, 1280px and
   1920px. Screenshot each.
10. **Tiers.** Load with `?motion=off`. Load with JavaScript disabled. Both must
   read as deliberate pages, not broken ones. Screenshot both.
11. **Canvas geometry.** `innerWidth` includes the scrollbar; the canvas is laid
    out at `documentElement.clientWidth`. Sizing the drawing buffer from
    `innerWidth` stretches the field horizontally by about a percent. Assert
    `canvas.width / canvas.height` equals `clientWidth / clientHeight`.
12. **Budget.** 60fps on integrated graphics, not on a dev machine. LCP under
    2.0s on throttled 4G. CLS under 0.05. Console clean. The preloader lifts on
    the first frame.

---

## VOICE

Restrained, technical, certain. The field does the showing off; the type does
not. Every sentence is either a fact with a source attached or a plain statement
of what the team does. No adjective survives that could appear unchanged on a
competitor's page. Three of the eight silent failures are about telling the
truth, and on a page whose entire product is credibility, those are the three
that decide it.
