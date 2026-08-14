# Repo Reviewer

Paste any public GitHub repo (owner/name or a full URL) and get a clean,
single-page review: stats, language breakdown, commit activity, top
contributors, a transparent health score, and a rendered README.

## Run it

```bash
npm install
npm run dev
```

Then search e.g. `facebook/react`, `vuejs/core`, or paste a full
`https://github.com/owner/repo` URL.

## Stack

React + TypeScript + Vite + **Tailwind CSS v4** (via `@tailwindcss/vite`,
no `tailwind.config.js` or PostCSS config needed — theme tokens live in
`src/styles/index.css` under `@theme`), Zustand for state, Recharts for the
commit-activity chart, react-markdown + remark-gfm for the README render,
Framer Motion for the entrance/gauge animations, lucide-react for icons.

## How it works

- `lib/github.ts` — a small GitHub REST API client. Fetches repo info,
  languages, contributors, commit activity, README, and open PR count in
  parallel. Handles GitHub's quirks: the commit-activity endpoint can
  return `202` while stats are computed async (retried automatically), and
  rate-limit / not-found errors are surfaced as readable messages instead
  of raw HTTP codes.
- `lib/health.ts` — a **transparent** health-score heuristic (recency,
  commit momentum, contributor count, docs, license, issue backlog). Every
  factor is shown in the UI with its own explanation — this is explicitly
  not presented as an objective "quality score," just one readable signal.
- `lib/store.ts` — Zustand store for the current review, loading/error
  state, and recent searches (persisted to `localStorage`).
- `components/` — one component per panel (stats grid, language bar,
  commit chart, contributors, health gauge, README preview), composed in
  `App.tsx`.

## Notes on GitHub's API

- Unauthenticated requests are capped at 60/hour per IP. This app doesn't
  use an access token, so heavy testing may hit that limit — the error
  state will tell you when it resets.
- The commit-activity endpoint occasionally needs GitHub to compute stats
  for a repo it hasn't cached yet, hence the retry logic — if it never
  resolves, the chart just shows "not available yet" instead of failing
  the whole page.

## Ideas to extend

- Add a personal access token input to raise the rate limit to 5,000/hour
- Compare two repos side by side
- Cache recent reviews in IndexedDB so revisiting a repo is instant
