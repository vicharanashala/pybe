import { useState } from "react";
import { BirdParent, EagleChild, DuckChild, PenguinChild } from "./BirdIllustration.jsx";
import { JARGON_DEFINITIONS } from "./JargonTerm.jsx";

// One walkthrough card per core term, in teaching order. Reuses the exact
// same definitions shown in the JargonTerm tooltips elsewhere (single
// source of truth) and pairs each one with its own small interactive
// animation plus a one-line callback to the Bird Family story.
const TERMS = [
  {
    id: "class",
    label: "Class",
    story:
      "Bird itself is just a class — a blueprint. No real bird exists yet, just the plan for eat(), sleep(), and fly().",
    Anim: ClassAnim,
  },
  {
    id: "object",
    label: "Object",
    story:
      "The moment a real bird hatches from that blueprint, it becomes an object — an actual living bird, not just a plan.",
    Anim: ObjectAnim,
  },
  {
    id: "parentClass",
    label: "Parent (class)",
    story: "Bird is the parent class — the original blueprint every other bird class starts from.",
    Anim: ParentAnim,
  },
  {
    id: "childClass",
    label: "Child (class)",
    story:
      "Eagle, Duck, Penguin, Sparrow, and Owl are all child classes — each one built from Bird, inheriting everything before adding or changing anything.",
    Anim: ChildAnim,
  },
  {
    id: "methods",
    label: "Methods",
    story:
      "eat(), sleep(), and fly() are methods — actions defined inside the Bird class that every child gets for free.",
    Anim: MethodsAnim,
  },
  {
    id: "methodOverriding",
    label: "Method Overriding",
    story:
      "Pingu the Penguin overrides fly() — same name, totally new behavior. (Quacker the Duck does something different: swim() is a brand-new method, not an override — more on that in a moment.)",
    Anim: OverrideAnim,
  },
];

// ---- Term 1: Class — a blueprint being drafted -----------------------
// A hand-drafted schematic look (grid backdrop + blue-tinted bird +
// dashed spec tags) that draws itself in, replayable on tap.
function ClassAnim() {
  const [play, setPlay] = useState(0);

  return (
    <div className="term-anim-stage term-blueprint-stage">
      <div className="term-blueprint-sheet" key={play}>
        <div className="term-blueprint-icon">
          <BirdParent size={68} />
        </div>
        <div className="term-blueprint-tags">
          <span className="term-blueprint-tag term-anim-pop-in" style={{ animationDelay: "0.7s" }}>
            eat()
          </span>
          <span className="term-blueprint-tag term-anim-pop-in" style={{ animationDelay: "0.95s" }}>
            sleep()
          </span>
          <span className="term-blueprint-tag term-anim-pop-in" style={{ animationDelay: "1.2s" }}>
            fly()
          </span>
        </div>
      </div>
      <p className="term-anim-caption">a blueprint being drafted — just a plan, nothing alive yet</p>
      <button type="button" className="btn small term-anim-replay-btn" onClick={() => setPlay((p) => p + 1)}>
        ↻ Draft it again
      </button>
    </div>
  );
}

// ---- Term 2: Object — the blueprint hatches into a living bird -------
// Tap-to-hatch egg: the shell cracks apart and a real, full-colour bird
// appears where the blueprint used to be.
function ObjectAnim() {
  const [hatched, setHatched] = useState(false);

  return (
    <div className="term-anim-stage term-egg-stage">
      <div className={"term-egg-scene" + (hatched ? " is-hatched" : "")}>
        <div className="term-egg-half term-egg-top" />
        <div className="term-egg-half term-egg-bottom" />
        <div className="term-egg-bird">
          <DuckChild size={60} />
        </div>
      </div>
      <p className="term-anim-caption">
        {hatched
          ? "hatched! a real, living bird — not just a plan anymore"
          : "still just a blueprint, waiting inside the egg"}
      </p>
      <button
        type="button"
        className="btn small term-anim-replay-btn"
        onClick={() => setHatched((h) => !h)}
      >
        {hatched ? "↻ Reset the egg" : "🥚 Tap to hatch"}
      </button>
    </div>
  );
}

// ---- Term 3: Parent (class) — traits flowing down from Bird ----------
// Bird sits at the top; its three habits drop down one by one, ready to
// be picked up by any child. Replayable on tap.
function ParentAnim() {
  const [play, setPlay] = useState(0);

  return (
    <div className="term-anim-stage">
      <div className="term-trait-stage" key={play}>
        <div className="term-trait-source">
          <BirdParent size={64} />
        </div>
        <div className="term-trait-drops">
          <span className="term-trait-chip term-anim-drop-in" style={{ animationDelay: "0.25s" }}>
            eat()
          </span>
          <span className="term-trait-chip term-anim-drop-in" style={{ animationDelay: "0.55s" }}>
            sleep()
          </span>
          <span className="term-trait-chip term-anim-drop-in" style={{ animationDelay: "0.85s" }}>
            fly()
          </span>
        </div>
      </div>
      <p className="term-anim-caption">every habit Bird already knows, ready to pass down</p>
      <button type="button" className="btn small term-anim-replay-btn" onClick={() => setPlay((p) => p + 1)}>
        ↻ Pass them down again
      </button>
    </div>
  );
}

// ---- Term 4: Child (class) — Eagle and Duck receiving Bird's traits --
// Same parent -> arrow -> children layout as before, now with each child
// visibly catching a trait badge underneath it. Replayable on tap.
function ChildAnim() {
  const [play, setPlay] = useState(0);

  return (
    <div className="term-anim-stage term-anim-flow" key={play}>
      <div className="term-anim-flow-parent">
        <BirdParent size={56} />
      </div>
      <span className="term-anim-flow-arrow" aria-hidden="true">
        ↓
      </span>
      <div className="term-anim-flow-children">
        <div className="term-anim-flow-child term-anim-flow-child-1">
          <EagleChild size={48} />
          <span className="term-child-badge term-anim-drop-in" style={{ animationDelay: "0.55s" }}>
            gets all 3
          </span>
        </div>
        <div className="term-anim-flow-child term-anim-flow-child-2">
          <DuckChild size={48} />
          <span className="term-child-badge term-anim-drop-in" style={{ animationDelay: "0.8s" }}>
            gets all 3 + swim()
          </span>
        </div>
      </div>
      <button type="button" className="btn small term-anim-replay-btn" onClick={() => setPlay((p) => p + 1)}>
        ↻ Watch it again
      </button>
    </div>
  );
}

// ---- Term 5: Methods — eat(), sleep(), fly() stepping out one by one -
// A clean vertical stack (one method per line) with generous, evenly
// spaced pacing so each action is easy to read as it lands.
function MethodsAnim() {
  const [play, setPlay] = useState(0);

  return (
    <div className="term-anim-stage">
      <div className="term-anim-chip-col" key={play}>
        <span className="term-chip term-anim-pop-in term-anim-delay-1">🌾 eat()</span>
        <span className="term-chip term-anim-pop-in term-anim-delay-2">💤 sleep()</span>
        <span className="term-chip term-anim-pop-in term-anim-delay-3">🕊️ fly()</span>
      </div>
      <p className="term-anim-caption">actions defined inside a class — appearing one by one</p>
      <button type="button" className="btn small term-anim-replay-btn" onClick={() => setPlay((p) => p + 1)}>
        ↻ Play again
      </button>
    </div>
  );
}

// ---- Term 6: Method Overriding — Pingu swaps fly() for his own version
// Tap-to-override toggle: the default Bird behavior visibly fades back
// while Pingu's own version steps forward, and can be toggled back.
function OverrideAnim() {
  const [overridden, setOverridden] = useState(false);

  return (
    <div className="term-anim-stage">
      <div className="term-anim-override-icon">
        <PenguinChild size={48} />
      </div>
      <div className={"term-override-row" + (overridden ? " is-overridden" : "")}>
        <span className="term-chip term-chip-old">fly() → gliding through the sky</span>
        <span className="term-chip term-chip-new">fly() → diving and swimming instead</span>
      </div>
      <button
        type="button"
        className="btn small term-anim-replay-btn"
        onClick={() => setOverridden((o) => !o)}
      >
        {overridden ? "↻ Reset to default" : "🔁 Tap to override fly()"}
      </button>
    </div>
  );
}

export default function TermWalkthrough({ onNext, onBack }) {
  const [index, setIndex] = useState(0);
  const isFirst = index === 0;
  const isLast = index === TERMS.length - 1;
  const term = TERMS[index];
  const entry = JARGON_DEFINITIONS[term.id];
  const Anim = term.Anim;

  function goBack() {
    if (isFirst) {
      onBack();
    } else {
      setIndex((i) => i - 1);
    }
  }

  function goForward() {
    if (isLast) {
      onNext();
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="term-walkthrough">
      <div className="term-walkthrough-dots" aria-hidden="true">
        {TERMS.map((t, i) => (
          <span key={t.id} className={"term-walkthrough-dot" + (i === index ? " current" : "") + (i < index ? " filled" : "")} />
        ))}
      </div>

      <div className="term-card" key={term.id}>
        <p className="term-card-count">
          Term {index + 1} of {TERMS.length}
        </p>
        <h3 className="term-card-title">{term.label}</h3>

        <Anim />

        <p className="term-card-definition">{entry.definition}</p>
        <div className="term-card-story">
          <p>{term.story}</p>
        </div>
      </div>

      <div className="concept-nav">
        <button className="btn small" onClick={goBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={goForward}>
          {isLast ? "Continue to summary" : "Next term"}
        </button>
      </div>
    </div>
  );
}
