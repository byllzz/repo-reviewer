import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function ReadmePreview({ content }: { content: string | null }) {
  if (!content) {
    return <p className="text-sm text-dim">No README found in this repository.</p>
  }

  return (
    <div className="markdown-body max-h-[32rem] overflow-y-auto pr-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
