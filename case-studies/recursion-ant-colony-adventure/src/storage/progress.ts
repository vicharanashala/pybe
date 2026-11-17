// Persistent local storage for learner progress (XP, completed scenes,
// quiz answers, unlocked achievements, and device settings like mute).
// Kept intentionally simple so the experience works fully offline.

const KEY = 'recursive-explorer-progress-v2';

export interface ProgressState {
  xp: number;
  completedScenes: number[];
  correctQuizScenes: number[];
  unlockedAchievements: string[];
  recursionDiscovered: boolean;
  lastSceneId: number;
  settings: { muted: boolean };
}

const DEFAULT: ProgressState = {
  xp: 0,
  completedScenes: [],
  correctQuizScenes: [],
  unlockedAchievements: [],
  recursionDiscovered: false,
  lastSceneId: 0,
  settings: { muted: false },
};

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return { ...DEFAULT, settings: { ...DEFAULT.settings } };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, settings: { ...DEFAULT.settings } };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...DEFAULT, ...parsed, settings: { ...DEFAULT.settings, ...(parsed.settings ?? {}) } };
  } catch {
    return { ...DEFAULT, settings: { ...DEFAULT.settings } };
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

export function resetProgress() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* non-fatal */
  }
}
