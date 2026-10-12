// D-066: close the Lab's accessibility gaps without changing its look. Runs after the Lab
// script has built the page. The drag-compare keyboard fix and the Hero B timer live in
// port-lab.js, because they need to patch the Lab's own closures.
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

// keep an attribute in sync with a class the Lab toggles
function mirror(els, attr, isOn) {
  const sync = () => els.forEach(el => el.setAttribute(attr, String(isOn(el))))
  sync()
  els.forEach(el => new MutationObserver(sync).observe(el.closest('.acc-item') ?? el, { attributes: true, attributeFilter: ['class'] }))
}

export function applyA11yFixes() {
  // accordions (How C, FAQ A): the button reports whether its panel is open
  mirror($$('.acc-item > button'), 'aria-expanded', b => b.parentElement.classList.contains('open'))

  // pricing checklist (Pricing B): each item is a checkbox
  $$('.chk-item').forEach(c => { c.setAttribute('role', 'checkbox'); if (!c.hasAttribute('tabindex')) c.tabIndex = 0 })
  mirror($$('.chk-item'), 'aria-checked', c => c.classList.contains('on'))

  // industry tabs (Services B) and the hero switch (Hero B): tab semantics
  for (const [list, buttons] of [['#indTabs', '#indTabs button'], ['.switch', '.switch button']]) {
    const l = document.querySelector(list)
    if (!l) continue
    l.setAttribute('role', 'tablist')
    const bs = $$(buttons)
    bs.forEach(b => b.setAttribute('role', 'tab'))
    mirror(bs, 'aria-selected', b => b.classList.contains('on'))
  }

  // work filter chips (Work A): toggle buttons
  mirror($$('#workChips button'), 'aria-pressed', b => b.classList.contains('on'))

  // mobile menu: the Lab hides the nav links under 860px with no way to reach them
  const nav = document.querySelector('.site-nav .wrap'), links = document.querySelector('.site-nav .nav-links')
  if (nav && links) {
    links.id = 'navLinks'
    const btn = document.createElement('button')
    btn.className = 'nav-menu'
    btn.type = 'button'
    btn.textContent = 'Menu'
    btn.setAttribute('aria-controls', 'navLinks')
    btn.setAttribute('aria-expanded', 'false')
    btn.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open')
      btn.setAttribute('aria-expanded', String(open))
    })
    links.addEventListener('click', e => { if (e.target.closest('a')) { document.body.classList.remove('nav-open'); btn.setAttribute('aria-expanded', 'false') } })
    nav.insertBefore(btn, links.nextSibling)
  }
}
