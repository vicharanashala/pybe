const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent`;
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

function createGeminiLearningService({ apiKey = process.env.GEMINI_API_KEY, fetchImpl = globalThis.fetch } = {}) {
  async function generateJson(prompt, { maxOutputTokens = 1200 } = {}) {
    if (!apiKey) throw new Error('Gemini is not configured. Set GEMINI_API_KEY in the server environment.');
    if (typeof fetchImpl !== 'function') throw new Error('This Node runtime does not provide fetch.');

    const endpoint = new URL(GEMINI_ENDPOINT);
    endpoint.searchParams.set('key', apiKey);
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.65, responseMimeType: 'application/json', maxOutputTokens },
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Gemini request failed with HTTP ${response.status}.`);
    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
    return parseModelJson(text);
  }

  return {
    isConfigured: () => Boolean(apiKey),

    async reviewAttempt({ scenario, reasoning, previousOutcome, attemptNumber }) {
      const prompt = `You are PyBe's patient Socratic Python mentor. Analyze the learner's actual reasoning for this scenario. Teach only the primary concept ${JSON.stringify(scenario.teachingFocus?.[0] || 'already present in the story')}; do not introduce a new Python concept. Do not praise length alone or infer intelligence. Use outcome success only when the response addresses the goal with a coherent approach and relevant evidence; use struggle for a submitted response that needs another scaffold; use incomplete only for an empty response. Give one warm, specific feedback paragraph. teachingPoints must contain exactly 3 short strings in this order: (1) a relatable everyday analogy for the concept, (2) a clear plain-language explanation of the Python idea, and (3) a tiny Python example directly adapted to this story. Keep all three focused on the same concept. Give 0-20 learning points for demonstrated reasoning/evidence (not correctness alone), and one reflective follow-up question. Return only JSON with keys outcome (success|struggle|incomplete), feedback, teachingPoints (string array), pointAward (integer), reflectionPrompt. Scenario: ${JSON.stringify({ title: scenario.title, goal: scenario.goal, prompt: scenario.prompt, constraints: scenario.constraints, teachingFocus: scenario.teachingFocus || [] })}. Learner reasoning: ${JSON.stringify(reasoning)}. Previous outcome: ${previousOutcome || 'none'}. Attempt number: ${attemptNumber || 1}.`;
      return normalizeTeachingReview(await generateJson(prompt));
    },

    async generateNextScenarios({ boundary, previousScenario, recentTitles = [], learnerInterests = [], mode = 'adaptive', ageGroup = DEFAULT_AGE_GROUP }) {
      const target = Number(boundary);
      const audience = normalizeAgeGroup(ageGroup) || DEFAULT_AGE_GROUP;
      const anchorConcepts = extractAnchorConcepts(previousScenario);
      const anchorText = anchorConcepts.length ? `Stay within the same Python concept family as the current lesson and anchor every story to these concepts: ${JSON.stringify(anchorConcepts)}. Do not introduce unrelated Python ideas or new concept families.` : 'Keep the stories conceptually coherent and only use a single Python topic family across the 3 stories.';
      const modeInstructions = mode === 'guided'
        ? 'Make these stories guided: state a clear goal, provide a small number of constraints, and focus on one straightforward path.'
        : mode === 'open'
          ? 'Make these stories open-ended: allow multiple reasonable paths and include meaningful trade-offs, while teaching only the current concept.'
          : 'Vary the stories from more structured to a gentle stretch.';
      const prompt = `Create exactly 3 distinct, fresh Python reasoning stories for PyBe for ages ${audience}. ${getAudienceGuidance(audience)} They must differ in setting and central problem from the previous story and from each other, but ${anchorText} Every story must list only concepts from the current focus list in teachingFocus; do not add secondary concepts. Teach through the story, not by requiring the learner to know anything beyond that focus. ${modeInstructions} Their structuredness should span manageable choices around the learner boundary ${target.toFixed(2)}: one slightly more structured (rough target ${Math.max(0, target - 0.05).toFixed(2)}), one near it (${target.toFixed(2)}), and one a gentle stretch (rough target ${Math.min(1, target + 0.05).toFixed(2)}). Do not place numeric scores in learner-facing story text. Return only JSON with key scenarios containing exactly 3 objects, each with title, narrative, goal, prompt, constraints (2-4 strings), possibleSolutions (2-4 distinct approaches), context, teachingFocus (one or more concepts copied exactly from the current focus list). Make stories meaningful, concrete, safe, and teach through the situation rather than lecturing. Previous scenario: ${JSON.stringify(previousScenario?.title || '')}. Current concept list: ${JSON.stringify(anchorConcepts)}. Recent titles: ${JSON.stringify(recentTitles.slice(-8))}. Learner interests: ${JSON.stringify(learnerInterests.slice(0, 5))}.`;
      const result = await generateJson(prompt, { maxOutputTokens: 4096 });
      if (!Array.isArray(result.scenarios) || result.scenarios.length !== 3) {
        throw new Error('Gemini must return exactly three scenario alternatives.');
      }
      const normalized = result.scenarios.map(normalizeScenario);
      return validateScenarioContinuity(normalized, anchorConcepts);
    },
  };
}

module.exports = { GEMINI_ENDPOINT, createGeminiLearningService, normalizeScenario, normalizeTeachingReview, parseModelJson };