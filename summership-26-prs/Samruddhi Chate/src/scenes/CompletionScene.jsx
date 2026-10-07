import Scene from "../components/Scene.jsx";

const LEARNED = ["Function", "Definition", "Call", "Parameter", "Argument", "Return value"];

export default function CompletionScene({ onReplay }) {
  return (
    <div className="story-column">
      <Scene carPosition={1} carPlate="MH-18-CD-4567" gateOpen mood="granted" />
      <div>
        <h1 className="story-title">Nice work — Mia's gate is running.</h1>
        <p className="story-text" style={{ margin: "10px auto 0" }}>
          Every car gets checked the same reliable way now, using one small
          function instead of five hand-repeated steps.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {LEARNED.map((word) => (
          <span
            key={word}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13.5,
              fontWeight: 600,
              padding: "7px 14px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              color: "var(--accent-dark)",
            }}
          >
            {word}
          </span>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={onReplay}>
        ↺ Replay the story
      </button>
    </div>
  );
}
