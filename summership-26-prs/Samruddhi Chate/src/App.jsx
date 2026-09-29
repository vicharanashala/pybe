import { useState } from "react";
import ProgressDots from "./components/ProgressDots.jsx";

import StartScene from "./scenes/StartScene.jsx";
import Scene1Problem from "./scenes/Scene1Problem.jsx";
import Scene2Idea from "./scenes/Scene2Idea.jsx";
import Scene3Call from "./scenes/Scene3Call.jsx";
import Scene4Parameter from "./scenes/Scene4Parameter.jsx";
import Scene5Argument from "./scenes/Scene5Argument.jsx";
import Scene6Return from "./scenes/Scene6Return.jsx";
import FinalScene from "./scenes/FinalScene.jsx";
import CompletionScene from "./scenes/CompletionScene.jsx";

const SCENES = [
  StartScene,
  Scene1Problem,
  Scene2Idea,
  Scene3Call,
  Scene4Parameter,
  Scene5Argument,
  Scene6Return,
  FinalScene,
  CompletionScene,
];

const CHAPTER_RANGE = [1, 6]; // scene indices 1..6 count toward the 6 dots

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(0);

  function goNext() {
    setSceneIndex((i) => Math.min(i + 1, SCENES.length - 1));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function goBack() {
    setSceneIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function replay() {
    setSceneIndex(0);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  const CurrentScene = SCENES[sceneIndex];
  const showDots = sceneIndex >= CHAPTER_RANGE[0] && sceneIndex <= CHAPTER_RANGE[1];
  const showBack = sceneIndex > 0;

  return (
    <div className="story-shell">
      <div className="story-topbar">
        {showBack ? (
          <button type="button" className="story-back" onClick={goBack}>
            ← Back
          </button>
        ) : (
          <span className="story-back-spacer" />
        )}
        {showDots ? (
          <ProgressDots total={6} currentIndex={sceneIndex - CHAPTER_RANGE[0]} />
        ) : (
          <span />
        )}
        <span className="story-back-spacer" aria-hidden="true" />
      </div>

      <main className="story-main">
        <CurrentScene key={sceneIndex} onNext={goNext} onBack={goBack} onReplay={replay} />
      </main>
    </div>
  );
}
