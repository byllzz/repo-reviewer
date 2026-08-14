import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

export function CompactSearchBar({ fullName, onExpand }: { fullName: string; onExpand: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={onExpand}
      className="mx-auto flex items-center gap-2 text-xs text-muted bg-surface border border-border rounded-full px-3.5 py-1.5 hover:border-accent/50 hover:text-text transition"
    >
      <Search size={12} className="text-dim" />
      <span className="font-mono">{fullName}</span>
      <span className="text-dim">· search another</span>
    </motion.button>
  )
}
