import { useState } from "react";

interface PredictBeforeRevealProps {
  question: string;
  choices: string[];
  correctChoice: number;
  onAnswered?: (correct: boolean) => void;
}

export default function PredictBeforeReveal({
  question,
  choices,
  correctChoice,
  onAnswered,
}: PredictBeforeRevealProps) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(i: number) {
    if (selected !== null) return; // lock after first answer
    setSelected(i);
    onAnswered?.(i === correctChoice);
  }

  return (
    <div className="max-w-xl mx-auto">
      <p className="text-ink text-lg leading-relaxed mb-6 text-center font-display">{question}</p>
      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correctChoice;
          const showResult = selected !== null;

          let stateClasses = "border-line bg-panel/60 hover:border-gold/60";
          if (showResult && isCorrect) {
            stateClasses = "border-[#274A3C] bg-[#0E1F1A]";
          } else if (showResult && isSelected && !isCorrect) {
            stateClasses = "border-[#3B2A44] bg-[#171029]";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`text-left px-5 py-4 rounded-xl border transition-colors text-sm text-ink ${stateClasses}`}
            >
              {choice}
              {showResult && isCorrect && <span className="ml-2 text-[#7FBF9E]">✓ Correct</span>}
              {showResult && isSelected && !isCorrect && (
                <span className="ml-2 text-vermilion">Not quite</span>
              )}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="text-muted text-sm text-center mt-5">
          {selected === correctChoice
            ? "Let's see why, in Python terms."
            : "That's alright — let's see what actually happens."}
        </p>
      )}
    </div>
  );
}