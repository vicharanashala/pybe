import React from 'react';
import { Play, BookOpen, Sparkles } from 'lucide-react';
import { modulesData } from '../data/modulesData';

/**
 * LandingPage Component
 * Renders the persistent split-screen landing view.
 */
export default function LandingPage({ onStartModule }) {
  const modulesList = Object.values(modulesData);

  return (
    <div className="flex w-full h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Left Section (40vw) */}
      <div className="w-[40vw] h-screen flex flex-col justify-center items-center px-8 border-r border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl relative">
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl pointer-events-none" />
        <div className="z-10 text-center space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" /> Interactive Module
          </div>
          <h1 className="text-4xl font-bold italic text-center text-blue-400 leading-tight tracking-tight">
            Understanding Recursion Through a Case Study
          </h1>
          <p className="text-slate-400 text-base font-normal">
            Step-by-step interactive exploration from narrative case studies to core algorithmic recursion concepts.
          </p>
        </div>
      </div>

      {/* Right Section (60vw) */}
      <div className="w-[60vw] h-screen flex flex-col justify-center items-center p-12 relative overflow-y-auto bg-slate-950">
        <div className="w-full max-w-xl space-y-6">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Available Modules</h2>
            <p className="text-slate-400 text-sm mt-1">Select a module to start learning</p>
          </div>

          <div className="space-y-4">
            {modulesList.map((mod) => (
              <div
                key={mod.id}
                className="group flex items-center justify-between p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-1">
                      {mod.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-normal">
                      {mod.description} • <span className="text-slate-500">{mod.totalBeats} Beats</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartModule(mod.id)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-blue-500/20 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
