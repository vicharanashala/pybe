import {createStoryProgressHook} from '../../../../../shared/story-progress.mjs';
const useStoryProgress=createStoryProgressHook(React);
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CaseStudyOne from './components/CaseStudyOne';
import CaseStudyTwo from './components/CaseStudyTwo';

function App({onComplete}) {
  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'case1' | 'case2'
  const [completed,complete]=useStoryProgress('loop-control-discovery');
  const isCase1Completed=completed.has('case1');
  const isCase2Completed=completed.has('case2');
  
  React.useEffect(()=>{if(completed.has('case1')&&completed.has('case2'))onComplete?.();},[completed,onComplete]);

  return (
    <div className="min-h-screen bg-radial-gradient text-slate-200 overflow-x-hidden font-sans">
      <Navbar onNavigate={setActiveScreen} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {activeScreen === 'home' && (
          <Hero 
            onExplore={() => setActiveScreen('case1')}
            onExploreCase2={() => setActiveScreen('case2')}
            isCase1Completed={isCase1Completed}
            isCase2Completed={isCase2Completed}
          />
        )}

        {activeScreen === 'case1' && (
          <CaseStudyOne 
            onBack={() => setActiveScreen('home')}
            onComplete={() => complete('case1')}
            onProceed={() => setActiveScreen('case2')}
            isCompleted={isCase1Completed}
          />
        )}

        {activeScreen === 'case2' && (
          <CaseStudyTwo 
            onBack={() => setActiveScreen('home')}
            onComplete={() => complete('case2')}
            isCompleted={isCase2Completed}
          />
        )}

      </main>
    </div>
  );
}

export default App;
