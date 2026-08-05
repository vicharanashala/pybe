const store = require('../data/store');
const aiProviderFactory = require('./ai/aiProviderFactory');
const promptTemplates = require('./ai/promptTemplates');
const { parseJsonResponse, assertHasKeys } = require('./ai/aiResponseValidator');

const REQUIRED_FIELDS = [
  'correctness', 'readability', 'variableNaming', 'computationalThinking',
  'pythonBestPractices', 'suggestions', 'mistakes', 'overallImpression'
];

/**
 * Feature 9: AI Code Review. Deliberately does NOT execute the learner's
 * code - running arbitrary user-submitted code server-side is a real
 * security risk and out of scope here. Review is based on reading the code
 * (by the AI, or by the offline heuristic fallback), not running it.
 */
async function reviewCode({ learnerId, scenarioId, code }) {
  if (!code?.trim()) throw Object.assign(new Error('code is required'), { status: 400 });

  const scenario = scenarioId ? await store.getScenario(scenarioId) : null;
  const promptRequest = promptTemplates.codeReviewPrompt({ code, scenario });
  const aiResponse = await aiProviderFactory.complete(promptRequest);

  const raw = parseJsonResponse(aiResponse.text);
  assertHasKeys(raw, REQUIRED_FIELDS, 'Code review');

  return {
    ...raw,
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions : [String(raw.suggestions)],
    mistakes: Array.isArray(raw.mistakes) ? raw.mistakes : (raw.mistakes ? [String(raw.mistakes)] : []),
    providerUsed: aiResponse.providerUsed
  };
}

module.exports = { reviewCode };
