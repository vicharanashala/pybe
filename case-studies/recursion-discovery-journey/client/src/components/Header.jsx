import React from 'react';
import { Trophy, BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';

export default function Header({ currentStep, totalSteps, xp, onOpenSandbox, onOpenSim }) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="w-full bg-[#090C22]/85 backdrop-blur-xl border-b border-purple-500/20 px-4 md:px-8 py-3 transition-all z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: PyBe Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="font-extrabold text-lg text-white tracking-wider">Py</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                PyBe
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Adventure
              </span>
            </div>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs mx-4">
          <div className="w-full h-2.5 bg-gray-900 rounded-full p-0.5 border border-purple-500/20 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Scene X/7 & XP Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{xp} XP</span>
          </div>

          <div className="px-3.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs md:text-sm font-extrabold shadow-sm">
            Scene {currentStep}/{totalSteps}
          </div>
        </div>

      </div>
    </header>
  );
}
