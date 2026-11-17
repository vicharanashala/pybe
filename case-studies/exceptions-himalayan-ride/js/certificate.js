/* ==========================================================================
   VICTORY CERTIFICATE GENERATOR (Scene 12 · Leh Arrival)
   The High Pass: Swati's Himalayan Ride (PyBe Discovery Lab v2)
   HTML5 Canvas (1000x625) · Live Re-render · PNG Export · Print Friendly
   ========================================================================== */

function renderCertificatePanel(panelBodyEl, checkpointData) {
  const certContainer = document.createElement('div');
  certContainer.className = 'cert-form-box';

  const heading = document.createElement('div');
  heading.className = 'mcq-question-prompt';
  heading.textContent = 'Enter explorer name to issue your Himalayan credential:';
  certContainer.appendChild(heading);

  const inputName = document.createElement('input');
  inputName.type = 'text';
  inputName.className = 'cert-input-name';
  inputName.id = 'explorer-name-input';
  inputName.value = 'Swati Explorer';
  inputName.placeholder = 'Your Name';
  inputName.addEventListener('input', () => drawCertificateCanvas());
  certContainer.appendChild(inputName);

  const canvasWrap = document.createElement('div');
  canvasWrap.className = 'cert-canvas-wrap';

  const canvas = document.createElement('canvas');
  canvas.id = 'cert-preview-canvas';
  canvas.width = 1000;
  canvas.height = 625;
  canvasWrap.appendChild(canvas);
  certContainer.appendChild(canvasWrap);

  const actionRow = document.createElement('div');
  actionRow.className = 'cert-action-row';

  const btnDownload = document.createElement('button');
  btnDownload.className = 'btn-nav-control btn-primary-action';
  btnDownload.style.flex = '1';
  btnDownload.textContent = '💾 Save Certificate PNG';
  btnDownload.addEventListener('click', () => downloadCertificatePNG());

  const btnPrint = document.createElement('button');
  btnPrint.className = 'btn-nav-control';
  btnPrint.style.flex = '1';
  btnPrint.textContent = '🖨️ Print';
  btnPrint.addEventListener('click', () => window.print());

  actionRow.appendChild(btnDownload);
  actionRow.appendChild(btnPrint);
  certContainer.appendChild(actionRow);

  panelBodyEl.appendChild(certContainer);

  setTimeout(() => drawCertificateCanvas(), 50);
}

function drawCertificateCanvas() {
  const canvas = document.getElementById('cert-preview-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const input = document.getElementById('explorer-name-input');
  const explorerName = input ? input.value.trim() || 'Himalayan Explorer' : 'Himalayan Explorer';

  // Background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0c1322');
  grad.addColorStop(0.5, '#070b14');
  grad.addColorStop(1, '#0c1322');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Outer Border
  ctx.strokeStyle = '#f5b942';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Inner Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Top Prayer Ribbons
  const ribbonColors = ['#2563eb', '#f8fafc', '#dc2626', '#16a34a', '#ca8a04'];
  const segW = (w - 60) / 10;
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = ribbonColors[i % 5];
    ctx.fillRect(30 + i * segW, 30, segW, 5);
  }

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5b942';
  ctx.font = '700 24px Cinzel, serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('HIMALAYAN EXPEDITION CREDENTIAL', w / 2, 85);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('MANALI-LEH HIGHWAY (474 KM) · PYBE DISCOVERY LAB', w / 2, 112);

  // Decorative Mountain Peak
  ctx.strokeStyle = '#f5b942';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 30, 145);
  ctx.lineTo(w / 2, 128);
  ctx.lineTo(w / 2 + 30, 145);
  ctx.stroke();

  // "This certifies that"
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('This certifies that', w / 2, 185);

  // Explorer Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(explorerName, w / 2, 235);

  // Underline
  ctx.strokeStyle = '#f5b942';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 180, 250);
  ctx.lineTo(w / 2 + 180, 250);
  ctx.stroke();

  // Achievement Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
  const descLine1 = 'has conquered 474 kilometers across the highest motorable passes of Ladakh,';
  const descLine2 = 'discovering and mastering the four foundational pillars of Python Exception Handling:';
  ctx.fillText(descLine1, w / 2, 290);
  ctx.fillText(descLine2, w / 2, 314);

  // 4 Python Pillars Cards
  const pillars = [
    { kw: 'try:', text: 'The Risky Attempt' },
    { kw: 'except:', text: 'Specific Shocks' },
    { kw: 'else:', text: 'Clean-Run Reward' },
    { kw: 'finally:', text: 'Mandatory Protocol' }
  ];

  const cardW = 195;
  const cardH = 68;
  const startX = (w - (4 * cardW + 3 * 18)) / 2;
  const cardY = 350;

  pillars.forEach((p, idx) => {
    const cx = startX + idx * (cardW + 18);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(245, 185, 66, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cx, cardY, cardW, cardH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f5b942';
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText(p.kw, cx + cardW / 2, cardY + 28);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(p.text, cx + cardW / 2, cardY + 50);
  });

  // Footer Details
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText(`DATE: ${today}`, 60, 520);
  ctx.fillText('SUMMIT ELEVATION: 17,480 FT (TANGLANG LA)', 60, 542);
  ctx.fillText('BRO HIGHWAY ROUTE: NH-3 (PROJECT HIMANK & DEEPAK)', 60, 564);

  // Stamp / Crest on right
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(245, 185, 66, 0.12)';
  ctx.beginPath();
  ctx.arc(w - 130, 510, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f5b942';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#f5b942';
  ctx.font = '700 10px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED PASS', w - 130, 498);
  ctx.font = '700 16px "Cinzel", serif';
  ctx.fillText('PYBE', w - 130, 518);
  ctx.font = '600 9px "JetBrains Mono", monospace';
  ctx.fillText('SHANTI STUPA', w - 130, 532);
}

function downloadCertificatePNG() {
  const canvas = document.getElementById('cert-preview-canvas');
  if (!canvas) return;
  const input = document.getElementById('explorer-name-input');
  const name = input ? input.value.trim().replace(/\s+/g, '_') : 'explorer';

  const link = document.createElement('a');
  link.download = `Himalayan_Pythonist_${name}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
