/**
 * Hint Panel Component
 * =====================
 * Progressive hint reveal with slide-down animation.
 */

export function createHintPanel(container) {
  let revealedCount = 0;
  let totalHints = 0;
  let allHints = [];

  const panel = document.createElement('div');
  panel.className = 'hint-panel';
  panel.innerHTML = `
    <div class="section-header collapsible" role="button" tabindex="0" aria-expanded="false">
      <div class="section-header-left">
        <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h3>Hints</h3>
        <span class="hint-count-badge">0 hints</span>
      </div>
      <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="section-body collapsed">
      <div class="hints-list"></div>
      <button class="btn btn-hint" disabled>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Reveal Next Hint
      </button>
    </div>
  `;

  const header = panel.querySelector('.section-header');
  const body = panel.querySelector('.section-body');
  const hintsList = panel.querySelector('.hints-list');
  const revealBtn = panel.querySelector('.btn-hint');
  const badge = panel.querySelector('.hint-count-badge');

  // Toggle collapse
  header.addEventListener('click', () => {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!isExpanded));
    body.classList.toggle('collapsed');
    header.querySelector('.chevron').classList.toggle('rotated');
  });

  // Reveal next hint
  revealBtn.addEventListener('click', () => {
    if (revealedCount < totalHints) {
      revealedCount++;
      renderHints();
    }
  });

  function renderHints() {
    hintsList.innerHTML = '';

    for (let i = 0; i < revealedCount; i++) {
      const hint = allHints[i];
      const hintEl = document.createElement('div');
      hintEl.className = 'hint-item hint-enter';
      hintEl.style.animationDelay = `${i * 80}ms`;
      hintEl.innerHTML = `
        <span class="hint-number">${hint.level || i + 1}</span>
        <p class="hint-text">${hint.text || hint}</p>
      `;
      hintsList.appendChild(hintEl);
    }

    badge.textContent = `${revealedCount}/${totalHints} revealed`;
    revealBtn.disabled = revealedCount >= totalHints;
    revealBtn.textContent = revealedCount >= totalHints 
      ? '✓ All Hints Revealed' 
      : `Reveal Hint ${revealedCount + 1} of ${totalHints}`;
  }

  // Public method to set hints data
  panel.setHints = (hints) => {
    allHints = hints || [];
    totalHints = allHints.length;
    revealedCount = 0;
    badge.textContent = `${totalHints} hints available`;
    revealBtn.disabled = totalHints === 0;
    hintsList.innerHTML = '';
    if (totalHints > 0) {
      revealBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        Reveal Hint 1 of ${totalHints}
      `;
    }
  };

  container.appendChild(panel);
  return panel;
}
