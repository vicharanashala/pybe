import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";

import Home from "./pages/Home";
import Intro from "./pages/Intro";
import QuestOne from "./pages/QuestOne";
import LessonOne from "./pages/LessonOne";
import QuestTwo from "./pages/QuestTwo";
import OracleReveal from "./pages/OracleReveal";
import PythonLesson from "./pages/PythonLesson";
import Activity from "./pages/Activity";
import Ending from "./pages/Ending";
import OracleScroll from "./pages/OracleScroll";
function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/quest1" element={<QuestOne />} />
        <Route path="/lesson1" element={<LessonOne />} />
        <Route path="/quest2" element={<QuestTwo />} />
        <Route path="/oracle" element={<OracleReveal />} />
        <Route path="/lesson" element={<PythonLesson />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/scroll" element={<OracleScroll />} />
        <Route path="/ending" element={<Ending />} />
      </Routes>
    </>
  );
}

export default App;