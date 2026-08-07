import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function api(path) {
  const r = await fetch(`${API_URL}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

const PHASE_COLORS = ['#A8FF3E', '#3B82F6', '#EC4899', '#F97316', '#8B5CF6'];

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/roadmap').then(setRoadmap).finally(() => setLoading(false));
  }, []);

  return (
    <div className="rm page-content">
      <div className="container">
        <div className="section-label">Learning Progression</div>
        <h1 style={{ marginBottom: 'var(--sp-2)' }}>Your Python Roadmap</h1>
        <p style={{ marginBottom: 'var(--sp-10)' }}>
          Five levels of Python mastery. Each level unlocks when you reach the threshold score.
          There's no ceiling — you can always go deeper.
        </p>

        {loading ? (
          <div className="rm__list">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
        ) : (
          <div className="rm__list stagger">
            {roadmap.map((phase, idx) => {
              const color = PHASE_COLORS[idx % PHASE_COLORS.length];
              return (
                <div
                  key={phase.phase}
                  className="rm__phase card anim-fade-up hover-lift"
                  style={{ '--ph-color': color }}
                >
                  <div className="rm__phase-stripe" />
                  <div className="rm__phase-body">
                    <div className="rm__phase-badge">{phase.phase}</div>
                    <div className="rm__phase-content">
                      <h3 className="rm__phase-title">{phase.title}</h3>
                      <p className="rm__phase-summary">{phase.summary}</p>
                      <div className="rm__phase-items">
                        {phase.items.map(item => (
                          <span key={item} className="rm__phase-item">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PyBe philosophy note */}
        <div className="rm__footer">
          <p>
            <strong style={{ color: 'var(--accent)' }}>No ceiling.</strong>{' '}
            Dennis Ritchie, the creator of C, rated himself 4–5/10 on his own language.
            There is always more to discover. PyBe scores reflect your current depth, not your limits.
          </p>
        </div>
      </div>

      <style>{`
        .rm__list { display: flex; flex-direction: column; gap: var(--sp-4); margin-bottom: var(--sp-8); }
        .rm__phase {
          display: flex; overflow: hidden; padding: 0;
          border: 1px solid var(--border);
          background: var(--bg-surface);
        }
        .rm__phase-stripe { width: 5px; background: var(--ph-color); flex-shrink: 0; }
        .rm__phase-body { display: flex; gap: var(--sp-5); padding: var(--sp-5); align-items: flex-start; flex: 1; }
        .rm__phase-badge {
          width: 56px; height: 56px; flex-shrink: 0;
          background: color-mix(in srgb, var(--ph-color) 10%, var(--bg-elevated));
          border: 1px solid color-mix(in srgb, var(--ph-color) 30%, transparent);
          border-radius: var(--r-md);
          display: grid; place-items: center;
          font-family: var(--font-heading);
          font-size: 1rem; font-weight: 700;
          color: var(--ph-color);
        }
        .rm__phase-content { flex: 1; }
        .rm__phase-title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 var(--sp-1); }
        .rm__phase-summary { font-size: 0.875rem; color: var(--text-secondary); margin: 0 0 var(--sp-3); line-height: 1.6; }
        .rm__phase-items { display: flex; flex-wrap: wrap; gap: 6px; }
        .rm__phase-item {
          font-size: 0.72rem; font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 3px 10px; border-radius: var(--r-full);
        }
        .rm__footer {
          background: var(--bg-surface); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: var(--sp-5);
        }
        .rm__footer p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.7; }
      `}</style>
    </div>
  );
}
