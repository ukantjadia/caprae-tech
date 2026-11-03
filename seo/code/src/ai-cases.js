// AI assistants page. The case studies are a bento grid on desktop (tap a tile for its story)
// and a one-at-a-time carousel under 720px (arrows, named chips, swipe, no auto-advance).
// The track is a native scroll-snap row, so without JS every case still shows.
export function startCases(root) {
  const tiles = [...root.querySelectorAll('.t')]
  const track = root.querySelector('.ai-bento'), nav = root.querySelector('.cases-nav')
  const thumbs = root.querySelector('.cases-chips'), bar = root.querySelector('.cases-prog i')
  if (!tiles.length || !nav) return

  // desktop: the button (or a tap anywhere on the tile but a link) opens the story
  for (const t of tiles) {
    const b = t.querySelector('.t-more')
    if (!b) continue
    b.hidden = false
    const toggle = () => { const open = t.classList.toggle('open'); b.setAttribute('aria-expanded', open ? 'true' : 'false') }
    b.addEventListener('click', e => { e.stopPropagation(); toggle() })
    t.addEventListener('click', e => { if (!e.target.closest('a') && !isCar()) toggle() })
  }

  // phone: the carousel
  const mq = matchMedia('(max-width: 720px)')
  const isCar = () => mq.matches
  const chips = tiles.map((t, i) => {
    const c = document.createElement('button')
    c.type = 'button'
    c.textContent = t.dataset.name
    c.addEventListener('click', () => go(i))
    thumbs.append(c)
    return c
  })
  const step = () => tiles[1].offsetLeft - tiles[0].offsetLeft
  let cur = -1
  function mark(i) {
    if (i === cur) return
    cur = i
    chips.forEach((c, k) => c.setAttribute('aria-current', k === i ? 'true' : 'false'))
    tiles.forEach((t, k) => t.setAttribute('aria-label', `Case ${k + 1} of ${tiles.length}`))
    bar.style.width = ((i + 1) / tiles.length * 100) + '%'
    const c = chips[i]
    if (thumbs.scrollWidth > thumbs.clientWidth) thumbs.scrollTo({ left: c.offsetLeft - (thumbs.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' })
  }
  function go(i, instant) {
    i = (i + tiles.length) % tiles.length
    mark(i)
    const still = instant || matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: i * step(), behavior: still ? 'auto' : 'smooth' })
  }
  for (const b of nav.querySelectorAll('[data-dir]')) b.addEventListener('click', () => go(cur + Number(b.dataset.dir)))
  root.addEventListener('keydown', e => {
    if (!isCar() || e.target.closest('a')) return
    if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault() }
    if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault() }
  })
  let raf = 0
  track.addEventListener('scroll', () => { if (!isCar()) return; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => mark(Math.round(track.scrollLeft / step()))) }, { passive: true })
  let w = track.clientWidth
  new ResizeObserver(() => { if (track.clientWidth !== w) { w = track.clientWidth; if (isCar()) go(Math.max(cur, 0), true) } }).observe(track)

  nav.hidden = false
  root.classList.add('is-ready')
  mark(0)
}

// Gentle reveals, once: the grid fades up, the loop lights step by step, the bars grow.
export function startReveals(els) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
  }, { threshold: 0.3 })
  for (const el of els) {
    // already on screen when the script runs: show it as it is, no animation
    const r = el.getBoundingClientRect()
    if (r.top < innerHeight && r.bottom > 0) continue
    el.classList.add('rv')
    io.observe(el)
  }
}
