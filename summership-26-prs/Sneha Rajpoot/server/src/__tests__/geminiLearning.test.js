const assert = require('node:assert/strict');
const test = require('node:test');
const {
  createGeminiLearningService,
  normalizeScenario,
  normalizeTeachingReview,
  parseModelJson,
} = require('../services/geminiLearning.service');
const { generateEndlessFallbackScenario } = require('../services/fallbackLearning.service');
const { AGE_GROUPS, getAudienceGuidance } = require('../services/ageGroup.service');

test('parses JSON responses and rejects malformed model output', () => {
  assert.deepEqual(parseModelJson('```json\n{"ok":true}\n```'), { ok: true });
  assert.throws(() => parseModelJson('not JSON'), /JSON object/);
});

test('normalizes bounded mentor responses and generated scenario content', () => {
  const review = normalizeTeachingReview({ outcome: 'success', feedback: 'Specific feedback.', teachingPoints: ['Check an edge case.'], pointAward: 999, reflectionPrompt: 'Why this approach?' });
  assert.equal(review.pointAward, 20);
  assert.equal(review.teachingPoints.length, 1);
  assert.equal(normalizeScenario({ title: 'A story', narrative: 'A setting', goal: 'A goal', prompt: 'A question', constraints: ['One constraint'], possibleSolutions: ['One approach'], context: 'Context' }).difficulty, 'AI story');
  assert.throws(() => normalizeTeachingReview({ outcome: 'genius' }), /invalid learning outcome/);
  assert.throws(() => normalizeScenario({ title: 'Bad' }), /missing constraints/);
});

test('keeps the key on the server request and uses validated JSON response', async () => {
  let requestUrl;
  let requestBody;
  const service = createGeminiLearningService({
    apiKey: 'test-server-secret',
    fetchImpl: async (url, options) => {
      requestUrl = new URL(url);
      requestBody = JSON.parse(options.body);
      return {
        ok: true,
        json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({ outcome: 'success', feedback: 'Your condition checks the goal.', teachingPoints: ['Explain the stopping condition.'], pointAward: 8, reflectionPrompt: 'What if no item matches?' }) }] } }] }),
      };
    },
  });
  const review = await service.reviewAttempt({ scenario: { title: 'A scenario', goal: 'Find a match', prompt: 'How?', constraints: [] }, reasoning: 'I loop through the values and stop when one matches.', attemptNumber: 1 });
  assert.equal(review.outcome, 'success');
  assert.equal(requestUrl.searchParams.get('key'), 'test-server-secret');
  assert.match(requestBody.contents[0].parts[0].text, /I loop through the values/);
});

test('reports unconfigured mode without leaking a key to client settings', () => {
  const service = createGeminiLearningService({ apiKey: '' });
  assert.equal(service.isConfigured(), false);
  assert.equal(Object.keys(service).includes('apiKey'), false);
});

test('generates and validates three distinct scenario alternatives for adaptation', async () => {
  let promptText = '';
  let requestedAgeGroup;
  let generationConfig;
  const scenario = (title) => ({ title, narrative: `${title} story`, goal: `Plan ${title}`, prompt: `What would you do in ${title}?`, constraints: ['Keep it safe.'], possibleSolutions: ['Plan A', 'Plan B'], context: 'People face changing conditions.', teachingFocus: ['loops'] });
  const service = createGeminiLearningService({
    apiKey: 'test-server-secret',
    fetchImpl: async (_url, options) => {
      const requestBody = JSON.parse(options.body);
      promptText = requestBody.contents[0].parts[0].text;
      generationConfig = requestBody.generationConfig;
      return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({ scenarios: [scenario('River'), scenario('Garden'), scenario('Workshop')] }) }] } }] }) };
    },
  });
  const alternatives = await service.generateNextScenarios({ boundary: 0.31, previousScenario: { title: 'Old story' }, recentTitles: ['Recent story'], ageGroup: '8-11' });
  assert.equal(alternatives.length, 3);
  assert.equal(new Set(alternatives.map((item) => item.title)).size, 3);
  assert.match(promptText, /0\.31/);
  assert.match(promptText, /exactly 3 distinct/);
  assert.match(promptText, /original.*magical|magical.*original/i);
  assert.match(promptText, /ages 8-11/);
  assert.ok(generationConfig.maxOutputTokens >= 3000);
});

test('keeps generated stories anchored to the same Python concept family', async () => {
  let promptText = '';
  const service = createGeminiLearningService({
    apiKey: 'test-server-secret',
    fetchImpl: async (_url, options) => {
      promptText = JSON.parse(options.body).contents[0].parts[0].text;
      return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({ scenarios: [
        { title: 'List Check', narrative: 'A list story', goal: 'Sort items', prompt: 'How would you do it?', constraints: ['Keep it clear.'], possibleSolutions: ['Use a loop.'], context: 'Same topic.', teachingFocus: ['lists'] },
        { title: 'List Review', narrative: 'A second list story', goal: 'Review items', prompt: 'What would you do?', constraints: ['Keep it clear.'], possibleSolutions: ['Use a loop.'], context: 'Same topic.', teachingFocus: ['lists', 'loops'] },
        { title: 'List Balance', narrative: 'A third list story', goal: 'Balance items', prompt: 'How would you decide?', constraints: ['Keep it clear.'], possibleSolutions: ['Use a loop.'], context: 'Same topic.', teachingFocus: ['loops'] },
      ] }) }] } }] }) };
    },
  });

  const alternatives = await service.generateNextScenarios({
    boundary: 0.41,
    previousScenario: { title: 'The Library Book Finder', teachingFocus: ['lists', 'loops'] },
    recentTitles: ['The Library Book Finder'],
  });

  assert.ok(alternatives.every((item) => item.teachingFocus.every((focus) => ['lists', 'loops'].includes(focus))));
  assert.match(promptText, /same Python concept family|same concept family|stay within/i);
});

test('asks the mentor to teach with analogy, explanation, and a story example', async () => {
  let promptText = '';
  const service = createGeminiLearningService({
    apiKey: 'test-server-secret',
    fetchImpl: async (_url, options) => {
      promptText = JSON.parse(options.body).contents[0].parts[0].text;
      return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({ outcome: 'success', feedback: 'Clear reasoning.', teachingPoints: ['Analogy', 'Explanation', 'Example'], pointAward: 5, reflectionPrompt: 'Why?' }) }] } }] }) };
    },
  });

  await service.reviewAttempt({ scenario: { title: 'Library', teachingFocus: ['loops'] }, reasoning: 'I repeat the check for each title.', attemptNumber: 1 });

  assert.match(promptText, /relatable everyday analogy.*plain-language.*tiny Python example/i);
});

test('rejects a generated story that adds a new concept family', async () => {
  const story = (title, teachingFocus) => ({ title, narrative: `${title} story`, goal: 'Plan the task', prompt: 'What would you do?', constraints: ['Keep it clear.'], possibleSolutions: ['Use the current topic.'], context: 'Same topic.', teachingFocus });
  const service = createGeminiLearningService({
    apiKey: 'test-server-secret',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify({ scenarios: [
        story('List One', ['lists']),
        story('List Two', ['lists', 'recursion']),
        story('List Three', ['lists']),
      ] }) }] } }] }),
    }),
  });

  await assert.rejects(
    service.generateNextScenarios({ boundary: 0.3, previousScenario: { teachingFocus: ['lists'] } }),
    /new concept family/,
  );
});

test('keeps endless local fallback stories on the current lesson concept', () => {
  const first = generateEndlessFallbackScenario({ learnerId: 'test-learner-1234', attemptNumber: 1, boundary: 0.3, previousScenario: { teachingFocus: ['lists', 'loops'] }, ageGroup: '8-11', mode: 'open' });
  const next = generateEndlessFallbackScenario({ learnerId: 'test-learner-1234', attemptNumber: 2, boundary: 0.3, previousScenario: first, ageGroup: '8-11', mode: 'open' });

  assert.deepEqual(first.teachingFocus, ['lists', 'loops']);
  assert.deepEqual(next.teachingFocus, ['lists', 'loops']);
  assert.equal(first.ageGroup, '8-11');
  assert.match(first.title, /Mira and Tavi at Starling Academy/);
  assert.match(first.prompt, /Mira and Tavi/);
  assert.doesNotMatch(first.prompt, /community team|student team|service team/i);
  assert.match(first.prompt, /lists|loops/i);

  const teen = generateEndlessFallbackScenario({ learnerId: 'test-learner-1234', attemptNumber: 3, boundary: 0.3, previousScenario: first, ageGroup: '12-15' });
  const adult = generateEndlessFallbackScenario({ learnerId: 'test-learner-1234', attemptNumber: 4, boundary: 0.3, previousScenario: first, ageGroup: '16+' });
  assert.match(teen.narrative, /student team/);
  assert.match(adult.context, /stakeholders, assumptions, and consequences/);
});

test('defines differentiated audience guidance for all requested age bands', () => {
  assert.deepEqual(AGE_GROUPS, ['8-11', '12-15', '16+']);
  assert.match(getAudienceGuidance('8-11'), /original magical-school setting/);
  assert.match(getAudienceGuidance('12-15'), /teen voice.*at least two reasonable choices.*trade-offs/i);
  assert.match(getAudienceGuidance('16+'), /stakeholder needs, trade-offs, assumptions, consequences, and reflection/);
});