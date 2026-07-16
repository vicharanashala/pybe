const crypto = require('crypto');
const { CONCEPT_TRIGGER_KEYWORDS } = require('../conceptVocabulary');

/**
 * A deterministic, template-based stand-in for a real LLM. It implements
 * the same complete({ system, messages, jsonMode, task, context }) -> {
 * text } interface as the real providers, but never makes a network call.
 *
 * aiProviderFactory.js uses this automatically whenever no provider API
 * key is configured, and as a fallback if a configured provider's call
 * throws - so every Phase 3 feature keeps working (Performance
 * Requirements: "Handle API failures gracefully").
 *
 * Real providers only look at `system` and `messages`; this one instead
 * reads the structured `task`/`context` that promptTemplates.js also
 * attaches to every request, so it can fabricate a reasonable structured
 * response without needing an LLM to parse natural language.
 */

function pick(list, seedText = '') {
  if (!list.length) return '';
  const hash = crypto.createHash('md5').update(seedText + Date.now() + Math.random()).digest('hex');
  const index = parseInt(hash.slice(0, 8), 16) % list.length;
  return list[index];
}

const THEME_NOUNS = {
  School: ['seating chart', 'library book', 'homework folder', 'lunch tray'],
  Hospital: ['patient chart', 'medicine dose', 'appointment slot', 'ward bed'],
  Sports: ['match tally', 'player roster', 'training lap', 'ticket booth'],
  Shopping: ['shopping cart', 'markdown price', 'price tag', 'checkout line'],
  Travel: ['boarding pass', 'suitcase', 'itinerary stop', 'hotel booking'],
  Space: ['fuel tank', 'satellite signal', 'mission log', 'crew roster'],
  Banking: ['bank balance', 'transaction log', 'loan application', 'interest rate'],
  Gaming: ['player tally', 'inventory slot', 'level progress', 'leaderboard entry'],
  Environment: ['recycling bin', 'water usage log', 'tree tally', 'air quality reading'],
  Cooking: ['ingredient list', 'oven timer', 'order ticket', 'pantry stock'],
  Business: ['invoice amount', 'client list', 'meeting schedule', 'sales report'],
  Office: ['printer queue', 'meeting room booking', 'expense report', 'staff roster']
};

function toTitleCase(text = '') {
  const minorWords = new Set(['a', 'an', 'the', 'of', 'for', 'on', 'in', 'to', 'by', 'and', 'or', 'with', 'their', 'its']);
  const words = text.split(' ').filter(Boolean);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index !== 0 && minorWords.has(lower)) return lower;
      return lower[0].toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

/**
 * Turns a free-text description like "I want a scenario about managing
 * cricket scores" into a short topic phrase ("managing cricket scores") by
 * stripping common request lead-ins, so the generated scenario is
 * obviously *about* what the learner actually typed instead of a random
 * unrelated theme.
 */
function extractTopic(description = '') {
  let text = description.trim();
  const leadIns = [
    /^i want (a |an )?scenario (about|on|for)\s*/i,
    /^i('d| would) like (a |an )?scenario (about|on|for)\s*/i,
    /^(can|could) you (make|create|build|give me|generate)\s*(a |an )?scenario (about|on|for)?\s*/i,
    /^(make|create|build|generate)\s*(a |an )?scenario (about|on|for)\s*/i,
    /^(a |an )?scenario (about|on|for)\s*/i,
    /^i want to (build|make|create)\s*(something|a scenario)?\s*(about|for|on)?\s*/i,
    /^i want to\s*/i,
    /^(tell me about|explain)\s*/i
  ];
  leadIns.forEach((pattern) => { text = text.replace(pattern, ''); });
  text = text.replace(/[.!?]+$/, '').trim();
  // Strip a leading article so articledPhrase() can add its own consistently,
  // avoiding "the a pizza delivery queue".
  text = text.replace(/^(a|an|the)\s+/i, '');

  const TRAILING_STOP_WORDS = new Set(['of', 'on', 'in', 'to', 'by', 'and', 'or', 'with', 'for', 'a', 'an', 'the']);
  let words = text.split(' ').filter(Boolean);
  if (words.length > 10) words = words.slice(0, 10);
  while (words.length > 1 && TRAILING_STOP_WORDS.has(words[words.length - 1].toLowerCase())) {
    words.pop();
  }
  return words.join(' ') || 'this situation';
}

/**
 * Broader keyword set than CONCEPT_TRIGGER_KEYWORDS (which must stay
 * narrow so generated *output* text reliably matches learningEngine's
 * conceptRules). This one is only used to guess which concept a learner's
 * free-text idea is closest to - a best-effort heuristic, not a
 * requirement for correctness, since buildScenarioFields always produces a
 * valid, verified scenario for whichever category is picked.
 */
const TOPIC_INFERENCE_KEYWORDS = {
  Loops: ['every', 'each', 'all of', 'repeat', 'again and again', 'loop', 'through the list'],
  Conditionals: ['if', 'whether', 'pass or fail', 'pass/fail', 'decide', 'depending on', 'eligib'],
  Lists: ['sort', 'order', 'queue', 'list of', 'collection of', 'several', 'multiple', 'rank'],
  Dictionaries: ['look up', 'lookup', 'key', 'match a', 'pair', 'map each'],
  Functions: ['calculate', 'reusable', 'formula', 'process for', 'convert', 'compute'],
  OOP: ['object', 'class', 'model a', 'entity', 'profile', 'account for each']
};

function inferConceptFromText(text = '') {
  const lower = text.toLowerCase();
  const topicMatch = Object.entries(TOPIC_INFERENCE_KEYWORDS).find(([, keywords]) => (
    keywords.some((keyword) => lower.includes(keyword))
  ));
  if (topicMatch) return topicMatch[0];

  const ruleMatch = Object.entries(CONCEPT_TRIGGER_KEYWORDS).find(([, keywords]) => (
    keywords.some((keyword) => lower.includes(keyword))
  ));
  return ruleMatch?.[0] || 'Variables';
}

/**
 * Per-category sentence templates. Each one is a complete, grammatically
 * correct sentence that also naturally contains the keyword(s)
 * services/learningEngine.js's conceptRules looks for, so the generated
 * scenario reliably produces the *matching* code template rather than
 * always falling back to the generic one. Verified against
 * conceptRules keywords to avoid accidentally tripping a different
 * category (see the offline-provider keyword collision check run during
 * development).
 */
const CONCEPT_TEMPLATES = {
  Variables: {
    objective: (phrase) => `Decide on one clear detail to remember about ${phrase}`,
    prompt: (phrase) => `What single piece of information would you give a name to, to represent ${phrase}?`,
    reasoning: (phrase) => `I would remember one clear piece of information about ${phrase} and give it a name.`
  },
  Conditionals: {
    objective: (phrase) => `Decide what condition determines what happens with ${phrase}`,
    prompt: (phrase) => `What condition would decide what happens with ${phrase}?`,
    reasoning: (phrase) => `I would check a condition on ${phrase} to decide what should happen next.`
  },
  Loops: {
    objective: (phrase) => `Decide what needs to repeat for every part of ${phrase}`,
    prompt: (phrase) => `What would you repeat for every part of ${phrase}?`,
    reasoning: (phrase) => `I would repeat the same check for every part of ${phrase}, since the same rule applies each time.`
  },
  Lists: {
    objective: (phrase) => `Decide how to store each item in ${phrase} together, in order`,
    prompt: (phrase) => `How would you store each item in ${phrase} together so you can work through all of them?`,
    reasoning: (phrase) => `I would store each item in ${phrase} together in order, so I can look at all of them as a group.`
  },
  Dictionaries: {
    objective: (phrase) => `Decide what key would look up each value in ${phrase}`,
    prompt: (phrase) => `What key would you use to look up each value in ${phrase}?`,
    reasoning: (phrase) => `I would pair each item in ${phrase} with its value, using a key so I can look it up quickly.`
  },
  Functions: {
    objective: (phrase) => `Turn the steps for handling ${phrase} into one reusable process`,
    prompt: (phrase) => `What repeatable process would handle ${phrase}, so you could reuse it?`,
    reasoning: (phrase) => `I would turn the steps for handling ${phrase} into one reusable process I can call again.`
  },
  OOP: {
    objective: (phrase) => `Decide what properties and actions an object modelling ${phrase} should have`,
    prompt: (phrase) => `If you modelled ${phrase} as an object, what properties and actions would it need?`,
    reasoning: (phrase) => `I would model ${phrase} as an object with its own properties and actions.`
  }
};

/**
 * Custom topics like "managing cricket scores" already read naturally on
 * their own ("about managing cricket scores"); theme nouns like "match
 * tally" need an article ("about the match tally"). A noun/topic phrase
 * starting with a gerund (ends in -ing) is treated as already complete.
 */
function articledPhrase(noun) {
  const firstWord = noun.trim().split(' ')[0].toLowerCase();
  return firstWord.endsWith('ing') ? noun : `the ${noun}`;
}

function buildScenarioFields({ concept, noun, title, contextSentence }) {
  const template = CONCEPT_TEMPLATES[concept] || CONCEPT_TEMPLATES.Variables;
  const phrase = articledPhrase(noun);
  return {
    title,
    context: `${contextSentence} Let's turn that into a small, working Python program.`,
    objectives: [
      `Identify what matters about ${phrase}`,
      template.objective(phrase),
      `Connect that idea to ${concept} in Python`
    ],
    prompt: template.prompt(phrase),
    sampleReasoning: template.reasoning(phrase),
    concepts: [concept.toLowerCase()]
  };
}

function dedupeTitle(title, existingTitles) {
  if (!existingTitles.includes(title)) return title;
  let attempt = 2;
  let candidate = `${title} (${attempt})`;
  while (existingTitles.includes(candidate) && attempt < 20) {
    attempt += 1;
    candidate = `${title} (${attempt})`;
  }
  return candidate;
}

/**
 * Feature 1 path: learner picked concept + difficulty + theme explicitly.
 */
function offlineGuidedScenario({ concept, difficulty, theme, existingTitles = [] }) {
  const nouns = THEME_NOUNS[theme] || THEME_NOUNS.School;
  const noun = pick(nouns, `${concept}-${theme}`);
  const title = dedupeTitle(`${theme}: ${toTitleCase(noun)}`, existingTitles);

  return {
    ...buildScenarioFields({
      concept,
      noun,
      title,
      contextSentence: `In a ${theme.toLowerCase()} setting, someone needs a simple way to keep track of the ${noun}.`
    }),
    difficulty: difficulty || 'Beginner'
  };
}

/**
 * Feature 2 path: learner described their own idea in free text. The
 * concept is inferred from their wording, and the topic they actually
 * typed is used directly instead of a random theme, so "managing cricket
 * scores" produces a scenario titled around cricket scores, not an
 * unrelated theme.
 */
function offlineCustomScenario({ description, existingTitles = [] }) {
  const topic = extractTopic(description);
  const concept = inferConceptFromText(description);
  const title = dedupeTitle(toTitleCase(topic), existingTitles);

  return {
    ...buildScenarioFields({
      concept,
      noun: topic,
      title,
      contextSentence: `You wanted a scenario about ${topic}.`
    }),
    difficulty: 'Beginner'
  };
}

function offlineScenario(context) {
  return context.description
    ? offlineCustomScenario(context)
    : offlineGuidedScenario(context);
}

function offlineTutorReply(context) {
  const { question = '', scenarioTitle } = context;
  const lower = question.toLowerCase();

  if (/hint/.test(lower)) {
    return `Here's one hint: focus on what changes in "${scenarioTitle || 'this scenario'}" and what stays the same. Try describing that difference in one sentence before writing any code.`;
  }
  if (/simplify|simpler|easier/.test(lower)) {
    return "Let's simplify: ignore the story details for a moment. What is the one value you actually need to keep track of? Start there.";
  }
  if (/error/.test(lower)) {
    return "I can't run code from here, but common causes are: mismatched indentation, a missing colon after if/for/def, or using a variable before it's created. Check those first, and tell me the exact error message if you have it.";
  }
  if (/explain/.test(lower)) {
    return `Think of it step by step: first decide what information matters, then decide how it changes, then decide what Python should print. Which of those three feels unclear for "${scenarioTitle || 'this scenario'}"?`;
  }
  if (/example/.test(lower)) {
    return "Here's another angle: imagine the same idea but with a different everyday object. Does the same rule (store it, check it, or repeat it) still apply?";
  }
  return "Good question. Rather than jump to the answer, what's your current guess? Tell me what you think happens first, and I'll help you check your reasoning.";
}

function offlineHint(context) {
  const { level, scenarioTitle, primaryConcept } = context;
  const templates = {
    1: `Re-read "${scenarioTitle}" once more and underline the exact values mentioned - that's usually where you start.`,
    2: `Think specifically about ${primaryConcept}. What would you need to name or store to make progress?`,
    3: `This scenario is really about recognizing what matters and what can be set aside - that's abstraction, and it usually becomes a ${primaryConcept} in Python.`,
    4: `Partial approach: start by writing down the value(s) you identified as a variable, then decide whether you need a condition, a loop, or just a print statement to show the result. Don't write the final code yet - just the shape of it.`
  };
  return templates[level] || templates[1];
}

function offlineExplanation(context) {
  const { concept, mode } = context;
  const templates = {
    'like-im-10': `Imagine ${concept} is a labeled box. You put something inside, write its name on the label, and later you can look at the label to know what's inside without opening every box.`,
    analogy: `${concept} is like a sticky note on your fridge - it holds one piece of information you want to remember and reuse later.`,
    'another-example': `Here's a different everyday example of ${concept}: think about a scoreboard at a game - it needs the same idea, just applied to a score instead.`,
    differently: `Let's look at ${concept} from another angle: instead of thinking about the code, think about the real-world decision it represents, then translate that decision into Python.`,
    'visual-text': `[Box: value] --> [Label: name] --> [Program reads the label to use the value]. That arrow chain is roughly what ${concept} does in a program.`
  };
  return templates[mode] || templates.differently;
}

function offlineCodeReview(context) {
  const { code = '' } = context;
  const lines = code.split('\n').filter(Boolean);
  const hasComments = /#/.test(code);
  const hasSnakeCase = /\b[a-z]+_[a-z]+\b/.test(code);
  const hasPrint = /print\(/.test(code);
  const longLines = lines.filter((line) => line.length > 79).length;

  return {
    correctness: hasPrint ? 'Your code appears to produce visible output, which is a good sign, but it has not been executed here - double-check it runs without errors.' : 'No print statement was found, so it is hard to tell what result this code produces. Consider adding one.',
    readability: longLines > 0 ? `${longLines} line(s) are quite long - breaking them up would make this easier to read.` : 'Line lengths look reasonable.',
    variableNaming: hasSnakeCase ? 'Variable names look like they follow Python\'s snake_case convention.' : 'Consider using descriptive snake_case names (like bag_weight) instead of short or unclear ones.',
    computationalThinking: 'Check that the code mirrors your original reasoning: the same steps, in the same order, with nothing skipped.',
    pythonBestPractices: hasComments ? 'Nice use of comments to explain intent.' : 'Adding a short comment above tricky lines would help future you (and reviewers) understand your intent.',
    suggestions: [
      'Trace through your code by hand with one example input to confirm the output matches what you expect.',
      'Give each variable a name that describes what it holds, not just its type.'
    ],
    mistakes: [],
    overallImpression: 'This is a reasonable first pass. Focus next on tracing it by hand with a real example to confirm the logic holds up.'
  };
}

function offlineRecommendationRationale(context) {
  const { concept, difficulty, weakConcepts = [] } = context;
  if (weakConcepts.length) {
    return `You've had lower scores on ${weakConcepts.join(', ')} recently, so this ${difficulty.toLowerCase()} ${concept} scenario is a good next step to reinforce it before moving on.`;
  }
  return `You're making steady progress, so this ${difficulty.toLowerCase()} scenario introduces ${concept} to keep building your range of concepts.`;
}

async function complete({ task, context = {} }) {
  switch (task) {
    case 'scenario-generate':
      return { text: JSON.stringify(offlineScenario(context)) };
    case 'tutor-chat':
      return { text: offlineTutorReply(context) };
    case 'hint':
      return { text: offlineHint(context) };
    case 'explanation':
      return { text: offlineExplanation(context) };
    case 'code-review':
      return { text: JSON.stringify(offlineCodeReview(context)) };
    case 'recommendation-rationale':
      return { text: offlineRecommendationRationale(context) };
    default:
      return { text: "I'm running in offline mode right now, so my answers are template-based rather than AI-generated. Configure an AI provider API key to unlock full responses." };
  }
}

module.exports = { complete, name: 'offline' };
