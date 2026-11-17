import { useEffect, useState } from "react";
import InheritanceTree from "./InheritanceTree.jsx";
import { BirdParent, EagleChild, SparrowChild } from "./BirdIllustration.jsx";
import JargonTerm from "./JargonTerm.jsx";
import TraitFlipCards from "./TraitFlipCards.jsx";
import TraitDNASplicer from "./TraitDNASplicer.jsx";
import HybridBirdChallenge from "./HybridBirdChallenge.jsx";
import TermWalkthrough from "./TermWalkthrough.jsx";

// --- Level 2 micro-check questions ----------------------------------
// Short, same bird-family context as the rest of the app. Kept local to
// this file since they're only ever used inside this sub-flow.
const CHECK_QUESTIONS = [
  {
    id: "c1",
    prompt:
      'In the Bird family, which class is the "parent" that Eagle and Chiku the Sparrow inherit from?',
    options: [
      {
        id: "a",
        text: "Eagle",
        wrong:
          "Eagle is one of the children — it inherits from something, it isn't the parent.",
      },
      { id: "b", text: "Bird (the Bird Blueprint)" },
      {
        id: "c",
        text: "Chiku the Sparrow",
        wrong:
          "Chiku is a child class too, not the parent every bird comes from.",
      },
      {
        id: "d",
        text: "There is no parent class",
        wrong:
          "There is one — the Bird Blueprint is what every other bird class is built from.",
      },
    ],
    correct: "b",
    feedback:
      "Right — the Bird Blueprint (the Bird class) is the parent every other bird is built from.",
  },
  {
    id: "c2",
    prompt:
      "What do we call eat(), sleep(), and fly() — the actions defined inside the Bird Blueprint?",
    options: [
      {
        id: "a",
        text: "Classes",
        wrong:
          "Bird itself is the class — eat(), sleep(), fly() live inside it.",
      },
      { id: "b", text: "Methods" },
      {
        id: "c",
        text: "Parents",
        wrong: '"Parent" describes Bird\'s role, not the actions it defines.',
      },
      {
        id: "d",
        text: "Children",
        wrong:
          "Eagle, Chiku, Pingu, and Owl are the children — not the actions.",
      },
    ],
    correct: "b",
    feedback:
      "Exactly — actions defined inside a class, like eat() or fly(), are called methods.",
  },
  {
    id: "c3",
    prompt:
      "Pingu the Penguin still calls it fly() in his code, but he dives and swims instead. What's this called?",
    options: [
      {
        id: "a",
        text: "Inheriting",
        wrong:
          "Inheriting means keeping the parent's version unchanged — Pingu changed his.",
      },
      { id: "b", text: "Method overriding" },
      {
        id: "c",
        text: "Adding a new object",
        wrong:
          "No new method name was added — fly() already existed on the Bird Blueprint.",
      },
      {
        id: "d",
        text: "Deleting a method",
        wrong:
          "fly() still exists and still runs — it just does something different now.",
      },
    ],
    correct: "b",
    feedback:
      "Exactly — same method name, completely different behavior. That's method overriding.",
  },
  {
    id: "c4",
    prompt:
      "Quacker the Duck added a brand-new method, swim(), that the Bird Blueprint never had. What's this an example of?",
    options: [
      {
        id: "a",
        text: "Overriding a method",
        wrong:
          "Overriding replaces an existing method with the same name — swim() didn't exist on Bird at all.",
      },
      { id: "b", text: "Adding a new method" },
      {
        id: "c",
        text: "Inheriting a method unchanged",
        wrong:
          "Inherited methods already existed on Bird — swim() is brand new to Duck.",
      },
      {
        id: "d",
        text: "Deleting a method",
        wrong:
          "Nothing was removed — Duck kept every Bird method and added one more.",
      },
    ],
    correct: "b",
    feedback:
      "Right — a child class can add methods the parent never had at all. That's different from overriding one that already existed.",
  },
];

function MicroCheckQuestion({ q, answer, onSelect }) {
  const selectedOption = answer && q.options.find((o) => o.id === answer.optId);
  return (
    <div
      className={
        "question-block" +
        (answer
          ? answer.isCorrect
            ? " question-answered-correct"
            : " question-answered-incorrect"
          : "")
      }
    >
      <p className="question-prompt">{q.prompt}</p>
      <div className="options-stack">
        {q.options.map((opt) => {
          const isSelected = answer?.optId === opt.id;
          const showState = answer && isSelected;
          return (
            <button
              key={opt.id}
              className={
                "option-btn concept-option-btn" +
                (showState
                  ? answer.isCorrect
                    ? " correct"
                    : " incorrect"
                  : "")
              }
              onClick={() => onSelect(q.id, opt.id, q.correct)}
              disabled={!!answer}
            >
              <span>{opt.text}</span>
              {showState && (
                <span
                  className={
                    "option-icon " +
                    (answer.isCorrect
                      ? "option-icon-correct"
                      : "option-icon-incorrect")
                  }
                  aria-hidden="true"
                >
                  {answer.isCorrect ? "✓" : "✗"}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {answer && (
        <p
          className={
            "feedback-line " + (answer.isCorrect ? "correct" : "incorrect")
          }
        >
          {answer.isCorrect
            ? "✓ Correct — " + q.feedback
            : "✗ " + selectedOption.wrong}
        </p>
      )}
    </div>
  );
}

// Small sub-step tracker at the top of the Level 2 card. Purely visual —
// doesn't affect the fixed-step navigation the rest of the app relies on.
function SubStepDots({ total, current }) {
  return (
    <div className="concept-substeps" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={
            "concept-substep-dot" + (i + 1 <= current ? " filled" : "")
          }
        />
      ))}
    </div>
  );
}

const TOTAL_SUBSTEPS = 6;

export default function ConceptReveal({ onNext, onConceptProgress }) {
  // 1 = intro/DNA analogy, 2 = animated term-by-term walkthrough,
  // 3 = technical words summary, 4 = DNA splicer, 5 = hybrid bird
  // challenge, 6 = micro-check
  const [subStep, setSubStep] = useState(1);
  const [checkAnswers, setCheckAnswers] = useState({});
  const [hybridResult, setHybridResult] = useState(null); // { correct, total }

  useEffect(() => {
    onConceptProgress(10);
  }, [onConceptProgress]);

  const allChecked = CHECK_QUESTIONS.every((q) => checkAnswers[q.id]);
  const correctCount = CHECK_QUESTIONS.filter(
    (q) => checkAnswers[q.id]?.isCorrect,
  ).length;

  function selectCheckOption(qId, optId, correctId) {
    if (checkAnswers[qId]) return; // lock after first answer, matching ThinkItThrough
    const isCorrect = optId === correctId;
    setCheckAnswers((prev) => ({ ...prev, [qId]: { optId, isCorrect } }));
  }

  function goToStep(step, progressValue) {
    onConceptProgress(progressValue);
    setSubStep(step);
  }

  // ---- Step 1: plain-language intro + DNA analogy ---------------------
  if (subStep === 1) {
    return (
      <div className="card">
        <p className="eyebrow">
          Level 2 · Concept — Step 1 of {TOTAL_SUBSTEPS}
        </p>
        <h2 className="card-subtitle">What is Inheritance?</h2>
        <SubStepDots total={TOTAL_SUBSTEPS} current={1} />

        <div className="story-illustration-row">
          <BirdParent size={90} />
          <span className="concept-arrow">→</span>
          <EagleChild size={80} />
          <SparrowChild size={80} />
        </div>

        <p>
          Remember Bird, the parent from our story — think of Bird as the{" "}
          <strong>Bird Blueprint</strong>? It already knows how to{" "}
          <strong>eat</strong>, <strong>sleep</strong>, and <strong>fly</strong>
          . When Eagle and Chiku the Sparrow were born, they didn't have to
          learn any of that from scratch — they were simply born <em>as</em>{" "}
          Bird's children, and all of Bird's habits came with them,
          automatically.
        </p>

        <div className="concept-box">
          <p>
            <strong>Think of it like DNA.</strong> A baby chick doesn't learn to
            have feathers or a beak — it's already born with them, copied
            straight from its parents. Code inheritance works the same way: a
            child class is "born" already knowing everything its parent class
            does, no re-teaching required.
          </p>
        </div>

        <div className="concept-box">
          <p>
            <strong>
              That automatic hand-me-down is{" "}
              <JargonTerm id="inherit">inheritance</JargonTerm>
            </strong>{" "}
            — a new "child" gets everything an existing "parent" already knows,
            for free, without anyone rewriting a single habit.
          </p>
        </div>

        <p>Next, let's put technical names to what just happened.</p>

        <button className="btn btn-primary" onClick={() => goToStep(2, 20)}>
          Next: The technical terms
        </button>
      </div>
    );
  }

  // ---- Step 2: interactive term-by-term animated walkthrough ----------
  if (subStep === 2) {
    return (
      <div className="card">
        <p className="eyebrow">
          Level 2 · Concept — Step 2 of {TOTAL_SUBSTEPS}
        </p>
        <h2 className="card-subtitle">Meet the terms, one at a time</h2>
        <SubStepDots total={TOTAL_SUBSTEPS} current={2} />

        <TermWalkthrough
          onBack={() => goToStep(1, 10)}
          onNext={() => goToStep(3, 35)}
        />
      </div>
    );
  }

  // ---- Step 3: technical vocabulary, still using the same birds -------
  if (subStep === 3) {
    return (
      <div className="card">
        <p className="eyebrow">
          Level 2 · Concept — Step 3 of {TOTAL_SUBSTEPS}
        </p>
        <h2 className="card-subtitle">
          Same story, now with the technical words
        </h2>
        <SubStepDots total={TOTAL_SUBSTEPS} current={3} />

        <div className="tree-box">
          <InheritanceTree />
        </div>

        <div className="concept-box">
          <ul className="concept-list concept-terms-list">
            <li>
              <strong>
                <JargonTerm id="class">class</JargonTerm>
              </strong>{" "}
              — a blueprint for behavior, nothing alive yet. <code>Bird</code>{" "}
              is a class: the Bird Blueprint that defines what any bird can do.
            </li>
            <li>
              <strong>
                <JargonTerm id="object">object</JargonTerm>
              </strong>{" "}
              — an actual living bird made from a blueprint. <code>Chiku</code>{" "}
              the Sparrow and <code>Pingu</code> the Penguin are objects: real
              birds built from the Bird Blueprint.
            </li>
            <li>
              <strong>
                <JargonTerm id="parentClass">parent (class)</JargonTerm>
              </strong>{" "}
              — the class being inherited from. <code>Bird</code> is the parent
              every other bird class is built from.
            </li>
            <li>
              <strong>
                <JargonTerm id="childClass">child (class)</JargonTerm>
              </strong>{" "}
              — a class built from a parent. <code>Eagle</code>,{" "}
              <code>Duck</code>, <code>Penguin</code>, <code>Sparrow</code>, and{" "}
              <code>Owl</code> are all children of <code>Bird</code>.
            </li>
            <li>
              <strong>
                <JargonTerm id="methods">methods</JargonTerm>
              </strong>{" "}
              — the actions defined inside a class, like <code>eat()</code>,{" "}
              <code>sleep()</code>, and <code>fly()</code>. A child inherits its
              parent's methods automatically.
            </li>
            <li>
              <strong>
                <JargonTerm id="methodOverriding">method overriding</JargonTerm>
              </strong>{" "}
              — when a child keeps a method's name but swaps in its own
              behavior. Pingu the Penguin still has <code>fly()</code>, but his
              version dives and swims.
            </li>
          </ul>
        </div>

        <p className="flip-card-intro">
          Tap each card to flip it and see exactly which traits each child bird{" "}
          <JargonTerm id="inherit">inherited</JargonTerm>, added, or{" "}
          <JargonTerm id="override">overrode</JargonTerm> from Bird.
        </p>
        <TraitFlipCards />

        <p>
          You'll try all five children — Eagle, Chiku, Pingu, Quacker, and Owl —
          one at a time next.
        </p>

        <div className="concept-nav">
          <button className="btn small" onClick={() => goToStep(2, 20)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => goToStep(4, 50)}>
            Next: DNA Gene Splicer
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 4: DNA Gene Splicer — genes flow parent -> child ----------
  if (subStep === 4) {
    return (
      <div className="card">
        <p className="eyebrow">
          Level 2 · Concept — Step 4 of {TOTAL_SUBSTEPS}
        </p>
        <h2 className="card-subtitle">The DNA Gene Splicer</h2>
        <SubStepDots total={TOTAL_SUBSTEPS} current={4} />

        <p>
          Here's the DNA analogy made visible: splice the Bird Blueprint's genes
          into each child and watch which ones are kept as-is, which are new,
          and which get overridden.
        </p>

        <TraitDNASplicer />

        <div className="concept-nav">
          <button className="btn small" onClick={() => goToStep(3, 50)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => goToStep(5, 70)}>
            Next: Build a hybrid bird
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 5: scenario-based practice — Build a Hybrid Bird ----------
  if (subStep === 5) {
    return (
      <div className="card">
        <p className="eyebrow">
          Level 2 · Concept — Step 5 of {TOTAL_SUBSTEPS}
        </p>
        <h2 className="card-subtitle">Practice: Build a Hybrid Bird</h2>
        <SubStepDots total={TOTAL_SUBSTEPS} current={5} />

        <HybridBirdChallenge
          onComplete={(correct, total) => setHybridResult({ correct, total })}
        />

        <div className="concept-nav">
          <button className="btn small" onClick={() => goToStep(4, 70)}>
            Back
          </button>
          <button
            className="btn btn-primary"
            disabled={!hybridResult}
            onClick={() => goToStep(6, 90)}
          >
            Next: Quick check
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 6: interactive micro-check before unlocking Level 3 -------
  return (
    <div className="card">
      <p className="eyebrow">Level 2 · Concept — Step 6 of {TOTAL_SUBSTEPS}</p>
      <h2 className="card-subtitle">Quick check before Level 3</h2>
      <SubStepDots total={TOTAL_SUBSTEPS} current={6} />

      <p>
        A few quick questions using the same Bird family — then Level 3 unlocks.
      </p>

      {CHECK_QUESTIONS.map((q) => (
        <MicroCheckQuestion
          key={q.id}
          q={q}
          answer={checkAnswers[q.id]}
          onSelect={selectCheckOption}
        />
      ))}

      {allChecked && (
        <div
          className={
            "checkpoint-summary " +
            (correctCount === CHECK_QUESTIONS.length
              ? "checkpoint-summary-full"
              : "checkpoint-summary-partial")
          }
        >
          <span className="checkpoint-summary-icon" aria-hidden="true">
            {correctCount === CHECK_QUESTIONS.length ? "🌟" : "✓"}
          </span>
          <p>
            {correctCount}/{CHECK_QUESTIONS.length} correct —{" "}
            {correctCount === CHECK_QUESTIONS.length
              ? "you've got inheritance down. Level 3 is ready."
              : "solid effort — the feedback above covers what to remember. Level 3 is unlocked."}
          </p>
        </div>
      )}

      <div className="concept-nav">
        <button className="btn small" onClick={() => goToStep(5, 90)}>
          Back
        </button>
        <button
          className="btn btn-primary"
          disabled={!allChecked}
          onClick={() => {
            onConceptProgress(100);
            onNext();
          }}
        >
          Unlock: Practice session
        </button>
      </div>
    </div>
  );
}
