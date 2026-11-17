// Toast notifications for XP gains, achievements, and key moments.

import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Toast } from '@/state/useGameState';

interface ToastStackProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[t.icon] ?? Icons.Sparkles;
          const accent =
            t.kind === 'achievement'
              ? 'border-amber-400/50 bg-amber-500/10'
              : t.kind === 'xp'
                ? 'border-emerald-400/50 bg-emerald-500/10'
                : 'border-sky-400/50 bg-sky-500/10';
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={() => onDismiss(t.id)}
              className={`pointer-events-auto cursor-pointer rounded-xl border ${accent} p-3 shadow-lg backdrop-blur`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-stone-900/50 p-1.5">
                  <Icon className="h-5 w-5 text-amber-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-100">{t.title}</p>
                  <p className="text-xs text-stone-300">{t.body}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
