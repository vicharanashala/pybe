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

/**
 * Enhancement Proposal #1: every generated scenario needs a real character,
 * a goal, and a concrete problem - never a bare "Theme: Object" label. Each
 * theme has a handful of hand-seeded story ingredients; the concept
 * templates below turn a seed into a full narrative scenario.
 */
const THEME_STORIES = {
  School: [
    { character: 'Ms. Rao, the school librarian', goal: 'keep the return desk running smoothly', noun: 'how many books come back each afternoon', title: "The Librarian's Daily Count" },
    { character: 'Coach Diaz', goal: 'plan fair seating for the class trip', noun: 'which students are sitting where', title: 'Sorting Out the Class Trip Seats' },
    { character: 'a new student named Arjun', goal: 'find his way around on his first day', noun: 'which room he needs to be in for each period', title: "Arjun's First Day Schedule" }
  ],
  Hospital: [
    { character: 'Nurse Bello', goal: 'make sure no patient is forgotten during rounds', noun: "each patient's next check-up time", title: "Nurse Bello's Round" },
    { character: 'Dr. Kim', goal: 'decide who needs urgent attention first', noun: "each patient's symptoms", title: 'Deciding Who Goes First' },
    { character: 'the hospital pharmacist', goal: 'avoid running out of a critical medicine', noun: 'how much medicine is left in stock', title: 'Watching the Medicine Shelf' }
  ],
  Sports: [
    { character: 'Coach Alvarez', goal: 'keep an accurate scoreboard during the tournament', noun: "each team's tally", title: "Coach Alvarez's Scoreboard" },
    { character: 'a referee named Sam', goal: 'decide fairly when a player has fouled out', noun: 'how many fouls each player has', title: 'When Has a Player Fouled Out?' },
    { character: 'the team captain', goal: 'pick the starting lineup fairly', noun: "each player's training attendance", title: 'Picking the Starting Lineup' }
  ],
  Shopping: [
    { character: 'a cashier named Priya', goal: 'apply the right discount at checkout', noun: 'the price before and after markdown', title: "Priya's Checkout Line" },
    { character: 'a shop owner', goal: 'know when to reorder stock before shelves go empty', noun: 'how many items are left of each product', title: 'Before the Shelf Goes Empty' },
    { character: 'a shopper on a tight budget', goal: 'stay under budget while filling the cart', noun: 'the running amount spent in the cart', title: 'Staying Under Budget' }
  ],
  Travel: [
    { character: 'a gate agent named Noah', goal: 'let the right passengers board at the right time', noun: 'each boarding pass group number', title: "Noah's Boarding Line" },
    { character: 'a backpacker named Lena', goal: 'keep her trip on budget across many cities', noun: 'how much she has spent in each city', title: "Lena's Travel Budget" },
    { character: 'a hotel receptionist', goal: 'know which rooms are actually free tonight', noun: 'which rooms are booked and which are open', title: 'Which Rooms Are Free Tonight?' }
  ],
  Space: [
    { character: 'a mission controller', goal: 'make sure the crew has enough fuel to get home', noun: 'how much fuel remains in the tank', title: 'Enough Fuel to Get Home?' },
    { character: 'an astronaut named Priya Shah', goal: 'catch a problem before it becomes serious', noun: 'the satellite signal strength readings', title: "Reading the Satellite's Signal" },
    { character: 'a flight engineer', goal: 'keep the crew roster accurate before launch', noun: 'who is confirmed for the mission', title: 'Confirming the Crew Roster' }
  ],
  Banking: [
    { character: 'a bank teller named Marcus', goal: 'flag balances that have gone below zero', noun: "each customer's balance", title: 'Flagging the Balances Below Zero' },
    { character: 'a loan officer', goal: 'decide fairly who qualifies for a loan', noun: "each applicant's income and history", title: 'Who Qualifies for the Loan?' },
    { character: 'a customer checking their statement', goal: 'find every transaction over a certain amount', noun: 'a list of transactions from this month', title: 'Finding the Big Transactions' }
  ],
  Gaming: [
    { character: 'a game designer', goal: 'keep the leaderboard fair and up to date', noun: "each player's high tally", title: 'Keeping the Leaderboard Honest' },
    { character: 'a player named Kofi', goal: 'know exactly what is left in his inventory', noun: 'which items are in his inventory', title: "Kofi's Inventory Check" },
    { character: 'a level designer', goal: 'decide when a player has earned the next level', noun: "a player's current progress", title: 'Earning the Next Level' }
  ],
  Environment: [
    { character: 'a park ranger', goal: 'track whether the local tree population is recovering', noun: 'how many trees were planted this season', title: "The Ranger's Tree Count" },
    { character: 'a city planner', goal: 'decide which neighborhoods need better recycling bins', noun: 'how full each recycling bin gets each week', title: 'Which Bins Need Attention?' },
    { character: 'a volunteer at a clean-up drive', goal: 'know if today\'s air quality is safe to work in', noun: "today's air quality reading", title: 'Is the Air Safe Today?' }
  ],
  Cooking: [
    { character: 'a line cook named Theo', goal: 'get every order out before it gets cold', noun: 'which orders are still waiting', title: "Theo's Order Ticket Line" },
    { character: 'a home baker', goal: 'scale a recipe up for a big order without ruining it', noun: 'the amount of each ingredient needed', title: 'Scaling Up the Recipe' },
    { character: 'a restaurant manager', goal: 'know what to restock before the weekend rush', noun: "what's left in the pantry", title: 'Restocking Before the Rush' }
  ],
  Business: [
    { character: 'a small business owner', goal: 'know which invoices are still unpaid', noun: 'each invoice amount and whether it was paid', title: 'Which Invoices Are Still Unpaid?' },
    { character: 'a sales manager', goal: 'find out which client needs a follow-up call', noun: 'when each client was last contacted', title: 'Who Needs a Follow-Up Call?' },
    { character: 'an office assistant', goal: 'avoid double-booking the big meeting room', noun: 'when the meeting room is already reserved', title: 'Avoiding the Double Booking' }
  ],
  Office: [
    { character: 'an office manager', goal: 'keep the printer queue from backing up', noun: 'how many print jobs are waiting', title: "Clearing the Printer Queue" },
    { character: 'an HR coordinator', goal: 'know who is still owed expense reimbursement', noun: 'which expense reports are unpaid', title: 'Who Still Needs Reimbursing?' },
    { character: 'a receptionist', goal: 'know who has actually checked in for their meeting', noun: 'which visitors have signed in today', title: 'Who Has Checked In Today?' }
  ]
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
  // Strip a leading article so it reads naturally as a noun phrase.
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
 * Per-category narrative templates. Each one turns a story seed
 * (character, goal, noun) into: a problem sentence (what's going wrong
 * without a computer), a "why Python helps" transition, and three guided
 * questions specific to that character and detail - never a generic
 * template question with no story attached (Enhancement Proposal #1, #2).
 * Every sentence still contains the keyword(s) services/learningEngine.js's
 * conceptRules looks for, so the generated scenario reliably produces the
 * matching code template (verified by the offline-provider test harness
 * run during development - see PR notes).
 */
const CONCEPT_TEMPLATES = {
  Variables: {
    problem: ({ character, noun }) => `Right now ${character} has to keep ${noun} in their head or rewrite it by hand every time, and it's easy to lose track.`,
    transition: ({ character }) => `Python can remember it for ${character} instead - once it's stored, it's there whenever it's needed.`,
    objective: ({ noun }) => `Decide the one detail about ${noun} worth remembering`,
    prompt: ({ character, noun }) => `What single piece of information should ${character} store, based on ${noun}, so it can be used again later?`,
    reasoning: ({ character, noun }) => `I would remember ${noun} by giving it a name, so ${character} doesn't have to redo the work.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} is dealing with a lot today. Which single detail about ${noun} actually needs to be remembered to ${goal}?`, hint: 'Look for the one changing fact, not the background details.' },
      { question: `Tomorrow, the computer won't remember today's information unless it's stored. What value should be saved so ${character} can use it later?`, hint: "Think about what changes each day versus what stays the same." },
      { question: `If you had to give that value a name in Python, what would you call it?`, hint: 'Pick a name that describes what it holds, not just its type.' }
    ]
  },
  Conditionals: {
    problem: ({ character, noun }) => `${character} has to react differently depending on ${noun}, and deciding that by hand for every single case is slow and easy to get wrong.`,
    transition: ({ character }) => `Python can make that decision automatically for ${character}, the same way every time.`,
    objective: ({ noun }) => `Decide what condition determines what happens based on ${noun}`,
    prompt: ({ character, noun }) => `What condition should ${character} check about ${noun} to decide what happens next?`,
    reasoning: ({ character, noun }) => `I would check a condition on ${noun} to decide what ${character} should do next.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} wants to ${goal}. What's the rule that decides one outcome from another, based on ${noun}?`, hint: 'Look for a threshold or a yes/no split.' },
      { question: `What should happen when that condition is true - and what should happen when it isn't?`, hint: 'Both outcomes matter, not just the "yes" case.' },
      { question: `How would you phrase that rule so a computer, not just a person, could check it?`, hint: 'Try starting with "if..."' }
    ]
  },
  Loops: {
    problem: ({ character, noun }) => `${character} has to repeat the same check across ${noun}, one at a time, and doing it manually gets tedious and error-prone as the numbers grow.`,
    transition: ({ character }) => `Python can repeat that same step automatically for ${character}, no matter how many there are.`,
    objective: ({ noun }) => `Decide what needs to repeat across ${noun}`,
    prompt: ({ character, noun }) => `What would ${character} need to repeat for every entry in ${noun}?`,
    reasoning: ({ character, noun }) => `I would repeat the same check across ${noun}, since the same rule applies to each one.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} needs to look at ${noun} one at a time to ${goal}. What's the one action that repeats for each one?`, hint: 'The action should be the same each time, just applied to a different item.' },
      { question: `What changes each time through, and what stays exactly the same?`, hint: 'The thing that changes is usually what you loop over.' },
      { question: `How would you know when to stop repeating?`, hint: 'Think about running out of items versus a specific condition being met.' }
    ]
  },
  Lists: {
    problem: ({ character, noun }) => `${character} is juggling ${noun} without any organized way to keep them together, which makes it easy to lose one or mix them up.`,
    transition: ({ character }) => `Python can hold all of them together in order for ${character}, so nothing gets lost.`,
    objective: ({ noun }) => `Decide how to store ${noun} together, in order`,
    prompt: ({ character, noun }) => `How should ${character} store each item in ${noun} together so they can work through all of them?`,
    reasoning: ({ character, noun }) => `I would store each item in ${noun} together in order, so ${character} can look at all of them as a group.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} needs to ${goal}. Why would keeping ${noun} together, in order, help more than handling them one at a time separately?`, hint: 'Think about what happens as the number of items grows.' },
      { question: `Does the order of ${noun} matter here, or could they be in any order?`, hint: 'This affects how you\'d organize them.' },
      { question: `How would ${character} add a new item without disturbing the ones already there?`, hint: 'Think about adding to the end versus a specific position.' }
    ]
  },
  Dictionaries: {
    problem: ({ character, noun }) => `${character} needs to look up specific information within ${noun} quickly, but searching through everything one by one every time wastes time.`,
    transition: ({ character }) => `Python can pair each piece of information with a label for ${character}, so any value can be looked up instantly.`,
    objective: ({ noun }) => `Decide what key would look up each value within ${noun}`,
    prompt: ({ character, noun }) => `What key would ${character} use to look up each value within ${noun}?`,
    reasoning: ({ character, noun }) => `I would pair each item in ${noun} with its value, using a key so ${character} can look it up quickly.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} wants to ${goal}. What's the natural label they'd search by within ${noun}?`, hint: 'That label is usually a good candidate for a key.' },
      { question: `For each label, what's the one value that needs to be paired with it?`, hint: 'A key always points to exactly one value.' },
      { question: `What should happen if ${character} looks up a label that doesn't exist?`, hint: 'Real data is never perfectly complete.' }
    ]
  },
  Functions: {
    problem: ({ character, noun }) => `${character} keeps redoing the same set of steps for ${noun} every time it comes up, retyping the same logic again and again.`,
    transition: ({ character }) => `Python can turn those steps into one reusable block for ${character}, written once and called whenever it's needed.`,
    objective: ({ noun }) => `Turn the steps for handling ${noun} into one reusable process`,
    prompt: ({ character, noun }) => `What repeatable process would handle ${noun} for ${character}, so it could be reused?`,
    reasoning: ({ character, noun }) => `I would turn the steps for handling ${noun} into one reusable process ${character} can call again.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} does the same set of steps for ${noun} over and over to ${goal}. What are those steps, in order?`, hint: 'Write them out as a short numbered list first.' },
      { question: `What information would those steps need each time to work on a new case?`, hint: 'That becomes the input the process needs.' },
      { question: `What result should come out at the end, every time?`, hint: 'That becomes what the process gives back.' }
    ]
  },
  OOP: {
    problem: ({ character, noun }) => `${character} is tracking several related pieces of information about ${noun} separately, and keeping them in sync by hand is getting messy.`,
    transition: ({ character, noun }) => `Python can bundle the data and the actions for ${noun} together for ${character}, as one connected thing.`,
    objective: ({ noun }) => `Decide what properties and actions something modelling ${noun} should have`,
    prompt: ({ character, noun }) => `If ${character} modelled ${noun} as one connected thing, what properties and actions would it need?`,
    reasoning: ({ character, noun }) => `I would model ${noun} as an object with its own properties and actions.`,
    guidedQuestions: ({ character, noun, goal }) => [
      { question: `${character} wants to ${goal}. What separate facts about ${noun} currently have to be kept in sync by hand?`, hint: 'List the facts as if they were fields on a form.' },
      { question: `Besides facts, what actions does ${character} actually perform on ${noun}?`, hint: 'Actions are usually verbs: check, update, report...' },
      { question: `Why might bundling those facts and actions together be more reliable than keeping them separate?`, hint: 'Think about what happens when only one of them gets updated by mistake.' }
    ]
  }
};

function buildScenarioFields({ concept, seed, title }) {
  const template = CONCEPT_TEMPLATES[concept] || CONCEPT_TEMPLATES.Variables;
  const { character, noun, goal } = seed;

  return {
    title,
    context: `${character} wants to ${goal}. ${template.problem(seed)} ${template.transition(seed)}`,
    objectives: [
      `Identify what actually matters about ${noun}`,
      template.objective(seed),
      `Connect that idea to ${concept} in Python`
    ],
    prompt: template.prompt(seed),
    sampleReasoning: template.reasoning(seed),
    guidedQuestions: template.guidedQuestions(seed).map((entry, index) => ({ id: `ai-${index + 1}`, ...entry })),
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
 * `excludeSeeds` lets the "three options" flow (see offlineScenarioOptions
 * below) avoid picking the same character/story twice.
 */
function offlineGuidedScenario({ concept, difficulty, theme, existingTitles = [] }, excludeSeeds = []) {
  const stories = THEME_STORIES[theme] || THEME_STORIES.School;
  const available = stories.filter((story) => !excludeSeeds.includes(story.title));
  const seed = pick(available.length ? available : stories, `${concept}-${theme}-${excludeSeeds.length}`);
  const title = dedupeTitle(seed.title, existingTitles);

  return {
    ...buildScenarioFields({ concept, seed, title }),
    difficulty: difficulty || 'Beginner',
    _seedTitle: seed.title
  };
}

/**
 * Feature 2 path: learner described their own idea in free text. The
 * concept is inferred from their wording, and the topic they actually
 * typed becomes the "noun" of the story - wrapped in a small narrative
 * frame (a character and a goal) instead of being used as a bare label.
 * `variantIndex` lets the "three options" flow give each option a
 * different persona for the same topic.
 */
function offlineCustomScenario({ description, existingTitles = [] }, variantIndex = 0) {
  const topic = extractTopic(description);
  const concept = inferConceptFromText(description);
  const CUSTOM_CHARACTERS = [
    { character: 'a learner working through a real problem', goal: `get ${topic} under control` },
    { character: 'someone who deals with this every day', goal: `stop doing ${topic} by hand` },
    { character: 'a small team trying to stay organized', goal: `keep ${topic} from slipping through the cracks` }
  ];
  const persona = CUSTOM_CHARACTERS[variantIndex % CUSTOM_CHARACTERS.length];
  const seed = { character: persona.character, goal: persona.goal, noun: topic };
  const title = dedupeTitle(toTitleCase(topic), existingTitles);

  return {
    ...buildScenarioFields({ concept, seed, title }),
    difficulty: 'Beginner'
  };
}

function offlineScenario(context) {
  return context.description
    ? offlineCustomScenario(context)
    : offlineGuidedScenario(context);
}

/**
 * Enhancement Proposal #11: generate three genuinely different scenario
 * options instead of one, so the learner can pick whichever resonates.
 * Reuses the exact same generation logic as the single-scenario path
 * (buildScenarioFields / CONCEPT_TEMPLATES) - just draws three different
 * story seeds instead of one, so there's no duplicated template logic to
 * keep in sync.
 */
function offlineScenarioOptions(context) {
  const usedSeedTitles = [];
  const accumulatedTitles = [...(context.existingTitles || [])];
  const options = [];
  for (let i = 0; i < 3; i += 1) {
    if (context.description) {
      const option = offlineCustomScenario({ ...context, existingTitles: accumulatedTitles }, i);
      accumulatedTitles.push(option.title);
      options.push(option);
    } else {
      const option = offlineGuidedScenario({ ...context, existingTitles: accumulatedTitles }, usedSeedTitles);
      if (option._seedTitle) usedSeedTitles.push(option._seedTitle);
      delete option._seedTitle;
      accumulatedTitles.push(option.title);
      options.push(option);
    }
  }
  return { options };
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
    case 'scenario-generate-options':
      return { text: JSON.stringify(offlineScenarioOptions(context)) };
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
