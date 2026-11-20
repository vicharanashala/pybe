import React from "react";
import AuthoredReading from "../AuthoredReading.jsx";
import markdown from "../../../../case-studies/string-processing-attendance-cleaner/string-manipulation-case-study/case-study.md?raw";
export default function AttendanceReading({ onComplete }) {
  return <AuthoredReading markdown={markdown} onComplete={onComplete} />;
}
