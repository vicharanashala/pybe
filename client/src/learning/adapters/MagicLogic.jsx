import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/conditionals-magic-of-logic/client/src/App.tsx";
import styles from "../../../../case-studies/conditionals-magic-of-logic/client/src/index.css?tailwind";
const theme = `.h-screen{height:auto;min-height:650px}.h-full{height:auto}.overflow-hidden{overflow:visible}.overflow-y-auto{overflow:visible}.bg-amber-600,.bg-amber-700,.bg-red-700,.bg-emerald-600{background:#c45b19;color:white}.bg-amber-500{background:#df622f}.shadow-md{box-shadow:0 4px 12px #59371512}button{scroll-margin:130px}main{min-width:0}.w-72{width:230px}.absolute.top-6.right-8{position:relative;inset:auto;justify-content:flex-end;padding:12px}@media(max-width:760px){.h-screen{display:block;min-height:0}.w-72{width:100%;border-right:0;border-bottom:1px solid #eadbce}.w-72>div{padding:12px}.w-72 h1{font-size:22px}.p-8,.px-8{padding:16px}.text-3xl{font-size:26px}.text-5xl{font-size:32px}.text-xl{font-size:18px}.gap-10{gap:20px}.grid-cols-2{grid-template-columns:minmax(0,1fr)}canvas{max-width:100%;touch-action:none}.max-w-sm{max-width:100%}}`;
export default function MagicLogic({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
