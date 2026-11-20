import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import App from "../../../../case-studies/loops-iteration-learning-journey/pybe-iteration-feature/client/src/App.jsx";
import styles from "../../../../case-studies/loops-iteration-learning-journey/pybe-iteration-feature/client/src/index.css?tailwind";
import warm from "../../../../shared/story-tailwind.css";
const theme = `:host{--font-sans:"Segoe UI",system-ui,sans-serif}.min-h-screen{min-height:0}.iteration-stage{height:max(480px,calc(100dvh - 240px));width:100%;border:1px solid #eadbce;border-radius:16px}.iteration-visual{width:40%;height:100%;padding:24px}.iteration-content{width:60%;height:100%;padding:24px}.iteration-visual img{max-height:100%;width:100%}@media(max-width:750px){.iteration-stage{display:flex;flex-direction:column;height:auto;overflow:visible}.iteration-visual{width:100%;height:auto;max-height:280px}.iteration-visual img{max-height:220px}.iteration-content{width:100%;height:auto;min-height:540px}.iteration-content .overflow-y-auto{overflow:visible}}`;
export default function IterationJourney({ onComplete }) {
  return (
    <AuthoredStory
      styles={[styles, warm]}
      theme={theme}
      publicAssetsRoot="/submissions/loops-iteration-learning-journey/pybe-iteration-feature/client/public"
    >
      <App onComplete={onComplete} />
    </AuthoredStory>
  );
}
