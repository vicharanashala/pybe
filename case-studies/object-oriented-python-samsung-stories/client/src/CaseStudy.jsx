import React from 'react';
import {createStoryElements} from '../../../../shared/story-elements.mjs';
const {Completion}=createStoryElements(React);

export default function CaseStudy({ study, onClose, onComplete }) {
  if (!study) return null;
  
  if (study.type === 'interactive') {
    return <InteractiveCaseStudy study={study} onClose={onClose} onComplete={onComplete} />;
  }
  
  return (
    <div className="case-study-overlay" onClick={onClose}>
      <div className="case-study-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>Back to story choices</button>
        <div className="case-study-content">
          <span className="case-study-badge">{study.concept}</span>
          <h2>{study.title}</h2>
          
          <div className="case-study-problem">
            <h3>Problem</h3>
            <p>{study.problemStatement}</p>
          </div>

          <div className="case-study-story">
            <h3>The Story</h3>
            {study.story.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="case-study-questions">
            <h3>Think About It</h3>
            {study.questions.map((q, i) => (
              <div className="question-box" key={q.id}>
                <p><strong>Q{i + 1}.</strong> {q.question}</p>
                <textarea placeholder="Write your answer..." rows={3}></textarea>
              </div>
            ))}
          </div>

          <div className="case-study-syntax">
            <h3>Syntax (Python Code)</h3>
            <pre>{study.syntax}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveCaseStudy({ study, onClose, onComplete }) {
  const [currentStage, setCurrentStage] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [thinkAnswer, setThinkAnswer] = React.useState(null);
  const [q1Answered, setQ1Answered] = React.useState(false);
  const [q2Answered, setQ2Answered] = React.useState(false);
  const [finalQAnswered, setFinalQAnswered] = React.useState(false);
  const [tileSelections, setTileSelections] = React.useState({});
  const [selectedTile, setSelectedTile] = React.useState(null);
  const [codeLineActive, setCodeLineActive] = React.useState(null);
  const [wrongSlots, setWrongSlots] = React.useState([]);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const stages = study.stages;
  const stage = stages[currentStage];
  const REVEAL_AFTER = 3;
  React.useEffect(()=>{if(stage.id==='trophy')onComplete?.(study.id);},[stage.id,study.id,onComplete]);

  function goToStage(n) {
    setCurrentStage(n);
    setCodeLineActive(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleThinkOption(key) {
    setThinkAnswer(key);
  }

  function handleQuizAnswer(questionId, isCorrect, optionIndex) {
    setAnswers({ ...answers, [questionId]: { isCorrect, optionIndex } });
    if (questionId === 'q1' && isCorrect) {
      setQ1Answered(true);
    }
    if (questionId === 'q2' && isCorrect) {
      setQ2Answered(true);
    }
    if (questionId === 'final' && isCorrect) {
      setFinalQAnswered(true);
    }
  }

  function handleTileSelect(tile) {
    if (selectedTile?.id === tile.id) {
      setSelectedTile(null);
    } else {
      setSelectedTile(tile);
    }
  }

  function handleSlotClick(slotIndex) {
    if (!selectedTile) {
      if (tileSelections[slotIndex]) {
        const newSelections = { ...tileSelections };
        delete newSelections[slotIndex];
        setTileSelections(newSelections);
      }
      return;
    }
    setTileSelections({ ...tileSelections, [slotIndex]: selectedTile });
    setSelectedTile(null);
  }

  function handleRunCode() {
    const practiceStage = stages.find(s => s.id === 'practice');
    if (!practiceStage) return;
    
    const filledCount = Object.keys(tileSelections).length;
    if (filledCount < practiceStage.slots.length) {
      return;
    }

    setWrongSlots([]);
    const wrong = [];
    practiceStage.slots.forEach((slot, i) => {
      if (!tileSelections[i] || tileSelections[i].id !== slot.answerId) {
        wrong.push(i);
      }
    });

    if (wrong.length === 0) {
      setWrongSlots([]);
      setShowSuccess(true);
    } else {
      setFailedAttempts(prev => prev + 1);
      setWrongSlots(wrong);
      setShowSuccess(false);
    }
  }

  function handleResetPractice() {
    setTileSelections({});
    setSelectedTile(null);
    setWrongSlots([]);
    setFailedAttempts(0);
    setShowSuccess(false);
  }

  return (
    <div className="case-study-overlay interactive-overlay" onClick={onClose}>
      <div className="case-study-modal interactive-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>Back to story choices</button>
        
        <div className="interactive-content">
          <div className="stepper">
            {stages.filter(s => s.id !== 'trophy').map((s, i) => (
              <div
                key={s.id}
                className={`step-dot ${s.stageNum === stage.stageNum ? 'active' : ''} ${s.stageNum < stage.stageNum ? 'done' : ''}`}
                onClick={() => s.stageNum <= stage.stageNum && goToStage(stages.findIndex(st => st.id === s.id))}
              >
                {s.stageNum < stage.stageNum ? '✓' : s.stageNum}
              </div>
            ))}
          </div>
          <div className="step-label">
            {stage.id !== 'trophy' 
              ? `Stage ${stage.stageNum} of ${stages.length - 1} — ${stage.title}`
              : 'Story complete'
            }
          </div>

          <div className="stage-content">
            {stage.id === 'scenario' && (
              <ScenarioStage stage={stage} onNext={() => goToStage(1)} />
            )}
            {stage.id === 'think' && (
              <ThinkStage 
                stage={stage} 
                thinkAnswer={thinkAnswer} 
                onSelect={handleThinkOption}
                onNext={() => goToStage(2)}
              />
            )}
            {stage.id === 'discover' && (
              <DiscoverStage 
                stage={stage}
                answers={answers}
                q1Answered={q1Answered}
                q2Answered={q2Answered}
                onAnswer={handleQuizAnswer}
                onNext={() => goToStage(3)}
              />
            )}
            {stage.id === 'reveal' && (
              <RevealStage stage={stage} onNext={() => goToStage(4)} />
            )}
            {stage.id === 'learn' && (
              <LearnStage stage={stage} onNext={() => goToStage(5)} />
            )}
            {stage.id === 'code' && (
              <CodeStage 
                stage={stage} 
                codeLineActive={codeLineActive}
                onSelectLine={setCodeLineActive}
                onNext={() => goToStage(6)}
              />
            )}
            {stage.id === 'practice' && (
              <PracticeStage 
                stage={stage}
                tileSelections={tileSelections}
                selectedTile={selectedTile}
                wrongSlots={wrongSlots}
                failedAttempts={failedAttempts}
                showSuccess={showSuccess}
                finalQAnswered={finalQAnswered}
                answers={answers}
                onSelectTile={handleTileSelect}
                onClickSlot={handleSlotClick}
                onRunCode={handleRunCode}
                onReset={handleResetPractice}
                onAnswer={handleQuizAnswer}
                onNext={() => goToStage(7)}
              />
            )}
            {stage.id === 'trophy' && (
              <TrophyStage stage={stage} onRestart={() => goToStage(0)} />
            )}
          </div>

          {currentStage > 0 && currentStage < stages.length - 1 && (
            <div className="nav-row">
              <button className="btn-nav" onClick={() => goToStage(currentStage - 1)}>
                ← Back
              </button>
              {currentStage < stages.length - 1 && (
                <button className="btn-nav pri" onClick={() => goToStage(currentStage + 1)}>
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScenarioStage({ stage, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <div className="story-box" dangerouslySetInnerHTML={{ __html: stage.story }}></div>
      <p>{stage.promptText}</p>
      <div className="btn-row">
        <button className="btn" onClick={onNext}>I understand the story →</button>
      </div>
    </div>
  );
}

function ThinkStage({ stage, thinkAnswer, onSelect, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.promptText}</p>
      <div className="option-grid">
        {stage.options.map((opt) => (
          <button
            key={opt.key}
            className={`option-card ${thinkAnswer === opt.key ? 'picked' : ''}`}
            onClick={() => onSelect(opt.key)}
          >
            <span className="opt-letter">{opt.letter}</span>
            {opt.text}
          </button>
        ))}
      </div>
      {thinkAnswer && (
        <div className="response-box show" dangerouslySetInnerHTML={{ __html: stage.responses[thinkAnswer] }}></div>
      )}
      <div className="btn-row">
        <button className="btn" disabled={!thinkAnswer} onClick={onNext}>
          Test my understanding →
        </button>
      </div>
      {!thinkAnswer && <div className="unlock-note">Pick an option above to unlock this button</div>}
    </div>
  );
}

function DiscoverStage({ stage, answers, q1Answered, q2Answered, onAnswer, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      
      <div className="quiz-block">
        <div className="quiz-q">{stage.questions[0].text}</div>
        <div className="quiz-options">
          {stage.questions[0].options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-opt ${answers.q1?.optionIndex === i ? (opt.correct ? 'correct' : 'wrong') : ''} ${answers.q1 && answers.q1.optionIndex !== i ? '' : ''}`}
              onClick={() => !answers.q1?.isCorrect && onAnswer('q1', opt.correct, i)}
              disabled={Boolean(answers.q1?.isCorrect)}
            >
              {opt.text}
            </button>
          ))}
        </div>
        {answers.q1 && (
          <div className={`quiz-feedback ${answers.q1.isCorrect ? 'correct' : 'wrong'}`}>
            {answers.q1.isCorrect ? '✓ Correct!' : 'Not quite — try another option.'}
          </div>
        )}
      </div>

      {q1Answered && (
        <div className="quiz-block q2-block show">
          <div className="quiz-q">{stage.questions[1].text}</div>
          <div className="quiz-options">
            {stage.questions[1].options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-opt ${answers.q2?.optionIndex === i ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => !answers.q2?.isCorrect && onAnswer('q2', opt.correct, i)}
                disabled={Boolean(answers.q2?.isCorrect)}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {answers.q2 && (
            <div className={`quiz-feedback ${answers.q2.isCorrect ? 'correct' : 'wrong'}`}>
              {answers.q2.isCorrect ? '✓ Correct!' : 'Not quite — try another option.'}
            </div>
          )}
        </div>
      )}

      <div className="btn-row">
        <button className="btn" disabled={!q2Answered} onClick={onNext}>
          Show me the connection →
        </button>
      </div>
    </div>
  );
}

function RevealStage({ stage, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.description}</p>

      <div className="arrow-row">
        <div className="arrow-box">📐 The Blueprint</div>
        <div className="arrow-sym">→</div>
        <div className="arrow-box">class Phone</div>
      </div>

      <table className="map-table">
        <thead>
          <tr><th>In the story</th><th>In code</th><th>Term</th></tr>
        </thead>
        <tbody>
          {stage.mapping.map((row, i) => (
            <tr key={i}>
              <td>{row.story}</td>
              <td><code>{row.code}</code></td>
              <td><span className={`pill ${row.term === 'class' || row.term === 'attribute' || row.term === 'method' ? 'blue' : 'amber'}`}>{row.term}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>{stage.conclusion}</p>

      <div className="btn-row">
        <button className="btn" onClick={onNext}>Now teach me the terms →</button>
      </div>
    </div>
  );
}

function LearnStage({ stage, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>

      <div className="concept-grid">
        {stage.concepts.map((concept, i) => (
          <div key={i} className="concept-card">
            <h4>{concept.term}</h4>
            <p>{concept.definition}</p>
          </div>
        ))}
      </div>

      <p className="vocab-label">Vocabulary at a glance</p>
      <div className="chip-row">
        {stage.chips.map((chip, i) => (
          <span key={i} className="chip">{chip}</span>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onNext}>Show me the actual code →</button>
      </div>
    </div>
  );
}

function CodeStage({ stage, codeLineActive, onSelectLine, onNext }) {
  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.promptText}</p>

      <div className="code-block">
        {stage.codeLines.map((line, i) => (
          <div
            key={i}
            className={`code-line ${codeLineActive === i ? 'active' : ''}`}
            onClick={() => line.explain && onSelectLine(i)}
          >
            <span className="ln">{i + 1}</span>
            <span className="code" dangerouslySetInnerHTML={{ __html: line.code || '&nbsp;' }}></span>
          </div>
        ))}
      </div>
      <div className="explain-box">
        {codeLineActive !== null && stage.codeLines[codeLineActive]?.explain 
          ? stage.codeLines[codeLineActive].explain
          : <span className="hint">Click a line above to see its explanation here.</span>
        }
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onNext}>I'm ready to practice →</button>
      </div>
    </div>
  );
}

function PracticeStage({ stage, tileSelections, selectedTile, wrongSlots, failedAttempts, showSuccess, finalQAnswered, answers, onSelectTile, onClickSlot, onRunCode, onReset, onAnswer, onNext }) {
  const REVEAL_AFTER = 3;
  const filledCount = Object.keys(tileSelections).length;
  const allFilled = filledCount >= stage.slots.length;
  const showHint = failedAttempts >= REVEAL_AFTER && wrongSlots.length > 0;

  return (
    <div className="stage-card">
      <div className="stage-kicker">{stage.kicker}</div>
      <h2>{stage.heading}</h2>
      <p>{stage.promptText}</p>

      <div className="practice-area">
        <div className="tile-bank">
          {stage.tiles.map((tile) => (
            <div
              key={tile.id}
              className={`tile ${selectedTile?.id === tile.id ? 'selected' : ''} ${Object.values(tileSelections).some(t => t?.id === tile.id) ? 'used' : ''}`}
              onClick={() => onSelectTile(tile)}
            >
              {tile.text}
            </div>
          ))}
        </div>

        <div className="slots">
          {stage.slots.map((slot, i) => (
            <div key={i} className="slot-row">
              <span className="ln">{slot.ln}</span>
              <div
                className={`slot ${tileSelections[i] ? 'filled' : 'empty-hint'} ${wrongSlots.includes(i) ? 'wrong-slot' : ''}`}
                onClick={() => onClickSlot(i)}
              >
                {tileSelections[i] ? slot.prefix + tileSelections[i].text : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="btn-row" style={{ marginTop: 0, justifyContent: 'flex-start' }}>
          <button className="btn amber" onClick={onRunCode}>▶ Run Code</button>
          <button className="btn" style={{ background: '#8a8577' }} onClick={onReset}>↺ Reset</button>
        </div>

        <div className="console-out">
          {!allFilled && <span className="prompt">&gt;&gt;&gt; </span>}
          {!allFilled ? 'Fill every slot before running the code.' : 
           showSuccess ? <>{stage.successOutput}</> :
           wrongSlots.length > 0 ? `Hmm, that doesn't run cleanly. ${wrongSlots.length} line${wrongSlots.length > 1 ? 's' : ''} out of place — highlighted in red. Try rearranging (${Math.max(0, REVEAL_AFTER - failedAttempts)} attempt${REVEAL_AFTER - failedAttempts !== 1 ? 's' : ''} left before I show the answer).` :
           <><span className="prompt">&gt;&gt;&gt; </span>output will appear here</>
          }
        </div>

        {showHint && (
          <div className="order-hint show">
            <div className="hint-title">Correct line order</div>
            <ol>
              {stage.slots.map((slot, i) => {
                const tile = stage.tiles.find(t => t.id === slot.answerId);
                const isCorrect = tileSelections[i]?.id === slot.answerId;
                return (
                  <li key={i} className={isCorrect ? 'line-correct' : 'line-wrong'}>
                    {slot.prefix + tile.text}{isCorrect ? ' ✓ (you had this right)' : ' ← yours differs here'}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="quiz-block q2-block show">
          <div className="quiz-q">{stage.finalQuestion.text}</div>
          <div className="quiz-options">
            {stage.finalQuestion.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-opt ${answers.final?.optionIndex === i ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => !answers.final?.isCorrect && onAnswer('final', opt.correct, i)}
                disabled={Boolean(answers.final?.isCorrect)}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {answers.final && (
            <div className={`quiz-feedback ${answers.final.isCorrect ? 'correct' : 'wrong'}`}>
              {answers.final.isCorrect ? '✓ Correct!' : 'Not quite — try another option.'}
            </div>
          )}
        </div>
      )}

      <div className="btn-row">
        <button className="btn amber" disabled={!finalQAnswered} onClick={onNext}>
          Review the story conclusion →
        </button>
      </div>
    </div>
  );
}

function TrophyStage({stage,onRestart}){
  return <Completion title={stage.heading} description={stage.conclusion} homeLabel="Replay the lesson" onHome={onRestart}/>;
}
