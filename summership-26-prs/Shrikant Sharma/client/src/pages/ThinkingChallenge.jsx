import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ThinkingChallenge.css";

const LETTERS = ["A", "B", "C", "D"];

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
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

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 3l4 4L8 20l-5 1 1-5Z" />
      <path d="M14.5 5.5l4 4" />
    </svg>
  );
}

function PatternIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

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

function BookOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5 C 9 3 5 3 3 4.5 V 18 C 5 16.5 9 16.5 12 19 C 15 16.5 19 16.5 21 18 V 4.5 C 19 3 15 3 12 5 Z" />
      <path d="M12 5 V 19" />
    </svg>
  );
}

const SKILL_ICONS = {
  Observation: <EyeIcon />,
  "Pattern recognition": <PatternIcon />,
  Reasoning: <BulbIcon />,
  Prediction: <SparkleIcon />,
  "Fill in the Blank": <PencilIcon />,
};

function ChallengeLoading() {
  return (
    <div className="challenge__loading">
      <div className="challenge__loading-inner" role="status" aria-live="polite">
        <span className="challenge__loading-icon" aria-hidden="true">
          <BookOpenIcon />
        </span>
        <p>Setting the scene&hellip;</p>
      </div>
    </div>
  );
}

function ChallengeMissing() {
  return (
    <div className="challenge__missing">
      <div>
        <h1>These questions have not been written yet.</h1>
        <p>The ink is still drying. Choose another tale from the storybook.</p>
        <Link to="/stories" className="challenge__missing-link">
          Return to the Storybook
        </Link>
      </div>
    </div>
  );
}

function ChallengeView({ id }) {
  const [questions, setQuestions] = useState(null);
  const [status, setStatus] = useState("loading");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState([]);

  const headingRef = useRef(null);
  const primaryRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    import(`../stories/${id}/questions.js`)
      .then((mod) => {
        if (cancelled) return;
        const list = mod.default || mod.questions || [];
        if (list.length === 0) {
          setStatus("missing");
          return;
        }
        setQuestions(list);
        setAnswers(Array(list.length).fill(null));
        setSubmitted(Array(list.length).fill(false));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const question = questions ? questions[index] : null;
  const isBlank = question?.type === "blank";
  const isSubmitted = question ? submitted[index] ?? false : false;
  const total = questions ? questions.length : 0;
  const selected = answers[index] ?? null;
  const hasAnswer = selected != null;
  const progressPercent = total > 0 ? ((index + (isSubmitted ? 1 : 0)) / total) * 100 : 0;
  const accepted = isBlank && question ? [String(question.options[question.answer])] : [];

  let isCorrect = false;
  if (isSubmitted && question) {
    isCorrect = answers[index] === question.answer;
  }

  let feedbackText = question?.explanation ?? "";
  if (isSubmitted && !isCorrect && isBlank) {
    feedbackText = `Not quite. ${feedbackText} The answer was "${accepted[0]}".`;
  } else if (isSubmitted && !isCorrect) {
    feedbackText = `Not quite. ${feedbackText}`;
  }

  useEffect(() => {
    if (status !== "ready") return;
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [index, status]);

  useEffect(() => {
    if (status === "ready" && isSubmitted && primaryRef.current) {
      primaryRef.current.focus({ preventScroll: true });
    }
  }, [status, isSubmitted]);

  useEffect(() => {
    if (status === "ready") window.scrollTo(0, 0);
  }, [index, status]);

  const selectOption = (optionIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
    if (isBlank) {
      setSubmitted((prev) => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
    }
  };

  const handlePrimary = () => {
    if (!isSubmitted) {
      setSubmitted((prev) => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
      return;
    }
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      setStatus("complete");
      window.scrollTo(0, 0);
    }
  };

  const optionState = (optionIndex) => {
    if (!isSubmitted) return "";
    if (optionIndex === question.answer) return "is-correct";
    if (optionIndex === selected) return "is-wrong";
    return "is-dimmed";
  };

  const optionMarker = (optionIndex) => {
    if (!isSubmitted) return LETTERS[optionIndex];
    if (optionIndex === question.answer) return <CheckIcon />;
    if (optionIndex === selected) return <CrossIcon />;
    return LETTERS[optionIndex];
  };

  let primaryLabel;
  if (!isSubmitted) {
    primaryLabel = index === total - 1 ? "Submit" : "Next";
  } else {
    primaryLabel = index === total - 1 ? "Finish" : "Continue";
  }

  if (status === "loading") {
    return (
      <main className="challenge">
        <span className="challenge__frame" aria-hidden="true" />
        <ChallengeLoading />
      </main>
    );
  }

  if (status === "missing") {
    return (
      <main className="challenge">
        <span className="challenge__frame" aria-hidden="true" />
        <ChallengeMissing />
      </main>
    );
  }

  const skillKey = (question.skill || "").toLowerCase().replace(/\s+/g, "-");
  const parts = isBlank ? question.question.split("____") : [];
  const blankFill = isBlank && selected != null ? question.options[selected] : "";

  return (
    <main className="challenge">
      <span className="challenge__frame" aria-hidden="true" />

      <header className="challenge__top">
        <Link to={`/story/${id}`} className="challenge__back">
          <ArrowLeftIcon />
          Back to Story
        </Link>
        <p className="challenge__note">No scores. Just thinking.</p>
      </header>

      {status === "complete" ? (
        <div className="challenge__done">
          <section className="challenge__done-card" aria-live="polite">
            <span className="challenge__done-icon" aria-hidden="true">
              <BookOpenIcon />
            </span>
            <p className="challenge__done-eyebrow">The Challenge Is Complete</p>
            <h1 className="challenge__done-title">Wonderful Thinking!</h1>
            <p className="challenge__done-text">
              You carefully observed the story.
              <br />
              Now let&rsquo;s discover the hidden logic inside it.
            </p>
            <Link to={`/reveal/${id}`} className="challenge__done-cta">
              <span>Discover the Secret</span>
              <span className="challenge__done-arrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
            </Link>
          </section>
        </div>
      ) : (
        <div className="challenge__stage">
          <section className="challenge__card">
            <div className="challenge__progress">
              <div className="challenge__progress-head">
                <span className="challenge__progress-label">Thinking Challenge</span>
                <span className="challenge__progress-step">
                  Question {index + 1} of {total}
                </span>
              </div>
              <div className="challenge__progress-track">
                <span
                  className="challenge__progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="challenge__question" key={index}>
              <span className={`challenge__skill challenge__skill--${skillKey}`}>
                <span className="challenge__skill-icon" aria-hidden="true">
                  {SKILL_ICONS[question.skill]}
                </span>
                {question.skill}
              </span>

              {isBlank ? (
                <p className="challenge__blank-line" ref={headingRef} tabIndex={-1}>
                  {parts[0]}
                  <span
                    key={selected}
                    className={`challenge__blank-fill ${isSubmitted ? (isCorrect ? "is-correct" : "is-wrong") : ""}`}
                    aria-live="polite"
                  >
                    {blankFill}
                  </span>
                  {parts[1]}
                </p>
              ) : (
                <h2 className="challenge__qtext" ref={headingRef} tabIndex={-1}>
                  {question.question}
                </h2>
              )}

              <ul
                className={`challenge__options ${isBlank ? "challenge__options--blank" : ""}`}
                role="group"
                aria-label={question.question}
              >
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <button
                      type="button"
                      className={`challenge__option ${question.type === "predict" ? "is-predict" : ""} ${
                        isBlank ? "is-blank" : ""
                      } ${selected === optionIndex ? "is-selected" : ""} ${optionState(optionIndex)}`}
                      aria-pressed={selected === optionIndex}
                      disabled={isSubmitted}
                      onClick={() => selectOption(optionIndex)}
                    >
                      <span className="challenge__option-marker" aria-hidden="true">
                        {optionMarker(optionIndex)}
                      </span>
                      <span className="challenge__option-text">{option}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {isSubmitted && (
                <div className={`challenge__feedback ${isCorrect ? "is-correct" : "is-wrong"}`} role="status">
                  <span className="challenge__feedback-icon" aria-hidden="true">
                    {isCorrect ? <CheckIcon /> : <CrossIcon />}
                  </span>
                  <p className="challenge__feedback-text">{feedbackText}</p>
                </div>
              )}

              <div className="challenge__nav">
                <button
                  type="button"
                  className="challenge__prev"
                  onClick={() => setIndex(index - 1)}
                  disabled={index === 0}
                >
                  <ArrowLeftIcon />
                  Previous
                </button>
                <button
                  type="button"
                  ref={primaryRef}
                  className="challenge__primary"
                  onClick={handlePrimary}
                  disabled={!isSubmitted && !hasAnswer}
                >
                  {primaryLabel}
                  <span className="challenge__primary-arrow" aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default function ThinkingChallenge() {
  const { id } = useParams();
  return <ChallengeView key={id} id={id} />;
}
