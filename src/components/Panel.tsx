import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
  delay?: number
}

export function Panel({ title, icon: Icon, children, className = '', delay = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-surface border border-border rounded-xl p-5 space-y-4 ${className}`}
    >
      <h2 className="flex items-center gap-2 text-sm font-medium text-muted">
        <Icon size={15} />
        {title}
      </h2>
      {children}
    </motion.section>
  )
}
