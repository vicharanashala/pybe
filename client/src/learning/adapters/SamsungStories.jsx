import React, { useState } from "react";
import { createStoryProgressHook } from "../../../../shared/story-progress.mjs";
const useStoryProgress = createStoryProgressHook(React);
import AuthoredStory from "../AuthoredStory.jsx";
import CaseStudy from "../../../../case-studies/object-oriented-python-samsung-stories/client/src/CaseStudy.jsx";
import content from "../../../../case-studies/object-oriented-python-samsung-stories/shared/case-studies.cjs";
import styles from "../../../../case-studies/object-oriented-python-samsung-stories/client/src/styles.css";
const { caseStudies } = content;
const theme = `:host{background:#fcf8f2;color:#30271f}.case-study-overlay{position:relative;inset:auto;background:transparent;display:block;padding:0;z-index:auto}.case-study-modal{max-width:none;max-height:none;overflow:visible;background:#fffdf9;box-shadow:none;border:1px solid #eadbce}.interactive-content{max-width:960px;margin:auto}.btn,.btn.amber{background:#df622f;border-color:#df622f;color:white}.step-dot.active,.step-dot.done{background:#df622f;border-color:#df622f}.story-picker{padding:28px}.story-picker-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.story-picker button{text-align:left;padding:20px;background:#fffdf9;border:1px solid #eadbce;border-radius:12px;color:#30271f;cursor:pointer}.story-picker button strong,.story-picker button span{display:block;margin-bottom:8px}.close-btn{position:relative;top:auto;right:auto;margin:12px 12px 0 auto;width:auto;padding:8px 12px;border-radius:8px;font-size:.85rem}.option-card.picked{border-color:#df622f;background:#fff0e2}.story-completion{margin:32px auto}`;
export default function SamsungStories({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [completed, complete] = useStoryProgress("samsung-stories");
  React.useEffect(() => {
    if (completed.size === caseStudies.length) onComplete?.();
  }, [completed, onComplete]);
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      {selected ? (
        <CaseStudy
          key={selected.id}
          study={selected}
          onClose={() => setSelected(null)}
          onComplete={complete}
        />
      ) : (
        <section className="story-picker">
          <h2>Samsung OOP Stories</h2>
          <p>
            Choose a story. Each keeps its original scenario, discoveries, code
            walkthrough and construction exercise.
          </p>
          <div className="story-picker-grid">
            {caseStudies.map((study) => (
              <button key={study.id} onClick={() => setSelected(study)}>
                <strong>{study.title}</strong>
                <span>{study.concept}</span>
                <small>
                  {completed.has(study.id)
                    ? "Story explored"
                    : "Explore this story →"}
                </small>
              </button>
            ))}
          </div>
        </section>
      )}
    </AuthoredStory>
  );
}
