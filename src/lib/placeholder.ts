import type { RepoReview } from './types'

/**
 * Fake-but-plausible data so every panel can render its real component tree
 * before a search happens - blurred and locked, not an abstract skeleton.
 * Never shown at full opacity; exact values don't matter, shape does.
 */
export const PLACEHOLDER_REVIEW: RepoReview = {
  info: {
    id: 0,
    full_name: 'octocat/hello-world',
    name: 'hello-world',
    owner: { login: 'octocat', avatar_url: 'https://github.com/octocat.png', html_url: '#' },
    description: 'A repository full of interesting things, waiting to be reviewed.',
    html_url: '#',
    homepage: null,
    stargazers_count: 48213,
    forks_count: 9021,
    open_issues_count: 214,
    watchers_count: 48213,
    default_branch: 'main',
    license: { name: 'MIT License', spdx_id: 'MIT' },
    topics: ['example', 'placeholder', 'demo'],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 900).toISOString(),
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    archived: false,
    disabled: false,
    language: 'TypeScript',
  },
  languages: {
    TypeScript: 62000,
    JavaScript: 18000,
    CSS: 9000,
    HTML: 4000,
  },
  contributors: Array.from({ length: 5 }).map((_, i) => ({
    login: `contributor-${i + 1}`,
    avatar_url: 'https://github.com/octocat.png',
    html_url: '#',
    contributions: 400 - i * 70,
  })),
  commitActivity: Array.from({ length: 52 }).map((_, i) => ({
    week: Math.floor(Date.now() / 1000) - (52 - i) * 7 * 24 * 60 * 60,
    total: Math.round(8 + Math.sin(i / 4) * 6 + (i % 7)),
    days: [0, 0, 0, 0, 0, 0, 0],
  })),
  readme: [
    '# hello-world\n',
    'This is placeholder README content, shown blurred until you search for a real repository.\n',
    '## Features\n',
    '- Fast\n- Friendly\n- Fictional\n',
  ].join('\n'),
  openIssuesOnly: 168,
  openPRs: 46,
}
