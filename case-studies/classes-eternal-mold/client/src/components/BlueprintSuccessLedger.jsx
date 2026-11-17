import React from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from './ConfettiEffect';

export default function BlueprintSuccessLedger({ onProceed }) {
  return (
    <div className="w-full max-w-xl ml-auto h-full flex flex-col justify-between select-none relative p-1">
      {/* Confetti Celebration overlay */}
      <ConfettiEffect />

      {/* Frosted Glass Panel Container */}
      <div className="w-full h-full p-[2px] rounded-3xl bg-gradient-to-br from-emerald-400/80 via-amber-400/70 to-emerald-500/80 shadow-[0_0_50px_rgba(52,211,153,0.3)] relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
        
        {/* Ambient Content Box */}
        <div className="w-full h-full bg-black/75 rounded-[22px] p-6 flex flex-col justify-between relative z-10 text-white overflow-y-auto space-y-4">
          
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-2 border-b border-amber-500/30 pb-3 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">✨</span>
                <h2 className="text-sm sm:text-base font-bold font-serif text-amber-300 tracking-wider uppercase drop-shadow">
                  THE BLUEPRINT INCANTATION LEDGER
                </h2>
              </div>
              
              {/* Success Badge */}
              <span className="text-[11px] font-mono bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.4)] font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Status: FORGED SUCCESSFULLY</span>
              </span>
            </div>
            <p className="text-[11px] font-sans text-emerald-200/90">
              The Master Dhancha has been compiled into Python bytecode.
            </p>
          </div>

          {/* Completed Python Code Block */}
          <div className="my-auto py-2">
            <div className="bg-[#070d12]/95 p-5 rounded-2xl border border-emerald-400/60 shadow-[inset_0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs sm:text-sm leading-relaxed space-y-3 relative overflow-hidden">
              
              {/* Code Comment Header */}
              <div className="text-emerald-400/90 text-[11px] italic flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <span># Master Blueprint successfully compiled</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">Python 3.11</span>
              </div>

              {/* Code Line 1: class Fox: */}
              <div className="flex items-center space-x-2 text-slate-100 font-bold">
                <span className="text-slate-500 select-none text-[11px] w-4">1</span>
                <span className="text-amber-300 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">class</span>
                <span className="text-emerald-300 text-sm font-extrabold">Fox</span>
                <span className="text-white">:</span>
              </div>

              {/* Indented Method Block */}
              <div className="pl-6 space-y-2 text-xs border-l-2 border-emerald-500/40">
                {/* Code Line 2: def __init__(self, name, essence): */}
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-slate-500 select-none text-[11px] w-4 -ml-4">2</span>
                  <span className="text-orange-400 font-bold">def</span>
                  <span className="text-orange-400 font-bold drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">__init__</span>
                  <span className="text-white">(</span>
                  <span className="text-sky-300 font-bold">self</span>
                  <span className="text-white">, name, essence):</span>
                </div>

                {/* Code Lines 3-6: Method Body */}
                <div className="pl-4 space-y-1.5 font-mono text-xs text-slate-200">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">3</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.name = name</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">4</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.essence = essence</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">5</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.legs =</span>
                    <span className="text-emerald-400 font-bold"> 4</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">6</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.tails =</span>
                    <span className="text-emerald-400 font-bold"> 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button: Proceed to Summoning */}
          <div className="pt-2 relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-emerald-500/40 rounded-full blur-md opacity-80 animate-pulse pointer-events-none" />
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onProceed}
              className="relative w-full py-4 px-6 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold font-serif tracking-wider text-xs sm:text-sm shadow-[0_0_30px_rgba(16,185,129,0.6)] border border-emerald-300/60 flex items-center justify-center space-x-3 cursor-pointer transition-all duration-300"
            >
              <span className="text-lg">🔮</span>
              <span className="font-extrabold tracking-wider text-white text-xs sm:text-sm drop-shadow uppercase">
                PROCEED TO SUMMONING RITUAL ➔
              </span>
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
}
