import React,{useState,useEffect,useRef} from 'react';
import {motion} from 'framer-motion';
import challengeData from '../data/variablesFinalChallenge.json';
import {createStoryPythonHook} from '../../../../../shared/story-python.mjs';
import {createStoryTimersHook} from '../../../../../shared/story-timers.mjs';
import './VariablesFinalChallenge.css';
const useStoryPython=createStoryPythonHook(React),useStoryTimers=createStoryTimersHook(React);
const shuffle=items=>[...items].sort(()=>Math.random()-0.5);
export default function VariablesFinalChallenge({onComplete}){
 const [activeLevel,setActiveLevel]=useState(1),[questions,setQuestions]=useState(()=>shuffle(challengeData.conceptQuestions).map(q=>({...q,shuffledOptions:shuffle(q.options)}))),[currentIdx,setCurrentIdx]=useState(0),[selectedOpt,setSelectedOpt]=useState(null),[isChecked,setIsChecked]=useState(false),[levelCompleted,setLevelCompleted]=useState(false);
 const [codingIdx,setCodingIdx]=useState(0),[userCode,setUserCode]=useState(challengeData.codingChallenges[0].initialCode),[consoleOutput,setConsoleOutput]=useState(''),[codingFeedback,setCodingFeedback]=useState(null),[level2Completed,setLevel2Completed]=useState(false),[advancing,setAdvancing]=useState(false);
 const {run,running}=useStoryPython(),{setTimeout}=useStoryTimers(),lastRun=useRef(null);
 const currentQ=questions[currentIdx],codingChallenges=challengeData.codingChallenges,currentCoding=codingChallenges[codingIdx];
 useEffect(()=>{setUserCode(currentCoding.initialCode);setConsoleOutput('');setCodingFeedback(null);lastRun.current=null;},[codingIdx]);
 const nextQuestion=()=>{setSelectedOpt(null);setIsChecked(false);if(currentIdx+1<questions.length)setCurrentIdx(i=>i+1);else setLevelCompleted(true);};
 const editCode=value=>{setUserCode(value);lastRun.current=null;setCodingFeedback(null);};
 async function evaluate(){
  if(lastRun.current?.code===userCode)return lastRun.current;
  const result=await run(userCode);const output=result.error||result.output;const passed=!result.error&&result.output.trim()===String(currentCoding.expectedOutput).trim();
  const evaluation={code:userCode,passed,output};lastRun.current=evaluation;setConsoleOutput(output||'(No printed output)');setCodingFeedback({type:passed?'success':'error',message:passed?'Output matches the expected result.':result.error?'Python could not finish this program. Review the error and try again.':`Output does not match the expected result (${currentCoding.expectedOutput}). Try again.`});return evaluation;
 }
 async function submit(){if(running||advancing)return;const result=await evaluate();if(!result.passed)return;setAdvancing(true);setTimeout(()=>{setAdvancing(false);if(codingIdx+1<codingChallenges.length)setCodingIdx(i=>i+1);else setLevel2Completed(true);},1000);}
 const resetConcepts=()=>{setQuestions(shuffle(challengeData.conceptQuestions).map(q=>({...q,shuffledOptions:shuffle(q.options)})));setCurrentIdx(0);setSelectedOpt(null);setIsChecked(false);setLevelCompleted(false);};
 return <div className="variables-master-container">
  <header className="level1-header-card"><div className="level1-title-group"><span className="level1-brain-icon">{activeLevel===1?'🧠':'💻'}</span><div><h1 className="level1-main-title">{activeLevel===1?'Variables Concept Challenge':'Variables Coding Lab'}</h1><p className="level1-subtitle">{activeLevel===1?'You’ve learned the concepts. Now put them into practice.':'Write code to help Poko solve each story problem.'}</p></div></div><nav aria-label="Challenge levels"><button className="nav-prev-btn" disabled={running||advancing} onClick={()=>setActiveLevel(1)}>Level 1: Concepts {levelCompleted&&'✓'}</button><button className="nav-prev-btn" disabled={running||advancing} onClick={()=>setActiveLevel(2)}>Level 2: Coding {level2Completed&&'✓'}</button></nav></header>
  {activeLevel===1&&!levelCompleted&&<motion.section className="assessment-card" key={currentQ.id} initial={{opacity:0}} animate={{opacity:1}} data-poko-question={currentQ.id}>
   <label>Jump to Q <select aria-label="Jump to concept question" value={currentIdx} onChange={e=>{setCurrentIdx(Number(e.target.value));setSelectedOpt(null);setIsChecked(false);}}>{questions.map((q,i)=><option key={q.id} value={i}>Q{i+1} ({q.category})</option>)}</select></label>
   <p>Question {currentIdx+1} of {questions.length}</p><div className="question-tags"><span className="tag-badge">Theme: {currentQ.category}</span><span className="tag-badge">Concept: {currentQ.concept}</span></div><h2 className="question-prompt-text">{currentQ.question}</h2>
   <div className="options-grid">{currentQ.shuffledOptions.map(option=><button key={option} className={`answer-option ${selectedOpt===option?'selected':''}`} disabled={isChecked} onClick={()=>setSelectedOpt(option)}>{option}</button>)}</div>
   {isChecked&&<p className={`feedback-banner ${selectedOpt===currentQ.answer?'success':'error'}`}>{selectedOpt===currentQ.answer?'Correct.':'Not quite right.'} {currentQ.explanation}</p>}
   <footer>{!isChecked?<button className="magical-action-btn" disabled={!selectedOpt} onClick={()=>setIsChecked(true)}>Check Answer</button>:<button className="magical-action-btn" onClick={nextQuestion}>{currentIdx===questions.length-1?'Finish Level 1 →':'Next Question →'}</button>}</footer>
  </motion.section>}
  {activeLevel===1&&levelCompleted&&<section className="assessment-card"><h2>Concept review complete</h2><p>You have reviewed Poko’s variables, integers, floats, strings and booleans. Try the questions again or move into the Coding Lab.</p><button className="nav-prev-btn" onClick={resetConcepts}>Try Level 1 Again ↺</button><button className="magical-action-btn" onClick={()=>setActiveLevel(2)}>Continue to Level 2 – Coding Challenge →</button></section>}
  {activeLevel===2&&!level2Completed&&<section className="assessment-card" data-poko-coding={currentCoding.id}>
   <label>Jump to Coding <select aria-label="Jump to coding challenge" disabled={running||advancing} value={codingIdx} onChange={e=>setCodingIdx(Number(e.target.value))}>{codingChallenges.map((ch,i)=><option key={ch.id} value={i}>{i+1}: {ch.title}</option>)}</select></label>
   <p>Challenge {codingIdx+1} of {codingChallenges.length}</p><div className="question-tags"><span className="tag-badge">Category: {currentCoding.category}</span><span className="tag-badge">Type: {currentCoding.typeLabel}</span></div><h2>{currentCoding.title}</h2><p className="question-prompt-text">{currentCoding.scenario||currentCoding.problemDescription}</p>
   <div className="poko-code-lab"><label>Python Code Laboratory<textarea aria-label="Poko final challenge Python program" value={userCode} disabled={running||advancing} onChange={e=>editCode(e.target.value)} spellCheck={false}/></label><div><p>Console Output & Evaluation</p><pre>{consoleOutput||'(Run code to see execution output)'}</pre><p>Expected output: {currentCoding.expectedOutput}</p></div></div>
   {codingFeedback&&<p className={`feedback-banner ${codingFeedback.type}`}>{codingFeedback.message}</p>}
   <footer><button className="nav-prev-btn" disabled={running||advancing} onClick={evaluate}>{running?'Running…':'▶️ Run Code'}</button><button className="nav-prev-btn" disabled={running||advancing} onClick={()=>{editCode(currentCoding.initialCode);setConsoleOutput('');}}>↺ Reset Code</button><button className="magical-action-btn" disabled={running||advancing} onClick={submit}>Submit Solution ✨</button></footer>
  </section>}
  {activeLevel===2&&level2Completed&&<section className="assessment-card"><h2>Coding practice complete</h2><p>You used Python to help Poko with his food, water, coins, home and firewood.</p><button className="nav-prev-btn" onClick={()=>{setCodingIdx(0);setLevel2Completed(false);editCode(codingChallenges[0].initialCode);setConsoleOutput('');}}>Try Coding Again ↺</button>{levelCompleted?<button className="magical-action-btn" onClick={onComplete}>Return to the journey review →</button>:<button className="magical-action-btn" onClick={()=>setActiveLevel(1)}>Review the concept questions →</button>}</section>}
 </div>;
}
