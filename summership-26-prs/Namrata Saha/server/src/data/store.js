const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

async function ensureDb() {
  try {
    await fs.access(dbPath);
  } catch {
    await writeDb({ stories: [], sessions: [] });
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

async function listStories() {
  const db = await readDb();
  return db.stories.map(({ fable, riddle, conceptReveal, microLesson, challenge, project, ...meta }) => meta);
}

async function getStory(id) {
  const db = await readDb();
  return db.stories.find((story) => story.id === id) || null;
}

async function listSessions() {
  const db = await readDb();
  return db.sessions
    .map((session) => ({
      ...session,
      story: db.stories.find((story) => story.id === session.storyId) || null
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
    story: db.stories.find((story) => story.id === session.storyId) || null
  };
}

async function resetData(stories) {
  await writeDb({
    stories: stories.map((story) => createRecord(story)),
    sessions: []
  });
}

module.exports = {
  addSession,
  getStory,
  listSessions,
  listStories,
  readDb,
  resetData
};
