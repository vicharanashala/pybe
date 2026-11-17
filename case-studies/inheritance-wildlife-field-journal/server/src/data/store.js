const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');
const sagasDir = path.join(__dirname, 'sagas');

async function readDb() {
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(data) {
  await fs.writeFile(dbPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function readSaga(sagaId) {
  const filePath = path.join(sagasDir, `${sagaId}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Return light metadata for every saga (for the case-study selector)
async function listSagas() {
  const files = await fs.readdir(sagasDir);
  const sagas = [];
  for (const file of files.filter((f) => f.endsWith('.json') && f !== 'polymorphism.json')) {
    const saga = await readSaga(path.basename(file, '.json'));
    if (saga) {
      sagas.push({
        id: saga.id,
        title: saga.title,
        subtitle: saga.subtitle,
        icon: saga.icon,
        accent: saga.accent,
        completeMessage: saga.completeMessage,
        arcCount: saga.arcs.length,
        actCount: saga.arcs.reduce((n, arc) => n + arc.acts.length, 0),
        arcNames: saga.arcs.map((arc) => arc.name)
      });
    }
  }
  return sagas;
}

async function getSaga(sagaId) {
  return readSaga(sagaId);
}

// Flatten all acts from all arcs of one saga
async function getAllActs(sagaId) {
  const saga = await readSaga(sagaId);
  if (!saga) return [];
  return saga.arcs.flatMap((arc) =>
    arc.acts.map((act) => ({
      ...act,
      sagaId: saga.id,
      id: `${saga.id}-${act.act}`,
      arcNumber: arc.arc,
      arcName: arc.name,
      arcColor: arc.color
    }))
  );
}

async function getAct(sagaId, actNumber) {
  const acts = await getAllActs(sagaId);
  return acts.find((a) => a.act === Number(actNumber)) || null;
}

async function saveSession(sagaId, sessionData) {
  const db = await readDb();
  const session = {
    _id: crypto.randomUUID(),
    sagaId,
    ...sessionData,
    createdAt: new Date().toISOString()
  };
  if (!db.sessions) db.sessions = [];
  db.sessions.push(session);
  await writeDb(db);
  return session;
}

async function listNotes(sagaId = null) {
  const db = await readDb();
  if (!db.notes) return [];
  return sagaId ? db.notes.filter((n) => n.sagaId === sagaId) : db.notes;
}

async function addNote(sagaId, noteData) {
  const db = await readDb();
  if (!db.notes) db.notes = [];
  const note = {
    _id: crypto.randomUUID(),
    sagaId,
    ...noteData,
    createdAt: new Date().toISOString()
  };
  db.notes.push(note);
  await writeDb(db);
  return note;
}

module.exports = { listSagas, getSaga, getAllActs, getAct, saveSession, listNotes, addNote };