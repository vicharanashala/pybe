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

  // Tracks whether the minimum interaction for a step is done.
  // Keyed by step id, e.g. { "position-four": true }
  const stepCompletion = {};

  // Stores learner responses so later steps (or the summary)
  // can inspect what was selected/typed.
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

  function isFirstStep() {
    return currentStepIndex === 0;
  }

  function isLastStep() {
    return currentStepIndex === LESSON_STEPS.length - 1;
  }

  /* ---------------------------------------------------------
     COMPLETION TRACKING
     A step only unlocks "Next" once its interaction is solved
     (correct challenge answer, enough characters inspected,
     etc.) — this is set explicitly by interactions.js.
     --------------------------------------------------------- */
  function markStepComplete(stepId) {
    stepCompletion[stepId] = true;
  }

  function isStepComplete(stepId) {
    return !!stepCompletion[stepId];
  }

  /* ---------------------------------------------------------
     RESPONSE TRACKING
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
    if (!canGoNext() || isLastStep()) {
      return false;
    }
    currentStepIndex += 1;
    return true;
  }

  function goBack() {
    if (isFirstStep()) {
      return false;
    }
    currentStepIndex -= 1;
    return true;
  }

  function init() {
    currentStepIndex = 0;
  }

  /* ---------------------------------------------------------
     PUBLIC API
     --------------------------------------------------------- */
  return {
    init,
    getCurrentStepIndex,
    getTotalSteps,
    getCurrentStep,
    isFirstStep,
    isLastStep,
    markStepComplete,
    isStepComplete,
    saveResponse,
    getResponse,
    canGoNext,
    goNext,
    goBack
  };

})();
