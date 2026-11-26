/**
 * The Sorting Investigation - Screen 3: Interactive Evidence Room
 * Allows learners to inspect hospital record cards, compare values,
 * and experience firsthand why unsorted data makes analysis harder.
 */

const EvidenceModule = (function () {
  const records = [
    {
      id: "ward-a",
      ward: "Ward A",
      category: "Admissions",
      value: 42,
      unit: "patients",
      condition: "Fever & Dysentery",
      date: "12 Nov 1854",
      notes: "Severe overcrowding in main hall. Cross-ventilation blocked.",
      historicity: "Simplified learning example reflecting Crimean War hospital tallies.",
    },
    {
      id: "ward-b",
      ward: "Ward B",
      category: "Admissions",
      value: 19,
      unit: "patients",
      condition: "Surgical Recovery",
      date: "14 Nov 1854",
      notes: "Bandages in short supply. Clean water needed for washing wounds.",
      historicity: "Simplified learning example reflecting Crimean War hospital tallies.",
    },
    {
      id: "ward-c",
      ward: "Ward C",
      category: "Admissions",
      value: 85,
      unit: "patients",
      condition: "Cholera Outbreak",
      date: "15 Nov 1854",
      notes: "Urgent crisis. Suspected contaminated water pipe beneath floorboards.",
      historicity: "Simplified learning example reflecting Crimean War hospital tallies.",
    },
    {
      id: "ward-d",
      ward: "Ward D",
      category: "Admissions",
      value: 64,
      unit: "patients",
      condition: "Typhus & Frostbite",
      date: "17 Nov 1854",
      notes: "Winter weather worsening symptoms. Inadequate blankets.",
      historicity: "Simplified learning example reflecting Crimean War hospital tallies.",
    },
    {
      id: "ward-e",
      ward: "Ward E",
      category: "Admissions",
      value: 128,
      unit: "patients",
      condition: "General Convalescent",
      date: "18 Nov 1854",
      notes: "Longest ward corridor. Over 100 soldiers lying on wooden cots.",
      historicity: "Simplified learning example reflecting Crimean War hospital tallies.",
    },
  ];

  let selectedCardsForComparison = [];
  let comparisonAwarded = false;

  function renderEvidenceCards() {
    const grid = document.getElementById("evidence-cards-grid");
    if (!grid) return;

    grid.innerHTML = records
      .map((rec) => {
        const isSelected = selectedCardsForComparison.some((c) => c.id === rec.id);
        return `
        <div class="card parchment-card evidence-card ${isSelected ? "selected" : ""}" data-id="${rec.id}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="Inspect ${rec.ward} record">
          <div class="evidence-card-header">
            <span class="ward-badge">${rec.ward}</span>
            <span style="font-size: 0.75rem; color: var(--text-light);">${rec.date}</span>
          </div>
          <div class="evidence-number-display">
            <span class="evidence-value">${rec.value}</span>
            <span class="evidence-unit">${rec.unit}</span>
          </div>
          <p style="font-weight: 600; font-size: 0.85rem; color: #92400e; margin-bottom: 0.25rem;">${rec.condition}</p>
          <div class="evidence-detail">
            <p>${rec.notes}</p>
            <p style="font-size: 0.725rem; color: #64748b; margin-top: 0.35rem; font-style: italic;">Note: ${rec.historicity}</p>
          </div>
        </div>
      `;
      })
      .join("");

    // Attach click listeners to cards
    grid.querySelectorAll(".evidence-card").forEach((el) => {
      el.addEventListener("click", () => {
        const cardId = el.getAttribute("data-id");
        toggleCardSelection(cardId);
      });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const cardId = el.getAttribute("data-id");
          toggleCardSelection(cardId);
        }
      });
    });
  }

  // Selection changes are applied in place so the focused card never loses focus.
  function updateCardSelectionUI() {
    const grid = document.getElementById("evidence-cards-grid");
    if (!grid) return;

    grid.querySelectorAll(".evidence-card").forEach((el) => {
      const cardId = el.getAttribute("data-id");
      const isSelected = selectedCardsForComparison.some((c) => c.id === cardId);
      el.classList.toggle("selected", isSelected);
      el.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  function maybeAwardComparison() {
    if (selectedCardsForComparison.length === 2 && !comparisonAwarded) {
      comparisonAwarded = true;
      if (window.App && typeof window.App.awardMilestone === "function") {
        window.App.awardMilestone("evidence.compared");
      }
    }
  }

  function toggleCardSelection(cardId) {
    const cardData = records.find((r) => r.id === cardId);
    if (!cardData) return;

    const existingIndex = selectedCardsForComparison.findIndex((c) => c.id === cardId);
    if (existingIndex >= 0) {
      selectedCardsForComparison.splice(existingIndex, 1);
    } else {
      if (selectedCardsForComparison.length >= 2) {
        selectedCardsForComparison.shift(); // keep max 2
      }
      selectedCardsForComparison.push(cardData);
    }

    updateCardSelectionUI();
    updateComparisonBox();
    maybeAwardComparison();
  }

  function updateComparisonBox() {
    const compBox = document.getElementById("evidence-comparison-display");

    // Proceed is enabled only when exactly two cards are selected.
    const proceedBtn = document.getElementById("evidence-proceed-btn");
    if (proceedBtn) {
      const canProceed = selectedCardsForComparison.length === 2;
      proceedBtn.disabled = !canProceed;
      proceedBtn.setAttribute("aria-disabled", canProceed ? "false" : "true");
    }

    if (!compBox) return;

    if (selectedCardsForComparison.length === 0) {
      compBox.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.95rem; text-align: center;">
          💡 Click any <strong>two record cards</strong> above to compare their patient counts directly!
        </p>
      `;
    } else if (selectedCardsForComparison.length === 1) {
      const c1 = selectedCardsForComparison[0];
      compBox.innerHTML = `
        <div style="text-align: center;">
          <p style="font-size: 0.95rem; color: var(--text-main);">
            Selected <strong>${c1.ward}</strong> (${c1.value} patients). Select a second card to compare!
          </p>
        </div>
      `;
    } else {
      const c1 = selectedCardsForComparison[0];
      const c2 = selectedCardsForComparison[1];
      const isC1Bigger = c1.value > c2.value;
      const diff = Math.abs(c1.value - c2.value);

      compBox.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
          <div style="text-align: center; padding: 0.5rem 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light);">
            <div style="font-size: 0.8rem; font-weight: 700; color: #64748b;">${c1.ward}</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: ${isC1Bigger ? "var(--color-primary)" : "var(--text-main)"};">${c1.value}</div>
          </div>
          <div style="font-weight: 800; font-size: 1.25rem; color: #92400e;">
            ${c1.value === c2.value ? "=" : isC1Bigger ? ">" : "<"}
          </div>
          <div style="text-align: center; padding: 0.5rem 1rem; background: #ffffff; border-radius: 8px; border: 1px solid var(--border-light);">
            <div style="font-size: 0.8rem; font-weight: 700; color: #64748b;">${c2.ward}</div>
            <div style="font-size: 1.75rem; font-weight: 800; color: ${!isC1Bigger ? "var(--color-primary)" : "var(--text-main)"};">${c2.value}</div>
          </div>
        </div>
        <p style="text-align: center; font-size: 0.9rem; color: var(--text-muted); margin-top: 0.75rem;">
          ${c1.value === c2.value
            ? "Both wards have the exact same number of patients."
            : `<strong>${isC1Bigger ? c1.ward : c2.ward}</strong> has <strong>${diff}</strong> more patients than <strong>${isC1Bigger ? c2.ward : c1.ward}</strong>.`
          }
        </p>
      `;
    }
  }

  function init() {
    renderEvidenceCards();
    updateCardSelectionUI();
    updateComparisonBox();

    const proceedBtn = document.getElementById("evidence-proceed-btn");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => {
        // Navigation alone never awards the comparison milestone.
        if (selectedCardsForComparison.length !== 2) return;
        if (window.App && typeof window.App.goToScreen === "function") {
          window.App.goToScreen(4);
        }
      });
    }
  }

  function reset() {
    selectedCardsForComparison = [];
    comparisonAwarded = false;
    updateCardSelectionUI();
    updateComparisonBox();
  }

  return {
    init,
    records,
    reset,
  };
})();

window.EvidenceModule = EvidenceModule;
