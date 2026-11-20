import React from "react";
import { workbenchTheme } from "../workbench-theme.mjs";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/debugging-find-and-squash-the-bug/client/src/FindSquashBug.jsx";
import styles from "../../../../case-studies/debugging-find-and-squash-the-bug/client/src/styles.css";

export default function FindSquashBug({ onComplete }) {
  return (
    <AuthoredStory styles={[styles]} theme={workbenchTheme}>
      <Story onComplete={onComplete} />
    </AuthoredStory>
  );
}
