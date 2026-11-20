import React, { useState, useEffect } from "react";
import SkeletonChart from "./components/SkeletonChartModal.jsx";
import stories from "./data/skeletons.json";
import submitted from "../../server/src/data/db.json";
import Workbench from "../../../debugging-find-and-squash-the-bug/client/src/FindSquashBug.jsx";
import { createStoryProgressHook } from "../../../../shared/story-progress.mjs";
const useProgress = createStoryProgressHook(React);
export default function BakeryCrow({ onComplete }) {
  const [active, setActive] = useState(null),
    [practice, setPractice] = useState(false);
  const [completed, markComplete] = useProgress("bakery-crow");
  useEffect(() => {
    if (stories.every((story) => completed.has(story.title))) onComplete?.();
  }, [completed, onComplete]);
  if (practice)
    return (
      <section>
        <button onClick={() => setPractice(false)}>← Back to stories</button>
        <Workbench
          scenarios={submitted.scenarios}
          studyKey="bakery-crow-practice"
          showDebug={false}
        />
      </section>
    );
  if (active)
    return (
      <SkeletonChart
        scenario={active}
        onClose={() => {
          markComplete(active.title);
          setActive(null);
        }}
      />
    );
  return (
    <section className="bakery-crow-hub">
      <p>From stories to Python</p>
      <h1>The Royal Bakery &amp; The Thirsty Crow</h1>
      <p>
        Follow each story’s six connected moments, then explore how its actions
        become Python.
      </p>
      <div className="bakery-story-options">
        {stories.map((story, i) => (
          <button key={story.title} onClick={() => setActive(story)}>
            <span>{["🎂", "🐦", "🗂️"][i]}</span>
            <h2>{story.title}</h2>
            <p>
              {story.data.coreNodes.bigProblem.replace("[Big Problem] ", "")}
            </p>
            <small>
              {completed.has(story.title) ? "Read again" : "Explore story"} →
            </small>
          </button>
        ))}
      </div>
      <button onClick={() => setPractice(true)}>
        Explore the 30 submitted reasoning scenarios →
      </button>
    </section>
  );
}
