import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { renderHighlightedLine } from './highlight.jsx';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getTeachingMsg(wrongIdx, slots, correctOrder) {
  const wrongCard = slots[wrongIdx];
  const expectedCard = correctOrder[wrongIdx];
  const prevCard = wrongIdx > 0 ? slots[wrongIdx - 1] : null;

  if (prevCard && expectedCard.id === prevCard.id) {
    return {
      card: wrongCard,
      msg: `"${wrongCard.story}" should come before "${prevCard.story}". Programming executes from top to bottom — the event that happens first must come first.`
    };
  }

  return {
    card: wrongCard,
    msg: `"${wrongCard.story}" belongs in position ${wrongIdx + 1}. Think about the story's timeline — what happens first, second, third?`
  };
}

export default function CodingStep({ step, saved, isStepComplete, saveState, markComplete, markIncomplete, notify }) {
  const events = step.storyEvents;
  const correctOrder = events.map((e) => e);
  const totalSlots = events.length;

  const [isComplete, setIsComplete] = useState(isStepComplete);
  const [isRunning, setIsRunning] = useState(false);
  const [slots, setSlots] = useState(() => {
    if (saved && Array.isArray(saved.slots)) {
      return saved.slots.map((id) => (id ? events.find((e) => e.id === id) || null : null));
    }
    return Array(totalSlots).fill(null);
  });
  const [available, setAvailable] = useState(() => {
    if (saved && Array.isArray(saved.available)) {
      const restored = saved.available.map((id) => events.find((e) => e.id === id)).filter(Boolean);
      if (restored.length) return restored;
    }
    return shuffle(events.map((e) => ({ ...e })));
  });
  const [hoveredId, setHoveredId] = useState(null);
  const [checkState, setCheckState] = useState(null); // { correct: [idx], wrong: idx|null }
  const [feedback, setFeedback] = useState(null);     // JSX node
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);

  const codeBodyRef = useRef(null);
  const blockRefs = useRef({});
  const prevRects = useRef({});

  const allFilled = slots.every((s) => s !== null);

  function persist(slotList, availList) {
    saveState({
      slots: slotList.map((c) => (c ? c.id : null)),
      available: availList.map((c) => c.id)
    });
  }

  // ── FLIP animation for code blocks on reorder ──
  useLayoutEffect(() => {
    const newRects = {};
    Object.entries(blockRefs.current).forEach(([id, el]) => {
      if (el) newRects[id] = el.getBoundingClientRect();
    });
    Object.keys(newRects).forEach((id) => {
      const prev = prevRects.current[id];
      const cur = newRects[id];
      if (!prev || (prev.top === cur.top && prev.left === cur.left)) return;
      const el = blockRefs.current[id];
      if (!el) return;
      const dx = prev.left - cur.left;
      const dy = prev.top - cur.top;
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.opacity = '0.5';
      requestAnimationFrame(() => {
        el.style.transition = 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease';
        el.style.transform = '';
        el.style.opacity = '';
      });
    });
    prevRects.current = newRects;
  }, [slots]);

  // ── scroll current execution line into view ──
  useEffect(() => {
    if (currentLine === null) return;
    const el = codeBodyRef.current?.querySelector(`[data-linenum="${currentLine + 1}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentLine]);

  // ── source card actions ──
  function placeCard(card) {
    if (isComplete) return;
    const emptyIdx = slots.indexOf(null);
    if (emptyIdx === -1) return;
    const nextAvailable = available.filter((c) => c.id !== card.id);
    const nextSlots = slots.slice();
    nextSlots[emptyIdx] = card;
    setAvailable(nextAvailable);
    setSlots(nextSlots);
    setFeedback(null);
    setCheckState(null);
    persist(nextSlots, nextAvailable);
  }

  function removeCard(idx) {
    if (isComplete) return;
    const card = slots[idx];
    if (!card) return;
    const nextSlots = slots.slice();
    nextSlots[idx] = null;
    const nextAvailable = [...available, card];
    setSlots(nextSlots);
    setAvailable(nextAvailable);
    setFeedback(null);
    setCheckState(null);
    persist(nextSlots, nextAvailable);
  }

  function handleDrop(e, idx) {
    e.preventDefault();
    e.currentTarget.classList.remove('pb-timeline-slot--drag-over');
    if (isComplete) return;
    if (slots[idx]) return;
    const cardId = e.dataTransfer.getData('text/plain');
    const draggedCard = events.find((c) => c.id === cardId);
    if (!draggedCard) return;
    if (!available.some((c) => c.id === cardId)) return;
    const nextAvailable = available.filter((c) => c.id !== cardId);
    const nextSlots = slots.slice();
    nextSlots[idx] = draggedCard;
    setAvailable(nextAvailable);
    setSlots(nextSlots);
    setFeedback(null);
    setCheckState(null);
    persist(nextSlots, nextAvailable);
  }

  // ── check order ──
  function checkOrder() {
    if (isComplete) return;
    let firstWrong = -1;
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i] || slots[i].id !== correctOrder[i].id) { firstWrong = i; break; }
    }
    if (firstWrong === -1) {
      setIsComplete(true);
      setCheckState({ correct: slots.map((_, i) => i), wrong: null });
      setFeedback(
        <div className="pb-success-banner">
          <span>✔</span> Perfect! All in correct order. Now see the Python code.
        </div>
      );
      markComplete(step.id);
      persist(slots, available);
      notify();
    } else {
      const correctIdxs = [];
      for (let i = 0; i < slots.length; i++) {
        if (slots[i] && slots[i].id === correctOrder[i].id) correctIdxs.push(i);
      }
      setCheckState({ correct: correctIdxs, wrong: firstWrong });
      const teaching = getTeachingMsg(firstWrong, slots, correctOrder);
      setFeedback(
        <div className="pb-feedback-msg pb-feedback-msg--bad">
          <strong>Not quite in order yet</strong><br />{teaching.msg}
        </div>
      );
      markIncomplete(step.id);
      document.querySelector(`[data-slot-index="${firstWrong}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ── run with line-by-line execution animation ──
  async function run() {
    if (isRunning || !isComplete) return;
    setIsRunning(true);
    setTerminalOpen(true);
    setTerminalLines([]);
    setCurrentLine(null);

    const outLines = [
      { text: '$ python ' + (step.filename || 'main.py'), type: 'cmd' },
      { text: '', type: 'out' }
    ];
    (step.expectedOutput || '').split('\n').forEach((line) => {
      outLines.push({ text: line, type: 'out' });
    });
    outLines.push({ text: '', type: 'out' });
    outLines.push({ text: 'Process finished with exit code 0', type: 'cmd' });

    let codeLines = [];
    blocks.forEach(({ card, lines }) => {
      lines.forEach((line) => {
        codeLines.push({ text: line.text, eventId: card.id });
      });
    });
    const totalCodeLines = codeLines.length;
    let stepIdx = 0;
    let outIdx = 0;
    const shown = [];

    const tick = () => {
      if (stepIdx < totalCodeLines) {
        setCurrentLine(stepIdx);
        stepIdx++;
      }
      let shownOut = 0;
      while (outIdx < outLines.length) {
        shown.push(outLines[outIdx]);
        outIdx++;
        shownOut++;
        if (shownOut >= 1 && stepIdx < totalCodeLines) break;
      }
      setTerminalLines([...shown]);
    };

    await delay(300);
    tick();
    while (stepIdx < totalCodeLines || outIdx < outLines.length) {
      await delay(200);
      tick();
    }
    setCurrentLine(null);
    setIsRunning(false);
  }

  // ── reset ──
  function reset() {
    if (!isComplete) return;
    setIsComplete(false);
    setIsRunning(false);
    setSlots(Array(totalSlots).fill(null));
    setAvailable(shuffle(events.map((e) => ({ ...e }))));
    setFeedback(null);
    setCheckState(null);
    setTerminalOpen(false);
    setTerminalLines([]);
    setCurrentLine(null);
    markIncomplete(step.id);
    persist(Array(totalSlots).fill(null), events.map((e) => e.id));
    notify();
  }

  // ── derived render data ──
  let globalLine = 1;
  const blocks = [];
  slots.forEach((card) => {
    if (!card) return;
    const lines = card.code.split('\n').map((text) => ({ text, lineNum: globalLine++ }));
    blocks.push({ card, lines });
  });

  const isHovered = (id) => hoveredId === id;

  return (
    <>
      <div className="pb-panel-header">🐒 Story Cards: Drag each card into the correct timeline slot</div>

      {/* Source cards */}
      <div className="pb-card-grid">
        {available.map((card) => (
          <div
            key={card.id}
            className={
              'pb-story-card pb-story-card--' + card.id +
              (isHovered(card.id) ? ' pb-highlight' : '')
            }
            data-event-id={card.id}
            draggable={!isComplete}
            onDragStart={(e) => {
              if (isComplete) return;
              e.dataTransfer.setData('text/plain', card.id);
              e.dataTransfer.effectAllowed = 'move';
              e.currentTarget.classList.add('pb-story-card--dragging');
            }}
            onDragEnd={(e) => e.currentTarget.classList.remove('pb-story-card--dragging')}
            onClick={() => placeCard(card)}
            onMouseEnter={() => setHoveredId(card.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {card.story}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="pb-timeline">
        {slots.map((card, idx) => (
          <div
            key={idx}
            className={
              'pb-timeline-slot' +
              (isComplete && card ? ' pb-timeline-slot--correct' : '') +
              (card ? ' pb-timeline-slot--filled' : '') +
              (checkState && !isComplete && checkState.correct.includes(idx) ? ' pb-timeline-slot--correct' : '') +
              (checkState && checkState.wrong === idx ? ' pb-timeline-slot--error' : '')
            }
            data-slot-index={idx}
            onDragOver={(e) => {
              if (isComplete || card) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              e.currentTarget.classList.add('pb-timeline-slot--drag-over');
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove('pb-timeline-slot--drag-over')}
            onDrop={(e) => handleDrop(e, idx)}
          >
            <span className="pb-timeline-slot__num">{idx + 1}</span>
            {card ? (
              <div
                className={'pb-story-card pb-story-card--' + card.id + (isHovered(card.id) ? ' pb-highlight' : '')}
                data-event-id={card.id}
                onClick={(e) => {
                  e.stopPropagation();
                  removeCard(idx);
                }}
                onMouseEnter={() => setHoveredId(card.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {card.story}
              </div>
            ) : (
              <span className="pb-timeline-slot__label">Drop card here</span>
            )}
          </div>
        ))}
      </div>

      {/* Check area */}
      <div className="pb-check-area">
        <button type="button" className="pb-check-btn" disabled={!allFilled || isComplete} onClick={checkOrder}>
          ✓ Check Order
        </button>
        <div>{feedback}</div>
      </div>

      {/* Code reveal */}
      <div className="pb-code-reveal">
        <div className="pb-panel-header">💻 Your Python Program</div>
        <div className="pb-code-screen">
          <div className="pb-titlebar">
            <span className="pb-dot pb-dot--r"></span>
            <span className="pb-dot pb-dot--y"></span>
            <span className="pb-dot pb-dot--g"></span>
            <span className="pb-fname">{step.filename || 'main.py'}</span>
          </div>
          <div className="pb-code-body" ref={codeBodyRef}>
            {blocks.length === 0 && (
              <div className="pb-code-empty">Place story cards in the timeline above to build your program.</div>
            )}
            {blocks.map(({ card, lines }) => {
              const isErr = checkState && checkState.wrong !== null && !isComplete && slots[checkState.wrong]?.id === card.id;
              return (
                <div
                  key={card.id}
                  ref={(el) => { blockRefs.current[card.id] = el; }}
                  className={'pb-code-block' + (isErr ? ' pb-code-block--error' : '') + (isHovered(card.id) ? ' pb-highlight' : '')}
                  data-event-id={card.id}
                  onMouseEnter={() => setHoveredId(card.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="pb-code-block__label"># {card.story}</div>
                  {lines.map((line) => (
                    <div
                      key={line.lineNum}
                      className={'pb-code-line' + (currentLine !== null && currentLine + 1 === line.lineNum ? ' pb-code-line--current' : '')}
                      data-linenum={line.lineNum}
                    >
                      <span className="pb-code-gutter">{line.lineNum}</span>
                      {renderHighlightedLine(line.text)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pb-code-actions">
          <button type="button" className="pb-reset-btn" disabled={!isComplete} onClick={reset}>↺ Reset</button>
          <button type="button" className="pb-run" disabled={!isComplete || isRunning} onClick={run}>▶ Run</button>
        </div>

        {terminalOpen && (
          <div className="pb-terminal">
            <div className="pb-terminal-bar">● —  bash — 80×24</div>
            <div className="pb-terminal-output">
              {terminalLines.map((line, i) => (
                <div key={i} className={'pb-terminal-line--' + line.type}>{line.text}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
