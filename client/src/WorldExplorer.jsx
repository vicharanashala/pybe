import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Code2,
  Compass,
  Home,
  KeyRound,
  Lightbulb,
  Lock,
  MapPin,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import './village-messenger.css';
import VillageMessengerDashboard from './VillageMessengerDashboard';

const STORAGE_KEY = 'pybe-village-messenger-progress';

const scenes = [
  {
    id: 1,
    title: 'The Morning Delivery',
    chapter: 'Scene 01',
    phase: 'Story',
    concept: null,
    kind: 'story',
  },
  {
    id: 2,
    title: 'The Village Record',
    chapter: 'Scene 02',
    phase: 'Observe',
    concept: null,
    kind: 'observe',
  },
  {
    id: 3,
    title: 'The Chief’s Question',
    chapter: 'Scene 03',
    phase: 'Think',
    concept: null,
    kind: 'question',
  },
  {
    id: 4,
    title: 'The Pattern Hidden in the Book',
    chapter: 'Scene 04',
    phase: 'Discover',
    concept: null,
    kind: 'discover',
  },
  {
    id: 5,
    title: 'Give the Pattern a Name',
    chapter: 'Scene 05',
    phase: 'Reveal',
    concept: 'Dictionary',
    kind: 'reveal',
  },
  {
    id: 6,
    title: 'A New Villager Arrives',
    chapter: 'Scene 06',
    phase: 'Build',
    concept: 'Dictionary',
    kind: 'build',
  },
  {
    id: 7,
    title: 'The Missing Name',
    chapter: 'Scene 07',
    phase: 'Reason',
    concept: 'Dictionary',
    kind: 'missing',
  },
  {
    id: 8,
    title: 'Rebuild the Delivery Book',
    chapter: 'Scene 08',
    phase: 'Code',
    concept: 'Dictionary',
    kind: 'code',
  },
  {
    id: 9,
    title: 'The Festival Delivery Board',
    chapter: 'Scene 09',
    phase: 'Transfer',
    concept: 'Dictionary',
    kind: 'transfer',
  },
  {
    id: 10,
    title: 'The Messenger’s Lesson',
    chapter: 'Scene 10',
    phase: 'Reflect',
    concept: 'Dictionary',
    kind: 'reflection',
  },
];

const people = [
  { name: 'Aarav', house: 12, color: 'saffron', x: 13, y: 48 },
  { name: 'Meera', house: 27, color: 'violet', x: 40, y: 30 },
  { name: 'Kabir', house: 41, color: 'teal', x: 68, y: 51 },
];

const revealPairs = [
  { left: 'Aarav', right: '12', icon: '👤', target: '🏠' },
  { left: 'Meera', right: '27', icon: '👤', target: '🏠' },
  { left: 'Kabir', right: '41', icon: '👤', target: '🏠' },
];

const initialProgress = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
})();

function VillageScene() {
  return (
    <div className="vm-village-art" aria-hidden="true">
      <div className="vm-sun" />
      <div className="vm-mountain vm-mountain-left" />
      <div className="vm-mountain vm-mountain-right" />
      <div className="vm-cloud vm-cloud-1" />
      <div className="vm-cloud vm-cloud-2" />
      <div className="vm-ground" />

      <div className="vm-tree vm-tree-1"><span /><i /></div>
      <div className="vm-tree vm-tree-2"><span /><i /></div>
      <div className="vm-tree vm-tree-3"><span /><i /></div>

      <div className="vm-house vm-house-1">
        <div className="roof" />
        <div className="body"><span className="door" /><span className="window" /></div>
        <small>12</small>
      </div>
      <div className="vm-house vm-house-2">
        <div className="roof" />
        <div className="body"><span className="door" /><span className="window" /></div>
        <small>27</small>
      </div>
      <div className="vm-house vm-house-3">
        <div className="roof" />
        <div className="body"><span className="door" /><span className="window" /></div>
        <small>41</small>
      </div>

      <div className="vm-path vm-path-a" />
      <div className="vm-path vm-path-b" />

      <div className="vm-messenger">
        <div className="vm-messenger-head" />
        <div className="vm-messenger-body" />
        <div className="vm-messenger-bag"><Send size={15} /></div>
      </div>
    </div>
  );
}

function AddressBookVisual({ selectedName, onSelect, entries }) {
  return (
    <div className="vm-book-visual">
      <div className="vm-book-spine" />
      <div className="vm-book-page">
        <div className="vm-book-heading">
          <BookOpen size={17} />
          <span>Village Delivery Book</span>
        </div>
        <p className="vm-book-sub">Who lives where?</p>
        <div className="vm-book-rows">
          {entries.map((entry) => {
            const selected = selectedName === entry.name;
            return (
              <button
                key={entry.name}
                className={`vm-book-row ${selected ? 'selected' : ''}`}
                onClick={() => onSelect(entry.name)}
              >
                <span className="vm-row-name">{entry.name}</span>
                <ChevronRight size={14} />
                <span className="vm-row-house">House {entry.house}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PatternVisual({ flipped = false }) {
  return (
    <div className={`vm-pattern-visual ${flipped ? 'flipped' : ''}`}>
      <div className="vm-pattern-side">
        <div className="vm-pattern-title">A person</div>
        <div className="vm-pattern-items">
          <span>👤 Aarav</span>
          <span>👤 Meera</span>
          <span>👤 Kabir</span>
        </div>
      </div>
      <div className="vm-pattern-arrow"><ArrowRight /></div>
      <div className="vm-pattern-side right">
        <div className="vm-pattern-title">their house</div>
        <div className="vm-pattern-items">
          <span>🏠 12</span>
          <span>🏠 27</span>
          <span>🏠 41</span>
        </div>
      </div>
      <div className="vm-pattern-note">
        <KeyRound size={15} />
        <span>one thing helps you find the matching thing</span>
      </div>
    </div>
  );
}

function OptionButton({ selected, correct, showResult, children, onClick }) {
  let className = 'vm-option';
  if (selected) className += ' selected';
  if (showResult && correct) className += ' correct';
  if (showResult && selected && !correct) className += ' incorrect';
  return (
    <button className={className} onClick={onClick}>
      <span className="vm-option-dot" />
      <span>{children}</span>
      {showResult && correct && <CheckCircle2 size={18} />}
      {showResult && selected && !correct && <XCircle size={18} />}
    </button>
  );
}

function VillageMessengerStory({ onBackToDashboard, onBack, initialScene = 1 }) {
  const goBackToDashboard = onBackToDashboard || onBack;
  const [activeScene, setActiveScene] = useState(initialScene);
  const [completed, setCompleted] = useState(initialProgress);
  const [selectedName, setSelectedName] = useState('');
  const [matchPerson, setMatchPerson] = useState('');
  const [matchHouse, setMatchHouse] = useState('');
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [questionChecked, setQuestionChecked] = useState(false);
  const [discovered, setDiscovered] = useState([]);
  const [buildAction, setBuildAction] = useState('');
  const [missingAnswer, setMissingAnswer] = useState('');
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState(null);
  const [transferAnswer, setTransferAnswer] = useState('');
  const [transferStatus, setTransferStatus] = useState(null);
  const [reflection, setReflection] = useState('');

  const scene = scenes.find((item) => item.id === activeScene) || scenes[0];
  const progress = Math.round((completed.length / scenes.length) * 100);

  const entries = useMemo(() => {
    const base = people.map((person) => ({ ...person }));
    if (completed.includes(6)) base.push({ name: 'Riya', house: 18 });
    return base;
  }, [completed]);

  const markComplete = (id) => {
    setCompleted((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const canOpen = (id) => {
    if (id === 1) return true;
    return completed.includes(id - 1);
  };

  const resetSceneState = (id) => {
    if (id === 3) {
      setQuestionAnswer('');
      setQuestionChecked(false);
    }
    if (id === 4) {
      setDiscovered([]);
      setMatchPerson('');
      setMatchHouse('');
    }
    if (id === 6) setBuildAction('');
    if (id === 7) setMissingAnswer('');
    if (id === 8) {
      setCode('');
      setCodeStatus(null);
    }
    if (id === 9) {
      setTransferAnswer('');
      setTransferStatus(null);
    }
  };

  const nextScene = (force = false) => {
    const nextId = Math.min(activeScene + 1, scenes.length);
    if (!canOpen(nextId) && !force) return;
    resetSceneState(nextId);
    setActiveScene(nextId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseScene = (id) => {
    if (!canOpen(id)) return;
    resetSceneState(id);
    setActiveScene(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeStoryScene = () => {
    markComplete(1);
    nextScene(true);
  };

  const completeObserve = () => {
    if (selectedName === 'Meera') {
      markComplete(2);
      nextScene(true);
    }
  };

  const checkQuestion = () => {
    setQuestionChecked(true);
    if (questionAnswer === 'name') markComplete(3);
  };

  const connectDiscoveryPair = () => {
    if (!matchPerson || !matchHouse) return;
    const pair = revealPairs.find((item) => item.left === matchPerson);
    if (!pair) return;
    const isCorrect = pair.right === matchHouse;

    if (isCorrect) {
      setDiscovered((current) => (current.includes(matchPerson) ? current : [...current, matchPerson]));
      setMatchPerson('');
      setMatchHouse('');
    } else {
      setMatchHouse('wrong');
    }
  };

  const checkDiscover = () => {
    if (discovered.length === revealPairs.length) {
      markComplete(4);
      nextScene(true);
    }
  };

  const buildOptions = [
    { id: 'add', label: 'Add Riya and her house to the book', detail: 'Riya → House 18' },
    { id: 'ignore', label: 'Leave the new villager out', detail: 'No change' },
  ];

  const completeBuild = () => {
    if (buildAction === 'add') {
      markComplete(6);
      nextScene(true);
    }
  };

  const completeMissing = () => {
    if (missingAnswer === 'not-found') {
      markComplete(7);
      nextScene(true);
    }
  };

  const checkCode = () => {
    const normalized = code.toLowerCase().replace(/\s+/g, ' ');
    const hasDictionary = /\{[^}]*:[^}]*\}/s.test(code);
    const hasMeera = normalized.includes('"meera"') || normalized.includes("'meera'");
    const hasLookup = /\b\w+\s*\[\s*["']meera["']\s*\]/i.test(code);
    const hasPrint = /\bprint\s*\(/.test(code);
    const pass = hasDictionary && hasMeera && hasLookup && hasPrint;
    setCodeStatus(pass ? 'success' : 'retry');
    if (pass) markComplete(8);
  };

  const checkTransfer = () => {
    const pass = transferAnswer === 'dict';
    setTransferStatus(pass ? 'success' : 'retry');
    if (pass) markComplete(9);
  };

  const completeReflection = () => {
    if (reflection.trim().length >= 10) markComplete(10);
  };

  return (
    <main className="village-messenger-page">
      <div className="vm-background-orb vm-orb-a" />
      <div className="vm-background-orb vm-orb-b" />

      <header className="vm-topbar">
        <button className="vm-back-btn" onClick={goBackToDashboard}>
          <ArrowLeft size={18} />
          Back to Story Map
        </button>
        <div className="vm-brand">
          <div className="vm-brand-mark"><Compass size={19} /></div>
          <div>
            <strong>PyBe</strong>
            <span>Story Learning</span>
          </div>
        </div>
        <div className="vm-progress-mini">
          <span>{completed.length}/{scenes.length} scenes</span>
          <div className="vm-mini-track"><i style={{ width: `${progress}%` }} /></div>
        </div>
      </header>

      <section className="vm-shell">
        <aside className="vm-journey">
          <div className="vm-journey-head">
            <span className="vm-journey-kicker">THE VILLAGE MESSENGER</span>
            <h1>One village.<br /><em>One hidden idea.</em></h1>
            <p>Follow a messenger through a living story. The Python concept appears only after the pattern makes sense.</p>
          </div>

          <div className="vm-stepper">
            {scenes.map((item) => {
              const unlocked = canOpen(item.id);
              const done = completed.includes(item.id);
              const active = activeScene === item.id;
              return (
                <button
                  key={item.id}
                  className={`vm-step ${active ? 'active' : ''} ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                  onClick={() => chooseScene(item.id)}
                  disabled={!unlocked}
                >
                  <span className="vm-step-num">
                    {done ? <Check size={15} /> : !unlocked ? <Lock size={14} /> : item.id}
                  </span>
                  <span className="vm-step-copy">
                    <small>{item.phase}</small>
                    <strong>{item.title}</strong>
                  </span>
                  {active && <ChevronRight size={15} />}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="vm-content">
          <div className="vm-content-head">
            <div>
              <span className="vm-scene-badge"><Sparkles size={14} /> {scene.chapter} · {scene.phase}</span>
              <h2>{scene.title}</h2>
            </div>
            {scene.concept ? (
              <div className="vm-concept-chip"><Code2 size={15} /> {scene.concept}</div>
            ) : (
              <div className="vm-hidden-chip"><Lightbulb size={15} /> Hidden idea</div>
            )}
          </div>

          {scene.kind === 'story' && (
            <div className="vm-scene-grid">
              <div className="vm-copy-panel">
                <span className="vm-kicker">7:05 AM · CHANDRAPUR</span>
                <h3>The festival letters must reach the right homes.</h3>
                <p>
                  It is the morning of Chandrapur's annual festival. Hundreds of people are preparing to gather before noon, and you are the village's newest messenger.
                </p>
                <p>
                  Three important letters have arrived for <strong>Aarav, Meera, and Kabir</strong>. The envelopes show their names, but not their house numbers.
                </p>
                <div className="vm-deadline-card">
                  <span className="vm-deadline-icon">⏰</span>
                  <div><strong>Mission before noon</strong><span>Every letter must reach the correct home before the festival bell.</span></div>
                </div>
                <div className="vm-dialogue">
                  <MessageCircle size={18} />
                  <div><strong>Chief Raman</strong><span>“You do not need to memorize the whole village. I need you to notice how one clue helps you find its match.”</span></div>
                </div>
                <button className="vm-primary-btn" onClick={completeStoryScene}>
                  Walk into the village <ArrowRight size={18} />
                </button>
              </div>
              <div className="vm-visual-card vm-village-card">
                <VillageScene />
                <div className="vm-visual-caption"><MapPin size={15} /> Three residents · three destinations</div>
              </div>
            </div>
          )}

          {scene.kind === 'observe' && (
            <div className="vm-scene-grid">
              <div className="vm-visual-card vm-book-card">
                <AddressBookVisual selectedName={selectedName} onSelect={setSelectedName} entries={people} />
                {selectedName && (
                  <div className="vm-selection-callout">
                    <CheckCircle2 size={16} />
                    <span>{selectedName} lives at <strong>House {people.find((p) => p.name === selectedName)?.house}</strong>.</span>
                  </div>
                )}
              </div>
              <div className="vm-copy-panel">
                <span className="vm-kicker">LOOK CLOSER</span>
                <h3>The chief hands you the village book.</h3>
                <p>Every resident appears beside the house they belong to.</p>
                <p className="vm-question-text">Click <strong>Meera</strong>. What single clue helped you find her house?</p>
                <div className="vm-thought-box"><Lightbulb size={17} /><span>You did not need a map of the entire village. You used <strong>one piece of information</strong> to find its match.</span></div>
                <button className="vm-primary-btn" disabled={selectedName !== 'Meera'} onClick={completeObserve}>
                  Continue the investigation <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {scene.kind === 'question' && (
            <div className="vm-single-panel">
              <div className="vm-question-hero">
                <div className="vm-question-icon"><CircleHelp /></div>
                <span className="vm-kicker">THE CHIEF TESTS YOUR THINKING</span>
                <h3>“Suppose I tell you only a person's name. What should the messenger keep so they can quickly find that person's house?”</h3>
              </div>
              <div className="vm-options-grid">
                <OptionButton selected={questionAnswer === 'name'} correct showResult={questionChecked} onClick={() => setQuestionAnswer('name')}>
                  A record that links each person to their house
                </OptionButton>
                <OptionButton selected={questionAnswer === 'story'} correct={false} showResult={questionChecked} onClick={() => setQuestionAnswer('story')}>
                  A long story describing the whole village
                </OptionButton>
                <OptionButton selected={questionAnswer === 'random'} correct={false} showResult={questionChecked} onClick={() => setQuestionAnswer('random')}>
                  A pile of house numbers with no names
                </OptionButton>
              </div>
              {questionChecked && (
                <div className={`vm-feedback ${questionAnswer === 'name' ? 'success' : 'retry'}`}>
                  {questionAnswer === 'name' ? (
                    <><CheckCircle2 size={18} /><span>Exactly. You need a relationship: <strong>name → house</strong>. You are already thinking like a programmer.</span></>
                  ) : (
                    <><RotateCcw size={18} /><span>Think about the relationship the chief needs: one thing should help you find its matching thing.</span></>
                  )}
                </div>
              )}
              <button className="vm-primary-btn" disabled={!questionAnswer} onClick={() => questionChecked ? (questionAnswer === 'name' ? nextScene(true) : null) : checkQuestion()}>
                {questionChecked ? 'Reveal the pattern →' : 'Check my answer'}
              </button>
            </div>
          )}

          {scene.kind === 'discover' && (
            <div className="vm-single-panel">
              <div className="vm-discovery-copy">
                <span className="vm-kicker">DISCOVERY</span>
                <h3>Forget Python for a moment. Look at the story.</h3>
                <p>Match each person to the destination the village book gives them. When every pair is connected, the hidden shape appears.</p>
              </div>
              <div className="vm-matching-board">
                <div className="vm-match-column">
                  <span className="vm-match-label">PEOPLE</span>
                  {revealPairs.map((pair) => {
                    const active = discovered.includes(pair.left);
                    return (
                      <button
                        key={pair.left}
                        className={`vm-match-choice ${matchPerson === pair.left ? 'selected' : ''} ${active ? 'matched' : ''}`}
                        onClick={() => !active && setMatchPerson(pair.left)}
                        disabled={active}
                      >
                        <span>{pair.icon}</span><strong>{pair.left}</strong>
                        {active && <CheckCircle2 size={16} />}
                      </button>
                    );
                  })}
                </div>

                <div className="vm-match-connector">
                  <ArrowRight size={22} />
                  <span>connect</span>
                </div>

                <div className="vm-match-column">
                  <span className="vm-match-label">HOUSES</span>
                  {revealPairs.map((pair) => {
                    const active = discovered.includes(pair.left);
                    const wrong = matchHouse === 'wrong' && matchPerson;
                    return (
                      <button
                        key={pair.right}
                        className={`vm-match-choice house ${matchHouse === pair.right ? 'selected' : ''} ${wrong && matchHouse === pair.right ? 'wrong' : ''} ${active ? 'matched' : ''}`}
                        onClick={() => { setMatchHouse(pair.right); if (matchHouse === 'wrong') setMatchHouse(pair.right); }}
                        disabled={active}
                      >
                        <span>{pair.target}</span><strong>House {pair.right}</strong>
                        {active && <CheckCircle2 size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {matchHouse === 'wrong' && (
                <div className="vm-feedback retry"><RotateCcw size={18} /><span>That connection does not match the village book. Choose the house that belongs to <strong>{matchPerson}</strong>.</span></div>
              )}

              <div className="vm-match-action">
                <button className="vm-primary-btn secondary" disabled={!matchPerson || !matchHouse || matchHouse === 'wrong'} onClick={connectDiscoveryPair}>
                  Connect this pair <ArrowRight size={18} />
                </button>
                <span>{discovered.length} of {revealPairs.length} connections made</span>
              </div>

              {discovered.length === revealPairs.length && (
                <div className="vm-pattern-reveal">
                  <PatternVisual />
                </div>
              )}

              <button className="vm-primary-btn" disabled={discovered.length !== revealPairs.length} onClick={checkDiscover}>
                Name the hidden structure <ArrowRight size={18} />
              </button>
            </div>
          )}

          {scene.kind === 'reveal' && (
            <div className="vm-reveal-panel">
              <div className="vm-reveal-icon"><KeyRound size={30} /></div>
              <span className="vm-kicker">THE REVEAL</span>
              <h3>You just discovered a <em>dictionary</em>.</h3>
              <p className="vm-lead">A Python dictionary is built for situations where you use one piece of information to find another: <strong>key → value</strong>.</p>
              <div className="vm-code-map">
                <div className="vm-story-map">
                  <span>Story</span>
                  <strong>Meera</strong>
                  <i>→</i>
                  <strong>House 27</strong>
                </div>
                <div className="vm-code-map-arrow"><ArrowRight /></div>
                <pre>{`houses = {\n    "Aarav": 12,\n    "Meera": 27,\n    "Kabir": 41\n}`}</pre>
              </div>
              <div className="vm-reveal-rows">
                <div><span className="label">KEY</span><strong>"Meera"</strong><small>the thing you know</small></div>
                <div><span className="label">VALUE</span><strong>27</strong><small>the matching information</small></div>
                <div><span className="label">LOOKUP</span><strong>houses["Meera"]</strong><small>ask the book for Meera's value</small></div>
              </div>
              <div className="vm-feedback success"><CheckCircle2 size={18} /><span>The Python word came <strong>after</strong> the idea. You already understood the relationship.</span></div>
              <button className="vm-primary-btn" onClick={() => { markComplete(5); nextScene(true); }}>
                Put it to work <ArrowRight size={18} />
              </button>
            </div>
          )}

          {scene.kind === 'build' && (
            <div className="vm-scene-grid">
              <div className="vm-copy-panel">
                <span className="vm-kicker">STORY CONTINUES</span>
                <h3>A new villager arrives before lunch.</h3>
                <p>Riya moves into <strong>House 18</strong>. The village book needs one new entry.</p>
                <div className="vm-character-card"><div className="vm-character-avatar">👩🏽‍🌾</div><div><strong>Riya</strong><span>New resident · House 18</span></div><MapPin size={19} /></div>
                <p className="vm-question-text">What should the messenger do?</p>
                <div className="vm-options-stack">
                  {buildOptions.map((item) => (
                    <OptionButton key={item.id} selected={buildAction === item.id} correct={item.id === 'add'} showResult={false} onClick={() => setBuildAction(item.id)}>
                      <strong>{item.label}</strong><small>{item.detail}</small>
                    </OptionButton>
                  ))}
                </div>
                <button className="vm-primary-btn" disabled={!buildAction} onClick={completeBuild}>
                  Update the village book <ArrowRight size={18} />
                </button>
              </div>
              <div className="vm-visual-card vm-map-card">
                <VillageScene />
                <div className="vm-map-pulse"><MapPin size={16} /><span>New destination: <strong>House 18</strong></span></div>
              </div>
            </div>
          )}

          {scene.kind === 'missing' && (
            <div className="vm-single-panel">
              <div className="vm-missing-head">
                <div className="vm-missing-visual"><Users size={38} /></div>
                <div><span className="vm-kicker">ONE MORE PROBLEM</span><h3>The chief asks for “Dev”. But Dev is not in the village book.</h3></div>
              </div>
              <p className="vm-lead small">A good messenger should not invent an address just because the name was requested.</p>
              <div className="vm-options-grid two">
                <OptionButton selected={missingAnswer === 'invent'} correct={false} showResult={missingAnswer !== ''} onClick={() => setMissingAnswer('invent')}>
                  Invent an address so the delivery can continue
                </OptionButton>
                <OptionButton selected={missingAnswer === 'not-found'} correct showResult={missingAnswer !== ''} onClick={() => setMissingAnswer('not-found')}>
                  Report that Dev has no recorded address
                </OptionButton>
              </div>
              {missingAnswer && (
                <div className={`vm-feedback ${missingAnswer === 'not-found' ? 'success' : 'retry'}`}>
                  {missingAnswer === 'not-found' ? <><CheckCircle2 size={18} /><span>Right. A lookup should respect the information the book actually contains.</span></> : <><RotateCcw size={18} /><span>Do not create information that was never recorded. The safer choice is to report that the name is missing.</span></>}
                </div>
              )}
              {missingAnswer === 'not-found' && (
                <div className="vm-safe-lookup">
                  <span className="vm-kicker">A safer lookup</span>
                  <pre>{`houses.get("Dev")`}</pre>
                  <small>If the name is missing, <code>.get()</code> can return <strong>None</strong> instead of inventing a value.</small>
                </div>
              )}
              <button className="vm-primary-btn" disabled={!missingAnswer} onClick={completeMissing}>Continue →</button>
            </div>
          )}

          {scene.kind === 'code' && (
            <div className="vm-code-lab">
              <div className="vm-lab-intro">
                <span className="vm-kicker">INTERACTIVE CODING</span>
                <h3>Can you rebuild the village delivery book?</h3>
                <p>The festival deadline is getting closer. Use what you discovered in the story to build the book yourself, then print Meera's house number.</p>
              </div>
              <div className="vm-lab-grid">
                <div className="vm-starter-card">
                  <div className="vm-starter-head"><BookOpen size={17} /><strong>Story evidence</strong></div>
                  <div className="vm-evidence-row"><span>👤 Aarav</span><b>→</b><span>🏠 12</span></div>
                  <div className="vm-evidence-row"><span>👤 Meera</span><b>→</b><span>🏠 27</span></div>
                  <div className="vm-evidence-row"><span>👤 Kabir</span><b>→</b><span>🏠 41</span></div>
                  <div className="vm-tip"><Lightbulb size={16} /><span>Use names as keys and house numbers as values.</span></div>
                </div>
                <div className="vm-editor-card">
                  <div className="vm-editor-head"><span><Code2 size={16} /> delivery_book.py</span><span>Python</span></div>
                  <textarea
                    value={code}
                    onChange={(event) => { setCode(event.target.value); setCodeStatus(null); }}
                    spellCheck="false"
                    placeholder={`houses = {\n    "Aarav": 12,\n    "Meera": 27,\n    "Kabir": 41\n}\n\nprint(houses["Meera"])`}
                  />
                  <button className="vm-run-btn" onClick={checkCode}><Send size={17} /> Check code</button>
                  {codeStatus && (
                    <div className={`vm-feedback ${codeStatus === 'success' ? 'success' : 'retry'}`}>
                      {codeStatus === 'success' ? <><CheckCircle2 size={18} /><span>Perfect. The story relationship became working Python: <strong>Meera → 27</strong>.</span></> : <><RotateCcw size={18} /><span>Make sure you create a dictionary, include Meera, look up <strong>houses["Meera"]</strong>, and print the result.</span></>}
                    </div>
                  )}
                </div>
              </div>
              <button className="vm-primary-btn" disabled={!completed.includes(8)} onClick={() => nextScene(true)}>Take the idea outside the village <ArrowRight size={18} /></button>
            </div>
          )}

          {scene.kind === 'transfer' && (
            <div className="vm-single-panel">
              <div className="vm-transfer-layout">
                <div className="vm-transfer-story">
                  <span className="vm-kicker">FINAL FESTIVAL CHECK</span>
                  <h3>The chief gives you the delivery board.</h3>
                  <p>The last letters are being delivered. Instead of house numbers, the board now records each person's <strong>delivery status</strong>.</p>
                  <div className="vm-register">
                    <div><span>Aarav</span><b>→</b><strong>Delivered</strong></div>
                    <div><span>Meera</span><b>→</b><strong>Pending</strong></div>
                    <div><span>Kabir</span><b>→</b><strong>Delivered</strong></div>
                    <div><span>Riya</span><b>→</b><strong>Pending</strong></div>
                  </div>
                  <p>Chief Raman asks: <strong>“The information changed, but what relationship stayed the same?”</strong></p>
                <p className="vm-question-text">Which structure naturally represents <strong>person → current status</strong>?</p>
                </div>
                <div className="vm-transfer-choice">
                  <OptionButton selected={transferAnswer === 'list'} correct={false} showResult={transferStatus !== null} onClick={() => setTransferAnswer('list')}>A list of delivery statuses only</OptionButton>
                  <OptionButton selected={transferAnswer === 'dict'} correct showResult={transferStatus !== null} onClick={() => setTransferAnswer('dict')}>A dictionary mapping each person to a status</OptionButton>
                  <OptionButton selected={transferAnswer === 'text'} correct={false} showResult={transferStatus !== null} onClick={() => setTransferAnswer('text')}>One sentence containing every person's status</OptionButton>
                  {transferStatus && (
                    <div className={`vm-feedback ${transferStatus === 'success' ? 'success' : 'retry'}`}>
                      {transferStatus === 'success' ? <><CheckCircle2 size={18} /><span>Exactly. The village changed the <strong>value</strong>, but the key → value relationship stayed the same.</span></> : <><RotateCcw size={18} /><span>Look for the same pattern you discovered earlier: a person's name should lead you directly to matching information.</span></>}
                    </div>
                  )}
                  {transferStatus === 'success' && (
                    <div className="vm-transfer-code"><pre>{`delivery = {
    "Aarav": "Delivered",
    "Meera": "Pending",
    "Kabir": "Delivered",
    "Riya": "Pending"
}`}</pre></div>
                  )}
                  <button className="vm-primary-btn" disabled={!transferAnswer} onClick={checkTransfer}>Check the board</button>
                </div>
              </div>
              <div className="vm-transfer-takeaway"><Sparkles size={16} /><span><strong>The story changed, the mental model did not.</strong> A useful concept should work when the information changes.</span></div>
              <button className="vm-primary-btn secondary" disabled={!completed.includes(9)} onClick={() => nextScene(true)}>Finish the journey <ArrowRight size={18} /></button>
            </div>
          )}

          {scene.kind === 'reflection' && (
            <div className="vm-complete-panel">
              <div className="vm-trophy"><Trophy size={32} /></div>
              <span className="vm-kicker">MISSION COMPLETE</span>
              <h3>You started with a village book.<br /><em>You ended with a Python idea.</em></h3>
              <div className="vm-reflection-map">
                <div><span>Story</span><strong>Person → House</strong></div>
                <ArrowRight />
                <div><span>Pattern</span><strong>Key → Value</strong></div>
                <ArrowRight />
                <div><span>Python</span><strong>Dictionary</strong></div>
              </div>
              <div className="vm-reflection-box">
                <label>Explain the idea in your own words. When is this relationship useful?</label>
                <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="A dictionary is useful when I need to..." />
                <small className="vm-reflection-prompt">One more thought: name an everyday situation where one thing helps you find another.</small>
                <button className="vm-primary-btn" onClick={completeReflection}>Save reflection <Check size={18} /></button>
              </div>
              {completed.includes(10) && (
                <div className="vm-finish-note"><CheckCircle2 size={18} /><span>Dictionary discovered. Story understood. Idea transferred.</span></div>
              )}
            </div>
          )}

          <footer className="vm-footer-nav">
            <button onClick={() => chooseScene(Math.max(1, activeScene - 1))} disabled={activeScene === 1}>
              <ArrowLeft size={16} /> Previous
            </button>
            <span>Scene {activeScene} of {scenes.length}</span>
            <button onClick={nextScene} disabled={activeScene === scenes.length || !completed.includes(activeScene)}>
              Next <ArrowRight size={16} />
            </button>
          </footer>
        </section>
      </section>
    </main>
  );
}

export default function WorldExplorer({ onBackToDashboard, onBack }) {
  const goBackToPyBe = onBackToDashboard || onBack || (() => {});
  const [storyOpen, setStoryOpen] = useState(false);
  const [startingScene, setStartingScene] = useState(1);

  if (!storyOpen) {
  return (
    <VillageMessengerDashboard
      onStartStory={(sceneId) => {
        const safeSceneId =
          typeof sceneId === 'number' ? sceneId : 1;

        setStartingScene(safeSceneId);
        setStoryOpen(true);
      }}
      onBackToDashboard={goBackToPyBe}
    />
  );
}
  return (
    <VillageMessengerStory
      initialScene={startingScene}
      onBackToDashboard={() => setStoryOpen(false)}
    />
  );
}
