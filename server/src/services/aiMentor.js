const {
  GoogleGenAI
} = require('@google/genai');

const {
  validateMentorResponse
} = require('./mentorValidator');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateMentorResponse(
  mentorContext
) {
  const history =
    mentorContext.learnerHistory || [];

  const profile =
    mentorContext.learnerProfile || {};

  const strategy =
    mentorContext.adaptiveStrategy || {};

  const difficulty =
    mentorContext.adaptiveDifficulty || {};

  const misconceptions =
    mentorContext.misconceptions || [];

  const prompt = `
You are PyBe, an adaptive Python learning mentor.

Analyze the learner's current reasoning using:

1. Current session
2. Relevant previous sessions
3. Learner profile
4. Adaptive mentoring strategy
5. Adaptive difficulty level

CURRENT SCENARIO:
${JSON.stringify(
  mentorContext.scenario,
  null,
  2
)}

CURRENT LEARNER REASONING:
${mentorContext.learnerReasoning || '(none)'}

CURRENT PYTHON CONCEPTS:
${JSON.stringify(
  mentorContext.abstractionMap || [],
  null,
  2
)}

CURRENT MISCONCEPTIONS:
${JSON.stringify(
  misconceptions,
  null,
  2
)}

CURRENT PROMPT SCORE:
${mentorContext.promptEvaluation?.score || 0}

RELEVANT PREVIOUS LEARNER SESSIONS:
${JSON.stringify(
  history,
  null,
  2
)}

LEARNER PROFILE:
${JSON.stringify(
  profile,
  null,
  2
)}

ADAPTIVE MENTORING STRATEGY:
${JSON.stringify(
  strategy,
  null,
  2
)}

ADAPTIVE DIFFICULTY:
${JSON.stringify(
  difficulty,
  null,
  2
)}

ADAPTIVE STRATEGY RULES:

REMEDIATE:
Focus on correcting a recurring misconception
and use a corrective question.

EXPLAIN:
Clarify the missing idea with a simple
explanation before asking the next question.

CHALLENGE:
The learner is performing strongly.
Ask a deeper application question instead
of repeating a basic explanation.

ENCOURAGE:
Reinforce supported progress and ask a
slightly more advanced question.

ADAPTIVE DIFFICULTY RULES:

FOUNDATION:
Focus on core understanding and use a
simple question.

INTERMEDIATE:
Ask the learner to apply the concept in a
slightly different situation.

ADVANCED:
Ask a deeper application or reasoning question.

The selected strategy and difficulty MUST
directly control the NEXT QUESTION.

QUESTION RULES:

REMEDIATE + FOUNDATION:
Ask a corrective question about the exact
misconception. Do not introduce a new concept.

EXPLAIN + FOUNDATION:
Ask a simple concept-check question using
the current scenario.

EXPLAIN + INTERMEDIATE:
Ask the learner to apply the current concept
to a slightly different input.

ENCOURAGE + FOUNDATION:
Ask a simple question that confirms the learner
understands the current concept.

ENCOURAGE + INTERMEDIATE:
Ask a slightly deeper application question.

CHALLENGE + INTERMEDIATE:
Ask a new application or comparison question.

CHALLENGE + ADVANCED:
Ask a deeper reasoning question involving
edge cases, alternative approaches, or tradeoffs.

Never ask a question unrelated to the current
scenario.

Never introduce a new Python concept unless
the current scenario requires it.

The NEXT QUESTION must be answerable using
the concepts in the current scenario.

GENERAL INSTRUCTIONS:

- Identify what the learner currently understands.
- Identify ONE specific gap or misconception.
- Connect it to the relevant Python concept.
- Use previous sessions only when supported by the data.
- Use the learner profile to personalize the response.
- If a misconception appears repeatedly, target it.
- If there is evidence of improvement, mention it.
- Never invent learner history.
- Never claim improvement without evidence.
- Do not confuse concepts between scenarios.
- Follow the selected adaptive strategy.
- Follow the selected adaptive difficulty.
- Ask exactly ONE question that targets the learner's current gap.
- Do not give away the answer.
- Keep the response under 180 words.
- Do not add extra headings.
- Do not change the required format.

Use exactly this format:

UNDERSTOOD:
...

GAP:
...

PYTHON CONNECTION:
...

HISTORY CONNECTION:
...

LEARNER PROFILE INSIGHT:
...

NEXT QUESTION:
...
`;

  const models = [
    'gemini-3.7-flash',
    'gemini-3.6-flash'
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(
        `Trying Gemini model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt
        });

      console.log(
        `Gemini response received from: ${model}`
      );

      const mentorResponse =
        response.text;

      if (
        validateMentorResponse(
          mentorResponse
        )
      ) {
        return mentorResponse;
      }

      console.error(
        `Gemini returned an invalid mentor response from ${model}`
      );

    } catch (error) {
      lastError = error;

      console.error(
        `Gemini model ${model} failed:`,
        error.status,
        error.message
      );
    }
  }

  console.error(
    'All Gemini mentor models failed:',
    lastError
  );

  const fallbackQuestion =
    strategy.mode === 'REMEDIATE'
      ? 'What rule would you use to decide when the current longest pencil should be replaced?'
      : strategy.mode === 'CHALLENGE'
        ? 'What would happen if two pencils had the same maximum length?'
        : strategy.mode === 'EXPLAIN'
          ? 'Why do you need to compare each pencil with the current longest pencil?'
          : 'What should the program do when it finds a pencil longer than the current longest one?';

  const fallbackGap =
    misconceptions.length > 0
      ? misconceptions[0]
      : 'The reasoning needs a clearer decision rule.';

  const conceptNames =
    (mentorContext.abstractionMap || [])
      .map(
        (item) =>
          item.pythonConcept
      )
      .join(', ') ||
    'the current Python concept';

  return `
UNDERSTOOD:
You identified the main Python idea needed to solve the current scenario.

GAP:
${fallbackGap}

PYTHON CONNECTION:
Your reasoning maps to ${conceptNames}.

HISTORY CONNECTION:
${
  history.length > 0
    ? 'Previous relevant learner sessions were considered.'
    : 'No strongly relevant previous session was available for this scenario.'
}

LEARNER PROFILE INSIGHT:
The learner has an average prompt score of ${
    profile.averagePromptScore || 0
  } based on available sessions.

NEXT QUESTION:
${fallbackQuestion}
`;
}

module.exports = {
  generateMentorResponse
};