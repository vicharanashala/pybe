import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Brain, LogOut, Lock, Unlock, Play, CheckCircle, Moon, Sun, Flame, Clock, Target, Activity } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ALL_LEVELS = [
  { id: 'level-1', title: 'Introduction to Python', description: 'Learn the fundamentals of Python and write your first code.' },
  { id: 'level-2', title: 'Variables & Data Types', description: 'Understand how Python stores and manipulates data.' },
  { id: 'level-3', title: 'Operators & Expressions', description: 'Perform calculations and build logic using operators.' },
  { id: 'level-4', title: 'Conditional Statements', description: 'Make decisions in your code using if, elif, and else.' },
  { id: 'level-5', title: 'Loops', description: 'Automate repetitive tasks using for and while loops.' }
];

export function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [progressRes, userRes] = await Promise.all([
          fetch(`${API_URL}/levels/progress`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (progressRes.ok) {
          setProgress(await progressRes.json());
        }
        if (userRes.ok) {
          setUserData(await userRes.json());
        }
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  if (loading) return <main className="loading">Loading Dashboard...</main>;

  let completedLevelsCount = 0;
  progress.forEach(p => {
    if (p.passed) completedLevelsCount++;
  });
  const overallProgress = Math.round((completedLevelsCount / ALL_LEVELS.length) * 100);

  // Helper to check unlock status
  const isLevelUnlocked = (index) => {
    if (index === 0) return true; // Level 1 always unlocked
    const previousLevelId = ALL_LEVELS[index - 1].id;
    const previousProgress = progress.find(p => p.levelId === previousLevelId);
    return previousProgress && previousProgress.passed;
  };

  return (
    <main className="app-shell" style={{ background: 'var(--bg-secondary)' }}>
      <header style={{ padding: '1rem 2rem', background: 'var(--panel)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={24} color="#fff" />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--text)' }}>PyBe</strong>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Student Platform</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{userData?.xp || 0} XP</span>
          </div>

          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{user?.username}</span>
            <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <section style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.username}!</h1>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', margin: 0 }}>Ready to continue your Python journey?</p>
            </div>
            {overallProgress === 100 ? (
               <button className="primary" disabled style={{ opacity: 0.7 }}>All Levels Completed!</button>
            ) : (
               <button className="primary" onClick={() => {
                 // Find first unlocked but incomplete level
                 let targetLevel = ALL_LEVELS[0].id;
                 for (let i = 0; i < ALL_LEVELS.length; i++) {
                   const levelProg = progress.find(p => p.levelId === ALL_LEVELS[i].id);
                   if (isLevelUnlocked(i) && (!levelProg || !levelProg.passed)) {
                     targetLevel = ALL_LEVELS[i].id;
                     break;
                   }
                 }
                 navigate(`/level/${targetLevel}`);
               }}>
                 Continue Learning <Play size={18} style={{ marginLeft: '4px' }}/>
               </button>
            )}
          </div>

          <div className="stats-grid">
            <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--warning-bg)', padding: '1rem', borderRadius: '12px' }}>
                <Flame size={24} color="var(--warning)" />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>Current Streak</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>0 Days</h3>
              </div>
            </div>

            <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                <Target size={24} color="var(--primary)" />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>Overall Progress</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{overallProgress}%</h3>
              </div>
            </div>

            <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                <Clock size={24} color="#a855f7" />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>Learning Time</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>0h 0m</h3>
              </div>
            </div>

            <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '12px' }}>
                <Activity size={24} color="var(--success)" />
              </div>
              <div>
                <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>Assessments Passed</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{completedLevelsCount}</h3>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="levels-grid">
              <h2 style={{ marginBottom: '0.5rem' }}>Learning Path</h2>

              {ALL_LEVELS.map((level, index) => {
                const unlocked = isLevelUnlocked(index);
                const levelProg = progress.find(p => p.levelId === level.id);
                const passed = levelProg?.passed || false;

                return (
                  <div key={level.id} className={`level-card ${passed ? 'completed' : unlocked ? 'unlocked' : 'locked'}`} style={{ borderStyle: unlocked ? 'solid' : 'dashed' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: passed ? 'var(--success)' : unlocked ? 'var(--primary)' : 'var(--bg-secondary)',
                        border: unlocked ? 'none' : '2px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {passed ? <CheckCircle size={32} color="#fff" /> : unlocked ? <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{index + 1}</span> : <Lock size={28} color="var(--text-dim)" />}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', color: passed ? 'var(--success)' : unlocked ? 'var(--text)' : 'var(--text-dim)' }}>Level {index + 1}: {level.title}</h3>
                        <p style={{ color: passed ? 'var(--success)' : 'var(--text-dim)', margin: '0 0 0.5rem 0' }}>{level.description}</p>

                        {!unlocked && (
                          <span style={{ display: 'inline-block', fontSize: '0.85rem', color: 'var(--warning)', background: 'var(--warning-bg)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 500 }}>
                            Locked - Pass Level {index} first
                          </span>
                        )}

                        {unlocked && levelProg && (
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>Best Score: {levelProg.score}%</span>
                            <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: passed ? 'rgba(255,255,255,0.2)' : 'var(--error-bg)', color: passed ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                              {passed ? 'Passed' : 'Needs Review'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {unlocked ? (
                      <button onClick={() => navigate(`/level/${level.id}`)} className="primary" style={{ background: passed ? 'transparent' : 'var(--primary)', border: passed ? '2px solid var(--success)' : 'none', color: passed ? 'var(--success)' : '#fff' }}>
                        {passed ? 'Review' : 'Start'}
                      </button>
                    ) : (
                      <button disabled style={{ background: 'var(--bg)', color: 'var(--text-dim)', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}>
                        Locked
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="panel">
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={20} color="var(--primary)" /> Weak Areas</h3>
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.9rem' }}>Keep learning to generate personalized insights.</p>
                </div>
              </div>

              <div className="panel">
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} color="var(--primary)" /> Recommended Activity</h3>
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.9rem' }}>Complete Level 1 to get AI recommendations.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
