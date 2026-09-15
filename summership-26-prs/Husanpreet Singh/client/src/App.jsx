import { useEffect, useState } from 'react'
import LandingPage from './components/LandingPage'
import ScrollJourney from './components/journey/ScrollJourney'

function App() {
  const [currentView, setCurrentView] = useState('landing')

  /* Each view owns the whole scroll, so hand it back a clean one. */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentView])

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onStartAdventure={() => setCurrentView('journey')} />
      )}
      {currentView === 'journey' && (
        <ScrollJourney onExit={() => setCurrentView('landing')} />
      )}
    </>
  )
}

export default App
