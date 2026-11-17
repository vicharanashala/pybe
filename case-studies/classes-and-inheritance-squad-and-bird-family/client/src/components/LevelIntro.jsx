export default function LevelIntro({ level, onStart }) {
  return (
    <div className="card">
      <p className="eyebrow">{level.badge}</p>
      <h2 className="card-subtitle">{level.title}</h2>
      <p>{level.description}</p>
      <div className="concept-box">
        <p className="level-takeaway">{level.takeaway}</p>
      </div>
      <div className="real-world-box">
        <p className="eyebrow">In real code, this looks like</p>
        <p className="real-world-text">{level.realWorld}</p>
      </div>
      <button className="btn btn-primary" onClick={onStart}>
        Try it
      </button>
    </div>
  );
}
