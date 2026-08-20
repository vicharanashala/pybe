// Reusable progress header for level cards.
//
// Usage:
//   <LearningProgress
//     levelNumber={1}
//     totalLevels={16}
//     stageStates={{ story: "current", concept: "locked", practice: "locked", quiz: "locked" }}
//     currentStoryIndex={2}          // optional — 0-based index into the Story cards
//     totalStoryCards={6}            // optional — enables gradual, card-by-card progress
//     noteText="You're currently learning the Story section."  // optional helper line
//   />
//
// stageStates only needs the keys you want to override — anything omitted
// falls back to "locked". Valid values: "completed" | "current" | "locked".
// currentStoryIndex/totalStoryCards are optional: without them the bar just
// reflects levelNumber/totalLevels like before.

const STAGE_DEFINITIONS = [
  { key: "story", label: "Story", icon: "📖" },
  { key: "concept", label: "Concept", icon: "🧠" },
  { key: "practice", label: "Practice", icon: "💻" },
  { key: "quiz", label: "Quiz", icon: "🏆" },
];

const STATUS_META = {
  completed: { icon: "✔", text: "Completed" },
  current: { icon: "▶", text: "Current" },
  locked: { icon: "🔒", text: "Locked" },
};

export default function LearningProgress({
  levelNumber,
  totalLevels,
  stageStates = {},
  noteText,
  progressPercent = 0,
}) { const percent = progressPercent;

  return (
    <div className="learning-progress">
    <div className="learning-progress-header" style={{ justifyContent: "flex-end" }}>
    <span className="learning-progress-percent">
        {percent}% Complete
    </span>
    </div>

      <div
        className="learning-progress-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="learning-progress-fill" style={{ width: `${percent}%` }} />
      </div>

      {noteText && <p className="learning-progress-note">{noteText}</p>}

      <div className="learning-progress-stages">
        {STAGE_DEFINITIONS.map((stage) => {
          const state = stageStates[stage.key] || "locked";
          const status = STATUS_META[state];
          return (
            <div key={stage.key} className={`learning-stage is-${state}`}>
              <span className="learning-stage-icon">{stage.icon}</span>
              <span className="learning-stage-label">{stage.label}</span>
              <span className="learning-stage-status">
                {status.icon} {status.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}