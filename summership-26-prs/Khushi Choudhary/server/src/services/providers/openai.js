// OpenAI Chat Completions API. https://platform.openai.com/docs/api-reference/chat
// No max_tokens is set — falls back to the model's own default output
// ceiling, unlike Anthropic's adapter which must set one explicitly.

async function callProvider({ apiKey, model, systemPrompt, userMessage }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      temperature: 0.9,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`OpenAI request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content;
  if (!message) throw new Error('OpenAI response had no message content');
  return message;
}

module.exports = { callProvider };
