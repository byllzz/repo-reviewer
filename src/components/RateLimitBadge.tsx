import { useEffect, useState } from 'react'
import { Gauge } from 'lucide-react'
import { useRateLimit } from '../lib/rateLimit'

export function RateLimitBadge() {
  const { limit, remaining, resetAt } = useRateLimit()
  const [, forceTick] = useState(0)

  // Re-render every 30s so the "resets in Xm" text stays fresh.
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  if (limit == null || remaining == null) return null

  const ratio = remaining / limit
  const color = ratio < 0.15 ? 'text-red-400' : ratio < 0.4 ? 'text-amber-400' : 'text-dim'

  const resetLabel = (() => {
    if (!resetAt) return null
    const minutes = Math.max(0, Math.round((resetAt * 1000 - Date.now()) / 60000))
    if (minutes <= 0) return 'resets shortly'
    if (minutes < 60) return `resets in ${minutes}m`
    return `resets ${new Date(resetAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  })()

  return (
    <div
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border ${color}`}
      title={resetLabel ? `GitHub API rate limit - ${resetLabel}` : 'GitHub API rate limit'}
    >
      <Gauge size={13} />
      <span className="font-mono">
        {remaining}/{limit}
      </span>
      {resetLabel && <span className="hidden sm:inline text-dim">· {resetLabel}</span>}
    </div>
  )
}
