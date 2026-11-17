import { useState } from "react";
import Scene from "../components/Scene.jsx";
import VehicleButtons from "../components/VehicleButtons.jsx";
import { FINAL_PLATES, verifyCar } from "../data/vehicles.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function FinalScene({ onNext }) {
  const [selectedPlate, setSelectedPlate] = useState(FINAL_PLATES[0]);
  const [running, setRunning] = useState(false);
  const [carPos, setCarPos] = useState(0.15);
  const [gateOpen, setGateOpen] = useState(false);
  const [decision, setDecision] = useState(null);
  const [checkedOnce, setCheckedOnce] = useState(false);

  async function checkVehicle() {
    setRunning(true);
    setDecision(null);
    setGateOpen(false);
    setCarPos(0.15);
    await sleep(300);
    setCarPos(0.6);
    await sleep(700);

    const result = verifyCar(selectedPlate);
    const granted = result === "ACCESS GRANTED";
    setDecision(result);
    setGateOpen(granted);
    setCarPos(granted ? 0.85 : 0.6);
    await sleep(900);

    if (granted) {
      setCarPos(1);
      await sleep(450);
      setGateOpen(false);
    }
    setRunning(false);
    setCheckedOnce(true);
  }

  return (
    <div className="story-column">
      <Scene
        carPosition={carPos}
        carPlate={selectedPlate}
        gateOpen={gateOpen}
        mood={decision === "ACCESS GRANTED" ? "granted" : decision === "ACCESS DENIED" ? "denied" : null}
      />
      <div>
        <h2 className="story-title" style={{ fontSize: 24 }}>Which car should we check?</h2>
        <p className="story-text-sm" style={{ marginTop: 6 }}>
          You've built verify_car(). Now put it to work.
        </p>
      </div>
      <VehicleButtons vehicles={FINAL_PLATES} selectedPlate={selectedPlate} onSelect={setSelectedPlate} disabled={running} />
      <button type="button" className="btn btn-primary" onClick={checkVehicle} disabled={running}>
        {running ? "Checking…" : "Check car"}
      </button>
      {checkedOnce && !running && (
        <button type="button" className="btn btn-secondary" onClick={onNext}>
          Finish the story →
        </button>
      )}
    </div>
  );
}
