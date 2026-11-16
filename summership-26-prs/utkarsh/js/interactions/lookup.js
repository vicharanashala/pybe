/* ==========================================================================
   SCENE 6: LOOKUP — Camp 3 (Timed: Messy Sack vs Direct Pegboard)
   ========================================================================== */
function mountLookupInteraction(container, data, onComplete) {
  let round = 1;
  let sackItems = ["Batteries", "First Aid", "Headlamp", "Rope", "Piton", "Stove", "Carabiner", "Oxygen", "Spare Gloves", "Tape"];
  // Shuffle sack
  sackItems.sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">⚡ Camp 3 Ridge Blizzard Check</span>
        <span class="dock-hint" id="round-hint">Round 1: Search the dark messy rucksack for requested gear!</span>
      </div>
      <div class="query-prompt-bar">
        Pasang asks: <strong id="query-target" style="color:var(--c-gold); font-size:1.1rem;">"Oxygen?"</strong>
      </div>
      <div id="lookup-stage"></div>
      <div class="time-delta-report" id="time-report"></div>
    </div>
  `;

  const stage = container.querySelector('#lookup-stage');
  const targetEl = container.querySelector('#query-target');
  const hintEl = container.querySelector('#round-hint');
  const reportEl = container.querySelector('#time-report');

  let startTime = Date.now();
  let round1Time = 0;

  function startRound1() {
    stage.innerHTML = '<div class="messy-sack-grid" id="sack-grid"></div>';
    const grid = stage.querySelector('#sack-grid');
    startTime = Date.now();

    sackItems.forEach(name => {
      const b = document.createElement('button');
      b.className = 'gear-chip sack-chip';
      b.textContent = name;
      b.onclick = () => {
        if (name === "Oxygen") {
          round1Time = ((Date.now() - startTime) / 1000).toFixed(2);
          showFeedback(null, `Found Oxygen in ${round1Time}s after scanning!`, 'info');
          if (window.playSoftClick) playSoftClick();
          startRound2();
        } else {
          showFeedback(null, `That's ${name}, not Oxygen! Keep searching.`, 'error');
          if (window.playErrorBeep) playErrorBeep();
        }
      };
      grid.appendChild(b);
    });
  }

  function startRound2() {
    round = 2;
    hintEl.textContent = "Round 2: Now look at the labelled pegboard where every item has ONE hook!";
    targetEl.textContent = '"Oxygen?"';
    reportEl.innerHTML = `Rucksack linear search: <strong>${round1Time}s</strong>. Now test the pegboard:`;

    stage.innerHTML = '<div class="pegboard-grid" id="peg-grid"></div>';
    const grid = stage.querySelector('#peg-grid');
    startTime = Date.now();

    data.pegboard.forEach(name => {
      const peg = document.createElement('button');
      peg.className = 'peg-slot' + (name === "Oxygen" ? ' target-peg' : '');
      peg.innerHTML = `<span class="peg-hook">📍</span><span class="peg-name">${name}</span>`;
      peg.onclick = () => {
        if (name === "Oxygen") {
          const round2Time = ((Date.now() - startTime) / 1000).toFixed(2);
          reportEl.innerHTML = `Rucksack: <strong>${round1Time}s</strong> (slow scan) vs Pegboard: <strong>${round2Time}s</strong> (instant direct lookup)!`;
          showFeedback(null, `Instant! Membership lookup found Oxygen in ${round2Time}s. Next unlocked.`, 'success', 4000);
          if (window.playSoftClick) playSoftClick();
          onComplete();
        }
      };
      grid.appendChild(peg);
    });
  }

  startRound1();
}
