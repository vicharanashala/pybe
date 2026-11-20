import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Cricket from "../../../../case-studies/loops-cricket-chase-and-loop-control/pybe-iteration-feature/client/src/App.jsx";
import Controls from "../../../../case-studies/loops-cricket-chase-and-loop-control/pybe-loopcontrols-standalone/client/src/App.jsx";
import cricketStyles from "../../../../case-studies/loops-cricket-chase-and-loop-control/pybe-iteration-feature/client/src/index.css?tailwind";
import controlStyles from "../../../../case-studies/loops-cricket-chase-and-loop-control/pybe-loopcontrols-standalone/client/src/index.css?tailwind";
import warm from "../../../../shared/story-tailwind.css";
const theme = `[class*="bg-[#0b1120]"]{background:#fcf8f2}.min-h-screen{min-height:0}.fixed{position:relative}.sticky{position:relative;top:auto}.pt-24{padding-top:24px}.bg-radial-gradient{background:#fcf8f2}.glassmorphism{background:#fffdf9;border-color:#eadbce;box-shadow:none}.text-transparent{color:#b24e25;background:none;background-clip:initial}.bg-gradient-to-r{background:#df622f;color:white}.bg-emerald-600,.bg-yellow-600{background:#df622f;color:white}button[class*="bg-emerald-"],button[class*="bg-blue-"]{color:white}button[class*="bg-slate-"]{color:#30271f}input{background:#fffdf9;color:#30271f;border-color:#bda18a}nav{position:relative!important}.min-h-\\[calc\\(100vh-80px\\)\\]{min-height:480px}@media(min-width:1024px){.lg\\:p-16{padding:30px}}`;
export function CricketChase({ onComplete }) {
  return (
    <AuthoredStory styles={[cricketStyles, warm]} theme={theme}>
      <Cricket onComplete={onComplete} />
    </AuthoredStory>
  );
}
export function LoopControlDiscovery({ onComplete }) {
  return (
    <AuthoredStory styles={[controlStyles, warm]} theme={theme}>
      <Controls onComplete={onComplete} />
    </AuthoredStory>
  );
}
