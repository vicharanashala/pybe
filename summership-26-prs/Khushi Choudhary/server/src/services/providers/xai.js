// xAI (Grok). OpenAI-compatible chat completions shape.
// Verify against current docs (https://docs.x.ai) before relying on this in production —
// xAI's API has historically mirrored OpenAI's request/response shape closely.

async function callProvider({ apiKey, model, systemPrompt, userMessage }) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'grok-2-latest',
      temperature: 0.9,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`xAI request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content;
  if (!message) throw new Error('xAI response had no message content');
  return message;
}

module.exports = { callProvider };
