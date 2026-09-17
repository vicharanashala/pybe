// server/src/routes/learningPath.js
const express = require('express');
const store = require('../data/store');

const router = express.Router();

// GET /api/learning-path - Get learning path
router.get('/', async (req, res, next) => {
  try {
    const sessions = await store.listSessions();
    const db = await store.readDb();
    
    // Calculate totals
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    
    // Calculate average score
    let avgScore = 0;
    if (sessions.length > 0) {
      const totalScore = sessions.reduce((sum, s) => sum + (s.promptScore || 0), 0);
      avgScore = Math.round(totalScore / sessions.length);
    }
    
    // Calculate progress (each session = 10%, max 100%)
    const progress = Math.min(100, Math.round((totalSessions / 10) * 100));
    
    // Determine next difficulty
    let nextDifficulty = 'Beginner';
    if (avgScore > 80 && completedSessions > 3) {
      nextDifficulty = 'Builder';
    } else if (avgScore > 60 && completedSessions > 1) {
      nextDifficulty = 'Explorer';
    }
    
    // Get weak concepts from sessions
    const conceptScores = {};
    sessions.forEach(session => {
      if (session.abstractionMap) {
        session.abstractionMap.forEach(map => {
          const concept = map.pythonConcept || 'unknown';
          if (!conceptScores[concept]) {
            conceptScores[concept] = { total: 0, count: 0 };
          }
          conceptScores[concept].total += session.promptScore || 0;
          conceptScores[concept].count += 1;
        });
      }
    });
    
    // Calculate average per concept and find weak ones
    const weakConcepts = Object.entries(conceptScores)
      .map(([concept, data]) => ({
        concept: concept,
        average: data.count > 0 ? Math.round(data.total / data.count) : 0
      }))
      .filter(item => item.average < 70)
      .sort((a, b) => a.average - b.average);
    
    // If no weak concepts from abstraction map, check sessions for patterns
    if (weakConcepts.length === 0 && sessions.length > 0) {
      // Look for patterns in session data
      const conceptPatterns = {};
      sessions.forEach(session => {
        if (session.masterySignals && session.masterySignals.length > 0) {
          session.masterySignals.forEach(signal => {
            if (!conceptPatterns[signal]) conceptPatterns[signal] = 0;
            conceptPatterns[signal]++;
          });
        }
      });
      
      // Add any concepts with low mastery
      Object.entries(conceptPatterns).forEach(([concept, count]) => {
        if (count < sessions.length * 0.5) { // Less than 50% mastery
          weakConcepts.push({
            concept: concept,
            average: Math.round((count / sessions.length) * 100)
          });
        }
      });
    }
    
    // Get recommendations from scenarios
    const scenarios = db.scenarios || [];
    const recommendations = [];
    
    // First, recommend based on weak concepts
    if (weakConcepts.length > 0) {
      const conceptNames = weakConcepts.map(w => w.concept);
      const matchingScenarios = scenarios.filter(s => 
        s.concepts && s.concepts.some(c => 
          conceptNames.some(wc => c.toLowerCase().includes(wc.toLowerCase()))
        )
      );
      
      matchingScenarios.slice(0, 3).forEach(scenario => {
        recommendations.push({
          title: scenario.title,
          description: `Practice ${scenario.concepts ? scenario.concepts.join(' & ') : 'concepts'}`,
          difficulty: scenario.difficulty || 'Beginner',
          concepts: scenario.concepts || [],
          recommended: true,
          _id: scenario._id
        });
      });
    }
    
    // If no weak concept recommendations, suggest by difficulty
    if (recommendations.length === 0) {
      const nextScenarios = scenarios.filter(s => s.difficulty === nextDifficulty);
      nextScenarios.slice(0, 3).forEach(scenario => {
        recommendations.push({
          title: scenario.title,
          description: `Level up with ${scenario.concepts ? scenario.concepts.join(' & ') : 'concepts'}`,
          difficulty: scenario.difficulty || 'Beginner',
          concepts: scenario.concepts || [],
          recommended: false,
          _id: scenario._id
        });
      });
    }
    
    // Fallback: If still no recommendations, show any scenarios
    if (recommendations.length === 0 && scenarios.length > 0) {
      scenarios.slice(0, 3).forEach(scenario => {
        recommendations.push({
          title: scenario.title,
          description: `Start with ${scenario.concepts ? scenario.concepts.join(' & ') : 'Python concepts'}`,
          difficulty: scenario.difficulty || 'Beginner',
          concepts: scenario.concepts || [],
          recommended: false,
          _id: scenario._id
        });
      });
    }
    
    res.json({
      nextDifficulty,
      totalSessions,
      completedSessions,
      averageScore: avgScore,
      weakConcepts: weakConcepts.slice(0, 5),
      recommendations: recommendations.slice(0, 5),
      progress: progress,
      totalScenarios: scenarios.length
    });
  } catch (error) {
    console.error('Learning path error:', error);
    next(error);
  }
});

module.exports = router;