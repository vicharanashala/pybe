import React, { useState } from "react";
import { ArrowRight, CheckCircle2, RefreshCw, Lightbulb, Code2 } from "lucide-react";
import { HELP_CONTENT } from "../data/helpData";

export default function HelpExampleWalkthrough() {
  const data = HELP_CONTENT["example-walkthrough"];
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = data.steps[activeStep];

  return (
    <div className="example-walkthrough-card">
      <div className="walkthrough-header">
        <div className="walkthrough-title-row">
          <Lightbulb size={24} className="accent-icon" />
          <div>
            <h3>{data.title}</h3>
            <p className="walkthrough-subtitle">{data.subtitle}</p>
          </div>
        </div>
        <div className="scenario-pill">
          <strong>Scenario:</strong> {data.scenarioText}
        </div>
      </div>

      <div className="walkthrough-stepper-nav">
        {data.steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isDone = idx < activeStep;
          return (
            <button
              key={step.stepNum}
              type="button"
              className={`stepper-nav-item ${isActive ? "active" : ""} ${isDone ? "completed" : ""}`}
              onClick={() => setActiveStep(idx)}
            >
              <span className="step-badge">
                {isDone ? <CheckCircle2 size={16} /> : step.stepNum}
              </span>
              <span className="step-nav-title">{step.title}</span>
            </button>
          );
        })}
      </div>

      <div className="walkthrough-active-step-panel">
        <div className="step-indicator">Step {currentStep.stepNum} of 3</div>
        <h4>{currentStep.title}</h4>
        <p className="step-description">{currentStep.desc}</p>

        <div className="step-comparison-grid">
          <div className="comparison-box real-world">
            <span className="box-label">Real-World Action</span>
            <div className="box-value">{currentStep.realWorld}</div>
          </div>
          <div className="comparison-arrow">
            <ArrowRight size={20} />
          </div>
          <div className="comparison-box representation">
            <span className="box-label">Mental / Code Value</span>
            <div className="box-value code-highlight">{currentStep.dataValue}</div>
          </div>
        </div>
      </div>

      <div className="walkthrough-visual-flow">
        <div className="flow-badge-group">
          <span className={`flow-chip ${activeStep >= 0 ? "active" : ""}`}>
            1. Real-world value (5 kg)
          </span>
          <ArrowRight size={14} />
          <span className={`flow-chip ${activeStep >= 1 ? "active" : ""}`}>
            2. Meaningful name (weight)
          </span>
          <ArrowRight size={14} />
          <span className={`flow-chip ${activeStep >= 2 ? "active" : ""}`}>
            3. Variable (weight = 5)
          </span>
        </div>
      </div>

      <div className="walkthrough-footer-controls">
        <button
          type="button"
          className="secondary-btn"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
        >
          Previous Step
        </button>

        {activeStep < data.steps.length - 1 ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => setActiveStep((s) => Math.min(data.steps.length - 1, s + 1))}
          >
            Next Step <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="primary-btn replay-btn"
            onClick={() => setActiveStep(0)}
          >
            <RefreshCw size={16} /> Replay Walkthrough
          </button>
        )}
      </div>

      <div className="walkthrough-explanation-note">
        <Code2 size={16} />
        <span><strong>Why Python code exists:</strong> Instead of memorizing syntax rules, Python is just a clean, standardized tool for capturing the real-world values and decisions you already make!</span>
      </div>
    </div>
  );
}
