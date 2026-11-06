const fs = require('node:fs/promises');
const path = require('node:path');

const EMPTY_STATE = Object.freeze({ profiles: {}, events: [] });

function createLearningRepository({ filePath = path.join(__dirname, '../../data/learning-state.json') } = {}) {
  let writeQueue = Promise.resolve();

  async function readState() {
    try {
      const contents = await fs.readFile(filePath, 'utf8');
      const state = JSON.parse(contents);
      return {
        profiles: state.profiles && typeof state.profiles === 'object' ? state.profiles : {},
        events: Array.isArray(state.events) ? state.events : [],
      };
    } catch (error) {
      if (error.code === 'ENOENT') return { profiles: {}, events: [] };
      throw new Error(`Unable to read learning progress: ${error.message}`, { cause: error });
    }
  }

  async function writeState(state) {
    const directory = path.dirname(filePath);
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.mkdir(directory, { recursive: true });
    try {
      await fs.writeFile(temporaryPath, JSON.stringify(state, null, 2), 'utf8');
      await fs.rename(temporaryPath, filePath);
    } catch (error) {
      await fs.rm(temporaryPath, { force: true }).catch(() => {});
      throw new Error(`Unable to persist learning progress: ${error.message}`, { cause: error });
    }
  }

  function serializeWrite(operation) {
    const next = writeQueue.then(operation);
    writeQueue = next.catch(() => {});
    return next;
  }

  return {
    async getLearner(learnerId, defaultBoundary) {
      const state = await readState();
      const saved = state.profiles[learnerId];
      return saved ? {
        ...saved,
        attempts: Number.isFinite(saved.attempts) ? saved.attempts : 0,
        learningPoints: Number.isFinite(saved.learningPoints) ? saved.learningPoints : 0,
        pendingScenario: saved.pendingScenario || null,
        pendingAdaptation: saved.pendingAdaptation || null,
      } : {
        learnerId,
        currentStructurednessBoundary: defaultBoundary,
        attempts: 0,
        learningPoints: 0,
        pendingScenario: null,
        pendingAdaptation: null,
        updatedAt: null,
      };
    },

    async getEvents(learnerId) {
      const state = await readState();
      return state.events.filter((event) => event.learnerId === learnerId);
    },

    async recordAttempt({ learnerId, session, profile }) {
      return serializeWrite(async () => {
        const state = await readState();
        state.profiles[learnerId] = profile;
        state.events.push(session);
        await writeState(state);
        return { session, profile };
      });
    },

    async savePendingScenario({ learnerId, profile }) {
      return serializeWrite(async () => {
        const state = await readState();
        state.profiles[learnerId] = profile;
        await writeState(state);
        return profile;
      });
    },
  };
}

module.exports = { createLearningRepository };