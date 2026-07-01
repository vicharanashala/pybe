import { getQuestionsForConcept, findConceptKey, buildSessionAwareQuestions } from './quizGenerator.js';

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleOptions(question) {
  const shuffledOpts = shuffleArray(question.opts);
  const correctIdx = shuffledOpts.indexOf(question.a);
  return {
    ...question,
    opts: shuffledOpts,
    correctIdx
  };
}

export function generateQuestionPool(concept, poolSize = 7, session = null) {
  let pool = [];

  if (session) {
    const sessionQuestions = buildSessionAwareQuestions(session);
    pool = [...sessionQuestions];
  }

  let conceptKey = findConceptKey(concept);
  if (!conceptKey) {
    conceptKey = 'variables and arithmetic expressions';
  }
  const allQuestions = getQuestionsForConcept(conceptKey);

  const remainingSlots = poolSize - pool.length;
  if (remainingSlots > 0) {
    const shuffledGeneral = shuffleArray(allQuestions);
    const generalQuestions = shuffledGeneral
      .filter(q => !pool.some(p => p.q === q.q))
      .slice(0, remainingSlots);
    pool = [...pool, ...generalQuestions];
  }

  if (pool.length > poolSize) {
    pool = shuffleArray(pool).slice(0, poolSize);
  }

  return pool.map(shuffleOptions);
}

export function isCorrect(question, selectedIdx) {
  return selectedIdx === question.correctIdx;
}

export function getXpForAnswer(isCorrectAnswer, difficulty = 1) {
  if (isCorrectAnswer) {
    return 5 + difficulty * 2;
  }
  return 1;
}

export function calculateFinalScore(questions, answers) {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (isCorrect(questions[i], answers[i])) {
      correct++;
    }
  }
  return correct;
}

export function calculateAccuracy(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function buildFeedback(question, selectedIdx) {
  const correct = isCorrect(question, selectedIdx);
  return {
    isCorrect: correct,
    selectedIdx,
    correctIdx: question.correctIdx,
    explanation: question.exp,
    concept: question.concept,
    correctAnswer: question.opts[question.correctIdx],
    selectedAnswer: selectedIdx !== null ? question.opts[selectedIdx] : null
  };
}

export function shouldShowRetry(correct, total) {
  return correct < Math.ceil(total * 0.7);
}

export function getReviewConcepts(questions, answers) {
  const concepts = [];
  for (let i = 0; i < questions.length; i++) {
    if (!isCorrect(questions[i], answers[i])) {
      const concept = questions[i].concept;
      if (!concepts.includes(concept)) {
        concepts.push(concept);
      }
    }
  }
  return concepts;
}

export function getIncorrectQuestions(questions, answers) {
  const incorrect = [];
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] !== null && !isCorrect(questions[i], answers[i])) {
      incorrect.push({
        question: questions[i],
        selectedIdx: answers[i],
        correctIdx: questions[i].correctIdx,
        selectedAnswer: questions[i].opts[answers[i]],
        correctAnswer: questions[i].opts[questions[i].correctIdx],
        explanation: questions[i].exp,
        concept: questions[i].concept
      });
    }
  }
  return incorrect;
}