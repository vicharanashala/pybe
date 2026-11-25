/**
 * The Sorting Investigation - Screen 7: Practice, Play & Live Terminal
 * ====================================================================
 * Exercises 1-7 check the Python ideas from the Practice screen. Exercises 8-11
 * check the exact operations demonstrated in the Visualize screen so the whole
 * journey uses one vocabulary. The terminal uses a restricted local educational
 * runner; it is not a secure sandbox and the UI says so explicitly.
 */

const ExercisesModule = (function () {
  let solvedExercises = {
    ex1: false,
    ex2: false,
    ex3: false,
    ex4: false,
    ex5: false,
    ex6: false,
    ex7: false,
    ex8: false,
    ex9: false,
    ex10: false,
    ex11: false,
    terminalRun: false,
  };

  let completionAwarded = false;

  const ANSWER_GROUPS = [
    ".ex1-option", ".ex3-option", ".ex5-option", ".ex6-option", ".ex7-option",
    ".ex8-option", ".ex9-option", ".ex10-option", ".ex11-option",
  ];

  function shuffleAnswerGroups() {
    if (!window.RandomizeModule || typeof window.RandomizeModule.shuffleGroup !== "function") return;
    ANSWER_GROUPS.forEach((selector) => window.RandomizeModule.shuffleGroup(selector));
  }

  function playSound(type) {
    if (window.App && window.App.playSound) window.App.playSound(type);
  }

  function getProgressSafe() {
    if (window.App && typeof window.App.getProgress === "function") {
      return window.App.getProgress();
    }
    return null;
  }

  function isMilestoneGranted(progress, key) {
    if (!progress || typeof progress !== "object") return false;
    const containers = ["milestones", "completedMilestones", "awardedMilestones"];
    for (const name of containers) {
      const value = progress[name];
      if (!value) continue;
      if (Array.isArray(value) && value.includes(key)) return true;
      if (value instanceof Map && value.has(key)) return true;
      if (typeof value === "object" && Boolean(value[key])) return true;
    }
    return progress[key] === true;
  }

  function hasCompletionMilestone() {
    return isMilestoneGranted(getProgressSafe(), "exercises.complete");
  }

  function awardCompletionOnce() {
    if (completionAwarded) return;
    if (hasCompletionMilestone()) {
      completionAwarded = true;
      return;
    }
    if (window.App && typeof window.App.awardMilestone === "function") {
      window.App.awardMilestone("exercises.complete");
      completionAwarded = true;
    }
  }

  function goToScreen(screenNumber) {
    if (window.App && typeof window.App.goToScreen === "function") {
      window.App.goToScreen(screenNumber);
    }
  }

  function setTerminalStatus(state, text) {
    const statusEl = document.getElementById("terminal-status-indicator");
    if (!statusEl) return;
    const feedbackClass = { success: "success", error: "error", warning: "warning" }[state] || "";
    statusEl.style.removeProperty("color");
    statusEl.className = `terminal-status-indicator is-${state}${feedbackClass ? " " + feedbackClass : ""}`;
    statusEl.textContent = text;
  }

  function setFeedback(parent, isSuccess, html) {
    if (!parent) return;
    const feedback = parent.querySelector(".feedback-box");
    if (!feedback) return;
    feedback.className = `feedback-box show ${isSuccess ? "success" : "error"}`;
    feedback.innerHTML = html;
  }

  function clearOptionStates(parent) {
    if (!parent) return;
    parent.querySelectorAll(".option-btn").forEach((btn) => {
      btn.classList.remove("selected-correct", "selected-wrong");
      btn.setAttribute("aria-pressed", "false");
    });
  }

  function markOption(buttonEl, isSuccess) {
    if (!buttonEl) return;
    buttonEl.classList.add(isSuccess ? "selected-correct" : "selected-wrong");
    buttonEl.setAttribute("aria-pressed", "true");
  }

  function checkAllExercisesDone() {
    const localDone = Object.values(solvedExercises).every(Boolean);
    const alreadyAwarded = hasCompletionMilestone();
    const allDone = localDone || alreadyAwarded;
    const proceedBtn = document.getElementById("exercises-proceed-btn");
    if (proceedBtn) {
      proceedBtn.disabled = !allDone;
      proceedBtn.setAttribute("aria-disabled", allDone ? "false" : "true");
      proceedBtn.classList.toggle("btn-primary", allDone);
      proceedBtn.classList.toggle("btn-secondary", !allDone);
      proceedBtn.classList.toggle("btn-outline", !allDone);
    }
    if (alreadyAwarded) {
      const hint = document.getElementById("exercises-progress-hint");
      if (hint) hint.textContent = "Completed previously — you can continue.";
    } else {
      updateProgressHint();
    }
    if (localDone) awardCompletionOnce();
    return allDone;
  }

  function updateProgressHint() {
    const hint = document.getElementById("exercises-progress-hint");
    if (!hint || hasCompletionMilestone()) return;
    const remaining = getRemainingRequirements();
    hint.textContent = remaining.length
      ? `Still to do: ${remaining.join(", ")}.`
      : "All requirements complete — you can continue.";
  }

  function getRemainingRequirements() {
    const labels = {
      ex1: "Exercise 1",
      ex2: "Exercise 2",
      ex3: "Exercise 3",
      ex4: "Exercise 4",
      ex5: "Exercise 5",
      ex6: "Exercise 6",
      ex7: "Exercise 7",
      ex8: "Exercise 8",
      ex9: "Exercise 9",
      ex10: "Exercise 10",
      ex11: "Exercise 11",
      terminalRun: "a successful terminal run",
    };
    return Object.keys(labels)
      .filter((key) => !solvedExercises[key])
      .map((key) => labels[key]);
  }

  // --------------------------------------------------------------------------
  // Exercise 1: sorted() prediction (MCQ)
  // --------------------------------------------------------------------------
  function checkEx1(selectedOption, buttonEl) {
    const parent = buttonEl && buttonEl.closest(".exercise-card");
    clearOptionStates(parent);

    if (selectedOption === "A") {
      markOption(buttonEl, true);
      setFeedback(
        parent,
        true,
        "<strong>Correct! 🎉</strong> Python's <code>sorted()</code> arranges numbers in ascending order by default: <code>[3, 7, 14, 28]</code>."
      );
      solvedExercises.ex1 = true;
      playSound("success");
    } else {
      markOption(buttonEl, false);
      setFeedback(
        parent,
        false,
        "<strong>Not quite.</strong> Default <code>sorted()</code> puts the smallest value (3) first, then 7, 14 and finally 28. Try again!"
      );
      solvedExercises.ex1 = false;
      playSound("error");
    }
    checkAllExercisesDone();
  }

  // --------------------------------------------------------------------------
  // Exercise 2: reverse=True fill-in (original HTML contract)
  // --------------------------------------------------------------------------
  function checkEx2() {
    const input = document.getElementById("ex2-input");
    const feedback = document.getElementById("ex2-feedback");
    if (!input || !feedback) return;

    const val = input.value.trim().replace(/\s+/g, "");

    if (val === "reverse=True") {
      feedback.className = "feedback-box show success";
      feedback.innerHTML = "<strong>Brilliant! 🎉</strong> <code>reverse=True</code> tells Python to sort in descending order (highest to lowest).";
      solvedExercises.ex2 = true;
      playSound("success");
    } else if (val.toLowerCase() === "reverse=true") {
      feedback.className = "feedback-box show error";
      feedback.innerHTML = "<strong>Almost there!</strong> In Python, booleans are capitalized: <code>reverse=True</code>.";
      solvedExercises.ex2 = false;
      playSound("error");
    } else {
      feedback.className = "feedback-box show error";
      feedback.innerHTML = "<strong>Not quite.</strong> Hint: pass the keyword argument <code>reverse=True</code>.";
      solvedExercises.ex2 = false;
      playSound("error");
    }
    checkAllExercisesDone();
  }

  function showEx2Hint() {
    const feedback = document.getElementById("ex2-feedback");
    if (!feedback) return;
    feedback.className = "feedback-box show";
    feedback.innerHTML = "<strong>Hint:</strong> Descending order needs the keyword <code>reverse</code> with the Python boolean <code>True</code>.";
  }

  // --------------------------------------------------------------------------
  // Exercise 3: immutability MCQ (original HTML contract)
  // --------------------------------------------------------------------------
  function checkEx3(selectedOption, buttonEl) {
    const parent = buttonEl && buttonEl.closest(".exercise-card");
    clearOptionStates(parent);

    if (selectedOption === "A") {
      markOption(buttonEl, true);
      setFeedback(
        parent,
        true,
        "<strong>Correct! 🎉</strong> <code>sorted()</code> returns a brand-new list. The original <code>records</code> list remains <code>[50, 10, 30]</code>."
      );
      solvedExercises.ex3 = true;
      playSound("success");
    } else {
      markOption(buttonEl, false);
      setFeedback(
        parent,
        false,
        "<strong>Remember:</strong> <code>sorted()</code> never mutates the original list. Only <code>list.sort()</code> sorts in place."
      );
      solvedExercises.ex3 = false;
      playSound("error");
    }
    checkAllExercisesDone();
  }

  // --------------------------------------------------------------------------
  // Exercise 4: key=len fill-in
  // --------------------------------------------------------------------------
  function checkEx4() {
    const input = document.getElementById("ex4-input");
    const feedback = document.getElementById("ex4-feedback");
    if (!input || !feedback) return;

    const val = input.value.trim().replace(/\s+/g, "");

    if (val === "key=len") {
      feedback.className = "feedback-box show success";
      feedback.innerHTML = "<strong>Excellent! 🎉</strong> <code>key=len</code> tells Python to sort by each string's length.";
      solvedExercises.ex4 = true;
      playSound("success");
    } else if (val === "key=len()") {
      feedback.className = "feedback-box show error";
      feedback.innerHTML = "<strong>Close:</strong> pass the function itself, <code>key=len</code>, not the result <code>key=len()</code>.";
      solvedExercises.ex4 = false;
      playSound("error");
    } else {
      feedback.className = "feedback-box show error";
      feedback.innerHTML = "<strong>Hint:</strong> use the built-in length function as the key: <code>key=len</code>.";
      solvedExercises.ex4 = false;
      playSound("error");
    }
    checkAllExercisesDone();
  }

  // --------------------------------------------------------------------------
  // Exercises 5-7: MCQs
  // --------------------------------------------------------------------------
  function checkEx5(selectedOption, buttonEl) {
    const parent = buttonEl && buttonEl.closest(".exercise-card");
    clearOptionStates(parent);
    const isCorrect = selectedOption === "C";

    markOption(buttonEl, isCorrect);
    setFeedback(
      parent,
      isCorrect,
      isCorrect
        ? "<strong>Perfect! 🎉</strong> <code>key=lambda w: w[\"patients\"]</code> extracts the number used for sorting from each dictionary."
        : "<strong>Notice:</strong> a key must be callable. <code>lambda w: w[\"patients\"]</code> is a one-line function Python can call for every record."
    );
    solvedExercises.ex5 = isCorrect;
    playSound(isCorrect ? "success" : "error");
    checkAllExercisesDone();
  }

  function checkEx6(selectedOption, buttonEl) {
    const parent = buttonEl && buttonEl.closest(".exercise-card");
    clearOptionStates(parent);
    const isCorrect = selectedOption === "A";

    markOption(buttonEl, isCorrect);
    setFeedback(
      parent,
      isCorrect,
      isCorrect
        ? "<strong>Spot on! 🎉</strong> A stable sort keeps equal-key items in their original relative order."
        : "<strong>Remember stability:</strong> if A appeared before B and their keys are equal, A still appears before B after sorting."
    );
    solvedExercises.ex6 = isCorrect;
    playSound(isCorrect ? "success" : "error");
    checkAllExercisesDone();
  }

  function checkEx7(selectedOption, buttonEl) {
    const parent = buttonEl && buttonEl.closest(".exercise-card");
    clearOptionStates(parent);
    const isCorrect = selectedOption === "B";

    markOption(buttonEl, isCorrect);
    setFeedback(
      parent,
      isCorrect,
      isCorrect
        ? "<strong>Outstanding! 🎉</strong> CPython uses <strong>Timsort</strong>, an adaptive hybrid of Insertion Sort and Merge Sort ideas."
        : "<strong>Remember:</strong> CPython's <code>sorted()</code> and <code>list.sort()</code> use <strong>Timsort</strong>, not Bubble Sort or QuickSort."
    );
    solvedExercises.ex7 = isCorrect;
    playSound(isCorrect ? "success" : "error");
    checkAllExercisesDone();
  }

  // --------------------------------------------------------------------------
  // Exercises 8-11: apply the visual operations from the Simulator stage
  // --------------------------------------------------------------------------
  function checkOperationExercise(key, correctOption, successHtml, retryHtml, selectedOption, buttonEl) {
    const parent = buttonEl && buttonEl.closest(".exercise-card");
    clearOptionStates(parent);
    const isCorrect = selectedOption === correctOption;
    markOption(buttonEl, isCorrect);
    setFeedback(parent, isCorrect, isCorrect ? successHtml : retryHtml);
    solvedExercises[key] = isCorrect;
    playSound(isCorrect ? "success" : "error");
    checkAllExercisesDone();
  }

  function checkEx8(selectedOption, buttonEl) {
    checkOperationExercise(
      "ex8",
      "A",
      "<strong>Exactly. 🎉</strong> Bubble Sort swaps only that neighbouring pair, then continues the scan. A larger record reaches the end through many adjacent moves, not one jump.",
      "<strong>Look at the Bubble frame.</strong> The highlighted records are neighbours. Only one adjacent pair crosses at a time; no record jumps over the rest of the list.",
      selectedOption,
      buttonEl
    );
  }

  function checkEx9(selectedOption, buttonEl) {
    checkOperationExercise(
      "ex9",
      "A",
      "<strong>Correct. 🎉</strong> The shift writes the larger record one slot right, opening the stable slot for the held key without deleting anything.",
      "<strong>Follow the held key.</strong> A shift is a copy into the next slot, not a removal. Every record is still present when the key is inserted.",
      selectedOption,
      buttonEl
    );
  }

  function checkEx10(selectedOption, buttonEl) {
    checkOperationExercise(
      "ex10",
      "A",
      "<strong>Correct. 🎉</strong> With one side empty there is no front pair to compare, so the remaining ordered side is copied straight into the buffer.",
      "<strong>Check the two front slots.</strong> If one side is empty, a comparison is impossible. The remaining side is already ordered and only needs copying.",
      selectedOption,
      buttonEl
    );
  }

  function checkEx11(selectedOption, buttonEl) {
    checkOperationExercise(
      "ex11",
      "A",
      "<strong>Correct. 🎉</strong> Timsort recognises the opposite run and reverses it once, creating an ordered section that can be merged efficiently.",
      "<strong>Look at the run direction.</strong> An opposite run is already ordered in the reverse direction; the teaching model reverses that whole run before merging.",
      selectedOption,
      buttonEl
    );
  }

  // --------------------------------------------------------------------------
  // Exercise 12: restricted local Python execution
  // --------------------------------------------------------------------------
  async function runPythonCode() {
    const codeArea = document.getElementById("terminal-code-input");
    const outputArea = document.getElementById("terminal-output-display");
    const runBtn = document.getElementById("btn-run-code");

    if (!codeArea || !outputArea) return;
    const code = codeArea.value.trim();

    if (!code) {
      outputArea.className = "terminal-output warning-output";
      outputArea.textContent = "# Please enter Python code above to run.";
      setTerminalStatus("warning", "No code entered — nothing was executed");
      return;
    }

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.setAttribute("aria-busy", "true");
      runBtn.textContent = "Running Python...";
    }
    setTerminalStatus("running", "Running restricted local Python...");
    outputArea.className = "terminal-output";
    outputArea.textContent = "⏳ Running code on the local educational runner...";

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        outputArea.className = "terminal-output success-output";
        outputArea.textContent = data.stdout || "# Execution completed with no printed output.";
        const timing = Number.isFinite(data.execution_time_ms)
          ? ` in ${data.execution_time_ms} ms`
          : "";
        setTerminalStatus("success", `✓ Completed${timing} (restricted local runner)`);
        solvedExercises.terminalRun = true;
        playSound("success");
      } else {
        const message = data.stderr || data.error || "Execution was rejected.";
        outputArea.className = "terminal-output error-output";
        outputArea.textContent = message;
        const timing = Number.isFinite(data.execution_time_ms)
          ? ` (${data.execution_time_ms} ms)`
          : "";
        setTerminalStatus("error", `⚠️ Rejected/failed${timing}`);
        solvedExercises.terminalRun = false;
        playSound("error");
      }
    } catch (err) {
      outputArea.className = "terminal-output error-output";
      outputArea.textContent =
        "The local Python server is unavailable, so no code was executed.\n\n" +
        "Start server.py and reload this page to run genuine Python.\n\n" +
        code;
      setTerminalStatus("error", "Local server unavailable — no code was executed");
      solvedExercises.terminalRun = false;
      playSound("error");
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.removeAttribute("aria-busy");
        runBtn.textContent = "▶ Run Python Code";
      }
      checkAllExercisesDone();
    }
  }

  const presets = {
    asc: `# Preset 1: Basic ascending sort (smallest to largest)
hospital_admissions = [42, 19, 85, 12, 64]
sorted_admissions = sorted(hospital_admissions)

print("Original list:", hospital_admissions)
print("Sorted ascending:", sorted_admissions)`,

    sort_method: `# Preset 2: list.sort() in-place mutation vs sorted()
records = [50, 20, 80, 10]
return_val = records.sort()

print("records after .sort():", records)
print("Return value of .sort():", return_val)`,

    desc: `# Preset 3: Descending sort using reverse=True
blanket_supplies = [15, 88, 32, 94, 61]
urgent_priority = sorted(blanket_supplies, reverse=True)

print("Highest urgency first:", urgent_priority)`,

    key_len: `# Preset 4: Custom key sorting by length
wards = ["Surgical", "ICU", "Triage", "Fever Ward"]
by_length = sorted(wards, key=len)

print("Sorted by name length:", by_length)`,

    key_lambda: `# Preset 5: Sorting dictionaries with lambda
wards_data = [
    {"name": "Ward A", "shortage": 38},
    {"name": "Ward B", "shortage": 112},
    {"name": "Ward C", "shortage": 15}
]

urgent_wards = sorted(wards_data, key=lambda w: w["shortage"], reverse=True)
for w in urgent_wards:
    print(w["name"], "shortage of", w["shortage"], "blankets")`,

    stability: `# Preset 6: Stable sorting demonstration
patients = [
    ("Davis", 2, "Arrival #1"),
    ("Adams", 1, "Arrival #2"),
    ("Baker", 2, "Arrival #3"),
    ("Clark", 1, "Arrival #4")
]

by_urgency = sorted(patients, key=lambda p: p[1])
for p in by_urgency:
    print(p[0], "Urgency", p[1], "-", p[2])`,
  };

  function updatePresetButtons(activeKey) {
    document.querySelectorAll(".terminal-preset-btn").forEach((btn) => {
      btn.classList.remove("active", "btn-primary");
      btn.classList.add("btn-outline");
      btn.setAttribute("aria-pressed", "false");
    });
    const activeBtn = document.getElementById(`btn-preset-${activeKey}`);
    if (activeBtn) {
      activeBtn.classList.add("active", "btn-primary");
      activeBtn.classList.remove("btn-outline");
      activeBtn.setAttribute("aria-pressed", "true");
    }
  }

  function loadPreset(key) {
    const codeArea = document.getElementById("terminal-code-input");
    if (!codeArea || !presets[key]) return;

    // Displayed code has changed, so any earlier run no longer applies.
    solvedExercises.terminalRun = false;
    codeArea.value = presets[key];
    updatePresetButtons(key);

    const outputArea = document.getElementById("terminal-output-display");
    if (outputArea) {
      outputArea.className = "terminal-output";
      outputArea.textContent = `# Loaded preset '${key}'. Press 'Run Python Code' to execute.`;
    }
    setTerminalStatus("ready", "Ready — run this code to execute it");
    checkAllExercisesDone();
  }

  function reset() {
    shuffleAnswerGroups();
    completionAwarded = hasCompletionMilestone();
    solvedExercises = {
      ex1: false,
      ex2: false,
      ex3: false,
      ex4: false,
      ex5: false,
      ex6: false,
      ex7: false,
      ex8: false,
      ex9: false,
      ex10: false,
      ex11: false,
      terminalRun: false,
    };

    document.querySelectorAll(".exercise-card").forEach((card) => {
      clearOptionStates(card);
      const feedback = card.querySelector(".feedback-box");
      if (feedback) {
        feedback.className = "feedback-box";
        feedback.innerHTML = "";
      }
    });

    const ex2Input = document.getElementById("ex2-input");
    if (ex2Input) ex2Input.value = "";
    const ex2Feedback = document.getElementById("ex2-feedback");
    if (ex2Feedback) {
      ex2Feedback.className = "feedback-box";
      ex2Feedback.innerHTML = "";
    }

    const ex4Input = document.getElementById("ex4-input");
    if (ex4Input) ex4Input.value = "";
    loadPreset("asc");

    const hint = document.getElementById("exercises-progress-hint");
    if (hint) hint.textContent = "";
    checkAllExercisesDone();
  }

  function init() {
    shuffleAnswerGroups();

    document.querySelectorAll(".ex1-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        checkEx1(btn.getAttribute("data-option"), btn);
      });
    });

    const ex2Check = document.getElementById("ex2-check-btn");
    const ex2Hint = document.getElementById("ex2-hint-btn");
    if (ex2Check) ex2Check.addEventListener("click", checkEx2);
    if (ex2Hint) ex2Hint.addEventListener("click", showEx2Hint);

    document.querySelectorAll(".ex3-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx3(btn.getAttribute("data-option"), btn));
    });

    const ex4Check = document.getElementById("btn-check-ex4");
    if (ex4Check) ex4Check.addEventListener("click", checkEx4);

    document.querySelectorAll(".ex5-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx5(btn.getAttribute("data-option"), btn));
    });
    document.querySelectorAll(".ex6-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx6(btn.getAttribute("data-option"), btn));
    });
    document.querySelectorAll(".ex7-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx7(btn.getAttribute("data-option"), btn));
    });
    document.querySelectorAll(".ex8-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx8(btn.getAttribute("data-option"), btn));
    });
    document.querySelectorAll(".ex9-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx9(btn.getAttribute("data-option"), btn));
    });
    document.querySelectorAll(".ex10-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx10(btn.getAttribute("data-option"), btn));
    });
    document.querySelectorAll(".ex11-option").forEach((btn) => {
      btn.addEventListener("click", () => checkEx11(btn.getAttribute("data-option"), btn));
    });

    const runBtn = document.getElementById("btn-run-code");
    if (runBtn) runBtn.addEventListener("click", runPythonCode);

    const presetMap = {
      "btn-preset-asc": "asc",
      "btn-preset-desc": "desc",
      "btn-preset-imm": "sort_method",
      "btn-preset-key-len": "key_len",
      "btn-preset-key-lambda": "key_lambda",
      "btn-preset-stability": "stability",
    };
    Object.entries(presetMap).forEach(([id, key]) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", () => loadPreset(key));
    });

    const resetTerminalBtn = document.getElementById("btn-reset-terminal-code");
    if (resetTerminalBtn) resetTerminalBtn.addEventListener("click", () => loadPreset("asc"));

    const proceedBtn = document.getElementById("exercises-proceed-btn");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        if (!hasCompletionMilestone() && Object.values(solvedExercises).every(Boolean)) {
          awardCompletionOnce();
        }
        if (hasCompletionMilestone()) {
          goToScreen(8);
          return;
        }
        const remaining = getRemainingRequirements();
        const hint = document.getElementById("exercises-progress-hint");
        if (hint) {
          hint.textContent = remaining.length
            ? `Still to do: ${remaining.join(", ")}.`
            : "Finish exercising and run Python in the terminal before continuing.";
        }
      });
    }

    loadPreset("asc");
  }

  return {
    init,
    reset,
    checkEx1,
    checkEx2,
    checkEx3,
    checkEx4,
    checkEx5,
    checkEx6,
    checkEx7,
    checkEx8,
    checkEx9,
    checkEx10,
    checkEx11,
    runPythonCode,
    loadPreset,
    updatePresetButtons,
    reshuffleOptions: shuffleAnswerGroups,
    getSolvedState: () => ({ ...solvedExercises }),
    getState: () => ({
      solvedExercises: { ...solvedExercises },
      canProceed: Object.values(solvedExercises).every(Boolean) || hasCompletionMilestone(),
    }),
  };
})();

window.ExercisesModule = ExercisesModule;
