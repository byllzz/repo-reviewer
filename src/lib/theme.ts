export type Theme = 'dark' | 'light' | 'system'

const KEY = 'repo-reviewer:theme'

export function getStoredTheme(): Theme {
  return (localStorage.getItem(KEY) as Theme) || 'system'
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : theme

  root.classList.toggle('light', resolved === 'light')
  localStorage.setItem(KEY, theme)
}

export function initTheme() {
  applyTheme(getStoredTheme())
}
