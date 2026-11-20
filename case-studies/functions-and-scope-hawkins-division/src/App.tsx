import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider } from './context/GameContext'
import { missions } from './data/missions'
import IntroScreen from './components/screens/IntroScreen'
import MapScreen from './components/screens/MapScreen'
import MissionScreen from './components/screens/MissionScreen'
import CRTOverlay from './components/layout/CRTOverlay'
import FlashlightCursor from './components/layout/FlashlightCursor'

type View = { name: 'intro' } | { name: 'map' } | { name: 'mission'; missionId: string }

function AppShell({onComplete}: {onComplete?: () => void}) {
  const [view, setView] = useState<View>({ name: 'intro' })

  const goToMission = (missionId: string) => setView({ name: 'mission', missionId })
  const goToMap = () => setView({ name: 'map' })

  const currentMission = view.name === 'mission' ? missions.find((m) => m.id === view.missionId) : null
  const missionIndex = currentMission ? missions.findIndex((m) => m.id === currentMission.id) : -1
  const nextMission = missionIndex >= 0 ? missions[missionIndex + 1] : null

  const handleNextMission = () => {
    if (nextMission) goToMission(nextMission.id)
    else goToMap()
  }

  return (
    <div className="relative min-h-screen bg-void text-white font-body">
      <CRTOverlay />
      <FlashlightCursor />

      <AnimatePresence mode="wait">
        {view.name === 'intro' && (
          <motion.div key="intro" exit={{ opacity: 0 }}>
            <IntroScreen onEnter={goToMap} />
          </motion.div>
        )}

        {view.name === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MapScreen onSelectMission={goToMission} />
          </motion.div>
        )}

        {view.name === 'mission' && currentMission && (
          <motion.div key={currentMission.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MissionScreen
              mission={currentMission}
              hasNext={!!nextMission}
              onNextMission={handleNextMission}
              onExitToMap={goToMap}

            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App({onComplete}: {onComplete?: () => void}) {
  return (
    <GameProvider onComplete={onComplete}>
      <AppShell />
    </GameProvider>
  )
}
