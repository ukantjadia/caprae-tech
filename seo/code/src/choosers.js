// What we build hub and Internal tools: the small interactive pieces. Without JS every answer
// and every "At Caprae" line simply shows, so nothing is lost.

// Hub: pointing at a seat card lights its seat on the founders' table, and the other way round.
export function startTable(root) {
  const seats = [...root.querySelectorAll('.wb-seat')], cards = [...root.querySelectorAll('.wb-card')]
  const light = i => {
    seats.forEach(s => s.classList.toggle('on', s.dataset.seat === i))
    cards.forEach(c => c.classList.toggle('on', c.dataset.seat === i))
  }
  for (const c of cards) {
    c.addEventListener('pointerenter', () => light(c.dataset.seat))
    c.addEventListener('focusin', () => light(c.dataset.seat))
  }
  root.addEventListener('pointerleave', () => light(null))
  root.addEventListener('focusout', e => { if (!root.contains(e.relatedTarget)) light(null) })
}

// Hub: pick the sentence that sounds like you, see where we'd start.
export function startAdvisor(root) {
  const btns = [...root.querySelectorAll('.wb-says button')], answers = [...root.querySelectorAll('.wb-a')]
  const hint = root.querySelector('.wb-hint')
  const show = i => {
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.i === i ? 'true' : 'false'))
    answers.forEach(a => { a.hidden = a.dataset.i !== i })
    hint.hidden = i != null
  }
  btns.forEach(b => b.addEventListener('click', () => show(b.dataset.i)))
  root.classList.add('is-ready')
  show(null)
}

// Internal tools: tick what happens at your company; each tick shows what changed at Caprae.
export function startSheetCheck(root) {
  const items = [...root.querySelectorAll('.sc-item')]
  const result = root.querySelector('.sc-result'), count = result.querySelector('.sc-count b')
  const msgs = [...result.querySelectorAll('.sc-msg')], cta = result.querySelector('.sc-cta')
  const widgets = [...result.querySelectorAll('.sc-w')]
  const update = () => {
    const n = items.filter(b => b.getAttribute('aria-pressed') === 'true').length
    count.textContent = n
    const band = n >= 3 ? '3' : n >= 1 ? '1' : '0'
    msgs.forEach(m => { m.hidden = m.dataset.n !== band })
    const off = band !== '3'
    cta.setAttribute('aria-disabled', off); if (off) cta.setAttribute('tabindex', '-1'); else cta.removeAttribute('tabindex')
    items.forEach((b, i) => widgets[i]?.classList.toggle('on', b.getAttribute('aria-pressed') === 'true'))
  }
  cta.addEventListener('click', e => { if (cta.getAttribute('aria-disabled') === 'true') e.preventDefault() })
  items.forEach(b => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true')
    update()
  }))
  result.hidden = false
  root.classList.add('is-ready')
  update()
}
