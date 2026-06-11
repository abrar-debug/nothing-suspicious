export function extractVideoId(input) {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com'
    ) {
      const id = url.searchParams.get('v')
      if (id) return id

      const embedMatch = url.pathname.match(/^\/embed\/([\w-]{11})/)
      if (embedMatch) return embedMatch[1]
      const shortsMatch = url.pathname.match(/^\/shorts\/([\w-]{11})/)
      if (shortsMatch) return shortsMatch[1]
    }
  } catch {
    return null
  }

  return null
}
