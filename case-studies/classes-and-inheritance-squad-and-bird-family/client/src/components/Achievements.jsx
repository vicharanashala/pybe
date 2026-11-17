// Shared badge metadata — imported by App.jsx (for the popup) and
// Recap.jsx (for the end-of-lesson celebration), so the copy only
// lives in one place.
export const BADGES = {
  storyComplete: {
    name: "Story Explorer",
    message: "Great job! You've completed the Story section.",
  },
  conceptComplete: {
    name: "Knowledge Builder",
    message: "Nice work! You've completed the Concept section.",
  },
  practiceComplete: {
    name: "Code Apprentice",
    message: "Well done! You've completed the Practice section.",
  },
  quizComplete: {
    name: "Quiz Master",
    message: "Awesome! You've completed the Quiz section.",
  },
};

export const BADGE_ORDER = ["storyComplete", "conceptComplete", "practiceComplete", "quizComplete"];

// Displays the badge collection — earned badges in full color, locked
// ones greyed out. Reuses the existing recap-grid/recap-tile styling so
// it visually matches the Recap screen it lives on.
export default function Achievements({ achievements }) {
  return (
    <div className="recap-grid achievements-grid">
      {BADGE_ORDER.map((key) => {
        const badge = BADGES[key];
        const earned = Boolean(achievements?.[key]);
        return (
          <div
            key={key}
            className={"recap-tile achievement-tile" + (earned ? " is-earned" : " is-locked")}
          >
            <div className="recap-icon" aria-hidden="true">
              🏆
            </div>
            <p className="recap-label">{badge.name}</p>
            <p className="recap-value">{earned ? "Earned" : "Locked"}</p>
          </div>
        );
      })}
    </div>
  );
}