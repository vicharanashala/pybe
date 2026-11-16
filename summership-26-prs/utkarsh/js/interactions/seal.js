/* ==========================================================================
   SCENE 8: SEAL — K2 Summit (Immutable frozenset roster lock)
   ========================================================================== */
function mountSealInteraction(container, data, onComplete) {
  let isSealed = false;

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">🏔️ K2 Summit Log Seal (8,611 M)</span>
        <span class="dock-hint">Review summit party roster, then press SEAL ROSTER to lock it permanently.</span>
      </div>
      <div class="roster-box" id="roster-box">
        <div class="roster-title">Official Summit Registry:</div>
        <div class="roster-chips" id="roster-chips">
          ${data.climbers.map(c => `<span class="gear-chip packed">${c}</span>`).join('')}
        </div>
      </div>
      <div class="seal-action-row">
        <button class="btn-seal" id="btn-seal">🔒 SEAL ROSTER (frozenset)</button>
        <button class="btn-tamper" id="btn-tamper" style="display:none;">+ Add Imposter Climber</button>
      </div>
    </div>
  `;

  const btnSeal = container.querySelector('#btn-seal');
  const btnTamper = container.querySelector('#btn-tamper');
  const rosterBox = container.querySelector('#roster-box');

  btnSeal.onclick = () => {
    isSealed = true;
    btnSeal.disabled = true;
    btnSeal.textContent = "ROSTER IS IMMUTABLY SEALED 🔒";
    btnSeal.classList.add('sealed-success');
    rosterBox.classList.add('frozen-border');
    btnTamper.style.display = 'inline-block';

    showFeedback(null, "Summit roster sealed! The log cannot mutate. Next unlocked.", "success", 4000);
    if (window.playSoftClick) playSoftClick();
    onComplete();
  };

  btnTamper.onclick = () => {
    if (isSealed) {
      showFeedback(null, "Blocked! frozenset has no attribute 'add'. Record is immutable.", "error");
      if (window.playErrorBeep) playErrorBeep();
      rosterBox.classList.add('shake-anim');
      setTimeout(() => rosterBox.classList.remove('shake-anim'), 500);
    }
  };
}
