// Dashboards page, "Inside the CRM": tabs beside one screenshot on desktop, a swipeable row
// with the tabs as chips on a phone. The track is a native scroll-snap row either way, so
// without JS every screenshot is still there to swipe through.
export function startGallery(root) {
  const tabs = root.querySelector('.gal-tabs'), track = root.querySelector('.gal-track')
  const shots = [...root.querySelectorAll('.gal-shot')]
  if (!tabs || !track || shots.length < 2) return

  const btns = shots.map((s, i) => {
    const id = `gal-${i + 1}`
    s.id = id
    s.setAttribute('role', 'tabpanel')
    const b = document.createElement('button')
    b.type = 'button'
    b.setAttribute('role', 'tab')
    b.setAttribute('aria-controls', id)
    b.textContent = s.querySelector('figcaption b')?.textContent || `Screen ${i + 1}`
    b.addEventListener('click', () => go(i))
    tabs.append(b)
    return b
  })

  let cur = -1
  function mark(i) {
    if (i === cur) return
    cur = i
    btns.forEach((b, k) => { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1 })
    // keep the active chip in view on a phone, without moving the page
    const b = btns[i]
    if (tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: b.offsetLeft - (tabs.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' })
  }
  // slides are full width on desktop and 92% on a phone, so measure the step, not the track
  const step = () => shots[1].offsetLeft - shots[0].offsetLeft
  function go(i, instant) {
    i = (i + shots.length) % shots.length
    mark(i)
    const still = instant || matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: i * step(), behavior: still ? 'auto' : 'smooth' })
  }

  tabs.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    go(cur + d)
    btns[cur].focus()
  })
  // a swipe on the track moves the tabs with it
  let t = 0
  track.addEventListener('scroll', () => { cancelAnimationFrame(t); t = requestAnimationFrame(() => mark(Math.round(track.scrollLeft / step()))) }, { passive: true })
  // a resize or a phone turned sideways changes the slide width: stay on the same slide
  let w = track.clientWidth
  new ResizeObserver(() => { if (track.clientWidth !== w) { w = track.clientWidth; go(cur, true) } }).observe(track)

  tabs.hidden = false
  root.classList.add('is-ready')
  mark(0)
}

// Short screen recordings: muted, looping, playing only while on screen. Reduced motion
// gets the poster and the controls instead. A tap pauses or plays.
export function startAutoplay(videos) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  const io = new IntersectionObserver(es => { for (const e of es) e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause() }, { threshold: 0.5 })
  for (const v of videos) {
    v.muted = true
    if (still) { v.controls = true; continue }
    io.observe(v)
    v.addEventListener('click', () => (v.paused ? v.play() : v.pause()))
  }
}
