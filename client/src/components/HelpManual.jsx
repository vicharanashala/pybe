import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  BookOpen,
  Layout,
  Sparkles,
  CheckSquare,
  Lightbulb,
  X,
  ArrowRight,
  MessageSquare,
  FileText,
  Brain,
  Code2,
  BarChart2,
  Layers,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import { HELP_SECTIONS, HELP_CONTENT } from "../data/helpData";
import HelpExampleWalkthrough from "./HelpExampleWalkthrough";

const ICON_MAP = {
  Compass,
  BookOpen,
  Layout,
  Sparkles,
  CheckSquare,
  Lightbulb,
  FileText,
  MessageSquare,
  Brain,
  BarChart2,
  Layers,
  Code2,
  AlertCircle
};

export default function HelpManual({ isOpen, onClose, initialSectionId }) {
  const [activeSectionId, setActiveSectionId] = useState("getting-started");
  const modalRef = useRef(null);

  useEffect(() => {
    if (initialSectionId && HELP_SECTIONS.some((s) => s.id === initialSectionId)) {
      setActiveSectionId(initialSectionId);
    }
  }, [initialSectionId, isOpen]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function renderSectionIcon(iconName, size = 18) {
    const IconComponent = ICON_MAP[iconName] || HelpCircleFallback;
    return <IconComponent size={size} />;
  }

  return (
    <div
      className="help-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="help-modal-container" ref={modalRef}>
        {/* Header Bar */}
        <header className="help-modal-header">
          <div className="help-brand-title">
            <div className="help-badge-icon">
              <Compass size={22} />
            </div>
            <div>
              <h2 id="help-modal-title">PyBe Help Manual</h2>
              <span className="help-subtitle">Scenario-driven learning assistant & guide</span>
            </div>
          </div>

          <div className="help-header-actions">
            <button
              type="button"
              className="help-close-btn"
              onClick={onClose}
              aria-label="Close Help Manual"
              title="Close Help Manual (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Modal Main Body */}
        <div className="help-modal-body">
          {/* Left Navigation Sidebar */}
          <nav className="help-modal-sidebar" aria-label="Help Sections">
            <div className="sidebar-section-header">Categories</div>
            <ul className="help-nav-list">
              {HELP_SECTIONS.map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      className={`help-nav-button ${isActive ? "active" : ""}`}
                      onClick={() => setActiveSectionId(section.id)}
                    >
                      {renderSectionIcon(section.icon, 18)}
                      <span>{section.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="help-sidebar-footer">
              <Info size={14} />
              <span>Press <kbd>Esc</kbd> anytime to return to your scenario.</span>
            </div>
          </nav>

          {/* Right Main Content Panel */}
          <main className="help-modal-content">
            <SectionDetailView
              sectionId={activeSectionId}
              onSelectSection={(id) => setActiveSectionId(id)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

function HelpCircleFallback({ size = 18 }) {
  return <Compass size={size} />;
}

/* ========================================================================== */
/* SECTION DETAIL VIEW                                                        */
/* ========================================================================== */
function SectionDetailView({ sectionId, onSelectSection }) {
  switch (sectionId) {
    case "getting-started":
      return <GettingStartedContent onSelectSection={onSelectSection} />;
    case "how-scenarios-work":
      return <HowScenariosWorkContent />;
    case "learning-session":
      return <LearningSessionContent onSelectSection={onSelectSection} />;
    case "mentor-output":
      return <MentorOutputContent />;
    case "how-to-approach":
      return <HowToApproachContent onSelectSection={onSelectSection} />;
    case "example-walkthrough":
      return <HelpExampleWalkthrough />;
    default:
      return <GettingStartedContent onSelectSection={onSelectSection} />;
  }
}

/* 1. Getting Started Content */
function GettingStartedContent({ onSelectSection }) {
  const data = HELP_CONTENT["getting-started"];
  return (
    <div className="help-section-view">
      <div className="section-header-banner">
        <h2>{data.title}</h2>
        <p className="subtitle">{data.subtitle}</p>
      </div>

      <div className="help-card intro-card">
        <p className="lead-text">{data.intro}</p>
        <ul className="styled-feature-list">
          {data.whatIsPybe.map((item, idx) => (
            <li key={idx}>
              <CheckCircle2 size={18} className="list-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="help-card flow-card">
        <h3>The PyBe Learning Flow</h3>
        <p>Here is how you navigate through every scenario from start to finish:</p>

        <div className="learning-flow-stepper">
          {data.learningFlow.map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="flow-step-item">
                <div className="flow-step-number">{item.step}</div>
                <div className="flow-step-text">
                  <strong>{item.label}</strong>
                  <small>{item.desc}</small>
                </div>
              </div>
              {idx < data.learningFlow.length - 1 && (
                <div className="flow-step-connector">
                  <ArrowRight size={14} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="help-card submission-card">
        <h3>What Happens After Submitting?</h3>
        <p>{data.afterSubmit}</p>

        <div className="cta-row">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => onSelectSection("learning-session")}
          >
            Explore Learning Session Features <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* 2. How Scenarios Work Content */
function HowScenariosWorkContent() {
  const data = HELP_CONTENT["how-scenarios-work"];
  return (
    <div className="help-section-view">
      <div className="section-header-banner">
        <h2>{data.title}</h2>
        <p className="subtitle">{data.subtitle}</p>
      </div>

      <div className="help-card">
        <p className="lead-text">{data.intro}</p>

        <div className="progression-chain">
          {data.progressionSteps.map((step, idx) => (
            <React.Fragment key={step.step}>
              <div className="chain-node">
                <span className="node-index">0{idx + 1}</span>
                <strong>{step.step}</strong>
                <small>{step.detail}</small>
              </div>
              {idx < data.progressionSteps.length - 1 && (
                <div className="chain-arrow">↓</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="help-card example-card">
        <h3>Simple Scenario Example</h3>
        <div className="rain-example-grid">
          <div className="ex-item">
            <span className="ex-label">Scenario:</span>
            <p>{data.rainExample.scenario}</p>
          </div>
          <div className="ex-item">
            <span className="ex-label">Reasoning:</span>
            <p>{data.rainExample.reasoning}</p>
          </div>
          <div className="ex-item">
            <span className="ex-label">Python Concept:</span>
            <p className="concept-highlight">{data.rainExample.concept}</p>
          </div>
          <div className="ex-item code-ex">
            <span className="ex-label">Python Construct:</span>
            <pre><code>{data.rainExample.pythonCode}</code></pre>
          </div>
        </div>
      </div>

      <div className="help-card takeaway-card">
        <Lightbulb size={20} className="takeaway-icon" />
        <p>{data.keyTakeaway}</p>
      </div>
    </div>
  );
}

/* 3. Learning Session Content */
function LearningSessionContent({ onSelectSection }) {
  const data = HELP_CONTENT["learning-session"];
  return (
    <div className="help-section-view">
      <div className="section-header-banner">
        <h2>{data.title}</h2>
        <p className="subtitle">{data.subtitle}</p>
      </div>

      <div className="learning-components-grid">
        {data.sections.map((sec) => (
          <article key={sec.id} className="help-card feature-detail-card" id={sec.id}>
            <div className="feature-card-title">
              {sec.icon === "Compass" && <Compass size={20} />}
              {sec.icon === "Lightbulb" && <Lightbulb size={20} />}
              {sec.icon === "FileText" && <FileText size={20} />}
              {sec.icon === "MessageSquare" && <MessageSquare size={20} />}
              {sec.icon === "Brain" && <Brain size={20} />}
              <h3>{sec.title}</h3>
            </div>

            <p className="summary-quote">"{sec.summary}"</p>

            {sec.progression && (
              <div className="progression-pill-box">
                <strong>Hint Progression:</strong>
                <span>{sec.progression}</span>
              </div>
            )}

            {sec.details && <p className="sec-details">{sec.details}</p>}

            {sec.guidelines && (
              <ul className="guidelines-list">
                {sec.guidelines.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            )}

            {sec.example && (
              <div className="example-map-box">
                <div className="ex-reasoning">
                  <small>Plain English Reasoning:</small>
                  <p>"{sec.example.plainText}"</p>
                </div>
                <div className="ex-arrow">➔</div>
                <div className="ex-code">
                  <small>Python Variable:</small>
                  <code>{sec.example.codeMap}</code>
                </div>
              </div>
            )}

            {sec.promptComparison && (
              <div className="prompt-compare-grid">
                <div className="compare-card weak">
                  <span className="compare-badge weak-badge">Weak Prompt</span>
                  <div className="prompt-text">"{sec.promptComparison.weak.text}"</div>
                  <p className="reason-text">{sec.promptComparison.weak.reason}</p>
                </div>
                <div className="compare-card strong">
                  <span className="compare-badge strong-badge">Better Prompt</span>
                  <div className="prompt-text">"{sec.promptComparison.strong.text}"</div>
                  <p className="reason-text">{sec.promptComparison.strong.reason}</p>
                </div>
              </div>
            )}

            {sec.usefulPromptFactors && (
              <div className="useful-factors-box">
                <strong>What Makes a Prompt Useful?</strong>
                <ul>
                  {sec.usefulPromptFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {sec.examples && (
              <div className="reflection-examples">
                <strong>Reflection Examples:</strong>
                <ul>
                  {sec.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

/* 4. Mentor Output Content */
function MentorOutputContent() {
  const data = HELP_CONTENT["mentor-output"];
  return (
    <div className="help-section-view">
      <div className="section-header-banner">
        <h2>{data.title}</h2>
        <p className="subtitle">{data.subtitle}</p>
      </div>

      <div className="mentor-components-list">
        {data.components.map((comp, idx) => (
          <article key={idx} className="help-card mentor-card">
            <div className="mentor-card-header">
              {comp.icon === "BarChart2" && <BarChart2 size={20} />}
              {comp.icon === "Layers" && <Layers size={20} />}
              {comp.icon === "Code2" && <Code2 size={20} />}
              {comp.icon === "AlertCircle" && <AlertCircle size={20} />}
              <h3>{comp.title}</h3>
            </div>

            {comp.scoreExample && (
              <div className="score-preview-badge">
                <span>Prompt maturity: {comp.scoreExample}</span>
              </div>
            )}

            <p className="comp-explanation">{comp.explanation}</p>

            {comp.importantNote && (
              <div className="note-alert">
                <strong>Important:</strong> {comp.importantNote}
              </div>
            )}

            {comp.exampleFlow && (
              <div className="abstraction-flow-vertical">
                {comp.exampleFlow.map((step, i) => (
                  <div key={i} className="abstraction-flow-row">
                    <span className="flow-label">{step.label}:</span>
                    <span className="flow-val">{step.val}</span>
                  </div>
                ))}
              </div>
            )}

            {comp.purpose && <p className="comp-purpose">{comp.purpose}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

/* 5. How to Approach Content */
function HowToApproachContent({ onSelectSection }) {
  const data = HELP_CONTENT["how-to-approach"];
  return (
    <div className="help-section-view">
      <div className="section-header-banner">
        <h2>{data.title}</h2>
        <p className="subtitle">{data.subtitle}</p>
      </div>

      <div className="approach-grid">
        {data.steps.map((s) => (
          <article key={s.number} className="approach-card">
            <div className="step-num-badge">{s.number}</div>
            <div className="step-content">
              <h4>{s.title}</h4>
              <p>{s.detail}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="help-card approach-cta">
        <h3>Ready to see this approach in action?</h3>
        <p>Check out our interactive walkthrough of the Bag Weight Label scenario.</p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => onSelectSection("example-walkthrough")}
        >
          Try Bag Weight Example Walkthrough <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
