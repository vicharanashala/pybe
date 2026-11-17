import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, X, Flame } from 'lucide-react';

export default function QuizModal({ quiz, lessonTitle, onAddXp, onClose, onNextLesson }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(1);

  const letters = ['A', 'B', 'C', 'D'];

  const handleSubmit = (idx) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
    setIsSubmitted(true);

    if (idx === quiz.correctIndex) {
      setIsCorrect(true);
      onAddXp(50);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      setIsCorrect(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSubmitted) return;
      const key = e.key.toUpperCase();
      const idx = letters.indexOf(key);
      if (idx !== -1 && idx < quiz.options.length) {
        handleSubmit(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, quiz.options.length]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-panel glass-card max-w-2xl border-purple-500/40 p-6 md:p-8 flex flex-col gap-6"
        style={{ border: '1px solid rgba(139,92,246,0.35)' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.30)' }}>
              <HelpCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Interactive Concept Check</h3>
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> +50 XP
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">{lessonTitle}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Container */}
        <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 shadow-inner">
          <h4 className="font-bold text-base md:text-lg text-purple-100 leading-snug">
            {quiz.question}
          </h4>
        </div>

        {/* Multiple Choice Options */}
        <div className="flex flex-col gap-3">
          {quiz.options.map((option, idx) => {
            let stateClass = '';
            if (isSubmitted) {
              if (idx === quiz.correctIndex) {
                stateClass = 'correct';
              } else if (idx === selectedIdx) {
                stateClass = 'wrong';
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleSubmit(idx)}
                disabled={isSubmitted}
                className={`quiz-option ${stateClass}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="quiz-letter">
                  {letters[idx]}
                </div>
                <span className="flex-1 font-medium text-sm md:text-base leading-relaxed">{option}</span>
                {isSubmitted && idx === quiz.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                {isSubmitted && idx === selectedIdx && idx !== quiz.correctIndex && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Results Banner */}
        {isSubmitted && (
          <div 
            className={`p-5 rounded-2xl border flex flex-col gap-2.5 animate-slide-up ${
              isCorrect ? 'bg-green-950/40 border-green-500/40 text-green-200' : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-base">
              {isCorrect ? (
                <>
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-green-300">Spot on! +50 XP Earned!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">Not quite! Let's review:</span>
                </>
              )}
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-gray-300 font-medium">
              {quiz.explanation}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        {isSubmitted && (
          <div className="flex items-center justify-between border-t border-purple-500/20 pt-4">
            <span className="text-xs text-gray-400 font-medium">
              {isCorrect ? 'Great job! Ready for the next challenge?' : 'Review the concept and keep exploring!'}
            </span>
            <button 
              onClick={() => { onClose(); if (onNextLesson) onNextLesson(); }}
              className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
            >
              <span>Continue Adventure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
