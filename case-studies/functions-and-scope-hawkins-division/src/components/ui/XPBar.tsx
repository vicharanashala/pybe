import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'

export default function XPBar({ compact = false }: { compact?: boolean }) {
  const { xp, currentRank, nextRank, progressToNextRank } = useGame()

  return (
    <div className={compact ? 'w-40 sm:w-56' : 'w-full max-w-md'}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono-tight text-[10px] sm:text-xs uppercase tracking-widest text-volt/90">
          {currentRank.title}
        </span>
        <span className="font-mono-tight text-[10px] sm:text-xs text-white/50">{xp} XP</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden border border-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-rift via-blood to-volt"
          initial={{ width: 0 }}
          animate={{ width: `${progressToNextRank * 100}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      {!compact && nextRank && (
        <p className="mt-1 text-[11px] text-white/40 font-mono-tight">
          Next rank: {nextRank.title} at {nextRank.minXp} XP
        </p>
      )}
    </div>
  )
}
