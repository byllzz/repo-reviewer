import { motion } from 'framer-motion'
import { Star, GitFork, Archive, GitBranch } from 'lucide-react'
import type { UserProfile, UserRepoSummary } from '../lib/types'
import { formatCompactNumber, formatRelativeTime, languageColor } from '../lib/format'
import { useReviewStore } from '../lib/store'

export function UserReposGrid({ profile, repos }: { profile: UserProfile; repos: UserRepoSummary[] }) {
  const { openUserRepo, loading } = useReviewStore()

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <img src={profile.avatar_url} alt={profile.login} className="w-14 h-14 rounded-xl border border-border" />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold truncate">{profile.name || profile.login}</h1>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-dim hover:text-accent transition font-mono"
            >
              @{profile.login}
            </a>
          </div>
          {profile.bio && <p className="text-sm text-muted leading-relaxed">{profile.bio}</p>}
          <p className="text-xs text-dim">
            {profile.public_repos} repos · {formatCompactNumber(profile.followers)} followers
          </p>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-3">
        {repos.map((repo, i) => (
          <motion.button
            key={repo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.4) }}
            onClick={() => !loading && openUserRepo(repo.name)}
            disabled={loading}
            className="text-left bg-surface border border-border rounded-xl p-4 space-y-2 hover:border-accent/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium truncate">{repo.name}</span>
              {repo.fork && <GitBranch size={12} className="text-dim shrink-0" aria-label="Fork" />}
              {repo.archived && <Archive size={12} className="text-dim shrink-0" aria-label="Archived" />}
            </div>

            {repo.description && <p className="text-xs text-muted line-clamp-2">{repo.description}</p>}

            <div className="flex items-center gap-3 text-[11px] text-dim pt-1">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star size={11} /> {formatCompactNumber(repo.stargazers_count)}
              </span>
              <span className="flex items-center gap-1">
                <GitFork size={11} /> {formatCompactNumber(repo.forks_count)}
              </span>
              <span className="ml-auto">{formatRelativeTime(repo.updated_at)}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {repos.length === 0 && <p className="text-sm text-dim text-center py-8">No public repositories found.</p>}
    </div>
  )
}
