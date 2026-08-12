const openaiProvider = require('./providers/openaiProvider');
const anthropicProvider = require('./providers/anthropicProvider');
const geminiProvider = require('./providers/geminiProvider');
const offlineProvider = require('./providers/offlineProvider');

/**
 * Design note (Backend Requirements: "design an abstraction layer so AI
 * providers can be swapped later"): every provider module exports the same
 * complete({ system, messages, jsonMode, task, context }) -> { text }
 * shape. Swapping providers is a one-line env var change
 * (AI_PROVIDER=openai|anthropic|gemini); nothing else in the codebase
 * knows or cares which one is active.
 */
const PROVIDERS = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
  gemini: geminiProvider,
  offline: offlineProvider
};

function resolveConfiguredProvider() {
  const requested = (process.env.AI_PROVIDER || '').toLowerCase();
  if (requested && PROVIDERS[requested] && requested !== 'offline') return PROVIDERS[requested];

  // No explicit provider requested: auto-detect from whichever API key is present.
  if (process.env.OPENAI_API_KEY) return openaiProvider;
  if (process.env.ANTHROPIC_API_KEY) return anthropicProvider;
  if (process.env.GEMINI_API_KEY) return geminiProvider;
  return null;
}

/**
 * Always resolves - never throws. If no provider is configured, or the
 * configured provider's request fails for any reason (missing key, network
 * error, rate limit, timeout), this transparently falls back to the
 * deterministic offline provider so the feature keeps working
 * (Performance Requirements: "Handle API failures gracefully").
 */
async function complete(request) {
  const provider = resolveConfiguredProvider();
  if (!provider) return { ...(await offlineProvider.complete(request)), providerUsed: 'offline' };

  try {
    const result = await provider.complete(request);
    return { ...result, providerUsed: provider.name };
  } catch (error) {
    console.error(`AI provider "${provider.name}" failed, falling back to offline:`, error.message);
    const fallback = await offlineProvider.complete(request);
    return { ...fallback, providerUsed: 'offline', providerError: error.message };
  }
}

module.exports = { complete };
