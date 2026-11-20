import React, { useState, useEffect } from "react";
import { InlineText, LessonText } from "./RichText.jsx";
function Choice({ option, onChoose, selected, disabled }) {
  return (
    <button
      className={`lesson-choice ${selected ? (option.status === "correct" ? "correct" : "incorrect") : ""}`}
      disabled={disabled}
      onClick={() => onChoose(option)}
    >
      <InlineText text={option.text} />
      {selected && (
        <span>{option.status === "correct" ? " ✓" : " — Let’s reflect"}</span>
      )}
    </button>
  );
}
export function ReasoningStage({ caseStudy, onComplete, reasoningDelay }) {
  const [first, setFirst] = useState(null),
    [second, setSecond] = useState(null);
  const reflection =
    first?.status === "incorrect"
      ? caseStudy.stage1.reflections[first.routesTo]
      : null;
  const canContinue = first?.status === "correct" || !!second;
  useEffect(() => {
    if (!canContinue || !reasoningDelay) return;
    const timer = setTimeout(onComplete, reasoningDelay);
    return () => clearTimeout(timer);
  }, [canContinue, reasoningDelay, onComplete]);
  return (
    <section className="lesson-stage" aria-label="Reason through the story">
      <div className="lesson-scenario">
        <span className="eyebrow">THE SITUATION</span>
        <p>{caseStudy.scenario}</p>
      </div>
      <h3>How would you approach this?</h3>
      <div className="lesson-choices">
        {caseStudy.stage1.attempt1.map((option, i) => (
          <Choice
            key={i}
            option={option}
            selected={first === option}
            disabled={!!first}
            onChoose={setFirst}
          />
        ))}
      </div>
      {reflection && (
        <div className="lesson-reflection">
          <h3>A moment to reflect</h3>
          <LessonText text={reflection.prompt} />
          <div className="lesson-choices">
            {reflection.attempt2.map((option, i) => (
              <Choice
                key={i}
                option={option}
                selected={second === option}
                disabled={!!second}
                onChoose={setSecond}
              />
            ))}
          </div>
        </div>
      )}
      {canContinue && (
        <>
          <p role="status">
            {second?.status === "incorrect"
              ? "Compare your approach with the explanation in the next step."
              : "You’re ready to explore the Python concept."}
          </p>
          <button className="button primary" onClick={onComplete}>
            Continue to concept reveal →
          </button>
        </>
      )}
    </section>
  );
}
