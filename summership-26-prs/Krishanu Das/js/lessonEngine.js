/* =========================================================
   lessonEngine.js
   The "brain": tracks current step, validates progression.
   No DOM access here — pure state management.
   ========================================================= */

const lessonEngine = (function () {

  /* ---------------------------------------------------------
     INTERNAL STATE
     --------------------------------------------------------- */
  let currentStepIndex = 0;

  // Tracks whether the "minimum interaction" for a step is done.
  // Keyed by step id. e.g. { "story-questions": true, "interactive-coding": false }
  const stepCompletion = {};

  // Stores learner responses so they can be reused/inspected later
  // (e.g. which option was picked, what code was typed).
  const responses = {};

  /* ---------------------------------------------------------
     BASIC GETTERS
     --------------------------------------------------------- */
  function getCurrentStepIndex() {
    return currentStepIndex;
  }

  function getTotalSteps() {
    return LESSON_STEPS.length;
  }

  function getCurrentStep() {
    return LESSON_STEPS[currentStepIndex];
  }

  function getStepByIndex(index) {
    return LESSON_STEPS[index];
  }

  function isFirstStep() {
    return currentStepIndex === 0;
  }

  function isLastStep() {
    return currentStepIndex === LESSON_STEPS.length - 1;
  }

  /* ---------------------------------------------------------
     STEP TYPES THAT REQUIRE NO INTERACTION TO ADVANCE
     (story, CT explainer cards, concept discovery, mental
     model, python syntax, reflection intro paragraphs)
     These are auto-completed the moment they are viewed.
     --------------------------------------------------------- */
  const AUTO_COMPLETE_TYPES = ["story", "ct", "concept", "mental-model"];

  /* ---------------------------------------------------------
     COMPLETION TRACKING
     --------------------------------------------------------- */
  function markStepComplete(stepId) {
    stepCompletion[stepId] = true;
  }

  function markStepIncomplete(stepId) {
    stepCompletion[stepId] = false;
  }

  function isStepComplete(stepId) {
    return !!stepCompletion[stepId];
  }

  // Called whenever a step is rendered/entered, to auto-complete
  // steps that don't require explicit interaction.
  function evaluateAutoCompletion(step) {
    if (AUTO_COMPLETE_TYPES.includes(step.type)) {
      markStepComplete(step.id);
    }
  }

  /* ---------------------------------------------------------
     RESPONSE TRACKING
     Used by assessment.js / codeEditor.js to store what the
     learner selected/typed, keyed by step id.
     --------------------------------------------------------- */
  function saveResponse(stepId, value) {
    responses[stepId] = value;
  }

  function getResponse(stepId) {
    return responses[stepId];
  }

  /* ---------------------------------------------------------
     NAVIGATION
     --------------------------------------------------------- */
  function canGoNext() {
    const step = getCurrentStep();
    return isStepComplete(step.id);
  }

  function goNext() {
    if (!canGoNext()) {
      return false;
    }
    if (isLastStep()) {
      return false;
    }
    currentStepIndex += 1;
    evaluateAutoCompletion(getCurrentStep());
    return true;
  }

  function goBack() {
    if (isFirstStep()) {
      return false;
    }
    currentStepIndex -= 1;
    return true;
  }

  /* ---------------------------------------------------------
     INIT
     Auto-complete the very first step if applicable
     (e.g. the Story step needs no interaction).
     --------------------------------------------------------- */
  function init() {
    currentStepIndex = 0;
    evaluateAutoCompletion(getCurrentStep());
  }

  /* ---------------------------------------------------------
     PUBLIC API
     --------------------------------------------------------- */
  return {
    init,
    getCurrentStepIndex,
    getTotalSteps,
    getCurrentStep,
    getStepByIndex,
    isFirstStep,
    isLastStep,
    markStepComplete,
    markStepIncomplete,
    isStepComplete,
    saveResponse,
    getResponse,
    canGoNext,
    goNext,
    goBack
  };

})();