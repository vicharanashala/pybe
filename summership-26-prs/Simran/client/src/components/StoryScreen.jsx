import { useState, useEffect } from "react";
import StoryCard from "./StoryCard.jsx";
import LearningProgress from "./LearningProgress.jsx";
import { STORY_CARDS } from "./storyContent.js";
import { LEVEL_ORDER } from "../levels.js";

// Each level walks through 4 learning stages (Story, Concept, Practice,
// Quiz) — this keeps the overall "Level X of Y" count correct even as
// more levels are added, instead of hardcoding it.
const STAGES_PER_LEVEL = 4;
const TOTAL_LEVELS = LEVEL_ORDER.length * STAGES_PER_LEVEL;

export default function StoryScreen({ onNext, onStoryProgress }) {
  const [index, setIndex] = useState(0);
    useEffect(() => {
    onStoryProgress(0);
  }, []);
  const [direction, setDirection] = useState("forward");

  const total = STORY_CARDS.length;
useEffect(() => {
  const storyProgress = Math.round(((index + 1) / total) * 100);
  onStoryProgress(storyProgress);
}, [index, total, onStoryProgress]);

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const card = STORY_CARDS[index];

  // On the final card, Story is done and Concept lights up as the next
  // destination — before the user even clicks through.
  const stageStates = {
    story: isLast ? "completed" : "current",
    concept: isLast ? "current" : "locked",
    practice: "locked",
    quiz: "locked",
  };

  const progressNote = isLast
    ? "Next: Learn the inheritance concept."
    : "You're currently learning the Story section.";

  function goPrev() {
    if (isFirst) return;
    setDirection("backward");
    setIndex((i) => i - 1);
  }

function goNextCard() {
  if (isLast) return;

  setDirection("forward");

  setIndex((i) => {
    const nextIndex = i + 1;

    return nextIndex;
  });
}

  return (
    <div className="card">
      <h1 className="card-title">The Bird Family</h1>

      <p className="story-progress-caption">
        Story {index + 1} of {total}
      </p>
      <div className="story-progress-dots" aria-hidden="true">
        {STORY_CARDS.map((c, i) => (
          <span key={c.id} className={"story-dot" + (i <= index ? " filled" : "")} />
        ))}
      </div>

      <div className="story-card-viewport">
        {/* key forces a clean remount per card so the enter animation and
            the typewriter both restart from scratch */}
        <StoryCard key={card.id} card={card} direction={direction} />
      </div>

      <div className="story-nav-row">
        <button className="btn small" onClick={goPrev} disabled={isFirst}>
          ← Previous
        </button>

        {isLast ? (
          <button 
          className="btn btn-primary" 
          onClick={() => {
            onStoryProgress(100);
            onNext();
          }}
        >
            I understood the story
          </button>
        ) : (
          <button className="btn small active" onClick={goNextCard}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}