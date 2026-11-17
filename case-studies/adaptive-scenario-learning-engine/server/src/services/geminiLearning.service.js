const { DEFAULT_AGE_GROUP, getAudienceGuidance, normalizeAgeGroup } = require('./ageGroup.service');

function normalizeConceptText(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ');
}

function extractAnchorConcepts(previousScenario) {
  const anchors = [];
  const focusList = Array.isArray(previousScenario?.teachingFocus) ? previousScenario.teachingFocus : [];
  for (const item of focusList) {
    const normalized = normalizeConceptText(item);
    if (normalized) anchors.push(normalized);
  }
  return [...new Set(anchors)];
}

function validateScenarioContinuity(scenarios, anchorConcepts = []) {
  if (!Array.isArray(scenarios) || scenarios.length === 0 || anchorConcepts.length === 0) return scenarios;
  const anchors = anchorConcepts.map(normalizeConceptText).filter(Boolean);
  if (anchors.length === 0) return scenarios;
  for (const scenario of scenarios) {
    const teachingFocus = Array.isArray(scenario?.teachingFocus) ? scenario.teachingFocus : [];
    const normalizedFocus = teachingFocus.map(normalizeConceptText).filter(Boolean);
    if (normalizedFocus.length === 0) throw new Error('Gemini scenario is missing teaching focus for concept continuity.');
    if (normalizedFocus.some((focus) => !anchors.includes(focus))) {
      throw new Error('Gemini story introduced a new concept family. Keep the next story within the current Python lesson.');
    }
  }
  return scenarios;
}

function parseModelJson(text) {
  const cleaned = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('Gemini response did not contain a JSON object.');
  return JSON.parse(cleaned.slice(start, end + 1));
}

function requireText(value, field, maxLength = 4000) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    throw new Error(`Gemini returned an invalid ${field}.`);
  }
  return value.trim();
}

function normalizeTeachingReview(value) {
  if (!value || !['success', 'struggle', 'incomplete'].includes(value.outcome)) {
    throw new Error('Gemini returned an invalid learning outcome.');
  }
  const teachingPoints = Array.isArray(value.teachingPoints)
    ? value.teachingPoints.slice(0, 4).map((item) => requireText(item, 'teaching point', 400))
    : [];
  const pointAward = Number.isInteger(value.pointAward) ? Math.max(0, Math.min(value.pointAward, 20)) : 0;
  return {
    outcome: value.outcome,
    feedback: requireText(value.feedback, 'feedback', 900),
    teachingPoints,
    pointAward,
    reflectionPrompt: requireText(value.reflectionPrompt, 'reflection prompt', 300),
  };
}

function normalizeScenario(value) {
  if (!value || typeof value !== 'object') throw new Error('Gemini returned an invalid scenario.');
  const constraints = Array.isArray(value.constraints) ? value.constraints.slice(0, 5).map((item) => requireText(item, 'constraint', 300)) : [];
  const possibleSolutions = Array.isArray(value.possibleSolutions) ? value.possibleSolutions.slice(0, 5).map((item) => requireText(item, 'possible solution', 300)) : [];
  if (constraints.length === 0 || possibleSolutions.length === 0) throw new Error('Gemini scenario is missing constraints or approaches.');
  return {
    title: requireText(value.title, 'scenario title', 120),
    difficulty: 'AI story',
    narrative: requireText(value.narrative, 'scenario narrative', 800),
    goal: requireText(value.goal, 'scenario goal', 500),
    prompt: requireText(value.prompt, 'learner prompt', 500),
    constraints,
    possibleSolutions,
    context: requireText(value.context, 'scenario context', 800),
    teachingFocus: Array.isArray(value.teachingFocus)
      ? value.teachingFocus.slice(0, 4).map((item) => requireText(item, 'teaching focus', 200))
      : [],
  };
}

function createLocalLearningService() {
  const { evaluateWithFallback, generateEndlessFallbackScenario } = require('./fallbackLearning.service');
  return {
    isConfigured: () => false,
    async reviewAttempt(args) { return evaluateWithFallback(args); },
    async generateNextScenarios(args) {
      return [0, 1, 2].map(alternativeIndex => generateEndlessFallbackScenario({ ...args, learnerId: args.learnerId || 'local-reader', attemptNumber: args.attemptNumber || 1, alternativeIndex }));
    },
  };
}
// Retain the former factory name for imports; passed credentials/transports are ignored.
module.exports = { createLocalLearningService, createGeminiLearningService: createLocalLearningService, normalizeScenario, normalizeTeachingReview, parseModelJson };
