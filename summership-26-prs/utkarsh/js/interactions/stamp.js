/* ==========================================================================
   SCENE 3: STAMP — Skardu Checkpost (Stamp only items on both sheets)
   ========================================================================== */
function mountStampInteraction(container, data, onComplete) {
  const permitSet = new Set(data.permit);
  const requiredMatches = new Set(data.requiredMatches);
  const stamped = new Set();

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">🛂 Skardu Military Barrier Inspection</span>
        <span class="dock-hint">Stamp only cargo that appears on BOTH the permit and your cargo list!</span>
      </div>
      <div class="inspection-desk">
        <div class="sheet-box">
          <div class="sheet-title">📜 Authorized Government Permit</div>
          <ul class="sheet-list">
            ${data.permit.map(p => `<li>✓ ${p}</li>`).join('')}
          </ul>
        </div>
        <div class="sheet-box">
          <div class="sheet-title">📦 Carried Expedition Cargo (Tap to Stamp)</div>
          <div class="cargo-stamp-grid" id="cargo-grid"></div>
        </div>
      </div>
      <div class="stamp-status" id="stamp-status">
        Stamped: <span id="stamp-count">0</span> / ${data.requiredMatches.length} common items cleared
      </div>
    </div>
  `;

  const grid = container.querySelector('#cargo-grid');
  const countEl = container.querySelector('#stamp-count');

  data.cargo.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'stamp-card';
    btn.innerHTML = `<span class="card-label">${item}</span><span class="stamp-mark">STAMP</span>`;

    btn.onclick = () => {
      if (stamped.has(item)) return;

      if (permitSet.has(item)) {
        stamped.add(item);
        btn.classList.add('stamped-approved');
        btn.querySelector('.stamp-mark').textContent = 'APPROVED ✓';
        countEl.textContent = stamped.size;
        showFeedback(null, `Approved "${item}" (present on both sheets).`, 'success');
        if (window.playSoftClick) playSoftClick();

        if (stamped.size >= requiredMatches.size) {
          showFeedback(null, "Intersection verified! All authorized cargo cleared. Next unlocked.", "success", 4000);
          onComplete();
        }
      } else {
        btn.classList.add('shake-anim');
        setTimeout(() => btn.classList.remove('shake-anim'), 500);
        showFeedback(null, `Denied: "${item}" is not on the government permit!`, 'error');
        if (window.playErrorBeep) playErrorBeep();
      }
    };
    grid.appendChild(btn);
  });
}
