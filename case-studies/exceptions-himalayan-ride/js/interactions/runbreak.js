/* ==========================================================================
   SCENE 9 — RUN + BREAK: Live code tracer & shock injection
   Verb: runbreak · Tanglang La (17,480 FT)
   Mental model: Unhandled errors crash, finally runs regardless
   ========================================================================== */

function mountRunbreakInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let selectedScenario = 'clean';
  let hasRun = false;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'TANGLANG SUMMIT: RUN CODE AGAINST MOUNTAIN SHOCKS';
  dock.appendChild(title);

  // Layout: Code panel (Left) + Shocks & Terminal (Right)
  const layout = document.createElement('div');
  layout.style.cssText = `
    display: flex;
    gap: 0.8rem;
    align-items: stretch;
  `;

  // Left: Code panel
  const codeBox = document.createElement('div');
  codeBox.style.cssText = `
    flex: 1.2;
    background: rgba(8, 12, 24, 0.95);
    border: 1px solid var(--c-border);
    border-radius: 8px;
    padding: 0.5rem 0.7rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    line-height: 1.4;
    overflow-x: auto;
  `;

  function renderCodeLines() {
    codeBox.innerHTML = '';
    data.code.forEach((line, idx) => {
      const lineDiv = document.createElement('div');
      lineDiv.id = `code-line-${idx + 1}`;
      lineDiv.style.cssText = 'display: flex; gap: 0.5rem; transition: background 0.2s;';
      const numSpan = document.createElement('span');
      numSpan.style.cssText = 'color: var(--c-text-dim); user-select: none; width: 18px;';
      numSpan.textContent = String(idx + 1).padStart(2, '0');
      const textSpan = document.createElement('span');
      textSpan.textContent = line;
      if (line.includes('try:')) textSpan.style.color = 'var(--c-try)';
      else if (line.includes('except')) textSpan.style.color = 'var(--c-except)';
      else if (line.includes('else:')) textSpan.style.color = 'var(--c-else)';
      else if (line.includes('finally:')) textSpan.style.color = 'var(--c-finally)';
      else textSpan.style.color = 'var(--c-text)';

      lineDiv.appendChild(numSpan);
      lineDiv.appendChild(textSpan);
      codeBox.appendChild(lineDiv);
    });
  }
  renderCodeLines();

  // Right: Controls & Terminal
  const ctrlBox = document.createElement('div');
  ctrlBox.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  `;

  // Scenario buttons
  const scenRow = document.createElement('div');
  scenRow.style.cssText = 'display: flex; gap: 0.3rem; flex-wrap: wrap;';
  const scenarios = [
    { id: 'clean', label: '☀️ Clean' },
    { id: 'water', label: '🌊 Water' },
    { id: 'puncture', label: '🛞 Puncture' },
    { id: 'fuel', label: '⛽ Fuel Low' }
  ];

  scenarios.forEach(sc => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn';
    btn.style.cssText = `padding: 0.25rem 0.5rem; font-size: 0.7rem; ${sc.id === 'clean' ? 'border-color: var(--c-gold) !important;' : ''}`;
    btn.textContent = sc.label;
    btn.addEventListener('click', () => {
      selectedScenario = sc.id;
      scenRow.querySelectorAll('button').forEach(b => b.style.borderColor = '');
      btn.style.borderColor = 'var(--c-gold)';
      if (typeof playUiClick === 'function') playUiClick();
    });
    scenRow.appendChild(btn);
  });
  ctrlBox.appendChild(scenRow);

  // Run button
  const runBtn = document.createElement('button');
  runBtn.className = 'ride-btn';
  runBtn.style.cssText = 'width: 100%; font-size: 0.78rem; padding: 0.45rem;';
  runBtn.innerHTML = '▶ RUN DUG-DUG';
  ctrlBox.appendChild(runBtn);

  // Terminal output
  const term = document.createElement('div');
  term.style.cssText = `
    flex: 1;
    min-height: 60px;
    background: #020617;
    border: 1px solid var(--c-border);
    border-radius: 6px;
    padding: 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #4ade80;
    overflow-y: auto;
  `;
  term.textContent = '> Ready. Select shock and press Run.';
  ctrlBox.appendChild(term);

  layout.appendChild(codeBox);
  layout.appendChild(ctrlBox);
  dock.appendChild(layout);
  container.appendChild(dock);

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    term.textContent = `> Running scenario: ${selectedScenario}...`;
    if (typeof playBikeThump === 'function') playBikeThump();

    setTimeout(() => {
      if (selectedScenario === 'clean') {
        term.innerHTML = '> cross_stream() OK<br>> drink_hot_chai() [else]<br>> pitch_tent() [finally]<br><span style="color:#38bdf8;">✓ Clean run finished!</span>';
      } else if (selectedScenario === 'water') {
        term.innerHTML = '> cross_stream() -> WaterInEngineError!<br>> dry_spark_plug() [caught]<br>> pitch_tent() [finally]<br><span style="color:#f59e0b;">✓ Error caught, finally executed.</span>';
      } else if (selectedScenario === 'puncture') {
        term.innerHTML = '> cross_stream() -> FlatTyreError!<br>> plug_puncture() [caught]<br>> pitch_tent() [finally]<br><span style="color:#f59e0b;">✓ Error caught, finally executed.</span>';
      } else if (selectedScenario === 'fuel') {
        term.innerHTML = '> cross_stream() -> OutOfFuelError!<br>> No matching except!<br>> pitch_tent() [finally runs before crash!]<br><span style="color:#ef4444;">✖ Unhandled error!</span>';
      }

      runBtn.disabled = false;
      if (!hasRun) {
        hasRun = true;
        showFeedback(container, 'Summit run logged! try/except/else/finally in action.', 'success', 3500);
        if (typeof playCorrectChime === 'function') playCorrectChime();
        onComplete();
      }
    }, 400);
  });
}
