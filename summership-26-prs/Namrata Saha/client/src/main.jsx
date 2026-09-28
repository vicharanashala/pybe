import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpenText, RefreshCw, Sparkles } from 'lucide-react';
import './styles.css';
import { usePyodide } from './hooks/usePyodide';
import { computeProgress } from './lib/progress';
import BetaalLogo from './components/BetaalLogo';
import Intro from './components/Intro';
import StoryMap from './components/StoryMap';
import StoryPlayer from './components/StoryPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const NAME_KEY = 'pybe-betaal-learner-name';
const INTRO_KEY = 'pybe-betaal-intro-seen';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || response.statusText);
  }
  return response.json();
}

function App() {
  const [stories, setStories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');
  const [learnerName, setLearnerName] = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !localStorage.getItem(INTRO_KEY);
    } catch {
      return false;
    }
  });
  const { pyodide, loading: pyodideLoading, error: pyodideError } = usePyodide();

  const progress = useMemo(() => computeProgress(stories, sessions), [stories, sessions]);

  async function refresh() {
    try {
      const [storyData, sessionData] = await Promise.all([api('/stories'), api('/sessions')]);
      setStories(storyData);
      setSessions(sessionData);
      setServerError('');
    } catch (error) {
      setServerError(error.message || 'Could not reach the PyBe API.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    localStorage.setItem(NAME_KEY, learnerName);
  }, [learnerName]);

  async function startStory(story) {
    try {
      const full = await api(`/stories/${story.id}`);
      setSelected(full);
      setServerError('');
    } catch (error) {
      setServerError(error.message || 'Could not load the story.');
    }
  }

  async function recordSession(event) {
    await api('/sessions', {
      method: 'POST',
      body: JSON.stringify({ ...event, learnerName: learnerName || 'Guest learner' })
    });
    const sessionData = await api('/sessions');
    setSessions(sessionData);
  }

  function exitPlayer() {
    setSelected(null);
    refresh();
  }

  function finishIntro() {
    try {
      localStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* intro plays again if storage is unavailable */
    }
    setShowIntro(false);
  }

  if (loading) {
    return (
      <main className="loading">
        <RefreshCw size={22} className="spin" aria-hidden="true" />
        <p>Rolling out the story scroll…</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark"><BetaalLogo size={32} /></span>
          <div>
            <strong>PyBe</strong>
            <span>🐍 Betaal Tales</span>
          </div>
        </div>
        <div className="header-right">
          <button
            type="button"
            className="btn header-intro-btn"
            onClick={() => setShowIntro(true)}
            title="Watch the intro again"
            aria-label="Watch the intro again"
          >
            <Sparkles size={14} aria-hidden="true" /> Intro
          </button>
          <label className="learner-label">
            <span>Learner name</span>
            <input
              value={learnerName}
              onChange={(event) => setLearnerName(event.target.value)}
              placeholder="Guest learner"
              maxLength={40}
              aria-label="Learner name"
            />
          </label>
          <div className="header-xp">
            <strong>{progress.totalXp}</strong>
            <span>XP</span>
          </div>
        </div>
      </header>

      {serverError && (
        <div className="note note-error app-note" role="alert">
          <strong>Server unreachable:</strong> {serverError}
          <button type="button" className="btn btn-ghost" onClick={refresh}>
            <RefreshCw size={14} aria-hidden="true" /> Retry
          </button>
        </div>
      )}

      {showIntro ? (
        <Intro onDone={finishIntro} />
      ) : selected ? (
        <StoryPlayer
          story={selected}
          pyodide={pyodide}
          pyodideLoading={pyodideLoading}
          pyodideError={pyodideError}
          onRecord={recordSession}
          onExit={exitPlayer}
        />
      ) : (
        <StoryMap stories={stories} progress={progress} onStart={startStory} />
      )}

      <footer className="app-footer">
        <span><BookOpenText size={14} aria-hidden="true" /> Part of the PyBe learning platform - story-first, Python by experience.</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
