const store = require('../data/store');

class LearningPathGenerator {
  constructor() {
    this.conceptDifficultyMap = {
      'Beginner': ['variables', 'strings', 'arithmetic', 'comparisons', 'lists'],
      'Explorer': ['conditionals', 'loops', 'filtering', 'dictionaries', 'search'],
      'Builder': ['functions', 'while loops', 'validation', 'mutation', 'formatting']
    };
  }

  analyzePerformance(sessions) {
    const conceptScores = {};
    const difficultyScores = {};
    let totalScore = 0;
    let completedSessions = 0;

    sessions.forEach(session => {
      if (session.status === 'completed') {
        completedSessions++;
        totalScore += session.score || 0;
        
        // Analyze concept mastery
        if (session.abstractionMap) {
          session.abstractionMap.forEach(map => {
            if (!conceptScores[map.pythonConcept]) {
              conceptScores[map.pythonConcept] = { total: 0, count: 0 };
            }
            conceptScores[map.pythonConcept].total += 1;
            conceptScores[map.pythonConcept].count += 1;
          });
        }
      }
    });

    // Calculate average scores
    const avgScore = completedSessions > 0 ? totalScore / completedSessions : 0;
    
    // Find weak concepts
    const weakConcepts = Object.entries(conceptScores)
      .map(([concept, data]) => ({
        concept,
        average: data.total / data.count
      }))
      .filter(item => item.average < 70)
      .sort((a, b) => a.average - b.average);

    return {
      totalSessions: sessions.length,
      completedSessions,
      averageScore: avgScore,
      weakConcepts,
      conceptScores
    };
  }

  getProgressAnalytics(sessions) {
    const completed = sessions.filter(s => s.status === 'completed');
    const inProgress = sessions.filter(s => s.status !== 'completed');
    
    // Group by difficulty
    const byDifficulty = {};
    completed.forEach(s => {
      const diff = s.scenario?.difficulty || 'Unknown';
      if (!byDifficulty[diff]) byDifficulty[diff] = [];
      byDifficulty[diff].push(s);
    });

    // Calculate mastery by concept
    const conceptMastery = {};
    completed.forEach(s => {
      s.abstractionMap?.forEach(map => {
        if (!conceptMastery[map.pythonConcept]) {
          conceptMastery[map.pythonConcept] = { attempts: 0, successes: 0 };
        }
        conceptMastery[map.pythonConcept].attempts++;
        if (map.success) conceptMastery[map.pythonConcept].successes++;
      });
    });

    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      inProgressSessions: inProgress.length,
      byDifficulty,
      conceptMastery,
      averageScore: completed.length > 0 
        ? completed.reduce((sum, s) => sum + (s.score || 0), 0) / completed.length 
        : 0
    };
  }

  generateLearningPath(sessions) {
    const analysis = this.analyzePerformance(sessions);
    
    // Determine next difficulty
    let nextDifficulty = 'Beginner';
    if (analysis.averageScore > 80 && analysis.completedSessions > 3) {
      nextDifficulty = 'Builder';
    } else if (analysis.averageScore > 60 && analysis.completedSessions > 1) {
      nextDifficulty = 'Explorer';
    }

    // Get recommendations
    const recommendations = this.getRecommendedScenarios(
      analysis.weakConcepts, 
      nextDifficulty
    );

    return {
      nextDifficulty,
      analysis,
      recommendations,
      weakConcepts: analysis.weakConcepts,
      totalSessions: analysis.totalSessions,
      averageScore: analysis.averageScore,
      progress: analysis.completedSessions > 0 
        ? Math.min(100, Math.round((analysis.completedSessions / 10) * 100))
        : 0
    };
  }

  getRecommendedScenarios(weakConcepts, difficulty) {
    // This would ideally fetch from store, but we'll return mock data
    const recommendations = [];
    
    if (weakConcepts.length > 0) {
      // Recommend scenarios targeting weak concepts
      const conceptNames = weakConcepts.map(w => w.concept);
      recommendations.push({
        title: 'Practice: ' + conceptNames.join(' & '),
        description: `Focus on mastering ${conceptNames.join(', ')}`,
        difficulty: difficulty,
        concepts: conceptNames,
        recommended: true
      });
    }

    // Add general recommendations
    recommendations.push({
      title: 'Next Challenge',
      description: 'Progress to the next level',
      difficulty: difficulty,
      concepts: this.conceptDifficultyMap[difficulty] || ['variables'],
      recommended: false
    });

    return recommendations;
  }

  async saveSession(sessionData) {
    // Read current sessions
    const db = await store.readDb();
    const sessions = await store.listSessions();
    
    // Add session
    sessions.push(sessionData);
    
    // Generate updated learning path
    return this.generateLearningPath(sessions);
  }

  async getRecommendations(sessions) {
    const analysis = this.analyzePerformance(sessions);
    return this.getRecommendedScenarios(
      analysis.weakConcepts,
      analysis.averageScore > 70 ? 'Builder' : 'Explorer'
    );
  }
}

module.exports = new LearningPathGenerator();