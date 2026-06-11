import { useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'
import { formatTime } from '../utils/formatTime'

const playerVars = {
  autoplay: 0,
  controls: 0,
  modestbranding: 1,
  rel: 0,
  iv_load_policy: 3,
  cc_load_policy: 0,
  playsinline: 1,
}

const ERROR_MESSAGES = {
  2: 'This video cannot be played in the embedded player.',
  5: 'A playback error occurred.',
  100: 'This video is unavailable or private.',
  101: 'Embedding is disabled for this video.',
  150: 'Embedding is disabled for this video.',
}

export default function YouTubePlayer({ videoId, watchUrl, onEnd }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [size, setSize] = useState({ width: 640, height: 360 })
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [playbackError, setPlaybackError] = useState(null)

  const youtubeUrl =
    watchUrl ?? `https://www.youtube.com/watch?v=${videoId}`

  useEffect(() => {
    function handleFullscreenChange() {
      const el = containerRef.current
      const active =
        document.fullscreenElement === el ||
        document.webkitFullscreenElement === el
      setFullscreen(active)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange,
      )
    }
  }, [])

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

  useEffect(() => {
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setMuted(false)
    setPlaybackError(null)
  }, [videoId])

  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      const player = playerRef.current
      if (!player) return

      player.getCurrentTime().then((time) => setCurrentTime(time))
      player.getDuration().then((total) => {
        if (total > 0) setDuration(total)
      })
    }, 250)

    return () => clearInterval(interval)
  }, [playing])

  async function handleReady(event) {
    playerRef.current = event.target
    event.target.setSize(size.width, size.height)

    const total = await event.target.getDuration()
    if (total > 0) setDuration(total)
  }

  function handleError(event) {
    const code = event?.data
    setPlaybackError(
      ERROR_MESSAGES[code] ??
        'This video cannot be played here. It may be members-only or restricted by the channel.',
    )
  }

  function handleStateChange(event) {
    const { data: state } = event
    const isActive =
      state === YouTube.PlayerState.PLAYING ||
      state === YouTube.PlayerState.BUFFERING

    setPlaying(isActive)

    if (state === YouTube.PlayerState.PLAYING) {
      event.target.getDuration().then((total) => {
        if (total > 0) setDuration(total)
      })
    }
  }

  function togglePlay() {
    const player = playerRef.current
    if (!player) return

    if (playing) player.pauseVideo()
    else player.playVideo()
  }

  function handleSeek(event) {
    const time = Number(event.target.value)
    playerRef.current?.seekTo(time, true)
    setCurrentTime(time)
  }

  async function toggleMute() {
    const player = playerRef.current
    if (!player) return

    const isMuted = await player.isMuted()
    if (isMuted) {
      player.unMute()
      setMuted(false)
    } else {
      player.mute()
      setMuted(true)
    }
  }

  function toggleFullscreen() {
    const el = containerRef.current
    if (!el) return

    const isActive =
      document.fullscreenElement === el ||
      document.webkitFullscreenElement === el

    if (isActive) {
      if (document.exitFullscreen) document.exitFullscreen()
      else document.webkitExitFullscreen?.()
    } else if (el.requestFullscreen) {
      el.requestFullscreen()
    } else {
      el.webkitRequestFullscreen?.()
    }
  }

  if (!videoId) return null

  return (
    <div className="player-wrapper" ref={containerRef}>
      <div className="player-stage">
        <YouTube
          videoId={videoId}
          opts={{
            width: size.width,
            height: size.height,
            host: 'https://www.youtube.com',
            playerVars: {
              ...playerVars,
              origin: window.location.origin,
            },
          }}
          className="player"
          iframeClassName="player-host"
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={handleError}
          onEnd={onEnd}
        />

        {playbackError && (
          <div className="player-fallback">
            <p>{playbackError}</p>
            <a
              className="player-fallback-link"
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
          </div>
        )}
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="control-btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❚❚' : '▶'}
        </button>

        <span className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <input
          type="range"
          className="seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={handleSeek}
          aria-label="Seek"
        />

        <button
          type="button"
          className="control-btn control-btn--mute"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? '⤡' : '⤢'}
        </button>

        <a
          className="control-btn control-btn--link"
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch on YouTube"
        >
          YT
        </a>
      </div>
    </div>
  )
}
