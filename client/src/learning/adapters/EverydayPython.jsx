import React, { useRef } from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import App from "../../../../case-studies/data-structures-everyday-python/src/App.jsx";
import content from "../../../../case-studies/data-structures-everyday-python/src/data.json";
import styles from "../../../../case-studies/data-structures-everyday-python/src/index.css";

const studies = content.map((study) => ({
  ...study,
  steps: Object.fromEntries(
    Object.entries(study.steps).map(([id, step]) => [
      id,
      {
        ...step,
        ...(step.image
          ? {
              image:
                "/submissions/data-structures-everyday-python/public" +
                step.image,
            }
          : {}),
      },
    ]),
  ),
}));
const theme = `:host{--bg-color:#fcf8f2;--text-primary:#30271f;--text-secondary:#766352;--primary-accent:#df622f;--secondary-accent:#f2b789;--surface-color:#fffdf9;--success-color:#28714b;--warning-color:#fff0de}.app-header{display:none}.app-container{padding:24px}.case-card,.card{border:1px solid #eadbce;box-shadow:none}.option-btn{border-color:#eadbce}.option-btn:hover,.start-btn{background:#df622f;color:white}.nav-btn{color:#a84420}.python-snippet{white-space:pre-wrap}`;
export default function EverydayPython({ onComplete }) {
  const completed = useRef(new Set());
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      <App
        studies={studies}
        onComplete={(id) => {
          completed.current.add(id);
          if (completed.current.size === studies.length) onComplete?.();
        }}
      />
    </AuthoredStory>
  );
}
