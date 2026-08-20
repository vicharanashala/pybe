import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import PlaceholderImage from './PlaceholderImage';
import CustomTagRenderer from './CustomTagRenderer';

/**
 * ModuleView Component
 * Renders active module beat-by-beat with split-screen layout and progression gating.
 */
export default function ModuleView({ moduleData, currentBeat, onBeatChange, onBackToModules }) {
  if (!moduleData) return null;

  const totalBeats = moduleData.totalBeats;
  const currentBeatIndex = currentBeat - 1;
  const beatData = moduleData.beats[currentBeatIndex] || moduleData.beats[0];

  const isFirstBeat = currentBeat === 1;
  const isFinalBeat = currentBeat === totalBeats;
  const isIntroOrOutro = isFirstBeat || isFinalBeat;

  // Check beat interaction type
  const isMcqBeat = beatData?.rightPaneHtml ? beatData.rightPaneHtml.includes('<z-options>') : false;
  const isReflectionBeat = beatData?.rightPaneHtml ? beatData.rightPaneHtml.includes('<z-answer>') : false;
  const requiresInteraction = isMcqBeat || isReflectionBeat;

  // Determine dynamic lock message
  const lockMessage = isMcqBeat
    ? 'Attempt the question to proceed.'
    : isReflectionBeat
    ? 'Click on Reveal Answer to proceed.'
    : 'Complete the interaction to proceed.';

  // Initialize/reset isBeatUnlocked: unlocked by default for narrative beats, locked for interactive beats
  const [isBeatUnlocked, setIsBeatUnlocked] = useState(!requiresInteraction);

  useEffect(() => {
    setIsBeatUnlocked(!requiresInteraction);
  }, [currentBeat, requiresInteraction]);

  const handlePrevBeat = () => {
    if (!isFirstBeat) {
      onBeatChange(currentBeat - 1);
    }
  };

  const handleNextBeat = () => {
    if (!isFinalBeat && isBeatUnlocked) {
      onBeatChange(currentBeat + 1);
    }
  };

  const handleFinishModule = () => {
    if (isBeatUnlocked) {
      onBackToModules(); // Resets activeModule to null and currentBeat to 1 in parent App.jsx
    }
  };

  // Determine module title string for Zone A header
  const moduleTitleText = moduleData.id === 'module1'
    ? 'Module 1'
    : moduleData.id === 'module2'
    ? 'Module 2'
    : moduleData.title;

  return (
    <div className="flex w-full h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Left Section (40vw) */}
      <div className="w-[40vw] h-screen flex flex-col justify-center px-8 border-r border-slate-800/80 bg-slate-900/40 relative">
        <div className="w-full max-w-lg mx-auto space-y-6">
          {beatData.leftPane.type === 'image' ? (
            <PlaceholderImage src={beatData.leftPane.src} />
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center">
              <CustomTagRenderer htmlContent={beatData.leftPane.content} isCentered={true} onProceed={() => {}} />
            </div>
          )}
        </div>
      </div>

      {/* Right Section (60vw) */}
      <div className="w-[60vw] h-screen flex flex-col p-12 relative overflow-y-auto bg-slate-950">
        
        {/* Zone A: Top Header */}
        <header className="flex justify-between items-center pb-6 border-b border-slate-800/80 mb-6 shrink-0">
          {/* Left side: Back button */}
          <button
            onClick={onBackToModules}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </button>

          {/* Center: Module Title Indicator */}
          <div className="text-slate-400 font-medium tracking-wide text-sm">
            {moduleTitleText}
          </div>

          {/* Right side: Beat Indicator */}
          <div className="text-sm text-slate-400 font-mono px-3 py-1 bg-slate-900 rounded-lg border border-slate-800">
            Beat <span className="text-blue-400 font-bold">{currentBeat}</span> of <span className="text-slate-200">{totalBeats}</span>
          </div>
        </header>

        {/* Zone B: Main Content (Flex-grow) */}
        <main className={`flex-1 py-4 overflow-y-auto flex flex-col ${isIntroOrOutro ? 'justify-center items-center text-center' : ''}`}>
          <div className={`w-full max-w-2xl ${isIntroOrOutro ? 'flex flex-col items-center justify-center text-center space-y-4 my-auto' : ''}`}>
            <CustomTagRenderer
              key={currentBeat}
              htmlContent={beatData.rightPaneHtml}
              isCentered={isIntroOrOutro}
              onProceed={(canProceed) => setIsBeatUnlocked(canProceed)}
            />
          </div>
        </main>

        {/* Zone C: Bottom Navigation */}
        <footer className="flex justify-between items-center mt-auto pt-6 border-t border-slate-700/80 shrink-0">
          {/* Back Button */}
          <button
            onClick={handlePrevBeat}
            disabled={isFirstBeat}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              isFirstBeat
                ? 'opacity-0 pointer-events-none'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Dynamic Locked / Guidance indicator if beat requires interaction and is not unlocked yet */}
          {!isBeatUnlocked && requiresInteraction && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium bg-amber-950/40 border border-amber-900/60 px-3.5 py-1.5 rounded-lg shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              <span>{lockMessage}</span>
            </div>
          )}

          {/* Next or Finish Module Button */}
          {isFinalBeat ? (
            <button
              onClick={handleFinishModule}
              disabled={!isBeatUnlocked}
              className={`flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl transition-all shadow-lg ${
                isBeatUnlocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-emerald-500/20 cursor-pointer'
                  : 'bg-slate-900 border border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Finish Module
            </button>
          ) : (
            <button
              onClick={handleNextBeat}
              disabled={!isBeatUnlocked}
              className={`flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl transition-all shadow-lg ${
                isBeatUnlocked
                  ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-blue-500/20 cursor-pointer'
                  : 'bg-slate-900 border border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </footer>

      </div>
    </div>
  );
}
