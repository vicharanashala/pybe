/**
 * The Sorting Investigation - Connecting the Ideas
 * =================================================
 * An independent conceptual learning section between Merge Sort and Timsort
 * Model. It follows one ward-data example through five stages: recognising
 * existing order, the insertion idea, the merge idea, TimSort's own run-based
 * strategy, and a gated knowledge check.
 *
 * This is not an algorithm, not a ninth screen and not part of the Timsort
 * simulator. It only teaches the handoff; the existing simulator stays intact.
 */

const TimsortBridgeModule = (function () {
  "use strict";

  const STAGES = [
    {
      kicker: "Stage A · Understand the problem",
      title: "Real data is often partly ordered",
      copy: "Ward records may already arrive in useful runs: one shift might be recorded in arrival order, while another list is nearly ordered. A good sorting method should notice that instead of starting from nothing.",
      label: "Why existing order matters",
      text: "The coloured groups are natural runs. Reusing this order is less work than rebuilding the whole list, and it is the starting point for TimSort.",
      visual: "runs",
    },
    {
      kicker: "Stage B · Insertion Sort's contribution",
      title: "Extend a short ordered section",
      copy: "Insertion Sort builds a sorted prefix by placing one value at a time. TimSort uses that same placement idea when a natural run is too short: it grows the run before merging.",
      label: "Insertion idea: place one value correctly",
      text: "Our short run is 24, 38. The next record is 12, so an insertion-style placement puts 12 first and extends the run to 12, 24, 38.",
      visual: "insertion",
    },
    {
      kicker: "Stage C · Merge Sort's contribution",
      title: "Combine ordered sections",
      copy: "Merge Sort shows how two sections that are already ordered can be joined by repeatedly taking the smaller front value. Neither section needs to be re-sorted from scratch.",
      label: "Merge idea: join ordered runs",
      text: "Compare the front values of 12, 24, 38 and 45, 58, 73. Taking the smaller available front value each time produces one longer ordered run.",
      visual: "merge",
    },
    {
      kicker: "Stage D · How TimSort connects these ideas",
      title: "Find runs, extend them, then merge adaptively",
      copy: "TimSort begins by detecting natural runs, including descending runs that it reverses. It extends short runs with insertion-style placement and merges ordered runs using its own adaptive strategy.",
      label: "TimSort's own strategy",
      text: "It is not Insertion Sort followed by Merge Sort, and it does not split the list into halves. Run detection and adaptive merging decide which work is needed for this particular data.",
      visual: "timsort",
    },
    {
      kicker: "Stage E · Knowledge check",
      title: "Check the connections",
      copy: "Choose the statement that gives each algorithm its correct role and describes TimSort as its own adaptive strategy.",
      label: "One careful choice",
      text: "You can retry as often as you need. Opening this section alone does not earn completion credit; a correct answer does.",
      visual: "recap",
    },
  ];

  const RUNS = [
    { label: "Short ascending run", tone: "ascending", values: [24, 38] },
    { label: "Ascending run", tone: "ascending", values: [12, 45, 58, 73] },
    { label: "Descending run", tone: "descending", values: [91, 64, 50] },
  ];

  const PIPELINE_LABELS = [
    "Detect natural runs",
    "Reverse descending runs",
    "Extend short runs",
    "Merge adaptively",
  ];

  const CHECK_OPTIONS = [
    {
      key: "conceptual",
      label: "TimSort detects natural runs, reverses descending runs where needed, extends short runs with insertion-style placement, and merges ordered runs using its own adaptive strategy.",
    },
    {
      key: "halves",
      label: "TimSort splits the list into halves, insertion-sorts each half and then combines them exactly like the Merge Sort model.",
    },
    {
      key: "rename",
      label: "Insertion Sort and Merge Sort are two names for the same operation, and TimSort is just a new name for doing them together.",
    },
    {
      key: "ignore-order",
      label: "TimSort ignores any order already in the data and always rebuilds the entire list from scratch before sorting it.",
    },
  ];

  const CHECK_FEEDBACK = {
    halves: "Not quite. TimSort does not begin by halving the list; it starts by finding order that is already present in natural runs.",
    rename: "Not quite. Insertion and Merge Sort teach different operations. TimSort borrows ideas from both, but it is its own adaptive algorithm.",
    "ignore-order": "Not quite. Noticing existing order is the point: natural runs are found, extended and merged rather than ignored.",
  };

  const els = {};
  let initialized = false;
  let stageIndex = 0;
  let visitedFinalStage = false;
  let checkAnsweredCorrectly = false;
  let completionAwarded = false;
  let checkOrder = CHECK_OPTIONS.map((option) => option.key);

  function currentStage() {
    return STAGES[stageIndex];
  }

  function milestoneEarned() {
    if (!window.App || typeof window.App.getProgress !== "function") return false;
    const progress = window.App.getProgress();
    return !!(progress.milestones && progress.milestones["sim.connection"]);
  }

  function syncCompletion() {
    completionAwarded = milestoneEarned();
    if (completionAwarded) checkAnsweredCorrectly = true;
    return completionAwarded;
  }

  function cell(value, extraClass) {
    return `<span class="bridge-cell${extraClass ? " " + extraClass : ""}">${value}</span>`;
  }

  function cells(values, extraClass) {
    if (!values.length) return '<span class="bridge-empty-cell">empty</span>';
    return values.map((value) => cell(value, extraClass)).join("");
  }

  function runGroup(label, values, tone) {
    return (
      `<div class="bridge-run-group ${tone}"><span class="bridge-group-label">${label}</span>` +
      `<div class="bridge-cells">${cells(values, tone === "descending" ? "is-muted" : "is-sorted")}</div></div>`
    );
  }

  function renderRuns() {
    return (
      '<div class="bridge-run-strip" aria-label="One ward dataset with three natural runs">' +
      RUNS.map((run) => runGroup(run.label, run.values, run.tone)).join("") +
      "</div>"
    );
  }

  function renderInsertion() {
    return (
      '<div class="bridge-flow" aria-label="Insertion-style extension of a short run">' +
      '<div class="bridge-flow-block"><span class="bridge-group-label">Short run</span>' +
      `<div class="bridge-cells">${cells([24, 38], "is-sorted")}</div>` +
      '<span class="bridge-group-label next-label">Next value</span>' +
      `<div class="bridge-cells">${cell(12, "is-key")}</div></div>` +
      '<span class="bridge-flow-arrow" aria-hidden="true">→</span>' +
      '<div class="bridge-flow-block result"><span class="bridge-group-label">Extended run</span>' +
      `<div class="bridge-cells">${cells([12, 24, 38], "is-sorted")}</div></div>` +
      "</div>"
    );
  }

  function renderMerge() {
    const group = (label, values, tone) =>
      `<div class="bridge-merge-group ${tone}"><span class="bridge-group-label">${label}</span>` +
      `<div class="bridge-cells">${cells(values, "is-sorted")}</div></div>`;

    return (
      '<div class="bridge-merge-stage" aria-label="Two ordered runs joining into one">' +
      group("Ordered run A", [12, 24, 38], "bridge-section-a") +
      '<span class="bridge-merge-arrow" aria-hidden="true">→</span>' +
      group("Ordered run B", [45, 58, 73], "bridge-section-b") +
      '<span class="bridge-merge-arrow" aria-hidden="true">→</span>' +
      group("Longer ordered run", [12, 24, 38, 45, 58, 73], "output") +
      "</div>"
    );
  }

  function renderTimsort() {
    const steps = PIPELINE_LABELS.map((label, index) => {
      const state = index === PIPELINE_LABELS.length - 1 ? " active" : " done";
      return `<span class="bridge-pipeline-step${state}">${label}</span>`;
    }).join('<span class="bridge-pipeline-arrow" aria-hidden="true">→</span>');

    return (
      '<div class="bridge-timsort-stage" aria-label="How TimSort uses the two ideas">' +
      `<div class="bridge-pipeline">${steps}</div>` +
      '<div class="bridge-run-groups">' +
      runGroup("Detected runs", [24, 38], "ascending") +
      runGroup("Descending run to reverse", [91, 64, 50], "descending") +
      "</div>" +
      '<div class="bridge-run-groups bridge-final-runs">' +
      runGroup("Extended and reversed", [12, 24, 38], "extended") +
      runGroup("Ready to merge", [45, 58, 73], "ascending") +
      runGroup("Ready to merge", [50, 64, 91], "reversed") +
      "</div>" +
      '<div class="bridge-final-array"><span class="bridge-group-label">Adaptive merge result</span>' +
      `<div class="bridge-cells">${cells([12, 24, 38, 45, 50, 58, 64, 73, 91], "is-output")}</div></div>` +
      "</div>"
    );
  }

  function renderRecap() {
    return (
      '<div class="bridge-recap-grid" aria-label="Concept recap">' +
      '<div class="bridge-recap-item insertion"><strong>Insertion idea</strong><span>Extend short ordered runs.</span></div>' +
      '<div class="bridge-recap-item merge"><strong>Merge idea</strong><span>Combine ordered runs.</span></div>' +
      '<div class="bridge-recap-item timsort"><strong>TimSort strategy</strong><span>Find, prepare and adaptively merge runs.</span></div>' +
      "</div>"
    );
  }

  function renderVisual() {
    if (!els.visual) return;
    const kind = currentStage().visual;
    if (kind === "runs") els.visual.innerHTML = renderRuns();
    else if (kind === "insertion") els.visual.innerHTML = renderInsertion();
    else if (kind === "merge") els.visual.innerHTML = renderMerge();
    else if (kind === "timsort") els.visual.innerHTML = renderTimsort();
    else els.visual.innerHTML = renderRecap();
  }

  function renderProgress() {
    if (!els.progressFill || !els.progressBar) return;
    const percent = Math.round(((stageIndex + 1) / STAGES.length) * 100);
    els.progressFill.style.width = percent + "%";
    els.progressBar.setAttribute("aria-valuenow", String(percent));
    els.progressBar.setAttribute("aria-valuetext", `Stage ${stageIndex + 1} of ${STAGES.length}`);

    document.querySelectorAll(".bridge-progress-step").forEach((step) => {
      const index = Number(step.getAttribute("data-stage"));
      step.classList.toggle("active", index === stageIndex);
      step.classList.toggle("done", index < stageIndex);
      if (index === stageIndex) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
  }

  function renderCheckOptions() {
    if (!els.checkOptions) return;
    els.checkOptions.innerHTML = "";

    if (window.RandomizeModule && typeof window.RandomizeModule.shuffled === "function") {
      checkOrder = window.RandomizeModule.shuffled(CHECK_OPTIONS).map((option) => option.key);
    } else {
      checkOrder = CHECK_OPTIONS.map((option) => option.key);
    }

    checkOrder.forEach((key) => {
      const option = CHECK_OPTIONS.find((item) => item.key === key);
      if (!option) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bridge-check-option btn btn-outline btn-sm";
      button.setAttribute("data-answer", option.key);
      button.textContent = option.label;
      button.disabled = checkAnsweredCorrectly;
      if (typeof button.addEventListener === "function") {
        button.addEventListener("click", () => answerCheck(option.key));
      }
      els.checkOptions.appendChild(button);
    });
  }

  function clearFeedback() {
    if (!els.feedback) return;
    els.feedback.textContent = "";
    els.feedback.classList.remove("is-correct", "is-incorrect");
  }

  function render() {
    if (!initialized) return;
    const stage = currentStage();
    const isFinalStage = stageIndex === STAGES.length - 1;

    if (els.stageKicker) els.stageKicker.textContent = stage.kicker;
    if (els.stageCounter) els.stageCounter.textContent = `Stage ${stageIndex + 1} of ${STAGES.length}`;
    if (els.stageTitle) els.stageTitle.textContent = stage.title;
    if (els.stageCopy) els.stageCopy.textContent = stage.copy;
    if (els.operationLabel) els.operationLabel.textContent = stage.label;
    if (els.explanationText) els.explanationText.textContent = stage.text;

    renderVisual();
    renderProgress();

    if (els.prevBtn) els.prevBtn.disabled = stageIndex === 0;
    if (els.nextBtn) els.nextBtn.disabled = isFinalStage;
    if (els.continueBtn) {
      els.continueBtn.style.display = isFinalStage && checkAnsweredCorrectly ? "inline-flex" : "none";
    }
    if (els.checkPanel) els.checkPanel.style.display = isFinalStage ? "block" : "none";
    if (els.completeBadge) els.completeBadge.hidden = !checkAnsweredCorrectly;

    if (els.checkOptions) {
      Array.from(els.checkOptions.children).forEach((button) => {
        button.disabled = checkAnsweredCorrectly;
      });
    }
  }

  function focusPanel() {
    if (els.panel && typeof els.panel.focus === "function") els.panel.focus();
  }

  function activate() {
    if (!initialized) init();
    syncCompletion();
    if (els.panel) els.panel.style.display = "block";
    render();
    focusPanel();
    return true;
  }

  function deactivate() {
    if (!initialized) return;
    if (els.panel) els.panel.style.display = "none";
  }

  function next() {
    if (!initialized) init();
    if (stageIndex < STAGES.length - 1) {
      stageIndex += 1;
      if (stageIndex === STAGES.length - 1) visitedFinalStage = true;
      render();
      if (stageIndex === STAGES.length - 1 && els.checkOptions && els.checkOptions.children[0]) {
        const firstOption = els.checkOptions.children[0];
        if (typeof firstOption.focus === "function") firstOption.focus();
      }
    }
  }

  function previous() {
    if (!initialized) init();
    if (stageIndex > 0) {
      stageIndex -= 1;
      render();
    }
  }

  function restart() {
    if (!initialized) init();
    syncCompletion();
    stageIndex = 0;
    visitedFinalStage = false;
    checkAnsweredCorrectly = completionAwarded;
    clearFeedback();
    renderCheckOptions();
    render();
    focusPanel();
  }

  function continueToTimsort() {
    if (!initialized) init();
    if (window.SimulatorModule && typeof window.SimulatorModule.setAlgorithm === "function") {
      window.SimulatorModule.setAlgorithm("timsort");
    }
  }

  function answerCheck(choice) {
    if (!initialized) init();
    if (stageIndex !== STAGES.length - 1 || !visitedFinalStage) {
      return { correct: false, message: "Work through all five stages before answering." };
    }

    if (choice === "conceptual") {
      checkAnsweredCorrectly = true;
      completionAwarded = true;
      if (els.feedback) {
        els.feedback.textContent =
          "Correct. TimSort detects natural runs, reverses descending runs, extends short runs with insertion-style placement, and merges ordered runs with its own adaptive strategy.";
        els.feedback.classList.remove("is-incorrect");
        els.feedback.classList.add("is-correct");
      }
      if (window.App && typeof window.App.playSound === "function") window.App.playSound("tap");
      if (!milestoneEarned() && window.App && typeof window.App.awardMilestone === "function") {
        window.App.awardMilestone("sim.connection");
      }
      if (window.SimulatorModule && typeof window.SimulatorModule.refreshProgression === "function") {
        window.SimulatorModule.refreshProgression();
      }
      render();
      return { correct: true, message: els.feedback ? els.feedback.textContent : "Correct." };
    }

    const message = CHECK_FEEDBACK[choice] || "Not quite. Think about natural runs and adaptive merging.";
    if (els.feedback) {
      els.feedback.textContent = message;
      els.feedback.classList.remove("is-correct");
      els.feedback.classList.add("is-incorrect");
    }
    if (window.App && typeof window.App.playSound === "function") window.App.playSound("error");
    return { correct: false, message };
  }

  function reset() {
    if (!initialized) init();
    syncCompletion();
    stageIndex = 0;
    visitedFinalStage = false;
    checkAnsweredCorrectly = completionAwarded;
    clearFeedback();
    renderCheckOptions();
    render();
  }

  function reshuffleCheck() {
    if (!initialized) init();
    renderCheckOptions();
    return checkOrder.slice();
  }

  function init() {
    if (initialized) return;
    initialized = true;

    els.panel = document.getElementById("sim-connection-panel");
    els.progressBar = document.getElementById("bridge-progress-bar");
    els.progressFill = document.getElementById("bridge-progress-fill");
    els.stageKicker = document.getElementById("bridge-stage-kicker");
    els.stageCounter = document.getElementById("bridge-stage-counter");
    els.stageTitle = document.getElementById("bridge-stage-title");
    els.stageCopy = document.getElementById("bridge-stage-copy");
    els.visual = document.getElementById("bridge-visual");
    els.operationLabel = document.getElementById("bridge-operation-label");
    els.explanationText = document.getElementById("bridge-explanation-text");
    els.prevBtn = document.getElementById("bridge-prev-btn");
    els.restartBtn = document.getElementById("bridge-restart-btn");
    els.nextBtn = document.getElementById("bridge-next-btn");
    els.continueBtn = document.getElementById("bridge-continue-btn");
    els.checkPanel = document.getElementById("bridge-check-panel");
    els.checkOptions = document.getElementById("bridge-check-options");
    els.feedback = document.getElementById("bridge-check-feedback");
    els.completeBadge = document.getElementById("bridge-complete-badge");

    if (els.prevBtn && typeof els.prevBtn.addEventListener === "function") {
      els.prevBtn.addEventListener("click", previous);
    }
    if (els.nextBtn && typeof els.nextBtn.addEventListener === "function") {
      els.nextBtn.addEventListener("click", next);
    }
    if (els.restartBtn && typeof els.restartBtn.addEventListener === "function") {
      els.restartBtn.addEventListener("click", restart);
    }
    if (els.continueBtn && typeof els.continueBtn.addEventListener === "function") {
      els.continueBtn.addEventListener("click", continueToTimsort);
    }

    syncCompletion();
    renderCheckOptions();
    render();
  }

  function getState() {
    return {
      stageIndex,
      stageCount: STAGES.length,
      visitedFinalStage,
      checkAnsweredCorrectly,
      completionAwarded,
      panelVisible: !!(els.panel && els.panel.style.display === "block"),
      checkVisible: !!(els.checkPanel && els.checkPanel.style.display === "block"),
      badgeVisible: !!(els.completeBadge && !els.completeBadge.hidden),
      continueVisible: !!(els.continueBtn && els.continueBtn.style.display !== "none"),
      checkOrder: checkOrder.slice(),
      stageLabel: currentStage().label,
      stageText: currentStage().text,
    };
  }

  return {
    init,
    activate,
    deactivate,
    next,
    previous,
    restart,
    reset,
    answerCheck,
    reshuffleCheck,
    isComplete: () => completionAwarded || milestoneEarned(),
    getState,
  };
})();

window.TimsortBridgeModule = TimsortBridgeModule;
