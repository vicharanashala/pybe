import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Moral.css";

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

function MoralLoading() {
  return (
    <div className="moral__loading">
      <div className="moral__loading-inner" role="status" aria-live="polite">
        <span className="moral__loading-icon" aria-hidden="true">
          <BookOpenIcon />
        </span>
        <p>Gathering the meaning&hellip;</p>
      </div>
    </div>
  );
}

function MoralMissing() {
  return (
    <div className="moral__missing">
      <div>
        <h1>This lesson has not been written yet.</h1>
        <p>The ink is still drying. Choose another tale from the storybook.</p>
        <Link to="/stories" className="moral__missing-link">
          Return to the Storybook
        </Link>
      </div>
    </div>
  );
}

function MoralView({ id }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  const cardRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    import(`../stories/${id}/moral.js`)
      .then((mod) => {
        if (cancelled) return;
        const loaded = mod.default || null;
        if (!loaded || !loaded.conceptName) {
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

  if (status === "loading") {
    return (
      <main className="moral">
        <span className="moral__frame" aria-hidden="true" />
        <MoralLoading />
      </main>
    );
  }

  if (status === "missing") {
    return (
      <main className="moral">
        <span className="moral__frame" aria-hidden="true" />
        <MoralMissing />
      </main>
    );
  }

  return (
    <main className="moral">
      <span className="moral__frame" aria-hidden="true" />

      <header className="moral__top">
        <Link to={`/story/${id}`} className="moral__back">
          <ArrowLeftIcon />
          Back to the Story
        </Link>
      </header>

      <div className="moral__stage">
        <section className="moral__card" ref={cardRef} tabIndex={-1}>
          <p className="moral__eyebrow">The lesson</p>
          <h1 className="moral__title">You discovered something powerful</h1>

          <div className="moral__concept">
            <p className="moral__concept-name">{data.conceptName}</p>
            <p className="moral__concept-line">{data.conceptLine}</p>
          </div>

          <div className="moral__section moral__section--reflection">
            <h2 className="moral__section-label">In the story</h2>
            <p className="moral__section-text">{data.storyReflection}</p>
          </div>

          <div className="moral__section moral__section--real">
            <h2 className="moral__section-label">In your life</h2>
            <p className="moral__section-text">{data.realLife}</p>
          </div>

          <p className="moral__closing">&ldquo;{data.closing}&rdquo;</p>

          <div className="moral__actions">
            <Link to="/stories" className="moral__cta moral__cta--primary">
              Read Another Story
              <span className="moral__cta-arrow" aria-hidden="true">
                <ArrowRightIcon />
              </span>
            </Link>
            <Link to="/" className="moral__cta moral__cta--secondary">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function Moral() {
  const { id } = useParams();
  return <MoralView key={id} id={id} />;
}
