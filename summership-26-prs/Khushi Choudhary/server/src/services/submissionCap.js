// Keeps the review queue sane by capping how many drafts one learner (by
// email) can submit in a rolling 24 hours. Deliberately checked at /submit
// time, not /generate time — experimenting is free, only what actually
// lands in the mentor's queue counts against the cap.

const draftStore = require('./draftStore');

const WINDOW_MS = 24 * 60 * 60 * 1000;

// Read lazily rather than once at module load — this module can end up
// required before dotenv has populated process.env depending on require
// order elsewhere, and re-reading per call costs nothing but avoids that
// whole class of bug.
function currentCap() {
  return Number(process.env.LEARNER_SUBMISSION_CAP) || 3;
}

async function countRecentSubmissions(email) {
  const drafts = await draftStore.listDrafts({});
  const cutoff = Date.now() - WINDOW_MS;
  return drafts.filter((draft) => (
    draft.author?.role === 'learner' &&
    draft.author?.email?.toLowerCase() === email.toLowerCase() &&
    new Date(draft.createdAt).getTime() >= cutoff
  )).length;
}

async function checkSubmissionCap(email) {
  const cap = currentCap();
  const count = await countRecentSubmissions(email);
  return { allowed: count < cap, count, cap };
}

module.exports = { checkSubmissionCap };
