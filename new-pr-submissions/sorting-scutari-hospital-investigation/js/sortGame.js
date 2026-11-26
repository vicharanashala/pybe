/**
 * The Sorting Investigation - Screen 4: Adjacent-swap sorting board
 * The learner physically performs the same neighbouring comparison and swap
 * that Bubble Sort uses in the visualizer. Only adjacent cards may cross;
 * pointer, keyboard and button controls all follow that single rule.
 */

const SortGameModule = (function () {
  // Shared illustrative ward sample from the evidence room and simulator.
  const WARD_SAMPLE = [58, 24, 91, 12, 45];
  const WARD_LABELS = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"];
  const levels = [
    {
      level: 1,
      name: "Level 1: Adjacent Pairs",
      orderType: "ascending",
      instruction: "Swap neighbouring pairs until the 3 records are ASCENDING",
      hint: "Compare Ward A (58) with Ward B (24). They are out of order, so swap just that adjacent pair.",
      initial: WARD_SAMPLE.slice(0, 3),
      labels: WARD_LABELS.slice(0, 3),
    },
    {
      level: 2,
      name: "Level 2: Full Ward Sample",
      orderType: "ascending",
      instruction: "Swap neighbouring pairs until all 5 records are ASCENDING",
      hint: "Work left to right. Each swap moves one larger record a single place toward the end.",
      initial: [...WARD_SAMPLE],
      labels: [...WARD_LABELS],
    },
    {
      level: 3,
      name: "Level 3: Highest Need First",
      orderType: "descending",
      instruction: "Swap neighbouring pairs until all 5 records are DESCENDING",
      hint: "For descending order, swap an adjacent pair when the left value is smaller than the right value.",
      initial: [...WARD_SAMPLE],
      labels: [...WARD_LABELS],
    },
  ];

  let currentLevelIdx = 0;
  let currentCards = [];
  let adjacentSwaps = 0;
  const solvedLevels = new Set();
  let allLevelsAwarded = false;
  let focusCardId = null;
  let pointerDrag = null;

  function getTargetOrder(levelData) {
    const sorted = [...levelData.initial].sort((a, b) => a - b);
    return levelData.orderType === "descending" ? sorted.reverse() : sorted;
  }

  function isLevelSolved() {
    const currentValues = currentCards.map((c) => c.value);
    const targetValues = getTargetOrder(levels[currentLevelIdx]);
    return currentValues.every((val, i) => val === targetValues[i]);
  }

  // Level chips are created once and then updated in place.
  function buildLevelChips() {
    const chipsContainer = document.getElementById("game-level-chips");
    if (!chipsContainer) return;

    chipsContainer.innerHTML = levels
      .map(
        (lvl, i) => `
        <button class="level-chip" data-idx="${i}" type="button" aria-label="Select ${lvl.name}">
          ${lvl.name.split(":")[0]}
        </button>
      `
      )
      .join("");

    chipsContainer.querySelectorAll(".level-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const lIdx = parseInt(btn.getAttribute("data-idx"), 10);
        loadLevel(lIdx);
      });
    });
  }

  function updateLevelChips() {
    const chipsContainer = document.getElementById("game-level-chips");
    if (!chipsContainer) return;

    chipsContainer.querySelectorAll(".level-chip").forEach((btn) => {
      const i = parseInt(btn.getAttribute("data-idx"), 10);
      const unlocked = i === 0 || solvedLevels.has(i - 1);
      const isCurrent = i === currentLevelIdx;
      const isSolved = solvedLevels.has(i);

      btn.disabled = !unlocked;
      btn.classList.toggle("active", isCurrent);
      btn.classList.toggle("solved", isSolved);
      btn.classList.toggle("locked", !unlocked);
      btn.setAttribute("aria-pressed", isCurrent ? "true" : "false");
      if (isCurrent) btn.setAttribute("aria-current", "step");
      else btn.removeAttribute("aria-current");
      btn.setAttribute(
        "aria-label",
        `Select ${levels[i].name}${isSolved ? ", solved" : ""}${unlocked ? "" : ", locked"}`
      );
      btn.innerHTML = `${levels[i].name.split(":")[0]} ${isSolved ? "⭐" : ""}`;
    });
  }

  function maybeAwardAllLevels() {
    if (solvedLevels.size >= levels.length && !allLevelsAwarded) {
      allLevelsAwarded = true;
      if (window.App && typeof window.App.awardMilestone === "function") {
        window.App.awardMilestone("game.allLevels");
      }
    }
  }

  function loadLevel(idx) {
    currentLevelIdx = idx;
    adjacentSwaps = 0;
    const levelData = levels[idx];
    currentCards = levelData.initial.map((val, i) => ({
      value: val,
      label: levelData.labels[i] || `Item ${i + 1}`,
      id: `card-${val}-${i}`,
    }));

    updateLevelChips();

    // Update instruction banner
    const banner = document.getElementById("game-rule-text");
    if (banner) {
      banner.innerHTML = `
        <strong>${levelData.name}:</strong> ${levelData.instruction}
        <span style="display:block; font-size: 0.85rem; color: #92400e; margin-top: 0.25rem;">
          Rule: only neighbouring cards may swap · Order: <strong>${levelData.orderType.toUpperCase()}</strong> (${levelData.orderType === "ascending" ? "Smallest ➔ Largest" : "Largest ➔ Smallest"})
        </span>
      `;
    }

    // Clear feedback
    showFeedback("", "");
    renderCards();
  }

  function renderCards(checkResults = null) {
    const deck = document.getElementById("game-cards-deck");
    if (!deck) return;

    deck.innerHTML = "";

    currentCards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "sortable-card";
      cardEl.setAttribute("data-index", index);
      cardEl.setAttribute("data-card-id", card.id);
      cardEl.setAttribute("tabindex", "0");
      cardEl.setAttribute("role", "listitem");
      cardEl.setAttribute(
        "aria-label",
        `${card.label}: ${card.value}. Position ${index + 1} of ${currentCards.length}. Swap with a neighbour using the arrow buttons or Shift plus ArrowLeft or ArrowRight.`
      );

      if (checkResults) {
        if (checkResults[index]) {
          cardEl.classList.add("correct");
        } else {
          cardEl.classList.add("misplaced");
        }
      }

      cardEl.innerHTML = `
        <div class="card-num">${card.value}</div>
        <div class="card-label">${card.label}</div>
        <div class="card-nav-btns" aria-label="Card movement controls">
          <button class="card-nav-btn btn-shift-left" data-index="${index}" title="Move Left" aria-label="Move ${card.value} left" ${index === 0 ? "disabled style='opacity:0.3;'" : ""}>◀</button>
          <button class="card-nav-btn btn-shift-right" data-index="${index}" title="Move Right" aria-label="Move ${card.value} right" ${index === currentCards.length - 1 ? "disabled style='opacity:0.3;'" : ""}>▶</button>
        </div>
      `;

      // Pointer / touch drag: start tracking here; movement is handled on document
      // so it keeps working after renderCards() replaces the deck nodes.
      cardEl.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".card-nav-btn")) return; // ignore arrow buttons
        if (e.button !== undefined && e.button !== 0) return;
        pointerDrag = { pointerId: e.pointerId, cardId: card.id, startX: e.clientX };
        cardEl.classList.add("dragging");
        if (e.pointerType === "touch" && e.cancelable) e.preventDefault();
      });

      // Keyboard movement: Shift/Ctrl + Arrow moves the focused card.
      cardEl.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        if (!e.shiftKey && !e.ctrlKey) return;
        if (e.target.closest && e.target.closest(".card-nav-btn")) return;
        e.preventDefault();
        const fromIdx = currentCards.findIndex((c) => c.id === card.id);
        if (fromIdx < 0) return;
        const toIdx = fromIdx + (e.key === "ArrowLeft" ? -1 : 1);
        if (toIdx < 0 || toIdx >= currentCards.length) return;
        focusCardId = card.id;
        moveCard(fromIdx, toIdx);
      });

      deck.appendChild(cardEl);
    });

    // Shift Button click listeners
    deck.querySelectorAll(".btn-shift-left").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        if (idx > 0) moveCard(idx, idx - 1);
      });
    });

    deck.querySelectorAll(".btn-shift-right").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        if (idx < currentCards.length - 1) moveCard(idx, idx + 1);
      });
    });

    // Restore focus to the card that was just moved.
    if (focusCardId) {
      const movedEl = deck.querySelector(`[data-card-id="${focusCardId}"]`);
      if (movedEl && typeof movedEl.focus === "function") movedEl.focus();
      focusCardId = null;
    }
  }

  // Pointer & touch drag: cross a neighbour's midpoint to swap positions.
  function handlePointerMove(e) {
    if (!pointerDrag || e.pointerId !== pointerDrag.pointerId) return;
    const deck = document.getElementById("game-cards-deck");
    if (!deck) return;

    const cardEl = deck.querySelector(`[data-card-id="${pointerDrag.cardId}"]`);
    if (!cardEl) return;
    const cards = Array.from(deck.querySelectorAll(".sortable-card"));
    const fromIdx = cards.indexOf(cardEl);
    if (fromIdx < 0) return;

    const rect = cardEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const delta = e.clientX - pointerDrag.startX;
    let targetIdx = fromIdx;

    if (delta > 0 && fromIdx < cards.length - 1) {
      const neighbourRect = cards[fromIdx + 1].getBoundingClientRect();
      const midpoint = (centerX + neighbourRect.left + neighbourRect.width / 2) / 2;
      if (centerX + delta >= midpoint) targetIdx = fromIdx + 1;
    } else if (delta < 0 && fromIdx > 0) {
      const neighbourRect = cards[fromIdx - 1].getBoundingClientRect();
      const midpoint = (centerX + neighbourRect.left + neighbourRect.width / 2) / 2;
      if (centerX + delta <= midpoint) targetIdx = fromIdx - 1;
    }

    if (targetIdx !== fromIdx) {
      // Measure the next potential move from the current pointer position.
      pointerDrag.startX = e.clientX;
      moveCard(fromIdx, targetIdx);
    }
  }

  function endPointerDrag(e) {
    if (!pointerDrag) return;
    if (e && e.pointerId !== undefined && e.pointerId !== pointerDrag.pointerId) return;
    pointerDrag = null;
    document.querySelectorAll(".sortable-card.dragging").forEach((el) => el.classList.remove("dragging"));
  }

  function moveCard(fromIndex, toIndex) {
    const inRange = fromIndex >= 0 && fromIndex < currentCards.length &&
      toIndex >= 0 && toIndex < currentCards.length;
    // The game teaches Bubble Sort's core move: adjacent comparison + swap.
    if (!inRange || Math.abs(fromIndex - toIndex) !== 1) return;
    const item = currentCards.splice(fromIndex, 1)[0];
    currentCards.splice(toIndex, 0, item);
    adjacentSwaps += 1;
    showFeedback("", "");
    renderCards();

    // Trigger subtle click sound if audio enabled
    if (window.App && window.App.playSound) {
      window.App.playSound("tap");
    }
  }

  function checkOrder() {
    const targetValues = getTargetOrder(levels[currentLevelIdx]);
    const results = currentCards.map((card, i) => card.value === targetValues[i]);
    const isSuccess = results.every(Boolean);

    renderCards(results);

    if (isSuccess) {
      solvedLevels.add(currentLevelIdx);
      updateLevelChips();
      maybeAwardAllLevels();

      if (window.App && window.App.playSound) {
        window.App.playSound("success");
      }
      if (window.App && window.App.triggerConfetti) {
        window.App.triggerConfetti();
      }

      if (currentLevelIdx < levels.length - 1) {
        showFeedback(
          "success",
          `🎉 Correct! You used ${adjacentSwaps} adjacent swap${adjacentSwaps === 1 ? "" : "s"} to order this ward sample. Each swap moved one record past one neighbour — exactly the move Bubble Sort repeats. <button id="btn-next-level" class="btn btn-primary btn-sm" style="margin-left: 10px;">Next board →</button>`
        );
        const nextLvlBtn = document.getElementById("btn-next-level");
        if (nextLvlBtn) {
          nextLvlBtn.addEventListener("click", () => loadLevel(currentLevelIdx + 1));
        }
      } else {
        // Completed all 3 levels!
        showFeedback(
          "success",
          `🏆 Well done. You ordered the same illustrative ward sample by hand using adjacent swaps. Now watch Bubble, Insertion, Merge and the Timsort teaching model perform the idea step by step. <button id="btn-to-sim" class="btn btn-primary btn-sm" style="margin-left: 10px;">Proceed to Simulator →</button>`
        );
        const toSimBtn = document.getElementById("btn-to-sim");
        if (toSimBtn) {
          toSimBtn.addEventListener("click", () => {
            if (window.App && typeof window.App.goToScreen === "function") window.App.goToScreen(5);
          });
        }
      }
    } else {
      if (window.App && window.App.playSound) {
        window.App.playSound("error");
      }
      const isAscending = levels[currentLevelIdx].orderType === "ascending";
      const orderName = isAscending ? "Ascending (smallest first)" : "Descending (largest first)";
      showFeedback(
        "error",
        `Not quite in order yet. This board requires <strong>${orderName}</strong>. Compare each highlighted pair with its neighbour: swap when the left value should come after the right value in ${isAscending ? "ascending" : "descending"} order.`
      );
    }
  }

  function giveHint() {
    const hint = levels[currentLevelIdx].hint;
    showFeedback("info", `💡 <strong>Hint:</strong> ${hint}`);
  }

  function resetLevel() {
    loadLevel(currentLevelIdx);
  }

  function showFeedback(type, message) {
    const box = document.getElementById("game-feedback-box");
    if (!box) return;

    if (!message) {
      box.className = "feedback-box";
      box.innerHTML = "";
      return;
    }

    box.className = type === "info" ? "feedback-box show info hint" : `feedback-box show ${type}`;
    box.innerHTML = message;
  }

  function reset() {
    currentLevelIdx = 0;
    currentCards = [];
    adjacentSwaps = 0;
    solvedLevels.clear();
    allLevelsAwarded = false;
    focusCardId = null;
    pointerDrag = null;
    loadLevel(0);
  }

  function init() {
    const checkBtn = document.getElementById("game-check-btn");
    const hintBtn = document.getElementById("game-hint-btn");
    const resetBtn = document.getElementById("game-reset-btn");

    if (checkBtn) checkBtn.addEventListener("click", checkOrder);
    if (hintBtn) hintBtn.addEventListener("click", giveHint);
    if (resetBtn) resetBtn.addEventListener("click", resetLevel);

    buildLevelChips();
    // Preserve earned progress: a returning learner can revisit any board.
    if (window.App && typeof window.App.getProgress === "function") {
      const progress = window.App.getProgress();
      if (progress.milestones && progress.milestones["game.allLevels"]) {
        levels.forEach((_, index) => solvedLevels.add(index));
        allLevelsAwarded = true;
      }
    }
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", endPointerDrag);
    document.addEventListener("pointercancel", endPointerDrag);

    loadLevel(0);
  }

  return {
    init,
    loadLevel,
    checkOrder,
    giveHint,
    resetLevel,
    reset,
  };
})();

window.SortGameModule = SortGameModule;
