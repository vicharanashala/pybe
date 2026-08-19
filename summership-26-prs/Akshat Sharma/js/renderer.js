/* =========================================================
   renderer.js
   Takes a step object -> builds DOM inside #storybook-card.
   Delegates coding/assessment step types to their own modules.
   ========================================================= */

const renderer = (function () {

  const cardEl = document.getElementById("storybook-card");

  /* ---------------------------------------------------------
     UTILITY: notify the app that something changed
     (navigation.js listens for this to refresh Next button state)
     --------------------------------------------------------- */
  function notifyInteraction() {
    document.dispatchEvent(new CustomEvent("pybe:interaction"));
  }

  /* ---------------------------------------------------------
     UTILITY: small DOM builder helpers
     --------------------------------------------------------- */
  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  function buildEyebrow(text) {
    return el("span", "step-eyebrow", text);
  }

  function buildParagraphs(paragraphs) {
    const wrap = document.createDocumentFragment();
    (paragraphs || []).forEach((p) => {
      wrap.appendChild(el("p", null, p));
    });
    return wrap;
  }

  function buildMedia(media) {
    if (!media || media.length === 0) return null;
    const wrap = el("div", "step-media");
    media.forEach((m) => {
      const img = document.createElement("img");
      img.src = m.src;
      img.alt = m.alt || "";
      img.onerror = function () {
        // Prototype safeguard: if illustration assets are missing,
        // hide the broken image rather than show a broken icon.
        img.style.display = "none";
      };
      wrap.appendChild(img);
    });
    return wrap;
  }

  /* ---------------------------------------------------------
     UTILITY: CT sub-step ticks, shared by all four CT slot
     renderers (mapping-visual, matching-activity, discovery,
     retrieval-activity). Labels come from lessonData.js.
     --------------------------------------------------------- */
  function buildCTSubticks(activeCtIndex) {
    const ticks = el("div", "ct-subticks");
    CT_SUBSTEP_LABELS.forEach((label, i) => {
      const tick = el("div", "ct-subtick", label);
      if (i === activeCtIndex) {
        tick.classList.add("active");
      } else if (i < activeCtIndex) {
        tick.classList.add("done");
      }
      ticks.appendChild(tick);
    });
    return ticks;
  }

  /* ---------------------------------------------------------
     RENDER: STORY
     (also used for the "Concept Discovery · A New Thought"
     transition step, which is plain narrative)
     --------------------------------------------------------- */
  function renderStory(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));

    const media = buildMedia(step.media);
    if (media) container.appendChild(media);

    const storyBox = el("div", "story-text");
    step.paragraphs.forEach((p, i) => {
      const pEl = el("p", null, p);
      if (i === step.paragraphs.length - 1) pEl.style.marginBottom = "0";
      storyBox.appendChild(pEl);
    });
    container.appendChild(storyBox);
  }

  /* ---------------------------------------------------------
     RENDER: STORY QUESTION (single question, options list)
     --------------------------------------------------------- */
  function renderQuestion(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));

    const block = el("div", "question-block");
    block.appendChild(el("h3", null, step.prompt));

    const list = el("div", "option-list");
    const feedbackHolder = el("div");

    const previousResponse = lessonEngine.getResponse(step.id);

    step.options.forEach((optionText, index) => {
      const btn = el("button", "option-btn", optionText);
      btn.type = "button";

      if (previousResponse !== undefined && previousResponse === index) {
        btn.classList.add(index === step.correctIndex ? "correct" : "incorrect");
      }

      btn.addEventListener("click", () => {
        Array.from(list.children).forEach((child, i) => {
          child.disabled = true;
          child.classList.remove("selected");
          if (i === step.correctIndex) {
            child.classList.add("correct");
          } else if (i === index) {
            child.classList.add("incorrect");
          }
        });

        lessonEngine.saveResponse(step.id, index);
        lessonEngine.markStepComplete(step.id);

        feedbackHolder.innerHTML = "";
        const badge = el(
          "div",
          index === step.correctIndex ? "feedback-badge success" : "feedback-badge error",
          index === step.correctIndex ? "✓ Correct" : "✗ Not quite"
        );
        feedbackHolder.appendChild(badge);
        feedbackHolder.appendChild(el("p", null, step.explanation));

        notifyInteraction();
      });

      list.appendChild(btn);
    });

    if (previousResponse !== undefined) {
      Array.from(list.children).forEach((child) => (child.disabled = true));
      const badge = el(
        "div",
        previousResponse === step.correctIndex ? "feedback-badge success" : "feedback-badge error",
        previousResponse === step.correctIndex ? "✓ Correct" : "✗ Not quite"
      );
      feedbackHolder.appendChild(badge);
      feedbackHolder.appendChild(el("p", null, step.explanation));
    }

    block.appendChild(list);
    block.appendChild(feedbackHolder);
    container.appendChild(block);
  }

  /* ---------------------------------------------------------
     RENDER: CT SLOT 0 — ASSOCIATIVE MAPPING (animated arrows)
     --------------------------------------------------------- */
  function renderMappingVisual(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(buildCTSubticks(step.ctIndex));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(buildParagraphs(step.paragraphs));

    const mapWrap = el("div", "mini-card mapping-visual");

    step.pairs.forEach((pair, i) => {
      const row = el("div", "mapping-row");
      row.style.animationDelay = (i * 0.25) + "s";

      const keyBox = el("span", "mapping-key", pair.key);
      const arrow = el("span", "mapping-arrow", "→");
      const valueBox = el("span", "mapping-value", String(pair.value));

      row.appendChild(keyBox);
      row.appendChild(arrow);
      row.appendChild(valueBox);
      mapWrap.appendChild(row);
    });

    container.appendChild(mapWrap);

    if (step.closingLine) {
      const closing = el("p", null, step.closingLine);
      closing.style.fontStyle = "italic";
      closing.style.marginTop = "12px";
      container.appendChild(closing);
    }

    // This step requires no interaction beyond viewing the animation.
    lessonEngine.markStepComplete(step.id);
  }

  /* ---------------------------------------------------------
     RENDER: CT SLOT 1 — MATCHING ACTIVITY (click province,
     then click its tax amount, to rebuild the registry)
     --------------------------------------------------------- */
  function renderMatchingActivity(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(buildCTSubticks(step.ctIndex));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(el("p", null, step.instructions));

    const board = el("div", "matching-board");
    const provinceCol = el("div", "matching-column");
    const taxCol = el("div", "matching-column");

    const savedMatches = lessonEngine.getResponse(step.id) || {};
    let selectedProvince = null;
    const matchedProvinces = new Set(Object.keys(savedMatches));
    const matchedTaxes = new Set(Object.values(savedMatches).map(String));

    const feedback = el("div");

    function checkCompletion() {
      const allMatched = step.provinces.every((p) =>
        Object.prototype.hasOwnProperty.call(savedMatches, p)
      );
      if (allMatched) {
        lessonEngine.markStepComplete(step.id);
        feedback.innerHTML = "";
        const badge = el("div", "feedback-badge success", "✓ Registry Complete");
        feedback.appendChild(badge);
        feedback.appendChild(el("p", null, step.successMessage));
      } else {
        lessonEngine.markStepIncomplete(step.id);
      }
      notifyInteraction();
    }

    // Province chips
    step.provinces.forEach((province) => {
      const chip = el("button", "option-btn match-chip", province);
      chip.type = "button";

      if (matchedProvinces.has(province)) {
        chip.classList.add("correct");
        chip.disabled = true;
      }

      chip.addEventListener("click", () => {
        if (chip.disabled) return;
        Array.from(provinceCol.children).forEach((c) => c.classList.remove("selected"));
        chip.classList.add("selected");
        selectedProvince = province;
      });

      provinceCol.appendChild(chip);
    });

    // Tax chips
    step.taxOptions.forEach((taxValue) => {
      const chip = el("button", "option-btn match-chip", String(taxValue));
      chip.type = "button";

      if (matchedTaxes.has(String(taxValue))) {
        chip.classList.add("correct");
        chip.disabled = true;
      }

      chip.addEventListener("click", () => {
        if (chip.disabled || !selectedProvince) return;

        const isCorrect = step.correctMap[selectedProvince] === taxValue;

        if (isCorrect) {
          savedMatches[selectedProvince] = taxValue;
          matchedProvinces.add(selectedProvince);
          matchedTaxes.add(String(taxValue));
          lessonEngine.saveResponse(step.id, savedMatches);

          // Lock both the province chip and the tax chip.
          Array.from(provinceCol.children).forEach((c) => {
            if (c.textContent === selectedProvince) {
              c.classList.remove("selected");
              c.classList.add("correct");
              c.disabled = true;
            }
          });
          chip.classList.add("correct");
          chip.disabled = true;
          selectedProvince = null;

          checkCompletion();
        } else {
          // Brief incorrect flash, then reset selection.
          chip.classList.add("incorrect");
          setTimeout(() => chip.classList.remove("incorrect"), 500);
        }
      });

      taxCol.appendChild(chip);
    });

    board.appendChild(provinceCol);
    board.appendChild(taxCol);
    container.appendChild(board);
    container.appendChild(feedback);

    // Restore full-completion feedback if the learner already finished
    // this activity before navigating away and back.
    if (Object.keys(savedMatches).length === step.provinces.length) {
      const badge = el("div", "feedback-badge success", "✓ Registry Complete");
      feedback.appendChild(badge);
      feedback.appendChild(el("p", null, step.successMessage));
    }
  }

  /* ---------------------------------------------------------
     RENDER: CT SLOT 2 — DISCOVERY QUESTIONS (Socratic,
     two-option questions with reasoning follow-up)
     --------------------------------------------------------- */
  function renderDiscovery(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(buildCTSubticks(step.ctIndex));
    container.appendChild(el("h2", null, step.title));
    if (step.intro) container.appendChild(el("p", null, step.intro));

    const savedAnswers = lessonEngine.getResponse(step.id) || {};

    function checkCompletion() {
      const allAnswered = step.questions.every(
        (q) => savedAnswers[q.id] !== undefined
      );
      if (allAnswered) {
        lessonEngine.markStepComplete(step.id);
      } else {
        lessonEngine.markStepIncomplete(step.id);
      }
      notifyInteraction();
    }

    step.questions.forEach((q) => {
      const block = el("div", "mini-card discovery-block");
      block.appendChild(el("h3", null, q.prompt));

      const list = el("div", "option-list");
      const followUp = el("p");
      followUp.classList.add("discovery-followup");
      followUp.style.display = "none";

      const previousAnswer = savedAnswers[q.id];

      function updateFollowUp(chosenIndex) {
        if (chosenIndex === q.correctIndex) {
          followUp.innerHTML = `<strong style="color: var(--color-success);">✓ Correct!</strong> ${q.followUp}`;
        } else {
          followUp.innerHTML = `<strong style="color: var(--color-error);">✗ Not quite.</strong> ${q.followUp}`;
        }
        followUp.style.display = "block";
      }

      if (previousAnswer !== undefined) {
        updateFollowUp(previousAnswer);
      }

      q.options.forEach((optionText, index) => {
        const btn = el("button", "option-btn", optionText);
        btn.type = "button";

        if (previousAnswer !== undefined) {
          btn.disabled = true;
          if (index === q.correctIndex) btn.classList.add("correct");
          else if (index === previousAnswer) btn.classList.add("incorrect");
        }

        btn.addEventListener("click", () => {
          Array.from(list.children).forEach((child, i) => {
            child.disabled = true;
            if (i === q.correctIndex) child.classList.add("correct");
            else if (i === index) child.classList.add("incorrect");
          });

          savedAnswers[q.id] = index;
          lessonEngine.saveResponse(step.id, savedAnswers);
          updateFollowUp(index);
          checkCompletion();
        });

        list.appendChild(btn);
      });



      block.appendChild(list);
      block.appendChild(followUp);
      container.appendChild(block);
    });

    checkCompletion();
  }

  /* ---------------------------------------------------------
     RENDER: CT SLOT 3 — RETRIEVAL ACTIVITY
     --------------------------------------------------------- */
  function renderRetrievalActivity(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(buildCTSubticks(step.ctIndex));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(el("p", null, step.instructions));

    const savedProgress = lessonEngine.getResponse(step.id) || { roundIndex: 0 };

    const promptBox = el("div", "mini-card retrieval-prompt");
    const buttonRow = el("div", "retrieval-buttons");
    const feedback = el("div");

    function renderRound() {
      buttonRow.innerHTML = "";
      promptBox.innerHTML = "";
      feedback.innerHTML = "";

      if (savedProgress.roundIndex >= step.rounds.length) {
        promptBox.appendChild(
          el("h3", null, "All items checked correctly!")
        );
        const badge = el("div", "feedback-badge success", "✓ Retrieval Complete");
        feedback.appendChild(badge);
        feedback.appendChild(el("p", null, step.completionLine));
        lessonEngine.markStepComplete(step.id);
        notifyInteraction();
        return;
      }

      const round = step.rounds[savedProgress.roundIndex];
      promptBox.appendChild(
        el("h3", null, `The Fox points to ${round.askProvince}.`)
      );

      step.provinceButtons.forEach((province) => {
        const btn = el("button", "option-btn retrieval-btn", province);
        btn.type = "button";

        btn.addEventListener("click", () => {
          const isCorrect = province === round.askProvince;

          if (isCorrect) {
            btn.classList.add("correct");
            Array.from(buttonRow.children).forEach((c) => (c.disabled = true));

            feedback.innerHTML = "";
            const badge = el(
              "div",
              "feedback-badge success",
              `✓ ${province} owes ${round.correctTax} gold mudras`
            );
            feedback.appendChild(badge);

            savedProgress.roundIndex += 1;
            lessonEngine.saveResponse(step.id, savedProgress);

            setTimeout(renderRound, 850);
          } else {
            btn.classList.add("incorrect");
            setTimeout(() => btn.classList.remove("incorrect"), 500);
          }
        });

        buttonRow.appendChild(btn);
      });
    }

    container.appendChild(promptBox);
    container.appendChild(buttonRow);
    container.appendChild(feedback);

    renderRound();
  }

  /* ---------------------------------------------------------
     RENDER: CONCEPT DISCOVERY · REVEAL (the dictionary reveal
     with an explicit story → Python legend)
     --------------------------------------------------------- */
  function renderReveal(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(buildParagraphs(step.paragraphs));

    // Show the same mapping visual once more, so the learner
    // recognizes it immediately before it becomes code.
    const mapWrap = el("div", "mini-card mapping-visual");
    step.mapPairs.forEach((pair) => {
      const row = el("div", "mapping-row");
      row.appendChild(el("span", "mapping-key", pair.key));
      row.appendChild(el("span", "mapping-arrow", "→"));
      row.appendChild(el("span", "mapping-value", String(pair.value)));
      mapWrap.appendChild(row);
    });
    container.appendChild(mapWrap);

    const pre = document.createElement("pre");
    pre.style.background = "#1e1710";
    pre.style.color = "#f3e9d2";
    pre.style.padding = "16px 20px";
    pre.style.borderRadius = "10px";
    pre.style.overflowX = "auto";
    pre.style.margin = "16px 0";
    pre.style.fontFamily = "var(--font-code)";
    pre.style.fontSize = "0.9rem";
    pre.textContent = step.code;
    container.appendChild(pre);

    const legend = el("div", "mini-card reveal-legend");
    step.legendPairs.forEach((pair) => {
      const row = el("div", "legend-row");
      row.appendChild(el("span", "legend-story", pair.story));
      row.appendChild(el("span", "legend-arrow", "→"));
      row.appendChild(el("span", "legend-python", pair.python));
      legend.appendChild(row);
    });
    container.appendChild(legend);

    if (step.closingLine) {
      const closing = el("p", null, step.closingLine);
      closing.style.fontStyle = "italic";
      closing.style.marginTop = "12px";
      container.appendChild(closing);
    }

    lessonEngine.markStepComplete(step.id);
  }

  /* ---------------------------------------------------------
     RENDER: MENTAL MODEL (pigeonhole boxes visual)
     --------------------------------------------------------- */
  function renderMentalModel(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(buildParagraphs(step.paragraphs));

    if (step.visualBoxes) {
      const grid = el("div", "mini-card");
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";
      grid.style.gap = "12px";

      step.visualBoxes.forEach((box) => {
        const pigeonhole = el("div");
        pigeonhole.style.border = "2px solid var(--color-gold)";
        pigeonhole.style.borderRadius = "8px";
        pigeonhole.style.padding = "10px";
        pigeonhole.style.textAlign = "center";
        pigeonhole.style.background = "var(--color-surface)";

        const label = el("div", null, box.label);
        label.style.fontWeight = "700";
        label.style.color = "var(--color-maroon)";
        label.style.fontSize = "0.85rem";

        const value = el("div", null, box.value);
        value.style.fontFamily = "var(--font-code)";
        value.style.marginTop = "4px";
        value.style.color = "var(--color-ink-soft)";

        pigeonhole.appendChild(label);
        pigeonhole.appendChild(value);
        grid.appendChild(pigeonhole);
      });

      container.appendChild(grid);
    }
  }

  /* ---------------------------------------------------------
     RENDER: PYTHON SYNTAX (code blocks, each motivated by a
     story event — read-only)
     --------------------------------------------------------- */
  function renderSyntax(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(buildParagraphs(step.paragraphs));

    (step.codeBlocks || []).forEach((block) => {
      const label = el("p", null, block.label);
      label.style.fontWeight = "600";
      label.style.color = "var(--color-maroon)";
      container.appendChild(label);

      if (block.motivation) {
        const motivation = el("p", null, "📜 " + block.motivation);
        motivation.style.fontStyle = "italic";
        motivation.style.color = "var(--color-ink-soft)";
        motivation.style.marginTop = "-8px";
        container.appendChild(motivation);
      }

      const pre = document.createElement("pre");
      pre.style.background = "#1e1710";
      pre.style.color = "#f3e9d2";
      pre.style.padding = "16px 20px";
      pre.style.borderRadius = "10px";
      pre.style.overflowX = "auto";
      pre.style.marginBottom = "16px";
      pre.style.fontFamily = "var(--font-code)";
      pre.style.fontSize = "0.9rem";
      pre.textContent = block.code;
      container.appendChild(pre);
    });
  }

  /* ---------------------------------------------------------
     RENDER: INTERACTIVE CODING (delegates to codeEditor.js)
     --------------------------------------------------------- */
  function renderCoding(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(el("p", null, step.instructions));

    const editorMount = el("div");
    container.appendChild(editorMount);

    codeEditorModule.render(editorMount, step, notifyInteraction);
  }

  /* ---------------------------------------------------------
     RENDER: ASSESSMENT (delegates to assessment.js)
     --------------------------------------------------------- */
  function renderAssessment(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));

    const assessmentMount = el("div");
    container.appendChild(assessmentMount);

    assessmentModule.render(assessmentMount, step, notifyInteraction);
  }

  /* ---------------------------------------------------------
     RENDER: REFLECTION (free-text, always completable)
     --------------------------------------------------------- */
  function renderReflection(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(buildParagraphs(step.paragraphs));

    step.prompts.forEach((promptText, i) => {
      const wrap = el("div", "mini-card");
      wrap.style.marginBottom = "12px";
      wrap.appendChild(el("h3", null, promptText));

      const textarea = document.createElement("textarea");
      textarea.className = "reflection-input";
      textarea.placeholder = "Write your thoughts here...";

      const savedResponses = lessonEngine.getResponse(step.id) || {};
      if (savedResponses[i]) {
        textarea.value = savedResponses[i];
      }

      textarea.addEventListener("input", () => {
        const current = lessonEngine.getResponse(step.id) || {};
        current[i] = textarea.value;
        lessonEngine.saveResponse(step.id, current);
        lessonEngine.markStepComplete(step.id);
        notifyInteraction();
      });

      wrap.appendChild(textarea);
      container.appendChild(wrap);
    });

    lessonEngine.markStepComplete(step.id);
  }

  /* ---------------------------------------------------------
     DISPATCH TABLE
     --------------------------------------------------------- */
  const RENDERERS = {
    story: renderStory,
    question: renderQuestion,
    "mapping-visual": renderMappingVisual,
    "matching-activity": renderMatchingActivity,
    discovery: renderDiscovery,
    "retrieval-activity": renderRetrievalActivity,
    reveal: renderReveal,
    "mental-model": renderMentalModel,
    syntax: renderSyntax,
    coding: renderCoding,
    assessment: renderAssessment,
    reflection: renderReflection
  };

  /* ---------------------------------------------------------
     PUBLIC: renderStep
     --------------------------------------------------------- */
  function renderStep(step) {
    cardEl.innerHTML = "";
    const content = el("div", "step-content");

    const renderFn = RENDERERS[step.type];
    if (renderFn) {
      renderFn(step, content);
    } else {
      content.appendChild(el("p", null, "Unknown step type: " + step.type));
    }

    cardEl.appendChild(content);
  }

  return {
    renderStep
  };

})();