// Privacy and Terms: the "On this page" list on the left marks the section being read.
// The current section is the last one whose heading has scrolled past the line just under
// the navbar; at the very bottom of the page it is the last section.
export function startLegalToc(toc) {
  const links = [...toc.querySelectorAll('a[href^="#"]')]
  const items = links
    .map(a => ({ a, el: document.getElementById(decodeURIComponent(a.hash.slice(1))) }))
    .filter(i => i.el)
  if (!items.length) return

  let current = null
  const mark = item => {
    if (item === current) return
    if (current) { current.a.classList.remove('is-current'); current.a.removeAttribute('aria-current') }
    current = item
    item.a.classList.add('is-current')
    item.a.setAttribute('aria-current', 'location')
    // keep the marked link in view inside the list, which scrolls on its own when long
    const box = toc.getBoundingClientRect(), r = item.a.getBoundingClientRect()
    if (r.top < box.top + 40 || r.bottom > box.bottom - 40) toc.scrollTop += r.top - box.top - box.height / 3
  }

  const update = () => {
    const line = 200 // clicked headings land about 170px down (scroll-margin plus spacing)
    let pick = items[0]
    for (const i of items) {
      if (i.el.getBoundingClientRect().top - line <= 0) pick = i
      else break
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) pick = items[items.length - 1]
    mark(pick)
  }

  let queued = false
  addEventListener('scroll', () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => { queued = false; update() })
  }, { passive: true })
  addEventListener('resize', update)
  // a click marks its section straight away, before the scroll gets there
  for (const i of items) i.a.addEventListener('click', () => setTimeout(() => mark(i), 0))
  update()
}
