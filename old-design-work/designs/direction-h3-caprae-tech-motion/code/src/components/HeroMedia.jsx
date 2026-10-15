import { useEffect, useRef, useState } from 'react'
import './HeroMedia.css'

/* The hero plate, shared by every route so the whole site sits on one piece of
 * footage rather than the home page having a look the other pages do not.
 *
 * `short` trims the height for the interior pages: the home hero owns a full
 * screen, the others carry a band deep enough to hold a title and a lede.
 *
 * `ready` is flipped on loadeddata rather than set optimistically, and the
 * reduced-motion pause waits for that same event. H paused on the effect's
 * first run, which could freeze the element before a frame existed to freeze
 * on. H shows the frame in practice, so this is a narrowing of a race rather
 * than a fix for an observed break, and it matches what Footer already did
 * with onCanPlay.
 */
export default function HeroMedia({ short = false }) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onLoaded = () => {
      // freeze on a real frame, not on the black one before the first decode
      if (reduce) video.pause()
      setReady(true)
    }
    video.addEventListener('loadeddata', onLoaded)
    if (video.readyState >= 2) onLoaded()

    // Some browsers block autoplay until the element is explicitly nudged.
    // Reduced-motion viewers still need this: it is what pulls the first frame.
    const play = video.play()
    if (play?.catch) play.catch(() => {})

    return () => video.removeEventListener('loadeddata', onLoaded)
  }, [])

  return (
    <div className={`heromedia ${short ? 'is-short' : ''}`} aria-hidden="true">
      {/* The frame exists only to carry the scroll parallax. The video's own
          transform is already spoken for by the settle-in on is-ready, and an
          animation would win over that transition and clobber it. */}
      <div className="heromedia__frame">
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
      </div>
      <div className="heromedia__scrim" />
    </div>
  )
}
