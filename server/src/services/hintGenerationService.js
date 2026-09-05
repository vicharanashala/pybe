const store = require('../data/store');
const aiProviderFactory = require('./ai/aiProviderFactory');
const promptTemplates = require('./ai/promptTemplates');
const { sanitizeHint } = require('./ai/aiResponseValidator');

const VALID_LEVELS = [1, 2, 3, 4];

/**
 * Feature 8: AI Hint Generation. Unlike the static 3-hint list from Phase 2
 * (still returned on scenario detail for offline/no-JS fallback), this
 * generates a hint contextual to the learner's own current draft, and adds
 * a 4th level that reveals a partial (not final) algorithm. Every response
 * is sanitized so it can never contain the scenario's actual final code.
 */
async function generateHint({ learnerId, scenarioId, level, workspaceOverride }) {
  const numericLevel = Number(level);
  if (!VALID_LEVELS.includes(numericLevel)) {
    throw Object.assign(new Error('level must be 1, 2, 3, or 4'), { status: 400 });
  }
  const scenario = await store.getScenario(scenarioId);
  if (!scenario) throw Object.assign(new Error('Scenario not found'), { status: 404 });

  const workspace = workspaceOverride || (learnerId ? await store.getResponse(learnerId, scenarioId) : null);
  const promptRequest = promptTemplates.hintPrompt({ level: numericLevel, scenario, workspace });
  const aiResponse = await aiProviderFactory.complete(promptRequest);

  // scenarioEnrichment already computed this scenario's verified final code
  // when the scenario detail was built; recompute here defensively so the
  // sanitizer has something concrete to check the hint against.
  const { enrichScenarioDetail } = require('./scenarioEnrichment');
  const enriched = enrichScenarioDetail(scenario);

  const text = sanitizeHint(aiResponse.text, numericLevel, enriched.generatedCode);

  return { level: numericLevel, text, providerUsed: aiResponse.providerUsed };
}

module.exports = { generateHint };
