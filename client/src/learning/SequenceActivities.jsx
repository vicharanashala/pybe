import React, { useEffect, useRef, useState } from "react";
import {
  runPython,
  cancelPython,
} from "../../../library/learning/python-client.mjs";
import { validateSource } from "../../../library/learning/sequence-state.mjs";

export function RegistryLookup({ step, response, onChange }) {
  const index = Math.max(
    0,
    Math.min(step.rounds.length, response?.roundIndex || 0),
  );
  const [feedback, setFeedback] = useState("");
  return (
    <section>
      <p>{step.instructions}</p>
      <dl className="sequence-pairs">
        {step.registry.map((entry) => (
          <div key={entry.key}>
            <dt>{entry.key}</dt>
            <dd>{entry.value}</dd>
          </div>
        ))}
      </dl>
      {index === step.rounds.length ? (
        <p>{step.completionLine}</p>
      ) : (
        <>
          <h3>{step.rounds[index].askProvince}</h3>
          <div className="lesson-tokens">
            {step.rounds[index].options.map((value) => (
              <button
                className="button secondary"
                key={value}
                onClick={() => {
                  if (value === step.rounds[index].correctTax) {
                    setFeedback("");
                    onChange({ roundIndex: index + 1 });
                  } else
                    setFeedback(
                      `Find ${step.rounds[index].askProvince} in the visible registry and follow its link to the tax amount.`,
                    );
                }}
              >
                {value}
              </button>
            ))}
          </div>
          {feedback && (
            <p className="lesson-feedback" role="status">
              {feedback}
            </p>
          )}
        </>
      )}
    </section>
  );
}

export function RegistryOperations({ step, response, onChange }) {
  const count = Math.max(
    0,
    Math.min(step.operations.length, response?.opsPlayed || 0),
  );
  const [playing, setPlaying] = useState(false),
    [active, setActive] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const entries = Object.fromEntries(
    step.initialEntries.map((entry) => [entry.key, entry.value]),
  );
  for (const operation of step.operations.slice(0, count)) {
    if (operation.type === "delete") delete entries[operation.key];
    else entries[operation.key] = operation.newValue ?? operation.value;
  }
  const current =
    active !== null
      ? step.operations[active]
      : count
        ? step.operations[count - 1]
        : null;
  function next() {
    if (count === step.operations.length) {
      onChange({ opsPlayed: count, finished: true });
      return;
    }
    setPlaying(true);
    setActive(count);
    timer.current = setTimeout(() => {
      setPlaying(false);
      setActive(null);
      onChange({ opsPlayed: count + 1, finished: false });
    }, 700);
  }
  return (
    <section>
      {current && (
        <div className="lesson-feedback">
          <p>{current.story}</p>
          <pre>{current.line}</pre>
        </div>
      )}
      <div className="sequence-registry-panels">
        <div>
          <h3>{step.ledgerTitle}</h3>
          <dl className="sequence-pairs">
            {Object.entries(entries).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value} Gold Coins</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h3>Python</h3>
          <pre>{`${step.variableName} = {\n${Object.entries(entries)
            .map(([key, value]) => `    ${JSON.stringify(key)}: ${value}`)
            .join(",\n")}\n}`}</pre>
        </div>
      </div>
      <button
        className="button secondary"
        disabled={playing || response?.finished}
        onClick={next}
      >
        {playing
          ? "Applying the change…"
          : response?.finished
            ? "Changes complete"
            : count === step.operations.length
              ? "Finish demonstration"
              : "Next change →"}
      </button>
    </section>
  );
}

export function EditorActivity({ step, response, onChange }) {
  const [code, setCode] = useState(response?.code ?? step.starterCode),
    [result, setResult] = useState(null),
    [running, setRunning] = useState(false),
    [hint, setHint] = useState(false);
  useEffect(() => () => cancelPython(), []);
  async function execute() {
    setRunning(true);
    setResult(null);
    const output = await runPython(code);
    const valid =
      !output.error &&
      validateSource(step.validation, code) &&
      output.output.trim() ===
        String(step.validation.expectedOutput ?? "").trim();
    setRunning(false);
    setResult({ ...output, valid });
    onChange({ code, ran: valid });
  }
  return (
    <section>
      <p>{step.instructions}</p>
      <label className="lesson-editor">
        Python code
        <textarea
          aria-label="Python code"
          value={code}
          spellCheck="false"
          onChange={(e) => {
            setCode(e.target.value);
            setResult(null);
            onChange({ code: e.target.value, ran: false });
          }}
        />
      </label>
      <div className="lesson-actions">
        <button className="button primary" disabled={running} onClick={execute}>
          {running ? "Running Python…" : "Run Python"}
        </button>
        {running && (
          <button className="button secondary" onClick={cancelPython}>
            Cancel run
          </button>
        )}
        <button className="button secondary" onClick={() => setHint(!hint)}>
          Hint
        </button>
      </div>
      {hint && <p className="lesson-feedback">{step.hint}</p>}
      {result && (
        <div aria-live="polite">
          <pre>{result.error || result.output || "(no output)"}</pre>
          <p className="lesson-feedback">
            {result.valid ? step.successMessage : step.errorMessage}
          </p>
        </div>
      )}
    </section>
  );
}
