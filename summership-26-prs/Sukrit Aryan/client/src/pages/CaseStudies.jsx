import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import CaseStudyCard from '../components/CaseStudyCard.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function api(path) {
  const r = await fetch(`${API_URL}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export default function CaseStudies() {
  const { dashboardTheme, setDashboardTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(dashboardTheme || 'default');
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(dashboardTheme || 'default');
  }, [dashboardTheme]);

  useEffect(() => {
    setLoading(true);
    const themeParam = activeTab && activeTab !== 'all' ? `?theme=${encodeURIComponent(activeTab)}` : '';
    api(`/casestudies${themeParam}`).then(setCaseStudies).finally(() => setLoading(false));
  }, [activeTab]);

  const tabs = [
    { id: 'default', label: '🐍 Default Theme' },
    { id: 'potterheads', label: '🧙‍♂️ Potterheads' },
    { id: 'marvel', label: '🦾 Marvel' },
    { id: 'anime', label: '⚔️ Anime' },
    { id: 'all', label: '🌐 All Case Studies' },
  ];

  return (
    <div className="cs-page page-content">
      <div className="container">
        {/* Header */}
        <div className="cs-page__header">
          <div className="section-label">
            <Sparkles size={12} /> Universal Abstraction Discovery Engine
          </div>
          <h1>Case Study Themes</h1>
          <p className="cs-page__sub">
            Each theme is a full abstraction evolution arc. A problem that starts simple, grows
            until the current approach breaks, and forces you to rediscover the next Python construct.
            Select a theme below to view its specific case study arcs.
          </p>

          {/* Theme Filter Tabs */}
          <div className="cs-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'all') setDashboardTheme(tab.id);
                }}
                className={`cs-tab${activeTab === tab.id ? ' cs-tab--active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Philosophy callout */}
        <div className="cs-page__callout">
          <div className="cs-page__callout-icon">💡</div>
          <div>
            <strong>The UADE Philosophy</strong>
            <p>
              Variables became difficult to manage → Lists emerged.<br />
              Lists could not associate names → Dictionaries emerged.<br />
              Repeated code became difficult to maintain → Functions emerged.<br />
              <em>You should experience this evolution yourself, not just be told about it.</em>
            </p>
          </div>
        </div>

        {/* Grid of case studies */}
        {loading ? (
          <div className="cs-page__grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
        ) : (
          <div className="cs-page__grid stagger">
            {caseStudies.map(cs => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="cs-page__footer">
          <BookOpen size={16} />
          <div>
            <strong>Theory anchor</strong>
            <p>
              These themes are grounded in Barrows' Problem-Based Learning, Vygotsky's Zone of
              Proximal Development, and Deleuze & Guattari's Rhizomatic Learning model —
              the same learner, infinite entry points, zero fixed sequence.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .cs-page__header { text-align: center; margin-bottom: var(--sp-8); }
        .cs-page__header h1 { margin: var(--sp-2) 0 var(--sp-4); }
        .cs-page__sub { max-width: 620px; margin: 0 auto 20px; font-size: 0.95rem; line-height: 1.7; }
        .cs-tabs { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .cs-tab {
          padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border);
          background: var(--bg-glass); color: var(--text-secondary);
          font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .cs-tab:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .cs-tab--active { background: var(--accent-glow) !important; color: var(--accent) !important; border-color: var(--border-accent) !important; }
        .cs-page__callout {
          display: flex; gap: var(--sp-4); align-items: flex-start;
          background: var(--accent-glow); border: 1px solid var(--border-accent);
          border-radius: var(--r-lg); padding: var(--sp-5);
          margin-bottom: var(--sp-8);
        }
        .cs-page__callout-icon { font-size: 1.8rem; flex-shrink: 0; }
        .cs-page__callout strong { display: block; color: var(--accent); font-size: 0.9rem; margin-bottom: var(--sp-2); }
        .cs-page__callout p { font-size: 0.875rem; color: var(--text-secondary); margin: 0; line-height: 1.7; }
        .cs-page__callout em { color: var(--accent-dim); font-style: normal; font-weight: 600; }
        .cs-page__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--sp-5);
          margin-bottom: var(--sp-8);
        }
        .cs-page__footer {
          display: flex; gap: var(--sp-4); align-items: flex-start;
          background: var(--bg-surface); border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: var(--sp-5);
          color: var(--text-muted);
        }
        .cs-page__footer strong { display: block; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--sp-1); }
        .cs-page__footer p { font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.6; }
      `}</style>
    </div>
  );
}
