import { motion } from 'framer-motion'
import type { HealthResult } from '../lib/health'

function scoreColor(score: number): string {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#eab308'
  return '#ef4444'
}

function Gauge({ score }: { score: number }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const color = scoreColor(score)

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--ui-border)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold">{score}</span>
        <span className="text-[10px] text-dim uppercase tracking-wide">Health</span>
      </div>
    </div>
  )
}

export function HealthPanel({ health }: { health: HealthResult }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <Gauge score={health.overall} />

      <div className="flex-1 w-full space-y-2.5">
        {health.factors.map((f) => (
          <div key={f.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">{f.label}</span>
              <span className="text-dim">{f.detail}</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: scoreColor(f.score) }}
                initial={{ width: 0 }}
                animate={{ width: `${f.score}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
