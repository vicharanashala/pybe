/* =========================================================
   navigation.js
   Wires Back/Next buttons + progress bar.
   Boots the whole app on DOMContentLoaded.

   Architecture parity with Krishanu's prototype (IIFE,
   CustomEvent('pybe:interaction') for state refresh). Uses
   our screen vocabulary (LESSON_SCREENS, screenIndex, etc.)
   instead of steps.
   ========================================================= */

(function () {

  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const progressTrack = document.getElementById('progress-track');
  const stepIndicator = document.getElementById('step-indicator');

  /* ---------------------------------------------------------
     Builds/refreshes the progress segments.
     Renders TOTAL_SCREENS segments (14 planned). The active
     segment pulses, completed segments are gold, the rest
     are parchment.
     --------------------------------------------------------- */
  function renderProgressBar() {
    progressTrack.innerHTML = '';

    const currentIndex = lessonEngine.getCurrentScreenIndex();
    const total = TOTAL_SCREENS;

    for (let i = 0; i < total; i++) {
      const segment = document.createElement('div');
      segment.className = 'progress-segment';
      const label = MACRO_STAGE_LABELS[i] || '...';
      segment.title = label + ' (' + (i + 1) + ' of ' + total + ')';

      if (i === currentIndex) {
        segment.classList.add('active');
      } else {
        const screen = lessonEngine.getScreenByIndex(i);
        if (screen && lessonEngine.isScreenComplete(screen.id)) {
          segment.classList.add('completed');
        }
      }

      progressTrack.appendChild(segment);
    }
  }

  /* ---------------------------------------------------------
     Updates the "Screen X of Y" text and the Back/Next button
     enabled/disabled state based on current engine state.
     --------------------------------------------------------- */
  function refreshControls() {
    const currentIndex = lessonEngine.getCurrentScreenIndex();
    const total = lessonEngine.getPlannedTotalScreens();

    stepIndicator.textContent =
      'Screen ' + (currentIndex + 1) + ' of ' + total;

    btnBack.disabled = lessonEngine.isFirstScreen();

    if (currentIndex >= total - 1) {
      btnNext.disabled = true;
      btnNext.textContent = '🏁 End of Lesson';
    } else {
      btnNext.textContent = 'Next →';
      btnNext.disabled = !lessonEngine.canGoNext();
    }
  }

  /* ---------------------------------------------------------
     Full refresh: re-render progress bar + controls.
     Does NOT re-render the card itself.
     --------------------------------------------------------- */
  function refreshUI() {
    renderProgressBar();
    refreshControls();
  }

  /* ---------------------------------------------------------
     Renders whichever screen is currently active, then refreshes
     the surrounding chrome (progress bar + buttons).
     --------------------------------------------------------- */
  function showCurrentScreen() {
    const screen = lessonEngine.getCurrentScreen();
    renderer.renderScreen(screen);
    refreshUI();

    document.getElementById('storybook-card').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  /* ---------------------------------------------------------
     BUTTON HANDLERS
     --------------------------------------------------------- */
  btnNext.addEventListener('click', () => {
    const advanced = lessonEngine.goNext();
    if (advanced) {
      showCurrentScreen();
    }
  });

  btnBack.addEventListener('click', () => {
    const wentBack = lessonEngine.goBack();
    if (wentBack) {
      showCurrentScreen();
    }
  });

  /* ---------------------------------------------------------
     Whenever something changes that affects whether Next is
     allowed, refresh the controls WITHOUT re-rendering the
     card (so the learner's pick and reveal are preserved).
     --------------------------------------------------------- */
  document.addEventListener('pybe:interaction', () => {
    refreshControls();
  });

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    lessonEngine.init();
    showCurrentScreen();
  });

})();
