import React from "react";
import AuthoredStory from "../AuthoredStory.jsx";
import Story from "../../../../case-studies/multithreading-restaurant-orders/src/RestaurantStory.jsx";
import styles from "../../../../case-studies/multithreading-restaurant-orders/src/src/styles.css";
import theme from '../themes/chapter-story.css';
export default function RestaurantStory({ onComplete }) {
  return (
    <AuthoredStory
      styles={[styles]}
      theme={theme}
      completionHeading="You can now see multithreading."
      onComplete={onComplete}
    >
      <Story />
    </AuthoredStory>
  );
}
