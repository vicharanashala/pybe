import { createLessonError, LessonErrorCodes } from '../errors';

/**
 * Screen 1 content — the Adder story.
 *
 * Four learner-paced scenes, told in order:
 *   1. "crying"      — Riya alone, struggling with addition.
 *   2. "arrival"     — Riya calls out; Adder appears and explains his
 *                       one job (adding exactly two numbers).
 *   3. "success"     — Riya hands Adder two paper slips (2 and 3).
 *                       This scene carries the lesson's one Screen-1
 *                       interaction: the learner, not the narration,
 *                       triggers Adder adding the numbers.
 *   4. "reassurance" — Adder hands back the sum and tells Riya she can
 *                       call him again anytime.
 *
 * No programming language appears anywhere in this object — Screen 1
 * is story only, by design (see docs/lessons/formal-specification.md).
 *
 * Each scene's `image`/`imageAlt` are optional — a scene with neither
 * renders text-only. This is deliberate: StoryScreen only ever renders
 * what a scene provides, so a future story (e.g. a Panchatantra lesson)
 * can supply its own illustrations without any change to StoryScreen
 * itself.
 *
 * `image` paths below point to the four real illustration files
 * copied into `client/public/assets/story/adder/` (scene-1.png
 * through scene-4.png) — verified by direct visual inspection against
 * each scene's actual content, not assumed from filenames.
 */
export const adderStory = {
  id: 'adder',
  title: 'Adder',
  scenes: [
    {
      id: 'crying',
      image: '/assets/story/adder/scene-1.png',
      imageAlt: 'Riya sitting at her desk, surrounded by crossed-out sums, looking upset.',
      lines: [
        'Riya hated maths. She could not even add two numbers without getting it wrong. Her notebook was full of crossed-out sums and crumpled paper. She put down her pencil and cried.',
      ],
      continueLabel: 'What happens next?',
    },
    {
      id: 'arrival',
      image: '/assets/story/adder/scene-2.png',
      imageAlt: 'A small purple dragon appearing in a swirl of smoke beside Riya\'s desk.',
      lines: [
        '"If only someone could help me... Adder!" she called out suddenly.',
        'Purple smoke swirled beside her desk. Riya jumped back. "Who are you? How did you get in my room?"',
        '"I\'m Adder," the little dragon said. "I heard you call me. I can add two numbers — give me two, and I\'ll give you their sum. But I can only add two numbers at a time, that\'s it."',
      ],
      continueLabel: 'Give Adder two numbers',
    },
    {
      id: 'success',
      image: '/assets/story/adder/scene-3.png',
      imageAlt: 'Riya handing two paper slips, marked 2 and 3, to Adder the dragon.',
      lines: [
        'Riya tore two paper slips and wrote 2 and 3 on them.',
        'She handed them to Adder.',
      ],
      interaction: {
        promptLabel: 'Hand Adder the two slips',
        values: [2, 3],
        processingLabel: 'Adder is adding…',
        resultLabel: '5',
      },
      continueLabel: 'Continue',
    },
    {
      id: 'reassurance',
      image: '/assets/story/adder/scene-4.png',
      imageAlt: 'Adder smiling and holding up a paper slip that reads 5, as Riya beams at her notebook, which now reads "SUCCESS!"',
      lines: [
        'Adder handed her a new paper slip. It read: 5.',
        '"That\'s your answer," he said, smiling.',
        'Riya grinned. "Thank you, Adder!"',
        '"Anytime," Adder said. "You can call me for help any number of times — today, tomorrow, whenever you need me. But I can only add two numbers at a time, that\'s it."',
        'And with a swirl of purple smoke, he was gone — ready to come back the moment she called him again.',
      ],
      continueLabel: 'What did I discover?',
    },
  ],
};

/**
 * Screen 2 content — five comprehension questions confirming the
 * learner understood the story before any code is introduced. No
 * programming language appears here either.
 */
export const adderQuestions = {
  lessonId: 'adder',
  questions: [
    {
      id: 'who-is-adder',
      prompt: 'Who is Adder?',
      options: [
        { id: 'adds-two', label: 'Someone who can add two numbers' },
        { id: 'subtracts', label: 'Someone who can subtract two numbers' },
        { id: 'adds-ten', label: 'Someone who can add ten numbers' },
        { id: 'cannot-add', label: "Someone who doesn't know how to add" },
      ],
      correctOptionId: 'adds-two',
      explanationCorrect:
        'Right — Adder’s whole job is adding exactly two numbers together.',
      explanationIncorrect:
        'Think back to what Adder told Riya he could do. It was one specific job, with two numbers.',
    },
    {
      id: 'ten-numbers',
      prompt: 'Can Adder add ten numbers at once?',
      options: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
      ],
      correctOptionId: 'no',
      explanationCorrect: 'Correct — Adder only ever works with two numbers at a time.',
      explanationIncorrect:
        'Remember what Adder said about how many numbers he needs — not ten, just two.',
    },
    {
      id: 'call-again',
      prompt: 'Can Riya call Adder more than once?',
      options: [
        { id: 'yes', label: 'Yes, any number of times' },
        { id: 'no', label: 'No, only once' },
      ],
      correctOptionId: 'yes',
      explanationCorrect:
        'Exactly — Adder told Riya she could call him anytime, as many times as she needs.',
      explanationIncorrect:
        'Think about what Adder said right before he disappeared. Was it a one-time offer?',
    },
    {
      id: 'what-adder-needs',
      prompt: 'What does Adder always need before he can help?',
      options: [
        { id: 'two-numbers', label: 'Two numbers' },
        { id: 'one-number', label: 'One number' },
        { id: 'ten-numbers', label: 'Ten numbers' },
        { id: 'a-calculator', label: 'A calculator' },
      ],
      correctOptionId: 'two-numbers',
      explanationCorrect: 'Right — every single time, Adder needs two numbers to start.',
      explanationIncorrect:
        'Think about what Riya handed to Adder on two small paper slips.',
    },
    {
      id: 'what-adder-returns',
      prompt: 'What does Adder give back?',
      options: [
        { id: 'sum', label: 'The sum of the two numbers' },
        { id: 'difference', label: 'The difference between the two numbers' },
        { id: 'nothing', label: 'Nothing at all' },
        { id: 'both-numbers', label: 'The same two numbers back' },
      ],
      correctOptionId: 'sum',
      explanationCorrect:
        'That’s it — Adder hands back one paper slip with the sum written on it.',
      explanationIncorrect:
        'Look at what was written on the paper slip Adder handed back to Riya.',
    },
  ],
};

/**
 * Screen 3 content — three Socratic prompts surfacing what Adder
 * always needs, what he always gives back, and that he can be reused.
 *
 * `acceptableKeywords` is a plain list of words/phrases a simple
 * case-insensitive substring check (added in a later step, alongside
 * the screen that renders this content) will look for in the
 * learner's typed reflection. No separate semantic-matching utility
 * is introduced for this — one lesson's three reflection prompts
 * don't justify it.
 */
export const adderDiscovery = {
  lessonId: 'adder',
  leadIn: 'Here’s what you discovered about Adder.',
  prompts: [
    {
      id: 'function-input',
      question: 'What did Adder always need before he could help?',
      hint: 'Think about what Riya handed him on the two paper slips.',
      acceptableKeywords: ['two numbers', 'two', 'numbers'],
      revealedAnswer: 'Two numbers',
      connectionText: 'You said this is what he always needs first: two numbers.',
    },
    {
      id: 'function-output',
      question: 'What did Adder always give back?',
      hint: 'Think about what was written on the paper slip he handed back.',
      acceptableKeywords: ['sum', 'total', 'answer', 'add'],
      revealedAnswer: 'Their sum',
      connectionText: 'You said this is what he always gives back: their sum.',
    },
    {
      id: 'function-reuse',
      question: 'Could Riya call Adder again another day?',
      hint: 'Remember what Adder said right before he disappeared.',
      acceptableKeywords: ['yes', 'again', 'anytime', 'any time', 'many'],
      revealedAnswer: 'Anytime, as many times as she needs',
      connectionText:
        'You said she could call him again like this: anytime, as many times as she needs.',
    },
  ],
};

/**
 * Screen 4 content — a short recap/explainer followed by exactly one
 * multiple-choice step that builds `adder(2, 3)`. Kept to one step and
 * multiple-choice options (not free text) so the lesson never depends
 * on parsing free-text code, matching the "keep syntax minimal" goal.
 */
export const adderPythonTranslation = {
  lessonId: 'adder',
  explainer: {
    recapText:
      'You already figured out what Adder needs, what he does, and what he gives back.',
    explanationText:
      'A function is something you can call by name. You give it what it needs, and it gives back what it promised — you can call it again anytime.',
    inputLabel: 'Two numbers',
    jobLabel: 'Adds them together',
    outputLabel: 'Their sum',
    reusabilityText: 'You can call adder() again anytime, with new numbers.',
  },
  introText: 'Now let’s call Adder in Python, giving him 2 and 3.',
  step: {
    id: 'call-adder',
    prompt: 'Which one correctly calls Adder with the numbers 2 and 3?',
    options: [
      { id: 'correct', label: 'adder(2, 3)' },
      { id: 'one-number', label: 'adder(2)' },
      { id: 'wrong-name', label: 'add(2, 3)' },
      { id: 'three-numbers', label: 'adder(2, 3, 4)' },
    ],
    correctOptionId: 'correct',
    hint: 'Adder always needs exactly two numbers, written inside the parentheses, separated by a comma.',
    revealedCode: 'adder(2, 3)',
  },
  finalCode: 'adder(2, 3)',
};

/**
 * Screen 5 content — the lesson's closing message. Deliberately does
 * not introduce anything new (per the "do not overload" principle):
 * it only confirms the concept name established during Discovery.
 */
export const adderSummary = {
  lessonId: 'adder',
  title: 'Nice work!',
  conceptName: 'The function',
  restartLabel: 'Try the story again',
};

/**
 * Validates that every content section above has the shape the
 * lesson screens (added in a later step) will rely on.
 *
 * Purpose:
 *   Fail loudly and specifically if this content file is ever edited
 *   into a broken shape, instead of failing later with a confusing
 *   rendering error inside a screen component that has no context
 *   about which piece of content was actually wrong.
 *
 * Inputs:
 *   None. Reads only the module-level content constants defined above
 *   in this file.
 *
 * Outputs:
 * @returns {true} if every section is present and well-formed. There
 *   is no partial-success return value — either everything is valid,
 *   or the function throws.
 *
 * Possible errors:
 * @throws {Error} A centralized lesson error created by
 *   `createLessonError()` (see `client/src/lessons/errors/index.js`):
 *     - `LessonErrorCodes.CONTENT_SECTION_MISSING` if an entire section
 *       (story, questions, discovery, pythonTranslation, or summary) is
 *       absent or empty.
 *     - `LessonErrorCodes.CONTENT_SHAPE_INVALID` if a section exists but
 *       a field a screen will depend on is missing or inconsistent.
 *   In both cases, `error.context` names the exact section (and, where
 *   applicable, the specific scene/question/prompt/step id) that
 *   failed, so the cause can be found without re-reading this whole
 *   function.
 *
 * Side effects:
 *   None. This function only reads the content above; it does not
 *   modify it or any external state.
 */
export function validateAdderContent() {
  if (!adderStory || !Array.isArray(adderStory.scenes) || adderStory.scenes.length === 0) {
    throw createLessonError(LessonErrorCodes.CONTENT_SECTION_MISSING, { section: 'story' });
  }
  adderStory.scenes.forEach((scene) => {
    if (!scene.id || !Array.isArray(scene.lines) || scene.lines.length === 0) {
      throw createLessonError(LessonErrorCodes.CONTENT_SHAPE_INVALID, {
        section: 'story',
        field: 'lines',
        sceneId: scene.id || '(missing id)',
      });
    }
  });

  if (
    !adderQuestions ||
    !Array.isArray(adderQuestions.questions) ||
    adderQuestions.questions.length === 0
  ) {
    throw createLessonError(LessonErrorCodes.CONTENT_SECTION_MISSING, { section: 'questions' });
  }
  adderQuestions.questions.forEach((question) => {
    const optionIds = (question.options || []).map((option) => option.id);
    const hasValidCorrectAnswer = optionIds.includes(question.correctOptionId);
    if (!question.id || !question.prompt || optionIds.length < 2 || !hasValidCorrectAnswer) {
      throw createLessonError(LessonErrorCodes.CONTENT_SHAPE_INVALID, {
        section: 'questions',
        field: 'correctOptionId',
        questionId: question.id || '(missing id)',
      });
    }
  });

  if (
    !adderDiscovery ||
    !Array.isArray(adderDiscovery.prompts) ||
    adderDiscovery.prompts.length === 0
  ) {
    throw createLessonError(LessonErrorCodes.CONTENT_SECTION_MISSING, { section: 'discovery' });
  }
  adderDiscovery.prompts.forEach((prompt) => {
    const hasKeywords =
      Array.isArray(prompt.acceptableKeywords) && prompt.acceptableKeywords.length > 0;
    if (!prompt.id || !prompt.question || !hasKeywords) {
      throw createLessonError(LessonErrorCodes.CONTENT_SHAPE_INVALID, {
        section: 'discovery',
        field: 'acceptableKeywords',
        promptId: prompt.id || '(missing id)',
      });
    }
  });

  if (!adderPythonTranslation || !adderPythonTranslation.step) {
    throw createLessonError(LessonErrorCodes.CONTENT_SECTION_MISSING, {
      section: 'pythonTranslation',
    });
  }
  const step = adderPythonTranslation.step;
  const stepOptionIds = (step.options || []).map((option) => option.id);
  const hasValidStepAnswer = stepOptionIds.includes(step.correctOptionId);
  if (!step.prompt || stepOptionIds.length < 2 || !hasValidStepAnswer) {
    throw createLessonError(LessonErrorCodes.CONTENT_SHAPE_INVALID, {
      section: 'pythonTranslation',
      field: 'correctOptionId',
      stepId: step.id || '(missing id)',
    });
  }

  if (!adderSummary || !adderSummary.title || !adderSummary.conceptName) {
    throw createLessonError(LessonErrorCodes.CONTENT_SECTION_MISSING, { section: 'summary' });
  }

  return true;
}

// Fail fast: run validation the moment this module loads, so a broken
// content file surfaces immediately during development or build,
// rather than later when a screen component tries to render it.
validateAdderContent();
