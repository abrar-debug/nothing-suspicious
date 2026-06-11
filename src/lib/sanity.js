import { createClient } from '@sanity/client'

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID ?? 'q8cyjarg'
export const dataset = import.meta.env.VITE_SANITY_DATASET ?? 'production'
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? '2024-01-01'

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const videosQuery = `*[_type == "video"] | order(_createdAt desc) {
  _id,
  title,
  url
}`
