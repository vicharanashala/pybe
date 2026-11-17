/* ==========================================================================
   SCENE 5 — PREDICT: Will hot chai brew today?
   Verb: predict · Sarchu (14,070 FT)
   Mental model: else runs ONLY if zero exceptions occurred
   ========================================================================== */

function mountPredictInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let currentDayIdx = 0;
  const days = data.days;
  const TOTAL_DAYS = days.length;
  let correctPredictions = 0;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'PREDICT: WILL CHAI BREW TODAY?';
  dock.appendChild(title);

  // Card container
  const card = document.createElement('div');
  card.style.cssText = `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--c-border);
    border-radius: 10px;
    padding: 0.8rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: center;
    text-align: center;
  `;

  // Day indicator
  const dayPill = document.createElement('div');
  dayPill.style.cssText = `
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--c-gold);
    letter-spacing: 0.08em;
  `;

  // Scenario description
  const scenarioDesc = document.createElement('div');
  scenarioDesc.style.cssText = 'font-size: 0.95rem; font-weight: 700; color: #fff;';

  // Question prompt
  const promptText = document.createElement('div');
  promptText.style.cssText = 'font-size: 0.8rem; color: var(--c-text-muted);';
  promptText.textContent = 'If try finishes with this outcome, does the else: (Chai) block execute?';

  // Button row
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display: flex; gap: 0.8rem; margin-top: 0.2rem;';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'nav-btn';
  yesBtn.style.cssText = 'padding: 0.5rem 1.2rem; font-size: 0.85rem; border-color: rgba(245, 158, 11, 0.4) !important;';
  yesBtn.innerHTML = '☕ YES (Brew Chai)';

  const noBtn = document.createElement('button');
  noBtn.className = 'nav-btn';
  noBtn.style.cssText = 'padding: 0.5rem 1.2rem; font-size: 0.85rem; border-color: rgba(239, 68, 68, 0.4) !important;';
  noBtn.innerHTML = '✖ NO (Skip Chai)';

  btnRow.appendChild(yesBtn);
  btnRow.appendChild(noBtn);

  // Result display
  const resultArea = document.createElement('div');
  resultArea.style.cssText = 'min-height: 24px; font-size: 0.8rem; font-weight: 600;';

  card.appendChild(dayPill);
  card.appendChild(scenarioDesc);
  card.appendChild(promptText);
  card.appendChild(btnRow);
  card.appendChild(resultArea);
  dock.appendChild(card);
  container.appendChild(dock);

  function renderDay() {
    const day = days[currentDayIdx];
    dayPill.textContent = `SCENARIO ${currentDayIdx + 1} OF ${TOTAL_DAYS}`;
    scenarioDesc.textContent = `Trail outcome: "${day.label}"`;
    resultArea.textContent = '';
    yesBtn.disabled = false;
    noBtn.disabled = false;
  }

  function handleGuess(userSaidYes) {
    const day = days[currentDayIdx];
    const actual = day.chaiEarned;
    yesBtn.disabled = true;
    noBtn.disabled = true;

    if (userSaidYes === actual) {
      correctPredictions++;
      if (typeof playCorrectChime === 'function') playCorrectChime();

      if (actual) {
        resultArea.innerHTML = '<span style="color: var(--c-else);">✓ Correct! Clean run earns hot chai (else: runs).</span>';
        // Light the else lamp temporarily or permanently
        const lamp = document.querySelector('.lamp[data-stage="else"]');
        if (lamp) lamp.classList.add('lit', 'just-lit');
      } else {
        resultArea.innerHTML = '<span style="color: var(--c-finally);">✓ Correct! An error occurred and was handled, so else: is skipped.</span>';
      }

      setTimeout(() => {
        currentDayIdx++;
        if (currentDayIdx < TOTAL_DAYS) {
          renderDay();
        } else {
          showFeedback(container, 'else: mental model mastered! Chai only brews on clean runs.', 'success', 3500);
          onComplete();
        }
      }, 1600);
    } else {
      if (typeof playErrorThud === 'function') playErrorThud();
      if (actual) {
        resultArea.innerHTML = '<span style="color: var(--c-except);">✖ Clean crossing had no errors — chai DOES brew!</span>';
      } else {
        resultArea.innerHTML = '<span style="color: var(--c-except);">✖ A fix fired! else: NEVER runs after an except block.</span>';
      }

      setTimeout(() => {
        yesBtn.disabled = false;
        noBtn.disabled = false;
      }, 1800);
    }
  }

  yesBtn.addEventListener('click', () => handleGuess(true));
  noBtn.addEventListener('click', () => handleGuess(false));

  renderDay();
}
