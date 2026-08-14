// Scene player — orchestrates one scene: cinematic camera move over the
// colony viewer, sequential narration, an interactive action phase, the
// quiz, and (for the reveal scene) the recursion reveal. Advances the
// learner to the next scene on completion.
//
// Progressive disclosure: nothing in the colony appears before the activity
// that creates it finishes. Activities permanently reveal the layer they
// target — a shaft, a chamber, eggs, food, larvae, ventilation, or the
// base-case rock — so the colony builds itself exactly in story order.

import { useEffect, useState, useMemo, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Hand, RotateCcw, Eye, EyeOff, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';
import type { Scene, ChamberSpec, SceneAction, SceneLayer } from '@/data';
import Narration from '@/components/Narration';
import QuizCard from '@/components/QuizCard';
import ChamberModal from '@/components/ChamberModal';
import PythonCodeReveal from '@/components/PythonCodeReveal';
import PhotoStage from '@/components/PhotoStage';
import ConclusionCard from '@/components/ConclusionCard';
import TransitionReel from '@/components/TransitionReel';
import { useColonyCamera } from '@/components/colony/useColonyCamera';
import ColonyMinimap from '@/components/colony/ColonyMinimap';
import { shaftBottomY, VENT_XS } from '@/components/colony/geometry';
import { playSfx } from '@/audio/soundEngine';

const AntColony = lazy(() => import('@/components/AntColony'));

type Stage = 'narration' | 'action' | 'code' | 'quiz' | 'conclusion' | 'bridge' | 'done';

const ALL_LAYERS: SceneLayer[] = ['shaft', 'eggs', 'food', 'larvae', 'ventilation', 'obstacle'];

interface ScenePlayerProps {
  scene: Scene;
  index: number;
  total: number;
  recursionDiscovered: boolean;
  onSceneComplete: (sceneId: number, xp: number) => void;
  onQuizAnswered: (sceneId: number, correct: boolean) => void;
  onDiscoverRecursion: () => void;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
  hasNext: boolean;
}

function activitySfx(id: string): Parameters<typeof playSfx>[0] {
  if (id === 'dig' || id === 'probe') return 'dig';
  if (id === 'carve' || id === 'found' || id === 'celebrate' || id === 'carve-a' || id === 'carve-b') return 'chamber';
  if (id === 'signal') return 'signal';
  if (id === 'brigade') return 'brigade';
  if (id === 'vent') return 'vent';
  if (id === 'hatch' || id === 'transport' || id === 'stock' || id === 'tend') return 'egg';
  return 'click';
}

// An activity may reveal one layer or several — normalize to a list.
function revealsOf(act: SceneAction): SceneLayer[] {
  if (!act.reveals) return [];
  return Array.isArray(act.reveals) ? act.reveals : [act.reveals];
}

export default function ScenePlayer({
  scene,
  index,
  total,
  recursionDiscovered,
  onSceneComplete,
  onQuizAnswered,
  onDiscoverRecursion,
  onPrev,
  onNext,
  onExit,
  hasNext,
}: ScenePlayerProps) {
  const [stage, setStage] = useState<Stage>('narration');
  const [activeActivity, setActiveActivity] = useState<SceneAction | null>(null);
  const [narrationIndex, setNarrationIndex] = useState(0);
  const [highlightedChamber, setHighlightedChamber] = useState<string | null>(null);
  const [openChamber, setOpenChamber] = useState<ChamberSpec | null>(null);
  const [visibleChamberIds, setVisibleChamberIds] = useState<string[]>([]);
  const [revealedLayers, setRevealedLayers] = useState<string[]>([]);
  // Activities the learner has actually run this scene (drives the ✓ state
  // for observation activities that reveal no layer).
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  // Pending activity/quiz timers — cleared when the scene changes so a
  // reveal from a previous scene never leaks into the next one.
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  // Chambers that appear only once their carve activity completes.
  const revealChamberIds = useMemo(
    () =>
      new Set(
        scene.activity
          .filter((a) => revealsOf(a).includes('chamber') && a.chamberId)
          .map((a) => a.chamberId as string),
      ),
    [scene],
  );

  // Camera springs + framing for the colony viewer.
  const allChamberIds = useMemo(() => scene.colonyState.chambers.map((c) => c.id), [scene]);
  const shaftRevealed = revealedLayers.includes('shaft');
  const obstacle =
    scene.colonyState.obstacle && revealedLayers.includes('obstacle') ? scene.colonyState.obstacle : null;
  // The camera frames the full colony, so it learns where the base-case rock
  // sits straight from the scene data. Otherwise the probe click could never
  // pull the view down to a rock that isn't revealed until the probe lands.
  const plannedBottom = shaftBottomY(scene.colonyState.chambers, allChamberIds, true, scene.colonyState.obstacle);
  const camera = useColonyCamera({
    chambers: scene.colonyState.chambers,
    visibleChamberIds,
    shaftRevealed,
    obstacle: scene.colonyState.obstacle,
    activeActivity,
    plannedBottom,
    ventXs: VENT_XS,
  });

  // Reset the revealed state for each scene.
  useEffect(() => {
    clearTimers();
    playSfx('transition');
    setStage('narration');
    setActiveActivity(null);
    setNarrationIndex(0);
    setHighlightedChamber(null);
    setOpenChamber(null);
    setVisibleChamberIds(scene.colonyState.chambers.filter((c) => !revealChamberIds.has(c.id)).map((c) => c.id));
    setRevealedLayers(ALL_LAYERS.filter((l) => !scene.activity.some((a) => revealsOf(a).includes(l))));
    setCompletedActivityIds([]);
    camera.intro();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, revealChamberIds]);

  const handleNarrationDone = () => {
    if (scene.activity.length) {
      setStage('action');
    } else if (scene.phase === 'reveal') {
      setStage('code');
    } else if (scene.quiz) {
      setStage('quiz');
    } else {
      finishScene();
    }
  };

  const runActivity = (act: SceneAction) => {
    if (activeActivity) return;
    setActiveActivity(act);
    playSfx(activitySfx(act.id));
    if (act.chamberId) setHighlightedChamber(act.chamberId);
    // The layer appears once the work is done, not on click.
    timers.current.push(
      window.setTimeout(() => {
        if (act.chamberId) {
          setVisibleChamberIds((prev) => (prev.includes(act.chamberId as string) ? prev : [...prev, act.chamberId as string]));
        }
        for (const l of revealsOf(act)) {
          if (l === 'chamber') continue;
          setRevealedLayers((prev) => (prev.includes(l) ? prev : [...prev, l]));
        }
        // Observation activities (no reveals) still complete — the learner
        // gets a checkpoint (✓) rather than a persistent new layer.
        setCompletedActivityIds((prev) => (prev.includes(act.id) ? prev : [...prev, act.id]));
      }, 1400),
    );
    timers.current.push(
      window.setTimeout(() => {
        setActiveActivity(null);
        setHighlightedChamber(null);
      }, 2600),
    );
  };

  const awardScene = () => {
    onSceneComplete(scene.id, scene.xp);
    if (scene.discoversRecursion && !recursionDiscovered) {
      onDiscoverRecursion();
    }
  };

  const finishScene = () => {
    awardScene();
    setStage('done');
  };

  // A conclusion may hand off in three ways: a manual button with a bridge
  // (Scene 12) plays the word reel before advancing; a manual button without
  // one jumps straight on; a no-button conclusion auto-advances to the next
  // scene so the documentary flow never stalls on a done screen. XP is
  // awarded exactly once via awardScene().
  const handleConclusionDone = () => {
    awardScene();
    if (scene.bridge) {
      setStage('bridge');
    } else if (hasNext) {
      onNext();
    } else {
      setStage('done');
    }
  };

  // The bridge reel has finished — land in the next scene.
  const handleBridgeDone = () => {
    if (hasNext) {
      onNext();
    } else {
      setStage('done');
    }
  };

  const handleQuizAnswered = (correct: boolean) => {
    onQuizAnswered(scene.id, correct);
    timers.current.push(
      window.setTimeout(() => {
        if (correct && scene.conclusion) {
          setStage('conclusion');
        } else {
          finishScene();
        }
      }, 1800),
    );
  };

  const handleChamberClick = (c: ChamberSpec) => {
    playSfx('click');
    setOpenChamber(c);
  };

  const ventilation = scene.colonyState.ventilation && revealedLayers.includes('ventilation');
  // The founding chamber's clutch was settled in Scene 1 — in later scenes it
  // stays put regardless of when the current scene reveals the eggs layer.
  const foundingEggsSettled = !revealChamberIds.has('founding');

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-950">
      {/* Cinematic colony backdrop with camera motion + drag-to-pan */}
      <div
        ref={camera.containerRef}
        {...camera.dragProps}
        className="absolute inset-0 touch-none select-none"
        style={{ cursor: 'grab' }}
      >
        <Suspense fallback={<div className="h-full w-full bg-stone-900" />}>
          <AntColony
            ants={scene.colonyState.ants}
            chambers={scene.colonyState.chambers}
            visibleChamberIds={visibleChamberIds}
            eggs={scene.colonyState.eggs}
            larvae={scene.colonyState.larvae}
            ventilation={ventilation}
            obstacle={obstacle}
            revealedLayers={revealedLayers}
            activeActivity={activeActivity}
            highlightedChamber={highlightedChamber}
            foundingEggsSettled={foundingEggsSettled}
            onChamberClick={handleChamberClick}
            camera={{ x: camera.x, y: camera.y, scale: camera.scale }}
          />
        </Suspense>
      </div>

      {/* Dark vignette overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/85" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-stone-950/40" />

      {/* Top bar: scene title + nav */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6">
        <button
          onClick={onExit}
          className="flex items-center gap-1 rounded-full bg-stone-900/70 px-3 py-1.5 text-sm text-stone-200 backdrop-blur transition hover:bg-stone-800"
        >
          <ChevronLeft className="h-4 w-4" /> Map
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/70">
            Scene {index + 1} of {total}
          </p>
          <h1 className="text-xl font-bold text-stone-50 sm:text-2xl">{scene.title}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="rounded-full bg-stone-900/70 p-2 text-stone-200 backdrop-blur transition hover:bg-stone-800 disabled:opacity-30"
            aria-label="Previous scene"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => (stage === 'done' ? onNext() : finishScene())}
            disabled={!hasNext && stage === 'done'}
            className="rounded-full bg-stone-900/70 p-2 text-stone-200 backdrop-blur transition hover:bg-stone-800 disabled:opacity-30"
            aria-label="Next scene"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Subtitle */}
      <p className="relative z-20 px-4 text-center text-sm text-amber-200/80 sm:px-0">{scene.subtitle}</p>

      {/* Reality photograph stage — real colony photos above the dimmed animation.
          Photos advance with the narration; the compare layout (both photos side
          by side) is shown while the "what changed" question is being answered. */}
      {scene.images && scene.images.length > 0 && stage !== 'bridge' && (
        <PhotoStage
          images={scene.images}
          activeIndex={narrationIndex}
          compare={(stage === 'action' || stage === 'quiz') && scene.images.length > 1}
          active={stage === 'action' && activeActivity !== null}
          compact={stage === 'action' || stage === 'quiz' || stage === 'conclusion'}
        />
      )}

      {/* Word-by-word transition reel (Scene 12 → Python) — covers everything. */}
      {stage === 'bridge' && scene.bridge && (
        <TransitionReel words={scene.bridge} onDone={handleBridgeDone} />
      )}

      {/* Recursion pattern hint */}
      {scene.recursionStep && stage !== 'narration' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full border border-amber-400/30 bg-stone-900/80 px-4 py-1.5 text-xs text-amber-200 backdrop-blur sm:top-24"
        >
          <span className="font-mono">↻ {scene.recursionStep.label}</span>
          {scene.recursionStep.repeats && (
            <span className="ml-2 text-amber-300/60">repeats: {scene.recursionStep.repeats}</span>
          )}
        </motion.div>
      )}

      {/* Bottom interaction dock */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {stage === 'narration' && (
            <motion.div key="narr" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}>
              <Narration lines={scene.narration} onComplete={handleNarrationDone} onIndexChange={setNarrationIndex} />
            </motion.div>
          )}

          {stage === 'action' && (
            <motion.div
              key="action"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mx-auto w-full max-w-2xl"
            >
              <div className="mb-3 flex items-center gap-2 text-amber-300">
                <Hand className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Make it happen</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {scene.activity.map((act) => {
                  const actReveals = revealsOf(act);
                  // An activity is done once the learner has actually run it.
                  // Layer-based activities reveal on completion; observation
                  // activities (no reveals) just flip to a ✓ checkpoint.
                  const done = completedActivityIds.includes(act.id);
                  return (
                    <motion.button
                      key={act.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => runActivity(act)}
                      disabled={done || activeActivity !== null}
                      className={`rounded-xl border px-5 py-3 text-left backdrop-blur transition ${
                        done
                          ? 'border-emerald-400/40 bg-stone-900/50'
                          : 'border-amber-400/40 bg-stone-900/80 hover:border-amber-400 hover:bg-stone-800'
                      }`}
                    >
                      <p className={`font-semibold ${done ? 'text-emerald-300' : 'text-stone-100'}`}>
                        {done && actReveals.length === 0 ? '✓ Observed' : done ? `✓ ${act.label}` : act.label}
                      </p>
                      <p className="text-xs text-stone-400">{act.description}</p>
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => (scene.phase === 'reveal' ? setStage('code') : scene.quiz ? setStage('quiz') : finishScene())}
                  className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-stone-900 transition hover:bg-amber-400"
                >
                  {scene.phase === 'reveal' ? 'See the code' : scene.quiz ? 'Continue to quiz' : 'Finish scene'}
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'quiz' && scene.quiz && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <QuizCard quiz={scene.quiz} sceneId={scene.id} onAnswered={handleQuizAnswered} />
            </motion.div>
          )}

          {stage === 'conclusion' && scene.conclusion && (
            <motion.div
              key="conclusion"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <ConclusionCard conclusion={scene.conclusion} onDone={handleConclusionDone} />
            </motion.div>
          )}

          {stage === 'code' && scene.phase === 'reveal' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <PythonCodeReveal onContinue={() => (scene.quiz ? setStage('quiz') : finishScene())} />
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto w-full max-w-xl rounded-2xl border border-emerald-400/30 bg-stone-900/85 p-5 text-center backdrop-blur"
            >
              <p className="mb-3 text-lg font-semibold text-emerald-300">Scene complete — +{scene.xp} XP earned</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setNarrationIndex(0);
                    setStage('narration');
                  }}
                  className="flex items-center gap-1 rounded-full border border-stone-600 px-4 py-2 text-sm text-stone-200 transition hover:bg-stone-800"
                >
                  <RotateCcw className="h-4 w-4" /> Replay
                </button>
                {hasNext ? (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-1 rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-stone-900 transition hover:bg-amber-400"
                  >
                    Next scene <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={onExit}
                    className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-stone-900 transition hover:bg-amber-400"
                  >
                    Back to map
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click-to-explore hint (suppressed on photo scenes — the photos take focus) */}
      {scene.colonyState.chambers.length > 0 && stage !== 'narration' && !scene.images && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 text-xs text-amber-200/50"
        >
          tap a chamber to explore
        </motion.p>
      )}

      {/* Camera controls + minimap */}
      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex">
        <div className="w-44 overflow-hidden rounded-xl border border-stone-700/60 bg-stone-900/80 p-1.5 shadow-lg backdrop-blur">
          <ColonyMinimap
            chambers={scene.colonyState.chambers}
            visibleChamberIds={visibleChamberIds}
            shaftRevealed={shaftRevealed}
            obstacle={obstacle}
            viewport={camera.viewport}
            onJump={camera.flyTo}
          />
        </div>
        <div className="flex flex-col gap-1.5 rounded-xl border border-stone-700/60 bg-stone-900/80 p-1.5 shadow-lg backdrop-blur">
          <button
            onClick={camera.zoomIn}
            aria-label="Zoom in"
            className="rounded-lg p-2 text-stone-200 transition hover:bg-stone-700/60"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={camera.zoomOut}
            aria-label="Zoom out"
            className="rounded-lg p-2 text-stone-200 transition hover:bg-stone-700/60"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={camera.centerOnActivity}
            aria-label="Center on activity"
            className="rounded-lg p-2 text-amber-300 transition hover:bg-stone-700/60"
          >
            <Crosshair className="h-4 w-4" />
          </button>
          <button
            onClick={camera.toggleFollow}
            aria-label={camera.follow ? 'Turn off camera follow' : 'Turn on camera follow'}
            className={`rounded-lg p-2 transition hover:bg-stone-700/60 ${
              camera.follow ? 'text-emerald-300' : 'text-stone-500'
            }`}
          >
            {camera.follow ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <ChamberModal chamber={openChamber} onClose={() => setOpenChamber(null)} />
    </div>
  );
}
