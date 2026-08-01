const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const [sessions, db] = await Promise.all([store.listSessions(), store.readDb()]);
    const scenarioCount = db.scenarios.length;
    const conceptCounts = {};
    const misconceptionCounts = {};
    const perConceptStats = {};
    const perScenarioStats = {};
    const dailySessionCounts = {};
    let promptTotal = 0;

    sessions.forEach((session) => {
      promptTotal += session.promptScore || 0;

      session.abstractionMap.forEach((map) => {
        conceptCounts[map.pythonConcept] = (conceptCounts[map.pythonConcept] || 0) + 1;
        if (!perConceptStats[map.pythonConcept]) perConceptStats[map.pythonConcept] = { sessions: 0, totalScore: 0, lastPracticed: null, count: 0 };
        perConceptStats[map.pythonConcept].sessions += 1;
        perConceptStats[map.pythonConcept].totalScore += session.promptScore || 0;
        perConceptStats[map.pythonConcept].lastPracticed = session.createdAt;
        perConceptStats[map.pythonConcept].count += 1;
      });

      session.misconceptions.forEach((item) => {
        misconceptionCounts[item] = (misconceptionCounts[item] || 0) + 1;
      });

      const dateKey = session.createdAt.slice(0, 10);
      dailySessionCounts[dateKey] = (dailySessionCounts[dateKey] || 0) + 1;

      const sc = session.scenario;
      if (sc && sc._id) {
        if (!perScenarioStats[sc._id]) perScenarioStats[sc._id] = { title: sc.title, difficulty: sc.difficulty, sessions: 0, totalScore: 0, misconceptionCount: 0, conceptCount: 0 };
        perScenarioStats[sc._id].sessions += 1;
        perScenarioStats[sc._id].totalScore += session.promptScore || 0;
        perScenarioStats[sc._id].misconceptionCount += (session.misconceptions || []).length;
        perScenarioStats[sc._id].conceptCount += (session.abstractionMap || []).length;
      }
    });

    const conceptMastery = {};
    Object.entries(perConceptStats).forEach(([concept, stats]) => {
      const avgScore = stats.sessions > 0 ? Math.round(stats.totalScore / stats.sessions) : 0;
      let level = 'needs_work';
      if (avgScore >= 75) level = 'mastered';
      else if (avgScore >= 50) level = 'developing';
      conceptMastery[concept] = {
        sessions: stats.sessions,
        avgPromptScore: avgScore,
        lastPracticed: stats.lastPracticed,
        count: stats.count,
        level
      };
    });

    const weakest = Object.entries(conceptMastery).sort((a, b) => a[1].avgPromptScore - b[1].avgPromptScore)[0];

    const sortedDaily = Object.entries(dailySessionCounts).sort((a, b) => a[0].localeCompare(b[0]));
    const streak = computeStreak(sortedDaily);

    res.json({
      scenarioCount,
      sessionCount: sessions.length,
      averagePromptScore: sessions.length ? Math.round(promptTotal / sessions.length) : 0,
      conceptCounts: Object.fromEntries(Object.entries(conceptCounts).sort((a, b) => b[1] - a[1])),
      misconceptionCounts: Object.fromEntries(Object.entries(misconceptionCounts).sort((a, b) => b[1] - a[1])),
      conceptMastery,
      weakestConcept: weakest ? { name: weakest[0], ...weakest[1] } : null,
      dailySessionCounts: Object.fromEntries(sortedDaily),
      streak,
      perScenarioStats: Object.fromEntries(Object.entries(perScenarioStats).map(([id, stats]) => [id, { ...stats, avgScore: Math.round(stats.totalScore / stats.sessions) }])),
      recentSessions: sessions.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
});

function computeStreak(dailyEntries) {
  if (dailyEntries.length === 0) return { current: 0, longest: 0 };
  const dates = dailyEntries.map(([d]) => new Date(d));
  dates.sort((a, b) => b - a);
  let current = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
    if (diff <= 1.5) current++;
    else break;
  }
  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24);
    if (diff <= 1.5) {
      run++;
      if (run > longest) longest = run;
    } else {
      run = 1;
    }
  }
  return { current, longest: Math.max(longest, current) };
}

router.get('/trends', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    const dayMap = {};
    const weekMap = {};
    sessions.forEach(s => {
      const day = s.createdAt.slice(0, 10);
      const week = day.slice(0, 7);
      if (!dayMap[day]) dayMap[day] = { date: day, count: 0, totalScore: 0 };
      dayMap[day].count += 1;
      dayMap[day].totalScore += s.promptScore || 0;
      if (!weekMap[week]) weekMap[week] = { week: week + '-W' + Math.ceil(new Date(s.createdAt).getDate() / 7), count: 0, totalScore: 0 };
      weekMap[week].count += 1;
      weekMap[week].totalScore += s.promptScore || 0;
    });
    const daily = Object.values(dayMap).map(d => ({ ...d, avgScore: Math.round(d.totalScore / d.count) })).sort((a, b) => a.date.localeCompare(b.date));
    const weekly = Object.values(weekMap).map(w => ({ ...w, avgScore: Math.round(w.totalScore / w.count) })).sort((a, b) => a.week.localeCompare(b.week));
    res.json({ daily, weekly });
  } catch (error) {
    next(error);
  }
});

router.get('/scenarios', async (_req, res, next) => {
  try {
    const [sessions, db] = await Promise.all([store.listSessions(), store.readDb()]);
    const stats = {};
    db.scenarios.forEach(sc => { stats[sc._id] = { title: sc.title, difficulty: sc.difficulty, concepts: sc.concepts, sessions: 0, totalScore: 0, misconceptionCount: 0, conceptHits: 0 }; });
    sessions.forEach(s => {
      const sc = s.scenario;
      if (!sc || !sc._id || !stats[sc._id]) return;
      stats[sc._id].sessions += 1;
      stats[sc._id].totalScore += s.promptScore || 0;
      stats[sc._id].misconceptionCount += (s.misconceptions || []).length;
      stats[sc._id].conceptHits += (s.abstractionMap || []).length;
    });
    const result = Object.values(stats).map(sc => ({
      ...sc,
      avgPromptScore: sc.sessions > 0 ? Math.round(sc.totalScore / sc.sessions) : 0,
      difficultyDrift: sc.sessions > 0 ? computeDifficultyDrift(sc.avgPromptScore, sc.difficulty) : 'unknown'
    }));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

function computeDifficultyDrift(avgScore, assignedDifficulty) {
  if (avgScore === 0) return 'unknown';
  if (assignedDifficulty === 'Beginner') return avgScore >= 90 ? 'correct' : 'needs_review';
  if (assignedDifficulty === 'Explorer') return avgScore >= 85 ? 'correct' : (avgScore >= 90 ? 'too_easy' : 'needs_review');
  if (assignedDifficulty === 'Builder') return avgScore >= 80 ? 'correct' : (avgScore >= 85 ? 'too_easy' : 'needs_review');
  return 'unknown';
}

module.exports = router;
