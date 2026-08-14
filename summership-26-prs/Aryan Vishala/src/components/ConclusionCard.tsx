// Animated post-quiz conclusion for the reality-bridge scenes (11–12).
// Lines reveal in sequence. The glow layout renders the lines as one
// centered, softly glowing sentence; an optional button gives a manual
// continue (Scene 12 → straight on to Python). Without a button the card
// auto-advances once the reveal finishes.

import { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { SceneConclusion } from '@/data';
import { playSfx } from '@/audio/soundEngine';

interface ConclusionCardProps {
  conclusion: SceneConclusion;
  onDone: () => void;
}

export default function ConclusionCard({ conclusion, onDone }: ConclusionCardProps) {
  const [revealed, setRevealed] = useState(0);
  const total = conclusion.lines.length;
  const allShown = revealed >= total;

  useEffect(() => {
    setRevealed(0);
  }, [conclusion]);

  // Reveal lines one by one.
  useEffect(() => {
    if (allShown) return;
    const t = window.setTimeout(() => {
      setRevealed((n) => n + 1);
      playSfx('click');
    }, 700);
    return () => window.clearTimeout(t);
  }, [allShown, revealed]);

  // Auto-advance a beat after the last line (only when no manual button).
  useEffect(() => {
    if (!allShown || conclusion.buttonLabel) return;
    const t = window.setTimeout(() => onDone(), 2400);
    return () => window.clearTimeout(t);
  }, [allShown, conclusion.buttonLabel, onDone]);

  if (conclusion.glow) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto w-full max-w-2xl text-center"
      >
        {conclusion.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={i < revealed ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(6px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-2xl font-semibold leading-snug text-amber-200 drop-shadow-[0_0_18px_rgba(251,191,36,0.35)] sm:text-3xl"
          >
            {line}
          </motion.p>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-amber-200/20 bg-stone-900/85 p-6 text-center shadow-2xl backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-center gap-2 text-amber-300">
        <Sparkles className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase tracking-widest">Before you go…</span>
      </div>
      <div className="space-y-2">
        {conclusion.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={i < revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="text-lg leading-relaxed text-stone-100"
          >
            {line.split('Recursion').map((part, pi, arr) => (
              <Fragment key={pi}>
                {part}
                {pi < arr.length - 1 && <span className="font-semibold text-amber-300">Recursion</span>}
              </Fragment>
            ))}
          </motion.p>
        ))}
      </div>
      {conclusion.buttonLabel && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: allShown ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          onClick={onDone}
          className="mt-6 inline-flex items-center gap-1 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-amber-400"
        >
          {conclusion.buttonLabel}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
