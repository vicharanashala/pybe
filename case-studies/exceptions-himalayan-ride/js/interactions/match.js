/* ==========================================================================
   SCENE 3 — HOLD + MATCH: Hold throttle to cross, then drag correct tool
   Verb: match · Phase A: Hold throttle, engine stalls mid-stream
   Phase B: Drag the correct tool onto the carburettor drop zone
   ========================================================================== */

function mountMatchInteraction(container, data, onComplete) {
  container.innerHTML = '';
  const dock = document.createElement('div');
  dock.className = 'interaction-dock fade-in';

  let phase = 'throttle'; // 'throttle' → 'stall' → 'match'
  let holdInterval = null;
  let progress = 0;
  let wrongAttempts = 0;

  // --- Title ---
  const title = document.createElement('div');
  title.className = 'interaction-title';
  title.id = 'match-title';
  title.textContent = 'HOLD THROTTLE TO CROSS';
  dock.appendChild(title);

  // --- Phase A: Throttle Hold ---
  const throttleZone = document.createElement('div');
  throttleZone.className = 'throttle-zone';
  throttleZone.id = 'match-throttle-zone';

  const streamBar = document.createElement('div');
  streamBar.className = 'stream-progress';
  const streamFill = document.createElement('div');
  streamFill.className = 'stream-fill';
  streamBar.appendChild(streamFill);

  const throttleBtn = document.createElement('button');
  throttleBtn.className = 'throttle-btn';
  throttleBtn.innerHTML = '🏍️ HOLD THROTTLE <span style="font-size:0.65rem;opacity:0.6;margin-left:0.3rem">(Space)</span>';
  throttleBtn.setAttribute('aria-label', 'Hold to cross the stream');

  function startHold() {
    if (phase !== 'throttle' || holdInterval) return;
    throttleBtn.classList.add('held');
    if (typeof playBikeThump === 'function') playBikeThump();
    holdInterval = setInterval(() => {
      progress += 0.02;
      streamFill.style.width = `${Math.min(progress * 100, 100)}%`;
      if (progress >= data.stallPoint) {
        stopHold();
        triggerStall();
      }
    }, 40);
  }

  function stopHold() {
    throttleBtn.classList.remove('held');
    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }

  // Pointer events
  throttleBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startHold();
  });
  throttleBtn.addEventListener('pointerup', stopHold);
  throttleBtn.addEventListener('pointercancel', stopHold);
  throttleBtn.addEventListener('pointerleave', stopHold);

  // Keyboard: Space
  document.addEventListener('keydown', function matchKeyDown(e) {
    if (e.code === 'Space' && phase === 'throttle') {
      e.preventDefault();
      startHold();
    }
    // Store reference for cleanup
    throttleZone._keyDown = matchKeyDown;
  });
  document.addEventListener('keyup', function matchKeyUp(e) {
    if (e.code === 'Space') {
      stopHold();
    }
    throttleZone._keyUp = matchKeyUp;
  });

  throttleZone.appendChild(streamBar);
  throttleZone.appendChild(throttleBtn);
  dock.appendChild(throttleZone);

  // --- Phase B: Tool Match (initially hidden) ---
  const matchZone = document.createElement('div');
  matchZone.id = 'match-tool-zone';
  matchZone.style.display = 'none';

  const matchLayout = document.createElement('div');
  matchLayout.style.display = 'flex';
  matchLayout.style.alignItems = 'center';
  matchLayout.style.justifyContent = 'center';
  matchLayout.style.gap = '1rem';
  matchLayout.style.flexWrap = 'wrap';

  // Carburettor drop zone
  const carbZone = document.createElement('div');
  carbZone.className = 'carb-drop-zone';
  carbZone.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4l3 3"/>
    </svg>
    <span>Carburettor</span>
  `;
  DragKit.makeDropZone(carbZone, { label: 'Carburettor drop zone', data: { target: 'carb' } });

  // Tool tray
  const toolTray = document.createElement('div');
  toolTray.className = 'tool-tray';

  const shuffledTools = [...data.tools].sort(() => Math.random() - 0.5);
  shuffledTools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.dataset.toolId = tool.id;
    card.innerHTML = `
      ${getToolIcon(tool.id)}
      <span class="tool-label">${tool.label}</span>
    `;
    DragKit.makeDraggable(card, { type: 'tool', data: tool });
    toolTray.appendChild(card);
  });

  let solved = false;
  function applyTool(srcEl, tool) {
    if (solved || !tool) return;

    if (tool.correct) {
      solved = true;
      if (srcEl) {
        srcEl.classList.add('correct');
        srcEl.classList.remove('selected', 'wrong');
      }
      carbZone.style.borderColor = 'var(--c-finally)';
      carbZone.style.background = 'rgba(34, 197, 94, 0.12)';
      showFeedback(container, 'Spark plug dried! Dug-Dug roars back.', 'success');
      if (typeof playCorrectChime === 'function') playCorrectChime();
      if (typeof lightLamp === 'function') lightLamp('except');
      if (typeof onComplete === 'function') onComplete();
    } else {
      wrongAttempts++;
      if (srcEl) {
        srcEl.classList.add('wrong');
        setTimeout(() => { srcEl.classList.remove('wrong'); }, 600);
      }
      if (typeof playErrorThud === 'function') playErrorThud();
      showFeedback(container, 'Wrong tool. Bike shudders and stays dead.', 'error');

      // Hint ladder
      if (wrongAttempts >= 2) {
        const correctCard = toolTray.querySelector(`[data-tool-id="${data.correctToolId}"]`);
        if (correctCard) correctCard.classList.add('hint-highlight');
      }
      if (wrongAttempts >= 3) {
        // Auto-complete
        solved = true;
        const correctCard = toolTray.querySelector(`[data-tool-id="${data.correctToolId}"]`);
        if (correctCard) correctCard.classList.add('correct');
        carbZone.style.borderColor = 'var(--c-finally)';
        carbZone.style.background = 'rgba(34, 197, 94, 0.12)';
        showFeedback(container, 'Hint: Plug Wrench dries the spark plug.', 'info');
        if (typeof playCorrectChime === 'function') playCorrectChime();
        if (typeof lightLamp === 'function') lightLamp('except');
        if (typeof onComplete === 'function') onComplete();
      }
    }
  }

  // Allow clicking on any tool directly
  toolTray.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const toolId = card.dataset.toolId;
      const tool = data.tools.find(t => t.id === toolId);
      applyTool(card, tool);
    });
  });

  // Allow clicking carburettor if tool is chosen
  carbZone.addEventListener('click', () => {
    const plugCard = toolTray.querySelector(`[data-tool-id="${data.correctToolId}"]`);
    applyTool(plugCard, data.tools.find(t => t.id === data.correctToolId));
  });

  // Drop handler
  DragKit.onDrop((srcEl, targetEl, srcData, targetData) => {
    if (!srcData || !targetData || targetData.target !== 'carb') return;
    applyTool(srcEl, srcData);
  });

  matchLayout.appendChild(toolTray);
  matchLayout.appendChild(carbZone);
  matchZone.appendChild(matchLayout);
  dock.appendChild(matchZone);

  container.appendChild(dock);

  // --- Stall Transition ---
  function triggerStall() {
    phase = 'stall';
    if (typeof playErrorThud === 'function') playErrorThud();

    // Vibrate on mobile
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    // Show stall overlay briefly
    const stall = document.createElement('div');
    stall.className = 'stall-overlay';
    stall.innerHTML = `
      <svg viewBox="0 0 60 60" width="48" height="48" fill="none" stroke="var(--c-except)" stroke-width="2.5">
        <circle cx="30" cy="30" r="22" fill="rgba(239,68,68,0.12)"/>
        <path d="M20 25 Q30 15 40 25" stroke-width="3"/>
        <path d="M25 35 Q30 40 35 35"/>
        <circle cx="24" cy="28" r="2" fill="var(--c-except)"/>
        <circle cx="36" cy="28" r="2" fill="var(--c-except)"/>
      </svg>
      <span class="stall-text">ENGINE STALLED!</span>
    `;
    container.appendChild(stall);

    setTimeout(() => {
      stall.remove();
      phase = 'match';
      throttleZone.style.display = 'none';
      title.textContent = 'MATCH THE RIGHT TOOL';
      matchZone.style.display = 'block';
      matchZone.classList.add('fade-in');
    }, 1500);
  }
}

function getToolIcon(toolId) {
  const icons = {
    lever: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="3" width="4" height="18" rx="1"/><path d="M6 8h-3"/><path d="M14 8h4"/></svg>',
    plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    lube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v6l3 3v9a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-9l3-3V2"/></svg>',
    hammer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25a4 4 0 0 0-5.66 0L12 12.41"/></svg>'
  };
  return icons[toolId] || icons.plug;
}
