/* ==========================================================================
   SCENE 2 — WRAP: Checklist crash + bracket the hazard zone
   Verb: wrap · Phase A: tick checklist, press RIDE, boulder crashes
   Phase B: drag bracket handles to wrap only the rockfall road segments
   ========================================================================== */

function mountWrapInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let phase = 'checklist'; // 'checklist' → 'boulder' → 'bracket'
  let checkedCount = 0;
  const TOTAL_CHECKS = data.checklistItems.length;

  // --- Title ---
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.id = 'wrap-title';
  title.textContent = 'PRE-RIDE CHECKLIST';
  dock.appendChild(title);

  // --- Phase A: Checklist ---
  const checklistWrap = document.createElement('div');
  checklistWrap.id = 'wrap-checklist-zone';

  const checklistRow = document.createElement('div');
  checklistRow.className = 'wrap-checklist';

  data.checklistItems.forEach((label, idx) => {
    const item = document.createElement('button');
    item.className = 'check-item';
    item.innerHTML = `<span class="check-box"></span><span>${label}</span>`;
    item.addEventListener('click', () => {
      if (item.classList.contains('checked')) return;
      item.classList.add('checked');
      checkedCount++;
      if (typeof playUiClick === 'function') playUiClick();
      rideBtn.disabled = checkedCount < TOTAL_CHECKS;
    });
    checklistRow.appendChild(item);
  });
  checklistWrap.appendChild(checklistRow);

  const rideBtn = document.createElement('button');
  rideBtn.className = 'ride-btn';
  rideBtn.textContent = '🏍️ RIDE';
  rideBtn.disabled = true;
  rideBtn.addEventListener('click', () => {
    if (phase !== 'checklist') return;
    phase = 'boulder';
    triggerBoulderCrash();
  });
  checklistWrap.appendChild(rideBtn);
  dock.appendChild(checklistWrap);

  // --- Phase B: Road Strip + Brackets (initially hidden) ---
  const bracketZone = document.createElement('div');
  bracketZone.id = 'wrap-bracket-zone';
  bracketZone.style.display = 'none';

  const bracketTitle = document.createElement('div');
  bracketTitle.className = 'interaction-title';
  bracketTitle.textContent = 'WRAP ONLY THE HAZARD';
  bracketTitle.style.marginBottom = '0.3rem';
  bracketZone.appendChild(bracketTitle);

  const roadStrip = document.createElement('div');
  roadStrip.className = 'road-strip';
  roadStrip.style.position = 'relative';

  const segEls = [];
  data.roadSegments.forEach((seg, idx) => {
    const segEl = document.createElement('div');
    segEl.className = `road-seg ${seg.type}`;
    segEl.textContent = seg.label;
    segEl.dataset.idx = idx;
    roadStrip.appendChild(segEl);
    segEls.push(segEl);
  });

  // Bracket handles
  const leftHandle = document.createElement('div');
  leftHandle.className = 'bracket-handle';
  leftHandle.style.left = '0';
  leftHandle.setAttribute('tabindex', '0');
  leftHandle.setAttribute('aria-label', 'Left bracket handle');

  const rightHandle = document.createElement('div');
  rightHandle.className = 'bracket-handle';
  rightHandle.style.right = '0';
  rightHandle.setAttribute('tabindex', '0');
  rightHandle.setAttribute('aria-label', 'Right bracket handle');

  const tryLabel = document.createElement('div');
  tryLabel.className = 'try-bracket-label';
  tryLabel.textContent = 'try:';
  tryLabel.style.left = '50%';
  tryLabel.style.transform = 'translateX(-50%)';

  roadStrip.appendChild(leftHandle);
  roadStrip.appendChild(rightHandle);
  roadStrip.appendChild(tryLabel);

  // Bracket state
  let bracketLeft = 0;
  let bracketRight = data.roadSegments.length - 1;

  function updateBracketVisual() {
    const totalSegs = data.roadSegments.length;
    const segWidth = 100 / totalSegs;
    const leftPct = bracketLeft * segWidth;
    const rightPct = (bracketRight + 1) * segWidth;

    leftHandle.style.left = `calc(${leftPct}% - 6px)`;
    rightHandle.style.left = `calc(${rightPct}% - 6px)`;

    // Highlight wrapped segments
    segEls.forEach((el, idx) => {
      el.classList.remove('wrapped');
      if (idx >= bracketLeft && idx <= bracketRight) {
        el.classList.add('wrapped');
      }
    });

    tryLabel.style.left = `${(leftPct + rightPct) / 2}%`;
  }

  // Handle dragging for bracket handles
  function setupBracketDrag(handle, isLeft) {
    let dragging = false;
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dragging = true;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const rect = roadStrip.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const segWidth = rect.width / data.roadSegments.length;
      let idx = Math.floor(x / segWidth);
      idx = Math.max(0, Math.min(data.roadSegments.length - 1, idx));

      if (isLeft) {
        bracketLeft = Math.min(idx, bracketRight);
      } else {
        bracketRight = Math.max(idx, bracketLeft);
      }
      updateBracketVisual();
    });
    handle.addEventListener('pointerup', () => {
      dragging = false;
      checkBracket();
    });

    // Keyboard
    handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        if (isLeft) bracketLeft = Math.max(0, bracketLeft - 1);
        else bracketRight = Math.max(bracketLeft, bracketRight - 1);
        updateBracketVisual();
        checkBracket();
      } else if (e.key === 'ArrowRight') {
        if (isLeft) bracketLeft = Math.min(bracketRight, bracketLeft + 1);
        else bracketRight = Math.min(data.roadSegments.length - 1, bracketRight + 1);
        updateBracketVisual();
        checkBracket();
      }
    });
  }
  setupBracketDrag(leftHandle, true);
  setupBracketDrag(rightHandle, false);

  let bracketSolved = false;
  function checkBracket() {
    if (bracketSolved) return;
    const [correctL, correctR] = data.correctWrapRange;
    if (bracketLeft === correctL && bracketRight === correctR) {
      bracketSolved = true;
      showFeedback(container, 'try wraps only the hazard zone. Protected!', 'success');
      if (typeof playCorrectChime === 'function') playCorrectChime();
      onComplete();
      lightLamp('try');
    }
  }

  bracketZone.appendChild(roadStrip);

  // Confirm button for bracket
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'ride-btn';
  confirmBtn.textContent = '✓ CONFIRM BRACKET';
  confirmBtn.style.marginTop = '0.4rem';
  confirmBtn.addEventListener('click', () => {
    if (!bracketSolved) {
      showFeedback(container, 'Not quite! Wrap only the rockfall segments.', 'error');
      if (typeof playErrorThud === 'function') playErrorThud();
    }
  });
  bracketZone.appendChild(confirmBtn);

  dock.appendChild(bracketZone);
  container.appendChild(dock);

  // --- Boulder Crash Transition ---
  function triggerBoulderCrash() {
    if (typeof playErrorThud === 'function') playErrorThud();

    // Show boulder overlay on the stage
    const overlay = document.createElement('div');
    overlay.className = 'boulder-crash';
    overlay.innerHTML = `
      <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="var(--c-except)" stroke-width="3" stroke-linecap="round">
        <circle cx="40" cy="40" r="28" fill="rgba(239,68,68,0.15)"/>
        <path d="M25 50 L35 25 L55 30 L60 55 L40 58 Z" fill="rgba(239,68,68,0.2)" stroke="var(--c-except)"/>
        <line x1="20" y1="20" x2="60" y2="60" stroke-width="4"/>
        <line x1="60" y1="20" x2="20" y2="60" stroke-width="4"/>
      </svg>
      <div class="crash-text">BOULDER! No checkbox prevented this.</div>
    `;
    container.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      // Transition to Phase B
      checklistWrap.style.display = 'none';
      bracketZone.style.display = 'block';
      bracketZone.classList.add('fade-in');
      title.textContent = 'WRAP THE HAZARD ZONE';
      updateBracketVisual();
    }, 2000);
  }
}
