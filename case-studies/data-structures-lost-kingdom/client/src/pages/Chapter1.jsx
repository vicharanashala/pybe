import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { getChapter } from '../data/chapters.js';

// Shared components (kept from existing codebase)
import FillBlank         from '../components/FillBlank.jsx';
import QuizCard          from '../components/QuizCard.jsx';
import CodeChallenge     from '../components/CodeChallenge.jsx';
import AchievementBadge  from '../components/AchievementBadge.jsx';
import ChapterNavigation from '../components/ChapterNavigation.jsx';

// Lists-specific components
import BackpackVisual   from '../components/lists/BackpackVisual.jsx';
import StoryChallenge   from '../components/lists/StoryChallenge.jsx';
import PositionSelector from '../components/lists/PositionSelector.jsx';
import DiscoveryReveal  from '../components/lists/DiscoveryReveal.jsx';
import MatchingActivity from '../components/lists/MatchingActivity.jsx';
import SliceSelector    from '../components/lists/SliceSelector.jsx';
import IterationPlayer  from '../components/lists/IterationPlayer.jsx';
import CodeMasteryHub   from '../components/lists/CodeMasteryHub.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Chapter1 — 14-stage Python Lists adventure (Story First, Code Mastery at End)
// ─────────────────────────────────────────────────────────────────────────────
export default function Chapter1({ progress, onComplete, onNavigate, initialScene = 0 }) {
  const chapter = getChapter('chapter1');
  const { color, colorDim, colorGlow, scenes, initialBackpack, conceptBridges = {} } = chapter;

  // ── State ─────────────────────────────────────────────────────────────────
  const [sceneIdx,    setSceneIdx]    = useState(() => {
    const init = Number(initialScene);
    return !isNaN(init) ? Math.max(0, Math.min(init, (scenes?.length || 1) - 1)) : 0;
  });
  const [subStep,     setSubStep]     = useState(0);  // within practice suite (0=match, 1=fill, 2=quiz, 3=code, 4=final)
  const [backpack,    setBackpack]    = useState([...initialBackpack]);
  const [showBadge,   setShowBadge]   = useState(false);
  const [score,       setScore]       = useState({ fill: null, quiz: null });

  // Scroll to top when scene changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sceneIdx]);

  // If initialScene prop updates (e.g. user clicked a specific Level card on Landing)
  useEffect(() => {
    if (typeof initialScene === 'number' && scenes?.length > 0) {
      const clamped = Math.max(0, Math.min(initialScene, scenes.length - 1));
      setSceneIdx(clamped);
    }
  }, [initialScene, scenes?.length]);

  // ── Scene 6 (Mutability) state — lifted from IIFE to satisfy Rules of Hooks ─
  const [mutChosen,   setMutChosen]   = useState(null);
  const [mutRevealed, setMutRevealed] = useState(false);

  // ── Scene 7 (Length) state — lifted from IIFE to satisfy Rules of Hooks ────
  const [lenChosen,   setLenChosen]   = useState(null);
  const [lenRevealed, setLenRevealed] = useState(false);
  // Stable options shuffle — recomputed only when the scene changes
  const lenOptions = useMemo(() => {
    const n = backpack.length;
    return [n - 1, n, n + 1, n + 2].sort(() => Math.random() - 0.5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIdx]);

  const safeSceneIdx = Math.max(0, Math.min(sceneIdx, (scenes?.length || 1) - 1));
  const currentScene = scenes[safeSceneIdx] || scenes[0];
  const hasBridge    = Boolean(conceptBridges[currentScene?.id]);
  const progressPct  = Math.round((safeSceneIdx / (scenes?.length || 1)) * 100);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setSceneIdx((i) => (i < scenes.length - 1 ? i + 1 : i));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scenes.length]);

  const goBack = useCallback(() => {
    setSceneIdx((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Backpack mutations (reflect story actions) ────────────────────────────
  function addToBackpack(newItem) {
    setBackpack((prev) => {
      // Avoid duplicate adds if user re-clicks
      if (prev.some((it) => it.id === newItem.id)) return prev;
      return [...prev, newItem];
    });
  }

  function removeFromBackpack(itemId) {
    setBackpack((prev) => prev.filter((it) => it.id !== itemId));
  }

  function replaceInBackpack(itemId, newItem) {
    setBackpack((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...newItem } : it)));
  }

  // ── Scene choice handlers ──────────────────────────────────────────────────
  function handleAddItemChoice(choice) {
    if (choice.correct) {
      addToBackpack(chapter.storyScenes.add_item.newItem);
    }
  }

  function handleRemoveItemChoice(choice) {
    if (choice.correct) {
      removeFromBackpack(chapter.storyScenes.remove_item.removingItemId);
    }
  }

  function handleMutabilitySelect(option) {
    if (option.correct) {
      replaceInBackpack(chapter.mutabilityScene.replacingItemId, {
        id: option.id,
        icon: option.icon,
        label: option.label,
      });
    }
  }

  function handleFillComplete(correct, total) {
    setScore((s) => ({ ...s, fill: { correct, total } }));
    setSubStep(2); // move to Quiz
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleQuizComplete(correct, total) {
    setScore((s) => ({ ...s, quiz: { correct, total } }));
    setSubStep(3); // move to Code Challenge
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleChallengeComplete() {
    setSubStep(4); // move to Final Challenge
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFinalComplete() {
    onComplete({ xp: chapter.xp, score });
    setShowBadge(true);
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="chapter-page"
      style={{
        '--chapter-color': color,
        '--chapter-color-dim': colorDim,
        '--chapter-glow': colorGlow,
      }}
    >
      {/* ── Chapter Banner ─────────────────────────────────────────────────── */}
      <div className="chapter-banner">
        <div className="chapter-banner-bg" />
        <div className="chapter-banner-content">
          <div className="chapter-number-label">Chapter 1 · The Packing Problem</div>
          <span className="chapter-banner-emoji" role="img" aria-label="backpack">🎒</span>
          <h1 className="chapter-banner-title">{chapter.title}</h1>
          <p className="chapter-banner-subtitle">{chapter.subtitle}</p>
        </div>
      </div>

      {/* ── Step Progress Bar ─────────────────────────────────────────────── */}
      <div className="step-progress-wrap">
        <div className="step-progress-inner">
          <div className="step-progress-track">
            <div className="step-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="step-dots" aria-label="Adventure scenes">
            {scenes.map((scene, i) => {
              let cls = 'step-dot';
              if (i < safeSceneIdx)      cls += ' done';
              else if (i === safeSceneIdx) cls += ' current';
              return (
                <button
                  key={scene.id}
                  className={cls}
                  onClick={() => {
                    setSceneIdx(i);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title={`Jump to Part ${i + 1}: ${scene.label}`}
                  aria-label={`Part ${i + 1}: ${scene.label}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                />
              );
            })}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Part {safeSceneIdx + 1} of {scenes.length} — <em>{currentScene?.label || ''}</em>
          </div>
        </div>
      </div>

      {/* ── Scene Content ─────────────────────────────────────────────────── */}
      <div className="chapter-content">

        {/* ── SCENE 1: Welcome ─────────────────────────────────────────── */}
        {currentScene.id === 'welcome' && (
          <div className="adventure-scene">
            <div className="scene-hero">
              <div className="scene-hero__orb" style={{ background: colorGlow }} aria-hidden="true" />
              <div className="scene-hero__emoji" role="img" aria-label="backpack">🎒</div>
              <h2 className="scene-hero__title">Setting Off</h2>
              <p className="scene-hero__sub">A simple day on the trail…</p>
              <div className="scene-story-card">
                <p>
                  You are getting ready to go on a hike in the woods.
                  At first, you only have two items in your hands: a <em>Torch</em> and a <em>Water Bottle</em>.
                </p>
                <p>
                  Holding two things is easy. One in your left hand, one in your right hand.
                  But what happens when the journey gets longer and you need 10 or 20 things?
                </p>
                <p>
                  Let's visit the trail shop to pick up supplies!
                </p>
              </div>
            </div>
            <div className="scene-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={goNext}
                id="start-adventure-btn"
                style={{ background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.2))` }}
              >
                Go to the Shop →
              </button>
            </div>
          </div>
        )}

        {/* ── SCENE 2: The Mess of 10 Pockets ───────────────────────────── */}
        {currentScene.id === 'the_pain' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">⛺ Too Many Pockets</h2>
              <p>{chapter.painScene.situation}</p>
            </div>

            <div className="scene-observation-card" style={{ borderColor: `${color}44`, marginBottom: '20px' }}>
              <div className="scene-observation-card__icon" role="img" aria-hidden="true">🧥</div>
              <div>
                <strong>Items Scattered Everywhere:</strong>
                <p style={{ margin: '4px 0 8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Imagine stuffing all your supplies into 10 separate pockets all over your clothes:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Pocket 1: Torch 🔦', 'Pocket 2: Water 💧', 'Pocket 3: Map 🗺️', 'Pocket 4: Compass 🧭', 'Pocket 5: Food 🍎', 'Pocket 6: Rope 🪢', 'Pocket 7: Blanket 🧶', 'Pockets 8 to 10... 😵‍💫'].map((label, idx) => (
                    <span key={idx} style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontSize: '0.86rem',
                      color: idx === 7 ? '#ff7b72' : 'var(--text-primary)'
                    }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <StoryChallenge
              question={chapter.painScene.question}
              choices={chapter.painScene.choices}
              insight={chapter.painScene.insight}
              onComplete={goNext}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 3: One Single Bag (meet_backpack) ──────────────────── */}
        {currentScene.id === 'meet_backpack' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">🎒 One Single Bag</h2>
              <p>
                Instead of stuffing 10 messy pockets, you put all your items together
                into <strong>one bag</strong>, lined up in a neat row:
              </p>
            </div>

            <BackpackVisual
              items={backpack}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <div className="scene-observation-card" style={{ borderColor: `${color}44` }}>
              <div className="scene-observation-card__icon" role="img" aria-hidden="true">👁️</div>
              <div>
                <strong>Notice how neat this is:</strong>
                <p>
                  All your supplies stay together in one line.
                  Book is first, Water Bottle is second, and so on.
                  Now you only have to look in ONE place!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={goNext}
                style={{ background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.25))` }}
              >
                Continue on the Trail →
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 4: Add an Item (append) ────────────────────────────── */}
        {currentScene.id === 'add_item' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">
                🧭 You Found Something!
              </h2>
              <p>{chapter.storyScenes.add_item.situation}</p>
            </div>

            <BackpackVisual
              items={backpack}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <StoryChallenge
              question={chapter.storyScenes.add_item.question}
              choices={chapter.storyScenes.add_item.choices}
              insight={chapter.storyScenes.add_item.insight}
              onChoiceSelected={handleAddItemChoice}
              onComplete={goNext}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 5: Discarding Ruined Gear (remove_item) ─────────────── */}
        {currentScene.id === 'remove_item' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">💦 Ruined Supplies!</h2>
              <p>{chapter.storyScenes.remove_item.situation}</p>
            </div>

            <BackpackVisual
              items={backpack}
              highlightId={chapter.storyScenes.remove_item.removingItemId}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <StoryChallenge
              question={chapter.storyScenes.remove_item.question}
              choices={chapter.storyScenes.remove_item.choices}
              insight={chapter.storyScenes.remove_item.insight}
              onChoiceSelected={handleRemoveItemChoice}
              onComplete={goNext}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 6: Indexing ─────────────────────────────────────────── */}
        {currentScene.id === 'indexing' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">🏛️ The Forest Guardian Speaks…</h2>
              <p>
                At the forest gate, a guardian asks: <em>"What is the FIRST item in your backpack?
                What is the SECOND item? Prove you know the exact order of your supplies!"</em>
              </p>
            </div>

            <PositionSelector
              items={backpack}
              targetIndex={1}
              onComplete={goNext}
              chapterColor={color}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 7: Mutability ───────────────────────────────────────── */}
        {currentScene.id === 'mutability' && (() => {
          const mut = chapter.mutabilityScene;

          function handleOptionClick(option) {
            if (mutRevealed) return;
            setMutChosen(option);
            setMutRevealed(true);
            handleMutabilitySelect(option);
          }

          return (
            <div className="adventure-scene">
              <div className="scene-story-card">
                <h2 className="scene-story-card__title">🔄 Time for a Swap!</h2>
                <p>{mut.situation}</p>
              </div>

              <BackpackVisual
                items={backpack}
                highlightId={mut.replacingItemId}
                chapterColor={color}
                chapterGlow={colorGlow}
              />

              <div className="story-challenge" style={{ '--chapter-color': color }}>
                <div className="story-challenge__question">
                  <span role="img" aria-hidden="true">🔄</span>
                  <p>{mut.question}</p>
                </div>

                <div className="story-challenge__choices">
                  {mut.options.map((opt) => {
                    let cls = 'story-choice-btn';
                    if (mutRevealed) {
                      if (opt.correct)                 cls += ' story-choice-btn--correct';
                      else if (opt.id === mutChosen?.id) cls += ' story-choice-btn--incorrect';
                      else                              cls += ' story-choice-btn--dimmed';
                    }
                    return (
                      <button
                        key={opt.id}
                        className={cls}
                        onClick={() => handleOptionClick(opt)}
                        disabled={mutRevealed}
                        style={{ '--card-accent': color }}
                      >
                        <span className="story-choice-btn__icon" role="img" aria-hidden="true">{opt.icon}</span>
                        <span className="story-choice-btn__label">{opt.label}</span>
                        {mutRevealed && opt.correct && <span className="story-choice-btn__badge">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {mutRevealed && (
                  <>
                    <div className={`feedback-banner ${mutChosen?.correct ? 'success' : 'error'}`} style={{ marginTop: '16px' }}>
                      <span className="feedback-icon">{mutChosen?.correct ? '🎉' : '💡'}</span>
                      <div className="feedback-text">
                        <strong>{mutChosen?.correct ? 'Great swap!' : 'The Flask is the right choice!'}</strong>
                        <span> {mutChosen?.feedback || mut.options.find(o => o.correct)?.feedback}</span>
                      </div>
                    </div>

                    <div className="scene-observation-card" style={{ borderColor: `${color}44`, marginTop: '16px' }}>
                      <div className="scene-observation-card__icon" role="img" aria-hidden="true">💡</div>
                      <div>
                        <strong>Core Intuition:</strong>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>{mut.insight}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={goNext}
                        style={{ background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.25))` }}
                      >
                        Continue with Sturdy Gear →
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
                <button className="btn btn-ghost" onClick={goBack}>← Back</button>
              </div>
            </div>
          );
        })()}

        {/* ── SCENE 8: Length Tally ────────────────────────────────────── */}
        {currentScene.id === 'length' && (() => {
          const ls = chapter.lengthScene;
          const actualCount = backpack.length;

          function handlePick(n) {
            if (lenRevealed) return;
            setLenChosen(n);
            setLenRevealed(true);
          }

          return (
            <div className="adventure-scene">
              <div className="scene-story-card">
                <h2 className="scene-story-card__title">👹 The Troll's Challenge!</h2>
                <p>{ls.situation}</p>
              </div>

              <BackpackVisual items={backpack} chapterColor={color} chapterGlow={colorGlow} />

              <div className="story-challenge" style={{ '--chapter-color': color }}>
                <div className="story-challenge__question">
                  <span role="img" aria-hidden="true">🔢</span>
                  <p>{ls.question}</p>
                </div>
                <div className="story-challenge__choices">
                  {lenOptions.map((n) => (
                    <button
                      key={n}
                      className={`story-choice-btn${lenRevealed ? (n === actualCount ? ' story-choice-btn--correct' : n === lenChosen ? ' story-choice-btn--incorrect' : ' story-choice-btn--dimmed') : ''}`}
                      onClick={() => handlePick(n)}
                      disabled={lenRevealed}
                      style={{ '--card-accent': color }}
                    >
                      <span className="story-choice-btn__icon" role="img" aria-hidden="true">
                        {n === actualCount && lenRevealed ? '✓' : '🔢'}
                      </span>
                      <span className="story-choice-btn__label" style={{ fontSize: '1.5rem', fontWeight: 900 }}>{n}</span>
                    </button>
                  ))}
                </div>

                {lenRevealed && (
                  <>
                    <div className={`feedback-banner ${lenChosen === actualCount ? 'success' : 'error'}`} style={{ marginTop: '16px' }}>
                      <span className="feedback-icon">{lenChosen === actualCount ? '🎉' : '💡'}</span>
                      <div className="feedback-text">
                        <strong>{lenChosen === actualCount ? 'Correct! The troll lets you pass!' : `The answer is ${actualCount}!`}</strong>
                        <span> Your backpack has {actualCount} items.</span>
                      </div>
                    </div>

                    <div className="scene-observation-card" style={{ borderColor: `${color}44`, marginTop: '16px' }}>
                      <div className="scene-observation-card__icon" role="img" aria-hidden="true">💡</div>
                      <div>
                        <strong>Core Intuition:</strong>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-primary)' }}>{ls.insight}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={goNext}
                        style={{ background: `linear-gradient(135deg, ${color}, rgba(255,255,255,0.25))` }}
                      >
                        Cross the Bridge →
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
                <button className="btn btn-ghost" onClick={goBack}>← Back</button>
              </div>
            </div>
          );
        })()}

        {/* ── SCENE 9: Membership ──────────────────────────────────────── */}
        {currentScene.id === 'membership' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">🦉 Something Rustles in the Dark…</h2>
              <p>{chapter.storyScenes.membership.situation}</p>
            </div>
            <BackpackVisual items={backpack} chapterColor={color} chapterGlow={colorGlow} />
            <StoryChallenge
              question={chapter.storyScenes.membership.question}
              choices={chapter.storyScenes.membership.choices}
              insight={chapter.storyScenes.membership.insight}
              onComplete={goNext}
              chapterColor={color}
              chapterGlow={colorGlow}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 10: Slicing ─────────────────────────────────────────── */}
        {currentScene.id === 'slicing' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">🤝 A Friend Joins the Adventure!</h2>
              <p>{chapter.slicingScene.situation}</p>
            </div>
            <SliceSelector
              items={backpack}
              targetStart={chapter.slicingScene.targetStart}
              targetEnd={chapter.slicingScene.targetEnd}
              friendRequest={chapter.slicingScene.friendRequest}
              onComplete={goNext}
              chapterColor={color}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 11: Iteration ──────────────────────────────────────── */}
        {currentScene.id === 'iteration' && (
          <div className="adventure-scene">
            <div className="scene-story-card">
              <h2 className="scene-story-card__title">🔥 Around the Campfire</h2>
              <p>
                Night falls. You and your companions gather around the campfire.
                Your fellow explorers ask to see everything you've brought.
                Take <strong>each item out one by one</strong> and show them.
              </p>
            </div>
            <IterationPlayer
              items={backpack}
              onComplete={goNext}
              chapterColor={color}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back</button>
            </div>
          </div>
        )}

        {/* ── SCENE 12: Discovery Reveal ───────────────────────────────── */}
        {currentScene.id === 'discovery' && (
          <DiscoveryReveal
            onComplete={goNext}
            chapterColor={color}
            chapterGlow={colorGlow}
          />
        )}

        {/* ── SCENE 13: Piece-by-Piece Code Mastery at the End of the Story ── */}
        {currentScene.id === 'code_mastery' && (
          <div className="adventure-scene">
            <CodeMasteryHub
              conceptBridges={conceptBridges}
              chapterColor={color}
              onComplete={goNext}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
              <button className="btn btn-ghost" onClick={goBack}>← Back to Grand Reveal</button>
            </div>
          </div>
        )}

        {/* ── SCENE 12: Practice Suite ─────────────────────────────────── */}
        {currentScene.id === 'practice' && (
          <div className="adventure-scene">
            {/* Sub-step indicator */}
            <div className="practice-header">
              <div className="activity-label" style={{ fontSize: '0.8rem' }}>
                🎯 Practice Suite
              </div>
              <div className="practice-substeps">
                {['Match', 'Fill', 'Quiz', 'Code', 'Final'].map((label, i) => (
                  <div
                    key={label}
                    className={`practice-substep${i === subStep ? ' active' : i < subStep ? ' done' : ''}`}
                    style={i === subStep ? { borderColor: color, color } : {}}
                  >
                    {i < subStep ? '✓' : label}
                  </div>
                ))}
              </div>
            </div>

            {/* A: Matching */}
            {subStep === 0 && (
              <MatchingActivity
                pairs={chapter.matching}
                onComplete={() => { setSubStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                chapterColor={color}
              />
            )}

            {/* B: Fill in the Blank */}
            {subStep === 1 && (
              <FillBlank
                items={chapter.fillBlanks}
                chapterColor={color}
                chapterColorDim={colorDim}
                onComplete={handleFillComplete}
              />
            )}

            {/* C: Quiz — Predict the Output */}
            {subStep === 2 && (
              <>
                <div className="activity-label" style={{ marginBottom: '6px' }}>
                  🧠 Predict the Output — what will Python print?
                </div>
                <QuizCard
                  questions={chapter.quiz}
                  chapterColor={color}
                  chapterColorDim={colorDim}
                  onComplete={handleQuizComplete}
                />
              </>
            )}

            {/* D: Code Challenge */}
            {subStep === 3 && (
              <CodeChallenge
                challenge={chapter.challenge}
                chapterColor={color}
                chapterColorDim={colorDim}
                onComplete={handleChallengeComplete}
              />
            )}

            {/* E: Final Lost Forest Mission */}
            {subStep === 4 && (
              <>
                <div className="scene-story-card" style={{ borderColor: `${color}55`, marginBottom: '20px' }}>
                  <h2 className="scene-story-card__title">🏆 Final Mission: The Lost Forest</h2>
                  <p>
                    You are now entering the deepest part of the Lost Forest.
                    Use everything you've learned about your magical backpack to complete this final mission!
                  </p>
                </div>
                <CodeChallenge
                  challenge={chapter.finalChallenge}
                  chapterColor={color}
                  chapterColorDim={colorDim}
                  onComplete={handleFinalComplete}
                />
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  if (subStep > 0) {
                    setSubStep((s) => s - 1);
                  } else {
                    goBack();
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ← Back
              </button>
            </div>
          </div>
        )}

      </div>{/* end chapter-content */}

      {/* ── Bottom Navigation ─────────────────────────────────────────────── */}
      <ChapterNavigation
        stepLabel={`Part ${safeSceneIdx + 1} of ${scenes.length}`}
        stepName={currentScene?.label || ''}
        onBack={safeSceneIdx > 0 ? goBack : undefined}
        onNext={safeSceneIdx < scenes.length - 1 ? goNext : undefined}
        chapterColor={color}
        onHome={() => onNavigate('landing')}
      />

      {/* ── Completion Badge ──────────────────────────────────────────────── */}
      {showBadge && (
        <AchievementBadge
          chapterTitle="The Magical Backpack"
          subtitle="Python Lists — Mastered!"
          emoji="🎒"
          xp={chapter.xp}
          chapterColor={color}
          chapterGlow={colorGlow}
          nextLabel="View Achievement & Roadmap 🗺️"
          onNext={() => { setShowBadge(false); onNavigate('landing'); }}
          onHome={() => { setShowBadge(false); onNavigate('landing'); }}
        />
      )}
    </div>
  );
}
