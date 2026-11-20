import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/functions-and-closures-tiffin-trail/tiffin trail-case study/src/TiffinTrail.jsx";
import styles from "../../../../case-studies/functions-and-closures-tiffin-trail/tiffin trail-case study/src/index.css?tailwind";
const theme = `.min-h-screen{min-height:0}button{scroll-margin:120px}pre{color:#f1f0ed}.tt-terminal{color:#f1f0ed}`;
export default function TiffinTrail({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={theme}>
      <Story
        onComplete={onComplete}
        assetBase="/submissions/functions-and-closures-tiffin-trail/tiffin%20trail-case%20study/public"
      />
    </AuthoredStory>
  );
}
