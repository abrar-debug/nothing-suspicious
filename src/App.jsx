import { useEffect, useState } from 'react'
import YouTubePlayer from './components/YouTubePlayer'
import VideoList from './components/VideoList'
import { useVideos } from './hooks/useVideos'
import { extractVideoId } from './utils/extractVideoId'
import './App.css'

function App() {
  const { videos, loading, error } = useVideos()
  const [selectedVideo, setSelectedVideo] = useState(null)

  const videoId = selectedVideo ? extractVideoId(selectedVideo.url) : null

  useEffect(() => {
    if (selectedVideo || loading || videos.length === 0) return
    setSelectedVideo(videos[0])
  }, [videos, loading, selectedVideo])

  return (
    <div className="app">
      <header className="header">
        <h1>World Cup Videos</h1>
      </header>

      <div className="layout">
        <main className="main">
          {videoId ? (
            <YouTubePlayer
              key={videoId}
              videoId={videoId}
              watchUrl={selectedVideo?.url}
            />
          ) : (
            <div className="player-placeholder">
              <p>
                {selectedVideo
                  ? 'Could not play this link. Check the YouTube URL in Studio.'
                  : 'Select a match to start watching.'}
              </p>
            </div>
          )}
        </main>

        <VideoList
          videos={videos}
          loading={loading}
          error={error}
          selectedId={selectedVideo?._id}
          onSelect={setSelectedVideo}
        />
      </div>
    </div>
  )
}

export default App
