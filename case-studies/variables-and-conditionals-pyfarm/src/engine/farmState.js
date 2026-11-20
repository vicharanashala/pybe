import {readProgress as readCommonProgress, saveProgress as saveCommonProgress} from '../../../../library/learning/core.mjs';
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
  weather: 'sunny',
  crops: 'dry',
  currentChapter: 1,
  completedMissions: [],
};

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

    // Re-running a completed mission leaves chapter progress unchanged.
    case 'COMPLETE_MISSION': {
      if (state.completedMissions.includes(action.missionId)) return state;
      return {
        ...state,
        completedMissions: [...state.completedMissions, action.missionId],
      };
    }

    case 'RESTORE':
      return { ...INITIAL_FARM, completedMissions: validMissions(action.farm?.completedMissions) };

    case 'RESET':
      return { ...INITIAL_FARM };

    default:
      return state;
  }
}

// Store completion through PyBe; hints are chapter-specific metadata.
const STORAGE_KEY = 'pyfarm.progress.v1';
const HINTS_KEY = 'pybe-learning-v1:pyfarm:hints';
function validMissions(ids) {
  return [...new Set(Array.isArray(ids) ? ids.filter(id => CHAPTER_ORDER.some(c => c.missionId === id)) : [])];
}
export function loadProgress() {
  try {
    const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const current = readCommonProgress(localStorage, 'pyfarm').completed;
    return { completedMissions: validMissions([...current, ...validMissions(legacy.completedMissions)]),
      hintsUsed: JSON.parse(localStorage.getItem(HINTS_KEY) || 'null') || legacy.hintsUsed || {} };
  } catch { return {completedMissions: [], hintsUsed: {}}; }
}
export function saveProgress({completedMissions, hintsUsed}) {
  saveCommonProgress(localStorage, 'pyfarm', {completed: validMissions(completedMissions)});
  try { localStorage.setItem(HINTS_KEY, JSON.stringify(hintsUsed)); localStorage.removeItem(STORAGE_KEY); } catch {}
}
export function clearProgress() {
  saveCommonProgress(localStorage, 'pyfarm', {completed: []});
  try { localStorage.removeItem(HINTS_KEY); localStorage.removeItem(STORAGE_KEY); } catch {}
}
