const {
  mapReasoning,
  generateCode
} = require('../learningEngine');

describe('mapReasoning', () => {
  test('detects recursion from reasoning describing a smaller version of the same problem', () => {
    const reasoning = 'Open the box. If there is another box inside, open that smaller box the same way. ' +
      'Stop once a box has no box inside it — that is the base case.';
    const matches = mapReasoning(reasoning);
    const patterns = matches.map((m) => m.pattern);
    expect(patterns).toContain('Recursive breakdown');
  });

  test('detects recursion from the word "recursive" directly', () => {
    const matches = mapReasoning('I want to write a recursive function to solve this.');
    expect(matches.some((m) => m.pythonConcept === 'recursive functions')).toBe(true);
  });

  test('falls back to sequential thinking when nothing matches', () => {
    const matches = mapReasoning('I would write down my plan on paper.');
    expect(matches).toHaveLength(1);
    expect(matches[0].pattern).toBe('Sequential thinking');
  });

  // Regression test for the pre-existing substring-matching bug: the
  // keyword "if" used to match inside unrelated words like "gift",
  // silently misclassifying reasoning that had nothing to do with
  // conditionals. Word-boundary matching fixes this.
  test('does not false-positive match "if" inside unrelated words like "gift"', () => {
    const matches = mapReasoning('I received a nice gift from my friend and want to say thank you.');
    const patterns = matches.map((m) => m.pattern);
    expect(patterns).not.toContain('Decision making');
    expect(patterns).toEqual(['Sequential thinking']);
  });

  // Same bug class, different word: "different" contains "if" too.
  test('does not false-positive match "if" inside "different"', () => {
    const matches = mapReasoning('Each shelf holds a different kind of book.');
    const patterns = matches.map((m) => m.pattern);
    expect(patterns).not.toContain('Decision making');
  });

  test('still correctly matches real conditional reasoning', () => {
    const matches = mapReasoning('If the light is red, stop; otherwise go.');
    const patterns = matches.map((m) => m.pattern);
    expect(patterns).toContain('Decision making');
  });

  test('matches multi-word recursion phrases like "base case"', () => {
    const matches = mapReasoning('I will keep breaking the problem down until I reach the base case.');
    const patterns = matches.map((m) => m.pattern);
    expect(patterns).toContain('Recursive breakdown');
  });
});

describe('generateCode', () => {
  const scenario = { title: 'Folder Size Total' };

  test('generates a recursive function when recursion is detected', () => {
    const maps = mapReasoning('For each subfolder, apply the same rule to a smaller version of the folder, until I reach the base case.');
    const code = generateCode(scenario, maps);
    expect(code).toMatch(/def count_down\(remaining\):/);
    expect(code).toMatch(/count_down\(remaining - 1\)/); // the function calls itself
    expect(code).toMatch(/if remaining <= 0:/); // has a base case
  });

  test('recursion takes priority over a plain loop/function match when both are present', () => {
    // This reasoning also contains loop- and function-like keywords
    // ("each", "process") — recursion should still win, since it's
    // the more specific, intended concept.
    const maps = mapReasoning('For each step of the process, apply the same rule to a smaller version of it, until reaching the base case.');
    const code = generateCode(scenario, maps);
    expect(code).toMatch(/count_down/);
  });

  test('non-recursive loop+condition reasoning still generates the existing loop/condition code', () => {
    const maps = mapReasoning('For each item, if it is above the threshold, flag it; otherwise leave it.');
    const code = generateCode(scenario, maps);
    expect(code).toMatch(/for item in items:/);
  });
});
