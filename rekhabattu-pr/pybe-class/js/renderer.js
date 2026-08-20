/* =========================================================
   renderer.js
   Takes a screen object -> builds DOM inside #storybook-card.

   Rekha-specific addition: deferred reveal (1.2s anticipation
   beat then slide-in), per-option opening lines shared with
   a closing trio, and an italic aside ("Interesting...").

   Otherwise the architecture mirrors Krishanu's prototype:
   IIFE module, `el()` helper, CustomEvent('pybe:interaction')
   for cross-module coordination.
   ========================================================= */

const renderer = (function () {

  const cardEl = document.getElementById('storybook-card');

  /* ---------------------------------------------------------
     UTILITY: notify the app that something changed
     (navigation.js listens to refresh Next button state)
     --------------------------------------------------------- */
  function notifyInteraction() {
    document.dispatchEvent(new CustomEvent('pybe:interaction'));
  }

  /* ---------------------------------------------------------
     UTILITY: small DOM builder helper
     (Only accepts textContent, never innerHTML — user-facing
     strings stay as text nodes so accidental markup can't
     inject.)
     --------------------------------------------------------- */
  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined) node.textContent = textContent;
    return node;
  }

  function buildEyebrow(text) {
    return el('span', 'step-eyebrow', text);
  }


  /* ---------------------------------------------------------
     UTILITY: highlight key vocabulary words in gold inside a
     reveal line. Wraps each occurrence of any word in
     HIGHLIGHT_WORDS in <span class="reveal-keyword">.

     Safe here because reveal text is authored lesson
     content, never user input.
     --------------------------------------------------------- */
  const HIGHLIGHT_WORDS = ['structure', 'specific', 'class'];
  function highlightKeyTerms(node) {
    const text = node.textContent;
    if (!text) return;
    const pattern = new RegExp(
      '\\b(' + HIGHLIGHT_WORDS.join('|') + ')\\b',
      'gi',
    );
    if (!pattern.test(text)) return;
    const parts = text.split(pattern);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (!part) return;
      if (pattern.test(part)) {
        const span = document.createElement('span');
        span.className = 'reveal-keyword';
        span.textContent = part;
        frag.appendChild(span);
      } else {
        // pattern.test() is stateful - reset lastIndex so it
        // does not skip mid-loop.
        pattern.lastIndex = 0;
        frag.appendChild(document.createTextNode(part));
      }
    });
    node.textContent = '';
    node.appendChild(frag);
  }

  /* ---------------------------------------------------------
     RENDER: "mcq-with-deferred-reveal"
     A single-question MCQ whose reveal appears 1.2s after
     the learner picks an option. Reveal slides in from the
     left, and its lines fade up sequentially.

     Screen 1 of the Rekha lesson uses this renderer.
     --------------------------------------------------------- */
  function renderMcqWithDeferredReveal(screen, container) {
    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));

    // Illustration (inline SVG) — safe to set via innerHTML
    // because this is authored lesson data, never user input.
    if (screen.illustration) {
      const media = document.createElement('div');
      media.className = 'step-media';
      media.innerHTML = screen.illustration;
      container.appendChild(media);

      if (screen.groundLine) {
        const ground = document.createElement('span');
        ground.setAttribute('aria-hidden', 'true');
        ground.style.display = 'block';
        ground.style.width = '80px';
        ground.style.height = '1px';
        ground.style.background = 'var(--color-border)';
        ground.style.margin = '0 auto var(--space-md)';
        container.appendChild(ground);
      }
    }

    const block = el('div', 'question-block');
    block.appendChild(el('h3', null, screen.prompt));

    const list = el('div', 'option-list');
    const revealHolder = document.createElement('div');

    const previousResponse = lessonEngine.getResponse(screen.id);
    // A screen has a reveal if it provides revealByOption OR
    // any of its options has a inline 'reveal' string. Without
    // this, the revealHolder would never mount and the learner
    // would see no explanation after picking.
    const hasReveal = !!(
      (screen.revealByOption && Object.keys(screen.revealByOption).length > 0) ||
      (screen.options || []).some((o) => typeof o.reveal === 'string' && o.reveal.trim().length > 0)
    );

    screen.options.forEach((option, optIdx) => {
      // Synthesize a key from the option index if the author
      // didn't provide one (newer inline-reveal style).
      const key = option.key || ('opt_' + optIdx);
      const btn = el('button', 'option-btn', option.label);
      btn.type = 'button';
      btn.dataset.optionKey = key;

      // Restore state from a previous pick on this screen.
      if (previousResponse !== undefined) {
        btn.disabled = true;
        if (previousResponse === key) {
          btn.classList.add('selected');
        } else {
          btn.classList.add('locked');
        }
      }

      btn.addEventListener('click', () => {
        // Lock all options; highlight this one; subtly dim the others.
        Array.from(list.children).forEach((child) => {
          child.disabled = true;
          child.classList.remove('selected', 'locked');
          if (child === btn) {
            child.classList.add('selected');
          } else {
            child.classList.add('locked');
          }
        });

        lessonEngine.saveResponse(screen.id, key);
        renderReveal(screen, key, revealHolder, /* instant */ false);
        scheduleRevealAnimation(revealHolder, screen.deferRevealMs || 0);
        lessonEngine.markScreenComplete(screen.id);
        notifyInteraction();
      });

      list.appendChild(btn);
    });

    block.appendChild(list);
    container.appendChild(block);
    if (hasReveal) {
      container.appendChild(revealHolder);
    }

    // Re-rendering on re-entry: if the learner had picked already,
    // show the reveal in its final state.
    if (previousResponse !== undefined) {
      if (hasReveal) {
        renderReveal(
          screen,
          previousResponse,
          revealHolder,
          /* instant */ true,
        );
        scheduleRevealAnimation(revealHolder, 0);
      }
      lessonEngine.markScreenComplete(screen.id);
    }
  }

  /* ---------------------------------------------------------
     Build the reveal block into the supplied holder.
     If `instant` is true, all lines are shown immediately
     (used when restoring state on re-render after navigation).

     The block is mounted immediately (so screen readers
     announce it and it's part of the DOM tree) but stays
     visually hidden until the `scheduleRevealAnimation()`
     timer fires.
     --------------------------------------------------------- */
  function renderReveal(screen, optionKey, holder, instant) {
    // Resolve reveal lines: prefer revealByOption (array form),
    // fall back to option.reveal (string form, newer style).
    let lines = (screen.revealByOption || {})[optionKey];
    if (!lines) {
      const opt = (screen.options || []).find((o, i) =>
        (o.key || ('opt_' + i)) === optionKey);
      if (opt && opt.reveal) {
        lines = [opt.reveal];
      }
    }
    if (!lines) lines = [];
    const block = el('div', 'reveal-block');
    block.setAttribute('aria-live', 'polite');
    holder.innerHTML = '';
    holder.appendChild(block);

    // Closing-trio's first line ("Interesting...") is the aside.
    lines.forEach((text, i) => {
      const p = el('p', 'reveal-line', text);
      if (i >= lines.length - 3 && /^Interesting…/i.test(text.trim())) {
        p.classList.add('aside');
      }
      if (instant) p.classList.add('is-ready');
      // Highlight key vocabulary words in gold for emphasis.
      // Authored lesson text only — never user input — so the
      // simple split+join is safe.
      highlightKeyTerms(p);
      block.appendChild(p);
    });

    if (instant) block.classList.add('is-ready');
  }

  /* ---------------------------------------------------------
     After pick: defer the reveal animation by `deferMs` so the
     learner sits with their pick for a moment. The lines are
     already in the DOM (and thus announced) but the visual
     animation waits.
     --------------------------------------------------------- */
  function scheduleRevealAnimation(holder, deferMs) {
    const block = holder.querySelector('.reveal-block');
    if (!block) return;

    const flip = () => {
      block.classList.add('is-ready');
      const lines = block.querySelectorAll('.reveal-line');
      lines.forEach((line, i) => {
        window.setTimeout(() => {
          line.classList.add('is-ready');
        }, 60 + i * 80);
      });
    };

    if (deferMs <= 0) {
      flip();
    } else {
      window.setTimeout(flip, deferMs);
    }
  }

  /* ---------------------------------------------------------
     RENDER: placeholder (for screens not yet authored)
     --------------------------------------------------------- */
  function renderPlaceholder(screen, container) {
    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));
    container.appendChild(el('p', null, screen.line));
  }


  /* ---------------------------------------------------------
     RENDER: "generate"
     A scenario with a single action button. When clicked,
     `screen.generate(stageEl, markDone)` is called. The
     screen's generate function is responsible for producing
     its own DOM (cards, list, etc.) into stageEl and calling
     markDone() when finished, so Next can enable.

     Used by screen 6 (Many students) to animate 10 cards
     appearing one by one.
     --------------------------------------------------------- */
  function renderGenerate(screen, container) {
    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));

    if (screen.scenario) {
      const p = el('p', 'step-scenario', screen.scenario);
      container.appendChild(p);
    }

    const action = el('button', 'primary-btn', screen.buttonLabel || 'Generate');
    action.type = 'button';

    const stage = el('div', 'generate-stage');

    const previousDone = lessonEngine.isScreenComplete(screen.id);
    const isPerClick =
      Array.isArray(screen.samples) && screen.samples.length > 0;

    if (previousDone) {
      action.disabled = true;
      action.textContent = screen.doneLabel || 'Done';
    }

    let fired = false;
    function markDone() {
      if (fired) return;
      fired = true;
      lessonEngine.markScreenComplete(screen.id);
      action.disabled = true;
      if (screen.doneLabel) action.textContent = screen.doneLabel;
      notifyInteraction();
    }

    // Track how many cards have been added (for the button
    // label progress) — used only by screens that opt into
    // per-click advancement (e.g. screen 6).
    let addedCount = 0;
    const totalCount = isPerClick ? screen.samples.length : 0;

    function refreshButtonLabel() {
      if (!isPerClick) return;
      if (addedCount < totalCount) {
        action.textContent =
          screen.buttonLabel + ' (' + addedCount + '/' + totalCount + ')';
      } else {
        action.textContent = screen.doneLabel || 'Done';
      }
    }
    refreshButtonLabel();

    function advance() {
      if (isPerClick) {
        // Per-click mode: each click drops one more card.
        // The button stays enabled until totalCount is reached.
        // We do NOT call screen.generate() here — that would
        // create a fresh closure and reset the counter. The
        // initial mount call to generate() already installed
        // stage.__addNextCard; we just invoke it.
        if (typeof stage.__addNextCard === 'function') {
          stage.__addNextCard();
        }
        const stack = stage.querySelector('.card-stack');
        addedCount = stack ? stack.children.length : addedCount + 1;
        refreshButtonLabel();
        if (addedCount >= totalCount) markDone();
      } else {
        // One-shot mode: disable button, run the generator,
        // mark done when it resolves.
        action.disabled = true;
        action.textContent = screen.generatingLabel || 'Generating...';
        Promise.resolve(screen.generate(stage, markDone)).catch((err) => {
          console.error('generate() failed:', err);
          markDone();
        });
      }
    }

    action.addEventListener('click', advance);

    container.appendChild(action);
    container.appendChild(stage);

    // For per-click screens, run generate() once at mount
    // time so __addNextCard is installed before the first
    // click. For one-shot screens (e.g. screen 7) the click
    // handler is the only caller, so we skip here.
    if (isPerClick) {
      screen.generate(stage, () => {});
      // If re-entry already filled everything, reflect that on
      // the button and lock it.
      const stack = stage.querySelector('.card-stack');
      if (stack && stack.children.length >= totalCount) {
        addedCount = stack.children.length;
        refreshButtonLabel();
        action.disabled = true;
      }
    }
  }

  /* ---------------------------------------------------------
     RENDER: student-details-choice
     A real-world decision before the manual activity. Choosing
     separate sheets opens the existing one-at-a-time exercise;
     choosing one standard format reveals the class idea directly.
     --------------------------------------------------------- */
  function renderStudentDetailsChoice(screen, container) {
    const previousResponse = lessonEngine.getResponse(screen.id);

    // Returning to the manual path should restore the activity,
    // rather than asking the learner to choose again.
    if (previousResponse === 'separate-sheets') {
      renderGenerate(Object.assign({}, screen, {
        kind: 'generate',
        title: screen.manualTitle,
        eyebrow: screen.manualEyebrow,
        scenario: screen.manualScenario,
      }), container);
      return;
    }

    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));

    if (screen.illustration) {
      const media = el('div', 'step-media');
      media.innerHTML = screen.illustration;
      container.appendChild(media);
    }

    const question = el('div', 'question-block');
    question.appendChild(el('h3', null, screen.prompt));
    const list = el('div', 'option-list');
    const revealHolder = document.createElement('div');

    screen.options.forEach((option) => {
      const button = el('button', 'option-btn', option.label);
      button.type = 'button';
      button.dataset.optionKey = option.key;

      if (previousResponse !== undefined) {
        button.disabled = true;
        button.classList.add(previousResponse === option.key ? 'selected' : 'locked');
      }

      button.addEventListener('click', () => {
        lessonEngine.saveResponse(screen.id, option.key);

        if (option.path === 'manual') {
          container.innerHTML = '';
          renderGenerate(Object.assign({}, screen, {
            kind: 'generate',
            title: screen.manualTitle,
            eyebrow: screen.manualEyebrow,
            scenario: screen.manualScenario,
          }), container);
          return;
        }

        Array.from(list.children).forEach((choice) => {
          choice.disabled = true;
          choice.classList.add(choice === button ? 'selected' : 'locked');
        });
        renderReveal(screen, option.key, revealHolder, false);
        scheduleRevealAnimation(revealHolder, 0);
        lessonEngine.markScreenComplete(screen.id);
        notifyInteraction();
      });

      list.appendChild(button);
    });

    question.appendChild(list);
    container.appendChild(question);
    container.appendChild(revealHolder);

    if (previousResponse === 'one-standard-format') {
      renderReveal(screen, previousResponse, revealHolder, true);
      lessonEngine.markScreenComplete(screen.id);
    }
  }

  /* ---------------------------------------------------------
     RENDER: matching
     The learner chooses a category on the left, then its
     particular example on the right. A correct pair stays
     visible; all four pairs unlock the next screen.
     --------------------------------------------------------- */
  function renderMatching(screen, container) {
    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));
    container.appendChild(el('p', 'step-scenario', screen.prompt));

    const saved = lessonEngine.getResponse(screen.id) || {};
    const matches = Object.assign({}, saved.matches || {});
    let selectedCategory = null;

    const board = el('div', 'matching-board');
    const categoryColumn = el('div', 'matching-column');
    const exampleColumn = el('div', 'matching-column');
    categoryColumn.appendChild(el('h3', null, 'Category'));
    exampleColumn.appendChild(el('h3', null, 'Particular example'));
    const feedback = el('p', 'matching-feedback');
    const categoryButtons = {};
    const exampleButtons = {};

    function buildMatchButton(item) {
      const button = el('button', 'option-btn match-chip', '');
      button.type = 'button';
      button.dataset.matchKey = item.key;
      button.setAttribute('aria-label', item.label);
      if (item.illustration) {
        button.classList.add('match-chip--visual');
        const visual = el('div', 'match-visual');
        // Lesson illustrations are authored inline SVG/HTML, never user input.
        visual.innerHTML = item.illustration;
        button.appendChild(visual);
        button.appendChild(el('span', 'match-label', item.label));
      } else {
        button.textContent = item.label;
      }
      return button;
    }

    function isMatched(key) {
      return matches[key] === key;
    }

    function allMatched() {
      return screen.categories.every((category) => isMatched(category.key));
    }

    function showReveal() {
      if (container.querySelector('.reveal-block')) return;
      const holder = document.createElement('div');
      const block = el('div', 'reveal-block is-ready');
      screen.reveal.forEach((line) => {
        const paragraph = el('p', 'reveal-line is-ready', line);
        highlightKeyTerms(paragraph);
        block.appendChild(paragraph);
      });
      holder.appendChild(block);
      container.appendChild(holder);
      lessonEngine.markScreenComplete(screen.id);
      notifyInteraction();
    }

    function markPair(categoryKey) {
      const categoryButton = categoryButtons[categoryKey];
      const exampleButton = exampleButtons[categoryKey];
      categoryButton.disabled = true;
      exampleButton.disabled = true;
      categoryButton.classList.remove('selected');
      categoryButton.classList.add('correct');
      exampleButton.classList.add('correct');
    }

    screen.categories.forEach((category) => {
      const button = buildMatchButton(category);
      categoryButtons[category.key] = button;

      if (isMatched(category.key)) {
        button.disabled = true;
        button.classList.add('correct');
      }

      button.addEventListener('click', () => {
        selectedCategory = category.key;
        feedback.textContent = 'Now choose its particular example.';
        Object.values(categoryButtons).forEach((otherButton) => {
          otherButton.classList.toggle('selected', otherButton === button);
        });
      });
      categoryColumn.appendChild(button);
    });

    screen.examples.forEach((example) => {
      const button = buildMatchButton(example);
      exampleButtons[example.key] = button;

      if (isMatched(example.key)) {
        button.disabled = true;
        button.classList.add('correct');
      }

      button.addEventListener('click', () => {
        if (!selectedCategory) {
          feedback.textContent = 'Choose a category first.';
          return;
        }
        if (selectedCategory !== example.key) {
          feedback.textContent = 'That pair does not fit. Try another example.';
          button.classList.add('incorrect');
          window.setTimeout(() => button.classList.remove('incorrect'), 500);
          return;
        }

        matches[selectedCategory] = example.key;
        lessonEngine.saveResponse(screen.id, { matches });
        markPair(selectedCategory);
        selectedCategory = null;
        feedback.textContent = allMatched()
          ? 'All four pairs match. Read the explanation.'
          : 'Good. Choose another category.';

        if (allMatched()) {
          showReveal();
        }
      });
      exampleColumn.appendChild(button);
    });

    board.appendChild(categoryColumn);
    board.appendChild(exampleColumn);
    container.appendChild(board);
    container.appendChild(feedback);

    screen.categories.forEach((category) => {
      if (isMatched(category.key)) markPair(category.key);
    });
    if (allMatched()) {
      feedback.textContent = 'All four pairs match. Read the explanation.';
      showReveal();
    }
  }

  /* ---------------------------------------------------------
     RENDER: code-builder
     A two-blank, drag-and-drop first line. Clicking a token
     and then a blank provides an equivalent keyboard/touch
     path, while the rest of the class stays visible as context.
     --------------------------------------------------------- */
  function renderCodeBuilder(screen, container) {
    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));
    container.appendChild(el('p', 'step-scenario', screen.prompt));

    const saved = lessonEngine.getResponse(screen.id) || {};
    const placements = Object.assign({}, saved.placements || {});
    let selectedToken = null;

    const sheet = el('div', 'class-code-sheet');
    const code = el('div', 'class-code');
    const firstLine = el('div', 'class-code-line class-code-first-line');
    const blanks = {};
    const tokenButtons = {};

    screen.slots.forEach((slot, index) => {
      const blank = el('button', 'code-blank', placements[slot.key] || '');
      blank.type = 'button';
      blank.dataset.slot = slot.key;
      blank.setAttribute('aria-label', 'Blank ' + (index + 1));
      if (placements[slot.key]) blank.classList.add('filled');
      blanks[slot.key] = blank;
      firstLine.appendChild(blank);
      if (index === 0) firstLine.appendChild(document.createTextNode(' '));
    });
    firstLine.appendChild(document.createTextNode(':'));
    code.appendChild(firstLine);

    screen.codeLines.forEach((lineText) => {
      code.appendChild(el('div', 'class-code-line', lineText));
    });
    sheet.appendChild(code);

    const tray = el('div', 'code-token-tray');
    tray.appendChild(el('span', 'code-token-label', 'Drag these words:'));
    const feedback = el('p', 'code-builder-feedback');
    const retry = el('button', 'code-retry-btn', 'Try again');
    retry.type = 'button';
    retry.hidden = true;

    function allBlanksFilled() {
      return screen.slots.every((slot) => !!placements[slot.key]);
    }

    function isCorrectArrangement() {
      return screen.slots.every((slot) => placements[slot.key] === slot.answer);
    }

    function setFeedback(message) {
      feedback.textContent = message;
    }

    function placeToken(slotKey, token) {
      const blank = blanks[slotKey];
      if (!blank || placements[slotKey] || !tokenButtons[token]) return;

      placements[slotKey] = token;
      blank.textContent = token;
      blank.classList.add('filled');
      blank.classList.remove('selected');
      tokenButtons[token].disabled = true;
      tokenButtons[token].classList.remove('selected');
      selectedToken = null;
      lessonEngine.saveResponse(screen.id, { placements });

      if (!allBlanksFilled()) {
        setFeedback('Fill the other blank.');
      } else if (isCorrectArrangement()) {
        lessonEngine.markScreenComplete(screen.id);
        setFeedback('Yes. Python sees class first, so it knows Student is a class.');
        notifyInteraction();
      } else {
        Object.values(blanks).forEach((otherBlank) => {
          otherBlank.classList.add('incorrect');
        });
        setFeedback(
          'You are Python reading left to right. On seeing Student first, how would you know whether it is a class, a function, or something else?',
        );
        retry.hidden = false;
      }
    }

    retry.addEventListener('click', () => {
      Object.keys(placements).forEach((key) => delete placements[key]);
      Object.values(blanks).forEach((blank) => {
        blank.textContent = '';
        blank.classList.remove('filled', 'incorrect', 'selected');
      });
      Object.values(tokenButtons).forEach((button) => {
        button.disabled = false;
        button.classList.remove('selected');
      });
      selectedToken = null;
      retry.hidden = true;
      setFeedback('Try building the first line again.');
      lessonEngine.saveResponse(screen.id, { placements: {} });
    });

    screen.tokens.forEach((token) => {
      const button = el('button', 'code-token', token);
      button.type = 'button';
      button.draggable = true;
      button.setAttribute('draggable', 'true');
      tokenButtons[token] = button;
      if (Object.values(placements).includes(token)) button.disabled = true;

      button.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', token);
        event.dataTransfer.setData('application/x-pybe-token', token);
        event.dataTransfer.effectAllowed = 'move';
      });
      button.addEventListener('click', () => {
        if (button.disabled) return;
        selectedToken = selectedToken === token ? null : token;
        Object.entries(tokenButtons).forEach(([value, otherButton]) => {
          otherButton.classList.toggle('selected', value === selectedToken);
        });
        setFeedback(selectedToken ? 'Now choose a blank.' : '');
      });
      tray.appendChild(button);
    });

    screen.slots.forEach((slot) => {
      const blank = blanks[slot.key];
      blank.addEventListener('dragenter', (event) => {
        if (placements[slot.key]) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        blank.classList.add('drag-over');
      });
      blank.addEventListener('dragover', (event) => {
        if (placements[slot.key]) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        blank.classList.add('drag-over');
      });
      blank.addEventListener('dragleave', () => blank.classList.remove('drag-over'));
      blank.addEventListener('drop', (event) => {
        event.preventDefault();
        blank.classList.remove('drag-over');
        const token = event.dataTransfer.getData('application/x-pybe-token') ||
          event.dataTransfer.getData('text/plain');
        placeToken(slot.key, token);
      });
      blank.addEventListener('click', () => {
        if (selectedToken) placeToken(slot.key, selectedToken);
      });
    });

    sheet.appendChild(tray);
    sheet.appendChild(feedback);
    sheet.appendChild(retry);
    container.appendChild(sheet);

    if (allBlanksFilled()) {
      if (isCorrectArrangement()) {
        lessonEngine.markScreenComplete(screen.id);
        setFeedback('Yes. Python sees class first, so it knows Student is a class.');
      } else {
        Object.values(blanks).forEach((blank) => blank.classList.add('incorrect'));
        setFeedback(
          'You are Python reading left to right. On seeing Student first, how would you know whether it is a class, a function, or something else?',
        );
        retry.hidden = false;
      }
    }
  }

  /* ---------------------------------------------------------
     RENDER: wrap-up
     A quiet, automatically completed closing screen. Its final
     question is the bridge to the next concept.
     --------------------------------------------------------- */
  function renderWrapUp(screen, container) {
    container.appendChild(buildEyebrow(screen.eyebrow));
    container.appendChild(el('h2', null, screen.title));
    const celebration = el('div', 'wrap-up-celebration');
    const confettiColors = ['#d94f70', '#f2b134', '#4f8ad9', '#6bbf59', '#7f5af0', '#e96f24'];
    for (let i = 0; i < 18; i += 1) {
      const piece = el('span', 'confetti-piece');
      piece.style.setProperty('--confetti-x', String(-48 + (i * 6)) + 'px');
      piece.style.setProperty('--confetti-rotate', String((i % 2 === 0 ? 1 : -1) * (180 + (i * 11))) + 'deg');
      piece.style.setProperty('--confetti-delay', String(i * 35) + 'ms');
      piece.style.setProperty('--confetti-duration', String(900 + (i % 4) * 120) + 'ms');
      piece.style.backgroundColor = confettiColors[i % confettiColors.length];
      celebration.appendChild(piece);
    }
    container.appendChild(celebration);
    const message = el('div', 'wrap-up-message');
    (screen.lines || []).forEach((line) => {
      message.appendChild(el('p', null, line));
    });
    container.appendChild(message);
    window.setTimeout(() => {
      celebration.classList.add('is-ready');
      lessonEngine.markScreenComplete(screen.id);
      notifyInteraction();
    }, 180);
  }

  /* ---------------------------------------------------------
     DISPATCH TABLE
     --------------------------------------------------------- */
  const RENDERERS = {
    mcq: renderMcqWithDeferredReveal,
    placeholder: renderPlaceholder,
    generate: renderGenerate,
    'student-details-choice': renderStudentDetailsChoice,
    matching: renderMatching,
    'code-builder': renderCodeBuilder,
    'wrap-up': renderWrapUp,
  };

  /* ---------------------------------------------------------
     PUBLIC: renderScreen
     --------------------------------------------------------- */
  function renderScreen(screen) {
    cardEl.innerHTML = '';
    const content = el('div', 'step-content');

    const renderFn = RENDERERS[screen.kind];
    if (renderFn) {
      renderFn(screen, content);
    } else {
      content.appendChild(
        el('p', null, 'Unknown screen kind: ' + screen.kind),
      );
    }

    cardEl.appendChild(content);
  }

  return {
    renderScreen,
  };

})();
