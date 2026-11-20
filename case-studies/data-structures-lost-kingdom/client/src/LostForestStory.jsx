import {readProgress as readLearningProgress,saveProgress as saveLearningProgress} from '../../../../library/learning/core.mjs';
import React, { useState, useCallback } from 'react';

// Pages
import Landing from './pages/Landing.jsx';
// Chapter pages are imported lazily to keep the initial bundle lean
const Chapter1 = React.lazy(() => import('./pages/Chapter1.jsx'));

// ─────────────────────────────────────────────────────────────────────────────
// Progress uses the shared, namespaced PyBe store.
// ─────────────────────────────────────────────────────────────────────────────
const COLLECTION = 'lost-kingdom';
function loadProgress(){return {chapter1:{completed:readLearningProgress(localStorage,COLLECTION).completed.includes('chapter1')}};}
function saveProgress(data){saveLearningProgress(localStorage,COLLECTION,{completed:Object.entries(data).filter(([,value])=>value.completed).map(([id])=>id)});}

// ─────────────────────────────────────────────────────────────────────────────
// App — top-level view router
// ─────────────────────────────────────────────────────────────────────────────
export default function LostForestStory() {
  // current view: 'landing' | 'chapter1'
  const [view, setView] = useState('landing');
  const [viewParams, setViewParams] = useState({});

  // progress: { chapter1: { completed } }
  const [progress, setProgress] = useState(loadProgress);

  // navigate to a view and scroll to top
  const navigate = useCallback((nextView, params = {}) => {
    setView(nextView);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // called when a chapter completes
  const completeChapter = useCallback((chapterId) => {
    setProgress((prev) => {
      const next = { ...prev, [chapterId]: { completed: true } };
      saveProgress(next);
      return next;
    });
  }, []);

  // Story completion is recorded without scores or rewards.

  // Render the correct page
  function renderPage() {
    switch (view) {
      case 'landing':
        return <Landing progress={progress} onNavigate={navigate} />;

      case 'chapter1': {
        return (
          <React.Suspense fallback={<LoadingScreen />}>
            <Chapter1
              initialScene={typeof viewParams?.sceneIdx === 'number' ? viewParams.sceneIdx : 0}
              progress={progress.chapter1}
              onComplete={() => completeChapter('chapter1')}
              onNavigate={navigate}
            />
          </React.Suspense>
        );
      }

      default:
        return <Landing progress={progress} onNavigate={navigate} />;
    }
  }

  return (
    <>
      {/* ── Global Navigation Bar ── */}
      <nav className="top-nav">
        <div className="nav-brand" onClick={() => navigate('landing')} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('landing')}>
          <span className="nav-logo">Backpack mission map</span>
          <span className="nav-badge">Concept Journey</span>
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


