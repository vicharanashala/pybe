/**
 * The single illustrated visual for a story screen. Every prop is optional —
 * scenes only turn on what the current beat of the story needs, so the
 * illustration never gets busier than the moment calls for.
 */
export default function Scene({
  carPosition = null, // 0 (left) .. 1 (at the gate), or null to hide the car
  carPlate = "",
  carMoving = false,
  gateOpen = false,
  mood = null, // "granted" | "denied" | null — shows a small badge, top right
  bubble = null, // short dialogue string shown near Mia
  lightbulb = false,
}) {
  const leftPercent = carPosition === null ? null : 18 + carPosition * 58;

  return (
    <div className="scene-frame" role="img" aria-label="Illustration of Mia at the parking gate">
      <div className="scene-cloud" aria-hidden="true" />
      <div className="scene-sun" aria-hidden="true" />
      <div className="scene-tree tree-a" aria-hidden="true" />
      <div className="scene-ground" aria-hidden="true" />
      <div className="scene-tree tree-b" aria-hidden="true" />
      <div className="scene-booth" aria-hidden="true" />
      <div className="scene-gate-post" aria-hidden="true" />
      <div className={`scene-gate-arm ${gateOpen ? "is-open" : ""}`} aria-hidden="true" />
      <div className={`scene-gate-light ${gateOpen ? "is-go" : ""}`} aria-hidden="true" />

      <div className="scene-mia" aria-hidden="true">
        <div className="scene-mia-head" />
        <div className="scene-mia-body" />
      </div>

      {lightbulb && (
        <div className="scene-lightbulb is-visible" aria-hidden="true">
          💡
        </div>
      )}

      {bubble && <div className="scene-bubble">{bubble}</div>}

      {carPosition !== null && (
        <div className={`scene-car ${carMoving ? "is-moving" : ""}`} style={{ left: `${leftPercent}%` }}>
          {carPlate && <span className="scene-car-plate">{carPlate}</span>}
          <div className="scene-car-body">
            <div className="scene-car-wheels">
              <span />
              <span />
            </div>
          </div>
        </div>
      )}

      {mood && (
        <div className={`scene-decision-badge ${mood === "granted" ? "is-granted" : "is-denied"}`}>
          {mood === "granted" ? "✓ ACCESS GRANTED" : "✕ ACCESS DENIED"}
        </div>
      )}
    </div>
  );
}
