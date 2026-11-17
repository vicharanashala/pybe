import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, Trophy, AlertCircle, Unlock } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is recursion?",
    options: [
      "A function calling itself",
      "A loop that runs 10 times",
      "A variable stored in memory",
      "An error in Python syntax"
    ],
    correctIndex: 0,
    explanation: "Recursion is a programming technique where a function calls itself to solve a smaller sub-problem."
  },
  {
    id: 2,
    question: "What stops recursion?",
    options: [
      "A While loop",
      "Base case",
      "CPU speed limit",
      "Print statement"
    ],
    correctIndex: 1,
    explanation: "The Base Case is the stopping condition that prevents a recursive function from calling itself infinitely."
  },
  {
    id: 3,
    question: "What happens without a base case?",
    options: [
      "The code runs faster",
      "Infinite recursion",
      "It automatically stops after 1 call",
      "Python turns into JavaScript"
    ],
    correctIndex: 1,
    explanation: "Without a base case, recursion continues endlessly until Python throws a RecursionError (Stack Overflow)."
  },
  {
    id: 4,
    question: "Where are recursive calls stored?",
    options: [
      "Call stack",
      "Hard drive",
      "Browser cookie",
      "GPU VRAM"
    ],
    correctIndex: 0,
    explanation: "Each recursive call creates a stack frame that is stored in system memory on the Call Stack."
  },
  {
    id: 5,
    question: "How many recursive calls happen in mirror(5)?",
    options: [
      "1",
      "5",
      "10",
      "Infinite"
    ],
    correctIndex: 1,
    explanation: "mirror(5) creates 5 recursive calls (mirror(5), mirror(4), mirror(3), mirror(2), mirror(1)) before depth hits 0."
  }
];

export default function RecursionChallengeQuiz({ onAddXp, onNextLesson }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = (e, idx) => {
    e.stopPropagation();
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOption === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      if (onAddXp) onAddXp(30);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      if (onAddXp) onAddXp(100);
      try {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const isPassed = percentage >= 50;

  return (
    <div 
      className="cinematic-glass-panel max-w-2xl w-full flex flex-col gap-5 border-2 border-amber-500/50 shadow-2xl animate-fade-in-scale p-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-amber-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Recursion Challenge
            </h3>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
              Interactive Quiz Challenge
            </span>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-2 text-xs font-bold font-mono">
            <span className="text-gray-400">Score: <strong className="text-amber-400">{score}</strong>/5</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
              Q{currentIdx + 1}/5
            </span>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="flex flex-col gap-4">
          
          {/* Question Card */}
          <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/30">
            <h4 className="font-extrabold text-base md:text-lg text-purple-100 leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentQ.options.map((option, idx) => {
              let optionStyle = 'bg-gray-900/60 border-white/10 hover:border-amber-500/50 text-gray-200';

              if (selectedOption === idx) {
                optionStyle = 'bg-amber-500/20 border-amber-500/60 text-amber-200';
              }

              if (isSubmitted) {
                if (idx === currentQ.correctIndex) {
                  optionStyle = 'bg-green-500/20 border-green-500/60 text-green-200';
                } else if (idx === selectedOption) {
                  optionStyle = 'bg-red-500/20 border-red-500/60 text-red-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={(e) => handleSelect(e, idx)}
                  disabled={isSubmitted}
                  className={`p-3 rounded-xl border text-left font-medium text-xs md:text-sm transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-amber-300">
                      {letters[idx]}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isSubmitted && idx === currentQ.correctIndex && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                  {isSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isSubmitted && (
            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-xs ${
              selectedOption === currentQ.correctIndex ? 'bg-green-950/40 border-green-500/40 text-green-200' : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Correct Answer! +30 XP</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Incorrect. Correct answer is: "{currentQ.options[currentQ.correctIndex]}"</span>
                  </>
                )}
              </div>
              <p className="text-gray-300 font-medium">{currentQ.explanation}</p>
            </div>
          )}

          {/* Submit / Next */}
          <div className="flex justify-end pt-1">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5"
              >
                <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Result'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* Result Screen */
        <div className={`p-6 rounded-xl border flex flex-col items-center text-center gap-4 ${
          isPassed ? 'bg-purple-950/40 border-purple-500/40' : 'bg-red-950/30 border-red-500/30'
        }`}>
          {isPassed ? (
            <Award className="w-12 h-12 text-amber-400 animate-bounce" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-400" />
          )}

          <div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block mb-1 ${
              isPassed ? 'bg-green-950/60 text-green-300 border-green-500/40' : 'bg-red-950/60 text-red-300 border-red-500/40'
            }`}>
              {isPassed ? 'Status: PASSED' : 'Status: NEEDS REVIEW'}
            </span>
            <h4 className="font-extrabold text-2xl text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {isPassed ? '🎉 Level Completed' : 'Try Again'}
            </h4>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex items-center gap-6 text-xs font-mono">
            <div>Score: <strong className="text-white text-sm">{score}/{QUIZ_QUESTIONS.length}</strong></div>
            <div className="h-6 w-px bg-white/10" />
            <div>Percentage: <strong className={isPassed ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{percentage}%</strong></div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            {isPassed ? (
              <button
                onClick={onNextLesson}
                className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
              >
                <Unlock className="w-4 h-4 text-amber-300" />
                <span>Continue Adventure</span>
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="btn-secondary py-2.5 px-6 text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
