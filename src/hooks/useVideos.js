import { useCallback, useEffect, useState } from 'react'
import { readClient, videosQuery } from '../lib/sanity'

export function useVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const data = await readClient.fetch(videosQuery)
      setVideos(data)
      setError(null)
    } catch (err) {
      setError(err.message ?? 'Failed to load videos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return { videos, loading, error, refresh: fetchVideos }
}
