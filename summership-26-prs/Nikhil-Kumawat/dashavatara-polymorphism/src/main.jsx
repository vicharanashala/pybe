
import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const avatars=[
 {name:"Matsya",icon:"🐟",behavior:"Guide life through the flood"},
 {name:"Narasimha",icon:"🦁",behavior:"Defeat Hiranyakashipu"},
 {name:"Vamana",icon:"👣",behavior:"Restore balance through wisdom"}
];

const chapters=["Purpose","Flood","Constraint","Strategy","Map","Dispatch","Reveal","Compare","Duck","Challenge","Mastered"];

function Code({children}){return <pre className="code"><code>{children}</code></pre>}
function Feedback({ok,children}){return <div className={ok?"feedback ok":"feedback retry"}>{ok?"✓ ":"↺ "}{children}</div>}
function Choice({label,icon,active,onClick}){return <button className={active?"choice active":"choice"} onClick={onClick}><span>{icon}</span>{label}</button>}

function App(){
 const [step,setStep]=useState(0);
 const [answers,setAnswers]=useState({});
 const [pulse,setPulse]=useState(0);
 const [activeAvatar,setActiveAvatar]=useState(-1);
 const [reflection,setReflection]=useState("");
 const setA=(k,v)=>setAnswers(a=>({...a,[k]:v}));
 const next=()=>setStep(s=>Math.min(s+1,chapters.length-1));
 const back=()=>setStep(s=>Math.max(s-1,0));
 function dispatch(){
   setPulse(p=>p+1); setActiveAvatar(-1);
   avatars.forEach((_,i)=>setTimeout(()=>setActiveAvatar(i),450+i*650));
 }
 return <main className="app">
   <header className="top">
     <div className="brand"><b>PyBe</b><small>Scenario-first Python</small></div>
     <div className="title"><small>Learning Journey</small><b>दशावतार · The Many Forms</b></div>
     <b className="pct">{Math.round(step/(chapters.length-1)*100)}%</b>
   </header>
   <div className="bar"><i style={{width:`${step/(chapters.length-1)*100}%`}}/></div>
   <nav className="steps">{chapters.map((x,i)=><button key={x} className={i===step?"on":i<step?"done":""} onClick={()=>i<=step&&setStep(i)}><span>{i<step?"✓":i+1}</span><small>{x}</small></button>)}</nav>
   <section className="stage">
     {step===0&&<Intro next={next}/>}
     {step===1&&<Flood a={answers.flood} setA={v=>setA("flood",v)} next={next}/>}
     {step===2&&<Constraint a={answers.constraint} setA={v=>setA("constraint",v)} next={next}/>}
     {step===3&&<Strategy a={answers.strategy} setA={v=>setA("strategy",v)} next={next}/>}
     {step===4&&<Mapping next={next}/>}
     {step===5&&<Dispatch pulse={pulse} activeAvatar={activeAvatar} dispatch={dispatch} next={next}/>}
     {step===6&&<Reveal next={next}/>}
     {step===7&&<Compare a={answers.compare} setA={v=>setA("compare",v)} next={next}/>}
     {step===8&&<Duck a={answers.duck} setA={v=>setA("duck",v)} next={next}/>}
     {step===9&&<Challenge a={answers.challenge} setA={v=>setA("challenge",v)} next={next}/>}
     {step===10&&<Mastered reflection={reflection} setReflection={setReflection}/>}
   </section>
   <footer><button onClick={back} disabled={step===0}>← Back</button><span>Chapter {step+1} of {chapters.length}</span><span/></footer>
 </main>
}

function Intro({next}){return <div className="scene center">
 <div className="chakra">☸</div><p className="eyebrow">A reasoning-first Python story</p>
 <h1>One purpose.<br/><em>Many forms.</em></h1>
 <p className="lead">Whenever balance is disturbed, the Protector responds. But every crisis is different.</p>
 <div className="prompt"><b>Think before you code</b><span>Should the response always be the same?</span></div>
 <button className="primary" onClick={next}>Begin the journey →</button>
 <small className="muted">No Python syntax yet. First, discover the pattern.</small>
 </div>}

function Flood({a,setA,next}){let ok=a==="fish";return <div className="scene split">
 <div className="visual flood"><div className="tag">CRISIS 01 · THE GREAT FLOOD</div><div className="call">☸ RESTORE DHARMA</div><div className="temple">⌂</div><div className={ok?"fish swim":"fish"}>🐟</div><div className="wave w1"/><div className="wave w2"/><div className="wave w3"/></div>
 <div className="copy"><p className="eyebrow">Observe the problem</p><h2>A world covered by water.</h2><p>Life must be guided safely through a devastating flood. Which form best fits the situation?</p>
 <div className="choices"><Choice icon="🐟" label="A form suited to water" active={a==="fish"} onClick={()=>setA("fish")}/><Choice icon="🦁" label="A powerful fighter" active={a==="lion"} onClick={()=>setA("lion")}/><Choice icon="🏹" label="An armed warrior" active={a==="warrior"} onClick={()=>setA("warrior")}/></div>
 {a&&<Feedback ok={ok}>{ok?"Matsya fits this crisis. The purpose is the same; the response fits the situation.":"Power alone does not fit a flood. Think about the behavior this situation needs."}</Feedback>}
 <button className="primary" disabled={!ok} onClick={next}>Continue →</button></div></div>}

function Constraint({a,setA,next}){let ok=a==="no";return <div className="scene split">
 <div className="copy"><p className="eyebrow">Same purpose · new constraints</p><h2>The impossible boon.</h2><p>An enemy cannot be defeated by an ordinary response.</p>
 <div className="constraints">{["Not man","Not beast","Not day","Not night","Not indoors","Not outdoors"].map(x=><span key={x}>× {x}</span>)}</div>
 <div className="prompt"><b>Would Matsya's flood response solve this crisis?</b><div className="binary"><button onClick={()=>setA("yes")} className={a==="yes"?"active":""}>Yes</button><button onClick={()=>setA("no")} className={a==="no"?"active":""}>No</button></div></div>
 {a&&<Feedback ok={ok}>{ok?"Right. The purpose stayed the same, but the required behavior changed.":"The previous behavior does not fit this new problem."}</Feedback>}
 <button className="primary" disabled={!ok} onClick={next}>Reveal the new response →</button></div>
 <div className="visual narasimha"><div className="call">☸ RESTORE DHARMA</div><div className="avatarBig">🦁<b>Narasimha</b><small>response for this constraint</small></div><div className="pattern">same purpose <b>→</b> different behavior</div></div>
 </div>}

function Strategy({a,setA,next}){let ok=a==="strategy";return <div className="scene split">
 <div className="visual strategy"><div className="tag">CRISIS 03 · KING BALI</div><div className="call">☸ RESTORE DHARMA</div><div className="balance">⚔️ <i/> 🧠</div><div className={ok?"feet walk":"feet"}>👣 · · ·</div></div>
 <div className="copy"><p className="eyebrow">Behavior depends on the object</p><h2>Force isn't always the answer.</h2><p>This challenge needs balance and wisdom, not a repeated old solution.</p>
 <div className="choices"><Choice icon="⚔️" label="Attack immediately" active={a==="attack"} onClick={()=>setA("attack")}/><Choice icon="🌊" label="Repeat the flood solution" active={a==="flood"} onClick={()=>setA("flood")}/><Choice icon="🧠" label="Use strategy" active={a==="strategy"} onClick={()=>setA("strategy")}/></div>
 {a&&<Feedback ok={ok}>{ok?"Vamana fulfills the same purpose through a different implementation.":"That repeats an old behavior. The new situation needs a different implementation."}</Feedback>}
 <button className="primary" disabled={!ok} onClick={next}>Connect the pattern to Python →</button></div>
 </div>}

function Mapping({next}){return <div className="scene pad">
 <div className="heading"><p className="eyebrow">Story → abstraction → code</p><h2>You already understand the idea.</h2><p>Now give each part of the story a programming name.</p></div>
 <div className="mapgrid"><div className="maprows">
   <div><span>☸ Protector</span><b>→</b><strong>Parent class</strong></div>
   <div><span>🐟 🦁 👣 Avatars</span><b>→</b><strong>Child objects</strong></div>
   <div><span>Restore Dharma</span><b>→</b><strong>Common method</strong></div>
   <div><span>Different responses</span><b>→</b><strong>Own implementations</strong></div>
 </div><div>
 <Code>{`class Protector:
    def restore_dharma(self):
        pass

class Matsya(Protector):
    def restore_dharma(self):
        return "Guide life through the flood"

class Narasimha(Protector):
    def restore_dharma(self):
        return "Defeat Hiranyakashipu"

class Vamana(Protector):
    def restore_dharma(self):
        return "Restore balance through wisdom"`}</Code></div></div>
 <div className="takeaway">Notice: all three classes understand <code>restore_dharma()</code>, but each defines what it means for itself.</div>
 <button className="primary" onClick={next}>Test the pattern →</button>
 </div>}

function Dispatch({pulse,activeAvatar,dispatch,next}){return <div className="scene pad">
 <div className="heading"><p className="eyebrow">The Dharma Council</p><h2>One request enters. Different behaviors return.</h2><p>Press the common method and watch the receiver decide the behavior.</p></div>
 <div className="dispatch">
   <button className="method" onClick={dispatch}><span>☸</span><code>restore_dharma()</code><small>dispatch common method</small></button>
   <div className={"lines "+(pulse?"run":"")} key={pulse}><i className="stem"/><i className="rail"/><i className="drop d1"/><i className="drop d2"/><i className="drop d3"/><i className="pulse p1"/><i className="pulse p2"/><i className="pulse p3"/></div>
   <div className="avatarGrid">{avatars.map((x,i)=><div className={activeAvatar===i?"avatarCard hot":"avatarCard"} key={x.name}><span>{x.icon}</span><b>{x.name}</b><code>.restore_dharma()</code><small>{x.behavior}</small></div>)}</div>
 </div>
 <Code>{`avatars = [Matsya(), Narasimha(), Vamana()]

for avatar in avatars:
    print(avatar.restore_dharma())`}</Code>
 <div className="takeaway">The calling code never asks “which avatar are you?” The object receiving the same call supplies its own behavior.</div>
 <button className="primary" onClick={next}>Name what I just observed →</button>
 </div>}

function Reveal({next}){return <div className="scene center reveal">
 <div className="poly"><span>POLY<small>many</small></span><b>+</b><span>MORPH<small>forms</small></span></div>
 <h1>POLYMORPHISM</h1><p className="lead">Different objects can respond to the <strong>same method call</strong> in their own way.</p>
 <div className="diagram"><code>restore_dharma()</code><div>↙ &nbsp;&nbsp; ↓ &nbsp;&nbsp; ↘</div><p>🐟 <span>Flood</span> &nbsp;&nbsp; 🦁 <span>Battle</span> &nbsp;&nbsp; 👣 <span>Strategy</span></p></div>
 <div className="formula">ONE CALL <b>→</b> MANY FORMS <b>→</b> DIFFERENT BEHAVIORS</div>
 <button className="primary" onClick={next}>Polymorphism vs inheritance →</button>
 </div>}

function Compare({a,setA,next}){let ok=a==="inherit";return <div className="scene pad">
 <div className="heading"><p className="eyebrow">Don't mix these concepts</p><h2>Relationship is not the same as response.</h2></div>
 <div className="compare"><div><span className="bigicon">🧬</span><h3>Inheritance</h3><p>What are these objects related to?</p><div className="miniTree"><b>Protector</b><span>↓</span><small>Matsya · Narasimha · Vamana</small></div><em>Shared parent / structure</em></div>
 <div className="focus"><span className="bigicon">🎭</span><h3>Polymorphism</h3><p>How do they respond to the same request?</p><div className="miniTree"><b>restore_dharma()</b><span>↓</span><small>Flood · Battle · Strategy</small></div><em>Same call / object-specific behavior</em></div></div>
 <div className="prompt wide"><b>Three child classes share one parent, but all keep exactly the same method behavior. Which idea is definitely present?</b><div className="binary"><button onClick={()=>setA("inherit")} className={a==="inherit"?"active":""}>Inheritance</button><button onClick={()=>setA("poly")} className={a==="poly"?"active":""}>Polymorphism</button></div></div>
 {a&&<Feedback ok={ok}>{ok?"Correct. The family relationship proves inheritance. Polymorphism becomes visible when the common operation can produce object-specific behavior.":"Not necessarily. Different child classes alone establish inheritance; polymorphism is about the common operation across different objects."}</Feedback>}
 <button className="primary" disabled={!ok} onClick={next}>See Python's extra flexibility →</button>
 </div>}

function Duck({a,setA,next}){let ok=a==="yes";return <div className="scene split">
 <div className="copy"><p className="eyebrow">Python-specific extension</p><h2>An outsider enters the council.</h2><p><code>VillageGuard</code> does not inherit from <code>Protector</code>, but it provides the method we need.</p>
 <Code>{`class VillageGuard:
    def restore_dharma(self):
        return "Protect the village"

helpers = [Matsya(), Narasimha(), VillageGuard()]

for helper in helpers:
    print(helper.restore_dharma())`}</Code>
 <div className="prompt"><b>Will the loop still work?</b><div className="binary"><button onClick={()=>setA("no")} className={a==="no"?"active":""}>No</button><button onClick={()=>setA("yes")} className={a==="yes"?"active":""}>Yes</button></div></div>
 {a&&<Feedback ok={ok}>{ok?"Yes. Python can use it because it provides restore_dharma(). This is the spirit of duck typing.":"Python does not require inheritance here; the required method is enough."}</Feedback>}
 <button className="primary" disabled={!ok} onClick={next}>Transfer the idea to real software →</button></div>
 <div className="visual duck"><div className="family"><b>Protector family</b><span>🐟 Matsya ✓</span><span>🦁 Narasimha ✓</span><span>👣 Vamana ✓</span></div><div className="outsider">🛡️<b>VillageGuard</b><small>not a child class</small></div><div className="cap"><code>restore_dharma()</code><b>✓ both can respond</b></div><p>“What can this object do?” can matter more than “What is this object?”</p></div>
 </div>}

function Challenge({a,setA,next}){let ok=a==="loop";return <div className="scene pad">
 <div className="heading"><p className="eyebrow">Transfer challenge</p><h2>Now remove the mythology.</h2><p>Recognize the same idea in a normal notification system.</p></div>
 <div className="notifications"><div>📧<b>Email</b><code>.send()</code></div><div>📱<b>SMS</b><code>.send()</code></div><div>🔔<b>Push</b><code>.send()</code></div></div>
 <div className="codeChoices"><button className={a==="types"?"active":""} onClick={()=>setA("types")}><b>A · Check every type</b><Code>{`if type(n) == Email:
    n.send()
elif type(n) == SMS:
    n.send()
elif type(n) == PushNotification:
    n.send()`}</Code></button>
 <button className={a==="loop"?"active good":""} onClick={()=>setA("loop")}><b>B · Ask every object to send</b><Code>{`notifications = [Email(), SMS(), PushNotification()]

for notification in notifications:
    notification.send()`}</Code></button></div>
 {a&&<Feedback ok={ok}>{ok?"Exactly. The loop knows only send(); each object decides what sending means. That's polymorphism.":"It works, but it couples the caller to every concrete type. The polymorphic version simply calls the shared behavior."}</Feedback>}
 <button className="primary" disabled={!ok} onClick={next}>Finish lesson →</button>
 </div>}

function Mastered({reflection,setReflection}){return <div className="scene pad center">
 <div className="badge">✓ Concept mastered</div><h1>You can now <em>see</em> polymorphism.</h1>
 <div className="conceptCore"><b>POLYMORPHISM</b><small>one call · many behaviors</small></div>
 <div className="concepts"><div>🧬<b>Inheritance</b><small>creates relationships</small></div><div>↻<b>Overriding</b><small>redefines behavior</small></div><div>🎭<b>Polymorphism</b><small>same call, different response</small></div><div>🦆<b>Duck typing</b><small>capability over family</small></div></div>
 <label className="reflection"><b>Explain polymorphism in your own words.</b><textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Polymorphism means..."/><small>Try to mention “same method” and “different behavior”.</small></label>
 <div className="formula">☸ SAME REQUEST <b>→</b> 🐟 🦁 👣 DIFFERENT FORMS <b>→</b> DIFFERENT BEHAVIORS</div>
 </div>}

createRoot(document.getElementById("root")).render(<App/>);
