import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  FileText,
  Lightbulb,
  MessageSquareText,
  Play,
  Route,
  Search,
  Send,
  Sparkles
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [caseStudies, setCaseStudies] = useState([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [currentView, setCurrentView] = useState('pybe');

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(), [scenarios]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    const [scenarioData, sessionData, analyticsData, roadmapData, caseStudiesData] = await Promise.all([
      api(`/scenarios?${params}`),
      api('/sessions'),
      api('/analytics'),
      api('/roadmap'),
      api('/case-studies')
    ]);
    setScenarios(scenarioData);
    setSessions(sessionData);
    setAnalytics(analyticsData);
    setRoadmap(roadmapData);
    setCaseStudies(caseStudiesData);
    setSelected((current) => current || scenarioData[0] || null);
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [filters.q, filters.difficulty, filters.concept]);

  async function submitSession(event) {
    event.preventDefault();
    if (!selected || !form.reasoning.trim()) return;
    setSubmitting(true);
    try {
      const result = await api('/sessions', {
        method: 'POST',
        body: JSON.stringify({ ...form, scenarioId: selected._id })
      });
      setActiveResult(result);
      setForm({ ...form, reasoning: '', promptText: '', reflection: '' });
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="loading">Loading PyBe...</main>;

  return (
    <main className="app-shell">
      {selectedCaseStudy && <CaseStudy study={selectedCaseStudy} onClose={() => setSelectedCaseStudy(null)} />}
      <aside className="sidebar">
        <div className="brand">
          <Brain size={30} />
          <div>
            <strong>PyBe</strong>
            <span>Scenario-first Python</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={currentView === 'pybe' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('pybe')}
          >
            <Play size={18} />
            <span>PyBe</span>
          </button>
          <button 
            className={currentView === 'case-studies' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('case-studies')}
          >
            <FileText size={18} />
            <span>Case Study</span>
          </button>
        </nav>

        {currentView === 'pybe' && (
          <>
            <label className="search">
              <Search size={18} />
              <input
                value={filters.q}
                onChange={(event) => setFilters({ ...filters, q: event.target.value })}
                placeholder="Search scenarios"
              />
            </label>

            <select value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })}>
              <option value="">All levels</option>
              <option>Beginner</option>
              <option>Explorer</option>
              <option>Builder</option>
            </select>

            <select value={filters.concept} onChange={(event) => setFilters({ ...filters, concept: event.target.value })}>
              <option value="">All concepts</option>
              {concepts.map((concept) => <option key={concept}>{concept}</option>)}
            </select>

            <div className="scenario-list">
              {scenarios.map((scenario) => (
                <button
                  key={scenario._id}
                  className={selected?._id === scenario._id ? 'scenario active' : 'scenario'}
                  onClick={() => {
                    setSelected(scenario);
                    setActiveResult(null);
                  }}
                >
                  <span>{scenario.difficulty}</span>
                  <strong>{scenario.title}</strong>
                  <small>{scenario.concepts.join(' / ')}</small>
                </button>
              ))}
            </div>
          </>
        )}
      </aside>

      <section className="workspace">
        {currentView === 'pybe' ? (
          <>
            <header className="hero">
              <div>
                <p>AI-native learning journey</p>
                <h1>Learn Python by reasoning through real situations first.</h1>
              </div>
              <div className="hero-stats">
                <span>{analytics?.scenarioCount || 0}<small>Scenarios</small></span>
                <span>{analytics?.sessionCount || 0}<small>Sessions</small></span>
                <span>{analytics?.averagePromptScore || 0}<small>Prompt score</small></span>
              </div>
            </header>

            <div className="main-grid">
              <section className="panel learning-panel">
                <div className="section-title">
                  <Compass size={20} />
                  <h2>{selected?.title}</h2>
                </div>
                <p className="context">{selected?.context}</p>
                <div className="objective-row">
                  {selected?.objectives.map((item) => <span key={item}>{item}</span>)}
                </div>
                <form onSubmit={submitSession} className="learning-form">
                  <label>
                    Your reasoning
                    <textarea
                      required
                      value={form.reasoning}
                      onChange={(event) => setForm({ ...form, reasoning: event.target.value })}
                      placeholder={selected?.prompt}
                    />
                  </label>
                  <label>
                    Prompt you would give an AI mentor
                    <textarea
                      value={form.promptText}
                      onChange={(event) => setForm({ ...form, promptText: event.target.value })}
                      placeholder="Explain my approach step by step, then show the Python concept and code..."
                    />
                  </label>
                  <label>
                    Reflection
                    <textarea
                      value={form.reflection}
                      onChange={(event) => setForm({ ...form, reflection: event.target.value })}
                      placeholder="What did you notice about your thinking?"
                    />
                  </label>
                  <button className="primary" disabled={submitting}>
                    <Send size={18} />{submitting ? 'Mapping...' : 'Map My Reasoning'}
                  </button>
                </form>
              </section>

              <section className="panel result-panel">
                <div className="section-title">
                  <Sparkles size={20} />
                  <h2>AI Mentor Output</h2>
                </div>
                {!activeResult ? <EmptyResult /> : <Result result={activeResult} />}
              </section>
            </div>

            <section className="dashboard">
              <div className="panel">
                <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Learner Analytics</h2></div>
                <Analytics analytics={analytics} />
              </div>
              <div className="panel">
                <div className="section-title"><Route size={20} /><h2>Roadmap</h2></div>
                <Roadmap roadmap={roadmap} />
              </div>
              <div className="panel">
                <div className="section-title"><MessageSquareText size={20} /><h2>Recent Sessions</h2></div>
                <SessionList sessions={sessions} />
              </div>
            </section>
          </>
        ) : (
          <CaseStudiesPage caseStudies={caseStudies} onSelectStudy={setSelectedCaseStudy} />
        )}
      </section>
    </main>
  );
}

function EmptyResult() {
  return (
    <div className="empty">
      <Lightbulb size={38} />
      <p>Submit reasoning to see abstraction mapping, Python code, prompt feedback, and misconception signals.</p>
    </div>
  );
}

function Result({ result }) {
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
    </div>
  );
}

function Analytics({ analytics }) {
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

function Roadmap({ roadmap }) {
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

function SessionList({ sessions }) {
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

function CaseStudiesPage({ caseStudies, onSelectStudy }) {
  return (
    <div className="case-studies-page">
      <header className="hero">
        <div>
          <p>Real-world learning</p>
          <h1>Case Studies</h1>
        </div>
      </header>
      
      <div className="case-studies-grid">
        {caseStudies.length > 0 ? caseStudies.map((study) => (
          <div 
            key={study.id} 
            className="panel case-study-card"
            onClick={() => onSelectStudy(study)}
          >
            <span className="case-study-badge">{study.concept}</span>
            <h3>{study.title}</h3>
            <p>{study.problemStatement}</p>
            <div className="card-footer">
              <span>Read full story</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        )        ) : (
          <div className="panel case-study-card">
            <p>Loading case studies...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CaseStudy({ study, onClose }) {
  if (!study) return null;
  
  if (study.type === 'interactive') {
    return <InteractiveCaseStudy study={study} onClose={onClose} />;
  }
  
  return (
    <div className="case-study-overlay" onClick={onClose}>
      <div className="case-study-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="case-study-content">
          <span className="case-study-badge">{study.concept}</span>
          <h2>{study.title}</h2>
          
          <div className="case-study-problem">
            <h3>Problem</h3>
            <p>{study.problemStatement}</p>
          </div>

          <div className="case-study-story">
            <h3>The Story</h3>
            {study.story.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="case-study-questions">
            <h3>Think About It</h3>
            {study.questions.map((q, i) => (
              <div className="question-box" key={q.id}>
                <p><strong>Q{i + 1}.</strong> {q.question}</p>
                <textarea placeholder="Write your answer..." rows={3}></textarea>
              </div>
            ))}
          </div>

          <div className="case-study-syntax">
            <h3>Syntax (Python Code)</h3>
            <pre>{study.syntax}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveCaseStudy({ study, onClose }) {
  const [currentStage, setCurrentStage] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [thinkAnswer, setThinkAnswer] = React.useState(null);
  const [q1Answered, setQ1Answered] = React.useState(false);
  const [q2Answered, setQ2Answered] = React.useState(false);
  const [finalQAnswered, setFinalQAnswered] = React.useState(false);
  const [tileSelections, setTileSelections] = React.useState({});
  const [selectedTile, setSelectedTile] = React.useState(null);
  const [codeLineActive, setCodeLineActive] = React.useState(null);
  const [wrongSlots, setWrongSlots] = React.useState([]);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const stages = study.stages;
  const stage = stages[currentStage];
  const REVEAL_AFTER = 3;

  function goToStage(n) {
    setCurrentStage(n);
    setCodeLineActive(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleThinkOption(key) {
    setThinkAnswer(key);
  }

  function handleQuizAnswer(questionId, isCorrect, optionIndex) {
    setAnswers({ ...answers, [questionId]: { isCorrect, optionIndex } });
    if (questionId === 'q1' && isCorrect) {
      setQ1Answered(true);
    }
    if (questionId === 'q2' && isCorrect) {
      setQ2Answered(true);
    }
    if (questionId === 'final' && isCorrect) {
      setFinalQAnswered(true);
    }
  }

  function handleTileSelect(tile) {
    if (selectedTile?.id === tile.id) {
      setSelectedTile(null);
    } else {
      setSelectedTile(tile);
    }
  }

  function handleSlotClick(slotIndex) {
    if (!selectedTile) {
      if (tileSelections[slotIndex]) {
        const newSelections = { ...tileSelections };
        delete newSelections[slotIndex];
        setTileSelections(newSelections);
      }
      return;
    }
    setTileSelections({ ...tileSelections, [slotIndex]: selectedTile });
    setSelectedTile(null);
  }

  function handleRunCode() {
    const practiceStage = stages.find(s => s.id === 'practice');
    if (!practiceStage) return;
    
    const filledCount = Object.keys(tileSelections).length;
    if (filledCount < practiceStage.slots.length) {
      return;
    }

    setWrongSlots([]);
    const wrong = [];
    practiceStage.slots.forEach((slot, i) => {
      if (!tileSelections[i] || tileSelections[i].id !== slot.answerId) {
        wrong.push(i);
      }
    });

    if (wrong.length === 0) {
      setWrongSlots([]);
      setShowSuccess(true);
    } else {
      setFailedAttempts(prev => prev + 1);
      setWrongSlots(wrong);
      setShowSuccess(false);
    }
  }

  function handleResetPractice() {
    setTileSelections({});
    setSelectedTile(null);
    setWrongSlots([]);
    setFailedAttempts(0);
    setShowSuccess(false);
  }

  return (
    <div className="case-study-overlay interactive-overlay" onClick={onClose}>
      <div className="case-study-modal interactive-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="interactive-content">
          <div className="stepper">
            {stages.filter(s => s.id !== 'trophy').map((s, i) => (
              <div
                key={s.id}
                className={`step-dot ${s.stageNum === stage.stageNum ? 'active' : ''} ${s.stageNum < stage.stageNum ? 'done' : ''}`}
                onClick={() => s.stageNum <= stage.stageNum && goToStage(stages.findIndex(st => st.id === s.id))}
              >
                {s.stageNum < stage.stageNum ? '✓' : s.stageNum}
              </div>
            ))}
          </div>
          <div className="step-label">
            {stage.id !== 'trophy' 
              ? `Stage ${stage.stageNum} of ${stages.length - 1} — ${stage.title}`
              : 'Complete — Trophy'
            }
          </div>

          <div className="stage-content">
            {stage.id === 'scenario' && (
              <ScenarioStage stage={stage} onNext={() => goToStage(1)} />
            )}
            {stage.id === 'think' && (
              <ThinkStage 
                stage={stage} 
                thinkAnswer={thinkAnswer} 
                onSelect={handleThinkOption}
                onNext={() => goToStage(2)}
              />
            )}
            {stage.id === 'discover' && (
              <DiscoverStage 
                stage={stage}
                answers={answers}
                q1Answered={q1Answered}
                q2Answered={q2Answered}
                onAnswer={handleQuizAnswer}
                onNext={() => goToStage(3)}
              />
            )}
            {stage.id === 'reveal' && (
              <RevealStage stage={stage} onNext={() => goToStage(4)} />
            )}
            {stage.id === 'learn' && (
              <LearnStage stage={stage} onNext={() => goToStage(5)} />
            )}
            {stage.id === 'code' && (
              <CodeStage 
                stage={stage} 
                codeLineActive={codeLineActive}
                onSelectLine={setCodeLineActive}
                onNext={() => goToStage(6)}
              />
            )}
            {stage.id === 'practice' && (
              <PracticeStage 
                stage={stage}
                tileSelections={tileSelections}
                selectedTile={selectedTile}
                wrongSlots={wrongSlots}
                failedAttempts={failedAttempts}
                showSuccess={showSuccess}
                finalQAnswered={finalQAnswered}
                answers={answers}
                onSelectTile={handleTileSelect}
                onClickSlot={handleSlotClick}
                onRunCode={handleRunCode}
                onReset={handleResetPractice}
                onAnswer={handleQuizAnswer}
                onNext={() => goToStage(7)}
              />
            )}
            {stage.id === 'trophy' && (
              <TrophyStage stage={stage} onRestart={() => goToStage(0)} />
            )}
          </div>

          {currentStage > 0 && currentStage < stages.length - 1 && (
            <div className="nav-row">
              <button className="btn-nav" onClick={() => goToStage(currentStage - 1)}>
                ← Back
              </button>
              {currentStage < stages.length - 1 && (
                <button className="btn-nav pri" onClick={() => goToStage(currentStage + 1)}>
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScenarioStage({ stage, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <div className="story-box" dangerouslySetInnerHTML={{ __html: stage.story }}></div>
      <p>{stage.promptText}</p>
      <div className="btn-row">
        <button className="btn" onClick={onNext}>I understand the story →</button>
      </div>
    </div>
  );
}

function ThinkStage({ stage, thinkAnswer, onSelect, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.promptText}</p>
      <div className="option-grid">
        {stage.options.map((opt) => (
          <button
            key={opt.key}
            className={`option-card ${thinkAnswer === opt.key ? 'picked' : ''}`}
            onClick={() => onSelect(opt.key)}
          >
            <span className="opt-letter">{opt.letter}</span>
            {opt.text}
          </button>
        ))}
      </div>
      {thinkAnswer && (
        <div className="response-box show" dangerouslySetInnerHTML={{ __html: stage.responses[thinkAnswer] }}></div>
      )}
      <div className="btn-row">
        <button className="btn" disabled={!thinkAnswer} onClick={onNext}>
          Test my understanding →
        </button>
      </div>
      {!thinkAnswer && <div className="unlock-note">Pick an option above to unlock this button</div>}
    </div>
  );
}

function DiscoverStage({ stage, answers, q1Answered, q2Answered, onAnswer, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      
      <div className="quiz-block">
        <div className="quiz-q">{stage.questions[0].text}</div>
        <div className="quiz-options">
          {stage.questions[0].options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-opt ${answers.q1?.optionIndex === i ? (opt.correct ? 'correct' : 'wrong') : ''} ${answers.q1 && answers.q1.optionIndex !== i ? '' : ''}`}
              onClick={() => !answers.q1 && onAnswer('q1', opt.correct, i)}
              disabled={answers.q1}
            >
              {opt.text}
            </button>
          ))}
        </div>
        {answers.q1 && (
          <div className={`quiz-feedback ${answers.q1.isCorrect ? 'correct' : 'wrong'}`}>
            {answers.q1.isCorrect ? '✓ Correct!' : 'Not quite — try another option.'}
          </div>
        )}
      </div>

      {q1Answered && (
        <div className="quiz-block q2-block show">
          <div className="quiz-q">{stage.questions[1].text}</div>
          <div className="quiz-options">
            {stage.questions[1].options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-opt ${answers.q2?.optionIndex === i ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => !answers.q2 && onAnswer('q2', opt.correct, i)}
                disabled={answers.q2}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {answers.q2 && (
            <div className={`quiz-feedback ${answers.q2.isCorrect ? 'correct' : 'wrong'}`}>
              {answers.q2.isCorrect ? '✓ Correct!' : 'Not quite — try another option.'}
            </div>
          )}
        </div>
      )}

      <div className="btn-row">
        <button className="btn" disabled={!q2Answered} onClick={onNext}>
          Show me the connection →
        </button>
      </div>
    </div>
  );
}

function RevealStage({ stage, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.description}</p>

      <div className="arrow-row">
        <div className="arrow-box">📐 The Blueprint</div>
        <div className="arrow-sym">→</div>
        <div className="arrow-box">class Phone</div>
      </div>

      <table className="map-table">
        <thead>
          <tr><th>In the story</th><th>In code</th><th>Term</th></tr>
        </thead>
        <tbody>
          {stage.mapping.map((row, i) => (
            <tr key={i}>
              <td>{row.story}</td>
              <td><code>{row.code}</code></td>
              <td><span className={`pill ${row.term === 'class' || row.term === 'attribute' || row.term === 'method' ? 'blue' : 'amber'}`}>{row.term}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>{stage.conclusion}</p>

      <div className="btn-row">
        <button className="btn" onClick={onNext}>Now teach me the terms →</button>
      </div>
    </div>
  );
}

function LearnStage({ stage, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>

      <div className="concept-grid">
        {stage.concepts.map((concept, i) => (
          <div key={i} className="concept-card">
            <h4>{concept.term}</h4>
            <p>{concept.definition}</p>
          </div>
        ))}
      </div>

      <p className="vocab-label">Vocabulary at a glance</p>
      <div className="chip-row">
        {stage.chips.map((chip, i) => (
          <span key={i} className="chip">{chip}</span>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onNext}>Show me the actual code →</button>
      </div>
    </div>
  );
}

function CodeStage({ stage, codeLineActive, onSelectLine, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.promptText}</p>

      <div className="code-block">
        {stage.codeLines.map((line, i) => (
          <div
            key={i}
            className={`code-line ${codeLineActive === i ? 'active' : ''}`}
            onClick={() => line.explain && onSelectLine(i)}
          >
            <span className="ln">{i + 1}</span>
            <span className="code" dangerouslySetInnerHTML={{ __html: line.code || '&nbsp;' }}></span>
          </div>
        ))}
      </div>
      <div className="explain-box">
        {codeLineActive !== null && stage.codeLines[codeLineActive]?.explain 
          ? stage.codeLines[codeLineActive].explain
          : <span className="hint">Click a line above to see its explanation here.</span>
        }
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onNext}>I'm ready to practice →</button>
      </div>
    </div>
  );
}

function PracticeStage({ stage, tileSelections, selectedTile, wrongSlots, failedAttempts, showSuccess, finalQAnswered, answers, onSelectTile, onClickSlot, onRunCode, onReset, onAnswer, onNext }) {
  const REVEAL_AFTER = 3;
  const filledCount = Object.keys(tileSelections).length;
  const allFilled = filledCount >= stage.slots.length;
  const showHint = failedAttempts >= REVEAL_AFTER && wrongSlots.length > 0;

  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.promptText}</p>

      <div className="practice-area">
        <div className="tile-bank">
          {stage.tiles.map((tile) => (
            <div
              key={tile.id}
              className={`tile ${selectedTile?.id === tile.id ? 'selected' : ''} ${Object.values(tileSelections).some(t => t?.id === tile.id) ? 'used' : ''}`}
              onClick={() => onSelectTile(tile)}
            >
              {tile.text}
            </div>
          ))}
        </div>

        <div className="slots">
          {stage.slots.map((slot, i) => (
            <div key={i} className="slot-row">
              <span className="ln">{slot.ln}</span>
              <div
                className={`slot ${tileSelections[i] ? 'filled' : 'empty-hint'} ${wrongSlots.includes(i) ? 'wrong-slot' : ''}`}
                onClick={() => onClickSlot(i)}
              >
                {tileSelections[i] ? slot.prefix + tileSelections[i].text : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="btn-row" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
          <button className="btn amber" onClick={onRunCode}>▶ Run Code</button>
          <button className="btn" style={{ background: '#8a8577' }} onClick={onReset}>↺ Reset</button>
        </div>

        <div className="console-out">
          {!allFilled && <span className="prompt">&gt;&gt;&gt; </span>}
          {!allFilled ? 'Fill every slot before running the code.' : 
           showSuccess ? <>{stage.successOutput}</> :
           wrongSlots.length > 0 ? `Hmm, that doesn't run cleanly. ${wrongSlots.length} line${wrongSlots.length > 1 ? 's' : ''} out of place — highlighted in red. Try rearranging (${Math.max(0, REVEAL_AFTER - failedAttempts)} attempt${REVEAL_AFTER - failedAttempts !== 1 ? 's' : ''} left before I show the answer).` :
           <><span className="prompt">&gt;&gt;&gt; </span>output will appear here</>
          }
        </div>

        {showHint && (
          <div className="order-hint show">
            <div className="hint-title">Correct line order</div>
            <ol>
              {stage.slots.map((slot, i) => {
                const tile = stage.tiles.find(t => t.id === slot.answerId);
                const isCorrect = tileSelections[i]?.id === slot.answerId;
                return (
                  <li key={i} className={isCorrect ? 'line-correct' : 'line-wrong'}>
                    {slot.prefix + tile.text}{isCorrect ? ' ✓ (you had this right)' : ' ← yours differs here'}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="quiz-block q2-block show">
          <div className="quiz-q">{stage.finalQuestion.text}</div>
          <div className="quiz-options">
            {stage.finalQuestion.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-opt ${answers.final?.optionIndex === i ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => !answers.final && onAnswer('final', opt.correct, i)}
                disabled={answers.final}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {answers.final && (
            <div className={`quiz-feedback ${answers.final.isCorrect ? 'correct' : 'wrong'}`}>
              {answers.final.isCorrect ? '✓ Correct!' : 'Not quite — try another option.'}
            </div>
          )}
        </div>
      )}

      <div className="btn-row">
        <button className="btn amber" disabled={!finalQAnswered} onClick={onNext}>
          Claim my trophy 🏆
        </button>
      </div>
    </div>
  );
}

function TrophyStage({ stage, onRestart }) {
  return (
    <div className="stage-card trophy-stage">
      <div className="trophy-wrap">
        <span className="trophy-emoji">🏆</span>
        <h2>{stage.heading}</h2>
        <p>{stage.conclusion}</p>
        <div className="badge-row">
          {stage.badges.map((badge, i) => (
            <span key={i} className="badge">{badge}</span>
          ))}
        </div>
        <button className="btn" onClick={onRestart}>↺ Replay the lesson</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
