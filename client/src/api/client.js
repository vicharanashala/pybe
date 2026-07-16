// Small fetch wrapper shared by the whole app. The project has no axios
// dependency installed, so this mirrors axios's ergonomics (throwing on
// non-2xx responses, always returning parsed JSON) using the browser's
// native fetch, keeping the existing pattern already used in this codebase.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export function getScenarios(filters = {}) {
  const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
  const query = params.toString();
  return api(`/scenarios${query ? `?${query}` : ''}`);
}

export function getScenario(id) {
  return api(`/scenarios/${id}`);
}

export function getSessions() {
  return api('/sessions');
}

export function getAnalytics() {
  return api('/analytics');
}

export function getRoadmap() {
  return api('/roadmap');
}

export function submitSession(payload) {
  return api('/sessions', { method: 'POST', body: JSON.stringify(payload) });
}

/* ------------------------------------------------------------------ */
/* Phase 2: learner identity + workspace, progress, and dashboard APIs */
/* ------------------------------------------------------------------ */

const LEARNER_ID_KEY = 'pybe:learnerId';

// PyBe has no authentication system yet, so each browser gets a stable
// random id the first time it loads, persisted in localStorage so progress
// survives a refresh. (Real browser storage, not an in-artifact sandbox, so
// localStorage is safe to use here.)
export function getLearnerId() {
  let id = window.localStorage.getItem(LEARNER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(LEARNER_ID_KEY, id);
  }
  return id;
}

export function getResponse(scenarioId) {
  return api(`/responses/${scenarioId}?learnerId=${getLearnerId()}`);
}

export function submitResponse(scenarioId, payload) {
  return api('/responses', {
    method: 'POST',
    body: JSON.stringify({ ...payload, scenarioId, learnerId: getLearnerId() })
  });
}

export function updateProgressStep(scenarioId, step) {
  return api('/progress', {
    method: 'PUT',
    body: JSON.stringify({ scenarioId, step, learnerId: getLearnerId() })
  });
}

export function getProgress() {
  return api(`/progress?learnerId=${getLearnerId()}`);
}

export function submitReflection(scenarioId, payload) {
  return api('/reflections', {
    method: 'POST',
    body: JSON.stringify({ ...payload, scenarioId, learnerId: getLearnerId() })
  });
}

export function getDashboard() {
  return api(`/dashboard?learnerId=${getLearnerId()}`);
}

/* ------------------------------------------------------------------ */
/* Phase 3: AI-powered personalized learning APIs                     */
/* ------------------------------------------------------------------ */

export function generateScenario({ concept, difficulty, theme }) {
  return api('/ai/scenarios/generate', {
    method: 'POST',
    body: JSON.stringify({ concept, difficulty, theme, learnerId: getLearnerId() })
  });
}

export function generateCustomScenario(description) {
  return api('/ai/scenarios/custom', {
    method: 'POST',
    body: JSON.stringify({ description, learnerId: getLearnerId() })
  });
}

export function tutorChat(message, scenarioId) {
  return api('/ai/tutor/chat', {
    method: 'POST',
    body: JSON.stringify({ message, scenarioId, learnerId: getLearnerId() })
  });
}

export function getTutorHistory(scenarioId) {
  const params = new URLSearchParams({ learnerId: getLearnerId(), ...(scenarioId ? { scenarioId } : {}) });
  return api(`/ai/tutor/history?${params.toString()}`);
}

export function generateAIHint(scenarioId, level) {
  return api('/ai/hints', {
    method: 'POST',
    body: JSON.stringify({ scenarioId, level, learnerId: getLearnerId() })
  });
}

export function explainConcept(concept, mode, scenarioId) {
  return api('/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ concept, mode, scenarioId })
  });
}

export function reviewCode(code, scenarioId) {
  return api('/ai/code-review', {
    method: 'POST',
    body: JSON.stringify({ code, scenarioId, learnerId: getLearnerId() })
  });
}

export function getRecommendation() {
  return api(`/ai/recommendation?learnerId=${getLearnerId()}`);
}

export function getAdaptiveDifficulty() {
  return api(`/ai/adaptive-difficulty?learnerId=${getLearnerId()}`);
}

export function getLearningPath() {
  return api(`/ai/learning-path?learnerId=${getLearnerId()}`);
}

export function getMastery() {
  return api(`/ai/mastery?learnerId=${getLearnerId()}`);
}
