import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

export default function CaseStudyCard({ caseStudy }) {
  const navigate = useNavigate();

  return (
    <div
      className="cs-card card hover-lift"
      style={{ '--cs-color': caseStudy.color }}
    >
      {/* Top color bar */}
      <div className="cs-card__bar" />

      <div className="cs-card__body">
        <div className="cs-card__emoji">{caseStudy.emoji}</div>
        <div className="cs-card__header">
          <span className="cs-card__difficulty">{caseStudy.difficulty}</span>
          <span className="cs-card__steps">
            <Layers size={12} /> {caseStudy.totalSteps} steps
          </span>
        </div>
        <h3 className="cs-card__title">{caseStudy.title}</h3>
        <p className="cs-card__character">With {caseStudy.character}</p>
        <p className="cs-card__tagline">"{caseStudy.tagline}"</p>
        <div className="cs-card__arc">
          {caseStudy.pythonJourney.map((step, i) => (
            <React.Fragment key={step}>
              <span className="cs-card__arc-step">{step}</span>
              {i < caseStudy.pythonJourney.length - 1 && (
                <ArrowRight size={10} className="cs-card__arc-arrow" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <button
        className="cs-card__cta"
        onClick={() => navigate(`/scenarios?theme=${caseStudy.theme}`)}
      >
        Begin Journey <ArrowRight size={14} />
      </button>

      <style>{`
        .cs-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0;
          cursor: default;
        }
        .cs-card__bar {
          height: 4px;
          background: var(--cs-color);
        }
        .cs-card__body {
          padding: var(--sp-5);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }
        .cs-card__emoji {
          font-size: 2.2rem;
          line-height: 1;
        }
        .cs-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-2);
        }
        .cs-card__difficulty {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--cs-color);
          background: color-mix(in srgb, var(--cs-color) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--cs-color) 30%, transparent);
          padding: 2px 10px;
          border-radius: var(--r-full);
        }
        .cs-card__steps {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .cs-card__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          margin: 0;
        }
        .cs-card__character {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
        }
        .cs-card__tagline {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.5;
          margin: 0;
        }
        .cs-card__arc {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          margin-top: auto;
          padding-top: var(--sp-2);
        }
        .cs-card__arc-step {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--cs-color);
          background: color-mix(in srgb, var(--cs-color) 10%, transparent);
          padding: 2px 8px;
          border-radius: var(--r-full);
          text-transform: capitalize;
        }
        .cs-card__arc-arrow { color: var(--text-muted); }
        .cs-card__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          padding: var(--sp-3) var(--sp-5);
          background: color-mix(in srgb, var(--cs-color) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--cs-color) 20%, transparent);
          border-top: 1px solid var(--border);
          color: var(--cs-color);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cs-card__cta:hover {
          background: color-mix(in srgb, var(--cs-color) 20%, transparent);
          border-color: color-mix(in srgb, var(--cs-color) 40%, transparent);
        }
      `}</style>
    </div>
  );
}
