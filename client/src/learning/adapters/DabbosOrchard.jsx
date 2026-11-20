import React,{useEffect,useState} from 'react';
import AuthoredStory from '../AuthoredStory.jsx';
import lesson from '../../../../case-studies/variables-and-arithmetic-dabbos-orchard/lesson.json';
import {createStoryTimersHook} from '../../../../shared/story-timers.mjs';
import {createStoryProgressHook} from '../../../../shared/story-progress.mjs';
const useStoryTimers=createStoryTimersHook(React),useStoryProgress=createStoryProgressHook(React);
const styles=`.orchard{padding:24px;background:#fffaf3;color:#382b21}.orchard-hero{position:relative;min-height:200px;display:flex;align-items:end;padding:24px;border-radius:18px;overflow:hidden;background:linear-gradient(0deg,#382b21bd,transparent),url('/submissions/variables-and-arithmetic-dabbos-orchard/orchard_bg.jpg') center/cover}.orchard-hero h1,.orchard-hero p{color:#fffdf9;text-shadow:0 2px 3px #0007}.orchard-hero h1{font-size:36px}.orchard-progress{margin:24px 0}.orchard-progress progress{display:block;width:100%;height:10px;accent-color:#c45b19}.orchard-card{padding:22px;margin:18px 0;background:#fffdf9;border:1px solid #e7cfb5;border-radius:16px}.orchard-card h2{font-size:24px}.orchard-card h3{font-size:20px}.orchard p{margin:12px 0}.orchard-info,.orchard-success{padding:14px 16px;border-radius:10px;border:1px solid #e7cfb5;background:#fff0df}.orchard-success{background:#eaf2e6;border-color:#c8d9c0}.orchard-metric{display:inline-flex;flex-direction:column;margin:12px 24px 12px 0}.orchard-metric dt{color:#705a46;font-size:14px}.orchard-metric dd{margin:0;color:#9a4211;font-size:32px;font-weight:700}.orchard hr{border:0;border-top:1px solid #eadbce;margin:22px 0}.orchard-nav{display:flex;justify-content:space-between;gap:12px;margin-top:24px}.orchard-nav button{border:1px solid #c45b19;border-radius:10px;padding:12px 18px;color:#fff;background:#c45b19;font:inherit;cursor:pointer}.orchard-nav button:disabled{opacity:.4;cursor:default}.orchard-nav button:first-child{background:#fffdf9;color:#9a4211}@media(max-width:760px){.orchard{padding:16px 10px}.orchard-hero{padding:20px 16px}.orchard-hero h1{font-size:28px}.orchard-card{padding:18px}.orchard-card h2{font-size:22px}}`;
function BoxSearch({frames}){
 const [frame,setFrame]=useState(0);const {setTimeout,clearTimeout}=useStoryTimers();
 useEffect(()=>{if(frame>=frames.length-1)return;const timer=setTimeout(()=>setFrame(i=>i+1),lesson.frameDelayMs);return()=>clearTimeout(timer);},[frame,frames]);
 return <div data-orchard-box={frame} aria-live="polite" className={`orchard-${frames[frame].kind}`}>{frames[frame].text}</div>;
}
function Node({node}){
 if(node.kind==='container')return <section className="orchard-card">{node.children.map((child,i)=><Node key={i} node={child}/>)}</section>;
 if(node.kind==='animation')return <BoxSearch frames={node.frames}/>;
 if(node.kind==='header')return <h2>{node.text}</h2>;
 if(node.kind==='subheader')return <h3>{node.text}</h3>;
 if(node.kind==='divider')return <hr/>;
 if(node.kind==='metric')return <dl className="orchard-metric"><dt>{node.label}</dt><dd>{node.value}</dd></dl>;
 if(['success','info'].includes(node.kind))return <p className={`orchard-${node.kind}`}>{node.text}</p>;
 return <p>{node.text}</p>;
}
function Orchard({onComplete}){
 const [step,setStep]=useState(0);const [,complete]=useStoryProgress('dabbos-orchard');
 useEffect(()=>{complete(String(step+1));if(step===7)onComplete?.();},[step]);
 const navigate=next=>{setStep(next);};
 return <div className="orchard" data-orchard-step={step+1}><div className="orchard-hero"><div><h1>🥭 Dabbo's Orchard</h1><p>Learn Python through a simple mango story</p></div></div><div className="orchard-progress"><p>Learning Step {step+1} of 8</p><progress value={step+1} max="8" aria-label="Story progress"/></div><div key={step}>{lesson.pages[step].map((node,i)=><Node key={i} node={node}/>)}</div><nav className="orchard-nav" aria-label="Orchard story"><button disabled={step===0} onClick={()=>navigate(step-1)}>⬅️ Previous</button>{step<7?<button onClick={()=>navigate(step+1)}>Next ➡️</button>:<button onClick={()=>navigate(0)}>🔄 Start Again</button>}</nav><p><small>{lesson.footer}</small></p></div>;
}
export default function DabbosOrchard({onComplete}){return <AuthoredStory styles={[styles]}><Orchard onComplete={onComplete}/></AuthoredStory>;}
