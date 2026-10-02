const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createAppServer } = require('../server');
const { createLearningRepository } = require('../repositories/learning.repository');

test('scenario to outcome to persisted boundary update to next challenge', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pybe-adaptation-'));
  const statePath = path.join(directory, 'state.json');
  const learnerId = 'test-learner-0001';
  const server = createAppServer({ repository: createLearningRepository({ filePath: statePath }) });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const firstResponse = await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`);
    assert.equal(firstResponse.status, 200);
    const first = await firstResponse.json();
    assert.ok(first.scenario);
    assert.equal(first.profile.currentStructurednessBoundary, 0.22);

    const attemptResponse = await fetch(`${baseUrl}/api/learning/attempt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, scenarioId: first.scenario.id, reasoning: 'First I define a function and loop through the items because it keeps each step clear. If the list is empty, I return a safe message; otherwise I compare each value, explain why it matches, and then return the result.' }),
    });
    assert.equal(attemptResponse.status, 201);
    const attempt = await attemptResponse.json();
    assert.equal(attempt.session.outcome, 'success');
    assert.ok(attempt.next.scenario);
    assert.notEqual(attempt.next.scenario.id, first.scenario.id);
    assert.ok(attempt.session.sessionId);
    assert.ok(attempt.session.createdAt);

    const resumedServer = createAppServer({ repository: createLearningRepository({ filePath: statePath }) });
    await new Promise((resolve) => resumedServer.listen(0, '127.0.0.1', resolve));
    try {
      const progressResponse = await fetch(`http://127.0.0.1:${resumedServer.address().port}/api/learning/progress?learnerId=${learnerId}`);
      const progress = await progressResponse.json();
      assert.equal(progress.profile.attempts, 1);
      assert.equal(progress.profile.currentStructurednessBoundary, attempt.boundary.updatedBoundary);
      assert.equal(progress.recentEvents.length, 1);
      assert.equal(progress.recentEvents[0].nextScenarioId, attempt.next.scenario.id);
    } finally {
      await new Promise((resolve, reject) => resumedServer.close((error) => error ? reject(error) : resolve()));
    }

    const savedState = JSON.parse(await fs.readFile(statePath, 'utf8'));
    assert.equal(savedState.events[0].scenarioStructuredness, first.scenario.targetStructuredness);
    assert.equal(savedState.events[0].outcome, 'success');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('invalid learner/scenario inputs receive clear client errors', async () => {
  const server = createAppServer({ repository: createLearningRepository({ filePath: path.join(os.tmpdir(), `pybe-invalid-${Date.now()}.json`) }) });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(`${baseUrl}/api/learning/next?learnerId=x`)).status, 400);
    const badScenario = await fetch(`${baseUrl}/api/learning/attempt`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId: 'test-learner-0002', scenarioId: 'missing', reasoning: 'Some thoughtful reasoning here.' }) });
    assert.equal(badScenario.status, 422);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('health reports Gemini readiness without exposing credentials', async () => {
  const server = createAppServer({
    repository: createLearningRepository({ filePath: path.join(os.tmpdir(), `pybe-health-${Date.now()}.json`) }),
    aiService: { isConfigured: () => true },
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const health = await (await fetch(`http://127.0.0.1:${server.address().port}/api/health`)).json();
    assert.equal(health.status, 'ok');
    assert.equal(health.geminiConfigured, true);
    assert.equal(health.model, 'gemini-2.5-flash');
    assert.equal(Object.hasOwn(health, 'apiKey'), false);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('guided and open story mode requests replace the persisted pending scenario', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pybe-story-mode-'));
  const learnerId = 'test-story-mode-1001';
  const requestedModes = [];
  const requestedAgeGroups = [];
  const aiService = {
    isConfigured: () => true,
    async generateNextScenarios({ mode, ageGroup, previousScenario }) {
      requestedModes.push(mode);
      requestedAgeGroups.push(ageGroup);
      const createScenario = (title, isOpen) => ({
        title,
        narrative: isOpen
          ? 'Several community groups have varied needs and many possible ways to improve the overall experience.'
          : 'A team must return one total for three known item prices.',
        goal: isOpen ? 'Improve the overall experience while balancing multiple priorities.' : 'Return the exact sum of three known prices.',
        prompt: 'What would you do?',
        constraints: isOpen ? ['Balance several competing needs.', 'Consider multiple trade-offs.'] : ['Use all three prices.', 'Return one numeric total.'],
        possibleSolutions: isOpen ? ['Add shared access', 'Create a schedule', 'Offer lending', 'Improve the path'] : ['Add the three prices directly.'],
        context: isOpen ? 'Residents have various needs and several approaches could help.' : 'The inputs are three valid numbers and one result is requested.',
        teachingFocus: previousScenario.teachingFocus,
      });
      return [createScenario('Guided Alternative', false), createScenario('Middle Alternative', false), createScenario('Open Alternative', true)];
    },
  };
  const server = createAppServer({
    repository: createLearningRepository({ filePath: path.join(directory, 'state.json') }),
    aiService,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const initial = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    const response = await fetch(`${baseUrl}/api/learning/mode`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, scenarioId: initial.scenario.id, mode: 'open', ageGroup: '8-11' }),
    });
    assert.equal(response.status, 200);
    const selected = await response.json();
    assert.equal(selected.scenario.title, 'Open Alternative');
    assert.equal(selected.scenario.storyMode, 'open');
    assert.equal(selected.scenario.ageGroup, '8-11');
    assert.equal(selected.profile.ageGroup, '8-11');
    assert.deepEqual(requestedModes, ['open']);
    assert.deepEqual(requestedAgeGroups, ['8-11']);

    const pending = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    assert.equal(pending.scenario.id, selected.scenario.id);
    assert.equal(pending.profile.ageGroup, '8-11');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('a one-character answer cannot be marked successful or earn points even if AI over-approves it', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pybe-random-answer-'));
  const learnerId = 'test-random-answer-1001';
  let reviewedAnswer = null;
  const aiService = {
    isConfigured: () => true,
    async reviewAttempt({ reasoning }) {
      reviewedAnswer = reasoning;
      return {
        outcome: 'success',
        feedback: 'Good work!',
        teachingPoints: ['Analogy', 'Explanation', 'Example'],
        pointAward: 20,
        reflectionPrompt: 'Why?',
      };
    },
    async generateNextScenarios({ previousScenario }) {
      return ['Fresh One', 'Fresh Two', 'Fresh Three'].map((title) => ({
        title,
        narrative: `${title} practices the same lesson.`,
        goal: 'Apply the same concept.',
        prompt: 'How would you use the current Python concept?',
        constraints: ['Stay with the lesson concept.'],
        possibleSolutions: ['Apply the current concept.'],
        context: 'A fresh setting for the same lesson.',
        teachingFocus: previousScenario.teachingFocus,
      }));
    },
  };
  const server = createAppServer({
    repository: createLearningRepository({ filePath: path.join(directory, 'state.json') }),
    aiService,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const initial = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    const response = await fetch(`${baseUrl}/api/learning/attempt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, scenarioId: initial.scenario.id, reasoning: 'n' }),
    });
    const result = await response.json();

    assert.equal(reviewedAnswer, 'n');
    assert.equal(result.session.outcome, 'struggle');
    assert.equal(result.session.learningPointsAwarded, 0);
    assert.equal(result.profile.learningPoints, 0);
    assert.match(result.mentorReview.feedback, /does not give enough information|not enough information/i);
    assert.ok(result.next.scenario);
    assert.deepEqual(result.next.scenario.teachingFocus, initial.scenario.teachingFocus);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('AI mentor review and fresh AI story drive the next challenge and survive refresh', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pybe-ai-loop-'));
  const statePath = path.join(directory, 'state.json');
  const learnerId = 'test-ai-learner-1001';
  let reviewedReasoning = null;
  let generatedForBoundary = null;
  let generatedForAgeGroup = null;
  const aiService = {
    isConfigured: () => true,
    async reviewAttempt(input) {
      reviewedReasoning = input.reasoning;
      return {
        outcome: 'success',
        feedback: 'You noticed the repeated process and described a clear stopping condition.',
        teachingPoints: ['A loop repeats a step while its condition remains true.', 'Use a guard for an empty collection.'],
        pointAward: 9,
        reflectionPrompt: 'How would you stop if nothing matched?',
      };
    },
    async generateNextScenarios(input) {
      generatedForBoundary = input.boundary;
      generatedForAgeGroup = input.ageGroup;
      return ['The Floating Workshop', 'The Night Garden', 'The Repair Cafe'].map((title) => ({
        title,
        difficulty: 'AI story',
        narrative: `${title} must organize repair requests as weather changes.`,
        goal: 'Plan a fair process to prioritize changing repair requests.',
        prompt: 'How would you respond when a new urgent repair arrives?',
        constraints: ['Keep the crew safe.', 'Respond to urgent repairs.'],
        possibleSolutions: ['Use a priority queue.', 'Group requests and review them periodically.', 'Ask the crew to vote on trade-offs.'],
        context: 'The crew has limited time and changing weather creates trade-offs.',
        teachingFocus: ['queues', 'conditionals'],
      }));
    },
  };
  const repository = createLearningRepository({ filePath: statePath });
  const server = createAppServer({ repository, aiService });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const initial = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    const reasoning = 'First I make a list of the requests, then I loop through them because each one needs review. If weather changes, I check urgency and explain why safety comes first before I update the plan.';
    const response = await fetch(`${baseUrl}/api/learning/attempt`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, scenarioId: initial.scenario.id, reasoning }),
    });
    assert.equal(response.status, 201);
    const result = await response.json();
    assert.equal(reviewedReasoning, reasoning);
    assert.equal(result.mentorReview.provider, 'gemini');
    assert.equal(result.mentorReview.pointAward, 9);
    assert.equal(result.learningPoints, 9);
    assert.equal(result.scorePercent, 45);
    assert.equal(generatedForBoundary, result.profile.currentStructurednessBoundary);
    assert.equal(generatedForAgeGroup, '12-15');
    assert.ok(['The Floating Workshop', 'The Night Garden', 'The Repair Cafe'].includes(result.next.scenario.title));
    assert.equal(result.next.scenario.generatedBy, 'gemini');
    assert.equal(result.next.scenario.ageGroup, '12-15');
    assert.ok(result.next.scenario.structuredness.dimensions.ambiguity >= 0);
    assert.equal(result.session.mentorReview.teachingPoints.length, 2);

    const resumed = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    assert.equal(resumed.scenario.id, result.next.scenario.id);
    assert.equal(resumed.profile.learningPoints, 9);
    const progress = await (await fetch(`${baseUrl}/api/learning/progress?learnerId=${learnerId}`)).json();
    assert.equal(progress.scorePercent, 45);
    const saved = JSON.parse(await fs.readFile(statePath, 'utf8'));
    assert.equal(saved.events[0].nextScenarioProvider, 'gemini');
    assert.equal(JSON.stringify(saved.events[0]).includes(reasoning), false);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('streams mentor teaching before waiting for the next story', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pybe-live-review-'));
  const learnerId = 'test-live-review-1001';
  let releaseStoryGeneration;
  let signalStoryGenerationStarted;
  const storyGenerationStarted = new Promise((resolve) => { signalStoryGenerationStarted = resolve; });
  const storyGenerationGate = new Promise((resolve) => { releaseStoryGeneration = resolve; });
  const aiService = {
    isConfigured: () => true,
    async reviewAttempt() {
      return { outcome: 'success', feedback: 'You used the lesson idea clearly.', teachingPoints: ['Analogy', 'Explanation', 'Example'], pointAward: 5, reflectionPrompt: 'Why does it fit?' };
    },
    async generateNextScenarios({ previousScenario }) {
      signalStoryGenerationStarted();
      await storyGenerationGate;
      return ['Fresh One', 'Fresh Two', 'Fresh Three'].map((title) => ({
        title,
        narrative: `${title} continues the current lesson.`,
        goal: 'Apply the same idea to a new situation.',
        prompt: 'How would you use the current lesson idea?',
        constraints: ['Keep the approach clear.'],
        possibleSolutions: ['Use the same lesson idea in a new setting.'],
        context: 'A new setting, same Python concept.',
        teachingFocus: previousScenario.teachingFocus,
      }));
    },
  };
  const server = createAppServer({
    repository: createLearningRepository({ filePath: path.join(directory, 'state.json') }),
    aiService,
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const initial = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    const response = await fetch(`${baseUrl}/api/learning/attempt`, {
      method: 'POST',
      headers: { Accept: 'application/x-ndjson', 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, scenarioId: initial.scenario.id, reasoning: 'I use the lesson idea because it matches the goal.' }),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const queuedEvents = [];
    async function readEvent() {
      while (queuedEvents.length === 0) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) if (line.trim()) queuedEvents.push(JSON.parse(line));
        if (done && queuedEvents.length === 0) return null;
      }
      return queuedEvents.shift();
    }

    const quickEvent = await readEvent();
    assert.equal(quickEvent.type, 'mentor');
    assert.equal(quickEvent.stage, 'quick');
    assert.equal(quickEvent.mentorReview.provider, 'local_fallback');
    assert.ok(quickEvent.mentorReview.feedback.toLowerCase().includes(initial.scenario.teachingFocus[0]));

    await storyGenerationStarted;
    const finalEvent = await readEvent();
    assert.equal(finalEvent.type, 'mentor');
    assert.equal(finalEvent.stage, 'final');
    assert.equal(finalEvent.mentorReview.provider, 'gemini');
    assert.equal(finalEvent.mentorReview.feedback, 'You used the lesson idea clearly.');

    releaseStoryGeneration();
    let completionEvent = null;
    while (!completionEvent) {
      const event = await readEvent();
      if (!event) break;
      if (event.type === 'complete') completionEvent = event;
    }
    assert.ok(completionEvent?.result.next.scenario);
    assert.equal(completionEvent.result.next.scenario.generatedBy, 'gemini');
  } finally {
    releaseStoryGeneration();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('Gemini provider errors fall back to local mentor teaching and a continuing fresh story', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'pybe-ai-fallback-'));
  const server = createAppServer({
    repository: createLearningRepository({ filePath: path.join(directory, 'state.json') }),
    aiService: {
      isConfigured: () => true,
      async reviewAttempt() { throw new Error('Gemini request failed with HTTP 429.'); },
      async generateNextScenarios() { throw new Error('Gemini request failed with HTTP 429.'); },
    },
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const learnerId = 'test-fallback-1001';
    let current = await (await fetch(`${baseUrl}/api/learning/next?learnerId=${learnerId}`)).json();
    const storyIds = new Set();
    for (let attemptNumber = 0; attemptNumber < 3; attemptNumber++) {
      const response = await fetch(`${baseUrl}/api/learning/attempt`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ learnerId, scenarioId: current.scenario.id, reasoning: 'First I make a list and loop through the requests because each one needs a check. If the request is urgent, I explain why it should be handled next.' }),
      });
      assert.equal(response.status, 201);
      const result = await response.json();
      assert.equal(result.mentorReview.provider, 'local_fallback');
      assert.match(result.mentorReview.fallbackReason, /rate or quota limit reached \(HTTP 429\)/i);
      assert.ok(result.mentorReview.teachingPoints.length > 0);
      assert.equal(result.next.scenario.generatedBy, 'local_fallback');
      assert.match(result.storyFallbackReason, /rate or quota limit reached \(HTTP 429\)/i);
      storyIds.add(result.next.scenario.id);
      current = { scenario: result.next.scenario };
    }
    assert.equal(storyIds.size, 3);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.rm(directory, { recursive: true, force: true });
  }
});