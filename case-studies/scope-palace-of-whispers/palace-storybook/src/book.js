// Turns one scene from src/scenes.js into a storybook page:
//
//   [ the illustration (most of the screen) ][ the parchment: words + actions ]
//
// and plays its steps one at a time. Each step can change the picture, show
// what Tara and Mithu say, offer one interaction, or reveal code.

import { SCENES } from './scenes.js';
import { tara, mithu } from './art/characters.js';
import { toElement, codeBlock, outputBlock, wait } from './util.js';
import { chime } from './sound.js';

const AVATARS = {
  Tara: `<svg viewBox="50 38 100 100" aria-hidden="true">${tara({ x: 100, y: 262, mood: 'happy' })}</svg>`,
  Mithu: `<svg viewBox="2 0 100 100" aria-hidden="true">${mithu({ x: 50, y: 100, flip: true })}</svg>`
};

function lineHtml([who, text], i) {
  const delay = `style="--d:${i}"`;
  if (who === 'narrator') return `<p class="line narration" ${delay}>${text}</p>`;
  if (who === 'note') return `<p class="line note-line" ${delay}>${text}</p>`;
  return `
<div class="line say say-${who.toLowerCase()}" ${delay}>
  <span class="say-avatar">${AVATARS[who]}</span>
  <p><span class="say-name">${who}</span><span class="say-text">“${text}”</span></p>
</div>`;
}

/**
 * @param {number} index        0-based scene number
 * @param {object} book
 * @param {boolean} book.done   the learner already finished this page
 * @param {function} book.complete  called when the page is finished
 * @param {function} book.go    go to a page number (0 = the opening)
 * @param {function} book.replay    start the whole story again
 */
export function renderPage(index, book) {
  const scene = SCENES[index];
  const total = SCENES.length;
  const last = index === total - 1;

  const el = toElement(`
<article class="page">
  <div class="art-frame">
    <div class="art ${(scene.start || []).join(' ')}">${scene.art()}</div>
  </div>
  <section class="paper" aria-labelledby="page-title">
    <p class="kicker">Page ${index + 1} of ${total} · ${scene.place}</p>
    <h1 id="page-title" tabindex="-1">${scene.title}</h1>
    <div class="lines" aria-live="polite"></div>
    <div class="explain-slot"></div>
    <div class="action-slot"></div>
    <nav class="page-nav" aria-label="Pages">
      <button type="button" class="btn btn-quiet prev">← ${index === 0 ? 'Back to the palace gates' : 'Previous page'}</button>
      ${last ? '' : `<button type="button" class="btn btn-primary next" ${book.done ? '' : 'disabled'}>Turn the page →</button>`}
    </nav>
  </section>
</article>`);

  const art = el.querySelector('.art');
  const linesEl = el.querySelector('.lines');
  const explainSlot = el.querySelector('.explain-slot');
  const actionSlot = el.querySelector('.action-slot');
  const nextBtn = el.querySelector('.next');
  let alive = true;

  el.querySelector('.prev').addEventListener('click', () => book.go(index));
  if (nextBtn) nextBtn.addEventListener('click', () => book.go(index + 2));

  function complete() {
    book.complete(index);
    if (nextBtn) nextBtn.disabled = false;
  }

  /* --------------------------------------------- changing the picture */

  function setMood(mood) {
    art.querySelectorAll('.tara').forEach((t) => t.setAttribute('data-mood', mood));
  }

  async function walk({ dx, ms }) {
    const walker = art.querySelector('.walker') || art.querySelector('.actor-tara');
    if (!walker) return;
    walker.classList.add('is-walking');
    walker.style.transition = `transform ${ms}ms ease-in-out`;
    walker.style.transform = `translateX(${dx}px)`;
    await wait(ms);
    walker.classList.remove('is-walking');
  }

  function mithuTalks() {
    art.classList.add('mithu-talks');
    setTimeout(() => art.classList.remove('mithu-talks'), 1600);
  }

  function slot(name) {
    return art.querySelector(`[data-slot="${name}"]`);
  }

  /* --------------------------------------------------------- actions */

  function primaryButton(label, onClick) {
    const b = toElement(`<button type="button" class="btn btn-primary act">${label}</button>`);
    b.addEventListener('click', onClick);
    actionSlot.append(b);
    return b;
  }

  async function afterAction(stepIndex, then = {}) {
    (then.effects || []).forEach((c) => art.classList.add(c));
    if (then.mood) setMood(then.mood);
    chime();
    if (then.walk) await walk(then.walk);
    await wait(then.wait || 300);
    if (!alive) return;
    if (then.nextPage) {
      complete();
      book.go(index + 2);
      return;
    }
    runStep(stepIndex + 1, { focus: true });
  }

  function clickAction(stepIndex, action) {
    const target = art.querySelector(`[data-target="${action.target}"]`);
    let used = false;
    const go = () => {
      if (used) return;
      used = true;
      if (target) target.classList.remove('is-target');
      button.disabled = true;
      afterAction(stepIndex, action.then);
    };
    if (target) {
      target.classList.add('is-target');
      target.addEventListener('click', go);
    }
    const button = primaryButton(`✦ ${action.label}`, go);
    return button;
  }

  function choiceAction(stepIndex, action) {
    const box = toElement(`
<div class="choice" role="group" aria-label="${action.question}">
  <div class="choice-options">
    ${action.options.map((o, i) => `<button type="button" class="choice-btn" data-i="${i}">${o.text}</button>`).join('')}
  </div>
  <p class="choice-feedback" role="status" aria-live="polite"></p>
</div>`);
    const buttons = [...box.querySelectorAll('.choice-btn')];
    const feedback = box.querySelector('.choice-feedback');
    buttons.forEach((b, i) => b.addEventListener('click', () => {
      const option = action.options[i];
      feedback.innerHTML = option.feedback;
      feedback.className = `choice-feedback ${option.correct ? 'is-good' : 'is-gentle'}`;
      if (!option.correct) {
        b.classList.add('is-wrong');
        return; // the learner can simply choose again
      }
      buttons.forEach((x) => { x.disabled = true; x.classList.remove('is-wrong'); });
      b.classList.add('is-correct');
      (option.then?.effects || []).forEach((c) => art.classList.add(c));
      chime();
      const cont = primaryButton('Continue ▸', () => { cont.disabled = true; runStep(stepIndex + 1, { focus: true }); });
      cont.focus();
    }));
    actionSlot.append(box);
    return buttons[0];
  }

  /** Lights the chamber's pictures in L → E → G → B order, then finds gift. */
  function searchAction(stepIndex, action) {
    const cards = [...art.querySelectorAll('.chamber-card')];
    const letters = [...art.querySelectorAll('.rule [data-letter]')];
    const button = primaryButton(`✦ ${action.label}`, async () => {
      button.disabled = true;
      const clear = () => {
        cards.forEach((c) => { c.classList.remove('is-lit', 'is-found', 'is-quiet'); c.querySelector('.chamber-status').textContent = ''; });
        letters.forEach((l) => l.classList.remove('is-lit'));
      };
      clear();
      // First, the order itself.
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add('is-lit');
        letters[i].classList.add('is-lit');
        await wait(600);
        if (!alive) return;
        cards[i].classList.remove('is-lit');
      }
      await wait(300);
      // Then the search for gift: found at the very first stop.
      cards[0].classList.add('is-found');
      cards[0].querySelector('.chamber-status').textContent = 'found!';
      cards.slice(1).forEach((c) => {
        c.classList.add('is-quiet');
        c.querySelector('.chamber-status').textContent = 'not needed';
      });
      chime();
      if (action.again) {
        button.disabled = false;
      } else {
        runStep(stepIndex + 1, { focus: true });
      }
    });
    return button;
  }

  /* ------------------------------------------------------- one step */

  function runStep(i, { focus = false } = {}) {
    const step = scene.steps[i];
    (step.effects || []).forEach((c) => art.classList.add(c));
    if (step.mood) setMood(step.mood);
    if (step.code) slot('code').innerHTML = codeBlock(step.code.text, { newLines: step.code.newLines });
    if (slot('output')) {
      slot('output').innerHTML = step.output !== undefined
        ? `<p class="output-label">Python prints</p>${outputBlock(step.output)}`
        : '';
    }

    linesEl.innerHTML = step.lines.map(lineHtml).join('');
    if (step.lines.some(([who]) => who === 'Mithu')) mithuTalks();

    explainSlot.innerHTML = step.explain ? `
      <aside class="concept">
        <p class="concept-name">${step.explain.title}</p>
        <p class="concept-text">${step.explain.text}</p>
      </aside>` : '';

    actionSlot.innerHTML = '';
    let first = null;
    const action = step.action;
    if (action?.type === 'click') first = clickAction(i, action);
    else if (action?.type === 'continue') first = primaryButton(`${action.label} ▸`, () => runStep(i + 1, { focus: true }));
    else if (action?.type === 'choice') first = choiceAction(i, action);
    else if (action?.type === 'search') first = searchAction(i, action);

    if (step.end) complete();
    if (step.finale) {
      actionSlot.insertAdjacentHTML('beforeend', `
        <div class="the-end">
          <p class="the-end-title">The End</p>
          <p>Every name has a place, and now you know how Python finds it.</p>
          <button type="button" class="btn btn-primary replay">↺ Replay the story</button>
        </div>`);
      actionSlot.querySelector('.replay').addEventListener('click', book.replay);
    }

    if (focus) {
      const next = first || (step.end && nextBtn) || actionSlot.querySelector('button');
      if (next) next.focus({ preventScroll: true });
    }
  }

  runStep(0);
  el.cleanup = () => { alive = false; };
  return el;
}
