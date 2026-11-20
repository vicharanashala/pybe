import React, { useEffect, useRef, useState } from "react";
import { LessonText } from "./RichText.jsx";
import {
  RegistryLookup,
  RegistryOperations,
  EditorActivity,
} from "./SequenceActivities.jsx";
import {
  readSequence,
  saveSequence,
  stepReady,
} from "../../../library/learning/sequence-state.mjs";
import {
  cancelPython,
  runPython,
} from "../../../library/learning/python-client.mjs";

function Question({ question, answer, onAnswer }) {
  const answered = Number.isInteger(answer),
    correct = answer === question.correctIndex;
  const feedback = correct
    ? question.followUp || question.explanation
    : question.wrongExplanations?.[answer] || question.explanation;
  return (
    <section className="sequence-question">
      <h3>{question.prompt}</h3>
      <div className="lesson-choices">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`lesson-choice ${answer === index ? (correct ? "correct" : "incorrect") : ""}`}
            aria-pressed={answer === index}
            onClick={() => onAnswer(index)}
          >
            {option}
          </button>
        ))}
      </div>
      {answered && (
        <div className="lesson-feedback" role="status">
          <p>
            {correct ? "That fits the story." : "Consider this explanation."}
          </p>
          {feedback && <LessonText text={feedback} />}
        </div>
      )}
    </section>
  );
}
function Pairs({ pairs }) {
  const [active, setActive] = useState(null);
  return (
    <dl className="sequence-pairs">
      {pairs.map((pair, index) => (
        <div key={index} className={active === index ? "active" : ""}>
          <dt>
            <button
              onClick={() => setActive(index)}
              aria-pressed={active === index}
            >
              {pair.key ?? pair.label ?? pair.story}
            </button>
          </dt>
          <dd>{pair.value ?? pair.python}</dd>
        </div>
      ))}
    </dl>
  );
}
function Retrieval({ step, response, onChange }) {
  const roundIndex = Math.max(
    0,
    Math.min(step.rounds.length, response?.roundIndex || 0),
  );
  const [feedback, setFeedback] = useState("");
  if (roundIndex === step.rounds.length) return <p>{step.completionLine}</p>;
  const round = step.rounds[roundIndex];
  return (
    <section>
      <p>{step.instructions}</p>
      <h3>{round.ask ?? round.askProvince}</h3>
      <div className="lesson-choices">
        {(step.rightChoices ?? step.provinceButtons).map((choice) => (
          <button
            key={choice}
            className="lesson-choice"
            onClick={() => {
              if (choice === (round.correct ?? round.askProvince)) {
                setFeedback("");
                onChange({ roundIndex: roundIndex + 1 });
              } else
                setFeedback(
                  round.wrongDirection ||
                    `Go straight to ${round.askProvince} in the registry.`,
                );
            }}
          >
            {choice}
          </button>
        ))}
      </div>
      {feedback && (
        <p className="lesson-feedback" role="status">
          {feedback}
        </p>
      )}
    </section>
  );
}
function OrderCode({ step, response, onChange, fixtures }) {
  const initial = response?.order;
  const validSaved =
    Array.isArray(initial) &&
    initial.length === step.storyEvents.length &&
    new Set(initial).size === initial.length &&
    initial.every((id) => step.storyEvents.some((e) => e.id === id));
  const [order, setOrder] = useState(
    validSaved ? initial : step.storyEvents.map((e) => e.id).reverse(),
  );
  const [feedback, setFeedback] = useState(""),
    [checked, setChecked] = useState(false),
    [running, setRunning] = useState(false),
    [result, setResult] = useState(null);
  const dragging = useRef(null);
  const correct = step.storyEvents.every(
    (event, index) => order[index] === event.id,
  );
  useEffect(() => () => cancelPython(), []);
  function move(from, to) {
    if (running || from === null || to < 0 || to >= order.length) return;
    const next = [...order];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setOrder(next);
    setChecked(false);
    setFeedback("");
    setResult(null);
    onChange({ order: next, ran: false });
  }
  async function execute() {
    setRunning(true);
    setResult(null);
    const output = await runPython(step.completeCode, { fixtures });
    setRunning(false);
    setResult(output);
    const matches =
      !output.error && output.output.trim() === step.expectedOutput.trim();
    onChange({ order, ran: matches });
    if (!output.error && !matches)
      setFeedback(
        "The output differs from the story’s expected result. Review the code and try again.",
      );
  }
  return (
    <section>
      <p>{step.instructions}</p>
      <p>You can also move cards with the Up and Down buttons.</p>
      <ol className="sequence-order">
        {order.map((id, index) => {
          const event = step.storyEvents.find((e) => e.id === id);
          return (
            <li
              key={id}
              data-event-id={id}
              draggable={!running}
              onDragStart={(e) => {
                dragging.current = index;
                e.dataTransfer.setData("text/plain", String(index));
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={() => {
                dragging.current = null;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                move(dragging.current, index);
                dragging.current = null;
              }}
            >
              <div>
                <b>
                  {index + 1}. {event.story}
                </b>
                <div className="sequence-order-controls">
                  <button
                    className="button secondary"
                    disabled={running || index === 0}
                    aria-label={`Move ${event.id} up`}
                    onClick={() => move(index, index - 1)}
                  >
                    ↑ Up
                  </button>
                  <button
                    className="button secondary"
                    disabled={running || index === order.length - 1}
                    aria-label={`Move ${event.id} down`}
                    onClick={() => move(index, index + 1)}
                  >
                    ↓ Down
                  </button>
                </div>
              </div>
              <details>
                <summary>Python for this story moment</summary>
                <pre>{event.code}</pre>
              </details>
            </li>
          );
        })}
      </ol>
      <button
        className="button secondary"
        disabled={running}
        onClick={() => {
          setChecked(true);
          if (correct) setFeedback(step.successMessage);
          else {
            const index = step.storyEvents.findIndex(
              (event, i) => event.id !== order[i],
            );
            const current = step.storyEvents.find(
              (event) => event.id === order[index],
            );
            setFeedback(
              `“${current.story}” does not belong in position ${index + 1}. Think about what happens first in the story.`,
            );
          }
        }}
      >
        Check order
      </button>
      {feedback && (
        <p className="lesson-feedback" role="status">
          {feedback}
        </p>
      )}
      {((checked && correct) || response?.ran) && (
        <>
          <h3>{step.filename}</h3>
          <pre>{step.completeCode}</pre>
          {Object.keys(fixtures || {}).length > 0 && (
            <p className="sequence-fixture-note">
              The lesson supplies the story operation{" "}
              {Object.keys(fixtures)
                .map((name) => name + "()")
                .join(", ")}
              . The code shown here runs in Python.
            </p>
          )}
          <button
            className="button primary"
            onClick={execute}
            disabled={running}
          >
            {running ? "Running Python…" : "Run story code"}
          </button>
          {running && (
            <button className="button secondary" onClick={cancelPython}>
              Cancel run
            </button>
          )}
        </>
      )}
      {result && (
        <pre aria-live="polite">
          {result.error || result.output || "(no output)"}
        </pre>
      )}
    </section>
  );
}

export function SequenceStep({ step, response, onChange, fixtures }) {
  return (
    <>
      {step.paragraphs?.map((text, index) => (
        <LessonText key={index} text={text} />
      ))}
      {step.intro && <LessonText text={step.intro} />}
      {step.type === "question" && (
        <Question question={step} answer={response} onAnswer={onChange} />
      )}
      {["discovery", "assessment"].includes(step.type) &&
        step.questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            answer={response?.[question.id]}
            onAnswer={(answer) =>
              onChange({ ...response, [question.id]: answer })
            }
          />
        ))}
      {step.type === "retrieval-activity" && (
        <Retrieval step={step} response={response} onChange={onChange} />
      )}
      {step.type === "lookup-activity" && (
        <RegistryLookup step={step} response={response} onChange={onChange} />
      )}
      {step.operations && (
        <RegistryOperations
          step={step}
          response={response}
          onChange={onChange}
        />
      )}
      {step.pairs && <Pairs pairs={step.pairs} />}
      {step.visualBoxes && <Pairs pairs={step.visualBoxes} />}
      {step.mapPairs && <Pairs pairs={step.mapPairs} />}
      {step.codeBlocks?.map((block, index) => (
        <section className="sequence-code-example" key={index}>
          <h3>{block.label}</h3>
          <p>{block.motivation}</p>
          <pre>{block.code}</pre>
        </section>
      ))}
      {step.code && <pre>{step.code}</pre>}
      {step.legendPairs && <Pairs pairs={step.legendPairs} />}
      {step.type === "coding" &&
        (step.storyEvents ? (
          <OrderCode
            step={step}
            response={response}
            onChange={onChange}
            fixtures={fixtures}
          />
        ) : (
          <EditorActivity step={step} response={response} onChange={onChange} />
        ))}
      {step.type === "reflection" &&
        step.prompts.map((prompt, index) => (
          <label className="sequence-reflection" key={index}>
            {prompt}
            <textarea
              aria-label={prompt}
              value={response?.[index] || ""}
              onChange={(e) =>
                onChange({ ...response, [index]: e.target.value })
              }
            />
          </label>
        ))}
      {step.closingLine && <LessonText text={step.closingLine} />}
    </>
  );
}

export default function SequencePlayer({ lesson, onComplete }) {
  const [state, setState] = useState(() =>
    readSequence(localStorage, lesson.collection, lesson.steps.length),
  );
  const [warning, setWarning] = useState("");
  const step = lesson.steps[state.index];
  const ready = stepReady(step, state.responses[step.id]);
  function update(next) {
    setState(next);
    if (!saveSequence(localStorage, lesson.collection, next))
      setWarning(
        "Progress is kept for this visit because browser storage is unavailable.",
      );
  }
  if (state.done)
    return (
      <div className="lesson-workspace">
        <section className="lesson-stage">
          <h2>You have completed this story.</h2>
          <p>
            You explored the story, its Python pattern, the activities, and your
            reflection.
          </p>
          <button
            className="button primary"
            onClick={() => update({ ...state, index: 0, done: false })}
          >
            Revisit the story
          </button>
        </section>
      </div>
    );
  return (
    <div className="lesson-workspace">
      <div className="lesson-position">
        Part {state.index + 1} of {lesson.steps.length}
      </div>
      <div className="lesson-stage">
        <span className="eyebrow">{step.eyebrow}</span>
        <h2>{step.title}</h2>
        <SequenceStep
          key={step.id}
          step={step}
          response={state.responses[step.id]}
          fixtures={lesson.fixtures}
          onChange={(response) =>
            update({
              ...state,
              responses: { ...state.responses, [step.id]: response },
            })
          }
        />
        {warning && <p role="status">{warning}</p>}
        <nav className="lesson-actions" aria-label="Lesson navigation">
          <button
            className="button secondary"
            disabled={state.index === 0}
            onClick={() => {
              cancelPython();
              update({ ...state, index: state.index - 1 });
            }}
          >
            ← Previous part
          </button>
          <button
            className="button primary"
            disabled={!ready}
            onClick={() => {
              cancelPython();
              if (state.index === lesson.steps.length - 1) {
                update({ ...state, done: true });
                onComplete?.();
              } else update({ ...state, index: state.index + 1 });
            }}
          >
            {state.index === lesson.steps.length - 1
              ? "Finish case study"
              : "Continue →"}
          </button>
        </nav>
      </div>
    </div>
  );
}
