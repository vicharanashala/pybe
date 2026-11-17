import { useState, useEffect } from "react";
const QUESTIONS = [
  {
    id: "b1",
    prompt: "Which line makes Eagle a child of Bird, inheriting everything it has?",
    options: [
      { id: "a", text: "class Eagle:", wrong: "This creates Eagle as its own, unrelated class — it inherits nothing from Bird." },
      { id: "b", text: "class Eagle(Bird):" },
      { id: "c", text: "class Bird(Eagle):", wrong: "This makes Bird inherit from Eagle — backwards from what we want." },
      { id: "d", text: "Eagle = Bird", wrong: "This just makes Eagle another name for Bird, not a child class." },
    ],
    correct: "b",
  },
  {
    id: "b2",
    prompt: "Which one adds a brand-new ability that Bird never had?",
    options: [
      { id: "a", text: "class Sparrow(Bird):\n    def eat(self): ...", wrong: "eat() already exists on Bird — this overrides it, it doesn't add something new." },
      { id: "b", text: "class Sparrow(Bird):\n    def build_nest(self): ..." },
      { id: "c", text: "class Sparrow(Bird):\n    pass", wrong: "pass means Sparrow adds nothing at all — that's plain inheritance, not extending." },
      { id: "d", text: "class Bird(Sparrow):\n    def build_nest(self): ...", wrong: "This puts build_nest() on the parent Bird, not on the child Sparrow." },
    ],
    correct: "b",
  },
  {
    id: "b3",
    prompt: "Which one is the action Penguin changes from what Bird normally does?",
    options: [
      { id: "a", text: "def eat(self): ...", wrong: "Penguin doesn't change eating — that stays inherited from Bird." },
      { id: "b", text: "def lay_eggs(self): ...", wrong: "Egg-laying isn't touched by Penguin either." },
      { id: "c", text: "def fly(self): swim instead" },
      { id: "d", text: "def sleep(self): ...", wrong: "Sleeping is untouched — Penguin only changes flying." },
    ],
    correct: "c",
  },
  {
    id: "b4",
    prompt: "Which line lets Owl run Bird's original sleep() before adding its own behavior?",
    options: [
      { id: "a", text: "Bird.sleep(self)", wrong: "This can work in Python, but it's not the standard way — super() is the pattern used here and in most real code." },
      { id: "b", text: "self.sleep()", wrong: "This would call Owl's own sleep() again — causing infinite recursion, not Bird's version." },
      { id: "c", text: "super().sleep()" },
      { id: "d", text: "pass", wrong: "pass runs nothing at all — Bird's original sleep() would never execute." },
    ],
    correct: "c",
  },
];

export default function BuildItQuiz({ onDone, onQuizProgress }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const current = QUESTIONS[index];

  useEffect(() => {
    const progress = Math.round(((index + 1) / QUESTIONS.length) * 100);
    onQuizProgress(progress);
  }, [index, onQuizProgress]);

  const selected = answers[current.id];
  const selectedOption = selected && current.options.find((o) => o.id === selected);

  function choose(optId) {
    if (selected) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optId }));
  }

  function next() {
    if (index < QUESTIONS.length - 1) {
      setIndex(index + 1);
    } else {
      onDone(answers);
    }
  }

  return (
    <div className="card">
      <p className="eyebrow">
        QUESTION {index + 1} OF {QUESTIONS.length}
      </p>
      <h2 className="card-subtitle">{current.prompt}</h2>
      <div className="options-stack">
        {current.options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.id === current.correct;
          const showState = selected && isSelected;
          return (
            <button
              key={opt.id}
              className={
                "option-btn code-option" +
                (showState ? (isCorrect ? " correct" : " incorrect") : "")
              }
              onClick={() => choose(opt.id)}
              disabled={!!selected}
            >
              <code>{opt.text}</code>
            </button>
          );
        })}
      </div>
      {selected && (
        <p className={"feedback-line " + (selectedOption.id === current.correct ? "correct" : "incorrect")}>
          {selectedOption.id === current.correct ? "✓ Correct" : "✗ " + selectedOption.wrong}
        </p>
      )}
      {selected && (
        <button className="btn btn-primary" onClick={next}>
          {index < QUESTIONS.length - 1 ? "Next question" : "See the full code"}
        </button>
      )}
    </div>
  );
}