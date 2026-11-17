let currentStep = 1;
const totalSteps = 22;

function updateStepUI() {
  // Hide all steps
  document.querySelectorAll('.step-card').forEach(card => {
    card.classList.remove('active');
  });

  // Show active step
  const activeCard = document.querySelector(`.step-card[data-step="${currentStep}"]`);
  if (activeCard) {
    activeCard.classList.add('active');
  }

  // Update progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
  }

  // Update step counter text
  const stepCounter = document.getElementById('stepCounter');
  if (stepCounter) {
    if (currentStep <= 4) {
      stepCounter.textContent = `Graphic Novel (Scene ${currentStep} of 4)`;
    } else if (currentStep === 5) {
      stepCounter.textContent = `Story Complete`;
    } else if (currentStep === 6) {
      stepCounter.textContent = `Notice — Worker Comparison`;
    } else if (currentStep === 7) {
      stepCounter.textContent = `Notice — Pattern Breakdown`;
    } else if (currentStep === 8) {
      stepCounter.textContent = `Generalize — Everyday Examples`;
    } else if (currentStep === 9) {
      stepCounter.textContent = `Discover — Condition Concept`;
    } else if (currentStep === 10) {
      stepCounter.textContent = `Python Bridge`;
    } else if (currentStep === 11) {
      stepCounter.textContent = `Recreating Birbal's Rule`;
    } else if (currentStep === 12) {
      stepCounter.textContent = `Introducing "if"`;
    } else if (currentStep === 13) {
      stepCounter.textContent = `Introducing "else"`;
    } else if (currentStep === 14) {
      stepCounter.textContent = `Interactive Simulation`;
    } else if (currentStep === 15) {
      stepCounter.textContent = `Reflection`;
    } else if (currentStep === 16) {
      stepCounter.textContent = `Story to Python Mapping`;
    } else if (currentStep === 17) {
      stepCounter.textContent = `Transfer — College Event`;
    } else if (currentStep === 18) {
      stepCounter.textContent = `Transfer — Recognize Pattern`;
    } else if (currentStep === 19) {
      stepCounter.textContent = `Transfer — Complete Code`;
    } else if (currentStep === 20) {
      stepCounter.textContent = `Transfer — Predict Outcome`;
    } else if (currentStep === 21) {
      stepCounter.textContent = `Final Reflection`;
    } else if (currentStep === 22) {
      stepCounter.textContent = `Final Concept Summary`;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStepUI();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepUI();
  }
}

function restartModule() {
  currentStep = 1;
  updateStepUI();
}

// Phase 2 Step 2: Compare Workers answer checking
function checkAnswerPhase2(buttonEl, isCorrect) {
  const allOptionBtns = document.querySelectorAll('#optionsGridPhase2 .option-btn');
  
  if (isCorrect) {
    buttonEl.classList.add('correct');
    buttonEl.classList.remove('wrong');
    
    allOptionBtns.forEach(btn => {
      if (btn !== buttonEl) btn.disabled = true;
    });

    const revealBox = document.getElementById('revealBoxPhase2');
    if (revealBox) {
      revealBox.classList.remove('hidden');
    }

    const btnNext = document.getElementById('btnStep6Next');
    if (btnNext) {
      btnNext.disabled = false;
    }
  } else {
    buttonEl.classList.add('wrong');
  }
}

// Phase 3 Step 3: Experimenting with IF only
function setIfOnlyCondition(isTrue) {
  const btnTrue = document.getElementById('ifOnlyTrueBtn');
  const btnFalse = document.getElementById('ifOnlyFalseBtn');
  const valSpan = document.getElementById('ifOnlyVal');
  const outputSpan = document.getElementById('ifOnlyOutput');

  if (isTrue) {
    btnTrue.classList.add('active');
    btnFalse.classList.remove('active');
    if (valSpan) valSpan.textContent = 'True';
    if (outputSpan) {
      outputSpan.textContent = '"Give the reward"';
      outputSpan.style.color = '#89AB78';
    }
  } else {
    btnFalse.classList.add('active');
    btnTrue.classList.remove('active');
    if (valSpan) valSpan.textContent = 'False';
    if (outputSpan) {
      outputSpan.textContent = '(no output — condition is False!)';
      outputSpan.style.color = '#A89685';
    }
  }
}

// Phase 3 Step 5: Try Birbal's Rule Interactive Simulation
function setSimScenario(isTrue) {
  const btnA = document.getElementById('scenarioABtn');
  const btnB = document.getElementById('scenarioBBtn');
  const simVal = document.getElementById('simVal');
  const simBadge = document.getElementById('simScenarioBadge');
  const simOutput = document.getElementById('simOutput');

  if (isTrue) {
    btnA.classList.add('active');
    btnB.classList.remove('active');
    if (simVal) simVal.textContent = 'True';
    if (simBadge) simBadge.textContent = 'finished_before_sunset = True';
    if (simOutput) {
      simOutput.textContent = '"Give the reward"';
      simOutput.style.color = '#89AB78';
    }
  } else {
    btnB.classList.add('active');
    btnA.classList.remove('active');
    if (simVal) simVal.textContent = 'False';
    if (simBadge) simBadge.textContent = 'finished_before_sunset = False';
    if (simOutput) {
      simOutput.textContent = '"No reward"';
      simOutput.style.color = '#C86B4F';
    }
  }
}

// Phase 4 Step 2: Recognize Pattern Answer Checking
function checkAnswerPhase4Step2(buttonEl, isCorrect) {
  const allBtns = document.querySelectorAll('#optionsGridPhase4Step2 .option-btn');
  const revealBox = document.getElementById('revealBoxPhase4Step2');
  const btnNext = document.getElementById('btnStep18Next');

  if (isCorrect) {
    buttonEl.classList.add('correct');
    buttonEl.classList.remove('wrong');

    allBtns.forEach(btn => {
      if (btn !== buttonEl) btn.disabled = true;
    });

    if (revealBox) revealBox.classList.remove('hidden');
    if (btnNext) btnNext.disabled = false;
  } else {
    buttonEl.classList.add('wrong');
  }
}

// Phase 4 Step 3: Complete Code Answer Checking
function checkAnswerPhase4Step3(buttonEl, isCorrect) {
  const allBtns = document.querySelectorAll('#optionsGridPhase4Step3 .option-btn');
  const blankSlot = document.getElementById('blankSlot');
  const revealBox = document.getElementById('revealBoxPhase4Step3');
  const btnNext = document.getElementById('btnStep19Next');

  if (isCorrect) {
    buttonEl.classList.add('correct');
    buttonEl.classList.remove('wrong');

    allBtns.forEach(btn => {
      if (btn !== buttonEl) btn.disabled = true;
    });

    if (blankSlot) {
      blankSlot.textContent = 'has_id';
      blankSlot.classList.add('filled');
    }

    if (revealBox) revealBox.classList.remove('hidden');
    if (btnNext) btnNext.disabled = false;
  } else {
    buttonEl.classList.add('wrong');
  }
}

// Phase 4 Step 4: Predict Outcome Answer Checking
function checkAnswerPhase4Step4(buttonEl, isCorrect) {
  const allBtns = document.querySelectorAll('#optionsGridPhase4Step4 .option-btn');
  const revealBox = document.getElementById('revealBoxPhase4Step4');
  const btnNext = document.getElementById('btnStep20Next');

  if (isCorrect) {
    buttonEl.classList.add('correct');
    buttonEl.classList.remove('wrong');

    allBtns.forEach(btn => {
      if (btn !== buttonEl) btn.disabled = true;
    });

    if (revealBox) revealBox.classList.remove('hidden');
    if (btnNext) btnNext.disabled = false;
  } else {
    buttonEl.classList.add('wrong');
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateStepUI();
});
