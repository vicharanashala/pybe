import { useState, useEffect, useRef } from 'react';

export function useLearningAnalytics(levelId) {
  const [metrics, setMetrics] = useState({
    totalAttempts: 0,
    wrongClicks: 0,
    hintsUsed: 0,
    firstTrySuccesses: 0,
    totalBlanks: 0,
    completionTime: 0,
    conceptStats: {} // { [conceptName]: { attempts: 0, wrong: 0, hints: 0 } }
  });

  const startTimeRef = useRef(Date.now());

  // Reset timer on level change
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [levelId]);

  const recordAttempt = (isCorrect, conceptName = 'General') => {
    setMetrics((prev) => {
      const stats = prev.conceptStats[conceptName] || { attempts: 0, wrong: 0, hints: 0 };
      const updatedStats = {
        ...stats,
        attempts: stats.attempts + 1,
        wrong: stats.wrong + (isCorrect ? 0 : 1)
      };

      return {
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        wrongClicks: prev.wrongClicks + (isCorrect ? 0 : 1),
        conceptStats: {
          ...prev.conceptStats,
          [conceptName]: updatedStats
        }
      };
    });
  };

  const recordHintUsed = (conceptName = 'General') => {
    setMetrics((prev) => {
      const stats = prev.conceptStats[conceptName] || { attempts: 0, wrong: 0, hints: 0 };
      const updatedStats = {
        ...stats,
        hints: stats.hints + 1
      };

      return {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        conceptStats: {
          ...prev.conceptStats,
          [conceptName]: updatedStats
        }
      };
    });
  };

  const recordBlankResolution = (wasFirstTry, conceptName = 'General') => {
    setMetrics((prev) => ({
      ...prev,
      totalBlanks: prev.totalBlanks + 1,
      firstTrySuccesses: prev.firstTrySuccesses + (wasFirstTry ? 1 : 0)
    }));
  };

  const stopTimer = () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    setMetrics((prev) => ({
      ...prev,
      completionTime: elapsedSeconds
    }));
  };

  const getSummary = () => {
    const accuracy = metrics.totalAttempts > 0 
      ? Math.round(((metrics.totalAttempts - metrics.wrongClicks) / metrics.totalAttempts) * 100)
      : 100;

    const firstTryRate = metrics.totalBlanks > 0 
      ? Math.round((metrics.firstTrySuccesses / metrics.totalBlanks) * 100)
      : 100;

    // Categorize strengths and needs practice based on conceptStats
    const strengths = [];
    const needsPractice = [];

    Object.entries(metrics.conceptStats).forEach(([concept, stat]) => {
      const conceptAccuracy = stat.attempts > 0 ? ((stat.attempts - stat.wrong) / stat.attempts) * 100 : 100;
      if (conceptAccuracy >= 80 && stat.hints === 0) {
        strengths.push(concept);
      } else if (conceptAccuracy < 80 || stat.hints > 0) {
        needsPractice.push(concept);
      }
    });

    // Provide default fallback values if no specific stats accumulated
    if (strengths.length === 0 && needsPractice.length === 0) {
      strengths.push('Syntax Mapping', 'Logic Flow');
    }

    // Rule-based insights & recommendations
    let recommendation = 'Replay Level';
    let insight = 'Great progress! Keep practice consistent to build muscle memory.';

    if (accuracy >= 90 && metrics.hintsUsed <= 1) {
      recommendation = 'Proceed to Challenge Level';
      insight = 'Excellent! You solved most coding blanks on your first try without checking hints.';
    } else if (metrics.hintsUsed > 3 || accuracy < 75) {
      recommendation = `Replay Level ${levelId}`;
      insight = 'You struggled with some of the trickier options and required guidance. Try reviewing the concepts.';
    } else {
      recommendation = 'Try Next Level';
      insight = 'Good effort! You utilized hints well to navigate correct answers.';
    }

    return {
      accuracy,
      firstTryRate,
      strengths,
      needsPractice,
      insight,
      recommendation,
      completionTime: metrics.completionTime,
      totalAttempts: metrics.totalAttempts,
      wrongClicks: metrics.wrongClicks,
      hintsUsed: metrics.hintsUsed
    };
  };

  return {
    metrics,
    recordAttempt,
    recordHintUsed,
    recordBlankResolution,
    stopTimer,
    getSummary
  };
}
