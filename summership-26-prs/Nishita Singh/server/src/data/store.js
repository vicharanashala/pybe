const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

const COLLECTION_DEFAULTS = {
  scenarios: [],
  sessions: [],
  // Phase 2 collections. Added with defaults so existing db.json files from
  // Phase 1 keep working without a migration step - readDb() below fills in
  // any collection that is missing the first time it runs.
  responses: [],
  reflections: [],
  progressMarkers: [],
  // Phase 3: AI tutor conversation history, one record per (learnerId, scenarioId|"general").
  tutorConversations: []
};

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ ...COLLECTION_DEFAULTS });
  }
}

function withCollectionDefaults(db) {
  let changed = false;
  const next = { ...db };
  Object.keys(COLLECTION_DEFAULTS).forEach((key) => {
    if (!Array.isArray(next[key])) {
      next[key] = [];
      changed = true;
    }
  });
  return { db: next, changed };
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  const parsed = JSON.parse(raw);
  const { db, changed } = withCollectionDefaults(parsed);
  if (changed) await writeDb(db);
  return db;
}

async function writeDb(data) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function now() {
  return new Date().toISOString();
}

function createRecord(input) {
  const timestamp = now();
  return {
    _id: crypto.randomUUID(),
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

async function listScenarios(filters = {}) {
  const db = await readDb();
  let scenarios = [...db.scenarios];
  if (filters.difficulty) scenarios = scenarios.filter((item) => item.difficulty === filters.difficulty);
  if (filters.concept) scenarios = scenarios.filter((item) => item.concepts.includes(filters.concept));
  if (filters.q) {
    const query = filters.q.toLowerCase();
    scenarios = scenarios.filter((item) => (
      item.title.toLowerCase().includes(query) ||
      item.context.toLowerCase().includes(query) ||
      item.concepts.some((concept) => concept.toLowerCase().includes(query))
    ));
  }
  return scenarios.sort((a, b) => (b.effectivenessScore || 0) - (a.effectivenessScore || 0));
}

async function getScenario(id) {
  const db = await readDb();
  return db.scenarios.find((scenario) => scenario._id === id) || null;
}

async function addScenario(input) {
  const db = await readDb();
  const scenario = createRecord(input);
  db.scenarios.push(scenario);
  await writeDb(db);
  return scenario;
}

async function listSessions() {
  const db = await readDb();
  return db.sessions
    .map((session) => ({
      ...session,
      scenario: db.scenarios.find((scenario) => scenario._id === session.scenario) || null
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function addSession(input) {
  const db = await readDb();
  const session = createRecord(input);
  db.sessions.push(session);
  await writeDb(db);
  return {
    ...session,
    scenario: db.scenarios.find((scenario) => scenario._id === session.scenario) || null
  };
}

async function resetData(scenarios) {
  const db = await readDb();
  await writeDb({
    ...db,
    scenarios: scenarios.map((scenario) => createRecord(scenario)),
    sessions: []
  });
}

/* -------------------------------------------------------------------- */
/* Phase 2: generic upsert-by-(learnerId, scenarioId) collection helper */
/* -------------------------------------------------------------------- */

function upsertByLearnerAndScenario(collection, input) {
  const timestamp = now();
  const index = collection.findIndex(
    (item) => item.learnerId === input.learnerId && item.scenarioId === input.scenarioId
  );
  if (index === -1) {
    const record = { _id: crypto.randomUUID(), ...input, createdAt: timestamp, updatedAt: timestamp };
    collection.push(record);
    return record;
  }
  collection[index] = { ...collection[index], ...input, updatedAt: timestamp };
  return collection[index];
}

async function upsertResponse(input) {
  const db = await readDb();
  const record = upsertByLearnerAndScenario(db.responses, input);
  await writeDb(db);
  return record;
}

async function getResponse(learnerId, scenarioId) {
  const db = await readDb();
  return db.responses.find((item) => item.learnerId === learnerId && item.scenarioId === scenarioId) || null;
}

async function listResponses(learnerId) {
  const db = await readDb();
  return db.responses.filter((item) => item.learnerId === learnerId);
}

async function addReflection(input) {
  const db = await readDb();
  const reflection = createRecord(input);
  db.reflections.push(reflection);
  await writeDb(db);
  return reflection;
}

async function listReflections(learnerId) {
  const db = await readDb();
  return db.reflections
    .filter((item) => item.learnerId === learnerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function upsertProgressMarker(input) {
  const db = await readDb();
  const record = upsertByLearnerAndScenario(db.progressMarkers, input);
  await writeDb(db);
  return record;
}

async function listScenarioTitles() {
  const db = await readDb();
  return db.scenarios.map((scenario) => scenario.title);
}

async function listProgressMarkers(learnerId) {
  const db = await readDb();
  return db.progressMarkers.filter((item) => item.learnerId === learnerId);
}

/* -------------------------------------------------------------------- */
/* Phase 3: AI tutor conversation history                               */
/* -------------------------------------------------------------------- */

function tutorConversationKey(learnerId, scenarioId) {
  return `${learnerId}::${scenarioId || 'general'}`;
}

async function getTutorConversation(learnerId, scenarioId) {
  const db = await readDb();
  const key = tutorConversationKey(learnerId, scenarioId);
  return db.tutorConversations.find((item) => tutorConversationKey(item.learnerId, item.scenarioId) === key) || null;
}

async function appendTutorMessages(learnerId, scenarioId, messages) {
  const db = await readDb();
  const key = tutorConversationKey(learnerId, scenarioId);
  let conversation = db.tutorConversations.find((item) => tutorConversationKey(item.learnerId, item.scenarioId) === key);
  const timestamp = now();
  if (!conversation) {
    conversation = { _id: crypto.randomUUID(), learnerId, scenarioId: scenarioId || null, messages: [], createdAt: timestamp };
    db.tutorConversations.push(conversation);
  }
  conversation.messages.push(...messages);
  conversation.updatedAt = timestamp;
  await writeDb(db);
  return conversation;
}

module.exports = {
  addScenario,
  addSession,
  getScenario,
  listScenarios,
  listScenarioTitles,
  listSessions,
  readDb,
  resetData,
  upsertResponse,
  getResponse,
  listResponses,
  addReflection,
  listReflections,
  upsertProgressMarker,
  listProgressMarkers,
  getTutorConversation,
  appendTutorMessages
};
