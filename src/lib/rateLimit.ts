import { create } from 'zustand'

interface RateLimitState {
  limit: number | null
  remaining: number | null
  resetAt: number | null // unix seconds
  update: (headers: Headers) => void
}

export const useRateLimit = create<RateLimitState>((set) => ({
  limit: null,
  remaining: null,
  resetAt: null,
  update: (headers: Headers) => {
    const limit = headers.get('x-ratelimit-limit')
    const remaining = headers.get('x-ratelimit-remaining')
    const reset = headers.get('x-ratelimit-reset')
    if (limit == null || remaining == null) return
    set({
      limit: Number(limit),
      remaining: Number(remaining),
      resetAt: reset ? Number(reset) : null,
    })
  },
}))
