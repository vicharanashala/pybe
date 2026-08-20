// MiniMax chat completion via MiniMax's OpenAI-compatible endpoint.
// Confirmed against MiniMax's own docs (platform.minimax.io/docs/api-reference/text-openai-api)
// as of 2026-07: base URL https://api.minimax.io/v1, path /chat/completions,
// standard OpenAI request/response shape. Default model is MiniMax-M3.
//
// Defaults to the samagama.in gateway (an API proxy in front of MiniMax)
// rather than MiniMax's own endpoint, since that's where this project's key
// was actually issued — MiniMax's own endpoint returns 401 for a gateway key,
// as it was never issued through MiniMax's own account system. baseUrl can
// still be overridden per-call (e.g. if someone later has a real MiniMax
// account key and wants to hit api.minimax.io directly instead).
const DEFAULT_BASE_URL = 'https://samagama.in/platform/proxy/v1';

// Streamed, not buffered. Diagnosed live: a non-streaming request against
// this gateway was consistently coming back truncated mid-JSON, but the
// truncated body itself showed "finish_reason":"stop" — meaning MiniMax had
// already finished generating a complete response. That rules out "MiniMax
// is too slow" (why the earlier `thinking: disabled` fix and the two-call
// split in scenarioPipeline.js only partially helped) and points at the
// gateway's non-streaming path specifically: proxies like this one often
// buffer an entire response server-side before forwarding it, with a
// timeout on that buffering step that's unrelated to how fast the upstream
// model actually was. Requesting a streamed (SSE) response and reading it
// as chunks arrive, instead of waiting for one buffered blob, sidesteps
// that failure mode — each chunk gets forwarded as it's ready rather than
// held until the whole thing is assembled.
async function callProvider({ apiKey, model, baseUrl, systemPrompt, userMessage }) {
  const url = `${(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'MiniMax-M3',
      thinking: { type: 'disabled' },
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`MiniMax request failed (${response.status}): ${text}`);
  }
  if (!response.body) {
    throw new Error('MiniMax response had no readable body to stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let content = '';
  let fullRawText = '';
  let lineBuffer = '';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) break;

    const chunkText = decoder.decode(value, { stream: true });
    fullRawText += chunkText;
    lineBuffer += chunkText;

    const lines = lineBuffer.split('\n');
    lineBuffer = lines.pop() ?? ''; // keep the last (possibly partial) line for next chunk

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) content += delta;
      } catch {
        // One malformed SSE chunk shouldn't discard everything already
        // accumulated — skip it and keep reading the rest of the stream.
      }
    }
  }

  if (content) return content;

  // Fallback: if the gateway ignores stream:true and returns the old
  // single-JSON-blob shape anyway, this loop above found no "data:" lines
  // and content is still empty — try parsing the full body the
  // non-streaming way before giving up entirely.
  try {
    const data = JSON.parse(fullRawText);
    const message = data.choices?.[0]?.message?.content;
    if (message) return message;
  } catch {
    // fall through to the error below
  }

  throw new Error(
    `MiniMax streamed response produced no usable content (received ${fullRawText.length} bytes). ` +
    `Raw preview: ${fullRawText.slice(0, 300)}`
  );
}

module.exports = { callProvider };
