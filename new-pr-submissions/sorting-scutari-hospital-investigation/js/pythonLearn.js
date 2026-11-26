/**
 * The Sorting Investigation - Screen 6: Mastering Python Sorting
 * =============================================================
 * Covers sorted() vs list.sort(), reverse=True, key=len, key=str.lower,
 * lambda keys for dictionaries, and stable sorting.
 */

const PythonLearnModule = (function () {
  const sampleDatasets = {
    admissions: {
      name: "Patient Admissions",
      data: [23, 8, 41, 15, 3],
      variable: "admissions",
      kind: "numbers",
    },
    blankets: {
      name: "Blanket Supplies",
      data: [85, 12, 64, 45, 9],
      variable: "blankets",
      kind: "numbers",
    },
    days: {
      name: "Recovery Days",
      data: [14, 28, 7, 3, 21],
      variable: "recovery_days",
      kind: "numbers",
    },
    wards: {
      name: "Ward Names",
      data: ["East Ward", "ICU", "Surgical Ward", "Triage"],
      variable: "ward_names",
      kind: "strings",
    },
    mixed_names: {
      name: "Mixed-case Names",
      data: ["icu", "East Ward", "triage", "Surgical Ward"],
      variable: "mixed_names",
      kind: "strings",
    },
    records: {
      name: "Hospital Records (Dicts)",
      data: [
        { ward: "Ward A", patients: 45 },
        { ward: "Ward B", patients: 112 },
        { ward: "Ward C", patients: 15 },
        { ward: "Ward D", patients: 78 },
      ],
      variable: "hospital_records",
      kind: "records",
    },
  };

  const stabilityDataInitial = [
    { name: "Patient Davis", urgency: 2, arrivalOrder: 1 },
    { name: "Patient Adams", urgency: 1, arrivalOrder: 2 },
    { name: "Patient Baker", urgency: 2, arrivalOrder: 3 },
    { name: "Patient Clark", urgency: 1, arrivalOrder: 4 },
  ];

  let currentKey = "admissions";
  let isReverse = false;
  let useInPlace = false;
  let keyMode = "none";
  let stabilitySorted = false;

  // Entries look like "code:reverse:true" or "view:stability:false".
  const exploredOptions = new Set();

  function recordExplored(category, value, changesCode) {
    exploredOptions.add(`${changesCode ? "code" : "view"}:${category}:${value}`);
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

  function hasSortingMilestone() {
    return isMilestoneGranted(getProgressSafe(), "python.sorting");
  }

  function goToScreen(screenNumber) {
    if (window.App && typeof window.App.goToScreen === "function") {
      window.App.goToScreen(screenNumber);
    }
  }

  // Completion is a small concept check, not two arbitrary clicks. The learner
  // must compare sorted() with .sort(), change order or key, and inspect why
  // equal records keep arrival order.
  function canProceedToExercises() {
    if (hasSortingMilestone()) return true;
    const entries = Array.from(exploredOptions);
    const comparedMutation = entries.includes("code:mutation:true");
    const changedOrderOrKey =
      entries.includes("code:reverse:true") ||
      entries.includes("code:key:len") ||
      entries.includes("code:key:lower") ||
      entries.includes("code:dataset:records");
    const inspectedStability = entries.includes("view:stability:true");
    return comparedMutation && changedOrderOrKey && inspectedStability;
  }

  function missingPracticeText() {
    const missing = [];
    if (!Array.from(exploredOptions).includes("code:mutation:true")) {
      missing.push("compare <code>sorted()</code> with <code>.sort()</code>");
    }
    if (!Array.from(exploredOptions).some((entry) =>
      ["code:reverse:true", "code:key:len", "code:key:lower", "code:dataset:records"].includes(entry)
    )) {
      missing.push("change direction or a key");
    }
    if (!Array.from(exploredOptions).includes("view:stability:true")) {
      missing.push("reveal the stability example");
    }
    return missing.join(", ");
  }

  // Code-point-like comparison (simple < / >) rather than localeCompare.
  function compareStrings(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function byNatural(a, b) {
    if (typeof a === "string") {
      const cmp = compareStrings(a, b);
      return isReverse ? -cmp : cmp;
    }
    return isReverse ? b - a : a - b;
  }

  function makeComparator(dataset) {
    if (dataset.kind === "records") {
      return (a, b) => (isReverse ? b.patients - a.patients : a.patients - b.patients);
    }
    if (dataset.kind === "strings" && keyMode === "len") {
      return (a, b) => (isReverse ? b.length - a.length : a.length - b.length);
    }
    if (dataset.kind === "strings" && keyMode === "lower") {
      return (a, b) => {
        const cmp = compareStrings(a.toLowerCase(), b.toLowerCase());
        return isReverse ? -cmp : cmp;
      };
    }
    return (a, b) => byNatural(a, b);
  }

  function formatArray(arr) {
    if (arr.length && typeof arr[0] === "object") {
      return "[\n  " + arr.map((item) => `{ward: '${item.ward}', patients: ${item.patients}}`).join(",\n  ") + "\n]";
    }
    return `[${arr.map((item) => (typeof item === "string" ? `'${item}'` : item)).join(", ")}]`;
  }

  function updateKeyGroupNote(isStringDataset, dataset) {
    const keyGroup = document.querySelector('[aria-label="Key function"]');
    if (!keyGroup) return;
    // Place the note beside (not inside) the toggle group: the group clips
    // overflow, which would hide this explanation on narrow screens.
    const container = keyGroup.parentElement || keyGroup;
    let note = container.querySelector(".learn-key-mode-note");
    if (!note) {
      note = document.createElement("div");
      note.className = "learn-key-mode-note";
      container.appendChild(note);
    }

    let text = "";
    if (dataset && dataset.kind === "records") {
      text = "Key controls apply to strings. Records use key=lambda w: w[\"patients\"].";
    } else if (!isStringDataset) {
      text = "Key controls apply to string datasets only; numbers sort by value.";
    }
    note.textContent = text;
    note.hidden = !text;
    note.setAttribute("aria-hidden", text ? "false" : "true");
    keyGroup.setAttribute("data-not-applicable", isStringDataset ? "false" : "true");
  }

  function updateToggleVisuals() {
    const btnAsc = document.getElementById("learn-toggle-asc");
    const btnDesc = document.getElementById("learn-toggle-desc");
    setTogglePair(btnAsc, btnDesc, !isReverse);

    const btnSorted = document.getElementById("learn-mode-sorted");
    const btnSort = document.getElementById("learn-mode-sort");
    setTogglePair(btnSorted, btnSort, !useInPlace);

    const dataset = sampleDatasets[currentKey];
    const isStringDataset = Boolean(dataset && dataset.kind === "strings");

    document.querySelectorAll("[data-key-mode]").forEach((btn) => {
      const mode = btn.getAttribute("data-key-mode");
      const incompatible = !isStringDataset;
      const active = !incompatible && mode === keyMode;
      btn.disabled = incompatible;
      btn.setAttribute("aria-disabled", incompatible ? "true" : "false");
      btn.classList.toggle("active", active);
      btn.classList.toggle("btn-primary", active);
      btn.classList.toggle("btn-outline", !active);
      btn.classList.toggle("is-disabled", incompatible);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    updateKeyGroupNote(isStringDataset, dataset);
  }

  function setTogglePair(first, second, firstActive) {
    if (!first || !second) return;
    first.classList.toggle("active", firstActive);
    first.classList.toggle("btn-primary", firstActive);
    first.classList.toggle("btn-outline", !firstActive);
    first.setAttribute("aria-pressed", firstActive ? "true" : "false");

    second.classList.toggle("active", !firstActive);
    second.classList.toggle("btn-primary", !firstActive);
    second.classList.toggle("btn-outline", firstActive);
    second.setAttribute("aria-pressed", firstActive ? "false" : "true");
  }

  function updatePipelineDemo() {
    const dataset = sampleDatasets[currentKey];
    if (!dataset) return;

    const originalArr = dataset.data;
    const sortedArr = [...originalArr].sort(makeComparator(dataset));

    let keyArgHtml = "";
    if (dataset.kind === "records") {
      keyArgHtml = `<span class="code-param">key</span>=<span class="code-keyword">lambda</span> w: w[<span class="code-str">"patients"</span>]`;
    } else if (dataset.kind === "strings" && keyMode === "len") {
      keyArgHtml = `<span class="code-param">key</span>=<span class="code-keyword">len</span>`;
    } else if (dataset.kind === "strings" && keyMode === "lower") {
      keyArgHtml = `<span class="code-param">key</span>=<span class="code-keyword">str.lower</span>`;
    }

    const reverseArgHtml = isReverse
      ? `<span class="code-param">reverse</span>=<span class="code-keyword">True</span>`
      : "";
    const argsHtml = [keyArgHtml, reverseArgHtml].filter(Boolean).join(", ");

    // list.sort() mutates in place for every dataset kind and returns None.
    const codeHtml = useInPlace
      ? `${dataset.variable}.<span class="code-fn">sort</span>(${argsHtml})`
      : `<span class="code-fn">sorted</span>(${dataset.variable}${argsHtml ? ", " + argsHtml : ""})`;

    let resultNote;
    if (dataset.kind === "records") {
      resultNote = `Sorted dictionaries by 'patients' (${isReverse ? "descending" : "ascending"})`;
    } else if (dataset.kind === "strings" && keyMode === "len") {
      resultNote = isReverse
        ? "Sorted by string length (longest to shortest)"
        : "Sorted by string length (shortest to longest)";
    } else if (dataset.kind === "strings" && keyMode === "lower") {
      resultNote = isReverse
        ? "Case-insensitive alphabetical order (descending)"
        : "Case-insensitive alphabetical order";
    } else {
      resultNote = isReverse ? "⬇ Brand-new descending list" : "⬆ Brand-new ascending list";
    }
    if (useInPlace) {
      resultNote = `list.sort() mutates the list in place and returns None; ${resultNote.charAt(0).toLowerCase()}${resultNote.slice(1)}`;
    }

    const originalNote = useInPlace
      ? "⚠️ Mutated! The original ordering is replaced"
      : "✓ Preserved & Unchanged in memory";
    const shownOriginal = useInPlace ? sortedArr : originalArr;
    const resultLabel = useInPlace ? "Method Return Value" : "Returned New List (result)";
    const resultValue = useInPlace ? "None" : null;

    const originalBox = document.getElementById("pipeline-original-box");
    const codeSnippet = document.getElementById("pipeline-code-display");
    const resultBox = document.getElementById("pipeline-result-box");

    if (originalBox) {
      originalBox.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.25rem;">Original List (${dataset.variable})</div>
        <div style="font-family: var(--font-mono); font-size: 0.95rem; font-weight: 700; color: #1e293b; white-space: pre-wrap;">${formatArray(shownOriginal)}</div>
        <div style="font-size: 0.75rem; color: ${useInPlace ? "#f59e0b" : "#10b981"}; margin-top: 0.35rem; font-weight: 600;">${originalNote}</div>
      `;
    }

    if (codeSnippet) codeSnippet.innerHTML = codeHtml;

    if (resultBox) {
      resultBox.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: 700; color: #64748b; margin-bottom: 0.25rem;">${resultLabel}</div>
        <div style="font-family: var(--font-mono); font-size: 0.95rem; font-weight: 700; color: var(--color-primary); white-space: pre-wrap;">${resultValue === "None" ? '<span style="color: #64748b;">None</span>' : formatArray(sortedArr)}</div>
        <div style="font-size: 0.75rem; color: #6366f1; margin-top: 0.35rem; font-weight: 600;">${resultNote}</div>
      `;
    }

    updateToggleVisuals();
  }

  function setDataset(key) {
    if (!sampleDatasets[key]) return;
    currentKey = key;
    const dataset = sampleDatasets[key];
    if (dataset.kind !== "strings" && keyMode !== "none") keyMode = "none";
    const select = document.getElementById("learn-dataset-select");
    if (select) select.value = key;
    // list.sort() is now supported for every kind, so useInPlace stays valid.
    recordExplored("dataset", key, true);
    updatePipelineDemo();
  }

  function setReverseToggle(val) {
    isReverse = Boolean(val);
    recordExplored("reverse", String(isReverse), true);
    updatePipelineDemo();
  }

  function setMutationToggle(inPlace) {
    useInPlace = Boolean(inPlace);
    recordExplored("mutation", String(useInPlace), true);
    updatePipelineDemo();
  }

  function setKeyMode(mode) {
    if (!["none", "len", "lower"].includes(mode)) return;
    const dataset = sampleDatasets[currentKey];
    if (dataset.kind !== "strings" && mode !== "none") return;
    keyMode = mode;
    recordExplored("key", mode, true);
    updatePipelineDemo();
  }

  function updateStabilityToggle() {
    const btn = document.getElementById("btn-toggle-stability");
    if (!btn) return;
    btn.textContent = stabilitySorted ? "↺ Reset to Arrival Order" : "▶ Sort by Urgency (sorted())";
    btn.setAttribute("aria-pressed", stabilitySorted ? "true" : "false");
    btn.classList.toggle("active", stabilitySorted);
    btn.classList.toggle("btn-primary", stabilitySorted);
    btn.classList.toggle("btn-outline", !stabilitySorted);
  }

  function renderStabilityDemo() {
    const container = document.getElementById("stability-cards-container");
    const statusEl = document.getElementById("stability-status-text");
    if (!container) return;

    const data = stabilitySorted
      ? [...stabilityDataInitial].sort((a, b) => a.urgency - b.urgency)
      : stabilityDataInitial;

    container.innerHTML = data
      .map(
        (p) => `
        <div class="stability-card ${p.urgency === 1 ? "urgency-1" : "urgency-2"}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${p.name}</span>
            <span class="algo-badge">Urgency ${p.urgency}</span>
          </div>
          <div style="font-size: 0.78rem; color: #64748b;">Original Arrival: <strong>#${p.arrivalOrder}</strong></div>
        </div>
      `
      )
      .join("");

    if (statusEl) {
      statusEl.innerHTML = stabilitySorted
        ? "<strong>Stability in action:</strong> Adams (Arrival #2) remains before Clark (Arrival #4), and Davis (#1) remains before Baker (#3), because equal urgency keys preserve arrival order."
        : "Original arrival order. Davis arrived before Baker (both urgency 2); Adams arrived before Clark (both urgency 1). Sort by urgency to see stability.";
    }
  }

  function toggleStability() {
    stabilitySorted = !stabilitySorted;
    recordExplored("stability", String(stabilitySorted), false);
    updateStabilityToggle();
    renderStabilityDemo();
  }

  function copyCode(btn, text) {
    const showCopied = () => {
      const originalText = btn.textContent;
      btn.textContent = "Copied! ✓";
      btn.classList.add("btn-success");
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove("btn-success");
      }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied).catch(() => {
        btn.textContent = "Copy unavailable";
      });
      return;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try {
      document.execCommand("copy");
      showCopied();
    } catch (e) {
      btn.textContent = "Copy unavailable";
    }
    document.body.removeChild(helper);
  }

  function reset() {
    currentKey = "admissions";
    isReverse = false;
    useInPlace = false;
    keyMode = "none";
    stabilitySorted = false;
    exploredOptions.clear();
    const select = document.getElementById("learn-dataset-select");
    if (select) select.value = "admissions";
    updateStabilityToggle();
    updatePipelineDemo();
    renderStabilityDemo();
    const hint = document.getElementById("learn-progress-hint");
    if (hint) hint.textContent = "";
  }

  function init() {
    const datasetSelect = document.getElementById("learn-dataset-select");
    if (datasetSelect) {
      datasetSelect.value = currentKey;
      datasetSelect.addEventListener("change", (e) => setDataset(e.target.value));
    }

    const btnAsc = document.getElementById("learn-toggle-asc");
    const btnDesc = document.getElementById("learn-toggle-desc");
    const btnSorted = document.getElementById("learn-mode-sorted");
    const btnSort = document.getElementById("learn-mode-sort");
    if (btnAsc) btnAsc.addEventListener("click", () => setReverseToggle(false));
    if (btnDesc) btnDesc.addEventListener("click", () => setReverseToggle(true));
    if (btnSorted) btnSorted.addEventListener("click", () => setMutationToggle(false));
    if (btnSort) btnSort.addEventListener("click", () => setMutationToggle(true));

    document.querySelectorAll("[data-key-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        setKeyMode(btn.getAttribute("data-key-mode"));
      });
    });

    const stabilityBtn = document.getElementById("btn-toggle-stability");
    if (stabilityBtn) stabilityBtn.addEventListener("click", toggleStability);

    document.querySelectorAll(".btn-copy-code").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetEl = document.getElementById(btn.getAttribute("data-target"));
        if (targetEl) copyCode(btn, targetEl.innerText);
      });
    });

    const proceedBtn = document.getElementById("learn-proceed-btn");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        if (hasSortingMilestone()) {
          goToScreen(7);
          return;
        }
        if (!canProceedToExercises()) {
          const hint = document.getElementById("learn-progress-hint");
          if (hint) {
            hint.innerHTML = `Before continuing: ${missingPracticeText()}.`;
          }
          return;
        }
        if (window.App && typeof window.App.awardMilestone === "function") {
          window.App.awardMilestone("python.sorting");
        }
        goToScreen(7);
      });
    }

    updateStabilityToggle();
    updatePipelineDemo();
    renderStabilityDemo();
  }

  return {
    init,
    reset,
    setDataset,
    setReverseToggle,
    setMutationToggle,
    setKeyMode,
    toggleStability,
    getState: () => ({
      currentKey,
      isReverse,
      useInPlace,
      keyMode,
      stabilitySorted,
      exploredOptions: Array.from(exploredOptions),
      canProceed: canProceedToExercises(),
    }),
  };
})();

window.PythonLearnModule = PythonLearnModule;
