const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');
const backupDir = path.join(__dirname, 'backups');

// Validation schemas
const scenarioSchema = {
  title: (v) => typeof v === 'string' && v.trim().length > 0,
  context: (v) => typeof v === 'string' && v.trim().length > 0,
  concepts: (v) => Array.isArray(v) && v.length > 0 && v.every(c => typeof c === 'string'),
  difficulty: (v) => ['Beginner', 'Explorer', 'Builder'].includes(v),
  objectives: (v) => Array.isArray(v) && v.length > 0,
  prompt: (v) => typeof v === 'string'
};

const sessionSchema = {
  learnerName: (v) => typeof v === 'string' && v.trim().length > 0,
  scenarioId: (v) => typeof v === 'string' && v.trim().length > 0,
  reasoning: (v) => typeof v === 'string' && v.trim().length > 0
};

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ scenarios: [], sessions: [], learners: [], backups: [] });
  }
}

async function readDb() {
  await ensureDb();
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to read database: ${error.message}`);
  }
}

async function writeDb(data) {
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    // Create backup before write
    await createAutoBackup();
    await fs.writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write database: ${error.message}`);
  }
}

async function createAutoBackup() {
  try {
    await fs.mkdir(backupDir, { recursive: true });
    const db = await readDb().catch(() => null);
    if (db) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(backupDir, `db-${timestamp}.json`);
      await fs.writeFile(backupPath, JSON.stringify(db, null, 2));
      // Keep only last 10 backups
      const files = await fs.readdir(backupDir);
      if (files.length > 10) {
        files.sort().slice(0, -10).forEach(async (file) => {
          await fs.unlink(path.join(backupDir, file)).catch(() => {});
        });
      }
    }
  } catch (error) {
    console.warn('Auto-backup failed:', error.message);
  }
}

function validateInput(data, schema) {
  const errors = [];
  Object.entries(schema).forEach(([key, validator]) => {
    if (!(key in data)) {
      errors.push(`Missing required field: ${key}`);
    } else if (!validator(data[key])) {
      errors.push(`Invalid ${key}: ${typeof data[key]} provided`);
    }
  });
  return errors;
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

/**
 * List scenarios with filtering, pagination, and sorting
 */
async function listScenarios(filters = {}, page = 1, limit = 20) {
  const db = await readDb();
  let scenarios = [...db.scenarios];
  
  if (filters.difficulty) {
    scenarios = scenarios.filter((item) => item.difficulty === filters.difficulty);
  }
  if (filters.concept) {
    scenarios = scenarios.filter((item) => item.concepts.includes(filters.concept));
  }
  if (filters.q) {
    const query = filters.q.toLowerCase();
    scenarios = scenarios.filter((item) => (
      item.title.toLowerCase().includes(query) ||
      item.context.toLowerCase().includes(query) ||
      item.concepts.some((concept) => concept.toLowerCase().includes(query))
    ));
  }
  
  scenarios.sort((a, b) => (b.effectivenessScore || 0) - (a.effectivenessScore || 0));
  
  const total = scenarios.length;
  const start = (page - 1) * limit;
  const paginatedScenarios = scenarios.slice(start, start + limit);
  
  return {
    data: paginatedScenarios,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

async function getScenario(id) {
  if (!id || typeof id !== 'string') throw new Error('Invalid scenario ID');
  const db = await readDb();
  const scenario = db.scenarios.find((scenario) => scenario._id === id);
  if (!scenario) throw new Error('Scenario not found');
  return scenario;
}

async function addScenario(input) {
  const errors = validateInput(input, scenarioSchema);
  if (errors.length) throw new Error(errors.join('; '));
  
  const db = await readDb();
  const scenario = createRecord(input);
  db.scenarios.push(scenario);
  await writeDb(db);
  return scenario;
}

async function updateScenario(id, input) {
  if (!id || typeof id !== 'string') throw new Error('Invalid scenario ID');
  const db = await readDb();
  const index = db.scenarios.findIndex((s) => s._id === id);
  if (index === -1) throw new Error('Scenario not found');
  
  const updated = { ...db.scenarios[index], ...input, updatedAt: now() };
  db.scenarios[index] = updated;
  await writeDb(db);
  return updated;
}

async function deleteScenario(id) {
  if (!id || typeof id !== 'string') throw new Error('Invalid scenario ID');
  const db = await readDb();
  const filtered = db.scenarios.filter((s) => s._id !== id);
  if (filtered.length === db.scenarios.length) throw new Error('Scenario not found');
  
  db.scenarios = filtered;
  await writeDb(db);
  return { success: true, message: 'Scenario deleted' };
}

/**
 * List sessions with filtering, pagination, and learner tracking
 */
async function listSessions(filters = {}, page = 1, limit = 20) {
  const db = await readDb();
  let sessions = [...db.sessions];
  
  if (filters.learnerName) {
    const query = filters.learnerName.toLowerCase();
    sessions = sessions.filter((s) => s.learnerName.toLowerCase().includes(query));
  }
  if (filters.scenarioId) {
    sessions = sessions.filter((s) => s.scenario === filters.scenarioId);
  }
  if (filters.concept) {
    sessions = sessions.filter((s) => 
      s.abstractionMap && s.abstractionMap.some((m) => m.pythonConcept.includes(filters.concept))
    );
  }
  
  sessions = sessions
    .map((session) => ({
      ...session,
      scenario: db.scenarios.find((scenario) => scenario._id === session.scenario) || null
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const total = sessions.length;
  const start = (page - 1) * limit;
  const paginatedSessions = sessions.slice(start, start + limit);
  
  return {
    data: paginatedSessions,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

async function getSession(id) {
  if (!id || typeof id !== 'string') throw new Error('Invalid session ID');
  const db = await readDb();
  const session = db.sessions.find((s) => s._id === id);
  if (!session) throw new Error('Session not found');
  return {
    ...session,
    scenario: db.scenarios.find((scenario) => scenario._id === session.scenario) || null
  };
}

async function addSession(input) {
  const errors = validateInput(input, sessionSchema);
  if (errors.length) throw new Error(errors.join('; '));
  
  const db = await readDb();
  const session = createRecord(input);
  db.sessions.push(session);
  
  // Update learner stats
  updateLearnerStats(db, session.learnerName, session);
  await writeDb(db);
  
  return {
    ...session,
    scenario: db.scenarios.find((scenario) => scenario._id === session.scenario) || null
  };
}

async function updateSession(id, input) {
  if (!id || typeof id !== 'string') throw new Error('Invalid session ID');
  const db = await readDb();
  const index = db.sessions.findIndex((s) => s._id === id);
  if (index === -1) throw new Error('Session not found');
  
  const updated = { ...db.sessions[index], ...input, updatedAt: now() };
  db.sessions[index] = updated;
  await writeDb(db);
  return updated;
}

async function deleteSession(id) {
  if (!id || typeof id !== 'string') throw new Error('Invalid session ID');
  const db = await readDb();
  const filtered = db.sessions.filter((s) => s._id !== id);
  if (filtered.length === db.sessions.length) throw new Error('Session not found');
  
  db.sessions = filtered;
  await writeDb(db);
  return { success: true, message: 'Session deleted' };
}

/**
 * Learner profile management
 */
function updateLearnerStats(db, learnerName, session) {
  if (!db.learners) db.learners = [];
  let learner = db.learners.find((l) => l.name === learnerName);
  
  if (!learner) {
    learner = {
      name: learnerName,
      totalSessions: 0,
      averagePromptScore: 0,
      conceptsMastered: {},
      createdAt: now()
    };
    db.learners.push(learner);
  }
  
  learner.totalSessions += 1;
  learner.averagePromptScore = Math.round(
    (learner.averagePromptScore * (learner.totalSessions - 1) + (session.promptScore || 0)) /
    learner.totalSessions
  );
  
  // Track concept mastery
  if (session.abstractionMap && Array.isArray(session.abstractionMap)) {
    session.abstractionMap.forEach((map) => {
      const concept = map.pythonConcept;
      learner.conceptsMastered[concept] = (learner.conceptsMastered[concept] || 0) + 1;
    });
  }
  
  learner.updatedAt = now();
  return learner;
}

async function getLearnerProfile(name) {
  if (!name || typeof name !== 'string') throw new Error('Invalid learner name');
  const db = await readDb();
  const learner = (db.learners || []).find((l) => l.name === name);
  if (!learner) throw new Error('Learner not found');
  
  const sessions = db.sessions.filter((s) => s.learnerName === name);
  return {
    ...learner,
    sessionCount: sessions.length,
    sessions: sessions.slice(0, 10)
  };
}

async function listLearners() {
  const db = await readDb();
  return (db.learners || []).sort((a, b) => b.totalSessions - a.totalSessions);
}

/**
 * Export functionality
 */
async function exportSessions(format = 'json') {
  const db = await readDb();
  const sessions = db.sessions.map((session) => ({
    ...session,
    scenario: db.scenarios.find((scenario) => scenario._id === session.scenario)?.title || 'Unknown'
  }));
  
  if (format === 'csv') {
    const headers = ['Date', 'Learner', 'Scenario', 'Prompt Score', 'Concepts'];
    const rows = sessions.map((s) => [
      new Date(s.createdAt).toLocaleDateString(),
      s.learnerName,
      s.scenario,
      s.promptScore || 0,
      s.abstractionMap?.map((m) => m.pattern).join('; ') || ''
    ]);
    return { headers, rows };
  }
  
  return sessions;
}

async function resetData(scenarios) {
  await writeDb({
    scenarios: scenarios.map((scenario) => createRecord(scenario)),
    sessions: [],
    learners: [],
    backups: []
  });
}

module.exports = {
  addScenario,
  updateScenario,
  deleteScenario,
  getScenario,
  listScenarios,
  addSession,
  updateSession,
  deleteSession,
  getSession,
  listSessions,
  getLearnerProfile,
  listLearners,
  exportSessions,
  readDb,
  resetData,
  validateInput
};
