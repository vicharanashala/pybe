/**
 * AI output can't be trusted blindly - this module parses and validates it
 * before anything reaches the frontend (Prompt Engineering requirement:
 * "Validate AI responses before returning them to the frontend").
 */

function stripCodeFences(text = '') {
  return text.replace(/```json/gi, '').replace(/```/g, '').trim();
}

function parseJsonResponse(text) {
  const cleaned = stripCodeFences(text);
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // Some models wrap valid JSON in extra prose; try to extract the first
    // {...} or [...] block before giving up.
    const match = cleaned.match(/[{[][\s\S]*[}\]]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // fall through to the error below
      }
    }
    throw new Error(`Could not parse AI JSON response: ${error.message}`);
  }
}

function assertHasKeys(obj, keys, label) {
  const missing = keys.filter((key) => obj[key] === undefined || obj[key] === null || obj[key] === '');
  if (missing.length) {
    throw new Error(`${label} response is missing required field(s): ${missing.join(', ')}`);
  }
}

/**
 * Prevents a hint from leaking the full solution ahead of the level the
 * learner has actually unlocked. Levels 1-3 must never contain a fenced
 * code block or the exact final generated code; level 4 may describe the
 * shape of an approach but should still not equal the final code verbatim.
 */
function sanitizeHint(text, level, finalCode) {
  let sanitized = text;
  if (finalCode && sanitized.includes(finalCode.trim())) {
    sanitized = sanitized.replace(finalCode.trim(), '[solution hidden until you reveal it]');
  }
  if (level < 4) {
    sanitized = sanitized.replace(/```[\s\S]*?```/g, '[code hidden - try describing your plan in words first]');
  }
  return sanitized.trim();
}

module.exports = { parseJsonResponse, assertHasKeys, sanitizeHint, stripCodeFences };
