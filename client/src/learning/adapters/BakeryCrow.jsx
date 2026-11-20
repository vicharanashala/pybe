import React from "react";
import { workbenchTheme } from "../workbench-theme.mjs";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/loops-royal-bakery-and-thirsty-crow/client/src/BakeryCrow.jsx";
import styles from "../../../../case-studies/debugging-find-and-squash-the-bug/client/src/styles.css";
const theme = `:host{position:relative;isolation:isolate;color:#382b21;background:#fffaf3}.bakery-crow-hub{padding:28px}.bakery-crow-hub h1{font-size:32px;color:#78421e}.bakery-story-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:24px 0}.bakery-story-options button{padding:24px;text-align:left;background:#fffdf9;color:#382b21;border:1px solid #d4b298;border-radius:18px;cursor:pointer}.bakery-story-options span{font-size:40px}button{scroll-margin:140px}.skeleton-chart{max-width:100%;padding:8px!important}.skeleton-chart>div{max-width:100%;box-shadow:none!important}.skeleton-chart [style*="transform: scale"]{min-width:900px}.skeleton-chart pre{white-space:pre-wrap}.skeleton-chart>div>div:last-child{overflow:auto}@media(max-width:900px){.bakery-story-options{grid-template-columns:minmax(0,1fr)}.bakery-crow-hub{padding:16px}.skeleton-chart>div>div:first-child{flex-wrap:wrap;gap:14px;padding:16px!important}.skeleton-chart h2{font-size:20px!important}.skeleton-chart>div>div:last-child{padding:12px!important}.app-shell{grid-template-columns:minmax(0,1fr)}.sidebar{max-height:420px}.workspace{padding:12px}.main-grid,.dashboard{grid-template-columns:minmax(0,1fr)}}`;
export default function BakeryCrow({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={workbenchTheme + theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
