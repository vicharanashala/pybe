// Conversational Questioning engine (PyBe roadmap V0 item).
//
// Drives a turn-by-turn, objective-by-objective dialogue for a scenario,
// entirely with local rule-based logic (no LLM/API calls), in the same
// deterministic style as learningEngine.js.
//
// Each scenario's `objectives` array (always 3 entries) is treated as a
// ladder of sub-questions, and the system always prompts for them in
// order. Every objective is { text, keywords }, a small hand-authored
// list of 2 words/phrases chosen from that scenario's own context.
//
// Classification is scenario-wide, not objective-specific: all keywords
// across the scenario's 3 objectives are pooled into one list (so a
// learner who answers with the right vocabulary for the *scenario* gets
// credit even if they expressed it at a different step than the one
// currently being probed — e.g. naming "for loop" while objective 1 is
// just asking them to notice the repetition pattern). The answer is
// checked against that full pooled list with a simple threshold:
//   - 0 matches    -> off_topic
//   - 1 match      -> partial
//   - 2+ matches   -> solid
// This deliberately favors encouraging genuine engagement with the
// scenario's concept over strict step-by-step gatekeeping, since this is
// a learning tool, not an exam.

const MAX_ATTEMPTS_PER_OBJECTIVE = 2;

function wordBoundaryIncludes(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Multi-word phrases ("each break") match literally. Single words allow
  // an optional trailing 's' so simple plurals/conjugations still count —
  // "loop" should match "loops", "store" should match "stores" — without
  // resorting to a full stemmer for what is just a keyword spot-check.
  const pattern = phrase.includes(' ')
    ? new RegExp(escaped)
    : new RegExp(`\\b${escaped}s?\\b`);
  return pattern.test(text);
}

// Pools every objective's keywords into one de-duplicated list for the
// scenario. Cached per scenario object would be a nice-to-have, but
// scenario objects here are small (3 objectives, 2 keywords each) so
// recomputing this on every call is cheap and keeps the function pure.
function pooledKeywords(scenario) {
  const all = (scenario.objectives || []).flatMap((objective) => objective.keywords || []);
  return [...new Set(all)];
}

// Classify a single learner answer against the scenario as a whole. The
// objectiveIndex parameter is accepted for API stability (callers still
// pass it, and it's still used to decide what prompt/hint text to show)
// but classification itself no longer depends on which objective is
// currently active — see header comment.
// Returns { classification: 'off_topic' | 'partial' | 'solid', matchedConcepts, score }
function classifyAnswer(answerText = '', scenario, _objectiveIndex) {
  const text = answerText.trim();
  const lower = text.toLowerCase();
  const keywords = pooledKeywords(scenario);

  const matchedConcepts = keywords.filter((keyword) => wordBoundaryIncludes(lower, keyword));

  if (text.length === 0 || matchedConcepts.length === 0) {
    return { classification: 'off_topic', matchedConcepts, score: matchedConcepts.length };
  }
  if (matchedConcepts.length >= 2) {
    return { classification: 'solid', matchedConcepts, score: matchedConcepts.length };
  }
  return { classification: 'partial', matchedConcepts, score: matchedConcepts.length };
}

function buildProbe(scenario, objectiveIndex) {
  if (objectiveIndex === 0) {
    return scenario.prompt;
  }
  return `Next: ${scenario.objectives[objectiveIndex].text}. Building on that, what would you do here?`;
}

function buildClarify(scenario, objectiveIndex) {
  return `Let's narrow it down. Thinking just about "${scenario.objectives[objectiveIndex].text}" — what specifically would you write down or decide?`;
}

function buildHint(scenario, objectiveIndex, matchedConcepts) {
  const concept = (scenario.concepts || [])[0] || 'this idea';
  if (matchedConcepts.length > 0) {
    return `You're close — you mentioned ${matchedConcepts[0]}. Now connect that directly to "${scenario.objectives[objectiveIndex].text}".`;
  }
  return `Here's a nudge: this scenario is about ${concept}. With that in mind, how would you address "${scenario.objectives[objectiveIndex].text}"?`;
}

function buildForceAdvanceNote(scenario, objectiveIndex) {
  return `Let's move forward with what you have for "${scenario.objectives[objectiveIndex].text}" and continue.`;
}

function buildTransition(scenario, nextObjectiveIndex) {
  return buildProbe(scenario, nextObjectiveIndex);
}

function buildRecap(scenario, turns) {
  const learnerTurns = turns.filter((turn) => turn.role === 'learner');
  const solidCount = learnerTurns.filter((turn) => turn.classification === 'solid').length;
  return `Nice work — you walked through all ${scenario.objectives.length} steps for "${scenario.title}" (${solidCount}/${learnerTurns.length} answered solidly on the first or second try). Here is what your reasoning maps to in Python.`;
}

// Starts a new conversation: returns the initial conversation fields plus
// the first system turn (always the scenario's opening prompt).
function startConversation(scenario) {
  const firstTurn = {
    _id: cryptoRandomId(),
    role: 'system',
    objectiveIndex: 0,
    moveType: 'probe',
    text: buildProbe(scenario, 0),
    classification: null,
    matchedConcepts: [],
    createdAt: new Date().toISOString()
  };
  return {
    status: 'in_progress',
    objectiveIndex: 0,
    attemptsOnObjective: 0,
    turns: [firstTurn]
  };
}

// Advances a conversation by one learner turn. Pure function: takes the
// current conversation state + answer text + scenario, returns the new
// state (turns appended, objectiveIndex/attempts updated, status updated).
function advanceConversation(conversation, scenario, answerText) {
  const { classification, matchedConcepts, score } = classifyAnswer(answerText, scenario, conversation.objectiveIndex);
  const timestamp = new Date().toISOString();

  const learnerTurn = {
    _id: cryptoRandomId(),
    role: 'learner',
    objectiveIndex: conversation.objectiveIndex,
    moveType: 'answer',
    text: answerText,
    classification,
    matchedConcepts,
    score,
    createdAt: timestamp
  };

  const attempts = conversation.attemptsOnObjective + 1;
  const isLastObjective = conversation.objectiveIndex === scenario.objectives.length - 1;
  const turns = [...conversation.turns, learnerTurn];

  function systemTurn(moveType, text, nextObjectiveIndex) {
    return {
      _id: cryptoRandomId(),
      role: 'system',
      objectiveIndex: nextObjectiveIndex,
      moveType,
      text,
      classification: null,
      matchedConcepts: [],
      createdAt: timestamp
    };
  }

  // SOLID: advance immediately.
  if (classification === 'solid') {
    if (isLastObjective) {
      const recapTurn = systemTurn('recap', buildRecap(scenario, turns), conversation.objectiveIndex);
      return {
        ...conversation,
        turns: [...turns, recapTurn],
        attemptsOnObjective: 0,
        status: 'completed'
      };
    }
    const nextIndex = conversation.objectiveIndex + 1;
    const transitionTurn = systemTurn('transition', buildTransition(scenario, nextIndex), nextIndex);
    return {
      ...conversation,
      turns: [...turns, transitionTurn],
      objectiveIndex: nextIndex,
      attemptsOnObjective: 0,
      status: 'in_progress'
    };
  }

  // OFF_TOPIC or PARTIAL, but attempts remaining: clarify or hint, stay on same objective.
  if (attempts < MAX_ATTEMPTS_PER_OBJECTIVE) {
    const moveType = classification === 'off_topic' ? 'clarify' : 'hint';
    const text = classification === 'off_topic'
      ? buildClarify(scenario, conversation.objectiveIndex)
      : buildHint(scenario, conversation.objectiveIndex, matchedConcepts);
    const followUpTurn = systemTurn(moveType, text, conversation.objectiveIndex);
    return {
      ...conversation,
      turns: [...turns, followUpTurn],
      attemptsOnObjective: attempts,
      status: 'in_progress'
    };
  }

  // OFF_TOPIC or PARTIAL, attempts exhausted: force-advance so the learner
  // is never trapped on one objective.
  const forceNote = systemTurn('hint', buildForceAdvanceNote(scenario, conversation.objectiveIndex), conversation.objectiveIndex);
  const turnsWithNote = [...turns, forceNote];

  if (isLastObjective) {
    const recapTurn = systemTurn('recap', buildRecap(scenario, turnsWithNote), conversation.objectiveIndex);
    return {
      ...conversation,
      turns: [...turnsWithNote, recapTurn],
      attemptsOnObjective: 0,
      status: 'completed'
    };
  }
  const nextIndex = conversation.objectiveIndex + 1;
  const transitionTurn = systemTurn('transition', buildTransition(scenario, nextIndex), nextIndex);
  return {
    ...conversation,
    turns: [...turnsWithNote, transitionTurn],
    objectiveIndex: nextIndex,
    attemptsOnObjective: 0,
    status: 'in_progress'
  };
}

// Joins the completed conversation's learner answers into a single
// reasoning string, so the existing learningEngine functions (mapReasoning,
// evaluatePrompt, etc.) can run on it unchanged.
//
// Only the *last* learner answer for each objective is used — earlier
// attempts on the same objective (that triggered a hint/clarify) were
// scratch work, not the learner's resolved understanding, and including
// them would dilute or distort the signal the downstream engine sees.
//
// Deliberately NOT prefixed with the objective text: learningEngine's
// keyword matching is substring-based (e.g. "if" matches inside
// "Identify"), so mixing in the objective's own wording can trigger false
// concept matches that have nothing to do with what the learner wrote.
function buildTranscript(conversation, scenario) {
  const finalAnswerByObjective = new Map();
  conversation.turns
    .filter((turn) => turn.role === 'learner')
    .forEach((turn) => finalAnswerByObjective.set(turn.objectiveIndex, turn.text));

  return scenario.objectives
    .map((_objective, index) => finalAnswerByObjective.get(index))
    .filter(Boolean)
    .join(' | ');
}

function cryptoRandomId() {
  // Lazily require to avoid pulling crypto into engine tests that don't need it.
  return require('crypto').randomUUID();
}

module.exports = {
  MAX_ATTEMPTS_PER_OBJECTIVE,
  classifyAnswer,
  startConversation,
  advanceConversation,
  buildTranscript
};
