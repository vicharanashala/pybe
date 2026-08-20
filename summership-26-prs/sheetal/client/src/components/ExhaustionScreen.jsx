import React from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';

export default function ExhaustionScreen({ onLookAround }) {
  const dialogueText =
    "Huff... puff... The magic takes its toll. The Whispering Woods are vast, apprentice. We need at least a hundred more foxes to restore the balance, but molding them one by one will take centuries! There must be a better way... a way to define the shape once and create many...";

  return (
    <div className="w-screen h-screen relative overflow-hidden flex flex-col justify-between p-6 select-none z-10">
      {/* Top-Left & Top-Right Global Headers */}
      <header className="flex items-center justify-between w-full z-30 pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-amber-400/40 backdrop-blur-md flex items-center justify-center text-xl shadow-lg">
            🔮
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif-magical text-amber-300 tracking-wider drop-shadow-md">
              CREATION
            </h1>
            <p className="text-[11px] font-mono text-slate-200 drop-shadow">
              The Interactive Canvas
            </p>
          </div>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-black/50 border border-amber-400/30 text-xs font-mono text-amber-200 backdrop-blur-md shadow-lg pointer-events-auto">
          Chapter I: Prologue
        </div>
      </header>

      {/* Empty Center Space (Environment Viewable) */}
      <div className="flex-1" />

      {/* Centered Cinematic Dialogue Box (Bottom-Center) */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-3xl mx-auto mb-6 bg-[#4A3728] border-4 border-[#5E8C31] shadow-2xl rounded-3xl p-6 flex flex-col justify-between overflow-hidden text-white relative z-20"
      >
        <div className="flex items-start space-x-4 z-10">
          {/* Master Orion Avatar Badge */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 via-emerald-600 to-amber-700 p-0.5 shadow-lg shrink-0"
          >
            <div className="w-full h-full rounded-[14px] bg-[#36271c] flex items-center justify-center overflow-hidden relative border border-emerald-400/40">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
          </motion.div>

          {/* Dialogue Text Content */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-serif-magical text-yellow-200 tracking-wider">
                Orion (Master Alchemist)
              </span>
              <span className="text-[10px] font-mono text-emerald-200 bg-[#36271c] px-2.5 py-0.5 rounded-full border border-[#5E8C31] uppercase">
                EPIPHANY
              </span>
            </div>

            {/* Typewriter Text */}
            <div className="text-sm text-white leading-relaxed font-sans-rounded font-semibold pt-1 min-h-[70px]">
              <TypewriterText text={dialogueText} speed={25} />
            </div>
          </div>
        </div>

        {/* Action Button inside Dialogue Box (Bottom-Right Corner) */}
        <div className="flex items-center justify-end pt-4 mt-2 border-t border-[#5E8C31]/40 z-10">
          <motion.button
            whileHover={{ scale: 1.04, textShadow: '0px 0px 8px rgb(255,255,255)' }}
            whileTap={{ scale: 0.92 }}
            onClick={onLookAround}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical text-xs sm:text-sm tracking-wider shadow-[0_4px_25px_rgba(249,115,22,0.5)] border border-white/20 flex items-center space-x-2 cursor-pointer transition-all"
          >
            <span>LOOK AROUND THE WORKBENCH ➜</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
