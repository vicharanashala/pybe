import { Link } from "react-router-dom";
import StorybookHero from "../components/StoryImage/StoryImage";
import "./Landing.css";

export default function Landing() {
  return (
    <main className="landing">
      <span className="landing__frame" aria-hidden="true" />

      <header className="landing__header">
        <Link to="/" className="landing__logo" aria-label="PyKatha — back to the beginning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5 C 9 3 5 3 3 4.5 V 18 C 5 16.5 9 16.5 12 19 C 15 16.5 19 16.5 21 18 V 4.5 C 19 3 15 3 12 5 Z" />
            <path d="M12 5 V 19" />
            <path d="M7 8.5 C 8.5 7.6 10 7.6 11.5 8.5" opacity="0.7" />
          </svg>
        </Link>
      </header>

      <section className="landing__hero">
        <StorybookHero />

        <div className="landing__content">
          <h1 className="landing__title">PyKatha</h1>
          <p className="landing__tagline">
            Think the Story.
            <br />
            Discover the Code.
          </p>
          <p className="landing__desc">
            Learn Python concepts through timeless stories, careful observation, and
            logical thinking.
          </p>

          <Link to="/stories" className="landing__cta">
            <span className="landing__cta-icon" aria-hidden="true">
              📖
            </span>
            <span className="landing__cta-text">Open the Storybook</span>
            <span className="landing__cta-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      <footer className="landing__footer">Every great program begins with a great story.</footer>
    </main>
  );
}
