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

// A Python snippet for every concept used across the seeded scenarios and the
// Rosewood Manor story. Generation is driven by the scenario's declared
// `concepts` so the learner always sees code that matches the scenario, instead
// of a generic fallback derived only from keyword-matching their reasoning text.
const conceptCodeTemplates = {
  variables: `bag_weight = 4.5\nprint(f"The bag weighs {bag_weight} kg")`,
  arithmetic: `samosa = 15\njuice = 20\ntotal = samosa + juice\nprint(f"Total cost: {total}")`,
  subtraction: `pocket_money = 100\nspent = 35\nremaining = pocket_money - spent\nprint(f"Money left: {remaining}")`,
  strings: `name = "asha"\ngreeting = f"Hello, {name.title()}!"\nprint(greeting)`,
  conditionals: `raining = True\nif raining:\n    print("Carry an umbrella")\nelse:\n    print("Leave the umbrella at home")`,
  comparisons: `score = 72\npass_mark = 40\npassed = score >= pass_mark\nprint("Passed" if passed else "Try again")`,
  comparison: `all_students = {"Asha", "Ravi", "Meera", "Dev"}\nsubmitted = {"Asha", "Dev"}\nmissing = all_students - submitted\nprint("Missing homework:", sorted(missing))`,
  lists: `colors = ["red", "green", "blue"]\nprint(colors)\nprint(f"{len(colors)} colors stored together")`,
  indexing: `bag = ["pencil", "eraser", "ruler"]\nfirst_item = bag[0]\nprint(f"First item: {first_item}")`,
  counting: `present = ["Asha", "Ravi", "Meera"]\ncount = len(present)\nprint(f"{count} students are present")`,
  loops: `breaks = ["morning", "lunch", "evening"]\nfor moment in breaks:\n    print(f"Reminder: drink water at {moment}")`,
  'while loops': `number = 0\nattempts = [-3, 0, 7]\nwhile number <= 0:\n    number = attempts.pop(0)\nprint(f"Accepted positive number: {number}")`,
  filtering: `movies = [("Sky", 7), ("Night Rider", 15), ("Puppy Tales", 3)]\nage = 12\nallowed = [title for title, min_age in movies if age >= min_age]\nprint(allowed)`,
  search: `stops = ["Market", "School", "Library Stop", "Park"]\ntarget = "Library Stop"\nprint("Found it" if target in stops else "Not on this route")`,
  averages: `scores = [72, 68, 90, 85, 60]\naverage = sum(scores) / len(scores)\nprint(f"Average score: {average:.1f}")`,
  modulo: `roll_numbers = [1, 2, 3, 4, 5, 6]\nteam_a = [roll for roll in roll_numbers if roll % 2 == 0]\nprint(f"Team A: {team_a}")`,
  dictionaries: `supplies = {"chalk": 12, "markers": 5, "notebooks": 20}\nfor name, count in supplies.items():\n    print(f"{name}: {count}")`,
  mutation: `tasks = {"homework": "pending", "reading": "pending"}\ntasks["homework"] = "done"\nprint(tasks)`,
  functions: `def total_steps(step_counts):\n    return sum(step_counts)\n\nprint(total_steps([1200, 3400, 900]))`,
  validation: `def is_valid(value):\n    return isinstance(value, (int, float)) and value > 0\n\nprint(is_valid(5), is_valid(-2))`,
  formatting: `item = "Coffee"\nprice = 120\nreceipt = f"{item:<10} Rs {price}"\nprint(receipt)`,
  'adaptive logic': `def next_level(score):\n    if score >= 80:\n        return "harder"\n    if score < 50:\n        return "easier"\n    return "similar"\n\nprint(next_level(85))`,
  sets: `witnessed = {"study", "front hall", "library"}\nclaimed = {"conservatory", "kitchen", "library", "front hall", "study"}\nunverified = claimed - witnessed\nprint("Rooms with no witness:", sorted(unverified))`,
  sorting: `events = [("glass break", "8:05"), ("lights flicker", "8:12"), ("blue coat", "8:10")]\nfor label, time in sorted(events, key=lambda pair: pair[1]):\n    print(f"{time} - {label}")`,
  datetime: `from datetime import datetime\n\nraw_times = ["8:05 pm", "8.10 PM", "8:12 pm"]\n\ndef normalize(text):\n    text = text.replace(".", ":").upper().replace(" ", "")\n    return datetime.strptime(text, "%I:%M%p")\n\nfor value in sorted(raw_times, key=normalize):\n    print(value)`,
  parsing: `statements = ["Mrs. Vale: 'At 8:05 pm I heard glass break.'"]\nfor line in statements:\n    speaker, _, rest = line.partition(":")\n    print(speaker.strip(), "->", rest.strip().strip("'"))`,
  reading: `suspects = ["Mina", "Dev", "Iris", "Ronan", "Pia"]\nrooms = ["study", "library", "conservatory", "music room", "gallery"]\nclues = []\nprint(f"{len(suspects)} suspects and {len(rooms)} rooms to examine")`,
  logic: `facts = {"weapon_found": True, "alibi_confirmed": False}\nif facts["weapon_found"] and not facts["alibi_confirmed"]:\n    print("This suspect stays on the list")`,
  recursion: `def solve(assignments, suspects, rooms):\n    if not suspects:\n        return assignments\n    suspect = suspects[0]\n    for room in rooms:\n        assignments.append((suspect, room))\n        result = solve(assignments, suspects[1:], rooms - {room})\n        if result:\n            return result\n        assignments.pop()\n    return None`,
  backtracking: `def place(queens, n):\n    row = len(queens)\n    if row == n:\n        return queens\n    for col in range(n):\n        if all(col != c and abs(col - c) != row - r for r, c in enumerate(queens)):\n            result = place(queens + [col], n)\n            if result:\n                return result\n    return None\n\nprint(place([], 4))`,
  reflection: `decisive_clue = "the blue coat seen at 8:10 pm"\nsolution = {"suspect": "Iris", "room": "study", "time": "8:05 pm"}\nprint(f"The case turned on {decisive_clue}.")\nprint(f"Backtracking kept only the assignment that fit every clue: {solution}")`
};

// Legacy heuristic: infer code purely from how the learner's reasoning mapped.
// Retained as a safety net for scenarios that declare no known concept.
function generateFromReasoning(scenario, maps) {
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

  return `scenario = "${(scenario.title || 'this scenario').replace(/"/g, '\\"')}"\nreasoning = "Break the situation into clear steps"\nprint(scenario)\nprint(reasoning)`;
}

function generateCode(scenario, maps) {
  const concepts = Array.isArray(scenario && scenario.concepts) ? scenario.concepts : [];
  for (const concept of concepts) {
    if (conceptCodeTemplates[concept]) return conceptCodeTemplates[concept];
  }
  return generateFromReasoning(scenario, maps);
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
