import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/classes-eternal-mold/client/src/App.jsx";
import styles from "../../../../case-studies/classes-eternal-mold/client/src/index.css?tailwind";
import warm from "../../../../shared/story-tailwind.css";
const theme = `:host{position:relative;isolation:isolate;color-scheme:light}.eternal-shell .w-screen{width:100%}.eternal-shell{width:100%;height:950px;max-height:none}.eternal-shell [class*="font-"]{font-family:"Segoe UI",system-ui,sans-serif}.eternal-shell [class*="font-mono"],.eternal-shell code{font-family:Consolas,monospace}.eternal-shell [class*="bg-white/"],.eternal-shell [class*="bg-black/"],.eternal-shell [class*="backdrop-blur"],.eternal-shell [class*="bg-[#4A3728]"],.eternal-shell [class*="bg-[#1c140d]"]{background:#fffaf3ed;border-color:#d9bda5}.eternal-shell [class*="text-amber-"],.eternal-shell [class*="text-orange-"],.eternal-shell [class*="text-cyan-"],.eternal-shell [class*="text-sky-"]{color:#9a4518}.eternal-shell button[class*="bg-gradient-"]{background:#c45b19;color:#fffdf9;border-color:#c45b19;box-shadow:none}.eternal-shell button[class*="bg-gradient-"] span{color:inherit}.eternal-shell input,.eternal-shell select{background:#fff7ec!important;color:#382b21!important;border-color:#c79b7a!important}.eternal-shell button{scroll-margin:140px}.eternal-shell>div:first-child{max-height:100%}.eternal-shell [class*="h-[82vh]"]{height:800px;max-height:800px}.eternal-shell [class*="h-[68%]"]{min-height:400px}@media(max-width:1023px){.eternal-shell{height:auto;min-height:1000px;overflow:visible}.eternal-shell main{height:auto;padding:14px;gap:18px}.eternal-shell main>section{height:auto;min-height:580px;padding-top:0}.eternal-shell main>section:first-of-type{min-height:450px}.eternal-shell main>header{position:relative;inset:auto;flex-wrap:wrap}.eternal-shell [class*="h-[82vh]"]{height:850px;max-height:none}.eternal-shell [class*="h-[25vh]"]{height:auto;min-height:230px}.eternal-shell [class*="h-[15vh]"]{min-height:100px}.eternal-shell [class*="h-screen"]{height:auto;min-height:1000px}.eternal-shell [class*="text-5xl"]{font-size:32px}.eternal-shell form{max-height:none}}`;
export default function EternalMold({ onComplete }) {
  return (
    <AuthoredStory styles={[styles, warm]} theme={theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
