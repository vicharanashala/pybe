// Recursive Explorer: Ant Colony Adventure — application shell.
// Routes between the title screen, scene map, and scene player, and hosts
// the global toast stack + achievements drawer. Sound + mute live here.

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TitleScreen from '@/components/TitleScreen';
import SceneMap from '@/components/SceneMap';
import ScenePlayer from '@/components/ScenePlayer';
import ToastStack from '@/components/ToastStack';
import AchievementsPanel from '@/components/AchievementsPanel';
import { useGameState } from '@/state/useGameState';
import { unlockAudio, playSfx } from '@/audio/soundEngine';
import { SCENES } from '@/data';
import type { Scene } from '@/data';

type View = 'title' | 'map' | 'scene';

export default function App() {
  const game = useGameState();
  const [view, setView] = useState<View>('title');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  // Unlock audio on first user interaction.
  useEffect(() => {
    const handler = () => unlockAudio();
    window.addEventListener('pointerdown', handler, { once: true });
    return () => window.removeEventListener('pointerdown', handler);
  }, []);

  const begin = useCallback(() => {
    unlockAudio();
    playSfx('click');
    if (game.lastSceneId > 0 && game.completedScenes.length > 0) {
      // Resume: go to map, focused on next unfinished scene.
      setView('map');
    } else {
      // Fresh start: jump into scene 1.
      setSceneIndex(0);
      setView('scene');
    }
  }, [game.lastSceneId, game.completedScenes.length]);

  const selectScene = useCallback(
    (scene: Scene) => {
      playSfx('click');
      const idx = SCENES.findIndex((s) => s.id === scene.id);
      setSceneIndex(Math.max(0, idx));
      game.setLastScene(scene.id);
      setView('scene');
    },
    [game],
  );

  const nextScene = useCallback(() => {
    setSceneIndex((i) => {
      const n = Math.min(i + 1, SCENES.length - 1);
      game.setLastScene(SCENES[n].id);
      return n;
    });
  }, [game]);

  const prevScene = useCallback(() => {
    setSceneIndex((i) => Math.max(0, i - 1));
  }, []);

  const currentScene = SCENES[sceneIndex];

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100 antialiased">
      <AnimatePresence mode="wait">
        {view === 'title' && (
          <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TitleScreen
              xp={game.xp}
              completedCount={game.completedScenes.length}
              totalScenes={game.totalScenes}
              muted={game.muted}
              onToggleMute={game.toggleMute}
              onBegin={begin}
              onOpenAchievements={() => setAchievementsOpen(true)}
            />
          </motion.div>
        )}

        {view === 'map' && (
          <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SceneMap
              scenes={SCENES}
              completedScenes={game.completedScenes}
              lastSceneId={game.lastSceneId}
              xp={game.xp}
              muted={game.muted}
              onToggleMute={game.toggleMute}
              onSelect={selectScene}
              onOpenAchievements={() => setAchievementsOpen(true)}
              onExit={() => setView('title')}
              onReset={game.reset}
            />
          </motion.div>
        )}

        {view === 'scene' && currentScene && (
          <motion.div key={`scene-${currentScene.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScenePlayer
              scene={currentScene}
              index={sceneIndex}
              total={SCENES.length}
              recursionDiscovered={game.recursionDiscovered}
              onSceneComplete={game.completeScene}
              onQuizAnswered={game.recordQuiz}
              onDiscoverRecursion={game.discoverRecursion}
              onPrev={prevScene}
              onNext={nextScene}
              onExit={() => setView('map')}
              hasNext={sceneIndex < SCENES.length - 1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ToastStack toasts={game.toasts} onDismiss={game.dismissToast} />
      <AchievementsPanel
        open={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        achievements={game.achievements}
        unlocked={game.unlockedAchievements}
      />
    </div>
  );
}
