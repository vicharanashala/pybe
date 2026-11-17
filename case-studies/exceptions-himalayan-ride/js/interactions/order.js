/* ==========================================================================
   SCENE 7 — ORDER: Assemble the 4 stages into Swati's notebook
   Verb: order · Morey Plains (15,400 FT)
   Mental model: try → except → else → finally is strictly ordered
   ========================================================================== */

function mountOrderInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  const correctOrder = data.correctOrder;
  const slotsState = [null, null, null, null];
  let unplacedStages = [...data.stages].sort(() => Math.random() - 0.5);

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = "SWATI'S NOTEBOOK: ASSEMBLE THE 4 STAGES";
  dock.appendChild(title);

  // Main container
  const orderWrap = document.createElement('div');
  orderWrap.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `;

  // 4 Slots
  const slotsContainer = document.createElement('div');
  slotsContainer.className = 'order-notebook';
  slotsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem;';

  const slotElements = [];
  for (let i = 0; i < 4; i++) {
    const slot = document.createElement('div');
    slot.className = 'order-slot';
    slot.dataset.slotIndex = i;
    slot.innerHTML = `<span class="slot-num">${i + 1}.</span> <span class="slot-placeholder" style="color: var(--c-text-dim); font-size: 0.7rem;">[Empty Slot]</span>`;
    DragKit.makeDropZone(slot, { label: `Slot ${i + 1}`, data: { slotIndex: i } });
    slotsContainer.appendChild(slot);
    slotElements.push(slot);
  }
  orderWrap.appendChild(slotsContainer);

  // Shuffled tiles tray
  const tilesTray = document.createElement('div');
  tilesTray.className = 'order-tiles';
  tilesTray.style.cssText = 'display: flex; gap: 0.4rem; justify-content: center; min-height: 40px;';
  orderWrap.appendChild(tilesTray);

  // Test Run button
  const runBtn = document.createElement('button');
  runBtn.className = 'ride-btn';
  runBtn.style.cssText = 'align-self: center; margin-top: 0.2rem;';
  runBtn.innerHTML = '▶ TEST RUN ROUTINE';
  orderWrap.appendChild(runBtn);

  dock.appendChild(orderWrap);
  container.appendChild(dock);

  function renderTiles() {
    tilesTray.innerHTML = '';
    unplacedStages.forEach(stage => {
      const tile = document.createElement('div');
      tile.className = 'drag-item';
      tile.style.cssText = `border-color: ${stage.color}; font-size: 0.75rem; padding: 0.35rem 0.6rem;`;
      tile.innerHTML = `<span>${getStageIcon(stage.id)}</span> <span>${stage.label} (${stage.id})</span>`;
      tile.dataset.stageId = stage.id;
      DragKit.makeDraggable(tile, { type: 'stage', data: stage });
      tilesTray.appendChild(tile);
    });
  }

  function getStageIcon(id) {
    if (id === 'try') return '🛣️';
    if (id === 'except') return '🔧';
    if (id === 'else') return '☕';
    if (id === 'finally') return '🏕️';
    return '📌';
  }

  renderTiles();

  // Drop callback
  DragKit.onDrop((srcEl, targetEl, srcData, targetData) => {
    if (!srcData || targetData?.slotIndex === undefined) return;
    const slotIdx = targetData.slotIndex;

    // If slot already occupied, return old item to unplaced
    if (slotsState[slotIdx]) {
      unplacedStages.push(slotsState[slotIdx]);
    }

    // Place new item
    slotsState[slotIdx] = srcData;
    unplacedStages = unplacedStages.filter(s => s.id !== srcData.id);

    // Update slot UI
    targetEl.classList.add('filled');
    targetEl.innerHTML = `
      <span class="slot-num">${slotIdx + 1}.</span>
      <span style="color: ${srcData.color}; font-weight: 700; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer;" title="Click to remove">
        ${getStageIcon(srcData.id)} ${srcData.id}:
      </span>
    `;

    // Click slot to remove
    targetEl.onclick = () => {
      if (!slotsState[slotIdx]) return;
      unplacedStages.push(slotsState[slotIdx]);
      slotsState[slotIdx] = null;
      targetEl.classList.remove('filled');
      targetEl.innerHTML = `<span class="slot-num">${slotIdx + 1}.</span> <span class="slot-placeholder" style="color: var(--c-text-dim); font-size: 0.7rem;">[Empty Slot]</span>`;
      targetEl.onclick = null;
      renderTiles();
      if (typeof playUiClick === 'function') playUiClick();
    };

    renderTiles();
    if (typeof playSnap === 'function') playSnap();
  });

  runBtn.addEventListener('click', () => {
    // Check if all slots filled
    if (slotsState.some(s => s === null)) {
      showFeedback(container, 'Fill all 4 slots before running the test!', 'error');
      if (typeof playErrorThud === 'function') playErrorThud();
      return;
    }

    const currentOrder = slotsState.map(s => s.id);
    const isCorrect = currentOrder.every((val, idx) => val === correctOrder[idx]);

    if (isCorrect) {
      showFeedback(container, 'Flawless order: try → except → else → finally!', 'success', 3500);
      if (typeof playCorrectChime === 'function') playCorrectChime();
      runBtn.disabled = true;
      runBtn.textContent = '✓ ROUTINE VALIDATED';
      runBtn.style.background = 'var(--c-finally)';
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      let msg = 'Absurd routine! Python enforces strict stage order.';
      if (currentOrder[0] === 'finally') {
        msg = 'Absurd! You pitched camp at the start line before riding!';
      } else if (currentOrder[0] === 'else') {
        msg = 'No chai before the ride! try must always come first.';
      } else if (currentOrder[1] === 'else') {
        msg = 'except must catch errors before else can celebrate clean runs.';
      }
      showFeedback(container, msg, 'error', 3000);
      if (typeof playErrorThud === 'function') playErrorThud();
    }
  });
}
