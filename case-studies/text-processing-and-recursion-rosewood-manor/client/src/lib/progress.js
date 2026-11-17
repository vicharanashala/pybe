// Learner progress persistence — browser-local only.
//
// PyBe is intentionally a no-database, no-auth prototype, so all progress
// (which case, which part, which sub-step, completion state, reflections, seen reveals)
// lives in `localStorage` under versioned keys with defensive parsing.
const KEY = 'pybe.progress.v1';
const REVEALS_KEY = 'pybe.reveals.v1';
const CURRENT_VERSION = 1;

export function loadSeenReveals() {
  try {
    const raw = window.localStorage.getItem(REVEALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.version === CURRENT_VERSION && Array.isArray(parsed.seen)) {
      return parsed.seen;
    }
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (error) {
    return [];
  }
}

export function saveSeenReveals(seenList) {
  try {
    const safe = Array.isArray(seenList) ? seenList : [];
    window.localStorage.setItem(
      REVEALS_KEY,
      JSON.stringify({ version: CURRENT_VERSION, seen: safe, lastUpdated: new Date().toISOString() })
    );
  } catch (error) {}
}

export function markRevealSeen(partId) {
  if (!partId) return;
  const current = loadSeenReveals();
  if (!current.includes(partId)) {
    const updated = [...current, partId];
    saveSeenReveals(updated);
    return updated;
  }
  return current;
}

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const seenFromKey = loadSeenReveals();
    if (!raw) {
      const fresh = freshProgress();
      fresh.seenReveals = seenFromKey;
      return fresh;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || parsed.version !== CURRENT_VERSION) {
      const fresh = freshProgress();
      fresh.seenReveals = seenFromKey;
      return fresh;
    }
    const mergedReveals = Array.isArray(parsed.seenReveals)
      ? [...new Set([...parsed.seenReveals, ...seenFromKey])]
      : seenFromKey;

    return {
      version: CURRENT_VERSION,
      onboarded: Boolean(parsed.onboarded),
      caseSolved: Boolean(parsed.caseSolved),
      solvedAt: typeof parsed.solvedAt === 'string' ? parsed.solvedAt : null,
      currentCaseId: typeof parsed.currentCaseId === 'string' ? parsed.currentCaseId : null,
      currentPartId: typeof parsed.currentPartId === 'string' ? parsed.currentPartId : null,
      subStepIndex: parsed.subStepIndex && typeof parsed.subStepIndex === 'object' && !Array.isArray(parsed.subStepIndex) ? parsed.subStepIndex : {},
      revealedSuspectIds: Array.isArray(parsed.revealedSuspectIds) ? parsed.revealedSuspectIds : [],
      questionAttempts: parsed.questionAttempts && typeof parsed.questionAttempts === 'object' && !Array.isArray(parsed.questionAttempts) ? parsed.questionAttempts : {},
      completedSlideIds: Array.isArray(parsed.completedSlideIds) ? parsed.completedSlideIds : [],
      completedParts: Array.isArray(parsed.completedParts) ? parsed.completedParts : [],
      completedAt: parsed.completedAt && typeof parsed.completedAt === 'object' && !Array.isArray(parsed.completedAt) ? parsed.completedAt : {},
      reflections: parsed.reflections && typeof parsed.reflections === 'object' && !Array.isArray(parsed.reflections) ? parsed.reflections : {},
      seenReveals: mergedReveals
    };
  } catch (error) {
    return freshProgress();
  }
}

export function saveProgress(progress) {
  try {
    const safe = progress && typeof progress === 'object' ? progress : freshProgress();
    const seen = Array.isArray(safe.seenReveals) ? safe.seenReveals : loadSeenReveals();
    saveSeenReveals(seen);
    window.localStorage.setItem(KEY, JSON.stringify({ ...safe, seenReveals: seen, version: CURRENT_VERSION, lastUpdated: new Date().toISOString() }));
  } catch (error) {}
}

export function resetProgress() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(REVEALS_KEY);
    window.localStorage.removeItem('pybe.ledger.v1');
  } catch (error) {}
  return freshProgress();
}

function freshProgress() {
  return {
    version: CURRENT_VERSION,
    onboarded: false,
    caseSolved: false,
    solvedAt: null,
    currentCaseId: null,
    currentPartId: null,
    subStepIndex: {},
    revealedSuspectIds: [],
    questionAttempts: {},
    completedSlideIds: [],
    completedParts: [],
    completedAt: {},
    reflections: {},
    seenReveals: []
  };
}


export function partStep(progress, partId, fallback = 0) {
  if (!progress || !progress.subStepIndex || typeof progress.subStepIndex !== 'object') return fallback;
  const index = progress.subStepIndex[partId];
  return typeof index === 'number' ? index : fallback;
}
