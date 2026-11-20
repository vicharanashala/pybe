import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import App from "../../../../case-studies/scope-campus-fest/src/App.jsx";
import styles from "../../../../case-studies/scope-campus-fest/src/scope.css";
import theme from "../themes/campus.css";

export default function CampusFest({ onComplete }) {
  return (
    <AuthoredStory
      styles={[styles]}
      theme={theme}
      completionHeading="Investigation Complete"
      onComplete={onComplete}
    >
      <App />
    </AuthoredStory>
  );
}
