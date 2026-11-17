export default function LevelComplete({ level, isLast, onContinue }) {
  return (
    <div className="card">
      <p className="eyebrow">✓ Level complete</p>
      <h2 className="card-subtitle">{level.title}</h2>
      <div className="concept-box">
        <p className="level-takeaway">{level.takeaway}</p>
      </div>
      <div className="real-world-box">
        <p className="eyebrow">Remember</p>
        <p className="real-world-text">{level.realWorld}</p>
      </div>
      <button className="btn btn-primary" onClick={onContinue}>
        {isLast ? "See everything together" : level.nextLabel}
      </button>
    </div>
  );
}
