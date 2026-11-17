/* ==========================================================================
   SCENE 4 — WIRE: Wire incoming hazards to matching handler lanes
   Verb: wire · Baralacha La (16,040 FT)
   Anti-pattern busted: Bare except masks real bugs
   ========================================================================== */

function mountWireInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  // State
  let remainingHazards = [...data.hazards];
  let wiredCount = 0;
  const TOTAL_HAZARDS = data.hazards.length;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'WIRE SPECIFIC EXCEPTION HANDLERS';
  dock.appendChild(title);

  // Main container: Hazards tray (Left) + Handler Lanes (Right)
  const wireLayout = document.createElement('div');
  wireLayout.style.cssText = `
    display: flex;
    gap: 0.8rem;
    align-items: stretch;
    justify-content: space-between;
  `;

  // Left column: Hazards tray
  const hazardCol = document.createElement('div');
  hazardCol.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  `;
  const hazardHeader = document.createElement('div');
  hazardHeader.style.cssText = 'font-size: 0.65rem; font-weight: 700; color: var(--c-text-muted); text-transform: uppercase;';
  hazardHeader.textContent = `Incoming Trail Hazards (${TOTAL_HAZARDS})`;
  hazardCol.appendChild(hazardHeader);

  const hazardTray = document.createElement('div');
  hazardTray.id = 'wire-hazard-tray';
  hazardTray.style.cssText = 'display: flex; flex-direction: column; gap: 0.3rem;';
  hazardCol.appendChild(hazardTray);

  // Right column: Handler Lanes
  const laneCol = document.createElement('div');
  laneCol.style.cssText = `
    flex: 1.2;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  `;
  const laneHeader = document.createElement('div');
  laneHeader.style.cssText = 'font-size: 0.65rem; font-weight: 700; color: var(--c-text-muted); text-transform: uppercase;';
  laneHeader.textContent = 'Handler Lanes';
  laneCol.appendChild(laneHeader);

  const laneList = document.createElement('div');
  laneList.style.cssText = 'display: flex; flex-direction: column; gap: 0.35rem;';

  // Create lanes
  data.lanes.forEach(lane => {
    const laneBox = document.createElement('div');
    laneBox.className = 'drop-zone';
    laneBox.dataset.laneId = lane.id;
    laneBox.style.cssText = `
      min-height: 48px;
      padding: 0.4rem 0.6rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1.5px dashed ${lane.id === 'hammer' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.3)'};
      background: ${lane.id === 'hammer' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(56, 189, 248, 0.05)'};
      transition: all 0.2s ease;
    `;

    const labelSpan = document.createElement('span');
    labelSpan.style.cssText = `
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 600;
      color: ${lane.id === 'hammer' ? '#f87171' : 'var(--c-try)'};
    `;
    labelSpan.textContent = lane.label;

    const countSpan = document.createElement('span');
    countSpan.className = 'lane-count';
    countSpan.style.cssText = 'font-size: 0.65rem; color: var(--c-text-dim);';
    countSpan.textContent = lane.id === 'hammer' ? '⚠️ DANGER' : '0 wired';

    laneBox.appendChild(labelSpan);
    laneBox.appendChild(countSpan);

    DragKit.makeDropZone(laneBox, { label: lane.label, data: lane });
    laneList.appendChild(laneBox);
  });
  laneCol.appendChild(laneList);

  wireLayout.appendChild(hazardCol);
  wireLayout.appendChild(laneCol);
  dock.appendChild(wireLayout);
  container.appendChild(dock);

  function renderHazards() {
    hazardTray.innerHTML = '';
    remainingHazards.forEach(h => {
      const el = document.createElement('div');
      el.className = 'drag-item';
      el.style.cssText = 'font-size: 0.75rem; padding: 0.35rem 0.6rem; width: 100%; justify-content: flex-start;';
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>${h.label}</span>
      `;
      el.dataset.hazardId = h.id;
      DragKit.makeDraggable(el, { type: 'hazard', data: h });
      hazardTray.appendChild(el);
    });

    if (remainingHazards.length === 0) {
      hazardTray.innerHTML = '<div style="font-size: 0.75rem; color: var(--c-finally); padding: 0.5rem 0;">✓ All trail hazards handled!</div>';
    }
  }

  renderHazards();

  // Drop callback
  DragKit.onDrop((srcEl, targetEl, srcData, targetData) => {
    if (!srcData || !targetData) return;

    if (targetData.id === 'hammer') {
      showFeedback(container, 'Hammer masked failure! Never swing blind hammers.', 'error');
      if (typeof playErrorThud === 'function') playErrorThud();
      targetEl.style.animation = 'wrongShake 0.4s ease-out';
      setTimeout(() => { targetEl.style.animation = ''; }, 400);
      return;
    }

    if (srcData.type === targetData.accepts) {
      // Correct wire
      wiredCount++;
      remainingHazards = remainingHazards.filter(h => h.id !== srcData.id);
      renderHazards();

      const countEl = targetEl.querySelector('.lane-count');
      if (countEl) {
        const count = parseInt(targetEl.dataset.wiredCount || '0', 10) + 1;
        targetEl.dataset.wiredCount = count;
        countEl.textContent = `${count} wired ✓`;
        countEl.style.color = 'var(--c-finally)';
      }

      if (typeof playSnap === 'function') playSnap();
      showFeedback(container, `Wired to ${targetData.label}!`, 'success', 1500);

      if (wiredCount >= TOTAL_HAZARDS) {
        setTimeout(() => {
          showFeedback(container, 'All hazards wired to specific handlers! Clean engineering.', 'success', 3000);
          if (typeof playCorrectChime === 'function') playCorrectChime();
          onComplete();
        }, 300);
      }
    } else {
      // Wrong type
      showFeedback(container, `Type mismatch! ${srcData.label} needs matching handler.`, 'error');
      if (typeof playErrorThud === 'function') playErrorThud();
    }
  });
}
