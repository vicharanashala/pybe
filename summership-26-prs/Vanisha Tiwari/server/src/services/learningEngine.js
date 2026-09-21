const conceptRules = [
  {
    keywords: ['repeat', 'again', 'each', 'every', 'loop'],
    pattern: 'Repetition',
    pythonConcept: 'for / while loops',
    explanation:
      'Your reasoning repeats an action, which maps naturally to loop constructs.'
  },
  {
    keywords: ['if', 'when', 'unless', 'decide', 'choose', 'condition'],
    pattern: 'Decision making',
    pythonConcept: 'if / elif / else',
    explanation:
      'You are branching based on a condition, which is exactly what conditional statements express.'
  },
  {
    keywords: ['list', 'items', 'collection', 'group', 'many'],
    pattern: 'Collection handling',
    pythonConcept: 'lists',
    explanation:
      'You grouped multiple values, so a Python list can store and process them.'
  },
  {
    keywords: ['dictionary', 'key', 'value', 'lookup', 'name with count'],
    pattern: 'Key-value storage',
    pythonConcept: 'dictionaries',
    explanation:
      'You are connecting names to values, which maps naturally to Python dictionaries.'
  },
  {
    keywords: ['calculate', 'total', 'average', 'sum', 'score', 'cost'],
    pattern: 'Computation',
    pythonConcept: 'variables and arithmetic expressions',
    explanation:
      'You are transforming values into a result using variables and arithmetic.'
  },
  {
    keywords: ['step', 'process', 'recipe', 'function', 'reuse'],
    pattern: 'Reusable procedure',
    pythonConcept: 'functions',
    explanation:
      'You described a repeatable process, which maps to a Python function.'
  },
  {
    keywords: ['compare', 'match', 'filter', 'find', 'search'],
    pattern: 'Selection and filtering',
    pythonConcept: 'comparisons and filtering',
    explanation:
      'You are selecting values according to a rule.'
  },
  {
    keywords: ['remainder', 'divisible', 'even', 'odd'],
    pattern: 'Remainder checking',
    pythonConcept: 'modulo',
    explanation:
      "You are checking a remainder, which maps to Python's modulo operator."
  },
  {
    keywords: ['position', 'first', 'second', 'index'],
    pattern: 'Position access',
    pythonConcept: 'indexing',
    explanation:
      'You are accessing a value by its position in a collection.'
  },
  {
    keywords: ['subtract', 'remaining', 'left', 'spent'],
    pattern: 'Subtraction',
    pythonConcept: 'subtraction',
    explanation:
      'You are finding a remaining value by subtracting one amount from another.'
  }
];

function mapReasoning(reasoning = '', scenario = {}) {
  const lower = reasoning.toLowerCase();

  const scenarioConcepts =
    (scenario.concepts || []).map((concept) =>
      concept.toLowerCase()
    );

  const conceptRules = [
    {
      scenarioKeywords: ['loop', 'loops', 'repetition'],
      reasoningKeywords: [
        'repeat',
        'again',
        'each',
        'every',
        'loop',
        'compare each'
      ],
      pattern: 'Repetition',
      pythonConcept: 'for / while loops',
      explanation:
        'The scenario requires processing multiple values, which maps naturally to loops.'
    },

    {
      scenarioKeywords: [
        'condition',
        'conditional',
        'comparison',
        'comparisons'
      ],
      reasoningKeywords: [
        'if',
        'when',
        'unless',
        'decide',
        'choose',
        'condition',
        'compare',
        'larger',
        'smaller',
        'greater'
      ],
      pattern: 'Decision making',
      pythonConcept: 'if / elif / else',
      explanation:
        'The scenario requires making a decision based on a condition.'
    },

    {
      scenarioKeywords: [
        'list',
        'lists',
        'collection'
      ],
      reasoningKeywords: [
        'list',
        'items',
        'collection',
        'group',
        'many'
      ],
      pattern: 'Collection handling',
      pythonConcept: 'lists',
      explanation:
        'The scenario works with multiple values, which Python can represent using lists.'
    },

    {
      scenarioKeywords: [
        'dictionary',
        'dictionaries',
        'key-value'
      ],
      reasoningKeywords: [
        'name',
        'key',
        'value',
        'dictionary',
        'lookup'
      ],
      pattern: 'Key-value storage',
      pythonConcept: 'dictionaries',
      explanation:
        'The scenario connects keys with values, which maps naturally to dictionaries.'
    },

    {
      scenarioKeywords: [
        'arithmetic',
        'calculation',
        'average',
        'variables',
        'subtraction'
      ],
      reasoningKeywords: [
        'calculate',
        'total',
        'average',
        'sum',
        'score',
        'cost',
        'add',
        'divide',
        'subtract'
      ],
      pattern: 'Computation',
      pythonConcept: 'variables and arithmetic expressions',
      explanation:
        'The scenario requires transforming values into a result using variables and arithmetic.'
    },

    {
      scenarioKeywords: [
        'filter',
        'filtering',
        'comparison',
        'comparisons',
        'search'
      ],
      reasoningKeywords: [
        'compare',
        'match',
        'filter',
        'find',
        'search',
        'larger',
        'smaller',
        'greater'
      ],
      pattern: 'Selection and filtering',
      pythonConcept: 'comparisons and filtering',
      explanation:
        'The scenario requires selecting values according to a rule.'
    },

    {
      scenarioKeywords: [
        'function',
        'functions',
        'reusable'
      ],
      reasoningKeywords: [
        'function',
        'reuse',
        'reusable',
        'procedure'
      ],
      pattern: 'Reusable procedure',
      pythonConcept: 'functions',
      explanation:
        'The scenario describes a reusable operation, which maps naturally to a Python function.'
    }
  ];

  const matches = conceptRules.filter((rule) => {
    const scenarioMatches =
      rule.scenarioKeywords.some((keyword) =>
        scenarioConcepts.some((concept) =>
          concept.includes(keyword)
        )
      );

    const reasoningMatches =
      rule.reasoningKeywords.some((keyword) =>
        lower.includes(keyword)
      );

    return scenarioMatches && reasoningMatches;
  });

  if (matches.length > 0) {
    return matches;
  }

  // If the learner's wording does not contain
  // the expected keywords, trust the scenario.
  return conceptRules.filter((rule) =>
    rule.scenarioKeywords.some((keyword) =>
      scenarioConcepts.some((concept) =>
        concept.includes(keyword)
      )
    )
  );
}
/*
 * The scenario determines what the generated code should solve.
 *
 * This is deliberately explicit rather than asking the engine
 * to guess a solution from generic concept keywords.
 */
function generateCode(scenario, maps) {
  const title = scenario.title.toLowerCase();

  // Beginner scenarios
  if (title.includes('bag weight')) {
    return `bag_weight = 4.5

print(bag_weight)`;
  }

  if (title.includes('rainy day')) {
    return `raining = True

if raining:
    print("Carry an umbrella")
else:
    print("Leave the umbrella at home")`;
  }

  if (title.includes('snack prices')) {
    return `samosa_price = 20
juice_price = 30

total_cost = samosa_price + juice_price

print(total_cost)`;
  }

  if (title.includes('greeting by name')) {
    return `name = "Ishi"

greeting = f"Hello, {name}!"

print(greeting)`;
  }

  if (title.includes('pass mark')) {
    return `score = 72
pass_mark = 40

if score >= pass_mark:
    print("Pass")
else:
    print("Fail")`;
  }

  if (title.includes('pocket money')) {
    return `pocket_money = 500
spent = 120

remaining = pocket_money - spent

print(remaining)`;
  }

  if (title.includes('favorite color')) {
    return `colors = ["blue", "green", "black"]

print(colors)`;
  }

  if (title.includes('first item')) {
    return `items = ["pencil", "eraser", "ruler"]

first_item = items[0]

print(first_item)`;
  }

  if (title.includes('attendance count')) {
    return `present_students = [
    "Asha",
    "Rahul",
    "Ishi",
    "Neha"
]

count = len(present_students)

print(count)`;
  }

  if (title.includes('temperature message')) {
    return `temperature = 32

if temperature > 30:
    print("Hot")
else:
    print("Comfortable")`;
  }

  // Explorer scenarios
  if (title.includes('water bottle')) {
    return `breaks = [
    "10:30",
    "12:00",
    "15:00"
]

for break_time in breaks:
    print("Drink water at", break_time)`;
  }

  if (title.includes('longest pencil')) {
    return `lengths = [12, 15, 10, 18]

longest = lengths[0]

for length in lengths[1:]:
    if length > longest:
        longest = length

print(longest)`;
  }

  if (title.includes('chore checklist')) {
    return `chores = [
    "sweep floor",
    "wash dishes",
    "organize desk"
]

for chore in chores:
    print(chore, "- done")`;
  }

  if (title.includes('movie age')) {
    return `movies = [
    {"title": "Movie A", "minimum_age": 10},
    {"title": "Movie B", "minimum_age": 15},
    {"title": "Movie C", "minimum_age": 12}
]

learner_age = 12

for movie in movies:
    if learner_age >= movie["minimum_age"]:
        print(movie["title"])`;
  }

  if (title.includes('classroom supply')) {
    return `supplies = {
    "chalk": 20,
    "markers": 8,
    "notebooks": 15
}

print(supplies["markers"])`;
  }

  if (title.includes('bus stop')) {
    return `stops = [
    "Main Gate",
    "Library Stop",
    "Market Stop",
    "Station"
]

target = "Library Stop"

for stop in stops:
    if stop == target:
        print("Found:", stop)
        break`;
  }

  if (title.includes('average practice')) {
    return `scores = [80, 75, 90, 85, 70]

total = 0

for score in scores:
    total += score

average = total / len(scores)

print(average)`;
  }

  if (title.includes('even roll')) {
    return `roll_numbers = [1, 2, 3, 4, 5, 6]

even_numbers = []

for roll_number in roll_numbers:
    if roll_number % 2 == 0:
        even_numbers.append(roll_number)

print(even_numbers)`;
  }

  if (title.includes('capitalize name')) {
    return `names = ["ishi", "rahul", "neha"]

for name in names:
    print(name.title())`;
  }

  if (title.includes('missing homework')) {
    return `all_students = {"Asha", "Rahul", "Ishi", "Neha"}
submitted = {"Asha", "Ishi"}

missing = all_students - submitted

print(missing)`;
  }

  // Builder scenarios
  if (title.includes('reusable discount')) {
    return `def apply_discount(bill):
    if bill >= 1000:
        return bill * 0.9

    return bill

print(apply_discount(1200))`;
  }

  if (title.includes('mini quiz')) {
    return `def check_answer(answer, correct_answer):
    return answer == correct_answer

print(check_answer("Python", "Python"))`;
  }

  if (title.includes('step counter')) {
    return `def total_steps(step_counts):
    return sum(step_counts)

print(total_steps([3000, 4500, 5000]))`;
  }

  if (title.includes('safe username')) {
    return `def make_username(name):
    return name.lower().replace(" ", "")

print(make_username("Ishi Jain"))`;
  }

  if (title.includes('retry until valid')) {
    return `number = -2

while number <= 0:
    print("Invalid number")
    number += 1

print("Valid number:", number)`;
  }

  if (title.includes('score report')) {
    return `def create_report(name, score):
    return {
        "name": name,
        "score": score
    }

print(create_report("Ishi", 85))`;
  }

  if (title.includes('task status')) {
    return `tasks = {
    "assignment": "pending",
    "project": "pending"
}

tasks["assignment"] = "done"

print(tasks)`;
  }

  if (title.includes('receipt')) {
    return `def create_receipt(item, price):
    return f"{item}: ₹{price}"

print(create_receipt("Samosa", 20))`;
  }

  if (title.includes('choose next scenario')) {
    return `def choose_level(score):
    if score >= 80:
        return "Advanced"
    elif score >= 50:
        return "Intermediate"
    else:
        return "Foundation"

print(choose_level(75))`;
  }

  if (title.includes('reflection keyword')) {
    return `reflection = "I was confused about loops"

keywords = ["confused", "stuck", "unclear"]

needs_support = any(
    word in reflection.lower()
    for word in keywords
)

print(needs_support)`;
  }

  /*
   * Safe fallback.
   *
   * We still avoid pretending that generic code solves an
   * unknown scenario.
   */
  return `scenario = "${scenario.title.replace(/"/g, '\\"')}"

print("Scenario:", scenario)`;
}

function explainCode(maps) {
  return `The code starts from your natural reasoning and turns it into Python structure: ${maps
    .map(
      (map) =>
        `${map.pattern} becomes ${map.pythonConcept}`
    )
    .join('; ')}.`;
}

function evaluatePrompt(promptText = '') {
  const feedback = [];

  let score = 35;

  if (promptText.length > 40) {
    score += 15;
  } else {
    feedback.push(
      'Add more context about the situation and expected output.'
    );
  }

  if (/step|explain|why|reason/i.test(promptText)) {
    score += 20;
  } else {
    feedback.push(
      'Ask the AI to explain its reasoning, not just produce code.'
    );
  }

  if (/example|input|output|data/i.test(promptText)) {
    score += 15;
  } else {
    feedback.push(
      'Include an example input or output to make the prompt testable.'
    );
  }

  if (/python|loop|if|list|function/i.test(promptText)) {
    score += 15;
  } else {
    feedback.push(
      'Name the Python concept you think may apply.'
    );
  }

  return {
    score: Math.min(score, 100),
    feedback:
      feedback.length
        ? feedback
        : [
            'Strong prompt: it includes context, reasoning, examples, and a Python direction.'
          ]
  };
}

function detectMisconceptions(reasoning = '') {
  const misses = [];

  if (/always|never/i.test(reasoning)) {
    misses.push(
      'Watch for absolute rules. Programming logic often needs explicit edge cases.'
    );
  }

  if (reasoning.length < 40) {
  misses.push(
    'Reasoning is very brief. Try naming the inputs, decision rule, and expected result.'
  );
}

  return misses;
}

function masterySignals(maps, promptScore) {
  const signals = maps.map(
    (map) =>
      `Recognized ${map.pattern.toLowerCase()}`
  );

  if (promptScore >= 70) {
    signals.push('Prompt maturity is developing');
  }

  return signals;
}

module.exports = {
  mapReasoning,
  generateCode,
  explainCode,
  evaluatePrompt,
  detectMisconceptions,
  masterySignals
};