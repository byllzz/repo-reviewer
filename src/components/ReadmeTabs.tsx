import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Code2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Tab = 'preview' | 'raw'

export function ReadmeTabs({ content }: { content: string | null }) {
  const [tab, setTab] = useState<Tab>('preview')

  if (!content) {
    return <p className="text-sm text-dim">No README found in this repository.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 border-b border-border">
        {(
          [
            { id: 'preview' as const, label: 'Preview', icon: Eye },
            { id: 'raw' as const, label: 'Raw', icon: Code2 },
          ]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs transition ${
              tab === t.id ? 'text-text' : 'text-dim hover:text-muted'
            }`}
          >
            <t.icon size={13} />
            {t.label}
            {tab === t.id && (
              <motion.div
                layoutId="readme-tab-indicator"
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {tab === 'preview' ? (
        <div className="markdown-body max-h-[32rem] overflow-y-auto pr-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : (
        <pre className="max-h-[32rem] overflow-auto text-xs font-mono leading-relaxed bg-surface-2 rounded-lg p-4 whitespace-pre-wrap text-muted">
          {content}
        </pre>
      )}
    </div>
  )
}
