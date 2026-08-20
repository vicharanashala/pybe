import React, { useMemo } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { parseModuleMD } from '../utils/moduleParser';
import { rawModuleText } from '../data/moduleContent';

export default function LandingPage({ onStartModule }) {
  const totalBeats = useMemo(() => {
    const beats = parseModuleMD(rawModuleText);
    return beats.length > 0 ? (beats[0].totalBeats || beats.length) : 18;
  }, []);

  return (
    <div className="flex w-full h-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">
      {/* Left Section (40vw) */}
      <section className="w-[40vw] h-screen flex flex-col justify-center items-center px-8 bg-slate-950 border-r border-slate-800/80 relative select-none">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Learning
          </div>
          <h1 className="text-4xl font-bold italic text-center text-blue-400 leading-tight">
            Understanding Iteration Through a Case Study
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Discover fundamental programming loops through real-world scenarios and interactive visual exercises.
          </p>
        </div>
      </section>

      {/* Right Section (60vw) */}
      <section className="w-[40vw] sm:w-[60vw] h-screen flex flex-col justify-center p-12 relative overflow-y-auto bg-slate-900">
        <div className="max-w-xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Available Modules
            </h2>
            <p className="text-slate-400 text-sm">Select a module to begin your learning journey.</p>
          </div>

          <div className="bg-slate-800/90 rounded-xl p-6 shadow-xl border border-slate-700/80 flex items-center justify-between transition-all hover:border-slate-600 hover:shadow-2xl">
            <div className="flex flex-col gap-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Module 1
                </span>
                <span className="text-xs text-slate-400">{totalBeats} Beats</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-1">
                Module 1: Understanding Iteration
              </h3>
              <p className="text-sm text-slate-400">
                Finding Raghav in Dark Movie Theatre & Mapping Python Loops
              </p>
            </div>

            <button
              onClick={() => onStartModule('module-1')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg shadow-blue-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
              id="start-module-1-btn"
            >
              <Play className="w-4 h-4 fill-current" />
              Start
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
