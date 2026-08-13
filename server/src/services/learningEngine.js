const conceptRules = [
  {
    keywords: ['repeat', 'again', 'each', 'every', 'loop', 'multiple times', 'again and again'],
    pattern: 'Repetition',
    pythonConcept: 'for / while loops',
    explanation: 'Your reasoning repeats an action, which maps naturally to loop constructs.',
    masteryLevel: 'intermediate'
  },
  {
    keywords: ['if', 'when', 'unless', 'decide', 'choose', 'condition', 'based on', 'depends on'],
    pattern: 'Decision making',
    pythonConcept: 'if / elif / else',
    explanation: 'You are branching based on a condition, which is exactly what conditional statements express.',
    masteryLevel: 'beginner'
  },
  {
    keywords: ['list', 'items', 'collection', 'group', 'many', 'set', 'dictionary', 'map'],
    pattern: 'Collection handling',
    pythonConcept: 'lists and dictionaries',
    explanation: 'You grouped multiple values, so Python collections help store and process them.',
    masteryLevel: 'intermediate'
  },
  {
    keywords: ['calculate', 'total', 'average', 'sum', 'score', 'cost', 'add', 'multiply', 'compute'],
    pattern: 'Computation',
    pythonConcept: 'variables and arithmetic expressions',
    explanation: 'You are transforming values into a result, so variables and expressions become useful.',
    masteryLevel: 'beginner'
  },
  {
    keywords: ['step', 'process', 'recipe', 'function', 'reuse', 'reusable', 'module', 'procedure'],
    pattern: 'Reusable procedure',
    pythonConcept: 'functions',
    explanation: 'You described a repeatable process, which maps to a Python function.',
    masteryLevel: 'advanced'
  },
  {
    keywords: ['compare', 'match', 'filter', 'find', 'search', 'locate', 'select', 'pick'],
    pattern: 'Selection and filtering',
    pythonConcept: 'comparisons and list comprehensions',
    explanation: 'You are narrowing options using rules, which Python can express with comparisons and filters.',
    masteryLevel: 'intermediate'
  },
  {
    keywords: ['store', 'remember', 'save', 'keep', 'hold', 'track', 'record'],
    pattern: 'Data storage',
    pythonConcept: 'variables and data structures',
    explanation: 'You need to remember values. Python variables and data structures hold and manage that data.',
    masteryLevel: 'beginner'
  },
  {
    keywords: ['error', 'problem', 'wrong', 'fail', 'exception', 'handle', 'catch', 'try'],
    pattern: 'Error handling',
    pythonConcept: 'try / except / finally',
    explanation: 'You anticipate things going wrong. Python exception handling lets you manage failures gracefully.',
    masteryLevel: 'advanced'
  }
];

/**
 * Map reasoning text to Python concepts
 * Returns array of matched concept rules with relevance scores
 */
function mapReasoning(reasoning = '') {
  if (!reasoning || typeof reasoning !== 'string') {
    return [{
      pattern: 'Sequential thinking',
      pythonConcept: 'statements and variables',
      explanation: 'Start with variables to hold values and statements to express steps.',
      masteryLevel: 'beginner'
    }];
  }
  
  const lower = reasoning.toLowerCase();
  const scored = conceptRules.map((rule) => {
    const matchCount = rule.keywords.filter((keyword) => lower.includes(keyword)).length;
    return { ...rule, score: matchCount };
  }).filter((rule) => rule.score > 0);
  
  return scored.length ? scored.sort((a, b) => b.score - a.score) : [{
    pattern: 'Sequential thinking',
    pythonConcept: 'statements and variables',
    explanation: 'You described a step-by-step solution. Python starts by representing those steps as statements.',
    masteryLevel: 'beginner'
  }];
}

function generateCode(scenario, maps) {
  if (!maps || !Array.isArray(maps) || maps.length === 0) {
    return `# Scenario: ${scenario?.title || 'Unknown'}\n# Add your code here\nprint("Start solving the scenario")`;
  }
  
  const concepts = maps.map((item) => item.pythonConcept).join(', ').toLowerCase();
  const hasLoop = concepts.includes('loop');
  const hasCondition = concepts.includes('if') || concepts.includes('elif') || concepts.includes('else');
  const hasFunction = concepts.includes('function');
  const hasException = concepts.includes('try') || concepts.includes('except');
  const hasCollection = concepts.includes('list') || concepts.includes('dict');

  if (hasLoop && hasCondition && hasCollection) {
    return 'items = [12, 7, 19, 4]\nthreshold = 10\nresults = []\n\nfor item in items:\n    if item >= threshold:\n        results.append(f"{item} needs attention")\n    else:\n        results.append(f"{item} is okay")\n\nfor result in results:\n    print(result)';
  }

  if (hasFunction && hasLoop) {
    return 'def process_items(items):\n    result = []\n    for value in items:\n        result.append(value * 2)\n    return result\n\nnumbers = [1, 2, 3, 4, 5]\nprocessed = process_items(numbers)\nprint("Original:", numbers)\nprint("Processed:", processed)';
  }

  if (hasException) {
    return 'try:\n    user_input = int(input("Enter a number: "))\n    result = 100 / user_input\n    print(f"Result: {result}")\nexcept ValueError:\n    print("Please enter a valid number")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")';
  }

  if (hasFunction) {
    return 'def solve_scenario(inputs):\n    """Solve the scenario step by step"""\n    result = []\n    for value in inputs:\n        result.append(value * 2)\n    return result\n\nprint(solve_scenario([1, 2, 3]))';
  }

  if (hasLoop) {
    return 'steps = ["notice the situation", "look for a pattern", "apply the rule"]\n\nfor step in steps:\n    print(step)';
  }

  if (hasCondition) {
    return 'temperature = 32\n\nif temperature > 30:\n    print("Take action now")\nelif temperature > 20:\n    print("Monitor the situation")\nelse:\n    print("Keep observing")';
  }

  if (hasCollection) {
    return 'data = [10, 20, 30, 40, 50]\naverage = sum(data) / len(data)\nprint(f"Data: {data}")\nprint(f"Average: {average}")';
  }

  return `# Scenario: ${scenario?.title || 'Unknown'}\n# Your reasoning suggests these steps:\nprint("Solving step by step")\n# Add your logic here`;
}

function explainCode(maps) {
  if (!maps || maps.length === 0) {
    return 'Start with simple statements and variables to express your solution.';
  }
  
  const explanations = maps.slice(0, 3).map((map) => {
    return `${map.pattern} → ${map.pythonConcept}`;
  }).join('; ');
  
  return `Your reasoning maps to Python: ${explanations}. These concepts work together to express your natural thinking as executable code.`;
}

/**
 * Score and provide feedback on a learner's prompt to an AI mentor
 */
function evaluatePrompt(promptText = '') {
  const feedback = [];
  let score = 35;
  
  if (!promptText || promptText.trim().length === 0) {
    return {
      score: 20,
      feedback: [
        'Your prompt is empty. Try asking the AI to explain your reasoning step-by-step.',
        'Include what you understand so far and what you need help with.',
        'Reference specific Python concepts if you have a hunch about them.'
      ]
    };
  }
  
  // Check length
  if (promptText.length > 50) score += 15;
  else feedback.push('✓ Add more context: What is the situation? What should the code do?');
  
  // Check for reasoning request
  if (/step|explain|why|reason|understand|think/i.test(promptText)) score += 20;
  else feedback.push('✓ Ask "why" - Request explanation of reasoning, not just code.');
  
  // Check for examples
  if (/example|input|output|data|test|case/i.test(promptText)) score += 15;
  else feedback.push('✓ Add specifics: "Here\'s an example input and output..."');
  
  // Check for concept mention
  if (/python|loop|if|list|dict|function|error|exception|variable/i.test(promptText)) score += 15;
  else feedback.push('✓ Name a Python concept: loop, condition, list, function, etc.');
  
  // Check for clarity
  if (/how|what|which|guide|teach/i.test(promptText)) score += 10;
  else feedback.push('✓ Be direct: "How would you...?" or "What\'s the best way to...?"');
  
  const finalScore = Math.min(score, 100);
  
  if (finalScore >= 80) {
    feedback.unshift('💡 Excellent prompt! It\'s clear, specific, and invites guided explanation.');
  } else if (finalScore >= 60) {
    feedback.unshift('📈 Good prompt. A few tweaks will make it even stronger.');
  } else if (finalScore >= 40) {
    feedback.unshift('📝 Your prompt needs more detail. Add context and examples.');
  }
  
  return { score: finalScore, feedback };
}

/**
 * Detect common misconceptions in learner reasoning
 */
function detectMisconceptions(reasoning = '') {
  const misses = [];
  
  if (!reasoning || typeof reasoning !== 'string') {
    return [];
  }
  
  const lower = reasoning.toLowerCase();
  
  // Absolute thinking
  if (/always|never|every time|all ways/i.test(reasoning)) {
    misses.push('🔔 Absolute thinking: Programs need explicit edge cases. "Always" and "never" rarely cover all scenarios.');
  }
  
  // Vague reasoning
  if (reasoning.length < 50) {
    misses.push('🔔 Be more specific: Name the inputs, the decision rule, and what you expect to happen.');
  }
  
  // No mention of alternatives
  if (!/or|option|alternative|different|choice|else|otherwise/i.test(reasoning)) {
    misses.push('🔔 What if things are different? Consider edge cases and alternative paths.');
  }
  
  // Assuming fixed data
  if (/the|this|that|specific|particular/i.test(reasoning) && !/variable|input|change|different/i.test(reasoning)) {
    misses.push('🔔 Think in variables, not concrete values. Code should work with any input.');
  }
  
  // Missing process clarity
  if (!/step|first|then|next|finally|result/i.test(reasoning)) {
    misses.push('🔔 Walk through it step by step. What happens first? Then what?');
  }
  
  return misses;
}

/**
 * Identify mastery signals based on mapping and prompt quality
 */
function masterySignals(maps, promptScore) {
  const signals = [];
  
  if (!maps || maps.length === 0) {
    signals.push('⏳ Still exploring concepts');
    return signals;
  }
  
  // Concept recognition
  maps.forEach((map) => {
    const level = map.masteryLevel || 'beginner';
    const icon = level === 'advanced' ? '🚀' : level === 'intermediate' ? '📈' : '✅';
    signals.push(`${icon} Recognized ${map.pattern.toLowerCase()}`);
  });
  
  // Prompt maturity
  if (promptScore >= 80) {
    signals.push('💬 Prompt maturity: Expert');
  } else if (promptScore >= 60) {
    signals.push('💬 Prompt maturity: Developing');
  } else if (promptScore >= 40) {
    signals.push('💬 Prompt maturity: Emerging');
  }
  
  // Multi-concept understanding
  if (maps.length >= 3) {
    signals.push('🧠 Integrating multiple concepts');
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
