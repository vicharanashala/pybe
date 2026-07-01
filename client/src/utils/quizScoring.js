export function calculateXpForQuiz(answers, questions, difficulty) {
  let totalXp = 0;
  for (let i = 0; i < questions.length; i++) {
    const isCorrect = answers[i] !== null && questions[i].correctIdx === answers[i];
    totalXp += isCorrect ? (5 + difficulty * 2) : 1;
  }
  return totalXp;
}

export function calculateQuizScore(questions, answers) {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] !== null && questions[i].correctIdx === answers[i]) {
      correct++;
    }
  }
  return { correct, total: questions.length };
}

export function getScoreCategory(score, total) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct >= 90) return 'excellent';
  if (pct >= 70) return 'good';
  if (pct >= 50) return 'fair';
  return 'needs_review';
}

export function getScoreMessage(category) {
  switch (category) {
    case 'excellent':
      return 'Outstanding! You have mastered this concept.';
    case 'good':
      return 'Good work! A little more practice and you will nail it.';
    case 'fair':
      return 'Not bad! Review the concepts below to strengthen your understanding.';
    case 'needs_review':
      return 'Keep practicing! Focus on the concepts flagged below.';
    default:
      return 'Great effort!';
  }
}

export function getConceptsToReview(questions, answers) {
  const review = [];
  const seen = new Set();
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] !== null && questions[i].correctIdx !== answers[i]) {
      const c = questions[i].concept;
      if (!seen.has(c)) {
        seen.add(c);
        review.push(c);
      }
    }
  }
  return review;
}

export function getPersonalizedFeedback(score, total, session, incorrectConcepts) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const concept = session?.abstractionMap?.[0]?.pythonConcept || 'Python concepts';
  const pattern = session?.abstractionMap?.[0]?.pattern || '';

  let feedback = '';

  if (pct === 100) {
    feedback = `Perfect score! You clearly understand ${concept}.`;
    if (pattern) {
      feedback += ` Your reasoning about "${pattern}" shows strong computational thinking.`;
    }
    feedback += ' You are ready for the next challenge!';
  } else if (pct >= 80) {
    feedback = `Excellent work! You clearly understand ${concept}.`;
    if (incorrectConcepts.length > 0) {
      feedback += ` Keep practicing ${incorrectConcepts.join(' and ')} to reach mastery.`;
    } else {
      feedback += ' You are improving rapidly.';
    }
  } else if (pct >= 60) {
    feedback = `Good progress! You are getting familiar with ${concept}.`;
    if (incorrectConcepts.length > 0) {
      feedback += ` Spend more time on ${incorrectConcepts.join(' and ')} to strengthen your understanding.`;
    }
    feedback += ' Keep solving problems and you will master this.';
  } else {
    feedback = `You are building foundations with ${concept}.`;
    if (incorrectConcepts.length > 0) {
      feedback += ` Focus on understanding ${incorrectConcepts.join(' and ')} better before moving forward.`;
    }
    feedback += ' Review the explanations and try again.';
  }

  return feedback;
}

export function recommendNextScenario(scenarios, currentScenario, session, incorrectConcepts) {
  if (!scenarios || scenarios.length === 0) return null;

  const currentConcept = session?.abstractionMap?.[0]?.pythonConcept || '';
  const currentDifficulty = currentScenario?.difficulty || 'Beginner';

  const difficultyOrder = { 'Beginner': 0, 'Explorer': 1, 'Builder': 2 };
  const currentDifficultyLevel = difficultyOrder[currentDifficulty] || 0;

  let recommended = null;
  let bestScore = -1;

  for (const scenario of scenarios) {
    if (scenario._id === currentScenario?._id) continue;

    let score = 0;

    const scenarioConcepts = scenario.concepts || [];
    if (scenarioConcepts.some(c => c.toLowerCase().includes(currentConcept.toLowerCase()))) {
      score += 3;
    }

    if (incorrectConcepts.length > 0) {
      if (scenarioConcepts.some(c => incorrectConcepts.some(ic => c.toLowerCase().includes(ic.toLowerCase())))) {
        score += 2;
      }
    }

    const scenarioLevel = difficultyOrder[scenario.difficulty] || 0;
    if (scenarioLevel === currentDifficultyLevel) {
      score += 1;
    } else if (scenarioLevel === currentDifficultyLevel + 1) {
      score += 0.5;
    }

    if (score > bestScore) {
      bestScore = score;
      recommended = scenario;
    }
  }

  return recommended;
}

export function persistQuizProgress(quizKey, data) {
  try {
    localStorage.setItem(`pybe_quiz_${quizKey}`, JSON.stringify({
      ...data,
      savedAt: Date.now()
    }));
  } catch (e) {
    console.warn('Could not save quiz progress', e);
  }
}

export function loadQuizProgress(quizKey) {
  try {
    const raw = localStorage.getItem(`pybe_quiz_${quizKey}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = Date.now() - data.savedAt;
    if (age > 30 * 60 * 1000) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export function clearQuizProgress(quizKey) {
  try {
    localStorage.removeItem(`pybe_quiz_${quizKey}`);
  } catch (e) {
    console.warn('Could not clear quiz progress', e);
  }
}