import React from 'react';
import { Play } from 'lucide-react';

function SessionList({ sessions }) {
  if (!sessions.length) {
    return (
      <div className="sessions">
        <p style={{ color: '#68736f' }}>No sessions yet.</p>
      </div>
    );
  }

  return (
    <div className="sessions">
      {sessions.slice(0, 6).map((session) => (
        <article key={session.id}>
          <Play size={16} />
          <div>
            <strong>{session.scenario?.title || 'Untitled scenario'}</strong>
            <span>
              {session.masterySignals?.join(' / ') || 'No mastery signals'}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default SessionList;
