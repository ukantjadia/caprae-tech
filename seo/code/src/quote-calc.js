// Facility cleaning: the quote calculator demo. Placeholder rates from the copy review file, not real pricing.
const MAX_SQFT = 1000000
const usd = n => '$' + n.toLocaleString('en-US')

export function startQuoteCalc(root) { const g = id => root.querySelector('#' + id); const out = g('cOut'), sqft = g('cSqft')
  const calc = () => { const rate = +g('cType').value, sq = +sqft.value, visits = +g('cVisits').value
    // outside a real building size, say so instead of showing a meaningless (or endless) number
    const bad = !Number.isFinite(sq) || sq <= 0 || sq > MAX_SQFT
    sqft.setAttribute('aria-invalid', bad && sqft.value !== '' ? 'true' : 'false')
    out.classList.toggle('msg', bad)
    if (sqft.value === '') { out.textContent = 'Enter your square footage'; out.classList.add('msg'); return }
    if (bad) { out.textContent = sq <= 0 ? 'Enter your square footage' : `Over ${MAX_SQFT.toLocaleString('en-US')} sq ft? Book a walkthrough`; return }
    let m = sq * rate * visits * 4.33 / 10
    const up = 1 + (g('aFloor').checked ? 0.12 : 0) + (g('aSupply').checked ? 0.08 : 0)
    m = m * up + (g('aWin').checked ? 250 : 0) + (g('aPorter').checked ? 1800 : 0)
    // round to a step that suits the size, and keep the top of the range above the bottom
    const step = m < 100 ? 1 : m < 1000 ? 10 : 50
    const lo = Math.max(1, Math.round(m * 0.85 / step) * step), hi = Math.max(lo + step, Math.round(m * 1.15 / step) * step)
    out.textContent = `${usd(lo)} – ${usd(hi)} / month` }
  root.addEventListener('input', calc); root.addEventListener('change', calc); calc() }
