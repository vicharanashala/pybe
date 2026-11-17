import React, { useState } from "react";
import Landing from "./data/landing.jsx";
import HeaderNav from "./components/HeaderNav.jsx";
import ForestStage from "./components/ForestStage.jsx";

import StoryIntro from "./components/StoryIntro.jsx";
import QuickIntro from "./components/QuickIntro.jsx";
import StoryPlayer from "./components/StoryPlayer.jsx";
import Observation from "./components/Observation.jsx";
import QuestionBank from "./components/QuestionBank.jsx";
import PatternDiscovery from "./components/PatternDiscovery.jsx";
import ConceptReveal from "./components/ConceptReveal.jsx";
import PythonSyntax from "./components/PythonSyntax.jsx";
import GuidedPractice from "./components/GuidedPractice.jsx";
import CaseStudy from "./components/CaseStudy.jsx";
import CodePlayground from "./components/CodePlayground.jsx";
import Challenge from "./components/Challenge.jsx";
import ConstellationLeaderboard from "./components/ConstellationLeaderboard.jsx";
import VariablesFinalChallenge from "./components/VariablesFinalChallenge.jsx";
import SuccessScreen from "./components/SuccessScreen.jsx";

import lessonData from "./data/variables.json";

const STEP_COMPONENTS = {
  story_intro: StoryIntro,
  quick_intro: QuickIntro,
  story: StoryPlayer,
  observation: Observation,
  questions: QuestionBank,
  pattern_discovery: PatternDiscovery,
  concept_reveal: ConceptReveal,
  python_syntax: PythonSyntax,
  guided_practice: GuidedPractice,
  case_study: CaseStudy,
  playground: CodePlayground,
  challenge: Challenge,
  success_screen: SuccessScreen,
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1); // Default Chapter 1: Variable Concept
  const [activeConcept, setActiveConcept] = useState("variable");
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [pipStageIdx, setPipStageIdx] = useState(0);
  const [tiloStageIdx, setTiloStageIdx] = useState(0);
  const [orinStageIdx, setOrinStageIdx] = useState(0);
  const [picoStageIdx, setPicoStageIdx] = useState(0);
  const [xp, setXp] = useState(1500);
  const [coins, setCoins] = useState(120);

  const steps = lessonData.steps;
  const currentStep = steps[currentStepIdx] || steps[0];
  const StepComponent = STEP_COMPONENTS[currentStep.type] || StoryIntro;

  const handleAddXp = (amount) => {
    setXp((prev) => prev + amount);
    setCoins((prev) => prev + Math.floor(amount / 5));
  };

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveChapter(5);
      setActiveConcept("final_challenge");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGlobalNext = () => {
    if (activeChapter === 1) {
      handleNextStep();
    } else if (activeChapter === 5) {
      setActiveChapter(6);
      setActiveConcept("forest_leaderboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (activeChapter === 6) {
      setActiveChapter(1);
      setActiveConcept("variable");
      setCurrentStepIdx(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGlobalPrev = () => {
    if (activeChapter === 1) {
      handlePrevStep();
    } else if (activeChapter === 5) {
      setActiveChapter(1);
      setCurrentStepIdx(steps.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (activeChapter === 6) {
      setActiveChapter(5);
      setActiveConcept("final_challenge");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!started) {
    return <Landing onStart={() => setStarted(true)} />;
  }

  return (
    <div className="app-container">
      {/* Chapter & Concept Switcher Banner */}
      <div style={{
        background: "linear-gradient(180deg, #5C3A21 0%, #4A2E1A 100%)",
        borderBottom: "3.5px solid #E0A43A",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        zIndex: 100,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{
          fontSize: "13px",
          fontWeight: "800",
          color: "#E0A43A",
          marginRight: "8px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span>🗺️ Select Mission:</span>
        </div>

        {/* 1. Single Continuous Story: Poko's Variables Journey */}
        <button
          className={`btn ${activeChapter === 1 ? "btn-primary" : "btn-secondary"}`}
          style={{
            fontSize: "14px",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "800",
            cursor: "pointer",
            transition: "all 0.25s ease",
            background: activeChapter === 1 ? "linear-gradient(145deg, #E0A43A 0%, #B9772B 100%)" : "linear-gradient(145deg, #6B3E26 0%, #4A2E1A 100%)",
            color: activeChapter === 1 ? "#ffffff" : "#FFF5E8",
            boxShadow: activeChapter === 1 ? "0 0 22px rgba(224,164,58,0.7)" : "0 4px 12px rgba(0,0,0,0.3)",
            border: activeChapter === 1 ? "2.5px solid #FFF5E8" : "1.5px solid #B9772B",
            transform: activeChapter === 1 ? "scale(1.03)" : "none"
          }}
          onClick={() => { setActiveChapter(1); setActiveConcept("variable"); setCurrentStepIdx(0); }}
        >
          🐼 Poko's Continuous Variables Journey 🎋
        </button>

        {/* 2. Poko's Grand Synthesis (Master Challenge) */}
        <button
          className={`btn ${activeChapter === 5 ? "btn-primary" : "btn-secondary"}`}
          style={{
            fontSize: "14px",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "800",
            cursor: "pointer",
            transition: "all 0.25s ease",
            background: activeChapter === 5 ? "linear-gradient(145deg, #E0A43A 0%, #B9772B 100%)" : "linear-gradient(145deg, #6B3E26 0%, #4A2E1A 100%)",
            color: activeChapter === 5 ? "#ffffff" : "#FFF5E8",
            boxShadow: activeChapter === 5 ? "0 0 22px rgba(224,164,58,0.7)" : "0 4px 12px rgba(0,0,0,0.3)",
            border: activeChapter === 5 ? "2.5px solid #FFF5E8" : "1.5px solid #B9772B",
            transform: activeChapter === 5 ? "scale(1.03)" : "none"
          }}
          onClick={() => { setActiveChapter(5); setActiveConcept("final_challenge"); }}
        >
          💎 Poko's Grand Synthesis (Master Challenge 💎)
        </button>

        {/* 3. Constellation Leaderboard */}
        <button
          className={`btn ${activeChapter === 6 ? "btn-primary" : "btn-secondary"}`}
          style={{
            fontSize: "14px",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "800",
            cursor: "pointer",
            transition: "all 0.25s ease",
            background: activeChapter === 6 ? "linear-gradient(145deg, #708238 0%, #4E6023 100%)" : "linear-gradient(145deg, #6B3E26 0%, #4A2E1A 100%)",
            color: activeChapter === 6 ? "#ffffff" : "#FFF5E8",
            boxShadow: activeChapter === 6 ? "0 0 22px rgba(112,130,56,0.8)" : "0 4px 12px rgba(0,0,0,0.3)",
            border: activeChapter === 6 ? "2.5px solid #A5D6A7" : "1.5px solid #B9772B",
            transform: activeChapter === 6 ? "scale(1.03)" : "none"
          }}
          onClick={() => { setActiveChapter(6); setActiveConcept("forest_leaderboard"); }}
        >
          🌌 Constellation Leaderboard
        </button>
      </div>

      {/* Universal Forest Journey Map HeaderNav */}
      <HeaderNav
        activeChapter={activeChapter === 1 ? 1 : (activeChapter === 5 ? 2 : 3)}
        currentStep={activeChapter === 1 ? currentStepIdx : 0}
        totalSteps={activeChapter === 1 ? steps.length : 1}
        stepTitle={
          activeChapter === 5
            ? "💎 Poko's Grand Synthesis (Master Challenge)"
            : activeChapter === 6
            ? "🌌 Constellation Leaderboard"
            : `🐼 Poko's Variables Story • ${currentStep.title}`
        }
        xp={xp}
        coins={coins}
        onPrev={handleGlobalPrev}
        onNext={handleGlobalNext}
        onSelectStep={(idx) => {
          if (activeChapter === 1) {
            setCurrentStepIdx(idx);
          }
        }}
        canPrev={activeChapter === 1 ? currentStepIdx > 0 : true}
        canNext={true}
      />

      <main className="main-content">
        <ForestStage stepType={activeChapter === 1 ? currentStep.type : "observation"}>
          <div className="step-content-area">
            {activeChapter === 1 ? (
              <StepComponent
                data={currentStep}
                onNext={handleNextStep}
                onAddXp={handleAddXp}
                xp={xp}
                coins={coins}
                onRestart={() => setCurrentStepIdx(0)}
              />
            ) : activeChapter === 5 ? (
              <VariablesFinalChallenge
                onAddXp={handleAddXp}
                onOpenLeaderboard={() => {
                  setActiveChapter(6);
                  setActiveConcept("forest_leaderboard");
                }}
              />
            ) : (
              <ConstellationLeaderboard
                xp={xp}
                coins={coins}
                accuracy={96}
                streak={7}
                onBackToChallenge={() => {
                  setActiveChapter(5);
                  setActiveConcept("final_challenge");
                }}
              />
            )}
          </div>
        </ForestStage>
      </main>
    </div>
  );
}