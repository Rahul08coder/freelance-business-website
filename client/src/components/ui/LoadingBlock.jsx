import { Loader2 } from 'lucide-react'

function LoadingBlock({ label = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center gap-3 py-10 text-sm text-muted">
      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}

export default LoadingBlock