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
      <p className="text-[11px] uppercase tracking-[0.3em] text-volt font-mono-tight mb-2">Mission Report</p>
      <h2 className="font-display text-3xl sm:text-4xl text-white text-glow-volt tracking-wide mb-2">
        Mission Complete
      </h2>
      <p className="text-white/60 text-sm mb-6">
        Mission {mission.number} — {mission.title} — complete.
      </p>

      <div className="max-w-md mx-auto rounded-md border border-rift/30 bg-rift/5 p-4 mb-8 text-left">
        <p className="text-[11px] uppercase tracking-widest text-rift font-mono-tight mb-1">
          {mission.cassette.title} · Field Note
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
