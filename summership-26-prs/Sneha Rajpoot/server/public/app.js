const LEARNER_KEY = 'sneha-pybe-adaptive-learner';
const AGE_GROUP_KEY = 'sneha-pybe-age-group';
const AGE_GROUPS = ['8-11', '12-15', '16+'];
const learnerId = getLearnerId();
let activeScenario = null;
let nextScenario = null;
let learnerProfile = null;
let learnerScorePercent = 0;
const hasStoredAgeGroup = AGE_GROUPS.includes(localStorage.getItem(AGE_GROUP_KEY));
let selectedAgeGroup = hasStoredAgeGroup ? localStorage.getItem(AGE_GROUP_KEY) : '12-15';

const elements = {
  title: document.querySelector('#scenario-title'),
  narrative: document.querySelector('#scenario-narrative'),
  context: document.querySelector('#scenario-context'),
  prompt: document.querySelector('#scenario-prompt'),
  stage: document.querySelector('#scenario-stage'),
  structuredness: document.querySelector('#scenario-structuredness'),
  constraints: document.querySelector('#scenario-constraints'),
  attemptCount: document.querySelector('#attempt-count'),
  progressLabel: document.querySelector('#progress-label'),
  progressFill: document.querySelector('#progress-fill'),
  form: document.querySelector('#attempt-form'),
  reasoning: document.querySelector('#reasoning'),
  submit: document.querySelector('#submit-button'),
  error: document.querySelector('#error-message'),
  outcome: document.querySelector('#outcome-panel'),
  outcomeTitle: document.querySelector('#outcome-title'),
  outcomeDetail: document.querySelector('#outcome-detail'),
  nextTitle: document.querySelector('#next-title'),
  nextReason: document.querySelector('#next-reason'),
  continue: document.querySelector('#continue-button'),
  boundaryNote: document.querySelector('#boundary-note'),
  teachingPoints: document.querySelector('#teaching-points'),
  reflectionPrompt: document.querySelector('#reflection-prompt'),
  learningPoints: document.querySelector('#learning-points'),
  scoreValue: document.querySelector('#score-value'),
  ageGroup: document.querySelector('#age-group'),
  aiStatus: document.querySelector('#ai-status'),
};

elements.ageGroup.value = selectedAgeGroup;

function updateScoreDisplay() {
  const totalPoints = Number(learnerProfile?.learningPoints || 0);
  elements.scoreValue.textContent = `${learnerScorePercent}%`;
  elements.learningPoints.textContent = `${totalPoints} learning points`;
}

function getLearnerId() {
  let id = localStorage.getItem(LEARNER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LEARNER_KEY, id);
  }
  return id;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

async function apiStream(path, options, onEvent) {
  const response = await fetch(path, {
    ...options,
    headers: { Accept: 'application/x-ndjson', 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  if (!response.body) throw new Error('Live mentor responses are not supported by this browser.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = null;
  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line);
      if (event.type === 'error') throw new Error(event.error);
      if (event.type === 'complete') result = event.result;
      onEvent(event);
    }
    if (done) break;
  }
  if (buffer.trim()) {
    const event = JSON.parse(buffer);
    if (event.type === 'error') throw new Error(event.error);
    if (event.type === 'complete') result = event.result;
    onEvent(event);
  }
  if (!result) throw new Error('The learning response ended before the next story was ready.');
  return result;
}

function setText(element, value) {
  element.textContent = value || '';
}

function renderScenario(scenario) {
  activeScenario = scenario;
  elements.outcome.hidden = true;
  elements.form.hidden = false;
  elements.reasoning.value = '';
  elements.submit.disabled = false;
  elements.structuredness.disabled = false;
  elements.ageGroup.disabled = false;
  if (AGE_GROUPS.includes(scenario.ageGroup)) {
    selectedAgeGroup = scenario.ageGroup;
    elements.ageGroup.value = selectedAgeGroup;
    localStorage.setItem(AGE_GROUP_KEY, selectedAgeGroup);
  }
  elements.stage.textContent = scenario.difficulty.toUpperCase();
  setText(elements.title, scenario.title);
  setText(elements.narrative, scenario.narrative);
  setText(elements.context, scenario.context);
  setText(elements.prompt, scenario.prompt);
  const storyMode = scenario.storyMode || (scenario.difficulty === 'Open choice' || scenario.targetStructuredness >= 0.5 ? 'open' : 'guided');
  elements.structuredness.dataset.mode = storyMode;
  elements.structuredness.setAttribute('aria-pressed', String(storyMode === 'open'));
  setText(elements.structuredness, storyMode === 'open' ? 'OPEN-ENDED STORY' : 'GUIDED STORY');
  setText(elements.attemptCount, String((learnerProfile?.attempts || 0) + 1).padStart(2, '0'));
  setText(elements.progressLabel, learnerProfile?.attempts ? 'Your path has shifted with you' : 'Begin with a first story');
  elements.progressFill.style.width = `${Math.min(22 + (learnerProfile?.attempts || 0) * 13, 92)}%`;
  elements.constraints.replaceChildren();
  for (const constraint of scenario.constraints || []) {
    const chip = document.createElement('span');
    chip.className = 'objective-chip';
    chip.textContent = constraint;
    elements.constraints.append(chip);
  }
  elements.boundaryNote.textContent = 'Your stories adjust gradually from your attempts. This is a guide for choosing challenges, not a score of you.';
  updateScoreDisplay();
}

async function replaceStoryPreferences({ mode, ageGroup }) {
  if (!activeScenario) return;
  elements.error.hidden = true;
  elements.structuredness.disabled = true;
  elements.ageGroup.disabled = true;
  elements.submit.disabled = true;
  setText(elements.progressLabel, `Preparing a story for ages ${ageGroup}...`);
  setText(elements.structuredness, 'CREATING STORY...');
  try {
    const selected = await api('/api/learning/mode', {
      method: 'POST',
      body: JSON.stringify({ learnerId, scenarioId: activeScenario.id, mode, ageGroup }),
    });
    learnerProfile = selected.profile;
    if (selected.fallbackReason) {
      setText(elements.aiStatus, /rate or quota limit/i.test(selected.fallbackReason) ? 'GEMINI RATE LIMITED' : 'LOCAL STORY ACTIVE');
    }
    selectedAgeGroup = ageGroup;
    localStorage.setItem(AGE_GROUP_KEY, ageGroup);
    renderScenario(selected.scenario);
  } catch (error) {
    elements.structuredness.disabled = false;
    elements.ageGroup.disabled = false;
    elements.ageGroup.value = selectedAgeGroup;
    elements.submit.disabled = false;
    setText(elements.structuredness, elements.structuredness.dataset.mode === 'open' ? 'OPEN-ENDED STORY' : 'GUIDED STORY');
    elements.error.textContent = error.message;
    elements.error.hidden = false;
    setText(elements.progressLabel, learnerProfile?.attempts ? 'Your path has shifted with you' : 'Begin with a first story');
  }
}

elements.structuredness.addEventListener('click', async () => {
  if (!activeScenario) return;
  if (elements.reasoning.value.trim() && !window.confirm('Switching stories will clear the reasoning you have typed. Continue?')) return;
  const nextMode = elements.structuredness.dataset.mode === 'open' ? 'guided' : 'open';
  await replaceStoryPreferences({ mode: nextMode, ageGroup: selectedAgeGroup });
});

elements.ageGroup.addEventListener('change', async () => {
  if (!AGE_GROUPS.includes(elements.ageGroup.value) || !activeScenario) return;
  if (elements.reasoning.value.trim() && !window.confirm('Changing age groups will create a new story and clear the reasoning you have typed. Continue?')) {
    elements.ageGroup.value = selectedAgeGroup;
    return;
  }
  const nextAgeGroup = elements.ageGroup.value;
  const storyMode = elements.structuredness.dataset.mode || 'guided';
  await replaceStoryPreferences({ mode: storyMode, ageGroup: nextAgeGroup });
});

function outcomeCopy(outcome) {
  if (outcome === 'success') return ['Your approach is ready for a stretch.', 'You made your reasoning visible. Your next story moves a little further into open-ended choices.'];
  if (outcome === 'incomplete') return ['Your thinking is still yours to add.', 'No outcome was recorded because no reasoning was submitted. Your challenge boundary stays the same.'];
  return ['A useful place to keep exploring.', 'This attempt did not move the challenge boundary upward. Your next story stays close to a manageable level.'];
}

function renderMentorReview(review) {
  const [title, detail] = outcomeCopy(review?.outcome);
  const usedGemini = review?.provider === 'gemini';
  document.querySelector('#outcome-label').textContent = review?.stage === 'quick'
    ? 'QUICK GUIDANCE - GEMINI IS REVIEWING'
    : usedGemini
      ? 'GEMINI MENTOR RESPONSE'
      : 'LOCAL COACH RESPONSE';
  setText(elements.outcomeTitle, title);
  const fallbackNote = !usedGemini && review?.fallbackReason ? ` ${review.fallbackReason}` : '';
  setText(elements.outcomeDetail, `${review?.feedback || detail}${fallbackNote}`);
  const rateLimited = /rate or quota limit/i.test(review?.fallbackReason || '');
  setText(elements.aiStatus, review?.stage === 'quick'
    ? 'GEMINI REVIEWING'
    : usedGemini
      ? 'GEMINI ANSWERED'
      : rateLimited
        ? 'GEMINI RATE LIMITED'
        : 'LOCAL COACH ACTIVE');
  elements.teachingPoints.replaceChildren();
  for (const point of review?.teachingPoints || []) {
    const item = document.createElement('li');
    item.textContent = point;
    elements.teachingPoints.append(item);
  }
  setText(elements.reflectionPrompt, review?.reflectionPrompt || 'What would you try next?');
  elements.outcome.hidden = false;
}

async function start() {
  try {
    const health = await api('/api/health');
    setText(elements.aiStatus, health.geminiConfigured ? `GEMINI KEY LOADED (${health.model})` : 'LOCAL COACH (NO KEY)');
    const progress = await api(`/api/learning/progress?learnerId=${encodeURIComponent(learnerId)}`);
    learnerProfile = progress.profile;
    learnerScorePercent = progress.scorePercent || 0;
    if (!hasStoredAgeGroup && AGE_GROUPS.includes(learnerProfile.ageGroup)) {
      selectedAgeGroup = learnerProfile.ageGroup;
      elements.ageGroup.value = selectedAgeGroup;
    }
    const selected = await api(`/api/learning/next?learnerId=${encodeURIComponent(learnerId)}`);
    if (!selected.scenario) throw new Error('No scenario is ready yet. Please try again shortly.');
    renderScenario(selected.scenario);
    if (selected.scenario.ageGroup !== selectedAgeGroup) {
      const mode = selected.scenario.storyMode || (selected.scenario.difficulty === 'Open choice' ? 'open' : 'guided');
      await replaceStoryPreferences({ mode, ageGroup: selectedAgeGroup });
    }
  } catch (error) {
    setText(elements.title, 'Your next story is not ready yet');
    setText(elements.narrative, error.message);
    elements.form.hidden = true;
  }
}

elements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!activeScenario || !elements.reasoning.value.trim()) return;
  elements.error.hidden = true;
  elements.submit.disabled = true;
  elements.structuredness.disabled = true;
  elements.submit.textContent = 'Thinking it through...';

  try {
    const result = await apiStream('/api/learning/attempt', {
      method: 'POST',
      body: JSON.stringify({ learnerId, scenarioId: activeScenario.id, reasoning: elements.reasoning.value, ageGroup: selectedAgeGroup }),
    }, (event) => {
      if (event.type !== 'mentor') return;
      renderMentorReview({ ...event.mentorReview, outcome: event.outcome, stage: event.stage });
      setText(elements.nextTitle, 'Writing your next story...');
      setText(elements.nextReason, 'Your mentor response is ready. The next story is being prepared.');
      elements.continue.disabled = true;
      elements.continue.textContent = 'Preparing next story...';
    });
    learnerProfile = result.profile;
    learnerScorePercent = result.scorePercent || 0;
    nextScenario = result.next.scenario;
    renderMentorReview({ ...result.mentorReview, outcome: result.session.outcome });
    if (nextScenario) {
      setText(elements.nextTitle, nextScenario.title);
      const storyProvider = nextScenario.generatedBy === 'gemini' ? 'Gemini wrote a fresh story' : 'A fresh local story is ready';
      setText(elements.nextReason, `${storyProvider} to meet your next step.${result.storyFallbackReason ? ` ${result.storyFallbackReason}` : ''}`);
      if (result.storyFallbackReason && /rate or quota limit/i.test(result.storyFallbackReason)) setText(elements.aiStatus, 'GEMINI RATE LIMITED');
      elements.continue.disabled = false;
      elements.continue.textContent = 'Continue to next story →';
    } else {
      setText(elements.nextTitle, 'Your path is ready for another story');
      setText(elements.nextReason, 'We could not find another available story just now.');
      elements.continue.disabled = true;
    }
    elements.form.hidden = true;
    setText(elements.attemptCount, String(learnerProfile.attempts).padStart(2, '0'));
    elements.progressFill.style.width = `${Math.min(22 + learnerProfile.attempts * 13, 92)}%`;
    elements.boundaryNote.textContent = 'Your stories adjust gradually from your attempts. This is a guide for choosing challenges, not a score of you.';
    updateScoreDisplay();
  } catch (error) {
    elements.error.textContent = error.message;
    elements.error.hidden = false;
  } finally {
    elements.submit.disabled = false;
    elements.structuredness.disabled = false;
    elements.submit.innerHTML = 'Share my thinking <span aria-hidden="true">↗</span>';
  }
});

elements.continue.addEventListener('click', () => {
  if (nextScenario) renderScenario(nextScenario);
});

start();