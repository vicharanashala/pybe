import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/loops-raidurg-adventure/src/App.jsx";
import styles from "../../../../case-studies/loops-raidurg-adventure/src/index.css?tailwind";
import warm from "../../../../shared/story-tailwind.css";
const theme = `[class*="bg-[#121110]"],[class*="bg-[#171513]"]{background:#fffaf3;color:#382b21}[class*="text-[#f5f2eb]"]{color:#382b21}.min-h-screen{min-height:0}.bg-gradient-to-r,.bg-gradient-to-tr{background:#df622f;color:white}.bg-gradient-to-br{background:#fff1df;color:#382b21}.text-black{color:#382b21}button[class*="bg-gradient"]{color:white}button{scroll-margin:130px}nav{position:relative!important;top:auto!important}.sticky{position:relative;top:auto}.fixed{position:relative}.shadow-2xl{box-shadow:0 8px 24px #59371514}.text-amber-200,.text-amber-300,.text-amber-400{color:#9a4211}.bg-black\\/70{background:#fffaf3ed}.bg-black\\/70 .text-amber-400{color:#9a4211}textarea{background:#fffdf9;color:#382b21;min-height:230px}@media(max-width:600px){.p-8{padding:16px}.grid-cols-5{grid-template-columns:repeat(3,minmax(0,1fr))}.gap-4{gap:8px}.flex{min-width:0}.font-mono{overflow-wrap:anywhere}}`;
export default function RaidurgAdventure({ onComplete }) {
  return (
    <AuthoredStory styles={[styles, warm]} theme={theme}>
      <Story
        onComplete={onComplete}
        assetBase="/submissions/loops-raidurg-adventure/public"
      />
    </AuthoredStory>
  );
}
