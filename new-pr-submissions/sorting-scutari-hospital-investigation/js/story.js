/**
 * The Sorting Investigation - Screen 2: Historical Story Scene Viewer
 * Presents a self-contained, responsible narrative of Florence Nightingale
 * and the Scutari hospital records during the Crimean War.
 */

const StoryModule = (function () {
  const scenes = [
    {
      id: 1,
      title: "November 1854: Arrival at Scutari",
      image: "assets/images/story_scutari_nurses_1855.png",
      alt: "Authentic contemporary 1855 coloured lithograph of nurses caring for patients in the military hospital at Scutari (Thomas Packer, Day & Son)",
      caption: "Nurses caring for wounded soldiers in the military hospital at Scutari (Coloured lithograph by Thomas Packer, published by Day & Son, London, 1855, Wellcome Collection)",
      visual: "scutariHospital",
      narrative:
        "You arrive at the British military hospital in Scutari during the Crimean War. Thousands of injured soldiers fill cold, damp corridors. Shockingly, far more men are dying from preventable illnesses like cholera and typhus than from wounds received on the battlefield.",
      historicalFact:
        "Historical Fact: Selimiye Barracks in Scutari was constructed over cesspools and defective sewers. Contaminated water and poor airflow created deadly conditions.",
    },
    {
      id: 2,
      title: "The Unsorted Ledgers",
      image: "assets/images/story_medical_report_1858.png",
      alt: "Authentic page from Florence Nightingale's landmark 1858 report Notes on Matters Affecting the Health, Efficiency, and Hospital Administration of the British Army",
      caption: "Title page and statistical tables from Florence Nightingale's landmark report (Harrison & Sons, St. Martin's Lane, London, 1858, British Library / Wellcome Collection)",
      visual: "ledger",
      narrative:
        "Every ward keeps its own paper records. Admissions, supply crates, and patient counts are scribbled across loose pages. Because the records are unordered, nobody can quickly identify which ward is in greatest danger or running out of supplies first.",
      historicalFact:
        "Historical Fact: When Florence Nightingale arrived, hospital paperwork was chaotic and inconsistent. She established rigorous daily data-gathering systems.",
    },
    {
      id: 3,
      title: "Order Reveals Patterns",
      image: "assets/images/scene3_mortality_diagram.jpg",
      alt: "Florence Nightingale's original 1858 Polar Area Diagram of Causes of Mortality in the Army in the East",
      caption: "Florence Nightingale's Original 1858 Polar Area Diagram (Royal Commission Report, Harrison & Sons)",
      visual: "patternDiscovery",
      narrative:
        "Florence Nightingale understood a vital principle: unorganised numbers hide the truth, but sorted numbers reveal patterns. Arranging hospital tallies systematically helped demonstrate where sanitary dangers were concentrated and where supplies were most urgently needed.",
      historicalFact:
        "Historical Context: Nightingale collaborated with statistician William Farr, using meticulously gathered data and innovative diagrams to convince parliament to implement crucial hospital sanitation reforms.",
    },
    {
      id: 4,
      title: "Your Mission as Investigator",
      image: "assets/images/story_nightingale_ward_visit_1855.png",
      alt: "Authentic 1855 contemporary engraving of Florence Nightingale visiting wounded soldiers at night in the hospital at Scutari",
      caption: "Florence Nightingale visiting the sick in the hospital at Scutari (Contemporary engraving, 1855, Wellcome Collection / Illustrated London News)",
      visual: "investigatorMission",
      narrative:
        "You step into the role of a data investigator at Scutari. You will inspect the hospital records, learn how to sort information by hand, discover Python's built-in sorted() function, and complete the emergency allocation mission.",
      historicalFact:
        "Historical Note: Sorting numbers did not directly cure patients; physical sanitation, clean water, and fresh air saved lives. But organised data provided the essential evidence that drove and sustained those life-saving reforms.",
    },
  ];

  let currentSceneIndex = 0;
  const visitedScenes = new Set();

  function markVisited(index) {
    if (index >= 0 && index < scenes.length) visitedScenes.add(index);
  }

  function renderCurrentScene() {
    const scene = scenes[currentSceneIndex];
    const visualContainer = document.getElementById("story-visual-container");
    const titleEl = document.getElementById("story-title");
    const narrativeEl = document.getElementById("story-narrative");
    const factEl = document.getElementById("story-fact-text");
    const prevBtn = document.getElementById("story-prev-btn");
    const nextBtn = document.getElementById("story-next-btn");
    const dotsContainer = document.getElementById("story-dots-container");

    if (!titleEl) return;

    // Viewing a scene counts as visiting it.
    markVisited(currentSceneIndex);

    // Preserve keyboard focus on a dot across the re-render.
    const focusedDotIdx = dotsContainer && dotsContainer.contains(document.activeElement)
      ? document.activeElement.getAttribute("data-idx")
      : null;

    // Render authentic historical image with caption (or fallback to vector SVG)
    if (visualContainer) {
      if (scene.image) {
        visualContainer.innerHTML = `
          <div class="historical-img-frame">
            <img src="${scene.image}" alt="${scene.alt}" class="historical-story-img">
            <div class="historical-img-caption">${scene.caption}</div>
          </div>
        `;
      } else if (window.SVGIcons) {
        const svgKey = scene.visual;
        visualContainer.innerHTML = window.SVGIcons[svgKey] || "";
      }
    }

    titleEl.textContent = scene.title;
    narrativeEl.textContent = scene.narrative;
    factEl.textContent = scene.historicalFact;

    // Button states
    if (prevBtn) prevBtn.disabled = currentSceneIndex === 0;
    if (nextBtn) {
      if (currentSceneIndex === scenes.length - 1) {
        nextBtn.innerHTML = `Enter Evidence Room ${window.SVGIcons ? window.SVGIcons.icons.arrowRight : "→"}`;
        nextBtn.classList.remove("btn-secondary");
        nextBtn.classList.add("btn-primary");
      } else {
        nextBtn.innerHTML = `Next Scene ${window.SVGIcons ? window.SVGIcons.icons.arrowRight : "→"}`;
        nextBtn.classList.remove("btn-primary");
        nextBtn.classList.add("btn-secondary");
      }
    }

    // Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = scenes
        .map((s, idx) => {
          const isCurrent = idx === currentSceneIndex;
          const isVisited = visitedScenes.has(idx);
          return `<div class="story-dot story-dot-interactive ${isCurrent ? "active story-dot-current" : ""} ${isVisited ? "story-dot-visited" : ""}" data-idx="${idx}" title="Go to scene ${idx + 1}" role="button" tabindex="0" aria-label="Scene ${idx + 1}" aria-pressed="${isCurrent}" ${isCurrent ? 'aria-current="step"' : ""}></div>`;
        })
        .join("");

      dotsContainer.querySelectorAll(".story-dot").forEach((dot) => {
        const activate = () => {
          const idx = parseInt(dot.getAttribute("data-idx"), 10);
          goToScene(idx);
        };
        dot.addEventListener("click", activate);
        dot.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            activate();
          }
        });
      });

      if (focusedDotIdx !== null) {
        const dotToFocus = dotsContainer.querySelector(`.story-dot[data-idx="${focusedDotIdx}"]`);
        if (dotToFocus && typeof dotToFocus.focus === "function") dotToFocus.focus();
      }
    }
  }

  function nextScene() {
    if (currentSceneIndex < scenes.length - 1) {
      currentSceneIndex++;
      renderCurrentScene();
    } else {
      // Leaving the final scene: award only if every scene was actually visited.
      markVisited(currentSceneIndex);
      const allVisited = scenes.every((_, idx) => visitedScenes.has(idx));
      if (allVisited && window.App && typeof window.App.awardMilestone === "function") {
        window.App.awardMilestone("story.scenes");
      }
      if (window.App && typeof window.App.goToScreen === "function") {
        window.App.goToScreen(3);
      }
    }
  }

  function prevScene() {
    if (currentSceneIndex > 0) {
      currentSceneIndex--;
      renderCurrentScene();
    }
  }

  function goToScene(index) {
    if (index >= 0 && index < scenes.length) {
      currentSceneIndex = index;
      renderCurrentScene();
    }
  }

  function init() {
    const prevBtn = document.getElementById("story-prev-btn");
    const nextBtn = document.getElementById("story-next-btn");

    if (prevBtn) prevBtn.addEventListener("click", prevScene);
    if (nextBtn) nextBtn.addEventListener("click", nextScene);

    renderCurrentScene();
  }

  function reset() {
    currentSceneIndex = 0;
    visitedScenes.clear();
    renderCurrentScene();
  }

  return {
    init,
    goToScene,
    reset,
  };
})();

window.StoryModule = StoryModule;
