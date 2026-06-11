import { extractVideoId } from '../utils/extractVideoId'

export default function VideoList({
  videos,
  loading,
  error,
  activeVideoId,
  onSelect,
}) {
  return (
    <section className="panel library">
      <div className="panel-header">
        <h2>Matches</h2>
      </div>

      {loading && <p className="muted">Loading videos…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && videos.length === 0 && (
        <p className="muted">No videos yet. Add some in Sanity Studio.</p>
      )}

      {!loading && videos.length > 0 && (
        <ul className="video-list">
          {videos.map((video) => {
            const videoId = extractVideoId(video.url)
            const isActive = videoId && videoId === activeVideoId

            return (
              <li key={video._id}>
                <button
                  type="button"
                  className={`video-list-item${isActive ? ' video-list-item--active' : ''}`}
                  onClick={() => videoId && onSelect(videoId)}
                  disabled={!videoId}
                >
                  {video.title}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
