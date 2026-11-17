import { useState, useEffect } from 'react';

export function useHintEngine(caseStudyId, currentBlankIndex) {
  const [attempts, setAttempts] = useState({});

  // Reset all attempts when the case study changes
  useEffect(() => {
    setAttempts({});
  }, [caseStudyId]);

  const currentAttempts = attempts[currentBlankIndex] || 0;

  const recordIncorrectAttempt = () => {
    setAttempts((prev) => ({
      ...prev,
      [currentBlankIndex]: (prev[currentBlankIndex] || 0) + 1
    }));
  };

  const resetAttempts = () => {
    setAttempts({});
  };

  /**
   * Helper to retrieve progressive hint based on attempts.
   * @param {Object} token - Token object containing possible hints.
   * @returns {Object} { hint: string, level: number, reveal: boolean }
   */
  const getHintForToken = (token) => {
    const fallbackHint = token?.hint || 'Not quite, try a different option.';
    
    // Fallback if token.hints does not exist or is empty
    if (!token?.hints || typeof token.hints !== 'object') {
      if (currentAttempts >= 1) {
        return {
          hint: fallbackHint,
          level: 2, // Map to concept stage
          reveal: false
        };
      }
      return { hint: null, level: 0, reveal: false };
    }

    const { concept, syntax, example, explanation } = token.hints;

    // Hint level progression rules:
    // Attempt 1 (currentAttempts === 0): No hint.
    // Attempt 2 (currentAttempts === 1): Concept hint.
    // Attempt 3 (currentAttempts === 2): Syntax hint.
    // Attempt 4 (currentAttempts === 3): Example hint.
    // Attempt 5+ (currentAttempts >= 4): Explanation / Reveal.
    
    if (currentAttempts === 1) {
      return { hint: concept || fallbackHint, level: 1, reveal: false };
    } else if (currentAttempts === 2) {
      return { hint: syntax || concept || fallbackHint, level: 2, reveal: false };
    } else if (currentAttempts === 3) {
      return { hint: example || syntax || concept || fallbackHint, level: 3, reveal: false };
    } else if (currentAttempts >= 4) {
      return { 
        hint: `Explanation: ${explanation || fallbackHint} (Answer is: ${token.value})`, 
        level: 4, 
        reveal: true 
      };
    }

    return { hint: null, level: 0, reveal: false };
  };

  return {
    attempts: currentAttempts,
    recordIncorrectAttempt,
    resetAttempts,
    getHintForToken
  };
}
