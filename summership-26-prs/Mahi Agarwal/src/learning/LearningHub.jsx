import React, { useState } from 'react';
import { Flower2, Boxes } from 'lucide-react';
import LoopEscape from '../loops/LoopEscape.jsx';
import Variables from '../variables/Variables.jsx';
import './hub.css';

// Adding a future module (Functions, Lists, ...) is: build it under its own
// folder (same shape as loops/ or variables/), then add one entry here.
const MODULES = [
  {
    id: 'loops',
    title: '🌼 Robo and the Magic Loop',
    topic: 'Loops',
    description: 'Can one magical spell help Robo water every flower? Discover Python loops in a garden full of wilting flowers, one iteration at a time.',
    accent: 'hub-accent-neon',
    Icon: Flower2,
    Component: LoopEscape
  },
  {
    id: 'variables',
    title: "Doraemon's Magical Memory Pockets",
    topic: 'Variables',
    description: "Doraemon's pocket has lost its memory and every gadget is mixed together. Help him give each one its own named place, one pocket at a time.",
    accent: 'hub-accent-terracotta',
    Icon: Boxes,
    Component: Variables
  }
];

export default function LearningHub() {
  const [activeId, setActiveId] = useState(null);
  const active = MODULES.find((m) => m.id === activeId);

  if (active) {
    const { Component } = active;
    return <Component onBack={() => setActiveId(null)} />;
  }

  return (
    <main className="hub-shell">
      <div className="hub-intro">
        <p className="hub-eyebrow">The Learning Hub</p>
        <h1>Pick your next chapter</h1>
        <p className="hub-subtitle">Each topic is a complete, story-driven experience — pick one and go as deep as you like.</p>
      </div>

      <div className="hub-grid">
        {MODULES.map(({ id, title, topic, description, accent, Icon }) => (
          <button key={id} className={`hub-card ${accent}`} onClick={() => setActiveId(id)}>
            <span className="hub-card-icon"><Icon size={26} /></span>
            <span className="hub-card-topic">{topic}</span>
            <strong className="hub-card-title">{title}</strong>
            <p className="hub-card-desc">{description}</p>
            <span className="hub-card-cta">Begin →</span>
          </button>
        ))}
        <div className="hub-card hub-card-future">
          <span className="hub-card-topic">Coming soon</span>
          <strong className="hub-card-title">Functions, Recursion…</strong>
          <p className="hub-card-desc">More chapters are on the way, built the same way as these.</p>
        </div>
      </div>
    </main>
  );
}
