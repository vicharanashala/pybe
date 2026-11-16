/* ==========================================================================
   SCENE 1: PACK — Darjeeling Depot (Panniers hold 6, duplicates bounce)
   ========================================================================== */
function mountPackInteraction(container, data, onComplete) {
  const packed = new Set();
  const capacity = data.capacity || 6;

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">🎒 Tara's Panniers (<span id="pack-count">0</span> / ${capacity} unique essentials)</span>
        <span class="dock-hint">Tap or drag gear into panniers. Duplicate ropes will bounce!</span>
      </div>
      <div class="panniers-container" id="pannier-dropzone">
        <div class="drop-prompt" id="drop-prompt">Drop or tap essentials here...</div>
        <div class="packed-items" id="packed-items"></div>
      </div>
      <div class="messy-pile" id="messy-pile"></div>
    </div>
  `;

  const pile = container.querySelector('#messy-pile');
  const dropzone = container.querySelector('#pannier-dropzone');
  const itemsContainer = container.querySelector('#packed-items');
  const promptEl = container.querySelector('#drop-prompt');
  const countEl = container.querySelector('#pack-count');

  // Register dropzone with DragKit
  if (window.DragKit) {
    DragKit.registerDropZone(dropzone, {
      onDrop: (itemData, el) => {
        handleItemPack(itemData, el);
      }
    });
  }

  function handleItemPack(item, el) {
    if (packed.has(item.dupOf)) {
      showFeedback(null, `"${item.label}" already on the mule! A set holds each item once.`, 'error');
      if (window.playErrorBeep) playErrorBeep();
      el.classList.add('shake-anim');
      setTimeout(() => el.classList.remove('shake-anim'), 500);
      return;
    }

    packed.add(item.dupOf);
    el.style.display = 'none';
    if (promptEl) promptEl.style.display = 'none';

    const token = document.createElement('div');
    token.className = 'gear-chip packed pop-in';
    token.textContent = item.label;
    itemsContainer.appendChild(token);

    countEl.textContent = packed.size;
    if (window.playSoftClick) playSoftClick();
    showFeedback(null, `Packed "${item.label}"!`, 'success');

    if (packed.size >= capacity) {
      showFeedback(null, "6 essentials packed! Duplicates rejected. Next unlocked.", "success", 4000);
      onComplete();
    }
  }

  data.items.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'gear-chip draggable';
    chip.textContent = item.label;
    chip.onclick = () => handleItemPack(item, chip);

    if (window.DragKit) {
      DragKit.makeDraggable(chip, {
        type: 'gear',
        data: item
      });
    }
    pile.appendChild(chip);
  });
}
