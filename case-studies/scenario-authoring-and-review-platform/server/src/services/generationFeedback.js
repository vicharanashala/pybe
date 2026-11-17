// Per-concept accumulated signal from mentor review outcomes, used to make
// the NEXT generation for the same concept more likely to land clean.
//
// This is not model training — nothing here changes any model's weights,
// and it can't, since generation goes through third-party provider APIs
// (see services/providers/) rather than a model this codebase controls.
// What this is instead is a feedback-conditioned prompting loop: every
// review outcome becomes a small piece of text re-injected into the next
// generation's prompt —
//
//   - published unedited  -> the case study becomes a "here's an approved
//     example, match this" exemplar
//   - published after a mentor edit -> the before/after of whatever the
//     mentor changed becomes a "write it like the after version" pair
//   - rejected with a note -> the note becomes an explicit "don't repeat
//     this" line
//
// scoped per concept (a lesson from "decorators" only affects future
// "decorators" generations, never "list comprehension" — see the caller in
// scenarioPipeline.js, which loads this by the concept it's about to
// generate), fully automatic (no mentor curation step — every approval and
// every noted rejection feeds back in immediately, per the explicit choice
// to start this way rather than gating it behind manual review).

const fs = require('fs/promises');
const path = require('path');

const knowledgePath = path.join(__dirname, '..', 'data', 'generationKnowledge.json');

// Keeps prompts from growing without bound as more concepts accumulate
// history — only the most recent, presumably most relevant, signals ride
// along on each generation.
const MAX_EXEMPLARS_PER_CONCEPT = 2;
const MAX_EDIT_LESSONS_PER_CONCEPT = 4;
const MAX_AVOID_PATTERNS_PER_CONCEPT = 3;
const SNIPPET_LENGTH = 240;

// The only fields a mentor's edit form actually exposes (see ReviewPanel's
// edit form in client/src/mentor/MentorApp.jsx) — diffing is scoped to
// exactly these so a lesson always describes a real, intentional edit, not
// noise from some other part of the object.
const DIFFABLE_FIELDS = [
  { path: ['scenario'], label: 'scenario' },
  { path: ['stage4', 'conceptReveal'], label: 'stage4.conceptReveal' },
  { path: ['scaleReflection'], label: 'scaleReflection' }
];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function truncate(text, max = SNIPPET_LENGTH) {
  if (typeof text !== 'string') return text;
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function getAt(obj, pathParts) {
  return pathParts.reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

async function ensureFile() {
  try {
    await fs.access(knowledgePath);
  } catch {
    await writeAll({ concepts: {} });
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(knowledgePath, 'utf8');
  return JSON.parse(raw);
}

async function writeAll(data) {
  await fs.mkdir(path.dirname(knowledgePath), { recursive: true });
  await fs.writeFile(knowledgePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function getConceptBucket(data, concept) {
  const key = slugify(concept);
  if (!data.concepts[key]) {
    data.concepts[key] = { exemplars: [], editLessons: [], avoidPatterns: [] };
  }
  return data.concepts[key];
}

/**
 * Call right after a draft is approved and published. Always records the
 * published case study as an exemplar; additionally records an edit lesson
 * for every diffable field a mentor changed before approving, if there's
 * an originalContent snapshot to diff against (drafts created before this
 * feature existed won't have one — recordApproval just skips that part
 * rather than failing).
 */
async function recordApproval({ concept, originalContent, finalContent, topicId, levelId, caseStudyId, levelTitle }) {
  if (!concept || !finalContent) return;
  const data = await readAll();
  const bucket = getConceptBucket(data, concept);

  if (originalContent) {
    DIFFABLE_FIELDS.forEach(({ path: fieldPath, label }) => {
      const before = getAt(originalContent, fieldPath);
      const after = getAt(finalContent, fieldPath);
      if (typeof before === 'string' && typeof after === 'string' && before.trim() !== after.trim()) {
        bucket.editLessons.push({
          field: label,
          before: truncate(before),
          after: truncate(after),
          capturedAt: new Date().toISOString()
        });
      }
    });
    bucket.editLessons = bucket.editLessons.slice(-MAX_EDIT_LESSONS_PER_CONCEPT);
  }

  bucket.exemplars.push({ topicId, levelId, caseStudyId, levelTitle });
  bucket.exemplars = bucket.exemplars.slice(-MAX_EXEMPLARS_PER_CONCEPT);

  await writeAll(data);
}

/**
 * Call when a draft is rejected. A rejection with no note carries no
 * actionable lesson (there's nothing to describe as "don't repeat this"),
 * so it's silently skipped rather than stored as an empty entry.
 */
async function recordRejection({ concept, note, levelTitle }) {
  if (!concept || !note || !note.trim()) return;
  const data = await readAll();
  const bucket = getConceptBucket(data, concept);
  bucket.avoidPatterns.push({ note: truncate(note), levelTitle: levelTitle || null, capturedAt: new Date().toISOString() });
  bucket.avoidPatterns = bucket.avoidPatterns.slice(-MAX_AVOID_PATTERNS_PER_CONCEPT);
  await writeAll(data);
}

/**
 * Loads everything known for a concept and formats it as one block of
 * prompt text, or '' if there's nothing yet — callers can always safely
 * append the result to a message without a null check. Exemplar text is
 * pulled live from the actual published case study (scenarioContentStore's
 * readAll(), matched by the stored topicId/levelId/caseStudyId) rather than
 * duplicating scenario text into this file, so there's exactly one place
 * published content lives.
 */
async function getFeedbackContext(concept) {
  if (!concept) return '';
  const data = await readAll();
  const key = slugify(concept);
  const bucket = data.concepts[key];
  if (!bucket) return '';

  const lines = [];

  if (bucket.exemplars.length) {
    // eslint-disable-next-line global-require
    const contentStore = require('./scenarioContentStore'); // required lazily to avoid a require-time circular dependency with contentStore
    const published = await contentStore.readAll();
    const topic = published.topics.find((t) => t.topicId === key);
    if (topic) {
      bucket.exemplars.forEach(({ levelId, caseStudyId }) => {
        const level = topic.levels.find((l) => l.levelId === levelId);
        const caseStudy = level?.caseStudies.find((c) => c.id === caseStudyId);
        if (level && caseStudy) {
          lines.push(`- A mentor already approved "${level.title}" for this concept, opening: "${truncate(caseStudy.scenario, 200)}" — match this voice and level of specificity, but invent a different character and situation.`);
        }
      });
    }
  }

  bucket.editLessons.forEach((lesson) => {
    lines.push(`- A mentor rewrote ${lesson.field} from "${lesson.before}" to "${lesson.after}" for an earlier draft of this concept — write it like the second version from the start, not the first.`);
  });

  bucket.avoidPatterns.forEach((pattern) => {
    lines.push(`- A draft for this concept${pattern.levelTitle ? ` ("${pattern.levelTitle}")` : ''} was rejected before: "${pattern.note}" — do not repeat whatever caused that.`);
  });

  if (!lines.length) return '';

  return [
    '',
    `Feedback from mentors on earlier case studies for this same concept — apply these lessons:`,
    ...lines
  ].join('\n');
}

module.exports = { recordApproval, recordRejection, getFeedbackContext, slugify };
