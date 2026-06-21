// Conversation analysis engine — used ONLY by guided/conversational mode
// (server/src/routes/conversations.js).
//
// This is a deliberate sibling to learningEngine.js, not a replacement for
// it. Free-form mode (server/src/routes/sessions.js) keeps using
// learningEngine.js exactly as-is. learningEngine.js matches keywords with
// plain string.includes(), which means short keywords like "if" also match
// inside unrelated words ("specific", "identify", "different", ...). That
// is rarely visible with a single short free-form answer, but guided mode
// assembles a longer, multi-sentence transcript from several turns, which
// makes those false positives common enough to matter. Rather than touch
// the shared file (and risk changing free-form mode's existing behavior),
// this module reimplements the same kind of rule-based, local, deterministic
// scoring with word-boundary matching, and adds one upgrade guided mode can
// safely use that free-form mode cannot: each scenario already carries a
// curated `concepts` tag (e.g. "variables", "loops"), so this engine treats
// that as a high-confidence prior alongside what the learner actually wrote.

const conceptCatalog = {
  variables: { pythonConcept: 'variables', explanation: 'You named and stored a value, which is exactly what a Python variable does.' },
  arithmetic: { pythonConcept: 'arithmetic expressions', explanation: 'You combined values into a result, which Python expresses with arithmetic operators.' },
  subtraction: { pythonConcept: 'arithmetic expressions', explanation: 'You found a difference between values, which Python expresses with subtraction.' },
  averages: { pythonConcept: 'sum, count, and division', explanation: 'You combined a total with a count, which is how Python computes an average.' },
  counting: { pythonConcept: 'counters and len()', explanation: 'You tracked how many items there are, which maps to counting or len() in Python.' },
  conditionals: { pythonConcept: 'if / elif / else', explanation: 'You branched based on a condition, which is exactly what conditional statements express.' },
  comparison: { pythonConcept: 'comparison operators', explanation: 'You compared values to reach a decision, which Python expresses with comparison operators.' },
  comparisons: { pythonConcept: 'comparison operators', explanation: 'You compared values to reach a decision, which Python expresses with comparison operators.' },
  'adaptive logic': { pythonConcept: 'branching logic', explanation: 'You adapted your action based on circumstances, which Python expresses with branching logic.' },
  validation: { pythonConcept: 'conditional checks', explanation: 'You checked whether something met a rule, which Python expresses with a conditional check.' },
  lists: { pythonConcept: 'lists', explanation: 'You grouped related values together, which Python stores in a list.' },
  indexing: { pythonConcept: 'list indexing', explanation: 'You picked out a value by its position, which Python expresses with list indexing.' },
  search: { pythonConcept: 'iteration with a search', explanation: 'You looked through items for a specific one, which Python expresses by looping with a search condition.' },
  filtering: { pythonConcept: 'list comprehensions / filtering', explanation: 'You kept only the items that matched a rule, which Python expresses with filtering.' },
  sets: { pythonConcept: 'sets', explanation: 'You compared two groups for overlap or difference, which Python expresses with sets.' },
  mutation: { pythonConcept: 'in-place updates', explanation: 'You changed part of an existing structure, which Python expresses by updating a list or dictionary in place.' },
  dictionaries: { pythonConcept: 'dictionaries', explanation: 'You paired related pieces of information, which Python stores as key-value pairs in a dictionary.' },
  loops: { pythonConcept: 'for loops', explanation: 'Your reasoning repeats an action across items, which maps naturally to a for loop.' },
  'while loops': { pythonConcept: 'while loops', explanation: 'Your reasoning repeats until a condition changes, which maps naturally to a while loop.' },
  modulo: { pythonConcept: 'the modulo operator', explanation: 'You checked a remainder pattern, which Python expresses with the modulo operator (%).' },
  functions: { pythonConcept: 'functions', explanation: 'You described a reusable, repeatable process, which Python expresses as a function.' },
  strings: { pythonConcept: 'string operations', explanation: 'You combined or shaped text, which Python handles with string operations.' },
  formatting: { pythonConcept: 'string formatting', explanation: 'You shaped values into readable text, which Python expresses with string formatting.' }
};

// Word-boundary keyword bank, used as a secondary signal against the
// learner's actual words (in addition to the scenario's own concept tags).
const conceptKeywordPatterns = {
  variables: ['name', 'store', 'remember', 'value', 'variable', 'label'],
  arithmetic: ['add', 'sum', 'total', 'multiply', 'divide', 'calculate'],
  subtraction: ['subtract', 'remaining', 'difference', 'left over'],
  averages: ['average', 'mean'],
  counting: ['count', 'how many', 'length', 'size'],
  conditionals: ['if', 'else', 'condition', 'decide', 'rule', 'when', 'unless'],
  comparison: ['compare', 'greater', 'smaller', 'larger', 'more than', 'less than'],
  comparisons: ['compare', 'greater', 'smaller', 'larger', 'more than', 'less than'],
  'adaptive logic': ['depends', 'adapt', 'situation', 'rule'],
  validation: ['valid', 'check', 'allowed', 'correct'],
  lists: ['list', 'group', 'collection', 'together', 'items', 'order'],
  indexing: ['position', 'index', 'first', 'second', 'last'],
  search: ['find', 'search', 'look for', 'locate'],
  filtering: ['filter', 'match', 'keep', 'only', 'qualify'],
  sets: ['overlap', 'unique', 'both', 'difference between'],
  mutation: ['update', 'change', 'modify', 'replace'],
  dictionaries: ['pair', 'key', 'lookup', 'map to', 'associate'],
  loops: ['repeat', 'each', 'every', 'loop', 'again', 'process'],
  'while loops': ['until', 'keep going', 'repeat while', 'continue'],
  modulo: ['remainder', 'divisible', 'even', 'odd'],
  functions: ['function', 'reuse', 'step', 'process', 'return', 'input'],
  strings: ['text', 'combine', 'string', 'word', 'sentence'],
  formatting: ['format', 'display', 'readable', 'message']
};

function wordBoundaryMatch(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = phrase.includes(' ')
    ? new RegExp(escaped)
    : new RegExp(`\\b${escaped}\\b`);
  return pattern.test(text);
}

// Builds an abstraction map for guided-mode reasoning. Unlike
// learningEngine.mapReasoning (keyword-only, substring-based), this combines
// the scenario's own curated concept tags with word-boundary-matched
// keywords from what the learner actually wrote.
function mapReasoning(reasoning = '', scenario = null) {
  const lower = reasoning.toLowerCase();
  const scenarioConcepts = scenario?.concepts || [];

  const maps = scenarioConcepts
    .filter((concept) => conceptCatalog[concept])
    .map((concept) => {
      const keywords = conceptKeywordPatterns[concept] || [];
      const matchedKeywords = keywords.filter((keyword) => wordBoundaryMatch(lower, keyword));
      return {
        pattern: concept,
        pythonConcept: conceptCatalog[concept].pythonConcept,
        explanation: conceptCatalog[concept].explanation,
        matchedKeywords
      };
    });

  if (maps.length) return maps;

  return [{
    pattern: 'Sequential thinking',
    pythonConcept: 'statements and variables',
    explanation: 'You described a step-by-step solution. Python starts by representing those steps as statements.',
    matchedKeywords: []
  }];
}

function generateCode(scenario, maps) {
  const concepts = maps.map((item) => item.pythonConcept);
  const hasLoop = concepts.some((c) => c.includes('loop'));
  const hasCondition = concepts.some((c) => c.includes('if /') || c === 'comparison operators' || c === 'conditional checks' || c === 'branching logic');
  const hasFunction = concepts.includes('functions');
  const hasDict = concepts.includes('dictionaries');
  const hasList = concepts.includes('lists') || concepts.includes('list indexing') || concepts.includes('list comprehensions / filtering');
  const hasArithmetic = concepts.some((c) => c.includes('arithmetic') || c.includes('sum, count'));
  const hasStrings = concepts.some((c) => c.includes('string'));
  const hasVariables = concepts.includes('variables');

  if (hasLoop && hasCondition) {
    return 'items = [12, 7, 19, 4]\nthreshold = 10\n\nfor item in items:\n    if item >= threshold:\n        print(f"{item} needs attention")\n    else:\n        print(f"{item} is okay")';
  }
  if (hasFunction) {
    return 'def solve_scenario(inputs):\n    result = []\n    for value in inputs:\n        result.append(value * 2)\n    return result\n\nprint(solve_scenario([1, 2, 3]))';
  }
  if (hasDict) {
    return 'profile = {"name": "Asha", "score": 87}\n\nprint(profile["name"], profile["score"])';
  }
  if (hasList) {
    return 'items = ["red", "green", "blue"]\n\nfor item in items:\n    print(item)';
  }
  if (hasLoop) {
    return 'steps = ["notice the situation", "look for a pattern", "apply the rule"]\n\nfor step in steps:\n    print(step)';
  }
  if (hasCondition) {
    return 'temperature = 32\n\nif temperature > 30:\n    print("Take action now")\nelse:\n    print("Keep observing")';
  }
  if (hasArithmetic) {
    return 'price_one = 18\nprice_two = 25\n\ntotal = price_one + price_two\nprint(total)';
  }
  if (hasStrings) {
    return 'learner_name = "Asha"\ngreeting = f"Hello, {learner_name}!"\n\nprint(greeting)';
  }
  if (hasVariables) {
    return `bag_weight = 4.2\n\nprint(bag_weight)`;
  }
  return `scenario = "${scenario.title.replace(/"/g, '\\"')}"\nreasoning = "Break the situation into clear steps"\nprint(scenario)\nprint(reasoning)`;
}

function explainCode(maps) {
  return `Your guided answers map to Python like this: ${maps.map((map) => `${map.pattern} becomes ${map.pythonConcept}`).join('; ')}.`;
}

// Scores the overall reasoning quality of a guided session. Distinct from
// learningEngine.evaluatePrompt, which scores a learner's prompt-to-an-AI
// text — guided mode doesn't collect a separate prompt, so this scores the
// reasoning transcript itself: length/effort, concept alignment, and
// specificity (presence of concrete values/names, not just abstract talk).
function evaluateReasoning(reasoning = '', maps = []) {
  const feedback = [];
  let score = 30;

  const wordCount = reasoning.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 15) score += 20;
  else feedback.push('Try elaborating a little more on each step of your reasoning.');

  const hasRealConcept = maps.some((map) => map.pattern !== 'Sequential thinking');
  if (hasRealConcept) score += 25;
  else feedback.push('Connect your answer more directly to a specific Python concept.');

  if (/\d/.test(reasoning) || /[a-z_]+\s*=/.test(reasoning)) score += 15;
  else feedback.push('Try naming a concrete example value or variable name.');

  if (maps.some((map) => (map.matchedKeywords || []).length > 0)) score += 10;

  return {
    score: Math.min(score, 100),
    feedback: feedback.length ? feedback : ['Strong reasoning: specific, concept-aligned, and well elaborated.']
  };
}

function detectMisconceptions(reasoning = '') {
  const misses = [];
  if (/\balways\b|\bnever\b/i.test(reasoning)) misses.push('Watch for absolute rules. Programming logic often needs explicit edge cases.');
  if (reasoning.length < 60) misses.push('Reasoning is brief. Try naming the inputs, decision rule, and expected result.');
  return misses;
}

function masterySignals(maps, reasoningScore) {
  const signals = maps.map((map) => `Recognized ${map.pattern.toLowerCase()}`);
  if (reasoningScore >= 70) signals.push('Guided reasoning maturity is developing');
  return signals;
}

module.exports = {
  mapReasoning,
  generateCode,
  explainCode,
  evaluateReasoning,
  detectMisconceptions,
  masterySignals
};
