import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CaseStudyOne from './components/CaseStudyOne';

function App() {
  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'case1'
  const [isCase1Completed, setIsCase1Completed] = useState(false);
  
  const [scores, setScores] = useState({});
  const [resetSignal, setResetSignal] = useState(0);

  const handleScoreUpdate = (key, value) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const handleResetAll = () => {
    setScores({});
    setResetSignal(prev => prev + 1);
    setIsCase1Completed(false);
    setActiveScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = 4; // 2 quizzes, 2 code challenges

  return (
    <div className="min-h-screen bg-radial-gradient text-slate-200 overflow-x-hidden font-sans">
      <Navbar onNavigate={setActiveScreen} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {activeScreen === 'home' && (
          <Hero 
            onExplore={() => setActiveScreen('case1')}
            isCase1Completed={isCase1Completed}
          />
        )}

        {activeScreen === 'case1' && (
          <CaseStudyOne 
            onScoreUpdate={handleScoreUpdate} 
            resetSignal={resetSignal} 
            onBack={() => setActiveScreen('home')}
            onComplete={() => setIsCase1Completed(true)}
            onProceed={() => setActiveScreen('home')}
            isCompleted={isCase1Completed}
          />
        )}

        {/* Summary Card */}
        {totalScore > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="glassmorphism p-4 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)] bg-slate-900/90 border border-emerald-500/30 backdrop-blur-lg">
              <h4 className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Progress Tracker</h4>
              <p className="text-xl font-bold text-white">
                Score: <span className="text-emerald-400">{totalScore}</span> / {maxScore}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
