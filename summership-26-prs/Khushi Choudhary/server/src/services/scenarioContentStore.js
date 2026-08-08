// Where approved drafts land. Schema matches the shared content.json
// convention documented in Saksham Sharma's WIKI.md (topicId / levels /
// caseStudies), kept in this fork's own file so a maintainer can append it
// into the real content.json by hand during a merge, rather than this
// feature writing into anyone else's file directly. Each caseStudy carries
// the full five-stage arc (stage1-stage5) plus scaleReflection — see
// scenarioSystemPrompt.js for what each stage means.

const fs = require('fs/promises');
const path = require('path');

const contentPath = path.join(__dirname, '..', 'data', 'generatedContent.json');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function ensureFile() {
  try {
    await fs.access(contentPath);
  } catch {
    await writeAll({ topics: [] });
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(contentPath, 'utf8');
  return JSON.parse(raw);
}

async function writeAll(data) {
  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/**
 * Appends one approved case study as the next level of its topic (creating
 * the topic if it doesn't exist yet). Returns { topicId, levelId, caseStudyId }.
 *
 * meta.domain is the hook word / theme the generation request was seeded
 * with (e.g. "a tailor's shop") — it's an input to generation, not part of
 * the model's OUTPUT CONTRACT (see scenarioSystemPrompt.js), so it has to be
 * threaded in from the caller (the draft's original input, for the mentor
 * path, or the learner's generate-step form) rather than read off content
 * itself. Stored alongside topicName so the homepage can show "topic +
 * domain" for finding a case study without opening it.
 */
async function publishCaseStudy(content, meta = {}) {
  const data = await readAll();
  const topicId = slugify(content.concept);

  let topic = data.topics.find((t) => t.topicId === topicId);
  if (!topic) {
    topic = { topicId, topicName: content.concept, levels: [] };
    data.topics.push(topic);
  }

  const nextLevelId = topic.levels.length
    ? Math.max(...topic.levels.map((l) => l.levelId)) + 1
    : 1;

  const caseStudyId = `${topicId}_l${nextLevelId}_c1`;

  topic.levels.push({
    levelId: nextLevelId,
    title: content.levelTitle,
    concept: content.concept,
    theory: content.theory,
    designNote: content.designNote,
    domain: meta.domain || meta.hookWord || null,
    caseStudies: [
      {
        id: caseStudyId,
        scenario: content.scenario,
        stage1: content.stage1,
        stage2: content.stage2,
        stage3: content.stage3,
        stage4: content.stage4,
        stage5: content.stage5,
        scaleReflection: content.scaleReflection
      }
    ]
  });

  await writeAll(data);
  return { topicId, levelId: nextLevelId, caseStudyId };
}

/**
 * Overwrites one already-published case study's content in place — used by
 * the mentor's Published-tab "Edit" action. The caller (routes/
 * scenarioGenerator.js) is responsible for re-validating the merged content
 * against validateScenarioDraft BEFORE calling this, the same gate approve
 * runs — this function itself does no validation, it just writes what it's
 * given. Returns the updated case study, or null if the topic/level/case
 * study combination doesn't exist.
 */
async function updateCaseStudy(topicId, levelId, caseStudyId, content) {
  const data = await readAll();
  const topic = data.topics.find((t) => t.topicId === topicId);
  const level = topic?.levels.find((l) => l.levelId === Number(levelId));
  const index = level?.caseStudies.findIndex((cs) => cs.id === caseStudyId);
  if (!topic || !level || index === undefined || index === -1) return null;

  level.caseStudies[index] = { ...level.caseStudies[index], ...content, id: caseStudyId };
  await writeAll(data);
  return level.caseStudies[index];
}

/**
 * Removes one published case study — used by the mentor's Published-tab
 * "Delete" action, so a mentor can pull something off the homepage without
 * hand-editing generatedContent.json. A level or topic left with nothing
 * under it is removed too, so the homepage never shows an empty level card
 * or a topic with no levels. Returns true if something was actually removed.
 */
async function deleteCaseStudy(topicId, levelId, caseStudyId) {
  const data = await readAll();
  const topic = data.topics.find((t) => t.topicId === topicId);
  const level = topic?.levels.find((l) => l.levelId === Number(levelId));
  if (!topic || !level) return false;

  const before = level.caseStudies.length;
  level.caseStudies = level.caseStudies.filter((cs) => cs.id !== caseStudyId);
  if (level.caseStudies.length === before) return false;

  if (!level.caseStudies.length) {
    topic.levels = topic.levels.filter((l) => l.levelId !== level.levelId);
  }
  if (!topic.levels.length) {
    data.topics = data.topics.filter((t) => t.topicId !== topic.topicId);
  }

  await writeAll(data);
  return true;
}

module.exports = { publishCaseStudy, updateCaseStudy, deleteCaseStudy, readAll, slugify };
