import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export function Locked({ locked, children }: { locked: boolean; children: ReactNode }) {
  return (
    <div className="relative">
      <div
        className={`transition-all duration-500 ease-out ${
          locked ? 'blur-[3px] opacity-35 scale-[0.99] pointer-events-none select-none' : 'blur-0 opacity-100 scale-100'
        }`}
        aria-hidden={locked}
      >
        {children}
      </div>

      <AnimatePresence>
        {locked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25 } }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center shadow-lg">
              <Lock size={14} className="text-dim" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
