import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Mission, Choice } from '../../types/mission'
import { useGame } from '../../context/GameContext'
import StoryStep from '../missions/StoryStep'
import ChoiceStep from '../missions/ChoiceStep'
import ConceptRevealView from '../missions/ConceptRevealView'
import ChallengeStep from '../missions/ChallengeStep'
import RewardStep from '../missions/RewardStep'
import CharacterLine from '../ui/CharacterLine'
import GlowButton from '../ui/GlowButton'
import XPBar from '../ui/XPBar'
import ParticleField from '../layout/ParticleField'

type Stage = 'briefing' | 'story' | 'choice' | 'concept' | 'challenge' | 'reward'

interface Props {
  mission: Mission
  hasNext: boolean
  onNextMission: () => void
  onExitToMap: () => void
  onMissionComplete?: () => void
}

const RIFT_COLORS = ['#00C2FF', '#00C2FF', '#7A00FF', '#7A00FF', '#E50914']

export default function MissionScreen({ mission, hasNext, onNextMission, onExitToMap, onMissionComplete }: Props) {
  const [stage, setStage] = useState<Stage>('briefing')
  const [screenShake, setScreenShake] = useState(false)
  const { completeMission } = useGame()

  const handleChoiceResolved = (choice: Choice) => {
    if (choice.best) {
      setStage('concept')
    }
  }

  const triggerShake = () => {
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 500)
  }

  const handleChallengeSuccess = () => {
    completeMission(mission.id, mission.reward.xp, mission.reward.badge, mission.cassette.title)
    onMissionComplete?.()
    triggerShake()
    setStage('reward')
  }

  const riftColor = RIFT_COLORS[Math.min(mission.riftLevel - 1, RIFT_COLORS.length - 1)]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: screenShake ? [0, -6, 6, -4, 4, 0] : 0 }}
      transition={{ duration: screenShake ? 0.45 : 0.4 }}
      className="min-h-screen relative pb-16"
    >
      <ParticleField count={14} color={riftColor} />

      {/* Top bar */}
      <div className="sticky top-0 z-20 backdrop-blur-sm bg-void/80 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onExitToMap}
            className="text-white/50 hover:text-volt text-xs font-mono-tight uppercase tracking-widest focus-visible:outline focus-visible:outline-1 focus-visible:outline-volt"
          >
            {'\u2190'} Map
          </button>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono-tight">
              Mission {mission.number} {mission.isFinalBoss ? '\u2014 Final Protocol' : ''}
            </p>
            <p className="font-display text-lg tracking-wide" style={{ color: riftColor }}>
              {mission.codename}
            </p>
          </div>
          <XPBar compact />
        </div>
        {/* Rift level meter */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{
                backgroundColor: i < mission.riftLevel ? riftColor : 'rgba(255,255,255,0.08)',
                boxShadow: i < mission.riftLevel ? `0 0 8px ${riftColor}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <AnimatePresence mode="wait">
          {stage === 'briefing' && (
            <motion.div key="briefing" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-[11px] uppercase tracking-[0.3em] font-mono-tight mb-2" style={{ color: riftColor }}>
                Mission Briefing
              </p>
              <h1 className="font-display text-3xl sm:text-4xl text-white mb-1 tracking-wide">{mission.title}</h1>
              <p className="text-white/40 text-sm font-mono-tight mb-6">{mission.location}</p>
              <div className="rounded-md border border-white/10 bg-voidRaised/70 p-5 sm:p-6 mb-8">
                <p className="text-white/85 leading-relaxed">{mission.briefing}</p>
              </div>
              <div className="flex justify-end">
                <GlowButton variant="blood" onClick={() => setStage('story')}>
                  Begin Mission
                </GlowButton>
              </div>
            </motion.div>
          )}

          {stage === 'story' && (
            <motion.div key="story" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <StoryStep lines={mission.story} onComplete={() => setStage('choice')} />
            </motion.div>
          )}

          {stage === 'choice' && (
            <motion.div key="choice" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ChoiceStep prompt={mission.decisionPrompt} choices={mission.choices} onResolved={handleChoiceResolved} />
            </motion.div>
          )}

          {stage === 'concept' && (
            <motion.div key="concept" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ConceptRevealView concept={mission.concept} onContinue={() => setStage('challenge')} />
            </motion.div>
          )}

          {stage === 'challenge' && (
            <motion.div key="challenge" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-volt font-mono-tight mb-3">
                Field Challenge
              </p>
              <ChallengeStep challenge={mission.challenge} onSuccess={handleChallengeSuccess} />
            </motion.div>
          )}

          {stage === 'reward' && (
            <motion.div key="reward" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <RewardStep mission={mission} hasNext={hasNext} onNext={onNextMission} onMap={onExitToMap} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
