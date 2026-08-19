import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  HelpCircle,
  Lightbulb,
  MessageSquareText,
  MoonStar,
  Play,
  Route,
  Search,
  Send,
  Sparkles,
  SunMedium,
} from "lucide-react";
import "./styles.css";
import HelpManual from "./components/HelpManual";
import HelpTooltip from "./components/HelpTooltip";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
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
  const [filters, setFilters] = useState({
    q: "",
    difficulty: "",
    concept: "",
  });
  const [form, setForm] = useState({
    learnerName: "Guest learner",
    reasoning: "",
    promptText: "",
    reflection: "",
  });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(true);
  const [helpSection, setHelpSection] = useState("getting-started");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("pybe-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pybe-theme", theme);
  }, [theme]);

  function openHelp(sectionId = "getting-started") {
    setHelpSection(sectionId);
    setHelpOpen(true);
  }

  const concepts = useMemo(
    () =>
      [
        ...new Set(scenarios.flatMap((scenario) => scenario.concepts || [])),
      ].sort(),
    [scenarios],
  );

  async function refresh() {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value),
    );
    const [scenarioData, sessionData, analyticsData, roadmapData] =
      await Promise.all([
        api(`/scenarios?${params}`),
        api("/sessions"),
        api("/analytics"),
        api("/roadmap"),
      ]);
    setScenarios(scenarioData);
    setSessions(sessionData);
    setAnalytics(analyticsData);
    setRoadmap(roadmapData);
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
      const result = await api("/sessions", {
        method: "POST",
        body: JSON.stringify({ ...form, scenarioId: selected._id }),
      });
      setActiveResult(result);
      setForm({ ...form, reasoning: "", promptText: "", reflection: "" });
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="loading">Loading PyBe...</main>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand">
            <Brain size={30} />
            <div>
              <strong>PyBe</strong>
              <span>Scenario-first Python</span>
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <SunMedium size={18} />
            ) : (
              <MoonStar size={18} />
            )}
          </button>
        </div>

        <label className="search">
          <Search size={18} />
          <input
            value={filters.q}
            onChange={(event) =>
              setFilters({ ...filters, q: event.target.value })
            }
            placeholder="Search scenarios"
          />
        </label>

        <select
          value={filters.difficulty}
          onChange={(event) =>
            setFilters({ ...filters, difficulty: event.target.value })
          }
        >
          <option value="">All levels</option>
          <option>Beginner</option>
          <option>Explorer</option>
          <option>Builder</option>
        </select>

        <select
          value={filters.concept}
          onChange={(event) =>
            setFilters({ ...filters, concept: event.target.value })
          }
        >
          <option value="">All concepts</option>
          {concepts.map((concept) => (
            <option key={concept}>{concept}</option>
          ))}
        </select>

        <div className="scenario-list">
          {scenarios.map((scenario) => (
            <button
              key={scenario._id}
              className={
                selected?._id === scenario._id ? "scenario active" : "scenario"
              }
              onClick={() => {
                setSelected(scenario);
                setActiveResult(null);
              }}
            >
              <span>{scenario.difficulty}</span>
              <strong>{scenario.title}</strong>
              <small>{scenario.concepts.join(" / ")}</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace">
        <header className="hero">
          <div>
            <div className="hero-tagline-row">
              <p>AI-native learning journey</p>
              <button
                type="button"
                className="hero-help-btn"
                onClick={() => openHelp("getting-started")}
              >
                <HelpCircle size={16} />
                <span>Help & Guide</span>
              </button>
            </div>
            <h1>Learn Python by reasoning through real situations first.</h1>
          </div>
          <div className="hero-controls">
            <div className="hero-stats">
              <span>
                {analytics?.scenarioCount || 0}
                <small>Scenarios</small>
              </span>
              <span>
                {analytics?.sessionCount || 0}
                <small>Sessions</small>
              </span>
              <span>
                {analytics?.averagePromptScore || 0}
                <small>Prompt score</small>
              </span>
            </div>
          </div>
        </header>

        <div className="main-grid">
          <section className="panel learning-panel">
            <div className="section-title">
              <Compass size={20} />
              <h2>{selected?.title}</h2>
            </div>
            <p className="context">{selected?.context}</p>
            
            <div className="objective-header-row">
              <span className="objective-label">
                Hint Chips
                <HelpTooltip
                  title="Hint Chips"
                  content="Hint chips guide you toward the core concept step by step without giving away the answer directly. Try to think before using every hint."
                  sectionId="learning-session"
                  onOpenManual={openHelp}
                />
              </span>
              <div className="objective-row">
                {selected?.objectives.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <form onSubmit={submitSession} className="learning-form">
              <label>
                <span className="label-text-with-help">
                  Your reasoning
                  <HelpTooltip
                    title="Your Reasoning"
                    content="Describe how you would solve the situation using your own words. Focus on thinking in plain English—do not worry about Python syntax initially."
                    sectionId="learning-session"
                    onOpenManual={openHelp}
                  />
                </span>
                <textarea
                  required
                  value={form.reasoning}
                  onChange={(event) =>
                    setForm({ ...form, reasoning: event.target.value })
                  }
                  placeholder={selected?.prompt}
                />
              </label>
              <label>
                <span className="label-text-with-help">
                  Prompt you would give an AI mentor
                  <HelpTooltip
                    title="AI Mentor Prompt"
                    content="Formulate a clear question or instruction for an AI mentor. Provide context and specify what explanation or steps you want."
                    sectionId="learning-session"
                    onOpenManual={openHelp}
                  />
                </span>
                <textarea
                  value={form.promptText}
                  onChange={(event) =>
                    setForm({ ...form, promptText: event.target.value })
                  }
                  placeholder="Explain my approach step by step, then show the Python concept and code..."
                />
              </label>
              <label>
                <span className="label-text-with-help">
                  Reflection
                  <HelpTooltip
                    title="Reflection"
                    content="Think about what you learned from this scenario. Reflecting on your thought process reinforces long-term understanding."
                    sectionId="learning-session"
                    onOpenManual={openHelp}
                  />
                </span>
                <textarea
                  value={form.reflection}
                  onChange={(event) =>
                    setForm({ ...form, reflection: event.target.value })
                  }
                  placeholder="What did you notice about your thinking?"
                />
              </label>
              <button className="primary" disabled={submitting}>
                <Send size={18} />
                {submitting ? "Mapping..." : "Map My Reasoning"}
              </button>
            </form>
          </section>

          <section className="panel result-panel">
            <div className="section-title">
              <Sparkles size={20} />
              <h2>AI Mentor Output</h2>
              <HelpTooltip
                title="AI Mentor Output"
                content="Review your Prompt Maturity score, Abstraction Mapping breakdown, generated Python code, and misconception signals."
                sectionId="mentor-output"
                onOpenManual={openHelp}
              />
            </div>
            {!activeResult ? <EmptyResult /> : <Result result={activeResult} onOpenHelp={openHelp} />}
          </section>
        </div>

        <section className="dashboard">
          <div className="panel">
            <div className="section-title">
              <ChartNoAxesCombined size={20} />
              <h2>Learner Analytics</h2>
            </div>
            <Analytics analytics={analytics} />
          </div>
          <div className="panel">
            <div className="section-title">
              <Route size={20} />
              <h2>Roadmap</h2>
            </div>
            <Roadmap roadmap={roadmap} />
          </div>
          <div className="panel">
            <div className="section-title">
              <MessageSquareText size={20} />
              <h2>Recent Sessions</h2>
            </div>
            <SessionList sessions={sessions} />
          </div>
        </section>
      </section>

      <HelpManual
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        initialSectionId={helpSection}
      />
    </main>
  );
}

function EmptyResult() {
  return (
    <div className="empty">
      <Lightbulb size={38} />
      <p>
        Submit reasoning to see abstraction mapping, Python code, prompt
        feedback, and misconception signals.
      </p>
    </div>
  );
}

function Result({ result, onOpenHelp }) {
  return (
    <div className="result-stack">
      <div className="score">
        <span>{result.promptScore}</span>
        <small className="score-label-with-help">
          Prompt maturity
          {onOpenHelp && (
            <HelpTooltip
              title="Prompt Maturity Score"
              content="Measures how effectively you communicated your request to the AI mentor. A lower score does NOT mean lack of Python skill!"
              sectionId="mentor-output"
              onOpenManual={onOpenHelp}
            />
          )}
        </small>
      </div>
      <div>
        <div className="mapping-header-row">
          <strong>Abstraction Mapping</strong>
          {onOpenHelp && (
            <HelpTooltip
              title="Abstraction Mapping"
              content="Connects your real-world logic directly to computer science concepts and Python code."
              sectionId="mentor-output"
              onOpenManual={onOpenHelp}
            />
          )}
        </div>
        {result.abstractionMap.map((item) => (
          <article className="mapping" key={item.pattern}>
            <strong>{item.pattern}</strong>
            <span>{item.pythonConcept}</span>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>
      <div className="code-block">
        <div>
          <Code2 size={18} /> Generated Python
        </div>
        <pre>{result.generatedCode}</pre>
        <p>{result.codeExplanation}</p>
      </div>
      <ul className="feedback">
        {result.promptFeedback.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {result.misconceptions.length > 0 && (
        <div className="note">
          <strong>Misconception watch</strong>
          {result.misconceptions.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function Analytics({ analytics }) {
  const concepts = Object.entries(analytics?.conceptCounts || {});
  return (
    <div className="analytics-list">
      {concepts.length ? (
        concepts.map(([name, count]) => (
          <div key={name}>
            <span>{name}</span>
            <meter min="0" max="10" value={count}></meter>
            <strong>{count}</strong>
          </div>
        ))
      ) : (
        <p>No learning sessions yet.</p>
      )}
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
            <small>{phase.items.join(" / ")}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function SessionList({ sessions }) {
  return (
    <div className="sessions">
      {sessions.length ? (
        sessions.slice(0, 6).map((session) => (
          <article key={session._id}>
            <Play size={16} />
            <div>
              <strong>{session.scenario?.title}</strong>
              <span>{session.masterySignals.join(" / ")}</span>
            </div>
          </article>
        ))
      ) : (
        <p>No sessions yet.</p>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
