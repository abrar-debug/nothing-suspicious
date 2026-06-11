import { useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'

const playerVars = {
  autoplay: 0,
  modestbranding: 1,
  rel: 0,
}

export default function YouTubePlayer({ videoId, onReady, onEnd }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [size, setSize] = useState({ width: 640, height: 360 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateSize = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setSize({ width: Math.floor(width), height: Math.floor(height) })
      }
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    playerRef.current?.setSize(size.width, size.height)
  }, [size])

  function handleReady(event) {
    playerRef.current = event.target
    event.target.setSize(size.width, size.height)
    onReady?.(event)
  }

  if (!videoId) return null

  return (
    <div className="player-wrapper" ref={containerRef}>
      <YouTube
        videoId={videoId}
        opts={{
          width: size.width,
          height: size.height,
          playerVars,
        }}
        className="player"
        iframeClassName="player-host"
        onReady={handleReady}
        onEnd={onEnd}
      />
    </div>
  )
}
