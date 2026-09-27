/* =========================================================
   navigation.js
   Progress bar, footer Back/Next buttons, and app boot.
   ========================================================= */

const navigation = (function () {

  const progressTrack = document.getElementById('progress-track');
  const stepIndicator = document.getElementById('step-indicator');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');

  function buildProgressSegments() {
    progressTrack.innerHTML = MACRO_STAGE_LABELS.map((label, i) => (
      `<div class="progress-segment" data-index="${i}" title="${label}"></div>`
    )).join('');
  }

  function updateProgress() {
    const step = lessonEngine.getCurrentStep();
    const segments = progressTrack.querySelectorAll('.progress-segment');
    segments.forEach((seg) => {
      const idx = Number(seg.dataset.index);
      seg.classList.remove('is-complete', 'is-current');
      if (idx < step.macroIndex) seg.classList.add('is-complete');
      if (idx === step.macroIndex) seg.classList.add('is-current');
    });

    stepIndicator.textContent = `Stage ${step.macroIndex + 1} of ${MACRO_STAGE_LABELS.length} · ${MACRO_STAGE_LABELS[step.macroIndex]}`;
  }

  function refreshButtons() {
    btnBack.disabled = lessonEngine.isFirstStep();
    btnNext.disabled = !lessonEngine.canGoNext();
    btnNext.textContent = lessonEngine.isLastStep() ? 'Finish Journey' : 'Next →';
  }

  function goToCurrentStep() {
    renderer.renderStep();
    updateProgress();
    refreshButtons();
  }

  function handleNext() {
    if (lessonEngine.isLastStep()) {
      // Final step: no further stage to move to. Buttons stay disabled;
      // the completion message is already shown by the assessment step.
      btnNext.disabled = true;
      return;
    }
    if (lessonEngine.goNext()) {
      goToCurrentStep();
    }
  }

  function handleBack() {
    if (lessonEngine.goBack()) {
      goToCurrentStep();
    }
  }

  function init() {
    buildProgressSegments();
    lessonEngine.init();
    btnBack.addEventListener('click', handleBack);
    btnNext.addEventListener('click', handleNext);
    goToCurrentStep();
  }

  return { init, refreshButtons };

})();

navigation.init();
