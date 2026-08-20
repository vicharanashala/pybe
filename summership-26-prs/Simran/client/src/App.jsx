import { useState } from "react";
import ClassesLesson from "./classes/ClassesLesson.jsx";
import InheritanceLesson from "./InheritanceLesson.jsx";

// App just decides which lesson to show. All the actual Classes logic
// lives in ClassesLesson.jsx, and all the Inheritance logic (story,
// concept, build, code, Challenge Path levelmap, achievements, etc.)
// lives in InheritanceLesson.jsx, untouched.
const CLASSES_COMPLETE_STORAGE_KEY = "pybe_classes_complete";
// Shared with ClassesLesson.jsx/SignSquad.jsx — clearing it on an explicit
// "revisit Classes" click means that action always starts from the intro
// Scene, distinct from a plain refresh mid-lesson (which resumes).
const CLASSES_STAGE_STORAGE_KEY = "pybe_classes_stage";

function getInitialClassesComplete() {
  return localStorage.getItem(CLASSES_COMPLETE_STORAGE_KEY) === "true";
}

export default function App() {
  const [classesComplete, setClassesComplete] = useState(getInitialClassesComplete);

  if (!classesComplete) {
    return (
      <ClassesLesson
        onDone={() => {
          localStorage.setItem(CLASSES_COMPLETE_STORAGE_KEY, "true");
          setClassesComplete(true);
        }}
      />
    );
  }

  return (
    <InheritanceLesson
      onRevisitClasses={() => {
        // Only flips the switch back to Classes. Doesn't touch stepIndex,
        // achievements, completedLevelIds, or points — so nothing about
        // Inheritance progress is lost. Also clears both persisted Classes
        // flags: pybe_classes_complete (so a refresh doesn't bounce back
        // to Inheritance mid-way) and pybe_classes_stage (so an explicit
        // "revisit" always starts at the intro Scene, not wherever the
        // learner last left off).
        localStorage.removeItem(CLASSES_COMPLETE_STORAGE_KEY);
        localStorage.removeItem(CLASSES_STAGE_STORAGE_KEY);
        setClassesComplete(false);
      }}
    />
  );
}