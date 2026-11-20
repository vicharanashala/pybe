import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/data-structures-lost-kingdom/client/src/LostForestStory.jsx";
import styles from "../../../../case-studies/data-structures-lost-kingdom/client/src/styles.css";
const theme = `:host{--bg-deep:#fcf8f2;--bg-card:#fffdf9;--bg-card-2:#fff5eb;--bg-input:#fffdf9;--bg-hover:#fff0e2;--border:#eadbce;--border-hover:#d2b69c;--text-primary:#30271f;--text-secondary:#5c4b3d;--text-muted:#766352;--text-faint:#89725e;--green:#df622f;--green-dim:#fff0e2;--green-glow:#f2d5bb;--gold:#b24e25;--success:#28714b;--error:#b83c31;--font-heading:Georgia,serif;--font-body:"Segoe UI",system-ui,sans-serif;--shadow-card:none}.top-nav{position:relative;top:auto;background:#fffdf9}.btn-primary{background:#df622f!important;border-color:#df622f!important;color:white!important}.btn-gold{background:#df622f;color:white}.hero-title{color:#30271f}.hero-title span{color:#b24e25}[style*="--chapter-color"]{--chapter-color:#df622f!important;--chapter-color-dim:#fff0e2!important;--chapter-color-glow:#f2d5bb!important}.code-editor{background:#20232c;color:#f1f0ed}.code-execution pre{background:#20232c;color:#f1f0ed;padding:16px;border-radius:10px;white-space:pre-wrap}.scene-story-card,.activity-card{box-shadow:none}.story-explored{color:#28714b}.story-completion{margin:32px auto}`;
export default function LostForestStory({ onComplete }) {
  return (
    <AuthoredStory
      styles={[styles]}
      theme={theme}
      completionHeading="The Backpack Journey Is Complete"
      onComplete={onComplete}
    >
      <Story />
    </AuthoredStory>
  );
}
