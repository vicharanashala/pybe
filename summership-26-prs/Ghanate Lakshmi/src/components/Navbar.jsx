import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, MapPin, Award } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export default function Navbar({ currentStep, totalSteps, onSelectStep }) {
  const [muted, setMuted] = useState(false);

  const handleToggleMute = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#171513]/90 backdrop-blur-md border-b border-amber-900/30 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & Chapter Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-orange-900/40 border border-amber-400/30">
              🚇
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                PYBE <span className="text-xs font-mono text-amber-500/80 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">LOOPS</span>
              </h1>
              <p className="text-[11px] text-stone-400 font-medium">The Raidurg Adventure</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Chapter {Math.min(currentStep + 1, 10)} / 10</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-6">
          <div className="w-full bg-stone-800/80 h-2.5 rounded-full overflow-hidden border border-stone-700/50 p-0.5">
            <div 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-700/60 text-stone-300 hover:text-amber-300 hover:border-amber-500/50 transition shadow-md flex items-center gap-2 text-xs font-semibold"
            title={muted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{muted ? "Muted" : "Sound ON"}</span>
          </button>

          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Story-First Learning</span>
          </div>
        </div>

      </div>
    </header>
  );
}
