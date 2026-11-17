import React, { useState, useEffect } from 'react';
import { Compass, Send, AlertTriangle, BookOpen, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import { useCreateSession } from '../hooks/useSessions.js';
import SakshamInteractivePlayer from './SakshamInteractivePlayer.jsx';

function InteractiveWizard({ scenario }) {
  const setActiveResult = useAppStore((s) => s.setActiveResult);
  const createSession = useCreateSession();

  const [form, setForm] = useState({
    learnerName: 'Guest learner',
    reasoning: '',
    promptText: '',
    reflection: '',
  });

  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset form and page when selected scenario changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      reasoning: '',
      promptText: '',
      reflection: '',
    }));
    setError(null);
    setCurrentPage(0);
  }, [scenario?.id]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scenario || !form.reasoning.trim()) return;
    setError(null);

    try {
      const result = await createSession.mutateAsync({
        ...form,
        scenarioId: scenario.id,
      });
      setActiveResult(result);
      setForm((prev) => ({ ...prev, reasoning: '', promptText: '', reflection: '' }));
    } catch (err) {
      const message =
        err?.response?.data?.details?.map((d) => d.message).join(', ') ||
        err?.response?.data?.error ||
        err?.message ||
        'Session creation failed. Please try again.';
      setError(message);
      console.error('Session creation failed:', err);
    }
  };

  if (!scenario) {
    return (
      <section className="panel learning-panel">
        <div className="empty">
          <p>Select a scenario from the sidebar to begin.</p>
        </div>
      </section>
    );
  }

  // Check for embedded Saksham JSON payload
  let sakshamData = null;
  let contextWithoutJson = scenario.context || '';
  if (contextWithoutJson.includes('<!-- SAKSHAM_JSON_START -->')) {
    try {
      const parts = contextWithoutJson.split('<!-- SAKSHAM_JSON_START -->');
      contextWithoutJson = parts[0].trim();
      const jsonStr = parts[1].split('<!-- SAKSHAM_JSON_END -->')[0].trim();
      sakshamData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed parsing embedded Saksham JSON", e);
    }
  }

  // Split context into pages on '---PAGE---', trimming whitespace
  const rawPages = contextWithoutJson
    ? contextWithoutJson.split(/---PAGE---/i).map((p) => p.trim()).filter(Boolean)
    : ['No case study content available.'];

  const pageTitles = [
    "📖 1: Story Setup",
    "🔍 2: The Dilemma",
    "🧩 3: Python Tools",
    "⚡ 4: Action Roadmap",
    "🏆 5: Mastery Challenge",
    "🌟 6: Bonus Insights"
  ];

  return (
    <section className="panel learning-panel">
      <div className="section-title">
        <Compass size={20} />
        <h2>{scenario.title}</h2>
      </div>

      {/* ── SAKSHAM INTERACTIVE PUZZLE ENGINE OR TEXTBOOK READER ──────────────── */}
      <SakshamInteractivePlayer
        sakshamData={sakshamData}
        scenario={scenario}
        onGenerateMap={null}
        childrenTextbook={(
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
        marginBottom: '20px'
      }}>
        {/* Top Progress & Title Bar */}
        <div style={{
          background: '#1e293b',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #334155',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 600, fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <BookOpen size={18} color="#10b981" />
            <span>Interactive Case Study Textbook</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', background: '#0f172a', color: '#10b981', padding: '4px 10px', borderRadius: '20px', border: '1px solid #10b981', fontWeight: 600 }}>
              Page {currentPage + 1} of {rawPages.length}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {Math.round(((currentPage + 1) / rawPages.length) * 100)}% Completed
            </span>
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: '#1e293b' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #38bdf8, #a855f7)',
            width: `${((currentPage + 1) / rawPages.length) * 100}%`,
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>

        {/* Chapter Navigation Tabs (when multiple pages exist) */}
        {rawPages.length > 1 && (
          <div style={{
            display: 'flex',
            background: '#131e32',
            padding: '8px 12px',
            gap: '8px',
            overflowX: 'auto',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            {rawPages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: idx === currentPage ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
                  color: idx === currentPage ? '#ffffff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: idx === currentPage ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: idx === currentPage ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none'
                }}
              >
                <span>{pageTitles[idx] || `Page ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Page Content Viewport */}
        <div style={{
          padding: '28px',
          color: '#e2e8f0',
          fontSize: '15px',
          lineHeight: '1.75',
          minHeight: '220px',
          background: 'radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)'
        }}>
          {(rawPages[currentPage] || '').split('\n').map((line, idx) => {
            const cleanLine = line.trim();
            if (!cleanLine) return <div key={idx} style={{ height: '14px' }} />;
            if (cleanLine.startsWith('###') || cleanLine.startsWith('##') || cleanLine.startsWith('#')) {
              const hText = cleanLine.replace(/^#+\s*/, '');
              return (
                <h3 key={idx} style={{ color: '#10b981', fontSize: '18px', fontWeight: '700', margin: '14px 0 8px 0', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{hText}</span>
                </h3>
              );
            }
            if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ')) {
              return (
                <div key={idx} style={{ display: 'flex', gap: '10px', margin: '6px 0 6px 12px', color: '#cbd5e1' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>•</span>
                  <span>{cleanLine.replace(/^[-*•]\s*/, '')}</span>
                </div>
              );
            }
            return (
              <p key={idx} style={{ margin: '0 0 14px 0', color: '#e2e8f0', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {cleanLine}
              </p>
            );
          })}
        </div>

        {/* Bottom Pagination Controls */}
        <div style={{
          padding: '16px 24px',
          background: '#1e293b',
          borderTop: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #475569',
              background: currentPage === 0 ? '#1e293b' : '#334155',
              color: currentPage === 0 ? '#64748b' : '#f8fafc',
              fontWeight: 600,
              fontSize: '13px',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={16} />
            <span>Previous Page</span>
          </button>

          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600' }}>
            Chapter: <strong style={{ color: '#38bdf8' }}>{pageTitles[currentPage] ? pageTitles[currentPage].replace(/^[^\s]+\s*\d+:\s*/, '') : `Page ${currentPage + 1}`}</strong>
          </span>

          <button
            type="button"
            onClick={() => {
              if (currentPage < rawPages.length - 1) {
                setCurrentPage((p) => Math.min(rawPages.length - 1, p + 1));
              } else {
                const ta = document.querySelector('textarea[required]');
                if (ta) ta.focus();
              }
            }}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              background: currentPage === rawPages.length - 1 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: currentPage === rawPages.length - 1 ? '0 4px 14px rgba(16, 185, 129, 0.4)' : '0 4px 14px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <span>{currentPage === rawPages.length - 1 ? '✨ Finish Reading & Start Mentorship' : 'Next Page'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
        )}
      />

      <div className="objective-row">
        {scenario.objectives?.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="learning-form">
        <label>
          Your reasoning
          <textarea
            required
            value={form.reasoning}
            onChange={handleChange('reasoning')}
            placeholder={scenario.prompt}
          />
        </label>
        <label>
          Prompt you would give an AI mentor
          <textarea
            value={form.promptText}
            onChange={handleChange('promptText')}
            placeholder="Explain my approach step by step, then show the Python concept and code..."
          />
        </label>
        <label>
          Reflection
          <textarea
            value={form.reflection}
            onChange={handleChange('reflection')}
            placeholder="What did you notice about your thinking?"
          />
        </label>
        <button
          className="primary"
          disabled={createSession.isPending}
        >
          <Send size={18} />
          {createSession.isPending
            ? 'Mapping...'
            : !useAppStore((s) => s.auth).token
            ? 'Submit as Guest'
            : 'Map My Reasoning'}
        </button>
      </form>
    </section>
  );
}

export default InteractiveWizard;

