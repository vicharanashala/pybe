import { useState } from "react";
import Scene from "../components/Scene.jsx";
import CodeCard from "../components/CodeCard.jsx";
import ChoiceCard from "../components/ChoiceCard.jsx";
import ThinkItThrough from "../components/ThinkItThrough.jsx";
import FlowSteps from "../components/FlowSteps.jsx";
import VehicleButtons from "../components/VehicleButtons.jsx";
import { FINAL_PLATES, verifyCar } from "../data/vehicles.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CODE_LINES = [
  "def verify_car(vehicle_number):",
  '    if vehicle_number.startswith("MH"):',
  '        return "ACCESS GRANTED"',
  "    else:",
  '        return "ACCESS DENIED"',
];

const DECISION_QUESTIONS = [
  {
    id: "granted",
    prompt: 'If the plate starts with "MH", what should verify_car() decide?',
    options: [
      { id: "grant", text: "ACCESS GRANTED" },
      { id: "deny", text: "ACCESS DENIED" },
      { id: "nothing", text: "It shouldn't decide anything" },
    ],
    correctId: "grant",
    correctFeedback: 'Right — an "MH" plate should be let through.',
  },
  {
    id: "denied",
    prompt: "What about any other plate?",
    options: [
      { id: "grant", text: "ACCESS GRANTED" },
      { id: "deny", text: "ACCESS DENIED" },
      { id: "ask", text: "Ask Mia in person" },
    ],
    correctId: "deny",
    correctFeedback: "Exactly — anything else should be denied.",
  },
];

export default function Scene6Return({ onNext }) {
  const [step, setStep] = useState(0);
  const [selectedPlate, setSelectedPlate] = useState(FINAL_PLATES[0]);
  const [running, setRunning] = useState(false);
  const [reveal, setReveal] = useState(0);
  const [decision, setDecision] = useState(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [seen, setSeen] = useState(new Set());
  const [quizReady, setQuizReady] = useState(false);

  const flowSteps = [
    { icon: "🚗", label: selectedPlate },
    { icon: "🔎", label: "verify_car()" },
    { icon: "⏳", label: "checking…" },
    decision
      ? { icon: decision === "ACCESS GRANTED" ? "✅" : "🚫", label: decision, tone: decision === "ACCESS GRANTED" ? "granted" : "denied" }
      : { icon: "📩", label: "return value" },
    { icon: "🧾", label: "result" },
    { icon: "🚧", label: gateOpen ? "gate opens" : "gate decision" },
  ];

  async function run() {
    setRunning(true);
    setDecision(null);
    setGateOpen(false);
    setReveal(1);
    await sleep(450);
    setReveal(2);
    await sleep(450);
    setReveal(3);
    await sleep(500);
    const result = verifyCar(selectedPlate);
    setDecision(result);
    await sleep(500);
    setReveal(5);
    await sleep(350);
    setReveal(6);
    if (result === "ACCESS GRANTED") setGateOpen(true);
    setRunning(false);
    setSeen((prev) => new Set(prev).add(result));
  }

  if (step === 0) {
    return (
      <div className="story-column">
        <Scene carPosition={0.5} />
        <p className="story-text">Now Mia needs an answer: should the gate open?</p>
        <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
          Continue →
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="story-column is-left">
        <Scene carPosition={0.5} />
        <ThinkItThrough questions={DECISION_QUESTIONS} onDone={() => setStep(2)} />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="story-column">
        <p className="story-title" style={{ fontSize: 22 }}>That's the decision, written in Python.</p>
        <CodeCard lines={CODE_LINES} highlight='"ACCESS GRANTED"' caption="Mia only needs one part of this: return." />
        <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
          Continue →
        </button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="story-column">
        <Scene carPosition={0.6} carPlate={selectedPlate} gateOpen={gateOpen} mood={decision === "ACCESS GRANTED" ? "granted" : decision === "ACCESS DENIED" ? "denied" : null} />
        <VehicleButtons vehicles={FINAL_PLATES} selectedPlate={selectedPlate} onSelect={setSelectedPlate} disabled={running} />
        <FlowSteps steps={flowSteps} revealCount={reveal} />
        {reveal >= 6 ? (
          <p className="story-text-sm">
            <strong>return</strong> sends the answer back — that's how the gate knows what to do.
          </p>
        ) : (
          <p className="story-text-sm">Run it to see the answer travel back.</p>
        )}
        <button type="button" className="btn btn-primary" onClick={run} disabled={running}>
          {running ? "Running…" : `Run verify_car("${selectedPlate}")`}
        </button>
        {seen.size >= 2 && !quizReady && (
          <button type="button" className="btn btn-secondary" onClick={() => setStep(4)}>
            Continue →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="story-column">
      <ChoiceCard
        prompt="What does return send back?"
        options={[
          { id: "a", text: "Nothing — it just ends the function." },
          { id: "b", text: "The function's result, back to whoever called it." },
          { id: "c", text: "A new car." },
        ]}
        correctId="b"
        correctFeedback="Right — return sends the function's answer back to the code that called it."
        onCorrect={() => setQuizReady(true)}
      />
      {quizReady && (
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Continue →
        </button>
      )}
    </div>
  );
}
