import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// Pages
import Landing from './pages/Landing.jsx';
// Chapter pages are imported lazily to keep the initial bundle lean
const Chapter1 = React.lazy(() => import('./pages/Chapter1.jsx'));

// ─────────────────────────────────────────────────────────────────────────────
// Progress helpers — all progress lives in localStorage under 'pybe_progress'
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'pybe_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Could not save progress to localStorage');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// App — top-level view router
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  // current view: 'landing' | 'chapter1'
  const [view, setView] = useState('landing');
  const [viewParams, setViewParams] = useState({});

  // progress: { chapter1: { completed, xp, score } }
  const [progress, setProgress] = useState(loadProgress);

  // navigate to a view and scroll to top
  const navigate = useCallback((nextView, params = {}) => {
    setView(nextView);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // called when a chapter completes
  const completeChapter = useCallback((chapterId, data) => {
    setProgress((prev) => {
      const next = { ...prev, [chapterId]: { completed: true, ...data } };
      saveProgress(next);
      return next;
    });
  }, []);

  // total XP for Python Lists (chapter1)
  const totalXP = progress.chapter1?.xp || 0;

  // Render the correct page
  function renderPage() {
    switch (view) {
      case 'landing':
        return <Landing progress={progress} totalXP={totalXP} onNavigate={navigate} />;

      case 'chapter1': {
        return (
          <React.Suspense fallback={<LoadingScreen />}>
            <Chapter1
              initialScene={typeof viewParams?.sceneIdx === 'number' ? viewParams.sceneIdx : 0}
              progress={progress.chapter1}
              onComplete={(data) => completeChapter('chapter1', data)}
              onNavigate={navigate}
            />
          </React.Suspense>
        );
      }

      default:
        return <Landing progress={progress} totalXP={totalXP} onNavigate={navigate} />;
    }
  }

  return (
    <>
      {/* ── Global Navigation Bar ── */}
      <nav className="top-nav">
        <div className="nav-brand" onClick={() => navigate('landing')} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('landing')}>
          <span className="nav-logo">🎒 PyBe</span>
          <span className="nav-badge">Concept Journey</span>
        </div>
        <div className="nav-right">
          <div className="xp-counter">
            <span className="xp-icon">⭐</span>
            <span>{totalXP} XP</span>
          </div>
        </div>
      </nav>

      {/* ── Page ── */}
      {renderPage()}
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
