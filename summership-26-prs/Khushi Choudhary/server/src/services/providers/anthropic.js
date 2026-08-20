// Anthropic Messages API. https://docs.anthropic.com/en/api/messages

// Part B's OUTPUT CONTRACT grew a lot this project (stage4 gained flowSteps,
// predictOutput, and edgeCase; stage5 gained applyCheck — see rule 17 in
// scenarioSystemPrompt.js) without this ever being revisited. 2000 was fine
// for the original three-field version of Part B; it is not enough room for
// the current one, and Anthropic requires max_tokens on every request (no
// provider default to silently fall back on, unlike OpenAI below).
const MAX_TOKENS = 8000;

async function callProvider({ apiKey, model, systemPrompt, userMessage }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-5-20250929',
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Anthropic request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const textBlock = (data.content || []).find((block) => block.type === 'text');
  if (!textBlock) {
    // Surface what Anthropic actually reported instead of a dead-end
    // message — stop_reason (e.g. "max_tokens", "refusal") and which block
    // types did come back are the only way to tell truncation, a content
    // filter, and an empty response apart the next time this happens.
    const blockTypes = (data.content || []).map((block) => block.type).join(', ') || 'none';
    throw new Error(
      `Anthropic response had no text content (stop_reason: ${data.stop_reason || 'unknown'}, content blocks: ${blockTypes})`
    );
  }
  return textBlock.text;
}

module.exports = { callProvider };
