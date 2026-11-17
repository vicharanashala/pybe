import React from 'react';

function RoadmapTimeline({ roadmap }) {
  if (!roadmap.length) {
    return <p style={{ color: '#68736f' }}>No roadmap data available.</p>;
  }

  return (
    <div className="roadmap">
      {roadmap.map((phase) => (
        <article key={phase.phase}>
          <strong>{phase.phase}</strong>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <small>{phase.items?.join(' / ')}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

export default RoadmapTimeline;
