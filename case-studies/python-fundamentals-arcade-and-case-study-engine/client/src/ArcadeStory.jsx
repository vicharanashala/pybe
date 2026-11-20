import React, { useEffect } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import PixelArtPage from "./pixel/PixelArtPage.jsx";
import PythonPetPage from "./pet/PythonPetPage.jsx";
import CodeInvadersPage from "./invaders/CodeInvadersPage.jsx";
import Workbench from "../../../../client/src/learning/ScenarioWorkbench.jsx";
import CollectionPage from "../../../../client/src/learning/CollectionPage.jsx";
import topics from "../../server/src/data/content.json";
import submitted from "../../server/src/data/db.json";
import { createStoryProgressHook } from "../../../../shared/story-progress.mjs";
const useProgress = createStoryProgressHook(React);
export default function ArcadeStory({ onComplete }) {
  const [completed, complete] = useProgress("python-arcade");
  useEffect(() => {
    if (
      ["checkerboard", "border", "diagonals", "pet", "invaders"].every((id) =>
        completed.has(id),
      )
    )
      onComplete?.();
  }, [completed, onComplete]);
  return (
    <section className="arcade-story">
      <nav className="arcade-nav">
        {[
          ["/explore", "Scenario Explorer"],
          ["/learn", "Case Study Learning"],
          ["/pet", "Python Pet"],
          ["/pixel", "Pixel Art"],
          ["/invaders", "Code Invaders"],
        ].map(([to, label]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/pixel" replace />} />
        <Route
          path="/explore"
          element={
            <Workbench
              scenarios={submitted.scenarios}
              studyKey="arcade-reasoning"
              showDebug={false}
            />
          }
        />
        <Route
          path="/learn"
          element={
            <CollectionPage
              lesson={{ collection: "python-fundamentals", topics }}
            />
          }
        />
        <Route
          path="/pet"
          element={<PythonPetPage onComplete={() => complete("pet")} />}
        />
        <Route path="/pixel" element={<PixelArtPage onComplete={complete} />} />
        <Route
          path="/invaders"
          element={<CodeInvadersPage onComplete={() => complete("invaders")} />}
        />
      </Routes>
    </section>
  );
}
