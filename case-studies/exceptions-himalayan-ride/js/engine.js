/* ==========================================================================
   THE HIGH PASS v3 — STORY ENGINE & NAVIGATION CONTROLLER
   Single source state machine · 12 action-first scenes · Locked-Next enforcement
   ========================================================================== */

let currentSceneIndex = 0;
const TOTAL_SCENES = SCENES_DATA.length;
const completedScenes = new Set();
const litLamps = new Set();

// Feedback toast utility (used across all interaction modules)
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
  if (typeof validateScenesData === 'function') {
    const report = validateScenesData(SCENES_DATA);
    if (!report.valid) {
      console.warn('Scenes Data Validation Warnings:', report.errors);
    }
  }

  mountScene(currentSceneIndex);
  setupKeyboardNavigation();
  initElevationProfile();
  preloadNextPhoto(currentSceneIndex + 1);
}

function mountScene(index) {
  if (index < 0 || index >= TOTAL_SCENES) return;
  currentSceneIndex = index;
  const scene = SCENES_DATA[index];

  // Reset drag system state between scenes
  if (typeof DragKit !== 'undefined' && DragKit.reset) {
    DragKit.reset();
  }

  // 1. Update Top HUD
  const stepPill = document.getElementById('hud-step-counter');
  if (stepPill) {
    stepPill.textContent = `${String(scene.id).padStart(2, '0')} / ${String(TOTAL_SCENES).padStart(2, '0')}`;
  }

  // Check if scene automatically seeds a lit lamp
  if (scene.lampLit) {
    litLamps.add(scene.lampLit);
  }
  updateDashboardLamps();

  // 2. Update Photo Stage
  const photoBg = document.getElementById('photo-stage-bg');
  if (photoBg) {
    photoBg.style.backgroundImage = `url('${scene.photo}')`;
    photoBg.setAttribute('aria-label', scene.photoAlt || scene.place);
  }

  const actPill = document.getElementById('photo-act-pill');
  if (actPill) actPill.textContent = scene.actTitle;

  const placeName = document.getElementById('photo-place-name');
  if (placeName) placeName.textContent = scene.place;

  const elevVal = document.getElementById('photo-elevation-value');
  if (elevVal) elevVal.textContent = scene.altDisplay;

  // 3. Update Radio Bubble
  const radioBubble = document.getElementById('radio-bubble');
  const radioSpeaker = document.getElementById('radio-speaker');
  const radioText = document.getElementById('radio-text');

  if (radioBubble && scene.radio) {
    radioBubble.removeAttribute('hidden');
    if (radioSpeaker) radioSpeaker.textContent = scene.radio.speaker;
    if (radioText) radioText.textContent = scene.radio.text;
  } else if (radioBubble) {
    radioBubble.setAttribute('hidden', '');
  }

  // 4. Update Narration Bar
  const narrBar = document.getElementById('stage-narration-text');
  if (narrBar) narrBar.textContent = scene.narration;

  // 5. Update Navigation Buttons (Next is LOCKED until action complete)
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (btnPrev) btnPrev.disabled = (index === 0);

  const isAlreadyCompleted = completedScenes.has(scene.id);
  if (btnNext) {
    if (index === TOTAL_SCENES - 1) {
      btnNext.innerHTML = '<span>Replay Expedition ↺</span>';
      btnNext.classList.remove('locked');
      btnNext.disabled = false;
      btnNext.onclick = () => mountScene(0);
    } else {
      btnNext.innerHTML = '<span>Next Stage</span> <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
      btnNext.onclick = () => nextScene();

      btnNext.disabled = false;
      if (isAlreadyCompleted) {
        btnNext.classList.remove('locked');
      } else {
        btnNext.classList.add('locked');
      }
    }
  }

  // 6. Mount Scene Interaction
  const interLayer = document.getElementById('interaction-layer');
  if (interLayer) {
    interLayer.innerHTML = '';
    const onActionComplete = () => {
      completedScenes.add(scene.id);
      if (scene.lampLit) {
        litLamps.add(scene.lampLit);
        updateDashboardLamps(scene.lampLit);
      }
      if (btnNext) {
        btnNext.classList.remove('locked');
        btnNext.classList.add('unlocked-pulse');
      }
    };

    dispatchInteraction(scene, interLayer, onActionComplete);
  }

  // 7. Update Quick Check Drawer
  renderQuickCheck(scene);

  // 8. Update Elevation Profile Footer
  updateElevationProfile(index);

  // Preload next image
  preloadNextPhoto(index + 1);
}

function dispatchInteraction(scene, container, onComplete) {
  switch (scene.verb) {
    case 'pack':
      if (typeof mountPackInteraction === 'function') {
        mountPackInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'wrap':
      if (typeof mountWrapInteraction === 'function') {
        mountWrapInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'match':
      if (typeof mountMatchInteraction === 'function') {
        mountMatchInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'wire':
      if (typeof mountWireInteraction === 'function') {
        mountWireInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'predict':
      if (typeof mountPredictInteraction === 'function') {
        mountPredictInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'timer':
      if (typeof mountTimerInteraction === 'function') {
        mountTimerInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'order':
      if (typeof mountOrderInteraction === 'function') {
        mountOrderInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'flip':
      if (typeof mountFlipInteraction === 'function') {
        mountFlipInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'runbreak':
      if (typeof mountRunbreakInteraction === 'function') {
        mountRunbreakInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'tapline':
      if (typeof mountTaplineInteraction === 'function') {
        mountTaplineInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'flag':
      if (typeof mountFlagInteraction === 'function') {
        mountFlagInteraction(container, scene.interactionData, onComplete);
      }
      break;
    case 'collect':
      if (typeof mountCollectInteraction === 'function') {
        mountCollectInteraction(container, scene.interactionData, onComplete);
      }
      break;
    default:
      container.innerHTML = `<div class="interaction-dock"><button class="ride-btn" onclick="this.disabled=true; onComplete();">Complete Interaction</button></div>`;
      break;
  }
}

function updateDashboardLamps(justLitStage = null) {
  const lamps = document.querySelectorAll('.lamp');
  lamps.forEach(lamp => {
    const stage = lamp.dataset.stage;
    if (litLamps.has(stage)) {
      lamp.classList.add('lit');
      if (stage === justLitStage) {
        lamp.classList.add('just-lit');
        setTimeout(() => lamp.classList.remove('just-lit'), 700);
      }
    } else {
      lamp.classList.remove('lit');
    }
  });
}

function lightLamp(stage) {
  if (stage) {
    litLamps.add(stage);
    updateDashboardLamps(stage);
  }
}
window.lightLamp = lightLamp;
window.updateDashboardLamps = updateDashboardLamps;
window.nextScene = nextScene;
window.prevScene = prevScene;
window.goToScene = goToScene;

function nextScene() {
  const currentScene = SCENES_DATA[currentSceneIndex];
  const btnNext = document.getElementById('btn-next');
  if (!completedScenes.has(currentScene.id)) {
    if (btnNext) {
      btnNext.classList.add('shake');
      setTimeout(() => btnNext.classList.remove('shake'), 450);
    }
    showFeedback(null, 'Complete the trail interaction to unlock the next pass!', 'info', 2500);
    if (typeof playErrorThud === 'function') playErrorThud();
    return;
  }

  if (typeof playUiClick === 'function') playUiClick();
  if (currentSceneIndex < TOTAL_SCENES - 1) {
    mountScene(currentSceneIndex + 1);
  }
}

function prevScene() {
  if (typeof playUiClick === 'function') playUiClick();
  if (currentSceneIndex > 0) {
    mountScene(currentSceneIndex - 1);
  }
}

function goToScene(idx) {
  if (typeof playUiClick === 'function') playUiClick();
  mountScene(idx);
}

function preloadNextPhoto(nextIdx) {
  if (nextIdx < TOTAL_SCENES) {
    const nextPhoto = SCENES_DATA[nextIdx].photo;
    const img = new Image();
    img.src = nextPhoto;
  }
}

/* --------------------------------------------------------------------------
   Quick Check MCQ Drawer
   -------------------------------------------------------------------------- */
function renderQuickCheck(scene) {
  const qcTab = document.getElementById('quickcheck-tab');
  const qcDrawer = document.getElementById('quickcheck-drawer');
  const qcBody = document.getElementById('quickcheck-body');

  if (!scene.quickCheck) {
    if (qcTab) qcTab.setAttribute('hidden', '');
    if (qcDrawer) {
      qcDrawer.setAttribute('hidden', '');
      qcDrawer.classList.remove('open');
    }
    return;
  }

  if (qcTab) qcTab.removeAttribute('hidden');
  if (qcDrawer) {
    qcDrawer.removeAttribute('hidden');
    qcDrawer.classList.remove('open');
  }

  if (!qcBody) return;
  qcBody.innerHTML = '';

  const qc = scene.quickCheck;
  const qTitle = document.createElement('div');
  qTitle.className = 'qc-question';
  qTitle.textContent = qc.question;
  qcBody.appendChild(qTitle);

  const optsContainer = document.createElement('div');
  optsContainer.className = 'qc-options';

  qc.options.forEach((opt, optIdx) => {
    const optBtn = document.createElement('button');
    optBtn.className = 'qc-option';
    optBtn.id = `qc-opt-${optIdx}`;

    optBtn.innerHTML = `
      <span class="qc-letter">${opt.letter}</span>
      <span class="qc-text">${opt.text}</span>
    `;

    optBtn.addEventListener('click', () => {
      optsContainer.querySelectorAll('.qc-option').forEach(b => {
        b.disabled = true;
        b.classList.remove('selected');
      });
      optBtn.classList.add('selected');

      const feedbackBox = document.createElement('div');
      feedbackBox.className = `qc-feedback ${opt.correct ? 'correct' : 'wrong'} fade-in`;
      feedbackBox.textContent = opt.feedback;
      qcBody.appendChild(feedbackBox);

      if (opt.correct) {
        optBtn.classList.add('correct');
        if (typeof playCorrectChime === 'function') playCorrectChime();
      } else {
        optBtn.classList.add('wrong');
        if (typeof playErrorThud === 'function') playErrorThud();
      }
    });

    optsContainer.appendChild(optBtn);
  });

  qcBody.appendChild(optsContainer);
}

function toggleQuickCheckDrawer() {
  const drawer = document.getElementById('quickcheck-drawer');
  if (!drawer) return;
  drawer.classList.toggle('open');
  if (typeof playUiClick === 'function') playUiClick();
}

/* --------------------------------------------------------------------------
   SVG Elevation Profile Engine
   -------------------------------------------------------------------------- */
const PROFILE_WIDTH = 900;
const PROFILE_HEIGHT = 38;
const MIN_ELEV = 6000;
const MAX_ELEV = 18000;

function calculateCoords(idx) {
  const x = 30 + (idx / (TOTAL_SCENES - 1)) * (PROFILE_WIDTH - 60);
  const elev = SCENES_DATA[idx].altFt || 10000;
  const normElev = (elev - MIN_ELEV) / (MAX_ELEV - MIN_ELEV);
  const y = PROFILE_HEIGHT - 6 - normElev * (PROFILE_HEIGHT - 12);
  return { x, y };
}

function initElevationProfile() {
  const bgPolyline = document.getElementById('elev-trail-bg');
  const nodesGroup = document.getElementById('elev-nodes-group');
  if (!bgPolyline || !nodesGroup) return;

  let pointsStr = '';
  nodesGroup.innerHTML = '';

  SCENES_DATA.forEach((s, idx) => {
    const { x, y } = calculateCoords(idx);
    pointsStr += `${x},${y} `;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', idx === 8 ? '4.5' : '2.5');
    circle.setAttribute('fill', idx === 8 ? '#f5b942' : 'rgba(255, 255, 255, 0.4)');
    circle.setAttribute('class', 'elev-node-dot');
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', () => goToScene(idx));

    nodesGroup.appendChild(circle);
  });

  bgPolyline.setAttribute('points', pointsStr.trim());
}

function updateElevationProfile(activeIdx) {
  const activePolyline = document.getElementById('elev-trail-active');
  const marker = document.getElementById('elev-bike-marker');
  if (!activePolyline || !marker) return;

  let activePointsStr = '';
  for (let i = 0; i <= activeIdx; i++) {
    const { x, y } = calculateCoords(i);
    activePointsStr += `${x},${y} `;
  }
  activePolyline.setAttribute('points', activePointsStr.trim());

  const current = calculateCoords(activeIdx);
  marker.setAttribute('transform', `translate(${current.x}, ${current.y})`);
}

/* --------------------------------------------------------------------------
   Keyboard Accessibility Navigation
   -------------------------------------------------------------------------- */
function setupKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextScene();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevScene();
    }
  });
}
