import {readStoryState,saveStoryState} from '../../../../shared/story-state.mjs';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Scene1Explosion from './scenes/Scene1Explosion';
import Scene2Searching from './scenes/Scene2Searching';
import Scene3Discovery from './scenes/Scene3Discovery';
import Scene4MemoryBoxes from './scenes/Scene4MemoryBoxes';
import Scene5Naming from './scenes/Scene5Naming';
import Scene6Assignment from './scenes/Scene6Assignment';
import Scene7Reading from './scenes/Scene7Reading';
import Scene8Updating from './scenes/Scene8Updating';
import Scene9MemoryRoom from './scenes/Scene9MemoryRoom';
import Scene10FinalMission from './scenes/Scene10FinalMission';
import './theme/theme.css';

// ---------------------------------------------------------------------------
// Variables module — "Doraemon's Magical Memory Pockets"
//
// A from-scratch sibling to the Loops module: its own theme (theme/theme.css),
// its own characters, its own visualizations (CodeToMemoryAnimation /
// MemoryInspector), its own scene shell. Nothing here is copied from Loops —
// only the general idea of "a story-driven, scene-based module with a
// progress trail and a shared state object" carries over, the same way any
// two modules in this app share an architecture without sharing content.
//
// Two pieces of state are threaded through every scene:
//  - `memory`: the live { pocketId: gadget } map that scenes 6-10 read and
//    write, so the Memory Room (Scene 9) and the finale (Scene 10) reflect
//    exactly what the learner has actually done.
// ---------------------------------------------------------------------------

const SCENE_META = [
  { id: 'explosion', label: 'Morning Chaos' },
  { id: 'searching', label: 'Lost in the Pocket' },
  { id: 'discovery', label: 'A Better Idea' },
  { id: 'sorting', label: 'Sorting the Pockets' },
  { id: 'naming', label: 'Naming the Pockets' },
  { id: 'assignment', label: 'Storing a Gadget' },
  { id: 'reading', label: 'Where Is It?' },
  { id: 'updating', label: 'Swapping Gadgets' },
  { id: 'memoryroom', label: 'The Memory Room' },
  { id: 'mission', label: "Nobita's Emergency" }
];

const SCENE_KEY = 'pybe-learning-v1:robo-doraemon:variables-scene';
const CLOUD_EMOJI = ['☁️', '✨', '☁️', '🌤️'];

export default function Variables({ onBack,onComplete }) {
  const [sceneIndex, setSceneIndex] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(SCENE_KEY) ?? localStorage.getItem('pybe_variables_scene_v2'));
      return Number.isInteger(saved) && saved >= 0 && saved < SCENE_META.length ? saved : 0;
    } catch { return 0; }
  });
  const [memory, setMemoryState] = useState(()=>readStoryState(localStorage,'robo-doraemon','memory',{}));
  useEffect(()=>{saveStoryState(localStorage,'robo-doraemon','memory',memory);},[memory]);

  function goTo(index) {
    const clamped = Math.max(0, Math.min(index, SCENE_META.length - 1));
    setSceneIndex(clamped);
    try { localStorage.setItem(SCENE_KEY, String(clamped)); } catch { /* storage unavailable */ }
  }

  function setMemory(updater) {
    setMemoryState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }

  function restart() {
    setMemoryState({});
    goTo(0);
  }

  const next = () => goTo(sceneIndex + 1);

  function renderScene() {
    const shared = { memory, setMemory };
    switch (SCENE_META[sceneIndex].id) {
      case 'explosion': return <Scene1Explosion onNext={next} />;
      case 'searching': return <Scene2Searching onNext={next} />;
      case 'discovery': return <Scene3Discovery onNext={next} />;
      case 'sorting': return <Scene4MemoryBoxes onNext={next} {...shared} />;
      case 'naming': return <Scene5Naming onNext={next} />;
      case 'assignment': return <Scene6Assignment onNext={next} {...shared} />;
      case 'reading': return <Scene7Reading onNext={next} {...shared} />;
      case 'updating': return <Scene8Updating onNext={next} {...shared} />;
      case 'memoryroom': return <Scene9MemoryRoom onNext={next} {...shared} />;
      case 'mission': return <Scene10FinalMission {...shared} onComplete={onComplete} onBack={onBack} onRestart={restart} />;
      default: return null;
    }
  }

  return (
    <main className="dm-shell" data-doraemon-scene={SCENE_META[sceneIndex].id}>
      <div className="dm-clouds" aria-hidden="true">
        {CLOUD_EMOJI.map((e, i) => (
          <span key={i} className="dm-cloud" style={{ top: `${8 + i * 18}%`, animationDelay: `${i * -6}s`, animationDuration: `${22 + i * 4}s` }}>{e}</span>
        ))}
      </div>

      <div className="dm-topbar">
        <button className="dm-back" onClick={onBack}><ArrowLeft size={18} />Learning Hub</button>
        <div className="dm-title">🐱 Doraemon's Magical Memory Pockets</div>
      </div>

      <nav className="dm-scene-dots">
        {SCENE_META.map((scene, i) => (
          <button
            key={scene.id}
            className={`dm-scene-dot ${i === sceneIndex ? 'active' : ''} ${i < sceneIndex ? 'visited' : ''}`}
            onClick={() => i <= sceneIndex && goTo(i)}
            disabled={i > sceneIndex}
          >
            <span className="dm-dot-index">{i + 1}</span>
            <span className="dm-dot-label">{scene.label}</span>
          </button>
        ))}
      </nav>

      <section className="dm-panel" key={sceneIndex}>
        {renderScene()}
      </section>
    </main>
  );
}
