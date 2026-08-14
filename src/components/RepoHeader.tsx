import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Archive, Link2, Check, Download } from 'lucide-react'
import type { RepoInfo, RepoReview } from '../lib/types'
import { useReviewStore } from '../lib/store'
import { computeHealth } from '../lib/health'
import { buildMarkdownReport, downloadMarkdown } from '../lib/export'

export function RepoHeader({ info }: { info: RepoInfo }) {
  const { review } = useReviewStore()
  const [copied, setCopied] = useState(false)

  function copyShareLink() {
    const url = new URL(window.location.href)
    url.searchParams.set('repo', info.full_name)
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function exportReport() {
    if (!review) return
    const health = computeHealth(review as RepoReview)
    const md = buildMarkdownReport(review as RepoReview, health)
    downloadMarkdown(`${info.name}-review.md`, md)
  }

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

      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
        <button
          onClick={copyShareLink}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-text hover:border-accent/50 transition"
        >
          {copied ? <Check size={13} className="text-accent" /> : <Link2 size={13} />}
          {copied ? 'Copied' : 'Share'}
        </button>
        <button
          onClick={exportReport}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-text hover:border-accent/50 transition"
        >
          <Download size={13} />
          Export
        </button>
      </div>
    </motion.div>
  )
}
