import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Scene1Arrival from './scenes/Scene1Arrival';
import Scene2MeetKabir from './scenes/Scene2MeetKabir';
import Scene3EnterLab101 from './scenes/Scene3EnterLab101';
import Scene4PriyaNeedsBigPicture from './scenes/Scene4PriyaNeedsBigPicture';
import Scene5KabirGetsQuestion from './scenes/Scene5KabirGetsQuestion';
import Scene6Searchlight from './scenes/Scene6Searchlight';
import Scene7ReverseSituation from './scenes/Scene7ReverseSituation';
import Scene8Boundary from './scenes/Scene8Boundary';
import Scene9PatternQuestion from './scenes/Scene9PatternQuestion';
import Scene10GrandReveal from './scenes/Scene10GrandReveal';
import Scene12FinalChallenge from './scenes/Scene12FinalChallenge';
import './scope.css';

const SCENE_META = [
  { id: 'intro', label: "Setting the Scene" },
  { id: 'kabir', label: "Meet Kabir" },
  { id: 'lab101', label: "Enter Lab 101" },
  { id: 'priya_window', label: "Priya's Lookup" },
  { id: 'kabir_dialogue', label: "Kabir's Enquiry" },
  { id: 'kabir_mcq', label: "Kabir's Choice" },
  { id: 'looking_outward_story', label: "Looking Outward" },
  { id: 'boundary_story', label: "Scope Boundary" },
  { id: 'concept_1', label: "Concept: Global" },
  { id: 'concept_2', label: "Concept: Local" },
  { id: 'quiz', label: "Final Quiz" }
];

const SCENE_KEY = 'pybe_scope_scene_index_v2';

export default function App() {
  const [sceneIndex, setSceneIndex] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(SCENE_KEY));
      return Number.isInteger(saved) && saved >= 0 && saved < SCENE_META.length ? saved : 0;
    } catch { return 0; }
  });

  useEffect(() => {
    try { localStorage.setItem(SCENE_KEY, String(sceneIndex)); } catch {}
  }, [sceneIndex]);

  function goTo(index) {
    const clamped = Math.max(0, Math.min(index, SCENE_META.length - 1));
    setSceneIndex(clamped);
  }

  function restart() {
    setSceneIndex(0);
    localStorage.removeItem(SCENE_KEY);
  }

  const next = () => goTo(sceneIndex + 1);
  const prev = () => goTo(sceneIndex - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
      if (e.key === 'ArrowRight') {
        if (sceneIndex < SCENE_META.length - 1) next();
      } else if (e.key === 'ArrowLeft') {
        if (sceneIndex > 0) prev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sceneIndex]);

  function renderScene() {
    const props = { onNext: next, onPrev: prev, onRestart: restart };
    switch (SCENE_META[sceneIndex].id) {
      case 'intro': return <Scene1Arrival {...props} />;
      case 'kabir': return <Scene2MeetKabir {...props} />;
      case 'lab101': return <Scene3EnterLab101 {...props} />;
      case 'priya_window': return <Scene4PriyaNeedsBigPicture {...props} />;
      case 'kabir_dialogue': return <Scene5KabirGetsQuestion {...props} />;
      case 'kabir_mcq': return <Scene6Searchlight {...props} />;
      case 'looking_outward_story': return <Scene7ReverseSituation {...props} />;
      case 'boundary_story': return <Scene8Boundary {...props} />;
      case 'concept_1': return <Scene9PatternQuestion {...props} />;
      case 'concept_2': return <Scene10GrandReveal {...props} />;
      case 'quiz': return <Scene12FinalChallenge {...props} />;
      default: return null;
    }
  }

  const progressPercent = (sceneIndex / (SCENE_META.length - 1)) * 100;

  return (
    <main className="scope-shell">
      {/* Top bar */}
      <div className="scope-topbar">
        <div className="scope-logo">
          <span>The Campus Fest</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Interactive Case Study
        </div>
      </div>

      {/* Progress navigation dot trail */}
      <nav className="scope-scene-dots">
        <div className="dots-track">
          <div className="dots-track-fill" style={{ width: `${progressPercent}%` }}></div>
          <div className="dots-train-cursor" style={{ left: `${progressPercent}%` }}>🏫</div>
        </div>
        <div className="dots-container">
          {SCENE_META.map((scene, i) => (
            <button
              key={scene.id}
              className={`scope-scene-dot ${i === sceneIndex ? 'active' : ''} ${i < sceneIndex ? 'visited' : ''}`}
              onClick={() => goTo(i)}
              title={scene.label}
            >
              <span className="dot-index">{i + 1}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Active Scene Panel */}
      <section className="scope-panel" key={sceneIndex}>
        {renderScene()}
      </section>

      {/* Bottom Controls */}
      <footer className="scope-controls">
        <button className="ctrl-btn" onClick={prev} disabled={sceneIndex === 0}>
          <ArrowLeft size={16} /> Previous
        </button>
        <span className="ctrl-indicator">
          {String(sceneIndex + 1).padStart(2, '0')} / {String(SCENE_META.length).padStart(2, '0')}
        </span>
        <button className="ctrl-btn" onClick={next} disabled={sceneIndex === SCENE_META.length - 1}>
          Next <ArrowRight size={16} />
        </button>
      </footer>
    </main>
  );
}
