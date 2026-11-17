import React, { useMemo, useState } from 'react';

// Renders exactly one generated case study through the real five-stage flow
// (observe -> interpret -> concept idea -> syntax reveal + build -> practice),
// the same shape a learner would see live. This is what "force a playtest"
// means in practice: the Submit button in LearnerGenerateApp stays disabled
// until onComplete fires from here.

// The model consistently writes the correct stage2 option first and lists
// stage4/stage5 tokens in a fairly predictable order (correct ones bunched
// together) — so a learner who's noticed the pattern can "solve" every case
// study by always clicking the first option / the first few token buttons,
// without reading anything. Shuffling display order client-side (independent
// of which token/option the data marks correct) closes that shortcut without
// touching generation or validation at all.
function shuffleArray(list) {
  const arr = [...(list || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function InlineText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// A case study missing any of these means it either predates the five-stage
// schema (see the approve-time re-validation added in
// routes/scenarioGenerator.js — this is the same shape it checks, kept as a
// simple structural check here rather than importing the full server-side
// validator into the client) or is otherwise malformed. Rendering stage-by-
// stage without this guard means a missing field only surfaces as a raw
// "Cannot read properties of undefined" crash several stages in, taking the
// whole page down with it instead of just this one case study.
function isPlayable(content) {
  return Boolean(
    content &&
    content.stage1?.prompt &&
    Array.isArray(content.stage2?.attempt1) && content.stage2.attempt1.length &&
    content.stage3?.conceptIdea &&
    content.stage4?.codeTemplate && Array.isArray(content.stage4?.tokens) &&
    content.stage5?.practiceTemplate && Array.isArray(content.stage5?.practiceTokens)
  );
}

const STAGE_LABELS = { 1: 'Observe', 2: 'Interpret', 3: 'Concept idea', 4: 'Syntax + build', 5: 'Practice' };

export default function PlaytestEngine({ content, onComplete }) {
  const [stage, setStage] = useState(1);
  const [completed, setCompleted] = useState([]);
  // A completed earlier stage's number, or null. Looking back never changes
  // `stage` itself — the current stage's component (FillBlanks progress, an
  // MCQ's solved/hint state, whichever phase Stage4Syntax is on) stays
  // mounted underneath the whole time, just visually hidden, so returning
  // from a look-back picks up exactly where the learner left off instead of
  // resetting that stage's progress.
  const [peekStage, setPeekStage] = useState(null);

  if (!isPlayable(content)) {
    return (
      <div className="stage">
        <p className="hint">
          This case study can't be played — it's missing content the current five-stage format expects (likely
          from before a schema update). It needs to be regenerated rather than played as-is.
        </p>
      </div>
    );
  }

  function markDone(stageNum) {
    setCompleted((prev) => (prev.includes(stageNum) ? prev : [...prev, stageNum]));
  }

  function advance(fromStage, toStage) {
    markDone(fromStage);
    setStage(toStage);
  }

  function finish() {
    markDone(5);
    onComplete([1, 2, 3, 4, 5]);
  }

  const priorStages = [1, 2, 3, 4].filter((n) => n < stage && completed.includes(n));

  return (
    <div className="playtest">
      <div className="cs-progress">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`dot ${stage === n ? 'active' : ''} ${completed.includes(n) ? 'done' : ''}`} />
        ))}
      </div>

      {priorStages.length > 0 && (
        <div className="look-back-bar">
          <span>Not sure? Look back at:</span>
          {priorStages.map((n) => (
            <button key={n} className="primary secondary" onClick={() => setPeekStage(n)}>
              Stage {n} — {STAGE_LABELS[n]}
            </button>
          ))}
        </div>
      )}

      {peekStage && <StagePeek content={content} stageNum={peekStage} onClose={() => setPeekStage(null)} />}

      <div style={peekStage ? { display: 'none' } : undefined}>
        {stage === 1 && <Stage1Observe content={content} onNext={() => advance(1, 2)} />}
        {stage === 2 && <Stage2Interpret content={content} onSolved={() => advance(2, 3)} />}
        {stage === 3 && <Stage3Concept content={content} onNext={() => advance(3, 4)} />}
        {stage === 4 && <Stage4Syntax content={content} onDone={() => advance(4, 5)} />}
        {stage === 5 && <Stage5Practice content={content} onDone={finish} />}
      </div>
    </div>
  );
}

// Read-only recap of an already-completed stage, shown without touching the
// active stage's own state (see peekStage above). Stage2's options are
// annotated with the answer since the learner already solved it to get
// here; stage4's code is shown fully solved via fillTemplate rather than as
// blanks, for the same reason.
function StagePeek({ content, stageNum, onClose }) {
  return (
    <div className="stage-peek">
      <div className="stage-peek-header">
        <strong>Looking back — Stage {stageNum}: {STAGE_LABELS[stageNum]}</strong>
        <button className="primary secondary" onClick={onClose}>Back to where I was</button>
      </div>

      {stageNum === 1 && (
        <div className="stage">
          <p className="scenario">{content.scenario}</p>
          <p className="observe-prompt"><InlineText text={content.stage1.prompt} /></p>
          <p className="guiding-question">{content.stage1.guidingQuestion}</p>
        </div>
      )}

      {stageNum === 2 && (
        <div className="stage">
          <div className="options">
            {content.stage2.attempt1.map((opt) => (
              <div key={opt.text} className={`option ${opt.status === 'correct' ? 'correct' : ''}`}>{opt.text}</div>
            ))}
          </div>
        </div>
      )}

      {stageNum === 3 && (
        <div className="stage">
          <p className="reveal"><InlineText text={content.stage3.conceptIdea} /></p>
        </div>
      )}

      {stageNum === 4 && (
        <div className="stage">
          <p className="reveal"><InlineText text={content.stage4.conceptReveal} /></p>
          <pre className="code-block">
            {fillTemplate(content.stage4.codeTemplate, content.stage4.tokens, content.stage4.correctOrder)}
          </pre>
        </div>
      )}
    </div>
  );
}

// Raw pattern from the scenario, no options, no syntax — the learner just
// looks and notices something before being asked to interpret anything.
function Stage1Observe({ content, onNext }) {
  return (
    <div className="stage">
      <p className="scenario">{content.scenario}</p>
      <p className="observe-prompt"><InlineText text={content.stage1.prompt} /></p>
      <p className="guiding-question">{content.stage1.guidingQuestion}</p>
      <button className="primary" onClick={onNext}>I see something — let's check</button>
    </div>
  );
}

// Generic pick-one-option, get-a-hint-on-a-miss interaction. Started as
// stage2's plain-English check; now also drives the three new stage4/stage5
// comprehension checks (predict-the-output, the edge-case/misconception
// question, and stage5's apply-elsewhere check) — same shape, same behavior,
// only the prompt and options differ. Returns a fragment rather than owning
// its own ".stage" wrapper, so a caller can either render it as a whole
// stage on its own or nest it inside a stage that already has other content
// above it (see stage5's applyCheck usage below).
function MCQBlock({ prompt, options, onSolved, solvedLabel }) {
  const [hint, setHint] = useState(null);
  const [solved, setSolved] = useState(false);
  // Shuffled once per mount, not on every render — otherwise picking a wrong
  // option and getting a hint would silently reorder the buttons out from
  // under the learner.
  const shuffled = useMemo(() => shuffleArray(options), [options]);

  function pick(option) {
    if (option.status === 'correct') {
      setSolved(true);
      setHint(null);
    } else {
      setHint(option.hint);
    }
  }

  return (
    <>
      {prompt && <p className="observe-prompt"><InlineText text={prompt} /></p>}
      <div className="options">
        {shuffled.map((option) => (
          <button
            key={option.text}
            className={`option ${solved && option.status === 'correct' ? 'correct' : ''}`}
            disabled={solved}
            onClick={() => pick(option)}
          >
            {option.text}
          </button>
        ))}
      </div>
      {hint && !solved && <p className="hint">{hint}</p>}
      {solved && <button className="primary" onClick={onSolved}>{solvedLabel || 'Continue'}</button>}
    </>
  );
}

function Stage2Interpret({ content, onSolved }) {
  return (
    <div className="stage">
      <MCQBlock
        options={content.stage2.attempt1}
        onSolved={onSolved}
        solvedLabel="That's it — what's the idea behind this?"
      />
    </div>
  );
}

// Rule 17's execution-order walkthrough — a plain chain of connected steps,
// no diagram library needed. Absent on older content generated before this
// field existed; callers only reach this when content.stage4.flowSteps is a
// non-empty array.
function FlowDiagram({ steps }) {
  return (
    <div className="flow-diagram">
      {steps.map((step, i) => (
        <div className="flow-step" key={i}>
          <div className="flow-step-box">
            <span className="flow-step-num">{i + 1}</span>
            <p className="flow-step-label"><InlineText text={step.label} /></p>
            {step.note && <p className="flow-step-note"><InlineText text={step.note} /></p>}
          </div>
          {i < steps.length - 1 && <span className="flow-arrow" aria-hidden="true">&rarr;</span>}
        </div>
      ))}
    </div>
  );
}

// The bridge beat: the general computational idea, still no Python name.
function Stage3Concept({ content, onNext }) {
  return (
    <div className="stage">
      <p className="reveal"><InlineText text={content.stage3.conceptIdea} /></p>
      <button className="primary" onClick={onNext}>See how Python does this</button>
    </div>
  );
}

// Works out which token value fills which blank, left to right. Prefers the
// model-provided order (correctOrder / practiceCorrectOrder); falls back to
// a best-effort order built from the tokens marked correct, in the order
// given, for older content generated before this field existed. The
// fallback isn't guaranteed to match blank semantics as precisely as a real
// authored order would, but the exercise still functions instead of
// silently breaking on it.
function resolveBlankOrder(template, tokens, correctOrder) {
  const blankCount = (template.match(/___/g) || []).length;
  if (Array.isArray(correctOrder) && correctOrder.length === blankCount) return correctOrder;
  return (tokens || []).filter((t) => t.correct).map((t) => t.value).slice(0, blankCount);
}

// Fully solves a template for the look-back panel below — a completed
// stage's code is shown finished, not with blanks, since the learner
// already built it correctly to get past that stage.
function fillTemplate(template, tokens, correctOrder) {
  const order = resolveBlankOrder(template, tokens, correctOrder);
  let text = template;
  order.forEach((value) => { text = text.replace('___', value); });
  return text;
}

// A template can have several "___" blanks (e.g. "[ ___ for ___ in ___ if
// ___ ]"), and each one needs its own specific token — not just any token
// marked correct in any order, since that could let a learner "finish" with
// syntactically wrong code (the filter condition dropped into the iterable
// slot, say). This fills blanks one at a time, left to right, only
// accepting the token that belongs at the current position; anything else
// — including a token that's correct but meant for a different blank —
// shows a hint instead of advancing.
function FillBlanks({ template, tokens, correctOrder, onComplete }) {
  const order = useMemo(() => resolveBlankOrder(template, tokens, correctOrder), [template, tokens, correctOrder]);
  // The fill order above is untouched (it's what decides right/wrong per
  // blank) — this only jumbles which button sits where, once per stage view,
  // so the buttons aren't left-to-right in the same correct-then-distractor
  // clumping the model tends to generate.
  const shuffledTokens = useMemo(() => shuffleArray(tokens), [tokens]);
  // How many times each value is actually needed across every blank in this
  // exercise. A legitimate case study can need the exact same value at more
  // than one blank (e.g. a file handle "f" used both for f.write(...) and
  // again elsewhere) — a flat "have I used this value yet?" flag would
  // permanently disable every button sharing that value the instant one of
  // them is picked, even though a second blank still needs it. Counting
  // demand per value instead of treating "used" as a one-shot boolean is
  // what makes a value reusable exactly as many times as it's genuinely
  // needed, and no more.
  const neededCounts = useMemo(() => {
    const counts = {};
    order.forEach((value) => { counts[value] = (counts[value] || 0) + 1; });
    return counts;
  }, [order]);
  const [filledCount, setFilledCount] = useState(0);
  const [usedCounts, setUsedCounts] = useState({}); // value -> how many times correctly picked so far
  const [hint, setHint] = useState(null);

  const filled = useMemo(() => {
    let text = template;
    order.slice(0, filledCount).forEach((value) => {
      text = text.replace('___', value);
    });
    return text;
  }, [template, order, filledCount]);

  const done = filledCount >= order.length;

  function pick(token) {
    const expected = order[filledCount];
    if (token.value === expected) {
      const nextCount = filledCount + 1;
      setFilledCount(nextCount);
      setUsedCounts((prev) => ({ ...prev, [token.value]: (prev[token.value] || 0) + 1 }));
      setHint(null);
      if (nextCount >= order.length) onComplete();
    } else {
      setHint(token.hint || "That's not the right piece for this blank — look at what this specific gap needs.");
    }
  }

  return (
    <>
      <pre className="code-block">{filled}</pre>
      {!done && (
        <div className="tokens">
          {shuffledTokens.map((token, i) => {
            const usedSoFar = usedCounts[token.value] || 0;
            // A pure distractor (never the correct answer for any blank, so
            // neededCounts has no entry for it) stays clickable forever —
            // wrong picks only ever show a hint, they never lock a button.
            // A token whose value fills one or more real blanks locks only
            // once every one of those blanks has actually been filled.
            const needed = neededCounts[token.value] || 0;
            const usedUp = needed > 0 && usedSoFar >= needed;
            return (
              <button
                key={`${token.value}-${i}`}
                className={`token ${usedUp ? 'used' : ''}`}
                disabled={usedUp}
                onClick={() => pick(token)}
              >
                {token.value}
              </button>
            );
          })}
        </div>
      )}
      {!done && <p className="blank-progress">{filledCount} of {order.length} blanks filled</p>}
      {hint && !done && <p className="hint">{hint}</p>}
    </>
  );
}

// The one stage where the Python name appears, followed by building the
// code that uses it, then (rule 17) three comprehension checks that go past
// "can you assemble the tokens": the execution-order diagram, a predict-the-
// output question, and an edge-case/misconception question. All three are
// skipped automatically on older published content that predates them — the
// phase list below only includes a step if its data is actually present, so
// this degrades gracefully instead of rendering an empty screen.
function Stage4Syntax({ content, onDone }) {
  const phases = useMemo(() => {
    const list = ['reveal', 'build'];
    if (Array.isArray(content.stage4.flowSteps) && content.stage4.flowSteps.length) list.push('flow');
    if (content.stage4.predictOutput) list.push('predict');
    if (content.stage4.edgeCase) list.push('edge');
    return list;
  }, [content]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [built, setBuilt] = useState(false);
  const phase = phases[phaseIndex];
  const isLast = phaseIndex === phases.length - 1;
  const lastLabel = 'Now try one on your own';

  function next() {
    if (phaseIndex + 1 >= phases.length) onDone();
    else setPhaseIndex(phaseIndex + 1);
  }

  if (phase === 'reveal') {
    return (
      <div className="stage">
        <p className="reveal"><InlineText text={content.stage4.conceptReveal} /></p>
        <button className="primary" onClick={next}>Try writing it</button>
      </div>
    );
  }

  if (phase === 'build') {
    return (
      <div className="stage">
        <FillBlanks
          template={content.stage4.codeTemplate}
          tokens={content.stage4.tokens}
          correctOrder={content.stage4.correctOrder}
          onComplete={() => setBuilt(true)}
        />
        {built && <button className="primary" onClick={next}>{isLast ? lastLabel : 'See how it runs'}</button>}
      </div>
    );
  }

  if (phase === 'flow') {
    return (
      <div className="stage">
        <p className="reveal">Here's what actually happens when this code runs, in order:</p>
        <FlowDiagram steps={content.stage4.flowSteps} />
        <button className="primary" onClick={next}>{isLast ? lastLabel : 'Got it'}</button>
      </div>
    );
  }

  if (phase === 'predict') {
    return (
      <div className="stage">
        <MCQBlock
          prompt={content.stage4.predictOutput.question}
          options={content.stage4.predictOutput.options}
          onSolved={next}
          solvedLabel={isLast ? lastLabel : 'Keep going'}
        />
      </div>
    );
  }

  if (phase === 'edge') {
    return (
      <div className="stage">
        <MCQBlock
          prompt={content.stage4.edgeCase.question}
          options={content.stage4.edgeCase.options}
          onSolved={next}
          solvedLabel={isLast ? lastLabel : 'Keep going'}
        />
      </div>
    );
  }

  return null;
}

// A second, smaller task with the same characters but different data — the
// learner applies the concept themselves rather than reconstructing stage4.
// Once they've built it, stage5.applyCheck (rule 17) asks them to spot which
// of a few new, unrelated scenarios actually needs this concept — checking
// they recognize the pattern outside this one story, not just inside it.
// Skipped automatically on older content that predates the field.
function Stage5Practice({ content, onDone }) {
  const [built, setBuilt] = useState(false);
  const [applied, setApplied] = useState(false);
  const hasApplyCheck = Boolean(content.stage5.applyCheck);
  const readyToFinish = built && (!hasApplyCheck || applied);

  return (
    <div className="stage">
      <p className="practice-prompt"><InlineText text={content.stage5.practicePrompt} /></p>
      <FillBlanks
        template={content.stage5.practiceTemplate}
        tokens={content.stage5.practiceTokens}
        correctOrder={content.stage5.practiceCorrectOrder}
        onComplete={() => setBuilt(true)}
      />
      {built && hasApplyCheck && !applied && (
        <MCQBlock
          prompt={content.stage5.applyCheck.prompt}
          options={content.stage5.applyCheck.options}
          onSolved={() => setApplied(true)}
          solvedLabel="Keep going"
        />
      )}
      {readyToFinish && (
        <div className="stage" style={{ gap: '10px' }}>
          {content.scaleReflection && <p className="scale-reflection">{content.scaleReflection}</p>}
          <button className="primary" onClick={onDone}>Finish playtest</button>
        </div>
      )}
    </div>
  );
}
