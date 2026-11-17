// Scene map / chapter selection hub. Shows all scenes as a vertical journey
// from surface to deep colony, with completion state and XP. Locked logic is
// soft — learners can revisit any explored scene, and continue from the next.

import { motion } from 'framer-motion';
import { Check, Lock, Play, ChevronLeft, Trophy, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import type { Scene } from '@/data';

interface SceneMapProps {
  scenes: Scene[];
  completedScenes: number[];
  lastSceneId: number;
  xp: number;
  muted: boolean;
  onToggleMute: () => void;
  onSelect: (scene: Scene) => void;
  onOpenAchievements: () => void;
  onExit: () => void;
  onReset: () => void;
}

export default function SceneMap({
  scenes,
  completedScenes,
  lastSceneId,
  xp,
  muted,
  onToggleMute,
  onSelect,
  onOpenAchievements,
  onExit,
  onReset,
}: SceneMapProps) {
  const nextSceneId = scenes.find((s) => !completedScenes.includes(s.id))?.id ?? scenes[scenes.length - 1].id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-950 to-black px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-4xl items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1 rounded-full bg-stone-800/70 px-3 py-1.5 text-sm text-stone-200 transition hover:bg-stone-800"
        >
          <ChevronLeft className="h-4 w-4" /> Home
        </button>
        <h1 className="text-xl font-bold text-amber-200 sm:text-2xl">Choose Your Path</h1>
        <div className="flex gap-2">
          <button
            onClick={onToggleMute}
            className="rounded-full bg-stone-800/70 p-2 text-stone-200 transition hover:bg-stone-800"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 rounded-full bg-stone-800/70 px-3 py-2 text-stone-200 transition hover:bg-stone-800"
          >
            <Trophy className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-semibold">{xp}</span>
          </button>
        </div>
      </div>

      {/* Progress summary bar */}
      <div className="mx-auto mb-10 max-w-4xl">
        <div className="mb-2 flex items-center justify-between text-sm text-stone-400">
          <span>Colony progress</span>
          <span>
            {completedScenes.length} / {scenes.length} scenes
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-stone-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
            initial={{ width: 0 }}
            animate={{ width: `${(completedScenes.length / scenes.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Scene cards as a descending journey */}
      <div className="mx-auto max-w-4xl space-y-4">
        {scenes.map((scene, i) => {
          const completed = completedScenes.includes(scene.id);
          const isNext = scene.id === nextSceneId;
          const isLocked = !completed && !isNext;
          const isLast = scene.id === lastSceneId;
          return (
            <motion.button
              key={scene.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={!isLocked ? { scale: 1.01, x: 4 } : {}}
              onClick={() => !isLocked && onSelect(scene)}
              disabled={isLocked}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                completed
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : isNext
                    ? 'border-amber-400/50 bg-amber-500/10'
                    : 'border-stone-800 bg-stone-900/50 opacity-60'
              } ${isLast ? 'ring-2 ring-amber-400/40' : ''} ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Scene number / status badge */}
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                  completed
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : isNext
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-stone-800 text-stone-500'
                }`}
              >
                {completed ? <Check className="h-6 w-6" /> : isLocked ? <Lock className="h-5 w-5" /> : scene.id}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-bold text-stone-100 sm:text-lg">{scene.title}</h3>
                  {scene.phase === 'reveal' && (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      Reveal
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-stone-400">{scene.subtitle}</p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <span className="hidden text-xs font-semibold text-amber-300/80 sm:inline">+{scene.xp} XP</span>
                {!isLocked && <Play className="h-5 w-5 text-stone-300" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Reset progress */}
      {completedScenes.length > 0 && (
        <div className="mx-auto mt-10 max-w-4xl text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 transition hover:text-rose-400"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset all progress
          </button>
        </div>
      )}
    </div>
  );
}
