// sitemap.xml, built from routes.js and the page files, so it always matches the site.
// - <lastmod>: when that page's file last changed in git (Google uses this when it is accurate);
//   a page with uncommitted edits gets the build time; without git, the file's modified time.
// - <priority> and <changefreq>: Google ignores them, Bing still reads them; set by page type.
// - <image:image>: the people pages carry their headshots (public/team/).
import { execFileSync } from 'node:child_process'
import { statSync } from 'node:fs'

// [route test, priority, changefreq], first match wins
const TIERS = [
  [r => r === '/', '1.0', 'weekly'],
  [r => /^\/(what-we-build|who-we-serve)\/[^/]+\/$/.test(r) || ['/pricing/', '/book-a-call/'].includes(r), '0.9', 'monthly'],
  [r => ['/what-we-build/', '/who-we-serve/', '/why-founder-led/', '/how-it-works/', '/work/', '/faq/'].includes(r), '0.8', 'monthly'],
  [r => r.startsWith('/work/'), '0.7', 'monthly'],
  [r => r.startsWith('/founders/') || r.startsWith('/build-team/'), '0.6', 'monthly'],
  [r => ['/privacy/', '/terms-and-conditions/'].includes(r), '0.3', 'yearly'],
  [() => true, '0.5', 'monthly'],
]

// headshot per profile page (file names in public/team/ don't all match the URL slug)
const PHOTO = {
  '/founders/kevin-hong/': ['kevin-hong', 'Kevin Hong, Founder, Caprae Tech'],
  '/founders/hereford-johnson/': ['hereford-johnson', 'Hereford Johnson, Principal Adviser, Caprae Tech'],
  '/founders/zackary-beckham/': ['zackary-beckham', 'Zackary Beckham, Founder, Caprae Tech'],
  '/founders/mike-savino/': ['mike-savino', 'Mike Savino, ITSco'],
  '/build-team/siddhant-pahuja/': ['siddhaant-pahuja', 'Siddhant Pahuja, Head of AI & Automation, Caprae Tech'],
  '/build-team/ukant/': ['ukant-jadia', 'Ukant Jadia, Lead engineer, Caprae Tech'],
  '/build-team/hiten/': ['hiten-mehta', 'Hiten Mehta, Engineer, Caprae Tech'],
  '/build-team/dejan/': ['dejan-azul-ultamar', 'Dejan Azul Ultamar, Engineer, Caprae Tech'],
}
const group = prefix => Object.entries(PHOTO).filter(([r]) => r.startsWith(prefix))
const IMAGES = {
  ...Object.fromEntries(Object.entries(PHOTO).map(([r, p]) => [r, [p]])),
  '/founders/': group('/founders/').map(([, p]) => p),
  '/build-team/': group('/build-team/').map(([, p]) => p),
}

const xml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])
const iso = d => new Date(d).toISOString().replace(/\.\d{3}Z$/, 'Z')

function lastmod(file, now) {
  try {
    if (execFileSync('git', ['status', '--porcelain', '--', file], { encoding: 'utf8' }).trim()) return iso(now)
    const d = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf8' }).trim()
    if (d) return iso(d)
  } catch { /* no git on this machine */ }
  return iso(statSync(file).mtime)
}

// pages: [{ route, file }] from plugin.js findPages(); order follows routes.js
export function sitemapXml(routes, pages, site) {
  const fileOf = Object.fromEntries(pages.map(p => [p.route, p.file]))
  const now = Date.now()
  const urls = routes.map(r => {
    const [, priority, changefreq] = TIERS.find(([t]) => t(r))
    const imgs = (IMAGES[r] || []).map(([f, caption]) => `
    <image:image><image:loc>${site}/team/${f}.webp</image:loc><image:title>${xml(caption)}</image:title></image:image>`).join('')
    return `  <url>
    <loc>${site}${r}</loc>
    <lastmod>${lastmod(fileOf[r], now)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imgs}
  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`
}
