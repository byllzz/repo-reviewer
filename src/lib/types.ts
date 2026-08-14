export interface RepoInfo {
  id: number
  full_name: string
  name: string
  owner: { login: string; avatar_url: string; html_url: string }
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  watchers_count: number
  subscribers_count?: number
  default_branch: string
  license: { name: string; spdx_id: string } | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  archived: boolean
  disabled: boolean
  language: string | null
}

export interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export type LanguageBreakdown = Record<string, number>

export interface CommitActivityWeek {
  /** Unix timestamp for the start of the week */
  week: number
  /** total commits that week */
  total: number
  /** commits per day, Sunday first */
  days: number[]
}

export interface RepoReview {
  info: RepoInfo
  languages: LanguageBreakdown
  contributors: Contributor[]
  commitActivity: CommitActivityWeek[]
  readme: string | null
  openIssuesOnly: number
  openPRs: number
}
