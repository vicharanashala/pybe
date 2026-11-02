import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ScenarioCard from '../components/ScenarioCard.jsx';

import { useTheme } from '../context/ThemeContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function api(path) {
  const r = await fetch(`${API_URL}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

const THEME_LABELS = {
  'potterheads':   '🧙‍♂️ Potterheads',
  'marvel':        '🦾 Marvel',
  'anime':         '⚔️ Anime',
  'default':       '🐍 Default',
  'chai-stall':    '🍵 Chai Stall',
  'isro':          '🚀 ISRO Mission',
  'instagram':     '📸 Instagram Filter',
  'food-delivery': '🍕 Food Delivery',
  'ai-playlist':   '🎵 AI Playlist',
  'kota':          '📚 Kota Coaching',
  'classic':       '⚡ Classic',
};

export default function ScenariosBrowser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dashboardTheme } = useTheme();

  const q          = searchParams.get('q') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const concept    = searchParams.get('concept') || '';
  const theme      = searchParams.get('theme') || (dashboardTheme !== 'default' ? dashboardTheme : '');

  const set = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams({});
  const hasFilters = q || difficulty || concept || theme;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (difficulty) params.set('difficulty', difficulty);
    if (concept) params.set('concept', concept);
    if (theme) params.set('theme', theme);
    api(`/scenarios?${params}`)
      .then(setScenarios)
      .finally(() => setLoading(false));
  }, [q, difficulty, concept, theme]);

  const concepts = useMemo(() =>
    [...new Set(scenarios.flatMap(s => s.concepts || []))].sort(), [scenarios]);

  const themes = useMemo(() =>
    [...new Set(scenarios.map(s => s.theme).filter(Boolean))], [scenarios]);

  return (
    <div className="sb page-content">
      <div className="container">
        {/* Header */}
        <div className="sb__header">
          <div>
            <div className="section-label">Learning Library</div>
            <h1 className="sb__title">Scenario Browser</h1>
            <p className="sb__sub">
              {loading ? 'Loading…' : `${scenarios.length} scenario${scenarios.length !== 1 ? 's' : ''}`}
              {theme && ` in ${THEME_LABELS[theme] || theme}`}
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="sb__filters">
          <label className="sb__search">
            <Search size={16} />
            <input
              id="scenario-search"
              value={q}
              onChange={e => set('q', e.target.value)}
              placeholder="Search scenarios…"
            />
            {q && <button className="sb__clear-btn" onClick={() => set('q', '')}><X size={14} /></button>}
          </label>

          <select id="filter-difficulty" value={difficulty} onChange={e => set('difficulty', e.target.value)}>
            <option value="">All levels</option>
            <option>Beginner</option>
            <option>Explorer</option>
            <option>Builder</option>
          </select>

          <select id="filter-theme" value={theme} onChange={e => set('theme', e.target.value)}>
            <option value="">All themes</option>
            {Object.entries(THEME_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <select id="filter-concept" value={concept} onChange={e => set('concept', e.target.value)}>
            <option value="">All concepts</option>
            {concepts.map(c => <option key={c}>{c}</option>)}
          </select>

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearAll}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Active theme banner */}
        {theme && THEME_LABELS[theme] && (
          <div className="sb__theme-banner">
            <span>{THEME_LABELS[theme]}</span>
            <span className="sb__theme-banner-sub">Showing scenarios from this case study arc</span>
            <button className="btn btn-ghost btn-sm" onClick={() => set('theme', '')}>
              <X size={13} /> Remove filter
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="sb__grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
        ) : scenarios.length === 0 ? (
          <div className="sb__empty">
            <p>No scenarios match your filters.</p>
            <button className="btn btn-secondary" onClick={clearAll}>Clear all filters</button>
          </div>
        ) : (
          <div className="sb__grid stagger">
            {scenarios.map(s => (
              <ScenarioCard key={s._id} scenario={s} className="anim-fade-up" />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .sb__header { margin-bottom: var(--sp-6); }
        .sb__title { margin: var(--sp-1) 0 var(--sp-1); }
        .sb__sub { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
        .sb__filters {
          display: flex; flex-wrap: wrap; gap: var(--sp-2);
          margin-bottom: var(--sp-5);
        }
        .sb__search {
          display: flex; align-items: center; gap: var(--sp-2);
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: var(--r-sm); padding: 8px 12px;
          flex: 1; min-width: 200px;
          transition: border-color var(--t-fast);
        }
        .sb__search:focus-within { border-color: var(--accent-dim); }
        .sb__search input { flex: 1; background: transparent; border: none; color: var(--text-primary); outline: none; }
        .sb__clear-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; padding: 0; }
        .sb__filters select { flex-shrink: 0; }
        .sb__theme-banner {
          display: flex; align-items: center; gap: var(--sp-4);
          padding: var(--sp-3) var(--sp-4);
          background: var(--accent-glow); border: 1px solid var(--border-accent);
          border-radius: var(--r-md); margin-bottom: var(--sp-5);
          font-weight: 600; font-size: 0.9rem; color: var(--accent);
        }
        .sb__theme-banner-sub { font-size: 0.78rem; color: var(--text-secondary); font-weight: 400; flex: 1; }
        .sb__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--sp-4);
        }
        .sb__empty {
          display: flex; flex-direction: column; align-items: center;
          gap: var(--sp-4); padding: var(--sp-16) 0; color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
