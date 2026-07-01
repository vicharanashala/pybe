import { useState, useEffect } from 'react';
import { generateQuestionPool, getReviewConcepts, getIncorrectQuestions } from '../utils/quizEngine';
import { getScoreCategory, getScoreMessage, getPersonalizedFeedback, recommendNextScenario } from '../utils/quizScoring';

const QUIZ_LENGTH = 7;
const MAX_HEARTS = 3;

export function QuizPage({ quizData, setQuizData, xp, setXp, onExit, scenarios, onSelectScenario }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const diff = quizData.difficulty || 1;
    const session = quizData.session || null;
    const pool = generateQuestionPool(quizData.concept, QUIZ_LENGTH, session);
    setQuestions(pool);
    setAnswers(new Array(pool.length).fill(null));
    setCurrentIndex(0);
    setShowFeedback(false);
    setSessionCorrect(0);
    setSessionXp(0);
    setHearts(MAX_HEARTS);
    setGameOver(false);
    setQuizStarted(true);
  }, [quizData.concept, quizData.difficulty]);

  if (!quizStarted || questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="quiz-loading-icon">&#128640;</div>
          <h2>Preparing your quiz...</h2>
          <p>Personalizing questions based on your session</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const reviewConcepts = getConceptsToReview(questions, answers);
    const incorrect = getIncorrectQuestions(questions, answers);

    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <button className="quiz-exit" onClick={onExit}>&#8592; Back to Learning</button>
          <span>XP: {xp}</span>
        </div>
        <div className="quiz-card quiz-game-over">
          <div className="quiz-game-over-icon">&#128148;</div>
          <h2>Practice Complete</h2>
          <p>Review your mistakes before trying again.</p>

          {incorrect.length > 0 && (
            <div className="quiz-review-section">
              <h3>Questions to Review</h3>
              {incorrect.map((item, idx) => (
                <div key={idx} className="quiz-review-item">
                  <p className="review-question"><strong>Q:</strong> {item.question.q}</p>
                  <p className="review-correct"><strong>Correct:</strong> {item.correctAnswer}</p>
                  <p className="review-explanation"><strong>Why:</strong> {item.explanation}</p>
                  <p className="review-concept">Concept: {item.concept}</p>
                </div>
              ))}
            </div>
          )}

          <div className="quiz-end-actions">
            <button className="secondary quiz-retry" onClick={() => {
              const session = quizData.session || null;
              const pool = generateQuestionPool(quizData.concept, QUIZ_LENGTH, session);
              setQuestions(pool);
              setAnswers(new Array(pool.length).fill(null));
              setCurrentIndex(0);
              setShowFeedback(false);
              setSessionCorrect(0);
              setSessionXp(0);
              setHearts(MAX_HEARTS);
              setGameOver(false);
            }}>
              &#8635; Retry Quiz
            </button>
            <button className="primary quiz-continue" onClick={onExit}>
              Return to Learning &#8594;
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isCurrentAnswered = currentAnswer !== null;
  const isFinished = currentIndex >= questions.length;
  const hasPrevious = currentIndex > 0;
  const difficulty = quizData.difficulty || 1;
  const progressPct = Math.round((currentIndex / questions.length) * 100);

  function handleSelect(idx) {
    if (showFeedback) return;
    const correct = idx === currentQuestion.correctIdx;
    const earnedXp = correct ? 5 + difficulty * 2 : 1;
    const newXp = xp + earnedXp;
    setXp(newXp);
    localStorage.setItem('pybe_xp', String(newXp));

    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
    setShowFeedback(true);
    if (correct) {
      setSessionCorrect(prev => prev + 1);
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setTimeout(() => setGameOver(true), 1500);
      }
    }
    setSessionXp(prev => prev + earnedXp);
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(answers[currentIndex + 1] !== null);
    } else {
      setCurrentIndex(questions.length);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowFeedback(answers[currentIndex - 1] !== null);
    }
  }

  function handleFinish() {
    setQuizData(prev => ({
      ...prev,
      score: (prev.score || 0) + sessionCorrect,
      questionsSeen: (prev.questionsSeen || 0) + questions.length
    }));
    onExit();
  }

  if (isFinished) {
    const pct = Math.round((sessionCorrect / questions.length) * 100);
    const category = getScoreCategory(sessionCorrect, questions.length);
    const message = getScoreMessage(category);
    const reviewConcepts = getConceptsToReview(questions, answers);
    const incorrect = getIncorrectQuestions(questions, answers);
    const personalizedFeedback = getPersonalizedFeedback(sessionCorrect, questions.length, quizData.session, reviewConcepts);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const timeLabel = timeTaken < 60 ? `${timeTaken}s` : `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;
    const recommendedScenario = recommendNextScenario(scenarios, quizData.scenario, quizData.session, reviewConcepts);

    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <button className="quiz-exit" onClick={onExit}>&#8592; Back</button>
          <span>XP: {xp}</span>
        </div>

        {pct === 100 && (
          <div className="quiz-confetti">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#d8f07c', '#4a9a20', '#f59e0b', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 5)]
              }} />
            ))}
          </div>
        )}

        <div className="quiz-card quiz-end">
          <div className="quiz-end-icon">
            {pct >= 70 ? '&#127942;' : pct >= 50 ? '&#128516;' : '&#128528;'}
          </div>
          <h2>Quiz Summary</h2>
          <p className="quiz-personalized-feedback">{personalizedFeedback}</p>

          <div className="quiz-end-stats">
            <div className="quiz-end-stat">
              <span className="quiz-end-num">{sessionCorrect}/{questions.length}</span>
              <small>Correct</small>
            </div>
            <div className="quiz-end-stat">
              <span className="quiz-end-num">{pct}%</span>
              <small>Accuracy</small>
            </div>
            <div className="quiz-end-stat">
              <span className="quiz-end-num">+{sessionXp}</span>
              <small>XP Earned</small>
            </div>
            <div className="quiz-end-stat">
              <span className="quiz-end-num">{timeLabel}</span>
              <small>Time</small>
            </div>
          </div>

          {incorrect.length > 0 && (
            <div className="quiz-review-section">
              <h3>Questions to Review</h3>
              {incorrect.map((item, idx) => (
                <div key={idx} className="quiz-review-item">
                  <p className="review-question"><strong>Question:</strong> {item.question.q}</p>
                  <p className="review-correct"><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                  <p className="review-explanation"><strong>Why it is correct:</strong> {item.explanation}</p>
                  <p className="review-concept">Python Concept: <span className="review-concept-tag">{item.concept}</span></p>
                </div>
              ))}
            </div>
          )}

          {recommendedScenario && (
            <div className="quiz-recommended">
              <h3>Recommended Next Challenge</h3>
              <div className="quiz-recommended-card">
                <div className="recommended-scenario-info">
                  <strong>{recommendedScenario.title}</strong>
                  <span className="recommended-difficulty">{recommendedScenario.difficulty}</span>
                  <p>{recommendedScenario.concepts?.join(' / ')}</p>
                </div>
                <button
                  className="primary recommended-start"
                  onClick={() => {
                    handleFinish();
                    if (onSelectScenario) {
                      setTimeout(() => onSelectScenario(recommendedScenario), 100);
                    }
                  }}
                >
                  Start Next Scenario &#8594;
                </button>
              </div>
            </div>
          )}

          <div className="quiz-end-actions">
            <button className="secondary quiz-retry" onClick={() => {
              const session = quizData.session || null;
              const pool = generateQuestionPool(quizData.concept, QUIZ_LENGTH, session);
              setQuestions(pool);
              setAnswers(new Array(pool.length).fill(null));
              setCurrentIndex(0);
              setShowFeedback(false);
              setSessionCorrect(0);
              setSessionXp(0);
              setHearts(MAX_HEARTS);
              setGameOver(false);
            }}>
              &#8635; Retry Quiz
            </button>
            <button className="primary quiz-continue" onClick={handleFinish}>
              Continue Learning &#8594;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="quiz-exit" onClick={onExit}>&#8592; Back</button>
        <div className="quiz-hearts">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={`heart ${i < hearts ? 'active' : 'lost'}`}>
              {i < hearts ? '\u2764\ufe0f' : '\u2661'}
            </span>
          ))}
        </div>
        <span className="quiz-score">Score: {sessionCorrect}</span>
      </div>

      <div className="quiz-progress-container">
        <div className="quiz-progress-info">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPct}% complete</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="quiz-card">
        <div className="quiz-concept">{currentQuestion.concept}</div>
        {currentQuestion.isSessionAware && (
          <div className="quiz-session-badge">Based on your session</div>
        )}
        <h2 className="quiz-question">{currentQuestion.q}</h2>

        <div className="quiz-options">
          {currentQuestion.opts.map((opt, idx) => {
            let cls = 'quiz-option';
            if (showFeedback) {
              if (idx === currentQuestion.correctIdx) {
                cls += ' reveal correct-anim';
              } else if (idx === currentAnswer) {
                cls += ' wrong wrong-anim';
              }
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={showFeedback}
              >
                <span className="quiz-option-marker">{String.fromCharCode(65 + idx)}</span>
                <span className="quiz-option-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`quiz-feedback${currentAnswer === currentQuestion.correctIdx ? ' correct' : ' wrong'}`}>
            <div className="quiz-feedback-header">
              {currentAnswer === currentQuestion.correctIdx ? (
                <span className="feedback-icon correct">&#10003;</span>
              ) : (
                <span className="feedback-icon wrong">&#10007;</span>
              )}
              <strong>{currentAnswer === currentQuestion.correctIdx ? 'Correct!' : 'Not quite right'}</strong>
            </div>
            {currentAnswer !== currentQuestion.correctIdx && (
              <p className="quiz-feedback-selected">
                You selected: <em>{currentQuestion.opts[currentAnswer]}</em>
              </p>
            )}
            <p className="quiz-feedback-why">{currentQuestion.exp}</p>
            <p className="quiz-feedback-concept">This reinforces: <strong>{currentQuestion.concept}</strong></p>
          </div>
        )}

        <div className="quiz-nav">
          {hasPrevious && (
            <button className="secondary quiz-prev" onClick={handlePrevious} disabled={!isCurrentAnswered}>&#8592; Previous</button>
          )}
          <button className="primary quiz-next" onClick={handleNext} disabled={!showFeedback}>
            {currentIndex + 1 < questions.length ? 'Next Question \u2192' : 'See Results \u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}