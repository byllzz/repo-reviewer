import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { applyTheme, getStoredTheme, type Theme } from '../lib/theme'

const options: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme())
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const current = options.find((o) => o.id === theme)!

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-text hover:border-accent/50 transition"
      >
        <current.icon size={14} />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-36 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50"
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              role="option"
              aria-selected={theme === opt.id}
              onClick={() => {
                applyTheme(opt.id)
                setTheme(opt.id)
                setOpen(false)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted hover:bg-surface-2 hover:text-text transition"
            >
              <opt.icon size={13} />
              <span className="flex-1 text-left">{opt.label}</span>
              {theme === opt.id && <Check size={13} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
