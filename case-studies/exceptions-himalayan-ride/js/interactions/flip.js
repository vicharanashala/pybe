/* ==========================================================================
   SCENE 8 — FLIP: Plain English thoughts morph into Python syntax
   Verb: flip · Debring (15,500 FT)
   Mental model: Python exception blocks map directly to human safety plans
   ========================================================================== */

function mountFlipInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let flippedCount = 0;
  const TOTAL_NOTES = data.notes.length;

  // Title
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'TAP NOTES TO MORPH PLAIN THOUGHT INTO PYTHON SYNTAX';
  dock.appendChild(title);

  // Grid for the 4 flip cards
  const grid = document.createElement('div');
  grid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 0.2rem;
  `;

  data.notes.forEach((note, idx) => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.style.cssText = 'height: 52px;';

    const inner = document.createElement('div');
    inner.className = 'flip-inner';

    // Front: Plain English
    const front = document.createElement('div');
    front.className = 'flip-front';
    front.innerHTML = `<span style="color: var(--c-gold); font-size: 0.65rem; margin-right: 0.3rem;">[TAP]</span> <span>"${note.english}"</span>`;

    // Back: Python syntax
    const back = document.createElement('div');
    back.className = 'flip-back';
    back.style.cssText = `
      background: rgba(8, 12, 24, 0.9);
      border: 1.5px solid ${note.color};
      color: ${note.color};
      font-weight: 700;
      font-size: 0.8rem;
    `;
    back.textContent = note.python;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => {
      if (card.classList.contains('flipped')) return;
      card.classList.add('flipped');
      flippedCount++;
      if (typeof playSnap === 'function') playSnap();

      if (flippedCount >= TOTAL_NOTES) {
        setTimeout(() => {
          showFeedback(container, 'All 4 stages translated directly into Python syntax!', 'success', 3500);
          if (typeof playCorrectChime === 'function') playCorrectChime();
          onComplete();
        }, 500);
      }
    });

    grid.appendChild(card);
  });

  dock.appendChild(grid);
  container.appendChild(dock);
}
