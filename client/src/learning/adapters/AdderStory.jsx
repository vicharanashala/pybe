import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import { AdderLesson } from "../../../../case-studies/functions-adder/Adder/client/src/lessons/AdderLesson.jsx";
import styles from "../../../../case-studies/functions-adder/Adder/client/src/styles.css";
const theme = `:host{--lesson-cream:#fcf8f2;--lesson-cream-deep:#fff0e2;--lesson-white:#fffdf9;--lesson-green:#df622f;--lesson-green-deep:#a84420;--lesson-green-soft:#fff0e2;--lesson-brown:#30271f;--lesson-brown-muted:#766352;--lesson-border:#eadbce;--lesson-font-body:"Segoe UI",system-ui,sans-serif}.lesson-screen{min-height:0}.lesson-primary-button{background:#df622f;border-color:#df622f;color:white}`;
export default function AdderStory({ onComplete }) {
  return (
    <AuthoredStory
      styles={[styles]}
      theme={theme}
      publicAssetsRoot="/submissions/functions-adder/Adder/client/public"
      completionHeading="Nice work!"
      onComplete={onComplete}
    >
      <AdderLesson />
    </AuthoredStory>
  );
}
