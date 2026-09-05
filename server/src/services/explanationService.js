const store = require('../data/store');
const aiProviderFactory = require('./ai/aiProviderFactory');
const promptTemplates = require('./ai/promptTemplates');

const VALID_MODES = ['like-im-10', 'analogy', 'another-example', 'differently', 'visual-text'];

/**
 * Feature 7: AI Explanation Generator. Deliberately never cached (see
 * services/ai/aiCache.js) since the whole point is fresh wording each time.
 */
async function explain({ concept, mode, scenarioId }) {
  if (!concept?.trim()) throw Object.assign(new Error('concept is required'), { status: 400 });
  const resolvedMode = VALID_MODES.includes(mode) ? mode : 'differently';
  const scenario = scenarioId ? await store.getScenario(scenarioId) : null;

  const promptRequest = promptTemplates.explanationPrompt({ mode: resolvedMode, concept, scenario });
  const aiResponse = await aiProviderFactory.complete(promptRequest);

  return { concept, mode: resolvedMode, explanation: aiResponse.text, providerUsed: aiResponse.providerUsed };
}

module.exports = { explain, VALID_MODES };
