import { Studio } from 'sanity'
import config from '../../studio-world-cup/sanity.config'

export default function StudioPage() {
  return (
    <div className="studio-root">
      <Studio config={config} />
    </div>
  )
}
