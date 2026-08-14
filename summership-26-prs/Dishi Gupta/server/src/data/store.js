const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ scenarios: [], sessions: [] });
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
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
  if (filters.storyId) scenarios = scenarios.filter((item) => item.storyId === filters.storyId);
  if (filters.difficulty) scenarios = scenarios.filter((item) => item.difficulty === filters.difficulty);
  if (filters.concept) scenarios = scenarios.filter((item) => Array.isArray(item.concepts) && item.concepts.includes(filters.concept));
  if (filters.q) {
    const query = filters.q.toLowerCase();
    scenarios = scenarios.filter((item) => (
      (item.title || '').toLowerCase().includes(query) ||
      (item.context || '').toLowerCase().includes(query) ||
      (Array.isArray(item.concepts) && item.concepts.some((concept) => concept.toLowerCase().includes(query)))
    ));
  }
  if (filters.storyId) {
    return scenarios.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  // Default (unfiltered) list is ranked by effectivenessScore. A chained story,
  // though, must read as one ordered block — otherwise its parts scatter across
  // the list wherever their individual scores land (e.g. part 3 sinks below other
  // scenarios that happen to share its score), and the "step by step" flow breaks.
  // Anchor every part of a story at the story's best score, then order parts by
  // `order` so the whole chain stays contiguous and in sequence.
  const storyAnchor = {};
  scenarios.forEach((item) => {
    if (item.storyId) {
      const score = item.effectivenessScore || 0;
      storyAnchor[item.storyId] = Math.max(storyAnchor[item.storyId] ?? -Infinity, score);
    }
  });
  const rank = (item) => (item.storyId ? storyAnchor[item.storyId] : (item.effectivenessScore || 0));
  return scenarios.sort((a, b) => {
    const diff = rank(b) - rank(a);
    if (diff !== 0) return diff;
    if (a.storyId && a.storyId === b.storyId) return (a.order || 0) - (b.order || 0);
    return 0;
  });
}

async function getScenario(id) {
  const db = await readDb();
  return db.scenarios.find((scenario) => scenario._id === id) || null;
}

async function addScenario(input) {
  const db = await readDb();
  // Never let a client-supplied _id / timestamp overwrite the server-generated
  // ones — otherwise a POST could clobber a story node (e.g. rosewood-part-3)
  // or create a duplicate id. Seeding uses resetData, which keeps stable ids.
  const { _id, createdAt, updatedAt, ...safe } = input || {};
  const scenario = createRecord(safe);
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
    sessions: []
  });
}

module.exports = {
  addScenario,
  addSession,
  getScenario,
  listScenarios,
  listSessions,
  readDb,
  resetData
};
