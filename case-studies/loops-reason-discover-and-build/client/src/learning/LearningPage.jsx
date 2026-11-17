import React, { useState, useEffect } from 'react';
import { C } from './utils.jsx';
import CaseStudyEngine from './CaseStudyEngine.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Level card ───────────────────────────────────────────────────────────────
function LevelCard({ level, unlocked, completed, onClick }) {
  const lvl = level.levelId;
  return (
    <div
      onClick={() => unlocked && onClick(lvl)}
      style={{
        background: completed ? C.accentBg : unlocked ? C.cardBg : '#f4f1ea',
        border: completed
          ? `1px solid ${C.accentBorder}`
          : unlocked
          ? `1px solid ${C.border}`
          : '1px solid transparent',
        borderRadius: 14, padding: '1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        opacity: unlocked ? 1 : 0.45,
        transition: 'all .22s ease', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(119,159,39,.18)'; } }}
      onMouseLeave={(e) => { if (unlocked) { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; } }}
    >
      {!unlocked  && <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>🔒</span>}
      {completed  && <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>✅</span>}

      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7b9f27', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Level {lvl}
      </span>
      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: unlocked ? C.text : C.muted }}>
        {level.title.replace(/^Level \d+: /, '')}
      </span>
      <span style={{ fontSize: '0.78rem', color: C.muted }}>
        {completed
          ? 'Completed'
          : unlocked
          ? `${level.caseStudies?.length ?? 0} case ${(level.caseStudies?.length ?? 0) === 1 ? 'study' : 'studies'}`
          : `Unlock after Level ${lvl - 1}`}
      </span>
    </div>
  );
}

// ─── Learning Page top-level view ──────────────────────────────────────────
export default function LearningPage() {
  const [topics, setTopics]               = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [fullTopic, setFullTopic]         = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicLoading, setTopicLoading]   = useState(false);

  // 'levels' view or 'engine' view
  const [view, setView]                   = useState('levels');
  const [selectedLevelId, setSelectedLevelId] = useState(null);

  // Per-topic completion tracking: { topicId: Set([levelId, ...]) }
  const [topicProgress, setTopicProgress] = useState({});

  // Helpers scoped to the currently selected topic
  const completedLevels = topicProgress[selectedTopicId] ?? new Set();

  const markLevelDone = (topicId, lvlId) =>
    setTopicProgress((prev) => ({
      ...prev,
      [topicId]: new Set([...(prev[topicId] ?? []), lvlId]),
    }));

  const levels = fullTopic?.levels ?? [];

  // Fetch topic list
  useEffect(() => {
    apiGet('/topics')
      .then((data) => { setTopics(data); setTopicsLoading(false); })
      .catch(() => setTopicsLoading(false));
  }, []);

  // Fetch full topic when selection changes
  useEffect(() => {
    if (!selectedTopicId) { setFullTopic(null); return; }
    setTopicLoading(true);
    apiGet(`/topics/${selectedTopicId}`)
      .then((data) => { setFullTopic(data); setTopicLoading(false); })
      .catch(() => setTopicLoading(false));
  }, [selectedTopicId]);

  const isUnlocked  = (lvl) => lvl === 1 || completedLevels.has(lvl - 1);
  const isCompleted = (lvl) => completedLevels.has(lvl);

  // ── Engine view ─────────────────────────────────────────────────────────────
  if (view === 'engine' && selectedLevelId && fullTopic) {
    const levelData = levels.find((l) => l.levelId === selectedLevelId);
    if (!levelData) return null;

    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem' }}>
        {/* Back link */}
        <button
          onClick={() => setView('levels')}
          style={{ background: 'none', border: 'none', color: C.body, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: 0, fontWeight: 500 }}
        >
          ← Back to levels
        </button>

        {/* Level header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: C.label, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>
            {fullTopic.topicName}
          </p>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: C.text, margin: 0 }}>
            {levelData.title}
          </h2>
        </div>

        <CaseStudyEngine
          key={`${selectedTopicId}-${selectedLevelId}`}
          levelData={levelData}
          topicLevelCount={levels.length}
          levelId={selectedLevelId}
          onBack={() => {
            // Mark the current level complete when returning from Level Complete screen
            markLevelDone(selectedTopicId, selectedLevelId);
            setView('levels');
          }}
          onGoToLevel={(nextId) => {
            markLevelDone(selectedTopicId, selectedLevelId);
            setSelectedLevelId(nextId);
          }}
        />
      </div>
    );
  }

  // ── Levels view ─────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem' }}>
      {/* Heading */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: C.text, marginBottom: '0.5rem' }}>
          Learning
        </h1>
        <p style={{ color: C.body, fontSize: '0.95rem', margin: 0 }}>
          Pick a topic and dive into the scenario engine.
        </p>
      </div>

      {/* Topic selector */}
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="cs-topic-select" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Select Topic
        </label>

        {topicsLoading ? (
          <p style={{ color: C.muted }}>Loading topics…</p>
        ) : (
          <select
            id="cs-topic-select"
            value={selectedTopicId}
            onChange={(e) => {
              setSelectedTopicId(e.target.value);
              setView('levels');
              // Do NOT reset progress it is stored per-topic in topicProgress
            }}
            style={{
              background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '0.75rem 1rem',
              color: selectedTopicId ? C.text : C.muted,
              fontSize: '0.95rem', maxWidth: 380, cursor: 'pointer', outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#7b9f27')}
            onBlur={(e)  => (e.target.style.borderColor = C.border)}
          >
            <option value="" disabled> Choose a topic</option>
            {topics.map((t) => (
              <option key={t.topicId} value={t.topicId}>{t.topicName}</option>
            ))}
          </select>
        )}
      </div>

      {/* Level grid */}
      {selectedTopicId && (
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Levels
          </p>
          {topicLoading ? (
            <p style={{ color: C.muted }}>Loading levels…</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {levels.map((level) => (
                <LevelCard
                  key={level.levelId}
                  level={level}
                  unlocked={isUnlocked(level.levelId)}
                  completed={isCompleted(level.levelId)}
                  onClick={(lvl) => { setSelectedLevelId(lvl); setView('engine'); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!selectedTopicId && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 2rem', border: `1px dashed ${C.border}`, borderRadius: 18, color: C.muted, textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>🐍</span>
          <p style={{ fontSize: '0.95rem', margin: 0, color: C.body }}>Select a topic above to see your levels</p>
        </div>
      )}
    </div>
  );
}
