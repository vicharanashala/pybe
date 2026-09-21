import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function FinalQuizModal({
  quizQuestions = [],
  onCompleted
}) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = quizQuestions[currentQIndex];

  const handleSelectAnswer = (optIndex, isCorrect) => {
    if (selectedAnswers[currentQIndex] !== undefined) return;

    setSelectedAnswers({ ...selectedAnswers, [currentQIndex]: optIndex });

    if (isCorrect) {
      setScore(s => s + 1);
      SoundService.playSuccess();
    } else {
      SoundService.playSadWobble();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < quizQuestions.length) {
      setCurrentQIndex(currentQIndex + 1);
      SoundService.playPop();
    } else {
      setIsFinished(true);
      SoundService.playFanfare();
    }
  };

  if (!question && !isFinished) return null;

  const currentSelection = selectedAnswers[currentQIndex];

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <span style={{ fontFamily: 'Fredoka', fontSize: '1.25rem', fontWeight: 700, color: '#065F46' }}>
          🐾 Magic Pet Shop Story Quiz
        </span>
        <span className="quiz-counter">
          Question {currentQIndex + 1} of {quizQuestions.length} ⭐
        </span>
      </div>

      {!isFinished && question ? (
        <>
          <div className="story-choice-q" style={{ color: '#047857' }}>
            {question.question}
          </div>

          <div className="story-choice-options">
            {question.options.map((opt, idx) => {
              let btnClass = 'btn-story-option';
              if (currentSelection !== undefined) {
                if (idx === currentSelection) {
                  btnClass += opt.correct ? ' correct' : ' incorrect';
                } else if (opt.correct) {
                  btnClass += ' correct';
                }
              }

              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => handleSelectAnswer(idx, opt.correct)}
                  disabled={currentSelection !== undefined}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {currentSelection !== undefined && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Fredoka', color: '#047857', fontWeight: 600 }}>
                💡 {question.explanation}
              </span>
              <button className="btn-bouncy btn-next" onClick={handleNextQuestion}>
                {currentQIndex + 1 < quizQuestions.length ? 'Next Question' : 'See Results 🏆'} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Award size={64} color="#F59E0B" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'Fredoka', fontSize: '1.8rem', color: '#B45309', margin: 0 }}>
            Quiz Completed! Score: {score}/{quizQuestions.length} ⭐
          </h3>
          <p style={{ fontFamily: 'Nunito', fontSize: '1.15rem', color: '#475569', margin: '8px 0 20px' }}>
            {score >= 8
              ? "🌟 Incredible mastery! You deeply understand why and how Encapsulation works!"
              : "👏 Great effort! You've learned how data and safe methods work together in Python!"}
          </p>
          <button className="btn-bouncy btn-next" onClick={onCompleted} style={{ fontSize: '1.2rem', padding: '12px 32px' }}>
            Go to Graduation Ceremony 🎉
          </button>
        </div>
      )}
    </div>
  );
}
