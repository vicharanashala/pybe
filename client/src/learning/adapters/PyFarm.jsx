import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/variables-and-conditionals-pyfarm/src/PyFarm.jsx";
import styles from "../../../../case-studies/variables-and-conditionals-pyfarm/src/pyfarm.css";
const theme = `.pf-root{--pf-ink:#332a23;--pf-ink-soft:#6b5a4c;--pf-surface:#fffaf3;--pf-panel-warm:#fff5e9;--pf-leaf:#c45b19;--pf-leaf-deep:#9a4211;--pf-leaf-wash:#fff0df;--pf-line:#eadbc9;--pf-code-bg:#29241f;min-height:0}.pf-root *{box-sizing:border-box}.pf-header{position:relative;top:auto}.pf-main{min-width:0}button{scroll-margin:120px}`;
export default function PyFarm({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
