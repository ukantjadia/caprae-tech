// Facility cleaning page: the quote calculator demo (sample rates, from the copy review's demo).
// A range, never a price: the real version runs on the client's own past quotes.
export function startQuoteCalc(root) {
  const g = id => root.querySelector('#' + id)
  const out = g('cOut')
  const calc = () => {
    const rate = +g('cType').value, sq = Math.max(0, +g('cSqft').value || 0), visits = +g('cVisits').value
    let m = sq * rate * visits * 4.33 / 10
    const up = 1 + (g('aFloor').checked ? 0.12 : 0) + (g('aSupply').checked ? 0.08 : 0)
    m = m * up + (g('aWin').checked ? 250 : 0) + (g('aPorter').checked ? 1800 : 0)
    const lo = Math.round(m * 0.85 / 50) * 50, hi = Math.round(m * 1.15 / 50) * 50
    out.textContent = sq ? `$${lo.toLocaleString('en-US')} – $${hi.toLocaleString('en-US')} / month` : '-'
  }
  root.addEventListener('input', calc)
  root.addEventListener('change', calc)
  calc()
}
