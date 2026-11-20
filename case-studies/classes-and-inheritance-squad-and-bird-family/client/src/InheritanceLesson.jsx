import LearningProgress from "./components/LearningProgress.jsx";
import React, { useEffect, useState } from "react";
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
import { LEVELS, LEVEL_ORDER } from "./levels.js";
import LevelMap from "./components/LevelMap.jsx";

import {saveNotes} from './api.js';
import {createStoryProgressHook} from '../../../../shared/story-progress.mjs';
const useStoryProgress=createStoryProgressHook(React);
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

const STEP_INDEX_STORAGE_KEY='pybe-learning-v1:bird-family-step';
const COMPLETED_LEVELS_STORAGE_KEY='pybe-learning-v1:bird-family-levels';
function getInitialStepIndex() {
  const raw = (localStorage.getItem(STEP_INDEX_STORAGE_KEY) ?? localStorage.getItem('pybe_step_index'));
  const parsed = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  // Clamp in case STEPS has changed shape (e.g. levels added/removed)
  // since this was last saved, so a stale index can never crash render.
  return Math.min(parsed, STEPS.length - 1);
}

function getInitialCompletedLevelIds() {
  try {
    const stored = JSON.parse((localStorage.getItem(COMPLETED_LEVELS_STORAGE_KEY) ?? localStorage.getItem('pybe_completed_levels')));
    if (!Array.isArray(stored)) return [];
    // Filter against the real LEVEL_ORDER so a stale/edited list can never
    // reference a level id that no longer exists.
    return stored.filter((id) => LEVEL_ORDER.includes(id));
  } catch {
    return [];
  }
}

export default function InheritanceLesson({onRevisitClasses,onComplete}){
 const [stepIndex,setStepIndex]=useState(getInitialStepIndex);
 const [stageProgress,setStageProgress]=useState(0);
 const [completedLevelIds,setCompletedLevelIds]=useState(getInitialCompletedLevelIds);
 const [justUnlockedLevelId,setJustUnlockedLevelId]=useState(null);
 const [,complete]=useStoryProgress('bird-family');
 const step=STEPS[stepIndex];
 useEffect(()=>{localStorage.setItem(STEP_INDEX_STORAGE_KEY,String(stepIndex));saveNotes({lastStep:step}).catch(()=>{});if(step==='recap')onComplete?.();},[stepIndex]);
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

function goNext(){setStageProgress(0);setStepIndex(i=>Math.min(i+1,STEPS.length-1));}
function handleLevelComplete(id) {
  complete(id);
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


function restart(){
 localStorage.setItem(STEP_INDEX_STORAGE_KEY,'0');
 localStorage.setItem(COMPLETED_LEVELS_STORAGE_KEY,'[]');
 setCompletedLevelIds([]);setJustUnlockedLevelId(null);setStepIndex(0);
 onRevisitClasses?.();
}
  return (
    <div className="app-shell" data-bird-step={step}>
      <header className="app-header">
        <p className="brand">
        pyBe · The Bird Family 
      </p>
        
        <div className="feather-trail">
          {STEPS.map((s, i) => (
            <span key={s} className={"feather" + (i <= stepIndex ? " filled" : "")} />
          ))}
        </div>
      </header>

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
              saveNotes({
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


                setStageProgress(value);
              }}
            />
          )}

          {step === "build" && (
            <BuildItQuiz
              onQuizProgress={(value) => {


                setStageProgress(value);
              }}
            onDone={(answers) => {
              saveNotes({
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
                saveNotes({
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

        {step === "recap" && <Recap onRestart={restart} />}
      </main>
    </div>
  );
}