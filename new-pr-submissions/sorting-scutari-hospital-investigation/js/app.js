/**
 * The Sorting Investigation - Main Application Controller
 * Handles screen transitions, milestone progress, audio effects,
 * confetti animations, and modal dialogs.
 */

const App = (function () {
  const TOTAL_SCREENS = 8;
  const STORAGE_KEY = "sorting_investigation_state_v1";

  // Durable milestones: key -> screen + human label (keys are fixed).
  const MILESTONES = {
    "story.scenes": { screen: 2, label: "Explore the historical scenes" },
    "evidence.compared": { screen: 3, label: "Compare the evidence" },
    "game.allLevels": { screen: 4, label: "Complete every sorting level" },
    "sim.bubble": { screen: 5, label: "Understand Bubble Sort" },
    "sim.insertion": { screen: 5, label: "Understand Insertion Sort" },
    "sim.merge": { screen: 5, label: "Understand Merge Sort" },
    "sim.connection": { screen: 5, label: "Complete the conceptual connection section" },
    "sim.timsort": { screen: 5, label: "Understand the Timsort model" },
    "comparison.benchmark": { screen: 5, label: "Compare with a chosen dataset" },
    "python.sorting": { screen: 6, label: "Practise sorted() in Python" },
    "exercises.complete": { screen: 7, label: "Finish all exercises" },
    "mission.complete": { screen: 8, label: "Complete the final mission" },
  };

  // Screen 2..8 each require their full milestone set before unlocking the next.
  const SCREEN_REQUIREMENTS = {
    2: ["story.scenes"],
    3: ["evidence.compared"],
    4: ["game.allLevels"],
    5: ["sim.bubble", "sim.insertion", "sim.merge", "sim.connection", "sim.timsort", "comparison.benchmark"],
    6: ["python.sorting"],
    7: ["exercises.complete"],
    8: ["mission.complete"],
  };

  const MILESTONE_KEYS = Object.keys(MILESTONES);
  const TOTAL_MILESTONES = MILESTONE_KEYS.length;
  const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function defaultState() {
    return {
      currentScreen: 1,
      completedScreens: [1],
      unlockedScreens: [1, 2],
      milestones: {},
      soundEnabled: true,
      visitedScenes: [],
    };
  }

  let state = defaultState();
  let audioCtx = null;
  let activeModal = null;
  let modalOpener = null;

  // ---------- helpers ----------
  function isScreen(n) {
    return Number.isInteger(n) && n >= 1 && n <= TOTAL_SCREENS;
  }

  function clampScreen(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 1;
    return Math.min(TOTAL_SCREENS, Math.max(1, Math.trunc(n)));
  }

  function normalizeScreenList(value, fallback) {
    const source = Array.isArray(value) ? value : isScreen(value) ? [value] : fallback;
    const result = [];
    source.forEach((item) => {
      const n = Number(item);
      if (Number.isInteger(n) && isScreen(n) && !result.includes(n)) result.push(n);
    });
    return result.length ? result : fallback.slice();
  }

  function requirementsMetFor(source, screen) {
    const required = SCREEN_REQUIREMENTS[screen] || [];
    return required.length > 0 && required.every((key) => !!source.milestones[key]);
  }

  // Mark one screen complete and unlock only the immediate next screen.
  function markComplete(source, screen) {
    if (!isScreen(screen)) return;
    if (!source.completedScreens.includes(screen)) source.completedScreens.push(screen);
    if (screen < TOTAL_SCREENS && !source.unlockedScreens.includes(screen + 1)) {
      source.unlockedScreens.push(screen + 1);
    }
  }

  function canNavigate(source, screen) {
    return screen === 1 || source.completedScreens.includes(screen) || source.unlockedScreens.includes(screen);
  }

  // Old saved "completedScreens" become unlocks only, never milestone credit.
  function normalizeState(raw) {
    const next = defaultState();
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return next;

    if (typeof raw.soundEnabled === "boolean") next.soundEnabled = raw.soundEnabled;
    next.currentScreen = clampScreen(raw.currentScreen == null ? 1 : raw.currentScreen);

    const legacyCompleted = normalizeScreenList(raw.completedScreens, [1]);
    const savedUnlocked = normalizeScreenList(raw.unlockedScreens, []);
    next.completedScreens = [1];
    next.unlockedScreens = [1, 2];
    legacyCompleted.concat(savedUnlocked).forEach((s) => {
      if (!next.unlockedScreens.includes(s)) next.unlockedScreens.push(s);
    });

    if (raw.milestones && typeof raw.milestones === "object" && !Array.isArray(raw.milestones)) {
      MILESTONE_KEYS.forEach((key) => {
        if (raw.milestones[key]) next.milestones[key] = true;
      });
    }

    next.visitedScenes = normalizeScreenList(raw.visitedScenes, []);

    // Reconcile completion with any saved milestones (no effect on legacy saves).
    Object.keys(SCREEN_REQUIREMENTS).forEach((s) => {
      if (requirementsMetFor(next, Number(s))) markComplete(next, Number(s));
    });

    if (!canNavigate(next, next.currentScreen)) next.currentScreen = 1;
    return next;
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      return false;
    }
  }

  // ---------- persistence ----------
  function jsonParseSafe(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = jsonParseSafe(saved);
        if (parsed) state = normalizeState(parsed);
      }
    } catch (e) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // ---------- progress API ----------
  function getProgress() {
    const screenRequirements = {};
    Object.keys(SCREEN_REQUIREMENTS).forEach((s) => {
      screenRequirements[s] = SCREEN_REQUIREMENTS[s].slice();
    });
    return {
      currentScreen: state.currentScreen,
      completedScreens: state.completedScreens.slice(),
      unlockedScreens: state.unlockedScreens.slice(),
      milestones: { ...state.milestones },
      earnedCount: MILESTONE_KEYS.filter((key) => !!state.milestones[key]).length,
      totalCount: TOTAL_MILESTONES,
      screenRequirements,
    };
  }

  function awardMilestone(key) {
    if (!Object.prototype.hasOwnProperty.call(MILESTONES, key)) return false;
    if (state.milestones[key]) return false;

    state.milestones[key] = true;
    const screen = MILESTONES[key].screen;
    if (requirementsMetFor(state, screen)) markComplete(state, screen);
    saveState();
    updateStepperUI();
    return true;
  }

  // Legacy compatibility only; modules should use awardMilestone instead.
  function completeScreen(screenNumber) {
    const screen = Number(screenNumber);
    if (!isScreen(screen)) return;
    markComplete(state, screen);
    saveState();
    updateStepperUI();
  }

  // ---------- navigation ----------
  function goToScreen(screenNumber) {
    const target = Number(screenNumber);
    if (!isScreen(target) || !canNavigate(state, target)) return;

    // Only pause the simulator when actually leaving it; never reset on entry.
    if (state.currentScreen === 5 && target !== 5 && window.SimulatorModule && window.SimulatorModule.pause) {
      window.SimulatorModule.pause();
    }

    state.currentScreen = target;
    if (!state.visitedScenes.includes(target)) state.visitedScenes.push(target);
    saveState();

    for (let i = 1; i <= TOTAL_SCREENS; i++) {
      const el = document.getElementById(`screen-${i}`);
      if (el) el.classList.toggle("active", i === target);
    }

    updateStepperUI();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function updateStepperUI() {
    const stepperContainer = document.getElementById("stepper-items");
    if (stepperContainer) {
      stepperContainer.querySelectorAll(".step-btn").forEach((btn) => {
        const stepNum = parseInt(btn.getAttribute("data-screen"), 10);
        const isActive = stepNum === state.currentScreen;
        const isCompleted = state.completedScreens.includes(stepNum);
        const isUnlocked = state.unlockedScreens.includes(stepNum) || isCompleted;
        const allowed = canNavigate(state, stepNum);

        btn.classList.toggle("active", isActive);
        btn.classList.toggle("completed", isCompleted);
        btn.classList.toggle("unlocked", isUnlocked && !isCompleted);
        if (isActive) {
          btn.setAttribute("aria-current", "step");
        } else {
          btn.removeAttribute("aria-current");
        }
        btn.disabled = !allowed;
        btn.setAttribute("aria-disabled", String(!allowed));
      });
    }

    const progressCounter = document.getElementById("header-progress-text");
    if (progressCounter) {
      const progress = getProgress();
      progressCounter.textContent =
        `Milestones ${progress.earnedCount} of ${progress.totalCount} · Screen ${progress.currentScreen} of ${TOTAL_SCREENS}`;
    }
  }

  function resetProgress() {
    const soundEnabled = state.soundEnabled;
    state = defaultState();
    state.soundEnabled = soundEnabled;
    saveState();

    [
      window.StoryModule,
      window.EvidenceModule,
      window.SortGameModule,
      window.SimulatorModule,
      window.TimsortBridgeModule,
      window.PythonLearnModule,
      window.ExercisesModule,
      window.FinalMissionModule,
    ].forEach((module) => {
      if (module && typeof module.reset === "function") module.reset();
    });

    updateSoundUI();
    goToScreen(1);
    closeAllModals();
  }

  // ---------- audio ----------
  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "tap") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "success") {
        // Bright two-tone chime (E5 -> B5)
        osc.type = "triangle";
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(987.77, now + 0.1);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "fanfare") {
        // Grand 3-tone arpeggio (C5 -> E5 -> G5)
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  function updateSoundUI() {
    const soundBtn = document.getElementById("btn-toggle-sound");
    if (!soundBtn) return;
    soundBtn.textContent = state.soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
    soundBtn.classList.toggle("active", state.soundEnabled);
    soundBtn.setAttribute("aria-pressed", String(state.soundEnabled));
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    updateSoundUI();
  }

  // ---------- confetti ----------
  function triggerConfetti() {
    if (prefersReducedMotion()) return;
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#fef08a"];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1.5) * 10,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let animationFrame = null;
    const startTime = performance.now();

    function render(time) {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.vr;
        if (elapsed > 1200) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive && elapsed < 3500) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    animationFrame = requestAnimationFrame(render);
  }

  // ---------- modals ----------
  function getFocusable(modal) {
    return Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => !el.hidden);
  }

  function openModal(modalId, opener) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (!activeModal) modalOpener = opener || document.activeElement || null;
    if (activeModal && activeModal !== modal) {
      activeModal.classList.remove("open");
      activeModal.setAttribute("aria-hidden", "true");
    }

    activeModal = modal;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    const focusables = getFocusable(modal);
    const closeBtn = modal.querySelector(".modal-close-btn");
    const target = focusables[0] || closeBtn || modal;
    if (target === modal && !modal.hasAttribute("tabindex")) modal.setAttribute("tabindex", "-1");
    if (typeof target.focus === "function") target.focus();
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach((m) => {
      m.classList.remove("open");
      m.setAttribute("aria-hidden", "true");
    });
    activeModal = null;
    if (modalOpener && typeof modalOpener.focus === "function") modalOpener.focus();
    modalOpener = null;
  }

  function handleDocumentKeys(e) {
    if (e.key === "Escape") {
      closeAllModals();
      return;
    }
    if (e.key !== "Tab" || !activeModal) return;

    const focusables = getFocusable(activeModal);
    if (!focusables.length) {
      e.preventDefault();
      if (!activeModal.hasAttribute("tabindex")) activeModal.setAttribute("tabindex", "-1");
      activeModal.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement;

    if (!activeModal.contains(current)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && current === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    } else if (current === activeModal) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }

  // ---------- bootstrap ----------
  function init() {
    loadSavedState();

    // Render Landing Illustrations
    const heroArt = document.getElementById("hero-illustration-box");
    if (heroArt) {
      heroArt.innerHTML = `
        <div class="historical-img-frame">
          <img src="assets/images/hero_scutari_hospital.jpg" alt="The Hospital at Scutari (Lithograph by Day & Son, 1856, after William Simpson)" class="hero-historical-img">
          <div class="historical-img-caption">The Hospital at Scutari (Lithograph by Day & Son, 1856, after William Simpson)</div>
        </div>
      `;
    }

    const brandIcon = document.getElementById("header-brand-icon");
    if (brandIcon && window.SVGIcons) {
      const emblemSvg = window.SVGIcons.emblem || window.SVGIcons.logo || window.SVGIcons.lantern;
      if (emblemSvg && !brandIcon.firstElementChild) {
        brandIcon.innerHTML = emblemSvg;
      }
    }

    // Start Investigation CTA Button - unlock screen 2 without milestone credit.
    const startBtn = document.getElementById("btn-start-investigation");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        if (!state.unlockedScreens.includes(2)) state.unlockedScreens.push(2);
        saveState();
        goToScreen(2);
      });
    }

    // Stepper navigation clicks (goToScreen enforces access).
    document.querySelectorAll(".step-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        goToScreen(parseInt(btn.getAttribute("data-screen"), 10));
      });
    });

    // Reset Progress modal hooks
    const resetTrigger = document.getElementById("btn-reset-progress");
    const confirmResetBtn = document.getElementById("modal-confirm-reset-btn");
    const cancelResetBtn = document.getElementById("modal-cancel-reset-btn");

    if (resetTrigger) resetTrigger.addEventListener("click", () => openModal("modal-reset"));
    if (confirmResetBtn) confirmResetBtn.addEventListener("click", resetProgress);
    if (cancelResetBtn) cancelResetBtn.addEventListener("click", closeAllModals);

    // Historical Info modal hooks
    const historyInfoBtn = document.getElementById("btn-history-info");
    const closeHistoryBtn = document.getElementById("modal-history-close");
    if (historyInfoBtn) historyInfoBtn.addEventListener("click", () => openModal("modal-history"));
    if (closeHistoryBtn) closeHistoryBtn.addEventListener("click", closeAllModals);

    // Sound toggle
    const soundBtn = document.getElementById("btn-toggle-sound");
    if (soundBtn) {
      updateSoundUI();
      soundBtn.addEventListener("click", toggleSound);
    }

    // Close modals on overlay backdrop click or ESC key; trap Tab in open modal.
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });
    document.addEventListener("keydown", handleDocumentKeys);

    // Initialize Submodules
    if (window.StoryModule) window.StoryModule.init();
    if (window.EvidenceModule) window.EvidenceModule.init();
    if (window.SortGameModule) window.SortGameModule.init();
    if (window.SimulatorModule) window.SimulatorModule.init();
    if (window.TimsortBridgeModule) window.TimsortBridgeModule.init();
    if (window.PythonLearnModule) window.PythonLearnModule.init();
    if (window.ExercisesModule) window.ExercisesModule.init();
    if (window.FinalMissionModule) window.FinalMissionModule.init();

    goToScreen(state.currentScreen || 1);
  }

  return {
    init,
    goToScreen,
    completeScreen,
    resetProgress,
    playSound,
    triggerConfetti,
    openModal,
    closeAllModals,
    awardMilestone,
    getProgress,
  };
})();

window.App = App;

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
