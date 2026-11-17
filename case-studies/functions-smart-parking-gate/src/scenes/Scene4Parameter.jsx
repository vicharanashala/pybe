import { useState } from "react";
import Scene from "../components/Scene.jsx";
import CodeCard from "../components/CodeCard.jsx";

export default function Scene4Parameter({ onNext }) {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <div className="story-column">
        <Scene carPosition={0.3} carPlate="MH-18-CD-4567" />
        <p className="story-text">But wait — two different cars are arriving now.</p>
        <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
          Continue →
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="story-column">
        <Scene carPosition={0.3} carPlate="MH-18-CD-4567" bubble="I need to know WHICH car I'm checking!" />
        <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="story-column">
      <CodeCard
        lines={["def verify_car(vehicle_number):"]}
        highlight="vehicle_number"
        caption={<>That's a <strong>parameter</strong> — a slot that waits for information.</>}
      />
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Continue →
      </button>
    </div>
  );
}
