import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Code2,
  Sparkles,
  Play,
} from 'lucide-react';

function buildWhatInsight(primary, reasoning, result) {
  const score = result?.promptScore ?? 0;
  const misconceptions = result?.misconceptions || [];
  if (!primary) return { title: 'WHAT', sections: [{ label: 'Your Current Understanding', content: 'No clear reasoning pattern detected yet.' }, { label: 'What is it?', content: 'A reasoning pattern describes how you naturally approached the problem.' }] };

  const pattern = primary.pattern || '';
  const concept = primary.pythonConcept || '';
  const misconception = misconceptions[0] || '';

  const personalMap = {
    'Repetition': 'You recognized a cycle — a task that repeats for each item in a collection.',
    'Decision making': 'You evaluated a condition and chose a path — thinking in branches.',
    'Collection handling': 'You grouped related values together — thinking about data as organized collections.',
    'Computation': 'You broke the problem into steps that transform inputs into results.',
    'Reusable procedure': 'You spotted a repeatable process — thinking about logic that can be called on demand.',
    'Selection and filtering': 'You narrowed down options using a rule — thinking about what to keep and what to discard.',
    'Sequential thinking': 'You broke the problem into ordered steps — thinking in a clear top-to-bottom flow.',
  };

  const generalMap = {
    'Repetition': `${concept} lets Python repeat an action for every item in a sequence — like giving the same instruction to each student in a class, one after another.`,
    'Decision making': `${concept} lets Python choose between different paths based on a condition — like a traffic light choosing which cars can go.`,
    'Collection handling': `${concept} lets Python store and organize multiple related values — like a shelf holding multiple books together.`,
    'Computation': `${concept} lets Python transform values through calculation — like a calculator applying a formula to get a result.`,
    'Reusable procedure': `${concept} lets Python package logic into a reusable block — like a recipe card you can follow any time you need that dish.`,
    'Selection and filtering': `${concept} lets Python keep only the items that match a rule — like a sieve that lets only the right-sized stones through.`,
    'Sequential thinking': `${concept} lets Python run instructions one after another — like reading a story from the first line to the last.`,
  };

  const personalDefault = reasoning
    ? `You approached this problem with a ${pattern.toLowerCase()} approach. ${reasoning.length > 20 ? 'Your reasoning shows natural problem-solving instincts.' : 'Your reasoning captures the key idea — keep building on that foundation.'}`
    : `You approached this with a ${pattern.toLowerCase()} mindset. Keep reasoning step by step like this.`;

  const personal = personalMap[pattern] || personalDefault;

  let general = generalMap[pattern] || `${concept} is a fundamental Python building block. Understanding when and how to apply it correctly is key to writing clean, effective code.`;

  if (score < 40 && misconception) {
    general += ` A small adjustment in how you frame the condition or loop rule will help Python understand your intent better.`;
  }

  return {
    title: 'WHAT',
    sections: [
      { label: 'Your Current Understanding', content: personal },
      { label: 'What is it?', content: general },
    ],
  };
}

function buildWhyInsight(primary, feedback, scenario) {
  const fb = (feedback || [])[0] || '';
  const pattern = primary?.pattern || '';

  const matterMap = {
    'Repetition': 'Loops help you handle groups of items without repeating yourself — instead of writing the same code 100 times, you write it once and let Python do the repetition.',
    'Decision making': 'Conditionals let your code think adaptively — it can choose different actions based on different situations, making programs intelligent rather than rigid.',
    'Collection handling': 'Collections let you work with many values as one unit — instead of managing dozens of variables, you group them and access them by their position or name.',
    'Computation': 'Computation transforms raw data into useful results — converting temperatures, calculating totals, or combining values into meaningful information.',
    'Reusable procedure': 'Functions let you capture logic once and use it anywhere — once written, a function can be called whenever you need that task done.',
    'Selection and filtering': 'Filtering helps you find what you need in large sets of data — like a search filter that shows only relevant results from a long list.',
    'Sequential thinking': 'Sequential steps form the backbone of every program — Python runs your instructions one by one, so clear ordering makes your code reliable.',
  };

  const usedMap = {
    'Repetition': 'Developers use loops to process lists, generate patterns, automate repetitive tasks, and iterate through data structures efficiently without code duplication.',
    'Decision making': 'Conditionals are used for validation, branching logic, error handling, and user-directed flows — every real program needs to make choices.',
    'Collection handling': 'Collections are used to group related data, pass multiple values to functions, store results, and model real-world objects like carts, lists, or tables.',
    'Computation': 'Computations power dashboards, reports, analytics, conversions, and any feature that calculates or transforms data — from billing systems to recommendation engines.',
    'Reusable procedure': 'Functions reduce repetition, improve readability, and make code testable — well-named functions act as documentation and enable teams to build on each other\'s work.',
    'Selection and filtering': 'Filtering is used in search results, recommendation systems, data cleaning, and any feature that needs to narrow down a large dataset to relevant items.',
    'Sequential thinking': 'Sequential logic underlies all program flow — even when programs branch or loop, each step still executes in order, making it the foundation of debugging.',
  };

  const defaultMatters = 'Understanding this concept helps bridge how you naturally think about problems and how Python solves them programmatically.';
  const defaultUsed = 'Developers use this pattern to write cleaner, more maintainable code that maps directly to real-world problem solving.';

  if (fb.includes('Strong prompt')) {
    return { title: 'WHY', sections: [{ label: 'Why This Concept Matters', content: 'Your reasoning shows good structure, which maps cleanly to the Python constructs needed for this scenario.' }, { label: 'Why It Is Used', content: 'The way you broke down the problem aligns with how experienced developers naturally approach this type of challenge.' }] };
  }
  if (fb.includes('context')) {
    return { title: 'WHY', sections: [{ label: 'Why This Concept Matters', content: 'Identifying data elements before deciding how to process them is the right mindset — it helps Python understand your intent.' }, { label: 'Why It Is Used', content: 'Professional developers always start by understanding what data they have before choosing how to transform it.' }] };
  }
  if (fb.includes('example')) {
    return { title: 'WHY', sections: [{ label: 'Why This Concept Matters', content: 'Including practical details in your reasoning shows strong analytical thinking — Python rewards that precision.' }, { label: 'Why It Is Used', content: 'Examples and context help Python map your intent accurately, reducing confusion and misinterpretation.' }] };
  }

  const matters = matterMap[pattern] || defaultMatters;
  const used = usedMap[pattern] || defaultUsed;

  return { title: 'WHY', sections: [{ label: 'Why This Concept Matters', content: matters }, { label: 'Why It Is Used', content: used }] };
}

function buildWhereInsight(codeText) {
  if (!codeText || typeof codeText !== 'string') {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'No Python code available to analyze.' }, { label: 'Where It Is Used in Real Life', content: 'Submit reasoning to see WHERE your concept appears in real code and everyday life.' }] };
  }
  if (/for\s+\w+\s+in\s+/i.test(codeText)) {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'For loops process lists in web apps, iterate through database results, generate reports, loop through API responses, and render UI components in frameworks like React.' }, { label: 'Where It Is Used in Real Life', content: 'Like reading through a guest list one by one to find a name — you check each item in order until you reach the end.' }] };
  }
  if (/while\s+/i.test(codeText)) {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'While loops handle event listeners, polling for data updates, game loops that run continuously, and waiting for user input in interactive applications.' }, { label: 'Where It Is Used in Real Life', content: 'Like waiting at a red traffic light — you keep checking until the condition changes, then proceed with the next action.' }] };
  }
  if (/if\s+/i.test(codeText)) {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'If statements handle authentication checks, input validation, conditional routing in APIs, access control in applications, and error handling throughout software.' }, { label: 'Where It Is Used in Real Life', content: 'Like deciding to take an umbrella based on the weather forecast — you evaluate a condition and choose the appropriate action.' }] };
  }
  if (/def\s+\w+/i.test(codeText)) {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'Functions power API endpoints, reusable data processing utilities, business logic components, event handlers, and utility libraries that developers import across projects.' }, { label: 'Where It Is Used in Real Life', content: 'Like following a recipe card — once written, you can follow the same steps whenever you need that dish, without reinventing the process.' }] };
  }
  if (/print\s*\(/i.test(codeText)) {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'Print statements output logs for debugging, display results in console applications, generate formatted reports, and show status messages in terminal-based tools.' }, { label: 'Where It Is Used in Real Life', content: 'Like writing notes on a whiteboard to share information — a simple way to communicate results that others can read.' }] };
  }
  if (/\w+\s*=\s*/i.test(codeText)) {
    return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'Variables store configuration settings, hold intermediate calculation results, cache database queries, and manage application state in all software applications.' }, { label: 'Where It Is Used in Real Life', content: 'Like labeling a folder to remember where you stored important documents — you assign a name to something so you can find it again easily.' }] };
  }
  return { title: 'WHERE', sections: [{ label: 'Where It Appears in Real Code', content: 'No specific Python structure detected — the reasoning may need to map more clearly to a construct.' }, { label: 'Where It Is Used in Real Life', content: 'Try reasoning about a specific Python concept to see where it appears in real code and everyday life.' }] };
}

function buildHowInsight(codeText, pattern) {
  if (!codeText || typeof codeText !== 'string') {
    return { title: 'HOW', explanation: 'Submit your reasoning to see how this concept works.', thinking: 'Complete the reasoning step to unlock the thinking process.', code: { lines: [], highlightIndex: 0 }, practice: 'Submit reasoning to unlock practice exercises.' };
  }
  const allLines = codeText.split('\n').filter(l => l.trim() !== '');
  const lines = allLines.slice(0, 8);
  let highlightIdx = 0;
  if (/for\s+\w+\s+in\s+/i.test(codeText)) {
    highlightIdx = lines.findIndex(l => /for\s+\w+\s+in\s+/i.test(l));
    return {
      title: 'HOW',
      explanation: 'A for loop steps through each item in a sequence one by one. Python executes the body of the loop for every item, then moves to the next until the sequence ends.',
      thinking: 'Ask yourself: What collection do I need to process? What should happen to each item? Should the loop store results or just perform an action? What happens after the last item?',
      code: { lines, highlightIndex: highlightIdx >= 0 ? highlightIdx : 0 },
      practice: 'Try changing the list values to see different outputs. What happens if you add more items to the list?'
    };
  }
  if (/def\s+\w+/i.test(codeText)) {
    highlightIdx = lines.findIndex(l => /def\s+\w+/i.test(l));
    return {
      title: 'HOW',
      explanation: 'A function definition packages logic into a reusable unit. It can accept inputs (parameters), perform operations, and return results. Once defined, call it by name with actual values (arguments).',
      thinking: 'Ask yourself: What task will I repeat? What inputs does it need? What should it output? Should it modify data or just return a result? Where will I call this function?',
      code: { lines, highlightIndex: highlightIdx >= 0 ? highlightIdx : 0 },
      practice: 'Try modifying one of the parameter values when calling the function. How does the output change?'
    };
  }
  if (/if\s+/i.test(codeText)) {
    highlightIdx = lines.findIndex(l => /if\s+/i.test(l));
    return {
      title: 'HOW',
      explanation: 'An if statement checks a condition and executes code only when that condition is true. You can add elif for multiple conditions and else as a fallback when no condition matches.',
      thinking: 'Ask yourself: What specific condition determines which path to take? Is there a case where none of the conditions apply? What should happen in the fallback case?',
      code: { lines, highlightIndex: highlightIdx >= 0 ? highlightIdx : 0 },
      practice: 'Try changing the condition values to take different branches. What happens when no condition is true?'
    };
  }
  if (/while\s+/i.test(codeText)) {
    highlightIdx = lines.findIndex(l => /while\s+/i.test(l));
    return {
      title: 'HOW',
      explanation: 'A while loop repeats as long as its condition remains true. The loop checks the condition before each iteration, and stops when the condition becomes false.',
      thinking: 'Ask yourself: What condition controls the loop? What will change inside the loop to eventually make it false? How many iterations might this take? What happens if the condition never becomes false?',
      code: { lines, highlightIndex: highlightIdx >= 0 ? highlightIdx : 0 },
      practice: 'Try changing the condition value. How does that affect how many times the loop runs?'
    };
  }
  if (/\w+\s*=\s*[\d"\[']/i.test(codeText)) {
    highlightIdx = lines.findIndex(l => /\w+\s*=\s*[\d"\[']/i.test(l));
    return {
      title: 'HOW',
      explanation: 'Variable assignment stores a value in memory using a named label. The value can be a number, text, list, or any other data type. Variables can be reassigned to new values as the program runs.',
      thinking: 'Ask yourself: What meaningful name should this variable have? What type of data am I storing? Will this value change later, or stay constant? Will I need this value elsewhere in the code?',
      code: { lines, highlightIndex: highlightIdx >= 0 ? highlightIdx : 0 },
      practice: 'Try changing the variable value and observe how it affects the rest of the code output.'
    };
  }
  return {
    title: 'HOW',
    explanation: 'Review your reasoning to understand how the code connects to your thought process.',
    thinking: 'Consider how your reasoning maps to the Python constructs in the generated code.',
    code: { lines, highlightIndex: 0 },
    practice: 'Study the code and try explaining each line in your own words.'
  };
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

export function W3HInsightSection({ insight }) {
  return (
    <div className="w3h-insight">
      {insight.sections.map((section, i) => (
        <div className="w3h-insight-part" key={i}>
          <span className="w3h-insight-label">{section.label}</span>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
}

export function HowLearningSection({ insight }) {
  const { explanation, thinking, code, practice } = insight;
  return (
    <div className="how-learning">
      <div className="how-learning-block">
        <span className="how-learning-label">🧩 How It Works</span>
        <p>{explanation}</p>
      </div>
      <div className="how-learning-block">
        <span className="how-learning-label">🧠 How to Think</span>
        <p>{thinking}</p>
      </div>
      <div className="how-learning-block">
        <span className="how-learning-label">💻 How to Write It</span>
        <div className="w3h-code-block">
          {code.lines.map((line, i) => (
            <div key={i} className={`w3h-code-line${i === code.highlightIndex ? ' highlight' : ''}`}>
              <span className="w3h-code-num">{i + 1}</span>
              <span className="w3h-code-text">{line || ' '}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="how-learning-block">
        <span className="how-learning-label">🚀 Apply It Yourself</span>
        <p>{practice}</p>
      </div>
    </div>
  );
}

export function W3H({ result }) {
  const [expanded, setExpanded] = useState(null);
  const primary = result.abstractionMap?.[0];
  const codeText = result.generatedCode || '';

  const what = buildWhatInsight(primary, result.reasoning, result);
  const why = buildWhyInsight(primary, result.promptFeedback, result.scenario);
  const where = buildWhereInsight(codeText);
  const how = buildHowInsight(codeText, primary?.pattern);
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
        <AccordionSection icon={<span className="w3h-dot blue" />} label="WHAT" title="Your Thinking Pattern" content={<W3HInsightSection insight={what} />} expanded={expanded === 'what'} onToggle={() => toggle('what')} accent="blue" />
        <AccordionSection icon={<span className="w3h-dot yellow" />} label="WHY" title="Context & Purpose" content={<W3HInsightSection insight={why} />} expanded={expanded === 'why'} onToggle={() => toggle('why')} accent="yellow" />
        <AccordionSection icon={<span className="w3h-dot orange" />} label="WHERE" title="Code Mapping" content={<W3HInsightSection insight={where} />} expanded={expanded === 'where'} onToggle={() => toggle('where')} accent="orange" />
        <AccordionSection icon={<span className="w3h-dot red" />} label="HOW" title="Real Code View" content={<HowLearningSection insight={how} />} expanded={expanded === 'how'} onToggle={() => toggle('how')} accent="red" dark />
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
  if (!result || typeof result !== 'object') {
    return <div className="empty"><p>No result available.</p></div>;
  }

  const abstractionMap = result.abstractionMap || [];
  const promptFeedback = result.promptFeedback || [];
  const misconceptions = result.misconceptions || [];

  return (
    <div className="result-stack">
      <div className="score"><span>{result.promptScore ?? '--'}</span><small>Prompt maturity</small></div>
      <div>
        {abstractionMap.map((item) => (
          <article className="mapping" key={item.pattern}>
            <strong>{item.pattern || 'Unknown pattern'}</strong>
            <span>{item.pythonConcept || 'Unknown concept'}</span>
            <p>{item.explanation || ''}</p>
          </article>
        ))}
      </div>
      <div className="code-block">
        <div><Code2 size={18} /> Generated Python</div>
        <pre>{result.generatedCode || 'No code generated yet.'}</pre>
        <p>{result.codeExplanation || ''}</p>
      </div>
      <ul className="feedback">
        {promptFeedback.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {misconceptions.length > 0 && (
        <div className="note">
          <strong>Misconception watch</strong>
          {misconceptions.map((item) => <p key={item}>{item}</p>)}
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
      {(roadmap || []).map((phase) => (
        <article key={phase.phase}>
          <strong>{phase.phase}</strong>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <small>{(phase.items || []).join(' / ')}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SessionList({ sessions }) {
  const safeSessions = sessions || [];
  return (
    <div className="sessions">
      {safeSessions.length ? safeSessions.slice(0, 6).map((session) => (
        <article key={session._id}>
          <Play size={16} />
          <div>
            <strong>{session.scenario?.title}</strong>
            <span>{(session.masterySignals || []).join(' / ')}</span>
          </div>
        </article>
      )) : <p>No sessions yet.</p>}
    </div>
  );
}