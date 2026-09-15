import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StoryContainer from './components/StoryContainer';
import { STORY_PARTS } from './data/storyData';

export default function App() {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);

  const handleSelectChapter = (chapterIdx) => {
    setCurrentChapterIdx(chapterIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f2eb] flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* Top Header */}
      <Navbar
        currentStep={currentChapterIdx}
        totalSteps={STORY_PARTS.length}
        onSelectStep={handleSelectChapter}
      />

      {/* Main Interactive Story Experience */}
      <main className="flex-1 pb-8">
        <StoryContainer
          currentChapterIdx={currentChapterIdx}
          onSelectChapter={handleSelectChapter}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-950/40 bg-[#171513] py-5 px-4 text-center text-xs text-stone-400 space-y-1">
        <div className="flex items-center justify-center gap-4 text-stone-300 font-medium">
          <span>Lakshmi</span> • <span>Ananya</span> • <span>Rahul</span> • <span>Vikram</span>
        </div>
        <p className="text-amber-500/80 font-mono text-[11px]">
          PyBe — "The Raidurg Adventure" | Story-First Python Loop Discovery
        </p>
      </footer>

    </div>
  );
}
