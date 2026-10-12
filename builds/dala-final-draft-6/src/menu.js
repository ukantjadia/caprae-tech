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

  const mobile = bar.querySelector('.cx-mobile')
  mobile?.addEventListener('keydown', e => { if (e.key === 'Escape' && mobile.open) { mobile.open = false; mobile.querySelector('summary').focus() } })
  // links to a section on the same page (#book) leave the menu open otherwise
  mobile?.addEventListener('click', e => { if (e.target.closest('a')) mobile.open = false })
}
