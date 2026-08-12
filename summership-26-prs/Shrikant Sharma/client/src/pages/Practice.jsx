import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Practice.css";

const PRACTICE_STORIES = ["rabbit-if", "crow-while", "turtle-for"];

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l2 5.6L20 10l-6 1.4L12 17l-2-5.6L4 10l6-1.4Z" />
      <path d="M18.5 15.5l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1Z" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5 C 9 3 5 3 3 4.5 V 18 C 5 16.5 9 16.5 12 19 C 15 16.5 19 16.5 21 18 V 4.5 C 19 3 15 3 12 5 Z" />
      <path d="M12 5 V 19" />
    </svg>
  );
}

function PracticeLoading() {
  return (
    <div className="practice__loading">
      <div className="practice__loading-inner" role="status" aria-live="polite">
        <span className="practice__loading-icon" aria-hidden="true">
          <BookOpenIcon />
        </span>
        <p>Sharpening the pencils&hellip;</p>
      </div>
    </div>
  );
}

function PracticeMissing() {
  return (
    <div className="practice__missing">
      <div>
        <h1>This practice has not been written yet.</h1>
        <p>The ink is still drying. Choose another tale from the storybook.</p>
        <Link to="/stories" className="practice__missing-link">
          Return to the Storybook
        </Link>
      </div>
    </div>
  );
}

function PracticeView({ id }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [showContinue, setShowContinue] = useState(false);

  const cardRef = useRef(null);
  const continueTimerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    import(`../stories/${id}/practice.js`)
      .then((mod) => {
        if (cancelled) return;
        const loaded = mod.default || null;
        if (!loaded || !loaded.codeTemplate) {
          setStatus("missing");
          return;
        }
        setData(loaded);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (status === "ready" && cardRef.current) {
      cardRef.current.focus({ preventScroll: true });
    }
  }, [status]);

  useEffect(() => {
    return () => clearTimeout(continueTimerRef.current);
  }, []);

  const parts = data ? data.codeTemplate.split("______") : [];
  const isCorrect = result === "correct";
  const problemNumber = PRACTICE_STORIES.indexOf(id) + 1;
  const showProgress = problemNumber > 0;

  const handleSelect = (option) => {
    clearTimeout(continueTimerRef.current);
    setSelected(option);
    setResult(null);
    setShowContinue(false);
  };

  const handleRun = () => {
    if (!selected || !data) return;
    const correct = selected === data.answer;
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      continueTimerRef.current = setTimeout(() => setShowContinue(true), 500);
    }
  };

  if (status === "loading") {
    return (
      <main className="practice">
        <span className="practice__frame" aria-hidden="true" />
        <PracticeLoading />
      </main>
    );
  }

  if (status === "missing") {
    return (
      <main className="practice">
        <span className="practice__frame" aria-hidden="true" />
        <PracticeMissing />
      </main>
    );
  }

  return (
    <main className="practice">
      <span className="practice__frame" aria-hidden="true" />

      <header className="practice__top">
        <Link to={`/reveal/${id}`} className="practice__back">
          <ArrowLeftIcon />
          Back to the Secret
        </Link>
      </header>

      <div className="practice__stage">
        <section className="practice__card" ref={cardRef} tabIndex={-1}>
          <p className="practice__eyebrow" aria-hidden="true">
            {showProgress
              ? `Problem ${problemNumber} of ${PRACTICE_STORIES.length}`
              : "Practice"}
          </p>
          <h1 className="practice__title">Try It Yourself</h1>
          <p className="practice__instruction">{data.prompt}</p>

          {data.reminder && <p className="practice__reminder">{data.reminder}</p>}

          <div className="practice__code-wrap">
            <pre className="practice__code">
              <code>
                {parts[0]}
                <span
                  key={selected}
                  className={`practice__blank ${isCorrect ? "is-correct" : ""}`}
                  aria-live="polite"
                >
                  {selected}
                </span>
                {parts[1]}
              </code>
            </pre>
          </div>

          <div className="practice__options" role="group" aria-label="Choose the missing word">
            {data.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`practice__option ${
                  selected === option ? "is-selected" : ""
                } ${isCorrect && option === data.answer ? "is-correct" : ""}`}
                aria-pressed={selected === option}
                disabled={isCorrect}
                onClick={() => handleSelect(option)}
              >
                <code>{option}</code>
              </button>
            ))}
          </div>

          {result && (
            <div
              className={`practice__result ${isCorrect ? "is-correct" : "is-hint"}`}
              role="status"
              aria-live="polite"
            >
              {isCorrect ? (
                <>
                  <p className="practice__output">{data.output}</p>
                  <p className="practice__message">
                    <span className="practice__sparkle" aria-hidden="true">
                      <SparkleIcon />
                    </span>
                    That works perfectly. Now the condition is clear.
                  </p>
                </>
              ) : (
                <p className="practice__message">
                  Think about what controls the action in the story.
                </p>
              )}
            </div>
          )}

          <div className="practice__actions">
            {showContinue ? (
              <Link to={`/moral/${id}`} className="practice__continue">
                <span>Continue</span>
                <span className="practice__continue-arrow" aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              </Link>
            ) : (
              <button
                type="button"
                className="practice__run"
                onClick={handleRun}
                disabled={!selected || isCorrect}
              >
                ✨ See What Happens
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function Practice() {
  const { id } = useParams();
  return <PracticeView key={id} id={id} />;
}
