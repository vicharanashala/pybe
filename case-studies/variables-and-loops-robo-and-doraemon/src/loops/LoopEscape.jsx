import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PyodideProvider } from '../shared/pyodide/PyodideContext';
import SpaceRescueMission from './components/SpaceRescueMission';
import RepetitionConcept from './components/RepetitionConcept';
import IterationTheater from './components/IterationTheater';
import LoopVisualizer from './components/LoopVisualizer';
import Playground from './components/Playground';
import Evaluation from './components/Evaluation';
import Feedback from './components/Feedback';
import Ending from './components/Ending';
import TimeMachine from './components/TimeMachine';
import { MISSION } from './data/spaceRescue';
import './loops.css';

// Story (Robo and the Never-Ending Garden) -> Concept Explanation (for loop / while
// loop syntax + visualization) -> Complete Case Study (garden rescue mission) -> Playground ->
// Evaluation -> Ending. The opening story makes the learner feel the pain of repeating
// the same watering motion by hand before a wizard shows the "one instruction, many
// times" shortcut — only then does the concept scene formalize it with runnable syntax,
// before the mission gives real practice applying for/while loops to an evolving problem.
const SCENE_META = [
  { id: 'concept', label: 'The Garden & the Loop' },
  { id: 'theater', label: 'Watch It Run' },
  { id: 'visualizer', label: 'Take Control' },
  { id: 'mission', label: 'Garden Rescue' },
  { id: 'playground', label: 'Playground' },
  { id: 'evaluation', label: 'Check Yourself' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'ending', label: 'Full Bloom' }
];

// Bumped again — the opening scene was reworked into the Robo garden story inside
// 'concept', so an old saved index would silently land a returning learner on the
// wrong scene.
const STORAGE_KEY = 'pybe-learning-v1:robo-doraemon:loops-scene';

export default function LoopEscape({ onBack,onComplete }) {
  const [sceneIndex, setSceneIndex] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('pybe_loops_scene_v4'));
      return Number.isInteger(saved) && saved >= 0 && saved < SCENE_META.length ? saved : 0;
    } catch { return 0; }
  });
  const [stageProgress, setStageProgress] = useState({ done: 0, total: MISSION.stages.length });
  const [evaluationResult, setEvaluationResult] = useState(null);

  function goTo(index) {
    setSceneIndex(index);
    try { localStorage.setItem(STORAGE_KEY, String(index)); } catch { /* unavailable */ }
  }

  function restart() {
    setEvaluationResult(null);
    setStageProgress({ done: 0, total: MISSION.stages.length });
    goTo(0);
  }

  function handleEvaluationComplete(graded, correctCount) {
    setEvaluationResult({ graded, correctCount });
    goTo(sceneIndex + 1);
  }

  // Repair progress is spread evenly across every "content" scene (concept, theater,
  // visualizer, mission, playground, evaluation) — each is worth an equal slice, except
  // the mission slice fills in gradually as its own stages complete rather than jumping
  // straight from 0 to 100 the moment the learner reaches it. This is order-agnostic on
  // purpose: it doesn't assume the mission sits in any particular position in the flow.
  const CONTENT_IDS = ['concept', 'theater', 'visualizer', 'mission', 'playground', 'evaluation'];
  const sceneIdxFor = (id) => SCENE_META.findIndex((s) => s.id === id);
  let completedWeight = 0;
  CONTENT_IDS.forEach((id) => {
    const idx = sceneIdxFor(id);
    if (idx < sceneIndex) completedWeight += 1;
    else if (idx === sceneIndex && id === 'mission') completedWeight += stageProgress.done / stageProgress.total;
  });
  const repairPct = Math.round((completedWeight / CONTENT_IDS.length) * 100);

  function renderScene() {
    const next = () => goTo(Math.min(sceneIndex + 1, SCENE_META.length - 1));
    switch (SCENE_META[sceneIndex].id) {
      case 'mission': return (
        <SpaceRescueMission
          onNext={next}
          onStageProgress={(done, total) => setStageProgress({ done, total })}
        />
      );
      case 'concept': return <RepetitionConcept onNext={next} />;
      case 'theater': return <IterationTheater onNext={next} />;
      case 'visualizer': return <LoopVisualizer onNext={next} />;
      case 'playground': return <Playground onNext={next} />;
      case 'evaluation': return <Evaluation onComplete={handleEvaluationComplete} />;
      case 'feedback': return evaluationResult
        ? <Feedback graded={evaluationResult.graded} correctCount={evaluationResult.correctCount} onNext={next} />
        : <Evaluation onComplete={handleEvaluationComplete} />;
      case 'ending': return <Ending onComplete={onComplete} onBackToHub={onBack} onRestart={restart} />;
      default: return null;
    }
  }

  return (
    <PyodideProvider>
      <main className="lp-shell" data-robo-scene={SCENE_META[sceneIndex].id}>
        <div className="lp-particles" aria-hidden="true">
          {[...Array(18)].map((_, i) => <span key={i} className="lp-particle" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${i * 0.6}s` }} />)}
        </div>

        <div className="lp-topbar">
          <button className="lp-back" onClick={onBack}><ArrowLeft size={18} />Learning Hub</button>
          <div className="lp-title">🌼 Robo and the Magic Loop</div>
          <TimeMachine repairPct={repairPct} />
        </div>

        <nav className="lp-scene-dots">
          {SCENE_META.map((scene, i) => (
            <button
              key={scene.id}
              className={`lp-scene-dot ${i === sceneIndex ? 'active' : ''} ${i < sceneIndex ? 'visited' : ''}`}
              onClick={() => i <= sceneIndex && goTo(i)}
              disabled={i > sceneIndex}
            >
              <span className="lp-dot-index">{i + 1}</span>
              <span className="lp-dot-label">{scene.label}</span>
            </button>
          ))}
        </nav>

        <section className="lp-panel" key={sceneIndex}>
          {renderScene()}
        </section>
      </main>
    </PyodideProvider>
  );
}
