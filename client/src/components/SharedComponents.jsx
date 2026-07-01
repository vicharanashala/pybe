import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Code2,
  Sparkles,
  ChartNoAxesCombined,
  Route,
  MessageSquareText,
  Play,
} from 'lucide-react';

function buildWhatReasoning(primary, reasoning) {
  if (!primary) return 'No clear reasoning pattern detected yet.';
  const pattern = primary.pattern || '';
  if (pattern === 'Repetition') return 'You identified a pattern that repeats — thinking in cycles to handle multiple items one after another.';
  if (pattern === 'Decision making') return 'You evaluated a condition and chose a path — thinking conditionally based on a true/false check.';
  if (pattern === 'Collection handling') return 'You grouped related values together — thinking about data as organized collections.';
  if (pattern === 'Computation') return 'You transformed values through calculation — thinking in terms of arithmetic operations and results.';
  if (pattern === 'Reusable procedure') return 'You spotted a repeatable process — thinking about logic that can be called multiple times.';
  if (pattern === 'Selection and filtering') return 'You narrowed down options using a rule — thinking about keeping only what matches a criteria.';
  if (pattern === 'Sequential thinking') return 'You broke the problem into ordered steps — thinking in a clear top-to-bottom flow.';
  return `You applied ${primary.pythonConcept} in your reasoning to structure the solution.`;
}

function buildWhy(primary, feedback, scenario) {
  const fb = (feedback || [])[0] || '';
  if (fb.includes('Strong prompt')) return 'Your reasoning shows good structure, which maps cleanly to the Python constructs needed for this scenario.';
  if (fb.includes('context')) return 'Your approach identifies the key data elements before deciding how to process them — the right mindset for this scenario.';
  if (fb.includes('example')) return 'You included practical details in your reasoning, helping map your thinking directly to real Python code.';
  if (primary?.pattern === 'Repetition') return 'This scenario involves handling multiple items of the same kind — loops are the natural Python tool for exactly this.';
  if (primary?.pattern === 'Decision making') return 'This scenario requires choosing between actions based on a condition — conditionals are built for that decision logic.';
  if (primary?.pattern === 'Collection handling') return 'This scenario works with groups of related data — Python lists and dictionaries are designed to model exactly these situations.';
  if (primary?.pattern === 'Computation') return 'This scenario needs a numeric result — Python variables and arithmetic let you compute and store results efficiently.';
  if (primary?.pattern === 'Reusable procedure') return 'This scenario involves a rule applied to different inputs — functions are the Python way to capture and reuse such logic.';
  return 'Your reasoning connects naturally to the Python concepts this scenario is designed to introduce.';
}

function buildWhere(codeText) {
  if (/for\s+\w+\s+in\s+/i.test(codeText)) return { whereLabel: 'for loop', whereText: 'A for loop iterates over each item in a sequence, running the same block for every element.' };
  if (/while\s+/i.test(codeText)) return { whereLabel: 'while loop', whereText: 'A while loop repeats as long as its condition remains true — useful when you do not know how many iterations needed.' };
  if (/if\s+/i.test(codeText)) return { whereLabel: 'if statement', whereText: 'An if statement executes a block only when its condition evaluates to true, creating a branching path.' };
  if (/def\s+\w+/i.test(codeText)) return { whereLabel: 'function def', whereText: 'A function definition packages logic into a reusable unit that can be called multiple times with different inputs.' };
  if (/print\s*\(/i.test(codeText)) return { whereLabel: 'print output', whereText: 'A print statement outputs values to the console, useful for displaying results and debugging.' };
  if (/\w+\s*=\s*/i.test(codeText)) return { whereLabel: 'variable assignment', whereText: 'Variable assignment stores a value in memory using a named label, making it reusable throughout the code.' };
  return { whereLabel: 'not detected', whereText: 'No specific Python structure detected — the reasoning may need to map more clearly to a construct.' };
}

function buildHow(codeText) {
  const allLines = codeText.split('\n').filter(l => l.trim() !== '');
  const lines = allLines.slice(0, 8);
  let highlightIdx = 0;
  if (/for\s+\w+\s+in\s+/i.test(codeText)) highlightIdx = lines.findIndex(l => /for\s+\w+\s+in\s+/i.test(l));
  else if (/def\s+\w+/i.test(codeText)) highlightIdx = lines.findIndex(l => /def\s+\w+/i.test(l));
  else if (/if\s+/i.test(codeText)) highlightIdx = lines.findIndex(l => /if\s+/i.test(l));
  else if (/while\s+/i.test(codeText)) highlightIdx = lines.findIndex(l => /while\s+/i.test(l));
  else if (/\w+\s*=\s*[\d"\[']/i.test(codeText)) highlightIdx = lines.findIndex(l => /\w+\s*=\s*[\d"\[']/i.test(l));
  if (highlightIdx < 0) highlightIdx = 0;
  return { codeLines: lines, highlightIdx };
}

function buildFixInsight(result, primary) {
  const score = result.promptScore || 0;
  const misconceptions = result.misconceptions || [];
  if (score < 40) {
    return { mistake: 'Your prompt lacks context and structure. The AI needs more details about what you want to learn and why.', correct: 'Include the scenario goal, the specific Python concept, and an example of what output you expect.' };
  }
  if (score < 60) {
    return { mistake: 'Your reasoning shows the right intent but may not fully map to the target Python construct.', correct: 'Try naming the Python concept directly and describe what your code should do step by step.' };
  }
  if (misconceptions.length > 0) {
    return { mistake: misconceptions[0], correct: 'Focus on the specific condition or loop rule before writing the full logic.' };
  }
  return null;
}

export function AccordionSection({ icon, label, title, content, expanded, onToggle, accent, dark }) {
  return (
    <div className={`w3h-section${expanded ? ' open' : ''}${dark ? ' dark' : ''} accent-${accent}`}>
      <button className="w3h-section-toggle" onClick={onToggle}>
        <div className="w3h-section-left">
          {icon}
          <span className="w3h-label">{label}</span>
          <span className="w3h-title">{title}</span>
        </div>
        <svg className="w3h-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {expanded && <div className="w3h-section-body">{content}</div>}
    </div>
  );
}

export function W3H({ result }) {
  const [expanded, setExpanded] = useState(null);
  const primary = result.abstractionMap?.[0];
  const codeText = result.generatedCode || '';

  const whatReasoning = buildWhatReasoning(primary, result.reasoning);
  const whyText = buildWhy(primary, result.promptFeedback, result.scenario);
  const { whereText, whereLabel } = buildWhere(codeText);
  const { codeLines, highlightIdx } = buildHow(codeText);
  const needsFix = (result.promptScore != null && result.promptScore < 60) || (result.misconceptions && result.misconceptions.length > 0);
  const fixInsight = buildFixInsight(result, primary);

  function toggle(section) {
    setExpanded(prev => prev === section ? null : section);
  }

  return (
    <div className="w3h-panel">
      <div className="w3h-panel-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        W³H Learning Insight
      </div>
      <div className="w3h-sections">
        <AccordionSection icon={<span className="w3h-dot blue" />} label="WHAT" title="Your Thinking Pattern" content={<p>{whatReasoning}</p>} expanded={expanded === 'what'} onToggle={() => toggle('what')} accent="blue" />
        <AccordionSection icon={<span className="w3h-dot yellow" />} label="WHY" title="Context & Purpose" content={<p>{whyText}</p>} expanded={expanded === 'why'} onToggle={() => toggle('why')} accent="yellow" />
        <AccordionSection icon={<span className="w3h-dot orange" />} label="WHERE" title="Code Mapping" content={<div className="w3h-where"><span className="w3h-where-label">{whereLabel}</span><p>{whereText}</p></div>} expanded={expanded === 'where'} onToggle={() => toggle('where')} accent="orange" />
        <AccordionSection icon={<span className="w3h-dot red" />} label="HOW" title="Real Code View" content={<div className="w3h-code-block">{codeLines.map((line, i) => (<div key={i} className={`w3h-code-line${i === highlightIdx ? ' highlight' : ''}`}><span className="w3h-code-num">{i + 1}</span><span className="w3h-code-text">{line || ' '}</span></div>))}</div>} expanded={expanded === 'how'} onToggle={() => toggle('how')} accent="red" dark />
      </div>
      {needsFix && fixInsight && (
        <div className="w3h-fix-insight">
          <div className="w3h-fix-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Fix Insight
          </div>
          <p className="w3h-fix-mistake"><strong>Mistake:</strong> {fixInsight.mistake}</p>
          <p className="w3h-fix-correct"><strong>Correct approach:</strong> {fixInsight.correct}</p>
        </div>
      )}
    </div>
  );
}

export function EmptyResult() {
  return (
    <div className="empty">
      <Lightbulb size={38} />
      <p>Submit reasoning to see abstraction mapping, Python code, prompt feedback, and misconception signals.</p>
    </div>
  );
}

export function VoiceInput({ value, onChange }) {
  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));

  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange(value + transcript);
    };

    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);

    if (recording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => { recognition.stop(); };
  }, [recording]);

  if (!supported) return null;

  function toggle() {
    setRecording(r => !r);
  }

  return (
    <button type="button" className={`voice-btn${recording ? ' recording' : ''}`} onClick={toggle} title={recording ? 'Stop recording' : 'Start voice input'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {recording ? (
          <rect x="6" y="6" width="12" height="12" rx="1" />
        ) : (
          <>
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </>
        )}
      </svg>
      {recording && <span className="recording-dot" />}
    </button>
  );
}

export function Result({ result, onQuizStart }) {
  return (
    <div className="result-stack">
      <div className="score"><span>{result.promptScore}</span><small>Prompt maturity</small></div>
      <div>
        {result.abstractionMap.map((item) => (
          <article className="mapping" key={item.pattern}>
            <strong>{item.pattern}</strong>
            <span>{item.pythonConcept}</span>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>
      <div className="code-block">
        <div><Code2 size={18} /> Generated Python</div>
        <pre>{result.generatedCode}</pre>
        <p>{result.codeExplanation}</p>
      </div>
      <ul className="feedback">
        {result.promptFeedback.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {result.misconceptions.length > 0 && (
        <div className="note">
          <strong>Misconception watch</strong>
          {result.misconceptions.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}
      <button className="primary quiz-trigger" onClick={() => onQuizStart && onQuizStart(result)}>
        <Sparkles size={18} /> Take a Quiz
      </button>
    </div>
  );
}

export function Analytics({ analytics }) {
  const concepts = Object.entries(analytics?.conceptCounts || {});
  return (
    <div className="analytics-list">
      {concepts.length ? concepts.map(([name, count]) => (
        <div key={name}>
          <span>{name}</span>
          <meter min="0" max="10" value={count}></meter>
          <strong>{count}</strong>
        </div>
      )) : <p>No learning sessions yet.</p>}
    </div>
  );
}

export function Roadmap({ roadmap }) {
  return (
    <div className="roadmap">
      {roadmap.map((phase) => (
        <article key={phase.phase}>
          <strong>{phase.phase}</strong>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <small>{phase.items.join(' / ')}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SessionList({ sessions }) {
  return (
    <div className="sessions">
      {sessions.length ? sessions.slice(0, 6).map((session) => (
        <article key={session._id}>
          <Play size={16} />
          <div>
            <strong>{session.scenario?.title}</strong>
            <span>{session.masterySignals.join(' / ')}</span>
          </div>
        </article>
      )) : <p>No sessions yet.</p>}
    </div>
  );
}