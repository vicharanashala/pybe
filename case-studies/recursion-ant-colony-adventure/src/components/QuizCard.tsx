// Quiz interaction card. Shows a question, options, and feedback. Reports
// correctness to the parent (which records it and awards XP).

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';
import type { QuizQuestion } from '@/data';
import { playSfx } from '@/audio/soundEngine';

interface QuizCardProps {
  quiz: QuizQuestion;
  sceneId: number;
  onAnswered: (correct: boolean) => void;
}

export default function QuizCard({ quiz, onAnswered }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    const correct = idx === quiz.answerIndex;
    setAnswered(true);
    playSfx(correct ? 'correct' : 'wrong');
    onAnswered(correct);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-amber-200/20 bg-stone-900/80 p-6 shadow-2xl backdrop-blur"
    >
      <div className="mb-4 flex items-center gap-2 text-amber-300">
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Quick Check</span>
        <span className="ml-auto text-xs text-amber-200/70">+{quiz.xp} XP</span>
      </div>
      <p className="mb-5 text-lg font-medium text-stone-100">{quiz.prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {quiz.options.map((opt, idx) => {
          const isCorrect = idx === quiz.answerIndex;
          const isChosen = idx === selected;
          let cls = 'border-stone-700 bg-stone-800/60 hover:border-amber-400/60 hover:bg-stone-800';
          if (answered) {
            if (isCorrect) cls = 'border-emerald-400 bg-emerald-500/15';
            else if (isChosen) cls = 'border-rose-400 bg-rose-500/15';
            else cls = 'border-stone-700 bg-stone-800/40 opacity-60';
          }
          return (
            <button
              key={idx}
              type="button"
              disabled={answered}
              onClick={() => handleSelect(idx)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-stone-100 transition ${cls}`}
            >
              <span>{opt}</span>
              {answered && isCorrect && <Check className="h-5 w-5 text-emerald-400" />}
              {answered && isChosen && !isCorrect && <X className="h-5 w-5 text-rose-400" />}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <p className="rounded-lg bg-stone-800/80 p-3 text-sm text-stone-300">
              {quiz.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
