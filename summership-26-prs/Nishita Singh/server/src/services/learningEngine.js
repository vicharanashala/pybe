const conceptRules = [
  {
    keywords: ['repeat', 'repeatedly', 'for every item', 'while there are', 'loop'],
    pattern: 'Repetition',
    pythonConcept: 'for / while loops',
    explanation: 'Your reasoning repeats an action, which maps naturally to loop constructs.'
  },
  {
    keywords: ['if', 'otherwise', 'unless', 'condition', 'greater than', 'less than'],
    pattern: 'Decision making',
    pythonConcept: 'if / elif / else',
    explanation: 'You are branching based on a condition, which is exactly what conditional statements express.'
  },
  {
    keywords: [
      'dictionary', 'key', 'value', 'pair',
      'map', 'mapping', 'store each',
      'supply name', 'count'
    ],
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
    keywords: [
      'object', 'class', 'instance', 'attribute',
      'method', 'properties and actions',
      'data and behavior'
    ],
    pattern: 'Object-oriented modelling',
    pythonConcept: 'classes and objects',
    explanation:
      'You described a real-world entity with properties and actions. In Python, a class can model that entity and objects can represent individual instances.'
  },
  {
    keywords: [
      'filter items', 'only show', 'select those',
      'compare values', 'greater than', 'less than',
      'matches the rule'
    ],
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

/**
 * Resolves a deterministic "code artifact" for a scenario + its abstraction map.
 * Returns the generated Python source, the exact stdout it produces when run
 * (each variant below is a fixed, hand-verified template, so the output is real,
 * not guessed), and a short description of the hard-coded input values the
 * program works from. Centralizing this avoids duplicating the branching logic
 * that decides which template applies.
 */
function buildCodeArtifact(scenario, maps) {
  const concepts = maps.map((item) => item.pythonConcept).join(', ');
  const hasLoop = concepts.includes('for / while loops');
  const hasCondition = concepts.includes('if / elif / else');
  const hasFunction = concepts.includes('functions');
  const hasOOP = concepts.includes('classes and objects');
  const hasCollection = concepts.includes('lists and dictionaries');
  const scenarioTitle = (scenario.title || '').toLowerCase();

  if (hasCollection) {
    if (scenarioTitle.includes('supply')) {
      return {
        key: 'collection-supply',
        code: `supplies = {
    "chalk": 20,
    "markers": 8,
    "notebooks": 15
}

supply_name = "chalk"

if supply_name in supplies:
    print(f"{supply_name}: {supplies[supply_name]} available")
else:
    print("Supply not found")`,
        input: 'supplies = {"chalk": 20, "markers": 8, "notebooks": 15}\nsupply_name = "chalk"',
        output: 'chalk: 20 available'
      };
    }

    if (scenarioTitle.includes('color')) {
      return {
        key: 'collection-color',
        code: `favorite_colors = ["blue", "green", "purple"]

for color in favorite_colors:
    print(color)`,
        input: 'favorite_colors = ["blue", "green", "purple"]',
        output: 'blue\ngreen\npurple'
      };
    }

    if (scenarioTitle.includes('attendance')) {
      return {
        key: 'collection-attendance',
        code: `present_students = ["Aarav", "Meera", "Kabir", "Zoya"]

print(f"Students present: {len(present_students)}")`,
        input: 'present_students = ["Aarav", "Meera", "Kabir", "Zoya"]',
        output: 'Students present: 4'
      };
    }

    if (scenarioTitle.includes('bag')) {
      return {
        key: 'collection-bag',
        code: `bag_items = ["pencil", "eraser", "ruler"]

print(bag_items[0])`,
        input: 'bag_items = ["pencil", "eraser", "ruler"]',
        output: 'pencil'
      };
    }

    return {
      key: 'collection-default',
      code: `items = ["first item", "second item", "third item"]

for item in items:
    print(item)`,
      input: 'items = ["first item", "second item", "third item"]',
      output: 'first item\nsecond item\nthird item'
    };
  }

  if (hasLoop && hasCondition) {
    return {
      key: 'loop-condition',
      code: `items = [12, 7, 19, 4]
threshold = 10

for item in items:
    if item >= threshold:
        print(f"{item} needs attention")
    else:
        print(f"{item} is okay")`,
      input: 'items = [12, 7, 19, 4]\nthreshold = 10',
      output: '12 needs attention\n7 is okay\n19 needs attention\n4 is okay'
    };
  }

  if (hasOOP) {
    return {
      key: 'oop',
      code: `class ScenarioEntity:
    def __init__(self, name, status="active"):
        self.name = name
        self.status = status

    def describe(self):
        return f"{self.name} is currently {self.status}"

entity = ScenarioEntity("Example entity")
print(entity.describe())`,
      input: 'entity = ScenarioEntity("Example entity")',
      output: 'Example entity is currently active'
    };
  }

  if (hasFunction) {
    return {
      key: 'function',
      code: `def solve_scenario(inputs):
    result = []
    for value in inputs:
        result.append(value * 2)
    return result

print(solve_scenario([1, 2, 3]))`,
      input: 'solve_scenario([1, 2, 3])',
      output: '[2, 4, 6]'
    };
  }

  if (hasLoop) {
    return {
      key: 'loop',
      code: `steps = ["notice the situation", "look for a pattern", "apply the rule"]

for step in steps:
    print(step)`,
      input: 'steps = ["notice the situation", "look for a pattern", "apply the rule"]',
      output: 'notice the situation\nlook for a pattern\napply the rule'
    };
  }

  if (hasCondition) {
    return {
      key: 'condition',
      code: `temperature = 32

if temperature > 30:
    print("Take action now")
else:
    print("Keep observing")`,
      input: 'temperature = 32',
      output: 'Take action now'
    };
  }

  const safeTitle = (scenario.title || 'Scenario').replace(/"/g, '\\"');
  return {
    key: 'fallback',
    code: `scenario = "${safeTitle}"
reasoning = "Break the situation into clear steps"
print(scenario)
print(reasoning)`,
    input: `scenario = "${safeTitle}"`,
    output: `${scenario.title || 'Scenario'}\nBreak the situation into clear steps`
  };
}

function generateCode(scenario, maps) {
  return buildCodeArtifact(scenario, maps).code;
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

module.exports = {
  mapReasoning,
  buildCodeArtifact,
  generateCode,
  explainCode,
  evaluatePrompt,
  detectMisconceptions,
  masterySignals
};
