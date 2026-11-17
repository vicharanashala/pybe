/* ==========================================================================
   SCENE 10: RUN — Finale Line Tracer & Canvas Certificate
   ========================================================================== */
function mountRunInteraction(container, data, onComplete) {
  let currentLine = 0;
  let notesCollected = 0;

  container.innerHTML = `
    <div class="interaction-dock finale-dock">
      <div class="dock-header">
        <span class="dock-title">🏆 Expedition Return · Full Python Program</span>
        <span class="dock-hint">Step through the 8-line program, collect your trail notes, and issue your summit credential.</span>
      </div>
      <div class="run-tracer-layout">
        <div class="code-tracer-box">
          <div class="tracer-toolbar">
            <button class="ride-btn" id="btn-step-run">▶ Step Line</button>
            <span class="tracer-status" id="tracer-status">Ready</span>
          </div>
          <div class="tracer-lines" id="tracer-lines">
            ${data.lines.map(l => `
              <div class="tracer-row" id="t-row-${l.num}">
                <span class="row-num">${l.num}</span>
                <code class="row-code">${l.text}</code>
                <span class="row-result" id="t-res-${l.num}"></span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="trail-notes-box">
          <div class="notes-title">📌 Trail Notes (Tap to Collect):</div>
          <div class="notes-list" id="notes-list">
            ${data.trailNotes.map((n, idx) => `
              <button class="trail-note-btn" id="note-btn-${idx}">
                <span class="note-bullet">○</span> ${n}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      <div id="certificate-slot"></div>
    </div>
  `;

  const stepBtn = container.querySelector('#btn-step-run');
  const statusEl = container.querySelector('#tracer-status');
  const certSlot = container.querySelector('#certificate-slot');

  stepBtn.onclick = () => {
    if (currentLine < data.lines.length) {
      currentLine++;
      const row = container.querySelector(`#t-row-${currentLine}`);
      const res = container.querySelector(`#t-res-${currentLine}`);
      if (row) row.classList.add('active-line');
      if (res) res.textContent = `→ ${data.lines[currentLine - 1].result}`;
      statusEl.textContent = `Executed line ${currentLine} of ${data.lines.length}`;
      if (window.playSoftClick) playSoftClick();

      if (currentLine >= data.lines.length) {
        stepBtn.disabled = true;
        stepBtn.textContent = "Program Complete ✓";
        statusEl.textContent = "All lines evaluated successfully!";
        checkFinish();
      }
    }
  };

  data.trailNotes.forEach((n, idx) => {
    const btn = container.querySelector(`#note-btn-${idx}`);
    btn.onclick = () => {
      if (!btn.classList.contains('collected')) {
        btn.classList.add('collected');
        btn.querySelector('.note-bullet').textContent = '●';
        notesCollected++;
        if (window.playSoftClick) playSoftClick();
        checkFinish();
      }
    };
  });

  function checkFinish() {
    if (currentLine >= data.lines.length && notesCollected >= data.trailNotes.length) {
      if (typeof renderCertificatePanel === 'function') {
        renderCertificatePanel(certSlot);
      }
      showFeedback(null, "Expedition complete! Summit certificate generated.", "success", 5000);
      onComplete();
    }
  }
}
