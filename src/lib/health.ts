import type { RepoReview } from './types'

export interface HealthFactor {
  label: string
  score: number // 0-100
  detail: string
}

export interface HealthResult {
  overall: number // 0-100
  factors: HealthFactor[]
}

function daysSince(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
}

/**
 * A transparent, explainable heuristic — not a claim of objective "quality".
 * Each factor is visible in the UI so the score never feels like a black box.
 */
export function computeHealth(review: RepoReview): HealthResult {
  const { info, contributors, readme, commitActivity } = review

  const recencyDays = daysSince(info.pushed_at)
  const recencyScore = recencyDays < 30 ? 100 : recencyDays < 90 ? 75 : recencyDays < 365 ? 40 : 10

  const recentCommits = commitActivity.slice(-12).reduce((sum, w) => sum + w.total, 0)
  const activityScore = recentCommits === 0 ? 15 : recentCommits < 5 ? 40 : recentCommits < 20 ? 70 : 100

  const contributorScore =
    contributors.length === 0 ? 10 : contributors.length === 1 ? 35 : contributors.length < 5 ? 65 : 100

  const docsScore = !readme ? 10 : readme.length < 300 ? 45 : readme.length < 1500 ? 75 : 100

  const licenseScore = info.license ? 100 : 30

  const issueRatio = info.stargazers_count > 0 ? review.openIssuesOnly / Math.max(info.stargazers_count, 1) : 0
  const maintenanceScore = info.archived ? 5 : issueRatio > 0.5 ? 40 : issueRatio > 0.2 ? 70 : 100

  const factors: HealthFactor[] = [
    {
      label: 'Recent activity',
      score: recencyScore,
      detail: `Last pushed ${Math.round(recencyDays)} day${Math.round(recencyDays) === 1 ? '' : 's'} ago`,
    },
    {
      label: 'Commit momentum',
      score: activityScore,
      detail: `${recentCommits} commits in the last 12 weeks`,
    },
    {
      label: 'Contributor base',
      score: contributorScore,
      detail: `${contributors.length}${contributors.length === 10 ? '+' : ''} contributor${contributors.length === 1 ? '' : 's'} (top 10 shown)`,
    },
    {
      label: 'Documentation',
      score: docsScore,
      detail: readme ? `README present, ~${readme.length.toLocaleString()} characters` : 'No README found',
    },
    {
      label: 'License',
      score: licenseScore,
      detail: info.license ? info.license.name : 'No license file detected',
    },
    {
      label: 'Issue backlog',
      score: maintenanceScore,
      detail: info.archived
        ? 'Repository is archived'
        : `${review.openIssuesOnly} open issue${review.openIssuesOnly === 1 ? '' : 's'}`,
    },
  ]

  const overall = Math.round(factors.reduce((sum, f) => sum + f.score, 0) / factors.length)

  return { overall, factors }
}
