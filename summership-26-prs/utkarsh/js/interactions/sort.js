/* ==========================================================================
   SCENE 5: SORT — Concordia (Symmetric Difference: 3 Baskets)
   ========================================================================== */
function mountSortInteraction(container, data, onComplete) {
  let sortedCount = 0;
  const total = data.items.length;

  container.innerHTML = `
    <div class="interaction-dock">
      <div class="dock-header">
        <span class="dock-title">⛺ Concordia Fork Gear Partition</span>
        <span class="dock-hint">Tap each gear item into the correct basket: ONLY SOUTH, BOTH, or ONLY NORTH.</span>
      </div>
      <div class="sort-items-pool" id="items-pool"></div>
      <div class="three-baskets-grid">
        <div class="basket-card" data-basket="south">
          <div class="basket-header">Only South (Abruzzi)</div>
          <div class="basket-contents" id="b-south"></div>
        </div>
        <div class="basket-card shared" data-basket="both">
          <div class="basket-header">Both Teams (Intersection)</div>
          <div class="basket-contents" id="b-both"></div>
        </div>
        <div class="basket-card" data-basket="north">
          <div class="basket-header">Only North (Cesen)</div>
          <div class="basket-contents" id="b-north"></div>
        </div>
      </div>
    </div>
  `;

  const pool = container.querySelector('#items-pool');
  const bSouth = container.querySelector('#b-south');
  const bBoth = container.querySelector('#b-both');
  const bNorth = container.querySelector('#b-north');

  let activeItem = null;

  function selectItem(it, chip) {
    if (activeItem) activeItem.chip.classList.remove('is-selected');
    activeItem = { item: it, chip: chip };
    chip.classList.add('is-selected');
    showFeedback(null, `Selected "${it.name}". Now tap the target basket below.`, 'info');
  }

  [
    { el: container.querySelector('[data-basket="south"]'), dest: bSouth, id: 'south' },
    { el: container.querySelector('[data-basket="both"]'),  dest: bBoth,  id: 'both' },
    { el: container.querySelector('[data-basket="north"]'), dest: bNorth, id: 'north' }
  ].forEach(b => {
    b.el.onclick = () => {
      if (!activeItem) {
        showFeedback(null, "Select a gear item from above first!", 'info');
        return;
      }
      if (activeItem.item.category === b.id) {
        activeItem.chip.style.display = 'none';
        const placed = document.createElement('span');
        placed.className = 'gear-chip packed pop-in';
        placed.textContent = activeItem.item.name;
        b.dest.appendChild(placed);
        sortedCount++;
        showFeedback(null, `Correctly sorted "${activeItem.item.name}"!`, 'success');
        if (window.playSoftClick) playSoftClick();
        activeItem = null;

        if (sortedCount >= total) {
          showFeedback(null, "All gear partitioned! Symmetric exclusives identified. Next unlocked.", "success", 4000);
          onComplete();
        }
      } else {
        showFeedback(null, `Incorrect basket for "${activeItem.item.name}". Check route needs!`, 'error');
        if (window.playErrorBeep) playErrorBeep();
        b.el.classList.add('shake-anim');
        setTimeout(() => b.el.classList.remove('shake-anim'), 500);
      }
    };
  });

  data.items.forEach(it => {
    const chip = document.createElement('button');
    chip.className = 'gear-chip';
    chip.textContent = it.name;
    chip.onclick = () => selectItem(it, chip);
    pool.appendChild(chip);
  });
}
