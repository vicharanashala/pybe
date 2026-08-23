const express = require('express');
const store = require('../data/store');
const engine = require('../services/learningEngine');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    res.json(sessions.slice(0, 30));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const scenario = await store.getScenario(req.body.scenarioId);
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    const abstractionMap = engine.mapReasoning(req.body.reasoning);
    const generatedCode = engine.generateCode(scenario, abstractionMap);
    const prompt = engine.evaluatePrompt(req.body.promptText);
    const learnerName = req.body.learnerName || 'Guest learner';
    const reflectionText = req.body.reflection || '';
    const xpEarned = engine.calculateXP({ promptScore: prompt.score, reflection: reflectionText });

    const db = await store.readDb();
    const userSessions = (db.sessions || []).filter((item) => item.learnerName === learnerName);
    const lastSession = userSessions
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const lastSessionAt = lastSession ? new Date(lastSession.createdAt) : null;
    const nowTime = new Date();
    const within24Hours = lastSessionAt ? (nowTime - lastSessionAt) <= 24 * 60 * 60 * 1000 : false;

    let user = (db.users || []).find((item) => item.learnerName === learnerName);
    if (!user) {
      user = {
        _id: `${learnerName}-${Date.now()}`,
        learnerName,
        xp: 0,
        streak: 1,
        createdAt: nowTime.toISOString(),
        updatedAt: nowTime.toISOString()
      };
      db.users = [...(db.users || []), user];
    }

    const nextStreak = within24Hours ? (Number(user.streak) || 1) + 1 : 1;
    user.xp = (Number(user.xp) || 0) + xpEarned;
    user.streak = nextStreak;
    user.lastActiveAt = nowTime.toISOString();
    user.updatedAt = nowTime.toISOString();

    const session = await store.addSession({
      learnerName,
      scenario: scenario._id,
      reasoning: req.body.reasoning,
      promptText: req.body.promptText || '',
      abstractionMap,
      generatedCode,
      codeExplanation: engine.explainCode(abstractionMap),
      promptScore: prompt.score,
      promptFeedback: prompt.feedback,
      reflection: reflectionText,
      misconceptions: engine.detectMisconceptions(req.body.reasoning),
      masterySignals: engine.masterySignals(abstractionMap, prompt.score),
      xp: xpEarned,
      streak: nextStreak
    });

    const updatedDb = await store.readDb();
    const persistedUser = (updatedDb.users || []).find((item) => item.learnerName === learnerName) || user;
    persistedUser.xp = user.xp;
    persistedUser.streak = user.streak;
    persistedUser.lastActiveAt = user.lastActiveAt;
    persistedUser.updatedAt = user.updatedAt;
    await store.writeDb(updatedDb);

    res.status(201).json({ ...session, xp: xpEarned, streak: nextStreak });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
