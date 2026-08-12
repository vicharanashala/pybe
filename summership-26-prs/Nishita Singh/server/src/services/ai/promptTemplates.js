const { CONCEPT_TRIGGER_KEYWORDS } = require('./conceptVocabulary');

/**
 * Every function here returns a request object ready to hand to
 * aiProviderFactory.complete(): { system, messages, jsonMode, task,
 * context }. `task`/`context` are only read by the offline fallback
 * provider; `system`/`messages` are what real LLM providers use. Keeping
 * every prompt in this one file (Backend Requirements: "do not place
 * prompt logic inside controllers... keep prompts inside dedicated prompt
 * templates or services") makes them easy to audit and tune independently
 * of the services that call them.
 */

const MENTOR_STYLE = `You are PyBe's AI mentor for learners studying Python through real-world scenarios. `
  + 'You teach through Computational Thinking: Decomposition, Pattern Recognition, Abstraction, and Algorithm '
  + 'Design. You never immediately reveal a final answer or full solution code. You ask guiding questions, '
  + 'give partial nudges, and encourage the learner to reason for themselves. Be warm, concise, and specific '
  + 'to the scenario in front of you.';

const SCENARIO_QUALITY_RULES = `When you write a scenario, follow these rules strictly:\n`
  + '- Tell a believable real-world STORY, never an object label like "School: Library Book" or "Hospital: Patient". '
  + 'If you catch yourself writing "<Theme>: <Object>", stop and rewrite it as a situation instead.\n'
  + '- Give it a real character (a name or a clear role, e.g. "the school librarian", "Priya, a shop owner") with a '
  + 'genuine goal and a concrete problem standing in their way.\n'
  + '- Explain WHY the information matters to that character before mentioning Python at all - the context should '
  + 'read like a short story, not a spec sheet. Python is the solution the learner arrives at, not the subject of '
  + 'the opening sentence.\n'
  + '- The scenario must naturally lead to the target Python concept - a reader who knows nothing about Python '
  + 'should still understand the situation and see why remembering/deciding/repeating/organizing something would help.\n'
  + '- Guided questions must be specific to THIS story (mention the character, the actual pieces of information '
  + 'involved, or the actual decision at hand) - never generic template questions like "What information is '
  + 'important?" on their own with no story detail attached.';

function scenarioGenerationPrompt({ concept, difficulty, theme, description, existingTitles }) {
  const keywords = CONCEPT_TRIGGER_KEYWORDS[concept] || [];
  const instructions = description
    ? `The learner described this idea in their own words: "${description}". Infer the most fitting Python `
      + `concept (one of Variables, Conditionals, Loops, Lists, Dictionaries, Functions, OOP) and an appropriate `
      + `difficulty (Beginner, Explorer, or Builder) yourself, and also include your choices as "concept" and `
      + `"difficulty" fields. Build the story around what they actually described, don't ignore it.`
    : `Generate a scenario about the theme "${theme}" that teaches the Python concept "${concept}" at `
      + `"${difficulty}" difficulty.`;

  return {
    task: 'scenario-generate',
    jsonMode: true,
    system: `${MENTOR_STYLE}\n\nYou generate new scenario-based learning activities as strict JSON.\n\n${SCENARIO_QUALITY_RULES}`,
    messages: [{
      role: 'user',
      content: `${instructions}\n\n`
        + `Naturally weave in language related to these ideas so the scenario clearly teaches the target `
        + `concept: ${keywords.join(', ') || concept}.\n\n`
        + `Do not reuse any of these existing scenario titles: ${existingTitles.slice(0, 40).join(' | ')}.\n\n`
        + 'Respond with ONLY a JSON object with these exact fields:\n'
        + '{\n'
        + '  "title": string (a short story-like title, NOT a "Theme: Object" label - e.g. "The Librarian\'s Daily Count", not "School: Library Book"),\n'
        + '  "context": string (3-4 sentences telling the real-world story: character, goal, problem, why it matters - Python comes last, if at all),\n'
        + '  "objectives": [string, string, string] (specific to this story, not generic),\n'
        + '  "prompt": string (a guiding reasoning question specific to this story\'s details),\n'
        + '  "sampleReasoning": string (a short example of good student reasoning about THIS story),\n'
        + '  "guidedQuestions": [\n'
        + '    {"question": string, "hint": string},\n'
        + '    {"question": string, "hint": string},\n'
        + '    {"question": string, "hint": string}\n'
        + '  ] (3 reasoning questions specific to this story\'s characters/details, building toward the solution),\n'
        + '  "concepts": [string] (lowercase Python concept tags),\n'
        + '  "difficulty": "Beginner" | "Explorer" | "Builder"\n'
        + '}'
    }],
    context: { concept, difficulty, theme, description, existingTitles }
  };
}

/**
 * Enhancement Proposal #11: generate three distinct scenario options for
 * the same concept/difficulty/theme (or the same free-text description) so
 * the learner can pick the one that resonates, instead of only ever seeing
 * one generated scenario. Additive: the original single-scenario prompt
 * above is unchanged and still used by the existing generate/custom
 * endpoints, so nothing that already calls them breaks (Refactoring
 * Guidelines Rule 1/2).
 */
function scenarioOptionsPrompt({ concept, difficulty, theme, description, existingTitles }) {
  const single = scenarioGenerationPrompt({ concept, difficulty, theme, description, existingTitles });
  return {
    ...single,
    task: 'scenario-generate-options',
    system: `${single.system}\n\nGenerate THREE clearly different story ideas for the same target concept - `
      + 'different characters, different settings, different problems - so a learner can pick whichever one '
      + 'resonates with them. They must not be minor variations of each other.',
    messages: [{
      role: 'user',
      content: `${single.messages[0].content}\n\n`
        + 'Respond with ONLY a JSON object of the exact shape: { "options": [ <scenario object as specified '
        + 'above>, <scenario object>, <scenario object> ] } - exactly three entries in "options", each a complete '
        + 'scenario object with all the fields listed above, each telling a genuinely different story.'
    }],
    context: { ...single.context, optionsCount: 3 }
  };
}

function tutorChatPrompt({ question, scenario, history }) {
  const scenarioContext = scenario
    ? `The learner is currently working on this scenario: "${scenario.title}". Context: ${scenario.context} `
      + `Target Python concept(s): ${scenario.concepts?.join(', ')}.`
    : 'The learner is not currently viewing a specific scenario.';

  return {
    task: 'tutor-chat',
    system: `${MENTOR_STYLE}\n\n${scenarioContext}\n\nIf asked for a hint, give only ONE hint, not the full `
      + 'solution. If asked to explain the final code before the learner has revealed it themselves, decline '
      + "gently and redirect them to reason it out first, unless they've explicitly said they already completed "
      + 'and revealed the scenario.',
    messages: [
      ...(history || []).map((message) => ({ role: message.role, content: message.content })),
      { role: 'user', content: question }
    ],
    context: { question, scenarioTitle: scenario?.title, primaryConcept: scenario?.concepts?.[0] }
  };
}

function hintPrompt({ level, scenario, workspace }) {
  const levelInstructions = {
    1: 'Give a very small nudge - just point their attention in the right direction, no specifics.',
    2: 'Guide their thinking more directly - suggest what kind of information or Python idea to consider.',
    3: 'Reveal part of the computational thinking process - name the CT skill and the Python concept involved.',
    4: 'Reveal a partial algorithm as plain-language steps - NOT actual code, just the shape of the solution.'
  };

  return {
    task: 'hint',
    system: `${MENTOR_STYLE}\n\nYou are generating hint level ${level} of 4 for this scenario. `
      + `${levelInstructions[level]} Never include a full working code solution, and never output a fenced code block.`,
    messages: [{
      role: 'user',
      content: `Scenario: "${scenario.title}". Context: ${scenario.context}. Target concept: `
        + `${scenario.concepts?.join(', ')}.\n`
        + `The learner's current draft (if any): ${workspace?.reasoning || '(nothing written yet)'}\n\n`
        + `Write hint level ${level}.`
    }],
    context: { level, scenarioTitle: scenario.title, primaryConcept: scenario.concepts?.[0] || 'this concept' }
  };
}

function explanationPrompt({ mode, concept, scenario }) {
  const modeInstructions = {
    'like-im-10': "Explain it the way you'd explain it to a 10 year old - simple words, no jargon.",
    analogy: 'Explain it using a clear everyday analogy.',
    'another-example': 'Give a fresh real-world example of this concept, different from the current scenario.',
    differently: 'Explain it again using a noticeably different approach or angle than a typical explanation.',
    'visual-text': 'Explain it using a simple text-based diagram or arrows to show the flow, not just prose.'
  };

  return {
    task: 'explanation',
    system: `${MENTOR_STYLE}\n\nGenerate a fresh explanation each time - vary your wording and examples, `
      + "never repeat a previous explanation verbatim.",
    messages: [{
      role: 'user',
      content: `Concept to explain: "${concept}".${scenario ? ` Current scenario for context: "${scenario.title}" - ${scenario.context}` : ''}\n\n`
        + `${modeInstructions[mode] || modeInstructions.differently}`
    }],
    context: { concept, mode }
  };
}

function codeReviewPrompt({ code, scenario }) {
  return {
    task: 'code-review',
    jsonMode: true,
    system: `${MENTOR_STYLE}\n\nYou review learner-written Python code. Never just say "wrong" - always `
      + 'explain the reasoning and suggest a specific improvement. Respond as strict JSON.',
    messages: [{
      role: 'user',
      content: `${scenario ? `Scenario: "${scenario.title}" - ${scenario.context}\n\n` : ''}`
        + `Learner's code:\n${code}\n\n`
        + 'Respond with ONLY a JSON object with these exact fields:\n'
        + '{\n'
        + '  "correctness": string,\n'
        + '  "readability": string,\n'
        + '  "variableNaming": string,\n'
        + '  "computationalThinking": string,\n'
        + '  "pythonBestPractices": string,\n'
        + '  "suggestions": [string],\n'
        + '  "mistakes": [string],\n'
        + '  "overallImpression": string\n'
        + '}'
    }],
    context: { code, scenario }
  };
}

function recommendationRationalePrompt({ concept, difficulty, weakConcepts }) {
  return {
    task: 'recommendation-rationale',
    system: `${MENTOR_STYLE}\n\nWrite one short, encouraging sentence explaining why this scenario was recommended next.`,
    messages: [{
      role: 'user',
      content: `Recommended concept: ${concept}. Difficulty: ${difficulty}. Weak concepts recently: `
        + `${weakConcepts.length ? weakConcepts.join(', ') : 'none identified'}.`
    }],
    context: { concept, difficulty, weakConcepts }
  };
}

module.exports = {
  scenarioGenerationPrompt,
  scenarioOptionsPrompt,
  tutorChatPrompt,
  hintPrompt,
  explanationPrompt,
  codeReviewPrompt,
  recommendationRationalePrompt,
  MENTOR_STYLE
};
