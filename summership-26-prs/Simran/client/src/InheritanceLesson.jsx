import LearningProgress from "./components/LearningProgress.jsx";
import { useEffect, useState } from "react";
import StoryScreen from "./components/StoryScreen.jsx";
import ReflectPrompt from "./components/ReflectPrompt.jsx";
import ThinkItThrough from "./components/ThinkItThrough.jsx";
import ConceptReveal from "./components/ConceptReveal.jsx";
import BuildItQuiz from "./components/BuildItQuiz.jsx";
import CodeBuilder from "./components/CodeBuilder.jsx";
import LevelIntro from "./components/LevelIntro.jsx";
import TrySimulator from "./components/TrySimulator.jsx";
import LevelComplete from "./components/LevelComplete.jsx";
import Recap from "./components/Recap.jsx";
import AchievementPopup from "./components/AchievementPopup.jsx";
import { BADGES } from "./components/Achievements.jsx";
import { LEVELS, LEVEL_ORDER } from "./levels.js";
import { saveProgress } from "./api.js";
import usePointsAndStreak from "./hooks/usePointsAndStreak.js";
import ProgressStats from "./components/ProgressStats.jsx";
import LevelMap from "./components/LevelMap.jsx";

// CHANGED: the Challenge Path used to be a single fixed "levelmap" step
// wedged between "code" and the first level's "intro-<id>". It's now
// tagged per level — `levelmap-<id>` — and inserted before every level's
// intro/simulate/complete trio, so the hub is what the learner always
// lands back on after finishing a level, not just before the first one.
const FIXED_STEPS = [
  "story",
  "reflect",
  "think",
  "concept",
  "build",
  "code",
];
const STEPS = [
  ...FIXED_STEPS,
  ...LEVEL_ORDER.flatMap((id) => [`levelmap-${id}`, `intro-${id}`, `simulate-${id}`, `complete-${id}`]),
  "recap",
];

// --- Achievement system (additive) ---------------------------------
// Mirrors the same step boundaries already used above for stageStates:
// story finishes when leaving "think", concept when leaving "concept",
// practice (the "build" stage in stageStates) when leaving "build", and
// quiz when leaving the very last step before "recap".
const MILESTONE_BY_STEP = {
  think: "storyComplete",
  concept: "conceptComplete",
  build: "practiceComplete",
};
MILESTONE_BY_STEP[STEPS[STEPS.length - 2]] = "quizComplete";

const ACHIEVEMENTS_STORAGE_KEY = "pybe_achievements";
const ACTIVE_BADGE_STORAGE_KEY = "pybe_active_badge";
const STEP_INDEX_STORAGE_KEY = "pybe_step_index";
// NEW: persists which levels are completed, the same way stepIndex and
// achievements already persist — so a refresh mid-lesson doesn't lose
// which Challenge Path nodes should show as completed/unlocked.
const COMPLETED_LEVELS_STORAGE_KEY = "pybe_completed_levels";
const EMPTY_ACHIEVEMENTS = {
  storyComplete: false,
  conceptComplete: false,
  practiceComplete: false,
  quizComplete: false,
};

function getInitialStepIndex() {
  const raw = localStorage.getItem(STEP_INDEX_STORAGE_KEY);
  const parsed = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  // Clamp in case STEPS has changed shape (e.g. levels added/removed)
  // since this was last saved, so a stale index can never crash render.
  return Math.min(parsed, STEPS.length - 1);
}

function getInitialAchievements() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY));
    return stored ? { ...EMPTY_ACHIEVEMENTS, ...stored } : EMPTY_ACHIEVEMENTS;
  } catch {
    return EMPTY_ACHIEVEMENTS;
  }
}

function getInitialCompletedLevelIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(COMPLETED_LEVELS_STORAGE_KEY));
    if (!Array.isArray(stored)) return [];
    // Filter against the real LEVEL_ORDER so a stale/edited list can never
    // reference a level id that no longer exists.
    return stored.filter((id) => LEVEL_ORDER.includes(id));
  } catch {
    return [];
  }
}

function getLearnerId() {
  let id = localStorage.getItem("pybe_learner_id");
  if (!id) {
    id = "learner-" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem("pybe_learner_id", id);
  }
  return id;
}

export default function InheritanceLesson({ onRevisitClasses }) {
const [stepIndex, setStepIndex] = useState(getInitialStepIndex);
const [achievements, setAchievements] = useState(getInitialAchievements);
const [activeBadgeKey, setActiveBadgeKey] = useState(null);
const [stageProgress, setStageProgress] = useState(0);
const [storyProgress, setStoryProgress] = useState(0);
const [conceptProgress, setConceptProgress] = useState(0);
const [quizProgress, setQuizProgress] = useState(0);
const [codeProgress, setCodeProgress] = useState(0);
// NEW: which levels are done, and which one (if any) should play its
// "just unlocked" animation the next time the Challenge Path is shown.
const [completedLevelIds, setCompletedLevelIds] = useState(getInitialCompletedLevelIds);
const [justUnlockedLevelId, setJustUnlockedLevelId] = useState(null);


const {
  points,
  streak,
  levelsCompleted,
  recordStoryProgress,
  recordConceptProgress,
  recordQuizProgress,
  recordLevelComplete,
  resetAll: resetPointsAndStreak,
} = usePointsAndStreak();

useEffect(() => {
  const savedBadge = localStorage.getItem(ACTIVE_BADGE_STORAGE_KEY);

  if (savedBadge) {
    setActiveBadgeKey(savedBadge);
  }
}, []);
  const learnerId = getLearnerId();
  const step = STEPS[stepIndex];

let currentLevel = 1;

if (["story", "reflect", "think"].includes(step)) {
  currentLevel = 1;
} else if (step === "concept") {
  currentLevel = 2;
} else if (step === "build") {
  currentLevel = 3;
} else if (step === "code") {
  currentLevel = 4;
} else if (step === "recap") {
  currentLevel = 16;
} else if (step.startsWith("levelmap-")) {
  const idx = LEVEL_ORDER.indexOf(step.slice("levelmap-".length));
  currentLevel = idx === -1 ? 5 : Math.min(5 + idx, 16);
} else {
  const simulatorIndex = LEVEL_ORDER.findIndex(
    (id) =>
      step === `intro-${id}` ||
      step === `simulate-${id}` ||
      step === `complete-${id}`
  );

  if (simulatorIndex !== -1) {
    currentLevel = Math.min(5 + simulatorIndex, 16);
  }
}

const totalProgressSteps = STEPS.length - 1;
const progressPercent = Math.min(
  100,
  Math.round(((stepIndex + stageProgress / 100) / totalProgressSteps) * 100)
);



  const stageStates = {
  story: "locked",
  concept: "locked",
  practice: "locked",
  quiz: "locked",
};

if (["story", "reflect", "think"].includes(step)) {
  stageStates.story = "current";
}

if (step === "concept") {
  stageStates.story = "completed";
  stageStates.concept = "current";
}

if (step === "build") {
  stageStates.story = "completed";
  stageStates.concept = "completed";
  stageStates.practice = "current";
}

if (
  step === "code" ||
  step.startsWith("levelmap-") ||
  step.startsWith("intro-") ||
  step.startsWith("simulate-") ||
  step.startsWith("complete-") ||
  step === "recap"
) {
  stageStates.story = "completed";
  stageStates.concept = "completed";
  stageStates.practice = "completed";
  stageStates.quiz = "current";
}

function goNext() {

  if (step.startsWith("complete-")) {
    recordLevelComplete();
  }

  const milestoneKey = MILESTONE_BY_STEP[step];


  if (milestoneKey && localStorage.getItem(ACTIVE_BADGE_STORAGE_KEY) === null) {
    const nextAchievements = {
      ...achievements,
      [milestoneKey]: true,
    };

    setAchievements(nextAchievements);

    localStorage.setItem(
      ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify(nextAchievements)
    );

    setActiveBadgeKey(milestoneKey);

    localStorage.setItem(
      ACTIVE_BADGE_STORAGE_KEY,
      milestoneKey
    );

    return;
  }
setStageProgress(0);
setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
}

// NEW: replaces the plain `goNext` that LevelComplete used to call
// directly. Marks the level as completed, persists it, figures out
// which level (if any) just unlocked, then does the normal step
// advance — which lands on `levelmap-<nextId>` (or "recap" after the
// last level, exactly like before). Scoring/XP/points are untouched:
// `recordLevelComplete()` still runs inside goNext() exactly as it did.
function handleLevelComplete(id) {
  setCompletedLevelIds((prev) => {
    if (prev.includes(id)) return prev;
    const next = [...prev, id];
    localStorage.setItem(COMPLETED_LEVELS_STORAGE_KEY, JSON.stringify(next));
    return next;
  });

  const idx = LEVEL_ORDER.indexOf(id);
  const nextId = LEVEL_ORDER[idx + 1] ?? null; // null after the last level — no more hub stops
  setJustUnlockedLevelId(nextId);

  goNext();
}


function restart() {

  localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_BADGE_STORAGE_KEY);
  localStorage.removeItem(STEP_INDEX_STORAGE_KEY);
  localStorage.removeItem(COMPLETED_LEVELS_STORAGE_KEY);

  setAchievements({...EMPTY_ACHIEVEMENTS});
  setActiveBadgeKey(null);
  setCompletedLevelIds([]);
  setJustUnlockedLevelId(null);

  resetPointsAndStreak();

  setStepIndex(0);

  // "Restart" means the whole course, not just Inheritance — send the
  // learner back through Classes too, from its intro Scene.
  onRevisitClasses && onRevisitClasses();
}

  useEffect(() => {
    localStorage.setItem(STEP_INDEX_STORAGE_KEY, String(stepIndex));
  }, [stepIndex]);

  useEffect(() => {
    saveProgress(learnerId, { lastStep: step }).catch(() => {});
  }, [step]);

 const activeBadge = activeBadgeKey ? BADGES[activeBadgeKey] : null;


  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="brand">
        pyBe · The Bird Family 
        <span className="header-points">🌟 {points} pts</span>
      </p>
        
        <div className="feather-trail">
          {STEPS.map((s, i) => (
            <span key={s} className={"feather" + (i <= stepIndex ? " filled" : "")} />
          ))}
        </div>
      </header>

      <ProgressStats 
        points={points}
        streak={streak}
        levelsCompleted={levelsCompleted}
      />

      <main className="app-main">
        <LearningProgress
          levelNumber={currentLevel}
          totalLevels={16}
          stageStates={stageStates}
          progressPercent={progressPercent}
        />

        {step === "story" && (
          <StoryScreen 
            onNext={goNext}
          onStoryProgress={(value) => {
            recordStoryProgress(value);
            setStageProgress(value);
          }}
          />
        )}

        {step === "reflect" && (
          <ReflectPrompt
            question="What do you think all the birds in this family have in common?"
            hint="Every bird starts out knowing the same basic habits — eating, sleeping, laying eggs — because they all come from the same parent, Bird."
            onNext={goNext}
          />
        )}

        {step === "think" && (
          <ThinkItThrough
          onProgress={(value)=>{
            setStageProgress(value);
          }}
          onDone={(answers)=>{
              saveProgress(learnerId, {
                thinkItThrough: Object.entries(answers).map(([questionId, a]) => ({
                  questionId,
                  selected: a.optId,
                  correct: a.isCorrect,
                })),
              }).catch(() => {});
              goNext();
            }}
          />
        )}
          {step === "concept" && (
            <ConceptReveal
              onNext={goNext}
              onConceptProgress={(value) => {
                recordConceptProgress(value);
                setConceptProgress(value);
                setStageProgress(value);
              }}
            />
          )}

          {step === "build" && (
            <BuildItQuiz
              onQuizProgress={(value) => {
                recordQuizProgress(value);
                setQuizProgress(value);
                setStageProgress(value);
              }}
            onDone={(answers) => {
              saveProgress(learnerId, {
                buildItAnswers: Object.entries(answers).map(([questionId, selected]) => ({
                  questionId,
                  selected,
                })),
              }).catch(() => {});
              goNext();
            }}
          />
        )}

        {step === "code" && (
          <CodeBuilder
            onDone={goNext}
          onCodeProgress={(value) => {
            setCodeProgress(value);
            setStageProgress(value);
          }}
          />
        )}

          {/* CHANGED: was a single `step === "levelmap"` block. Now matches
              any `levelmap-<id>` step, and passes real completed/current/
              unlock state so this is the persistent hub instead of a
              one-time screen. */}
          {step.startsWith("levelmap-") && (
            <LevelMap
              currentLevelId={step.slice("levelmap-".length)}
              completedLevelIds={completedLevelIds}
              justUnlockedId={justUnlockedLevelId}
              onUnlockSeen={() => setJustUnlockedLevelId(null)}
              onStart={() => {
                setJustUnlockedLevelId(null);
                goNext();
              }}
              points={points}
            />
          )}

          {LEVEL_ORDER.map((id) =>
            step === `intro-${id}` ? (
              <LevelIntro key={id} level={LEVELS[id]} onStart={goNext} />
            ) : null
          )}
        {LEVEL_ORDER.map((id) =>
          step === `simulate-${id}` ? (
            <TrySimulator
              key={id}
              levelId={id}
              onComplete={() => {
                const isLast = id === LEVEL_ORDER[LEVEL_ORDER.length - 1];
                saveProgress(learnerId, {
                  [`simulatorSteps.${id}Completed`]: true,
                  ...(isLast ? { lessonCompleted: true } : {}),
                }).catch(() => {});
                goNext();
              }}
            />
          ) : null
        )}

        {LEVEL_ORDER.map((id) =>
          step === `complete-${id}` ? (
            <LevelComplete
              key={id}
              level={LEVELS[id]}
              isLast={id === LEVEL_ORDER[LEVEL_ORDER.length - 1]}
              onContinue={() => handleLevelComplete(id)}
            />
          ) : null
        )}

        {step === "recap" && <Recap onRestart={restart} achievements={achievements} />}
      </main>
      {activeBadge && (
        <AchievementPopup
          badgeName={activeBadge.name}
          message={activeBadge.message}
        onContinue={() => {
          setActiveBadgeKey(null);
          localStorage.removeItem(ACTIVE_BADGE_STORAGE_KEY);
          setStageProgress(0);
          setStepIndex((i)=>Math.min(i+1,STEPS.length-1));
        }}
        />
      )}
    </div>
  );
}