/* =========================================================
   renderer.js
   Builds the HTML markup for the current step and hands off
   to interactions.js to wire up behaviour. No state lives
   here — it only reads LESSON_STEPS / lessonEngine and writes
   the DOM.
   ========================================================= */

const renderer = (function () {

  const cardEl = document.getElementById('lesson-card');

  /* ---------------------------------------------------------
     SHARED MARKUP HELPERS
     --------------------------------------------------------- */
  function paragraphsHtml(paragraphs) {
    return (paragraphs || []).map((p) => `<p>${p}</p>`).join('');
  }

  function tabletHtml(message, options = {}) {
    const withIndex = !!options.withIndex;
    const tiles = message.split('').map((ch, i) => {
      const indexLabel = withIndex ? `<span class="char-index">${i}</span>` : '';
      return `
        <div class="char-tile">
          <button type="button" class="char-glyph" data-index="${i}">${ch}</button>
          ${indexLabel}
        </div>`;
    }).join('');
    return `<div class="tablet"><div class="tablet-row">${tiles}</div></div>`;
  }

  function codePanelHtml(reveal, hidden) {
    const lines = reveal.lines.map((line) => `<div class="code-line">${escapeHtml(line)}</div>`).join('');
    return `
      <div class="code-panel ${hidden ? 'hidden' : ''}" id="reveal-panel">
        ${lines}
        <div class="code-output"># ${escapeHtml(reveal.output)}</div>
      </div>
      ${hidden ? '' : `<p class="reveal-explanation">${reveal.explanation}</p>`}
    `;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------------------------------------------------------
     STEP RENDERERS
     --------------------------------------------------------- */
  function renderExplore(step) {
    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      ${tabletHtml(step.message)}
      <p id="inspect-counter">You have inspected 0 of ${step.message.length} characters. Tap a few to begin.</p>
    `;
  }

  function renderIndexReveal(step) {
    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      ${tabletHtml(step.message, { withIndex: true })}
      <div id="feedback-slot"></div>
      ${codePanelHtml(step.reveal, true)}
    `;
  }

  function renderSliceChallenge(step) {
    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      ${tabletHtml(step.message, { withIndex: true })}
      <div id="feedback-slot"></div>
      ${codePanelHtml(step.reveal, true)}
    `;
  }

  function renderNegativeIndex(step) {
    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      ${tabletHtml(step.message, { withIndex: true })}
      <div id="feedback-slot"></div>
      ${codePanelHtml(step.lastCharReveal, true)}
      <div id="word-phase" class="hidden">
        <p>${step.wordPrompt}</p>
        <div id="feedback-slot-word"></div>
        ${codePanelHtml(step.wordReveal, true).replace('id="reveal-panel"', 'id="reveal-panel-word"')}
      </div>
    `;
  }

  function renderReverseChallenge(step) {
    const optionsHtml = step.options.map((opt, i) => `
      <button type="button" class="choice-btn" data-option-index="${i}">${opt}</button>
    `).join('');

    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      <div class="tablet">
        <div class="tablet-row" id="reversed-display">
          ${step.reversedMessage.split('').map((ch) => `<div class="char-tile"><span class="char-glyph">${ch}</span></div>`).join('')}
        </div>
      </div>
      <button type="button" class="btn-secondary" id="flip-btn">Reverse the Reading Direction</button>
      <p>What message does the tablet reveal, once read correctly?</p>
      <div class="choice-list">${optionsHtml}</div>
      <div id="feedback-slot"></div>
      ${codePanelHtml(step.reveal, true)}
    `;
  }

  function renderRepair(step) {
    const tasksHtml = step.tasks.map((task, ti) => `
      <div class="task-card" data-task-id="${task.id}">
        <div class="task-label">Problem ${ti + 1}</div>
        <p>${task.problem}</p>
        <div class="method-choices" data-task-index="${ti}">
          ${task.methods.map((m, mi) => `<button type="button" class="method-btn" data-method-index="${mi}">${escapeHtml(m.label)}</button>`).join('')}
        </div>
        <div class="feedback-slot" id="repair-feedback-${ti}"></div>
      </div>
    `).join('');

    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      <div class="tablet"><div class="tablet-row"><span class="char-glyph" style="width:auto;padding:0 10px;">${step.corrupted}</span></div></div>
      ${tasksHtml}
      ${codePanelHtml(step.reveal, true)}
    `;
  }

  function renderPractice(step, roundIndex) {
    const round = step.rounds[roundIndex];
    const optionsHtml = round.options.map((opt, i) => `
      <button type="button" class="choice-btn" data-option-index="${i}">${escapeHtml(opt)}</button>
    `).join('');

    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${roundIndex === 0 ? `<p>${step.intro}</p>` : ''}
      <div class="round-meta">
        <h3>message = "${round.message}"</h3>
        <span class="round-count">Round ${roundIndex + 1} of ${step.rounds.length}</span>
      </div>
      <p>${round.prompt}</p>
      <div class="choice-list">${optionsHtml}</div>
      <div id="feedback-slot"></div>
    `;
  }

  function renderAssessmentTask(task, ti) {
    if (task.kind === 'choice') {
      const optionsHtml = task.options.map((opt, i) => `
        <button type="button" class="choice-btn" data-option-index="${i}">${escapeHtml(opt)}</button>
      `).join('');
      return `
        <div class="task-card" data-task-id="${task.id}" data-task-index="${ti}">
          <div class="task-label">${task.label}</div>
          <p>${task.prompt}</p>
          <div class="choice-list">${optionsHtml}</div>
          <div class="feedback-slot" id="task-feedback-${ti}"></div>
        </div>
      `;
    }
    return `
      <div class="task-card" data-task-id="${task.id}" data-task-index="${ti}">
        <div class="task-label">${task.label}</div>
        <p>${task.prompt}</p>
        <form class="text-answer-form" data-task-index="${ti}">
          <input type="text" name="answer" autocomplete="off" placeholder="Type your answer" />
          <button type="submit" class="btn-primary" style="margin-top:0;">Check</button>
        </form>
        <div class="feedback-slot" id="task-feedback-${ti}"></div>
      </div>
    `;
  }

  function renderAssessment(step) {
    const tasksHtml = step.tasks.map((task, ti) => renderAssessmentTask(task, ti)).join('');
    return `
      <p class="eyebrow">${step.eyebrow}</p>
      <h2>${step.title}</h2>
      ${paragraphsHtml(step.paragraphs)}
      <div class="tablet"><div class="tablet-row"><span class="char-glyph" style="width:auto;padding:0 10px;">${step.message}</span></div></div>
      ${tasksHtml}
      <div id="transfer-block" class="hidden">
        <h3>One Last Thought</h3>
        <p>${step.transferPrompt}</p>
        <textarea class="reflection-textarea" id="transfer-input" placeholder="Type a few thoughts…"></textarea>
        <p class="feedback-panel is-success">You have completed the Royal Scribe's training. Well done, Scribe.</p>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     MAIN RENDER DISPATCH
     --------------------------------------------------------- */
  function renderStep() {
    const step = lessonEngine.getCurrentStep();
    let html = '';

    switch (step.type) {
      case 'explore':
        html = renderExplore(step);
        break;
      case 'index-reveal':
        html = renderIndexReveal(step);
        break;
      case 'slice-challenge':
        html = renderSliceChallenge(step);
        break;
      case 'negative-index':
        html = renderNegativeIndex(step);
        break;
      case 'reverse-challenge':
        html = renderReverseChallenge(step);
        break;
      case 'repair':
        html = renderRepair(step);
        break;
      case 'practice':
        html = renderPractice(step, 0);
        break;
      case 'assessment':
        html = renderAssessment(step);
        break;
      default:
        html = '<p>Unknown step type.</p>';
    }

    cardEl.innerHTML = html;
    interactions.init(step, cardEl, renderer);
    if (typeof cardEl.scrollIntoView === 'function') {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderPracticeRound(step, roundIndex) {
    cardEl.innerHTML = renderPractice(step, roundIndex);
    interactions.bindPracticeRound(step, cardEl, roundIndex, renderer);
  }

  return {
    renderStep,
    renderPracticeRound,
    helpers: { tabletHtml, codePanelHtml, escapeHtml }
  };

})();
