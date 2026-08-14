// Custom / self-hosted provider. Assumes an OpenAI-compatible chat completions
// endpoint at {baseUrl}/chat/completions, which covers most self-hosted and
// proxy LLM servers without needing a fully generic protocol.

async function callProvider({ apiKey, model, baseUrl, systemPrompt, userMessage }) {
  if (!baseUrl) throw new Error('Custom provider requires a baseUrl');
  const url = baseUrl.replace(/\/+$/, '') + '/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model: model || 'default',
      temperature: 0.9,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Custom provider request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content;
  if (!message) throw new Error('Custom provider response had no message content');
  return message;
}

module.exports = { callProvider };
