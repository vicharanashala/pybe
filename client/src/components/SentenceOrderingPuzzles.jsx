import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, HelpCircle, Layers, Trophy } from 'lucide-react';

export function SentenceOrderingPuzzles({ story, onActivityDone }) {
  const [activeTab, setActiveTab] = useState('ascending'); // 'fillups', 'ascending', 'descending'
  const [fillAnswers, setFillAnswers] = useState({});
  const [fillSubmitted, setFillSubmitted] = useState(false);
  const activityFiredRef = React.useRef(false);

  // Puzzle items for Ascending / Descending
  const getBaseItems = (s) => s.orderingPuzzle || [
    { id: 'p1', text: `${s.character} attempts risky action inside try: block.`, correctAscending: 1, pythonCode: 'try:\n    risky_action()' },
    { id: 'p2', text: 'Risky action raises an exception during execution.', correctAscending: 2, pythonCode: `raise ${s.errorType}()` },
    { id: 'p3', text: `Catch ${s.errorType} in except: safety net handler.`, correctAscending: 3, pythonCode: `except ${s.errorType}:` },
    { id: 'p4', text: 'Clean up resources inside finally: block guaranteed.', correctAscending: 4, pythonCode: 'finally:\n    cleanup()' },
  ];

  const baseItems = getBaseItems(story);

  // Ascending state (chronological order: 1 -> 4)
  const [ascOrder, setAscOrder] = useState(() => [...getBaseItems(story)].sort(() => Math.random() - 0.5));
  const [ascChecked, setAscChecked] = useState(false);
  const [ascCorrect, setAscCorrect] = useState(false);

  // Descending state (reverse order: 4 -> 1)
  const [descOrder, setDescOrder] = useState(() => [...getBaseItems(story)].sort(() => Math.random() - 0.5));
  const [descChecked, setDescChecked] = useState(false);
  const [descCorrect, setDescCorrect] = useState(false);

  // Reset everything when story changes
  useEffect(() => {
    const freshItems = getBaseItems(story);
    setAscOrder([...freshItems].sort(() => Math.random() - 0.5));
    setDescOrder([...freshItems].sort(() => Math.random() - 0.5));
    setAscChecked(false);
    setAscCorrect(false);
    setDescChecked(false);
    setDescCorrect(false);
    setFillAnswers({});
    setFillSubmitted(false);
    activityFiredRef.current = false;
  }, [story.id]); // eslint-disable-line react-hooks/exhaustive-deps



  // Ascending move item up/down
  const moveAsc = (index, direction) => {
    const newItems = [...ascOrder];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < newItems.length) {
      [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
      setAscOrder(newItems);
      setAscChecked(false);
    }
  };

  // Descending move item up/down
  const moveDesc = (index, direction) => {
    const newItems = [...descOrder];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target >= 0 && target < newItems.length) {
      [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
      setDescOrder(newItems);
      setDescChecked(false);
    }
  };

  const [completedModes, setCompletedModes] = useState({ asc: false, desc: false, fill: false });

  const recordModeDone = (key) => {
    setCompletedModes(prev => {
      const next = { ...prev, [key]: true };
      const count = Object.values(next).filter(Boolean).length;
      if (count >= 2 && !activityFiredRef.current) {
        activityFiredRef.current = true;
        onActivityDone && onActivityDone();
      }
      return next;
    });
  };

  const checkAscending = () => {
    const isRight = ascOrder.every((item, idx) => item.correctAscending === idx + 1);
    setAscCorrect(isRight);
    setAscChecked(true);
    recordModeDone('asc');
  };

  const checkDescending = () => {
    const maxLen = baseItems.length;
    const isRight = descOrder.every((item, idx) => item.correctAscending === maxLen - idx);
    setDescCorrect(isRight);
    setDescChecked(true);
    recordModeDone('desc');
  };

  const fillups = story.fillups || {
    question: `Fill in missing exception keywords for ${story.character}:`,
    codeSnippet: ['[SLOT_1]:', `    ${story.character.toLowerCase()}.act()`, `[SLOT_2] ${story.errorType}:`, '    handle_error()'],
    options: ['try:', 'except', 'finally:', 'else:'],
    answers: { SLOT_1: 'try:', SLOT_2: 'except' }
  };

  const checkFillups = () => {
    setFillSubmitted(true);
    recordModeDone('fill');
  };

  const isFillupsCorrect = () => {
    return Object.keys(fillups.answers).every(k => fillAnswers[k] === fillups.answers[k]);
  };

  return (
    <div className="sop-root">
      {/* Subnav header */}
      <div className="sop-subnav">
        <button
          className={`sop-nav-btn ${activeTab === 'ascending' ? 'active' : ''}`}
          onClick={() => setActiveTab('ascending')}
        >
          <ArrowUp size={16} /> 1. Ascending Sentence Mode (First → Last)
        </button>

        <button
          className={`sop-nav-btn ${activeTab === 'descending' ? 'active' : ''}`}
          onClick={() => setActiveTab('descending')}
        >
          <ArrowDown size={16} /> 2. Decreasing Sentence Mode (Final Outcome → Setup)
        </button>

        <button
          className={`sop-nav-btn ${activeTab === 'fillups' ? 'active' : ''}`}
          onClick={() => setActiveTab('fillups')}
        >
          <HelpCircle size={16} /> 3. Interactive Fill-ups & Code Completion
        </button>
      </div>

      {/* MODE 1: ASCENDING MODE */}
      {activeTab === 'ascending' && (
        <div className="sop-mode-card">
          <div className="sop-mode-hdr">
            <div>
              <h3>⬆️ Ascending Sentence Ordering (Chronological Flow)</h3>
              <p>Reorder the story lines and code blocks from <strong>Step 1 (First Action) to Step N (Final Handler)</strong> using the up/down arrows.</p>
            </div>
            <button className="sop-reset-btn" onClick={() => setAscOrder([...baseItems].sort(() => Math.random() - 0.5))}>
              <RotateCcw size={14} /> Shuffle
            </button>
          </div>

          <div className="sop-list">
            {ascOrder.map((item, idx) => (
              <div key={item.id} className="sop-item">
                <div className="sop-item-num">{idx + 1}</div>
                <div className="sop-item-content">
                  <p className="sop-item-text">{item.text}</p>
                  <pre className="sop-item-code">{item.pythonCode}</pre>
                </div>
                <div className="sop-item-arrows">
                  <button className="sop-arrow-btn" onClick={() => moveAsc(idx, 'up')} disabled={idx === 0}>
                    <ArrowUp size={14} />
                  </button>
                  <button className="sop-arrow-btn" onClick={() => moveAsc(idx, 'down')} disabled={idx === ascOrder.length - 1}>
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sop-footer">
            <button className="sop-check-btn" onClick={checkAscending}>
              Check Ascending Order
            </button>
            {ascChecked && (
              <div className={`sop-result-pill ${ascCorrect ? 'correct' : 'wrong'}`}>
                {ascCorrect ? '🎉 Perfect Ascending Order! Step 1 to Last is spot on!' : '❌ Incorrect order. Try moving items into chronological order!'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: DECREASING MODE */}
      {activeTab === 'descending' && (
        <div className="sop-mode-card">
          <div className="sop-mode-hdr">
            <div>
              <h3>⬇️ Decreasing Sentence Ordering (Reverse Logic Breakdown)</h3>
              <p>Reorder the steps from the <strong>Final Outcome / Safety Net Handler back down to Initial Setup</strong>.</p>
            </div>
            <button className="sop-reset-btn" onClick={() => setDescOrder([...baseItems].sort(() => Math.random() - 0.5))}>
              <RotateCcw size={14} /> Shuffle
            </button>
          </div>

          <div className="sop-list">
            {descOrder.map((item, idx) => (
              <div key={item.id} className="sop-item reverse-item">
                <div className="sop-item-num rev-num">Step {descOrder.length - idx}</div>
                <div className="sop-item-content">
                  <p className="sop-item-text">{item.text}</p>
                  <pre className="sop-item-code">{item.pythonCode}</pre>
                </div>
                <div className="sop-item-arrows">
                  <button className="sop-arrow-btn" onClick={() => moveDesc(idx, 'up')} disabled={idx === 0}>
                    <ArrowUp size={14} />
                  </button>
                  <button className="sop-arrow-btn" onClick={() => moveDesc(idx, 'down')} disabled={idx === descOrder.length - 1}>
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sop-footer">
            <button className="sop-check-btn" onClick={checkDescending}>
              Check Decreasing Order
            </button>
            {descChecked && (
              <div className={`sop-result-pill ${descCorrect ? 'correct' : 'wrong'}`}>
                {descCorrect ? '🎉 Outstanding Reverse Logic! You ordered from Outcome back to Start!' : '❌ Incorrect reverse order. Try moving the final handler to the top!'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: FILL-UPS */}
      {activeTab === 'fillups' && (
        <div className="sop-mode-card">
          <div className="sop-mode-hdr">
            <div>
              <h3>🧩 Interactive Code Fill-ups</h3>
              <p>{fillups.question}</p>
            </div>
          </div>

          <div className="sop-fillups-box">
            <div className="sop-code-snippet-box">
              {fillups.codeSnippet.map((line, lIdx) => (
                <div key={lIdx} className="fillup-line">
                  {line.split(/(\[SLOT_\d+\])/g).map((part, pIdx) => {
                    const match = part.match(/\[(SLOT_\d+)\]/);
                    if (match) {
                      const slotKey = match[1];
                      return (
                        <select
                          key={pIdx}
                          className="fillup-select"
                          value={fillAnswers[slotKey] || ''}
                          onChange={(e) => setFillAnswers({ ...fillAnswers, [slotKey]: e.target.value })}
                        >
                          <option value="">-- Choose Keyword --</option>
                          {fillups.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      );
                    }
                    return <span key={pIdx}>{part}</span>;
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="sop-footer">
            <button className="sop-check-btn" onClick={checkFillups}>
              Validate Fill-ups
            </button>

            {fillSubmitted && (
              <div className={`sop-result-pill ${isFillupsCorrect() ? 'correct' : 'wrong'}`}>
                {isFillupsCorrect() ? '🎉 Correct! All exception keywords placed accurately!' : '❌ Some choices are incorrect. Review the code structure and try again!'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
