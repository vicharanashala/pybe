const { evaluateOutcome } = require('./outcome.service');
const { DEFAULT_AGE_GROUP, normalizeAgeGroup } = require('./ageGroup.service');

const SETTINGS = Object.freeze({
  storyWordsA: ['Lantern', 'River', 'Market', 'Library', 'Garden', 'Harbor', 'Workshop', 'Festival', 'Mountain', 'Orchard'],
  storyWordsB: ['Planner', 'Rescue', 'Exchange', 'Mystery', 'Journey', 'Archive', 'Kitchen', 'Observatory', 'Shelter', 'Expedition'],
  concepts: ['lists', 'loops', 'conditionals', 'functions', 'dictionaries', 'strings', 'sorting', 'error handling'],
});

const CONCEPT_LESSONS = Object.freeze({
  arithmetic: { analogy: 'Adding prices is like combining amounts on a receipt.', idea: 'Arithmetic combines numeric values to calculate the requested total.', example: 'total = price_a + price_b + price_c' },
  loops: { analogy: 'A loop is like checking every name on a guest list, one by one.', idea: 'A loop repeats the same step for each item until there are no more items to check.', example: 'for title in shelf:\n    if title == requested_title:\n        found = True' },
  conditionals: { analogy: 'A condition is like a fork in a path: what you do depends on what you find.', idea: 'A conditional chooses which action to take when a stated condition is true or false.', example: 'if request_is_urgent:\n    response = "handle first"' },
  functions: { analogy: 'A function is like a reusable recipe for the same task.', idea: 'A function groups a named set of steps so the same job can be done consistently.', example: 'def total(prices):\n    return sum(prices)' },
  dictionaries: { analogy: 'A dictionary is like a labeled cabinet where each label points to one value.', idea: 'A dictionary stores values under keys so you can look them up by name.', example: 'prices = {"apple": 2}\nprice = prices["apple"]' },
  strings: { analogy: 'A string is like a strip of text that can be read or compared.', idea: 'A string represents text, and string operations help inspect or transform that text.', example: 'title = "Python Stories"\nmatch = title == requested_title' },
  sorting: { analogy: 'Sorting is like arranging books by title so the order is predictable.', idea: 'Sorting places items in an order based on a chosen rule.', example: 'titles = sorted(titles)' },
  'error handling': { analogy: 'Error handling is like having a backup plan when a form is incomplete.', idea: 'Error handling lets a program respond clearly when an operation cannot be completed.', example: 'try:\n    count = int(raw_count)\nexcept ValueError:\n    count = 0' },
});

function teachingPointsFor(scenario, reasoning) {
  const concept = scenario.teachingFocus?.[0] || 'Python reasoning';
  const lesson = CONCEPT_LESSONS[concept.toLowerCase()];
  if (lesson) {
    return [
      `Analogy: ${lesson.analogy}`,
      `The idea: ${lesson.idea}`,
      `In this story: ${lesson.example}`,
    ];
  }
  const hasReasoning = /because|since|so that|reason/i.test(reasoning);
  return [
    `Analogy: think of ${concept} as one tool chosen for this story's job.`,
    `The idea: ${concept} helps express one clear step in a Python solution.`,
    `In this story: name where ${concept} would help, then explain why it fits. ${hasReasoning ? 'You already connected a step to its reason.' : 'Try adding one reason for your choice.'}`,
  ];
}

function evaluateWithFallback({ reasoning, scenario, attemptNumber }) {
  const baseline = evaluateOutcome(reasoning);
  const outcome = baseline.outcome === 'developing' ? 'struggle' : baseline.outcome;
  const concept = scenario.teachingFocus?.[0] || 'the Python idea';
  const teachingPoints = teachingPointsFor(scenario, reasoning);
  const feedback = baseline.evidenceCount === 0 && reasoning.trim()
    ? `That answer does not give enough information to connect it to this story. Let's try one small step with ${concept}: ${scenario.prompt}`
    : outcome === 'success'
      ? 'You made a clear plan and connected your steps to the problem. Try carrying that thinking into a story with more than one reasonable path.'
      : outcome === 'incomplete'
        ? 'Your next step is to put your first idea into words. A rough starting point is enough to begin.'
        : `You have a starting point with ${concept}. Let us make the reasoning easier to follow by naming one step and why it helps.`;
  return {
    outcome,
    feedback,
    teachingPoints: teachingPoints.slice(0, 3),
    pointAward: baseline.evidenceCount === 0 ? 0 : Math.min(12, Math.max(1, baseline.evidenceCount * 3 + (reasoning.trim().length >= 40 ? 3 : 1))),
    reflectionPrompt: 'What is one decision in your approach you would explain to a teammate?',
    provider: 'local_fallback',
    attemptNumber,
  };
}

function generateEndlessFallbackScenario({ learnerId, attemptNumber, boundary, alternativeIndex = 0, previousScenario, mode = 'adaptive', ageGroup = DEFAULT_AGE_GROUP }) {
  const index = Math.max(1, attemptNumber) * 3 + alternativeIndex;
  const first = SETTINGS.storyWordsA[(index - 1) % SETTINGS.storyWordsA.length];
  const second = SETTINGS.storyWordsB[Math.floor((index - 1) / SETTINGS.storyWordsA.length) % SETTINGS.storyWordsB.length];
  const inheritedFocus = Array.isArray(previousScenario?.teachingFocus)
    ? [...new Set(previousScenario.teachingFocus.filter((item) => typeof item === 'string' && item.trim()))]
    : [];
  const concept = inheritedFocus[0] || SETTINGS.concepts[(index - 1) % SETTINGS.concepts.length];
  const teachingFocus = inheritedFocus.length ? inheritedFocus : [concept];
  const storyMode = mode === 'guided' || mode === 'open' ? mode : 'guided';
  const audience = normalizeAgeGroup(ageGroup) || DEFAULT_AGE_GROUP;
  const learner = audience === '8-11' ? 'Mira and Tavi' : audience === '12-15' ? 'the student team' : 'the service team';
  const id = `fallback-${learnerId.slice(-8)}-${index}`;
  const audienceStory = audience === '8-11'
    ? {
      title: `Mira and Tavi at Starling Academy: ${first} ${second} ${index}`,
      narrative: `At Starling Academy, where a little classroom magic helps with everyday tasks, apprentices Mira and Tavi use ${concept} to solve a small classroom problem.`,
      context: `Mira and Tavi try one clear ${concept} idea in a new academy adventure. This story continues the same Python lesson.`,
    }
    : audience === '12-15'
      ? {
        title: `The ${first} ${second} Project ${index}`,
        narrative: `A student team is organizing a ${first.toLowerCase()} ${second.toLowerCase()} project and needs to use ${concept} to handle a real request.`,
        context: `A student team applies the current ${concept} lesson in a new school or community project.`,
      }
      : {
        title: `The ${first} ${second} Planning Problem ${index}`,
        narrative: `A community service team must use ${concept} to respond to requests while considering how different choices affect the people relying on the service.`,
        context: `This authentic planning problem continues the current ${concept} lesson and asks the learner to consider stakeholders, assumptions, and consequences.`,
      };
  return {
    id,
    title: audienceStory.title,
    difficulty: 'Fresh story',
    narrative: audienceStory.narrative,
    goal: storyMode === 'open'
      ? `Compare two ways ${learner} could use ${concept} in this situation and explain which fits best.`
      : `Use ${concept} to help ${learner} handle one clear request and explain why it fits.`,
    prompt: storyMode === 'open'
      ? audience === '8-11'
        ? `Mira and Tavi have two ways to use ${concept} to check the classroom requests. Which way would you choose, and why?`
        : `What are two ways ${concept} could help ${learner}? Compare them and explain which you would choose.`
      : audience === '8-11'
        ? `How could ${concept} help Mira check one classroom request? Show the steps with a small example.`
        : `How could ${concept} help ${learner} with this request? Follow the goal and show one small example.`,
    constraints: storyMode === 'open'
      ? [`Keep the story focused on ${concept}.`, audience === '8-11' ? 'Choose the way that helps Mira and Tavi most.' : 'Balance more than one reasonable priority.']
      : [`Keep the story focused on ${concept}.`, audience === '8-11' ? 'Explain one classroom example.' : 'Explain one example from the story.'],
    possibleSolutions: storyMode === 'open'
      ? [`Use ${concept} to handle requests by urgency.`, `Use ${concept} to group similar requests.`, `Use ${concept} to keep request order fair.`]
      : [`Use ${concept} to handle one request clearly.`],
    context: audienceStory.context,
    teachingFocus,
    storyMode,
    ageGroup: audience,
    generatedBy: 'local_fallback',
    generatedFor: learnerId,
    storySequence: index,
    requestedBoundary: boundary,
  };
}

module.exports = { SETTINGS, evaluateWithFallback, generateEndlessFallbackScenario };