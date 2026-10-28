// MVP page, "What we leave out of v1": the case-study carousel beside the five rules.
// Without JS every case shows, stacked. With it, one case at a time: arrows, dots, arrow
// keys and swipe, no auto-advance. The rules a case uses light up on the left.
export function startV1Carousel(root) {
  const slides = [...root.querySelectorAll('.cs-slide')]
  const nav = root.querySelector('.cs-nav')
  const dotsBox = root.querySelector('.cs-dots')
  const rules = [...(root.closest('[data-v1]')?.querySelectorAll('.v1-rules li') || [])]
  if (slides.length < 2 || !nav) return

  const dots = slides.map((_, i) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'cs-dot'
    b.setAttribute('aria-label', `Case study ${i + 1} of ${slides.length}`)
    b.addEventListener('click', () => go(i))
    dotsBox.append(b)
    return b
  })

  let cur = 0
  function go(i) {
    cur = (i + slides.length) % slides.length
    slides.forEach((s, k) => {
      const on = k === cur
      s.classList.toggle('is-on', on)
      s.toggleAttribute('inert', !on)
      s.setAttribute('aria-hidden', on ? 'false' : 'true')
    })
    dots.forEach((d, k) => d.setAttribute('aria-current', k === cur ? 'true' : 'false'))
    const used = (slides[cur].dataset.rules || '').split(',')
    rules.forEach(li => li.classList.toggle('is-used', used.includes(li.dataset.rule)))
  }

  for (const b of nav.querySelectorAll('[data-dir]')) b.addEventListener('click', () => go(cur + Number(b.dataset.dir)))
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault() }
    if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault() }
  })

  // swipe: a mostly-horizontal drag of 40px or more
  let x0 = null, y0 = 0
  const track = root.querySelector('.cs-track')
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { x0 = e.clientX; y0 = e.clientY } })
  track.addEventListener('pointerup', e => {
    if (x0 === null) return
    const dx = e.clientX - x0, dy = e.clientY - y0
    x0 = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1))
  })
  track.addEventListener('pointercancel', () => { x0 = null })

  nav.hidden = false
  root.classList.add('is-ready')
  go(0)
}
