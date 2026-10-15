import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import './HeroMedia.css'

/* The hero plate, shared by every route so the whole site sits on one piece of
 * footage rather than the home page having a look the other pages do not.
 *
 * `short` trims the height for the interior pages: the home hero owns a full
 * screen, the others carry a band deep enough to hold a title and a lede.
 *
 * `ready` starts false and is flipped by onCanPlay. The reduced-motion branch
 * pauses the video and forces ready immediately, so those viewers are never
 * left looking at a transparent <video>.
 */
export default function HeroMedia({ short = false }) {
  const hostRef = useRef(null)
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: hostRef, offset: ['start start', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.35 })
  const videoY = useTransform(smooth, [0, 1], ['0%', reduced ? '0%' : '6%'])
  const scrimOpacity = useTransform(smooth, [0, 1], [reduced ? 1 : 0.82, 1])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Some browsers block autoplay until the element is explicitly nudged.
    const play = video.play()
    if (play?.catch) play.catch(() => {})

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      setReady(true)
    }
  }, [])

  return (
    <div ref={hostRef} className={`heromedia ${short ? 'is-short' : ''}`} aria-hidden="true">
      <motion.video
        ref={videoRef}
        className={`heromedia__video ${ready ? 'is-ready' : ''}`}
        style={{ y: videoY }}
        initial={false}
        animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 1.035 }}
        transition={{ duration: reduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
        src={`${import.meta.env.BASE_URL}hero-loop.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
      />
      <motion.div className="heromedia__scrim" style={{ opacity: scrimOpacity }} />
    </div>
  )
}
