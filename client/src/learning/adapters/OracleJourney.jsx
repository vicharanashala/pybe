import React from "react";
import AuthoredRouterStory from "../AuthoredRouterStory.jsx";
import Story from "../../../../case-studies/exceptions-oracle-journey/percy-oracle/src/App.jsx";
import home from "../../../../case-studies/exceptions-oracle-journey/percy-oracle/src/styles/home.css";
import intro from "../../../../case-studies/exceptions-oracle-journey/percy-oracle/src/styles/intro.css";
import quest from "../../../../case-studies/exceptions-oracle-journey/percy-oracle/src/styles/quest.css";
import oracle from "../../../../case-studies/exceptions-oracle-journey/percy-oracle/src/styles/oracle.css";
import lesson from "../../../../case-studies/exceptions-oracle-journey/percy-oracle/src/styles/lesson.css";
const theme = `.home,.intro,.quest,.oracle-page,.lesson-page{background:#fffaf3;color:#382b21;min-height:0}.home{height:auto;min-height:620px}.home-text h1,.home-text p{color:#382b21}.home-text{left:6%;width:45%}.quest-card,.oracle-card,.lesson-card,.intro-card{background:#fffdf9;border-color:#e7cfb5;box-shadow:0 8px 24px #59371514}.highlight,.oracle-hint,.lesson-box,.artifact-card{background:#fff1df;color:#5c3e27}.home-text h1,.lesson-card h1,.quest-card h1,.oracle-card h1{color:#9a4211}button{background:#c45b19;color:white;border-color:#c45b19;scroll-margin-top:130px}.option,.choice{background:#fff4e6;color:#703c1b;border-color:#e5c6aa}.book-frame{border-color:#df622f;background:#fff4e6}.book{outline-offset:-4px}.home .temple{opacity:.13}pre,.code{overflow:auto}.lesson-card,.quest-card,.oracle-card{min-width:0}*{box-sizing:border-box}@media(max-width:760px){.home{display:flex;flex-direction:column;min-height:0;padding:24px 16px;gap:24px}.home-text{position:relative;left:auto;top:auto;transform:none;width:100%;order:0}.home-text h1{font-size:34px}.book-frame{position:relative;right:auto;top:auto;transform:none;max-width:100%;width:360px;order:1}.intro,.quest,.oracle-page,.lesson-page{padding:16px}.intro-card,.quest-card,.oracle-card,.lesson-card{width:100%;max-width:100%;padding:22px 16px;border-width:1px}.lesson-card h1,.oracle-card h1,.quest-card h1{font-size:30px}.temple{max-width:180%;}.scroll{max-width:100%;overflow:auto}}`;
export default function OracleJourney({ onComplete }) {
  const styles = [home, intro, quest, oracle, lesson];
  return (
    <AuthoredRouterStory
      styles={styles}
      theme={theme}
      completionPath="/ending"
      onComplete={onComplete}
    >
      <Story />
    </AuthoredRouterStory>
  );
}
