import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/functions-and-scope-hawkins-division/src/App.tsx";
import styles from "../../../../case-studies/functions-and-scope-hawkins-division/src/index.css?tailwind";
const theme = `:host{color-scheme:light;position:relative;isolation:isolate;overflow-x:clip}#root{height:auto;background:#fffaf3;color:#382b21}.min-h-screen{min-height:0}[class*="bg-void"],[class*="bg-[#050505]"],[class*="bg-white/"]{background:#fffaf3}[class*="text-white"]{color:#382b21}[class*="border-white"]{border-color:#e7cfb5}[class*="text-volt"],[class*="text-rift"],[class*="text-blood"]{color:#a44712}.bg-blood{background:#c45b19;color:white}.shadow-blood,.shadow-volt,.shadow-rift{box-shadow:none}[class*="text-glow"]{text-shadow:none}.sticky{position:relative;top:auto}.crt-overlay{position:absolute;opacity:.08}.fixed.pointer-events-none{position:absolute}.font-display{font-family:Georgia,serif}.text-6xl{font-size:46px}button{scroll-margin:130px}.text-white\\/30,.text-white\\/40{color:#7a6551}.min-h-\\[100svh\\]{min-height:600px}@media(max-width:600px){.text-6xl{font-size:32px}.tracking-widest{letter-spacing:.08em}.text-4xl{font-size:30px}.pt-10{padding-top:24px}.min-h-screen{min-height:0}pre{max-width:100%;overflow:auto}}`;
export default function HawkinsDivision({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
