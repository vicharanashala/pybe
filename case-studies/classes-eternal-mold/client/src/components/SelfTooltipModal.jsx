import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelfTooltipModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="inline-block relative">
      <span
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="font-mono font-bold text-amber-300 underline underline-offset-4 decoration-amber-400 decoration-wavy cursor-pointer hover:text-amber-200 transition-colors px-1 py-0.5 rounded bg-purple-950/80 border border-amber-400/40"
      >
        self
      </span>

      {/* Picture-in-Picture Comic Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-2xl bg-[#131127] border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.6)] z-50 pointer-events-none text-slate-100 font-sans-rounded"
          >
            <div className="flex items-center space-x-3 mb-2 border-b border-amber-500/30 pb-2">
              <span className="text-3xl">🦊👉</span>
              <div>
                <h4 className="text-xs font-bold font-serif-magical text-amber-300">
                  The 'self' Tether Comic
                </h4>
                <p className="text-[10px] font-mono text-purple-200">
                  Picture-in-Picture Visual Concept
                </p>
              </div>
            </div>

            <div className="bg-purple-950/80 p-3 rounded-xl border border-purple-500/40 space-y-1 text-center">
              <p className="text-xs font-semibold text-amber-200">
                "Bind this name to MYSELF! Bind this color to MYSELF!"
              </p>
              <p className="text-[10px] text-slate-300 leading-snug">
                The fox points at its own chest. <span className="font-mono font-bold text-amber-300">self</span> tethers data directly to the specific object instance being born!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
