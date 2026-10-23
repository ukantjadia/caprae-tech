// Fills each page's markers with the shared parts, in dev and in the build:
//   <!--@head-->    title, description and social tags from routes.js
//   <!--@nav-->     the navbar          <!--@crumbs-->  the breadcrumb trail
//   <!--@book-->    the closing band    <!--@footer-->  the footer
// and {{SITE}} with SITE_URL. In the build it also writes sitemap.xml and robots.txt.
// Then it prefixes root-relative <a href="/..."> links with the deploy base, so the same
// pages work at / locally and at /caprae-tech/ on GitHub Pages.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTES, SITE_URL } from './routes.js'
import { head, nav, crumbs, bookBand, footer } from './chrome.js'
import { pageShapes } from './shapes.js'
import { sitemapXml } from './sitemap.js'

// llms.txt (llmstxt.org) for AI assistants: the written summary in llms-head.md, then every page
// from routes.js with its title and description, so the list always matches the site. The full
// fact sheet is public/ai-information.md.
function llmsTxt() {
  const headText = readFileSync(fileURLToPath(new URL('./llms-head.md', import.meta.url)), 'utf8').trimEnd()
  const pages = Object.entries(ROUTES).map(([r, v]) => `- [${v.title.replace(/ \| Caprae Tech$/, '')}](${SITE_URL}${r}): ${v.description}`)
  return `${headText}

## All Pages

- [AI Information](${SITE_URL}/ai-information.md): Official, verified brand facts for AI assistants
${pages.join('\n')}

## Optional

- [Caprae Capital](https://capraecapital.com/): The parent company
- [Caprae Capital AI Information](https://capraecapital.com/ai-information.md): Verified facts about the parent company
- [Kevin Hong on LinkedIn](https://www.linkedin.com/in/kevinhshong/): Founder
- [Cold Call Killers](https://coldcallkillers.io/): Where Call Intelligence™ is live in beta
`
}

const SKIP = new Set(['node_modules', 'dist', 'src', 'public', 'site'])

// every index.html under the project, as { route: '/work/lead-qa/', file }
export function findPages(root) {
  const out = []
  const walk = dir => {
    for (const name of readdirSync(dir)) {
      if (SKIP.has(name) || name.startsWith('.')) continue
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (name === 'index.html') {
        const rel = relative(root, dir).split(sep).join('/')
        out.push({ route: rel ? `/${rel}/` : '/', file: full })
      }
    }
  }
  walk(root)
  return out
}

// inner pages (D-096): which shape set the page loads, the box its hero shape is fitted into,
// and where the particles change: the first content section scatters them into a cloud, unless
// site/shapes.js lists stops for the page's sections; the Book a call band forms the C
function particleStops(html, route) {
  const { set, stops } = pageShapes(route)
  html = html.replace(/<body([^>]*)>/, `<body$1 data-shapes="${set}">`)
  html = html.replace(/<section class="pg-hero([^"]*)">/, (m, rest) => `<section class="pg-hero${rest}" data-stop="0"><div class="hero-mark" aria-hidden="true"></div>`)
  const list = stops || ['cloud']
  let i = 0
  html = html.replace(/<section class="pg-sec([^"]*)"/g, (m, rest) => {
    const s = list[i++]
    if (!s) return m
    const [shape, side] = s.split('@')
    return `<section class="pg-sec${rest}" data-stop="${shape}"${side ? ` data-side="${side}"` : ''}`
  })
  return html
}

export function sitePages({ root, base }) {
  const pages = findPages(root)
  // a page file with no route (or a route with no file) is a broken link waiting to happen
  const files = new Set(pages.map(p => p.route))
  const missing = Object.keys(ROUTES).filter(r => !files.has(r))
  const orphan = [...files].filter(r => !ROUTES[r])
  if (missing.length || orphan.length) throw new Error(`routes.js and the page files disagree. No file: ${missing.join(', ') || '-'}. No route: ${orphan.join(', ') || '-'}`)

  return {
    name: 'caprae-site-pages',
    config: () => ({ build: { rollupOptions: { input: Object.fromEntries(pages.map(p => [p.route === '/' ? 'home' : p.route.slice(1, -1), p.file])) } } }),
    // the sitemap and robots.txt, from routes.js, so they always match the pages
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(Object.keys(ROUTES), pages, SITE_URL) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
` })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const rel = relative(root, ctx.filename).split(sep).join('/')
        const route = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`
        if (!ROUTES[route]) throw new Error(`no route for ${rel}`)
        const fill = (marker, value) => { html = html.split(`<!--@${marker}-->`).join(value) }
        fill('head', head(route))
        fill('nav', nav(route))
        fill('crumbs', crumbs(route))
        fill('book', bookBand(route))
        fill('footer', footer())
        html = html.split('{{SITE}}').join(SITE_URL) // page-level structured data uses this token
        if (route !== '/') html = particleStops(html, route)
        if (!/<body[^>]*\bid=/.test(html)) html = html.replace(/<body([^>]*)>/, '<body$1 id="top">')
        if (base !== '/') html = html.replace(/(<a\b[^>]*?\bhref=")\/(?!\/)/g, `$1${base}`)
        return html
      },
    },
  }
}

// D-100: preload the heading font (Instrument Serif, regular and italic) on every page, so the
// h1 (the LCP element) doesn't wait for the CSS to be parsed before its font starts downloading.
// Build only: the font file names carry hashes that exist once the bundle is written.
export function preloadFonts({ base }) {
  return {
    name: 'caprae-font-preload',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const fonts = Object.keys(ctx.bundle).filter(f => /instrument-serif-latin-400-(normal|italic)-[\w-]+\.woff2$/.test(f)).sort()
        return { html, tags: fonts.map(f => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: base + f }, injectTo: 'head-prepend' })) }
      },
    },
  }
}
