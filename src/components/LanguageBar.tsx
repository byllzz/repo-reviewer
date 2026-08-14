import type { LanguageBreakdown } from '../lib/types'
import { languageColor } from '../lib/format'

export function LanguageBar({ languages }: { languages: LanguageBreakdown }) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0)

  if (entries.length === 0 || total === 0) {
    return <p className="text-sm text-dim">No language data available.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex w-full h-2.5 rounded-full overflow-hidden border border-border">
        {entries.map(([lang, bytes]) => (
          <div
            key={lang}
            style={{ width: `${(bytes / total) * 100}%`, backgroundColor: languageColor(lang) }}
            title={lang}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {entries.slice(0, 8).map(([lang, bytes]) => (
          <div key={lang} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: languageColor(lang) }}
            />
            {lang}
            <span className="text-dim">{((bytes / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
