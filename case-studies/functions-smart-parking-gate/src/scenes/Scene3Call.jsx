import { useRef, useState } from "react";
import Scene from "../components/Scene.jsx";
import CodeCard from "../components/CodeCard.jsx";
import { SAMPLE_PLATES } from "../data/vehicles.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TOTAL_RUNS = 3;

const CAPTIONS = [
  "Calling a function tells Python to run it.",
  "It works the same way, every time.",
  "But it always does the exact same thing — no matter which car. Notice something?",
];

export default function Scene3Call({ onNext }) {
  const [step, setStep] = useState(0);
  const [runCount, setRunCount] = useState(0);
  const [carPos, setCarPos] = useState(0.5);
  const [carMoving, setCarMoving] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const runToken = useRef(0);

  const currentPlate = SAMPLE_PLATES[Math.min(runCount, TOTAL_RUNS - 1)];
  const done = runCount >= TOTAL_RUNS;

  async function runCall() {
    const token = ++runToken.current;
    setRunning(true);
    setCarMoving(true);
    setCarPos(0.55);
    await sleep(500);
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
    setRunning(false);
    const nextCount = runCount + 1;
    setRunCount(nextCount);
    setCarPos(nextCount >= TOTAL_RUNS ? 1 : 0.5);
  }

  if (step === 0) {
    return (
      <div className="story-column">
        <Scene carPosition={0.5} gateOpen={false} />
        <p className="story-text">A car arrives. "Let's use it!" says Mia.</p>
        <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="story-column">
      <Scene carPosition={carPos} carPlate={currentPlate} carMoving={carMoving} gateOpen={gateOpen} />
      <CodeCard
        lines={["check_car()"]}
        caption={done ? CAPTIONS[2] : CAPTIONS[Math.min(runCount, 1)]}
      />
      <div className="tally-row">
        <span>Cars checked</span>
        <div className="tally-dots">
          {Array.from({ length: TOTAL_RUNS }).map((_, i) => (
            <span key={i} className={`tally-dot ${i < runCount ? "is-filled" : ""}`}>
              {i < runCount ? "✓" : ""}
            </span>
          ))}
        </div>
        <span>{runCount}/{TOTAL_RUNS}</span>
      </div>
      {!done ? (
        <button type="button" className="btn btn-primary" onClick={runCall} disabled={running}>
          {running ? "Running check_car()…" : "Run check_car()"}
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Continue →
        </button>
      )}
    </div>
  );
}
