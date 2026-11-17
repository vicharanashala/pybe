import { useEffect, useRef, useState } from "react";
import Scene from "../components/Scene.jsx";
import ThinkItThrough from "../components/ThinkItThrough.jsx";
import DiscoverySummary from "../components/DiscoverySummary.jsx";
import { SAMPLE_PLATES } from "../data/vehicles.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CAR_STEPS = [
  { plate: SAMPLE_PLATES[0], text: "A car arrives. Mia checks it. The gate opens." },
  { plate: SAMPLE_PLATES[1], text: "Another car arrives. She checks it the same way again." },
  { plate: SAMPLE_PLATES[2], text: "One more car. Same steps, again." },
];

const QUESTIONS = [
  {
    id: "q1",
    prompt: "How many times does Mia repeat the exact same checklist?",
    options: [
      { id: "once", text: "Just once, for the first car" },
      { id: "every", text: "Every single car that arrives" },
      { id: "never", text: "She never repeats it" },
    ],
    correctId: "every",
    correctFeedback: "Right — every car gets the exact same five steps.",
  },
  {
    id: "q2",
    prompt: "What would actually help Mia here?",
    options: [
      { id: "newlist", text: "Writing a brand-new checklist for each car" },
      { id: "reuse", text: "Saving the steps once, and reusing them" },
      { id: "skip", text: "Skipping the checks to save time" },
    ],
    correctId: "reuse",
    correctFeedback: "Exactly — saving the steps so they can be reused is exactly what a function does.",
  },
];

const DISCOVERIES = [
  { icon: "🔁", label: "REPEATED TASK", value: "Check each car the same way" },
  { icon: "💭", label: "THE INSIGHT", value: "Save it once, reuse it" },
];

export default function Scene1Problem({ onNext }) {
  const [step, setStep] = useState(0); // 0,1,2 = car runs, 3 = think it through, 4 = discovery
  const [carPos, setCarPos] = useState(0.05);
  const [carMoving, setCarMoving] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [carReady, setCarReady] = useState(false);
  const [bubble, setBubble] = useState(null);
  const runToken = useRef(0);

  useEffect(() => {
    if (step > 2) return;
    const token = ++runToken.current;
    setCarReady(false);
    setBubble(null);
    setCarPos(0.05);
    setGateOpen(false);
    setCarMoving(true);

    (async () => {
      await sleep(350);
      if (runToken.current !== token) return;
      setCarPos(0.55);
      await sleep(700);
      if (runToken.current !== token) return;
      setCarPos(0.85);
      setGateOpen(true);
      await sleep(650);
      if (runToken.current !== token) return;
      setCarPos(1);
      await sleep(500);
      if (runToken.current !== token) return;
      setCarMoving(false);
      setGateOpen(false);
      if (step === 2) setBubble("I keep doing the same thing!");
      setCarReady(true);
    })();
  }, [step]);

  if (step <= 2) {
    const current = CAR_STEPS[step];
    return (
      <div className="story-column">
        <Scene carPosition={carPos} carPlate={current.plate} carMoving={carMoving} gateOpen={gateOpen} bubble={bubble} />
        <p className="story-text">{current.text}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (step < 2 ? setStep(step + 1) : setStep(3))}
          disabled={!carReady}
          style={{ visibility: carReady ? "visible" : "hidden" }}
        >
          Continue →
        </button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="story-column is-left">
        <Scene carPosition={null} bubble="I keep doing the same thing!" />
        <ThinkItThrough questions={QUESTIONS} onDone={() => setStep(4)} />
      </div>
    );
  }

  return (
    <div className="story-column">
      <DiscoverySummary title="Here's what you noticed." items={DISCOVERIES} />
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Continue →
      </button>
    </div>
  );
}
