import React from 'react';
import SceneFrame from '../components/SceneFrame';
import DialogueBox from '../components/DialogueBox';

export default function Scene1Arrival({ onNext }) {
  return (
    <div className="storyboard-layout">
      <SceneFrame background="view" className="center-visual" />

      <div className="storyboard-narrative-panel">
        <div className="storyboard-header-section">
          <span className="storyboard-chapter-tag">Scene 01 / 11</span>
          <h1 className="storyboard-title-text">Welcome to the Campus Fest</h1>
          <span className="storyboard-location-tag">🏛️ Central Auditorium</span>
        </div>

        <div className="storyboard-narrative-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p>
            The annual technical festival is in full swing today. Banners are up, organizers are coordinating at their stations, and students are competing in multiple labs.
          </p>
          <p>
            To run this complex festival, organizers need to coordinate schedules, track live statistics, and communicate across different zones.
          </p>
          <div className="highlight-panel-v2" style={{ padding: '0.75rem 1rem', background: 'rgba(30, 41, 59, 0.45)' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Explore how information is shared across the campus to discover a fundamental structural organization concept.
            </p>
          </div>
        </div>

        <DialogueBox 
          speaker="System"
          text="Let's start by meeting Kabir at the Main Hall to see how they coordinate the scheduling."
          accent="indigo"
        />
      </div>
    </div>
  );
}
