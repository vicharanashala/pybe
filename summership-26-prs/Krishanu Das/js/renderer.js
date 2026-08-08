/* =========================================================
   renderer.js
   Takes a step object -> builds DOM inside #storybook-card.
   Delegates coding/assessment step types to their own modules.
   ========================================================= */

const renderer = (function () {

  const cardEl = document.getElementById("storybook-card");

  /* ---------------------------------------------------------
     UTILITY: notify the app that something changed
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
        img.style.display = "none";
      };
      wrap.appendChild(img);
    });
    return wrap;
  }

  /* ---------------------------------------------------------
     UTILITY: CT sub-step ticks
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
     RENDER: STORY QUESTION
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
      row.style.animationDelay = (i * 0.6) + "s";

      row.appendChild(el("span", "mapping-key", pair.key));
      row.appendChild(el("span", "mapping-arrow", "→"));
      row.appendChild(el("span", "mapping-value", String(pair.value)));
      mapWrap.appendChild(row);
    });

    container.appendChild(mapWrap);

    if (step.closingLine) {
      const closing = el("p", null, step.closingLine);
      closing.style.fontStyle = "italic";
      closing.style.marginTop = "12px";
      container.appendChild(closing);
    }

    lessonEngine.markStepComplete(step.id);
  }

  /* ---------------------------------------------------------
     RENDER: CT SLOT 1 — REGISTRY LOOKUP ACTIVITY
     Replaces the old memory-based matching activity. The full
     registry stays visibly displayed (reusing the mapping-visual
     look) while the learner answers Akbar's question by tapping
     the correct tax amount — a lookup task, not a recall task.
     --------------------------------------------------------- */
  function renderLookupActivity(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(buildCTSubticks(step.ctIndex));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(el("p", null, step.instructions));

    // The registry: always visible, never hidden, never quizzed on.
    const registryWrap = el("div", "mini-card mapping-visual");
    step.registry.forEach((pair) => {
      const row = el("div", "mapping-row");
      row.appendChild(el("span", "mapping-key", pair.key));
      row.appendChild(el("span", "mapping-arrow", "→"));
      row.appendChild(el("span", "mapping-value", String(pair.value)));
      registryWrap.appendChild(row);
    });
    container.appendChild(registryWrap);

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
          el("h3", null, "Akbar nods, satisfied. Every question answered correctly.")
        );
        const badge = el("div", "feedback-badge success", "✓ Lookup Complete");
        feedback.appendChild(badge);
        feedback.appendChild(el("p", null, step.completionLine));
        lessonEngine.markStepComplete(step.id);
        notifyInteraction();
        return;
      }

      const round = step.rounds[savedProgress.roundIndex];
      promptBox.appendChild(
        el("h3", null, `Akbar asks: "What does ${round.askProvince} owe?"`)
      );

      round.options.forEach((taxValue) => {
        const btn = el("button", "option-btn retrieval-btn", String(taxValue));
        btn.type = "button";

        btn.addEventListener("click", () => {
          const isCorrect = taxValue === round.correctTax;

          if (isCorrect) {
            btn.classList.add("correct");
            Array.from(buttonRow.children).forEach((c) => (c.disabled = true));

            feedback.innerHTML = "";
            const badge = el(
              "div",
              "feedback-badge success",
              `✓ ${round.askProvince} owes ${round.correctTax} gold mudras`
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
     RENDER: CT SLOT 2 — DISCOVERY QUESTIONS
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
      const followUp = el("p", null, q.followUp);
      followUp.classList.add("discovery-followup");
      followUp.style.display = "none";

      const previousAnswer = savedAnswers[q.id];

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
          followUp.style.display = "block";
          checkCompletion();
        });

        list.appendChild(btn);
      });

      if (previousAnswer !== undefined) {
        followUp.style.display = "block";
      }

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
          el("h3", null, "Akbar nods, satisfied. All questions answered correctly.")
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
        el("h3", null, `Akbar asks: "What does ${round.askProvince} owe?"`)
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
     RENDER: CONCEPT DISCOVERY · REVEAL
     --------------------------------------------------------- */
  function renderReveal(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));
    container.appendChild(buildParagraphs(step.paragraphs));

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
     RENDER: MENTAL MODEL
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
     RENDER: PYTHON SYNTAX — learner-controlled operations demo.
     Left: Birbal's ledger. Right: the Python dictionary. Both
     start fully populated. A single "Next" button (disabled while
     animating) advances through Add -> Update -> Delete, one
     click at a time. After Delete finishes, the button becomes
     "Finish ->", which marks the step complete so the footer's
     Next button unlocks.
     --------------------------------------------------------- */
  function renderSyntax(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));

    const announcementHolder = el("div", "syntax-announcement-holder");
    container.appendChild(announcementHolder);

    const splitWrap = el("div", "syntax-split");
    const ledgerPanel = el("div", "syntax-ledger-panel");
    const codePanel = el("div", "syntax-code-panel");
    splitWrap.appendChild(ledgerPanel);
    splitWrap.appendChild(codePanel);
    container.appendChild(splitWrap);

    const controlHolder = el("div", "syntax-controls");
    const nextBtn = el("button", "nav-btn nav-btn-next", "Next →");
    nextBtn.type = "button";
    controlHolder.appendChild(nextBtn);
    container.appendChild(controlHolder);

    // Persisted so navigating back/forward restores exactly where
    // the learner left off, instead of restarting the sequence.
    const saved = lessonEngine.getResponse(step.id) || {
      opsPlayed: 0,
      finished: false
    };

    /* ----- Compute registry state after N operations have played ----- */
    function computeState(opsPlayed) {
      let entries = step.initialEntries.slice();
      for (let i = 0; i < opsPlayed; i++) {
        const op = step.operations[i];
        if (op.type === "add") {
          entries = entries.concat([{ key: op.key, value: op.value }]);
        } else if (op.type === "update") {
          entries = entries.map((pair) =>
            pair.key === op.key ? { key: pair.key, value: op.newValue } : pair
          );
        } else if (op.type === "delete") {
          entries = entries.filter((pair) => pair.key !== op.key);
        }
      }
      return entries;
    }

    /* ----- Build the ledger book (static, no animation) ----- */
    function buildLedger(entries) {
      ledgerPanel.innerHTML = "";
      ledgerPanel.appendChild(el("div", "ledger-book-title", step.ledgerTitle));
      entries.forEach((pair) => {
        const row = el("div", "ledger-entry");
        row.dataset.key = pair.key;
        row.appendChild(el("span", "ledger-key", pair.key));
        row.appendChild(el("span", "ledger-dots", "·····"));
        const valueEl = el(
          "span",
          "ledger-value ledger-value-current",
          pair.value + " Gold Coins"
        );
        row.appendChild(valueEl);
        ledgerPanel.appendChild(row);
      });
    }

    /* ----- Build the Python dictionary, line by line (static) ----- */
    function buildCode(entries) {
      codePanel.innerHTML = "";
      codePanel.appendChild(el("div", "syntax-panel-label", "🐍 Python Dictionary"));

      const codeBlock = el("div", "syntax-code-block syntax-code-lines");
      codeBlock.appendChild(el("div", "code-line", `${step.variableName} = {`));

      entries.forEach((pair, i) => {
        const isLast = i === entries.length - 1;
        const lineEl = el("div", "code-line code-entry-line");
        lineEl.dataset.key = pair.key;
        lineEl.appendChild(el("span", null, `    "${pair.key}": `));
        lineEl.appendChild(el("span", "code-entry-value", String(pair.value)));
        lineEl.appendChild(el("span", null, isLast ? "" : ","));
        codeBlock.appendChild(lineEl);
      });

      codeBlock.appendChild(el("div", "code-line", "}"));
      codePanel.appendChild(codeBlock);
    }

    /* ----- Shows an operation's story line, then "types" its
       Python statement beneath the dictionary, then calls onDone ----- */
    function showStoryAndCode(op, onDone) {
      announcementHolder.innerHTML = "";
      announcementHolder.appendChild(el("div", "syntax-announcement", op.story));

      const typedHolder = el("div", "syntax-typed-holder");
      const typedLine = el("pre", "syntax-code-block syntax-typed-line", "");
      typedHolder.appendChild(typedLine);
      codePanel.appendChild(typedHolder);

      let charIndex = 0;
      const fullLine = op.line;
      const typeInterval = setInterval(() => {
        charIndex += 1;
        typedLine.textContent = fullLine.slice(0, charIndex);
        if (charIndex >= fullLine.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            typedHolder.remove();
            onDone();
          }, 900);
        }
      }, 70);
    }

    /* ----- Animates one operation's effect across both panels,
       then calls onComplete once the animation has fully settled ----- */
    function animateOperation(op, onComplete) {
      if (op.type === "add") {
        const row = el("div", "ledger-entry ledger-entry-new");
        row.dataset.key = op.key;
        row.appendChild(el("span", "ledger-key", op.key));
        row.appendChild(el("span", "ledger-dots", "·····"));
        row.appendChild(
          el("span", "ledger-value ledger-value-current", op.value + " Gold Coins")
        );
        ledgerPanel.appendChild(row);

        const codeBlock = codePanel.querySelector(".syntax-code-lines");
        const closeLine = codeBlock.lastElementChild;
        const priorEntryLines = codeBlock.querySelectorAll(".code-entry-line");
        if (priorEntryLines.length > 0) {
          priorEntryLines[priorEntryLines.length - 1].lastChild.textContent = ",";
        }
        const newLine = el("div", "code-line code-entry-line code-entry-line-new");
        newLine.dataset.key = op.key;
        newLine.appendChild(el("span", null, `    "${op.key}": `));
        newLine.appendChild(el("span", "code-entry-value", String(op.value)));
        newLine.appendChild(el("span", null, ""));
        codeBlock.insertBefore(newLine, closeLine);

        setTimeout(onComplete, 700);
      } else if (op.type === "update") {
        const ledgerRow = ledgerPanel.querySelector(`.ledger-entry[data-key="${op.key}"]`);
        const ledgerValueEl = ledgerRow ? ledgerRow.querySelector(".ledger-value-current") : null;
        const codeLine = codePanel.querySelector(`.code-entry-line[data-key="${op.key}"]`);

        if (ledgerValueEl) ledgerValueEl.classList.add("ledger-value-strike");
        if (codeLine) codeLine.classList.add("code-entry-line-highlight");

        setTimeout(() => {
          if (ledgerValueEl) {
            ledgerValueEl.classList.remove("ledger-value-strike");
            ledgerValueEl.textContent = op.newValue + " Gold Coins";
            ledgerValueEl.classList.add("ledger-value-rewritten");
          }
          if (codeLine) {
            const valueSpan = codeLine.querySelector(".code-entry-value");
            if (valueSpan) {
              valueSpan.textContent = String(op.newValue);
              valueSpan.classList.add("code-entry-value-changed");
            }
          }
          setTimeout(onComplete, 600);
        }, 750);
      } else if (op.type === "delete") {
        const ledgerRow = ledgerPanel.querySelector(`.ledger-entry[data-key="${op.key}"]`);
        const codeLine = codePanel.querySelector(`.code-entry-line[data-key="${op.key}"]`);

        if (ledgerRow) ledgerRow.classList.add("ledger-entry-removed");
        if (codeLine) codeLine.classList.add("code-entry-line-removed");

        setTimeout(() => {
          if (ledgerRow) ledgerRow.remove();
          if (codeLine) {
            const codeBlock = codePanel.querySelector(".syntax-code-lines");
            const remainingEntryLines = Array.from(
              codeBlock.querySelectorAll(".code-entry-line")
            ).filter((l) => l !== codeLine);
            codeLine.remove();
            if (remainingEntryLines.length > 0) {
              remainingEntryLines[remainingEntryLines.length - 1].lastChild.textContent = "";
            }
          }
          onComplete();
        }, 700);
      } else {
        onComplete();
      }
    }

    /* ----- Handles a click on the internal Next / Finish button ----- */
    function handleNextClick() {
      if (saved.finished) return;

      // All three operations already played -> this click means "Finish"
      if (saved.opsPlayed >= step.operations.length) {
        saved.finished = true;
        lessonEngine.saveResponse(step.id, saved);
        lessonEngine.markStepComplete(step.id);
        nextBtn.disabled = true;
        nextBtn.textContent = "✓ Lesson Complete";
        announcementHolder.innerHTML = "";
        notifyInteraction();
        return;
      }

      // Otherwise, play the next operation in the sequence.
      nextBtn.disabled = true;
      const op = step.operations[saved.opsPlayed];

      showStoryAndCode(op, () => {
        animateOperation(op, () => {
          saved.opsPlayed += 1;
          lessonEngine.saveResponse(step.id, saved);

          if (saved.opsPlayed >= step.operations.length) {
            nextBtn.textContent = "Finish →";
          }
          nextBtn.disabled = false;
        });
      });
    }

    nextBtn.addEventListener("click", handleNextClick);

    /* ----- Boot: restore whatever state was previously reached ----- */
    const settledEntries = computeState(saved.opsPlayed);
    buildLedger(settledEntries);
    buildCode(settledEntries);

    if (saved.finished) {
      lessonEngine.markStepComplete(step.id);
      nextBtn.disabled = true;
      nextBtn.textContent = "✓ Lesson Complete";
    } else if (saved.opsPlayed >= step.operations.length) {
      nextBtn.disabled = false;
      nextBtn.textContent = "Finish →";
    } else {
      nextBtn.disabled = false;
      nextBtn.textContent = "Next →";
    }

    // NOTE: markStepComplete is intentionally NOT called here for the
    // unfinished case — the footer's real Next button stays disabled
    // until the learner clicks through to "Finish," per the new
    // learner-controlled flow.
  }
  /* ---------------------------------------------------------
     RENDER: INTERACTIVE CODING
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
     RENDER: ASSESSMENT
     --------------------------------------------------------- */
  function renderAssessment(step, container) {
    container.appendChild(buildEyebrow(step.eyebrow));
    container.appendChild(el("h2", null, step.title));

    const assessmentMount = el("div");
    container.appendChild(assessmentMount);

    assessmentModule.render(assessmentMount, step, notifyInteraction);
  }

  /* ---------------------------------------------------------
     RENDER: REFLECTION
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
     "matching-activity" replaced with "lookup-activity"
     --------------------------------------------------------- */
  const RENDERERS = {
    story: renderStory,
    question: renderQuestion,
    "mapping-visual": renderMappingVisual,
    "lookup-activity": renderLookupActivity,
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