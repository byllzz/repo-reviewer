import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Code2, Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'

type Tab = 'preview' | 'raw'

export function ReadmeTabs({ content }: { content: string | null }) {
  const [tab, setTab] = useState<Tab>('preview')
  const [copied, setCopied] = useState(false)

  if (!content) {
    return <p className="text-sm text-dim">No README found in this repository.</p>
  }

  function copyAll() {
    if (!content) return
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1">
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

        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 text-[11px] text-dim hover:text-text transition pr-1 pb-2"
        >
          {copied ? (
            <>
              <Check size={12} className="text-accent" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy README
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="markdown-body max-h-[32rem] overflow-y-auto pr-2"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isBlock = Boolean(match)
                  const text = String(children).replace(/\n$/, '')

                  if (!isBlock) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }

                  return <CodeBlock code={text} language={match![1]} />
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </motion.div>
        ) : (
          <motion.div
            key="raw"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="max-h-[32rem] overflow-y-auto"
          >
            <CodeBlock code={content} language="markdown" showLineNumbers />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
