import { motion } from 'framer-motion'
import { missions } from '../../data/missions'
import { useGame } from '../../context/GameContext'
import FogLayer from '../layout/FogLayer'

interface Props {
  onSelectMission: (missionId: string) => void
}

const RIFT_COLORS = ['#00C2FF', '#00C2FF', '#7A00FF', '#7A00FF', '#E50914']

export default function MapScreen({ onSelectMission }: Props) {
  const { isMissionUnlocked, isMissionComplete, completedMissions, resetProgress } = useGame()

  return (
    <div className="relative min-h-screen">
      <FogLayer />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-blood text-glow-blood font-mono-tight mb-2">
              Hawkins Division
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">Mission Map</h1>
          </div>
        </div>

        <ol className="relative border-l border-white/10 pl-6 sm:pl-8 space-y-6">
          {missions.map((m) => {
            const unlocked = isMissionUnlocked(m.number)
            const complete = isMissionComplete(m.id)
            const color = RIFT_COLORS[Math.min(m.riftLevel - 1, RIFT_COLORS.length - 1)]

            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <span
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    borderColor: complete ? '#00C2FF' : unlocked ? color : 'rgba(255,255,255,0.2)',
                    backgroundColor: complete ? '#00C2FF' : 'transparent',
                    boxShadow: complete || unlocked ? `0 0 10px ${color}` : 'none',
                  }}
                  aria-hidden="true"
                />
                <button
                  disabled={!unlocked}
                  onClick={() => onSelectMission(m.id)}
                  className={`w-full text-left rounded-md border p-4 sm:p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt
                    ${unlocked ? 'border-white/15 bg-voidRaised/60 hover:border-white/35' : 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'}
                    ${complete ? 'border-volt/40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-mono-tight" style={{ color }}>
                        {m.isFinalBoss ? 'Final Protocol' : `Mission ${m.number}`} &middot; {m.codename}
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl text-white tracking-wide mt-0.5">
                        {m.title}
                      </h2>
                      <p className="text-white/40 text-xs font-mono-tight mt-1">{m.location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {complete && (
                        <span className="text-2xl" title="Completed" aria-label="Completed">
                          ✓
                        </span>
                      )}
                      {!unlocked && (
                        <span className="text-white/30 text-xs font-mono-tight" aria-label="Locked">
                          {'\uD83D\uDD12'}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.li>
            )
          })}
        </ol>

        {completedMissions.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) resetProgress()
            }}
            className="mt-12 text-[11px] text-white/25 hover:text-blood font-mono-tight uppercase tracking-widest"
          >
            Reset Progress
          </button>
        )}
      </div>
    </div>
  )
}
