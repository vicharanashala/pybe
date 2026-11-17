/* =========================================================
   assessment.js
   Renders the multi-question assessment step.
   Step is complete only once ALL questions are answered.
   ========================================================= */

const assessmentModule = (function () {

  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  /* ---------------------------------------------------------
     Checks whether every question in this step has a saved
     answer, and updates the engine's completion state.
     --------------------------------------------------------- */
  function updateOverallCompletion(step) {
    const savedAnswers = lessonEngine.getResponse(step.id) || {};
    const allAnswered = step.questions.every(
      (q) => savedAnswers[q.id] !== undefined
    );

    if (allAnswered) {
      lessonEngine.markStepComplete(step.id);
    } else {
      lessonEngine.markStepIncomplete(step.id);
    }
  }

  /* ---------------------------------------------------------
     Renders a single question block (prompt + options + feedback)
     --------------------------------------------------------- */
  function renderSingleQuestion(step, question, questionNumber, notifyInteraction, container) {
    const block = el("div", "question-block");
    block.style.marginBottom = "24px";

    const heading = el("h3", null, `${questionNumber}. ${question.prompt}`);
    block.appendChild(heading);

    const list = el("div", "option-list");
    const feedbackHolder = el("div");

    const savedAnswers = lessonEngine.getResponse(step.id) || {};
    const previousAnswer = savedAnswers[question.id];

    question.options.forEach((optionText, index) => {
      const btn = el("button", "option-btn", optionText);
      btn.type = "button";

      // Restore prior state if the learner already answered this question
      if (previousAnswer !== undefined) {
        btn.disabled = true;
        if (index === question.correctIndex) {
          btn.classList.add("correct");
        } else if (index === previousAnswer) {
          btn.classList.add("incorrect");
        }
      }

      btn.addEventListener("click", () => {
        // Lock all options in this question once one is chosen
        Array.from(list.children).forEach((child, i) => {
          child.disabled = true;
          if (i === question.correctIndex) {
            child.classList.add("correct");
          } else if (i === index) {
            child.classList.add("incorrect");
          }
        });

        const current = lessonEngine.getResponse(step.id) || {};
        current[question.id] = index;
        lessonEngine.saveResponse(step.id, current);

        feedbackHolder.innerHTML = "";
        const isCorrect = index === question.correctIndex;
        const badge = el(
          "div",
          isCorrect ? "feedback-badge success" : "feedback-badge error",
          isCorrect ? "✓ Correct" : "✗ Not quite"
        );
        feedbackHolder.appendChild(badge);
        feedbackHolder.appendChild(el("p", null, question.explanation));

        updateOverallCompletion(step);
        notifyInteraction();
      });

      list.appendChild(btn);
    });

    // Restore feedback text if previously answered
    if (previousAnswer !== undefined) {
      const isCorrect = previousAnswer === question.correctIndex;
      const badge = el(
        "div",
        isCorrect ? "feedback-badge success" : "feedback-badge error",
        isCorrect ? "✓ Correct" : "✗ Not quite"
      );
      feedbackHolder.appendChild(badge);
      feedbackHolder.appendChild(el("p", null, question.explanation));
    }

    block.appendChild(list);
    block.appendChild(feedbackHolder);
    container.appendChild(block);
  }

  /* ---------------------------------------------------------
     PUBLIC: render
     step: the "assessment" step object (contains .questions[])
     notifyInteraction: callback to tell the app state changed
     --------------------------------------------------------- */
  function render(mountEl, step, notifyInteraction) {
    const wrapper = el("div");

    step.questions.forEach((question, i) => {
      renderSingleQuestion(step, question, i + 1, notifyInteraction, wrapper);
    });

    mountEl.appendChild(wrapper);

    // Ensure completion state reflects any previously saved answers
    // (e.g. learner navigated back to this step after answering).
    updateOverallCompletion(step);
  }

  return {
    render
  };

})();