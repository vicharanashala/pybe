import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Target, ChevronRight } from 'lucide-react';
import LearningForm from '../components/LearningForm.jsx';
import ResultPanel  from '../components/ResultPanel.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function api(path, options) {
  const r = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

const THEME_COLORS = {
  'chai-stall':    'var(--chai-color)',
  'isro':          'var(--isro-color)',
  'instagram':     'var(--insta-color)',
  'food-delivery': 'var(--food-color)',
  'ai-playlist':   'var(--playlist-color)',
  'kota':          'var(--kota-color)',
  'classic':       'var(--accent)',
};

const THEME_EMOJIS = {
  'chai-stall':    '🍵',
  'isro':          '🚀',
  'instagram':     '📸',
  'food-delivery': '🍕',
  'ai-playlist':   '🎵',
  'kota':          '📚',
  'classic':       '⚡',
};

export default function LearnSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [result, setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    setLoading(true);
    setResult(null);
    api(`/scenarios/${id}`)
      .then(setScenario)
      .catch(() => navigate('/scenarios'))
      .finally(() => setLoading(false));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    if (!scenario || !form.reasoning.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api('/sessions', {
        method: 'POST',
        body: JSON.stringify({ ...form, scenarioId: scenario._id })
      });
      setResult(res);
      setForm(f => ({ ...f, reasoning: '', promptText: '', reflection: '' }));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="ls page-content container">
        <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 24 }} />
        <div className="skeleton" style={{ height: 120, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 400 }} />
      </div>
    );
  }

  if (!scenario) return null;

  const themeColor = THEME_COLORS[scenario.theme] || 'var(--accent)';
  const themeEmoji = THEME_EMOJIS[scenario.theme] || '⚡';
  const DIFF_BADGE = { Beginner: 'badge-beginner', Explorer: 'badge-explorer', Builder: 'badge-builder' };

  return (
    <div className="ls page-content">
      <div className="container">
        {/* Back nav */}
        <div className="ls__nav anim-fade-in">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          {scenario.theme !== 'classic' && (
            <>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              <Link
                to={`/scenarios?theme=${scenario.theme}`}
                className="ls__breadcrumb-link"
              >
                {themeEmoji} {scenario.caseStudyId?.replace('cs-', '').replace(/-/g, ' ')}
              </Link>
            </>
          )}
          {scenario.themeStep && (
            <>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Step {scenario.themeStep}</span>
            </>
          )}
        </div>

        {/* Scenario header */}
        <div className="ls__header anim-fade-up" style={{ '--sc': themeColor }}>
          <div className="ls__header-stripe" />
          <div className="ls__header-body">
            <div className="ls__header-meta">
              <span className={`badge ${DIFF_BADGE[scenario.difficulty]}`}>{scenario.difficulty}</span>
              {scenario.concepts.map(c => (
                <span key={c} className="ls__concept-tag">{c}</span>
              ))}
              {scenario.themeArc && (
                <span className="ls__arc">{scenario.themeArc}</span>
              )}
            </div>
            <h1 className="ls__title">{scenario.title}</h1>
            <p className="ls__context">{scenario.context}</p>

            {scenario.objectives?.length > 0 && (
              <div className="ls__objectives">
                <div className="ls__objectives-label">
                  <Target size={13} /> Learning Objectives
                </div>
                <div className="ls__objectives-list">
                  {scenario.objectives.map((obj, i) => (
                    <span key={i} className="ls__objective">{obj}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="ls__grid">
          {/* Left: form */}
          <div className="ls__form-panel">
            <div className="ls__panel-header">
              <h2>Your Reasoning</h2>
              <p>Don't look up Python yet. Reason in plain English first.</p>
            </div>
            {error && <div className="ls__error">{error}</div>}
            <LearningForm
              scenario={scenario}
              form={form}
              onChange={patch => setForm(f => ({ ...f, ...patch }))}
              onSubmit={submit}
              submitting={submitting}
            />
          </div>

          {/* Right: result */}
          <div className="ls__result-panel">
            <div className="ls__panel-header">
              <h2>AI Mentor Output</h2>
              <p>Abstraction mapping, generated code, and prompt feedback.</p>
            </div>
            <ResultPanel result={result} />
          </div>
        </div>
      </div>

      <style>{`
        .ls__nav {
          display: flex; align-items: center; gap: var(--sp-2);
          margin-bottom: var(--sp-5);
          font-size: 0.82rem; color: var(--text-muted);
        }
        .ls__breadcrumb-link { color: var(--text-secondary); text-decoration: none; font-size: 0.82rem; text-transform: capitalize; }
        .ls__breadcrumb-link:hover { color: var(--text-primary); }
        .ls__header {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
          margin-bottom: var(--sp-6);
        }
        .ls__header-stripe { height: 4px; background: var(--sc); }
        .ls__header-body { padding: var(--sp-5); }
        .ls__header-meta { display: flex; flex-wrap: wrap; gap: var(--sp-2); align-items: center; margin-bottom: var(--sp-3); }
        .ls__concept-tag {
          font-size: 0.72rem; color: var(--text-muted);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 2px 8px; border-radius: var(--r-full);
        }
        .ls__arc {
          font-size: 0.72rem; color: var(--sc);
          background: color-mix(in srgb, var(--sc) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--sc) 25%, transparent);
          padding: 2px 10px; border-radius: var(--r-full); font-weight: 600;
        }
        .ls__title { font-size: 1.5rem; font-weight: 700; margin: var(--sp-2) 0; }
        .ls__context { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; margin: 0 0 var(--sp-4); }
        .ls__objectives { display: flex; flex-direction: column; gap: var(--sp-2); }
        .ls__objectives-label { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .ls__objectives-list { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
        .ls__objective {
          font-size: 0.8rem;
          background: var(--accent-glow); border: 1px solid var(--border-accent);
          color: var(--accent); padding: 3px 12px; border-radius: var(--r-full);
        }
        .ls__grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--sp-5); align-items: start; }
        .ls__panel-header { margin-bottom: var(--sp-5); }
        .ls__panel-header h2 { font-size: 1.1rem; margin-bottom: 4px; }
        .ls__panel-header p { font-size: 0.82rem; color: var(--text-secondary); margin: 0; }
        .ls__error {
          background: rgba(244,114,182,0.08); border: 1px solid rgba(244,114,182,0.2);
          border-radius: var(--r-sm); padding: var(--sp-3) var(--sp-4);
          color: var(--builder-color); font-size: 0.85rem; margin-bottom: var(--sp-4);
        }
        @media (max-width: 900px) {
          .ls__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
