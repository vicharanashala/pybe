import React from 'react';
import { motion } from 'framer-motion';
import { forestBgImage, orionImage } from '../assets/assets';

export default function IntroScreen({ onStartMolding }) {
  const dialogueText =
    "Welcome! I'm Master Orion. It's my job to fill the Whispering Woods with magical creatures, but I can't do it all by myself anymore. Let's team up! Our very first task is to mold a Fox. Are you ready to make some magic?";

  return (
    <div
      className="w-screen h-screen relative overflow-hidden select-none font-sans-rounded z-10 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${forestBgImage})` }}
    >
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />

      {/* Header UI Elements (Absolute Top) */}
      <header className="w-full flex items-center justify-between z-30 absolute top-4 left-0 right-0 px-6 sm:px-8 pointer-events-none">
        {/* Top-Left: Title with small magical orb icon */}
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

        {/* Top-Right: Pill-shaped dark badge */}
        <div className="px-4 py-1.5 rounded-full bg-black/50 border border-amber-400/30 text-xs font-mono text-amber-200 backdrop-blur-md shadow-lg pointer-events-auto">
          Chapter I: Prologue
        </div>
      </header>

      {/* Top 60%: Character Image Area */}
      <section className="h-[60vh] w-full flex items-center justify-center pt-10 relative z-20 overflow-hidden">
        <motion.img
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          src={orionImage}
          alt="Master Orion"
          className="max-h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] pointer-events-none"
        />
      </section>

      {/* Middle 25%: Dialogue Box Area */}
      <section className="h-[25vh] w-full max-w-4xl mx-auto relative z-20 flex items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-full bg-[#4A3728] border-2 border-[#5E8C31] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between text-white overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 border-b border-[#5E8C31]/40 pb-2 shrink-0">
            <span className="text-xl">🧙‍♂️</span>
            <h2 className="text-base font-bold font-serif-magical text-amber-300 tracking-wide">
              Orion (Master Alchemist)
            </h2>
          </div>

          {/* Body Text */}
          <p className="text-sm sm:text-base text-white font-sans-rounded font-semibold leading-relaxed flex-1 flex items-center py-1">
            "{dialogueText}"
          </p>
        </motion.div>
      </section>

      {/* Bottom 15%: Empty Space with Help Button in Bottom Right Corner */}
      <section className="h-[15vh] w-full relative z-30 flex items-center justify-end px-6 sm:px-10">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06, textShadow: '0px 0px 8px rgb(255,255,255)' }}
          whileTap={{ scale: 0.94 }}
          onClick={onStartMolding}
          className="px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical text-sm sm:text-base tracking-wider shadow-[0_4px_25px_rgba(249,115,22,0.6)] border border-white/20 flex items-center space-x-2 cursor-pointer transition-all"
        >
          <span>HELP ME MOLD A FOX ➜</span>
        </motion.button>
      </section>
    </div>
  );
}




