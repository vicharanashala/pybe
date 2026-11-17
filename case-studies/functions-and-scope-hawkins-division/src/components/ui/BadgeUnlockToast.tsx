import { motion, AnimatePresence } from 'framer-motion'

interface BadgeUnlockToastProps {
  visible: boolean
  badge: string
  icon: string
  xp: number
}

export default function BadgeUnlockToast({ visible, badge, icon, xp }: BadgeUnlockToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 rounded-md border border-volt/50 bg-void/95 px-5 py-3 shadow-volt"
          role="status"
        >
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          <div>
            <p className="font-display tracking-wider text-volt text-glow-volt text-sm">BADGE UNLOCKED</p>
            <p className="text-white/80 text-xs font-mono-tight">{badge} {'\u2022'} +{xp} XP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
