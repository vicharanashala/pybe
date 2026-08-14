// Narration display with typewriter-style reveal and a play/advance control.
// Each line fades in sequentially; the learner advances through narration
// before the scene's interactive elements unlock.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Volume2 } from 'lucide-react';
import { playSfx } from '@/audio/soundEngine';

interface NarrationProps {
  lines: string[];
  onComplete: () => void;
  /** Called with the new narration index whenever it advances. */
  onIndexChange?: (index: number) => void;
}

export default function Narration({ lines, onComplete, onIndexChange }: NarrationProps) {
  const [index, setIndex] = useState(0);

  // Reset on mount (incl. Replay) and whenever the script changes, and tell
  // the caller so photo scenes always start on their first image.
  useEffect(() => {
    setIndex(0);
    onIndexChange?.(0);
  }, [lines, onIndexChange]);

  const advance = () => {
    playSfx('click');
    if (index < lines.length - 1) {
      const next = index + 1;
      setIndex(next);
      onIndexChange?.(next);
    } else {
      onComplete();
    }
  };

  const isLast = index >= lines.length - 1;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-amber-200/15 bg-stone-900/70 p-5 backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-amber-300/80">
        <Volume2 className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Narration</span>
        <span className="ml-auto text-xs text-stone-500">
          {index + 1} / {lines.length}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="min-h-[3rem] text-lg leading-relaxed text-stone-100"
        >
          {lines[index]}
        </motion.p>
      </AnimatePresence>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {lines.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-amber-400' : 'w-1.5 bg-stone-600'}`}
            />
          ))}
        </div>
        <button
          onClick={advance}
          className="flex items-center gap-1 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-amber-400"
        >
          {isLast ? 'Continue' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
