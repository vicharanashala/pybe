import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * ReflectionCard Component
 * Manages state for Module 1 Reflection & Ponder beats.
 * Two-stage reveal:
 * 1. [Reveal Answer] displays <z-answer> and unlocks Zone C Next button immediately.
 * 2. Optional [Show Explanation] displays <z-explanation>.
 */
export default function ReflectionCard({ titleHtml, questionHtml, answerHtml, explanationHtml, onProceed }) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isExplanationRevealed, setIsExplanationRevealed] = useState(false);

  // Immediately unlock Zone C Next button when the answer is revealed
  useEffect(() => {
    if (isAnswerRevealed && onProceed) {
      onProceed(true);
    }
  }, [isAnswerRevealed, onProceed]);

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleRevealExplanation = () => {
    setIsExplanationRevealed(true);
  };

  return (
    <div className="space-y-6 my-4">
      {titleHtml && (
        <div dangerouslySetInnerHTML={{ __html: titleHtml }} />
      )}

      <div className="bg-slate-900/90 border border-slate-700/80 p-6 rounded-2xl shadow-xl space-y-4">
        {/* Question / Ponder section */}
        {questionHtml && (
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
            <div className="text-slate-100 text-lg font-medium" dangerouslySetInnerHTML={{ __html: questionHtml }} />
          </div>
        )}

        {/* Step 1: Reveal Answer Button */}
        {!isAnswerRevealed ? (
          <div className="pt-2">
            <button
              onClick={handleRevealAnswer}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-purple-500/20 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Reveal Answer
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Take a moment to ponder before revealing the answer.
            </p>
          </div>
        ) : (
          /* Step 1 Content: Answer Revealed */
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
            {answerHtml && (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl text-emerald-200">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Answer (Next beat unlocked)
                </div>
                <div dangerouslySetInnerHTML={{ __html: answerHtml }} />
              </div>
            )}

            {/* Step 2: Optional Show Explanation Button */}
            {explanationHtml && (
              <div className="pt-2">
                {!isExplanationRevealed ? (
                  <div>
                    <button
                      onClick={handleRevealExplanation}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-blue-500/20 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Show Explanation
                    </button>
                    <p className="text-xs text-slate-400 mt-2">
                      Optional: Click to view the explanation.
                    </p>
                  </div>
                ) : (
                  /* Step 2 Content: Explanation Revealed */
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-slate-300 animate-fadeIn space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Explanation</div>
                    <div dangerouslySetInnerHTML={{ __html: explanationHtml }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
