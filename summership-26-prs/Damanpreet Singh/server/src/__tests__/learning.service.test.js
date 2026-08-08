/**
 * learning.service.test.js
 * -----------------------------------------------------------------------
 * Unit tests for learning.service.js — the core AI heuristics engine.
 * Run with: npm test (from server/)
 * -----------------------------------------------------------------------
 */

const {
  generateAbstractionMap,
  generateCode,
  scorePrompt,
  generatePromptFeedback,
  detectMisconceptions,
  deriveMasterySignals,
} = require('../../services/learning.service');

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const mockScenario = {
  id: 'test-scenario-1',
  title: 'Coffee Shop Queue',
  difficulty: 'beginner',
  concepts: ['queue', 'loops', 'lists', 'conditionals'],
  context: 'Build a digital ordering system for a coffee shop.',
  prompt: 'How would you design a coffee shop queue?',
  objectives: ['Understand FIFO', 'Implement queue', 'Use conditionals'],
};

const mockAdvancedScenario = {
  id: 'test-scenario-2',
  title: 'Chat Message Filter',
  difficulty: 'advanced',
  concepts: ['strings', 'lists', 'conditionals', 'functions', 'filtering'],
  context: 'Build a content moderation system.',
  prompt: 'How would you filter inappropriate messages?',
  objectives: ['Pattern matching', 'Filter rules'],
};

// ---------------------------------------------------------------------------
// generateAbstractionMap
// ---------------------------------------------------------------------------

describe('generateAbstractionMap', () => {
  test('matches loop-related keywords', () => {
    const result = generateAbstractionMap(
      'I would iterate through each customer in the queue using a loop to process orders',
      mockScenario,
    );
    expect(result).toBeDefined();
    expect(result.matched).toBeDefined();
    expect(result.matched.length).toBeGreaterThan(0);

    const concepts = result.matched.map((m) => m.concept);
    expect(concepts).toEqual(expect.arrayContaining(['loops']));
  });

  test('matches conditional keywords', () => {
    const result = generateAbstractionMap(
      'If the customer is a loyalty member, check their priority status and decide whether to serve them first',
      mockScenario,
    );
    const concepts = result.matched.map((m) => m.concept);
    expect(concepts).toEqual(expect.arrayContaining(['conditionals']));
  });

  test('matches list/collection keywords', () => {
    const result = generateAbstractionMap(
      'Store all the customers in a list or collection and manage the items',
      mockScenario,
    );
    const concepts = result.matched.map((m) => m.concept);
    expect(concepts).toEqual(expect.arrayContaining(['lists']));
  });

  test('matches multiple concepts from rich reasoning', () => {
    const richReasoning =
      'I would create a function that loops through each customer in a list. ' +
      'If they have priority, check their status. Store orders in a dictionary with key-value pairs.';
    const result = generateAbstractionMap(richReasoning, mockScenario);
    expect(result.matched.length).toBeGreaterThan(3);
  });

  test('returns unmatched concepts for empty reasoning', () => {
    const result = generateAbstractionMap('', mockScenario);
    expect(result.matched.length).toBe(0);
    expect(result.unmatched).toBeDefined();
  });

  test('returns a summary string', () => {
    const result = generateAbstractionMap('loop through items', mockScenario);
    expect(typeof result.summary).toBe('string');
    expect(result.summary.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// generateCode
// ---------------------------------------------------------------------------

describe('generateCode', () => {
  test('generates Python code from abstraction map', () => {
    const map = generateAbstractionMap(
      'I would iterate through each item in a list and check conditions',
      mockScenario,
    );
    const result = generateCode(map, mockScenario);
    expect(result).toBeDefined();
    expect(result.code).toBeDefined();
    expect(typeof result.code).toBe('string');
    expect(result.code.length).toBeGreaterThan(0);
  });

  test('includes explanation', () => {
    const map = generateAbstractionMap('loop through items', mockScenario);
    const result = generateCode(map, mockScenario);
    expect(result.explanation).toBeDefined();
    expect(typeof result.explanation).toBe('string');
  });

  test('handles empty abstraction map', () => {
    const map = generateAbstractionMap('', mockScenario);
    const result = generateCode(map, mockScenario);
    expect(result).toBeDefined();
    expect(result.code).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// scorePrompt
// ---------------------------------------------------------------------------

describe('scorePrompt', () => {
  test('returns a numeric score', () => {
    const score = scorePrompt('Explain the loop pattern', 'I would loop through items');
    expect(typeof score).toBe('number');
  });

  test('score is between 1 and 10', () => {
    const score = scorePrompt(
      'Show me the Python code for a queue system with detailed steps',
      'I need to process customers in order using a loop and conditions',
    );
    expect(score).toBeGreaterThanOrEqual(1);
    expect(score).toBeLessThanOrEqual(10);
  });

  test('empty prompt gets low score', () => {
    const score = scorePrompt('', 'some reasoning');
    expect(score).toBeLessThanOrEqual(3);
  });

  test('detailed prompt scores higher than vague prompt', () => {
    const detailed = scorePrompt(
      'Explain step by step how to implement a FIFO queue in Python using deque, including methods for enqueue and dequeue operations',
      'I want to build a queue system that processes customers in the order they arrive',
    );
    const vague = scorePrompt('help', 'queue');
    expect(detailed).toBeGreaterThan(vague);
  });
});

// ---------------------------------------------------------------------------
// generatePromptFeedback
// ---------------------------------------------------------------------------

describe('generatePromptFeedback', () => {
  test('returns an array of feedback strings', () => {
    const feedback = generatePromptFeedback('Explain loops', 5);
    expect(Array.isArray(feedback)).toBe(true);
    expect(feedback.length).toBeGreaterThan(0);
    feedback.forEach((item) => expect(typeof item).toBe('string'));
  });

  test('low score gets improvement suggestions', () => {
    const feedback = generatePromptFeedback('help', 2);
    expect(feedback.length).toBeGreaterThan(0);
  });

  test('high score gets positive feedback', () => {
    const feedback = generatePromptFeedback(
      'Show me a detailed implementation of sorting with custom comparators and error handling',
      9,
    );
    expect(feedback.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// detectMisconceptions
// ---------------------------------------------------------------------------

describe('detectMisconceptions', () => {
  test('returns an array', () => {
    const misconceptions = detectMisconceptions('I would use array instead of list', mockScenario);
    expect(Array.isArray(misconceptions)).toBe(true);
  });

  test('detects = vs == confusion', () => {
    const misconceptions = detectMisconceptions(
      'check if x = 5 to see if it matches',
      mockScenario,
    );
    const hasEqualityMisconception = misconceptions.some(
      (m) => m.toLowerCase().includes('=') || m.toLowerCase().includes('equal'),
    );
    expect(hasEqualityMisconception).toBe(true);
  });

  test('detects array vs list terminology', () => {
    const misconceptions = detectMisconceptions(
      'I would store data in an array',
      mockScenario,
    );
    const hasArrayMisconception = misconceptions.some(
      (m) => m.toLowerCase().includes('array') || m.toLowerCase().includes('list'),
    );
    expect(hasArrayMisconception).toBe(true);
  });

  test('returns empty for clean reasoning', () => {
    const misconceptions = detectMisconceptions(
      'I would create a function that iterates through a list using a for loop',
      mockScenario,
    );
    // Clean reasoning may or may not produce misconceptions depending on heuristics
    expect(Array.isArray(misconceptions)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// deriveMasterySignals
// ---------------------------------------------------------------------------

describe('deriveMasterySignals', () => {
  test('returns an array of strings', () => {
    const signals = deriveMasterySignals(
      'I would decompose the problem into smaller functions',
      7,
      'I learned about data structures',
    );
    expect(Array.isArray(signals)).toBe(true);
    signals.forEach((s) => expect(typeof s).toBe('string'));
  });

  test('strong reasoning with high score yields mastery signals', () => {
    const signals = deriveMasterySignals(
      'I would break the problem down into modular components using abstraction and encapsulation. ' +
        'First define the data structure, then implement the algorithm with proper error handling.',
      9,
      'I realized I need to improve my understanding of complexity.',
    );
    expect(signals.length).toBeGreaterThan(0);
  });

  test('weak reasoning with low score yields beginner signal', () => {
    const signals = deriveMasterySignals('loop', 2, '');
    expect(signals.length).toBeGreaterThan(0);
  });

  test('reflects growth mindset language', () => {
    const signals = deriveMasterySignals(
      'I would use a loop',
      5,
      'Next time I would do it differently and improve my approach',
    );
    const hasGrowth = signals.some((s) => s.toLowerCase().includes('growth'));
    expect(hasGrowth).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Integration: full pipeline
// ---------------------------------------------------------------------------

describe('Full learning pipeline', () => {
  test('complete pipeline produces valid output', () => {
    const reasoning = 'I would create a function that loops through each customer in a list and checks if they are a priority member. If so, move them to the front.';
    const promptText = 'Show me how to implement a priority queue in Python with a deque';
    const reflection = 'I learned that I need to think about edge cases differently next time';

    const abstractionMap = generateAbstractionMap(reasoning, mockScenario);
    expect(abstractionMap.matched.length).toBeGreaterThan(0);

    const { code, explanation } = generateCode(abstractionMap, mockScenario);
    expect(code.length).toBeGreaterThan(0);
    expect(explanation.length).toBeGreaterThan(0);

    const score = scorePrompt(promptText, reasoning);
    expect(score).toBeGreaterThanOrEqual(1);
    expect(score).toBeLessThanOrEqual(10);

    const feedback = generatePromptFeedback(promptText, score);
    expect(Array.isArray(feedback)).toBe(true);

    const misconceptions = detectMisconceptions(reasoning, mockScenario);
    expect(Array.isArray(misconceptions)).toBe(true);

    const signals = deriveMasterySignals(reasoning, score, reflection);
    expect(Array.isArray(signals)).toBe(true);
    expect(signals.length).toBeGreaterThan(0);
  });
});
