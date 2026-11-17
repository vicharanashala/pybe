const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalLearningService, createGeminiLearningService, parseModelJson, normalizeTeachingReview } = require('../services/geminiLearning.service');
const { evaluateWithFallback } = require('../services/fallbackLearning.service');
const scenario = { title: 'Find a book', goal: 'Locate the requested title', prompt: 'Explain your plan', constraints: ['Check each title'], teachingFocus: ['loops'] };

test('local coaching uses the existing authored evaluator', async () => {
  const input = { scenario, reasoning: 'I loop through every title and compare it with the requested title.', attemptNumber: 1 };
  assert.deepEqual(await createLocalLearningService().reviewAttempt(input), evaluateWithFallback(input));
});
test('legacy credentials and transports do not enable external requests', async () => {
  let requests = 0;
  const service = createGeminiLearningService({ apiKey: 'ignored', fetchImpl() { requests++; throw new Error('Must not be called'); } });
  assert.equal(service.isConfigured(), false);
  await service.reviewAttempt({ scenario, reasoning: 'Check the book list.', attemptNumber: 1 });
  await service.generateNextScenarios({ previousScenario: scenario, boundary: .4, learnerId: 'local-service-test', attemptNumber: 1 });
  assert.equal(requests, 0);
});
test('local alternatives are deterministic and preserve the concept family', async () => {
  const service = createLocalLearningService();
  const input = { previousScenario: scenario, boundary: .4, learnerId: 'local-variants-test', attemptNumber: 2 };
  const variants = await service.generateNextScenarios(input);
  assert.deepEqual(variants, await service.generateNextScenarios(input));
  assert.equal(variants.length, 3);
  for (const next of variants) assert.deepEqual(next.teachingFocus, scenario.teachingFocus);
});
test('stored JSON and review normalization remain available for local content', () => {
  assert.deepEqual(parseModelJson('```json\n{"ok":true}\n```'), { ok: true });
  assert.throws(() => parseModelJson('not JSON'), /JSON object/);
  assert.equal(normalizeTeachingReview({ outcome: 'success', feedback: 'A clear condition.', teachingPoints: ['Trace each value.'], pointAward: 999, reflectionPrompt: 'What if no item matches?' }).pointAward, 20);
});
