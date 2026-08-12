/**
 * Thin wrapper around Google's Gemini generateContent API. Implements the
 * same provider interface as the other providers.
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const TIMEOUT_MS = 20000;

function toGeminiContents(messages) {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }]
  }));
}

async function complete({ system, messages, jsonMode }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: toGeminiContents(messages),
          ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
          generationConfig: {
            temperature: 0.8,
            ...(jsonMode ? { responseMimeType: 'application/json' } : {})
          }
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Gemini request failed (${response.status}): ${errorBody.slice(0, 300)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('\n').trim();
    if (!text) throw new Error('Gemini response contained no content');
    return { text, raw: data };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { complete, name: 'gemini' };
