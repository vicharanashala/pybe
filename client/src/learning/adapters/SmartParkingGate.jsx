import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import App from "../../../../case-studies/functions-smart-parking-gate/src/App.jsx";
import globalStyles from "../../../../case-studies/functions-smart-parking-gate/src/styles/global.css";
import componentStyles from "../../../../case-studies/functions-smart-parking-gate/src/styles/components.css";

export default function SmartParkingGate({ onComplete }) {
  return (
    <AuthoredStory
      styles={[globalStyles, componentStyles]}
      completionHeading="Nice work — Mia's gate is running."
      onComplete={onComplete}
    >
      <App />
    </AuthoredStory>
  );
}
