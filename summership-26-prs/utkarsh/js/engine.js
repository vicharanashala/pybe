/* ==========================================================================
   TWO ROADS TO K2 — STORY ENGINE & NAVIGATION CONTROLLER
   Single source state machine · 10 action-first scenes · Locked-Next enforcement
   ========================================================================== */

let currentSceneIndex = 0;
const TOTAL_SCENES = SCENES_DATA.length;
const completedScenes = new Set();
const litLamps = new Set();

// Feedback toast utility
function showFeedback(container, message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.feedback-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `feedback-toast ${type} fade-in`;
  toast.textContent = message;

  const target = container || document.getElementById('photo-stage-container') || document.body;
  target.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, duration);
  }
  return toast;
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initElevationProfile();
  setupKeyboardNavigation();
  const match = window.location.hash.match(/scene=(\d+)/);
  const startIdx = match ? parseInt(match[1], 10) : 0;
  mountScene(startIdx);
}

function mountScene(index) {
  if (index < 0 || index >= TOTAL_SCENES) return;
  currentSceneIndex = index;
  const scene = SCENES_DATA[index];

  // 1. Photo Stage
  const photoBg = document.getElementById('photo-stage-bg');
  if (photoBg && scene.photo) {
    photoBg.style.backgroundImage = `url('${scene.photo}')`;
    photoBg.classList.remove('ken-burns');
    void photoBg.offsetWidth; // force reflow
    photoBg.classList.add('ken-burns');
  }

  // 2. HUD & Stage Meta
  const placeEl = document.getElementById('photo-place-name');
  const elevEl = document.getElementById('photo-elevation-value');
  const actPill = document.getElementById('photo-act-pill');
  const counterEl = document.getElementById('hud-step-counter');

  if (placeEl) placeEl.textContent = scene.place;
  if (elevEl) elevEl.textContent = scene.altDisplay;
  if (actPill) actPill.textContent = scene.actTitle;
  if (counterEl) counterEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(TOTAL_SCENES).padStart(2, '0')}`;

  // 3. Radio Bubble
  const radioSpeaker = document.getElementById('radio-speaker');
  const radioText = document.getElementById('radio-text');
  if (radioSpeaker && scene.radio) radioSpeaker.textContent = scene.radio.speaker;
  if (radioText && scene.radio) radioText.textContent = scene.radio.text;

  // 4. Glass Dock Narration
  const narrEl = document.getElementById('stage-narration-text');
  if (narrEl) narrEl.textContent = scene.narration;

  // 5. Gate Next Button
  const btnNext = document.getElementById('btn-next');
  const btnPrev = document.getElementById('btn-prev');

  if (btnPrev) {
    btnPrev.disabled = (index === 0);
  }

  const isCompleted = completedScenes.has(scene.id);
  if (btnNext) {
    if (isCompleted) {
      btnNext.disabled = false;
      btnNext.classList.remove('locked');
      btnNext.classList.add('pulse');
    } else {
      btnNext.disabled = true;
      btnNext.classList.add('locked');
      btnNext.classList.remove('pulse');
    }
  }

  // 6. Mount Interaction
  const layer = document.getElementById('interaction-layer');
  if (layer) {
    layer.innerHTML = '';
    dispatchInteraction(scene, layer, () => {
      completeScene(scene);
    });
  }

  // 7. Update Lamps & Elevation
  updateDashboardLamps();
  updateElevationProfile(index);
  renderQuickCheck(scene);
}

function dispatchInteraction(scene, container, onComplete) {
  switch (scene.verb) {
    case 'pack':
      if (typeof mountPackInteraction === 'function') mountPackInteraction(container, scene.interactionData, onComplete);
      break;
    case 'merge':
      if (typeof mountMergeInteraction === 'function') mountMergeInteraction(container, scene.interactionData, onComplete);
      break;
    case 'stamp':
      if (typeof mountStampInteraction === 'function') mountStampInteraction(container, scene.interactionData, onComplete);
      break;
    case 'unload':
      if (typeof mountUnloadInteraction === 'function') mountUnloadInteraction(container, scene.interactionData, onComplete);
      break;
    case 'sort':
      if (typeof mountSortInteraction === 'function') mountSortInteraction(container, scene.interactionData, onComplete);
      break;
    case 'lookup':
      if (typeof mountLookupInteraction === 'function') mountLookupInteraction(container, scene.interactionData, onComplete);
      break;
    case 'audit':
      if (typeof mountAuditInteraction === 'function') mountAuditInteraction(container, scene.interactionData, onComplete);
      break;
    case 'seal':
      if (typeof mountSealInteraction === 'function') mountSealInteraction(container, scene.interactionData, onComplete);
      break;
    case 'flip':
      if (typeof mountFlipInteraction === 'function') mountFlipInteraction(container, scene.interactionData, onComplete);
      break;
    case 'run':
      if (typeof mountRunInteraction === 'function') mountRunInteraction(container, scene.interactionData, onComplete);
      break;
    default:
      container.innerHTML = `<button class="ride-btn" onclick="onComplete();">Complete Stage</button>`;
      break;
  }
}

function completeScene(scene) {
  completedScenes.add(scene.id);
  if (scene.lampLit) {
    lightLamp(scene.lampLit);
  }

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.disabled = false;
    btnNext.classList.remove('locked');
    btnNext.classList.add('pulse');
  }

  if (window.playSuccessChime) {
    playSuccessChime();
  }
}

function lightLamp(lampId) {
  litLamps.add(lampId);
  const lampEl = document.querySelector(`.lamp[data-stage="${lampId}"]`);
  if (lampEl) {
    lampEl.classList.add('lit', 'just-lit');
    setTimeout(() => lampEl.classList.remove('just-lit'), 700);
  }
}

function updateDashboardLamps() {
  document.querySelectorAll('.lamp').forEach(el => {
    const stage = el.getAttribute('data-stage');
    if (litLamps.has(stage)) {
      el.classList.add('lit');
    } else {
      el.classList.remove('lit');
    }
  });
}

function nextScene() {
  const currentScene = SCENES_DATA[currentSceneIndex];
  if (!completedScenes.has(currentScene.id)) {
    showFeedback(null, "Complete this mountain action to unlock the next pass!", "error");
    if (window.playErrorBeep) playErrorBeep();
    return;
  }
  if (currentSceneIndex < TOTAL_SCENES - 1) {
    mountScene(currentSceneIndex + 1);
  }
}

function prevScene() {
  if (currentSceneIndex > 0) {
    mountScene(currentSceneIndex - 1);
  }
}

function goToScene(idx) {
  if (idx >= 0 && idx < TOTAL_SCENES) {
    mountScene(idx);
  }
}

// Quick Check Drawer
function renderQuickCheck(scene) {
  const drawer = document.getElementById('quickcheck-drawer');
  const body = document.getElementById('quickcheck-body');
  const tab = document.getElementById('quickcheck-tab');
  if (!drawer || !body) return;

  if (!scene.quickCheck) {
    if (tab) tab.style.display = 'none';
    drawer.classList.remove('open');
    return;
  }

  if (tab) tab.style.display = 'flex';
  const qc = scene.quickCheck;

  body.innerHTML = `
    <div class="qc-header">
      <span class="qc-tag">Trail Audit Question</span>
      <h3 class="qc-question">${qc.question}</h3>
    </div>
    <div class="qc-options" id="qc-options">
      ${qc.options.map((opt, idx) => `
        <button class="qc-opt-btn" data-opt="${idx}">${opt}</button>
      `).join('')}
    </div>
    <div class="qc-feedback" id="qc-feedback"></div>
  `;

  const optBtns = body.querySelectorAll('.qc-opt-btn');
  const fb = body.querySelector('#qc-feedback');

  optBtns.forEach(btn => {
    btn.onclick = () => {
      const chosen = parseInt(btn.getAttribute('data-opt'), 10);
      if (chosen === qc.answerIndex) {
        btn.classList.add('correct');
        optBtns.forEach(b => b.disabled = true);
        fb.className = 'qc-feedback success';
        fb.textContent = `Correct! ${qc.explanation}`;
        if (window.playSoftClick) playSoftClick();
      } else {
        btn.classList.add('wrong');
        fb.className = 'qc-feedback error';
        fb.textContent = 'Not quite. Re-read the mountain dilemma and try again.';
        if (window.playErrorBeep) playErrorBeep();
      }
    };
  });
}

function toggleQuickCheckDrawer() {
  const drawer = document.getElementById('quickcheck-drawer');
  if (drawer) drawer.classList.toggle('open');
}

// Elevation SVG
function initElevationProfile() {
  const svg = document.getElementById('elevation-svg');
  if (!svg) return;
  const trailBg = document.getElementById('elev-trail-bg');
  const trailActive = document.getElementById('elev-trail-active');
  const nodesGroup = document.getElementById('elev-nodes-group');

  if (!trailBg || !nodesGroup) return;

  let points = [];
  nodesGroup.innerHTML = '';

  SCENES_DATA.forEach((s, idx) => {
    const x = 40 + (idx / (TOTAL_SCENES - 1)) * 820;
    // Normalize altitude 2000m to 8611m -> y from 30 down to 6
    const norm = (s.altM - 2000) / (8611 - 2000);
    const y = 32 - norm * 26;
    points.push(`${x},${y}`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '4');
    circle.setAttribute('class', 'elev-node');
    circle.setAttribute('id', `elev-node-${idx}`);
    circle.onclick = () => {
      if (idx === 0 || completedScenes.has(SCENES_DATA[idx - 1].id)) {
        mountScene(idx);
      }
    };
    nodesGroup.appendChild(circle);
  });

  const ptStr = points.join(' ');
  trailBg.setAttribute('points', ptStr);
  if (trailActive) trailActive.setAttribute('points', ptStr);
}

function updateElevationProfile(activeIdx) {
  const nodes = document.querySelectorAll('.elev-node');
  nodes.forEach((n, idx) => {
    n.classList.remove('active', 'completed');
    if (idx === activeIdx) n.classList.add('active');
    if (completedScenes.has(SCENES_DATA[idx].id)) n.classList.add('completed');
  });

  const marker = document.getElementById('elev-bike-marker');
  if (marker) {
    const s = SCENES_DATA[activeIdx];
    const x = 40 + (activeIdx / (TOTAL_SCENES - 1)) * 820;
    const norm = (s.altM - 2000) / (8611 - 2000);
    const y = 32 - norm * 26;
    marker.setAttribute('transform', `translate(${x}, ${y})`);
  }
}

function setupKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft') {
      prevScene();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      const btnNext = document.getElementById('btn-next');
      if (btnNext && !btnNext.disabled) {
        e.preventDefault();
        nextScene();
      }
    }
  });
}
