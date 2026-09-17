import { useScroll, useTransform, motion } from 'framer-motion'

/* The glacier plate, kept exactly as it was in the Glacier build: one <video>,
 * autoplay, muted, loop, playsInline, object-fit cover, fixed behind the whole
 * document rather than only behind the hero.
 *
 * White type over a moving video is unreadable for a whole page, so a scrim
 * above it deepens as the reader scrolls. The video never stops and is never
 * hidden; it just steps back. Only `opacity` animates, which runs on the
 * compositor, so the scroll stays smooth no matter what else the page is doing.
 */
export default function VideoBackground() {
  const { scrollYProgress } = useScroll()
  const scrim = useTransform(scrollYProgress, [0, 0.12, 1], [0.34, 0.74, 0.84])
  const chill = useTransform(scrollYProgress, [0, 1], [0.05, 0.16])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
      <video
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* scrim that deepens with scroll */}
      <motion.div style={{ position: 'absolute', inset: 0, background: '#04070A', opacity: scrim }} />

      {/* the same edge treatments the Glacier hero used */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,7,10,0.5) 0%, transparent 20%, transparent 62%, rgba(4,7,10,0.55) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,7,10,0.35) 0%, transparent 20%, transparent 80%, rgba(4,7,10,0.35) 100%)' }} />

      {/* the icy radial tint, carried over */}
      <motion.div
        style={{
          position: 'absolute', top: '-14%', left: '50%', x: '-50%',
          width: '1000px', height: '720px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(14,116,144,1) 0%, transparent 68%)',
          opacity: chill,
        }}
      />
    </div>
  )
}
