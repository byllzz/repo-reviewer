import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Github, Languages, GitCommitHorizontal, Users, BookOpen, ShieldCheck, MessageSquareWarning } from 'lucide-react'
import { useReviewStore } from './lib/store'
import { computeHealth } from './lib/health'
import { PLACEHOLDER_REVIEW } from './lib/placeholder'
import { SearchBar } from './components/SearchBar'
import { CompactSearchBar } from './components/CompactSearchBar'
import { RepoHeader } from './components/RepoHeader'
import { StatsGrid } from './components/StatsGrid'
import { LanguageBar } from './components/LanguageBar'
import { CommitActivityChart } from './components/CommitActivityChart'
import { ContributorsList } from './components/ContributorsList'
import { HealthPanel } from './components/HealthPanel'
import { ReadmeTabs } from './components/ReadmeTabs'
import { Panel } from './components/Panel'
import { Locked } from './components/Locked'
import { ThemeToggle } from './components/ThemeToggle'
import { ErrorState } from './components/ErrorState'
import { RateLimitBadge } from './components/RateLimitBadge'
import { UserReposGrid } from './components/UserReposGrid'

const GITHUB_REPO_URL = 'https://github.com/byllzz/repo-reviewer'

export default function App() {
  const { mode, review, userProfile, userRepos, loading, error, search } = useReviewStore()
  const [searchExpanded, setSearchExpanded] = useState(true)

  const hasResult = mode === 'repo' ? Boolean(review) : Boolean(userProfile)

  // Everything renders from real data at all times - either the live review
  // or a fixture - so the "locked" state is a visual treatment (blur + icon)
  // over the real UI shape, not a separate skeleton implementation.
  const locked = !review
  const data = review ?? PLACEHOLDER_REVIEW
  const health = useMemo(() => computeHealth(data), [data])

  // Deep-link support: `?repo=owner/name` or `?user=login` on load triggers a search automatically.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const repo = params.get('repo')
    const user = params.get('user')
    if (repo) search(repo)
    else if (user) search(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Collapse the hero + search input once a result lands; re-expand on demand.
  useEffect(() => {
    if (hasResult && !loading) setSearchExpanded(false)
    if (!hasResult) setSearchExpanded(true)
  }, [hasResult, loading])

  const showHero = searchExpanded || loading || !hasResult
  const compactLabel = mode === 'repo' ? review?.info.full_name : userProfile?.login

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-base/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3 gap-2">
          <div className="flex items-center gap-1 text-sm font-medium shrink-0">
            <Github size={16} />
            <span className="hidden sm:inline">Repo Reviewer</span>
          </div>
          <div className="flex items-center gap-2">
            <RateLimitBadge />
            <a
              href={`${GITHUB_REPO_URL}/issues`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-text hover:border-accent/50 transition"
            >
              <MessageSquareWarning size={14} />
              <span className="hidden sm:inline">Issues</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 space-y-8">
        <AnimatePresence initial={false}>
          {showHero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-8">
                <div className="space-y-3 text-center max-w-xl mx-auto">
                  <h1 className="text-3xl font-semibold tracking-tight">Review any GitHub repo or user</h1>
                  <p className="text-muted">
                    Stars, activity, contributors, languages, and a quick health read - or browse a user's
                    whole repo list, in one clean view.
                  </p>
                </div>

                <SearchBar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!showHero && compactLabel && (
            <CompactSearchBar fullName={compactLabel} onExpand={() => setSearchExpanded(true)} />
          )}
        </AnimatePresence>

        {error && !loading && <ErrorState message={error} />}

        {mode === 'user' && userProfile ? (
          <UserReposGrid profile={userProfile} repos={userRepos ?? []} />
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <Locked locked={locked || loading}>
              <RepoHeader info={data.info} />
            </Locked>

            <Locked locked={locked || loading}>
              <StatsGrid review={data} />
            </Locked>

            <div className="grid md:grid-cols-2 gap-4">
              <Panel title="Languages" icon={Languages} delay={0.05}>
                <Locked locked={locked || loading}>
                  <LanguageBar languages={data.languages} />
                </Locked>
              </Panel>

              <Panel title="Commit activity (52 weeks)" icon={GitCommitHorizontal} delay={0.1}>
                <Locked locked={locked || loading}>
                  <CommitActivityChart data={data.commitActivity} />
                </Locked>
              </Panel>

              <Panel title="Top contributors" icon={Users} delay={0.15}>
                <Locked locked={locked || loading}>
                  <ContributorsList contributors={data.contributors} />
                </Locked>
              </Panel>

              <Panel title="Health check" icon={ShieldCheck} delay={0.2}>
                <Locked locked={locked || loading}>
                  <HealthPanel health={health} />
                </Locked>
              </Panel>
            </div>

            <Panel title="README" icon={BookOpen} delay={0.25} className="md:col-span-2">
              <Locked locked={locked || loading}>
                <ReadmeTabs content={data.readme} />
              </Locked>
            </Panel>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-dim py-6">
        Data from the public GitHub API. Unauthenticated requests are rate-limited by GitHub.
      </footer>
    </div>
  )
}
