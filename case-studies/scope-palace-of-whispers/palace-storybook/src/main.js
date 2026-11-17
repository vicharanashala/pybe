// The Palace of Whispers: entry point.
//
// #/          the opening scene: the palace in the distance
// #/page/3    a page of the story (1–8)
//
// Using the address for each page means the browser's Back and Forward
// buttons work, and the site works on GitHub Pages with no server setup.

import { openingArt } from './art/scenery.js';
import { SCENES } from './scenes.js';
import { renderPage } from './book.js';
import { toElement, wait, prefersReducedMotion } from './util.js';
import { setSound, isSoundOn, pageTurn } from './sound.js';

const bookEl = document.getElementById('book');
const progressEl = document.getElementById('progress');
const soundBtn = document.getElementById('sound-toggle');

// Pages finished during this visit. A page opens once the one before it is
// finished. (Nothing is stored, so "Replay the story" always starts fresh.)
const finished = new Set();
let current = null;
let shownPage = 0;

const canOpen = (n) => n === 1 || finished.has(n - 1);

function go(n) {
  location.hash = n === 0 ? '#/' : `#/page/${n}`;
}

function replay() {
  finished.clear();
  go(0);
}

/* ------------------------------------------------------- the opening */

function openingScreen() {
  const el = toElement(`
<section class="opening" aria-labelledby="opening-title">
  <div class="opening-art">${openingArt()}</div>
  <div class="opening-text">
    <h1 id="opening-title" tabindex="-1">The Palace of Whispers</h1>
    <p class="opening-sub">A little adventure into the mystery of Python.</p>
    <p class="opening-line">“Every name has a place. Every place has a secret.”</p>
    <button type="button" class="btn btn-enter">Enter the Palace →</button>
  </div>
</section>`);

  // Gentle parallax: nearer layers move a little more as the pointer moves.
  const layers = [...el.querySelectorAll('.layer')];
  const onMove = (e) => {
    if (prefersReducedMotion()) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth);
      layer.style.transform = `translate(${-x * depth * 24}px, ${-y * depth * 12}px)`;
    });
  };
  window.addEventListener('pointermove', onMove);

  el.querySelector('.btn-enter').addEventListener('click', async () => {
    el.classList.add('is-entering'); // the camera moves towards the gate
    pageTurn();
    await wait(1200);
    go(1);
  });

  el.cleanup = () => window.removeEventListener('pointermove', onMove);
  return el;
}

/* ---------------------------------------------------------- routing */

function show() {
  const match = location.hash.match(/^#\/page\/(\d+)$/);
  let page = match ? Number(match[1]) : 0;
  if (page > SCENES.length) page = 0;
  // A page that isn't open yet sends the learner to the furthest open page.
  while (page > 1 && !canOpen(page)) page--;
  if (match && `#/page/${page}` !== location.hash) {
    history.replaceState(null, '', page === 0 ? '#/' : `#/page/${page}`);
  }

  if (current && current.cleanup) current.cleanup();
  if (page > shownPage && shownPage !== 0) pageTurn();
  shownPage = page;

  current = page === 0
    ? openingScreen()
    : renderPage(page - 1, {
      done: finished.has(page),
      complete: () => { finished.add(page); drawProgress(); },
      go,
      replay
    });

  document.body.classList.toggle('is-opening', page === 0);
  bookEl.replaceChildren(current);
  current.classList.add('is-arriving');
  document.title = page === 0 ? 'The Palace of Whispers' : `${SCENES[page - 1].title} · The Palace of Whispers`;
  drawProgress();

  window.scrollTo(0, 0);
  const heading = current.querySelector('h1');
  if (heading) heading.focus({ preventScroll: true });
}

/** A small row of dots: one per page of the story. */
function drawProgress() {
  progressEl.innerHTML = SCENES.map((s, i) => {
    const n = i + 1;
    const here = n === shownPage;
    const open = canOpen(n);
    return `<li><button type="button" class="dot ${finished.has(n) ? 'is-done' : ''} ${here ? 'is-here' : ''}"
      data-page="${n}" ${open ? '' : 'disabled'} ${here ? 'aria-current="page"' : ''}
      aria-label="Page ${n}: ${s.title}${finished.has(n) ? ', finished' : ''}${open ? '' : ', not open yet'}"></button></li>`;
  }).join('');
}

progressEl.addEventListener('click', (e) => {
  const dot = e.target.closest('.dot');
  if (dot && !dot.disabled) go(Number(dot.dataset.page));
});

/* ------------------------------------------------------------ sound */

soundBtn.addEventListener('click', () => {
  setSound(!isSoundOn());
  const on = isSoundOn();
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.setAttribute('aria-label', on ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on');
  soundBtn.querySelector('.sound-state').textContent = on ? 'on' : 'off';
});

window.addEventListener('hashchange', show);
show();
