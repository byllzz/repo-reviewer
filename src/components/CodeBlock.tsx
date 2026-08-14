import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import { useResolvedTheme } from '../hooks/useResolvedTheme'

const LANGS: Record<string, unknown> = {
  jsx,
  tsx,
  typescript,
  ts: typescript,
  javascript,
  js: javascript,
  json,
  bash,
  sh: bash,
  shell: bash,
  yaml,
  yml: yaml,
  markdown,
  md: markdown,
  css,
  python,
  py: python,
  go,
  rust,
  rs: rust,
  java,
  c,
  cpp,
  ruby,
  rb: ruby,
  php,
  sql,
  docker,
  dockerfile: docker,
  diff,
}

for (const [name, lang] of Object.entries(LANGS)) {
  SyntaxHighlighter.registerLanguage(name, lang as never)
}

interface Props {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ code, language, showLineNumbers = false }: Props) {
  const [copied, setCopied] = useState(false)
  const theme = useResolvedTheme()

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="group relative rounded-lg border border-border overflow-hidden bg-surface-2">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface">
        <span className="text-[11px] font-mono text-dim">{language || 'text'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[11px] text-dim hover:text-text transition opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-accent" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language && LANGS[language] ? language : 'markdown'}
        style={theme === 'light' ? oneLight : oneDark}
        showLineNumbers={showLineNumbers}
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: '0.9rem 1rem',
          background: 'transparent',
          fontSize: '0.8rem',
          lineHeight: 1.6,
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
      >
        {code.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  )
}
