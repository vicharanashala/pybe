import React, { useState, useEffect, useMemo } from "react";
import {
  assembleCode,
  correctOrder,
  hintFor,
  parseTemplate,
  validateOutput,
} from "../../../library/learning/core.mjs";
import {
  cancelPython,
  runPython,
} from "../../../library/learning/python-client.mjs";
import { LessonText } from "./RichText.jsx";
function Inspector({ result }) {
  return (
    <details className="lesson-inspector">
      <summary>Inspect variables and execution</summary>
      <dl>
        {Object.entries(result.variables || {}).map(([name, value]) => (
          <div key={name}>
            <dt>
              <code>{name}</code>
            </dt>
            <dd>
              <code>{value}</code>
            </dd>
          </div>
        ))}
      </dl>
      {result.trace?.length > 0 && (
        <>
          <p>First {result.trace.length} execution steps</p>
          <ol>
            {result.trace.map((step, i) => (
              <li key={i}>
                Line {step.line}: <code>{JSON.stringify(step.variables)}</code>
              </li>
            ))}
          </ol>
        </>
      )}
    </details>
  );
}
export function CodeStage({ caseStudy, onComplete, inspectVariables = false }) {
  const stage = caseStudy.stage3;
  const { parts, blankCount } = useMemo(
    () => parseTemplate(stage.codeTemplate),
    [stage],
  );
  const order = useMemo(() => correctOrder(stage), [stage]);
  const [values, setValues] = useState([]),
    [attempts, setAttempts] = useState(0),
    [hint, setHint] = useState("");
  const [draft, setDraft] = useState(stage.codeTemplate),
    [input, setInput] = useState("");
  const [result, setResult] = useState(null),
    [running, setRunning] = useState(false),
    [complete, setComplete] = useState(false);
  const freeform = blankCount === 0 && stage.tokens.length === 0;
  useEffect(() => () => cancelPython(), []);
  const choose = (token) => {
    if (token.value === order[values.length]) {
      setValues([...values, token.value]);
      setAttempts(0);
      setHint("");
    } else {
      const count = attempts + 1;
      setAttempts(count);
      const correct = stage.tokens.find(
        (t) => t.value === order[values.length],
      );
      setHint(token.hint || hintFor(correct, count));
    }
  };
  const execute = async () => {
    if (
      freeform &&
      !draft
        .split("\n")
        .some((line) => line.trim() && !line.trim().startsWith("#"))
    ) {
      setResult({
        output: "",
        error:
          "Write some Python code before running this open-ended exercise.",
      });
      setComplete(false);
      return;
    }
    setRunning(true);
    setResult(null);
    setComplete(false);
    const code = freeform ? draft : assembleCode(parts, values);
    const response = await runPython(code, {
      input: input ? input.split("\n") : [],
      inspect: inspectVariables,
    });
    const validation = response.error
      ? { valid: false }
      : validateOutput(stage.validation, response.output);
    setResult({ ...response, validation });
    setRunning(false);
    setComplete(!response.error && validation.valid);
  };
  return (
    <section className="lesson-stage" aria-label="Build and run Python">
      <h3>
        {freeform
          ? "Try your own Python"
          : "Build the Python, one blank at a time"}
      </h3>
      {freeform ? (
        <label className="lesson-editor">
          Python code
          <textarea
            aria-label="Python code"
            spellCheck="false"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setComplete(false);
              setResult(null);
            }}
          />
        </label>
      ) : (
        <pre className="lesson-template" aria-label="Python code template">
          {parts.map((part, i) =>
            part.type === "text" ? (
              <React.Fragment key={i}>{part.content}</React.Fragment>
            ) : (
              <span
                className={`lesson-blank ${values[part.index] !== undefined ? "filled" : ""}`}
                key={i}
              >
                {values[part.index] ?? `[blank ${part.index + 1}]`}
              </span>
            ),
          )}
        </pre>
      )}
      {!freeform && values.length < blankCount && (
        <>
          <p>
            Choose the token for blank {values.length + 1} of {blankCount}.
          </p>
          <div className="lesson-tokens">
            {stage.tokens.map((token, i) => (
              <button
                className="button secondary"
                key={i}
                onClick={() => choose(token)}
              >
                <code>{token.value}</code>
              </button>
            ))}
          </div>
        </>
      )}
      {hint && (
        <div className="lesson-feedback" role="status">
          <LessonText text={hint} />
        </div>
      )}
      <details className="lesson-input">
        <summary>Input values for input()</summary>
        <label>
          One input value per line
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setComplete(false);
              setResult(null);
            }}
          />
        </label>
      </details>
      <div className="lesson-actions">
        <button
          className="button primary"
          disabled={running || (!freeform && values.length < blankCount)}
          onClick={execute}
        >
          {running ? "Loading Python / running…" : "Run Python"}
        </button>
        {running && (
          <button className="button secondary" onClick={cancelPython}>
            Cancel run
          </button>
        )}
        {!freeform && (
          <button
            className="button secondary"
            disabled={running}
            onClick={() => {
              setValues([]);
              setComplete(false);
              setResult(null);
              setHint("");
              setAttempts(0);
            }}
          >
            Reset blanks
          </button>
        )}
      </div>
      <div aria-live="polite">
        {result && (
          <>
            <h4>{result.error ? "Python needs attention" : "Python output"}</h4>
            <pre className={result.error ? "lesson-error" : ""}>
              {result.error || result.output || "(no output)"}
            </pre>
            {result.stderr && <pre>{result.stderr}</pre>}
            {!result.error && !result.validation.valid && (
              <p className="lesson-feedback">
                {result.validation.error ||
                  `Compare the output with the expected result: ${result.validation.expected}`}
              </p>
            )}
            {inspectVariables && <Inspector result={result} />}
          </>
        )}
      </div>
      {complete && (
        <div className="lesson-finished">
          <p>
            Your code ran successfully
            {stage.validation ? " and produced the expected output" : ""}.
          </p>
          <button className="button primary" onClick={onComplete}>
            Continue →
          </button>
        </div>
      )}
    </section>
  );
}
