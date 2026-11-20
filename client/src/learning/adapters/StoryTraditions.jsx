import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/python-fundamentals-story-traditions/src/App.tsx";
import css from "../../../../case-studies/python-fundamentals-story-traditions/src/index.css?tailwind";
const theme = `:host{position:relative;isolation:isolate;color:#382b21;background:#fffaf3;--bg-primary:#fffaf3;--bg-color:#fffaf3;--text-color:#382b21}#root,.min-h-screen{min-height:0}.font-sans{font-family:"Segoe UI",system-ui,sans-serif}.font-serif{font-family:Georgia,serif}.bg-parchment-light,.bg-parchment-card{background:#fffaf3}.bg-royal-crimson{background:#c45b19}.text-royal-crimson,.text-royal-gold,.text-royal-indigo{color:#8c451a}.bg-royal-indigo{background:#493126}.border-royal-gold,.border-parchment-border{border-color:#d4b298}.text-gray-500,.text-gray-400{color:#705a46}button{scroll-margin:140px}[data-tradition-item][aria-pressed="true"]{outline:3px solid #c45b19;outline-offset:3px}button.bg-royal-crimson{color:#fffdf9}.bg-royal-indigo .text-royal-gold{color:#ffcf9d}.bg-royal-indigo .text-gray-500{color:#e4cbb4}input,textarea,select{max-width:100%}.overflow-y-auto{overscroll-behavior:contain}@media(max-width:760px){.px-4{padding-left:10px;padding-right:10px}.p-8{padding:16px}.gap-8{gap:18px}.text-4xl{font-size:28px}}`;
export default function StoryTraditions({ onComplete }) {
  return (
    <AuthoredStory styles={[css]} theme={theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
