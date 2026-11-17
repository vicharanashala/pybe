/* ==========================================================================
   SCENE 2: MERGE — The Fork (Two manifests merge into one Buy List)
   ========================================================================== */
function mountMergeInteraction(container, data, onComplete) {
  const merged = new Set();
  const target = data.targetCount || 5;

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">📋 Expedition Buy List (<span id="merge-count">0</span> / ${target} unique items)</span>
        <span class="dock-hint">Tap items from South & North manifests. Shared items fuse into one card!</span>
      </div>
      <div class="manifest-split">
        <div class="manifest-card">
          <div class="manifest-title">🚛 South Manifest (Skardu)</div>
          <div class="manifest-items" id="south-items"></div>
        </div>
        <div class="manifest-card">
          <div class="manifest-title">🚚 North Manifest (Kashgar)</div>
          <div class="manifest-items" id="north-items"></div>
        </div>
      </div>
      <div class="buy-list-zone" id="buy-list-zone">
        <div class="buy-list-title">🛒 Consolidated Master Buy List (Union):</div>
        <div class="buy-list-items" id="buy-list-items"></div>
      </div>
    </div>
  `;

  const southEl = container.querySelector('#south-items');
  const northEl = container.querySelector('#north-items');
  const buyList = container.querySelector('#buy-list-items');
  const countEl = container.querySelector('#merge-count');

  function addItem(item, btn) {
    btn.disabled = true;
    btn.classList.add('fused');

    if (merged.has(item.label)) {
      showFeedback(null, `"${item.label}" was already on the Buy List. Both cards fused!`, 'info');
      // Highlight existing card
      const existing = buyList.querySelector(`[data-name="${item.label}"]`);
      if (existing) {
        existing.classList.add('fusion-flash');
        setTimeout(() => existing.classList.remove('fusion-flash'), 600);
      }
    } else {
      merged.add(item.label);
      const card = document.createElement('div');
      card.className = 'gear-chip packed pop-in';
      card.dataset.name = item.label;
      card.textContent = item.label;
      buyList.appendChild(card);
      countEl.textContent = merged.size;
      showFeedback(null, `Added "${item.label}" to master list.`, 'success');
    }

    if (window.playSoftClick) playSoftClick();

    if (merged.size >= target) {
      showFeedback(null, "All 5 unique items consolidated without duplication! Next unlocked.", "success", 4000);
      onComplete();
    }
  }

  data.south.forEach(it => {
    const b = document.createElement('button');
    b.className = 'gear-chip';
    b.textContent = it.label;
    b.onclick = () => addItem(it, b);
    southEl.appendChild(b);
  });

  data.north.forEach(it => {
    const b = document.createElement('button');
    b.className = 'gear-chip';
    b.textContent = it.label;
    b.onclick = () => addItem(it, b);
    northEl.appendChild(b);
  });
}
