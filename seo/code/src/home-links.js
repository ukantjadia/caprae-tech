// Home page: turn the visible cards into links to their pages, and give the sections that have a
// page of their own a "more" link. Runs after the home page's own script has drawn its cards.
const base = document.querySelector('.cx-brand')?.getAttribute('href') || '/'
const url = p => base + p.replace(/^\//, '')
const slug = s => s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const arr = '<span class="arr" aria-hidden="true">→</span>'

const SERVICES = { 'MVPs': 'mvp-development', 'Dashboards': 'business-dashboards', 'Deal & financial tools': 'deal-financial-tools', 'AI assistants': 'ai-assistants', 'Internal team tools': 'internal-tools', 'Internal tools': 'internal-tools' }
const PEOPLE = { 'Siddhant Pahuja': 'build-team/siddhant-pahuja', 'Ukant Jadia': 'build-team/ukant', 'Hiten Mehta': 'build-team/hiten', 'Dejan Azul Ultamar': 'build-team/dejan' }
const on = sec => document.querySelector(`#${sec} .variant.on`)

// a whole card as one link (the anchor's ::after covers the card; see page.css .card-link)
function cardLink(card, href, label) {
  if (!card || card.querySelector('.card-link')) return
  const a = document.createElement('a')
  a.className = 'card-link home-link'; a.href = href; a.setAttribute('aria-label', label)
  card.classList.add('is-link'); card.appendChild(a)
}

// What we build: each box opens its service page
for (const card of on('services')?.querySelectorAll('.bento .card') || []) {
  const name = card.querySelector('h3')?.textContent.trim()
  if (SERVICES[name]) cardLink(card, url(`/what-we-build/${SERVICES[name]}/`), name)
}

// Proof: each project opens its case page (its own site link stays clickable on top)
for (const card of on('work')?.querySelectorAll('.wcard') || []) {
  const name = card.querySelector('h3')?.textContent.trim()
  if (name) cardLink(card, url(`/work/${slug(name)}/`), `${name} case study`)
}

// People: founders and the build team open their profiles. With a mouse, hover flips the card
// and a click opens the profile; on touch, the first tap flips it and a second tap opens it.
// Nothing is added to the card's back, so its layout stays as designed.
const touch = matchMedia('(hover: none)').matches
function personLink(card, href) {
  card.classList.add('is-link')
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return
    if (!touch || card.dataset.flipped) { location.href = href; return }
    card.dataset.flipped = '1' // the page's own handler flips it on this first tap
  }, true)
  card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target === card) location.href = href })
}
for (const card of on('founders')?.querySelectorAll('.flip') || []) {
  const name = card.querySelector('.flip-f h3')?.textContent.trim()
  if (name) personLink(card, url(`/founders/${slug(name)}/`))
}
for (const card of on('team')?.querySelectorAll('.flip') || []) {
  const name = card.querySelector('.flip-f h3')?.textContent.trim()
  if (PEOPLE[name]) personLink(card, url(`/${PEOPLE[name]}/`))
}

// sections with a page of their own: a quiet link in the heading row
const MORE = [['why', '/why-founder-led/', 'Why founder-led'], ['services', '/what-we-build/', 'All of what we build'], ['work', '/work/', 'All work'],
  ['how', '/how-it-works/', 'How it works'], ['pricing', '/pricing/', 'How pricing works'], ['founders', '/founders/', 'All founders'],
  ['team', '/build-team/', 'The build team'], ['faq', '/faq/', 'All questions']]
for (const [sec, href, label] of MORE) {
  const v = on(sec); if (!v || v.querySelector('.home-more')) continue
  const head = v.querySelector('.sec-head') || v.querySelector('.stick') || v.querySelector('[style*="text-align:center"]')
  if (!head) continue
  head.insertAdjacentHTML('beforeend', `<a class="go home-more" href="${url(href)}">${label} ${arr}</a>`)
}
