import type { Contributor } from '../lib/types'

export function ContributorsList({ contributors }: { contributors: Contributor[] }) {
  if (contributors.length === 0) {
    return <p className="text-sm text-dim">No contributor data available.</p>
  }

  const maxContributions = contributors[0]?.contributions ?? 1

  return (
    <ul className="space-y-2.5">
      {contributors.map((c) => (
        <li key={c.login}>
          <a
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 group"
          >
            <img src={c.avatar_url} alt={c.login} className="w-7 h-7 rounded-full shrink-0" />
            <span className="text-sm text-text group-hover:text-accent transition truncate w-28 shrink-0">
              {c.login}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.max(6, (c.contributions / maxContributions) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-dim w-10 text-right shrink-0">{c.contributions}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
