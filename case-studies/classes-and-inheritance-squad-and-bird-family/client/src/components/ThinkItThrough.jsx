import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: "q1",
    prompt: "What does every bird in the family get, just by being born a Bird?",
    options: [
      { id: "a", text: "Nothing — each bird starts from zero", wrong: "If that were true, every bird would have to relearn eating and sleeping from scratch." },
      { id: "b", text: "The Bird's basic habits: eat, sleep, lay eggs" },
      { id: "c", text: "Only the ability to fly", wrong: "Flying is one habit, but not the only one every bird gets — eating and sleeping come too." },
      { id: "d", text: "A completely random set of skills", wrong: "It's not random — every chick gets the exact same Bird habits, every time." },
    ],
    correct: "b",
    feedback: "Exactly — a child automatically gets everything the parent already has.",
  },
  {
    id: "q2",
    prompt: "What did the penguin chick change from what a Bird normally does?",
    options: [
      { id: "a", text: "Eating", wrong: "Penguin still eats the normal Bird way — nothing changed there." },
      { id: "b", text: "Laying eggs", wrong: "Egg-laying stayed exactly as Bird does it." },
      { id: "c", text: "How it moves through its world (flying → swimming)" },
      { id: "d", text: "Nothing, it copied the eagle exactly", wrong: "Penguin and Eagle actually handle flying very differently." },
    ],
    correct: "c",
    feedback: "Right — the penguin kept most Bird behaviors but replaced just one.",
  },
  {
    id: "q3",
    prompt: "Why didn't the eagle need to relearn how to eat or lay eggs?",
    options: [
      { id: "a", text: "She was taught separately by her mother, unrelated to being a Bird", wrong: "The story says it's automatic just from being a Bird — no separate teaching needed." },
      { id: "b", text: "Those habits are automatically passed down from Bird to every chick" },
      { id: "c", text: "She copy-pasted the code from another eagle", wrong: "She doesn't copy from another eagle — she gets it directly from Bird." },
      { id: "d", text: "Eating isn't actually a Bird behavior", wrong: "Eating is one of Bird's core habits, listed right at the start." },
    ],
    correct: "b",
    feedback: "Correct — that's the whole point of inheriting from a parent.",
  },
  {
    id: "q4",
    prompt: "What did the sparrow chick do that no other bird in the story did?",
    options: [
      { id: "a", text: "Refused to eat or sleep like a Bird", wrong: "Sparrow kept every one of Bird's habits — she didn't refuse any of them." },
      { id: "b", text: "Picked up a completely new skill Bird never had" },
      { id: "c", text: "Copied the eagle exactly", wrong: "Sparrow's new skill — nest-building — has nothing to do with the eagle." },
      { id: "d", text: "Lost one of the Bird habits", wrong: "She didn't lose anything — she kept everything and added on top." },
    ],
    correct: "b",
    feedback: "Right — a child can add new abilities on top of what it inherited, not just reuse or replace.",
  },
  {
    id: "q5",
    prompt: "How did the owl chick handle sleeping, compared to the penguin handling flying?",
    options: [
      { id: "a", text: "The same way — he replaced it completely, like the penguin did with flying", wrong: "Owl didn't throw sleeping away — he kept Bird's version and added to it. That's different from what penguin did." },
      { id: "b", text: "He ignored sleeping altogether", wrong: "Owl still sleeps the Bird way first, then adds his own habit." },
      { id: "c", text: "He kept Bird's original habit, then added his own on top of it" },
      { id: "d", text: "He copied the eagle's version of sleeping", wrong: "The eagle isn't mentioned doing anything special with sleeping." },
    ],
    correct: "c",
    feedback: "Exactly — unlike a full replacement, the owl builds on top of the parent's original behavior instead of throwing it away.",
  },
];

export default function ThinkItThrough({ onDone, onProgress }) {
  const [answers, setAnswers] = useState({});

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;
useEffect(() => {
  const progress = Math.round(
    (Object.keys(answers).length / QUESTIONS.length) * 100
  );
  onProgress(progress);
}, [answers]);

  function selectOption(qId, optId, correctId) {
    if (answers[qId]) return; // lock after first answer, like the reference
    const isCorrect = optId === correctId;
    setAnswers((prev) => ({ ...prev, [qId]: { optId, isCorrect } }));
  }

  return (
    <div className="card">
      <h1 className="card-title">Think it through</h1>
      <p className="eyebrow">{answeredCount} OF {QUESTIONS.length} ANSWERED</p>

      {QUESTIONS.map((q, idx) => {
        const answer = answers[q.id];
        const selectedOption = answer && q.options.find((o) => o.id === answer.optId);
        return (
          <div className="question-block" key={q.id}>
            <p className="question-prompt">
              {idx + 1}. {q.prompt}
            </p>
            <div className="options-stack">
              {q.options.map((opt) => {
                const isSelected = answer?.optId === opt.id;
                const showState = answer && isSelected;
                return (
                  <button
                    key={opt.id}
                    className={
                      "option-btn" +
                      (showState ? (answer.isCorrect ? " correct" : " incorrect") : "")
                    }
                    onClick={() => selectOption(q.id, opt.id, q.correct)}
                    disabled={!!answer}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
            {answer && (
              <p className={"feedback-line " + (answer.isCorrect ? "correct" : "incorrect")}>
                {answer.isCorrect ? "✓ Correct — " + q.feedback : "✗ " + selectedOption.wrong}
              </p>
            )}
          </div>
        );
      })}

      <button className="btn btn-primary" disabled={!allAnswered} onClick={() => onDone(answers)}>
        Continue
      </button>
    </div>
  );
}
