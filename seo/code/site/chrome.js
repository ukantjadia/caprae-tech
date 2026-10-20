// The parts every page shares, as HTML strings: head tags, navbar, breadcrumbs, the closing
// "Book a call" band and the footer. plugin.js puts them where a page has the matching marker.
// Links are written root-relative ("/pricing/"); plugin.js adds the deploy base afterwards.
import { ROUTES, NAV, FOOTER, SITE_URL } from './routes.js'
import { KEYWORDS } from './keywords.js'

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const chevron = '<svg class="cx-chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const arrow = '<span class="arr" aria-hidden="true">→</span>'

// is `href` the current page, or a section the current page sits inside?
const isCurrent = (href, path) => href === path
const isWithin = (item, path) => (item.href && item.href !== '/' && path.startsWith(item.href)) || (item.items || []).some(i => path.startsWith(i.href))

// structured data as a script tag; "<" escaped so text can never close the tag
const ld = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const ORG = {
  '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: 'Caprae Tech', url: `${SITE_URL}/`,
  email: FOOTER.email, description: 'Founder-led product studio, priced in hours.',
  parentOrganization: { '@type': 'Organization', name: 'Caprae Capital Partners', url: 'https://capraecapital.com/' },
}

export function head(path) {
  const r = ROUTES[path], url = SITE_URL + path
  // every page but home: its breadcrumb trail, matching crumbs()
  const trail = []
  for (let p = path; p; p = ROUTES[p].parent) trail.unshift(p)
  const data = path === '/'
    ? { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', name: 'Caprae Tech', url: `${SITE_URL}/`, publisher: { '@id': ORG['@id'] } }] }
    : { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: ROUTES[p].label, item: SITE_URL + p })) }
  // black from the first paint, before the stylesheet arrives (no white flash between pages).
  // On body, not html: a background on html stops body's propagating to the canvas, and body
  // then paints over the particle field (z-index -1), hiding it on every page.
  return `<meta name="color-scheme" content="dark">
<style>body{background:#000;color:#f0f0f0}</style>
<title>${esc(r.title)}</title>
<meta name="description" content="${esc(r.description)}">
${KEYWORDS[path] ? `<meta name="keywords" content="${esc(KEYWORDS[path].join(', '))}">\n` : ''}<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${esc(r.title)}">
<meta property="og:description" content="${esc(r.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Caprae Tech">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#000000">
${ld(data)}`
}

// the organization, for pages that describe a service
export const ORG_REF = { '@id': ORG['@id'] }

export function nav(path) {
  const top = NAV.map((item, n) => {
    const within = isWithin(item, path)
    if (!item.items) {
      const cur = isCurrent(item.href, path)
      return `<li><a class="cx-top${within ? ' is-within' : ''}" href="${item.href}"${cur ? ' aria-current="page"' : ''}>${item.label}</a></li>`
    }
    const id = `cx-sub-${n}`
    const rich = item.items.some(i => i.blurb)
    const links = item.items.map(i => `<li><a href="${i.href}"${isCurrent(i.href, path) ? ' aria-current="page"' : ''}><b>${esc(i.label)}</b>${i.blurb ? `<small>${esc(i.blurb)}</small>` : ''}</a></li>`).join('')
    // a section with a page: the label links to it and a separate button opens the menu.
    // Company has no page, so its label is the button.
    const trigger = item.href
      ? `<a class="cx-top${within ? ' is-within' : ''}" href="${item.href}"${isCurrent(item.href, path) ? ' aria-current="page"' : ''}>${item.label}</a><button class="cx-toggle" type="button" aria-expanded="false" aria-controls="${id}" aria-label="${item.label} menu">${chevron}</button>`
      : `<button class="cx-top cx-toggle cx-label${within ? ' is-within' : ''}" type="button" aria-expanded="false" aria-controls="${id}">${item.label}${chevron}</button>`
    const overview = item.href ? `<a class="cx-sub-all" href="${item.href}">All of ${item.label.toLowerCase()} ${arrow}</a>` : ''
    return `<li class="cx-has-sub">${trigger}<div class="cx-sub${rich ? ' cx-sub-rich' : ''}" id="${id}"><ul>${links}</ul>${overview}</div></li>`
  }).join('')

  // phones: a hamburger that opens a drawer from the right. Every group is its own collapsible
  // <details>, so the drawer stays short. Works without JS (details); menu.js adds the scroll lock,
  // tap-outside and Escape.
  const cur = h => isCurrent(h, path) ? ' aria-current="page"' : ''
  const mobile = NAV.map(item => item.items
    ? `<details class="cx-m-group"${isWithin(item, path) ? ' open' : ''}><summary>${item.label}<svg class="cx-chev" width="12" height="12" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><ul>${item.href ? `<li><a href="${item.href}"${cur(item.href)}>All of ${item.label.toLowerCase()}</a></li>` : ''}${item.items.map(i => `<li><a href="${i.href}"${cur(i.href)}>${esc(i.label)}</a></li>`).join('')}</ul></details>`
    : `<a class="cx-m-link" href="${item.href}"${cur(item.href)}>${item.label}</a>`).join('')

  // the home page is final-draft-2 unchanged, so it has no <main>; its first section is #hero
  return `<a class="cx-skip" href="${path === '/' ? '#hero' : '#main'}">Skip to content</a>
<header class="cx-nav"><div class="wrap">
  <a class="cx-brand" href="/" aria-label="Caprae Tech, home">Caprae <span>Tech</span></a>
  <nav class="cx-main" aria-label="Main"><ul class="cx-menu">${top}</ul></nav>
  <a class="btn btn-white cx-cta" href="/book-a-call/">Book a call ${arrow}</a>
  <details class="cx-mobile"><summary aria-label="Menu"><span class="cx-burger" aria-hidden="true"><i></i><i></i><i></i></span></summary><div class="cx-m-scrim" aria-hidden="true"></div><nav class="cx-m-panel" aria-label="Mobile">${mobile}<a class="btn btn-white cx-m-cta" href="/book-a-call/">Book a call ${arrow}</a></nav></details>
</div></header>`
}

// Home > What we build > MVPs. Hidden on the home page (no marker there).
export function crumbs(path) {
  const trail = []
  for (let p = path; p; p = ROUTES[p].parent) trail.unshift(p)
  return `<nav class="cx-crumbs" aria-label="Breadcrumb"><ol>${trail.map((p, i) => i === trail.length - 1
    ? `<li><span aria-current="page">${esc(ROUTES[p].label)}</span></li>`
    : `<li><a href="${p}">${esc(ROUTES[p].label)}</a></li>`).join('')}</ol></nav>`
}

// the closing band on inner pages: home's Book a call section, condensed to one action
export function bookBand() {
  return `<section class="cx-band" aria-labelledby="cx-band-h" data-stop="last"><div class="wrap"><div class="big-cta">
  <span class="eyebrow">Book a call</span>
  <h2 class="title" id="cx-band-h" style="margin-top:14px">Hand it over.<br><span class="it grad-text">We'll take it from here.</span></h2>
  <p class="lead" style="margin:18px auto 0">Thirty minutes with a founder. Four fields, then we email you to set the time.</p>
  <div class="cx-band-row"><a class="btn btn-white" href="/book-a-call/">Book a call ${arrow}</a><a class="btn btn-ghost" href="/how-it-works/">How it works</a></div>
</div></div></section>`
}

export function footer() {
  const year = new Date().getFullYear()
  const cols = FOOTER.columns.map(c => `<details class="cx-f-col" open><summary><h2>${c.title}</h2><svg class="cx-chev" width="12" height="12" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><ul>${c.links.map(l => l.external
    ? `<li><a href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a></li>`
    : `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul></details>`).join('')
  return `<footer class="cx-foot"><div class="wrap">
  <a class="cx-f-top" href="#top" aria-label="Back to top" data-tip="Back to top"><span aria-hidden="true">↑</span></a>
  <div class="cx-f-grid">
    <div class="cx-f-brand">
      <a class="cx-brand" href="/">Caprae <span>Tech</span></a>
      <div class="cx-f-parent">Part of <a href="https://capraecapital.com/" target="_blank" rel="noopener">Caprae Capital</a></div>
      <p>${FOOTER.tagline}.</p>
      <a class="cx-f-mail" href="mailto:${FOOTER.email}">${FOOTER.email}</a>
      <div class="cx-f-copy">© ${year} Caprae Tech</div>
    </div>
    ${cols}
  </div>
</div></footer>`
}
