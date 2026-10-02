// Final drafts 2 and 3 (D-080): the What we build pictures run only while their card is on
// screen (final.css pauses them otherwise).
export function startFinalPage() {
  const io = new IntersectionObserver(es => { for (const e of es) e.target.classList.toggle('in', e.isIntersecting) }, { threshold: 0.25 })
  for (const el of document.querySelectorAll('.variant.on .bento .card')) io.observe(el)
}
