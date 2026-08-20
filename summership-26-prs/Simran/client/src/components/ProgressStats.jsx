// Small stats strip: total points, current streak, completed levels.
// Purely presentational — App.jsx (via usePointsAndStreak) owns the data.
export default function ProgressStats({ points, streak, levelsCompleted }) {
  return (
    <div className="progress-stats" aria-label="Learning progress stats">
      <div className="progress-stat">
        <span className="progress-stat-value">{points}</span>
        <span className="progress-stat-label">Points</span>
      </div>
      <div className="progress-stat">
        <span className="progress-stat-value">🔥 {streak}</span>
        <span className="progress-stat-label">Day Streak</span>
      </div>
      <div className="progress-stat">
        <span className="progress-stat-value">{levelsCompleted}</span>
        <span className="progress-stat-label">Levels Done</span>
      </div>
    </div>
  );
}