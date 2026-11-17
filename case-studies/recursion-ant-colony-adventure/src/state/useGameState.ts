// Global game state: XP, completed scenes, quiz correctness, achievements,
// the recursion-discovered flag, and device settings (mute). Backed by
// local-storage persistence. Exposes typed actions that the UI calls.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadProgress, saveProgress, resetProgress } from '@/storage/progress';
import { ACHIEVEMENTS, SCENES, TOTAL_SCENES, type Achievement } from '@/data';
import { playSfx, setMuted, unlockAudio } from '@/audio/soundEngine';

export interface Toast {
  id: number;
  title: string;
  body: string;
  icon: string;
  kind: 'xp' | 'achievement' | 'info';
}

let toastId = 0;

export function useGameState() {
  const [xp, setXp] = useState(0);
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);
  const [correctQuizScenes, setCorrectQuizScenes] = useState<number[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [recursionDiscovered, setRecursionDiscovered] = useState(false);
  const [lastSceneId, setLastSceneId] = useState(0);
  const [muted, setMutedState] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Hydrate from local storage on mount.
  useEffect(() => {
    let active = true;
    const p = loadProgress();
    if (!active) return;
    setXp(p.xp);
    setCompletedScenes(p.completedScenes);
    setCorrectQuizScenes(p.correctQuizScenes);
    setUnlockedAchievements(p.unlockedAchievements);
    setRecursionDiscovered(p.recursionDiscovered);
    setLastSceneId(p.lastSceneId);
    setMutedState(p.settings.muted);
    setMuted(p.settings.muted);
    setLoaded(true);
    return () => {
      active = false;
    };
  }, []);

  const state: Parameters<typeof saveProgress>[0] = useMemo(
    () => ({
      xp,
      completedScenes,
      correctQuizScenes,
      unlockedAchievements,
      recursionDiscovered,
      lastSceneId,
      settings: { muted },
    }),
    [xp, completedScenes, correctQuizScenes, unlockedAchievements, recursionDiscovered, lastSceneId, muted],
  );

  // Persist on any change.
  useEffect(() => {
    if (!loaded) return;
    saveProgress(state);
  }, [state, loaded]);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const checkAchievements = useCallback(
    (next: {
      xp: number;
      completedScenes: number[];
      correctQuizScenes: number[];
      recursionDiscovered: boolean;
    }) => {
      const newly: Achievement[] = [];
      for (const a of ACHIEVEMENTS) {
        if (unlockedAchievements.includes(a.id)) continue;
        let earned = false;
        switch (a.condition.type) {
          case 'completeScene':
            if (a.condition.value && next.completedScenes.length >= a.condition.value) earned = true;
            break;
          case 'earnXp':
            if (a.condition.value && next.xp >= a.condition.value) earned = true;
            break;
          case 'discoverRecursion':
            if (next.recursionDiscovered) earned = true;
            break;
          case 'allQuizzesCorrect':
            if (next.correctQuizScenes.length >= SCENES.filter((s) => s.quiz).length) earned = true;
            break;
        }
        if (earned) newly.push(a);
      }
      if (newly.length) {
        setUnlockedAchievements((prev) => [...prev, ...newly.map((a) => a.id)]);
        setXp((prev) => prev + newly.reduce((sum, a) => sum + a.xp, 0));
        for (const a of newly) {
          playSfx('levelup');
          pushToast({
            title: 'Achievement Unlocked',
            body: `${a.name} — ${a.description}`,
            icon: a.icon,
            kind: 'achievement',
          });
        }
      }
    },
    [unlockedAchievements, pushToast],
  );

  const completeScene = useCallback(
    (sceneId: number, earnedXp: number) => {
      setCompletedScenes((prev) => {
        if (prev.includes(sceneId)) return prev;
        const next = [...prev, sceneId];
        setXp((x) => {
          const newXp = x + earnedXp;
          playSfx('levelup');
          pushToast({ title: `+${earnedXp} XP`, body: 'Scene complete', icon: 'Star', kind: 'xp' });
          checkAchievements({
            xp: newXp,
            completedScenes: next,
            correctQuizScenes,
            recursionDiscovered,
          });
          return newXp;
        });
        return next;
      });
      setLastSceneId(sceneId);
    },
    [checkAchievements, correctQuizScenes, recursionDiscovered, pushToast],
  );

  const recordQuiz = useCallback(
    (sceneId: number, correct: boolean) => {
      if (correct) {
        setCorrectQuizScenes((prev) => {
          if (prev.includes(sceneId)) return prev;
          const next = [...prev, sceneId];
          checkAchievements({ xp, completedScenes, correctQuizScenes: next, recursionDiscovered });
          return next;
        });
      }
    },
    [xp, completedScenes, recursionDiscovered, checkAchievements],
  );

  const discoverRecursion = useCallback(() => {
    setRecursionDiscovered((prev) => {
      if (prev) return prev;
      playSfx('reveal');
      pushToast({
        title: 'Recursion Discovered',
        body: 'You named the repeating pattern — recursion revealed.',
        icon: 'Sparkles',
        kind: 'info',
      });
      checkAchievements({ xp, completedScenes, correctQuizScenes, recursionDiscovered: true });
      return true;
    });
  }, [xp, completedScenes, correctQuizScenes, checkAchievements, pushToast]);

  const reset = useCallback(() => {
    resetProgress();
    setXp(0);
    setCompletedScenes([]);
    setCorrectQuizScenes([]);
    setUnlockedAchievements([]);
    setRecursionDiscovered(false);
    setLastSceneId(0);
  }, []);

  const setLastScene = useCallback((id: number) => setLastSceneId(id), []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) {
      unlockAudio();
      playSfx('click');
    }
  }, [muted]);

  return {
    loaded,
    xp,
    completedScenes,
    correctQuizScenes,
    unlockedAchievements,
    recursionDiscovered,
    lastSceneId,
    muted,
    toasts,
    totalScenes: TOTAL_SCENES,
    achievements: ACHIEVEMENTS,
    completeScene,
    recordQuiz,
    discoverRecursion,
    reset,
    setLastScene,
    toggleMute,
    dismissToast,
    pushToast,
  };
}

export type GameState = ReturnType<typeof useGameState>;
