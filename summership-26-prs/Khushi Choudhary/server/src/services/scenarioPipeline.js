// Runs the two-call generation pipeline: Part A (story through the
// language-agnostic concept idea) then Part B (Python syntax through
// practice), instead of one call asking for the full five-stage arc.
//
// This exists because a single call regularly got truncated by gateway
// timeouts on slower/proxied providers (MiniMax via a third-party gateway,
// specifically) — the model would still be mid-response when the gateway
// gave up and closed the connection. Splitting the work roughly halves what
// any one call has to produce, which is the one lever available from this
// codebase; we don't control the gateway's timeout itself. It also happens
// to land on the pedagogical seam already in the rulebook: Part A never
// says the Python term, Part B is where it's allowed to.
//
// Shared by both the mentor route (routes/scenarioGenerator.js) and the
// learner route (routes/scenarioGeneratorLearner.js) so this retry logic —
// now twice as fiddly as the old single-call version — only exists once.

const { generateWithProvider } = require('./providers');
const { SYSTEM_PROMPT, buildPartAUserMessage, buildPartBUserMessage } = require('./scenarioSystemPrompt');
const { validatePartA, validatePartB, validateScenarioDraft } = require('./scenarioValidator');
const { getFeedbackContext } = require('./generationFeedback');

const MAX_ATTEMPTS_PER_PHASE = 3;

// Runs one phase (Part A or Part B) with its own retry loop. buildMessage
// gets the previous attempt's validator issues (or undefined on the first
// try) and returns the user message for the next attempt; validate checks
// the raw response text.
async function runPhase({ providerName, apiKey, model, baseUrl, buildMessage, validate }) {
  let attempt = 0;
  let lastIssues = [];
  let validated = null;

  while (attempt < MAX_ATTEMPTS_PER_PHASE && !validated) {
    attempt += 1;
    const userMessage = buildMessage(lastIssues.length ? lastIssues : undefined);

    let rawText;
    try {
      // eslint-disable-next-line no-await-in-loop
      rawText = await generateWithProvider({
        providerName, apiKey, model, baseUrl, systemPrompt: SYSTEM_PROMPT, userMessage
      });
    } catch (error) {
      // A thrown error here is a transport failure (gateway timeout,
      // truncated body, non-2xx status) rather than a content problem —
      // still worth retrying, just with the error itself as the only
      // "feedback" available, since there's no parsed response to critique.
      lastIssues = [error.message];
      // eslint-disable-next-line no-continue
      continue;
    }

    const result = validate(rawText);
    if (result.valid) {
      validated = result.parsed;
    } else {
      lastIssues = result.issues;
    }
  }

  return { validated, attempts: attempt, issues: lastIssues };
}

/**
 * Generates one complete case study. Returns { content, attempts, issues }.
 * content is null if either phase never produced a valid result within its
 * attempt cap — attempts is the total across both phases, and issues
 * explains which phase failed and why.
 */
async function generateCaseStudy({ providerName, apiKey, model, baseUrl, concept, hookWord, avoidList, previousBeat }) {
  // Per-concept lessons from mentor review of earlier case studies on this
  // same concept (see generationFeedback.js) — loaded once up front and
  // handed to both phases, since an edit lesson or reject reason can concern
  // either part's fields. '' when there's nothing yet for this concept, so
  // this never changes behavior for a brand-new concept.
  const feedbackContext = await getFeedbackContext(concept);

  const phaseA = await runPhase({
    providerName,
    apiKey,
    model,
    baseUrl,
    buildMessage: (validatorFeedback) => buildPartAUserMessage({ concept, hookWord, avoidList, previousBeat, validatorFeedback, feedbackContext }),
    validate: validatePartA
  });

  if (!phaseA.validated) {
    return {
      content: null,
      attempts: phaseA.attempts,
      issues: phaseA.issues.map((issue) => `Part 1 (story + concept idea): ${issue}`)
    };
  }

  const phaseB = await runPhase({
    providerName,
    apiKey,
    model,
    baseUrl,
    buildMessage: (validatorFeedback) => buildPartBUserMessage({ partA: phaseA.validated, validatorFeedback, feedbackContext }),
    validate: validatePartB
  });

  if (!phaseB.validated) {
    return {
      content: null,
      attempts: phaseA.attempts + phaseB.attempts,
      issues: phaseB.issues.map((issue) => `Part 2 (syntax + practice): ${issue}`)
    };
  }

  const merged = { ...phaseA.validated, ...phaseB.validated };
  const finalCheck = validateScenarioDraft(JSON.stringify(merged));

  return {
    content: finalCheck.valid ? merged : null,
    attempts: phaseA.attempts + phaseB.attempts,
    issues: finalCheck.valid ? [] : finalCheck.issues
  };
}

module.exports = { generateCaseStudy };
