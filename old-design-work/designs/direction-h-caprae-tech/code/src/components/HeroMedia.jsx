import { useEffect, useRef, useState } from 'react'
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
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

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
    <div className={`heromedia ${short ? 'is-short' : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        className={`heromedia__video ${ready ? 'is-ready' : ''}`}
        src={`${import.meta.env.BASE_URL}hero-loop.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="heromedia__scrim" />
    </div>
  )
}
