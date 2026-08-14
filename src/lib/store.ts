import { create } from 'zustand'
import type { RepoReview, UserProfile, UserRepoSummary } from './types'
import { fetchRepoReview, fetchUserRepos, parseRepoInput, parseUserInput, GitHubApiError } from './github'

interface RecentEntry {
  owner: string
  repo: string
  avatarUrl: string
}

type Mode = 'repo' | 'user'

interface ReviewState {
  mode: Mode
  review: RepoReview | null
  userProfile: UserProfile | null
  userRepos: UserRepoSummary[] | null
  loading: boolean
  error: string | null
  recents: RecentEntry[]
  search: (input: string) => Promise<void>
  openUserRepo: (repoName: string) => Promise<void>
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

function setRepoQueryParam(value: string) {
  const url = new URL(window.location.href)
  url.searchParams.delete('user')
  url.searchParams.set('repo', value)
  window.history.replaceState({}, '', url)
}

function setUserQueryParam(value: string) {
  const url = new URL(window.location.href)
  url.searchParams.delete('repo')
  url.searchParams.set('user', value)
  window.history.replaceState({}, '', url)
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  mode: 'repo',
  review: null,
  userProfile: null,
  userRepos: null,
  loading: false,
  error: null,
  recents: loadRecents(),

  search: async (input: string) => {
    const parsedRepo = parseRepoInput(input)

    if (parsedRepo) {
      set({ loading: true, error: null, mode: 'repo', userProfile: null, userRepos: null })
      try {
        const review = await fetchRepoReview(parsedRepo.owner, parsedRepo.repo)
        set({ review, loading: false })
        setRepoQueryParam(`${review.info.owner.login}/${review.info.name}`)

        const entry: RecentEntry = {
          owner: review.info.owner.login,
          repo: review.info.name,
          avatarUrl: review.info.owner.avatar_url,
        }
        const next = [
          entry,
          ...get().recents.filter(
            (r) => `${r.owner}/${r.repo}`.toLowerCase() !== `${entry.owner}/${entry.repo}`.toLowerCase()
          ),
        ].slice(0, MAX_RECENTS)
        saveRecents(next)
        set({ recents: next })
      } catch (err) {
        const message = err instanceof GitHubApiError ? err.message : 'Something went wrong fetching that repo.'
        set({ loading: false, error: message, review: null })
      }
      return
    }

    const username = parseUserInput(input)
    if (username) {
      set({ loading: true, error: null, mode: 'user', review: null })
      try {
        const { profile, repos } = await fetchUserRepos(username)
        set({ userProfile: profile, userRepos: repos, loading: false })
        setUserQueryParam(profile.login)
      } catch (err) {
        const message = err instanceof GitHubApiError ? err.message : 'Something went wrong fetching that user.'
        set({ loading: false, error: message, userProfile: null, userRepos: null })
      }
      return
    }

    set({ error: 'Enter "owner/repo", a github.com URL, or just a username.', review: null })
  },

  /** Drill from the user-repos grid into a single repo's full review. */
  openUserRepo: async (repoName: string) => {
    const owner = get().userProfile?.login
    if (!owner) return
    await get().search(`${owner}/${repoName}`)
  },

  reset: () => set({ review: null, userProfile: null, userRepos: null, error: null }),
}))
