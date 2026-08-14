/* =========================================================
   navigation.js
   Wires Back/Next buttons + progress bar.
   Boots the whole app on DOMContentLoaded.
   ========================================================= */

(function () {

  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const progressTrack = document.getElementById("progress-track");
  const stepIndicator = document.getElementById("step-indicator");

  /* ---------------------------------------------------------
     Builds/refreshes the 9-segment progress bar.
     A segment is "completed" if its macroIndex is fully behind
     the current step's macroIndex, and "active" if it matches
     the current step's macroIndex (covers the 4 CT sub-steps
     all mapping to the same "Computational Thinking" segment).
     --------------------------------------------------------- */
  function renderProgressBar() {
    progressTrack.innerHTML = "";

    const currentStep = lessonEngine.getCurrentStep();
    const currentMacroIndex = currentStep.macroIndex;

    MACRO_STAGE_LABELS.forEach((label, index) => {
      const segment = document.createElement("div");
      segment.className = "progress-segment";
      segment.title = label;

      if (index < currentMacroIndex) {
        segment.classList.add("completed");
      } else if (index === currentMacroIndex) {
        segment.classList.add("active");
      }

      progressTrack.appendChild(segment);
    });
  }

  /* ---------------------------------------------------------
     Updates the "Step X of Y" text and the Back/Next button
     enabled/disabled state based on current engine state.
     --------------------------------------------------------- */
  function refreshControls() {
    const currentIndex = lessonEngine.getCurrentStepIndex();
    const total = lessonEngine.getTotalSteps();

    stepIndicator.textContent = `Step ${currentIndex + 1} of ${total}`;

    btnBack.disabled = lessonEngine.isFirstStep();

    if (lessonEngine.isLastStep()) {
      // On the final (Reflection) step, there is nothing further to
      // advance to, so the Next button is simply disabled/hidden.
      btnNext.disabled = true;
      btnNext.textContent = "🏁 End of Lesson";
    } else {
      btnNext.textContent = "Next →";
      btnNext.disabled = !lessonEngine.canGoNext();
    }
  }

  /* ---------------------------------------------------------
     Full refresh: re-render progress bar + controls.
     Does NOT re-render the card itself (that only happens on
     step change, not on every interaction).
     --------------------------------------------------------- */
  function refreshUI() {
    renderProgressBar();
    refreshControls();
  }

  /* ---------------------------------------------------------
     Renders whichever step is currently active, then refreshes
     the surrounding chrome (progress bar + buttons).
     --------------------------------------------------------- */
  function showCurrentStep() {
    const step = lessonEngine.getCurrentStep();
    renderer.renderStep(step);
    refreshUI();

    // Scroll the card into view on step change (useful on mobile
    // where the card can be taller than the viewport).
    document.getElementById("storybook-card").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  /* ---------------------------------------------------------
     BUTTON HANDLERS
     --------------------------------------------------------- */
  btnNext.addEventListener("click", () => {
    const advanced = lessonEngine.goNext();
    if (advanced) {
      showCurrentStep();
    }
  });

  btnBack.addEventListener("click", () => {
    const wentBack = lessonEngine.goBack();
    if (wentBack) {
      showCurrentStep();
    }
  });

  /* ---------------------------------------------------------
     Whenever renderer.js / codeEditor.js / assessment.js report
     that something changed (an option picked, code run, etc.),
     re-evaluate the Next button state WITHOUT re-rendering the
     card (so the learner doesn't lose their in-progress state).
     --------------------------------------------------------- */
  document.addEventListener("pybe:interaction", () => {
    refreshControls();
  });

  /* ---------------------------------------------------------
     BOOT THE APP
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    lessonEngine.init();
    showCurrentStep();
  });

})();