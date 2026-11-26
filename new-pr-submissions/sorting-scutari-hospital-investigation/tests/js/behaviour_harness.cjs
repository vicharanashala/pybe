/*
 * Lightweight DOM/behaviour harness for The Sorting Investigation.
 *
 * This is intentionally dependency-free. It executes the real browser modules
 * against a small DOM double so that click handlers, state transitions,
 * generic step generators and fetch-driven UI updates are exercised.
 * The live HTTP/browser checks are separate; this harness covers module logic.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const results = [];
let failures = 0;
let allElements = [];
let fetchImpl = async () => {
  throw new Error('fetch was not stubbed for this interaction');
};
const appCalls = [];

function record(name, condition, detail = '') {
  const ok = Boolean(condition);
  if (!ok) failures++;
  results.push({ name, ok, detail: ok ? '' : String(detail) });
}

// ---------------------------------------------------------------------------
// Minimal DOM double
// ---------------------------------------------------------------------------

class FakeClassList {
  constructor(element) {
    this.element = element;
    this.items = new Set(
      (element.className || '').split(/\s+/).filter(Boolean)
    );
  }

  _sync() {
    this.element._className = Array.from(this.items).join(' ');
  }

  add(...names) {
    names.filter(Boolean).forEach((name) => this.items.add(name));
    this._sync();
  }

  remove(...names) {
    names.forEach((name) => this.items.delete(name));
    this._sync();
  }

  contains(name) {
    return this.items.has(name);
  }

  toggle(name, force) {
    const shouldHave = force === undefined ? !this.items.has(name) : Boolean(force);
    if (shouldHave) this.items.add(name);
    else this.items.delete(name);
    this._sync();
    return shouldHave;
  }
}

class FakeElement {
  constructor(tag = 'div', attributes = {}) {
    this.tagName = tag.toUpperCase();
    this._attributes = { ...attributes };
    this._className = attributes.class || attributes.className || '';
    this.id = attributes.id || '';
    this.classList = new FakeClassList(this);
    this.style = {
      setProperty: (name, value) => { this.style[name] = value; },
      removeProperty: (name) => { delete this.style[name]; },
    };
    this.value = attributes.value || '';
    this._textContent = attributes.textContent || '';
    this._innerHTML = '';
    this._parent = null;
    this.children = [];
    this._listeners = {};
    this.disabled = false;
    this.options = [];
    allElements.push(this);
  }

  focus() {
    documentDouble.activeElement = this;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this._attributes, name);
  }

  get parentNode() {
    return this._parent;
  }

  get className() {
    return this._className;
  }

  set className(value) {
    this._className = value || '';
    this.classList.items = new Set(this._className.split(/\s+/).filter(Boolean));
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    this._textContent = String(value).replace(/<[^>]*>/g, '');
    this.children = [];
  }

  setAttribute(name, value) {
    this._attributes[name] = String(value);
    if (name === 'class') this.className = String(value);
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this._attributes, name)
      ? this._attributes[name]
      : null;
  }

  removeAttribute(name) {
    delete this._attributes[name];
  }

  addEventListener(type, handler) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(handler);
  }

  dispatchEvent(event) {
    const evt = { ...event, target: event.target || this };
    (this._listeners[evt.type] || []).forEach((handler) => handler(evt));
    return true;
  }

  click() {
    return this.dispatchEvent({ type: 'click', target: this });
  }

  appendChild(child) {
    child._parent = this;
    this.children.push(child);
    if (this.tagName === 'SELECT' && child.tagName === 'OPTION') this.options.push(child);
    return child;
  }

  removeChild(child) {
    child._parent = null;
    this.children = this.children.filter((item) => item !== child);
    return child;
  }

  select() {
    return true;
  }

  scrollIntoView() {
    return true;
  }

  containsDescendant(element) {
    let cursor = element._parent;
    while (cursor) {
      if (cursor === this) return true;
      cursor = cursor._parent;
    }
    return false;
  }

  querySelectorAll(selector) {
    return queryAll(selector).filter((element) => element !== this && this.containsDescendant(element));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    let cursor = this;
    while (cursor) {
      if (matchesSelector(cursor, selector)) return cursor;
      cursor = cursor._parent;
    }
    return null;
  }
}

function matchesSelector(element, selector) {
  const value = selector.trim();
  if (value === '#mission-step-2 p') {
    return element.tagName === 'P' && element._parent && element._parent.id === 'mission-step-2';
  }
  if (value.startsWith('#')) return element.id === value.slice(1);
  if (value.startsWith('.')) return element.classList.contains(value.slice(1));
  if (value.startsWith('[') && value.endsWith(']')) {
    return element.getAttribute(value.slice(1, -1)) !== null;
  }
  return element.tagName === value.toUpperCase();
}

function domPosition(element) {
  const position = [];
  let cursor = element;
  while (cursor && cursor._parent) {
    position.unshift(cursor._parent.children.indexOf(cursor));
    cursor = cursor._parent;
  }
  return position;
}

function compareDomPosition(left, right) {
  const leftPath = domPosition(left);
  const rightPath = domPosition(right);
  const depth = Math.min(leftPath.length, rightPath.length);
  for (let index = 0; index < depth; index += 1) {
    if (leftPath[index] !== rightPath[index]) return leftPath[index] - rightPath[index];
  }
  return leftPath.length - rightPath.length || allElements.indexOf(left) - allElements.indexOf(right);
}

function queryAll(selector) {
  const selectors = selector.split(',').map((part) => part.trim()).filter(Boolean);
  return allElements
    .filter((element) => selectors.some((part) => matchesSelector(element, part)))
    .sort(compareDomPosition);
}

function byId(id) {
  return allElements.find((element) => element.id === id) || null;
}

function makeElement(tag, attributes = {}, parent = null) {
  const element = new FakeElement(tag, attributes);
  if (parent) parent.appendChild(element);
  return element;
}

const documentDouble = {
  body: null,
  hidden: false,
  activeElement: null,
  getElementById: byId,
  querySelector: (selector) => queryAll(selector)[0] || null,
  querySelectorAll: queryAll,
  createElement: (tag) => new FakeElement(tag),
  addEventListener: () => {},
};

async function clickAsync(element) {
  const handlers = element._listeners.click || [];
  for (const handler of handlers) {
    await handler({ type: 'click', target: element });
  }
}

function buildDom() {
  allElements = [];
  documentDouble.body = makeElement('body');

  // --- Screen 7: exercises and terminal -----------------------------------
  const exerciseCards = [];
  for (let number = 1; number <= 12; number++) {
    const card = makeElement('div', { class: 'exercise-card' }, documentDouble.body);
    exerciseCards.push(card);
    const feedbackAttrs = { class: 'feedback-box' };
    if (number === 2) feedbackAttrs.id = 'ex2-feedback';
    if (number === 4) feedbackAttrs.id = 'ex4-feedback';
    makeElement('div', feedbackAttrs, card);
  }

  function addExerciseOptions(card, number, values) {
    const list = makeElement('div', { class: 'options-list' }, card);
    values.forEach((option) => {
      makeElement('button', {
        class: `option-btn ex${number}-option`,
        'data-option': option,
      }, list);
    });
  }

  addExerciseOptions(exerciseCards[0], 1, ['A', 'B', 'C', 'D']);
  addExerciseOptions(exerciseCards[2], 3, ['A', 'B', 'C']);
  addExerciseOptions(exerciseCards[4], 5, ['A', 'B', 'C']);
  addExerciseOptions(exerciseCards[5], 6, ['A', 'B', 'C']);
  addExerciseOptions(exerciseCards[6], 7, ['A', 'B', 'C']);
  [8, 9, 10, 11].forEach((number, index) => {
    addExerciseOptions(exerciseCards[7 + index], number, ['A', 'B']);
  });

  makeElement('input', { id: 'ex2-input', value: '' }, exerciseCards[1]);
  makeElement('button', { id: 'ex2-check-btn' }, exerciseCards[1]);
  makeElement('button', { id: 'ex2-hint-btn' }, exerciseCards[1]);
  makeElement('input', { id: 'ex4-input', value: '' }, exerciseCards[3]);
  makeElement('button', { id: 'btn-check-ex4' }, exerciseCards[3]);

  makeElement('span', { id: 'terminal-status-indicator' }, exerciseCards[11]);
  makeElement('textarea', { id: 'terminal-code-input', value: '' }, exerciseCards[11]);
  makeElement('button', { id: 'btn-run-code' }, exerciseCards[11]);
  makeElement('div', { id: 'terminal-output-display', class: 'terminal-output' }, exerciseCards[11]);
  makeElement('button', { id: 'exercises-proceed-btn' }, documentDouble.body);
  makeElement('span', { id: 'exercises-progress-hint' }, documentDouble.body);

  const presetIds = [
    'btn-preset-asc', 'btn-preset-desc', 'btn-preset-imm',
    'btn-preset-key-len', 'btn-preset-key-lambda', 'btn-preset-stability',
  ];
  presetIds.forEach((id) => {
    makeElement('button', { id, class: 'terminal-preset-btn' }, exerciseCards[11]);
  });
  makeElement('button', { id: 'btn-reset-terminal-code' }, exerciseCards[11]);

  // --- Screen 5: simulator -------------------------------------------------
  ['bubble', 'insertion', 'merge', 'connection', 'timsort', 'comparison'].forEach((algo) => {
    makeElement('button', {
      class: 'algo-tab-btn',
      'data-algo': algo,
      role: 'tab',
      'aria-controls': algo === 'connection' ? 'sim-connection-panel' : (algo === 'comparison' ? 'sim-comparison-panel' : 'sim-interactive-panel'),
    }, documentDouble.body);
  });
  ['random', 'sorted', 'reversed', 'nearly_sorted', 'duplicates'].forEach((dataset) => {
    makeElement('button', {
      class: 'comp-dataset-btn',
      'data-dataset': dataset,
    }, documentDouble.body);
  });

  [
    'sim-stage', 'sim-commentary-label', 'sim-commentary-text', 'sim-commentary-why', 'sim-step-counter', 'sim-metric-comps',
    'sim-metric-moves', 'sim-metric-moves-label', 'sim-metric-phase',
    'sim-play-btn', 'sim-next-btn', 'sim-mode-asc', 'sim-mode-desc',
    'sim-speed-select', 'sim-algo-title', 'sim-algo-desc', 'sim-algo-bigo',
    'sim-algo-badge', 'sim-interactive-panel', 'sim-comparison-panel',
    'sim-connection-panel', 'sim-algo-info-card', 'comparison-table-body', 'comparison-status-msg',
    'comparison-purpose', 'comparison-pattern-help', 'comparison-loading',
    'comparison-results', 'comparison-chart', 'comparison-interpretation',
    'comparison-success-badge', 'comparison-advanced', 'comparison-sample',
    'sim-proceed-btn', 'sim-check-panel',
    'sim-check-question', 'sim-check-option-a', 'sim-check-option-b',
    'sim-check-feedback', 'sim-progress-fill', 'sim-progressbar',
  ].forEach((id) => makeElement('div', { id }, documentDouble.body));
  byId('sim-speed-select').value = '900';

  for (let stage = 0; stage < 5; stage += 1) {
    makeElement('li', { class: 'bridge-progress-step', 'data-stage': String(stage) }, documentDouble.body);
  }

  [
    'bridge-progress-bar', 'bridge-progress-fill', 'bridge-stage-kicker',
    'bridge-stage-counter', 'bridge-stage-title', 'bridge-stage-copy',
    'bridge-visual', 'bridge-operation-label', 'bridge-explanation-text',
    'bridge-prev-btn', 'bridge-restart-btn', 'bridge-next-btn',
    'bridge-continue-btn', 'bridge-check-panel', 'bridge-check-options',
    'bridge-check-feedback', 'bridge-complete-badge',
  ].forEach((id) => makeElement('div', { id }, documentDouble.body));

  const datasetSelect = makeElement('select', { id: 'sim-input-dataset-select' }, documentDouble.body);
  ['ward_sample', 'random', 'sorted', 'reversed', 'nearly_sorted', 'duplicates'].forEach((value) => {
    makeElement('option', { value }, datasetSelect);
  });
  datasetSelect.value = 'ward_sample';

  [
    'sim-teaching-panel', 'sim-teach-state', 'sim-teach-examined',
    'sim-teach-condition', 'sim-teach-outcome', 'sim-teach-change',
    'sim-teach-remaining', 'sim-teach-complete', 'sim-teaching-legend',
  ].forEach((id) => makeElement('div', { id }, documentDouble.body));

  // --- Screen 6: Python lesson --------------------------------------------
  [
    'learn-dataset-select', 'learn-toggle-asc', 'learn-toggle-desc',
    'learn-mode-sorted', 'learn-mode-sort', 'pipeline-original-box',
    'pipeline-code-display', 'pipeline-result-box', 'btn-toggle-stability',
    'stability-cards-container', 'stability-status-text', 'learn-proceed-btn',
    'learn-progress-hint',
  ].forEach((id) => makeElement('div', { id }, documentDouble.body));
  byId('learn-dataset-select').value = 'admissions';
  ['none', 'len', 'lower'].forEach((mode) => {
    makeElement('button', { class: 'mode-toggle-btn', 'data-key-mode': mode }, documentDouble.body);
  });

  // --- Screen 8: final mission --------------------------------------------
  const missionStrategyGroup = makeElement('div', { class: 'mission-options' }, documentDouble.body);
  ['ascending', 'descending'].forEach((strategy) => {
    makeElement('button', { class: 'mission-strat-btn', 'data-strat': strategy }, missionStrategyGroup);
  });
  [
    'mission-strategy-feedback', 'mission-step-2', 'mission-python-output',
    'mission-run-python-btn', 'mission-step-3', 'mission-award-area',
    'mission-print-btn', 'mission-restart-btn', 'mission-badge-art',
    'mission-q1-feedback', 'mission-q2-feedback', 'mission-q3-feedback',
    'mission-requirements-list',
  ].forEach((id) => makeElement('div', { id }, documentDouble.body));
  makeElement('p', {}, byId('mission-step-2'));

  function addMissionOptions(className, values) {
    const group = makeElement('div', { class: 'mission-options' }, documentDouble.body);
    values.forEach((value) => {
      makeElement('button', { class: className, 'data-val': value }, group);
    });
  }

  addMissionOptions('mission-q1-btn', ['A', 'B', 'C']);
  addMissionOptions('mission-q2-btn', ['STABLE', 'MUTATE']);
  addMissionOptions('mission-q3-btn', ['BUBBLE', 'TIMSORT', 'QUICKSORT']);
}

function loadModules() {
  global.window = global;
  global.document = documentDouble;
  global.navigator = { clipboard: null };
  global.fetch = (...args) => fetchImpl(...args);
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
  };
  global.SVGIcons = { badge: '<svg></svg>' };
  const awardedMilestones = new Set();
  const harnessScreenRequirements = {
    2: ['story.scenes'],
    3: ['evidence.compared'],
    4: ['game.allLevels'],
    5: ['sim.bubble', 'sim.insertion', 'sim.merge', 'sim.connection', 'sim.timsort', 'comparison.benchmark'],
    6: ['python.sorting'],
    7: ['exercises.complete'],
    8: ['mission.complete'],
  };
  global.harnessMilestones = awardedMilestones;
  global.awardAttempts = [];
  global.App = {
    completeScreen: (screen) => appCalls.push(`complete:${screen}`),
    goToScreen: (screen) => appCalls.push(`go:${screen}`),
    triggerConfetti: () => appCalls.push('confetti'),
    playSound: () => {},
    resetProgress: () => appCalls.push('reset'),
    awardMilestone: (key) => {
      global.awardAttempts.push(key);
      if (awardedMilestones.has(key)) return false;
      awardedMilestones.add(key);
      appCalls.push(`milestone:${key}`);
      return true;
    },
    getProgress: () => ({
      currentScreen: 5,
      completedScreens: [1],
      unlockedScreens: [1, 2, 3, 4, 5],
      milestones: Object.fromEntries(Array.from(awardedMilestones).map((key) => [key, true])),
      earnedCount: awardedMilestones.size,
      totalCount: 12,
      screenRequirements: harnessScreenRequirements,
    }),
  };

  const scripts = [
    'js/randomize.js',
    'js/simulator.js',
    'js/timsortBridge.js',
    'js/pythonLearn.js',
    'js/exercises.js',
    'js/finalMission.js',
  ];
  scripts.forEach((relativePath) => {
    const fullPath = path.join(PROJECT_ROOT, relativePath);
    vm.runInThisContext(fs.readFileSync(fullPath, 'utf8'), { filename: relativePath });
  });
}

function expectedSorted(input, mode) {
  return [...input].sort((a, b) => (mode === 'descending' ? b - a : a - b));
}

function algorithmsForProperties() {
  return ['bubble', 'insertion', 'merge', 'timsort'];
}

async function testSimulator() {
  const Simulator = global.SimulatorModule;
  const arrays = [
    [58, 24, 91, 12, 45],
    [],
    [7],
    [4, 4, 1, 9, 1],
    [9, 8, 7, 6, 5],
  ];
  const algorithms = ['bubble', 'insertion', 'merge', 'timsort'];

  algorithms.forEach((algorithm) => {
    ['ascending', 'descending'].forEach((mode) => {
      arrays.forEach((input, index) => {
        const steps = Simulator.generateSteps(algorithm, input, mode);
        const final = steps[steps.length - 1].array;
        record(
          `${algorithm} ${mode} dataset ${index} sorts correctly`,
          JSON.stringify(final) === JSON.stringify(expectedSorted(input, mode)),
          `got ${JSON.stringify(final)}, expected ${JSON.stringify(expectedSorted(input, mode))}`
        );
      });
    });
  });

  // Opening the comparison tab must not auto-run a benchmark or award credit.
  let autoBenchmarkCalls = 0;
  fetchImpl = async () => {
    autoBenchmarkCalls++;
    return {
      ok: true,
      json: async () => ({ algorithms: {}, sample_input: [], size: 60 }),
    };
  };
  Simulator.setAlgorithm('comparison');
  record('comparison tab hides interactive panel', byId('sim-interactive-panel').style.display === 'none');
  record('comparison tab shows comparison panel', byId('sim-comparison-panel').style.display === 'block');
  record('comparison tab does not auto-run a benchmark', autoBenchmarkCalls === 0);
  record('comparison tab starts with an idle status', byId('comparison-status-msg').getAttribute('data-state') === 'idle');

  Simulator.setAlgorithm('timsort');
  record(
    'Timsort info card remains honestly labelled',
    byId('sim-algo-title').textContent.includes('simplified') &&
      byId('sim-algo-badge').textContent.includes('not CPython')
  );

  Simulator.setMode('descending');
  const state = Simulator.getState();
  record(
    'mode switch regenerates descending steps',
    JSON.stringify(state.finalArray) === JSON.stringify([91, 58, 45, 24, 12]),
    JSON.stringify(state.finalArray)
  );
  record('descending button becomes active', byId('sim-mode-desc').classList.contains('active'));

  let benchmarkBody = null;
  fetchImpl = async (url, options) => {
    record('comparison uses /api/benchmark', url === '/api/benchmark', url);
    benchmarkBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        dataset_type: 'reversed',
        size: 60,
        python_version: '3.15.0',
        sample_input: [1, 2, 3, 4, 5, 6, 7, 8],
        metric_definitions: {
          comparison: 'one instrumented comparison',
          timing: 'local single-shot illustration, not a ranking',
          timsort_moves: 'Not exposed by CPython; no value is invented.',
        },
        algorithms: {
          bubble: { name: 'Bubble Sort', comparisons: 6, moves: 12, move_metric: 'swaps', time_ms: 0.1, big_o_time: 'O(n²)', big_o_space: 'O(1)', stability: 'Stable', count_source: 'educational implementation' },
          insertion: { name: 'Insertion Sort', comparisons: 4, moves: 8, move_metric: 'shifts + placements', time_ms: 0.1, big_o_time: 'O(n²)', big_o_space: 'O(1)', stability: 'Stable', count_source: 'educational implementation' },
          merge: { name: 'Merge Sort', comparisons: 3, moves: 16, move_metric: 'array writes', time_ms: 0.1, big_o_time: 'O(n log n)', big_o_space: 'O(n)', stability: 'Stable', count_source: 'educational implementation' },
          timsort: { name: 'Timsort (CPython built-in)', comparisons: 2, moves: null, move_metric: 'not exposed by CPython', time_ms: 0.01, big_o_time: 'O(n log n)', big_o_space: 'O(n)', stability: 'Stable', count_source: 'instrumented rich comparisons', is_cpython_native: true },
        },
      }),
    };
  };

  await Simulator.runComparisonBenchmark('reversed');
  record('benchmark request uses selected dataset', benchmarkBody && benchmarkBody.dataset_type === 'reversed', JSON.stringify(benchmarkBody));
  record('reversed dataset button becomes active', queryAll('.comp-dataset-btn').find((b) => b.getAttribute('data-dataset') === 'reversed').classList.contains('active'));
  record('comparison table is populated', (byId('comparison-table-body').innerHTML.match(/<tr/g) || []).length === 4);
  record('sample input is displayed', byId('comparison-sample').textContent.includes('1, 2, 3, 4, 5, 6, 7, 8'));
  record('Timsort movement is not invented', byId('comparison-table-body').innerHTML.includes('Not exposed'));
  record('successful benchmark status is successful', byId('comparison-status-msg').getAttribute('data-state') === 'success', byId('comparison-status-msg').textContent);
  record('successful benchmark awards its milestone', appCalls.includes('milestone:comparison.benchmark'));

  const resultCards = byId('comparison-results').innerHTML;
  record('beginner comparison shows one card per algorithm', (resultCards.match(/comparison-result-card/g) || []).length === 4, resultCards);
  record(
    'beginner cards compare movements, theory, space and stability',
    resultCards.includes('12 swaps') &&
      resultCards.includes('8 shifts + placements') &&
      resultCards.includes('16 array writes') &&
      resultCards.includes('Movement not exposed by CPython') &&
      resultCards.includes('Time pattern') &&
      resultCards.includes('Extra space') &&
      resultCards.includes('Equal records'),
    resultCards
  );
  record('beginner cards calculate the leader from returned data', resultCards.includes('Fewest comparisons this run'), resultCards);
  const chartHtml = byId('comparison-chart').innerHTML;
  record('comparison chart uses four real comparison counts', (chartHtml.match(/comparison-chart-row/g) || []).length === 4 && chartHtml.includes('>2<') && chartHtml.includes('>6<'), chartHtml);
  record('comparison chart only compares the same unit', chartHtml.includes('Comparisons made on this dataset'), chartHtml);
  const interpretation = byId('comparison-interpretation').textContent;
  record('interpretation is computed from returned results', interpretation.includes('Timsort (CPython built-in) made the fewest comparisons (2)'), interpretation);
  record('interpretation explains sorted data, buffer memory and Timsort disclosure', interpretation.includes('Reversed data') && interpretation.includes('extra buffer') && interpretation.includes('not exposed by CPython'), interpretation);
  record('interpretation keeps timing honest', interpretation.includes('not a rigorous ranking') && interpretation.includes('not a like-for-like race'), interpretation);
  record('selected pattern help explains the chosen dataset', byId('comparison-pattern-help').textContent.includes('highest to lowest'), byId('comparison-pattern-help').textContent);
  record('advanced table remains available after the beginner results', byId('comparison-table-body').innerHTML.includes('O(n log n)') && byId('comparison-table-body').innerHTML.includes('Not exposed'));
  record('success badge appears only with real results', byId('comparison-success-badge').hidden === false);
  record('loading indicator is hidden after success', byId('comparison-loading').hidden === true);

  Simulator.setAlgorithm('bubble');
  Simulator.setMode('ascending');
}

async function testExercises() {
  const Exercises = global.ExercisesModule;
  Exercises.init();
  record('exercise proceed starts disabled', byId('exercises-proceed-btn').disabled === true);
  record('remaining exercise requirements are explained', byId('exercises-progress-hint').textContent.includes('Still to do: Exercise 1'), byId('exercises-progress-hint').textContent);

  const optionA = (selector) => queryAll(selector).find((button) => button.getAttribute('data-option') === 'A');
  clickOption(optionA('.ex1-option'));
  record('exercise 1 correct answer is accepted', Exercises.getSolvedState().ex1);
  record('exercise 1 feedback is shown', exerciseFeedback(0).classList.contains('show'));

  byId('ex2-input').value = 'reverse=True';
  byId('ex2-check-btn').click();
  record('exercise 2 reverse=True is accepted', Exercises.getSolvedState().ex2);

  clickOption(optionA('.ex3-option'));
  record('exercise 3 immutability answer is accepted', Exercises.getSolvedState().ex3);

  byId('ex4-input').value = 'key=len';
  byId('btn-check-ex4').click();
  record('exercise 4 key=len is accepted', Exercises.getSolvedState().ex4);

  clickOption(queryAll('.ex5-option').find((button) => button.getAttribute('data-option') === 'C'));
  clickOption(optionA('.ex6-option'));
  clickOption(queryAll('.ex7-option').find((button) => button.getAttribute('data-option') === 'B'));
  [8, 9, 10, 11].forEach((number) => clickOption(optionA(`.ex${number}-option`)));
  const afterMcqs = Exercises.getSolvedState();
  record('exercise 5 lambda key is accepted', afterMcqs.ex5);
  record('exercise 6 stability answer is accepted', afterMcqs.ex6);
  record('exercise 7 Timsort answer is accepted', afterMcqs.ex7);
  record('simulator operation exercises are accepted', [8, 9, 10, 11].every((number) => afterMcqs[`ex${number}`]));
  record('operation exercise feedback explains the simulator link', exerciseFeedback(7).classList.contains('show') && exerciseFeedback(7).textContent.includes('Bubble'));

  byId('btn-preset-key-lambda').click();
  record('terminal preset writes code', byId('terminal-code-input').value.includes('key=lambda'));

  fetchImpl = async (url, options) => {
    record('terminal uses /api/execute', url === '/api/execute', url);
    record('terminal sends code payload', Boolean(JSON.parse(options.body).code));
    return {
      ok: true,
      json: async () => ({ success: true, stdout: '[15, 38, 112]', execution_time_ms: 7 }),
    };
  };
  await clickAsync(byId('btn-run-code'));
  record('successful terminal run is recorded', Exercises.getSolvedState().terminalRun);
  record('successful terminal output is shown', byId('terminal-output-display').textContent.includes('[15, 38, 112]'));
  record('terminal success uses the success status class', byId('terminal-status-indicator').classList.contains('is-success'));
  record('all exercises unlock proceed', byId('exercises-proceed-btn').disabled === false && byId('exercises-proceed-btn').getAttribute('aria-disabled') === 'false');
  record('completion hint is updated', byId('exercises-progress-hint').textContent.includes('All requirements complete'), byId('exercises-progress-hint').textContent);
  record('exercise completion is awarded as a milestone', appCalls.includes('milestone:exercises.complete'));

  fetchImpl = async () => ({
    ok: false,
    json: async () => ({ success: false, stderr: 'Safety Notice: blocked' }),
  });
  await clickAsync(byId('btn-run-code'));
  record('rejected terminal run is not credited', !Exercises.getSolvedState().terminalRun);
  record('terminal failure uses the error status class', byId('terminal-status-indicator').classList.contains('is-error'));
  record('already-earned milestone keeps proceed available after a later failed run', byId('exercises-progress-hint').textContent.includes('Completed previously') && byId('exercises-proceed-btn').disabled === false, byId('exercises-progress-hint').textContent);

  fetchImpl = async () => ({
    ok: true,
    json: async () => ({ success: true, stdout: '[15, 38, 112]', execution_time_ms: 5 }),
  });
  await clickAsync(byId('btn-run-code'));
  byId('btn-reset-terminal-code').click();
  record('reset code button clears terminal credit', !Exercises.getSolvedState().terminalRun);
  record('reset code button resets terminal status', byId('terminal-status-indicator').classList.contains('is-ready'));

  byId('ex2-input').value = 'stale answer';
  Exercises.reset();
  record('module reset clears the exercise 2 answer', byId('ex2-input').value === '', byId('ex2-input').value);

  fetchImpl = async () => ({
    ok: true,
    json: async () => ({ success: true, stdout: '[15, 38, 112]' }),
  });
  await clickAsync(byId('btn-run-code'));
  record('success without a timing field is still credited', Exercises.getSolvedState().terminalRun);
  record('missing timing never renders undefined ms', !byId('terminal-status-indicator').textContent.includes('undefined'), byId('terminal-status-indicator').textContent);

  Exercises.reset();
  record('saved completion keeps proceed unlocked after re-init', byId('exercises-proceed-btn').disabled === false);
  record('saved completion is explained after re-init', byId('exercises-progress-hint').textContent.includes('Completed previously'), byId('exercises-progress-hint').textContent);
}

function clickOption(button) {
  if (!button) throw new Error('Missing option button in harness DOM');
  button.click();
}

function exerciseFeedback(cardIndex) {
  return queryAll('.exercise-card')[cardIndex].querySelector('.feedback-box');
}

async function testPythonLearn() {
  const Lesson = global.PythonLearnModule;
  Lesson.init();
  Lesson.reset();
  byId('learn-proceed-btn').click();
  record('python proceed is blocked before meaningful exploration', !appCalls.includes('milestone:python.sorting'), byId('learn-progress-hint').textContent);
  record('python proceed explains what is missing', byId('learn-progress-hint').textContent.includes('Before continuing'));

  Lesson.setDataset('days');
  record('recovery-days dataset is selectable', Lesson.getState().currentKey === 'days');
  record('recovery-days code uses its variable', byId('pipeline-code-display').innerHTML.includes('recovery_days'));

  Lesson.setDataset('mixed_names');
  Lesson.setKeyMode('lower');
  record('key=str.lower mode is selectable', Lesson.getState().keyMode === 'lower');
  record('key=str.lower appears in generated code', byId('pipeline-code-display').innerHTML.includes('str.lower'));

  Lesson.setDataset('admissions');
  Lesson.setMutationToggle(true);
  record('in-place sorted() mode is selectable', Lesson.getState().useInPlace);
  record('in-place pipeline explains mutation', byId('pipeline-original-box').innerHTML.includes('Mutated'));
  await clickAsync(byId('learn-proceed-btn'));
  record('mutation and key changes alone do not unlock Python', !appCalls.includes('milestone:python.sorting'), byId('learn-progress-hint').textContent);
  record('Python hint asks for the stability comparison', byId('learn-progress-hint').textContent.includes('stability'), byId('learn-progress-hint').textContent);

  Lesson.toggleStability();
  record('stability demonstration toggles', Lesson.getState().stabilitySorted);
  record('stability explanation mentions arrival order', byId('stability-status-text').innerHTML.includes('Arrival #2'));

  Lesson.setDataset('mixed_names');
  Lesson.setKeyMode('lower');
  Lesson.setReverseToggle(true);
  Lesson.setMutationToggle(true);
  const lowerCode = byId('pipeline-code-display').innerHTML.replace(/<[^>]+>/g, '');
  record('in-place key=len/lower works for strings', lowerCode.includes('mixed_names.sort(') && lowerCode.includes('str.lower') && lowerCode.includes('True'), lowerCode);
  record('in-place result is honestly None', byId('pipeline-result-box').innerHTML.includes('None'));
  record('descending key caption is explicit', byId('pipeline-result-box').innerHTML.includes('descending'), byId('pipeline-result-box').innerHTML);

  Lesson.setDataset('records');
  record('key buttons are disabled for record datasets', queryAll('[data-key-mode]').every((button) => button.disabled === true && button.getAttribute('aria-disabled') === 'true'));
  record('record lambda key still appears in generated code', byId('pipeline-code-display').innerHTML.includes('lambda'));

  await clickAsync(byId('learn-proceed-btn'));
  record('explored options unlock Python milestone', appCalls.includes('milestone:python.sorting'));
  record('Python milestone navigates to exercises', appCalls.includes('go:7'));
}

async function testFinalMission() {
  const Mission = global.FinalMissionModule;
  Mission.init();

  const ascending = queryAll('.mission-strat-btn').find((button) => button.getAttribute('data-strat') === 'ascending');
  const descending = queryAll('.mission-strat-btn').find((button) => button.getAttribute('data-strat') === 'descending');
  ascending.click();
  record('wrong strategy uses a selected-wrong state', ascending.classList.contains('selected-wrong') && !ascending.classList.contains('btn-outline') && ascending.getAttribute('aria-pressed') === 'true');
  descending.click();
  record('descending strategy reveals step 2', byId('mission-step-2').style.display === 'block');
  record('descending strategy is accepted', Mission.getState().isStrategySelected);
  record('correct strategy uses a selected-correct state', descending.classList.contains('selected-correct') && descending.getAttribute('aria-pressed') === 'true');

  fetchImpl = async (url, options) => {
    record('mission uses /api/execute', url === '/api/execute', url);
    record('mission sends reverse=True code', JSON.parse(options.body).code.includes('reverse=True'));
    return {
      ok: true,
      json: async () => ({
        success: true,
        stdout: 'Original Shortages: [38, 112, 15, 75, 94]\nEmergency Priority Order: [112, 94, 75, 38, 15]',
        execution_time_ms: 9,
      }),
    };
  };
  await clickAsync(byId('mission-run-python-btn'));
  record('successful mission execution reveals step 3', byId('mission-step-3').style.display === 'block');
  record('successful mission execution sets sorted state', Mission.getState().isSortedCorrectly);

  descending.click();
  fetchImpl = async () => ({
    ok: true,
    json: async () => ({ success: true, stdout: '[15, 38, 75, 94, 112]', execution_time_ms: 9 }),
  });
  await clickAsync(byId('mission-run-python-btn'));
  record('success:true with the wrong stdout is not verified', !Mission.getState().isSortedCorrectly && byId('mission-step-3').style.display === 'none', byId('mission-python-output').textContent);
  record('wrong stdout uses an error state', byId('mission-python-output').classList.contains('mission-output-error'));

  descending.click();
  fetchImpl = async (url, options) => {
    record('mission uses /api/execute', url === '/api/execute', url);
    record('mission sends reverse=True code', JSON.parse(options.body).code.includes('reverse=True'));
    return {
      ok: true,
      json: async () => ({
        success: true,
        stdout: 'Original Shortages: [38, 112, 15, 75, 94]\nEmergency Priority Order: [112, 94, 75, 38, 15]',
        execution_time_ms: 9,
      }),
    };
  };
  await clickAsync(byId('mission-run-python-btn'));
  record('correct stdout restores the verified state', Mission.getState().isSortedCorrectly && byId('mission-step-3').style.display === 'block');

  const q1B = queryAll('.mission-q1-btn').find((button) => button.getAttribute('data-val') === 'B');
  const q2Stable = queryAll('.mission-q2-btn').find((button) => button.getAttribute('data-val') === 'STABLE');
  const q2Mutate = queryAll('.mission-q2-btn').find((button) => button.getAttribute('data-val') === 'MUTATE');
  const q3Bubble = queryAll('.mission-q3-btn').find((button) => button.getAttribute('data-val') === 'BUBBLE');
  const q3Timsort = queryAll('.mission-q3-btn').find((button) => button.getAttribute('data-val') === 'TIMSORT');

  q1B.click();
  q2Mutate.click();
  record('wrong stability answer is rejected', !Mission.getState().isQuestion2Answered);
  record('wrong stability answer explains mutation', byId('mission-q2-feedback').textContent.includes('Mutation'), byId('mission-q2-feedback').textContent);
  q2Stable.click();
  record('stability answer is accepted', Mission.getState().isQuestion2Answered);
  record('stability feedback connects to visualized frames', byId('mission-q2-feedback').textContent.includes('Insertion'));
  record('badge remains locked before Q3', !Mission.getState().badgeAwarded);

  q3Bubble.click();
  record('wrong Q3 answer does not award badge', !Mission.getState().badgeAwarded);
  record('wrong Q3 uses a selected-wrong state', q3Bubble.classList.contains('selected-wrong') && q3Bubble.getAttribute('aria-pressed') === 'true' && !q3Bubble.classList.contains('btn-outline'));

  q3Timsort.click();
  const state = Mission.getState();
  record('correct Q3 answer completes mission', state.isQuestion3Answered);
  record('badge becomes reachable', state.badgeAwarded);
  record('award area is displayed', byId('mission-award-area').style.display === 'block');
  record('completion is reported as a milestone', appCalls.includes('milestone:mission.complete'));
  record(
    'mission checklist records every requirement',
    byId('mission-requirements-list').children.length === 5 &&
      byId('mission-requirements-list').children.every((item) => item.textContent.startsWith('✓')),
    byId('mission-requirements-list').children.map((item) => item.textContent).join(' | ')
  );

  Mission.reset();
  record('reset clears the visible badge', !Mission.getState().badgeAwarded && byId('mission-award-area').style.display === 'none');
  Mission.init();
  record('saved mission milestone restores the debrief', Mission.getState().badgeAwarded && Mission.getState().isSortedCorrectly);
  record('restored checklist is fully met', byId('mission-requirements-list').children.every((item) => item.textContent.startsWith('✓')));
}

function testStep1Groundwork() {
  const Simulator = global.SimulatorModule;
  const additiveKeys = [
    'heldKey', 'auxBuffer', 'runStack', 'splitRange', 'mergeRange',
    'checkpoint', 'expectedChoice', 'recordIdentities',
  ];
  const sampleFrame = Simulator.generateSteps('bubble', [2, 1], 'ascending')[0];
  record(
    'frames expose additive Phase 2 fields',
    additiveKeys.every((key) => Object.prototype.hasOwnProperty.call(sampleFrame, key)),
    Object.keys(sampleFrame).join(', ')
  );

  const duplicateInput = [4, 4, 1, 9, 1];
  algorithmsForProperties().forEach((algorithm) => {
    ['ascending', 'descending'].forEach((mode) => {
      const sourceBefore = [...duplicateInput];
      const steps = Simulator.generateSteps(algorithm, duplicateInput, mode);
      const finalFrame = steps[steps.length - 1];
      const groups = new Map();
      finalFrame.recordIdentities.forEach((record) => {
        if (!groups.has(record.value)) groups.set(record.value, []);
        groups.get(record.value).push(record.arrival);
      });
      const stable = [...groups.values()].every((arrivals) =>
        arrivals.every((arrival, index) => index === 0 || arrivals[index - 1] < arrival)
      );
      record(
        `${algorithm} ${mode} keeps equal records in arrival order`,
        stable && JSON.stringify(finalFrame.array) === JSON.stringify(expectedSorted(duplicateInput, mode)),
        JSON.stringify(finalFrame.recordIdentities)
      );
      record(
        `${algorithm} ${mode} leaves the source array untouched`,
        JSON.stringify(duplicateInput) === JSON.stringify(sourceBefore)
      );
    });
  });

  record(
    'bubble movement label is rendered',
    byId('sim-metric-moves-label').textContent === 'swaps',
    byId('sim-metric-moves-label').textContent
  );

  Simulator.setAlgorithm('merge');
  record(
    'merge movement label is rendered',
    byId('sim-metric-moves-label').textContent === 'array writes',
    byId('sim-metric-moves-label').textContent
  );

  Simulator.setAlgorithm('timsort');
  record(
    'timsort movement label is rendered',
    byId('sim-metric-moves-label').textContent === 'model writes',
    byId('sim-metric-moves-label').textContent
  );

  const timSteps = Simulator.generateSteps('timsort', [5, 1, 2, 3, 4, 5], 'ascending');
  const extensionStep = timSteps.find((step) => step.phase === 'Extend short run');
  record(
    'timsort extension wording matches linear insertion',
    Boolean(extensionStep) &&
      extensionStep.explanation.includes('linear insertion') &&
      !extensionStep.explanation.includes('binary insertion'),
    extensionStep ? extensionStep.explanation : 'no extension frame'
  );

  record('custom input is accepted', Simulator.setInput([9, 1, 5]) === true);
  record('custom input sorts correctly', JSON.stringify(Simulator.getState().finalArray) === JSON.stringify([1, 5, 9]));
  const inputCopy = Simulator.getInput();
  inputCopy.push(99);
  record('getInput returns a defensive copy', Simulator.getInput().length === 3);
  record('invalid custom input is rejected', Simulator.setInput([1, 'not-a-number']) === false);

  record('sorted dataset type is accepted', Simulator.setDatasetType('sorted') === true);
  record(
    'sorted dataset input is deterministic',
    JSON.stringify(Simulator.getInput()) === JSON.stringify([10, 12, 14, 16, 18]),
    JSON.stringify(Simulator.getInput())
  );
  record('reversed dataset type is accepted', Simulator.setDatasetType('reversed') === true);
  record(
    'reversed dataset input is deterministic',
    JSON.stringify(Simulator.getInput()) === JSON.stringify([18, 16, 14, 12, 10]),
    JSON.stringify(Simulator.getInput())
  );
  record('invalid dataset type is rejected', Simulator.setDatasetType('unknown') === false);
  record(
    'invalid dataset type leaves input unchanged',
    JSON.stringify(Simulator.getInput()) === JSON.stringify([18, 16, 14, 12, 10])
  );
  record('dataset selector follows the active dataset', byId('sim-input-dataset-select').value === 'reversed', byId('sim-input-dataset-select').value);

  Simulator.reset();
  const resetState = Simulator.getState();
  record('reset restores the original ward sample', JSON.stringify(resetState.inputData) === JSON.stringify([58, 24, 91, 12, 45]));
  record('reset restores the original label', resetState.inputDatasetType === 'ward_sample');
  record('reset restores the dataset selector', byId('sim-input-dataset-select').value === 'ward_sample', byId('sim-input-dataset-select').value);
  record('reset restores the bubble label', byId('sim-metric-moves-label').textContent === 'swaps');
  record('state exposes additive input metadata', resetState.movementLabel === 'swaps' && resetState.activeDataset === 'random');
}

function completionCalls() {
  return global.awardAttempts.filter((key) => /^sim\./.test(key)).length;
}

function advanceUntil(Simulator, predicate) {
  let state = Simulator.getState();
  let guard = 0;
  while (!predicate(state) && state.currentStepIdx < state.totalSteps - 1 && guard < 500) {
    Simulator.nextStep();
    state = Simulator.getState();
    guard++;
  }
  return state;
}

function finishRun(Simulator) {
  let state = Simulator.getState();
  let guard = 0;
  while (state.currentStepIdx < state.totalSteps - 1 && guard < 500) {
    if (state.checkpointType && !state.checkpointAnswered) {
      Simulator.answerCheckpoint(state.expectedChoice);
    }
    Simulator.nextStep();
    state = Simulator.getState();
    guard++;
  }
  return state;
}

function setFinalFrame(Simulator) {
  let state = Simulator.getState();
  let guard = 0;
  while (state.currentStepIdx < state.totalSteps - 1 && guard < 500) {
    Simulator.nextStep();
    state = Simulator.getState();
    guard++;
  }
  return state;
}

function testStep2Interactivity() {
  const Simulator = global.SimulatorModule;

  Simulator.reset();
  record('reset starts on the first frame', Simulator.getState().currentStepIdx === 0);
  record('reset hides the understanding check', byId('sim-check-panel').style.display === 'none');
  record('play is the only primary start control', byId('sim-play-btn').textContent.includes('Play'));
  record('removed previous control is absent from the DOM', byId('sim-prev-btn') === null);
  record('removed checkpoint panel is absent from the DOM', byId('sim-checkpoint-panel') === null);

  const originalSetInterval = global.setInterval;
  const originalClearInterval = global.clearInterval;
  const timers = new Map();
  let registeredTimers = 0;
  global.setInterval = (fn, delay) => {
    const id = ++registeredTimers;
    timers.set(id, { fn, delay });
    return id;
  };
  global.clearInterval = (id) => { timers.delete(id); };
  const activeTimerCount = () => timers.size;
  const onlyTimerDelay = () => [...timers.values()][0] && [...timers.values()][0].delay;
  const tick = () => {
    [...timers.entries()].forEach(([id, timer]) => {
      if (timers.has(id)) timer.fn();
    });
  };

  try {
    const initial = Simulator.getState().currentStepIdx;
    Simulator.play();
    record('play becomes pause while running', byId('sim-play-btn').textContent.includes('Pause'));
    record('play registers exactly one timer', registeredTimers === 1, registeredTimers);
    record('one timer is active while playing', activeTimerCount() === 1, activeTimerCount());
    record('play uses the configured 900 ms speed', onlyTimerDelay() === 900, onlyTimerDelay());
    record('getState reports active playback', Simulator.getState().isPlaying === true && Simulator.getState().playbackTimerActive === true);
    record('play does not skip the opening frame', Simulator.getState().currentStepIdx === initial);

    tick();
    record('automatic playback advances on the first tick', Simulator.getState().currentStepIdx === initial + 1, Simulator.getState().currentStepIdx);
    record('playback continues after the first tick', Simulator.getState().isPlaying === true && activeTimerCount() === 1 && byId('sim-play-btn').textContent.includes('Pause'));
    record('automatic tick renders the matching commentary and counter', byId('sim-step-counter').textContent.includes(`Step ${initial + 2} of`) && byId('sim-commentary-text').textContent.length > 10, byId('sim-step-counter').textContent);
    tick();
    record('automatic playback advances on later ticks', Simulator.getState().currentStepIdx === initial + 2, Simulator.getState().currentStepIdx);

    Simulator.nextStep();
    record('next pauses playback before advancing', byId('sim-play-btn').textContent.includes('Play') && activeTimerCount() === 0);
    record('next advances exactly one operation', Simulator.getState().currentStepIdx === initial + 3);
    record('next during playback does not create another timer', registeredTimers === 1, registeredTimers);

    const pausedIndex = Simulator.getState().currentStepIdx;
    Simulator.nextStep();
    record('next works while already paused', Simulator.getState().currentStepIdx === pausedIndex + 1 && byId('sim-play-btn').textContent.includes('Play'));
    record('next while paused does not start a timer', activeTimerCount() === 0);

    Simulator.play();
    tick();
    const resumeIndex = Simulator.getState().currentStepIdx;
    Simulator.pause();
    record('pause stops advancement immediately', Simulator.getState().currentStepIdx === resumeIndex && activeTimerCount() === 0);
    Simulator.play();
    record('play resumes from the current position', Simulator.getState().currentStepIdx === resumeIndex && activeTimerCount() === 1);
    Simulator.pause();

    let overlapSafe = true;
    for (let cycle = 0; cycle < 5; cycle++) {
      Simulator.play();
      Simulator.play();
      if (activeTimerCount() !== 1) overlapSafe = false;
      Simulator.pause();
      Simulator.pause();
      if (activeTimerCount() !== 0) overlapSafe = false;
    }
    record('repeated play and pause clicks never overlap timers', overlapSafe && activeTimerCount() === 0, activeTimerCount());

    Simulator.reset();
    Simulator.play();
    let guard = 0;
    while (activeTimerCount() > 0 && guard++ < 500) tick();
    let state = Simulator.getState();
    record('automatic playback reaches the final frame', state.currentStepIdx === state.totalSteps - 1, state);
    record('playback stops automatically at the final frame', activeTimerCount() === 0 && state.isPlaying === false && byId('sim-play-btn').textContent.includes('Play'));
    record('final frame disables Next because there is no further operation', byId('sim-next-btn').disabled === true);

    Simulator.play();
    record('play from the final frame visibly renders frame 1', Simulator.getState().currentStepIdx === 0);
    record('frame 1 counter is rendered before the first tick', byId('sim-step-counter').textContent.includes('Step 1 of'), byId('sim-step-counter').textContent);
    record('play from the final frame resumes in the running state', byId('sim-play-btn').textContent.includes('Pause') && activeTimerCount() === 1);
    tick();
    record('replay advances from frame 1 rather than skipping it', Simulator.getState().currentStepIdx === 1, Simulator.getState().currentStepIdx);

    Simulator.setAlgorithm('insertion');
    record('switching algorithms stops the old playback timer', activeTimerCount() === 0 && Simulator.getState().isPlaying === false && byId('sim-play-btn').textContent.includes('Play'));
    Simulator.play();
    Simulator.setDatasetType('sorted');
    record('changing datasets stops the old playback timer', activeTimerCount() === 0 && Simulator.getState().isPlaying === false);
    Simulator.play();
    Simulator.setSpeed(400);
    record('speed changes restart exactly one timer', activeTimerCount() === 1 && onlyTimerDelay() === 400, onlyTimerDelay());
    Simulator.pause();

    state = setFinalFrame(Simulator);
    record('final frame is reached by Next', state.currentStepIdx === state.totalSteps - 1);
    Simulator.play();
    Simulator.pause();
    record('pause restores the play label immediately', byId('sim-play-btn').textContent.includes('Play'));
  } finally {
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
  }

  const expectedCorrect = {
    bubble: 'adjacent',
    insertion: 'slot',
    merge: 'copy',
    timsort: 'reverse',
  };

  Object.keys(expectedCorrect).forEach((algorithm) => {
    Simulator.reset();
    Simulator.setAlgorithm(algorithm);
    const before = completionCalls();
    let state = setFinalFrame(Simulator);
    const optionA = byId('sim-check-option-a');
    const optionB = byId('sim-check-option-b');
    const values = {
      correct: optionA.getAttribute('data-answer') === expectedCorrect[algorithm]
        ? optionA.getAttribute('data-answer')
        : optionB.getAttribute('data-answer'),
      wrong: optionA.getAttribute('data-answer') === expectedCorrect[algorithm]
        ? optionB.getAttribute('data-answer')
        : optionA.getAttribute('data-answer'),
    };
    record(`${algorithm} rendered check matches the expected concept`, values.correct === expectedCorrect[algorithm], values);

    record(`${algorithm} check appears on the final frame`, byId('sim-check-panel').style.display === 'block');
    record(`${algorithm} question is rendered`, byId('sim-check-question').textContent.length > 20, byId('sim-check-question').textContent);
    record(`${algorithm} final frame alone earns no milestone`, completionCalls() === before);
    record(`${algorithm} final frame alone is marked unanswered`, state.understandingCheckAnswered === false);

    const wrong = Simulator.answerUnderstandingCheck(values.wrong);
    record(`${algorithm} wrong check is rejected`, wrong.correct === false);
    record(`${algorithm} wrong check still earns no milestone`, completionCalls() === before);
    record(`${algorithm} wrong check explains the misconception`, byId('sim-check-feedback').textContent.includes('Not yet'), byId('sim-check-feedback').textContent);

    Simulator.answerUnderstandingCheck(values.wrong);
    record(`${algorithm} repeated wrong clicks do not earn credit`, completionCalls() === before);

    const correct = Simulator.answerUnderstandingCheck(values.correct);
    state = Simulator.getState();
    record(`${algorithm} correct check is accepted`, correct.correct === true, values.correct);
    record(`${algorithm} correct check records understanding`, state.understandingCheckAnswered === true);
    record(`${algorithm} correct check awards exactly one milestone`, completionCalls() === before + 1, completionCalls() - before);
    record(`${algorithm} correct check explains the operation`, byId('sim-check-feedback').textContent.includes('Correct'));
    record(`${algorithm} answered check freezes both options`, byId('sim-check-option-a').disabled === true && byId('sim-check-option-b').disabled === true);

    const afterCorrect = completionCalls();
    Simulator.answerUnderstandingCheck(values.correct);
    record(`${algorithm} repeated correct clicks do not award credit again`, completionCalls() === afterCorrect);

    Simulator.setAlgorithm('bubble');
    record(`${algorithm} changing algorithm clears the check panel`, byId('sim-check-panel').style.display === 'none');
  });

  Simulator.reset();
  record('reset clears the visible understanding check', byId('sim-check-panel').style.display === 'none');
  record('reset does not remove earned milestones', completionCalls() > 0);
  record('screen 5 proceed stays locked until all five milestones are earned', byId('sim-proceed-btn').disabled === true, byId('sim-proceed-btn').getAttribute('aria-disabled'));
}


function validBenchmarkPayload() {
  return {
    size: 60,
    python_version: '3.15.0',
    sample_input: [1, 2, 3, 4, 5, 6, 7, 8],
    algorithms: {
      bubble: { name: 'Bubble Sort', comparisons: 1, moves: 2, move_metric: 'swaps', time_ms: 0.1, big_o_time: 'O(n²)', big_o_space: 'O(1)', stability: 'Stable' },
      insertion: { name: 'Insertion Sort', comparisons: 1, moves: 2, move_metric: 'shifts', time_ms: 0.1, big_o_time: 'O(n²)', big_o_space: 'O(1)', stability: 'Stable' },
      merge: { name: 'Merge Sort', comparisons: 1, moves: 2, move_metric: 'array writes', time_ms: 0.1, big_o_time: 'O(n log n)', big_o_space: 'O(n)', stability: 'Stable' },
      timsort: { name: 'Timsort (CPython built-in)', comparisons: 1, moves: null, move_metric: 'not exposed', time_ms: 0.01, big_o_time: 'O(n log n)', big_o_space: 'O(n)', stability: 'Stable' },
    },
  };
}

async function testBenchmarkFailureStates() {
  const Simulator = global.SimulatorModule;
  const status = () => byId('comparison-status-msg');
  const datasetButtons = () => queryAll('.comp-dataset-btn');

  fetchImpl = async () => ({
    ok: false,
    status: 404,
    json: async () => ({ error: 'Endpoint not found' }),
  });
  await Simulator.runComparisonBenchmark('random');
  record('404 is classified as a missing endpoint', status().getAttribute('data-state') === 'endpoint-missing', status().getAttribute('data-state'));
  record('404 guidance tells the learner to restart server.py', status().textContent.includes('Restart server.py'), status().textContent);
  record('404 shows no invented measurements', !/\d+\s*ms/.test(byId('comparison-table-body').innerHTML), byId('comparison-table-body').innerHTML);
  record('failed request clears beginner result cards', byId('comparison-results').innerHTML === '', byId('comparison-results').innerHTML);
  record('failed request clears the comparison chart', byId('comparison-chart').innerHTML === '', byId('comparison-chart').innerHTML);
  record('failed request clears the interpretation', byId('comparison-interpretation').textContent === '', byId('comparison-interpretation').textContent);
  record('failed request hides the success badge', byId('comparison-success-badge').hidden === true);
  record('dataset buttons are re-enabled after 404', datasetButtons().every((btn) => !btn.disabled && !btn.hasAttribute('aria-busy')));

  fetchImpl = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ size: 60, algorithms: {}, sample_input: [] }),
  });
  await Simulator.runComparisonBenchmark('sorted');
  record('empty algorithm payload is an invalid response', status().getAttribute('data-state') === 'invalid-response', status().getAttribute('data-state'));
  record('invalid response does not show algorithm rows', !byId('comparison-table-body').innerHTML.includes('Bubble Sort'), byId('comparison-table-body').innerHTML);

  fetchImpl = async () => {
    throw new TypeError('Failed to fetch');
  };
  await Simulator.runComparisonBenchmark('reversed');
  record('transport failure is request-failed', status().getAttribute('data-state') === 'request-failed', status().getAttribute('data-state'));
  record('transport failure says the local server was unreachable', status().textContent.includes('local server could not be reached'), status().textContent);

  fetchImpl = async () => {
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    throw error;
  };
  await Simulator.runComparisonBenchmark('duplicates');
  record('aborted request is a timeout', status().getAttribute('data-state') === 'timeout', status().getAttribute('data-state'));

  let resolveRequest = null;
  fetchImpl = () => new Promise((resolve) => {
    resolveRequest = resolve;
  });
  const pending = Simulator.runComparisonBenchmark('nearly_sorted');
  record('running benchmark exposes a running state', status().getAttribute('data-state') === 'running', status().getAttribute('data-state'));
  record('running benchmark shows a loading state', byId('comparison-loading').hidden === false);
  record('running benchmark disables dataset buttons', datasetButtons().every((btn) => btn.disabled && btn.getAttribute('aria-busy') === 'true'));
  record('a new run clears old results immediately', byId('comparison-results').innerHTML === '' && byId('comparison-interpretation').textContent === '');
  resolveRequest({
    ok: true,
    status: 200,
    json: async () => validBenchmarkPayload(),
  });
  await pending;
  record('successful benchmark returns to a success state', status().getAttribute('data-state') === 'success', status().getAttribute('data-state'));
  record('successful benchmark re-enables dataset buttons', datasetButtons().every((btn) => !btn.disabled && !btn.hasAttribute('aria-busy')));

  let resolveOld = null;
  let resolveNew = null;
  fetchImpl = () => new Promise((resolve) => {
    if (!resolveOld) resolveOld = resolve;
    else resolveNew = resolve;
  });
  const oldPending = Simulator.runComparisonBenchmark('sorted');
  const newPending = Simulator.runComparisonBenchmark('random');
  resolveNew({
    ok: true,
    status: 200,
    json: async () => validBenchmarkPayload(),
  });
  await newPending;
  const newestInterpretation = byId('comparison-interpretation').textContent;
  resolveOld({
    ok: true,
    status: 200,
    json: async () => validBenchmarkPayload(),
  });
  await oldPending;
  record('a stale benchmark response cannot replace the newest results', byId('comparison-interpretation').textContent === newestInterpretation && byId('comparison-pattern-help').textContent.includes('random-like'), byId('comparison-pattern-help').textContent);
}

function testTeachingPanels() {
  const Simulator = global.SimulatorModule;
  Simulator.reset();
  Simulator.setAlgorithm('insertion');
  let state = advanceUntil(Simulator, (s) => s.phase.startsWith('Pick position'));
  const teachingIds = [
    'sim-teach-state', 'sim-teach-examined', 'sim-teach-condition',
    'sim-teach-outcome', 'sim-teach-change', 'sim-teach-remaining',
    'sim-teach-complete', 'sim-teaching-legend',
  ];
  record('step reasoning panel is filled in', teachingIds.every((id) => byId(id).textContent.trim().length > 0), JSON.stringify(state.phase));
  record('step reasoning states the condition and outcome', byId('sim-teach-condition').textContent.includes('?') && byId('sim-teach-outcome').textContent.length > 0);
  const insertionLegend = byId('sim-teaching-legend').textContent.trim();
  Simulator.setAlgorithm('merge');
  const mergeLegend = byId('sim-teaching-legend').textContent.trim();
  record(
    'step reasoning shows a contextual text symbol legend',
    insertionLegend.length > 0 &&
      mergeLegend.length > 0 &&
      insertionLegend !== mergeLegend &&
      /[⇄◆✓⟲→]/.test(insertionLegend) &&
      /[a-z]/i.test(mergeLegend),
    `${insertionLegend} | ${mergeLegend}`
  );

  Simulator.reset();
  const timSteps = Simulator.generateSteps('timsort', [58, 24, 91, 12, 45], 'ascending');
  const runFrames = timSteps.filter((step) => step.phase.startsWith('Natural run'));
  const reverseFrames = timSteps.filter((step) => step.phase === 'Reverse opposite run');
  const compareFrames = timSteps.filter((step) => step.phase === 'Merge comparison');
  const bufferFrames = timSteps.filter((step) => step.phase === 'Add to merge buffer');
  record('Timsort exposes run detection', runFrames.length >= 2, runFrames.length);
  record('Timsort exposes reversal frames', reverseFrames.length >= 1, reverseFrames.length);
  record('Timsort exposes exact merge comparisons', compareFrames.length >= 1 && compareFrames.every((step) => step.comparing.length === 2 && step.auxBuffer), compareFrames.length);
  record('Timsort exposes auxiliary buffer appends', bufferFrames.length >= 1 && bufferFrames.every((step) => step.auxBuffer && step.runStack), bufferFrames.length);
  record('Timsort labels the teaching minrun limit', timSteps[0].explanation.includes('minrun') && timSteps[0].explanation.includes('CPython'), timSteps[0].explanation);
  record('Timsort run checkpoint is available', runFrames.some((step) => step.checkpoint === 'timsort_run' && step.expectedChoice));
  Simulator.reset();
}

function testAlgorithmVisualSurfaces() {
  const Simulator = global.SimulatorModule;
  const stageHtml = () => byId('sim-stage').innerHTML;

  Simulator.reset();
  Simulator.setAlgorithm('bubble');
  record(
    'bubble keeps a neighbour-comparison bar stage',
    stageHtml().includes('sim-bars') &&
      stageHtml().includes('sim-bar-item') &&
      !stageHtml().includes('sim-insertion-board'),
    stageHtml().slice(0, 180)
  );
  const bubbleCompare = advanceUntil(Simulator, (s) => s.phase.startsWith('Pass '));
  const commentary = byId('sim-commentary-text').textContent;
  record(
    'commentary gives one short action sentence with a visible label',
    byId('sim-commentary-label').textContent.trim().length > 0 &&
      commentary.length > 10 &&
      commentary.split(/[.!?]\s+/).length <= 2 &&
      !commentary.includes('Next check:') &&
      !commentary.includes('Why:'),
    `${byId('sim-commentary-label').textContent}: ${commentary}`
  );
  record(
    'optional commentary reason is short and hidden when absent',
    byId('sim-commentary-why').hidden || byId('sim-commentary-why').textContent.length < 180,
    byId('sim-commentary-why').textContent
  );
  record('bubble comparison is rendered on the bars', stageHtml().includes('comparing') && stageHtml().includes('⇄'), bubbleCompare.phase);

  Simulator.reset();
  Simulator.setAlgorithm('insertion');
  Simulator.setInput([5, 3, 8, 2]);
  const teachSteps = Simulator.generateSteps('insertion', [5, 3, 8, 2], 'ascending');
  record(
    'insertion teaching sequence sorts to 2, 3, 5, 8',
    JSON.stringify(teachSteps[teachSteps.length - 1].array) === JSON.stringify([2, 3, 5, 8])
  );
  let state = advanceUntil(Simulator, (s) => s.heldKey && s.phase.startsWith('Pick position'));
  record(
    'insertion stage separates sorted and unsorted lanes',
    stageHtml().includes('sim-insertion-board') &&
      stageHtml().includes('sim-lane-sorted') &&
      stageHtml().includes('sim-lane-unsorted') &&
      !stageHtml().includes('sim-bars'),
    stageHtml().slice(0, 180)
  );
  record(
    'insertion stage lifts the key above the lanes',
    stageHtml().includes('sim-held-tray') && stageHtml().includes('is-held'),
    stageHtml().slice(0, 180)
  );
  Simulator.nextStep();
  state = Simulator.getState();
  record(
    'insertion shift frame shows a gap and a moving record',
    stageHtml().includes('sim-hole') && stageHtml().includes('is-shifting'),
    state.phase
  );

  Simulator.reset();
  Simulator.setAlgorithm('merge');
  Simulator.setInput([5, 3, 8, 2]);
  record(
    'merge start shows the original array, dividing tree and idle workbench',
    stageHtml().includes('sim-merge-source') &&
      stageHtml().includes('Original array') &&
      stageHtml().includes('sim-merge-tree') &&
      stageHtml().includes('sim-merge-workbench is-idle'),
    stageHtml().slice(0, 220)
  );
  state = advanceUntil(Simulator, (s) => s.phase.startsWith('Split'));
  record(
    'merge stage shows a progressive parent-child split tree',
    stageHtml().includes('sim-merge-tree') &&
      stageHtml().includes('is-splitting') &&
      (stageHtml().match(/sim-merge-node /g) || []).length >= 3 &&
      !stageHtml().includes('sim-bars'),
    stageHtml().slice(0, 180)
  );
  Simulator.nextStep();
  state = advanceUntil(Simulator, (s) => s.phase.startsWith('Compare'));
  record(
    'merge stage shows side-by-side groups and first-available comparison',
    stageHtml().includes('sim-merge-workbench') &&
      stageHtml().includes('sim-merge-groups') &&
      stageHtml().includes('is-front') &&
      stageHtml().includes('is-merging'),
    state.phase
  );

  Simulator.reset();
  Simulator.setAlgorithm('timsort');
  Simulator.setInput([5, 4, 3, 8, 2]);
  let sawOppositeRun = false;
  let sawReversal = false;
  let sawRunMerge = false;
  let sawStackLabel = false;
  let guard = 0;
  state = Simulator.getState();
  while (state.currentStepIdx < state.totalSteps - 1 && guard < 200) {
    const html = stageHtml();
    if (state.phase === 'Run stack updated' && byId('sim-commentary-label').textContent.includes('Run stack')) {
      sawStackLabel = true;
    }
    if (state.phase.startsWith('Natural run') && html.includes('sim-run-board') && html.includes('dir-opposite')) {
      sawOppositeRun = true;
    }
    if (state.phase === 'Reverse opposite run' && html.includes('is-reversed')) {
      sawReversal = true;
    }
    if (state.phase === 'Merge comparison' && html.includes('sim-merge-workbench') && html.includes('is-front')) {
      sawRunMerge = true;
    }
    Simulator.nextStep();
    state = Simulator.getState();
    guard++;
  }
  record('timsort stage marks opposite runs', sawOppositeRun);
  record('timsort stage animates run reversal', sawReversal);
  record('timsort stage shows run merging', sawRunMerge);
  record('timsort run-stack frame has an accurate simple label', sawStackLabel);
  record(
    'timsort stage keeps the simplified-model label visible',
    stageHtml().includes('sim-model-note') && stageHtml().includes('not CPython') && !stageHtml().includes('sim-bars'),
    stageHtml().slice(0, 180)
  );
  Simulator.reset();
}

function sameValues(actual, expected) {
  if (actual.length !== expected.length) return false;
  const left = [...actual].sort();
  const right = [...expected].sort();
  return left.every((value, index) => value === right[index]);
}

async function testAnswerRandomization() {
  const Randomize = global.RandomizeModule;
  const Simulator = global.SimulatorModule;
  const Exercises = global.ExercisesModule;
  const Mission = global.FinalMissionModule;

  record('shared randomisation helper is loaded', Boolean(Randomize && Randomize.shuffled && Randomize.shuffleGroup));
  if (!Randomize) return;

  let seed = 0x9e3779b9 >>> 0;
  Randomize.setRandomSource(() => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    seed >>>= 0;
    return seed / 0x100000000;
  });

  const counts = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    Randomize.shuffled([0, 1, 2, 3]).forEach((value, position) => {
      counts[position][value] += 1;
    });
  }
  const flatCounts = counts.flat();
  record(
    'shuffle distributes every answer across every position',
    flatCounts.every((count) => count > 350 && count < 650),
    JSON.stringify(counts)
  );

  const firstGroupPositions = [];
  const secondGroupPositions = [];
  for (let attempt = 0; attempt < 200; attempt += 1) {
    firstGroupPositions.push(Randomize.shuffled(['A', 'B', 'C', 'D']).indexOf('A'));
    secondGroupPositions.push(Randomize.shuffled(['A', 'B', 'C', 'D']).indexOf('A'));
  }
  record(
    'separate question instances shuffle independently',
    firstGroupPositions.some((position, index) => position !== secondGroupPositions[index]),
    `first=${firstGroupPositions.slice(0, 12).join('')} second=${secondGroupPositions.slice(0, 12).join('')}`
  );

  const groups = [
    { selector: '.ex1-option', attribute: 'data-option', expected: ['A', 'B', 'C', 'D'] },
    { selector: '.ex3-option', attribute: 'data-option', expected: ['A', 'B', 'C'] },
    { selector: '.ex5-option', attribute: 'data-option', expected: ['A', 'B', 'C'] },
    { selector: '.ex6-option', attribute: 'data-option', expected: ['A', 'B', 'C'] },
    { selector: '.ex7-option', attribute: 'data-option', expected: ['A', 'B', 'C'] },
    { selector: '.ex8-option', attribute: 'data-option', expected: ['A', 'B'] },
    { selector: '.ex9-option', attribute: 'data-option', expected: ['A', 'B'] },
    { selector: '.ex10-option', attribute: 'data-option', expected: ['A', 'B'] },
    { selector: '.ex11-option', attribute: 'data-option', expected: ['A', 'B'] },
    { selector: '.mission-strat-btn', attribute: 'data-strat', expected: ['ascending', 'descending'] },
    { selector: '.mission-q1-btn', attribute: 'data-val', expected: ['A', 'B', 'C'] },
    { selector: '.mission-q2-btn', attribute: 'data-val', expected: ['STABLE', 'MUTATE'] },
    { selector: '.mission-q3-btn', attribute: 'data-val', expected: ['BUBBLE', 'TIMSORT', 'QUICKSORT'] },
  ];

  groups.forEach((group) => {
    const seenOrders = new Set();
    let keysPreserved = true;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      Randomize.shuffleGroup(group.selector);
      const values = queryAll(group.selector).map((button) => button.getAttribute(group.attribute));
      keysPreserved = keysPreserved && sameValues(values, group.expected);
      seenOrders.add(values.join('|'));
    }
    record(`${group.selector} retains every semantic answer key`, keysPreserved);
    record(`${group.selector} presents more than one order`, seenOrders.size > 1, [...seenOrders].join(' / '));
  });

  const correctByAlgorithm = {
    bubble: 'adjacent',
    insertion: 'slot',
    merge: 'copy',
    timsort: 'reverse',
  };

  Object.entries(correctByAlgorithm).forEach(([algorithm, correctValue]) => {
    const seenOrders = new Set();
    for (let attempt = 0; attempt < 25; attempt += 1) {
      Simulator.setAlgorithm(algorithm);
      seenOrders.add(Simulator.getState().understandingCheckOrder.join('|'));
    }
    record(`${algorithm} understanding check order varies by run`, seenOrders.size === 2, [...seenOrders].join(' / '));

    Simulator.setAlgorithm(algorithm);
    setFinalFrame(Simulator);
    const buttons = [byId('sim-check-option-a'), byId('sim-check-option-b')];
    const correctButton = buttons.find((button) => button.getAttribute('data-answer') === correctValue);
    const wrongButton = buttons.find((button) => button.getAttribute('data-answer') !== correctValue);
    const attemptsBefore = global.awardAttempts.length;

    if (wrongButton) clickOption(wrongButton);
    record(`${algorithm} wrong answer gives no credit`, global.awardAttempts.length === attemptsBefore);
    record(`${algorithm} wrong answer keeps the check retryable`, !Simulator.getState().understandingCheckAnswered);

    if (correctButton) clickOption(correctButton);
    record(`${algorithm} correct answer is accepted in its shuffled position`, Simulator.getState().understandingCheckAnswered);
    record(`${algorithm} correct answer awards exactly one milestone attempt`, global.awardAttempts.length === attemptsBefore + 1, `attempts delta=${global.awardAttempts.length - attemptsBefore}`);

    if (correctButton) clickOption(correctButton);
    record(`${algorithm} repeated correct click does not double-credit`, global.awardAttempts.length === attemptsBefore + 1);
  });

  Exercises.reset();
  const shuffledExerciseCorrect = queryAll('.ex1-option')
    .find((button) => button.getAttribute('data-option') === 'A');
  clickOption(shuffledExerciseCorrect);
  record('exercise scoring follows the shuffled semantic key', Exercises.getSolvedState().ex1);

  Mission.reset();
  const shuffledStrategyCorrect = queryAll('.mission-strat-btn')
    .find((button) => button.getAttribute('data-strat') === 'descending');
  clickOption(shuffledStrategyCorrect);
  record('mission strategy scoring follows the shuffled semantic key', Mission.getState().isStrategySelected);
  const shuffledDebriefCorrect = queryAll('.mission-q1-btn')
    .find((button) => button.getAttribute('data-val') === 'B');
  clickOption(shuffledDebriefCorrect);
  record('mission debrief scoring follows the shuffled semantic key', Mission.getState().isQuestion1Answered);

  Randomize.setRandomSource(null);
}

function advanceBridgeToEnd(Bridge) {
  let guard = 0;
  while (!Bridge.getState().visitedFinalStage && guard < 6) {
    Bridge.next();
    guard += 1;
  }
}

async function testTimsortBridge() {
  const Simulator = global.SimulatorModule;
  const Bridge = global.TimsortBridgeModule;
  Bridge.init();

  record('bridge module exposes its public API', Boolean(
    Bridge && typeof Bridge.init === 'function' &&
    typeof Bridge.activate === 'function' &&
    typeof Bridge.deactivate === 'function' &&
    typeof Bridge.next === 'function' &&
    typeof Bridge.previous === 'function' &&
    typeof Bridge.restart === 'function' &&
    typeof Bridge.reset === 'function' &&
    typeof Bridge.answerCheck === 'function' &&
    typeof Bridge.reshuffleCheck === 'function' &&
    typeof Bridge.isComplete === 'function'
  ));

  const tabAlgorithms = queryAll('.algo-tab-btn').map((button) => button.getAttribute('data-algo'));
  record(
    'conceptual connection sits between Merge Sort and Timsort Model',
    tabAlgorithms.join(',') === 'bubble,insertion,merge,connection,timsort,comparison',
    tabAlgorithms.join(',')
  );

  Simulator.setAlgorithm('merge');
  const attemptsBefore = global.awardAttempts.length;
  Simulator.setAlgorithm('connection');
  record('connection tab shows its own panel', byId('sim-connection-panel').style.display === 'block');
  record('connection tab hides the simulator panel', byId('sim-interactive-panel').style.display === 'none');
  record('connection tab hides the comparison panel', byId('sim-comparison-panel').style.display === 'none');
  record('connection tab hides the algorithm brief', byId('sim-algo-info-card').style.display === 'none');
  record('opening the connection awards no milestone', global.awardAttempts.length === attemptsBefore);
  record('connection preserves the active simulator algorithm', Simulator.getState().currentAlgo === 'merge');
  const connectionTabForAria = queryAll('.algo-tab-btn').find((button) => button.getAttribute('data-algo') === 'connection');
  record(
    'connection tab controls its dedicated panel',
    connectionTabForAria && connectionTabForAria.getAttribute('aria-controls') === 'sim-connection-panel' &&
      connectionTabForAria.getAttribute('aria-selected') === 'true',
    connectionTabForAria ? connectionTabForAria.getAttribute('aria-controls') : 'missing'
  );

  let state = Bridge.getState();
  record('connection starts at stage one of five', state.stageIndex === 0 && state.stageCount === 5, JSON.stringify(state));
  record('connection panel is visible', state.panelVisible === true);
  record('Previous is disabled at stage one', byId('bridge-prev-btn').disabled === true);
  record('first visualisation shows the natural-run example', byId('bridge-visual').innerHTML.includes('bridge-run-strip'));
  record('check panel starts hidden', state.checkVisible === false);
  record('progress starts at 20%', Number(byId('bridge-progress-bar').getAttribute('aria-valuenow')) === 20);

  const visualKinds = new Set();
  const stageLabels = new Set([state.stageLabel]);
  const progressValues = [Number(byId('bridge-progress-bar').getAttribute('aria-valuenow'))];
  const visualKindClasses = [
    'bridge-run-strip', 'bridge-flow', 'bridge-merge-stage',
    'bridge-timsort-stage', 'bridge-recap-grid',
  ];
  if (visualKindClasses.some((name) => byId('bridge-visual').innerHTML.includes(name))) {
    visualKinds.add(visualKindClasses.find((name) => byId('bridge-visual').innerHTML.includes(name)));
  }
  while (!Bridge.getState().visitedFinalStage) {
    Bridge.next();
    state = Bridge.getState();
    stageLabels.add(state.stageLabel);
    const html = byId('bridge-visual').innerHTML;
    const kind = visualKindClasses.find((name) => html.includes(name));
    if (kind) visualKinds.add(kind);
    progressValues.push(Number(byId('bridge-progress-bar').getAttribute('aria-valuenow')));
  }

  record('connection reaches its final stage', state.stageIndex === 4 && state.visitedFinalStage, JSON.stringify(state));
  record('connection has five distinct stages', stageLabels.size === 5, `labels=${stageLabels.size}`);
  record('connection renders all five idea visualisations', visualKinds.size === 5, [...visualKinds].join(','));
  record('progress reaches 100%', progressValues[progressValues.length - 1] === 100, progressValues.join(','));
  record('progress never decreases', progressValues.every((value, index) => index === 0 || value >= progressValues[index - 1]), progressValues.join(','));
  record('check panel becomes visible at stage five', Bridge.getState().checkVisible === true);
  record('final stage alone awards no milestone', global.awardAttempts.length === attemptsBefore);

  Bridge.previous();
  record('Previous steps back one stage', Bridge.getState().stageIndex === 3, JSON.stringify(Bridge.getState()));
  Bridge.next();
  record('Next returns to the final stage', Bridge.getState().stageIndex === 4);

  await clickAsync(byId('bridge-restart-btn'));
  state = Bridge.getState();
  record('Restart returns to stage one', state.stageIndex === 0 && !state.visitedFinalStage, JSON.stringify(state));
  record('Restart hides the check panel', state.checkVisible === false);
  record('Restart awards no milestone', global.awardAttempts.length === attemptsBefore);

  const earlyAnswer = Bridge.answerCheck('conceptual');
  record('knowledge check is gated until stage five', earlyAnswer.correct === false);
  record('early correct-key answer awards no milestone', global.awardAttempts.length === attemptsBefore);

  Simulator.setAlgorithm('connection');
  const orders = new Set();
  for (let attempt = 0; attempt < 24; attempt += 1) {
    orders.add(Bridge.reshuffleCheck().join('|'));
  }
  const optionButtons = () => byId('bridge-check-options').children.slice();
  const optionKeys = optionButtons().map((button) => button.getAttribute('data-answer'));
  record('check keeps all four semantic keys after reshuffles', optionKeys.length === 4 && new Set(optionKeys).size === 4, optionKeys.join(','));
  record('answer positions are randomised', orders.size > 1, `orders=${orders.size}`);

  advanceBridgeToEnd(Bridge);
  const wrongButton = optionButtons().find((button) => button.getAttribute('data-answer') === 'halves');
  record('wrong-answer option is rendered', Boolean(wrongButton));
  if (wrongButton) await clickAsync(wrongButton);
  record('wrong answer is rejected', Bridge.getState().checkAnsweredCorrectly === false);
  record('wrong answer awards no milestone', global.awardAttempts.length === attemptsBefore);
  record('wrong answer explains the misconception', byId('bridge-check-feedback').textContent.includes('halving'), byId('bridge-check-feedback').textContent);
  record('options remain retryable after a wrong answer', optionButtons().every((button) => button.disabled === false));

  const correctButton = optionButtons().find((button) => button.getAttribute('data-answer') === 'conceptual');
  record('correct-answer option is rendered', Boolean(correctButton));
  if (correctButton) await clickAsync(correctButton);
  state = Bridge.getState();
  record('correct answer is accepted in its shuffled position', state.checkAnsweredCorrectly === true);
  record('correct answer awards exactly one milestone', global.awardAttempts.length === attemptsBefore + 1, `delta=${global.awardAttempts.length - attemptsBefore}`);
  record('completion badge becomes visible', state.badgeVisible === true);
  record('correct feedback mentions the adaptive strategy', byId('bridge-check-feedback').textContent.includes('adaptive'));
  record('correct answer disables the options', optionButtons().every((button) => button.disabled === true));
  record('continue control appears after success', state.continueVisible === true);
  if (correctButton) await clickAsync(correctButton);
  record('repeated correct answer does not double-credit', global.awardAttempts.length === attemptsBefore + 1);

  await clickAsync(byId('bridge-continue-btn'));
  record('continue reveals the original Timsort simulator', byId('sim-interactive-panel').style.display === 'block');
  record('continue hides the connection panel', byId('sim-connection-panel').style.display === 'none');
  record('continue restores the algorithm brief', byId('sim-algo-info-card').style.display === 'block');
  record('Timsort simulator state remains valid', Simulator.getState().currentAlgo === 'timsort' && Simulator.getState().totalSteps > 0);
  record('continue awards no extra milestone', global.awardAttempts.length === attemptsBefore + 1);

  Simulator.setAlgorithm('connection');
  record('revisiting the connection shows its panel again', byId('sim-connection-panel').style.display === 'block');
  record('revisiting the connection preserves completion state', Bridge.isComplete() === true && Bridge.getState().badgeVisible === true);
  record('revisiting the connection awards no extra milestone', global.awardAttempts.length === attemptsBefore + 1);

  const tabChecks = [
    ['bubble', 'sim-interactive-panel'],
    ['insertion', 'sim-interactive-panel'],
    ['merge', 'sim-interactive-panel'],
    ['connection', 'sim-connection-panel'],
    ['comparison', 'sim-comparison-panel'],
    ['timsort', 'sim-interactive-panel'],
  ];
  tabChecks.forEach(([algo, visiblePanel]) => {
    Simulator.setAlgorithm(algo);
    const tab = queryAll('.algo-tab-btn').find((button) => button.getAttribute('data-algo') === algo);
    record(`${algo} tab is active and aria-selected`, Boolean(tab) && tab.classList.contains('active') && tab.getAttribute('aria-selected') === 'true');
    record(`${algo} tab shows the expected panel`, byId(visiblePanel).style.display === 'block');
  });

  Simulator.setAlgorithm('merge');
  const mergeTab = queryAll('.algo-tab-btn').find((button) => button.getAttribute('data-algo') === 'merge');
  mergeTab.dispatchEvent({ type: 'keydown', key: 'ArrowRight', preventDefault: () => {} });
  record('keyboard arrow moves Merge to the connection tab', byId('sim-connection-panel').style.display === 'block' && queryAll('.algo-tab-btn').find((button) => button.getAttribute('data-algo') === 'connection').classList.contains('active'));
  const connectionTab = queryAll('.algo-tab-btn').find((button) => button.getAttribute('data-algo') === 'connection');
  connectionTab.dispatchEvent({ type: 'keydown', key: 'ArrowRight', preventDefault: () => {} });
  record('keyboard arrow moves the connection tab to Timsort', byId('sim-interactive-panel').style.display === 'block' && Simulator.getState().currentAlgo === 'timsort');
}

async function main() {
  buildDom();
  loadModules();

  global.SimulatorModule.init();
  testStep1Groundwork();
  testTeachingPanels();
  testAlgorithmVisualSurfaces();
  testStep2Interactivity();
  await testSimulator();
  await testTimsortBridge();
  await testBenchmarkFailureStates();
  await testExercises();
  await testPythonLearn();
  await testFinalMission();
  await testAnswerRandomization();

  const failedResults = results.filter((result) => !result.ok);
  console.log(JSON.stringify({
    total: results.length,
    passed: results.length - failedResults.length,
    failed: failedResults.length,
    failures: failedResults,
  }, null, 2));

  if (failures > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
