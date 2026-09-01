import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./SecretBehindStory.css";

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

function RevealLoading() {
  return (
    <div className="reveal__loading">
      <div className="reveal__loading-inner" role="status" aria-live="polite">
        <span className="reveal__loading-icon" aria-hidden="true">
          <BookOpenIcon />
        </span>
        <p>Turning the page quietly&hellip;</p>
      </div>
    </div>
  );
}

function RevealMissing() {
  return (
    <div className="reveal__missing">
      <div>
        <h1>This secret has not been written yet.</h1>
        <p>The ink is still drying. Choose another tale from the storybook.</p>
        <Link to="/stories" className="reveal__missing-link">
          Return to the Storybook
        </Link>
      </div>
    </div>
  );
}

function RevealView({ id }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    import(`../stories/${id}/code.js`)
      .then((mod) => {
        if (cancelled) return;
        const loaded = mod.default || null;
        if (!loaded || !loaded.code) {
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

  const steps = data
    ? [
        { eyebrow: "Remember the story", body: data.storyMoment },
        { eyebrow: "See the pattern", body: data.pattern },
        { eyebrow: "Shape the logic", body: data.logic },
        { eyebrow: "The secret appears", code: data.code },
      ]
    : [];

  const total = steps.length;
  const isFinal = status === "ready" && step >= total;
  const current = isFinal ? null : steps[step];

  const advance = useCallback(() => {
    setStep((previous) => Math.min(previous + 1, steps.length));
  }, [steps.length]);

  useEffect(() => {
    if (status !== "ready") return;
    const onKey = (event) => {
      if (event.key !== "Enter") return;
      if (event.target instanceof HTMLElement && event.target.closest("button")) return;
      advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, advance]);

  useEffect(() => {
    if (status !== "ready") return;
    window.scrollTo(0, 0);
  }, [status, step]);

  useEffect(() => {
    if (status === "ready" && cardRef.current) {
      cardRef.current.focus({ preventScroll: true });
    }
  }, [status, step]);

  if (status === "loading") {
    return (
      <main className="reveal">
        <span className="reveal__frame" aria-hidden="true" />
        <RevealLoading />
      </main>
    );
  }

  if (status === "missing") {
    return (
      <main className="reveal">
        <span className="reveal__frame" aria-hidden="true" />
        <RevealMissing />
      </main>
    );
  }

  return (
    <main className="reveal">
      <span className="reveal__frame" aria-hidden="true" />

      <header className="reveal__top">
        <Link to={`/story/${id}`} className="reveal__back">
          <ArrowLeftIcon />
          Back to Story
        </Link>
      </header>

      <div className="reveal__stage">
        {isFinal ? (
          <section className="reveal__transition" ref={cardRef} tabIndex={-1}>
            <h2 className="reveal__transition-title">Now it&rsquo;s your turn</h2>
            <p className="reveal__transition-text">
              You&rsquo;ve seen how the story transforms into code. Try applying it yourself.
            </p>
            <button
              type="button"
              className="reveal__try"
              onClick={() => navigate(`/practice/${id}`)}
            >
              ✨ Try It Yourself →
            </button>
          </section>
        ) : (
          <section className="reveal__card" ref={cardRef} tabIndex={-1}>
            <p className="reveal__steps" aria-label={`Step ${step + 1} of ${total}`}>
              {steps.map((_, index) => (
                <span key={index} className={index <= step ? "is-on" : ""} aria-hidden="true" />
              ))}
            </p>
            <p className="reveal__eyebrow">{current.eyebrow}</p>
            {current.code ? (
              <div className="reveal__code-wrap">
                <pre className="reveal__code">
                  <code>{current.code}</code>
                </pre>
              </div>
            ) : (
              <p className="reveal__body">{current.body}</p>
            )}
            <button type="button" className="reveal__next" onClick={advance}>
              <span>{step === total - 1 ? "Continue" : "Next"}</span>
              <span className="reveal__next-arrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default function SecretBehindStory() {
  const { id } = useParams();
  return <RevealView key={id} id={id} />;
}
