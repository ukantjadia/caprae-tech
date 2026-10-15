# Section Lab inventory

Source: `Caprae_Tech_Section_Lab.html` (repo root). 1,108 lines (not 1,035), six `<style>` blocks, one inline `<script>` (lines 873 to 1105), no external JS. Read 2026-09-30. This file is the source of truth for drafts A, B and C (draft X = every section's X variant). Text below is verbatim. `<br>` marks a hard line break in the source. `→ ← ↻ ⇆ ✕ ✓ ◆ ▤ $ ✦ ⚙ ·` are literal characters in the source.

## 0. Global: tokens, fonts, shared pieces, lab chrome

### Fonts

Line 9, Google Fonts: `Instrument Serif` (ital 0 and 1), `Inter` (300, 400, 500, 600), `JetBrains Mono` (400, 500), `display=swap`, with preconnects to fonts.googleapis.com and fonts.gstatic.com.

### Tokens (`:root`, lines 12 to 23)

```
--void:#000; --surface:#0b0e14; --panel:#0f1115; --panel-2:#15181d;
--hair:#292d30; --hair-2:#1c1f22;
--bone:#f0f0f0; --white:#fff; --ash:#a1a4a5; --iron:#6e727a; --charcoal:#464a4d;
--iris:#9281f7; --iris-2:#9a54dc; --iris-glow:#baa7ff;
--grad:linear-gradient(135deg,#9281f7 0%,#9a54dc 100%);
--green:#3ad389; --amber:#ffca16; --blue:#70b8ff;
--serif:"Instrument Serif",ui-serif,Georgia,serif;
--sans:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
--mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--r:14px; --r-lg:22px; --max:1180px;
```

`--surface`, `--panel`, `--panel-2`, `--blue`, `--r` are declared but unused. Dark only, no light theme.

### Base and shared classes (lines 24 to 59)

- `html{scroll-behavior:smooth;scroll-padding-top:120px}`. The 120px accounts for the 64px nav plus the 48px lab bar. Without the lab bar a builder should re-tune it (around 72 to 80px).
- `body` black, `--bone` text, Inter 16px/1.55, antialiased, `overflow-x:hidden`.
- `.wrap` max 1180px, 24px side padding (16px under 640px).
- `.serif`, `.it` (italic), `.muted` (ash), `.dim` (iron), `.grad-text` (gradient clipped text).
- `.eyebrow`: 12px, .14em tracking, uppercase, ash, 6px iris dot before.
- `.pill`: 999px radius, 1px hair border, 6px 14px, 13px ash, rgba(255,255,255,.02) bg.
- `h1.display`: serif clamp(48px,8vw,104px)/.98, -.02em. `h2.title`: serif clamp(36px,5vw,60px)/1.02. `h3` 500 20px. `.lead` clamp(16px,1.6vw,19px) ash, max 620px.
- `.btn`: pill, 13px 22px, 15px/500, `transition:transform .15s,background .2s,border-color .2s`; hover `translateY(-1px)`. `.btn-white` white on black text. `.btn-ghost` hair border, hover iron border. `.btn-grad` defined, unused.
- `.card`: `linear-gradient(#131313,#050505)`, hair border, 22px radius, 28px padding.
- `.tag` 11px uppercase pill; `.tag.live` green, `.tag.build` amber, `.tag.founder` iris-glow.
- `.num-big` serif clamp(44px,5vw,64px)/1.
- `.grid` gap 20px; `.g2/.g3/.g4`; g3/g4 to 2 cols under 900px, all to 1 col under 640px.
- `.sec-pad{padding:110px 0}` (72px under 640px). `.sec-head`: flex, space-between, align flex-end, gap 30px, wrap, margin-bottom 56px; `.sec-head .lead` max 460px.
- `@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}` lives in the LAB CHROME block (line 85) but is used by design code: `.slide.on`, `.form-done.show`, industry list cards, founders spotlight. Keep it when stripping lab CSS.

### Site nav (part of the design, lines 61 to 67, markup 173 to 181)

- `.site-nav`: sticky top 0, z 40, `rgba(0,0,0,.72)`, `backdrop-filter:blur(14px)`, bottom border hair-2. Inner height 64px.
- Brand: `Caprae <span>Tech</span>` (Tech in ash, 400), href `#hero`.
- Links (14px ash, hover bone, hidden under 860px, no mobile menu): `Why founders` (#why), `Work` (#work), `How it works` (#how), `Pricing` (#pricing), `People` (#founders).
- Button: `Book a call` (`.btn.btn-white`, inline padding 9px 16px, 14px), href `#book`.

### Footer (part of the design, lines 864 to 867)

- `Caprae <span>Tech</span>` then `Founder-led product studio. Part of Caprae Capital Partners.` (max 340px).
- Links: `Work` `How it works` `Pricing` `People` `Book a call` (#work #how #pricing #founders #book).
- `footer.site` padding `50px 0 120px`. The 120px bottom clears the lab dock; re-tune once the dock is gone.

### Responsive breakpoints used anywhere

980, 900, 860, 820, 760, 640, 600, 560px (all `max-width`). Per-component rules are listed under each section.

### Lab chrome to strip

| Piece | Where | What it does |
|---|---|---|
| `header.lab-intro` | lines 154 to 170, CSS 105 to 111 | Title "Caprae Tech: Section Lab", instructions, `#labToc` links |
| `.lab-bar` per section | first child of each `section.lab` | Sticky (top 64px) numbered bar with the A/B/C tab buttons (`.lab-tabs button[data-v]`) |
| `.lab-idea` per section | second child of each section | Design rationale, hidden unless `body.notes` |
| `.lab` class | each `<section>` | `position:relative;border-top:1px dashed #2d2a45` |
| `.variant` wrappers | `div.variant[data-v]` | `.variant{display:none}`, `.variant.on{display:block;animation:fadeIn .35s ease}` |
| `.dock`, `#picks`, `#notesBtn`, `#copyBtn` | line 870 | Notes toggle, copy picks URL |
| `.toast#toast` | line 871 | Toast. **Also used by design code**: the Book mock slot click calls `toast('Mock booked: '+time)`. Decide keep or drop (open question). |
| `.note` spans | throughout | Yellow "to confirm" flags, `display:none` unless `body.notes`. Not visible to a normal visitor. |
| JS "LAB SWITCHING" block | lines 951 to 984 | `setVariant`, `?picks=` URL param, TOC, notes, copy |

How variants depend on the lab JS:

- All 30 variants are in the DOM at once. Only CSS hides them (`.variant` without `.on`). `setVariant` adds `.on` to the picked one (default `a`, or the letter at index i of `?picks=`).
- Every section's script runs unconditionally on load, against all variants, hidden or not. Each variant uses unique ids, so a single-variant draft keeps its ids. The script uses bare `$('#id').innerHTML=` with no null checks. **If a draft removes, for example, `#marquee`, line 995 throws and every script line after it stops running** (Why, Services, Work, How, Pricing, Founders, FAQ, Book all break). The rotor interval would also throw every 2.2s. Builders must drop or guard the JS for variants not in their draft.
- The hero B 3s timer starts at page load, not when B becomes visible. In a B-only draft this is fine.
- To render a variant without the lab: unwrap `div.variant`, or keep it and add `.on`. The `.variant.on` fadeIn (.35s) then plays once on load.
- Sticky offsets tuned for the lab bar: `.hero{min-height:calc(100vh - 112px)}` (64 nav + 48 bar), `.acc-wrap .stick{top:150px}`, `.chk-sum{top:140px}`, `scroll-padding-top:120px`.
- Cross-section CSS dependencies (keep the CSS even if the owning section's variant is not in the draft): Team C uses `.rows`/`.row` from the Work CSS. FAQ A uses `.acc`, `.acc-item`, `.panel`, `.ic` from the How CSS and `accBind()` from the How JS. Work B uses `.car-nav` from the Services CSS. The Services B industry panel uses `.svc-ico`. Several use `fadeIn` from lab CSS. Note: the global `.row{border-bottom}` rule also hits `.lab-intro .row`; irrelevant once the intro goes.

Shared helpers the design JS needs: `$`, `$$`, `esc` (HTML escape for `& < > "`), `accBind`, `statusTag`, `noteTag`, `fNote`, `fq`.

---

## 01 Hero (`section#hero`)

CSS lines 114 to 149. Shared by all three:

- `.hero`: relative, overflow hidden, `min-height:calc(100vh - 112px)`, flex centre, padding `90px 0 110px`.
- `.hero-horizon`: static decorative arc. Absolute, left 50%, bottom -62vw, 140vw by 70vw, 50% radius, top border `rgba(255,255,255,.35)`, `box-shadow:0 -30px 90px -20px rgba(146,129,247,.35), inset 0 30px 80px -40px rgba(255,255,255,.25)`, no pointer events. No animation.
- `.cta-row` flex gap 12px wrap, margin-top 34px. `.fine` 13px iron, margin-top 26px.

Lab bar label: `01 Hero · the founder-led promise, no names yet`.

### A. Statement + cube

Text:
- Pill: `Founder-led product studio · Caprae Capital`
- H1 (`h1.display`, margin-top 22px): `Built by founders.<br><span class="it muted">Not by a dev shop.</span>`
- Lead: `Hand us the product. A founder who has built, bought and grown companies steps in as your CTO, decides what's worth building and what will sell, and meets you once a week. You run your business.`
- CTAs: `Book a call →` (btn-white, #book), `See what we've built` (btn-ghost, #work)
- Fine print: `Part of Caprae Capital · $110M+ closed 2026 YTD · 8 countries`
- Cube faces (serif 30px word, `<small>` 11px uppercase iron):
  - f1 `Build` / `what sells`
  - f2 `Sell` / `the features`
  - f3 `Buy` / `companies`
  - f4 `Grow` / `them`
  - f5 `Price` / `the hours`
  - f6 `Cut` / `what doesn't pay`

Layout: `.wrap.hA` grid `1.15fr .85fr`, gap 40px, centred. Under 900px: 1 column, `.cube-stage` gets `order:-1` (cube above text) and height 260px.

Animation:
- `.cube-stage` 420px tall, `perspective:1100px`.
- `.cube` 210px square, `transform-style:preserve-3d`, `animation:spin 22s linear infinite`. `@keyframes spin{from{transform:rotateX(-18deg) rotateY(0)}to{transform:rotateX(-18deg) rotateY(360deg)}}`.
- Hover on the cube: `animation-play-state:paused`.
- Faces: absolute inset 0, 1px `rgba(255,255,255,.14)` border, 18px radius, `linear-gradient(145deg,#1c1c1f,#050505)`, `box-shadow:inset 0 0 40px rgba(146,129,247,.10)`, text #e9e9ee. Transforms: f1 `translateZ(105px)`, f2 `rotateY(90deg)`, f3 `rotateY(180deg)`, f4 `rotateY(-90deg)`, f5 `rotateX(90deg)`, f6 `rotateX(-90deg)`, each then `translateZ(105px)`. With the fixed -18deg X tilt, f5 (top) is visible, f6 (bottom) never is.
- No reduced-motion handling.

Notes: `confirm figures before launch` (after the fine-print line).

### B. Dev shop vs founder switch

Text:
- Pill: `For non-technical CEOs and owners`
- H1: `Dev shops build what you ask.<br><span class="grad-text it">Founders build what sells.</span>`
- Switch buttons: `Typical dev shop` (data-mode shop), `Founder-led (us)` (data-mode founder)
- Output cards from `HERO_SW` (bold line, then span):
  - shop: `You write the spec` / `and hope it's right.`; `They build the list` / `every feature, same priority.`; `You manage it` / `weekly, daily, forever.`
  - founder: `A founder writes it with you` / `from what sells, not what's asked.`; `They build what pays` / `and cut what doesn't.`; `You get one check-in` / `a week. That's it.`
- CTAs: `Book a call →` (#book), `Why founders` (btn-ghost, #why), centred.

Layout: `.hB` centred column, h1 max 980px. `.switch` inline-flex pill, 1px hair border, 4px padding, `#07080a`, margin `34px 0 22px`; buttons 9px 18px 14px ash, `.on` white bg black text. `.switch-out` 3-col grid gap 14px max 900px, left-aligned; 1 col under 760px. Cards padding 20px, min-height 118px, `transition:border-color .3s`. `.switch-out.founder .card` border `rgba(146,129,247,.45)`. Card span class is `dim` in shop mode, `muted` in founder mode.

JS: `heroSw(m)` rewrites `#heroSwitchOut` class and innerHTML and toggles `.on` on `.switch button`. On load `heroSw('shop')`, then `setTimeout(()=>heroSw('founder'),3000)` fires once. The timer is not cancelled by a click, so a visitor who clicks within the first 3s gets flipped to founder anyway. The static HTML marks founder `.on` but the script overrides it to shop at once. The card swap has no animation beyond the .3s border colour transition.

Notes: none.

### C. Rotating industry

Text:
- Eyebrow: `Founder-led software`
- H1 (margin-top 20px): `Software for <span class="rotor it grad-text" id="rotor"><span>staffing firms</span></span><br>run by people who've<br>built companies.`
- Rotor words `ROT`: `staffing firms`, `clinics`, `acquirers`, `service businesses`, `operators`
- Lead (centred): `MVPs, dashboards, deal models and internal tools for owners who don't have a tech team, and don't want to become one.`
- CTAs: `Book a call →` (#book), `What we build` (btn-ghost, #services)
- Marquee `MQ`: `Client portals`, `Deal screeners`, `Ops dashboards`, `AI follow-up drafts`, `Valuation models`, `Intake forms`, `Recruiting pipelines`, `Internal tools`, `MVPs`

Layout: `.hC` centred; hero bottom padding overridden to 70px. `.rotor` inline-block, `min-width:6ch`.

Animation:
- Rotor: `setInterval` every 2200ms, index `ri=(ri+1)%5`, replaces `#rotor` innerHTML with a new `<span>`. The new span runs `@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}` `.5s ease`. No exit animation, no pause, runs forever. Width changes with each word (only min 6ch), so the line reflows.
- Marquee: list rendered twice (`[...MQ,...MQ]`) as `.pill` spans with inline `font-size:14px;padding:10px 18px`. `.marquee` margin-top 56px, overflow hidden, edge mask `linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)`. `.marquee-track` flex gap 12px, `width:max-content`, `animation:slide 38s linear infinite`, `@keyframes slide{to{transform:translateX(-50%)}}`. Hover pauses.

Notes: none.

---

## 02 Why founders (`section#why`)

Lab label: `02 Why founder-led · the difference from a dev shop`. CSS lines 230 to 259.

### A. Lessons list

Text:
- Eyebrow `Why founder-led`; H2 `We've made the mistakes.<br><span class="it muted">You don't have to.</span>`
- Lead: `Our founders have built companies, bought them and grown them. Every one of those came with lessons. That's what you're hiring, not just the code.`
- Rows from `LESSONS` (number `01` to `05`, h3, p.muted):
  1. `Features don't sell themselves. The order you show them in does.` / `We decide which feature goes on top, which waits, and how each one is presented to the people you sell to.`
  2. `The first version should be smaller than you think.` / `We've shipped too much too early. Now we cut to what a customer will pay for, then build out.`
  3. `AI where it pays back. Nowhere else.` / `We add AI when it takes real hours off someone's week, not because it looks good in the pitch.`
  4. `Do it by hand before you automate it.` / `We map how the work is done today. That manual version becomes the spec, so we never automate the wrong thing.`
  5. `A founder's time is the most expensive thing in the building.` / `Yours included. That's why you get one weekly check-in, not daily questions.`

Layout: `.lessons` top hair border; `.lesson` grid `90px 1fr 1fr`, gap 30px, padding 30px 0, bottom hair border, baseline aligned. `.n` mono 13px iris-glow. h3 serif clamp(24px,2.6vw,32px)/1.1. 1 column gap 8px under 760px.

Interaction: hover `background:linear-gradient(90deg,rgba(146,129,247,.07),transparent 70%)`, `transition:background .25s`.

Notes: none.

### B. Side-by-side table

Text:
- Eyebrow `Why founder-led`; H2 `Same code. <span class="it">Different judgment.</span>`
- Lead: `Anyone can write the code. The expensive part is knowing what to build, what to leave out, and how to sell what ships.`
- Header: `The question` | `Typical dev shop` | `Caprae Tech`
- Rows `CMP`:
  1. `Who decides what gets built` | `You, feature by feature` | `A founder who has shipped products, working with you`
  2. `What ships first` | `Whatever is on the list` | `What your customers will pay for`
  3. `When AI goes in` | `Everywhere, because it sells the project` | `Only where it saves real hours`
  4. `How you're priced` | `A lump-sum quote you can't check` | `Features × hours × one hourly rate, upfront`
  5. `Your time` | `Daily questions and constant reviews` | `One weekly check-in`
  6. `After launch` | `Handover and goodbye` | `Help deciding what to show first and how to sell it`

Layout: `table.cmp`, separate borders, 1px hair, 22px radius, overflow hidden. Cells 20px 22px. `th` 13px uppercase ash on `#08090b`; 3rd `th` iris-glow. Col 1 ash 24% 14px, col 2 iron, col 3 bone on `linear-gradient(90deg,rgba(146,129,247,.08),rgba(146,129,247,.02))`. Under 760px: everything `display:block`, thead hidden, col 1 bone 500, col 2 prefixed via `::before` `Dev shop · ` (charcoal), col 3 prefixed `Us · ` (iris-glow).

Interaction: none.

Notes: none.

### C. Drag to compare

Text:
- Eyebrow `Why founder-led`; H2 `Drag the line.<br><span class="it muted">See what changes.</span>`
- Lead: `Left: building with a typical dev shop. Right: building with founders in the CTO seat.`
- Before pane: tag `Typical dev shop`; list `BA_BEFORE`: `You write the spec`, `Every feature gets built`, `AI added because it sounds good`, `The quote changes halfway`, `You chase updates`; footer `You manage the build.` (dim 13px)
- After pane: tag `Founder-led` (`.tag.founder`); list `BA_AFTER`: `A founder writes the spec with you`, `What sells gets built first`, `AI only where it pays back`, `Hours per feature, agreed upfront`, `One check-in a week`; footer `A founder manages the build. You get a weekly check-in.` (13px iris-glow)

Layout: `.ba` relative, hair border, 22px radius, 440px tall (560px under 760px), `user-select:none`, `touch-action:none`, `cursor:ew-resize`. Panes absolute inset 0, padding 44px (24px under 760px), column space-between. Before: `repeating-linear-gradient(135deg,#0b0b0c 0 14px,#0e0e10 14px 28px)`, items iron with `✕` in #ff6465 before. After: `radial-gradient(120% 90% at 100% 0%,rgba(146,129,247,.28),transparent 55%),linear-gradient(#141418,#060608)`, right-aligned, items with `✓` green after, `clip-path:inset(0 0 0 50%)`. Handle: 2px white line at 50% plus a 44px white circle with `⇆` (18px, black).

JS: pointerdown sets drag and `setPointerCapture`, then `set(clientX)`; pointermove while dragging calls `set`; pointerup/pointercancel stop. `set(x)`: `p = clamp((x - rect.left)/rect.width*100, 4, 96)`, then `after.style.clipPath = inset(0 0 0 p%)` and `handle.style.left = p%`. Clicking anywhere jumps the line. No transition, no keyboard support, no ARIA.

Notes: none.

---

## 03 What we build (`section#services`)

Lab label: `03 What we build · for non-technical owners`. CSS lines 261 to 289.

### A. Bento grid

Text:
- Eyebrow `What we build`; H2 `Your idea, shipped<br><span class="it muted">and ready to sell.</span>`
- Lead: `For owners in staffing, healthcare, services and acquisitions who need software but don't have a tech team.`
- Big tile: icon `◆`, h3 `MVPs` (serif 34px), p `Go from an idea to a working product your customers can use, with the features that will sell it at the top.` Mock dashboard: `Active users` **`1,284`**, `Conversion` **`6.2%`**, `MRR` **`$18k`**, 8 bars.
- Mid tile: icon `▤`, `Dashboards`, `Your whole business on one screen: sales, ops and finance, pulled from the tools you already use.`, tag `Owners · Ops leads`
- Small: `$` `Deal &amp; financial tools` / `Models and screeners that help you evaluate and acquire businesses.`
- Small: `✦` `AI assistants` / `Automations that take the repetitive work off your team, added only where they pay back.`
- Small: `⚙` `Internal team tools` / `Portals, trackers and workflows your people use every day, instead of ten spreadsheets.`

Layout: `.bento` 6 columns, `grid-auto-rows:minmax(190px,auto)`, gap 16px. `.b-big` span 4 cols x 2 rows, `.b-mid` span 2 x 2, `.b-sm` span 2 (three across row 3). `.b-wide` defined, unused. Under 900px: 2 cols, big spans 2, mid and sm span 1. Under 560px: 1 col. Cards flex column space-between. `.svc-ico` 40px, 12px radius, hair border, `#0b0b0d`, iris-glow glyph. `.mock-dash` 3-col grid inside a 14px-radius box on `#060607`; `.k` 11px iron with 24px serif value; `.mock-bars` 80px row of bars `linear-gradient(#9281f7,#3d3470)` opacity .8, heights 30, 45, 38, 60, 55, 72, 80, 95%.

Interaction: card hover border `#3a3f44` (no transition on bento). No animation.

Notes: `mock numbers, illustration only` (under the dashboard).

### B. By industry tabs

Text:
- Eyebrow `What we build`; H2 `Pick your industry.`
- Lead: `Here's what we'd build for a business like yours.`
- Tabs (keys of `INDUSTRIES`): `Staffing`, `Healthcare`, `Acquirers`, `Services`. Left card shows eyebrow = key, h3 = `h`, p = `p`, CTA `Talk about your {key lowercased} build →` (#book). Right list shows three numbered cards (1, 2, 3).
  - Staffing: h `For staffing firms`; p `Placements, candidates and client reporting in one place instead of a pile of sheets.`; `Client portal` / `Clients see placements, timesheets and invoices without emailing you.`; `Candidate pipeline` / `Every candidate tracked from application to placement, with automatic follow-ups.`; `Recruiter dashboard` / `Who is placing, who is stuck, and where the hours go.`
  - Healthcare: h `For clinics & healthcare operators`; p `Less admin between the patient and the care.`; `Intake & scheduling` / `Patients book and fill forms online; staff stop re-typing.`; `Operations dashboard` / `Visits, no-shows and revenue by location, updated daily.`; `Billing tracker` / `See which claims are stuck and why.`
  - Acquirers: h `For acquirers & search funds`; p `The same kind of tooling Caprae uses to find and buy companies.`; `Deal screener` / `Scores targets against your buy box so you look at fewer, better deals.`; `Valuation model` / `A live model you can reuse across every target.`; `Portfolio dashboard` / `One view across the companies you already own.`
  - Services: h `For service businesses`; p `Win the job, run the job, get paid, without the spreadsheet juggling.`; `Quote & job tracker` / `From quote to completed job in one flow.`; `Customer portal` / `Customers check status themselves.`; `AI follow-up drafts` / `Personal follow-ups written for your team to send in one click.`
  - CTA strings produced: `Talk about your staffing build →`, `Talk about your healthcare build →`, `Talk about your acquirers build →`, `Talk about your services build →`.

Layout: `.ind-tabs` flex gap 8px wrap, margin-bottom 28px; buttons pill 10px 18px 14px ash, `.on` white/black. `.ind-panel` grid `.9fr 1.1fr` gap 26px (1 col under 820px). Left card inline bg `radial-gradient(90% 80% at 0% 0%,rgba(146,129,247,.18),transparent 60%),linear-gradient(#131313,#050505)`, column space-between gap 30px; h3 serif 34px/1.05. `.ind-list` grid gap 12px; each card padding 20px, grid `36px 1fr`, 36px `.svc-ico` with the number, h3 18px, p 14px muted.

JS: `ind(k)` toggles tab `.on` and re-renders the whole panel. List cards get inline `animation:fadeIn .35s {i*.07}s both` (delays 0, .07s, .14s), so they stagger in on every tab click. Left card does not animate. Default tab Staffing. Tabs are plain buttons, no `role=tab` or arrow-key handling.

Notes: `example builds, not case studies` (in the lead). Healthcare panel only: `compliance scope (e.g. HIPAA) to confirm`.

### C. Swipe carousel

Text:
- Eyebrow `What we build`; H2 `Five things we build,<br><span class="it muted">start to finish.</span>`
- Arrow buttons `←` (aria-label Previous), `→` (aria-label Next) in the sec-head, right side.
- Cards from `SERVICES` (icon, counter `0{i+1} / 05`, title, description, `Best for: {f}`):
  1. `◆` `MVPs` / `From an idea to a working product your customers can use, with the features that sell it at the top.` / `Best for: Owners testing a new product line`
  2. `▤` `Dashboards` / `Sales, ops and finance on one screen, pulled from the tools you already use.` / `Best for: Owners and ops leads`
  3. `$` `Deal & financial tools` / `Screeners, models and trackers that help you evaluate and acquire businesses.` / `Best for: Acquirers and search funds`
  4. `✦` `AI assistants` / `Automations that take repetitive work off your team, added only where they pay back.` / `Best for: Teams buried in admin`
  5. `⚙` `Internal tools` / `Portals, trackers and workflows your people use every day, instead of ten spreadsheets.` / `Best for: Any team running on sheets`
  6. Final card (`background:var(--grad)`, transparent border): `Something else?` / `If it saves your team hours, we'll scope it.` / button `Book a call →` (btn-white, #book)
- Wording differs from A on purpose or by drift: A says `Go from an idea...will sell it`, `Your whole business on one screen: sales, ops...`, `Models and screeners...`, `take the repetitive work`, `Internal team tools`. Copy each variant as written.

Layout: `.car-track` grid `grid-auto-flow:column`, `grid-auto-columns:minmax(280px,340px)`, gap 16px, `overflow-x:auto`, `scroll-snap-type:x mandatory`, children `scroll-snap-align:start`, padding-bottom 14px, thin scrollbar `#333`. Cards min-height 360px, column space-between; title serif 34px, margin-top 40px; counter mono 12px dim; `.for` 12px iron margin-top 14px. `.car-nav` buttons 44px circles, hair border, 18px, hover iron border.

JS: arrow click `carTrack.scrollBy({left: ±356, behavior:'smooth'})` (356 = 340 card + 16 gap). No disabled state at the ends, no dots, no autoplay. Native swipe on touch.

Notes: none.

---

## 04 Work / proof (`section#work`)

Lab label: `04 Proof · Caprae builds, client builds, founder companies`. CSS lines 368 to 407. Lab-idea flag text: `Flags: only confirmed numbers are used. Anything unmeasured says "to quantify". Client and founder-company names need sign-off before launch.`

Shared data `WORK` (fields: n name, g group, s status, k kicker, p problem, b build, rb result big, rs result small, note):

| # | n | g | s | k | p | b | rb | rs | note |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `Caprae CRM` | caprae | live | `Client & account platform` | `The CEO was spending standing weekly calls just updating clients.` | `A client and account-manager platform. Every new engagement is pushed to the client with a next action, filterable by priority.` | `1 click` | `for a client to see the whole account, instead of a weekly call` | `hours saved to quantify` |
| 2 | `Recruitment pipeline` | caprae | live | `Hiring automation` | `Applicant tracking tools stop at the application. Everything after it was manual.` | `Auto-acknowledgement, handbook sent, tracked submission, AI review in an admin portal, one-click interview booking.` | `~20 hrs/wk` | `returned to the recruitment team` | none |
| 3 | `Lead QA` | caprae | live | `AI quality scoring` | `Checking lead quality by hand took about 1.5 hours per client.` | `AI scores every lead; a human spot-checks the greens and the reds before anything goes out.` | `30 → 10 hrs/wk` | `spent on lead QA` | none |
| 4 | `Call intelligence` | caprae | build | `AI call scoring` | `Judging callers by ear doesn't scale past a handful of people.` | `Recordings become transcripts, scored on tone, objection handling and script, then rolled into one score per caller, plus the best time to call.` | `In build` | `result to quantify` | `no number yet` |
| 5 | `Bankers Edge` | client | live | `Advisory platform` | `An advisory firm needed its platform designed and built.` | `Advisory platform with transaction and service pages.` | `Live` | `in production · bankersedgeadvisory.com` | `client sign-off to name` |
| 6 | `Simba` | client | build | `Client build` | `[Add the client's problem]` | `Landing page, domain and SEO build.` | `In build` | `details to add` | `details + sign-off needed` |
| 7 | `ITSco` | founder | founder | `Healthcare tech & engineering` | `Healthcare organizations need engineering and analytics they can't staff in-house.` | `Integrated Technical Services: tech development, data analysis and analytics projects.` | `Founder company` | `led by Zackary Beckham and Mike Savano` | `confirm wording with ITSco` |
| 8 | `Destroy Drive` | founder | founder | `Data services` | `Companies need their data centers and data handled properly.` | `Data services: data centers and data cleaning.` | `Founder company` | `co-founded by Kevin Hong and Zackary Beckham` | `confirm wording` |

`GRP`: caprae `Built for Caprae`, client `Client builds`, founder `Founder companies`. `STATUS`: live `Live` (`.tag.live`), build `In build` (`.tag.build`), founder `Founder co.` (`.tag.founder`). Notes render via `noteTag` as ` <span class="note">…</span>` (escaped).

### A. Filterable grid

Text:
- Eyebrow `Proof`; H2 `We built it for ourselves first.`
- Lead: `Every tool here runs inside a real business, either ours, a client's or a company our founders built.`
- Chips: `All` `8`, `Built for Caprae` `4`, `Client builds` `2`, `Founder companies` `2` (count in a `<span>` at .55 opacity, 12px).
- Each card: group label (`.grp`), status tag, h3 name (serif 30px), kicker (dim 13px), `b` text (muted 14px), result block `rb` (serif 26px white) then `rs` (muted) then note. Card A does not show `p`.

Layout: `.chips` flex gap 8px wrap mb 26px; chip pill 9px 16px 14px, `.on` white/black. `.work-grid` 3 cols gap 16px, 2 under 900px, 1 under 600px. `.wcard` column gap 14px, min-height 280px; `.res` pushed to bottom (`margin-top:auto`) with top hair border.

Interaction: `.wcard` hover `border-color:#3a3f44; transform:translateY(-2px)`, `transition:border-color .2s,transform .2s`. Chip click sets `.on` and toggles `.hide` (`display:none`) on cards whose `data-g` does not match (All shows everything). No filter animation.

Notes: rows 1, 4, 5, 6, 7, 8 notes in the result block.

### B. Case-study slider

Text:
- Eyebrow `Proof`; H2 `Problem. Build. <span class="it">Result.</span>`
- Lead: `What was broken, what we built and what it returned.`
- One slide per WORK item: tags (group as plain `.tag`, status tag), h3 name (serif clamp(36px,4vw,54px)/1), `Problem` label + `p` (muted), `Build` label + `b`; right side label `Result`, `rb` as `.num-big` clamp(46px,6vw,76px), `rs` muted, note. Simba's slide shows the visible placeholder `[Add the client's problem]`.
- Footer: dots (8) and arrows `←` `→`.

Layout: `.slider` hair border 22px radius `linear-gradient(#111114,#040405)`. `.slide` grid `1.1fr .9fr` min-height 430px; `.l` padding 44px column gap 18px; `.r` left hair border, padding 44px, centred, `radial-gradient(90% 80% at 80% 20%,rgba(146,129,247,.18),transparent 60%)`. `.pbr` rows grid `78px 1fr`, label 11px uppercase iron. Under 820px: 1 col, `.r` border-top, padding 26px. `.slider-foot` flex space-between 16px 22px top border. Dots 7px charcoal circles, `.on` white 20px wide pill.

JS: `slide(n)` sets `si=(n+8)%8` (wraps both ways), toggles `.on` on slides and dots. Arrows `slide(si±1)`, dots `slide(i)`. `.slide.on{display:grid;animation:fadeIn .4s ease}`. No autoplay, no swipe, no keyboard.

Notes: same per-item notes, in the Result column.

### C. Stat wall + rows

Text:
- Eyebrow `Proof`; H2 `Hours returned,<br><span class="it muted">not features shipped.</span>`
- Lead: `We measure a build by the time it hands back to the people using it.`
- Stat wall (static HTML):
  1. `~20` + `<span class="dim" style="font-size:.5em"> hrs/wk</span>` / `saved for the recruitment team`
  2. `30→10` / `hours a week on lead QA`
  3. `6→50+` / `leads per hour after automating sourcing (50–60)`
  4. `1 click` / `for clients to see the whole account, instead of a weekly update call`
- Rows: one `<details class="row">` per WORK item, first open. Summary: h3 name (serif 26px), kicker (`.hm`), status tag (`.hm`), `+`. Body: `Problem` + p, `Build` + b, `Result` + `<b>rb</b>, rs` + note. Simba shows `[Add the client's problem]`.

Layout: `.statwall` 4-col grid, hair border 22px radius, cells padding 28px with right borders; `small` 13px ash. Under 820px: 2x2 with borders fixed. `.rows` top border, `.row` bottom border. Summary grid `1.3fr 1fr 1fr 30px` gap 18px padding 22px 4px, marker hidden. Body grid 3 cols gap 22px ash 15px, labels 11px uppercase iron. Under 760px: summary `1fr 30px` (`.hm` hidden), body 1 col.

Interaction: native `<details>` toggle, several can be open at once. `.plus` rotates 45deg on open, `transition:transform .25s`. Body opens instantly (no height animation).

Notes: per-item notes in the Result cell. Stat wall has none, although stat 3 (`6→50+`) has no matching WORK item.

---

## 05 How it works (`section#how`)

Lab label: `05 How it works · you hand it over, a founder runs it`. CSS lines 409 to 440.

Shared data `HOW` (title, body, who):
1. `Call` / `Thirty minutes with a founder. What you want to build, and what's in the way.` / `You + a founder`
2. `Scope` / `We turn it into features with an hour estimate for each, at your domain's hourly rate. You pick what's in.` / `Founder`
3. `Build` / `A founder runs your product like its CTO. Engineers ship every week. You get one check-in a week.` / `Founder + engineers · you weekly`
4. `Launch & sell` / `We decide what goes on top, how each feature is presented, and what's worth building next.` / `Founder + you`

### A. 4-step timeline

Text:
- Eyebrow `How it works`; H2 `You hand it over.<br><span class="it muted">We run it end to end.</span>`
- Lead: `A founder takes the CTO/CEO seat on your product. You get a weekly check-in, not a second job.`
- Steps: dot `01` to `04`, h3 title, p body, `.who` line = who.

Layout: `.tl` 4-col grid, margin-top 10px; `::before` 1px line at top 23px, `linear-gradient(90deg,var(--iris),var(--hair) 70%)`. `.st` padding-right 26px. `.dot` 46px circle, hair border, black bg, mono 13px iris-glow, z 1. h3 serif 30px margin-top 22px; p ash 15px; `.who` 12px iron. Under 820px: vertical, line at left 23px `linear-gradient(var(--iris),var(--hair))`, steps padding-left 70px, dot absolute at left.

Interaction: `.st:hover .dot{background:var(--iris);color:#000;border-color:var(--iris)}`, `transition:all .25s`.

Notes: none.

### B. "Your week with us"

Text:
- Eyebrow `How it works`; H2 `Your week with us.`
- Lead: `Everything in grey is us. The purple box is the only part that needs you.`
- Days (static HTML):
  - `MON`: `Founder sets the week's priorities: what ships and what waits`; `Engineers build`
  - `TUE`: `Engineers build`; `Tested against how a real user works`
  - `WED`: `Founder review: does this feature sell?`; `Cut or reorder features`
  - `THU` (highlighted): `Your weekly check-in: demo, decisions, next week` (`.ev.you`); `Your feedback goes into the plan`
  - `FRI`: `Ship to staging`; `Hours used vs. planned, sent to you`
- Legend: `Us` (grey swatch), `You` (gradient swatch)

Layout: `.week` 5-col grid gap 10px (1 col under 820px). `.day` hair border 16px radius padding 18px min-height 250px (auto under 820px) column gap 10px `#07080a`. `.d` mono 12px iron. `.ev` 10px radius 10px 12px 13px/1.35. `.ev.us` `#121216` hair border ash. `.ev.you` gradient, white 500. `.day.hl` iris border `rgba(146,129,247,.55)` plus `box-shadow:0 0 0 1px rgba(146,129,247,.2),0 20px 60px -20px rgba(146,129,247,.35)`. `.legend` flex gap 18px 13px ash, 12px swatches.

Interaction: none.

Notes: `check-in day and cadence to confirm` (in the legend).

### C. Sticky accordion

Text:
- Left: eyebrow `How it works`; H2 `Four steps.<br><span class="it muted">One weekly check-in.</span>`; lead `A founder who has built in your space runs the product. You keep running the business.`; button `Start with a call →` (btn-white, #book, margin-top 26px).
- Right: accordion from `HOW`, number `01` to `04`, h3 title, `+` icon; panel = body, then `Who: {who}` (dim 13px, margin-top 10px).

Layout: `.acc-wrap` grid `.8fr 1.2fr` gap 50px; `.stick` `position:sticky; top:150px`. Under 820px: 1 col gap 20px, sticky off. `.acc` top border; items bottom border; button full width flex space-between padding 24px 0; `.n` mono 12px iris-glow margin-right 16px; h3 serif 30px. `.panel div` padding `0 0 26px 42px`.

JS and animation: `accBind` makes it single-open: click closes all, then opens the clicked one unless it was already open (so the open item can be closed, leaving none). First item open by default. `.panel{max-height:0;overflow:hidden;transition:max-height .35s ease}`, `.open .panel{max-height:260px}`. `.ic` rotates 45deg, `transition:transform .25s`. No `aria-expanded`.

Notes: none.

---

## 06 Pricing (`section#pricing`)

Lab label: `06 Pricing · priced in hours, not a random quote`. CSS lines 522 to 561. Lab-idea flag text: `Flags: feature hours are illustrative only. The hourly rate per domain is pending Kevin's sign-off, so the rate shows as "set on call".`

Shared data `FEATURES` (name, hours, description):

| i | name | h | description |
|---|---|---|---|
| 0 | `User login & roles` | 24 | `Who can see what` |
| 1 | `Dashboard` | 40 | `Your key numbers on one screen` |
| 2 | `Client portal` | 48 | `Your customers log in and self-serve` |
| 3 | `Import from your tools` | 20 | `Sheets, CRM, accounting` |
| 4 | `Reports & exports` | 16 | `PDF / CSV, scheduled` |
| 5 | `Email & SMS alerts` | 12 | `Notify the right person` |
| 6 | `Payments` | 28 | `Invoices and card payments` |
| 7 | `AI assistant` | 36 | `Drafts, summaries, triage` |
| 8 | `Deal / financial model` | 44 | `Screen and value targets` |
| 9 | `Admin panel` | 24 | `Manage users and data` |

### A. Drag-and-drop scope

Text:
- Eyebrow `Pricing`; H2 `You pick the features.<br><span class="it muted">You see the hours.</span>`
- Lead: `No random quote. We scope your product into features, each with an hour estimate, at a fixed hourly rate for your domain. Change direction and the hours change with it.`
- Pool zone header: `Feature library` | `drag or tap →`. Chips: `{name}` + `{h}h` (e.g. `User login & roles` `24h`).
- Build zone header: `Your build` | `{n} feature` / `{n} features`. Empty state: `Drop features here`.
- Total: `Estimated build`, `{sum}` + `hours`; right side `× your domain's hourly rate` / `set on the call` (mono iris-glow).

Layout: `.dnd` 2 cols gap 18px (1 under 820px). `.zone` hair border 22px radius padding 22px min-height 360px `#07080a`, `transition:border-color .2s,background .2s`. `.zone h4` 13px uppercase ash flex space-between. `.zone.target` dashed `#3a3560` with `radial-gradient(100% 80% at 100% 0%,rgba(146,129,247,.10),transparent 60%)`. `.zone.over` iris border `rgba(146,129,247,.08)` bg. `.chiplist` flex wrap gap 10px min-height 120px. `.fchip` 12px radius 10px 12px `#101114` 14px, `cursor:grab` (`grabbing` on active), hover border `#4a4f55`, `transition:border-color .15s,transform .15s`; `.h` mono 12px iris-glow; in target zone border `rgba(146,129,247,.4)`; `.dragging` opacity .4. `.empty` dashed box 26px centred iron. `.total` flex space-between top border, `.num-big` 52px.

JS:
- Chips rendered into pool with `draggable="true"`, `data-i`, `tabindex="0"`.
- On load, features 0 and 1 are moved into the build: initial state `64` hours, `2 features`.
- HTML5 drag: document `dragstart` on `.fchip` stores `dragEl`, adds `.dragging`, `effectAllowed='move'`. Zones `dragover` preventDefault and add `.over`; `dragleave` removes `.over` only when leaving the zone; `drop` appends `dragEl` to that zone's `.chiplist` (removing `.empty`) and recalculates. `dragend` clears `.dragging` and all `.over`. Order inside a zone is append-only.
- Click, Enter or Space on a chip moves it to the other zone (`move`). This is the mobile path, since HTML5 DnD does not fire on touch.
- `recalc()`: sum of `FEATURES[i][1]` over chips in build, count label with singular/plural, removes `.empty` when chips exist, restores it when the build is empty. The pool has no empty state.

Notes: `hours are illustrative; rate pending Kevin`.

### B. Checklist estimator

Text:
- Eyebrow `Pricing`; H2 `Priced in hours.<br><span class="it muted">Nothing hidden.</span>`
- Lead: `Tick what you'd want. That's roughly how we scope it with you on the call.`
- Items: box, `{name}` with `<small>{description}</small>`, `{h} h` (note the space).
- Summary card: `Estimated build`, `{sum}` + `hrs`, `{n} feature(s) selected`, then `Hourly rate is fixed per domain and shared on the call. You can add or drop features any week.`, button `Scope it with us →` (full width, #book).

Layout: `.chk` grid `1.3fr .7fr` gap 22px (1 col under 820px). `.chk-list` hair border 22px radius; `.chk-item` flex gap 14px padding 16px 20px bottom borders, pointer, hover `#0c0d10`, `transition:background .15s`. `.box` 22px 7px radius iron border; `.on .box` iris fill black `✓`. `.t small` iron 13px. `.h` mono 13px ash. `.chk-sum` `position:sticky; top:140px`.

JS: items 0 to 2 start on, so the initial total is `112` hrs, `3 features selected`. Click, Space or Enter toggles `.on` and the `✓`, then `chkCalc()` sums hours and updates `{n} feature` / `features` + ` selected`. `role="checkbox"` without `aria-checked`. The number changes instantly (no counter animation, which matches the no-animated-counters rule).

Notes: `hours illustrative`.

### C. Explainer + sample sheet

Text:
- Eyebrow `Pricing`; H2 `We talk in hours,<br><span class="it muted">not guesses.</span>` (no lead)
- Steps: `01` `We list the features` / `After the call, we break your product into features with an hour estimate for each.`; `02` `You see the rate` / `A fixed hourly rate for your domain, shown upfront. No surprise quote.`; `03` `You choose` / `Keep, cut or swap features at any point. The hours follow your choices.`
- Sheet header: `SAMPLE SCOPE · Staffing firm, client portal MVP` | `Rate: [domain rate] / hr`
- Table `Feature` | `Priority` | `Hours`:
  - `Client login &amp; roles` | `Must have` | `24`
  - `Placements dashboard` | `Must have` | `40`
  - `Timesheet upload &amp; approval` | `Must have` | `32`
  - `AI candidate matching` | `Later: not worth it yet` | `60` (struck through)
  - `Weekly email digest` | `Nice to have` | `12`
  - Footer: `Total in scope` | `` | `108 hrs` (24+40+32+12 = 108, correct)

Layout: `.steps3` 3 cols gap 16px mb 22px (1 col under 820px), cards with mono `.n` iris-glow and serif 28px h3. `.sheet` hair border 22px radius 14px; `.sh-head` mono 12px ash on `#0b0c0f`, flex space-between wrap; cells 13px 20px hair-2 borders; last column right-aligned mono; `tr.cut td` charcoal line-through; tfoot 500 on `#0b0c0f`.

Interaction: none.

Notes: `illustrative sample, not a real client`. The visible `[domain rate]` bracket is a placeholder in the design itself.

---

## 07 Founders (`section#founders`)

Lab label: `07 Founders · names and faces live here, not in the hero`. CSS lines 563 to 588. Lab-idea flag text: `Flags: swap the initials for real headshots. Confirm Mike's spelling and title, and confirm each founder is OK being listed on the Tech site.`

Shared data `FOUNDERS` (n, r role, i initials, b bio, q quote, t tags, note):

1. `Kevin Hong` · `Founder` · `KH`
   - b: `Serial tech entrepreneur with 10+ years of experience. Scaled two startups to $31M and $7M ARR and raised $8M+ in venture capital. Author of the #1 Amazon bestseller The Outlier Approach, published in Forbes and Inc. Clinical Adjunct Faculty of Entrepreneurship at Chapman University. MBA, Chicago Booth. Co-founder of Destroy Drive.`
   - q: `Has taken software from zero to $31M ARR.`
   - t: `$31M & $7M ARR`, `$8M+ raised`, `Author`
2. `Hereford Johnson` · `Principal Adviser` · `HJ`
   - b: `Founder of Third Equity Partners. Entrepreneur across traditional, self-funded and independent-sponsor acquisition models. Educator and trusted voice in the search-fund community. MBA, Northwestern Kellogg.`
   - q: `Knows exactly what an acquirer needs from a tool.`
   - t: `Third Equity Partners`, `Search funds`, `Kellogg MBA`
3. `Zackary Beckham` · `Founder` · `ZB`
   - b: `Chief of Business Development at ITSco (Integrated Technical Services). 12+ years in operations and program management. Co-founder of Destroy Drive. BS Information Technology and BS Biology, Arizona State.`
   - q: `Has run delivery for technical services at scale.`
   - t: `ITSco`, `Destroy Drive`, `12+ yrs ops`
4. `Mike Savano` · `CEO · ITSco` · `MS`
   - b: `Leads ITSco, a healthcare tech and engineering company delivering data analysis and analytics projects.`
   - q: `Builds healthcare tech for a living.`
   - t: `ITSco`, `Healthcare tech`, `Data & analytics`
   - note: `spelling + title to confirm (CEO / CTO / CDO?)`

`.avatar`: 120px circle, 3px padding, gradient ring (`var(--grad)`); inner circle `radial-gradient(circle at 30% 25%,#2a2a30,#0a0a0c)` with serif 40px white initials. No images anywhere.

### A. Portrait cards

Text:
- Eyebrow `The founders`; H2 `The people in<br><span class="it muted">your CTO seat.</span>`
- Lead: `They've built, bought and grown companies in tech, healthcare, data and acquisitions.`
- Per card: avatar initials, h3 name, role (`.role`), full bio `b`, note.

Layout: `.fcards` 4 cols gap 16px (2 under 980px, 1 under 560px). `.fcard` centred column gap 6px, no card background (plain, not `.card`). `.role` 11px .14em uppercase iris-glow 600. h3 serif 28px margin-top 14px. p ash 14px.

Interaction: none.

Notes: Mike's note; plus a full-width `replace initials with headshots` after the grid.

### B. Spotlight list

Text:
- Eyebrow `The founders`; H2 `Who's behind the build.` (no lead)
- List buttons: h3 name, small role, `→`.
- View: 84px avatar (initials 28px), role, name (22px), big quote wrapped in straight double quotes (`"Has taken software from zero to $31M ARR."`), bio, tags, note.

Layout: `.spot` grid `.8fr 1.2fr`, hair border 22px radius, min-height 420px. List right border; buttons padding 24px 26px bottom borders, `transition:background .2s`; h3 serif 26px iron, `transition:color .2s`; small 11px uppercase charcoal. `.on`: bg `#0d0d11`, h3 white, small iris-glow. `.spot-view` padding 44px column gap 18px `radial-gradient(90% 70% at 100% 0%,rgba(146,129,247,.16),transparent 60%)`; `.big` serif clamp(28px,3vw,40px)/1.1. Under 820px: 1 col, list bottom border, view padding 26px.

JS: `spot(i)` toggles `.on` and re-renders the view. Header row `fadeIn .35s`, quote `fadeIn .45s`, bio `fadeIn .55s` (different durations, not delays, so they finish staggered). Default Kevin. Tags do not animate.

Notes: Mike's note when Mike is selected.

### C. Flip cards

Text:
- Eyebrow `The founders`; H2 `Flip for the<br><span class="it muted">track record.</span>` (no lead)
- Front: avatar, name (serif 28px), role (11px uppercase iris-glow 600), hint `hover or tap ↻`.
- Back: quote (serif 24px/1.15 white), bio, tags (border `rgba(186,167,255,.3)`, text `#d8d4f5`).

Layout: 4-col `.fcards`. `.flip` `perspective:1200px`, height 380px, pointer, `tabindex="0"`. `.flip-f` `linear-gradient(#131316,#050506)`, centred, gap 10px; `.hint` absolute bottom 16px 12px iron. `.flip-b` `rotateY(180deg)`, `linear-gradient(160deg,#1b1733,#07060d)`, column space-between, 14px `#d8d4f5`. Both faces hair border, 22px radius, padding 26px, `backface-visibility:hidden`.

Animation and JS: `.flip-in` `transition:transform .7s cubic-bezier(.2,.7,.2,1)`, `transform-style:preserve-3d`. `.flip:hover .flip-in` and `.flip.on .flip-in` get `rotateY(180deg)`. Click toggles `.on`; Enter toggles `.on`. On desktop, click while hovering adds `.on` so the card stays flipped after the mouse leaves. Kevin's back holds a long bio at 14px inside 380px minus 52px padding; overflow risk at 4 columns.

Notes: Mike's note sits inside `.flip` after `.flip-in` (absolute faces cover it).

---

## 08 Build team (`section#team`)

Lab label: `08 Build team · who actually writes the code`. CSS lines 590 to 601. Lab-idea flag text: `Flags: confirm each engineer is OK being named, and add surnames and photos.`

### A. Org chain

Text:
- Eyebrow `The build team`; H2 `Founders decide.<br><span class="it muted">Engineers ship.</span>`
- Lead: `One chain of accountability, from the founder in your CTO seat to the person writing the code.`
- Top node: `Founder` / `CTO/CEO seat on your product`
- Label: `sets priorities · weekly check-in with you`
- Node: `Siddhant Pahuja` / `Head of AI &amp; Automation`
- Label: `architecture · specs · evals`
- Row: `Ukant` / `Lead engineer`; `Hiten` / `Engineer`; `Dejan` / `Engineer`

Layout: `.org` centred column. `.org-row` flex gap 16px centred wrap. `.org-node` hair border 16px radius padding 16px 20px `#08090b` centred min-width 190px; `small` 11px uppercase iron. `.org-node.top` border `rgba(146,129,247,.5)` bg `linear-gradient(160deg,#1b1733,#07060d)`. `.org-line` 1px by 38px `linear-gradient(var(--iris),var(--hair))`. `.org-label` mono 11px iron margin 6px 0. Label sits above the line.

Interaction: none.

Notes: `confirm names and surnames`.

### B. Team cards

Text:
- Eyebrow `The build team`; H2 `The people<br><span class="it muted">writing your code.</span>` (no lead)
- Cards (`.card` in `.fcards`): tag, h3 name (serif 28px), role (dim 13px), p (muted 14px):
  - `Lead` (`.tag.founder`) · `Siddhant Pahuja` · `Head of AI &amp; Automation` · `Owns architecture, feature definition and how every AI step is tested against a human before it ships.`
  - `Engineering` · `Ukant` · `Lead engineer` · `Runs day-to-day execution and the core builds.`
  - `Engineering` · `Hiten` · `Engineer` · `Front-end and product builds.`
  - `Engineering` · `Dejan` · `Engineer` · `Platform features and integrations.`

Layout: 4-col `.fcards` (2 under 980px, 1 under 560px). No hover.

Notes: `confirm names, roles, photos`.

### C. Team + stack

Text:
- Left: eyebrow `The build team`; H2 `Small team.<br><span class="it muted">Senior judgment.</span>`; rows: `Siddhant Pahuja` | `Head of AI &amp; Automation`; `Ukant` | `Lead engineer`; `Hiten` | `Engineer`; `Dejan` | `Engineer`.
- Right: `What we build on` (dim 13px); stack tiles: `Claude` / `AI`; `OpenAI` / `AI · speech`; `n8n` / `automation`; `Supabase` / `database · auth`; `Azure` / `hosting`; `React` / `front end`; `FastAPI` / `back end`; `Twilio` / `calling`.
- Footnote: `We pick the stack for your product, not the other way round.`

Layout: `.wrap.grid.g2` gap 50px align start (1 col under 640px). Rows use Work's `.rows`/`.row` borders, inner flex space-between padding 18px 0. `.stack` 4-col grid gap 10px (2 under 560px); tiles hair border 12px radius padding 16px 12px centred 14px `#08090b`, small iron 11px. Text only, no logos.

Notes: `swap text for logos`.

---

## 09 FAQ (`section#faq`)

Lab label: `09 FAQ · objections a non-technical owner will have`. CSS lines 741 to 754. Lab-idea flag text: `Flags: the answers on code ownership and data security need Kevin to confirm before launch.`

Shared data `FAQ` (q, a, note):
1. `Do I need to be technical?` / `No. Most of the owners we work with aren't. Tell us the problem in plain words and a founder turns it into the product.`
2. `How much of my time will this take?` / `One weekly check-in. The founder in your CTO seat makes the day-to-day calls.`
3. `How do you price?` / `In hours. We list the features, estimate the hours for each, and show your domain's hourly rate upfront. You choose what's in.`
4. `Can I change direction halfway?` / `Yes. Add, drop or swap features at any point, and the hours move with you.`
5. `When do you add AI?` / `Only when it saves real hours or makes the product easier to sell. If it won't pay back, we'll tell you.`
6. `What if something isn't worth building?` / `We'll say so. Some of our most useful advice is what to leave out.`
7. `Who owns the code?` / `You own what you pay for. The details are in the agreement.` / note `confirm with Kevin`
8. `Is my data safe?` / `We build on established platforms with login and access controls, and scope any compliance needs on the first call.` / note `confirm wording`

### A. Accordion

Text: eyebrow `Questions`; H2 `Before you book.` (centred, mb 46px). Items: h3 question (inline 24px), `+`; panel answer + note.

Layout: `.faq-acc.acc` max 860px centred, top border; uses How's `.acc-item` styles. Panel inner padding-left overridden to 0.

JS and animation: `accBind` single-open, first item open, `max-height 0→260px .35s ease`, icon rotate 45deg `.25s`.

Notes: items 7 and 8.

### B. Open grid

Text: eyebrow `Questions`; H2 `Straight answers.` (left sec-head, no lead). All 8 cells: h3 question, p answer + note.

Layout: `.faq-grid` 2 cols, `gap:1px` on a `--hair` background to draw hairlines, outer hair border 22px radius; cells black padding 30px; h3 serif 24px mb 10px; p ash 15px. 1 col under 760px.

Interaction: none.

Notes: items 7 and 8.

### C. Chat bubbles

Text: eyebrow `Questions`; H2 `You ask. <span class="it muted">We answer.</span>` (centred). Question bubble = question. Answer bubble = `<small>Caprae Tech</small>` + answer + note. Button `Show 4 more questions`.

Layout: `.chat` max 760px column gap 12px. `.bub` max 78% (92% under 560px) padding 14px 18px 20px radius 15px/1.5. `.bub.q` right, `#1a1a1f` hair border, bottom-right radius 6px. `.bub.a` left, `linear-gradient(160deg,#1f1a3d,#0e0b1c)`, border `rgba(146,129,247,.35)`, bottom-left radius 6px, `#e2defc`; label 11px uppercase iris-glow. `.chat-more` btn-ghost centred margin-top 10px.

JS: `chat(4)` renders the first 4 pairs plus the button `Show {8-4} more questions`. Click re-renders all 8 and drops the button. No typing or reveal animation.

Notes: items 7 and 8, only after "Show more".

---

## 10 Book a call (`section#book`)

Lab label: `10 Book a call · 4-field form, then calendar`. CSS lines 756 to 790. Lab-idea build note: `Build note: the calendar here is a mockup. Embed the real Calendly/Doodle link, pre-fill name and email into it, and send the submission to the CRM or a sheet.`

Shared form `FORM` (injected into every `form[data-form]`, `novalidate`):
- Row `.two`: `First name` (input `first`, autocomplete given-name, placeholder `Jane`, error `Required`); `Last name` (`last`, family-name, `Doe`, `Required`)
- `Work email` (`email`, type email, placeholder `jane@company.com`, error `Enter a valid email`)
- `What's the call about?` (textarea `reason`, placeholder `e.g. We run a staffing firm and want a client portal instead of emailing timesheets.`, error `Tell us a line or two`)
- Submit `Continue to calendar →` (btn-white full width)
- `Four fields. Next step: pick a time.` (dim 12px centred)
- Labels are not tied to inputs (`<label>` has no `for`, input not nested).

Validation (submit handler): every input and textarea trimmed; invalid if empty, or for email if it fails `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Invalid fields get `.field.err` (red `#ff6465` border, message `#ff9592` 12px shown). Typing in a field removes its `.err`. Nothing is sent anywhere.

On success: form `display:none`; sibling `.form-done` gets `calHTML(first)` and `.show` (`fadeIn .4s`):
- `Thanks, {first}.` (serif 32px, escaped)
- `Pick a time for your 30-minute call.`
- Calendar box: `Select a day` | `Pacific Time`; five day tiles = next five weekdays starting tomorrow (`d.getDay()%6` skips Sat and Sun), label `toLocaleDateString('en-US',{weekday:'short'})` plus the date number; first tile has an iris border; tiles are not clickable.
- Slots: `9:00 am`, `10:30 am`, `12:00 pm`, `1:30 pm`, `3:00 pm`, `4:30 pm`. Click marks `.on` (iris border, `rgba(146,129,247,.12)`) and calls `toast('Mock booked: {time}')`.
- Note: `mock: embed the real Calendly/Doodle here, pre-filled with name + email`

Field styles: `#08090b`, hair border, 12px radius, 13px 14px, 15px, focus iris border, `transition:border-color .15s`; textarea min 110px vertical resize. `.form` grid gap 14px; `.two` 2 cols (1 under 560px). `.cal` hair border 16px radius padding 18px mt 18px `#07080a`; `.cal-days` 5 cols gap 8px; `.cal-slots` 3 cols gap 8px.

### A. Centered card

Text: eyebrow `Book a call`; H2 `Tell us what you're building.`; lead `Thirty minutes with a founder. Four fields, then pick a time.` (centred); then the card with the form.

Layout: `.book-a` max 620px centred text; `.card` left-aligned, margin-top 34px, padding 34px.

Notes: calendar mock note after submit.

### B. Split: promise + form

Text:
- Left: eyebrow `Book a call`; H2 `Thirty minutes.<br><span class="it muted">A founder on the other end.</span>`
- List (`.expect`):
  1. **`You tell us the idea or the problem.`** `No tech words needed.`
  2. **`We tell you what's worth building and what isn't.`** `Including when AI helps and when it doesn't.`
  3. **`You get a feature list with hours.`** `At a fixed hourly rate for your domain. You decide from there.`
- Right: `.card` padding 34px with the form.

Layout: `.book-b` 2 cols gap 50px (1 col gap 30px under 860px). `.expect` grid gap 16px mt 30px; li grid `34px 1fr` ash, bold white 500 block; `.n` 28px circle mono 12px iris-glow.

Notes: calendar mock note after submit.

### C. Two-step stepper

Text:
- Inside `.big-cta`: eyebrow `Book a call`; H2 `Hand it over.<br><span class="it grad-text">We'll take it from here.</span>`
- Step bar: `1` `Your details` (on), then a 1px bar, then `2` `Pick a time`
- Form (left-aligned), `data-stepper`.

Layout: `.big-cta` hair border 28px radius padding 70px 40px (44px 20px under 560px) centred, `radial-gradient(70% 90% at 50% 120%,rgba(146,129,247,.35),transparent 60%),linear-gradient(#0e0e11,#030303)`. `.stepper` max 760px. `.stepbar` flex gap 12px margin `34px 0 22px` 13px iron; `.s i` 26px circle mono 12px; `.s.on` white text, iris-filled number; `.bar` 1px flex line.

JS: on valid submit, also adds `.on` to step 2 (`#stepbar .s`[1]). Step 1 stays on. No back button.

Notes: calendar mock note after submit.

---

## Claims check

Sources: `project-info/04-proof.md` (proof), `designs/_shared/content.json` (content). Where those two are silent I also checked `project-info/06-people.md` (people), which 04-proof's people table says it supersedes, and `05-open-questions.md` / `DECISION.md` for OPEN items. Status is the tag in those files. NOT FOUND = no support in any of them. A repo-wide search for `hrs/wk`, `Lead QA`, `Caprae CRM`, `Recruitment pipeline`, `1.5 hours`, `leads per hour` finds them only in the lab file.

| # | Claim (where) | Status | Evidence |
|---|---|---|---|
| 1 | "Part of Caprae Capital" (hero A pill and fine print) | VERIFIED | content `hero.trustLine` "Part of Caprae Capital · $110M+ closed 2026 YTD · 8 countries" |
| 2 | "$110M+ closed 2026 YTD" (hero A) | VERIFIED, parent-firm figure | proof L172 "$110M+ in closed deals, 2026 year to date" [VERIFIED]; content `firm.disclaimer` "Figures are Caprae Capital firm-wide, not engineering-team output." |
| 3 | "8 countries" (hero A) | VERIFIED, parent-firm figure | proof L178 "8 countries serviced" |
| 4 | "Caprae Tech" as the brand (nav, table header, chat label, footer) | OPEN | content `meta.title` "Caprae Tech", `meta.domain` "TBD, blocked on Q2"; 05-open-questions Q2 |
| 5 | "Part of Caprae Capital Partners" (footer) | NOT FOUND as a company name | only the domain capraecapitalpartners.com appears (proof L54, L195) |
| 6 | "Founder-led product studio", founders in the CTO seat, "run by people who've built companies", "Our founders have built companies, bought them and grown them" (hero, why, how, founders, team A, footer) | NOT FOUND; conflicts with a decision | proof L24 "The site cannot call all five 'founders.'"; people L11 "Kevin Hong is the founder of Caprae Capital."; DECISION D-009 "Copy names Kevin Hong as founder of Caprae and describes the other four by their actual role" |
| 7 | "meets you once a week" / "One weekly check-in" / THU check-in (hero A/B, why, how, faq) | OPEN | proof L184 "Meeting cadence with founders, Q10"; content `_meta.openItems` "Q10 meeting cadence" |
| 8 | Priced by features × hours × a fixed hourly rate per domain (why B, how, pricing, faq, book B) | OPEN, and content says otherwise | content `engagement.pricingNote` "Project-based. Pricing pending, Q4."; 05-open-questions Q4 |
| 9 | Feature hour estimates (24, 40, 48, 20, 16, 12, 28, 36, 44, 24) and sample sheet (24, 40, 32, 60, 12, 108 hrs) | NOT FOUND, flagged illustrative in the lab | lab notes "hours are illustrative", "illustrative sample, not a real client" |
| 10 | Mock dashboard 1,284 / 6.2% / $18k (services A) | NOT FOUND, flagged mock | lab note "mock numbers, illustration only" |
| 11 | "The same kind of tooling Caprae uses to find and buy companies." (services B, Acquirers) | NOT FOUND as worded | nearest: proof §3 CLOVER "Caprae's proprietary M&A platform" [VERIFIED] |
| 12 | Target industries "staffing, healthcare, services and acquisitions" (services A lead, B tabs) | NOT FOUND | content positions for "companies that buy and build" (`meta.description`) |
| 13 | HIPAA / compliance scope (services B note, FAQ 8) | NOT FOUND | none |
| 14 | "Caprae CRM", "1 click" instead of a weekly call (work 1, stat 4) | NOT FOUND | none |
| 15 | "Recruitment pipeline", "~20 hrs/wk" returned (work 2, stat 1) | NOT FOUND | none |
| 16 | "Lead QA", "1.5 hours per client", "30 → 10 hrs/wk" (work 3, stat 2) | NOT FOUND | none |
| 17 | "6→50+ leads per hour after automating sourcing (50–60)" (stat 3) | NOT FOUND | none; no WORK item backs it either |
| 18 | "Call intelligence" status "In build" (work 4) | Name VERIFIED, status contradicted | proof L68 "Dial Sniper for number screening and Call Intelligence for analytics, both sold standalone" (launched with Cold Call Killers, 1 June 2026) |
| 19 | "Bankers Edge", live, bankersedgeadvisory.com, advisory platform (work 5) | STATED, partly corroborated | proof §4 "[STATED, partly corroborated]... Confirm the public product name and whether the client permits attribution."; content note "Attribution permission pending" |
| 20 | "Simba", landing page, domain and SEO build (work 6) | STATED, unverified; description NOT FOUND | proof §5 "Simba Studio [STATED, unverified] No public record found."; content `placeholder: true` |
| 21 | ITSco = Integrated Technical Services, a founder company (work 7, founders) | VERIFIED as portfolio company; "founder company" framing conflicts | proof L146 ITSco in holding company portfolio [VERIFIED]; people L44 "Founder and Chief of Business Development, ITSco, Integrated Technical Services"; D-004 "Caprae Capital portfolio" is a separate strip from "Built by our team" |
| 22 | ITSco is "Healthcare tech & engineering", delivers data analysis and analytics (work 7, Mike) | NOT FOUND | none |
| 23 | ITSco "led by Zackary Beckham and Mike Savano" (work 7) | Zackary VERIFIED; Mike Savano NOT FOUND | people L44 (Zackary); proof L37 lists "Mike Savino" as an Advisor, no ITSco link |
| 24 | "Destroy Drive", data services, "co-founded by Kevin Hong and Zackary Beckham" (work 8, Kevin bio, Zackary bio and tag) | NOT FOUND; contradicted for Zackary | people L47 Zackary "Previously Director of Service Delivery at Destroy Drive"; nothing links Kevin to Destroy Drive |
| 25 | Kevin Hong, "Founder" | VERIFIED | proof L15; people L26 "Founder and Managing Partner, Caprae Capital" |
| 26 | Kevin "Serial tech entrepreneur" | VERIFIED | proof L29; people L32 |
| 27 | Kevin "10+ years of experience" | NOT FOUND | none |
| 28 | Kevin "Scaled two startups to $31M and $7M ARR"; tag "$31M & $7M ARR"; quote "zero to $31M ARR" | Mismatch: $31M ARR VERIFIED, $7M is revenue not ARR; "from zero" NOT FOUND | proof L29 "grew two startups to $31M ARR and $7M in revenue"; content "Scaled two startups to $31M ARR and $7M revenue" |
| 29 | Kevin "raised $8M+ in venture capital"; tag "$8M+ raised" | NOT FOUND | none |
| 30 | Kevin "Author of the #1 Amazon bestseller The Outlier Approach, published in Forbes and Inc."; tag "Author" | NOT FOUND | none |
| 31 | Kevin "Clinical Adjunct Faculty of Entrepreneurship at Chapman University" | NOT FOUND | none |
| 32 | Kevin "MBA, Chicago Booth" | VERIFIED | people L31 "University of Chicago Booth School of Business"; content credential "Chicago Booth" |
| 33 | Hereford Johnson, "Principal Adviser" | VERIFIED | proof L16; people L56 |
| 34 | Hereford "Founder of Third Equity Partners" | VERIFIED | people L57; content role "Founder, Third Equity Partners" |
| 35 | Hereford "traditional, self-funded and independent-sponsor acquisition models" | VERIFIED | people L59; content detail |
| 36 | Hereford "Educator and trusted voice in the search-fund community" | VERIFIED | people L60 |
| 37 | Hereford "MBA, Northwestern Kellogg" | VERIFIED | people L58 |
| 38 | Hereford quote "Knows exactly what an acquirer needs from a tool." | NOT FOUND (opinion copy) | none |
| 39 | Zackary Beckham, "Founder" | VERIFIED as the Caprae site title, with caveat | proof L19; people L40 "Listed on the Caprae sites as Founder. His own headline says Partner for Strategic Investments"; content uses "Partner for Strategic Investments. Founder, ITSco" |
| 40 | Zackary "Chief of Business Development at ITSco (Integrated Technical Services)" | VERIFIED | people L44 |
| 41 | Zackary "12+ years in operations and program management"; tag "12+ yrs ops" | VERIFIED | people L46; content detail |
| 42 | Zackary "BS Information Technology and BS Biology, Arizona State" | VERIFIED | people L48 |
| 43 | Zackary quote "Has run delivery for technical services at scale." | NOT FOUND (opinion copy; loosely echoes people L47) | none |
| 44 | Mike Savano, "CEO · ITSco" | NOT FOUND | proof L37 has "Mike Savino" as an Advisor only; lab note flags spelling and title |
| 45 | Founders lead "built, bought and grown companies in tech, healthcare, data and acquisitions" | NOT FOUND | none |
| 46 | Siddhant Pahuja, "Head of AI & Automation" | NOT FOUND | none |
| 47 | Ukant (Lead engineer), Hiten, Dejan (Engineers) | NOT FOUND | none |
| 48 | "Small team" (team C) | NOT FOUND; tension with public figure | proof L51 "publicly reported as 20+ engineers"; Q12 headcount open |
| 49 | Stack: Claude, OpenAI, n8n, Supabase, Azure, FastAPI, Twilio | NOT FOUND | proof L55 SaaSquatch stack is "Flask backend, Vite + React + TypeScript frontend, ML workflows, AWS deployment" |
| 50 | Stack: React | VERIFIED (for SaaSquatch Leads) | proof L55; content `stack` "React" |
| 51 | "Thirty minutes" call length (how, book) | In content (which claims every string traces to VERIFIED); no tag in proof | content `engagement.steps[0]` "Thirty minutes. What you are building, what is in the way." |
| 52 | "with a founder" on the call (how, book A/B) | NOT FOUND | content contact h2 "Talk to the people who would build it." |
| 53 | "Pacific Time" (calendar) | NOT FOUND | people L30 has Kevin in Los Angeles, no time zone commitment |
| 54 | "You own what you pay for." (FAQ 7) | NOT FOUND, flagged | lab note "confirm with Kevin" |
| 55 | Data safety answer (FAQ 8) | NOT FOUND, flagged | lab note "confirm wording" |
| 56 | "Engineers ship every week" (how) | NOT FOUND | none |

Counts over these 56 rows (a row with two parts counts under its weaker status):

| Status | Count |
|---|---|
| VERIFIED | 16 (rows 1, 2, 3, 25, 26, 32, 33, 34, 35, 36, 37, 40, 41, 42, 50, 51) |
| VERIFIED with caveat (title or framing disputed) | 2 (rows 21, 39) |
| STATED | 2 (rows 19, 20) |
| OPEN | 3 (rows 4, 7, 8) |
| Contradicted or mismatched by the proof files | 4 (rows 6, 18, 24, 28) |
| NOT FOUND | 29 (rows 5, 9 to 17, 22, 23, 27, 29, 30, 31, 38, 43, 44, 45, 46, 47, 48, 49, 52, 53, 54, 55, 56) |
| Total | 56 |

Row 51 is counted as VERIFIED because content.json's rule says every string traces to a [VERIFIED] fact, but 04-proof carries no tag for call length.

What the lab leaves out: the three products 04-proof calls strongest and publishable (SaaSquatch Leads, Cold Call Killers, CLOVER, proof §1 to §3, "Safe to name: Yes") do not appear anywhere in the lab. Eric Nehrlich and Felix I. Odigie (VERIFIED, content `people.members`) are also absent. The lab's proof section is built entirely on NOT FOUND or STATED items.

## Open questions for the user

1. **Claims policy for the drafts.** The project rule is VERIFIED only. Following "copy the text as it is" ships 29 NOT FOUND claims, including every work metric (~20 hrs/wk, 30→10, 6→50+, 1 click) and most of Kevin's bio. Should the drafts copy verbatim anyway as internal comps (not for launch), or replace unverified claims with a visible placeholder?
2. **Founder framing.** The lab calls four people "founders" and makes "founder-led" the whole pitch. 04-proof and D-009 say only Kevin Hong founded Caprae. Keep the lab wording for the drafts, or apply D-009?
3. **Destroy Drive.** The lab says Kevin and Zackary co-founded it. 06-people says Zackary was Director of Service Delivery there. Which is right?
4. **Mike Savano vs Mike Savino.** Spelling and title (lab note asks CEO / CTO / CDO). 04-proof lists "Mike Savino" as an Advisor with no ITSco role.
5. **Kevin's $7M.** Lab says $7M ARR; proof says $7M revenue. Also source for $8M+ raised, The Outlier Approach, Chapman, 10+ years.
6. **Call Intelligence status.** Lab says "In build"; proof says it is sold standalone as part of Cold Call Killers.
7. **Missing VERIFIED proof.** Should SaaSquatch Leads, Cold Call Killers and CLOVER be added, or does "follow the text as it is" win?
8. **Build team names.** Siddhant Pahuja, Ukant, Hiten, Dejan appear in no project file. Surnames, consent to be named, and photos.
9. **Stack list.** Claude, OpenAI, n8n, Supabase, Azure, FastAPI, Twilio are unsourced; the one documented stack uses Flask and AWS. Keep as text tiles or swap for logos (lab note "swap text for logos")?
10. **Headshots.** No images exist. Initials in gradient rings everywhere. Keep initials for the drafts?
11. **Yellow `.note` flags.** They are hidden unless Notes is on. Strip them from the drafts, keep them hidden in the markup, or show them?
12. **Toast.** The only design use is `Mock booked: {time}` on a calendar slot click. Keep a toast in the drafts or drop the feedback?
13. **Form target and calendar.** No submit endpoint (content `contact.cta.href` "TBD, Q17"; fallback partners@capraecapital.com). The calendar is a mock with fixed slots and "Pacific Time". Keep the mock, or wire Calendly/Doodle? Day tiles are not clickable in the mock; should they be?
14. **Simba placeholder.** `[Add the client's problem]` is visible text in Work B and C. Keep as is?
15. **Pricing rate placeholder.** `Rate: [domain rate] / hr` and "set on the call" are visible. Keep?
16. **Mobile nav.** Links hide under 860px and there is no menu. Only the "Book a call" button remains. Add a menu or match the lab?
17. **Hero B timer.** The 3s auto-switch overrides a visitor's click made in the first 3 seconds. Copy the behaviour exactly or fix it?
18. **Reduced motion.** No `prefers-reduced-motion` handling for the cube, rotor or marquee. Add it or copy exactly?
19. **Offsets without the lab bar.** `scroll-padding-top:120px`, hero `min-height:calc(100vh - 112px)`, sticky `top:150px`/`140px`, footer bottom padding 120px are tuned for the lab bar and dock. OK to re-tune to the 64px nav?
20. **Anchors per draft.** All in-page links (#hero #why #services #work #how #pricing #founders #book) resolve because section ids sit on the `<section>` elements. Keep those ids on the draft sections. `#team` and `#faq` exist but nothing links to them.
21. **Accessibility gaps copied as-is?** Drag-compare (Why C) has no keyboard support; checklist has `role=checkbox` with no `aria-checked`; accordions have no `aria-expanded`; form labels are not linked to inputs; industry tabs have no tab roles. Copy or fix?
