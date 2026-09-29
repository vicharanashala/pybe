/**
 * The vertical "what's happening" flow used for function calls and return
 * values: 🚗 → verify_car() → checking → result → gate. `revealCount`
 * controls how many of the steps have appeared so far.
 */
export default function FlowSteps({ steps, revealCount }) {
  return (
    <div className="flow-steps">
      {steps.map((step, i) => (
        <div key={step.label} className="stack-flow">
          <div className={`flow-step-row ${i < revealCount ? "is-shown" : ""}`}>
            <div
              className={`flow-step-pill ${
                step.tone === "granted" ? "is-granted" : step.tone === "denied" ? "is-denied" : ""
              }`}
            >
              {step.icon && <span aria-hidden="true">{step.icon}</span>}
              {step.label}
            </div>
          </div>
          {i < steps.length - 1 && <div className="flow-step-arrow" aria-hidden="true">↓</div>}
        </div>
      ))}
    </div>
  );
}
