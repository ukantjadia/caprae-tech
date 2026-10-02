// Final drafts (D-080): the What we build pictures run only while their card is on screen
// (final.css pauses them otherwise), and the crew cards flip on tap or Enter like Founders C.
export function startFinalPage() {
  const io = new IntersectionObserver(es => { for (const e of es) e.target.classList.toggle('in', e.isIntersecting) }, { threshold: 0.25 })
  for (const el of document.querySelectorAll('.variant.on .bento .card')) io.observe(el)
  for (const c of document.querySelectorAll('.crew .flip')) {
    c.addEventListener('click', () => c.classList.toggle('on'))
    c.addEventListener('keydown', e => { if (e.key === 'Enter') c.classList.toggle('on') })
  }
}
