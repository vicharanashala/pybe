import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ModuleView from './components/ModuleView';

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [currentBeat, setCurrentBeat] = useState(1);

  const handleStartModule = (moduleId) => {
    setActiveModule(moduleId);
    setCurrentBeat(1);
  };

  const handleBackToModules = () => {
    setActiveModule(null);
    setCurrentBeat(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {activeModule === null ? (
        <LandingPage onStartModule={handleStartModule} />
      ) : (
        <ModuleView
          currentBeat={currentBeat}
          onBeatChange={setCurrentBeat}
          onBackToModules={handleBackToModules}
        />
      )}
    </div>
  );
}
