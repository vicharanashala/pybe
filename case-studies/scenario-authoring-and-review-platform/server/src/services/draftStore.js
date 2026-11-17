// CRUD over the review queue (data/scenarioDrafts.json) — every generated
// case study, from either the mentor or learner path, lands here first as a
// draft before a mentor approves, edits, or rejects it. See "One gate, two
// sources" in SCENARIO_GENERATOR.md.

const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const draftsPath = path.join(__dirname, '..', 'data', 'scenarioDrafts.json');

async function ensureFile() {
  try {
    await fs.access(draftsPath);
  } catch {
    await writeAll({ drafts: [] });
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(draftsPath, 'utf8');
  return JSON.parse(raw);
}

async function writeAll(data) {
  await fs.mkdir(path.dirname(draftsPath), { recursive: true });
  await fs.writeFile(draftsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function listDrafts({ status, authorEmail } = {}) {
  const { drafts } = await readAll();
  let filtered = status ? drafts.filter((d) => d.status === status) : drafts;
  if (authorEmail) {
    // Same normalization submissionCap.js already uses for this exact
    // comparison — no accounts, no login, email is the only thing tying a
    // learner back to their own past submissions.
    const target = authorEmail.trim().toLowerCase();
    filtered = filtered.filter((d) => d.author?.email?.toLowerCase() === target);
  }
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getDraft(id) {
  const { drafts } = await readAll();
  return drafts.find((d) => d.id === id) || null;
}

async function createDraft({ input, content, providerUsed, attempts, status, author, issues }) {
  const data = await readAll();
  const draft = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: status || 'needs_review', // 'needs_review' | 'published' | 'rejected' | 'failed'
    author: author || { name: 'Mentor', email: '', role: 'mentor' },
    input,
    content, // the parsed case study object, or null if generation failed validation after all retries
    // Immutable snapshot of content exactly as generated, kept separate from
    // content (which a mentor's edit form overwrites via updateDraft below).
    // At approve time, diffing this against the final content is how
    // services/generationFeedback.js detects "a mentor edited this before
    // publishing" and turns the before/after into a lesson for the next
    // generation of this same concept — see routes/scenarioGenerator.js's
    // approve route.
    originalContent: content ? JSON.parse(JSON.stringify(content)) : null,
    providerUsed,
    attempts,
    issues: issues || [],
    reviewNote: ''
  };
  data.drafts.push(draft);
  await writeAll(data);
  return draft;
}

async function updateDraft(id, patch) {
  const data = await readAll();
  const index = data.drafts.findIndex((d) => d.id === id);
  if (index === -1) return null;
  data.drafts[index] = { ...data.drafts[index], ...patch, updatedAt: new Date().toISOString() };
  await writeAll(data);
  return data.drafts[index];
}

// Reverse lookup from a published case study back to the draft that
// produced it — used when a mentor deletes something from the Published tab,
// so the originating draft's status can be flipped away from "published"
// too (best-effort; see routes/scenarioGenerator.js's DELETE /published
// route). Without this, Review Queue's "Published" filter would keep
// listing a draft as live after its actual published content is gone.
async function findDraftByPublishedCaseStudy(caseStudyId) {
  const { drafts } = await readAll();
  return drafts.find((d) => d.published?.caseStudyId === caseStudyId) || null;
}

module.exports = { listDrafts, getDraft, createDraft, updateDraft, findDraftByPublishedCaseStudy };
