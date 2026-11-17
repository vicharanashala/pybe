/* =========================================================
   codeEditor.js
   Fake IDE: textarea + Run button + simulated output console.
   No real Python execution — string/pattern matching only,
   as agreed for this prototype.
   ========================================================= */

const codeEditorModule = (function () {

  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  /* ---------------------------------------------------------
     SIMULATED EXECUTION
     Since there is no real Python interpreter in this
     prototype, we check the learner's code against simple
     rules defined in lessonData.js:
       - requiredSubstrings (+ requiredAny flag): at least one
         of these substrings must appear in the code
       - mustContain: a required keyword (e.g. "print")
       - expectedOutput: the exact string we "pretend" Python
         would print if the code is correct
     --------------------------------------------------------- */
  function simulateRun(code, validation) {
    const trimmed = code.trim();

    if (!trimmed) {
      return {
        success: false,
        output: "Error: your code is empty. Write something before running it."
      };
    }

    const hasKeyword = validation.mustContain
      ? trimmed.includes(validation.mustContain)
      : true;

    let hasRequiredSubstring = false;
    if (validation.requiredSubstrings && validation.requiredSubstrings.length > 0) {
      if (validation.requiredAny) {
        hasRequiredSubstring = validation.requiredSubstrings.some((sub) =>
          trimmed.includes(sub)
        );
      } else {
        hasRequiredSubstring = validation.requiredSubstrings.every((sub) =>
          trimmed.includes(sub)
        );
      }
    } else {
      hasRequiredSubstring = true;
    }

    if (hasKeyword && hasRequiredSubstring) {
      return {
        success: true,
        output: validation.expectedOutput
      };
    }

    // Build a helpful-but-honest error message for the prototype.
    let errorLines = ["Error: expected output not produced."];
    if (!hasKeyword) {
      errorLines.push(`Hint: make sure your code uses "${validation.mustContain}(...)".`);
    }
    if (!hasRequiredSubstring) {
      errorLines.push("Hint: make sure you're looking up the correct key using square brackets.");
    }
    return {
      success: false,
      output: errorLines.join("\n")
    };
  }

  /* ---------------------------------------------------------
     PUBLIC: render
     Builds the editor UI inside the given mount element.
     step: the "coding" step object from lessonData.js
     notifyInteraction: callback to tell the app state changed
     --------------------------------------------------------- */
  function render(mountEl, step, notifyInteraction) {
    const wrapper = el("div", "code-editor-wrapper");

    /* ---------- Title bar ---------- */
    const titlebar = el("div", "code-editor-titlebar");
    titlebar.appendChild(el("span", "titlebar-dot red"));
    titlebar.appendChild(el("span", "titlebar-dot yellow"));
    titlebar.appendChild(el("span", "titlebar-dot green"));
    titlebar.appendChild(el("span", "titlebar-filename", step.filename || "main.py"));
    wrapper.appendChild(titlebar);

    /* ---------- Textarea ---------- */
    const textarea = document.createElement("textarea");
    textarea.className = "code-textarea";
    textarea.spellcheck = false;

    const savedCode = lessonEngine.getResponse(step.id);
    textarea.value = savedCode !== undefined ? savedCode : step.starterCode;

    wrapper.appendChild(textarea);

    /* ---------- Actions row (hint + Run button) ---------- */
    const actionsRow = el("div", "editor-actions");
    const hint = el("span", "editor-hint", step.hint ? "💡 " + step.hint : "");
    const runBtn = el("button", "run-btn", "▶ Run Code");
    runBtn.type = "button";

    actionsRow.appendChild(hint);
    actionsRow.appendChild(runBtn);
    wrapper.appendChild(actionsRow);

    /* ---------- Output console ---------- */
    const output = el("div", "code-output empty");
    wrapper.appendChild(output);

    /* ---------- Restore previous run result, if any ---------- */
    const wasCompleted = lessonEngine.isStepComplete(step.id);
    if (savedCode !== undefined && wasCompleted) {
      output.classList.remove("empty");
      output.classList.add("success");
      output.textContent = step.successMessage;
    }

    /* ---------- Run button behavior ---------- */
    runBtn.addEventListener("click", () => {
      const code = textarea.value;
      lessonEngine.saveResponse(step.id, code);

      const result = simulateRun(code, step.validation);

      output.classList.remove("empty", "success", "error");

      if (result.success) {
        output.classList.add("success");
        output.textContent = step.successMessage;
        lessonEngine.markStepComplete(step.id);
      } else {
        output.classList.add("error");
        output.textContent = result.output + "\n\n" + step.errorMessage;
        lessonEngine.markStepIncomplete(step.id);
      }

      notifyInteraction();
    });

    mountEl.appendChild(wrapper);
  }

  return {
    render
  };

})();