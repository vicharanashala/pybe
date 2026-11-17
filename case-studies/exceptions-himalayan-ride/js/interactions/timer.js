/* ==========================================================================
   SCENE 6 — TIMER: Beat the Cold (Sub-zero night approaches)
   Verb: timer · Pang (15,280 FT)
   Mental model: finally runs unconditionally — even on crash
   ========================================================================== */

function mountTimerInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let timerActive = true;
  let timerDisabled = false;
  let remainingMs = (data.durationSec || 10) * 1000;
  const startTemp = 5;
  const freezeTemp = data.freezeTemp || -10;
  let currentTemp = startTemp;
  let intervalId = null;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'BEAT THE COLD: FINALLY ALWAYS RUNS';
  dock.appendChild(title);

  // Main layout
  const timerLayout = document.createElement('div');
  timerLayout.style.cssText = `
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--c-border);
    border-radius: 10px;
    padding: 0.6rem 0.9rem;
  `;

  // Left: Flow diagram (all outcomes converge on Tent)
  const flowWrap = document.createElement('div');
  flowWrap.style.cssText = 'flex: 1.2; display: flex; flex-direction: column; gap: 0.3rem;';

  const flowTitle = document.createElement('div');
  flowTitle.style.cssText = 'font-size: 0.65rem; font-weight: 700; color: var(--c-text-muted); text-transform: uppercase;';
  flowTitle.textContent = 'Execution Paths → All Merge to finally:';
  flowWrap.appendChild(flowTitle);

  const flowList = document.createElement('div');
  flowList.style.cssText = 'display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.72rem;';
  data.nights.forEach(n => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; align-items: center; gap: 0.4rem; color: #94a3b8;';
    row.innerHTML = `<span style="font-family: var(--font-mono); color: var(--c-text);">${n.label}</span> <span>⟶</span> <span style="color: var(--c-finally); font-weight: 600;">Pitch Tent</span>`;
    flowList.appendChild(row);
  });
  flowWrap.appendChild(flowList);

  // Right: Thermometer gauge + Pitch button
  const actionWrap = document.createElement('div');
  actionWrap.style.cssText = 'flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.4rem;';

  const tempDisplay = document.createElement('div');
  tempDisplay.style.cssText = 'font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: #38bdf8;';
  tempDisplay.textContent = `${currentTemp}°C`;

  const tentBtn = document.createElement('button');
  tentBtn.className = 'ride-btn';
  tentBtn.style.cssText = 'background: var(--c-finally); color: #022c22; font-size: 0.82rem; padding: 0.5rem 1rem; width: 100%;';
  tentBtn.innerHTML = '🏕️ PITCH TENT NOW (finally)';

  // Accessibility toggle
  const a11yLabel = document.createElement('label');
  a11yLabel.style.cssText = 'display: flex; align-items: center; gap: 0.35rem; font-size: 0.65rem; color: var(--c-text-dim); cursor: pointer;';
  const a11yCheck = document.createElement('input');
  a11yCheck.type = 'checkbox';
  a11yCheck.addEventListener('change', (e) => {
    timerDisabled = e.target.checked;
    if (timerDisabled && intervalId) {
      clearInterval(intervalId);
      tempDisplay.textContent = `${freezeTemp}°C (Timer Paused)`;
    }
  });
  a11yLabel.appendChild(a11yCheck);
  a11yLabel.appendChild(document.createTextNode('Disable Timer (a11y)'));

  actionWrap.appendChild(tempDisplay);
  actionWrap.appendChild(tentBtn);
  actionWrap.appendChild(a11yLabel);

  timerLayout.appendChild(flowWrap);
  timerLayout.appendChild(actionWrap);
  dock.appendChild(timerLayout);
  container.appendChild(dock);

  function pitchCamp() {
    if (!timerActive) return;
    timerActive = false;
    if (intervalId) clearInterval(intervalId);

    tentBtn.disabled = true;
    tentBtn.innerHTML = '🏕️ CAMP PITCHED! (finally executed)';
    tentBtn.style.opacity = '0.9';

    // Light up finally lamp
    const lamp = document.querySelector('.lamp[data-stage="finally"]');
    if (lamp) lamp.classList.add('lit', 'just-lit');

    if (typeof playLampOn === 'function') playLampOn();
    if (typeof playCorrectChime === 'function') playCorrectChime();

    showFeedback(container, 'Camp pitched! finally always executes, no matter what.', 'success', 3500);
    setTimeout(() => {
      onComplete();
    }, 1200);
  }

  tentBtn.addEventListener('click', pitchCamp);

  // Keyboard shortcut Space
  const keyHandler = (e) => {
    if (e.code === 'Space' && timerActive) {
      e.preventDefault();
      pitchCamp();
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Countdown timer
  const startTime = Date.now();
  const totalDuration = data.durationSec * 1000;

  intervalId = setInterval(() => {
    if (timerDisabled) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / totalDuration);
    currentTemp = Math.round(startTemp + progress * (freezeTemp - startTemp));
    tempDisplay.textContent = `${currentTemp}°C`;

    if (progress >= 1) {
      clearInterval(intervalId);
      // Auto-pitch camp before hypothermia
      pitchCamp();
    }
  }, 100);
}
