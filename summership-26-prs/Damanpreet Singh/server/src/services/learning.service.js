/**
 * learning.service.js
 * -----------------------------------------------------------------------
 * Pure business-logic module – NO HTTP objects, NO database access.
 * All functions are deterministic given their inputs (local-heuristic mode).
 * -----------------------------------------------------------------------
 */

const MODE = process.env.MEMENTO_MODE || 'LOCAL_HEURISTIC';

// ---------------------------------------------------------------------------
// Keyword → Python-concept mapping (20+ patterns)
// ---------------------------------------------------------------------------

const CONCEPT_PATTERNS = [
  { keywords: ['loop', 'iterate', 'repeat', 'each', 'every', 'cycle', 'traverse'], concept: 'loops', pythonConstruct: 'for / while' },
  { keywords: ['for loop', 'for each', 'range'], concept: 'for-loop', pythonConstruct: 'for i in range(...)' },
  { keywords: ['while', 'until', 'keep going', 'continue until'], concept: 'while-loop', pythonConstruct: 'while condition:' },
  { keywords: ['if', 'check', 'condition', 'whether', 'decide', 'branch'], concept: 'conditionals', pythonConstruct: 'if / elif / else' },
  { keywords: ['list', 'array', 'collection', 'items', 'group', 'set of'], concept: 'lists', pythonConstruct: 'my_list = [...]' },
  { keywords: ['dictionary', 'key', 'value', 'map', 'lookup', 'mapping', 'pair'], concept: 'dictionaries', pythonConstruct: 'my_dict = {...}' },
  { keywords: ['function', 'define', 'reuse', 'call', 'modular', 'def', 'return'], concept: 'functions', pythonConstruct: 'def func_name(...):' },
  { keywords: ['class', 'object', 'instance', 'method', 'attribute', 'self'], concept: 'classes', pythonConstruct: 'class MyClass:' },
  { keywords: ['print', 'output', 'display', 'show', 'log'], concept: 'print', pythonConstruct: 'print(...)' },
  { keywords: ['input', 'ask', 'user input', 'read', 'prompt user'], concept: 'input', pythonConstruct: 'input(...)' },
  { keywords: ['string', 'text', 'word', 'character', 'concat', 'format'], concept: 'strings', pythonConstruct: 'f"...{var}..."' },
  { keywords: ['variable', 'store', 'assign', 'save', 'hold', 'track'], concept: 'variables', pythonConstruct: 'x = value' },
  { keywords: ['sort', 'order', 'arrange', 'rank', 'ascending', 'descending'], concept: 'sorting', pythonConstruct: 'sorted(...) / .sort()' },
  { keywords: ['filter', 'select', 'exclude', 'remove', 'keep only'], concept: 'filtering', pythonConstruct: '[x for x in list if cond]' },
  { keywords: ['try', 'except', 'error', 'handle', 'catch', 'exception'], concept: 'error-handling', pythonConstruct: 'try: ... except: ...' },
  { keywords: ['file', 'read file', 'write file', 'open', 'close'], concept: 'file-io', pythonConstruct: 'with open(...) as f:' },
  { keywords: ['import', 'module', 'library', 'package'], concept: 'imports', pythonConstruct: 'import module' },
  { keywords: ['random', 'shuffle', 'choice', 'randint', 'sample'], concept: 'random', pythonConstruct: 'import random' },
  { keywords: ['append', 'add', 'push', 'insert', 'extend'], concept: 'list-operations', pythonConstruct: 'list.append(...)' },
  { keywords: ['len', 'length', 'size', 'count', 'number of'], concept: 'length', pythonConstruct: 'len(...)' },
  { keywords: ['sum', 'total', 'add up', 'accumulate'], concept: 'aggregation', pythonConstruct: 'sum(...) / total += x' },
  { keywords: ['average', 'mean', 'avg'], concept: 'average', pythonConstruct: 'sum(lst) / len(lst)' },
  { keywords: ['max', 'maximum', 'largest', 'highest', 'biggest'], concept: 'max', pythonConstruct: 'max(...)' },
  { keywords: ['min', 'minimum', 'smallest', 'lowest'], concept: 'min', pythonConstruct: 'min(...)' },
  { keywords: ['boolean', 'true', 'false', 'flag', 'toggle'], concept: 'booleans', pythonConstruct: 'is_valid = True' },
  { keywords: ['nested', 'inner', 'within', 'inside'], concept: 'nesting', pythonConstruct: 'nested loops / dicts' },
  { keywords: ['enumerate', 'index', 'position', 'counter'], concept: 'enumerate', pythonConstruct: 'for i, val in enumerate(...)' },
  { keywords: ['slice', 'substring', 'sub-list', 'portion'], concept: 'slicing', pythonConstruct: 'list[start:end]' },
  { keywords: ['comprehension', 'compact', 'one-liner'], concept: 'comprehensions', pythonConstruct: '[expr for x in iterable]' },
  { keywords: ['queue', 'fifo', 'first in', 'enqueue', 'dequeue', 'wait'], concept: 'queue', pythonConstruct: 'from collections import deque' },
];

// ---------------------------------------------------------------------------
// 1. generateAbstractionMap
// ---------------------------------------------------------------------------

/**
 * Matches reasoning text against 20+ keyword patterns to identify which
 * Python concepts the learner is expressing.
 *
 * @param {string} reasoning  – free-form reasoning from the learner
 * @param {object} scenario   – the scenario object (used for context)
 * @returns {object}  { matched: [...], unmatched: [...], summary }
 */
function generateAbstractionMap(reasoning, scenario) {
  if (MODE === 'GEMINI_LIVE') {
    // TODO: Replace with Gemini API call
  }

  const lower = reasoning.toLowerCase();
  const matched = [];
  const unmatched = [];

  for (const pattern of CONCEPT_PATTERNS) {
    const found = pattern.keywords.some((kw) => lower.includes(kw));
    if (found) {
      matched.push({
        concept: pattern.concept,
        pythonConstruct: pattern.pythonConstruct,
      });
    }
  }

  // Check scenario concepts that weren't matched
  if (scenario && Array.isArray(scenario.concepts)) {
    for (const concept of scenario.concepts) {
      const alreadyMatched = matched.some(
        (m) => m.concept.toLowerCase() === concept.toLowerCase(),
      );
      if (!alreadyMatched) {
        unmatched.push(concept);
      }
    }
  }

  return {
    matched,
    unmatched,
    summary:
      matched.length > 0
        ? `Identified ${matched.length} Python concept(s): ${matched.map((m) => m.concept).join(', ')}.`
        : 'No clear Python concepts detected – try describing your approach in more detail.',
  };
}

// ---------------------------------------------------------------------------
// 2. generateCode
// ---------------------------------------------------------------------------

/**
 * Builds a Python code snippet based on the matched abstraction concepts.
 *
 * @param {object} abstractionMap – output of generateAbstractionMap
 * @param {object} scenario
 * @returns {{ code: string, explanation: string }}
 */
function generateCode(abstractionMap, scenario) {
  if (MODE === 'GEMINI_LIVE') {
    // TODO: Replace with Gemini API call
  }

  const lines = [`# PyBe – Generated scaffold for: ${scenario.title}`, ''];
  const explanationParts = [];

  const matched = abstractionMap.matched || [];

  // Build code from matched concepts
  const has = (concept) => matched.some((m) => m.concept === concept);

  // Imports
  if (has('random')) {
    lines.push('import random');
    explanationParts.push('Imported the random module for randomisation.');
  }
  if (has('queue')) {
    lines.push('from collections import deque');
    explanationParts.push('Imported deque for queue operations.');
  }

  lines.push('');

  // Variables / data structures
  if (has('lists') || has('list-operations')) {
    lines.push('items = []  # main list to store data');
    explanationParts.push('Created a list to hold items.');
  }
  if (has('dictionaries')) {
    lines.push('data = {}  # dictionary for key-value storage');
    explanationParts.push('Created a dictionary for key-value lookups.');
  }
  if (has('queue')) {
    lines.push('queue = deque()  # FIFO queue');
    explanationParts.push('Created a deque-based queue for FIFO processing.');
  }
  if (has('variables') || has('booleans')) {
    lines.push('result = None');
    explanationParts.push('Initialised a result variable.');
  }

  // Functions
  if (has('functions')) {
    lines.push('');
    lines.push(`def process(data):`);
    lines.push(`    """Process data for ${scenario.title}."""`);

    if (has('conditionals')) {
      lines.push('    if not data:');
      lines.push('        return None');
      explanationParts.push('Added a guard clause to check for empty data.');
    }

    if (has('for-loop') || has('loops')) {
      lines.push('    for item in data:');
      if (has('filtering')) {
        lines.push('        if meets_criteria(item):');
        lines.push('            # process matching item');
        lines.push('            pass');
        explanationParts.push('Added a filtering step inside the loop.');
      } else {
        lines.push('        # process each item');
        lines.push('        pass');
      }
      explanationParts.push('Used a for-loop to iterate through the data.');
    }

    lines.push('    return data');
    lines.push('');
    explanationParts.push('Defined a reusable function for processing.');
  }

  // Sorting
  if (has('sorting')) {
    lines.push('sorted_items = sorted(items)');
    explanationParts.push('Used sorted() to arrange items.');
  }

  // Aggregation
  if (has('aggregation') || has('average')) {
    lines.push('');
    lines.push('total = sum(items) if items else 0');
    if (has('average')) {
      lines.push('average = total / len(items) if items else 0');
      explanationParts.push('Calculated the average of items.');
    } else {
      explanationParts.push('Calculated the sum of items.');
    }
  }

  // Error handling
  if (has('error-handling')) {
    lines.push('');
    lines.push('try:');
    lines.push('    # risky operation');
    lines.push('    pass');
    lines.push('except Exception as e:');
    lines.push(`    print(f"Error: {e}")`);
    explanationParts.push('Wrapped risky code in try/except.');
  }

  // Print / output
  if (has('print')) {
    lines.push('');
    lines.push('print("Done!")');
    explanationParts.push('Added print output for feedback.');
  }

  // Fallback if nothing matched
  if (matched.length === 0) {
    lines.push('# TODO: Describe your approach in more detail to generate code.');
    lines.push('pass');
    explanationParts.push(
      'No concepts were matched from your reasoning. Try elaborating on your thought process.',
    );
  }

  const code = lines.join('\n');
  const explanation =
    explanationParts.length > 0
      ? explanationParts.join(' ')
      : 'Generated a basic scaffold. Refine your reasoning for richer code.';

  return { code, explanation };
}

// ---------------------------------------------------------------------------
// 3. scorePrompt
// ---------------------------------------------------------------------------

/**
 * Scores the quality of the learner's prompt on a 1–10 scale.
 *
 * @param {string} promptText
 * @param {string} reasoning
 * @returns {number}
 */
function scorePrompt(promptText, reasoning) {
  if (MODE === 'GEMINI_LIVE') {
    // TODO: Replace with Gemini API call
  }

  let score = 1;
  const text = `${promptText} ${reasoning}`.toLowerCase();

  // Length-based
  if (text.length > 50) score += 1;
  if (text.length > 150) score += 1;
  if (text.length > 300) score += 1;

  // Specificity signals
  if (/step|first|then|next|after|finally/i.test(text)) score += 1;
  if (/because|reason|since|so that|in order to/i.test(text)) score += 1;
  if (/example|instance|such as|like|e\.g\./i.test(text)) score += 1;

  // Technical depth
  const technicalTerms = ['variable', 'loop', 'function', 'list', 'dictionary', 'condition', 'class', 'return', 'parameter', 'argument'];
  const techCount = technicalTerms.filter((t) => text.includes(t)).length;
  if (techCount >= 2) score += 1;
  if (techCount >= 4) score += 1;

  // Clarity
  if (/\bI\b.*\bwould\b|\bI\b.*\bwill\b|\bI\b.*\bplan\b/i.test(text)) score += 1;

  return Math.min(score, 10);
}

// ---------------------------------------------------------------------------
// 4. generatePromptFeedback
// ---------------------------------------------------------------------------

/**
 * Generates actionable feedback based on prompt score.
 *
 * @param {string} promptText
 * @param {number} score
 * @returns {string[]}
 */
function generatePromptFeedback(promptText, score) {
  if (MODE === 'GEMINI_LIVE') {
    // TODO: Replace with Gemini API call
  }

  const feedback = [];

  if (score <= 3) {
    feedback.push('Your prompt is quite brief. Try describing the problem and your approach in more detail.');
    feedback.push('Include specific steps: what comes first, what comes next, and what the expected output is.');
    feedback.push('Mention which data structures (list, dict) or control flow (loop, if) you would use.');
  } else if (score <= 6) {
    feedback.push('Good start! You are including some detail. Try adding more "why" – explain the reasoning behind each step.');
    feedback.push('Consider edge cases: what happens with empty input, duplicates, or invalid data?');
    if (!/example/i.test(promptText)) {
      feedback.push('Adding a concrete example would strengthen your prompt.');
    }
  } else {
    feedback.push('Excellent prompt! You provided clear, detailed reasoning.');
    if (score < 10) {
      feedback.push('To reach a perfect score, try connecting each step to the specific Python construct you would use.');
    }
    feedback.push('Keep up this level of detail in future scenarios.');
  }

  return feedback;
}

// ---------------------------------------------------------------------------
// 5. detectMisconceptions
// ---------------------------------------------------------------------------

/**
 * Scans reasoning for common Python misconceptions.
 *
 * @param {string} reasoning
 * @param {object} scenario
 * @returns {Array<{ misconception: string, correction: string }>}
 */
function detectMisconceptions(reasoning, scenario) {
  if (MODE === 'GEMINI_LIVE') {
    // TODO: Replace with Gemini API call
  }

  const lower = reasoning.toLowerCase();
  const found = [];

  const checks = [
    {
      test: () => /array/i.test(lower) && !/list/i.test(lower),
      misconception: 'Using "array" instead of "list".',
      correction: 'In Python the primary sequence type is called a list, not an array. Use [] to create one.',
    },
    {
      test: () => /\bvar\b/i.test(lower) || /\blet\b/i.test(lower) || /\bconst\b/i.test(lower),
      misconception: 'Using JavaScript-style variable declarations.',
      correction: 'Python does not use var, let, or const. Simply assign: x = 10.',
    },
    {
      test: () => /\{.*\}/.test(lower) && /curly brace|brace/i.test(lower),
      misconception: 'Thinking Python uses curly braces for blocks.',
      correction: 'Python uses indentation (4 spaces) to define code blocks, not curly braces.',
    },
    {
      test: () => /switch|case/i.test(lower),
      misconception: 'Referring to switch/case statements.',
      correction: 'Python 3.10+ has match/case (structural pattern matching), but if/elif/else is the standard approach.',
    },
    {
      test: () => /\.push\b/i.test(lower),
      misconception: 'Using .push() to add to a list.',
      correction: 'In Python, use .append() to add a single element to a list.',
    },
    {
      test: () => /\bnull\b/i.test(lower),
      misconception: 'Using "null" instead of "None".',
      correction: 'Python uses None (capital N) instead of null.',
    },
    {
      test: () => /\&\&|\|\|/i.test(lower),
      misconception: 'Using && or || for logical operators.',
      correction: 'Python uses "and" and "or" keywords instead of && and ||.',
    },
    {
      test: () => /\bfunction\b/i.test(lower) && !/\bdef\b/i.test(lower),
      misconception: 'Using "function" keyword.',
      correction: 'Python defines functions with the "def" keyword: def my_func():',
    },
    {
      test: () => /console\.log/i.test(lower),
      misconception: 'Using console.log for output.',
      correction: 'Python uses print() for console output.',
    },
    {
      test: () => /\+\+|--/i.test(lower),
      misconception: 'Using ++ or -- increment/decrement operators.',
      correction: 'Python does not support ++ or --. Use x += 1 or x -= 1 instead.',
    },
  ];

  for (const check of checks) {
    if (check.test()) {
      found.push({
        misconception: check.misconception,
        correction: check.correction,
      });
    }
  }

  return found;
}

// ---------------------------------------------------------------------------
// 6. deriveMasterySignals
// ---------------------------------------------------------------------------

/**
 * Derives mastery signals based on reasoning quality, prompt score, and reflection.
 *
 * @param {string} reasoning
 * @param {number} promptScore
 * @param {string} reflection
 * @returns {string[]}
 */
function deriveMasterySignals(reasoning, promptScore, reflection) {
  if (MODE === 'GEMINI_LIVE') {
    // TODO: Replace with Gemini API call
  }

  const signals = [];
  const combined = `${reasoning} ${reflection}`.toLowerCase();

  // Prompt quality signals
  if (promptScore >= 8) signals.push('High-quality prompt engineering');
  if (promptScore >= 5 && promptScore < 8) signals.push('Developing prompt skills');
  if (promptScore < 5) signals.push('Prompt needs more detail and specificity');

  // Reasoning depth
  if (combined.length > 300) signals.push('Detailed reasoning provided');
  if (/step|first|then|next|finally/i.test(combined)) signals.push('Sequential thinking demonstrated');
  if (/because|reason|since/i.test(combined)) signals.push('Causal reasoning present');

  // Reflection quality
  if (reflection && reflection.length > 20) {
    signals.push('Self-reflection practiced');
    if (/learn|realiz|understand|discover|notice/i.test(reflection)) {
      signals.push('Metacognitive awareness');
    }
    if (/improve|next time|better|differently/i.test(reflection)) {
      signals.push('Growth mindset language');
    }
    if (/difficult|challeng|struggle|hard/i.test(reflection)) {
      signals.push('Honest self-assessment');
    }
  }

  // Technical vocabulary
  const techTerms = ['algorithm', 'data structure', 'complexity', 'abstraction', 'encapsulation', 'polymorphism', 'inheritance'];
  const advancedCount = techTerms.filter((t) => combined.includes(t)).length;
  if (advancedCount >= 2) signals.push('Advanced CS vocabulary');

  // Problem decomposition
  if (/break.*down|decompos|modular|separate concern/i.test(combined)) {
    signals.push('Problem decomposition skill');
  }

  return signals.length > 0 ? signals : ['Beginner level – keep practising!'];
}

module.exports = {
  generateAbstractionMap,
  generateCode,
  scorePrompt,
  generatePromptFeedback,
  detectMisconceptions,
  deriveMasterySignals,
};
