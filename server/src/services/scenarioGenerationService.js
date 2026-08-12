const store = require('../data/store');
const aiProviderFactory = require('./ai/aiProviderFactory');
const promptTemplates = require('./ai/promptTemplates');
const { parseJsonResponse, assertHasKeys } = require('./ai/aiResponseValidator');
const { enrichScenarioDetail } = require('./scenarioEnrichment');
const { DIFFICULTIES } = require('./ai/conceptVocabulary');

const REQUIRED_FIELDS = ['title', 'context', 'objectives', 'prompt', 'sampleReasoning', 'concepts', 'difficulty'];

/**
 * Turns the AI's raw JSON output into the same shape as a hand-authored
 * scenario in db.json. This is the key architectural decision for Phase 3:
 * the AI only invents creative *content* (title, context, objectives,
 * reasoning). It never invents Python code or a computational-thinking
 * mapping - those are produced by the exact same deterministic pipeline
 * Phase 1 already uses (services/scenarioEnrichment.js + learningEngine.js),
 * so every generated scenario is guaranteed to have real, verified-correct
 * Python code, exactly like the hand-authored ones.
 */
function normalizeGeneratedScenario(raw, fallback) {
  assertHasKeys(raw, REQUIRED_FIELDS, 'Scenario generation');

  const difficulty = DIFFICULTIES.includes(raw.difficulty) ? raw.difficulty : (fallback.difficulty || 'Beginner');
  const concepts = Array.isArray(raw.concepts) && raw.concepts.length
    ? raw.concepts.map((concept) => String(concept).toLowerCase())
    : [String(fallback.concept || 'variables').toLowerCase()];

  // guidedQuestions is optional (older callers / providers that don't
  // return it just fall back to scenarioEnrichment's generic templates -
  // see buildGuidedQuestions there), so it's validated loosely rather than
  // required.
  const guidedQuestions = Array.isArray(raw.guidedQuestions)
    ? raw.guidedQuestions
      .filter((entry) => entry && entry.question)
      .map((entry) => ({ question: String(entry.question), hint: entry.hint ? String(entry.hint) : '' }))
    : undefined;

  return {
    title: String(raw.title).trim(),
    difficulty,
    concepts,
    context: String(raw.context).trim(),
    prompt: String(raw.prompt).trim(),
    objectives: Array.isArray(raw.objectives) ? raw.objectives.map(String) : [String(raw.objectives)],
    sampleReasoning: String(raw.sampleReasoning).trim(),
    ...(guidedQuestions?.length ? { guidedQuestions } : {}),
    effectivenessScore: 80,
    source: 'ai-generated',
    theme: fallback.theme || null,
    generatedFor: fallback.learnerId || null
  };
}

function dedupeTitle(title, existingTitles) {
  if (!existingTitles.includes(title)) return title;
  let attempt = 2;
  let candidate = `${title} (${attempt})`;
  while (existingTitles.includes(candidate) && attempt < 20) {
    attempt += 1;
    candidate = `${title} (${attempt})`;
  }
  return candidate;
}

async function generateAndPersist(promptRequest, fallbackParams) {
  const existingTitles = await store.listScenarioTitles();
  const aiResponse = await aiProviderFactory.complete(promptRequest);
  const raw = parseJsonResponse(aiResponse.text);
  const normalized = normalizeGeneratedScenario(raw, fallbackParams);
  normalized.title = dedupeTitle(normalized.title, existingTitles);

  const scenario = await store.addScenario(normalized);
  return { scenario: enrichScenarioDetail(scenario), providerUsed: aiResponse.providerUsed };
}

/**
 * Feature 1: AI Scenario Generator - learner picks concept, difficulty, and
 * theme explicitly.
 */
async function generateScenario({ concept, difficulty, theme, learnerId }) {
  if (!concept || !difficulty || !theme) {
    throw Object.assign(new Error('concept, difficulty, and theme are required'), { status: 400 });
  }
  const existingTitles = await store.listScenarioTitles();
  const promptRequest = promptTemplates.scenarioGenerationPrompt({ concept, difficulty, theme, existingTitles });
  return generateAndPersist(promptRequest, { concept, difficulty, theme, learnerId });
}

/**
 * Feature 2: Custom Scenario Prompt - learner describes any situation in
 * free text; the AI infers the concept, difficulty, and theme.
 */
async function generateCustomScenario({ description, learnerId }) {
  if (!description?.trim()) {
    throw Object.assign(new Error('description is required'), { status: 400 });
  }
  const existingTitles = await store.listScenarioTitles();
  const promptRequest = promptTemplates.scenarioGenerationPrompt({ description, existingTitles });
  return generateAndPersist(promptRequest, { description, learnerId });
}

/**
 * Enhancement Proposal #11: generate three distinct scenario drafts
 * instead of persisting one immediately, so the learner can pick whichever
 * resonates. Drafts are NOT written to the scenario store yet - nothing is
 * persisted until selectGeneratedScenario() below is called - so calling
 * this endpoint repeatedly never litters the scenario library with unused
 * drafts. Each draft is enriched with a full preview (generated code, CT
 * mapping, hints, example I/O) exactly like a persisted scenario would be,
 * so the picker UI can show a genuine preview, not just a title.
 */
async function buildOptionDrafts(promptRequest, fallbackParams) {
  const existingTitles = await store.listScenarioTitles();
  const aiResponse = await aiProviderFactory.complete(promptRequest);
  const raw = parseJsonResponse(aiResponse.text);
  const rawOptions = Array.isArray(raw.options) ? raw.options : [raw];

  const seenTitles = [...existingTitles];
  const drafts = rawOptions.slice(0, 3).map((option) => {
    const normalized = normalizeGeneratedScenario(option, fallbackParams);
    normalized.title = dedupeTitle(normalized.title, seenTitles);
    seenTitles.push(normalized.title);
    // enrichScenarioDetail only needs scenario fields, not a persisted
    // _id - this preview never touches the store.
    return enrichScenarioDetail(normalized);
  });

  return { options: drafts, providerUsed: aiResponse.providerUsed };
}

async function generateScenarioOptions({ concept, difficulty, theme, learnerId }) {
  if (!concept || !difficulty || !theme) {
    throw Object.assign(new Error('concept, difficulty, and theme are required'), { status: 400 });
  }
  const existingTitles = await store.listScenarioTitles();
  const promptRequest = promptTemplates.scenarioOptionsPrompt({ concept, difficulty, theme, existingTitles });
  return buildOptionDrafts(promptRequest, { concept, difficulty, theme, learnerId });
}

async function generateCustomScenarioOptions({ description, learnerId }) {
  if (!description?.trim()) {
    throw Object.assign(new Error('description is required'), { status: 400 });
  }
  const existingTitles = await store.listScenarioTitles();
  const promptRequest = promptTemplates.scenarioOptionsPrompt({ description, existingTitles });
  return buildOptionDrafts(promptRequest, { description, learnerId });
}

/**
 * Persists whichever draft the learner picked from the three options.
 * Re-validates and re-dedupes the title against the *current* scenario
 * list (in case something else was created in the meantime), so this
 * stays safe even if the draft is a little stale.
 */
async function selectGeneratedScenario({ draft, learnerId }) {
  if (!draft || typeof draft !== 'object') {
    throw Object.assign(new Error('draft is required'), { status: 400 });
  }
  const existingTitles = await store.listScenarioTitles();
  const normalized = normalizeGeneratedScenario(draft, {
    concept: draft.concepts?.[0],
    difficulty: draft.difficulty,
    theme: draft.theme,
    learnerId
  });
  normalized.title = dedupeTitle(normalized.title, existingTitles);

  const scenario = await store.addScenario(normalized);
  return { scenario: enrichScenarioDetail(scenario) };
}

module.exports = {
  generateScenario,
  generateCustomScenario,
  generateScenarioOptions,
  generateCustomScenarioOptions,
  selectGeneratedScenario
};
