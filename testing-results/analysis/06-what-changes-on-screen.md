# What each fix changes on screen

Companion to `05-all-issues-by-report.md` (rows P1 to P33) and the plan in
`../plan/investigation/2026-10-22-performance-investigation-plan.md` (C1 to C14, S1 to S7).
Screenshots in `ui-preview/` were taken on the live site (capraetech.io, 2026-10-22, Brave, 1720 px wide),
by simulating each change in the page. Nothing on the site was changed.

## The big one: C1, refuse software 3D (row P2, also P7, P8, P3)

**What changes in code:** one option when the 3D starts (`failIfMajorPerformanceCaveat: true`, `stage.js:21`).
If the browser can only draw the 3D in software (on the processor instead of a graphics card), it says no, and the
page runs its existing fallback: it removes the particle canvas. Nothing else on the page changes.

| Visitor | Today | After C1 |
|---|---|---|
| Normal laptop, desktop or phone with working graphics (most visitors) | Full particle 3D (`01-hero-with-3d.jpg`) | **No change at all.** Same 3D, same motion |
| Browser that can only draw 3D in software: graphics acceleration switched off, old or blocked graphics drivers, some remote desktops and virtual machines, some locked-down company PCs | The 3D draws, but every frame takes 0.4 to 1 s: scrolling jumps, clicks and the menu respond seconds late, the typing headline stutters. In our tests the page froze completely in 2 of 3 runs | **The page shows without the 3D** (`02-hero-without-3d.jpg`): black background, all text, buttons, cards, the purple horizon glow and the chip strip stay. Scrolling and clicks are instant |
| Browser with no 3D at all (GTmetrix's case, new Chrome without a graphics card) | Already shows the page without 3D | No change |
| Google PageSpeed | Scores the frozen software-3D page (51, TBT 25 s) | Most likely scores the page without 3D, as GTmetrix does |

**What a no-3D visitor loses:** the particle "C" in the hero, the shapes that form and re-form as you scroll
(`03-` vs `04-what-we-build-*.jpg`), the floating triangles. The sections, text, cards, colours and layout are identical.

**Decision attached:** this touches D-052 (don't cut effects to hit numbers). It removes the effect only where it
freezes the page. Optional later: show a still image of the particle "C" to those visitors so the hero keeps its mark.

## C2, stop drawing when nothing changes (rows P2, P3, P7)

**Visible change: none, by design.**
- Normal motion: the particles always move (they spin, sway and drift, and react to the mouse), so the loop
  only pauses when the footer has pushed the 3D completely off screen. You can't see a paused canvas there.
- "Reduce motion" turned on in the visitor's system: time is already frozen; the loop would pause once the
  particles have settled and wake on scroll or mouse movement. The picture stays the same.

**Felt change:** less fan noise and battery drain, especially while reading the bottom of the page or with
reduce motion on. **Risk if done carelessly:** particles freezing mid-move; the fix must wait until they settle.

## C3, remove the 20 hidden Lab sections (rows P4, P5, P8, P13, P14)

**Visible change: none.** The removed sections are already hidden (`display: none`). The page keeps exactly
the 10 sections you see today.
**Felt change:** the page appears sooner on slower machines (a 0.5 s task before first paint goes away), and the
page has one main heading instead of three (two were hidden). **Risk:** the Lab script fills visible and hidden
parts in one go; removing the hidden parts must keep the visible ones working (tested before shipping).

## C4, load the 3D engine after the page appears (rows P8, P11)

**Visible change: small.** On a fast connection, none. On a slow phone connection the particles may appear a
moment later than today, while the text, menu and buttons become usable sooner (they no longer wait for the
168 KB 3D file to download). On a first visit the loading screen covers this anyway.

## C5, Latin-only fonts and font preloading (rows P5, P9, P10, P12)

**Visible change: none in the text itself** (the site is English; only unused alphabets are dropped).
**Felt change:** the headline appears in its real font sooner, so less of the brief "plain font, then the
designed font snaps in" flash. This may also cure the font-related layout shift (row P6).

## C6, remove the section fade-in (row P4)

**Visible change: yes, small.** Today every section fades in and slides up 6 px over 0.35 s when the page loads
(`index.html:81`, left over from the Lab's tab switching). After: the sections are simply there. On a first
visit the loading screen hides this; on later visits (the loader lifts at once) you would notice the content
appearing instantly instead of fading in.

## C7, lighter grey text (rows P22, P21)

**Visible change: yes, subtle** (`05-table-grey-now.png` vs `06-table-grey-proposed.png`). The grey goes from
#6e727a to #7a7e86. It is used by 27 style rules on the home page and the same 27 in the inner-page styles: the dev-shop column of the
comparison table, small labels (Active users, MON to FRI, "drag or tap"), captions and the `.dim` text style.
Everything grey gets slightly easier to read; it still reads as secondary next to white text. On phones the
"Dev shop" label in the comparison table goes from dark grey (2.35:1) to the same lighter grey.

## C8, a `<main>` region (row P24)

**Visible change: none.** Screen readers can jump straight to the content; the keyboard "Skip to content" link
lands on it.

## C9, heading level `h4` to `h3` (row P23)

**Visible change: none** (the styles move with it). Screen readers announce a correct outline.

## C10, fixed-width typing word (rows P6, P16): now NOT recommended

**Visible change: yes, and not a good one** (`07-typing-word-fixed-width-preview.jpg`). Today the first line
re-centres as each letter types, so "Software for" slides a little. With a fixed-width box the line stops sliding,
but when the word is short the first line sits left of the two lines below it and looks off-centre.
The shift it removes is tiny (0.004 to 0.04, Google's limit is 0.1). **Recommendation changed: skip C10**, and
treat the larger font-swap shift (row P6, I3) separately.

## C11, loader fades with opacity only (row P15)

**Visible change: none.** The loading screen looks and times the same. On slow machines it can no longer stall
over the hero while the 3D starts.

## C12, cache `shapes.bin` for a year (row P20)

**Visible change: none.** Repeat visits skip a 313 KB download.

## C13, one target for "Book a call" (row P25)

**Behaviour change, your choice.** Today on the home page, the navbar "Book a call" opens the separate
`/book-a-call/` page, while the hero "Book a call" scrolls down to the form on the same page.
- Option A: both scroll to the form on the home page (faster, visitor stays on the page).
- Option B: both open `/book-a-call/` (one clear destination, a page you can link to).

## C14, source maps (row P26)

**Visible change: none.** Developers can debug the live site more easily.

## Server and Cloudflare fixes (S1 to S7)

**Visible change: none,** except speed:
- S1 (HTML from Cloudflare's cache) and S2 (stop re-checking small files): pages start loading sooner,
  most noticeably on the first visit to each page.
- S3 (compression): less data, faster on phones.
- S4 (Email Obfuscation off): the footer email looks the same. The difference: today a visitor with JavaScript
  off sees "[email protected]" placeholder text, after the change they see the real address. Spam bots could
  read it more easily.
- S5 (bot check off), S7 (security headers): nothing visible.

## Summary

| Fix | Visible on screen? | What you'd notice |
|---|---|---|
| C1 refuse software 3D | Only for visitors whose browser would freeze | They get the page without particles instead of a frozen page |
| C2 pause when idle | No | Quieter fan, better battery |
| C3 remove hidden sections | No | Page appears sooner |
| C4 load 3D later | Barely | Particles may appear a moment later on slow connections |
| C5 fonts | No | Real font appears sooner |
| C6 no fade-in | Yes, small | Sections appear instantly instead of fading in |
| C7 lighter grey | Yes, subtle | Grey text slightly easier to read |
| C8, C9, C11, C12, C14 | No | |
| C10 fixed typing word | Yes, worse | **Skip** |
| C13 one Book a call target | Behaviour | Your choice of where both buttons go |
| S1 to S7 | No | Faster loading |
