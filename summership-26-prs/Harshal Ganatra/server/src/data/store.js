const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ scenarios: [], sessions: [], users: [] });
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
  let scenarios = [...(db.scenarios || [])];
  if (filters.difficulty) scenarios = scenarios.filter((item) => item.difficulty === filters.difficulty);
  if (filters.concept) scenarios = scenarios.filter((item) => item.concepts.includes(filters.concept));
  if (filters.theme) scenarios = scenarios.filter((item) => item.theme === filters.theme);
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

async function listModules() {
  const db = await readDb();
  return db.modules || [];
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

async function listUsers() {
  const db = await readDb();
  return (db.users || []).sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
}

function getLevel(xp) {
  if (xp >= 300) return 3;
  if (xp >= 150) return 2;
  return 1;
}

function getBadge(xp) {
  if (xp >= 300) return "Gold Gear";
  if (xp >= 150) return "Silver Scalpel";
  return "Bronze Piston";
}

async function addXP(learnerName, xpAmount, moduleConcept, tier) {
  const db = await readDb();
  if (!db.users) db.users = [];
  
  let user = db.users.find(u => u.learnerName === learnerName);
  if (!user) {
    user = {
      _id: crypto.randomUUID(),
      learnerName,
      total_xp: 0,
      level: 1,
      completed_sub_modules: [],
      avatar: `https://api.dicebear.com/9.x/bottts/svg?seed=${learnerName.replace(/\s+/g, '')}`,
      badge: getBadge(0),
      createdAt: now(),
      updatedAt: now()
    };
    db.users.push(user);
  }
  
  const subModuleId = `${moduleConcept} - ${tier}`;
  if (!user.completed_sub_modules.includes(subModuleId)) {
    user.completed_sub_modules.push(subModuleId);
    user.total_xp += xpAmount;
    user.level = getLevel(user.total_xp);
    user.badge = getBadge(user.total_xp);
  }
  
  user.updatedAt = now();
  
  await writeDb(db);
  return user;
}

async function resetData(scenarios) {
  await writeDb({
    scenarios: scenarios.map((scenario) => createRecord(scenario)),
    sessions: [],
    users: []
  });
}

module.exports = {
  addScenario,
  addSession,
  getScenario,
  listScenarios,
  listSessions,
  readDb,
  resetData,
  listUsers,
  addXP,
  listModules
};
