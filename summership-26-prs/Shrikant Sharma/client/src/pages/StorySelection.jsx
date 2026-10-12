import { Link } from "react-router-dom";
import StoryCard from "../components/StoryCard/StoryCard";
import "./StorySelection.css";

const STORIES = [
  {
    title: "Rabbit and the Moon",
    concept: "Python if Statement",
    difficulty: "Beginner",
    minutes: 5,
    href: "/story/rabbit-if",
    variant: "moon",
    artSpan: "46%",
    accent: "#3f5b41",
  },
  {
    title: "Crow and the Pitcher",
    concept: "Python while Loop",
    difficulty: "Beginner",
    minutes: 6,
    href: "/story/crow-while",
    variant: "crow",
    artSpan: "40%",
    accent: "#c66a2b",
  },
  {
    title: "The Turtle's Journey",
    concept: "Python for Loop",
    difficulty: "Beginner",
    minutes: 5,
    href: "/story/turtle-for",
    variant: "turtle",
    artSpan: "48%",
    accent: "#b8893a",
  },
];

const CHAPTER_WORDS = ["One", "Two", "Three"];
const CHAPTER_NUMERALS = ["I", "II", "III"];

export default function StorySelection() {
  return (
    <main className="stories">
      <span className="stories__frame" aria-hidden="true" />

      <nav className="stories__nav" aria-label="Navigation">
        <Link to="/" className="stories__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to Home
        </Link>
      </nav>

      <header className="stories__head">
        <h1 className="stories__title">Choose Your Story</h1>
        <p className="stories__subtitle">
          Every story hides a Python concept.
          <br />
          Read carefully. Think deeply. Discover the code.
        </p>
      </header>

      <section className="stories__list" aria-label="Stories">
        {STORIES.map((story, index) => (
          <StoryCard
            key={story.href}
            story={story}
            index={index}
            chapterWord={CHAPTER_WORDS[index]}
            numeral={CHAPTER_NUMERALS[index]}
          />
        ))}
      </section>

      <footer className="stories__footer">
        &ldquo;The greatest programs begin with the simplest stories.&rdquo;
      </footer>
    </main>
  );
}
