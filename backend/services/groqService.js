/**
 * groqService.js
 *
 * Two AI calls live in the discovery-learning workflow:
 *
 *   1. generateResponse — the learner writes free-text answers to THREE
 *      real-world scenarios, one at a time. All three go in one request,
 *      and the model considers how understanding moved across them, then
 *      returns ONE consolidated, plain paragraph bridging to the actual
 *      Python concept — not a separate reaction per scenario.
 *
 *   2. generateDecisionAnalysis — AFTER that reflection, the learner sees
 *      ONE more scenario, this time a real-life analogy (deliberately not
 *      about code) with two concrete options. They pick one, and this call
 *      gives a short, specific analysis of that pick — correct or not —
 *      tying it back to the concept.
 *
 * NOTE: This uses Groq (https://groq.com — the fast-inference hosting
 * company, API at api.groq.com), NOT Grok (xAI's model, api.x.ai). Those are
 * two different companies with very similar names — make sure GROQ_API_KEY
 * is a key from https://console.groq.com/keys, not console.x.ai.
 */

const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// Strips ```json fences etc. in case the model wraps its JSON in markdown
// despite being asked not to.
function extractJson(raw) {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : trimmed;
}

async function callGroq({ systemMessage, userMessage, temperature = 0.6 }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server (get one from https://console.groq.com/keys)');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Groq API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error('Groq API returned no content');
  }

  try {
    return JSON.parse(extractJson(raw));
  } catch (e) {
    return null; // caller decides how to handle a non-JSON fallback
  }
}

/**
 * Generates ONE consolidated, plain-paragraph explanation covering all
 * three free-text scenario answers at once — replicated from the V1_2
 * approach: a single Groq call that considers how the learner's
 * understanding developed across the three responses, then writes one
 * unified explanation (not a separate reaction per scenario) bridging it
 * to the actual Python concept.
 *
 * Returns a single string (one paragraph, no code yet).
 */
async function generateResponse({ conceptTitle, background = '', scenarios = [], responses = [], conceptHint }) {
  const pairedBlock = scenarios
    .map((s, i) => {
      const r = (responses[i] || '').trim() || '(no response given)';
      const keyPointsLine = (s.reasoningKeyPoints && s.reasoningKeyPoints.length)
        ? `\nReasoning this scenario is getting at (for your context only, don't quote these verbatim): ${s.reasoningKeyPoints.join('; ')}`
        : '';
      return `Scenario ${i + 1}: ${s.scenario}\nQuestion ${i + 1}: ${s.prompt}${keyPointsLine}\nLearner's response to scenario ${i + 1}: "${r}"`;
    })
    .join('\n\n');

  const userMessage =
    (background ? `Shared background/context for all three scenarios below: ${background}\n\n` : '') +
    `The learner worked through three connected scenarios, answering the question for each ` +
    `one individually before moving to the next:\n\n${pairedBlock}\n\n` +
    (conceptHint ? `Core idea to connect to: ${conceptHint}\n` : '') +
    'The learner reasoned in the right direction overall — validate what they got right, then sharpen it into the ' +
    'precise concept.';

  const systemMessage =
    `You are a warm, encouraging Python tutor teaching the concept "${conceptTitle}" through discovery learning. ` +
    'The learner just worked through three connected real-world scenarios (optionally sharing a background/' +
    'context), each with its own question, answered one at a time. First, briefly and silently consider how their ' +
    'understanding moved across the three responses — did it sharpen, stay consistent, or waver? — and let that ' +
    'observation shape your tone (e.g. reinforce a good instinct that held steady, or gently connect the dots if ' +
    'their answers pulled in different directions). Then write ONE short, consolidated explanation (5-7 sentences) ' +
    'that ties the pattern across all three scenarios together and bridges it to the underlying Python concept in ' +
    'plain English.\n\n' +
    'IMPORTANT — be concrete, not generic: your explanation must explicitly name and reference the specific ' +
    'details from scenarios 1, 2, and 3 (the actual people/objects/situations involved — not just "the first ' +
    'scenario" but what it actually was), not just the learner\'s words in isolation. Show that you\'re drawing on ' +
    'the shared background (if given) and the specific questions asked, not writing something that could apply to ' +
    'any random set of scenarios. Do not include code yet — that comes in the next step, and do not give a ' +
    'separate explanation per scenario — one unified explanation only. Keep it conversational and specific to both ' +
    'what the learner actually wrote AND the actual scenario content, not generic filler.';

  const parsed = await callGroq({ systemMessage: systemMessage + '\n\nRespond with ONLY a JSON object, no other ' +
    'text, in exactly this shape:\n{"explanation": "..."}', userMessage, temperature: 0.6 });

  if (!parsed || typeof parsed.explanation !== 'string' || !parsed.explanation.trim()) {
    throw new Error('Groq API did not return a valid explanation');
  }

  return parsed.explanation.trim();
}

/**
 * Generates a short, specific analysis of the learner's pick on the single
 * follow-up decision scenario (a real-life analogy, not code). Called once
 * the learner has already chosen A or B and the server has computed
 * correctness against decisionScenario.correctOption.
 *
 * Returns a single string, 2-4 sentences.
 */
async function generateDecisionAnalysis({ conceptTitle, decisionScenario, choice, correct, conceptHint }) {
  const chosenText = choice === 'A' ? decisionScenario.optionA : decisionScenario.optionB;
  const otherText = choice === 'A' ? decisionScenario.optionB : decisionScenario.optionA;

  const userMessage =
    `Scenario: ${decisionScenario.scenario}\n` +
    `Question: ${decisionScenario.question}\n` +
    `Option A: ${decisionScenario.optionA}\n` +
    `Option B: ${decisionScenario.optionB}\n` +
    `The learner chose option ${choice} — "${chosenText}" — which was ${correct ? 'CORRECT' : 'INCORRECT'}.\n` +
    `The option they did NOT choose was: "${otherText}"\n\n` +
    (conceptHint ? `The Python concept this analogy is standing in for (do not mention Python syntax or code — this is still a plain real-life analogy): ${conceptHint}\n\n` : '') +
    'Respond with ONLY a JSON object, no other text, in exactly this shape:\n' +
    '{"analysis": "..."}';

  const systemMessage =
    `You are a sharp, specific tutor giving feedback on a real-life decision scenario that stands in for the ` +
    `Python concept "${conceptTitle}" — but this analysis must stay in the real-life analogy's own terms, no code, ` +
    'no Python syntax, no mention of variables/functions/etc. by their technical names.\n\n' +
    'Absolute rules:\n' +
    '- Reference the specific nouns/details from the scenario and the exact wording of both options — never generic ' +
    'filler that could apply to any scenario.\n' +
    '- If CORRECT: say plainly that it\'s the right call, name the concrete reason it works inside this scenario, ' +
    'and briefly describe what would have gone wrong in this same story if the other option had been picked instead.\n' +
    '- If INCORRECT: don\'t pretend it was right and don\'t be harsh — name the specific problem this option runs ' +
    'into inside the scenario, then point to what the correct option gets right, in the same concrete terms.\n' +
    '- 2-4 sentences total, concrete and specific to this exact scenario.\n' +
    '- Output ONLY the JSON object described in the user message. No markdown fences, no preamble, no extra keys.';

  const parsed = await callGroq({ systemMessage, userMessage, temperature: 0.6 });
  if (!parsed || typeof parsed.analysis !== 'string' || !parsed.analysis.trim()) {
    throw new Error('Groq API did not return a valid analysis');
  }
  return parsed.analysis.trim();
}

module.exports = { generateResponse, generateDecisionAnalysis };
