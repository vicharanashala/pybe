/**
 * The Sorting Investigation - Screen 8: Final Investigation & Badge Presentation
 * Climax mission combining the historical Scutari narrative and Python sorting principles.
 */

const FinalMissionModule = (function () {
  let currentStrategy = null;
  let isStrategySelected = false;
  let isSortedCorrectly = false;
  let isQuestion1Answered = false;
  let isQuestion2Answered = false;
  let isQuestion3Answered = false;
  let badgeAwarded = false;

  const ANSWER_GROUPS = [
    ".mission-strat-btn",
    ".mission-q1-btn",
    ".mission-q2-btn",
    ".mission-q3-btn",
  ];

  function shuffleAnswerGroups() {
    if (!window.RandomizeModule || typeof window.RandomizeModule.shuffleGroup !== "function") return;
    ANSWER_GROUPS.forEach((selector) => window.RandomizeModule.shuffleGroup(selector));
  }

  function optionLabel(button, fallback) {
    return button && button.textContent && button.textContent.trim()
      ? button.textContent.trim()
      : fallback;
  }

  function playSound(type) {
    if (window.App && window.App.playSound) window.App.playSound(type);
  }

  function hasCompletionMilestone() {
    if (!window.App || typeof window.App.getProgress !== "function") return false;
    try {
      const progress = window.App.getProgress();
      return !!(progress && progress.milestones && progress.milestones["mission.complete"]);
    } catch (e) {
      return false;
    }
  }

  // A saved badge restores the visible debrief; it is never awarded twice.
  function restoreCompletedState() {
    if (!hasCompletionMilestone()) return;
    currentStrategy = "descending";
    isStrategySelected = true;
    isSortedCorrectly = true;
    isQuestion1Answered = true;
    isQuestion2Answered = true;
    isQuestion3Answered = true;
    badgeAwarded = true;

    document.querySelectorAll(".mission-strat-btn").forEach((b) => {
      const met = b.getAttribute("data-strat") === "descending";
      b.classList.remove("btn-outline", "selected-wrong", "active");
      b.classList.toggle("selected-correct", met);
      b.classList.toggle("btn-primary", met);
      b.setAttribute("aria-pressed", String(met));
    });

    const answerGroups = [
      [".mission-q1-btn", "B"],
      [".mission-q2-btn", "STABLE"],
      [".mission-q3-btn", "TIMSORT"],
    ];
    answerGroups.forEach(([selector, answer]) => {
      document.querySelectorAll(selector).forEach((b) => {
        const met = b.getAttribute("data-val") === answer;
        b.classList.remove("btn-outline", "selected-wrong", "active");
        b.classList.toggle("selected-correct", met);
        b.classList.toggle("btn-primary", met);
        b.setAttribute("aria-pressed", String(met));
      });
    });

    ["mission-q1-feedback", "mission-q2-feedback", "mission-q3-feedback"].forEach((id) => {
      const feedback = document.getElementById(id);
      if (feedback) feedback.className = "feedback-box show success";
    });

    ["mission-step-2", "mission-step-3"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "block";
    });
    const output = document.getElementById("mission-python-output");
    if (output) {
      output.textContent =
        "Original Shortages: [38, 112, 15, 75, 94]\nEmergency Priority Order: [112, 94, 75, 38, 15]";
      setPythonOutputClass(output, "mission-output-success");
    }
    const awardArea = document.getElementById("mission-award-area");
    if (awardArea) awardArea.style.display = "block";
    updateRequirementsChecklist();
  }

  // Use status classes instead of inline colour styles on the terminal output.
  function setPythonOutputClass(el, stateClass) {
    if (!el) return;
    el.className = "terminal-output" + (stateClass ? " " + stateClass : "");
  }

  // Require the exact bracketed priority list; ignore whitespace differences only.
  function hasExactPriorityOrder(stdout) {
    if (typeof stdout !== "string") return false;
    return stdout.replace(/\s+/g, "").includes("[112,94,75,38,15]");
  }

  // Plain-text requirements checklist, kept in sync with every state change.
  function updateRequirementsChecklist() {
    const list = document.getElementById("mission-requirements-list");
    if (!list) return;

    const requirements = [
      { label: "Priority strategy chosen", met: isStrategySelected },
      { label: "Descending Python output verified [112, 94, 75, 38, 15]", met: isSortedCorrectly },
      { label: "Q1: Ward with the greatest deficit identified", met: isQuestion1Answered },
      { label: "Q2: stability keeps equal records in arrival order", met: isQuestion2Answered },
      { label: "Q3: CPython uses Timsort", met: isQuestion3Answered },
    ];

    list.textContent = "";
    requirements.forEach((req) => {
      const item = document.createElement("li");
      item.textContent = `${req.met ? "✓" : "○"} ${req.label}`;
      item.classList.add(req.met ? "mission-requirement-met" : "mission-requirement-pending");
      list.appendChild(item);
    });
  }

  function clearDebrief() {
    isQuestion1Answered = false;
    isQuestion2Answered = false;
    isQuestion3Answered = false;

    document.querySelectorAll(".mission-q1-btn, .mission-q2-btn, .mission-q3-btn").forEach((b) => {
      b.classList.remove("selected-correct", "selected-wrong", "active", "btn-primary");
      b.classList.add("btn-outline");
      b.setAttribute("aria-pressed", "false");
    });

    ["mission-q1-feedback", "mission-q2-feedback", "mission-q3-feedback"].forEach((id) => {
      const feedback = document.getElementById(id);
      if (feedback) {
        feedback.className = "feedback-box";
        feedback.innerHTML = "";
      }
    });

    updateRequirementsChecklist();
  }

  function handleStrategySelection(strategy, btnEl) {
    const feedback = document.getElementById("mission-strategy-feedback");
    document.querySelectorAll(".mission-strat-btn").forEach((b) => {
      b.classList.remove("selected-correct", "selected-wrong", "btn-primary", "active");
      b.classList.add("btn-outline");
      b.setAttribute("aria-pressed", "false");
    });

    currentStrategy = strategy;
    isSortedCorrectly = false;
    badgeAwarded = false;
    clearDebrief();

    const awardArea = document.getElementById("mission-award-area");
    if (awardArea) awardArea.style.display = "none";

    const step2 = document.getElementById("mission-step-2");
    if (step2) step2.style.display = "block";

    const step3 = document.getElementById("mission-step-3");
    if (step3) step3.style.display = "none";

    const step2Desc = document.querySelector("#mission-step-2 p");
    const runBtn = document.getElementById("mission-run-python-btn");
    const pyOutput = document.getElementById("mission-python-output");

    if (strategy === "descending") {
      btnEl.classList.remove("btn-outline", "selected-wrong");
      btnEl.classList.add("btn-primary", "selected-correct");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show success";
        feedback.innerHTML = "<strong>Correct Decision! 🎯</strong> The ward with the greatest deficit (112 blankets) must receive assistance first. That requires <strong>Descending Order</strong> (<code>reverse=True</code>).";
      }
      isStrategySelected = true;
      if (step2Desc) step2Desc.innerHTML = "Execute the emergency sorting operation using Python's built-in <code>sorted(..., reverse=True)</code>:";
      if (runBtn) runBtn.textContent = "▶ Execute Emergency Sort";
      setPythonOutputClass(pyOutput, null);
      if (pyOutput) pyOutput.textContent = "Awaiting execution...";
      playSound("success");
    } else {
      btnEl.classList.remove("btn-outline", "selected-correct", "btn-primary", "active");
      btnEl.classList.add("selected-wrong");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show error";
        feedback.innerHTML = "<strong>Consider the patients:</strong> Ascending order prioritizes the smallest shortage first: <code>[15, 38, 75, 94, 112]</code>. Ward B (112 needed) would be served last. Choose <strong>Descending Order</strong>.";
      }
      isStrategySelected = false;
      if (step2Desc) step2Desc.innerHTML = "Test the selected ascending order: <code>sorted(shortages)</code>:";
      if (runBtn) runBtn.textContent = "▶ Execute Ascending Sort";
      setPythonOutputClass(pyOutput, null);
      if (pyOutput) pyOutput.textContent = "Awaiting execution...";
      playSound("error");
    }

    updateRequirementsChecklist();
  }

  async function runFinalMissionPython() {
    const outputEl = document.getElementById("mission-python-output");
    const runBtn = document.getElementById("mission-run-python-btn");
    if (!outputEl) return;

    const isDesc = currentStrategy === "descending";
    const code = isDesc
      ? `shortages = [38, 112, 15, 75, 94]
priority_order = sorted(shortages, reverse=True)
print("Original Shortages:", shortages)
print("Emergency Priority Order:", priority_order)`
      : `shortages = [38, 112, 15, 75, 94]
ascending_order = sorted(shortages)
print("Original Shortages:", shortages)
print("Ascending Sort:", ascending_order)
print("WARNING: Ward B (112 blankets needed) is left at the end!")`;

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.setAttribute("aria-busy", "true");
    }
    outputEl.textContent = "Executing Python script on the local educational runner...";
    setPythonOutputClass(outputEl, "mission-output-warning");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      const executionSucceeded = response.ok && data.success === true;
      const stdout = typeof data.stdout === "string" ? data.stdout : "";
      outputEl.textContent = stdout || data.stderr || data.error || "No output was returned.";

      const step3 = document.getElementById("mission-step-3");

      if (!executionSucceeded) {
        // A failed request is never a verified sort, even if it printed plausible text.
        isSortedCorrectly = false;
        setPythonOutputClass(outputEl, "mission-output-error");
        if (step3) step3.style.display = "none";
        updateRequirementsChecklist();
        playSound("error");
        return;
      }

      // success:true alone is not enough - the exact descending list must be present.
      if (isDesc && hasExactPriorityOrder(stdout)) {
        isSortedCorrectly = true;
        setPythonOutputClass(outputEl, "mission-output-success");
        if (step3) step3.style.display = "block";
        updateRequirementsChecklist();
        playSound("success");
        checkFinalMissionCompletion();
      } else {
        isSortedCorrectly = false;
        setPythonOutputClass(outputEl, isDesc ? "mission-output-error" : "mission-output-warning");
        if (step3) step3.style.display = "none";
        updateRequirementsChecklist();
        if (isDesc) playSound("error");
      }
    } catch (e) {
      // Offline preview: do not claim that Python executed successfully.
      isSortedCorrectly = false;
      setPythonOutputClass(outputEl, isDesc ? "mission-output-warning" : "mission-output-error");
      outputEl.textContent = isDesc
        ? "[Offline preview — no Python was executed]\nOriginal Shortages: [38, 112, 15, 75, 94]\nExpected Priority Order: [112, 94, 75, 38, 15]\n\nStart server.py to verify this with Python."
        : "[Offline preview — no Python was executed]\nExpected Ascending Sort: [15, 38, 75, 94, 112]\n\nStart server.py to verify this with Python.";
      const step3 = document.getElementById("mission-step-3");
      if (step3) step3.style.display = "none";
      updateRequirementsChecklist();
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.removeAttribute("aria-busy");
      }
    }
  }

  function setDebriefAnswer(selector, feedbackId) {
    const feedback = document.getElementById(feedbackId);
    document.querySelectorAll(selector).forEach((b) => {
      b.classList.remove("selected-correct", "selected-wrong", "active", "btn-primary");
      b.classList.add("btn-outline");
      b.setAttribute("aria-pressed", "false");
    });
    return { feedback };
  }

  function handleDebriefQ1(val, btnEl) {
    const { feedback } = setDebriefAnswer(".mission-q1-btn", "mission-q1-feedback");

    if (val === "B") {
      btnEl.classList.remove("btn-outline", "selected-wrong");
      btnEl.classList.add("selected-correct", "active");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show success";
        feedback.innerHTML = "<strong>Correct!</strong> Ward B (112 blankets needed) sits at the front of the descending list.";
      }
      isQuestion1Answered = true;
      playSound("success");
      checkFinalMissionCompletion();
    } else {
      btnEl.classList.remove("btn-outline", "selected-correct", "active", "btn-primary");
      btnEl.classList.add("selected-wrong");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show error";
        feedback.innerHTML = `Not ${optionLabel(btnEl, `Ward ${val}`)}. Check the first element of [112, 94, 75, 38, 15].`;
      }
      isQuestion1Answered = false;
      playSound("error");
      updateRequirementsChecklist();
    }
  }

  function handleDebriefQ2(val, btnEl) {
    const { feedback } = setDebriefAnswer(".mission-q2-btn", "mission-q2-feedback");

    if (val === "STABLE") {
      btnEl.classList.remove("btn-outline", "selected-wrong");
      btnEl.classList.add("selected-correct", "active");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show success";
        feedback.innerHTML = "<strong>Correct.</strong> Stability means equal keys keep their original arrival order — the same guarantee you saw in the Insertion, Merge and Timsort frames.";
      }
      isQuestion2Answered = true;
      playSound("success");
      checkFinalMissionCompletion();
    } else {
      btnEl.classList.remove("btn-outline", "selected-correct", "active", "btn-primary");
      btnEl.classList.add("selected-wrong");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show error";
        feedback.innerHTML = "<strong>Not quite.</strong> Mutation means changing a list in place. Keeping equal records in their original relative order is a different guarantee.";
      }
      isQuestion2Answered = false;
      playSound("error");
      updateRequirementsChecklist();
    }
  }

  function handleDebriefQ3(val, btnEl) {
    const { feedback } = setDebriefAnswer(".mission-q3-btn", "mission-q3-feedback");

    if (val === "TIMSORT") {
      btnEl.classList.remove("btn-outline", "selected-wrong");
      btnEl.classList.add("selected-correct", "active");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show success";
        feedback.innerHTML = "<strong>Accurate! ⚡</strong> CPython uses <strong>Timsort</strong>, an adaptive hybrid of Insertion Sort and Merge Sort ideas with O(n) best-case and O(n log n) worst-case time.";
      }
      isQuestion3Answered = true;
      playSound("success");
      checkFinalMissionCompletion();
    } else {
      btnEl.classList.remove("btn-outline", "selected-correct", "active", "btn-primary");
      btnEl.classList.add("selected-wrong");
      btnEl.setAttribute("aria-pressed", "true");
      if (feedback) {
        feedback.className = "feedback-box show error";
        feedback.innerHTML = `Python doesn't use ${optionLabel(btnEl, val)}! CPython's <code>sorted()</code> and <code>list.sort()</code> use <strong>Timsort</strong>.`;
      }
      isQuestion3Answered = false;
      playSound("error");
      updateRequirementsChecklist();
    }
  }

  function checkFinalMissionCompletion() {
    updateRequirementsChecklist();
    const complete =
      isStrategySelected &&
      isSortedCorrectly &&
      isQuestion1Answered &&
      isQuestion2Answered &&
      isQuestion3Answered;

    if (complete && !badgeAwarded) {
      showBadgeCelebration();
    }
    return complete;
  }

  function showBadgeCelebration() {
    const awardArea = document.getElementById("mission-award-area");
    if (!awardArea) return;

    badgeAwarded = true;
    awardArea.style.display = "block";
    awardArea.setAttribute("role", "status");
    awardArea.setAttribute("aria-live", "polite");
    awardArea.setAttribute("tabindex", "-1");

    if (awardArea.scrollIntoView) awardArea.scrollIntoView({ behavior: "smooth" });
    if (typeof awardArea.focus === "function") {
      try {
        awardArea.focus({ preventScroll: true });
      } catch (e) {
        awardArea.focus();
      }
    }

    // Badge progress is recorded through the shared milestone API.
    if (window.App && typeof window.App.awardMilestone === "function") {
      window.App.awardMilestone("mission.complete");
    }
    if (window.App && typeof window.App.triggerConfetti === "function") {
      window.App.triggerConfetti();
    }
    playSound("fanfare");
  }

  function printSummary() {
    window.print();
  }

  function init() {
    shuffleAnswerGroups();

    document.querySelectorAll(".mission-strat-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleStrategySelection(btn.getAttribute("data-strat"), btn));
    });

    const runBtn = document.getElementById("mission-run-python-btn");
    if (runBtn) runBtn.addEventListener("click", runFinalMissionPython);

    document.querySelectorAll(".mission-q1-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleDebriefQ1(btn.getAttribute("data-val"), btn));
    });
    document.querySelectorAll(".mission-q2-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleDebriefQ2(btn.getAttribute("data-val"), btn));
    });
    document.querySelectorAll(".mission-q3-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleDebriefQ3(btn.getAttribute("data-val"), btn));
    });

    const printBtn = document.getElementById("mission-print-btn");
    if (printBtn) printBtn.addEventListener("click", printSummary);

    const restartBtn = document.getElementById("mission-restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        // App.resetProgress() calls this module's reset() itself.
        if (window.App && typeof window.App.resetProgress === "function") {
          window.App.resetProgress();
        }
      });
    }

    const badgeArt = document.getElementById("mission-badge-art");
    if (badgeArt && window.SVGIcons) {
      badgeArt.innerHTML = window.SVGIcons.badge;
    }

    restoreCompletedState();
    updateRequirementsChecklist();
  }

  function reset() {
    shuffleAnswerGroups();
    currentStrategy = null;
    isStrategySelected = false;
    isSortedCorrectly = false;
    badgeAwarded = false;
    clearDebrief();

    document.querySelectorAll(".mission-strat-btn").forEach((b) => {
      b.classList.remove("selected-correct", "selected-wrong", "btn-primary", "active");
      b.classList.add("btn-outline");
      b.setAttribute("aria-pressed", "false");
    });

    const stratFeedback = document.getElementById("mission-strategy-feedback");
    if (stratFeedback) {
      stratFeedback.className = "feedback-box";
      stratFeedback.innerHTML = "";
    }

    const step2 = document.getElementById("mission-step-2");
    if (step2) step2.style.display = "none";
    const pyOutput = document.getElementById("mission-python-output");
    if (pyOutput) {
      pyOutput.textContent = "Awaiting execution...";
      setPythonOutputClass(pyOutput, null);
    }
    const runBtn = document.getElementById("mission-run-python-btn");
    if (runBtn) {
      runBtn.textContent = "▶ Execute Emergency Sort";
      runBtn.disabled = false;
      runBtn.removeAttribute("aria-busy");
    }
    const step2Desc = document.querySelector("#mission-step-2 p");
    if (step2Desc) {
      step2Desc.innerHTML = "Execute the sorting operation using Python's built-in <code>sorted(..., reverse=True)</code>:";
    }

    const step3 = document.getElementById("mission-step-3");
    if (step3) step3.style.display = "none";
    const awardArea = document.getElementById("mission-award-area");
    if (awardArea) awardArea.style.display = "none";

    updateRequirementsChecklist();
  }

  return {
    init,
    reset,
    reshuffleOptions: shuffleAnswerGroups,
    checkFinalMissionCompletion,
    getState: () => ({
      currentStrategy,
      isStrategySelected,
      isSortedCorrectly,
      isQuestion1Answered,
      isQuestion2Answered,
      isQuestion3Answered,
      badgeAwarded,
    }),
  };
})();

window.FinalMissionModule = FinalMissionModule;
