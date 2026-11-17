// The farm's single source of truth. A plain reducer with no React and no
// browser APIs, so every progression rule below is directly unit-testable.
//
// Deliberately minimal for the MVP: no animals, market, upgrades or achievements.
// New chapters extend CHAPTER_ORDER and missions.js; nothing here needs to change.

export const CHAPTER_ORDER = [
  { id: 1, missionId: 'ch1-seeds' },
  { id: 2, missionId: 'ch2-weather' },
];

export const INITIAL_FARM = {
  coins: 100,
  seeds: 20,
  water: 50,
  xp: 0,
  level: 1,
  weather: 'sunny',
  crops: 'dry',
  currentChapter: 1,
  completedMissions: [],
};

const XP_PER_LEVEL = 100;

export function levelForXp(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/**
 * A chapter is open when every chapter before it has had its mission completed.
 * Derived rather than stored, so unlock state can never drift out of step with
 * what the learner has actually finished.
 */
export function isChapterUnlocked(chapterId, completedMissions) {
  const index = CHAPTER_ORDER.findIndex((c) => c.id === chapterId);
  if (index < 0) return false;
  return CHAPTER_ORDER.slice(0, index).every((c) => completedMissions.includes(c.missionId));
}

export function nextChapterId(chapterId) {
  const index = CHAPTER_ORDER.findIndex((c) => c.id === chapterId);
  if (index < 0 || index + 1 >= CHAPTER_ORDER.length) return null;
  return CHAPTER_ORDER[index + 1].id;
}

export function farmReducer(state, action) {
  switch (action.type) {
    // What the learner's code actually did to the farm, as worked out by a
    // mission validator from the real Python run.
    case 'APPLY_FARM_PATCH':
      return { ...state, ...action.patch };

    case 'SET_WEATHER':
      return { ...state, weather: action.weather };

    case 'OPEN_CHAPTER':
      return isChapterUnlocked(action.chapterId, state.completedMissions)
        ? { ...state, currentChapter: action.chapterId }
        : state;

    // Awarding is idempotent: re-running a solved mission must not stack XP.
    case 'COMPLETE_MISSION': {
      if (state.completedMissions.includes(action.missionId)) return state;
      const xp = state.xp + action.xp;
      return {
        ...state,
        xp,
        level: levelForXp(xp),
        completedMissions: [...state.completedMissions, action.missionId],
      };
    }

    case 'RESTORE':
      return { ...INITIAL_FARM, ...action.farm, level: levelForXp(action.farm.xp ?? 0) };

    case 'RESET':
      return { ...INITIAL_FARM };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Persistence
//
// A learner should not lose their XP to a page refresh. Only progress is stored,
// never the per-run visual state, so a reload starts each chapter's farm fresh
// while keeping what was earned. Every access is guarded: private browsing and
// blocked site data both make localStorage throw rather than return empty.

const STORAGE_KEY = 'pyfarm.progress.v1';

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      xp: Number.isFinite(parsed.xp) ? parsed.xp : 0,
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      hintsUsed: parsed.hintsUsed && typeof parsed.hintsUsed === 'object' ? parsed.hintsUsed : {},
    };
  } catch {
    return null;
  }
}

export function saveProgress({ xp, completedMissions, hintsUsed }) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp, completedMissions, hintsUsed }));
  } catch {
    // Progress is a convenience, not the feature. If the browser refuses to
    // store it, the chapter still plays through normally.
  }
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // see saveProgress
  }
}
