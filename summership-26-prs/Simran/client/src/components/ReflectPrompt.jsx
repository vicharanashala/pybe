import { useState } from "react";

export default function ReflectPrompt({ question, hint, onNext }) {
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="card">
      <p className="eyebrow">Think about it</p>
      <h2 className="card-subtitle">{question}</h2>
      <textarea
        className="text-input"
        placeholder="Write one sentence, in your own words."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
      />
      {!revealed ? (
        <button className="btn btn-secondary" onClick={() => setRevealed(true)}>
          Show me!
        </button>
      ) : (
        <div className="hint-box">
          <p>{hint}</p>
          <button className="btn btn-primary" onClick={onNext}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
