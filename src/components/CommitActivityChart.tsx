import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { CommitActivityWeek } from '../lib/types'

export function CommitActivityChart({ data }: { data: CommitActivityWeek[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-dim">Commit activity isn't available for this repo yet.</p>
  }

  const chartData = data.map((w) => ({
    date: new Date(w.week * 1000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    commits: w.total,
  }))

  return (
    <div className="h-40 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="commitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ui-accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--ui-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--ui-text-dim)' }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(chartData.length / 6)}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--ui-surface)',
              border: '1px solid var(--ui-border)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--ui-text)' }}
          />
          <Area
            type="monotone"
            dataKey="commits"
            stroke="var(--ui-accent)"
            strokeWidth={2}
            fill="url(#commitFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
