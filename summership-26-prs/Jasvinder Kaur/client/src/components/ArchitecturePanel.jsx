import React from 'react';
import { X, Code2, Layers, BarChart3, Cpu, ArrowDown } from 'lucide-react';

const LAYERS = [
  {
    label:   'Presentation Layer',
    tech:    'React 18 + Vite 6',
    colour:  'cyan',
    detail:  'Full-screen scene-based SPA with keyboard navigation',
    icon:    <Code2 className="w-4 h-4" />,
  },
  {
    label:   'Lesson Engine',
    tech:    'State Machine (imageIndex + subStep)',
    colour:  'purple',
    detail:  'Sequential sub-step flow: Title → Story → Concept → Key Idea → Interactive',
    icon:    <Layers className="w-4 h-4" />,
  },
  {
    label:   'Visualisation Module',
    tech:    'CSS Keyframe Animations',
    colour:  'amber',
    detail:  'Call stack growth/unwind, portal transitions, environmental panel overlays',
    icon:    <BarChart3 className="w-4 h-4" />,
  },
  {
    label:   'Execution Simulation Module',
    tech:    'Async step-sequencer (setTimeout chain)',
    colour:  'green',
    detail:  'Step-by-step recursive execution animation with line highlighting',
    icon:    <Cpu className="w-4 h-4" />,
  },
  {
    label:   'Assessment System',
    tech:    'MCQ + Code-tracing Questions',
    colour:  'red',
    detail:  'Per-question explanations, 50% pass threshold, learning report generation',
    icon:    <BarChart3 className="w-4 h-4" />,
  },
];

const colourMap = {
  cyan:   '#22D3EE', purple: '#A78BFA', amber: '#FBBF24',
  green:  '#34D399', red:    '#F87171',
};

export default function ArchitecturePanel({ onClose }) {
  return (
    <div className="arch-overlay" onClick={e => e.stopPropagation()}>
      <div className="arch-panel">

        {/* Header */}
        <div className="arch-header">
          <div>
            <h2 className="arch-title">PyBe — System Architecture</h2>
            <p className="arch-subtitle">
              An Interactive Visual Learning Framework for Python Recursion
            </p>
          </div>
          <button className="arch-close-btn" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stack diagram */}
        <div className="arch-stack">
          {LAYERS.map((layer, i) => (
            <React.Fragment key={i}>
              <div
                className="arch-layer"
                style={{
                  borderColor: `${colourMap[layer.colour]}55`,
                  background:  `${colourMap[layer.colour]}0D`,
                }}
              >
                <div className="arch-layer-left">
                  <div
                    className="arch-layer-icon"
                    style={{ background: `${colourMap[layer.colour]}22`, color: colourMap[layer.colour] }}
                  >
                    {layer.icon}
                  </div>
                  <div>
                    <p className="arch-layer-label" style={{ color: colourMap[layer.colour] }}>
                      {layer.label}
                    </p>
                    <p className="arch-layer-tech">{layer.tech}</p>
                  </div>
                </div>
                <p className="arch-layer-detail">{layer.detail}</p>
              </div>

              {i < LAYERS.length - 1 && (
                <div className="arch-connector">
                  <ArrowDown className="w-4 h-4 text-white/20" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tech stack pills */}
        <div className="arch-tech-row">
          {['React 18', 'Vite 6', 'Tailwind CSS', 'Lucide Icons', 'CSS Animations', 'JavaScript ES2024'].map(t => (
            <span key={t} className="arch-tech-pill">{t}</span>
          ))}
        </div>

        <p className="arch-footer-note">
          Press <kbd className="intro-kbd">I</kbd> to close this panel
        </p>
      </div>
    </div>
  );
}
