const conceptRules = [
  { keywords: ['repeat', 'again', 'each', 'every', 'loop', 'iterate', 'through each'], pattern: 'Repetition', pythonConcept: 'for / while loops', explanation: 'Your reasoning repeats an action, which maps naturally to loop constructs.' },
  { keywords: ['if', 'when', 'unless', 'decide', 'choose', 'condition', 'depending', 'otherwise'], pattern: 'Decision making', pythonConcept: 'if / elif / else', explanation: 'You are branching based on a condition, which is exactly what conditional statements express.' },
  { keywords: ['list', 'items', 'collection', 'group', 'many', 'array', 'multiple'], pattern: 'Collection handling', pythonConcept: 'lists and dictionaries', explanation: 'You grouped multiple values, so Python collections help store and process them.' },
  { keywords: ['calculate', 'total', 'average', 'sum', 'score', 'cost', 'compute', 'add'], pattern: 'Computation', pythonConcept: 'variables and arithmetic expressions', explanation: 'You are transforming values into a result, so variables and expressions become useful.' },
  { keywords: ['step', 'process', 'recipe', 'function', 'reuse', 'helper', 'encapsulate'], pattern: 'Reusable procedure', pythonConcept: 'functions', explanation: 'You described a repeatable process, which maps to a Python function.' },
  { keywords: ['compare', 'match', 'filter', 'find', 'search', 'select', 'only those'], pattern: 'Selection and filtering', pythonConcept: 'comparisons and list comprehensions', explanation: 'You are narrowing options using rules, which Python can express with comparisons and filters.' },
  { keywords: ['error', 'check', 'validate', 'wrong', 'problem', 'fail', 'ensure', 'verify'], pattern: 'Error guarding', pythonConcept: 'try / except', explanation: 'You are watching for incorrect input, which Python handles with exception handling.' },
  { keywords: ['convert', 'change', 'map', 'extract', 'format', 'transform', 'turn into'], pattern: 'Data transformation', pythonConcept: 'map and comprehensions', explanation: 'You are converting data from one form to another, which Python does with comprehensions.' },
  { keywords: ['collect', 'gather', 'accumulate', 'build', 'track', 'keep', 'store results'], pattern: 'Accumulation', pythonConcept: 'accumulator pattern', explanation: 'You are building up a result over time, a classic accumulator pattern.' },
  { keywords: ['stop', 'skip', 'abort', 'break', 'ignore', 'exit', 'early'], pattern: 'Early termination', pythonConcept: 'break / continue', explanation: 'You want to stop early under a condition, which uses break or continue in loops.' },
  { keywords: ['numbered', 'first', 'last', 'position', 'rank', 'index', 'order', 'sequence'], pattern: 'Position tracking', pythonConcept: 'enumerate / range', explanation: 'You care about positions or ordering, which Python handles with enumerate and range.' },
];

function mapReasoning(reasoning = '') {
  const lower = reasoning.toLowerCase();
  const negations = ['not', "don't", "won't", "shouldn't", "wouldn't", "never"];
  const matches = conceptRules.filter((rule) => {
    const matched = rule.keywords.some((keyword) => lower.includes(keyword));
    if (!matched) return false;
    const isNegated = negations.some((neg) => {
      const idx = lower.indexOf(neg);
      if (idx === -1) return false;
      const after = lower.slice(idx + neg.length).trim();
      return rule.keywords.some((kw) => after.startsWith(kw));
    });
    return !isNegated;
  });
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
  const hasTry = concepts.includes('try');
  const hasAccumulate = concepts.includes('accumulator');
  const hasTransform = concepts.includes('comprehensions');
  const hasPosition = concepts.includes('enumerate');

  const titleWords = scenario.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  const nouns = titleWords.filter((w) => w.length > 3).slice(0, 3);
  const varName = nouns[0] || 'items';

  if (hasLoop && hasCondition && hasFunction) {
    return `def process_${varName}(${varName}_list):\n    results = []\n    for item in ${varName}_list:\n        if item > 0:\n            results.append(item)\n    return results\n\noutput = process_${varName}([1, -2, 3, 0, 5])\nprint(output)`;
  }

  if (hasTry) {
    return `def safe_${varName}(value):\n    try:\n        result = int(value)\n        return result\n    except ValueError:\n        return None\n\nprint(safe_${varName}("42"))\nprint(safe_${varName}("abc"))`;
  }

  if (hasAccumulate) {
    return `${varName}_data = [12, 7, 19, 4]\ntotal = 0\n\nfor value in ${varName}_data:\n    total += value\n\nprint(f"Total: {total}")`;
  }

  if (hasTransform) {
    return `${varName}_values = [1, 2, 3, 4, 5]\ntransformed = [x * 2 for x in ${varName}_values]\nprint(transformed)`;
  }

  if (hasPosition) {
    return `${varName}_list = ["first", "second", "third"]\nfor index, item in enumerate(${varName}_list, start=1):\n    print(f"{index}: {item}")`;
  }

  if (hasLoop && hasCondition) {
    return `for item in ${varName}_list:\n    if item >= 10:\n        print(f"{item} meets the criteria")\n    else:\n        print(f"{item} does not meet the criteria")`;
  }

  if (hasFunction) {
    return `def solve_${varName}(inputs):\n    result = []\n    for value in inputs:\n        result.append(value * 2)\n    return result\n\nprint(solve_${varName}([1, 2, 3]))`;
  }

  if (hasLoop) {
    return `for item in ${varName}_list:\n    print(item)`;
  }

  if (hasCondition) {
    return `${varName}_value = 25\n\nif ${varName}_value > 20:\n    print("Above threshold")\nelse:\n    print("Below threshold")`;
  }

  const safeTitle = scenario.title.replace(/"/g, '\\"');
  return `scenario = "${safeTitle}"\n${varName}_data = [...]\n# Add your logic here\nprint(scenario)`;
}

function explainCode(maps) {
  return `The code translates your natural reasoning into Python: ${maps.map((m) => `${m.pattern} → ${m.pythonConcept}`).join('; ')}. Each concept maps to a specific Python construct you can reuse.`;
}

function evaluatePrompt(promptText = '') {
  const feedback = [];
  const dimensions = [];

  let contextScore = 0;
  if (promptText.length > 40) contextScore = 60;
  else if (promptText.length > 20) contextScore = 30;
  else feedback.push('Add more context about the situation and expected output.');
  dimensions.push({ name: 'Context clarity', score: contextScore, max: 60 });

  let reasoningScore = 0;
  if (/step|explain|why|reason|how|walk through/i.test(promptText)) reasoningScore = 60;
  else if (/what|tell|give/i.test(promptText)) reasoningScore = 30;
  else feedback.push('Ask the AI to explain its reasoning, not just produce code.');
  dimensions.push({ name: 'Reasoning request', score: reasoningScore, max: 60 });

  let testabilityScore = 0;
  if (/example|input|output|data|sample|test case/i.test(promptText)) testabilityScore = 60;
  else if (/result|value|answer/i.test(promptText)) testabilityScore = 30;
  else feedback.push('Include an example input or output to make the prompt testable.');
  dimensions.push({ name: 'Testability', score: testabilityScore, max: 60 });

  let pythonScore = 0;
  if (/python|loop|if|list|function|dictionary|array|string/i.test(promptText)) pythonScore = 60;
  else feedback.push('Name the Python concept you think may apply.');
  dimensions.push({ name: 'Python awareness', score: pythonScore, max: 60 });

  let specificityScore = 20;
  if (/scenario|situation|problem|task/i.test(promptText)) specificityScore += 20;
  if (/specifically|exactly|precisely/i.test(promptText)) specificityScore += 20;
  dimensions.push({ name: 'Specificity', score: specificityScore, max: 60 });

  const totalMax = 300;
  const totalActual = contextScore + reasoningScore + testabilityScore + pythonScore + specificityScore;
  const overall = Math.round((totalActual / totalMax) * 100);

  if (feedback.length === 0) {
    feedback.push('Strong prompt: it includes context, reasoning, examples, and a Python direction.');
  }

  let classification = 'Surface-level';
  if (reasoningScore >= 60 && pythonScore >= 60) classification = 'Translational';
  else if (reasoningScore >= 60 || pythonScore >= 60) classification = 'Structural';

  return {
    score: overall,
    dimensions,
    feedback,
    classification
  };
}

function detectMisconceptions(reasoning = '') {
  const misses = [];
  if (/always|never|everyone|nobody|everything|nothing/i.test(reasoning))
    misses.push('Watch for absolute rules. Programming logic often needs explicit edge cases.');
  if (reasoning.length < 60)
    misses.push('Reasoning is brief. Try naming the inputs, decision rule, and expected result.');
  if (/\barray\b/i.test(reasoning))
    misses.push('In Python, we call it a "list" rather than an array.');
  if (/<=|>=/.test(reasoning) && !/boundary|edge|limit|threshold/.test(reasoning.toLowerCase()))
    misses.push('Check boundary conditions when using <= or >= — is the edge case handled correctly?');
  if (!/start|begin|initial|first|set/.test(reasoning.toLowerCase()))
    misses.push('No starting value mentioned. Remember to initialize variables before using them.');
  if (/sort|order|arrange/.test(reasoning.toLowerCase()) && !/loop|iterate|for|each/.test(reasoning.toLowerCase()))
    misses.push('Sorting or ordering typically requires iterating through the data.');
  return misses;
}

function classifyInteraction(reasoning = '') {
  const lower = reasoning.toLowerCase();
  const hasPatterns = conceptRules.some((r) => r.keywords.some((kw) => lower.includes(kw)));
  const hasStructure = /because|since|therefore|so that|in order to/.test(lower);
  const hasSpecifics = /line|code|variable|function|loop|condition|list/.test(lower);
  if (hasPatterns && hasSpecifics) return 'Translational';
  if (hasStructure || hasPatterns) return 'Structural';
  return 'Surface-level';
}

function masterySignals(maps, promptScore, classification) {
  const signals = maps.map((map) => `Recognized ${map.pattern.toLowerCase()}`);
  if (promptScore >= 70) signals.push('Prompt maturity is developing');
  if (maps.length >= 3) signals.push('Identified multiple reasoning patterns — strong analytical thinking');
  if (classification === 'Translational') signals.push('Excellent translation of reasoning to Python constructs');
  if (classification === 'Structural') signals.push('Good structural thinking — try naming specific Python constructs');
  return signals;
}

module.exports = { mapReasoning, generateCode, explainCode, evaluatePrompt, detectMisconceptions, classifyInteraction, masterySignals };
