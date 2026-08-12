const engine = require('./learningEngine');

/**
 * Evaluates a learner's own workspace submission (their reasoning, their
 * computational-thinking description, and their Python idea) against the
 * scenario it responds to, across six dimensions. This never says
 * "correct"/"incorrect" - it always returns strengths, missing ideas, and
 * suggestions per dimension, plus an overall score used for XP and progress.
 *
 * The heuristics reuse the same keyword-driven style already established by
 * learningEngine.js elsewhere in this codebase, kept deliberately simple and
 * transparent rather than pretending to be a full NLU system.
 */

const DIMENSIONS = [
  'problemUnderstanding',
  'decomposition',
  'patternRecognition',
  'abstraction',
  'algorithmDesign',
  'pythonReadiness'
];

function wordCount(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function evaluateProblemUnderstanding(scenario, workspace) {
  const text = workspace.reasoning || '';
  const mentionsContextNoun = scenario.context
    ? scenario.context.toLowerCase().split(/\W+/).some((word) => word.length > 4 && text.toLowerCase().includes(word))
    : false;
  const strengths = [];
  const missing = [];
  const suggestions = [];
  let score = 40;

  if (wordCount(text) >= 15) { strengths.push('You described the situation in your own words.'); score += 20; }
  else { missing.push('The description of the situation is quite short.'); suggestions.push('Restate the scenario in a sentence or two before jumping to a solution.'); }

  if (mentionsContextNoun) { strengths.push('You referenced specific details from the scenario, not just a generic idea.'); score += 20; }
  else { missing.push('Your reasoning does not clearly reference the specific details of this scenario.'); suggestions.push('Mention the exact people, values, or objects named in the scenario.'); }

  if (/because|since|so that|in order to/i.test(text)) { strengths.push('You explained why your approach makes sense.'); score += 20; }
  else { suggestions.push('Add a "because..." to explain why your approach solves the problem.'); }

  return { score: Math.min(score, 100), strengths, missing, suggestions };
}

function evaluateDecomposition(scenario, workspace) {
  const text = workspace.computationalThinking || workspace.reasoning || '';
  const strengths = [];
  const missing = [];
  const suggestions = [];
  let score = 35;

  const stepSignals = (text.match(/\bfirst\b|\bthen\b|\bnext\b|\bafter\b|\bfinally\b|\bstep\b/gi) || []).length;
  if (stepSignals >= 2) { strengths.push('You broke the problem into a clear sequence of steps.'); score += 30; }
  else if (stepSignals === 1) { strengths.push('You started to break the problem into steps.'); score += 15; missing.push('Only one step signal was found; there may be more sub-steps hiding in your reasoning.'); }
  else { missing.push('The reasoning reads as one single action rather than smaller steps.'); suggestions.push('Try listing the steps a computer would take, one at a time (first..., then..., finally...).'); }

  if (scenario.objectives?.some((objective) => text.toLowerCase().includes(objective.toLowerCase().split(' ')[0]))) {
    strengths.push('At least one of your steps lines up with a stated learning objective.');
    score += 15;
  }

  return { score: Math.min(score, 100), strengths, missing, suggestions };
}

function evaluatePatternRecognition(scenario, workspace) {
  const text = `${workspace.reasoning || ''} ${workspace.computationalThinking || ''}`;
  const strengths = [];
  const missing = [];
  const suggestions = [];
  let score = 40;

  if (/every|each|all of|repeat|again and again|same rule|pattern/i.test(text)) {
    strengths.push('You noticed something that repeats or applies to every item.');
    score += 30;
  } else {
    missing.push('It is not clear whether you noticed anything that repeats or generalizes.');
    suggestions.push('Ask yourself: does this rule apply to just one value, or every value like it?');
  }

  if (scenario.concepts?.some((concept) => text.toLowerCase().includes(concept.toLowerCase()))) {
    strengths.push('Your language already points toward the Python concept this scenario is teaching.');
    score += 30;
  }

  return { score: Math.min(score, 100), strengths, missing, suggestions };
}

function evaluateAbstraction(scenario, workspace) {
  const text = workspace.computationalThinking || '';
  const strengths = [];
  const missing = [];
  const suggestions = [];
  let score = 35;

  if (/ignore|don't need|not important|only need|just need|matters/i.test(text)) {
    strengths.push('You identified what matters and what can be set aside.');
    score += 35;
  } else {
    missing.push("You haven't said what details can safely be ignored.");
    suggestions.push('Name one detail from the scenario that the program does NOT need to care about.');
  }

  if (wordCount(text) >= 10) { strengths.push('You gave a real explanation, not just a one-word answer.'); score += 20; }

  return { score: Math.min(score, 100), strengths, missing, suggestions };
}

function evaluateAlgorithmDesign(scenario, workspace) {
  const text = workspace.computationalThinking || workspace.reasoning || '';
  const strengths = [];
  const missing = [];
  const suggestions = [];
  let score = 35;

  const mentionsOrder = /first|before|after|order|sequence/i.test(text);
  const mentionsDecision = /if|when|otherwise|unless|decide/i.test(text);
  const mentionsRepetition = /each|every|loop|repeat|while there/i.test(text);

  if (mentionsOrder) { strengths.push('You described an order of operations.'); score += 20; }
  if (mentionsDecision) { strengths.push('You included a decision point in your plan.'); score += 20; }
  if (mentionsRepetition) { strengths.push('You included repetition in your plan.'); score += 15; }
  if (!mentionsOrder && !mentionsDecision && !mentionsRepetition) {
    missing.push('Your plan does not yet describe order, decisions, or repetition.');
    suggestions.push('Sketch your plan as numbered steps a computer could follow exactly.');
  }

  return { score: Math.min(score, 100), strengths, missing, suggestions };
}

function evaluatePythonReadiness(scenario, workspace) {
  const text = `${workspace.reasoning || ''} ${workspace.computationalThinking || ''}`.trim();
  const strengths = [];
  const missing = [];
  const suggestions = [];
  let score = 30;

  if (/variable|list|dictionary|function|loop|if|class|=/.test(text.toLowerCase())) {
    strengths.push('You are already thinking in terms of real Python building blocks.');
    score += 35;
  } else {
    missing.push("You haven't named a specific Python concept yet (variable, list, loop, function...).");
    suggestions.push('Try naming the Python building block (variable, list, loop, function...) you think this scenario needs.');
  }

  if (wordCount(text) >= 8) { strengths.push('You gave enough detail to act on.'); score += 25; }
  else { suggestions.push('Say a little more about how you would write this in Python.'); }

  return { score: Math.min(score, 100), strengths, missing, suggestions };
}

const EVALUATORS = {
  problemUnderstanding: evaluateProblemUnderstanding,
  decomposition: evaluateDecomposition,
  patternRecognition: evaluatePatternRecognition,
  abstraction: evaluateAbstraction,
  algorithmDesign: evaluateAlgorithmDesign,
  pythonReadiness: evaluatePythonReadiness
};

const DIMENSION_LABELS = {
  problemUnderstanding: 'Problem Understanding',
  decomposition: 'Decomposition',
  patternRecognition: 'Pattern Recognition',
  abstraction: 'Abstraction',
  algorithmDesign: 'Algorithm Design',
  pythonReadiness: 'Python Readiness'
};

/**
 * @param {object} scenario - the scenario the learner responded to
 * @param {object} workspace - { reasoning, computationalThinking }
 */
function generateFeedback(scenario, workspace = {}) {
  const dimensions = DIMENSIONS.map((key) => {
    const result = EVALUATORS[key](scenario, workspace);
    return { key, label: DIMENSION_LABELS[key], ...result };
  });

  const overallScore = Math.round(
    dimensions.reduce((total, dimension) => total + dimension.score, 0) / dimensions.length
  );

  const abstractionMap = engine.mapReasoning(`${workspace.reasoning || ''} ${workspace.computationalThinking || ''}`);

  return {
    dimensions,
    overallScore,
    relatedConcepts: [...new Set(abstractionMap.map((item) => item.pythonConcept))],
    summary: overallScore >= 75
      ? "Strong first attempt - your reasoning is close to how a Python program would actually work."
      : overallScore >= 50
        ? 'A solid start. A few of the dimensions below could use more detail before you compare against the official solution.'
        : "You're just getting going here - use the hints if you'd like a nudge, then try adding more detail to each section."
  };
}

module.exports = { generateFeedback, DIMENSIONS, DIMENSION_LABELS };
