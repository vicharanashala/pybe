/**
 * Thin wrapper around Anthropic's Messages API. Implements the same
 * provider interface as the other providers: complete({ system, messages,
 * jsonMode }) -> { text }.
 */

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const TIMEOUT_MS = 20000;

async function complete({ system, messages, jsonMode }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        max_tokens: 1000,
        system: jsonMode
          ? `${system || ''}\n\nRespond with ONLY valid JSON. No prose, no markdown fences.`
          : system,
        messages
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Anthropic request failed (${response.status}): ${errorBody.slice(0, 300)}`);
    }

    const data = await response.json();
    const text = data.content?.map((block) => block.text || '').join('\n').trim();
    if (!text) throw new Error('Anthropic response contained no content');
    return { text, raw: data };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { complete, name: 'anthropic' };
