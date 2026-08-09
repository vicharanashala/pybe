const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({
      users: [],
      scenarios: [],
      sessions: [],
      progress: []
    });
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(
    dbPath,
    `${JSON.stringify(data, null, 2)}\n`,
    'utf8'
  );
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

  if (filters.difficulty) {
    scenarios = scenarios.filter(
      (item) => item.difficulty === filters.difficulty
    );
  }

  if (filters.concept) {
    scenarios = scenarios.filter(
      (item) => item.concepts.includes(filters.concept)
    );
  }

  if (filters.q) {
    const query = filters.q.toLowerCase();

    scenarios = scenarios.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.context.toLowerCase().includes(query) ||
        item.concepts.some((concept) =>
          concept.toLowerCase().includes(query)
        )
    );
  }

  return scenarios.sort(
    (a, b) => (b.effectivenessScore || 0) - (a.effectivenessScore || 0)
  );
}

async function getScenario(id) {
  const db = await readDb();

  return (
    db.scenarios.find((scenario) => scenario._id === id) || null
  );
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
      scenario:
        db.scenarios.find(
          (scenario) => scenario._id === session.scenario
        ) || null
    }))
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
}

async function addSession(input) {
  const db = await readDb();
  const session = createRecord(input);

  db.sessions.push(session);

  await writeDb(db);

  return {
    ...session,
    scenario:
      db.scenarios.find(
        (scenario) => scenario._id === session.scenario
      ) || null
  };
}

async function getUserByUsername(username) {
  const db = await readDb();

  return (
    (db.users || []).find(
      (user) => user.username === username
    ) || null
  );
}

async function addUser(input) {
  const db = await readDb();
  const user = createRecord(input);

  if (!db.users) {
    db.users = [];
  }

  db.users.push(user);

  await writeDb(db);

  return user;
}

async function getUserProgress(userId) {
  const db = await readDb();

  if (!db.progress) {
    db.progress = [];
  }

  return db.progress.filter(
    (progress) => progress.userId === userId
  );
}

async function updateProgress(userId, levelId, data) {
  const db = await readDb();

  if (!db.progress) {
    db.progress = [];
  }

  const existingIndex = db.progress.findIndex(
    (progress) =>
      progress.userId === userId &&
      progress.levelId === levelId
  );

  const timestamp = now();

  if (existingIndex > -1) {
    db.progress[existingIndex] = {
      ...db.progress[existingIndex],
      ...data,
      updatedAt: timestamp
    };
  } else {
    db.progress.push({
      _id: crypto.randomUUID(),
      userId,
      levelId,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  await writeDb(db);

  return db.progress.find(
    (progress) =>
      progress.userId === userId &&
      progress.levelId === levelId
  );
}

async function resetData(scenarios) {
  const db = await readDb();

  await writeDb({
    users: db.users || [],
    scenarios: scenarios.map((scenario) =>
      createRecord(scenario)
    ),
    sessions: [],
    progress: db.progress || []
  });
}

async function updateUser(userId, data) {
  const db = await readDb();

  if (!db.users) {
    return null;
  }

  const existingIndex = db.users.findIndex(
    (user) => user._id === userId
  );

  if (existingIndex > -1) {
    db.users[existingIndex] = {
      ...db.users[existingIndex],
      ...data,
      updatedAt: now()
    };

    await writeDb(db);

    return db.users[existingIndex];
  }

  return null;
}

module.exports = {
  addScenario,
  addSession,
  getScenario,
  listScenarios,
  listSessions,
  readDb,
  resetData,
  getUserByUsername,
  addUser,
  getUserProgress,
  updateProgress,
  updateUser
};