import { useState } from 'react'
import { Search, Github, ArrowRight, Loader2 } from 'lucide-react'
import { useReviewStore } from '../lib/store'

const EXAMPLES = ['facebook/react', 'vuejs/core', 'sveltejs/svelte', 'vitejs/vite']

export function SearchBar() {
  const [value, setValue] = useState('')
  const { search, loading, recents } = useReviewStore()

  function submit(input: string) {
    if (!input.trim() || loading) return
    search(input)
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(value)
        }}
        className={`flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 shadow-sm transition ${
          loading ? 'opacity-70' : 'focus-within:border-accent/50'
        }`}
      >
        {loading ? (
          <Loader2 size={18} className="text-accent shrink-0 animate-spin" />
        ) : (
          <Github size={18} className="text-dim shrink-0" />
        )}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          placeholder={loading ? 'Fetching repo data…' : 'owner/repo or a github.com URL'}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-dim disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-strong transition"
        >
          {loading ? 'Loading…' : 'Review'}
          {!loading && <ArrowRight size={13} />}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-dim flex items-center gap-1">
          <Search size={12} /> Try:
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            disabled={loading}
            onClick={() => {
              setValue(ex)
              submit(ex)
            }}
            className="px-2.5 py-1 rounded-full border border-border text-muted hover:text-text hover:border-accent/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {ex}
          </button>
        ))}
      </div>

      {recents.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
          <span className="text-dim">Recent:</span>
          {recents.map((r) => (
            <button
              key={`${r.owner}/${r.repo}`}
              disabled={loading}
              onClick={() => submit(`${r.owner}/${r.repo}`)}
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border border-border text-muted hover:text-text hover:border-accent/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <img src={r.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
              {r.owner}/{r.repo}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
