import { useEffect, useRef } from "react";

// Small celebration popup shown when a milestone (Story / Concept /
// Practice / Quiz) is finished. Purely presentational — App.jsx decides
// *when* to show it and which badge to pass in.
export default function AchievementPopup({ badgeName, message, onContinue }) {
  const continueBtnRef = useRef(null);

  useEffect(() => {
    continueBtnRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") onContinue();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <div className="achievement-overlay">
      <div
        className="card achievement-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-popup-title"
        aria-describedby="achievement-popup-message"
      >
        <div className="achievement-popup-icon" aria-hidden="true">
          🏆
        </div>
        <p className="eyebrow" id="achievement-popup-title">
          Achievement Unlocked!
        </p>
        <h2 className="card-subtitle">{badgeName}</h2>
        <p id="achievement-popup-message">{message}</p>
        <button className="btn btn-primary" onClick={onContinue} ref={continueBtnRef}>
          Continue
        </button>
      </div>
    </div>
  );
}