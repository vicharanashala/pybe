import React from 'react';
import { motion } from 'framer-motion';
import { forestBgImage, waxSealBgImage } from '../assets/assets';

export default function EurekaScreen({ onCreateBlueprint }) {
  const dialogueText =
    "Wait a moment... Look at this ledger! I don't carve a new emblem by hand every time I sign a page. I carved this brass stamp ONCE, and now it effortlessly creates infinite, identical wax seals! What if we did the same for our creatures? We don't need to mold every fox by hand... we need to build a Master Blueprint! A Dhancha!";

  return (
    <div
      className="w-screen h-screen relative overflow-hidden select-none font-sans-rounded z-10 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${forestBgImage})` }}
    >
      {/* Dark overlay for contrast & depth */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />

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

      {/* Top 60%: Wax Seal Image Display Area (Entire Image Visible) */}
      <section className="h-[60vh] w-full flex items-center justify-center pt-10 relative z-20 overflow-hidden px-4">
        <motion.img
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src={waxSealBgImage}
          alt="Master Wax Seal Blueprint"
          className="max-h-full max-w-full object-contain rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border-2 border-amber-400/30 pointer-events-none"
        />
      </section>

      {/* Middle 25%: Dialogue Box Area */}
      <section className="h-[25vh] w-full max-w-4xl mx-auto relative z-20 flex items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-full bg-[#4A3728] border-2 border-[#5E8C31] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between text-white overflow-y-auto"
        >
          {/* Dialogue Header */}
          <div className="flex items-center justify-between border-b border-[#5E8C31]/40 pb-2 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🧙‍♂️</span>
              <h2 className="text-base font-bold font-serif-magical text-amber-300 tracking-wide">
                Orion (Master Alchemist)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-200 bg-[#36271c] px-2.5 py-0.5 rounded-full border border-[#5E8C31] uppercase">
              THE EPIPHANY
            </span>
          </div>

          {/* Dialogue Body Text */}
          <p className="text-xs sm:text-sm text-white font-sans-rounded font-semibold leading-relaxed flex-1 flex items-center py-1">
            "{dialogueText}"
          </p>
        </motion.div>
      </section>

      {/* Bottom 15%: Empty Space with Action Button in Bottom Right Corner */}
      <section className="h-[15vh] w-full relative z-30 flex items-center justify-end px-6 sm:px-10">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06, textShadow: '0px 0px 8px rgb(255,255,255)' }}
          whileTap={{ scale: 0.94 }}
          onClick={onCreateBlueprint}
          className="px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical text-xs sm:text-sm tracking-wider shadow-[0_4px_25px_rgba(249,115,22,0.6)] border border-white/20 flex items-center space-x-2 cursor-pointer transition-all"
        >
          <span>CREATE THE MASTER BLUEPRINT ➜</span>
        </motion.button>
      </section>
    </div>
  );
}
