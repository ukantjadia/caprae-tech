# dala-caprae

Caprae technical services site rebuilt on Dala's techniques
(https://dala.craftedbygc.com/). Build plan: `PLAN.md`. How Dala works:
`../../research/dala/01-code-teardown.md`. Decision: D-052.

## Stack

| Layer | Dala used | We use | Why the change |
|---|---|---|---|
| Build | Laravel Mix (webpack) | Vite | Mix's last release was 2022. Laravel's own default is now Vite |
| 3D | three.js | three.js 0.186 | Same |
| GPU particle sim | hand-written FBO ping-pong | `GPUComputationRenderer` (ships in three) | Same technique, less code |
| Scroll | ASScroll + GSAP ScrollTrigger | Lenis + GSAP 3.15 ScrollTrigger | ASScroll archived 2023. Its author points to Lenis |
| Depth of field | BokehShader2 + separate depth pass | one custom pass, depth in alpha (`src/post.js`) | three's BokehPass ignores GPU-driven positions |
| Serving | nginx on RunCloud, static files | any static host | Same model: the site is plain files |

**No Laravel, no PHP.** Dala only used Laravel's build tool. Its page is a static
HTML file with no sessions, no forms and no server code. We add a backend only
if we need one later, for example a contact form. One form can run on a
serverless function, so there's still no PHP host.

## Local tools

| Tool | Status on this machine | Needed for |
|---|---|---|
| bun 1.3.10 | installed | install, dev server, build, bake script |
| Chrome | installed | running and checking the site |
| git | installed | version control |
| Blender (free) | **not installed** | only if we model our own shapes. Free CC0 GLBs work instead |
| PHP / Laravel | not installed, not needed | nothing |

Agent tooling, installed 2026-09-29:
- GSAP skills (`gsap-core`, `gsap-scrolltrigger`, `gsap-timeline` and 5 more) in `~/.claude/skills`.
- `threejs-devtools-mcp`, local to this project. No keys, logins or accounts.
  It opens a browser tab against the dev server and talks to the scene over a
  WebSocket. Keep that tab open. Its tools load after Claude Code restarts.

## Commands (once scaffolded)

```
bun install
bun run bake   # GLBs in shapes/ -> public/shapes.bin
bun run dev    # localhost
bun run build  # dist/, static files
```

## Hosting

`dist/` is static, so any host works: GitHub Pages, Cloudflare Pages, Netlify,
Vercel, or an nginx VPS like Dala's. No server runtime.

## Design reference

Dala's tokens, from `styles-refreo/sample-design-saved-html/dala/` (Refero):
black `#000000` stage, one violet accent `#8052ff` used only for the single
primary button, amber `#ffb829` highlights, headlines at weight 400 with -0.04em
tracking at 78 to 113px, body at weight 200 and 18px, 24px radius, no cards, the
particle cloud as the only hero image.

Font: Dala uses PP Neue Montreal, a paid font. We use Inter Tight (free, OFL), with
body text at 300 instead of Dala's 200 (D-054).

## Reference copies (private, gitignored)

- `study/dala/shaders/`: Dala's extracted GLSL, for reading only.
- `study/dala/assets/`: their EXR, PNG and GLB files. `preview-pos-all.png` shows the 4 shapes.
- `study/dala/mirror/`: full local mirror (`bunx serve -l 5199 study/dala/mirror`).
  Works. It only looks stuck when the Chrome tab is hidden, because Dala's loader waits
  for animation frames, which Chrome pauses in background tabs.
- `styles-refreo/sample-design-saved-html/dala-complete-site-host/`: the browser
  "Save page" copy. It can't run on its own, because the JS loads `/models`,
  `/images` and `/fonts` from absolute paths that weren't saved.

Dala's shaders and assets are for study only. The build uses our own code and our own shapes.

## Files

| File | What it does |
|---|---|
| `src/config.js` | every knob: shapes, particle count, physics, colours |
| `scripts/bake.js` | shapes → `public/shapes.bin` (10-bit, Morton-sorted, delta-coded, 110KB gzip) |
| `src/particles.js` | GPU simulation, 40k instanced pyramids, floating dust |
| `src/post.js` | depth of field, vignette, grain |
| `src/main.js` | Lenis + ScrollTrigger, scroll → shape progress, mouse, render loop |

Dev only: `window.__field.step(n)` advances n frames by hand, for checking in a background tab where rendering is paused.

## Measured (2026-09-29, Intel UHD, 1878x915 canvas at DPR 1.25)

About 53 to 55fps (18.0 to 18.8ms per frame at 1878x850, timed with a GPU sync, 10k particles). Dala on the same laptop: 36 to 38fps.
JS 187KB gzip (Dala 245KB). Shapes 110KB gzip (Dala 275KB EXR). Font 45KB (Latin subset).
