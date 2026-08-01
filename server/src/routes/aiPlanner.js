const express = require('express');
const store = require('../data/store');

const router = express.Router();

function generatePlan(sessions, scenarios, conceptMastery) {
  const weakConcepts = conceptMastery
    ? Object.entries(conceptMastery)
        .filter(([, s]) => s.level !== 'mastered')
        .sort((a, b) => a[1].avgPromptScore - b[1].avgPromptScore)
    : [];

  const masteredConcepts = conceptMastery
    ? Object.entries(conceptMastery).filter(([, s]) => s.level === 'mastered')
    : [];

  const attemptedIds = new Set(sessions.filter(s => s.scenario?._id).map(s => s.scenario._id));
  const unattempted = scenarios.filter(s => !attemptedIds.has(s._id));

  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.promptScore || 0), 0) / sessions.length)
    : 0;

  let targetDifficulty = 'Beginner';
  if (avgScore >= 85) targetDifficulty = 'Builder';
  else if (avgScore >= 70) targetDifficulty = 'Explorer';

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plan = [];

  for (let i = 0; i < 7; i++) {
    const dayPlan = { day: days[i], tasks: [], estimatedMinutes: 0 };

    if (i < 3 && weakConcepts.length > 0) {
      const weakConcept = weakConcepts[i % weakConcepts.length][0];
      const word = weakConcept.split(' ')[0].toLowerCase();
      const matchScenario = unattempted.find(s =>
        s.concepts.some(c => c.toLowerCase().includes(word)) && s.difficulty === targetDifficulty
      ) || unattempted.find(s => s.concepts.some(c => c.toLowerCase().includes(word)));

      if (matchScenario) {
        dayPlan.tasks.push({
          type: 'scenario',
          title: matchScenario.title,
          difficulty: matchScenario.difficulty,
          concepts: matchScenario.concepts,
          reason: `Practice "${weakConcept}" (currently ${weakConcepts[i % weakConcepts.length][1].avgPromptScore}% avg)`,
          estimatedMinutes: 15
        });
        dayPlan.estimatedMinutes += 15;
      } else {
        dayPlan.tasks.push({
          type: 'review',
          title: `Review "${weakConcept}"`,
          reason: `Strengthen your understanding of ${weakConcept}`,
          estimatedMinutes: 10
        });
        dayPlan.estimatedMinutes += 10;
      }
    } else if (i < 5) {
      const diffScenario = unattempted.find(s => s.difficulty === targetDifficulty) || unattempted[0];
      if (diffScenario) {
        dayPlan.tasks.push({
          type: 'scenario',
          title: diffScenario.title,
          difficulty: diffScenario.difficulty,
          concepts: diffScenario.concepts,
          reason: `Build proficiency at ${targetDifficulty} level`,
          estimatedMinutes: 15
        });
        dayPlan.estimatedMinutes += 15;
      }
    } else {
      if (masteredConcepts.length > 0) {
        dayPlan.tasks.push({
          type: 'challenge',
          title: 'Review and challenge',
          reason: 'Reinforce mastered concepts with a challenging scenario',
          estimatedMinutes: 20
        });
        dayPlan.estimatedMinutes += 20;
      } else {
        dayPlan.tasks.push({
          type: 'rest',
          title: 'Light review',
          reason: 'Review your progress and prepare for next week',
          estimatedMinutes: 10
        });
        dayPlan.estimatedMinutes += 10;
      }
    }

    plan.push(dayPlan);
  }

  return {
    summary: {
      totalSessions: sessions.length,
      averageScore: avgScore,
      targetDifficulty,
      weakConceptCount: weakConcepts.length,
      masteredConceptCount: masteredConcepts.length,
      unattemptedScenarios: unattempted.length
    },
    weeklyPlan: plan,
    tips: [
      weakConcepts.length > 0
        ? `Focus on "${weakConcepts[0][0]}" — your lowest-scoring concept.`
        : 'Great progress! Try harder scenarios to keep growing.',
      avgScore >= 80
        ? 'Your scores are strong. Push into Builder-level challenges.'
        : 'Aim for 80%+ by adding more context and specific reasoning.',
      'Spend 15-20 minutes per session for optimal learning.',
      'Review your mistakes — they reveal what to practice next.'
    ]
  };
}

router.get('/', async (_req, res, next) => {
  try {
    const [sessions, db] = await Promise.all([store.listSessions(), store.readDb()]);

    const perConceptStats = {};
    sessions.forEach(session => {
      (session.abstractionMap || []).forEach(m => {
        if (!perConceptStats[m.pythonConcept]) perConceptStats[m.pythonConcept] = { sessions: 0, totalScore: 0 };
        perConceptStats[m.pythonConcept].sessions += 1;
        perConceptStats[m.pythonConcept].totalScore += session.promptScore || 0;
      });
    });
    const conceptMastery = {};
    Object.entries(perConceptStats).forEach(([concept, stats]) => {
      const avg = stats.sessions > 0 ? Math.round(stats.totalScore / stats.sessions) : 0;
      conceptMastery[concept] = { sessions: stats.sessions, avgPromptScore: avg, level: avg >= 75 ? 'mastered' : avg >= 50 ? 'developing' : 'needs_work' };
    });

    const plan = generatePlan(sessions, db.scenarios, conceptMastery);
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

module.exports = router;