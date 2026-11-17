import React from 'react';
import { motion } from 'framer-motion';
import { useChapter } from '../context/ChapterContext';
import TypewriterText from './TypewriterText';
import ImageStage from './ImageStage';

export default function StoryCanvas({ customDialogue, currentStage = 'intro' }) {
  const { currentChapter, chapterInfo, isChapterCompleted, nextChapter } = useChapter();

  return (
    <aside className="w-full h-full flex flex-col justify-between relative select-none p-4">
      {/* 3D Fox Visual Stage (Top / Mid section floating on background) */}
      <div className="flex-1 w-full relative flex items-center justify-center min-h-[300px]">
        <ImageStage currentStage={currentStage} />
      </div>

      {/* Earthy Dialogue Box (Bottom Left) */}
      <div className={`w-full -mt-8 relative z-20 rounded-2xl p-5 flex flex-col justify-between overflow-hidden text-white shadow-2xl transition-all duration-500 ${
        currentStage === 'blueprint_success' ||
        currentStage === 'blueprint_forged' ||
        currentStage === 'summoning' ||
        currentStage === 'summoning_ritual'
          ? 'bg-[#4A3728] border-4 border-[#5E8C31]'
          : 'bg-[#1c140d]/80 backdrop-blur-md border-2 border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.3)] rounded-3xl'
      }`}>
        <div className="flex items-start space-x-4 z-10">
          {/* Master Orion Avatar Badge */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-600 to-amber-700 p-0.5 shadow-lg shrink-0"
          >
            <div className="w-full h-full rounded-[14px] bg-[#140e09] flex items-center justify-center overflow-hidden relative border border-emerald-400/40">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
          </motion.div>

          {/* Dialogue Text Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm sm:text-base font-bold font-serif text-amber-300 tracking-wider">
                Orion (Master Alchemist)
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-emerald-500/60 uppercase tracking-wider font-bold shadow">
                {currentStage === 'summoning' || currentStage === 'summoning_ritual'
                  ? 'THE GRAND FINALE / INSTANTIATION'
                  : currentStage === 'blueprint_success' || currentStage === 'blueprint_forged'
                  ? 'THE EPIPHANY / SUCCESS'
                  : currentStage === 'fill_in_the_blank'
                  ? 'THE AMEZEHT LESSON'
                  : currentStage === 'molding_2'
                  ? 'MOLDING - NEXT CREATURE'
                  : currentStage === 'molding_3'
                  ? 'MOLDING - FINAL CREATURE'
                  : currentStage.replace('_', ' ')}
              </span>
            </div>

            {/* Typewriter Text */}
            <div className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans font-medium pt-1 min-h-[55px]">
              <TypewriterText
                key={customDialogue || chapterInfo.dialogue}
                text={customDialogue || chapterInfo.dialogue}
                speed={25}
              />
            </div>
          </div>
        </div>

        {/* Bottom Next Chapter Trigger */}
        {isChapterCompleted && currentStage === 'full_editor' && (
          <div className="flex items-center justify-end pt-3 border-t border-[#5E8C31]/40 text-xs text-slate-200 font-sans-rounded z-10">
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={nextChapter}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical text-xs shadow-[0_4px_15px_rgba(249,115,22,0.5)] border border-white/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Next Chapter ➔</span>
            </motion.button>
          </div>
        )}
      </div>
    </aside>
  );
}

