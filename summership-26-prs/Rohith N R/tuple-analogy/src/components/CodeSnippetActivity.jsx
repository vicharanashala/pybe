import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, Code2 } from 'lucide-react';

export default function CodeSnippetActivity({ title, score, setScore, snippets, onNext, onPrev }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [droppedId, setDroppedId] = useState(null);
  const [shake, setShake] = useState(false);
  const [showError, setShowError] = useState(false);

  const dropZoneRef = useRef(null);

  // Safety fallback if no snippets are provided
  if (!snippets || snippets.length === 0) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="font-bold text-xl">No code challenges available.</p>
      </div>
    );
  }

  const currentSnippet = snippets[currentIndex];
  const isLastSnippet = currentIndex === snippets.length - 1;

  const isPointInside = (point, ref) => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    return (
      point.x >= rect.left + window.scrollX &&
      point.x <= rect.right + window.scrollX &&
      point.y >= rect.top + window.scrollY &&
      point.y <= rect.bottom + window.scrollY
    );
  };

  const handleDrop = (option, point) => {
    if (isPointInside(point, dropZoneRef)) {
      // SET THE DROPPED ID IMMEDIATELY - THIS LOCKS IN THE SINGLE ATTEMPT
      setDroppedId(option.id);
      
      if (option.isCorrect) {
        setShowError(false);
        if (setScore) setScore(prevScore => prevScore + 1);
      } else {
        setShake(true);
        setShowError(true);
        setTimeout(() => setShake(false), 500);
        // Removed the timeout that resets showError, so it stays wrong!
      }
    }
  };

  const handleNextAction = () => {
    if (!isLastSnippet) {
      // Move to next challenge and reset states
      setCurrentIndex((prev) => prev + 1);
      setDroppedId(null);
      setShowError(false);
    } else {
      // If it's the last challenge, move to the Quiz
      onNext();
    }
  };

  const isComplete = droppedId !== null;
  const droppedOption = currentSnippet.options.find((o) => o.id === droppedId);

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in slide-in-from-right duration-500 pb-24 pt-8 relative">

      {/* Header */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-end pr-32">
          <h2 className="text-4xl font-black uppercase bg-sky-400 inline-block self-start px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl flex items-center gap-3">
            <p size={32} strokeWidth={3} /> {title} 
          </h2>
          
        </div>

        <p className="text-xl font-bold text-gray-800">
          {currentSnippet.instruction || "Drag the correct code snippet into the blank space to complete the program!"}
        </p>
      </div>

      {/* Main Code Card */}
      <div className="w-full bg-yellow-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="bg-fuchsia-400 px-4 py-3 border-b-4 border-black flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-black" />
          <div className="w-4 h-4 rounded-full bg-white border-2 border-black" />
          <div className="w-4 h-4 rounded-full bg-white border-2 border-black" />
          <span className="ml-4 font-mono text-black text-sm font-black tracking-widest uppercase">
            bittu_and_grandpa.py
          </span>
        </div>

        <div ref={dropZoneRef} className="p-8 font-mono text-xl text-indigo-900 leading-relaxed whitespace-pre-wrap">
          {currentSnippet.beforeCode}

          {/* Drop Zone */}
          <motion.span
            ref={dropZoneRef}
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`inline-flex items-center justify-center min-w-[180px] h-10 mx-2 px-4 rounded-xl border-4 align-middle font-bold ${
              isComplete && !showError
                ? 'bg-emerald-300 border-emerald-600 text-emerald-900 shadow-[inset_0_0_0px_rgba(0,0,0,0)]'
                : showError
                ? 'bg-rose-300 border-rose-600 text-rose-900'
                : 'bg-white border-dashed border-indigo-400 text-indigo-300'
            }`}
          >
            {isComplete ? droppedOption.text : 'DROP HERE'}
          </motion.span>

          {currentSnippet.afterCode}
        </div>
      </div>

      {/* Snippet Tray */}
      <div className="w-full bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-black text-lg uppercase tracking-widest text-zinc-500">
            Available Snippets:
          </span>
          <AnimatePresence>
            {showError && isComplete && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-600 font-black flex items-center gap-2 bg-red-100 px-3 py-1 rounded-lg border-2 border-red-600"
              >
                <XCircle size={20} strokeWidth={3} /> Incorrect!
              </motion.span>
            )}
            {!showError && isComplete && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-emerald-600 font-black flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-lg border-2 border-emerald-600"
              >
                <CheckCircle2 size={20} strokeWidth={3} /> Code Completed!
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-4">
          {currentSnippet.options.map((option) => {
            const isUsed = droppedId === option.id;
            return (
              <motion.div
                key={option.id}
                drag
                dragListener={!isComplete && !isUsed}
                dragMomentum={false}
                dragElastic={0.08}
                dragTransition={{ bounceStiffness: 700, bounceDamping: 25, power: 0.2 }}
                dragSnapToOrigin={true}
                onDragEnd={(e, info) => handleDrop(option, info.point)}
                whileHover={!isComplete && !isUsed ? { y: -4, boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' } : {}}
                whileDrag={{ scale: 1.1, zIndex: 9999, cursor: 'grabbing', boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)' }}
                style={{ boxShadow: !isUsed ? '4px 4px 0px 0px rgba(0,0,0,1)' : 'none' }}
                className={`relative font-mono text-lg border-4 border-black rounded-xl px-5 py-3 ${
                  isComplete || isUsed ? 'pointer-events-none ' : ''
                }${
                  isUsed
                    ? 'bg-zinc-200 text-zinc-400 opacity-50'
                    : isComplete
                    ? 'bg-sky-100 text-sky-900 opacity-50'
                    : 'bg-sky-100 text-sky-900 cursor-grab'
                }`}
              >
                {option.text}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between w-full pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-4 bg-zinc-200 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
        >
          <ChevronLeft size={24} strokeWidth={3} /> BACK TO ANALOGY
        </button>

        <button
          onClick={handleNextAction}
          disabled={!isComplete}
          className="px-8 py-4 bg-yellow-300 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex items-center gap-2"
        >
          {isLastSnippet ? "TAKE THE QUIZ" : "NEXT CHALLENGE"} <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}