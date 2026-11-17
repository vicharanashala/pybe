import { Fragment, useState } from "react";
import { EagleChild, SparrowChild, PenguinChild, OwlChild, DuckChild } from "./BirdIllustration.jsx";
import { LEVELS, LEVEL_ORDER } from "../levels.js";

const ILLUSTRATIONS = {
  EagleChild,
  SparrowChild,
  PenguinChild,
  OwlChild,
  DuckChild,
};

// ASSUMPTION FLAGGED: there is no per-level scoring/star data anywhere in the
// codebase I've seen (levels.js has no stars field, and TrySimulator just
// tracks which methods were tried, not "how well"). So stars are shown as a
// simple completed-or-not indicator: 3/3 filled once a level is completed,
// 0/3 otherwise. If you do have a real star-scoring rule elsewhere, swap the
// `starsFor()` function below for the real one — nothing else here needs to
// change.
const MAX_STARS = 3;
function starsFor(isCompleted) {
  return isCompleted ? MAX_STARS : 0;
}

/**
 * The Challenge Path — now a persistent hub shown before every level, not
 * just once before the first one.
 *
 * Props:
 *  - currentLevelId: the id (from LEVEL_ORDER) of the level the learner can
 *    currently play. Everything before it in LEVEL_ORDER is "completed",
 *    everything after is "locked".
 *  - completedLevelIds: array of ids already finished (drives stars/badges).
 *  - justUnlockedId: id that should play the unlock animation right now, or
 *    null. Cleared by calling onUnlockSeen once the animation has run.
 *  - onUnlockSeen(): tells the parent the unlock animation has been shown,
 *    so it isn't replayed on unrelated re-renders.
 *  - onStart(): starts currentLevelId (same contract as the original
 *    LevelMap — only one node is ever startable at a time since levels
 *    unlock strictly in order).
 *  - points: unchanged from the original prop.
 */
export default function LevelMap({
  currentLevelId,
  completedLevelIds = [],
  justUnlockedId = null,
  onUnlockSeen,
  onStart,
  points,
}) {
  const [animatedNodeId, setAnimatedNodeId] = useState(justUnlockedId);
  // Keep local animation state in sync if a new unlock comes in while this
  // component stays mounted (it does — App.jsx just re-renders it in place).
  if (justUnlockedId !== animatedNodeId && justUnlockedId !== null) {
    setAnimatedNodeId(justUnlockedId);
  }

  const completedCount = completedLevelIds.length;
  const allDone = completedCount === LEVEL_ORDER.length;

  function nodeState(id) {
    if (completedLevelIds.includes(id)) return "completed";
    if (id === currentLevelId) return "current";
    return "locked";
  }

  function handleUnlockAnimationEnd(id) {
    if (id === animatedNodeId) {
      setAnimatedNodeId(null);
      onUnlockSeen?.();
    }
  }

  return (
    <div className="card level-map-card">
      <p className="eyebrow">QUIZ · {LEVEL_ORDER.length} LEVELS</p>
      <h1 className="card-title">Your Challenge Path</h1>
      <p className="level-map-intro">
        {allDone
          ? "All five levels cleared — nice work."
          : "Five birds, five lessons in inheritance. Clear each one to unlock the next."}
      </p>

      <div className="level-map-stats">
        <span className="header-points">🌟 {points} pts</span>
        <span className="level-map-stats-note">
          {completedCount} / {LEVEL_ORDER.length} completed
        </span>
      </div>

      <div className="lm-progress-track" aria-hidden="true">
        <div
          className="lm-progress-fill"
          style={{ width: `${Math.round((completedCount / LEVEL_ORDER.length) * 100)}%` }}
        />
      </div>

      <div className="level-map-path">
        {LEVEL_ORDER.map((id, i) => {
          const level = LEVELS[id];
          const Illustration = ILLUSTRATIONS[level.illustration];
          const state = nodeState(id);
          const isCompleted = state === "completed";
          const isCurrent = state === "current";
          const isJustUnlocked = animatedNodeId === id && (isCurrent || isCompleted);
          const prevId = LEVEL_ORDER[i - 1];
          const connectorFilled = i > 0 && completedLevelIds.includes(prevId);
          const stars = starsFor(isCompleted);

          return (
            <Fragment key={id}>
              {i > 0 && (
                <div
                  className={"level-map-connector lm-connector" + (connectorFilled ? " lm-connector-filled" : "")}
                  aria-hidden="true"
                />
              )}
              <div className={"level-map-row is-" + state}>
                <div
                  className={
                    "level-map-node is-" + state + (isJustUnlocked ? " lm-node-unlocking" : "")
                  }
                  onAnimationEnd={() => handleUnlockAnimationEnd(id)}
                >
                  <Illustration size={44} />
                  <span className="level-map-node-badge-icon" aria-hidden="true">
                    {state === "locked" ? "🔒" : state === "completed" ? "✔" : "▶"}
                  </span>
                </div>

                <div className="level-map-info">
                  <p className="level-map-node-eyebrow">
                    {level.badge}
                    {typeof level.xp === "number" && (
                      <span className="lm-xp-pill" aria-label={`${level.xp} XP`}>
                        ⚡ {level.xp} XP
                      </span>
                    )}
                  </p>
                  <p className="level-map-node-title">{level.className}</p>
                  <p className="level-map-node-desc">{level.title}</p>
                  {isCompleted && (
                    <p className="lm-stars" aria-label={`${stars} out of ${MAX_STARS} stars`}>
                      {Array.from({ length: MAX_STARS }).map((_, si) => (
                        <span key={si} className={si < stars ? "lm-star lm-star-filled" : "lm-star"}>
                          ★
                        </span>
                      ))}
                    </p>
                  )}
                </div>

                {isCurrent && (
                  <button className="btn btn-primary small level-map-start" onClick={onStart}>
                    {completedCount === 0 ? "Start" : "Continue"}
                  </button>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}