/* ==========================================================================
   SCENE 1 — PACK: Drag 5 of 8 items into panniers
   Verb: pack · Seeds the 4-stage mental model without naming them
   Misconception busted: "Pack more = safer" (Dead weight vs essentials)
   ========================================================================== */

function mountPackInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  // State
  const packed = new Set();
  const CAPACITY = data.capacity || 5;
  let items = [...data.items];

  // --- Header ---
  const headerWrap = document.createElement('div');
  headerWrap.style.cssText = 'display: flex; justify-content: space-between; align-items: baseline;';

  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.textContent = 'PACK THE PANNIERS (5 ITEMS)';

  const sub = document.createElement('span');
  sub.style.cssText = 'font-size: 0.65rem; color: var(--c-text-muted);';
  sub.textContent = 'Drag or click items to pack. Only survival gear counts.';

  headerWrap.appendChild(title);
  headerWrap.appendChild(sub);
  dock.appendChild(headerWrap);

  // --- Layout: Tray + Panniers + Gauge ---
  const layout = document.createElement('div');
  layout.className = 'pack-layout';

  // Item tray
  const tray = document.createElement('div');
  tray.className = 'pack-tray';
  tray.setAttribute('aria-label', 'Available gear items');

  // Panniers
  const pannierWrap = document.createElement('div');
  pannierWrap.className = 'pack-panniers';

  function makePannier(name) {
    const col = document.createElement('div');
    col.className = 'pannier';
    const hdr = document.createElement('div');
    hdr.className = 'pannier-header';
    hdr.textContent = name;
    const drop = document.createElement('div');
    drop.className = 'pannier-drop';
    DragKit.makeDropZone(drop, { label: name, data: { pannier: name } });
    col.appendChild(hdr);
    col.appendChild(drop);
    return { col, drop };
  }

  const p1 = makePannier('Left Pannier');
  const p2 = makePannier('Right Pannier');
  pannierWrap.appendChild(p1.col);
  pannierWrap.appendChild(p2.col);

  // Status & Guidance Banner (tells learner exact errors!)
  const statusBanner = document.createElement('div');
  statusBanner.id = 'pack-status-banner';
  statusBanner.style.cssText = `
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--c-border);
    color: var(--c-text-muted);
    text-align: center;
    transition: all 0.2s ease;
  `;
  statusBanner.textContent = 'Packed 0/5. Pack only the 5 survival essentials needed for the 474 km high passes.';

  // Weight gauge
  const gaugeWrap = document.createElement('div');
  gaugeWrap.className = 'pack-gauge';
  const gaugeBar = document.createElement('div');
  gaugeBar.className = 'gauge-bar';
  const gaugeFill = document.createElement('div');
  gaugeFill.className = 'gauge-fill';
  gaugeBar.appendChild(gaugeFill);
  const gaugeLabel = document.createElement('span');
  gaugeLabel.className = 'gauge-label';
  gaugeLabel.textContent = '0 / 5';
  gaugeWrap.appendChild(gaugeBar);
  gaugeWrap.appendChild(gaugeLabel);

  function updateStatusAndValidation() {
    const pct = (packed.size / CAPACITY) * 100;
    gaugeFill.style.width = pct + '%';
    gaugeLabel.textContent = `${packed.size} / ${CAPACITY}`;

    const packedItemsList = data.items.filter(i => packed.has(i.id));
    const deadWeightItems = packedItemsList.filter(i => !i.essential);
    const missingEssentials = data.items.filter(i => i.essential && !packed.has(i.id));

    // Update highlights on tray items
    tray.querySelectorAll('.drag-item').forEach(el => {
      const itemId = el.dataset.itemId;
      const isMissingEssential = missingEssentials.some(m => m.id === itemId);
      if (deadWeightItems.length > 0 && isMissingEssential) {
        el.style.borderColor = 'var(--c-gold)';
        el.style.boxShadow = '0 0 8px rgba(245, 185, 66, 0.4)';
      } else {
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }
    });

    if (packed.size < CAPACITY) {
      statusBanner.style.background = 'rgba(255, 255, 255, 0.05)';
      statusBanner.style.borderColor = 'var(--c-border)';
      statusBanner.style.color = 'var(--c-text-muted)';
      statusBanner.innerHTML = `Packed <strong>${packed.size}/${CAPACITY}</strong>. Click or drag gear into panniers.`;
      return;
    }

    // Capacity is full (5 items)
    if (deadWeightItems.length === 0) {
      // 100% Correct
      statusBanner.style.background = 'rgba(34, 197, 94, 0.15)';
      statusBanner.style.borderColor = 'var(--c-finally)';
      statusBanner.style.color = '#86efac';
      statusBanner.innerHTML = '✓ <strong>All 5 essentials packed!</strong> (Plug, Puncture kit, Tent, Chai, Pump). Dug-Dug is balanced & ready!';

      showFeedback(container, 'All essentials packed! Dug-Dug is ready.', 'success', 3500);
      if (typeof playCorrectChime === 'function') playCorrectChime();
      onComplete();
    } else {
      // Has dead weight! Tell the learner EXACTLY what is wrong
      const deadNames = deadWeightItems.map(d => `"${d.label}"`).join(' and ');
      const missingNames = missingEssentials.map(m => `"${m.label}"`).join(', ');

      statusBanner.style.background = 'rgba(239, 68, 68, 0.18)';
      statusBanner.style.borderColor = 'var(--c-except)';
      statusBanner.style.color = '#fca5a5';
      statusBanner.innerHTML = `❌ <strong>Dead Weight:</strong> ${deadNames} won't fix high-altitude breakdowns! Click red items to unpack, and pack: <strong>${missingNames}</strong>.`;

      showFeedback(container, `Dead weight: ${deadNames}! Swap for ${missingNames}.`, 'error', 4500);
      if (typeof playErrorThud === 'function') playErrorThud();
    }
  }

  function packItem(itemData, targetPannierEl) {
    if (!itemData || packed.has(itemData.id)) return;
    if (packed.size >= CAPACITY) {
      showFeedback(container, 'Panniers full (5/5)! Click an item to remove it first.', 'error');
      if (typeof playErrorThud === 'function') playErrorThud();
      return;
    }

    packed.add(itemData.id);

    // Remove from tray
    const existingTrayItem = tray.querySelector(`[data-item-id="${itemData.id}"]`);
    if (existingTrayItem) existingTrayItem.remove();

    // Place into chosen pannier with clear essential vs dead weight badge
    const placed = document.createElement('div');
    placed.className = 'drag-item scale-in';
    placed.style.cursor = 'pointer';
    placed.style.fontSize = '0.72rem';
    placed.style.padding = '0.3rem 0.5rem';
    placed.dataset.itemId = itemData.id;

    if (itemData.essential) {
      placed.style.borderColor = 'rgba(34, 197, 94, 0.5)';
      placed.innerHTML = `
        ${getItemIcon(itemData.icon)}
        <span>${itemData.label}</span>
        <span style="font-size:0.55rem; color:#86efac; margin-left:2px;">[Essential]</span>
      `;
      placed.title = 'Essential survival gear. Click to unpack if needed.';
    } else {
      placed.style.borderColor = 'rgba(239, 68, 68, 0.8)';
      placed.style.background = 'rgba(239, 68, 68, 0.2)';
      placed.innerHTML = `
        ${getItemIcon(itemData.icon)}
        <span>${itemData.label}</span>
        <span style="font-size:0.55rem; color:#f87171; font-weight:700; margin-left:2px;">[Dead Weight ✕]</span>
      `;
      placed.title = 'Dead weight! Click to unpack.';
    }

    placed.addEventListener('click', () => {
      packed.delete(itemData.id);
      placed.remove();
      renderTrayItem(itemData);
      updateStatusAndValidation();
      if (typeof playUiClick === 'function') playUiClick();
    });

    targetPannierEl.appendChild(placed);
    if (typeof playSnap === 'function') playSnap();
    updateStatusAndValidation();
  }

  function renderTrayItem(item) {
    const el = document.createElement('div');
    el.className = 'drag-item';
    el.innerHTML = `${getItemIcon(item.icon)}<span>${item.label}</span>`;
    el.dataset.itemId = item.id;
    DragKit.makeDraggable(el, { type: 'gear', data: item });

    // Click to auto-pack into whichever pannier has fewer items
    el.addEventListener('click', () => {
      const targetPannier = p1.drop.children.length <= p2.drop.children.length ? p1.drop : p2.drop;
      packItem(item, targetPannier);
    });

    tray.appendChild(el);
  }

  // Create tray items
  items.forEach(item => renderTrayItem(item));

  // Drag & drop handler
  DragKit.onDrop((srcEl, targetEl, srcData, targetData) => {
    if (!srcData || !targetEl) return;
    packItem(srcData, targetEl);
  });

  layout.appendChild(tray);
  layout.appendChild(pannierWrap);

  dock.appendChild(layout);
  dock.appendChild(gaugeWrap);
  dock.appendChild(statusBanner);
  container.appendChild(dock);
}

function getItemIcon(type) {
  const icons = {
    wrench:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    tent:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 20h18L12 4 3 20z"/><path d="M12 20v-8"/></svg>',
    kettle:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
    fuel:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="12" height="18" rx="2"/><path d="M18 9h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1"/><path d="M7 8h4"/></svg>',
    camera:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    music:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
  };
  return icons[type] || icons.wrench;
}
