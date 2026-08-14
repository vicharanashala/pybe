import { ReactNode, useState, useEffect } from 'react';
import { ScrollText, CheckCircle2, ChevronRight, Play, Code, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LessonLayoutProps {
  title: string;
  narrative: ReactNode;
  instruction: ReactNode;
  interactionArea: ReactNode;
  codeArea: ReactNode;
  showSuccess: boolean;
  successMessage: string;
  onComplete: () => void;
  isLastLesson: boolean;
  onRevealCode?: () => void;
  conceptExplanation?: ReactNode;
}

export function LessonLayout({
  title, narrative, instruction, interactionArea, codeArea, showSuccess, successMessage, onComplete, isLastLesson, onRevealCode, conceptExplanation
}: LessonLayoutProps) {
  const [phase, setPhase] = useState<'story' | 'activity' | 'explanation'>('story');

  useEffect(() => {
    setPhase('story');
  }, [title]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDF8F0] overflow-hidden text-stone-800">
      <header className="px-8 py-6 border-b border-amber-200 bg-orange-50/50 flex items-center justify-between shrink-0 shadow-sm relative z-20">
        <div>
          <div className="flex items-center gap-2 text-amber-700 mb-2 text-sm font-bold tracking-widest uppercase">
            <ScrollText className="w-4 h-4" />
            <span>Lesson Case Study</span>
          </div>
          <h2 className="text-3xl font-bold text-amber-900">{title}</h2>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto flex flex-col items-center p-8 relative">
        <AnimatePresence mode="wait">
          {phase === 'story' && (
            <motion.div 
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl flex flex-col items-center gap-10 pb-12"
            >
              <div className="w-full flex flex-col gap-6 shrink-0 mt-8">
                <div className="bg-white/80 rounded-2xl p-8 border border-amber-200 shadow-sm leading-relaxed text-stone-700 text-xl font-medium">
                  {narrative}
                </div>
                
                <button
                  onClick={() => setPhase('activity')}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer text-lg mt-4"
                >
                  <Play className="w-5 h-5" />
                  Start Activity
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'activity' && (
            <motion.div 
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl flex flex-col items-center gap-10 pb-12"
            >
              <div className="w-full flex flex-col gap-6 shrink-0 mt-8">
                <div className="bg-amber-100/50 border border-amber-300 rounded-2xl p-6 text-amber-900 shadow-inner">
                  <h3 className="font-bold text-amber-800 mb-2 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Play className="w-3 h-3" /> Action Required
                  </h3>
                  {instruction}
                </div>
              </div>

              <div className="w-full flex flex-col items-center relative z-10 w-full">
                {interactionArea}
                {showSuccess && <div className="absolute inset-0 z-10" />}
              </div>

              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <button
                      onClick={() => {
                        setPhase('explanation');
                        onRevealCode?.();
                      }}
                      className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer text-lg"
                    >
                      <Code className="w-5 h-5" />
                      See the Code
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'explanation' && (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl flex flex-col items-center gap-10 pb-12"
            >
              {/* SECTION B: Live Code */}
              <div className="w-full shrink-0 relative z-20 mt-8">
                {codeArea}
              </div>

              {/* SECTION C: Explanation & Next */}
              <div className="w-full flex flex-col gap-6 shrink-0 relative z-20">
                {conceptExplanation && (
                  <div className="bg-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Concept Breakdown
                    </h3>
                    <div className="text-stone-700 leading-relaxed text-lg">
                      {conceptExplanation}
                    </div>
                  </div>
                )}
                
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                  <h3 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Code Explained
                  </h3>
                  <p className="text-emerald-900 text-lg mb-6">{successMessage}</p>
                  
                  <button
                    onClick={onComplete}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md text-lg"
                  >
                    {isLastLesson ? 'Finish Chapter' : 'Next Chapter'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
