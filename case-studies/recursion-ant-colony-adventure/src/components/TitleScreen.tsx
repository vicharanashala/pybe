// Cinematic title screen for the experience. Animated hero with the colony
// forming in the background and a call-to-action to begin the journey.

import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Bug, Play, Trophy, Volume2, VolumeX } from 'lucide-react';

const AntColony = lazy(() => import('@/components/AntColony'));

interface TitleScreenProps {
  xp: number;
  completedCount: number;
  totalScenes: number;
  muted: boolean;
  onToggleMute: () => void;
  onBegin: () => void;
  onOpenAchievements: () => void;
}

export default function TitleScreen({
  xp,
  completedCount,
  totalScenes,
  muted,
  onToggleMute,
  onBegin,
  onOpenAchievements,
}: TitleScreenProps) {
  const resume = completedCount > 0 && completedCount < totalScenes;
  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      {/* Background colony forming */}
      <div className="absolute inset-0 opacity-60">
        <Suspense fallback={null}>
          <AntColony
            ants={28}
            chambers={[
              { id: 'founding', name: 'Founding Chamber', purpose: '', side: 'right', depth: 1 },
              { id: 'nursery', name: 'Nursery', purpose: '', side: 'right', depth: 2 },
              { id: 'food', name: 'Food Storage', purpose: '', side: 'right', depth: 3 },
              { id: 'brood', name: 'Brood Chamber', purpose: '', side: 'left', depth: 4 },
              { id: 'gallery-a', name: 'Gallery', purpose: '', side: 'left', depth: 1, x: 0.15 },
              { id: 'gallery-b', name: 'Gallery', purpose: '', side: 'left', depth: 2, x: 0.7 },
              { id: 'queen', name: "Queen's Chamber", purpose: '', side: 'right', depth: 5 },
            ]}
            visibleChamberIds={['founding', 'nursery', 'food', 'brood', 'gallery-a', 'gallery-b', 'queen']}
            eggs={40}
            larvae={30}
            ventilation
            obstacle={{ type: 'rock', depth: 6 }}
            revealedLayers={['shaft', 'eggs', 'food', 'larvae', 'ventilation', 'obstacle']}
            activeActivity={null}
            highlightedChamber={null}
            foundingEggsSettled
            onChamberClick={() => {}}
          />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/50 to-stone-950" />

      {/* Top-right controls */}
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <button
          onClick={onToggleMute}
          className="rounded-full bg-stone-900/70 p-2.5 text-stone-200 backdrop-blur transition hover:bg-stone-800"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <button
          onClick={onOpenAchievements}
          className="flex items-center gap-1.5 rounded-full bg-stone-900/70 px-3 py-2.5 text-stone-200 backdrop-blur transition hover:bg-stone-800"
        >
          <Trophy className="h-5 w-5 text-amber-300" />
          <span className="text-sm font-semibold">{xp} XP</span>
        </button>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 flex items-center gap-2 rounded-full border border-amber-400/30 bg-stone-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300 backdrop-blur"
        >
          <Bug className="h-4 w-4" /> An Interactive Learning Adventure
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-3xl bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-6xl"
        >
          Recursive Explorer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-2 text-2xl font-semibold text-stone-200 sm:text-3xl"
        >
          Ant Colony Adventure
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg"
        >
          Watch a living ant colony build itself, step by step. Discover the hidden pattern that grows
          an entire underground city — and uncover the idea of recursion along the way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            onClick={onBegin}
            className="group flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3.5 text-lg font-bold text-stone-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 hover:shadow-amber-400/30"
          >
            <Play className="h-5 w-5 transition group-hover:translate-x-0.5" />
            {resume ? 'Resume Adventure' : 'Begin Adventure'}
          </button>
        </motion.div>

        {resume && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-sm text-stone-400"
          >
            {completedCount} of {totalScenes} scenes explored
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-stone-500"
        >
          <span>Animated colony</span>
          <span className="text-stone-700">•</span>
          <span>Narrated story</span>
          <span className="text-stone-700">•</span>
          <span>Interactive quizzes</span>
          <span className="text-stone-700">•</span>
          <span>XP &amp; achievements</span>
        </motion.div>
      </div>
    </div>
  );
}
