const engine = require('./learningEngine');

/**
 * This service turns the raw scenario records stored in server/src/data/db.json
 * into the richer "Phase 1" payload the client needs (short description,
 * guided reasoning questions, computational-thinking mapping, generated Python
 * code, a line-by-line explanation of that code, and a worked input/output
 * example). Everything here is derived deterministically from fields that
 * already exist on a scenario plus the existing learningEngine rules, so no
 * scenario needs new hand-authored content and nothing is fabricated at
 * request time.
 */

const GUIDED_QUESTION_TEMPLATES = [
  {
    id: 'important-information',
    question: 'What information is important?',
    buildHint: (scenario) => scenario.objectives?.[0] || 'Look for the values mentioned in the situation above.'
  },
  {
    id: 'what-to-remember',
    question: 'What needs to be remembered?',
    buildHint: (scenario) => 'Decide which values the program must store so it can use them later.'
  },
  {
    id: 'identify-patterns',
    question: 'Can you identify patterns?',
    buildHint: (scenario) => (
      scenario.concepts?.some((c) => /loop|repeat/i.test(c))
        ? 'Notice anything that happens more than once, one item at a time.'
        : 'Look for values or actions that repeat or stay related to each other.'
    )
  },
  {
    id: 'break-into-steps',
    question: 'Can this process be broken into steps?',
    buildHint: (scenario) => scenario.objectives?.[1] || 'Try listing the actions in the order a computer would perform them.'
  },
  {
    id: 'what-to-ignore',
    question: 'What can be ignored?',
    buildHint: () => 'Separate details that make the story interesting from details the program actually needs.'
  },
  {
    id: 'how-a-computer-solves-it',
    question: 'How would a computer solve this?',
    buildHint: (scenario) => scenario.objectives?.[scenario.objectives.length - 1] || 'Turn the last decision above into a precise, unambiguous instruction.'
  }
];

function buildDescription(scenario) {
  const context = (scenario.context || '').trim();
  if (context.length <= 140) return context;
  const truncated = context.slice(0, 140);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : 140)}...`;
}

function buildExpectedOutcome(scenario, artifact) {
  const concept = scenario.concepts?.[0] || 'this concept';
  return `A short Python program that models the scenario using ${concept} and prints a clear, correct result. `
    + `Running it produces: ${artifact.output.split('\n')[0]}${artifact.output.includes('\n') ? ' (and more lines below).' : '.'}`;
}

/**
 * Phase 2 progressive hints: three levels, each revealing a little more of
 * the real computational-thinking process behind this specific scenario
 * (built from the scenario's own prompt/objectives/concepts, not generic
 * boilerplate).
 */
function buildHints(scenario, abstractionMap) {
  const primaryConcept = scenario.concepts?.[0] || 'the concept';
  const firstObjective = scenario.objectives?.[0];
  const ctSkill = abstractionMap?.[0]?.pattern || 'breaking the problem down';

  return [
    {
      level: 1,
      title: 'A small nudge',
      text: firstObjective
        ? `Start with this: ${firstObjective.toLowerCase()}.`
        : `Re-read the scenario and underline the exact values mentioned - that is usually where the answer starts.`
    },
    {
      level: 2,
      title: 'A push in the right direction',
      text: `Think about ${primaryConcept}. ${scenario.prompt || 'What would you need to name or store to make progress?'}`
    },
    {
      level: 3,
      title: 'Part of the computational thinking process',
      text: `This scenario is really about ${ctSkill.toLowerCase()}, which in Python usually becomes ${primaryConcept}. Try describing your plan using that idea before you write any code.`
    }
  ];
}

function buildGuidedQuestions(scenario) {
  return GUIDED_QUESTION_TEMPLATES.map((template) => ({
    id: template.id,
    question: template.question,
    hint: template.buildHint(scenario)
  }));
}

function buildCTMapping(scenario, abstractionMap, artifact) {
  return abstractionMap.map((step, index) => ({
    step: index + 1,
    studentReasoning: index === 0 ? scenario.sampleReasoning : step.explanation,
    computationalThinkingSkill: step.pattern,
    pythonConcept: step.pythonConcept,
    generatedCode: index === 0 ? artifact.code.split('\n').slice(0, 3).join('\n') : null
  }));
}

const LINE_RULES = [
  { test: (l) => /^#/.test(l), describe: () => 'A comment explaining intent to the reader; Python ignores it when running.' },
  { test: (l) => /^class\s+\w+/.test(l), describe: (l) => `Defines a new class, ${l.match(/class\s+(\w+)/)[1]}, a blueprint for objects with this scenario's data and behavior.` },
  { test: (l) => /^def\s+__init__/.test(l), describe: () => 'The constructor: runs automatically when a new object is created and sets up its starting attributes.' },
  { test: (l) => /^def\s+\w+/.test(l), describe: (l) => `Defines the function ${l.match(/def\s+(\w+)/)[1]}, a reusable block of steps that can be called with different inputs.` },
  { test: (l) => /^self\.\w+\s*=/.test(l), describe: (l) => `Stores ${l.match(/self\.(\w+)/)[1]} as an attribute on the object so every method can read it later.` },
  { test: (l) => /^return\b/.test(l), describe: () => 'Sends a result back to whatever called this function.' },
  { test: (l) => /^for\s+.+\s+in\s+.+:/.test(l), describe: (l) => `Starts a loop that repeats the indented block once for each item in ${l.match(/in\s+(.+):/)[1]}.` },
  { test: (l) => /^while\s+.+:/.test(l), describe: () => 'Starts a loop that keeps repeating the indented block as long as the condition stays true.' },
  { test: (l) => /^if\s+.+:/.test(l), describe: () => 'Checks a condition; if it is true, Python runs the indented block that follows.' },
  { test: (l) => /^elif\s+.+:/.test(l), describe: () => 'Checks another condition, only if the earlier ones were false.' },
  { test: (l) => /^else:/.test(l), describe: () => 'Handles every remaining case where none of the conditions above were true.' },
  { test: (l) => /print\(/.test(l), describe: () => 'Displays a value to the screen so the learner can see the program\'s result.' },
  { test: (l) => /^\w+\s*=\s*\{/.test(l) || /^\s*"\w+":/.test(l), describe: (l) => `Builds a dictionary, pairing each key with a related value${l.includes('=') ? ` and names it ${l.match(/^(\w+)\s*=/)?.[1] || ''}` : ''}.` },
  { test: (l) => /^\w+\s*=\s*\[/.test(l), describe: (l) => `Creates a list named ${l.match(/^(\w+)\s*=/)[1]} to keep several related values together in order.` },
  { test: (l) => /^\w+\s*=\s*.+/.test(l), describe: (l) => `Creates a variable named ${l.match(/^(\w+)\s*=/)[1]} and stores a value in it so it can be reused later.` }
];

function explainLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const rule = LINE_RULES.find((r) => r.test(trimmed));
  return {
    line,
    explanation: rule ? rule.describe(trimmed) : 'Carries out the next step of the scenario in Python.'
  };
}

function buildCodeExplanation(artifact) {
  const lines = artifact.code.split('\n');
  return lines.map(explainLine).filter(Boolean);
}

/**
 * Builds the lightweight fields shown on a scenario card in the browser
 * (kept cheap: no code generation, just a trimmed description).
 */
function enrichScenarioSummary(scenario) {
  return {
    ...scenario,
    description: buildDescription(scenario)
  };
}

/**
 * Builds the full Phase 1 detail payload for a single scenario page.
 */
function enrichScenarioDetail(scenario) {
  // mapReasoning matches on keywords found in free-text reasoning. A scenario's
  // sampleReasoning alone doesn't always contain a keyword for its own tagged
  // concepts (e.g. "functions"), so it's combined with the scenario's concept
  // tags and prompt before matching. This keeps mapReasoning itself untouched
  // (it's also used as-is for live learner submissions in routes/sessions.js)
  // while making the scenario-detail mapping reliably reflect the concept the
  // scenario was actually authored to teach.
  const matchingText = [scenario.sampleReasoning, scenario.concepts?.join(' '), scenario.prompt]
    .filter(Boolean)
    .join('. ');
  const abstractionMap = engine.mapReasoning(matchingText);
  const artifact = engine.buildCodeArtifact(scenario, abstractionMap);

  return {
    ...scenario,
    description: buildDescription(scenario),
    expectedOutcome: buildExpectedOutcome(scenario, artifact),
    guidedQuestions: buildGuidedQuestions(scenario),
    hints: buildHints(scenario, abstractionMap),
    ctMapping: buildCTMapping(scenario, abstractionMap, artifact),
    generatedCode: artifact.code,
    codeExplanationSummary: engine.explainCode(abstractionMap),
    codeExplanation: buildCodeExplanation(artifact),
    example: {
      input: artifact.input,
      output: artifact.output
    }
  };
}

module.exports = { enrichScenarioSummary, enrichScenarioDetail, buildDescription };
