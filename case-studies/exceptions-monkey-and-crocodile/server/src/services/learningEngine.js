const conceptRules = [
  {
    keywords: ['repeat', 'again', 'each', 'every', 'loop'],
    pattern: 'Repetition',
    pythonConcept: 'for / while loops',
    explanation: 'Your reasoning repeats an action, which maps naturally to loop constructs.'
  },
  {
    keywords: ['if', 'when', 'unless', 'decide', 'choose', 'condition'],
    pattern: 'Decision making',
    pythonConcept: 'if / elif / else',
    explanation: 'You are branching based on a condition, which is exactly what conditional statements express.'
  },
  {
    keywords: ['list', 'items', 'collection', 'group', 'many'],
    pattern: 'Collection handling',
    pythonConcept: 'lists and dictionaries',
    explanation: 'You grouped multiple values, so Python collections help store and process them.'
  },
  {
    keywords: ['calculate', 'total', 'average', 'sum', 'score', 'cost'],
    pattern: 'Computation',
    pythonConcept: 'variables and arithmetic expressions',
    explanation: 'You are transforming values into a result, so variables and expressions become useful.'
  },
  {
    keywords: ['step', 'process', 'recipe', 'function', 'reuse'],
    pattern: 'Reusable procedure',
    pythonConcept: 'functions',
    explanation: 'You described a repeatable process, which maps to a Python function.'
  },
  {
    keywords: ['compare', 'match', 'filter', 'find', 'search'],
    pattern: 'Selection and filtering',
    pythonConcept: 'comparisons and list comprehensions',
    explanation: 'You are narrowing options using rules, which Python can express with comparisons and filters.'
  }
];

function mapReasoning(reasoning = '') {
  const lower = reasoning.toLowerCase();
  const matches = conceptRules.filter((rule) => rule.keywords.some((keyword) => lower.includes(keyword)));
  return matches.length ? matches : [{
    pattern: 'Sequential thinking',
    pythonConcept: 'statements and variables',
    explanation: 'You described a step-by-step solution. Python starts by representing those steps as statements.'
  }];
}

function generateCode(scenario, maps) {
  const concepts = maps.map((item) => item.pythonConcept).join(', ');
  const hasLoop = concepts.includes('loop');
  const hasCondition = concepts.includes('if');
  const hasFunction = concepts.includes('function');

  if (hasLoop && hasCondition) {
    return 'items = [12, 7, 19, 4]\nthreshold = 10\n\nfor item in items:\n    if item >= threshold:\n        print(f"{item} needs attention")\n    else:\n        print(f"{item} is okay")';
  }

  if (hasFunction) {
    return 'def solve_scenario(inputs):\n    result = []\n    for value in inputs:\n        result.append(value * 2)\n    return result\n\nprint(solve_scenario([1, 2, 3]))';
  }

  if (hasLoop) {
    return 'steps = ["notice the situation", "look for a pattern", "apply the rule"]\n\nfor step in steps:\n    print(step)';
  }

  if (hasCondition) {
    return 'temperature = 32\n\nif temperature > 30:\n    print("Take action now")\nelse:\n    print("Keep observing")';
  }

  return `scenario = "${scenario.title.replace(/"/g, '\\"')}"\nreasoning = "Break the situation into clear steps"\nprint(scenario)\nprint(reasoning)`;
}

function explainCode(maps) {
  return `The code starts from your natural reasoning and turns it into Python structure: ${maps.map((map) => `${map.pattern} becomes ${map.pythonConcept}`).join('; ')}.`;
}

function evaluatePrompt(promptText = '') {
  const feedback = [];
  let score = 35;
  if (promptText.length > 40) score += 15;
  else feedback.push('Add more context about the situation and expected output.');
  if (/step|explain|why|reason/i.test(promptText)) score += 20;
  else feedback.push('Ask the AI to explain its reasoning, not just produce code.');
  if (/example|input|output|data/i.test(promptText)) score += 15;
  else feedback.push('Include an example input or output to make the prompt testable.');
  if (/python|loop|if|list|function/i.test(promptText)) score += 15;
  else feedback.push('Name the Python concept you think may apply.');
  return {
    score: Math.min(score, 100),
    feedback: feedback.length ? feedback : ['Strong prompt: it includes context, reasoning, examples, and a Python direction.']
  };
}

function detectMisconceptions(reasoning = '') {
  const misses = [];
  if (/always|never/i.test(reasoning)) misses.push('Watch for absolute rules. Programming logic often needs explicit edge cases.');
  if (reasoning.length < 60) misses.push('Reasoning is brief. Try naming the inputs, decision rule, and expected result.');
  return misses;
}

function masterySignals(maps, promptScore) {
  const signals = maps.map((map) => `Recognized ${map.pattern.toLowerCase()}`);
  if (promptScore >= 70) signals.push('Prompt maturity is developing');
  return signals;
}

module.exports = { mapReasoning, generateCode, explainCode, evaluatePrompt, detectMisconceptions, masterySignals };
