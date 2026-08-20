import { useState } from "react";
import {
  EagleChild,
  SparrowChild,
  PenguinChild,
  OwlChild,
  DuckChild,
} from "./BirdIllustration.jsx";
import { LEVELS, LEVEL_ORDER } from "../levels.js";

// Maps the "illustration" string already stored on each level in levels.js
// to the actual bird component — no new content is invented here, this
// just visualizes what levels.js already says about each child bird.
const ILLUSTRATIONS = {
  EagleChild,
  SparrowChild,
  PenguinChild,
  OwlChild,
  DuckChild,
};

const RELATION_LABEL = {
  inherit: "inherits everything",
  extend: "inherits + adds new",
  override: "overrides one method",
  superOverride: "extends with super()",
  duck: "inherits + adds new",
};

function traitClass(method) {
  if (method.isNew) return "trait-chip trait-new";
  if (method.isOverride) return "trait-chip trait-override";
  return "trait-chip trait-inherited";
}

function traitTag(method) {
  if (method.isNew) return "new";
  if (method.isOverride) return "changed";
  return "inherited";
}

export default function TraitFlipCards() {
  const [flipped, setFlipped] = useState({});

  function toggle(id) {
    setFlipped((f) => ({ ...f, [id]: !f[id] }));
  }

  return (
    <div className="flip-card-grid">
      {LEVEL_ORDER.map((id) => {
        const level = LEVELS[id];
        const Illustration = ILLUSTRATIONS[level.illustration];
        const isFlipped = !!flipped[id];

        return (
          <button
            key={id}
            type="button"
            className={"flip-card" + (isFlipped ? " is-flipped" : "")}
            onClick={() => toggle(id)}
            aria-pressed={isFlipped}
            aria-label={
              (isFlipped ? "Showing" : "Show") +
              " traits for " +
              level.className
            }
          >
            <div className="flip-card-inner">
              <div className="flip-card-face flip-card-front">
                {Illustration && <Illustration size={64} />}
                <p className="flip-card-name">{level.className}</p>
                <p className="flip-card-tag">{RELATION_LABEL[id]}</p>
                <span className="flip-card-hint">Tap to flip ↻</span>
              </div>
              <div className="flip-card-face flip-card-back">
                <p className="flip-card-back-title">{level.title}</p>
                <ul className="flip-card-trait-list">
                  {level.methods.map((m) => (
                    <li key={m.id} className={traitClass(m)}>
                      <code>{m.id}()</code>
                      <span className="trait-chip-label">{traitTag(m)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
