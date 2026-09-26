import React, { useEffect, useState } from 'react';
import StoryLibrary from './StoryLibrary';
import StoryPanels from './StoryPanels';
import ConceptBridge from './ConceptBridge';
import Quiz from './Quiz';
import './stories.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

const PHASES = ['story', 'bridge', 'quiz'];
const PHASE_LABEL = { story: 'Story', bridge: 'Bridge', quiz: 'Questions' };

// Two tabs over one corpus. The server splits them by the story's `collection` field.
const COLLECTIONS = [
  { id: 'folk', label: 'Folk tales' },
  { id: 'real-world', label: 'Real world' }
];

export default function StoryBridge({ learnerName = 'Guest learner' }) {
  const [collection, setCollection] = useState('folk');
  const [stories, setStories] = useState([]);
  const [progress, setProgress] = useState(null);
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState('story');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('loading');
  // storyId the learner swapped away from, or null. Lives here rather than in Quiz
  // because Quiz only knows about answers.
  const [swappedFrom, setSwappedFrom] = useState(null);
  // True once the learner has seen graded answers for this story and pressed "Try again".
  const [isRetry, setIsRetry] = useState(false);

  const rootClass = collection === 'real-world' ? 'sb-root is-real' : 'sb-root';

  async function loadLibrary() {
    const query = `?collection=${collection}`;
    const [list, prog] = await Promise.all([
      api(`/stories${query}`),
      api(`/stories/progress${query}`)
    ]);
    setStories(list);
    setProgress(prog);
    setStatus('ready');
  }

  useEffect(() => {
    setStatus('loading');
    loadLibrary().catch(() => setStatus('error'));
  }, [collection]);

  // `stories` holds only the current collection's summaries, so a sibling can never be a
  // story from the other tab even though the two tabs share concept keys.
  const sibling = active
    ? stories.find((item) => item.concept === active.concept && item.storyId !== active.storyId)
    : null;

  async function openStory(storyId, cameFrom = null) {
    setStatus('loading');
    try {
      const story = await api(`/stories/${storyId}`);
      setActive(story);
      setSwappedFrom(cameFrom);
      setIsRetry(false);
      setPhase('story');
      setResult(null);
      setStatus('ready');
      window.scrollTo({ top: 0 });
    } catch {
      setStatus('error');
    }
  }

  function goTo(next) {
    setPhase(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitQuiz(answers) {
    const body = { learnerName, answers };
    if (swappedFrom) body.swappedFrom = swappedFrom;
    if (isRetry) body.retry = true;
    const attempt = await api(`/stories/${active.storyId}/attempt`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    setResult(attempt);
    setProgress(await api(`/stories/progress?collection=${collection}`));
  }

  function retryQuiz() {
    setResult(null);
    setIsRetry(true);
  }

  async function closeStory() {
    setActive(null);
    // Clear the swap flag on the way out, so a later unrelated attempt is not
    // mislabelled as having come through a sibling.
    setSwappedFrom(null);
    setIsRetry(false);
    setResult(null);
    setPhase('story');
    await loadLibrary().catch(() => setStatus('error'));
    window.scrollTo({ top: 0 });
  }

  const switcher = (
    <nav className="sb-collection" aria-label="Choose a collection">
      {COLLECTIONS.map((item) => (
        <button
          key={item.id}
          className={item.id === collection ? 'sb-collection-tab is-on' : 'sb-collection-tab'}
          aria-pressed={item.id === collection}
          onClick={() => setCollection(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  if (status === 'error') {
    return (
      <div className={rootClass}>
        <p className="sb-empty">
          The story service is not answering. Start the API with <code>npm run dev</code> and
          reload.
        </p>
      </div>
    );
  }

  if (status === 'loading' && !active) {
    return (
      <div className={rootClass}>
        {switcher}
        <p className="sb-empty">Fetching the stories…</p>
      </div>
    );
  }

  if (!active) {
    return (
      <div className={rootClass}>
        {switcher}
        <StoryLibrary
          key={collection}
          collection={collection}
          stories={stories}
          progress={progress}
          onOpen={openStory}
        />
      </div>
    );
  }

  return (
    <div className={rootClass}>
      <nav className="sb-progress" aria-label="Progress through this story">
        <button className="sb-back" onClick={closeStory}>
          All stories
        </button>
        <ol>
          {PHASES.map((item, index) => (
            <li
              key={item}
              className={
                item === phase ? 'is-here' : PHASES.indexOf(phase) > index ? 'is-done' : ''
              }
            >
              <span>{PHASE_LABEL[item]}</span>
            </li>
          ))}
        </ol>
        <span className="sb-progress-concept">{active.conceptLabel}</span>
      </nav>

      {phase === 'story' && (
        <>
          <StoryPanels story={active} onContinue={() => goTo('bridge')} />
          {sibling && (
            <p className="sb-swap">
              Don't know this one? The same idea, told as{' '}
              <button
                className="sb-swap-link"
                onClick={() => openStory(sibling.storyId, active.storyId)}
              >
                {sibling.title}
              </button>
              .
            </p>
          )}
        </>
      )}
      {phase === 'bridge' && <ConceptBridge story={active} onContinue={() => goTo('quiz')} />}
      {phase === 'quiz' && (
        <Quiz
          story={active}
          result={result}
          onSubmit={submitQuiz}
          onRetry={retryQuiz}
          onFinish={closeStory}
        />
      )}
    </div>
  );
}
