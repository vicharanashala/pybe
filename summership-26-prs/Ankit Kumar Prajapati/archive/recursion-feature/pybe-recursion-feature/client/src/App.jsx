import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ModuleView from './components/ModuleView';
import { modulesData } from './data/modulesData';

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

  const handleBeatChange = (newBeat) => {
    setCurrentBeat(newBeat);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      {activeModule === null ? (
        <LandingPage onStartModule={handleStartModule} />
      ) : (
        <ModuleView
          moduleData={modulesData[activeModule]}
          currentBeat={currentBeat}
          onBeatChange={handleBeatChange}
          onBackToModules={handleBackToModules}
        />
      )}
    </div>
  );
}
