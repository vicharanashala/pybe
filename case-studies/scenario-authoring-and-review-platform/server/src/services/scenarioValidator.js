// Checks a raw LLM response against the system prompt's rules before it's
// ever trusted. Returns a specific list of what's wrong, not just true/false,
// so the caller can either retry with that feedback or show it to a human.
//
// Generation happens in two calls (Part A: concept through stage3, Part B:
// stage4 through scaleReflection — see scenarioSystemPrompt.js for why), so
// this file exposes three entry points: validatePartA and validatePartB
// check one call's output in isolation, and validateScenarioDraft checks a
// complete merged case study (used both for the final pass after both parts
// succeed, and as the one validator the mentor's "edit a draft" flow runs
// against). All three share the same small per-field check functions below,
// rather than duplicating the rules three times.

const { spawnSync } = require('child_process');

const BANNED_PHRASES = [
  '—', // em dash
  'not only',
  'moreover',
  'furthermore',
  'dive into',
  'unlock',
  'elevate',
  'seamless',
  'robust',
  'a testament to',
  "in today's fast-paced world",
  'have you ever wondered'
];

const MIN_OPTIONS = 2;

function tryParseJson(rawText) {
  // Models sometimes wrap JSON in a ```json fence even when told not to —
  // strip that before parsing rather than failing on it.
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  try {
    return { ok: true, value: JSON.parse(cleaned) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function checkBannedPhrases(text, issues, fieldName) {
  if (typeof text !== 'string') return;
  const lower = text.toLowerCase();
  BANNED_PHRASES.forEach((phrase) => {
    if (lower.includes(phrase.toLowerCase())) {
      issues.push(`${fieldName} contains a banned phrase: "${phrase}"`);
    }
  });
}

// The Python name of the concept is only allowed to appear in
// stage4.conceptReveal — everywhere earlier in the arc (scenario, the
// observation stage, the interpretation options, the language-agnostic
// concept idea) gets checked against this.
function checkNoEarlyReveal(text, concept, issues, fieldName) {
  if (typeof text !== 'string' || !concept) return;
  if (text.toLowerCase().includes(String(concept).toLowerCase())) {
    issues.push(`${fieldName} names the concept before the reveal — the Python term should only appear in stage4.conceptReveal`);
  }
}

function checkTokenSet(tokens, issues, fieldName) {
  if (!Array.isArray(tokens) || tokens.length < MIN_OPTIONS) {
    issues.push(`${fieldName} must have at least ${MIN_OPTIONS} options`);
    return;
  }
  const correctCount = tokens.filter((t) => t.correct).length;
  if (correctCount < 1) {
    issues.push(`${fieldName} must have at least one token marked correct`);
  }
}

// A template like "[ ___ for ___ in ___ if ___ ]" has multiple blanks, and
// the learner needs to know which specific token fills which specific
// blank — not just "any correct token, any order" (that would let a learner
// "complete" the exercise with syntactically wrong code, e.g. the filter
// condition placed where the iterable belongs). orderField must list the
// correct token's value for every blank, left to right, one entry per
// blank — this is what the client's fill-in-the-blank UI walks through.
function checkBlankOrder(template, tokens, orderField, issues, templateFieldName, orderFieldName) {
  if (typeof template !== 'string') return;
  const blankCount = (template.match(/___/g) || []).length;
  if (blankCount <= 1) return; // a single blank has nothing to order

  if (!Array.isArray(orderField) || orderField.length !== blankCount) {
    issues.push(
      `${templateFieldName} has ${blankCount} blanks, so ${orderFieldName} must be an array of exactly ${blankCount} token values (one per blank, left to right) — ` +
      `${Array.isArray(orderField) ? `got ${orderField.length}` : 'got null/missing'}`
    );
    return;
  }

  const correctValues = new Set((tokens || []).filter((t) => t.correct).map((t) => t.value));
  orderField.forEach((value, i) => {
    if (!correctValues.has(value)) {
      issues.push(`${orderFieldName}[${i}] ("${value}") does not match any token marked correct — every entry must be an exact correct token value`);
    }
  });
}

// A "___" blank must be a whole-token swap. If the raw template has a run of
// underscores that isn't exactly 3, or if a clean 3-underscore run sits
// directly against a letter/digit/underscore with no whitespace or
// punctuation boundary, filling it in splices the token onto neighbouring
// text instead of replacing a standalone word — e.g. a template blank
// written as "def ____inner(...)" (one underscore too many) turns a correct
// "wrapper" token into the corrupted identifier "wrapper_inner" once filled,
// which is exactly the kind of bug this check exists to catch before a
// learner ever sees it.
function checkBlankMarkers(template, issues, fieldName) {
  if (typeof template !== 'string') return;
  const isWordChar = (ch) => ch !== null && ch !== undefined && /[A-Za-z0-9]/.test(ch);

  for (const match of template.matchAll(/_+/g)) {
    const run = match[0];
    if (run.length < 3) continue; // a single/double underscore is normal identifier text, not a blank
    const start = match.index;
    const end = start + run.length;

    if (run.length !== 3) {
      issues.push(
        `${fieldName} has a malformed blank marker ("${run}", ${run.length} underscores) — blanks must be exactly three underscores ("___"), never more or fewer`
      );
      continue;
    }

    const before = start > 0 ? template[start - 1] : null;
    const after = end < template.length ? template[end] : null;
    if (isWordChar(before) || isWordChar(after)) {
      issues.push(
        `${fieldName} has a "___" blank glued directly to surrounding text with no space or punctuation boundary — filling it in will splice the token onto neighbouring letters and corrupt the identifier (e.g. "wrapper" + attached "_inner" becomes "wrapper_inner"). Every blank must stand alone, flanked by whitespace or punctuation like "(", ")", ":", ","`
      );
    }
  }
}

// A template with zero "___" blanks is already-complete code — there is
// nothing left for the learner to build, so FillBlanks (see
// PlaytestEngine.jsx) silently treats it as "done" with an empty fill order
// and renders it as static text with no token buttons at all. checkTokenSet
// only checks that tokens exist and at least one is marked correct, and
// checkBlankOrder only fires once there are 2+ blanks to put in order — a
// template with exactly zero blanks satisfies both, so this needs its own
// explicit check.
function checkHasBlanks(template, issues, fieldName) {
  if (typeof template !== 'string' || !template.trim()) return; // missing/empty already reported elsewhere
  const blankCount = (template.match(/___/g) || []).length;
  if (blankCount === 0) {
    issues.push(`${fieldName} has no "___" blanks — it reads as already-complete code, so there's nothing for the learner to fill in. Replace at least one line/token with "___".`);
  }
}

// Shared shape for every multiple-choice moment in the arc: stage2.attempt1
// and the three new stage4/stage5 comprehension checks below (rule 17 —
// predict-the-output, the edge-case/misconception question, and stage5's
// apply-elsewhere check) all use the same { text, status, hint } option
// shape. One helper instead of four near-duplicate checks.
function checkMCQOptions(options, issues, fieldName) {
  if (!Array.isArray(options) || options.length < MIN_OPTIONS) {
    issues.push(`${fieldName} must have at least ${MIN_OPTIONS} options`);
    return;
  }
  const correctCount = options.filter((opt) => opt.status === 'correct').length;
  if (correctCount !== 1) {
    issues.push(`${fieldName} must have exactly one option with status "correct" (found ${correctCount})`);
  }
  options.forEach((opt, i) => {
    if (typeof opt.text !== 'string' || !opt.text.trim()) {
      issues.push(`${fieldName}[${i}].text is missing or empty`);
    }
  });
}

// stage4.predictOutput and stage4.edgeCase key their question text as
// "question"; stage5.applyCheck keys it as "prompt" — same shape otherwise,
// so one helper covers all three rather than three near-identical checks.
function checkComprehensionBlock(block, issues, fieldName, promptKey) {
  if (!block || typeof block !== 'object') {
    issues.push(`${fieldName} is missing`);
    return;
  }
  if (typeof block[promptKey] !== 'string' || !block[promptKey].trim()) {
    issues.push(`${fieldName}.${promptKey} is missing or empty`);
  }
  checkMCQOptions(block.options, issues, `${fieldName}.options`);
}

// stage4.flowSteps is the execution-order walkthrough behind the new flow
// diagram (rule 17) — 3 to 6 short beats, each needing a non-empty label.
function checkFlowSteps(steps, issues, fieldName) {
  if (!Array.isArray(steps) || steps.length < 3 || steps.length > 6) {
    issues.push(`${fieldName} must be an array of 3 to 6 steps`);
    return;
  }
  steps.forEach((step, i) => {
    if (typeof step.label !== 'string' || !step.label.trim()) {
      issues.push(`${fieldName}[${i}].label is missing or empty`);
    }
  });
}

// Every check above confirms the SHAPE of a template/token/order set is
// well-formed — blank markers are clean, correctOrder's length and every
// value in it check out — but none of them confirm the ASSEMBLED result is
// actually valid Python. A template can have one structurally superfluous
// blank (every "___" marker clean, correctOrder matching real tokens) and
// still produce a syntax error once filled in — e.g. two expressions ending
// up flush against each other with nothing between them — which no
// per-field structural check above can catch, since every individual piece
// looks fine in isolation. This is the one check that actually assembles
// the code and asks Python's own parser whether it's valid.
function resolveOrderForSyntaxCheck(template, tokens, correctOrder) {
  const blankCount = (String(template).match(/___/g) || []).length;
  if (Array.isArray(correctOrder) && correctOrder.length === blankCount) return correctOrder;
  return (tokens || []).filter((t) => t.correct).map((t) => t.value).slice(0, blankCount);
}

function fillTemplateForSyntaxCheck(template, tokens, correctOrder) {
  const order = resolveOrderForSyntaxCheck(template, tokens, correctOrder);
  let text = template;
  order.forEach((value) => { text = text.replace('___', value); });
  return text;
}

// Cached across calls within one process — probing for a python3/python
// binary on every single validator call would be wasteful, and the answer
// can't change mid-process. undefined = not probed yet, null = neither
// binary is available, string = the command name that worked.
let cachedPythonCommand;

function resolvePythonCommand() {
  if (cachedPythonCommand !== undefined) return cachedPythonCommand;
  for (const cmd of ['python3', 'python']) {
    try {
      const probe = spawnSync(cmd, ['--version'], { timeout: 3000 });
      if (!probe.error && probe.status === 0) {
        cachedPythonCommand = cmd;
        return cachedPythonCommand;
      }
    } catch {
      // try the next candidate
    }
  }
  cachedPythonCommand = null;
  return cachedPythonCommand;
}

// Best-effort: if no Python binary is available in whatever environment
// this server happens to run in, the check is silently skipped rather than
// blocking every generation on a missing dependency — this is strictly an
// additional safety net, not a requirement the rest of the validator leans
// on, so its absence should never be the reason a mentor can't generate
// anything.
function checkPythonSyntax(template, tokens, correctOrder, issues, fieldName) {
  if (typeof template !== 'string' || !template.trim()) return;
  const pythonCommand = resolvePythonCommand();
  if (!pythonCommand) return;

  const filled = fillTemplateForSyntaxCheck(template, tokens, correctOrder);
  const result = spawnSync(pythonCommand, ['-c', 'import sys, ast; ast.parse(sys.stdin.read())'], {
    input: filled,
    timeout: 3000,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    const lastLine = (result.stderr || '').trim().split('\n').filter(Boolean).pop() || 'syntax error';
    issues.push(
      `${fieldName}, once every blank is filled in with its correct token in order, is not valid Python (${lastLine}) — check for a blank with no real syntactic role, or a token that belongs somewhere else`
    );
  }
}

function checkRequiredFields(draft, fields, issues) {
  fields.forEach((field) => {
    if (draft[field] === undefined || draft[field] === null || draft[field] === '') {
      issues.push(`Missing required field: "${field}"`);
    }
  });
}

// --- Part A field checks: story through the concept idea, no Python term --

function checkStage1(draft, issues) {
  if (!draft.stage1) return;
  if (typeof draft.stage1.prompt !== 'string' || !draft.stage1.prompt.trim()) {
    issues.push('stage1.prompt is missing or empty');
  }
  if (typeof draft.stage1.guidingQuestion !== 'string' || !draft.stage1.guidingQuestion.trim()) {
    issues.push('stage1.guidingQuestion is missing or empty');
  }
}

function checkStage2(draft, issues) {
  if (!draft.stage2) return;
  const options = draft.stage2.attempt1;
  if (!Array.isArray(options) || options.length < MIN_OPTIONS) {
    issues.push(`stage2.attempt1 must have at least ${MIN_OPTIONS} options`);
    return;
  }
  const correctCount = options.filter((opt) => opt.status === 'correct').length;
  if (correctCount !== 1) {
    issues.push(`stage2.attempt1 must have exactly one option with status "correct" (found ${correctCount})`);
  }
  options.forEach((opt, i) => checkNoEarlyReveal(opt.text, draft.concept, issues, `stage2.attempt1[${i}].text`));
}

function checkStage3(draft, issues) {
  if (!draft.stage3) return;
  if (typeof draft.stage3.conceptIdea !== 'string' || !draft.stage3.conceptIdea.trim()) {
    issues.push('stage3.conceptIdea is missing or empty');
  } else {
    checkNoEarlyReveal(draft.stage3.conceptIdea, draft.concept, issues, 'stage3.conceptIdea');
  }
}

function checkRevealOrder(draft, issues) {
  checkNoEarlyReveal(draft.scenario, draft.concept, issues, 'scenario');
  checkNoEarlyReveal(draft.stage1?.prompt, draft.concept, issues, 'stage1.prompt');
  checkNoEarlyReveal(draft.stage1?.guidingQuestion, draft.concept, issues, 'stage1.guidingQuestion');
}

function checkBannedPhrasesPartA(draft, issues) {
  checkBannedPhrases(draft.scenario, issues, 'scenario');
  checkBannedPhrases(draft.designNote, issues, 'designNote');
  checkBannedPhrases(draft.stage1?.prompt, issues, 'stage1.prompt');
  checkBannedPhrases(draft.stage1?.guidingQuestion, issues, 'stage1.guidingQuestion');
  checkBannedPhrases(draft.stage3?.conceptIdea, issues, 'stage3.conceptIdea');
  (draft.stage2?.attempt1 || []).forEach((opt, i) => checkBannedPhrases(opt.text, issues, `stage2.attempt1[${i}].text`));
}

// --- Part B field checks: syntax reveal through practice -------------------

function checkStage4(draft, issues) {
  if (!draft.stage4) return;
  if (typeof draft.stage4.conceptReveal !== 'string' || !draft.stage4.conceptReveal.trim()) {
    issues.push('stage4.conceptReveal is missing or empty');
  }
  if (typeof draft.stage4.codeTemplate !== 'string' || !draft.stage4.codeTemplate.trim()) {
    issues.push('stage4.codeTemplate is missing or empty');
  }
  checkTokenSet(draft.stage4.tokens, issues, 'stage4.tokens');
  checkBlankOrder(draft.stage4.codeTemplate, draft.stage4.tokens, draft.stage4.correctOrder, issues, 'stage4.codeTemplate', 'stage4.correctOrder');
  checkBlankMarkers(draft.stage4.codeTemplate, issues, 'stage4.codeTemplate');
  checkHasBlanks(draft.stage4.codeTemplate, issues, 'stage4.codeTemplate');
  checkPythonSyntax(draft.stage4.codeTemplate, draft.stage4.tokens, draft.stage4.correctOrder, issues, 'stage4.codeTemplate');
  checkFlowSteps(draft.stage4.flowSteps, issues, 'stage4.flowSteps');
  checkComprehensionBlock(draft.stage4.predictOutput, issues, 'stage4.predictOutput', 'question');
  checkComprehensionBlock(draft.stage4.edgeCase, issues, 'stage4.edgeCase', 'question');
}

function checkStage5(draft, issues) {
  if (!draft.stage5) return;
  if (typeof draft.stage5.practicePrompt !== 'string' || !draft.stage5.practicePrompt.trim()) {
    issues.push('stage5.practicePrompt is missing or empty');
  }
  if (typeof draft.stage5.practiceTemplate !== 'string' || !draft.stage5.practiceTemplate.trim()) {
    issues.push('stage5.practiceTemplate is missing or empty');
  }
  checkTokenSet(draft.stage5.practiceTokens, issues, 'stage5.practiceTokens');
  checkBlankOrder(draft.stage5.practiceTemplate, draft.stage5.practiceTokens, draft.stage5.practiceCorrectOrder, issues, 'stage5.practiceTemplate', 'stage5.practiceCorrectOrder');
  checkBlankMarkers(draft.stage5.practiceTemplate, issues, 'stage5.practiceTemplate');
  checkHasBlanks(draft.stage5.practiceTemplate, issues, 'stage5.practiceTemplate');
  checkPythonSyntax(draft.stage5.practiceTemplate, draft.stage5.practiceTokens, draft.stage5.practiceCorrectOrder, issues, 'stage5.practiceTemplate');
  checkComprehensionBlock(draft.stage5.applyCheck, issues, 'stage5.applyCheck', 'prompt');

  if (
    draft.stage4?.codeTemplate &&
    draft.stage5.practiceTemplate &&
    draft.stage5.practiceTemplate.trim() === draft.stage4.codeTemplate.trim()
  ) {
    issues.push('stage5.practiceTemplate repeats stage4.codeTemplate exactly — it should be a different task, not a copy');
  }
}

function checkScaleReflection(draft, issues) {
  if (typeof draft.scaleReflection === 'string' && draft.scaleReflection.trim() && !draft.scaleReflection.trim().endsWith('?')) {
    issues.push('scaleReflection should be phrased as a question to the learner, not a statement');
  }
}

function checkBannedPhrasesPartB(draft, issues) {
  checkBannedPhrases(draft.stage4?.conceptReveal, issues, 'stage4.conceptReveal');
  checkBannedPhrases(draft.stage5?.practicePrompt, issues, 'stage5.practicePrompt');
  checkBannedPhrases(draft.scaleReflection, issues, 'scaleReflection');
  checkBannedPhrases(draft.stage4?.predictOutput?.question, issues, 'stage4.predictOutput.question');
  checkBannedPhrases(draft.stage4?.edgeCase?.question, issues, 'stage4.edgeCase.question');
  checkBannedPhrases(draft.stage5?.applyCheck?.prompt, issues, 'stage5.applyCheck.prompt');
  (draft.stage4?.flowSteps || []).forEach((step, i) => checkBannedPhrases(step.label, issues, `stage4.flowSteps[${i}].label`));
}

// --- Public entry points ----------------------------------------------------

const PART_A_FIELDS = ['concept', 'theory', 'levelTitle', 'designNote', 'scenario', 'stage1', 'stage2', 'stage3'];
const PART_B_FIELDS = ['stage4', 'stage5', 'scaleReflection'];

function validatePartA(rawText) {
  const parsed = tryParseJson(rawText);
  if (!parsed.ok) return { valid: false, issues: [`Response was not valid JSON: ${parsed.error}`], parsed: null };

  const draft = parsed.value;
  const issues = [];

  checkRequiredFields(draft, PART_A_FIELDS, issues);
  checkStage1(draft, issues);
  checkStage2(draft, issues);
  checkStage3(draft, issues);
  checkRevealOrder(draft, issues);
  checkBannedPhrasesPartA(draft, issues);

  return { valid: issues.length === 0, issues, parsed: draft };
}

function validatePartB(rawText) {
  const parsed = tryParseJson(rawText);
  if (!parsed.ok) return { valid: false, issues: [`Response was not valid JSON: ${parsed.error}`], parsed: null };

  const draft = parsed.value;
  const issues = [];

  checkRequiredFields(draft, PART_B_FIELDS, issues);
  checkStage4(draft, issues);
  checkStage5(draft, issues);
  checkScaleReflection(draft, issues);
  checkBannedPhrasesPartB(draft, issues);

  return { valid: issues.length === 0, issues, parsed: draft };
}

// Validates a complete, already-merged case study — either Part A + Part B
// merged fresh off the model, or a draft a mentor has hand-edited in the
// review queue. Runs every check both parts run, plus the cross-part checks
// (stage5 vs stage4 duplication, reveal order against the final concept)
// that only make sense once the whole arc exists together.
function validateScenarioDraft(rawText) {
  const parsed = tryParseJson(rawText);
  if (!parsed.ok) return { valid: false, issues: [`Response was not valid JSON: ${parsed.error}`], parsed: null };

  const draft = parsed.value;
  const issues = [];

  checkRequiredFields(draft, [...PART_A_FIELDS, ...PART_B_FIELDS], issues);
  checkStage1(draft, issues);
  checkStage2(draft, issues);
  checkStage3(draft, issues);
  checkStage4(draft, issues);
  checkStage5(draft, issues);
  checkScaleReflection(draft, issues);
  checkRevealOrder(draft, issues);
  checkBannedPhrasesPartA(draft, issues);
  checkBannedPhrasesPartB(draft, issues);

  return { valid: issues.length === 0, issues, parsed: draft };
}

module.exports = { validateScenarioDraft, validatePartA, validatePartB, BANNED_PHRASES };
