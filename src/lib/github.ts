import type {
  CommitActivityWeek,
  Contributor,
  LanguageBreakdown,
  RepoInfo,
  RepoReview,
  UserProfile,
  UserRepoSummary,
} from './types'
import { useRateLimit } from './rateLimit'

const API = 'https://api.github.com'

export class GitHubApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'GitHubApiError'
  }
}

/**
 * Parses "owner/repo" or a full github.com URL into { owner, repo }.
 * Returns null if the input doesn't look like either.
 */
export function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\/$/, '')

  const urlMatch = trimmed.match(/github\.com\/([^/]+)\/([^/]+)/i)
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2].replace(/\.git$/, '') }

  const shorthandMatch = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/)
  if (shorthandMatch) return { owner: shorthandMatch[1], repo: shorthandMatch[2] }

  return null
}

/** Parses a bare username or a github.com/<owner> URL (no repo segment). */
export function parseUserInput(input: string): string | null {
  const trimmed = input.trim().replace(/\/$/, '')

  const urlMatch = trimmed.match(/^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)$/i)
  if (urlMatch) return urlMatch[1]

  if (/^@?[\w.-]+$/.test(trimmed) && !trimmed.includes('/')) {
    return trimmed.replace(/^@/, '')
  }

  return null
}

function recordRateLimit(headers: Headers) {
  useRateLimit.getState().update(headers)
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  recordRateLimit(res.headers)

  if (res.status === 404) throw new GitHubApiError('Not found. Check the name and try again.', 404)
  if (res.status === 403) {
    const reset = res.headers.get('x-ratelimit-reset')
    const resetTime = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : 'shortly'
    throw new GitHubApiError(`GitHub API rate limit hit. Resets around ${resetTime}.`, 403)
  }
  if (!res.ok) throw new GitHubApiError(`GitHub API error (${res.status})`, res.status)

  return res.json()
}

/** Some endpoints (like commit activity) return 202 while GitHub computes stats async - retry a couple times. */
async function getWithRetry<T>(path: string, attempts = 3, delayMs = 800): Promise<T | null> {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' } })
    recordRateLimit(res.headers)
    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, delayMs))
      continue
    }
    if (!res.ok) return null
    return res.json()
  }
  return null
}

async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  const res = await fetch(`${API}/repos/${owner}/${repo}/readme`, {
    headers: { Accept: 'application/vnd.github.raw+json' },
  })
  recordRateLimit(res.headers)
  if (!res.ok) return null
  return res.text()
}

async function fetchOpenPRCount(owner: string, repo: string): Promise<number> {
  const res = await fetch(
    `${API}/search/issues?q=repo:${owner}/${repo}+type:pr+state:open&per_page=1`,
    { headers: { Accept: 'application/vnd.github+json' } }
  )
  recordRateLimit(res.headers)
  if (!res.ok) return 0
  const data = await res.json()
  return data.total_count ?? 0
}

/** Fetches everything needed for a full repo review in parallel. */
export async function fetchRepoReview(owner: string, repo: string): Promise<RepoReview> {
  const info = await get<RepoInfo>(`/repos/${owner}/${repo}`)

  const [languages, contributors, commitActivity, readme, openPRs] = await Promise.all([
    get<LanguageBreakdown>(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
    get<Contributor[]>(`/repos/${owner}/${repo}/contributors?per_page=10`).catch(() => []),
    getWithRetry<CommitActivityWeek[]>(`/repos/${owner}/${repo}/stats/commit_activity`).catch(() => null),
    fetchReadme(owner, repo),
    fetchOpenPRCount(owner, repo),
  ])

  const openIssuesOnly = Math.max(0, info.open_issues_count - openPRs)

  return {
    info,
    languages,
    contributors,
    commitActivity: commitActivity ?? [],
    readme,
    openIssuesOnly,
    openPRs,
  }
}

/** Fetches a user (or org) profile and their public, non-fork-first repo list, most recently updated first. */
export async function fetchUserRepos(
  username: string
): Promise<{ profile: UserProfile; repos: UserRepoSummary[] }> {
  const [profile, repos] = await Promise.all([
    get<UserProfile>(`/users/${username}`),
    get<UserRepoSummary[]>(`/users/${username}/repos?sort=updated&per_page=100`),
  ])

  const sorted = [...repos].sort((a, b) => {
    if (a.fork !== b.fork) return a.fork ? 1 : -1
    return b.stargazers_count - a.stargazers_count
  })

  return { profile, repos: sorted }
}
