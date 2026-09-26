const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const storiesPath = path.join(__dirname, 'stories.json');
const progressPath = path.join(__dirname, 'storyProgress.json');

async function readStories() {
  const raw = await fs.readFile(storiesPath, 'utf8');
  const stories = JSON.parse(raw);
  return stories.sort((a, b) => (a.order || 0) - (b.order || 0));
}

async function readProgress() {
  try {
    const raw = await fs.readFile(progressPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { attempts: [] };
  }
}

async function writeProgress(data) {
  await fs.writeFile(progressPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/** Folk tales carry no `collection` field; real-world stories carry "real-world". */
function collectionOf(story) {
  return story.collection || 'folk';
}

/**
 * The order a question's options are shown in, as a list of stored indexes.
 * Authors write the correct option first, so showing them as stored would make the
 * answer the top option every time. Shuffled with a seed taken from the question id, so
 * the order is the same on every visit and the case-study markdown can reproduce it.
 */
function optionOrder(questionId, count) {
  let seed = 2166136261;
  for (const ch of questionId) {
    seed = Math.imul(seed ^ ch.codePointAt(0), 16777619);
  }
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Story metadata only — no panels, no answers. Used by the library screen. */
function toSummary(story) {
  return {
    storyId: story.storyId,
    title: story.title,
    source: story.source,
    collection: collectionOf(story),
    concept: story.concept,
    conceptLabel: story.conceptLabel,
    difficulty: story.difficulty,
    order: story.order,
    blurb: story.blurb,
    cover: story.panels?.[0]?.image || null,
    panelCount: story.panels?.length || 0,
    quizCount: story.quiz?.length || 0
  };
}

/** One collection at a time. Defaults to folk, so existing callers see what they always did. */
async function listStories(collection = 'folk') {
  const stories = await readStories();
  return stories.filter((story) => collectionOf(story) === collection).map(toSummary);
}

/**
 * Full story for the reader. `correct` and `why` are stripped from quiz options
 * so the answer key never reaches the browser before the learner answers.
 */
async function getStory(storyId) {
  const stories = await readStories();
  const story = stories.find((item) => item.storyId === storyId);
  if (!story) return null;

  return {
    ...story,
    quiz: story.quiz.map((question) => ({
      id: question.id,
      type: question.type,
      question: question.question,
      // `index` stays the stored position, which is what grading compares against.
      options: optionOrder(question.id, question.options.length).map((index) => ({
        index,
        text: question.options[index].text
      }))
    }))
  };
}

/** Grades one submitted quiz and records the attempt. */
async function gradeAttempt(storyId, { learnerName = 'Guest learner', answers = {}, swappedFrom, retry } = {}) {
  const stories = await readStories();
  const story = stories.find((item) => item.storyId === storyId);
  if (!story) return null;

  const results = story.quiz.map((question) => {
    const chosen = answers[question.id];
    const correctIndex = question.options.findIndex((option) => option.correct);
    const isAnswered = Number.isInteger(chosen);
    return {
      questionId: question.id,
      type: question.type,
      chosen: isAnswered ? chosen : null,
      correctIndex,
      isCorrect: isAnswered && chosen === correctIndex,
      why: isAnswered ? question.options[chosen]?.why || '' : '',
      correctWhy: question.options[correctIndex]?.why || ''
    };
  });

  const score = results.filter((result) => result.isCorrect).length;
  const total = results.length;
  const transferred = results.some((result) => result.type === 'transfer' && result.isCorrect);

  const attempt = {
    _id: crypto.randomUUID(),
    storyId,
    concept: story.concept,
    learnerName,
    score,
    total,
    transferred,
    results,
    createdAt: new Date().toISOString()
  };

  // Set only when the learner reached this story through a sibling's swap link.
  // Absent — not null — on a normal open, so "was this a swap?" reads as a key test.
  if (typeof swappedFrom === 'string' && swappedFrom) attempt.swappedFrom = swappedFrom;

  // Set only when the learner pressed "Try again" after seeing the graded answers. Absent
  // on a first try. A retry measures recall of the correction, not the misconception.
  if (retry === true) attempt.retry = true;

  const progress = await readProgress();
  progress.attempts.push(attempt);
  await writeProgress(progress);

  return attempt;
}

/**
 * Per-story and per-concept rollup for the library screen and dashboard, for one
 * collection — the two tabs share concept keys, so a combined tally would double-count.
 */
async function summariseProgress(collection = 'folk') {
  const [allStories, progress] = await Promise.all([readStories(), readProgress()]);
  const stories = allStories.filter((story) => collectionOf(story) === collection);
  const inCollection = new Set(stories.map((story) => story.storyId));
  const attempts = progress.attempts.filter((attempt) => inCollection.has(attempt.storyId));

  const byStory = {};
  for (const attempt of attempts) {
    const current = byStory[attempt.storyId];
    if (!current || attempt.score > current.bestScore) {
      byStory[attempt.storyId] = {
        storyId: attempt.storyId,
        bestScore: attempt.score,
        total: attempt.total,
        transferred: attempt.transferred,
        lastAttemptAt: attempt.createdAt
      };
    }
  }

  // A concept counts as explored if any of its tellings has an attempt, and as
  // mastered if any one of them was answered in full — two tellings of one idea
  // must not inflate either denominator.
  const conceptOf = {};
  for (const story of stories) conceptOf[story.storyId] = story.concept;

  const conceptsAttempted = new Set();
  const conceptsMastered = new Set();
  for (const record of Object.values(byStory)) {
    const concept = conceptOf[record.storyId];
    if (!concept) continue;
    conceptsAttempted.add(concept);
    if (record.bestScore === record.total) conceptsMastered.add(concept);
  }

  return {
    storiesTotal: stories.length,
    storiesAttempted: Object.keys(byStory).length,
    storiesMastered: Object.values(byStory).filter((item) => item.bestScore === item.total).length,
    conceptsTotal: new Set(stories.map((story) => story.concept)).size,
    conceptsAttempted: conceptsAttempted.size,
    conceptsMastered: conceptsMastered.size,
    attempts: attempts.length,
    byStory
  };
}

/**
 * Which wrong options learners pick, per question, from first tries only — a retry comes
 * after the answers were shown. Kept off summariseProgress on purpose: the library loads
 * that on every visit, and a list of popular wrong answers is a hint.
 *
 * Correctness is judged against the current content, so an attempt whose question or
 * option has since been removed is skipped rather than miscounted.
 */
async function summariseMisconceptions() {
  const [stories, progress] = await Promise.all([readStories(), readProgress()]);

  const questionsByKey = new Map();
  for (const story of stories) {
    for (const question of story.quiz) {
      questionsByKey.set(`${story.storyId}/${question.id}`, { story, question });
    }
  }

  const tallies = new Map();
  let attemptsCounted = 0;
  let retriesExcluded = 0;

  for (const attempt of progress.attempts) {
    if (attempt.retry) {
      retriesExcluded += 1;
      continue;
    }
    attemptsCounted += 1;
    for (const result of attempt.results || []) {
      if (!Number.isInteger(result.chosen)) continue;
      const key = `${attempt.storyId}/${result.questionId}`;
      const entry = questionsByKey.get(key);
      if (!entry || !entry.question.options[result.chosen]) continue;

      let tally = tallies.get(key);
      if (!tally) {
        tally = { answered: 0, picks: new Map() };
        tallies.set(key, tally);
      }
      tally.answered += 1;
      tally.picks.set(result.chosen, (tally.picks.get(result.chosen) || 0) + 1);
    }
  }

  const byType = {};
  const questions = [];
  for (const [key, tally] of tallies) {
    const { story, question } = questionsByKey.get(key);
    const correctIndex = question.options.findIndex((option) => option.correct);
    const correct = tally.picks.get(correctIndex) || 0;
    const wrong = [...tally.picks]
      .filter(([index]) => index !== correctIndex)
      .map(([index, count]) => ({
        index,
        count,
        text: question.options[index].text,
        why: question.options[index].why || ''
      }))
      .sort((a, b) => b.count - a.count || a.index - b.index);

    if (!byType[question.type]) byType[question.type] = { answered: 0, wrong: 0 };
    byType[question.type].answered += tally.answered;
    byType[question.type].wrong += tally.answered - correct;

    questions.push({
      storyId: story.storyId,
      title: story.title,
      collection: collectionOf(story),
      concept: story.concept,
      questionId: question.id,
      type: question.type,
      question: question.question,
      answered: tally.answered,
      correct,
      wrong
    });
  }

  // Most-missed first: the top of the list is where the content most needs attention.
  questions.sort(
    (a, b) =>
      b.answered - b.correct - (a.answered - a.correct) ||
      a.storyId.localeCompare(b.storyId) ||
      a.questionId.localeCompare(b.questionId)
  );

  return { attemptsCounted, retriesExcluded, byType, questions };
}

module.exports = {
  listStories,
  getStory,
  gradeAttempt,
  summariseProgress,
  summariseMisconceptions,
  optionOrder
};
