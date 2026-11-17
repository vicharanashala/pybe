import { motion } from 'framer-motion'
import type { Mission } from '../../types/mission'
import GlowButton from '../ui/GlowButton'
import ParticleField from '../layout/ParticleField'
import CharacterLine from '../ui/CharacterLine'

interface Props {
  mission: Mission
  hasNext: boolean
  onNext: () => void
  onMap: () => void
}

export default function RewardStep({ mission, hasNext, onNext, onMap }: Props) {
  return (
    <div className="relative text-center py-4">
      <ParticleField count={30} color="#00C2FF" />
      <div className="text-left max-w-md mx-auto mb-8">
        <CharacterLine speaker={mission.challengeSuccess.speaker} text={mission.challengeSuccess.text} />
      </div>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 12 }}
        className="relative z-10 mx-auto w-24 h-24 rounded-full border-2 border-volt flex items-center justify-center text-4xl bg-void shadow-volt mb-5"
      >
        {mission.reward.badgeIcon}
      </motion.div>

      <p className="text-[11px] uppercase tracking-[0.3em] text-volt font-mono-tight mb-2">Mission Report</p>
      <h2 className="font-display text-3xl sm:text-4xl text-white text-glow-volt tracking-wide mb-2">
        {mission.reward.badge}
      </h2>
      <p className="text-white/60 text-sm mb-6">
        Mission {mission.number} — {mission.title} — complete.
      </p>

      <div className="inline-flex items-center gap-2 rounded-full border border-blood/40 bg-blood/10 px-5 py-2 mb-6">
        <span className="text-blood font-display tracking-wider">+{mission.reward.xp} XP</span>
      </div>

      <div className="max-w-md mx-auto rounded-md border border-rift/30 bg-rift/5 p-4 mb-8 text-left">
        <p className="text-[11px] uppercase tracking-widest text-rift font-mono-tight mb-1">
          {mission.cassette.title} Collected
        </p>
        <p className="text-white/75 text-sm leading-relaxed">{mission.cassette.tip}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <GlowButton variant="ghost" onClick={onMap}>
          Mission Map
        </GlowButton>
        {hasNext && (
          <GlowButton variant="blood" onClick={onNext}>
            Next Mission
          </GlowButton>
        )}
      </div>
    </div>
  )
}
