const anthropic = require('./anthropic');
const openai = require('./openai');
const xai = require('./xai');
const minimax = require('./minimax');
const gemini = require('./gemini');
const custom = require('./custom');

const AI_PROVIDERS = ['anthropic', 'openai', 'xai', 'minimax', 'gemini', 'custom'];

const registry = { anthropic, openai, xai, minimax, gemini, custom };

/**
 * Dispatches to the right provider adapter. Every adapter takes the same
 * shape in and returns the same shape out (a plain text string) so nothing
 * downstream (validator, draft store, review UI) needs to know which
 * provider actually answered.
 */
async function generateWithProvider({ providerName, apiKey, model, baseUrl, systemPrompt, userMessage }) {
  if (!AI_PROVIDERS.includes(providerName)) {
    throw new Error(`Unknown provider "${providerName}". Expected one of: ${AI_PROVIDERS.join(', ')}`);
  }
  if (!apiKey && providerName !== 'custom') {
    throw new Error(`No API key configured for provider "${providerName}". Set one in the mentor settings screen.`);
  }
  const adapter = registry[providerName];
  return adapter.callProvider({ apiKey, model, baseUrl, systemPrompt, userMessage });
}

module.exports = { AI_PROVIDERS, generateWithProvider };
