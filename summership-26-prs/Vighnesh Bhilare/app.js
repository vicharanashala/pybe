// The Smart Factory: Interactive Learning Engine
// Author: Vighnesh Bhilare

let currentStep = 1;
const totalSteps = 6;

// Simulator State
let currentPartId = 0;
const maxPartsInBatch = 10;
let shippedCount = 0;
let isGeneratorExhausted = false;

// Step Navigation
function navigateToStep(stepNumber) {
  if (stepNumber < 1 || stepNumber > totalSteps) return;

  // Update tabs
  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.step) === stepNumber);
  });

  // Update sections
  document.querySelectorAll('.lesson-step').forEach(section => {
    section.classList.remove('active');
  });

  const activeSection = document.getElementById(`step-${stepNumber}`);
  if (activeSection) {
    activeSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  currentStep = stepNumber;
}

// Stepper navigation click listeners
document.getElementById('stepperNav').addEventListener('click', (e) => {
  if (e.target.classList.contains('step-btn')) {
    const targetStep = parseInt(e.target.dataset.step);
    navigateToStep(targetStep);
  }
});

// Socratic Quiz in Step 2
function checkAnswer(buttonEl, isCorrect, explanation) {
  const container = buttonEl.parentElement;
  container.querySelectorAll('.quiz-btn').forEach(b => {
    b.classList.remove('correct', 'wrong');
  });

  const feedbackEl = document.getElementById('feedback-2');
  feedbackEl.classList.add('show');

  if (isCorrect) {
    buttonEl.classList.add('correct');
    feedbackEl.style.background = 'rgba(16, 185, 129, 0.15)';
    feedbackEl.style.border = '1px solid #10b981';
    feedbackEl.style.color = '#34d399';
    feedbackEl.innerHTML = `<strong>Correct Diagnosis!</strong> ${explanation}`;
    document.getElementById('next-btn-2').disabled = false;
  } else {
    buttonEl.classList.add('wrong');
    feedbackEl.style.background = 'rgba(239, 68, 68, 0.15)';
    feedbackEl.style.border = '1px solid #ef4444';
    feedbackEl.style.color = '#f87171';
    feedbackEl.innerHTML = `<strong>Diagnostic Clue:</strong> ${explanation}`;
  }
}

// Simulator Functions (Step 4)
function stepGenerator() {
  if (isGeneratorExhausted) {
    alert("The parts hopper is completely empty. The generator has raised StopIteration! Click 'Reset Stream' to restart.");
    return;
  }

  currentPartId++;
  
  if (currentPartId <= maxPartsInBatch) {
    // 1. Highlight line 3 & 4 (yield)
    highlightCodeLine(4);

    // 2. Trigger Laser Sensor
    const laser = document.getElementById('laser-beam');
    laser.classList.add('active');
    setTimeout(() => laser.classList.remove('active'), 350);

    // 3. Calculate simulated telemetry
    const vib = (120.0 + (currentPartId % 5) * 1.4).toFixed(1);
    const isDefect = parseFloat(vib) > 124.0;

    // 4. Update UI displays
    document.getElementById('active-bearing').textContent = `#${currentPartId}`;
    document.getElementById('metric-id').textContent = `Bearing-QC-${currentPartId.toString().padStart(3, '0')}`;
    document.getElementById('metric-vib').textContent = `${vib} Hz`;
    
    const verdictEl = document.getElementById('metric-verdict');
    if (isDefect) {
      verdictEl.textContent = "DEFECT (High Vibration)";
      verdictEl.style.color = "#ef4444";
    } else {
      verdictEl.textContent = "PASSED (Optimal)";
      verdictEl.style.color = "#10b981";
    }

    // 5. Update counts
    shippedCount++;
    document.getElementById('hopper-count').textContent = `${maxPartsInBatch - currentPartId} parts remaining`;
    document.getElementById('shipped-count').textContent = `${shippedCount} items`;

    // 6. Update Generator state monitor
    document.getElementById('gen-state').textContent = "SUSPENDED AT YIELD (Paused state)";
    document.getElementById('gen-state').style.color = "#f59e0b";
    document.getElementById('var-part-id').textContent = currentPartId;
    document.getElementById('consumer-val').textContent = `(${currentPartId}, ${vib} Hz)`;

    // Bearing bounce animation
    const bearingDisc = document.getElementById('active-bearing');
    bearingDisc.style.transform = 'scale(1.15)';
    setTimeout(() => {
      bearingDisc.style.transform = 'scale(1.0)';
    }, 200);

  } else {
    // Generator Exhaustion -> StopIteration
    isGeneratorExhausted = true;
    highlightCodeLine(6);

    document.getElementById('shift-status').textContent = "SHIFT FINISHED (StopIteration)";
    document.getElementById('shift-status').className = "status-badge stopped";

    document.getElementById('active-bearing').textContent = "EMPTY";
    document.getElementById('active-bearing').style.background = "#334155";
    document.getElementById('active-bearing').style.color = "#94a3b8";

    document.getElementById('gen-state').textContent = "EXHAUSTED (StopIteration raised)";
    document.getElementById('gen-state').style.color = "#ef4444";

    document.getElementById('metric-verdict').textContent = "End of Stream";
    document.getElementById('metric-verdict').style.color = "#94a3b8";
  }
}

function highlightCodeLine(lineNum) {
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`line-${i}`);
    if (el) el.classList.remove('active-line');
  }
  const target = document.getElementById(`line-${lineNum}`);
  if (target) target.classList.add('active-line');
}

function resetSimulator() {
  currentPartId = 0;
  shippedCount = 0;
  isGeneratorExhausted = false;

  document.getElementById('hopper-count').textContent = `${maxPartsInBatch} parts remaining`;
  document.getElementById('shipped-count').textContent = "0 items";
  document.getElementById('shift-status').textContent = "READY";
  document.getElementById('shift-status').className = "status-badge live";

  document.getElementById('active-bearing').textContent = "READY";
  document.getElementById('active-bearing').style.background = "radial-gradient(circle, #94a3b8 30%, #475569 80%)";
  document.getElementById('active-bearing').style.color = "#0f172a";

  document.getElementById('metric-id').textContent = "—";
  document.getElementById('metric-vib').textContent = "—";
  document.getElementById('metric-verdict').textContent = "—";
  document.getElementById('gen-state').textContent = "Waiting for next()";
  document.getElementById('gen-state').style.color = "#38bdf8";
  document.getElementById('var-part-id').textContent = "0";
  document.getElementById('consumer-val').textContent = "None";

  highlightCodeLine(1);
}

// Certification Challenge (Step 6)
let q1Answered = false;
let q2Answered = false;

function gradeCert(qNum, isCorrect, btnEl) {
  const parent = btnEl.parentElement;
  parent.querySelectorAll('.quiz-btn').forEach(b => {
    b.classList.remove('correct', 'wrong');
  });

  if (isCorrect) {
    btnEl.classList.add('correct');
    if (qNum === 1) q1Answered = true;
    if (qNum === 2) q2Answered = true;
  } else {
    btnEl.classList.add('wrong');
    if (qNum === 1) q1Answered = false;
    if (qNum === 2) q2Answered = false;
  }

  // Check if both correct to unlock certificate
  if (q1Answered && q2Answered) {
    const certBox = document.getElementById('certificate-box');
    certBox.style.display = 'block';
    certBox.scrollIntoView({ behavior: 'smooth' });
  }
}
