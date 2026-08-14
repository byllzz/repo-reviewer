import { create } from 'zustand'
import type { RepoReview } from './types'
import { fetchRepoReview, parseRepoInput, GitHubApiError } from './github'

interface RecentEntry {
  owner: string
  repo: string
  avatarUrl: string
}

interface ReviewState {
  review: RepoReview | null
  loading: boolean
  error: string | null
  recents: RecentEntry[]
  search: (input: string) => Promise<void>
  reset: () => void
}

const RECENTS_KEY = 'repo-reviewer:recents'
const MAX_RECENTS = 6

function loadRecents(): RecentEntry[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecents(recents: RecentEntry[]) {
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents))
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  review: null,
  loading: false,
  error: null,
  recents: loadRecents(),

  search: async (input: string) => {
    const parsed = parseRepoInput(input)
    if (!parsed) {
      set({ error: 'Enter a repo as "owner/name" or a github.com URL.', review: null })
      return
    }

    set({ loading: true, error: null })

    try {
      const review = await fetchRepoReview(parsed.owner, parsed.repo)
      set({ review, loading: false })

      const entry: RecentEntry = {
        owner: review.info.owner.login,
        repo: review.info.name,
        avatarUrl: review.info.owner.avatar_url,
      }
      const next = [
        entry,
        ...get().recents.filter((r) => `${r.owner}/${r.repo}`.toLowerCase() !== `${entry.owner}/${entry.repo}`.toLowerCase()),
      ].slice(0, MAX_RECENTS)
      saveRecents(next)
      set({ recents: next })
    } catch (err) {
      const message = err instanceof GitHubApiError ? err.message : 'Something went wrong fetching that repo.'
      set({ loading: false, error: message, review: null })
    }
  },

  reset: () => set({ review: null, error: null }),
}))
