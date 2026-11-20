import React from "react";
import { workbenchTheme } from "../workbench-theme.mjs";
import AuthoredRouterStory from "../AuthoredRouterStory.jsx";
import Story from "../../../../case-studies/python-fundamentals-arcade-and-case-study-engine/client/src/ArcadeStory.jsx";
import css from "../../../../case-studies/python-fundamentals-arcade-and-case-study-engine/client/src/styles.css";
const theme = `:host{position:relative;isolation:isolate;color:#382b21;background:#fffaf3}.arcade-nav{display:flex;flex-wrap:wrap;gap:8px;padding:16px;background:#fff1e1}.arcade-nav a{padding:10px 14px;border-radius:10px;color:#78421e;text-decoration:none;border:1px solid #d4b298}.arcade-nav a.active{background:#c45b19;color:#fffdf9}.arcade-story textarea{color:#382b21!important;background:#fff7ec!important;min-width:0}.arcade-story button{scroll-margin:140px}.arcade-story button:not(:disabled){color:#78421e!important;background:#fff0df!important;border-color:#d4b298!important;box-shadow:none!important}.arcade-story strong{color:#8c451a!important;text-shadow:none!important}.arcade-feedback{background:#fff7ec!important;border-color:#d4b298!important}.arcade-feedback,.arcade-feedback *{color:#382b21!important;text-shadow:none!important}.arcade-story h1,.arcade-story h2,.arcade-story h3{color:#78421e!important;text-shadow:none!important}.arcade-story input,.arcade-story select{background:#fff7ec;color:#382b21}@media(max-width:900px){.arcade-story [style*="minmax(360px"]{grid-template-columns:minmax(0,1fr)!important}.arcade-story [style*="grid-template-columns: 1fr 1fr"],.arcade-story [style*="grid-template-columns: 1.1fr 1fr"]{grid-template-columns:minmax(0,1fr)!important}.arcade-story [style*="min-width: 400px"]{min-width:0!important}.app-shell,.main-grid,.dashboard{grid-template-columns:minmax(0,1fr)}.sidebar{max-height:400px}.workspace{padding:12px}}`;
export default function PythonArcade({ onComplete }) {
  return (
    <AuthoredRouterStory styles={[css]} theme={workbenchTheme + theme}>
      <Story onComplete={onComplete} />
    </AuthoredRouterStory>
  );
}
