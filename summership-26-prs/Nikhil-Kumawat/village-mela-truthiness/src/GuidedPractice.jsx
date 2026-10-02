import React, {useState} from 'react';
import Icon from './Icon';
import {getValue,evaluate} from './semantics';
import './guided.css';

export default function GuidedPractice({children}) {
 const [story,setStory]=useState('name');
 const [hasFirst,setHasFirst]=useState(false);
 const [hasBand,setHasBand]=useState(true);
 const [phase,setPhase]=useState(0);
 const [showCode,setShowCode]=useState(false);
 const nameStory=story==='name';
 const left=getValue(nameStory?(hasFirst?'name':'blank'):(hasFirst?'ticket':'none'));
 const right=getValue(nameStory?'guest':(hasBand?'band':'none'));
 const op=nameStory?'or':'and';
 const result=evaluate(left,op,right);
 const reset=()=>{setPhase(0);setShowCode(false)};
 const changeStory=next=>{setStory(next);setHasFirst(false);setHasBand(true);reset()};
 const checked=phase>=1;
 const finished=phase===2;
 const secondChecked=finished&&result.rightEvaluated;
 const outcome=nameStory?(hasFirst?'Write Asha on the badge.':'Write Guest on the badge.'):(hasFirst&&hasBand?'Both are present. Let the visitor in.':hasFirst?'The wristband is missing. No entry.':'The ticket is missing. Stop here.');
 const firstExplanation=nameStory?(hasFirst?'Asha has written her name. We can use it.':'The name slip is blank. We need another name.'):(hasFirst?'The visitor has a ticket. Now we need to check the wristband.':'The visitor has no ticket. There is no need to check the wristband.');
 const secondExplanation=nameStory?(hasFirst?'We already have Asha’s name. Guest is not needed.':'Use the ready-made name Guest.'):(hasFirst?(hasBand?'The visitor also has a wristband.':'There is no wristband.'):'Wristband check skipped.');
 return <div className="guided">
  <p className="eyebrow">STAGE 9 · LET’S TRY IT TOGETHER</p>
  <h1>One small decision at a time.</h1>
  <p className="lead">You have seen the mela’s checks. Now make one yourself. Start with the story; see the code when you are ready.</p>
  <div className="storyPicker" role="group" aria-label="Choose a story">
   <button aria-pressed={nameStory} className={nameStory?'selected':''} onClick={()=>changeStory('name')}><Icon kind="🏷️"/> 1. A name badge</button>
   <button aria-pressed={!nameStory} className={!nameStory?'selected':''} onClick={()=>changeStory('ticket')}><Icon kind="🎟️"/> 2. The VIP entrance</button>
  </div>
  <div className="guidedStory">
   <span className="storyPicture"><Icon kind={nameStory?'🏷️':'🎟️'}/></span>
   <div><h2>{nameStory?'What name should we write?':'Can this visitor enter?'}</h2><p>{nameStory?'At the mela, every visitor gets a name badge. Use their name if they give one. Otherwise, write Guest.':'The VIP tent needs both a ticket and a wristband. Check the ticket first. Only then check the wristband.'}</p></div>
  </div>
  <div className="guidedChoices">
   <fieldset><legend>{nameStory?'What does the visitor give us?':'Does the visitor have a ticket?'}</legend><div className="options">
    <button aria-pressed={!hasFirst} className={!hasFirst?'selected':''} onClick={()=>{setHasFirst(false);reset()}}>{nameStory?'A blank name slip':'No ticket'}</button>
    <button aria-pressed={hasFirst} className={hasFirst?'selected':''} onClick={()=>{setHasFirst(true);reset()}}>{nameStory?'A slip with Asha written on it':'Ticket present'}</button>
   </div></fieldset>
   {!nameStory&&<fieldset><legend>What about the wristband?</legend><div className="options"><button aria-pressed={hasBand} className={hasBand?'selected':''} onClick={()=>{setHasBand(true);reset()}}>Wristband present</button><button aria-pressed={!hasBand} className={!hasBand?'selected':''} onClick={()=>{setHasBand(false);reset()}}>No wristband</button></div><small>We set up the story here. The gatekeeper still checks the ticket first.</small></fieldset>}
  </div>
  <div className="guidedChecks">
   <article className={checked?'activeCheck':''}><b>1 · {nameStory?'Look at the name slip':'Look for a ticket'}</b><span><Icon kind={left.icon}/></span><p>{checked?firstExplanation:'Waiting for you to start.'}</p></article>
   <article className={finished?(secondChecked?'activeCheck':'skipCheck'):''}><b>2 · {nameStory?'Use Guest if needed':'Check the wristband if needed'}</b><span><Icon kind={right.icon}/></span><p>{finished?secondExplanation:'We have not reached this check yet.'}</p>{finished&&!secondChecked&&<strong className="skipLabel">Not checked</strong>}</article>
  </div>
  <div className="guidedAction"><button className="primary" onClick={()=>{if(finished)reset();else setPhase(p=>p+1)}}>{phase===0?'Start with the first check →':phase===1?'What happens next? →':'↻ Try this again'}</button><span role="status">{phase===0?'Ready. Nothing has been checked yet.':phase===1?firstExplanation:outcome}</span></div>
  {finished&&<div className="guidedResult"><span><Icon kind={nameStory?'🏷️':hasFirst&&hasBand?'🎗️':'🚫'}/></span><div><small>THE RESULT</small><h2>{outcome}</h2><p>{nameStory?'We chose a name to write on a badge. We did not just answer yes or no.':'That was the entry decision. Python also gives us the value where the checks stopped.'}</p></div></div>}
  {finished&&!showCode&&<button className="revealCode" onClick={()=>setShowCode(true)}>I understand the story. Show the Python →</button>}
  {finished&&showCode&&<div className="guidedCode"><p className="eyebrow">SAME STORY · ONE LINE OF PYTHON</p><p>{nameStory?<><code>or</code> means: use the first value if it is truthy; otherwise use the second.</>:<><code>and</code> means: stop at the first value if it is falsy; otherwise use the second.</>}</p>
   <div className="wordMap"><div><span>{nameStory?hasFirst?'Name is Asha':'Blank name slip':hasFirst?'Ticket present':'No ticket'}</span><code>{left.code}</code><small>{left.truth?'Truthy':'Falsy'} in Python</small></div><div><span>{nameStory?'Ready-made name':hasBand?'Wristband present':'No wristband'}</span><code>{right.code}</code><small>{right.truth?'Truthy':'Falsy'} in Python</small></div></div>
   <pre><code>{`${left.code} ${op} ${right.code}  # result: ${result.value.code}`}</code></pre>
   <p><strong>Python gives back <code>{result.value.code}</code>.</strong> {result.rightEvaluated?'It needed the second value.':'It skipped the second check. Skipping an unnecessary check is called short-circuit evaluation.'}</p>
   <p className="muted">{nameStory?'Quotation marks show text. Two quotation marks with nothing between them mean empty text.':'None means there is no value here. "Ticket" and "VIP" are text values used in this example.'}</p>
   <button onClick={()=>setShowCode(false)}>Hide the code</button>
  </div>}
  <p className="guidedHint">{finished?'Now change one choice and notice what changes.':'No timer. Take each step at your own pace.'}</p>
  <details className="extraLab"><summary>Optional: experiment with more Python values</summary><p>The guided stories above are enough to get started. This extra lab lets you explore other values when you feel ready.</p>{children}</details>
 </div>
}
