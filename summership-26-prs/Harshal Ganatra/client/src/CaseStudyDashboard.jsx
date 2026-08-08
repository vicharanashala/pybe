import React, { useState, useEffect } from 'react';
import { CheckCircle, Lock, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CaseStudyDashboard({ completedCases, unlockedChapters = ['morning-routine'] }) {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/modules`);
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(m => ({
            id: m.id,
            title: m.interactive_case_study?.title || m.id,
            concept: m.concept || 'Concept',
            description: m.interactive_case_study?.description || '',
            chapter_number: m.chapter_number
          }));
          formatted.sort((a, b) => a.chapter_number - b.chapter_number);
          setCaseStudies(formatted);
        }
      } catch (err) {
        console.error('Failed to load modules:', err);
      }
    };
    fetchModules();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Your Adventure</h1>
        <p className="dashboard__subtitle">
          Complete the interactive story to master Python fundamentals. Your progress is saved automatically.
        </p>
      </div>

      <div className="dashboard__grid">
        {caseStudies.map((cs) => {
          const isCompleted = completedCases.includes(cs.id);
          const isUnlocked = unlockedChapters.includes(cs.id);
          const isActive = isUnlocked && !isCompleted;

          return (
            <div
              key={cs.id}
              onClick={() => isUnlocked && navigate(`/case-study/${cs.id}`)}
              className={`card animate-fade-in ${
                !isUnlocked ? 'card--locked' : ''
              } ${
                isActive ? 'card--active' : ''
              } ${
                isUnlocked ? 'cursor-pointer' : ''
              }`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span className={`card__badge ${
                  isCompleted ? 'card__badge--complete' : !isUnlocked ? 'card__badge--locked' : 'card__badge--chapter'
                }`}>
                  {isCompleted && <CheckCircle size={12} />}
                  {!isUnlocked && <Lock size={12} />}
                  {isActive && <BookOpen size={12} />}
                  THE MASTERCLASS
                </span>
              </div>

              <h3 className="card__title">{cs.title}</h3>
              <p className="card__desc">{cs.description}</p>

              {isUnlocked && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: isCompleted ? 'var(--success)' : 'var(--accent-primary)'
                  }}>
                    {isCompleted ? 'Review' : 'Start Chapter'}
                  </span>
                  <ChevronRight size={16} style={{ color: isCompleted ? 'var(--success)' : 'var(--accent-primary)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
