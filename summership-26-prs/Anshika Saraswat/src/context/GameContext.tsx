import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { missions } from '../data/missions'

const STORAGE_KEY = 'hawkins-division-save-v1'

export interface Rank {
  title: string
  minXp: number
}

export const RANKS: Rank[] = [
  { title: 'Recruit', minXp: 0 },
  { title: 'Field Trainee', minXp: 250 },
  { title: 'Radio Operator', minXp: 500 },
  { title: 'Rift Analyst', minXp: 850 },
  { title: 'Senior Analyst', minXp: 1250 },
  { title: 'Division Officer', minXp: 1650 },
  { title: 'Hawkins Division Commander', minXp: 2000 },
]

interface SaveData {
  xp: number
  completedMissions: string[]
  badges: string[]
  cassettes: string[]
}

interface GameContextValue extends SaveData {
  currentRank: Rank
  nextRank: Rank | null
  progressToNextRank: number
  unlockedMissionNumbers: number[]
  isMissionUnlocked: (missionNumber: number) => boolean
  isMissionComplete: (missionId: string) => boolean
  completeMission: (missionId: string, xp: number, badge: string, cassetteTitle: string) => void
  resetProgress: () => void
}

const defaultSave: SaveData = { xp: 0, completedMissions: [], badges: [], cassettes: [] }

const GameContext = createContext<GameContextValue | null>(null)

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSave
    const parsed = JSON.parse(raw)
    return { ...defaultSave, ...parsed }
  } catch {
    return defaultSave
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(() => loadSave())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
    } catch {
      // ignore write failures (e.g. private browsing)
    }
  }, [save])

  const currentRank = useMemo(() => {
    let rank = RANKS[0]
    for (const r of RANKS) {
      if (save.xp >= r.minXp) rank = r
    }
    return rank
  }, [save.xp])

  const nextRank = useMemo(() => {
    const idx = RANKS.findIndex((r) => r.title === currentRank.title)
    return RANKS[idx + 1] ?? null
  }, [currentRank])

  const progressToNextRank = useMemo(() => {
    if (!nextRank) return 1
    const span = nextRank.minXp - currentRank.minXp
    const gained = save.xp - currentRank.minXp
    return Math.min(1, Math.max(0, gained / span))
  }, [save.xp, currentRank, nextRank])

  const unlockedMissionNumbers = useMemo(() => {
    // Mission 1 always unlocked; each subsequent mission unlocks after the previous is complete.
    const unlocked = [1]
    for (const m of missions) {
      if (save.completedMissions.includes(m.id)) {
        const next = missions.find((x) => x.number === m.number + 1)
        if (next) unlocked.push(next.number)
      }
    }
    return Array.from(new Set(unlocked))
  }, [save.completedMissions])

  const isMissionUnlocked = (missionNumber: number) => unlockedMissionNumbers.includes(missionNumber)
  const isMissionComplete = (missionId: string) => save.completedMissions.includes(missionId)

  const completeMission = (missionId: string, xp: number, badge: string, cassetteTitle: string) => {
    setSave((prev) => {
      if (prev.completedMissions.includes(missionId)) return prev
      return {
        xp: prev.xp + xp,
        completedMissions: [...prev.completedMissions, missionId],
        badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge],
        cassettes: prev.cassettes.includes(cassetteTitle) ? prev.cassettes : [...prev.cassettes, cassetteTitle],
      }
    })
  }

  const resetProgress = () => setSave(defaultSave)

  const value: GameContextValue = {
    ...save,
    currentRank,
    nextRank,
    progressToNextRank,
    unlockedMissionNumbers,
    isMissionUnlocked,
    isMissionComplete,
    completeMission,
    resetProgress,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}
