import { useState } from 'react'
import YouTubePlayer from './components/YouTubePlayer'
import { extractVideoId } from './utils/extractVideoId'
import './App.css'

const DEFAULT_VIDEO_ID = 'dQw4w9WgXcQ'

function App() {
  const [input, setInput] = useState('')
  const [videoId, setVideoId] = useState(DEFAULT_VIDEO_ID)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const id = extractVideoId(input)

    if (!id) {
      setError('Enter a valid YouTube URL or 11-character video ID.')
      return
    }

    setError('')
    setVideoId(id)
    setInput('')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>YouTube Player</h1>
        <p>Paste a YouTube link or video ID to watch below.</p>
      </header>

      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          aria-label="YouTube URL or video ID"
        />
        <button type="submit">Play</button>
      </form>

      {error && <p className="error">{error}</p>}

      <main className="main">
        <YouTubePlayer videoId={videoId} />
      </main>
    </div>
  )
}

export default App
