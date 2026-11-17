/* ==========================================================================
   SCENE 12 — COLLECT: Master Himalayan Credential
   Verb: collect · Leh Arrival (11,562 FT)
   Assembles earned trail notes into final credential & replay launcher
   ========================================================================== */

function mountCollectInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';
  dock.style.maxHeight = '85vh';
  dock.style.overflowY = 'auto';

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'HIMALAYAN EXPEDITION CREDENTIAL CONQUERED';
  dock.appendChild(title);

  // Earned Trail Notes chips
  const notesRow = document.createElement('div');
  notesRow.style.cssText = 'display: flex; gap: 0.4rem; justify-content: center; flex-wrap: wrap; margin-bottom: 0.4rem;';

  const stages = [
    { name: 'try:', color: 'var(--c-try)' },
    { name: 'except SpecificError:', color: 'var(--c-except)' },
    { name: 'else:', color: 'var(--c-else)' },
    { name: 'finally:', color: 'var(--c-finally)' }
  ];

  stages.forEach(st => {
    const chip = document.createElement('span');
    chip.style.cssText = `
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      border: 1px solid ${st.color};
      color: ${st.color};
      background: rgba(255, 255, 255, 0.05);
    `;
    chip.textContent = st.name;
    notesRow.appendChild(chip);
  });
  dock.appendChild(notesRow);

  // Explorer Name Input & Certificate preview
  const inputRow = document.createElement('div');
  inputRow.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.4rem;';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'explorer-name-input';
  nameInput.value = 'Swati Explorer';
  nameInput.style.cssText = `
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--c-border);
    border-radius: 6px;
    padding: 0.35rem 0.7rem;
    color: #fff;
    font-size: 0.8rem;
    font-family: var(--font-sans);
    width: 200px;
    text-align: center;
  `;
  nameInput.addEventListener('input', () => {
    if (typeof drawCertificateCanvas === 'function') drawCertificateCanvas();
  });
  inputRow.appendChild(nameInput);
  dock.appendChild(inputRow);

  // Canvas preview
  const canvasWrap = document.createElement('div');
  canvasWrap.style.cssText = 'display: flex; justify-content: center; margin-bottom: 0.4rem;';
  const canvas = document.createElement('canvas');
  canvas.id = 'cert-preview-canvas';
  canvas.width = 1000;
  canvas.height = 625;
  canvas.style.cssText = 'max-width: 420px; width: 100%; height: auto; border-radius: 8px; border: 1px solid rgba(245, 185, 66, 0.4);';
  canvasWrap.appendChild(canvas);
  dock.appendChild(canvasWrap);

  // Action buttons
  const actionRow = document.createElement('div');
  actionRow.style.cssText = 'display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap;';

  const dlBtn = document.createElement('button');
  dlBtn.className = 'ride-btn';
  dlBtn.style.cssText = 'font-size: 0.75rem; padding: 0.4rem 0.8rem;';
  dlBtn.innerHTML = '💾 Save PNG';
  dlBtn.onclick = () => {
    if (typeof downloadCertificatePNG === 'function') downloadCertificatePNG();
  };

  const printBtn = document.createElement('button');
  printBtn.className = 'nav-btn';
  printBtn.style.cssText = 'font-size: 0.75rem; padding: 0.4rem 0.8rem;';
  printBtn.innerHTML = '🖨️ Print';
  printBtn.onclick = () => window.print();

  const replayBtn = document.createElement('button');
  replayBtn.className = 'nav-btn';
  replayBtn.style.cssText = 'font-size: 0.75rem; padding: 0.4rem 0.8rem; border-color: var(--c-gold) !important; color: var(--c-gold);';
  replayBtn.innerHTML = '🔄 RIDE AGAIN';
  replayBtn.onclick = () => {
    if (typeof mountScene === 'function') mountScene(0);
  };

  actionRow.appendChild(dlBtn);
  actionRow.appendChild(printBtn);
  actionRow.appendChild(replayBtn);
  dock.appendChild(actionRow);

  container.appendChild(dock);

  setTimeout(() => {
    if (typeof drawCertificateCanvas === 'function') drawCertificateCanvas();
  }, 100);

  // Mark complete immediately since Scene 12 is celebration
  onComplete();
}
