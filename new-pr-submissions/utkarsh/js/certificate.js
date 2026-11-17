/* ==========================================================================
   VICTORY CERTIFICATE GENERATOR (Scene 10 · Darjeeling Return)
   HTML5 Canvas (1000x625) · Live Re-render · PNG Export · Print Friendly
   ========================================================================== */

function renderCertificatePanel(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="cert-form-box">
      <div class="cert-prompt-line">Enter mountaineer name to issue your official K2 credential:</div>
      <div style="display:flex; gap:10px; justify-content:center; align-items:center; margin: 8px 0;">
        <input type="text" class="cert-input-name" id="explorer-name-input" value="Himalayan Mountaineer" placeholder="Your Name" />
        <button type="button" class="ride-btn" id="btn-download-cert">📥 Download PNG</button>
      </div>
      <div class="canvas-wrap" style="text-align:center; overflow-x:auto;">
        <canvas id="cert-canvas" width="1000" height="625" style="max-width:100%; border:2px solid #cbd5e1; border-radius:8px;"></canvas>
      </div>
    </div>
  `;

  const inputName = container.querySelector('#explorer-name-input');
  const btnDownload = container.querySelector('#btn-download-cert');
  const canvas = container.querySelector('#cert-canvas');

  function drawCertificate() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const name = (inputName ? inputName.value.trim() : '') || 'Himalayan Mountaineer';

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 1000, 625);
    bg.addColorStop(0, '#0a1120');
    bg.addColorStop(0.5, '#0f172a');
    bg.addColorStop(1, '#1e293b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1000, 625);

    // Double Gold Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 960, 585);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 940, 565);

    // Header
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('HIMALAYAN MOUNTAINEERING INSTITUTE & PYBE', 500, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillText('K2 SAVAGE MOUNTAIN EXPEDITION FELLOWSHIP', 500, 125);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Conferred at the High Ridge of Godwin-Austen (8,611 M)', 500, 160);

    // Recipient Inscription
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '16px monospace';
    ctx.fillText('THIS OFFICIAL HIGH-ALTITUDE CREDENTIAL HONORS', 500, 225);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 38px Georgia, serif';
    ctx.fillText(name, 500, 280);

    // Underline
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 295);
    ctx.lineTo(700, 295);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px Georgia, serif';
    ctx.fillText('Having mastered the 8 immutable laws of Python Sets across the Karakoram passes:', 500, 340);

    // 8 Badges Grid
    const skills = [
      'set() Deduplication', 'a | b Union', 'a & b Intersection', 'a - b Difference',
      'a ^ b Symmetric Diff', '"x" in set O(1)', 'a <= b Subsets', 'frozenset() Seal'
    ];
    ctx.font = 'bold 14px monospace';
    skills.forEach((s, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const x = 160 + col * 180;
      const y = 390 + row * 45;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x - 80, y - 20, 160, 32);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 80, y - 20, 160, 32);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(s, x, y);
    });

    // Signatures
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Georgia, serif';
    ctx.fillText('Pasang Sherpa, Quartermaster', 250, 530);
    ctx.fillText('Tara, Lead Trainee', 750, 530);

    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(150, 510);
    ctx.lineTo(350, 510);
    ctx.moveTo(650, 510);
    ctx.lineTo(850, 510);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText('EXPEDITION DIGEST: 0x8611_K2_SETS_MASTERED · PYBE ALPINE DIVISION 2026', 500, 585);
  }

  if (inputName) {
    inputName.addEventListener('input', drawCertificate);
  }

  if (btnDownload) {
    btnDownload.onclick = () => {
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'K2_Summit_Fellowship_Python_Sets.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }

  setTimeout(drawCertificate, 50);
}
