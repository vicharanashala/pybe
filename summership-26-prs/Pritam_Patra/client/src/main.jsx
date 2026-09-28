import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function apiFetch(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Case Study Selector ───────────────────────────────────────────────
function SagaSelect({ sagas, onSelect }) {
  return (
    <div className="saga-select">
      <div className="saga-select-header">
        <div className="ss-kicker">PyBe Discovery</div>
        <h1 className="ss-title">Choose a Case Study</h1>
        <p className="ss-subtitle">
          Each saga is a guided story where you discover a computer-science concept
          yourself before anyone tells you its name.
        </p>
      </div>
      <div className="saga-grid">
        {sagas.map((s) => (
          <button
            key={s.id}
            className="saga-card"
            style={{ '--saga-accent': s.accent }}
            onClick={() => onSelect(s.id)}
          >
            <div className="saga-card-icon">{s.icon}</div>
            <div className="saga-card-title">{s.title}</div>
            <div className="saga-card-sub">{s.subtitle}</div>
            <div className="saga-card-meta">
              <span>{s.arcCount} Arc{s.arcCount !== 1 ? 's' : ''}</span>
              <span>{s.actCount} Acts</span>
            </div>
            <div className="saga-card-cta">Begin Case Study ▶</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Chapter Card Overlay ──────────────────────────────────────────────
function ChapterCard({ arcLabel, actNumber, actName, concept, onStart }) {
  const [leaving, setLeaving] = useState(false);
  function handleStart() {
    setLeaving(true);
    setTimeout(onStart, 400);
  }
  return (
    <div className={`chapter-card-overlay ${leaving ? 'leaving' : ''}`}>
      <div className="chapter-arc-label">{arcLabel}</div>
      <div className="chapter-num">ACT {actNumber}</div>
      <div className="chapter-name">{actName}</div>
      <div className="chapter-concept">{concept}</div>
      <button className="chapter-btn" onClick={handleStart}>
        Begin Act {actNumber} ▶
      </button>
    </div>
  );
}

// ── Character layout config (position on scene + comic bubble direction) ─
const CHAR_LAYOUT = {
  narrator: null, // handled separately as top banner
  priya:   { pos: { top: '42%',  left: '28%'  }, color: '#818cf8', tail: 'tail-left'       },
  pip:     { pos: { top: '55%',  right: '8%'  }, color: '#fbbf24', tail: 'tail-down-right' },
  lion:    { pos: { top: '8%',   left: '38%'  }, color: '#fb923c', tail: 'tail-down'       },
  eagle:   { pos: { top: '8%',   left: '54%'  }, color: '#34d399', tail: 'tail-down'       },
  dolphin: { pos: { top: '5%',   right: '9%'  }, color: '#22d3ee', tail: 'tail-down'       },
  chameleon: { pos: { top: '35%', left: '45%' }, color: '#a3e635', tail: 'tail-down'       },
};

// ── Cinematic Dialogue (comic-style bubbles positioned over characters) ─
function CinematicDialogue({ lines, characters, image, onComplete }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [lines]);

  const current = lines[idx];
  const speaker = characters[current.speaker];
  const isLast  = idx === lines.length - 1;
  const isNarrator = current.speaker === 'narrator';
  let layout = CHAR_LAYOUT[current.speaker];

  // Act-specific layout overrides to position bubbles precisely
  if (layout && image) {
    if (image.includes('act2.png') && current.speaker === 'priya') {
      layout = { ...layout, pos: { top: '48%', left: '32%' } };
    }
  }

  function advance(e) {
    e.stopPropagation();
    if (isLast) onComplete();
    else setIdx(i => i + 1);
  }

  return (
    <div className="cinematic-scene" onClick={advance}>
      {image && <img src={image} className="cinematic-bg" alt="" />}
      <div className="cinematic-scrim" />

      {/* Progress dots */}
      <div className="cin-progress">
        {lines.map((_, i) => (
          <div
            key={i}
            className={`cin-dot${i === idx ? ' cin-dot-cur' : i < idx ? ' cin-dot-done' : ''}`}
          />
        ))}
      </div>

      {/* Narrator: film-strip top caption */}
      {isNarrator && (
        <div className="cin-narrator" key={`n-${idx}`}>
          <span className="cin-narrator-icon">{speaker.avatar}</span>
          <span className="cin-narrator-text">{current.text}</span>
        </div>
      )}

      {/* Character: comic speech bubble positioned over their face */}
      {!isNarrator && layout && (
        <div
          className={`cin-comic-bubble ${layout.tail}`}
          style={{
            ...layout.pos,
            '--bcolor': layout.color,
            borderColor: layout.color,
          }}
          key={`b-${idx}`}
        >
          <div className="cin-comic-name" style={{ color: layout.color }}>
            {speaker.avatar} {speaker.name}
          </div>
          <div className="cin-comic-text">{current.text}</div>
        </div>
      )}

      {/* Advance hint */}
      <div className="cin-advance">
        {isLast ? 'Continue ▶' : 'Tap anywhere to advance'}
      </div>
    </div>
  );
}


// ── Shared multiple-choice option list ───────────────────────────────
function OptionList({ options, selected, correctIdx, status, onPick, disabled }) {
  return (
    <div className="mcq-options">
      {options.map((opt, i) => {
        let cls = 'mcq-option';
        if (selected === i) {
          cls += status === 'correct' ? ' correct' : status === 'wrong' ? ' wrong' : '';
        } else if (status === 'correct' && i === correctIdx) {
          cls += ' correct';
        }
        return (
          <button key={i} className={cls} onClick={() => onPick(i)} disabled={disabled || (selected != null && status === 'correct')}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Copy to clipboard button ─────────────────────────────────────────
function CopyBtn({ text, label = 'Copy' }) {
  const [ok, setOk] = useState(false);

  return (
    <button
      className={`copy-btn ${ok ? 'copied' : ''}`}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
    >
      {ok ? 'Copied ✓' : `📋 ${label}`}
    </button>
  );
}

// ── Transfer Scenario (apply the pattern to a new situation) ─────────
function TransferScenario({ scenario, onContinue }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);

  function handlePick(idx) {
    if (status === 'correct') return;
    setSelected(idx);
    if (idx === scenario.answerIndex) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  }

  return (
    <div className="fullscreen-overlay">
      <div className="fullpage">
        <div className="fullpage-head">
          <span className="fp-icon">🔀</span>
          <div>
            <div className="fp-title">Now Try a Different Scenario</div>
            <div className="fp-sub">Can you spot the same pattern in a brand new situation?</div>
          </div>
        </div>

        <div className="fullpage-body">
          <div className="transfer-card">
            <div className="transfer-scenario-title">{scenario.title}</div>
            <div className="transfer-scenario-text">{scenario.text}</div>
          </div>

          <div className="fp-question">{scenario.question}</div>

          <OptionList
            options={scenario.options}
            selected={selected}
            correctIdx={scenario.answerIndex}
            status={status}
            onPick={handlePick}
          />

          {status === 'wrong' && scenario.hint && (
            <div className="owl-correction" style={{ marginTop: '1.1rem' }}>
              <div className="owl-avatar">🦉</div>
              <div className="owl-body">
                <div className="owl-name">Pip the Owl</div>
                <div className="owl-misconception">Not quite, look at the options again.</div>
                <div className="owl-question">{scenario.hint}</div>
              </div>
            </div>
          )}
        </div>

        <div className="fullpage-actions">
          <button className="btn-submit" onClick={onContinue} disabled={status !== 'correct'}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Summary / Notes Capture (after MCQ, before slides) ───────────────
function SummaryPanel({ act, onSave }) {
  const summaryText = [
    `In Act ${act.act}, we discovered how ${act.concept.toLowerCase()} works.`,
    ...(act.summaryGuide || [])
  ].join(' ');

  return (
    <div className="fullscreen-overlay">
      <div className="fullpage">
        <div className="fullpage-head">
          <span className="fp-icon">🎉</span>
          <div>
            <div className="fp-title">Well done! You understood right!</div>
            <div className="fp-sub">Now let's take the summary of what we have learned from here.</div>
          </div>
        </div>

        <div className="fullpage-body">
          <div className="summary-guide">
            <div className="summary-guide-label">🔖 Summary of what we learned in Act {act.act}</div>
            <div className="summary-paragraph">{summaryText}</div>
            <div className="summary-key-points">
              {(act.summaryGuide || []).map((point, i) => (
                <div className="summary-guide-point" key={i}>
                  <span className="cdp-bullet">→</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-note-hint">
            📌 This summary is saved automatically to your Notes in the Field Journal.
          </div>
        </div>

        <div className="fullpage-actions">
          <button className="btn-submit" onClick={() => onSave(summaryText)}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Now You Write the Code (free-form practice after fill-in-the-blank) ─
function CodeWrite({ codeTask, onDone, onSkip }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);

  function handleCheck() {
    const missing = (codeTask.acceptableSubstrings || []).filter(s => !code.includes(s));
    if (!missing.length) setStatus('correct');
    else setStatus({ missing });
  }

  return (
    <div className="fullscreen-overlay">
      <div className="fullpage">
        <div className="fullpage-head">
          <span className="fp-icon">✍️</span>
          <div>
            <div className="fp-title">{codeTask.title}</div>
            <div className="fp-sub">The best way to learn is to write it yourself.</div>
          </div>
        </div>

        <div className="fullpage-body">
          <div className="code-write">
            <div className="cw-instructions">{codeTask.instructions}</div>

            <div className="code-window">
              <div className="code-titlebar">
                <div className="cdot r" /><div className="cdot a" /><div className="cdot g" />
                <span className="code-filename">my_solution.py</span>
                <span className="cdp-badge" style={{ marginLeft: 'auto' }}>your code</span>
                <CopyBtn text={code} label="Copy code" />
              </div>
              <textarea
                className="cw-editor"
                spellCheck={false}
                placeholder="# Write your Python code from scratch here..."
                value={code}
                onChange={e => { setCode(e.target.value); setStatus(null); }}
                autoFocus
              />
            </div>

            {status === 'correct' && (
              <div className="code-explanation">
                <strong>✅ Brilliant!</strong> You wrote the pattern yourself, now you've really got it.
              </div>
            )}
            {status && status !== 'correct' && (
              <div className="cw-missing">
                Almost there, check that your code includes: {status.missing.join(', ')}. Compare with the slides you just saw.
              </div>
            )}
          </div>
        </div>

        <div className="fullpage-actions split">
          <button className="slide-back-btn" onClick={onSkip}>I'll practice later →</button>
          {status === 'correct' ? (
            <button className="btn-submit" onClick={onDone}>Continue Saga ▶</button>
          ) : (
            <button className="btn-submit" onClick={handleCheck} disabled={!code.trim()}>
              Check My Code 🔍
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Story Bridge Phase (after MCQ, before slides) ────────────────────
function StoryBridgePhase({ storyBridge, saga, image, onComplete }) {
  return (
    <CinematicDialogue
      lines={storyBridge}
      characters={saga.characters}
      image={image}
      onComplete={onComplete}
    />
  );
}

// ── Slide Teacher (step-by-step code teaching) ────────────────────────
function SlideTeacher({ slides, filename, onComplete }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = slides[slideIdx];
  const isLast = slideIdx === slides.length - 1;

  const lines = slide.code.split('\n');
  const highlights = slide.highlightWords || [];

  const isHighlightedLine = (line) =>
    highlights.some(word => line.includes(word));

  return (
    <div className="fullscreen-overlay">
      <div className="fullpage">
        <div className="fullpage-head">
          <span className="fp-icon">💻</span>
          <div>
            <div className="fp-title">Learn the Code</div>
            <div className="fp-sub">Reading through how Python writes this, one step at a time.</div>
          </div>
        </div>

        <div className="fullpage-body">
          <div className="slide-teacher">
            {/* ── Step indicator ── */}
            <div className="slide-header">
              <div className="slide-step-pill">
                Step {slideIdx + 1} of {slides.length}
              </div>
              <div className="slide-title">{slide.slideTitle}</div>
            </div>

            {/* ── Story connection quote ── */}
            <div className="slide-story-quote">
              <span className="slide-quote-icon">💬</span>
              <span className="slide-quote-text">{slide.storyConnection}</span>
            </div>

            {/* ── Code window ── */}
            <div className="code-window slide-code-window">
              <div className="code-titlebar">
                <div className="cdot r" /><div className="cdot a" /><div className="cdot g" />
                <span className="code-filename">{filename}</span>
                <span className="cdp-badge" style={{ marginLeft: 'auto' }}>read only</span>
                <CopyBtn text={slide.code} label="Copy code" />
              </div>
              <div className="code-body">
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={`code-line ${isHighlightedLine(line) ? 'st-highlight-line' : ''}`}
                  >
                    {line || '\u00a0'}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Explanation ── */}
            <div className="slide-explanation">
              <span className="cdp-exp-icon">💡</span>
              <span>{slide.explanation}</span>
            </div>

            {/* ── Navigation ── */}
            <div className="slide-nav">
              {slideIdx > 0 && (
                <button
                  className="slide-back-btn"
                  onClick={() => setSlideIdx(i => i - 1)}
                >
                  ← Previous
                </button>
              )}
              {!isLast ? (
                <button
                  className="chapter-btn"
                  onClick={() => setSlideIdx(i => i + 1)}
                >
                  Next Step →
                </button>
              ) : (
                <button className="chapter-btn" onClick={onComplete}>
                  ✏️ Now Write It Yourself!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Observation Input (multiple choice) ──────────────────────────────
function ObservationInput({ prompt, obs, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(null);

  function handlePick(idx) {
    if (status === 'correct') return;
    setSelected(idx);
    if (idx === obs.answerIndex) {
      setStatus('correct');
      setTimeout(() => onSubmit(true), 900);
    } else {
      setStatus('wrong');
    }
  }

  return (
    <div className="observation-panel">
      <div className="observation-header">Observation</div>
      {prompt && (
        <div className="priya-prompt">
          <span style={{ fontSize: '1.2rem' }}>📝</span>
          <div>{prompt}</div>
        </div>
      )}

      <div className="obs-question">{obs.question}</div>

      <OptionList
        options={obs.options}
        selected={selected}
        correctIdx={obs.answerIndex}
        status={status}
        onPick={handlePick}
      />

      {status === 'wrong' && obs.hint && (
        <div className="owl-correction" style={{ marginTop: '1rem' }}>
          <div className="owl-avatar">🦉</div>
          <div className="owl-body">
            <div className="owl-name">Pip the Owl</div>
            <div className="owl-misconception">Not quite, try another option.</div>
            <div className="owl-question">{obs.hint}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MCQ Panel (all 3 questions on one full page) ─────────────────────
function McqPanel({ mcqs, onCorrect }) {
  const [qState, setQState] = useState(() => mcqs.map(() => ({ picked: null, status: null })));

  const correctCount = qState.filter(s => s.status === 'correct').length;
  const allCorrect = correctCount === mcqs.length;

  function handlePick(qi, pick) {
    if (qState[qi].status === 'correct') return;
    setQState(prev => {
      const next = prev.map(s => ({ ...s }));
      next[qi] = {
        picked: pick,
        status: pick === mcqs[qi].answerIndex ? 'correct' : 'wrong'
      };
      return next;
    });
  }

  return (
    <div className="fullscreen-overlay">
      <div className="fullpage">
        <div className="fullpage-head">
          <span className="fp-icon">❓</span>
          <div>
            <div className="fp-title">Quick Check</div>
            <div className="fp-sub">Three questions on one page. Answer all of them to continue.</div>
          </div>
          <div className={`fp-progress ${allCorrect ? 'done' : ''}`}>
            {correctCount} of {mcqs.length} correct
          </div>
        </div>

        <div className="fullpage-body">
          {mcqs.map((mcq, qi) => {
            const s = qState[qi];
            return (
              <div className="mcq-block" key={qi}>
                <div className="mcq-block-head">
                  <span className="mcq-block-num">Q{qi + 1}</span>
                  <div className="mcq-question">{mcq.question}</div>
                </div>

                <OptionList
                  options={mcq.options}
                  selected={s.picked}
                  correctIdx={mcq.answerIndex}
                  status={s.status}
                  onPick={i => handlePick(qi, i)}
                />

                {s.status === 'wrong' && mcq.hint && (
                  <div className="owl-correction" style={{ marginTop: '0.9rem' }}>
                    <div className="owl-avatar">🦉</div>
                    <div className="owl-body">
                      <div className="owl-name">Pip the Owl</div>
                      <div className="owl-misconception">Not quite, look at the options again.</div>
                      <div className="owl-question">{mcq.hint}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="fullpage-actions">
          <button className="btn-submit" onClick={onCorrect} disabled={!allCorrect}>
            {allCorrect ? 'Continue →' : `Answer all of them first (${correctCount}/${mcqs.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Code Solve ───────────────────────────────────────────────────────
function CodeSolve({ codeReveal, onSolve }) {
  const [blankValue, setBlankValue] = useState('');
  const [status, setStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const blankDef = codeReveal.blanks[0];
  const copyCode = codeReveal.template.replaceAll('____', blankDef.answer);

  function handleCheck() {
    if (blankValue.trim() === blankDef.answer) {
      setStatus('correct');
      setTimeout(onSolve, 1500);
    } else {
      setStatus('wrong');
      setAttempts(a => a + 1);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  const lines = codeReveal.template.split('\n');

  return (
    <div className="fullscreen-overlay">
      <div className="fullpage">
        <div className="fullpage-head">
          <span className="fp-icon">🧩</span>
          <div>
            <div className="fp-title">Fill in the Blank</div>
            <div className="fp-sub">You've seen how Python writes this. Now fill in the missing piece yourself.</div>
          </div>
        </div>

        <div className="fullpage-body">
          <div className="code-solve">
            <div className="code-window">
              <div className="code-titlebar">
                <div className="cdot r" /><div className="cdot a" /><div className="cdot g" />
                <span className="code-filename">{codeReveal.file}</span>
                <span className="cdp-badge" style={{ marginLeft: 'auto' }}>editable</span>
                <CopyBtn text={copyCode} label="Copy full code" />
              </div>
              <div className="code-body">
                {lines.map((line, i) => {
                  if (line.includes('____')) {
                    const parts = line.split('____');
                    return (
                      <div key={i} className="code-line">
                        {parts[0]}
                        <input
                          className={`blank-input ${status || ''}`}
                          value={blankValue}
                          onChange={e => { setBlankValue(e.target.value); setStatus(null); }}
                          placeholder={blankDef.placeholder}
                          spellCheck={false}
                          autoFocus
                        />
                        {parts[1]}
                      </div>
                    );
                  }
                  return <div key={i} className="code-line">{line || '\u00a0'}</div>;
                })}
              </div>
            </div>

            {status === 'wrong' && (
              <div style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
                ❌ Not quite, think back to the concept doc you just read.
              </div>
            )}

            {status === 'correct' && (
              <div className="code-explanation">
                <strong>✅ Correct!</strong> {codeReveal.explanation}
              </div>
            )}

            {status !== 'correct' && (
              <>
                {attempts >= 1 && !showHint && (
                  <div className="hint-pill" onClick={() => setShowHint(true)}>💡 Need a hint?</div>
                )}
                {showHint && (
                  <div className="hint-text">💡 <strong>Hint:</strong> {blankDef.hint}</div>
                )}
              </>
            )}
          </div>
        </div>

        {status !== 'correct' && (
          <div className="fullpage-actions">
            <button className="btn-submit" onClick={handleCheck} disabled={!blankValue.trim()}>
              Run Code ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Field Journal Sidebar ────────────────────────────────────────────
function FieldJournal({ saga, currentActNumber, completedActs, xp, notes }) {
  if (!saga) return <div className="field-journal" />;

  return (
    <div className="field-journal">
      <div className="journal-header">
        <div className="journal-title">
          <span>📖 Field Journal</span>
          <span className="journal-xp">{xp} XP</span>
        </div>
      </div>
      <div className="journal-scroll">
        {saga.arcs.map(arc => (
          <div className="arc-group" key={arc.arc}>
            <div className="arc-label">
              Arc {arc.arc} · {arc.name}
              <div className="arc-bar" />
            </div>
            {arc.acts.map(act => {
              const isDone = completedActs.includes(act.act);
              const isActive = act.act === currentActNumber;
              const isLocked = !isDone && !isActive;

              let cls = 'act-entry ';
              if (isDone) cls += 'done';
              if (isActive) cls += 'active';
              if (isLocked) cls += 'locked';

              return (
                <div key={act.act} className={cls}>
                  <div className="act-icon">{isDone ? '✅' : isActive ? '🔵' : '□'}</div>
                  <div className="act-name">
                    {act.name}
                    {(isDone || isActive) && <div className="act-discovery">{act.concept}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {notes.length > 0 && (
          <div className="arc-group">
            <div className="arc-label">
              📝 My Notes
              <div className="arc-bar" />
            </div>
            {notes.map(note => (
              <div className="note-entry" key={note._id || `${note.act}-${note.text}`}>
                <div className="note-head">Act {note.act} · {note.actName}</div>
                <div className="note-text">{note.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────
function App() {
  const [sagas, setSagas] = useState([]);
  const [sagaId, setSagaId] = useState(null);
  const [saga, setSaga] = useState(null);
  const [allActs, setAllActs] = useState([]);

  // State Machine
  // Modes: 'intro' → 'narrating' → 'observation' (multiple choice, inline)
  //        → 'transfer' (new scenario, full screen, multiple choice)
  //        → 'mcq' (3 questions, full screen) → 'summary' (auto note)
  //        → 'story-bridge' (Priya/Pip connect story to Python)
  //        → 'slide-teach' (step-by-step code slides)
  //        → 'code' → 'code-write' (now try: write the code yourself)
  //        → 'success'
  const [actIndex, setActIndex] = useState(0);
  const [mode, setMode] = useState('intro');
  const [bridgeIdx, setBridgeIdx] = useState(0);
  const [isJournalOpen, setIsJournalOpen] = useState(true);


  const [completedActs, setCompletedActs] = useState([]);
  const [xp, setXp] = useState(0);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiFetch('/sagas').then(setSagas).catch(console.error);
  }, []);

  const resetGameState = () => {
    setActIndex(0);
    setMode('intro');
    setBridgeIdx(0);
    setCompletedActs([]);
    setXp(0);
    setNotes([]);
  };

  const handleSelectSaga = (id) => {
    setSagaId(id);
    setSaga(null);
    setAllActs([]);
    resetGameState();
    Promise.all([
      apiFetch(`/sagas/${id}`),
      apiFetch(`/sagas/${id}/acts`),
      apiFetch(`/sagas/${id}/notes`)
    ]).then(([s, acts, savedNotes]) => {
      setSaga(s);
      setAllActs(acts.sort((a, b) => a.act - b.act));
      setNotes(savedNotes || []);
    }).catch(console.error);
  };

  const handleBackToCaseStudies = () => {
    setSagaId(null);
    setSaga(null);
    setAllActs([]);
    resetGameState();
  };

  if (!sagas.length) return <div className="loading-screen"><div className="spin" />Loading PyBe...</div>;
  if (!sagaId) return <SagaSelect sagas={sagas} onSelect={handleSelectSaga} />;
  if (!saga) return <div className="loading-screen"><div className="spin" />Loading Case Study...</div>;

  const currentAct = allActs[actIndex];

  // Saga Complete screen
  if (!currentAct) {
    return (
      <div className={`app ${!isJournalOpen ? 'journal-closed' : ''}`}>
        <div className="topbar">
          <div className="topbar-brand">
            <span>PyBe</span> <small>{saga.title}</small>
          </div>
          <button className="journal-toggle" onClick={() => setIsJournalOpen(!isJournalOpen)}>
            {isJournalOpen ? 'Hide Journal 📖' : 'Show Journal 📖'}
          </button>
        </div>
        <div className="story-area">
          <div className="scene">
            <div className="saga-complete">
              <span className="saga-trophy">🏆</span>
              <div className="saga-title">Saga Complete</div>
              <div className="saga-subtitle">{saga.completeMessage}</div>
              <div className="saga-stats">
                <div className="stat-box"><strong>{completedActs.length}</strong><span>Acts Completed</span></div>
                <div className="stat-box"><strong>{xp}</strong><span>Total XP</span></div>
              </div>
              <div className="saga-actions">
                <button className="chapter-btn" onClick={() => window.location.reload()}>Play Again</button>
                <button className="slide-back-btn" onClick={handleBackToCaseStudies}>← All Case Studies</button>
              </div>
            </div>
          </div>
        </div>
        <FieldJournal saga={saga} currentActNumber={999} completedActs={completedActs} xp={xp} notes={notes} />
      </div>
    );
  }

  const arcInfo = saga.arcs.find(a => a.arc === currentAct.arcNumber);

  // ── Actions ──

  const handleDialogueComplete = () => {
    setMode(currentAct.observationPrompt ? 'observation' : 'mcq');
  };

  const handleObservationSubmit = (correct) => {
    if (correct) {
      setMode(currentAct.transferScenario ? 'transfer' : 'mcq');
    }
  };

  // After the transfer scenario is answered correctly → proceed to MCQ or next phase
  const handleTransferSubmit = () => {
    if (currentAct.mcqs?.length) {
      setMode('mcq');
    } else if (currentAct.storyBridge?.length) {
      setBridgeIdx(0);
      setMode('story-bridge');
    } else if (currentAct.syntaxLesson?.length) {
      setMode('slide-teach');
    } else if (currentAct.codeReveal) {
      setMode('code');
    } else {
      handleSuccessState();
    }
  };

  const handleMcqCorrect = () => {
    if (currentAct.summaryGuide?.length) {
      setMode('summary');
    } else if (currentAct.storyBridge?.length) {
      setBridgeIdx(0);
      setMode('story-bridge');
    } else if (currentAct.syntaxLesson?.length) {
      setMode('slide-teach');
    } else if (currentAct.codeReveal) {
      setMode('code');
    } else {
      handleSuccessState();
    }
  };

  const handleSummarySave = async (summaryText) => {
    const note = { act: currentAct.act, actName: currentAct.name, text: summaryText };
    setNotes(prev => {
      const without = prev.filter(n => n.act !== currentAct.act);
      return [...without, note];
    });
    try {
      await apiFetch(`/sagas/${saga.id}/notes`, {
        method: 'POST',
        body: JSON.stringify(note)
      });
    } catch (err) {
      console.error('Failed to save note:', err);
    }
    if (currentAct.storyBridge?.length) {
      setBridgeIdx(0);
      setMode('story-bridge');
    } else if (currentAct.syntaxLesson?.length) {
      setMode('slide-teach');
    } else if (currentAct.codeReveal) {
      setMode('code');
    } else {
      handleSuccessState();
    }
  };

  // After story bridge dialogues → go to slide teaching
  const handleStoryBridgeDone = () => {
    setMode('slide-teach');
  };

  // After all slides are done → code challenge (if exists) or success
  const handleSlideTeachDone = () => {
    if (currentAct.codeReveal) {
      setMode('code');
    } else {
      handleSuccessState();
    }
  };

  const handleCodeSolve = () => {
    handleSuccessState();
  };

  const handleCodeWriteDone = () => handleSuccessState();

  const handleSuccessState = () => {
    setXp(prev => prev + 100);
    setMode('success');
  };

  const handleNextAct = () => {
    setCompletedActs(prev => [...prev, currentAct.act]);
    setActIndex(i => i + 1);
    setBridgeIdx(0);
    setMode('intro');
  };

  return (
    <div className={`app ${!isJournalOpen ? 'journal-closed' : ''}`}>
      {mode === 'intro' && (
        <ChapterCard
          arcLabel={`Arc ${arcInfo.arc} · ${arcInfo.name}`}
          actNumber={currentAct.act}
          actName={currentAct.name}
          concept={currentAct.concept}
          onStart={() => setMode('narrating')}
        />
      )}

      <div className="topbar">
        <div className="topbar-brand">
          <span>PyBe</span> <small>{saga.title}</small>
        </div>
        <div className="topbar-arc">
          <div className="arc-dot" style={{ background: arcInfo.color }} />
          Arc {arcInfo.arc}: {arcInfo.name}
        </div>
        <button className="journal-toggle" onClick={() => setIsJournalOpen(!isJournalOpen)}>
          {isJournalOpen ? 'Hide Journal 📖' : 'Show Journal 📖'}
        </button>
      </div>

      <div className="story-area">
        <div className="scene">
          {/* ── CINEMATIC NARRATING: story on the image ── */}
          {mode === 'narrating' && (
            <CinematicDialogue
              lines={currentAct.narrative}
              characters={saga.characters}
              image={currentAct.image}
              onComplete={handleDialogueComplete}
            />
          )}

          {/* ── CINEMATIC STORY BRIDGE: Priya/Pip → Python ── */}
          {mode === 'story-bridge' && currentAct.storyBridge?.length && (
            <CinematicDialogue
              lines={currentAct.storyBridge}
              characters={saga.characters}
              image={currentAct.image}
              onComplete={handleStoryBridgeDone}
            />
          )}

          {/* Scene background for non-cinematic modes */}
          {mode !== 'narrating' && mode !== 'story-bridge' && currentAct.image && (
            <img src={currentAct.image} alt={currentAct.name} className="scene-bg" />
          )}

          {/* ── OBSERVATION INPUT (multiple choice, inline) ── */}
          {mode === 'observation' && currentAct.observationOptions && (
            <ObservationInput
              prompt={currentAct.observationPrompt}
              obs={currentAct.observationOptions}
              onSubmit={handleObservationSubmit}
            />
          )}

          {/* ── TRANSFER SCENARIO (full screen) ── */}
          {mode === 'transfer' && currentAct.transferScenario && (
            <TransferScenario
              scenario={currentAct.transferScenario}
              onContinue={handleTransferSubmit}
            />
          )}

          {/* ── MCQ (3 questions, full screen) ── */}
          {mode === 'mcq' && currentAct.mcqs?.length && (
            <McqPanel
              mcqs={currentAct.mcqs}
              onCorrect={handleMcqCorrect}
            />
          )}

          {/* ── SUMMARY ── */}
          {mode === 'summary' && currentAct.summaryGuide && (
            <SummaryPanel
              act={currentAct}
              onSave={handleSummarySave}
            />
          )}

          {/* ── SLIDE TEACH: Step-by-step code slides ── */}
          {mode === 'slide-teach' && currentAct.syntaxLesson?.length && (
            <SlideTeacher
              slides={currentAct.syntaxLesson}
              filename={currentAct.codeReveal?.file || currentAct.slidesFile || 'example.py'}
              onComplete={handleSlideTeachDone}
            />
          )}

          {/* ── CODE CHALLENGE ── */}
          {mode === 'code' && currentAct.codeReveal && (
            <CodeSolve
              codeReveal={currentAct.codeReveal}
              onSolve={handleCodeSolve}
            />
          )}

          {/* ── NOW YOU WRITE THE CODE ── */}
          {mode === 'code-write' && currentAct.codeTask && (
            <CodeWrite
              codeTask={currentAct.codeTask}
              onDone={handleCodeWriteDone}
              onSkip={handleCodeWriteDone}
            />
          )}

          {/* ── SUCCESS ── */}
          {mode === 'success' && (
            <div className="act-success">
              <span className="success-icon">✅</span>
              <div className="success-title">Discovery Logged</div>
              <div className="success-subtitle">You successfully identified the {currentAct.concept} pattern.</div>
              <div className="xp-badge">
                <span className="xp-icon">⭐</span> +100 XP
              </div>
              <button className="chapter-btn" onClick={handleNextAct}>Continue Saga ▶</button>
            </div>
          )}
        </div>
      </div>

      <FieldJournal
        saga={saga}
        currentActNumber={currentAct.act}
        completedActs={completedActs}
        xp={xp}
        notes={notes}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
