import React from 'react';
import { Award, Lock } from 'lucide-react';

/**
 * Displays the learner's badges, greyed out until unlocked.
 */
function BadgeGrid({ badges }) {
  if (!badges?.length) return null;

  return (
    <div className="badge-grid">
      {badges.map((badge) => (
        <div key={badge.id} className={badge.unlocked ? 'badge-tile unlocked' : 'badge-tile'}>
          {badge.unlocked ? <Award size={22} /> : <Lock size={18} />}
          <strong>{badge.name}</strong>
          <p>{badge.description}</p>
        </div>
      ))}
    </div>
  );
}

export default BadgeGrid;
