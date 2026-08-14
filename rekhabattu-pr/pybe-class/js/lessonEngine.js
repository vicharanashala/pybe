/* =========================================================
   lessonEngine.js
   The "brain": tracks current screen, validates progression,
   stores the learner's pick.
   No DOM access here — pure state management.

   Architecture parity with Krishanu's prototype: same shape
   (IIFE, getters + completion + responses + nav), with our
   vocabulary (screens, not steps) since this lesson has a
   different content sequence.
   ========================================================= */

const lessonEngine = (function () {

  /* ---------------------------------------------------------
     INTERNAL STATE
     --------------------------------------------------------- */
  let currentScreenIndex = 0;

  // Actual route taken through the lesson. This matters when a
  // learner's answer skips a branch: Back should return to the
  // screen they came from, not to a skipped screen.
  let navigationHistory = [0];

  // Tracks whether the "minimum interaction" for a screen is done.
  // Keyed by screen id. e.g. { "screen-1-a-flower": true }
  const screenCompletion = {};

  // Stores the learner's pick per screen so it can be reused/
  // inspected later (e.g. which option was picked).
  const responses = {};

  /* ---------------------------------------------------------
     BASIC GETTERS
     --------------------------------------------------------- */
  function getCurrentScreenIndex() {
    return currentScreenIndex;
  }

  function getTotalScreens() {
    return LESSON_SCREENS.length;
  }

  function getCurrentScreen() {
    const screen = LESSON_SCREENS[currentScreenIndex];
    if (screen) return screen;
    // Fallback for screens that haven't been authored yet.
    return {
      id: 'screen-' + (currentScreenIndex + 1) + '-placeholder',
      kind: 'placeholder',
      title: 'Screen ' + (currentScreenIndex + 1),
      eyebrow: 'Coming up',
      line: 'This page is still being written. Check back soon.',
    };
  }

  function isScreenAuthored(index) {
    return !!LESSON_SCREENS[index];
  }

  function getScreenByIndex(index) {
    return LESSON_SCREENS[index];
  }

  function isFirstScreen() {
    return currentScreenIndex === 0;
  }

  function isLastScreen() {
    return currentScreenIndex === LESSON_SCREENS.length - 1;
  }

  // Planned total uses TOTAL_SCREENS so navigation works while
  // LESSON_SCREENS is still being authored (right now only
  // SCREEN_1 exists out of 14 planned).
  function getPlannedTotalScreens() {
    return TOTAL_SCREENS;
  }

  /* ---------------------------------------------------------
     COMPLETION TRACKING
     --------------------------------------------------------- */
  function markScreenComplete(screenId) {
    screenCompletion[screenId] = true;
  }

  function markScreenIncomplete(screenId) {
    screenCompletion[screenId] = false;
  }

  function isScreenComplete(screenId) {
    return !!screenCompletion[screenId];
  }

  /* ---------------------------------------------------------
     RESPONSE TRACKING
     --------------------------------------------------------- */
  function saveResponse(screenId, value) {
    responses[screenId] = value;
  }

  function getResponse(screenId) {
    return responses[screenId];
  }

  /* ---------------------------------------------------------
     NAVIGATION
     --------------------------------------------------------- */
  function canGoNext() {
    const screen = getCurrentScreen();
    return isScreenComplete(screen.id);
  }

  function getNextScreenIndex() {
    const screen = getCurrentScreen();
    const response = getResponse(screen.id);
    const nextScreenId = screen.nextScreenIdByResponse &&
      screen.nextScreenIdByResponse[response];

    if (nextScreenId) {
      const routedIndex = LESSON_SCREENS.findIndex(
        (candidate) => candidate.id === nextScreenId,
      );
      if (routedIndex !== -1) return routedIndex;
    }
    return currentScreenIndex + 1;
  }

  function goNext() {
    if (!canGoNext()) return false;
    const plannedTotal = TOTAL_SCREENS;
    const nextScreenIndex = getNextScreenIndex();
    if (nextScreenIndex >= plannedTotal) return false;
    currentScreenIndex = nextScreenIndex;
    navigationHistory.push(currentScreenIndex);
    return true;
  }

  function goBack() {
    if (isFirstScreen()) return false;
    navigationHistory.pop();
    currentScreenIndex = navigationHistory[navigationHistory.length - 1];
    return true;
  }

  /* ---------------------------------------------------------
     INIT
     --------------------------------------------------------- */
  function init() {
    currentScreenIndex = 0;
    navigationHistory = [0];
  }

  /* ---------------------------------------------------------
     PUBLIC API
     --------------------------------------------------------- */
  return {
    init,
    getCurrentScreenIndex,
    getTotalScreens,
    getCurrentScreen,
    getScreenByIndex,
    getNextScreenIndex,
    isScreenAuthored,
    isFirstScreen,
    isLastScreen,
    getPlannedTotalScreens,
    markScreenComplete,
    markScreenIncomplete,
    isScreenComplete,
    saveResponse,
    getResponse,
    canGoNext,
    goNext,
    goBack,
  };

})();
