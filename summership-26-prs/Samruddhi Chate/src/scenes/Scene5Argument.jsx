import { useState } from "react";
import Scene from "../components/Scene.jsx";
import CodeCard from "../components/CodeCard.jsx";
import VehicleButtons from "../components/VehicleButtons.jsx";
import { SAMPLE_PLATES } from "../data/vehicles.js";

export default function Scene5Argument({ onNext }) {
  const [step, setStep] = useState(0);
  const [filled, setFilled] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState(SAMPLE_PLATES[1]);
  const [tried, setTried] = useState(new Set([SAMPLE_PLATES[0]]));

  if (step === 0) {
    return (
      <div className="story-column">
        <Scene carPosition={0.3} carPlate={SAMPLE_PLATES[0]} />
        <p className="story-text">A car arrives: {SAMPLE_PLATES[0]}.</p>
        <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
          Continue →
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="story-column">
        <Scene carPosition={0.3} carPlate={SAMPLE_PLATES[0]} />
        <CodeCard
          lines={[filled ? `verify_car("${SAMPLE_PLATES[0]}")` : "verify_car( ______ )"]}
          highlight={filled ? `"${SAMPLE_PLATES[0]}"` : null}
          caption={
            filled ? (
              <>The value we give the function is called an <strong>argument</strong>.</>
            ) : (
              "The slot is still empty."
            )
          }
        />
        {!filled ? (
          <button type="button" className="btn btn-primary" onClick={() => setFilled(true)}>
            Fill in the argument
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
            Continue →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="story-column">
      <Scene carPosition={0.3} carPlate={selectedPlate} />
      <CodeCard lines={[`verify_car("${selectedPlate}")`]} highlight={`"${selectedPlate}"`} />
      <p className="story-text-sm">Same function, different argument. Try another vehicle:</p>
      <VehicleButtons
        vehicles={SAMPLE_PLATES}
        selectedPlate={selectedPlate}
        onSelect={(plate) => {
          setSelectedPlate(plate);
          setTried((prev) => new Set(prev).add(plate));
        }}
      />
      {tried.size >= 2 ? (
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Continue →
        </button>
      ) : (
        <p className="story-text-sm">Pick one more to see the reuse.</p>
      )}
    </div>
  );
}
