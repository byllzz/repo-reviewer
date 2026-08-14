import { useMemo } from 'react'
import { Github, Languages, GitCommitHorizontal, Users, BookOpen, ShieldCheck } from 'lucide-react'
import { useReviewStore } from './lib/store'
import { computeHealth } from './lib/health'
import { PLACEHOLDER_REVIEW } from './lib/placeholder'
import { SearchBar } from './components/SearchBar'
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

export default function App() {
  const { review, loading, error } = useReviewStore()

  // Everything renders from real data at all times — either the live review
  // or a fixture — so the "locked" state is a visual treatment (blur + icon)
  // over the real UI shape, not a separate skeleton implementation.
  const locked = !review
  const data = review ?? PLACEHOLDER_REVIEW
  const health = useMemo(() => computeHealth(data), [data])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-base/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Github size={16} />
            Repo Reviewer
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 py-10 space-y-8">
        <div className="space-y-3 text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-semibold tracking-tight">Review any GitHub repo</h1>
          <p className="text-muted">
            Stars, activity, contributors, languages, and a quick health read — in one clean view.
          </p>
        </div>

        <SearchBar />

        {error && !loading && <ErrorState message={error} />}

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
      </main>

      <footer className="text-center text-xs text-dim py-6">
        Data from the public GitHub API. Unauthenticated requests are rate-limited by GitHub.
      </footer>
    </div>
  )
}
