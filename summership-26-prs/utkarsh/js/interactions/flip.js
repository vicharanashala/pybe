/* ==========================================================================
   SCENE 9: FLIP — The Syntax Bridge (8 cards flip in place into Python)
   ========================================================================== */
function mountFlipInteraction(container, data, onComplete) {
  let flippedCount = 0;
  const total = data.cards.length;

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">📖 Expedition Field Notebook — The Python Syntax Bridge</span>
        <span class="dock-hint">Tap each field observation card to flip it into its exact Python set expression!</span>
      </div>
      <div class="flip-cards-grid" id="flip-grid"></div>
    </div>
  `;

  const grid = container.querySelector('#flip-grid');

  data.cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <span class="flip-lamp-badge">${c.lamp}</span>
          <p class="flip-plain-text">"${c.plain}"</p>
          <span class="flip-hint">Tap to flip ↻</span>
        </div>
        <div class="flip-card-back">
          <span class="flip-lamp-badge lit">${c.lamp}</span>
          <code class="flip-code-text">${c.code}</code>
          <span class="flip-success">Python Set Invariant ✓</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      if (!card.classList.contains('is-flipped')) {
        card.classList.add('is-flipped');
        flippedCount++;
        if (window.playSoftClick) playSoftClick();
        if (flippedCount >= total) {
          showFeedback(null, "All 8 concepts bridged into Python! Next unlocked.", "success", 4000);
          onComplete();
        }
      }
    };
    grid.appendChild(card);
  });
}
