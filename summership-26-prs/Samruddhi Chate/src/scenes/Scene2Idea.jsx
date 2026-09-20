import { useEffect, useState } from "react";
import Scene from "../components/Scene.jsx";
import CodeCard from "../components/CodeCard.jsx";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Scene2Idea({ onNext }) {
  const [step, setStep] = useState(0);
  const [lightbulb, setLightbulb] = useState(false);

  useEffect(() => {
    if (step !== 0) return;
    let active = true;
    (async () => {
      await sleep(500);
      if (active) setLightbulb(true);
    })();
    return () => {
      active = false;
    };
  }, [step]);

  if (step === 0) {
    return (
      <div className="story-column">
        <Scene carPosition={null} lightbulb={lightbulb} bubble={lightbulb ? "What if I save these steps?" : null} />
        <p className="story-text">Mia stops for a moment. She has an idea.</p>
        <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
          Continue →
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="story-column">
        <Scene carPosition={null} lightbulb />
        <div>
          <p className="eyebrow-soft">A NEW IDEA: FUNCTION</p>
          <p className="story-text" style={{ marginTop: 6 }}>
            A function is a saved process we can use again.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="story-column">
      <CodeCard lines={["def check_car():", "    ...the five steps..."]} caption="Mia writes down the steps once." />
      <p className="story-text-sm">She doesn't run it yet — she's just saving it for later.</p>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Continue →
      </button>
    </div>
  );
}
