import { useEffect, useState } from 'react'
import YouTubePlayer from './components/YouTubePlayer'
import VideoList from './components/VideoList'
import { useVideos } from './hooks/useVideos'
import { extractVideoId } from './utils/extractVideoId'
import './App.css'

function App() {
  const { videos, loading, error } = useVideos()
  const [videoId, setVideoId] = useState(null)

  useEffect(() => {
    if (videoId || loading || videos.length === 0) return

    const firstId = extractVideoId(videos[0].url)
    if (firstId) setVideoId(firstId)
  }, [videos, loading, videoId])

  return (
    <div className="app">
      <header className="header">
        <h1>World Cup Videos</h1>
        <p>Select a video below to watch.</p>
      </header>

      <main className="main">
        {videoId ? (
          <YouTubePlayer videoId={videoId} />
        ) : (
          <div className="player-placeholder">
            <p>Select a video to start watching.</p>
          </div>
        )}
      </main>

      <VideoList
        videos={videos}
        loading={loading}
        error={error}
        activeVideoId={videoId}
        onSelect={setVideoId}
      />
    </div>
  )
}

export default App
