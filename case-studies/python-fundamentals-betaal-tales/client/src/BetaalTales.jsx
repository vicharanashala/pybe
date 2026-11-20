import storyData from '../../server/src/data/stories.json';
import {readProgress,saveProgress} from '../../../../library/learning/core.mjs';
import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Sparkles } from 'lucide-react';
import { computeProgress } from './lib/progress';
import BetaalLogo from './components/BetaalLogo';
import Intro from './components/Intro';
import StoryMap from './components/StoryMap';
import StoryPlayer from './components/StoryPlayer';

const NAME_KEY = 'pybe-betaal-learner-name';
const INTRO_KEY = 'pybe-betaal-intro-seen';

export default function BetaalTales({onComplete}) {
  const stories = storyData;
  const [sessions, setSessions] = useState(()=>readProgress(localStorage,'betaal-tales').completed.map(key=>{const [storyId,event]=key.split('/');return {storyId,event,passed:true};}));
  const [selected, setSelected] = useState(null);
  const [learnerName, setLearnerName] = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !localStorage.getItem(INTRO_KEY);
    } catch {
      return false;
    }
  });

  const progress = useMemo(() => computeProgress(stories, sessions), [stories, sessions]);

  useEffect(()=>{if(stories.length&&progress.completed===stories.length)onComplete?.();},[progress.completed,stories.length,onComplete]);

  useEffect(() => {
    localStorage.setItem(NAME_KEY, learnerName);
  }, [learnerName]);

  function startStory(story) {setSelected(story);}
  function recordSession(event) {
    const key=selected.id+'/'+event.event;
    const completed=new Set(readProgress(localStorage,'betaal-tales').completed);
    completed.add(key);saveProgress(localStorage,'betaal-tales',{completed:[...completed]});
    setSessions([...completed].map(key=>{const [storyId,event]=key.split('/');return {storyId,event,passed:true};}));
  }

  function exitPlayer() {
    setSelected(null);
  }

  function finishIntro() {
    try {
      localStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* intro plays again if storage is unavailable */
    }
    setShowIntro(false);
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

        </div>
      </header>


      {showIntro ? (
        <Intro onDone={finishIntro} />
      ) : selected ? (
        <StoryPlayer
          story={selected}
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

