import React from "react";
import { LessonText } from "./RichText.jsx";
export function ConceptStage({ caseStudy, onComplete }) {
  return (
    <section className="lesson-stage">
      <h3>The Python behind the story</h3>
      <LessonText text={caseStudy.stage2.conceptReveal} />
      <button className="button primary" onClick={onComplete}>
        Continue to code build →
      </button>
    </section>
  );
}
