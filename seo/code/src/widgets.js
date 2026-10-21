// The home page's interactive pieces, for the inner pages: the feature builder (Pricing A), the
// dev shop / founder-led slider (Why C) and the Book a call form. Same behaviour as the home
// page's inline script; the markup is already in the page, so each one works as plain HTML
// first and this only adds the interaction.
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// Pricing A: tap, Enter or drag a feature between the library and your build; hours add up
export function featureBuilder(root) {
  const pool = $('[data-zone="pool"] .chiplist', root), build = $('[data-zone="build"] .chiplist', root)
  const hrs = $('[data-hours]', root), cnt = $('[data-count]', root)
  const recalc = () => {
    const ch = $$('.fchip', build)
    hrs.textContent = ch.reduce((s, c) => s + +c.dataset.h, 0)
    cnt.textContent = ch.length + ' feature' + (ch.length === 1 ? '' : 's')
    const em = $('.empty', build)
    if (ch.length && em) em.remove()
    if (!ch.length && !em) build.innerHTML = '<div class="empty">Drop features here</div>'
  }
  const move = chip => { const to = chip.parentElement === pool ? build : pool; $('.empty', to)?.remove(); to.appendChild(chip); chip.focus(); recalc() }
  let dragEl = null
  root.addEventListener('dragstart', e => { if (e.target.classList?.contains('fchip')) { dragEl = e.target; dragEl.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragEl.dataset.h) } catch {} } })
  root.addEventListener('dragend', () => { dragEl?.classList.remove('dragging'); dragEl = null; $$('.zone', root).forEach(z => z.classList.remove('over')) })
  for (const z of $$('.zone', root)) {
    z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('over') })
    z.addEventListener('dragleave', e => { if (!z.contains(e.relatedTarget)) z.classList.remove('over') })
    z.addEventListener('drop', e => { e.preventDefault(); z.classList.remove('over'); if (!dragEl) return; const list = $('.chiplist', z); if (dragEl.parentElement !== list) { $('.empty', list)?.remove(); list.appendChild(dragEl); recalc() } })
  }
  for (const l of [pool, build]) {
    l.addEventListener('click', e => { const c = e.target.closest('.fchip'); if (c) move(c) })
    l.addEventListener('keydown', e => { const c = e.target.closest('.fchip'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); move(c) } })
  }
  for (const c of $$('.fchip', root)) { c.setAttribute('role', 'button'); c.tabIndex = 0 }
  recalc()
}

// Why C: drag (or arrow keys) to move the line between the two panes
export function compareSlider(ba) {
  const after = $('.ba-after', ba), h = $('.ba-handle', ba)
  let drag = false, kp = 50
  const set = p => { p = Math.min(96, Math.max(4, p)); after.style.clipPath = `inset(0 0 0 ${p}%)`; h.style.left = p + '%'; kp = p; ba.setAttribute('aria-valuenow', Math.round(p)) }
  const at = x => { const r = ba.getBoundingClientRect(); set((x - r.left) / r.width * 100) }
  ba.addEventListener('pointerdown', e => { drag = true; ba.setPointerCapture(e.pointerId); at(e.clientX) })
  ba.addEventListener('pointermove', e => { if (drag) at(e.clientX) })
  for (const t of ['pointerup', 'pointercancel']) ba.addEventListener(t, () => { drag = false })
  Object.assign(ba, { tabIndex: 0 })
  ba.setAttribute('role', 'slider'); ba.setAttribute('aria-label', 'Compare dev shop and founder-led. Use the arrow keys.')
  ba.setAttribute('aria-valuemin', '4'); ba.setAttribute('aria-valuemax', '96'); ba.setAttribute('aria-valuenow', '50')
  ba.addEventListener('keydown', e => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault(); set(kp + (e.key === 'ArrowRight' ? 5 : -5)) })
}

// Book a call: required fields, a valid email, then POST to /api/contact (seo/code/server,
// CSV + Site-Inbound-Leads sheet + email to partners@) and the thank-you (no calendar, D-080).
// The hidden company_website box is a honeypot: people never see it, bots fill it.
const validField = inp => {
  const v = inp.value.trim()
  if (!v) return inp.hasAttribute('data-optional')
  if (inp.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  if (inp.type === 'url') return /^https?:\/\/\S+$/i.test(v)
  return true
}

async function sendContact(val) {
  const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(val) })
  const out = await res.json().catch(() => ({}))
  if (!res.ok || !out.ok) throw new Error(out.error || 'We could not send that. Please try again, or email partners@capraecapital.com.')
}

export function bookForm(f) {
  const done = f.nextElementSibling
  const btn = $('button[type=submit]', f), err = $('.form-err', f)
  f.addEventListener('submit', async e => {
    e.preventDefault()
    if (btn.disabled) return
    let ok = true
    const val = {}
    for (const inp of $$('input,textarea', f)) {
      val[inp.name] = inp.value.trim()
      const field = inp.closest('.field')
      if (!field) continue // the honeypot
      const bad = !validField(inp)
      field.classList.toggle('err', bad)
      inp.setAttribute('aria-invalid', String(bad))
      if (bad && ok) { ok = false; inp.focus() }
    }
    if (!ok) return
    const label = btn.innerHTML
    btn.disabled = true; btn.textContent = 'Sending…'
    if (err) err.textContent = ''
    try {
      await sendContact(val)
    } catch (x) {
      btn.disabled = false; btn.innerHTML = label
      if (err) err.textContent = x.message === 'Failed to fetch' ? 'We could not reach the server. Please try again, or email partners@capraecapital.com.' : x.message
      return
    }
    f.style.display = 'none'
    done.innerHTML = `<div class="done-ico" aria-hidden="true">✓</div><div style="font-family:var(--serif);font-size:32px">Thanks, ${esc(val.full_name.split(' ')[0])}.</div><p class="muted" style="margin-top:8px">We'll email you at ${esc(val.email)} to set up your 30-minute call.</p>`
    done.classList.add('show')
    done.tabIndex = -1; done.focus()
  })
  for (const inp of $$('input,textarea', f)) inp.addEventListener('input', () => { inp.closest('.field')?.classList.remove('err'); inp.removeAttribute('aria-invalid') })
}

// Work A: filter chips show one group of cards. Without JS every card shows.
export function workFilter(root) {
  const chips = $$('[data-f]', root), cards = $$('.wcard[data-g]', root)
  const pick = f => {
    chips.forEach(c => { c.classList.toggle('on', c.dataset.f === f); c.setAttribute('aria-pressed', String(c.dataset.f === f)) })
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.g !== f))
  }
  chips.forEach(c => c.addEventListener('click', () => pick(c.dataset.f)))
  $('.chips', root).hidden = false // the chips only make sense with JS
  pick('all')
}

// Founders C and the crew: cards flip on hover (CSS), on tap and on Enter
export function flipCards() {
  for (const c of $$('.flip')) {
    c.addEventListener('click', e => { if (!e.target.closest('a')) c.classList.toggle('on') })
    c.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target === c) c.classList.toggle('on') })
  }
}

// FAQ: the topic list marks the group being read
export function faqTopics(toc) {
  const links = $$('a[href^="#"]', toc), byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]))
  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); byId[e.target.id]?.classList.add('on') }
  }, { rootMargin: '-30% 0px -60% 0px' })
  for (const id in byId) { const s = document.getElementById(id); if (s) io.observe(s) }
}

export function startWidgets() {
  $$('.faq-toc').forEach(faqTopics)
  $$('[data-work-filter]').forEach(workFilter)
  flipCards()
  $$('[data-builder]').forEach(featureBuilder)
  $$('.ba').forEach(compareSlider)
  $$('form[data-form]').forEach(bookForm)
}
