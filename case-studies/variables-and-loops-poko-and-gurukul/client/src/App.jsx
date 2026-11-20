import React, { useState, useRef } from "react";
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

export default function App({onComplete}){
 const [started,setStarted]=useState(false),[section,setSection]=useState('story'),[currentStepIdx,setCurrentStepIdx]=useState(0);const content=useRef(null);
 const steps=lessonData.steps,currentStep=steps[currentStepIdx],StepComponent=STEP_COMPONENTS[currentStep.type]||StoryIntro;
 const scroll=()=>content.current?.scrollIntoView({block:'start',behavior:'smooth'});
 const next=()=>{if(section==='story'){if(currentStepIdx<steps.length-1)setCurrentStepIdx(i=>i+1);else setSection('challenge');}else if(section==='challenge')setSection('summary');else{setSection('story');setCurrentStepIdx(0);}scroll();};
 const previous=()=>{if(section==='story')setCurrentStepIdx(i=>Math.max(0,i-1));else if(section==='challenge'){setSection('story');setCurrentStepIdx(steps.length-1);}else setSection('challenge');scroll();};
 if(!started)return <Landing onStart={()=>setStarted(true)}/>;
 return <div className="app-container" data-poko-section={section} data-poko-step={currentStepIdx+1}>
  <nav className="poko-sections" aria-label="Poko story sections"><button className="btn btn-secondary" onClick={()=>{setSection('story');scroll();}}>🐼 Poko's Continuous Variables Journey 🎋</button><button className="btn btn-secondary" onClick={()=>{setSection('challenge');scroll();}}>Poko's Grand Synthesis</button></nav>
  <HeaderNav currentStep={currentStepIdx} steps={steps} stepTitle={section==='story'?currentStep.title:section==='challenge'?"Poko's Grand Synthesis":"Poko's journey review"} onPrev={previous} onNext={next} onSelectStep={index=>{setSection('story');setCurrentStepIdx(index);}} canPrev={section!=='story'||currentStepIdx>0}/>
  <main className="main-content" ref={content}><ForestStage stepType={section==='story'?currentStep.type:'observation'}><div className="step-content-area">
   {section==='story'?<StepComponent key={currentStep.id} data={currentStep} onNext={next} onRestart={()=>setCurrentStepIdx(0)}/>:section==='challenge'?<VariablesFinalChallenge onComplete={()=>{onComplete?.();setSection('summary');}}/>:<section className="paper-scroll-panel"><h2>Poko's journey complete</h2><p>You have explored Poko's organizer and completed the concept and coding challenges. Revisit any part to keep practising.</p><button className="btn btn-secondary" onClick={()=>setSection('challenge')}>Back to the challenges</button><button className="btn btn-primary" onClick={()=>{setSection('story');setCurrentStepIdx(0);}}>Replay the story</button></section>}
  </div></ForestStage></main>
 </div>;
}
