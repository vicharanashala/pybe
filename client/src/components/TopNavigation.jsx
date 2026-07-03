import React from 'react';
import {
  Brain,
  ChartNoAxesCombined,
  Compass,
  Lightbulb,
  Code2,
  BookOpen,
} from 'lucide-react';

export const JOURNEY_STEPS = [
  { id: 'explorer', label: 'Scenario Explorer', icon: Compass },
  { id: 'workspace', label: 'Learning Workspace', icon: Brain },
  { id: 'summary', label: 'Session Summary', icon: Lightbulb },
  { id: 'mentor', label: 'AI Mentor', icon: Lightbulb },
  { id: 'w3h', label: 'W\u00b3H Guide', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: Code2 },
  { id: 'dashboard', label: 'Dashboard', icon: ChartNoAxesCombined },
  { id: 'passport', label: 'Passport', icon: BookOpen },
];

export function TopNav({ view, setView, xp, streak, journeyStep }) {
  return (
    <nav className="top-nav">
      <div className="top-nav-brand">
        <Brain size={24} />
        <span>PyBe</span>
      </div>
      <div className="top-nav-steps">
        {JOURNEY_STEPS.map((step, idx) => {
          const isActive = view === step.id;
          const isCompleted = idx < journeyStep;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              className={`nav-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => setView(step.id)}
              title={step.label}
            >
              <span className="nav-step-icon"><Icon size={16} /></span>
              <span className="nav-step-label">{step.label}</span>
              {isCompleted && <span className="nav-step-check">&#10003;</span>}
            </button>
          );
        })}
      </div>
      <div className="top-nav-stats">
        <span className="nav-xp">&#9733; {xp} XP</span>
        <span className="nav-streak">&#128293; {streak}</span>
      </div>
    </nav>
  );
}

export function JourneyProgress({ currentStep, onStepClick }) {
  return (
    <div className="journey-progress">
      {JOURNEY_STEPS.map((step, idx) => (
        <button
          key={step.id}
          className={`journey-step ${idx === currentStep ? 'current' : ''} ${idx < currentStep ? 'done' : ''}`}
          onClick={() => onStepClick(step.id)}
        >
          <span className="journey-step-num">{idx + 1}</span>
          <span className="journey-step-label">{step.label}</span>
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </header>
  );
}