// Full-screen word-by-word transition reel (Scene 12 → Python).
//
// Words fade in one at a time, stacked vertically with arrow glyphs between
// them ("Nature → Same Rule → Recursion → Python"). After the last word has
// settled the whole reel fades out and onDone() fires. The reel sits above
// every other layer (z-40) so the colony, dock, and top bar are all covered.

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playSfx } from '@/audio/soundEngine';

interface TransitionReelProps {
  words: string[];
  onDone: () => void;
}

const WORD_STAGGER_MS = 500;
const END_HOLD_MS = 500;

export default function TransitionReel({ words, onDone }: TransitionReelProps) {
  const [shown, setShown] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  // Reveal one word at a time with a soft tick.
  useEffect(() => {
    if (shown >= words.length) return;
    const t = window.setTimeout(() => {
      setShown((n) => n + 1);
      playSfx('click');
    }, WORD_STAGGER_MS);
    return () => window.clearTimeout(t);
  }, [shown, words.length]);

  // Hold after the last word, then fade out and finish.
  useEffect(() => {
    if (shown < words.length) return;
    const t = window.setTimeout(() => {
      setExiting(true);
      playSfx('reveal');
    }, END_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [shown, words.length]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (exiting) finish();
      }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-stone-950"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(251,191,36,0.08), rgba(0,0,0,0) 60%)',
        }}
      />
      <div className="relative flex flex-col items-center gap-4 text-center">
        {words.slice(0, shown).map((word, i) => (
          <div key={word} className="flex flex-col items-center gap-4">
            {i > 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-2xl leading-none text-amber-500/70"
              >
                ↓
              </motion.span>
            )}
            <motion.p
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="text-4xl font-bold tracking-wide text-stone-100 sm:text-5xl"
            >
              {word}
            </motion.p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
