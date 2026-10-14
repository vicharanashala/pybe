const DIMENSION_WEIGHTS = Object.freeze({
  ambiguity: 0.4,
  unclearGoal: 0.25,
  solutionSpace: 0.2,
  competingConstraints: 0.15,
});

const clamp = (value) => Math.min(Math.max(value, 0), 1);
const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');
const hasMatch = (text, pattern) => pattern.test(text);

function normalizeList(value) {
  return Array.isArray(value) ? value.map(normalizeText).filter(Boolean) : [];
}

function scoreGoalClarity(goal, narrative, constraints, solutions) {
  const text = `${goal} ${narrative}`.toLowerCase();
  let score = 0;
  if (hasMatch(text, /\b(return|output|compute|calculate|determine|identify|find|select)\b/)) score += 0.35;
  if (hasMatch(text, /\b(if|otherwise|exactly|only|single|unless|when)\b/)) score += 0.2;
  if (goal.length >= 30) score += 0.15;
  if (constraints.length > 0) score += 0.15;
  if (narrative.length >= 20) score += 0.1;
  if (solutions.length === 1) score += 0.1;
  return clamp(score);
}

function scoreAmbiguity(goal, narrative, constraints, solutions, context) {
  const text = `${goal} ${narrative} ${constraints.join(' ')} ${context}`.toLowerCase();
  let score = 0;
  if (hasMatch(text, /\b(broad|broader|general|overall|meaningful|various|ambiguous|underspecified)\b|trade[- ]offs?|student experience/)) score += 0.45;
  if (solutions.length >= 3) score += 0.25;
  if (constraints.some((item) => /\b(many|consider|balance|multiple|trade[- ]offs?)\b/i.test(item))) score += 0.2;
  if (hasMatch(goal.toLowerCase(), /\b(help make|improve|better|experience|life)\b/)) score += 0.15;
  return clamp(score);
}

function scoreSolutionSpace(solutions) {
  return clamp(0.1 + new Set(solutions.map((solution) => solution.toLowerCase())).size * 0.2);
}

function scoreCompetingConstraints(constraints) {
  if (constraints.length === 0) return 0.05;
  const text = constraints.join(' ').toLowerCase();
  const pushesDown = /\b(lower|reduce|minimize|less|cheaper|decrease)\b/.test(text);
  const pushesUp = /\b(higher|maximize|more|increase|faster|speed|greater|reliability)\b/.test(text);
  if (pushesDown && pushesUp) return 0.9;
  if (constraints.length >= 2) return clamp(0.2 + constraints.length * 0.1);
  return 0.15;
}

class StructurednessEngine {
  analyze(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new TypeError('Structuredness analysis requires a scenario object.');
    }

    const narrative = normalizeText(input.narrative);
    const goal = normalizeText(input.goal);
    const context = normalizeText(input.context);
    const constraints = normalizeList(input.constraints);
    const solutions = normalizeList(input.possibleSolutions);
    if (!narrative && !goal && !context && constraints.length === 0 && solutions.length === 0) {
      throw new Error('Structuredness analysis requires at least one scenario field.');
    }

    const dimensions = {
      ambiguity: scoreAmbiguity(goal, narrative, constraints, solutions, context),
      solutionSpace: scoreSolutionSpace(solutions),
      goalClarity: scoreGoalClarity(goal, narrative, constraints, solutions),
      competingConstraints: scoreCompetingConstraints(constraints),
    };
    const baselineScore = clamp(
      DIMENSION_WEIGHTS.ambiguity * dimensions.ambiguity +
        DIMENSION_WEIGHTS.unclearGoal * (1 - dimensions.goalClarity) +
        DIMENSION_WEIGHTS.solutionSpace * dimensions.solutionSpace +
        DIMENSION_WEIGHTS.competingConstraints * dimensions.competingConstraints,
    );
    const suppliedFields = [narrative, goal, context, constraints.length > 0, solutions.length > 0]
      .filter(Boolean).length;
    const confidence = Number((0.4 + suppliedFields * 0.12).toFixed(2));
    const reasoning = [
      `Ambiguity signal: ${dimensions.ambiguity.toFixed(2)}.`,
      `Goal clarity: ${dimensions.goalClarity.toFixed(2)}.`,
      `${solutions.length} distinct example solution(s) informed the solution-space estimate.`,
      `${constraints.length} stated constraint(s) informed the competing-constraints estimate.`,
    ];

    return {
      baselineScore: Number(baselineScore.toFixed(3)),
      overall: Number(baselineScore.toFixed(3)),
      dimensions: Object.fromEntries(Object.entries(dimensions).map(([name, value]) => [name, Number(value.toFixed(3))])),
      confidence,
      reasoning,
      summary: baselineScore < 0.35
        ? 'The task is highly structured, with a clear goal and constrained solution space.'
        : baselineScore < 0.6
          ? 'The task has a mix of clear requirements and open-ended choices.'
          : 'The task is highly open-ended, with ambiguity and multiple valid approaches.',
    };
  }
}

const structurednessEngine = new StructurednessEngine();

module.exports = { DIMENSION_WEIGHTS, StructurednessEngine, structurednessEngine };