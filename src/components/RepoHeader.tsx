import { motion } from 'framer-motion'
import { ExternalLink, Archive } from 'lucide-react'
import type { RepoInfo } from '../lib/types'

export function RepoHeader({ info }: { info: RepoInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <img
        src={info.owner.avatar_url}
        alt={info.owner.login}
        className="w-14 h-14 rounded-xl border border-border shrink-0"
      />

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-semibold truncate">{info.full_name}</h1>
          {info.archived && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface-2 text-dim border border-border">
              <Archive size={10} /> Archived
            </span>
          )}
          <a
            href={info.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-dim hover:text-accent transition"
            aria-label="Open on GitHub"
          >
            <ExternalLink size={15} />
          </a>
        </div>

        {info.description && <p className="text-sm text-muted leading-relaxed">{info.description}</p>}

        {info.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {info.topics.slice(0, 8).map((topic) => (
              <span
                key={topic}
                className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
