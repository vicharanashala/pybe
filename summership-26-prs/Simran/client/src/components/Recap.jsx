export default function Recap({ onRestart }) {
  return (
    <div className="card recap-card">
      <h1 className="card-title">Nice work!</h1>
      <p>You discovered all four ways a child class can relate to its parent:</p>
      <div className="recap-grid">
        <div className="recap-tile">
          <div className="recap-icon">🪶</div>
          <p className="recap-label">INHERIT</p>
          <p className="recap-value">Eagle(Bird) — reuse everything, free</p>
        </div>
        <div className="recap-tile">
          <div className="recap-icon">🪺</div>
          <p className="recap-label">EXTEND</p>
          <p className="recap-value">Sparrow(Bird) — adds build_nest()</p>
        </div>
        <div className="recap-tile">
          <div className="recap-icon">✏️</div>
          <p className="recap-label">OVERRIDE</p>
          <p className="recap-value">Penguin(Bird) — replaces fly()</p>
        </div>
        <div className="recap-tile">
          <div className="recap-icon">🦉</div>
          <p className="recap-label">OVERRIDE + super()</p>
          <p className="recap-value">Owl(Bird) — builds on Bird's sleep()</p>
        </div>
      </div>
      <div className="recap-actions">
        <button className="btn btn-primary" onClick={onRestart}>
          Try the story again
        </button>
      </div>
    </div>
  );
}
