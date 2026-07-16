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

function scenarioGenerationPrompt({ concept, difficulty, theme, description, existingTitles }) {
  const keywords = CONCEPT_TRIGGER_KEYWORDS[concept] || [];
  const instructions = description
    ? `The learner described this idea in their own words: "${description}". Infer the most fitting Python `
      + `concept (one of Variables, Conditionals, Loops, Lists, Dictionaries, Functions, OOP) and an appropriate `
      + `difficulty (Beginner, Explorer, or Builder) yourself, and also include your choices as "concept" and `
      + `"difficulty" fields.`
    : `Generate a scenario about the theme "${theme}" that teaches the Python concept "${concept}" at `
      + `"${difficulty}" difficulty.`;

  return {
    task: 'scenario-generate',
    jsonMode: true,
    system: `${MENTOR_STYLE}\n\nYou generate new scenario-based learning activities as strict JSON.`,
    messages: [{
      role: 'user',
      content: `${instructions}\n\n`
        + `Naturally weave in language related to these ideas so the scenario clearly teaches the target `
        + `concept: ${keywords.join(', ') || concept}.\n\n`
        + `Do not reuse any of these existing scenario titles: ${existingTitles.slice(0, 40).join(' | ')}.\n\n`
        + 'Respond with ONLY a JSON object with these exact fields:\n'
        + '{\n'
        + '  "title": string,\n'
        + '  "context": string (2-3 sentences describing the real-world situation),\n'
        + '  "objectives": [string, string, string],\n'
        + '  "prompt": string (a guiding reasoning question for the learner),\n'
        + '  "sampleReasoning": string (a short example of good student reasoning),\n'
        + '  "concepts": [string] (lowercase Python concept tags),\n'
        + '  "difficulty": "Beginner" | "Explorer" | "Builder"\n'
        + '}'
    }],
    context: { concept, difficulty, theme, description, existingTitles }
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
  tutorChatPrompt,
  hintPrompt,
  explanationPrompt,
  codeReviewPrompt,
  recommendationRationalePrompt,
  MENTOR_STYLE
};
