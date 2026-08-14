import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Github,
  Languages,
  GitCommitHorizontal,
  Users,
  BookOpen,
  ShieldCheck,
  MessageSquareWarning,
  Trash2,
} from "lucide-react";
import { useReviewStore } from "./lib/store";
import { computeHealth } from "./lib/health";
import { PLACEHOLDER_REVIEW } from "./lib/placeholder";
import { SearchBar } from "./components/SearchBar";
import { CompactSearchBar } from "./components/CompactSearchBar";
import { RepoHeader } from "./components/RepoHeader";
import { StatsGrid } from "./components/StatsGrid";
import { LanguageBar } from "./components/LanguageBar";
import { CommitActivityChart } from "./components/CommitActivityChart";
import { ContributorsList } from "./components/ContributorsList";
import { HealthPanel } from "./components/HealthPanel";
import { ReadmeTabs } from "./components/ReadmeTabs";
import { Panel } from "./components/Panel";
import { Locked } from "./components/Locked";
import { ThemeToggle } from "./components/ThemeToggle";
import { ErrorState } from "./components/ErrorState";
import { RateLimitBadge } from "./components/RateLimitBadge";
import { UserReposGrid } from "./components/UserReposGrid";
import { getCache, clearCache } from "./lib/cache";
import type { RepoReview, UserProfile, UserRepoSummary } from "./lib/types";

const GITHUB_REPO_URL = "https://github.com/byllzz/repo-reviewer";

export default function App() {
  const {
    mode,
    review,
    userProfile,
    userRepos,
    loading,
    error,
    search,
    reset,
    setReview,
    setUser,
  } = useReviewStore();
  const [searchExpanded, setSearchExpanded] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const hasResult = mode === "repo" ? Boolean(review) : Boolean(userProfile);

  const locked = !review;
  const data = review ?? PLACEHOLDER_REVIEW;
  const health = useMemo(() => computeHealth(data), [data]);

  // Deep‑link + cache check on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get("repo");
    const user = params.get("user");

    if (repo) {
      const cached = getCache<RepoReview>(`repo:${repo}`);
      if (cached) {
        setReview(cached);
        setInitialLoading(false);
      } else {
        search(repo).finally(() => setInitialLoading(false));
      }
    } else if (user) {
      const cached = getCache<{
        profile: UserProfile;
        repos: UserRepoSummary[];
      }>(`user:${user}`);
      if (cached) {
        setUser(cached.profile, cached.repos);
        setInitialLoading(false);
      } else {
        search(user).finally(() => setInitialLoading(false));
      }
    } else {
      setInitialLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Collapse hero once result lands
  useEffect(() => {
    if (hasResult && !loading) setSearchExpanded(false);
    if (!hasResult) setSearchExpanded(true);
  }, [hasResult, loading]);

  const showHero = searchExpanded || loading || !hasResult;
  const compactLabel =
    mode === "repo" ? review?.info.full_name : userProfile?.login;

  const handleClear = () => {
    const params = new URLSearchParams(window.location.search);
    const repo = params.get("repo");
    const user = params.get("user");
    if (repo) clearCache(`repo:${repo}`);
    if (user) clearCache(`user:${user}`);
    reset();
    window.history.replaceState({}, "", window.location.pathname);
    setSearchExpanded(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* One‑time loader overlay */}
      <AnimatePresence>
        {initialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted">
                Loading repository data…
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-30 border-b border-border bg-base/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3 gap-2">
          <div className="flex items-center gap-1 text-sm font-medium shrink-0">
            <Github size={16} />
            <span className="hidden sm:inline">Repo Reviewer</span>
          </div>
          <div className="flex items-center gap-2">
            <RateLimitBadge />
            {hasResult && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-text hover:border-accent/50 transition"
                title="Clear current session"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Clear Results</span>
              </button>
            )}
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

      <main className="flex-1 px-4 py-10 space-y-8 relative">
        <AnimatePresence initial={false}>
          {showHero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-8">
                <div className="space-y-3 text-center max-w-xl mx-auto">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Review any GitHub repo or user
                  </h1>
                  <p className="text-muted">
                    Stars, activity, contributors, languages, and a quick health
                    read – or browse a user's whole repo list, in one clean
                    view.
                  </p>
                </div>
                <SearchBar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!showHero && compactLabel && (
            <CompactSearchBar
              fullName={compactLabel}
              onExpand={() => setSearchExpanded(true)}
            />
          )}
        </AnimatePresence>

        {/* Error overlay – centered over the data UI */}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="pointer-events-auto max-w-md w-full">
              <ErrorState message={error} />
            </div>
          </div>
        )}

        {mode === "user" && userProfile ? (
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

              <Panel
                title="Commit activity (52 weeks)"
                icon={GitCommitHorizontal}
                delay={0.1}
              >
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

            <Panel
              title="README"
              icon={BookOpen}
              delay={0.25}
              className="md:col-span-2"
            >
              <Locked locked={locked || loading}>
                <ReadmeTabs content={data.readme} />
              </Locked>
            </Panel>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-dim py-6">
        Data from the public GitHub API. Unauthenticated requests are
        rate-limited by GitHub.
      </footer>
    </div>
  );
}
