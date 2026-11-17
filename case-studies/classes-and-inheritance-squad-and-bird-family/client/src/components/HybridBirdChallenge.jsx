import { useEffect, useState } from "react";

// A brand-new hybrid chick, described only in Bird Family terms. Each
// trait has one correct bucket; the learner has to reason about *why*
// rather than just recognizing a term, which is what makes this a
// scenario challenge rather than another definition quiz.
const HYBRID_TRAITS = [
  {
    id: "eat",
    label: "eat() — pecking at seeds, same as always",
    correct: "inherited",
    explain: "Nothing changes here, so it's just inherited straight from the Bird Blueprint.",
  },
  {
    id: "sleep",
    label: "sleep() — resting on a branch, same as always",
    correct: "inherited",
    explain: "Also untouched — another plain inherited method.",
  },
  {
    id: "fly",
    label: "fly() — but the hybrid dives and swims instead",
    correct: "overridden",
    explain: "Same method name, totally different behavior inside it — that's an override, just like Pingu the Penguin.",
  },
  {
    id: "build_nest",
    label: "build_nest() — weaving twigs, a habit the Bird Blueprint never had",
    correct: "new",
    explain: "The Bird Blueprint has no such method — this is brand new, just like Chiku the Sparrow's.",
  },
];

const BUCKETS = [
  { id: "inherited", label: "Inherited as-is" },
  { id: "new", label: "Brand new" },
  { id: "overridden", label: "Overridden" },
];

export default function HybridBirdChallenge({ onComplete }) {
  const [picks, setPicks] = useState({});

  function pick(traitId, bucketId) {
    if (picks[traitId]) return; // lock after first choice, matching the rest of the app
    setPicks((prev) => ({ ...prev, [traitId]: bucketId }));
  }

  const allAnswered = HYBRID_TRAITS.every((t) => picks[t.id]);
  const correctCount = HYBRID_TRAITS.filter((t) => picks[t.id] === t.correct).length;

  useEffect(() => {
    if (allAnswered) {
      onComplete?.(correctCount, HYBRID_TRAITS.length);
    }
    // Intentionally only re-fires when completion state changes, not on
    // every keystroke-level re-render, and onComplete is a stable
    // callback from the parent's perspective within this sub-flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAnswered]);

  return (
    <div className="hybrid-challenge">
      <p className="hybrid-scenario">
        A brand-new hybrid chick hatches. It <strong>eats</strong> and{" "}
        <strong>sleeps</strong> exactly like every Bird. Instead of flying, it{" "}
        <strong>dives and swims</strong>. And on top of all that, it also{" "}
        <strong>weaves twigs into a nest</strong> — a habit no Bird had before.
      </p>
      <p className="hybrid-instruction">
        Sort each trait into the bucket it belongs in.
      </p>

      <div className="hybrid-trait-list">
        {HYBRID_TRAITS.map((t) => {
          const answer = picks[t.id];
          const isCorrect = answer === t.correct;
          return (
            <div
              key={t.id}
              className={
                "hybrid-trait-row" +
                (answer ? (isCorrect ? " hybrid-trait-correct" : " hybrid-trait-incorrect") : "")
              }
            >
              <p className="hybrid-trait-label">{t.label}</p>
              <div className="hybrid-bucket-row">
                {BUCKETS.map((b) => {
                  const isPicked = answer === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      className={
                        "btn small hybrid-bucket-btn" +
                        (isPicked ? (isCorrect ? " correct" : " incorrect") : "")
                      }
                      onClick={() => pick(t.id, b.id)}
                      disabled={!!answer}
                    >
                      {isPicked && (
                        <span aria-hidden="true">{isCorrect ? "✓ " : "✗ "}</span>
                      )}
                      {b.label}
                    </button>
                  );
                })}
              </div>
              {answer && (
                <p className={"feedback-line " + (isCorrect ? "correct" : "incorrect")}>
                  {isCorrect ? "✓ " + t.explain : "✗ Not quite — " + t.explain}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div
          className={
            "checkpoint-summary " +
            (correctCount === HYBRID_TRAITS.length
              ? "checkpoint-summary-full"
              : "checkpoint-summary-partial")
          }
        >
          <span className="checkpoint-summary-icon" aria-hidden="true">
            {correctCount === HYBRID_TRAITS.length ? "🐣" : "✓"}
          </span>
          <p>
            {correctCount}/{HYBRID_TRAITS.length} traits sorted correctly — your hybrid bird is
            assembled.
          </p>
        </div>
      )}
    </div>
  );
}
