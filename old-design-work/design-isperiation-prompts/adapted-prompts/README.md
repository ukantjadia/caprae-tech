# Adapted prompts

Caprae versions of the reference prompts in `../`. Originals are never edited.

| File | Source | Status |
|---|---|---|
| `01-orrery-to-caprae.md` | `../orrery.md` | written, unbuilt |
| — | `../ascent.md` | not started |
| — | `../ascend.md` | not started |

## What is being carried across

Not the subject matter. The clothes — alpine footage, halftone hands, Kepler
orbits — are the least transferable part of those files. What transfers is the
structure, which is identical in all three:

| Element | What it does |
|---|---|
| One mechanism, named in the first sentence | The page **is** the mechanism, not decorated by it |
| A negative-constraint block | "If you did X you built it wrong." Kills the default output before it happens |
| Exact numbers, never adjectives | Hex, `clamp()`, z-index stack, easing constants, ms delays |
| Verbatim copy supplied | No invented words |
| Reduced motion as a designed tier | Not a disable switch |
| A verification list | Measurable checks, not assertions |
| A closing voice paragraph | One short statement of feel, after all the specs |

## What each source file argues

**`ascent.md` — restraint as authority.** Scroll position *is* `video.currentTime`.
Three lines of copy across the whole scroll, and a deliberately empty band from
0.40–0.70 where the footage carries alone: *"That silence is what makes it feel
authored; do not fill it."* Message: we do not need to talk, look at the thing.

**`ascend.md` — stillness as expense.** One 100vh screen, no scroll. The headline
lives in the gap between two reaching halftone hands. Motion is a 22s ken-burns
that never resolves. Message: calm, spacious, expensive, nothing decorative that
isn't earning its place.

**`orrery.md` — correctness is the aesthetic.** 90,000 bodies on real Kepler
orbits, no library, no assets. The file is organised around its Seven Silent
Failures — the shortcuts that look approximately right and are wrong. The
ephemeris is computed from the visitor's clock because *"an observatory page
whose ephemeris is a static string is the one thing this audience notices
first."* Message: the mechanism is the proof, and you can check it.

## Why orrery was adapted first

It is the only one whose ideology is already this project's ideology.

| Orrery | Caprae, already decided |
|---|---|
| The audience notices the static string first | `PRODUCT.md`: "This buyer checks things. Anything unverifiable is worse than absent." |
| Raw WebGL2, no library | D-007: hand-written Three.js is itself part of the pitch |
| Position is a pure function of (elements, time) | D-022: progress is a pure function of scroll |
| A centred column, no panels anywhere | Craft floor: same-size cards refused as page structure |
| Every read-out computed, not written | D-002 plus the Jacquard raise: provenance inline |
| No image, video or mesh | Caprae has no brand kit and no photography (Q19 open) |

That last row is the practical one: `ascent.md` needs a video and `ascend.md`
needs a commissioned illustration. Neither exists.

## The one inversion

Orrery's live ephemeris describes the world. Caprae's live read-out describes
**the render only** — bodies in field, cycles resolved, elapsed, current stage.
It may never describe the business.

Orrery can animate a true number because sidereal time is true for everyone.
Caprae cannot, because an animated figure about the company is either unsourced
or reads as unsourced, and this ICP treats those the same way. Business figures
stay static, quoted, and provenance-marked.

That inversion is Silent Failures 1 and 2 in the adapted file, and it is the
thing most likely to be lost if the prompt is ever summarised.

## Decisions on the adaptation

Recorded as **D-026** in `../../DECISION.md`: dark ground kept, deal flow as the
subject per D-012, single self-contained HTML file per D-016.
