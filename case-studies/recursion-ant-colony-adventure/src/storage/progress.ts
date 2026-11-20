// Persistent local storage for learner progress (XP, completed scenes,
// quiz answers, unlocked achievements, and device settings like mute).
// Kept intentionally simple so the experience works fully offline.

const KEY = 'pybe-learning-v1:ant-colony:state';
const LEGACY_KEY = 'recursive-explorer-progress-v2';

export interface ProgressState {
  completedScenes: number[];
  correctQuizScenes: number[];
  recursionDiscovered: boolean;
  lastSceneId: number;
  settings: { muted: boolean };
}

const DEFAULT: ProgressState = {
  completedScenes: [],
  correctQuizScenes: [],
  recursionDiscovered: false,
  lastSceneId: 0,
  settings: { muted: false },
};

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return { ...DEFAULT, settings: { ...DEFAULT.settings } };
  try {
    const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return { ...DEFAULT, settings: { ...DEFAULT.settings } };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {completedScenes:Array.isArray(parsed.completedScenes)?parsed.completedScenes.filter(Number.isInteger):[],correctQuizScenes:Array.isArray(parsed.correctQuizScenes)?parsed.correctQuizScenes.filter(Number.isInteger):[],recursionDiscovered:parsed.recursionDiscovered===true,lastSceneId:Number.isInteger(parsed.lastSceneId)?parsed.lastSceneId!:0,settings:{muted:parsed.settings?.muted===true}};
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
