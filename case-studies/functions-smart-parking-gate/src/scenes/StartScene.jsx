import Scene from "../components/Scene.jsx";

export default function StartScene({ onNext }) {
  return (
    <div className="story-column">
      <Scene carPosition={0.55} carPlate="MH-18-CD-4567" gateOpen={false} />
      <div>
        <h1 className="story-title">Help Mia run the parking gate.</h1>
        <p className="story-text" style={{ margin: "10px auto 0" }}>
          A little story about teaching Python to do the boring parts.
        </p>
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Begin the story →
      </button>
    </div>
  );
}
