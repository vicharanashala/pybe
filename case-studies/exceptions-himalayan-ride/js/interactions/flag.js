/* ==========================================================================
   SCENE 11 — PLACE THE FLAG: Sound the alarm when fuel runs dry
   Verb: flag · Shey (11,500 FT)
   Mental model: raise signals intentional exceptions when conditions fail
   ========================================================================== */

function mountFlagInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let flagPlaced = false;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'PLACE THE RAISE FLAG ON THE RIGHT LINE';
  dock.appendChild(title);

  // Layout: Draggable flag + Code block
  const layout = document.createElement('div');
  layout.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';

  // Draggable Flag Tray
  const flagTray = document.createElement('div');
  flagTray.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 38px;';

  const flagItem = document.createElement('div');
  flagItem.className = 'drag-item';
  flagItem.style.cssText = 'border-color: #ef4444; background: rgba(239, 68, 68, 0.15); font-family: var(--font-mono); font-size: 0.72rem;';
  flagItem.innerHTML = `<span>🚩</span> <span>${data.raiseStatement}</span>`;
  DragKit.makeDraggable(flagItem, { type: 'flag', data: { statement: data.raiseStatement } });
  flagTray.appendChild(flagItem);
  layout.appendChild(flagTray);

  // Code Block
  const codeCard = document.createElement('div');
  codeCard.style.cssText = `
    background: rgba(8, 12, 24, 0.95);
    border: 1px solid var(--c-border);
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.6;
  `;

  codeCard.innerHTML = `
    <div><span style="color: #c084fc;">def</span> <span style="color: #60a5fa;">check_fuel</span>(litres):</div>
    <div style="padding-left: 1.2rem;"><span style="color: #c084fc;">if</span> litres &lt;= <span style="color: #f59e0b;">0</span>:</div>
    <div id="slot-1" class="drop-zone" style="margin-left: 2.4rem; min-height: 32px; padding: 0.2rem 0.5rem; font-size: 0.7rem;">[DROP FLAG HERE: Candidate 1]</div>
    <div style="padding-left: 1.2rem;">litres -= <span style="color: #f59e0b;">10</span></div>
    <div id="slot-2" class="drop-zone" style="margin-left: 1.2rem; min-height: 32px; padding: 0.2rem 0.5rem; font-size: 0.7rem;">[DROP FLAG HERE: Candidate 2]</div>
    <div style="padding-left: 1.2rem;"><span style="color: #c084fc;">return</span> <span style="color: #4ade80;">'Cruising'</span></div>
  `;

  layout.appendChild(codeCard);
  dock.appendChild(layout);
  container.appendChild(dock);

  const slot1 = codeCard.querySelector('#slot-1');
  const slot2 = codeCard.querySelector('#slot-2');

  DragKit.makeDropZone(slot1, { label: 'Slot 1', data: { slotIdx: 0 } });
  DragKit.makeDropZone(slot2, { label: 'Slot 2', data: { slotIdx: 1 } });

  DragKit.onDrop((srcEl, targetEl, srcData, targetData) => {
    if (!srcData || targetData?.slotIdx === undefined || flagPlaced) return;

    if (targetData.slotIdx === data.correctSlot) {
      flagPlaced = true;
      targetEl.classList.add('filled');
      targetEl.style.borderColor = 'var(--c-finally)';
      targetEl.style.background = 'rgba(34, 197, 94, 0.1)';
      targetEl.innerHTML = `<span style="color: #ef4444; font-weight:700;">🚩 ${data.raiseStatement}</span>`;
      flagItem.remove();

      showFeedback(container, 'Tested: 0L raises alarm, 15L cruises cleanly! raise mastered.', 'success', 3500);
      if (typeof playCorrectChime === 'function') playCorrectChime();
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      showFeedback(container, 'Candidate 2 runs on EVERY ride! Alarm must fire only when litres <= 0.', 'error');
      if (typeof playErrorThud === 'function') playErrorThud();
    }
  });
}
