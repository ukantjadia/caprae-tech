// Navbar behaviour. Without JS the dropdowns still open on hover and focus (chrome.css) and
// the phone menu is a <details>, so this only adds click-to-open, Escape and aria-expanded.
export function startMenu() {
  const bar = document.querySelector('.cx-nav')
  if (!bar) return
  bar.classList.add('cx-js') // hands focus-opening over to the toggles

  const items = [...bar.querySelectorAll('.cx-has-sub')]
  const toggleOf = li => li.querySelector('.cx-toggle')
  const close = (li, focus) => {
    li.classList.remove('open')
    toggleOf(li).setAttribute('aria-expanded', 'false')
    if (focus) toggleOf(li).focus()
  }

  for (const li of items) {
    toggleOf(li).addEventListener('click', () => {
      const open = !li.classList.contains('open')
      items.forEach(o => o !== li && close(o))
      li.classList.toggle('open', open)
      toggleOf(li).setAttribute('aria-expanded', String(open))
      if (open) li.querySelector('.cx-sub a')?.focus()
    })
    li.addEventListener('keydown', e => { if (e.key === 'Escape' && li.classList.contains('open')) close(li, true) })
    li.addEventListener('focusout', e => { if (!li.contains(e.relatedTarget)) close(li) })
  }
  document.addEventListener('click', e => { for (const li of items) if (!li.contains(e.target)) close(li) })

  // phone drawer: lock the page behind it, close on Escape, on a tap outside, or on a link
  const mobile = bar.querySelector('.cx-mobile')
  if (mobile) {
    const summary = mobile.querySelector(':scope > summary')
    mobile.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', String(mobile.open))
      summary.setAttribute('aria-label', mobile.open ? 'Close menu' : 'Menu')
    })
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobile.open) { mobile.open = false; summary.focus() } })
    // the page behind stays still: scroll gestures on the dimmed area are dropped, and the drawer
    // keeps its own scrolling (overscroll-behavior: contain). Locking <html> would unstick the navbar.
    const scrim = mobile.querySelector('.cx-m-scrim')
    scrim?.addEventListener('click', () => { mobile.open = false })
    for (const ev of ['wheel', 'touchmove']) scrim?.addEventListener(ev, e => e.preventDefault(), { passive: false })
    const panel = mobile.querySelector('.cx-m-panel')
    panel?.addEventListener('wheel', e => { const atTop = panel.scrollTop <= 0 && e.deltaY < 0, atEnd = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1 && e.deltaY > 0; if (atTop || atEnd) e.preventDefault() }, { passive: false })
    mobile.addEventListener('click', e => { if (e.target.closest('a')) mobile.open = false })
  }
  // footer: on phones the link columns start collapsed (they're open on desktop and without JS)
  if (matchMedia('(max-width: 760px)').matches) for (const d of document.querySelectorAll('.cx-f-col[open]')) d.open = false
}
