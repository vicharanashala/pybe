/**
 * Thin wrapper around OpenAI's Chat Completions API. Implements the common
 * provider interface used by aiProviderFactory.js: complete({ system,
 * messages, jsonMode }) -> { text }.
 *
 * Uses Node's built-in fetch (Node 18+) rather than the openai package, so
 * no new dependency needs to be installed.
 */

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const TIMEOUT_MS = 20000;

async function complete({ system, messages, jsonMode }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages
        ],
        temperature: 0.8,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`OpenAI request failed (${response.status}): ${errorBody.slice(0, 300)}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenAI response contained no content');
    return { text, raw: data };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { complete, name: 'openai' };
