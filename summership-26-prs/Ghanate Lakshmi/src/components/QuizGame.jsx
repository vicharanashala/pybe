import React, { useState } from 'react';
import { SCENARIO_QUIZ } from '../data/challengesData';
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export default function QuizGame({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = SCENARIO_QUIZ[currentIdx];

  const handleSelectOption = (opt) => {
    if (showFeedback) return;
    soundFx.playClick();
    setSelectedOption(opt);
    setShowFeedback(true);

    if (opt === question.correct) {
      soundFx.playSuccess();
      setScore(prev => prev + 1);
    } else {
      soundFx.playWarning();
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    setSelectedOption(null);
    setShowFeedback(false);

    if (currentIdx < SCENARIO_QUIZ.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      soundFx.playFanfare();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowFeedback(false);
    setIsFinished(false);
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 lg:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-amber-200">HELP LAKSHMI & FRIENDS</h3>
            <p className="text-xs text-stone-400">Match each story situation to the correct Python loop control statement!</p>
          </div>
        </div>

        <div className="font-mono text-sm text-amber-400 font-bold bg-amber-950/60 px-4 py-1.5 rounded-xl border border-amber-800/40">
          Question {currentIdx + 1} / {SCENARIO_QUIZ.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Question Prompt */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-3 shadow-inner">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider block">
              Story Situation #{currentIdx + 1}
            </span>
            <p className="text-stone-100 text-base sm:text-lg font-medium leading-relaxed">
              "{question.question}"
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {question.options.map(opt => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === question.correct;

              let btnStyle = 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/50 hover:text-amber-300';
              if (showFeedback) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={showFeedback}
                  className={`p-4 rounded-xl border font-mono font-bold text-sm transition transform hover:scale-[1.02] flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {showFeedback && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Feedback */}
          {showFeedback && (
            <div className={`p-5 rounded-xl border text-sm space-y-2 animate-fade-in ${
              selectedOption === question.correct
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-bold flex items-center gap-2">
                {selectedOption === question.correct ? '🎉 Correct Match!' : '❌ Incorrect Match'}
              </div>
              <p className="text-xs opacity-90 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
              >
                <span>{currentIdx < SCENARIO_QUIZ.length - 1 ? 'Next Situation' : 'View Game Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Card */
        <div className="bg-stone-950 p-8 rounded-2xl border border-amber-500/30 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-black flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-amber-500/40">
            🏆
          </div>
          <div>
            <h4 className="font-extrabold text-2xl text-amber-200">Mini-Game Completed!</h4>
            <p className="text-stone-400 text-sm mt-1">You correctly matched {score} out of {SCENARIO_QUIZ.length} story scenarios!</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-stone-800 text-stone-200 font-bold text-sm flex items-center gap-2 border border-stone-700 hover:border-stone-500 transition"
            >
              <RotateCcw className="w-4 h-4" /> Replay Game
            </button>

            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-base flex items-center gap-2 shadow-xl shadow-amber-500/20 transform transition hover:scale-105"
            >
              <span>Unlock Final Python Coding Challenges</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
