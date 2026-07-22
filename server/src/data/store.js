const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ scenarios: [], sessions: [], doubts: [], challengeProgress: { completedDays: [], currentStreak: 0, lastCompletedDate: null } });
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
    doubts: [],
    challengeProgress: { completedDays: [], currentStreak: 0, lastCompletedDate: null }
  });
}

async function listDoubts() {
  const db = await readDb();
  return (db.doubts || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function addDoubt(input) {
  const db = await readDb();
  if (!db.doubts) db.doubts = [];
  const doubt = createRecord(input);
  db.doubts.push(doubt);
  await writeDb(db);
  return doubt;
}

async function deleteDoubt(id) {
  const db = await readDb();
  db.doubts = (db.doubts || []).filter((d) => d._id !== id);
  await writeDb(db);
}

async function getChallengeProgress() {
  const db = await readDb();
  if (!db.challengeProgress) {
    db.challengeProgress = { completedDays: [], currentStreak: 0, lastCompletedDate: null };
    await writeDb(db);
  }
  return db.challengeProgress;
}

async function completeChallenge(day) {
  const db = await readDb();
  if (!db.challengeProgress) {
    db.challengeProgress = { completedDays: [], currentStreak: 0, lastCompletedDate: null };
  }
  const progress = db.challengeProgress;
  const today = new Date().toISOString().split('T')[0];

  if (!progress.completedDays.includes(day)) {
    progress.completedDays.push(day);
  }

  if (progress.lastCompletedDate) {
    const last = new Date(progress.lastCompletedDate);
    const now = new Date(today);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      progress.currentStreak += 1;
    } else if (diffDays > 1) {
      progress.currentStreak = 1;
    }
  } else {
    progress.currentStreak = 1;
  }
  progress.lastCompletedDate = today;
  db.challengeProgress = progress;
  await writeDb(db);
  return progress;
}

module.exports = {
  addChallengeProgress: completeChallenge,
  addDoubt,
  addScenario,
  addSession,
  completeChallenge,
  deleteDoubt,
  getChallengeProgress,
  getScenario,
  listDoubts,
  listScenarios,
  listSessions,
  readDb,
  resetData
};
