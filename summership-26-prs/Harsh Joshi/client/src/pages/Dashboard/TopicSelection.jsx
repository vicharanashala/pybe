import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Lock, Sparkles, Trophy, Star, RefreshCw } from 'lucide-react';

const TOPIC_CARDS = [
  { id: 'variables', title: 'Variables 📦', desc: 'Learn how containers hold magic items and values.', diff: 'Level 1' },
  { id: 'if/else logic', title: 'If/Else Logic 🔀', desc: 'Make smart choices and branch your story paths.', diff: 'Level 2' },
  { id: 'while loop', title: 'While Loops 🔁', desc: 'Repeat actions automatically until a goal is reached.', diff: 'Level 2' },
  { id: 'lists', title: 'Lists & Inventories 🎒', desc: 'Store multiple items in an ordered collection.', diff: 'Level 3' },
  { id: 'functions', title: 'Magic Functions ✨', desc: 'Package your code into reusable spells and commands.', diff: 'Level 4' }
];

export default function TopicSelection({ onSelectTopic, onResetProfile }) {
  const [user, setUser] = useState({ name: 'Explorer', completedTopics: [], interests: ['pets'], level: 1, score: 0 });
  useEffect(() => {
    const stored = localStorage.getItem('pybe_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        // use default
      }
    }
  }, []);

  const completedCount = (user.completedTopics || []).length;
  const progressPercent = Math.round((completedCount / TOPIC_CARDS.length) * 100);

  return (
    <div className="panel dashboard-container" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Welcome back, {user.name}! 🌟
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Current Motivation Tier: <strong>Level {user.level || 1}</strong> | Score: <strong>{user.score || 0} XP</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #ec4899', color: '#ec4899', fontWeight: 'bold' }}>
              <Trophy size={16} style={{ display: 'inline', marginRight: '6px' }} /> {completedCount}/5 Mastered ({progressPercent}%)
            </div>
            {onResetProfile && (
              <button
                onClick={onResetProfile}
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Switch Profile or Universe"
              >
                <RefreshCw size={14} /> Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px', color: '#ec4899' }} />
          Every time you select a new concept, we'll randomly transport you to one of your favorite worlds!
        </p>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Select a Core Python Concept to Master:</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {TOPIC_CARDS.map((card, index) => {
          const isCompleted = (user.completedTopics || []).includes(card.id) || (user.completedTopics || []).includes(card.title);
          const isNext = !isCompleted && index === completedCount; // Highlight recommended next topic

          return (
            <div
              key={card.id}
              onClick={() => {
                const interestsArray = user.interests && user.interests.length > 0 ? user.interests : ['pets', 'magic', 'heroes', 'space', 'games'];
                const randomTheme = interestsArray[Math.floor(Math.random() * interestsArray.length)];
                onSelectTopic(card.id, randomTheme);
              }}
              style={{
                padding: '1.75rem',
                borderRadius: '16px',
                border: isNext ? '2px solid #ec4899' : isCompleted ? '1px solid #10b981' : '1px solid var(--border)',
                background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : isNext ? 'rgba(236, 72, 153, 0.05)' : 'var(--bg-subtle)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '12px', background: 'var(--border)', fontWeight: 'bold' }}>
                    {card.diff}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 size={24} style={{ color: '#10b981' }} title="Completed!" />
                  ) : isNext ? (
                    <Star size={24} style={{ color: '#ec4899', fill: '#ec4899' }} title="Recommended Next!" />
                  ) : (
                    <Play size={20} style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: isCompleted ? '#10b981' : 'var(--text)' }}>
                  {card.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  {card.desc}
                </p>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isCompleted ? '#10b981' : isNext ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'var(--border)',
                  color: isCompleted || isNext ? 'white' : 'var(--text)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isCompleted ? 'Practice Again' : isNext ? 'Start Adventure ✨' : 'Explore Concept'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
