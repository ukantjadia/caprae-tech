import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function MotionSections() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.documentElement.classList.add('motion-ready')
    const stages = [...document.querySelectorAll('.route-stage')]
    const stage = stages.at(-1)
    const blocks = [...(stage?.querySelectorAll('.hero, .band, .pagehead') || []), ...document.querySelectorAll('.foot')]
    blocks.forEach((block, index) => {
      block.classList.add('motion-block')
      block.style.setProperty('--motion-order', index)
      block.querySelectorAll('.card, .person, .svc__item, .rec__item, .points li, .faq li')
        .forEach((item, itemIndex) => item.style.setProperty('--item-order', itemIndex))
    })
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview')
          observer.unobserve(entry.target)
        }
      }),
      { rootMargin: '0px 0px -12%', threshold: 0.08 },
    )
    blocks.forEach((block) => observer.observe(block))
    return () => observer.disconnect()
  }, [pathname])
  return null
}
