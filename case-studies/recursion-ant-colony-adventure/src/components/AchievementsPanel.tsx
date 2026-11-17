// Achievements panel — shows locked/unlocked badges with XP values.
// Rendered as a slide-over drawer from the right.

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Achievement } from '@/data';

interface AchievementsPanelProps {
  open: boolean;
  onClose: () => void;
  achievements: Achievement[];
  unlocked: string[];
}

export default function AchievementsPanel({ open, onClose, achievements, unlocked }: AchievementsPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-amber-200/20 bg-gradient-to-b from-stone-900 to-stone-950 p-6 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-200">Achievements</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
                aria-label="Close achievements"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {achievements.map((a) => {
                const isUnlocked = unlocked.includes(a.id);
                const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[a.icon] ?? Icons.Sparkles;
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                      isUnlocked
                        ? 'border-amber-400/40 bg-amber-500/10'
                        : 'border-stone-700 bg-stone-800/40 opacity-70'
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                        isUnlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {isUnlocked ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold ${isUnlocked ? 'text-stone-100' : 'text-stone-400'}`}>{a.name}</p>
                      <p className="text-xs text-stone-400">{a.description}</p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-bold text-amber-300">+{a.xp}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
