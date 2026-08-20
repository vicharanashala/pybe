import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Eye } from 'lucide-react';

/**
 * McqCard Component
 * Interactive MCQ component with single option selection tracking.
 * Unlocks the Next button immediately when the correct option is selected,
 * while providing an optional [Show Explanation] button for the learner.
 */
export default function McqCard({ titleHtml, questionHtml, options, explanationHtml, onProceed }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [explanationRevealed, setExplanationRevealed] = useState(false);

  const isCorrectSelected = selectedIdx !== null && options[selectedIdx]?.isCorrect;

  // Unlock the Module's Next button immediately when the correct answer is selected
  useEffect(() => {
    if (isCorrectSelected && onProceed) {
      onProceed(true);
    }
  }, [isCorrectSelected, onProceed]);

  const handleSelectOption = (index) => {
    // Lock choices once correct answer is selected
    if (isCorrectSelected) return;

    setSelectedIdx(index);
  };

  const handleShowExplanation = () => {
    setExplanationRevealed(true);
  };

  return (
    <div className="space-y-6 my-4">
      {titleHtml && (
        <div dangerouslySetInnerHTML={{ __html: titleHtml }} />
      )}

      <div className="bg-slate-900/90 border border-slate-700/80 p-6 rounded-2xl shadow-xl space-y-6">
        {/* Question */}
        {questionHtml && (
          <div className="flex items-start gap-3">
            <HelpCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
            <div className="text-slate-100 text-lg font-medium" dangerouslySetInnerHTML={{ __html: questionHtml }} />
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt, index) => {
            const isSelected = selectedIdx === index;
            const isCorrect = opt.isCorrect;

            let btnStyle = "bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200";
            let icon = null;

            if (isSelected) {
              if (isCorrect) {
                btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/10 font-semibold";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
              } else {
                btnStyle = "bg-red-950/80 border-red-500 text-red-100 shadow-lg shadow-red-500/10 font-semibold";
                icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={isCorrectSelected}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left font-medium transition-all duration-200 ${btnStyle} ${
                  !isCorrectSelected ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                    isSelected && isCorrect
                      ? 'bg-emerald-900 border-emerald-500 text-emerald-200'
                      : isSelected && !isCorrect
                      ? 'bg-red-900 border-red-500 text-red-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Feedback message for wrong selection */}
        {selectedIdx !== null && !options[selectedIdx]?.isCorrect && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-sm flex items-center gap-2.5 animate-fadeIn">
            <XCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>Incorrect answer. Please try another option!</span>
          </div>
        )}

        {/* Correct answer feedback + optional [Show Explanation] button */}
        {isCorrectSelected && (
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Correct answer! (Next beat unlocked)
            </div>

            {!explanationRevealed ? (
              <div>
                <button
                  onClick={handleShowExplanation}
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
              /* Explanation revealed when user clicks button */
              explanationHtml && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2 animate-fadeIn">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Explanation</div>
                  <div className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: explanationHtml }} />
                </div>
              )
            )}
          </div>
        )}

      </div>
    </div>
  );
}
