/* =========================================================
   interactions.js
   Wires up click/submit handlers for each step type, checks
   answers, shows feedback, and tells lessonEngine when a
   step's minimum interaction has been completed.
   ========================================================= */

const interactions = (function () {

  function feedback(el, message, isSuccess) {
    if (!el) return;
    el.innerHTML = `<div class="feedback-panel ${isSuccess ? 'is-success' : 'is-error'}">${message}</div>`;
  }

  function reveal(panelId, explanationAfter) {
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.remove('hidden');
    if (explanationAfter) {
      const p = document.createElement('p');
      p.className = 'reveal-explanation';
      p.textContent = explanationAfter;
      panel.insertAdjacentElement('afterend', p);
    }
  }

  function completeAndRefresh(stepId) {
    lessonEngine.markStepComplete(stepId);
    navigation.refreshButtons();
  }

  /* ---------------------------------------------------------
     STAGE 1 — explore (click to inspect characters)
     --------------------------------------------------------- */
  function initExplore(step, card) {
    const inspected = new Set();
    const tiles = card.querySelectorAll('.char-glyph');
    const counter = card.querySelector('#inspect-counter');

    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const idx = Number(tile.dataset.index);
        inspected.add(idx);
        tile.classList.add('is-inspected');

        if (inspected.size >= step.minInspected) {
          counter.textContent = step.completionLine
            .replace('{count}', inspected.size)
            .replace('{total}', step.message.length);
          completeAndRefresh(step.id);
        } else {
          counter.textContent = `You have inspected ${inspected.size} of ${step.message.length} characters. Keep exploring.`;
        }
      });
    });
  }

  /* ---------------------------------------------------------
     STAGE 2 — index-reveal (click the character at a position)
     --------------------------------------------------------- */
  function initIndexReveal(step, card) {
    const tiles = card.querySelectorAll('.char-glyph');
    const feedbackSlot = card.querySelector('#feedback-slot');

    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const idx = Number(tile.dataset.index);
        if (idx === step.targetIndex) {
          tile.classList.add('is-correct');
          feedback(feedbackSlot, `Correct — "${step.message[idx]}" is the character at position ${idx}.`, true);
          reveal('reveal-panel');
          completeAndRefresh(step.id);
        } else {
          tile.classList.add('is-incorrect');
          feedback(feedbackSlot, `Not quite — count again from position 0. Try position ${step.targetIndex}.`, false);
          setTimeout(() => tile.classList.remove('is-incorrect'), 700);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     STAGE 3 — slice-challenge (click start, then end)
     --------------------------------------------------------- */
  function bindRangeSelector(card, message, targetStart, targetEndInclusive, onSolved, tilesSelector = '.char-glyph', feedbackSelector = '#feedback-slot') {
    let firstIndex = null;
    const tiles = card.querySelectorAll(tilesSelector);
    const feedbackSlot = card.querySelector(feedbackSelector);

    function clearSelection() {
      tiles.forEach((t) => t.classList.remove('is-selected', 'is-correct', 'is-incorrect'));
    }

    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const idx = Number(tile.dataset.index);

        if (firstIndex === null) {
          firstIndex = idx;
          clearSelection();
          tile.classList.add('is-selected');
          return;
        }

        const start = Math.min(firstIndex, idx);
        const end = Math.max(firstIndex, idx);
        clearSelection();
        tiles.forEach((t) => {
          const ti = Number(t.dataset.index);
          if (ti >= start && ti <= end) t.classList.add('is-selected');
        });

        if (start === targetStart && end === targetEndInclusive) {
          tiles.forEach((t) => {
            const ti = Number(t.dataset.index);
            if (ti >= start && ti <= end) {
              t.classList.remove('is-selected');
              t.classList.add('is-correct');
            }
          });
          const word = message.slice(start, end + 1);
          feedback(feedbackSlot, `Correct — you selected "${word}", positions ${start} through ${end}.`, true);
          firstIndex = null;
          onSolved();
        } else {
          feedback(feedbackSlot, 'Not quite that range — tap the first character again to retry.', false);
          firstIndex = null;
        }
      });
    });
  }

  function initSliceChallenge(step, card) {
    bindRangeSelector(card, step.message, step.targetStart, step.targetEndInclusive, () => {
      reveal('reveal-panel');
      completeAndRefresh(step.id);
    });
  }

  /* ---------------------------------------------------------
     STAGE 4 — negative-index (last char, then last word)
     --------------------------------------------------------- */
  function initNegativeIndex(step, card) {
    const tiles = card.querySelectorAll('.char-glyph');
    const feedbackSlot = card.querySelector('#feedback-slot');
    const feedbackSlotWord = card.querySelector('#feedback-slot-word');
    const wordPhase = card.querySelector('#word-phase');

    let phase = 'last-char'; // 'last-char' -> 'last-word' -> 'done'
    let rangeFirstIndex = null;

    function clearRangeSelection() {
      tiles.forEach((t) => t.classList.remove('is-selected'));
    }

    tiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const idx = Number(tile.dataset.index);

        if (phase === 'last-char') {
          if (idx === step.lastCharTarget) {
            tile.classList.add('is-correct');
            feedback(feedbackSlot, `Correct — that is the last character, "${step.message[idx]}".`, true);
            reveal('reveal-panel');
            wordPhase.classList.remove('hidden');
            phase = 'last-word';
          } else {
            tile.classList.add('is-incorrect');
            feedback(feedbackSlot, 'Not the last character — try counting backward from the end of the wall.', false);
            setTimeout(() => tile.classList.remove('is-incorrect'), 700);
          }
          return;
        }

        if (phase === 'last-word') {
          if (rangeFirstIndex === null) {
            rangeFirstIndex = idx;
            tile.classList.add('is-selected');
            return;
          }

          const start = Math.min(rangeFirstIndex, idx);
          const end = Math.max(rangeFirstIndex, idx);
          clearRangeSelection();
          tiles.forEach((t) => {
            const ti = Number(t.dataset.index);
            if (ti >= start && ti <= end) t.classList.add('is-selected');
          });

          if (start === step.wordStart && end === step.wordEndInclusive) {
            tiles.forEach((t) => {
              const ti = Number(t.dataset.index);
              if (ti >= start && ti <= end) {
                t.classList.remove('is-selected');
                t.classList.add('is-correct');
              }
            });
            const word = step.message.slice(start, end + 1);
            feedback(feedbackSlotWord, `Correct — you selected "${word}", positions ${start} through ${end}.`, true);
            reveal('reveal-panel-word');
            phase = 'done';
            completeAndRefresh(step.id);
          } else {
            feedback(feedbackSlotWord, 'Not quite that range — tap the first character of the final word again to retry.', false);
          }
          rangeFirstIndex = null;
        }
      });
    });
  }

  /* ---------------------------------------------------------
     STAGE 5 — reverse-challenge
     --------------------------------------------------------- */
  function initReverseChallenge(step, card) {
    const flipBtn = card.querySelector('#flip-btn');
    const display = card.querySelector('#reversed-display');
    const choiceBtns = card.querySelectorAll('.choice-btn');
    const feedbackSlot = card.querySelector('#feedback-slot');
    let flipped = false;

    flipBtn.addEventListener('click', () => {
      flipped = !flipped;
      const source = flipped ? step.reversedMessage.split('').reverse().join('') : step.reversedMessage;
      display.innerHTML = source.split('').map((ch) => `<div class="char-tile"><span class="char-glyph">${ch}</span></div>`).join('');
      flipBtn.textContent = flipped ? 'Read Left to Right Again' : 'Reverse the Reading Direction';
    });

    choiceBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.optionIndex);
        choiceBtns.forEach((b) => b.classList.remove('is-correct', 'is-incorrect'));
        if (i === step.correctIndex) {
          btn.classList.add('is-correct');
          feedback(feedbackSlot, 'Correct — read backward, the tablet warns: "BEWARE OF THE SERPENT".', true);
          reveal('reveal-panel');
          completeAndRefresh(step.id);
        } else {
          btn.classList.add('is-incorrect');
          feedback(feedbackSlot, 'Read the flipped tablet again, letter by letter, from left to right.', false);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     STAGE 6 — repair (choose the right method per problem)
     --------------------------------------------------------- */
  function initRepair(step, card) {
    const solved = new Set();
    const groups = card.querySelectorAll('.method-choices');

    groups.forEach((group) => {
      const ti = Number(group.dataset.taskIndex);
      const task = step.tasks[ti];
      const feedbackSlot = card.querySelector(`#repair-feedback-${ti}`);
      const btns = group.querySelectorAll('.method-btn');

      btns.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (solved.has(ti)) return;
          const mi = Number(btn.dataset.methodIndex);
          const method = task.methods[mi];

          if (method.correct) {
            btn.classList.add('is-correct');
            btns.forEach((b) => { b.disabled = true; });
            feedback(feedbackSlot, `Correct — ${method.label} is the right tool here.`, true);
            solved.add(ti);

            if (solved.size === step.tasks.length) {
              reveal('reveal-panel');
              completeAndRefresh(step.id);
            }
          } else {
            btn.classList.add('is-incorrect');
            feedback(feedbackSlot, method.note || 'That is not quite right — think about what actually needs to change.', false);
            setTimeout(() => btn.classList.remove('is-incorrect'), 900);
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------
     STAGE 7 — practice (sequential rounds)
     --------------------------------------------------------- */
  function bindPracticeRound(step, card, roundIndex, rendererRef) {
    const round = step.rounds[roundIndex];
    const choiceBtns = card.querySelectorAll('.choice-btn');
    const feedbackSlot = card.querySelector('#feedback-slot');

    choiceBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.optionIndex);
        choiceBtns.forEach((b) => { b.disabled = true; });

        if (i === round.correctIndex) {
          btn.classList.add('is-correct');
          const isLastRound = roundIndex === step.rounds.length - 1;
          feedback(feedbackSlot, `${round.rightExplanation}${isLastRound ? ' That was the final round — well done!' : ''}`, true);

          if (isLastRound) {
            completeAndRefresh(step.id);
          } else {
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'btn-primary';
            nextBtn.textContent = 'Next Round →';
            nextBtn.addEventListener('click', () => rendererRef.renderPracticeRound(step, roundIndex + 1));
            feedbackSlot.appendChild(nextBtn);
          }
        } else {
          btn.classList.add('is-incorrect');
          feedback(feedbackSlot, round.wrongExplanation, false);
          choiceBtns.forEach((b) => { b.disabled = false; });
          btn.disabled = false;
        }
      });
    });
  }

  function initPractice(step, card, rendererRef) {
    bindPracticeRound(step, card, 0, rendererRef);
  }

  /* ---------------------------------------------------------
     STAGE 8 — assessment (choice + text tasks, then reflection)
     --------------------------------------------------------- */
  function initAssessment(step, card) {
    const solved = new Set();

    function checkAllSolved() {
      if (solved.size === step.tasks.length) {
        completeAndRefresh(step.id);
        card.querySelector('#transfer-block').classList.remove('hidden');
      }
    }

    step.tasks.forEach((task, ti) => {
      const taskCard = card.querySelector(`.task-card[data-task-index="${ti}"]`);
      const feedbackSlot = card.querySelector(`#task-feedback-${ti}`);

      if (task.kind === 'choice') {
        const choiceBtns = taskCard.querySelectorAll('.choice-btn');
        choiceBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            if (solved.has(ti)) return;
            const i = Number(btn.dataset.optionIndex);
            if (i === task.correctIndex) {
              btn.classList.add('is-correct');
              choiceBtns.forEach((b) => { b.disabled = true; });
              feedback(feedbackSlot, task.explanation, true);
              solved.add(ti);
              checkAllSolved();
            } else {
              btn.classList.add('is-incorrect');
              feedback(feedbackSlot, 'Not quite — look again at where that section of the code actually begins and ends.', false);
            }
          });
        });
      } else {
        const form = taskCard.querySelector('form');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (solved.has(ti)) return;
          const input = form.querySelector('input[name="answer"]');
          const value = input.value.trim().toUpperCase();

          if (value === task.correctAnswer.toUpperCase()) {
            feedback(feedbackSlot, task.explanation, true);
            input.disabled = true;
            form.querySelector('button').disabled = true;
            solved.add(ti);
            checkAllSolved();
          } else {
            feedback(feedbackSlot, task.hint, false);
          }
        });
      }
    });
  }

  /* ---------------------------------------------------------
     DISPATCH
     --------------------------------------------------------- */
  function init(step, card, rendererRef) {
    switch (step.type) {
      case 'explore':
        initExplore(step, card);
        break;
      case 'index-reveal':
        initIndexReveal(step, card);
        break;
      case 'slice-challenge':
        initSliceChallenge(step, card);
        break;
      case 'negative-index':
        initNegativeIndex(step, card);
        break;
      case 'reverse-challenge':
        initReverseChallenge(step, card);
        break;
      case 'repair':
        initRepair(step, card);
        break;
      case 'practice':
        initPractice(step, card, rendererRef);
        break;
      case 'assessment':
        initAssessment(step, card);
        break;
      default:
        break;
    }
  }

  return { init, bindPracticeRound };

})();
