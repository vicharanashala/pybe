import React from 'react';
import { motion } from 'framer-motion';

export default function ConsoleOutput({ output = [], onClear }) {
  return (
    <div className="w-full h-full bg-[#090814] border border-purple-900/50 rounded-2xl p-3 font-mono text-xs text-slate-200 flex flex-col justify-between overflow-hidden shadow-inner relative">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-1.5 mb-1.5">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300 font-serif-magical text-[11px] tracking-wider uppercase">
            The Scrying Pool Terminal
          </span>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 cursor-pointer"
          >
            Clear Pool
          </button>
        )}
      </div>

      {/* Console Log Lines Container */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono">
        {output.length === 0 ? (
          <div className="text-slate-500 italic text-[11px] pt-1">
            The Scrying Pool is still... Cast a spell to observe the magical output.
          </div>
        ) : (
          output.map((line, index) => {
            if (line.type === 'orion_misfire') {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2.5 rounded-xl bg-amber-950/90 border border-amber-400/80 text-amber-200 space-y-1 shadow-md"
                >
                  <div className="flex items-center space-x-1.5 font-bold text-amber-300 text-[11px]">
                    <span>🧙‍♂️ Master Orion Guidance:</span>
                  </div>
                  <p className="text-xs leading-relaxed font-sans-rounded font-semibold">
                    {line.text}
                  </p>
                </motion.div>
              );
            }

            if (line.type === 'error') {
              return (
                <div key={index} className="text-rose-400 font-mono text-[11px] leading-tight">
                  ❌ {line.text}
                </div>
              );
            }

            if (line.type === 'system') {
              return (
                <div key={index} className="text-cyan-300 font-mono text-[11px]">
                  {line.text}
                </div>
              );
            }

            return (
              <div key={index} className="text-slate-200 font-mono text-[11px]">
                {line.text}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
