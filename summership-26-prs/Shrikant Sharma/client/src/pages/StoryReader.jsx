import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoryIllustration from "../components/StoryIllustration/StoryIllustration";
import "./StoryReader.css";

const STORY_IDS = ["rabbit-if", "crow-while", "turtle-for"];

function ConceptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7l4 5-4 5" />
      <path d="M11 17h9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5 C 9 3 5 3 3 4.5 V 18 C 5 16.5 9 16.5 12 19 C 15 16.5 19 16.5 21 18 V 4.5 C 19 3 15 3 12 5 Z" />
      <path d="M12 5 V 19" />
    </svg>
  );
}

function ReadyArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function StoryLoading() {
  return (
    <div className="reader__loading">
      <div className="reader__loading-inner" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="reader__loading-book" aria-hidden="true">
          <path d="M12 5 C 9 3 5 3 3 4.5 V 18 C 5 16.5 9 16.5 12 19 C 15 16.5 19 16.5 21 18 V 4.5 C 19 3 15 3 12 5 Z" />
          <path d="M12 5 V 19" />
        </svg>
        <p>Opening the storybook&hellip;</p>
      </div>
    </div>
  );
}

function StoryMissing() {
  return (
    <div className="reader__missing">
      <div>
        <h1>This story has not been written yet.</h1>
        <p>Perhaps the ink ran dry. Choose another tale from the storybook.</p>
        <Link to="/stories" className="reader__missing-link">
          Return to the Storybook
        </Link>
      </div>
    </div>
  );
}

function StoryView({ id }) {
  const [story, setStory] = useState(null);
  const [status, setStatus] = useState("loading");
  const [nav, setNav] = useState({ prev: null, next: null });

  const progressRef = useRef(null);
  const barRef = useRef(null);
  const artRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const idx = STORY_IDS.indexOf(id);
    const prevId = idx > 0 ? STORY_IDS[idx - 1] : null;
    const nextId = idx >= 0 && idx < STORY_IDS.length - 1 ? STORY_IDS[idx + 1] : null;

    const load = (storyId) =>
      import(`../stories/${storyId}/story.js`)
        .then((mod) => mod.default)
        .catch(() => null);

    load(id).then((data) => {
      if (cancelled) return;
      if (!data) {
        setStatus("missing");
        return;
      }
      setStory(data);
      setStatus("ready");
    });

    Promise.all([
      prevId ? load(prevId) : Promise.resolve(null),
      nextId ? load(nextId) : Promise.resolve(null),
    ]).then(([prev, next]) => {
      if (cancelled) return;
      setNav({
        prev: prevId && prev ? { id: prevId, title: prev.title } : null,
        next: nextId && next ? { id: nextId, title: next.title } : null,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (status !== "ready") return;
    if (headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [status]);

  useEffect(() => {
    if (status !== "ready") return;

    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;

      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
      if (progressRef.current) {
        progressRef.current.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
      }
      if (artRef.current) {
        artRef.current.style.transform = `translateY(${Math.min(30, progress * 44)}px) scale(1.02)`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [status]);

  if (status === "loading") {
    return (
      <main className="reader">
        <span className="reader__frame" aria-hidden="true" />
        <StoryLoading />
      </main>
    );
  }

  if (status === "missing") {
    return (
      <main className="reader">
        <span className="reader__frame" aria-hidden="true" />
        <StoryMissing />
      </main>
    );
  }

  return (
    <main className="reader">
      <span className="reader__frame" aria-hidden="true" />

      <div
        className="reader__progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
        ref={progressRef}
      >
        <span className="reader__progress-label">Reading Progress</span>
        <span className="reader__progress-track">
          <span className="reader__progress-fill" ref={barRef} />
        </span>
      </div>

      <article className="reader__page">
        <div className="reader__hero">
          <div className="reader__art" ref={artRef}>
            <StoryIllustration type={story.illustrationType} />
          </div>
        </div>

        <header className="reader__meta">
          <p className="reader__chapter" ref={headingRef} tabIndex={-1}>
            {story.chapter}
          </p>
          <h1 className="reader__title">{story.title}</h1>
          <div className="reader__badges">
            <span className="reader__badge reader__badge--concept">
              <ConceptIcon />
              {story.concept}
            </span>
            <span className="reader__badge">
              <ClockIcon />
              {story.readingTime} min read
            </span>
          </div>
        </header>

        <div className="reader__text">
          {story.paragraphs.map((paragraph, index) => (
            <p key={index} className="reader__para">
              {paragraph}
            </p>
          ))}
        </div>

        <section className="reader__reflect" aria-label="Take a moment">
          <span className="reader__reflect-eyebrow">{story.chapter} &middot; A pause</span>
          <h2 className="reader__reflect-title">Take a Moment</h2>
          <p className="reader__reflect-text">
            Have you understood the story?
            <br />
            Think carefully before moving on.
            <br />
            The questions will test your understanding, not your memory.
          </p>
          <Link to={`/challenge/${id}`} className="reader__reflect-cta">
            <span>I&rsquo;m Ready</span>
            <span className="reader__reflect-arrow" aria-hidden="true">
              <ReadyArrowIcon />
            </span>
          </Link>
        </section>
      </article>

      <nav className="reader__nav" aria-label="Story navigation">
        {nav.prev ? (
          <Link to={`/story/${nav.prev.id}`} className="reader__nav-btn">
            <span className="reader__nav-btn-icon">
              <ArrowLeftIcon />
            </span>
            <span className="reader__nav-btn-text">
              <strong>Previous Story</strong>
              <small>{nav.prev.title}</small>
            </span>
          </Link>
        ) : (
          <span className="reader__nav-btn is-disabled" aria-disabled="true">
            <span className="reader__nav-btn-icon">
              <ArrowLeftIcon />
            </span>
            <span className="reader__nav-btn-text">
              <strong>Previous Story</strong>
              <small>The first chapter</small>
            </span>
          </span>
        )}

        <Link to="/stories" className="reader__nav-btn reader__nav-btn--center">
          <span className="reader__nav-btn-icon">
            <BookIcon />
          </span>
          <span className="reader__nav-btn-text">
            <strong>Story Selection</strong>
          </span>
        </Link>

        {nav.next ? (
          <Link to={`/story/${nav.next.id}`} className="reader__nav-btn">
            <span className="reader__nav-btn-text">
              <strong>Next Story</strong>
              <small>{nav.next.title}</small>
            </span>
            <span className="reader__nav-btn-icon">
              <ArrowRightIcon />
            </span>
          </Link>
        ) : (
          <span className="reader__nav-btn is-disabled" aria-disabled="true">
            <span className="reader__nav-btn-text">
              <strong>Next Story</strong>
              <small>The final chapter</small>
            </span>
            <span className="reader__nav-btn-icon">
              <ArrowRightIcon />
            </span>
          </span>
        )}
      </nav>
    </main>
  );
}

export default function StoryReader() {
  const { id } = useParams();
  return <StoryView key={id} id={id} />;
}
