// Modal that reveals chamber details when a learner clicks a chamber in
// the colony viewer. Uses progressive disclosure to show purpose + facts.

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ChamberSpec } from '@/data';

interface ChamberModalProps {
  chamber: ChamberSpec | null;
  onClose: () => void;
}

const CHAMBER_FACTS: Record<string, string[]> = {
  founding: [
    'A newly mated queen digs this first room alone and seals herself in.',
    'She raises her first brood here, feeding the eggs from her own reserves.',
  ],
  nursery: [
    'Eggs and tiny larvae are kept here where temperature stays steady.',
    'Worker ants rotate the eggs to keep them evenly warmed.',
  ],
  food: [
    'Seeds and foraged food are stacked here for the colony to eat later.',
    'Some ants farm fungus here instead of storing seeds.',
  ],
  brood: [
    'Larvae and pupae grow here, fed and groomed by nurses.',
    'Deeper chambers stay cooler — ideal for developing young.',
  ],
  'gallery-a': [
    'A shallow horizontal room, hollowed out once the rock blocked going deeper.',
    'Just below the surface, this soil stays loose and easy to carve.',
  ],
  'gallery-b': [
    'A room hollowed out beneath the shallow gallery line.',
    'Sideways rooms let the colony grow wider when depth is exhausted.',
  ],
  queen: [
    'The queen lives deepest, where it is safest and coolest.',
    'She can lay thousands of eggs in her lifetime.',
  ],
};

export default function ChamberModal({ chamber, onClose }: ChamberModalProps) {
  return (
    <AnimatePresence>
      {chamber && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-amber-200/20 bg-gradient-to-b from-stone-800 to-stone-900 p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-amber-200">{chamber.name}</h3>
                <p className="text-sm text-stone-400">Depth {chamber.depth}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-stone-400 transition hover:bg-stone-700 hover:text-stone-100"
                aria-label="Close chamber details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-stone-200">{chamber.purpose}</p>
            <ul className="space-y-2">
              {(CHAMBER_FACTS[chamber.id] ?? []).map((fact, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-300">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {fact}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
