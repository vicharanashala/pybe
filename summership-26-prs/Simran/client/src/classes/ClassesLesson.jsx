import { useState, useEffect } from "react";
import Scene from "./components/Scene.jsx";
import SignSquad from "./components/SignSquad.jsx";
import "./classes.css";

// Shared with SignSquad.jsx — presence of this key means the learner has
// already clicked "Try it out" and entered the app view at least once, so
// a remount (refresh, or navigating back from Inheritance) should skip
// straight past the intro Scene instead of replaying it.
const CLASSES_STAGE_STORAGE_KEY = "pybe_classes_stage";

function hasStartedSignSquad() {
  return localStorage.getItem(CLASSES_STAGE_STORAGE_KEY) !== null;
}

export default function ClassesLesson({ onDone }) {
  const alreadyStarted = hasStartedSignSquad();
  const [sceneClasses, setSceneClasses] = useState("");
  const [sceneHidden, setSceneHidden] = useState(alreadyStarted);
  const [appMounted, setAppMounted] = useState(alreadyStarted);
  const [appVisible, setAppVisible] = useState(alreadyStarted);

  function handleTryItOut() {
    setSceneClasses("fadeout");
    setTimeout(() => {
      setSceneHidden(true);
      setAppMounted(true);
    }, 500);
  }

  useEffect(() => {
    if (appMounted) {
      const t = setTimeout(() => setAppVisible(true), 20);
      return () => clearTimeout(t);
    }
  }, [appMounted]);

  return (
    <div className="stage-outer">
      {!sceneHidden && (
        <Scene sceneClasses={sceneClasses} onTryItOut={handleTryItOut} />
      )}
      {appMounted && <SignSquad show={appVisible} onDone={onDone} />}
    
      
    </div>
  );
}