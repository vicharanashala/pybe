const express = require('express');
const store = require('../data/store');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const sessions = await store.listSessions();
    const db = await store.readDb();

    if (sessions.length === 0) {
      return res.json({
        overview: { totalSessions: 0, totalScenarios: db.scenarios.length, averageScore: 0, overallLevel: 'Not started' },
        trends: { scoreTrend: 'none', paceTrend: 'none' },
        predictions: { estimatedMastery: 'Complete more sessions to estimate', projectedScore: 0 },
        insights: ['Start with a Beginner scenario to begin your learning journey.'],
        conceptBreakdown: [],
        timeAnalysis: { totalTime: 0, averageTime: 0 },
        difficultyProgression: { beginner: 0, explorer: 0, builder: 0 },
        misconceptionTrends: [],
        weeklyActivity: []
      });
    }

    const totalScore = sessions.reduce((sum, s) => sum + (s.promptScore || 0), 0);
    const averageScore = Math.round(totalScore / sessions.length);
    const totalTime = sessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
    const averageTime = sessions.length > 0 ? Math.round(totalTime / sessions.length) : 0;

    let overallLevel = 'Beginner';
    if (averageScore >= 85) overallLevel = 'Advanced';
    else if (averageScore >= 70) overallLevel = 'Intermediate';
    else if (averageScore >= 50) overallLevel = 'Developing';

    const scores = sessions.map(s => s.promptScore || 0);
    const recentScores = scores.slice(0, 5);
    const olderScores = scores.slice(5, 10);
    const recentAvg = recentScores.length > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length) : 0;
    const olderAvg = olderScores.length > 0 ? Math.round(olderScores.reduce((a, b) => a + b, 0) / olderScores.length) : 0;
    const scoreTrend = recentAvg > olderAvg + 5 ? 'improving' : recentAvg < olderAvg - 5 ? 'declining' : 'stable';

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

    const masteredCount = Object.values(conceptMastery).filter(c => c.level === 'mastered').length;
    const totalConcepts = Object.keys(conceptMastery).length;

    const difficultyProgression = { beginner: 0, explorer: 0, builder: 0 };
    sessions.forEach(s => {
      const d = s.scenario?.difficulty?.toLowerCase();
      if (d === 'beginner') difficultyProgression.beginner++;
      else if (d === 'explorer') difficultyProgression.explorer++;
      else if (d === 'builder') difficultyProgression.builder++;
    });

    const misconceptionCounts = {};
    sessions.forEach(s => {
      (s.misconceptions || []).forEach(m => {
        misconceptionCounts[m] = (misconceptionCounts[m] || 0) + 1;
      });
    });
    const misconceptionTrends = Object.entries(misconceptionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text, count }));

    const dailyCounts = {};
    sessions.forEach(s => {
      const day = s.createdAt.slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    const weeklyActivity = Object.entries(dailyCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, count]) => ({ date, count }));

    const insights = [];
    if (scoreTrend === 'improving') insights.push('Your scores are trending upward — great progress!');
    else if (scoreTrend === 'declining') insights.push('Scores are dipping slightly. Review weak concepts for a boost.');
    else insights.push('Scores are stable. Try harder scenarios to push forward.');

    if (masteredCount > 0) insights.push(`You've mastered ${masteredCount} concept${masteredCount !== 1 ? 's' : ''}. ${masteredCount >= 3 ? 'Excellent progress!' : 'Keep building on this momentum.'}`);

    const weakest = Object.entries(conceptMastery).sort((a, b) => a[1].avgPromptScore - b[1].avgPromptScore)[0];
    if (weakest) insights.push(`Focus area: "${weakest[0]}" with ${weakest[1].avgPromptScore}% average.`);

    if (difficultyProgression.builder > 0) insights.push("You've reached Builder-level scenarios — advanced territory!");
    else if (difficultyProgression.explorer > 0) insights.push('Explorer level unlocked. Builder-level is within reach.');

    const projectedScore = Math.min(100, averageScore + Math.round((100 - averageScore) * 0.1));
    const estimatedMastery = masteredCount >= 5 ? 'Strong foundation — ready for advanced topics' :
      masteredCount >= 2 ? 'Building solid understanding — keep practicing' :
      'Early stage — focus on core concepts';

    const conceptBreakdown = Object.entries(conceptMastery)
      .sort((a, b) => b[1].sessions - a[1].sessions)
      .map(([name, stats]) => ({ name, ...stats }));

    res.json({
      overview: { totalSessions: sessions.length, totalScenarios: db.scenarios.length, averageScore, overallLevel },
      trends: { scoreTrend, paceTrend: weeklyActivity.length > 3 ? 'active' : 'low' },
      predictions: { estimatedMastery, projectedScore },
      insights,
      conceptBreakdown,
      timeAnalysis: { totalTime, averageTime },
      difficultyProgression,
      misconceptionTrends,
      weeklyActivity
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;