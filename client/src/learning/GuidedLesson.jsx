import React, { useState } from "react";
import { ReasoningStage } from "./ReasoningStage.jsx";
import { ConceptStage } from "./ConceptStage.jsx";
import { CodeStage } from "./CodeStage.jsx";
export function GuidedLesson({
  levelData,
  onBack,
  onFinish,
  inspectVariables = false,
  initialCaseIndex = 0,
  reasoningDelay,
}) {
  const [caseIndex, setCaseIndex] = useState(initialCaseIndex),
    [stage, setStage] = useState(1),
    [done, setDone] = useState(false);
  const current = levelData.caseStudies[caseIndex];
  const advance = () => {
    onFinish?.(current);
    if (caseIndex + 1 < levelData.caseStudies.length) {
      setCaseIndex(caseIndex + 1);
      setStage(1);
    } else setDone(true);
  };
  if (done)
    return (
      <section className="lesson-stage">
        <h3>This part is complete.</h3>
        <p>You have worked through every case in {levelData.title}.</p>
        <button className="button primary" onClick={onBack}>
          Return to lesson outline →
        </button>
      </section>
    );
  return (
    <div>
      <div className="lesson-position">
        Case {caseIndex + 1} of {levelData.caseStudies.length}
      </div>
      <ol className="lesson-steps" aria-label="Learning sequence">
        {["Reason", "Concept reveal", "Code build"].map((label, i) => (
          <li key={label} aria-current={stage === i + 1 ? "step" : undefined}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>
      <div key={`${caseIndex}/${stage}`}>
        {stage === 1 ? (
          <ReasoningStage
            caseStudy={current}
            reasoningDelay={reasoningDelay}
            onComplete={() => setStage(2)}
          />
        ) : stage === 2 ? (
          <ConceptStage caseStudy={current} onComplete={() => setStage(3)} />
        ) : (
          <CodeStage
            caseStudy={current}
            inspectVariables={inspectVariables}
            onComplete={advance}
          />
        )}
      </div>
    </div>
  );
}
