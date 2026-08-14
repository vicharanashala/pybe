import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function FillInTheBlankEditor({ onUnlockFullEditor }) {
  const [keywordClass, setKeywordClass] = useState('');
  const [className, setClassName] = useState('');
  const [initMethod, setInitMethod] = useState('');
  const [selfParam, setSelfParam] = useState('');
  const [feedback, setFeedback] = useState('');

  const isComplete =
    keywordClass.trim().toLowerCase() === 'class' &&
    className.trim().toLowerCase() === 'fox' &&
    initMethod.trim() === '__init__' &&
    selfParam.trim().toLowerCase() === 'self';

  const handleVerify = () => {
    if (isComplete) {
      setFeedback('✨ Perfect Class Blueprint! The magical tether is established.');
      if (onUnlockFullEditor) {
        onUnlockFullEditor();
      }
    } else {
      setFeedback("⚠️ Check your entries! Keyword must be 'class', Class Name 'Fox', Method '__init__', and Parameter 'self'.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto h-full p-6 flex flex-col justify-between select-none relative overflow-y-auto bg-slate-950 border-4 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.4)] rounded-3xl text-slate-100 font-mono">
      {/* Header */}
      <div className="space-y-2 border-b border-purple-500/30 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold font-serif-magical text-amber-300">
            🧩 Chapter Blueprint Scaffold
          </span>
          <span className="text-xs bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-400/40 text-purple-200">
            Guided Assembly
          </span>
        </div>
        <p className="text-xs text-slate-400 font-sans-rounded">
          Fill in the missing magical keywords to construct your first Python Class tether.
        </p>
      </div>

      {/* Guided Fill in the Blank Code Form */}
      <div className="my-auto space-y-4 py-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 font-mono-code text-sm">
        {feedback && (
          <div className={`p-2.5 rounded-xl text-xs font-sans-rounded text-center ${isComplete ? 'bg-emerald-950/80 border border-emerald-400 text-emerald-200' : 'bg-rose-950/80 border border-rose-400 text-rose-200'}`}>
            {feedback}
          </div>
        )}

        {/* Line 1: class Fox: */}
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-indigo-400 font-bold"># 1. Define Blueprint Keyword</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={keywordClass}
            onChange={(e) => setKeywordClass(e.target.value)}
            placeholder="class"
            className="w-20 px-2 py-1 rounded bg-slate-950 border border-indigo-500/50 text-indigo-300 font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Fox"
            className="w-20 px-2 py-1 rounded bg-slate-950 border border-amber-500/50 text-amber-300 font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <span className="text-slate-200 font-bold">:</span>
        </div>

        {/* Line 2: def __init__(self, name, fur): */}
        <div className="pl-4 space-y-2 border-l-2 border-slate-800 pt-2">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-[#FF6B35]">def</span>
            <input
              type="text"
              value={initMethod}
              onChange={(e) => setInitMethod(e.target.value)}
              placeholder="__init__"
              className="w-24 px-2 py-1 rounded bg-slate-950 border border-rose-500/50 text-rose-300 font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <span className="text-slate-300">(</span>
            <input
              type="text"
              value={selfParam}
              onChange={(e) => setSelfParam(e.target.value)}
              placeholder="self"
              className="w-16 px-2 py-1 rounded bg-slate-950 border border-purple-500/50 text-purple-300 font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <span className="text-slate-300">, name, fur):</span>
          </div>

          <div className="pl-4 text-xs text-slate-500 space-y-1">
            <p>self.name = name</p>
            <p>self.fur = fur</p>
            <p>self.legs = 4</p>
            <p>self.tails = 1</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.04, textShadow: '0px 0px 8px rgb(255,255,255)' }}
        whileTap={{ scale: 0.92 }}
        onClick={handleVerify}
        className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-[#A855F7] to-[#EC4899] text-white font-bold font-serif-magical tracking-wider text-xs shadow-lg border border-white/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        <span>✨ Unlock Full Python Editor ➔</span>
      </motion.button>
    </div>
  );
}
