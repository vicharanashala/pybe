const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ scenarios: [], sessions: [], conversations: [] });
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  const db = JSON.parse(raw);
  if (!db.conversations) db.conversations = [];
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
  await writeDb({
    scenarios: scenarios.map((scenario) => createRecord(scenario)),
    sessions: [],
    conversations: []
  });
}

function hydrateConversation(conversation, db) {
  return {
    ...conversation,
    scenario: db.scenarios.find((scenario) => scenario._id === conversation.scenarioId) || null
  };
}

async function addConversation(input) {
  const db = await readDb();
  const conversation = createRecord(input);
  db.conversations.push(conversation);
  await writeDb(db);
  return hydrateConversation(conversation, db);
}

async function getConversation(id) {
  const db = await readDb();
  const conversation = db.conversations.find((item) => item._id === id);
  return conversation ? hydrateConversation(conversation, db) : null;
}

async function updateConversation(id, updates) {
  const db = await readDb();
  const index = db.conversations.findIndex((item) => item._id === id);
  if (index === -1) return null;
  db.conversations[index] = {
    ...db.conversations[index],
    ...updates,
    updatedAt: now()
  };
  await writeDb(db);
  return hydrateConversation(db.conversations[index], db);
}

async function listConversations() {
  const db = await readDb();
  return db.conversations
    .map((conversation) => hydrateConversation(conversation, db))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  addConversation,
  addScenario,
  addSession,
  getConversation,
  getScenario,
  listConversations,
  listScenarios,
  listSessions,
  readDb,
  resetData,
  updateConversation
};
