import { Routes, Route } from "react-router-dom";
import AppLayout from "./shared-components/layout/AppLayout";
import WelcomeScreen from "./learning/welcome/WelcomeScreen";
import ConceptScreen from "./learning/intro/ConceptScreen";
import ErrorVsException from "./learning/foundations/ErrorVsException";
import PathMap from "./shared-components/layout/PathMap";
import LessonPage from "./learning/lessons/LessonPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/intro" element={<ConceptScreen />} />
        <Route path="/foundations" element={<ErrorVsException />} />
        <Route path="/path" element={<PathMap />} />
        <Route path="/lessons/:slug" element={<LessonPage />} />
      </Route>
    </Routes>
  );
}