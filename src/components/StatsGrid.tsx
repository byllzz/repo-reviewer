import { motion } from 'framer-motion'
import { Star, GitFork, CircleDot, GitPullRequest, Eye, Clock, type LucideIcon } from 'lucide-react'
import type { RepoReview } from '../lib/types'
import { formatCompactNumber, formatRelativeTime } from '../lib/format'

interface Stat {
  icon: LucideIcon
  label: string
  value: string
}

export function StatsGrid({ review }: { review: RepoReview }) {
  const { info, openIssuesOnly, openPRs } = review

  const stats: Stat[] = [
    { icon: Star, label: 'Stars', value: formatCompactNumber(info.stargazers_count) },
    { icon: GitFork, label: 'Forks', value: formatCompactNumber(info.forks_count) },
    { icon: CircleDot, label: 'Open issues', value: formatCompactNumber(openIssuesOnly) },
    { icon: GitPullRequest, label: 'Open PRs', value: formatCompactNumber(openPRs) },
    { icon: Eye, label: 'Watchers', value: formatCompactNumber(info.watchers_count) },
    { icon: Clock, label: 'Last push', value: formatRelativeTime(info.pushed_at) },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-surface border border-border rounded-xl p-3 space-y-1.5"
        >
          <div className="flex items-center gap-1.5 text-dim">
            <s.icon size={13} />
            <span className="text-[11px] uppercase tracking-wide">{s.label}</span>
          </div>
          <div className="text-lg font-semibold">{s.value}</div>
        </motion.div>
      ))}
    </div>
  )
}
