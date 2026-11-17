/* ==========================================================================
   SCENE 4: UNLOAD — Baltoro Glacier (Subtract eaten rations from sled)
   ========================================================================== */
function mountUnloadInteraction(container, data, onComplete) {
  const currentSled = new Set(data.sled);
  const eatenSet = new Set(data.eaten);
  const unloaded = new Set();

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">🛷 Baltoro Moraine Sled Load</span>
        <span class="dock-hint">Ticker says: Tsampa and Biscuits were eaten. Drag or tap them off the sled!</span>
      </div>
      <div class="moraine-status-bar">
        <span>🥣 Consumed on trail: <strong>${data.eaten.join(', ')}</strong></span>
        <span>Remaining weight: <strong id="rem-count">${data.sled.length}</strong> items</span>
      </div>
      <div class="sled-dock">
        <div class="sled-crate-zone" id="sled-zone"></div>
      </div>
    </div>
  `;

  const sledZone = container.querySelector('#sled-zone');
  const remCount = container.querySelector('#rem-count');

  function renderSled() {
    sledZone.innerHTML = '';
    currentSled.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'gear-chip sled-item' + (eatenSet.has(item) ? ' eaten-warn' : '');
      chip.textContent = item;

      chip.onclick = () => {
        if (eatenSet.has(item)) {
          currentSled.delete(item);
          unloaded.add(item);
          remCount.textContent = currentSled.size;
          showFeedback(null, `Unloaded consumed "${item}".`, 'info');
          if (window.playSoftClick) playSoftClick();
          renderSled();

          if (unloaded.size >= eatenSet.size) {
            showFeedback(null, "Difference complete! Sled lightened to remaining load. Next unlocked.", "success", 4000);
            onComplete();
          }
        } else {
          showFeedback(null, `"${item}" was not eaten. Keep it on the sled!`, 'error');
          if (window.playErrorBeep) playErrorBeep();
          chip.classList.add('shake-anim');
          setTimeout(() => chip.classList.remove('shake-anim'), 500);
        }
      };
      sledZone.appendChild(chip);
    });
  }
  renderSled();
}
