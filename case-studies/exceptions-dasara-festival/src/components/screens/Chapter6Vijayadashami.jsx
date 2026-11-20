import {parseTemplate} from '../../../../../library/learning/core.mjs';
import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter6Vijayadashami({ chapter, onChallengeSolved, onContinue }) {
  const [answers, setAnswers] = useState({
    b1: '',
    b2: '',
    b3: '',
    b4: '',
  });
  const [checked, setChecked] = useState(false);

  const blanks = chapter.finalCodeChallenge.blanks;

  const handleChange = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val.toLowerCase().trim() }));
    setChecked(false);
  };

  const isB1Correct = answers.b1 === 'try';
  const isB2Correct = answers.b2 === 'except';
  const isB3Correct = answers.b3 === 'else';
  const isB4Correct = answers.b4 === 'finally';
  const allCorrect = isB1Correct && isB2Correct && isB3Correct && isB4Correct;

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect) {
      sound.playSuccess();
      if (onChallengeSolved) onChallengeSolved(true);
    } else {
      sound.playError();
    }
  };

  const handleFillAll = () => {
    setAnswers({ b1: 'try', b2: 'except', b3: 'else', b4: 'finally' });
    setChecked(true);
    sound.playSuccess();
    if (onChallengeSolved) onChallengeSolved(true);
  };

  return (
    <section className="screen screen-concept" aria-labelledby="chapter6-heading">
      <div className="pybe-single-column">
        <header className="pybe-header-centered">
          <h2 id="chapter6-heading" className="pybe-story-title">
            The Complete 4-Part Structure
          </h2>
          <p className="pybe-lead">
            Python gives you complete control over every possible outcome: success, failure, and cleanup.
          </p>
        </header>

        {/* 4 Cards Overview (PyBe style) */}
        <div className="pybe-roles-grid">
          <div className="role-mini-card">
            <span className="mini-keyword">try</span>
            <span className="mini-role">Attempt risky code</span>
          </div>
          <div className="role-mini-card">
            <span className="mini-keyword">except</span>
            <span className="mini-role">Run on failure</span>
          </div>
          <div className="role-mini-card">
            <span className="mini-keyword">else</span>
            <span className="mini-role">Run on success</span>
          </div>
          <div className="role-mini-card">
            <span className="mini-keyword">finally</span>
            <span className="mini-role">Always run (cleanup)</span>
          </div>
        </div>

        {/* Fill in the Blanks Editor */}
        <div className="pybe-card pybe-blanks-card">
          <h3 className="blanks-title">Write the code: Complete the registration desk</h3>
          <p className="blanks-lead">Fill in the 4 blanks to assemble the pipeline:</p>

          <div className="pybe-editor-box">
            <pre className="blank-code-line" style={{whiteSpace:'pre-wrap'}}>{parseTemplate(chapter.finalCodeChallenge.template).parts.map((part,index)=>{
              if(part.type==='text')return <React.Fragment key={index}>{part.content}</React.Fragment>;
              const blank=blanks[part.index];
              const correct=answers[blank.id] === blank.answer;
              return <input key={index} type="text" className={`pybe-blank-field ${checked ? (correct ? 'field-ok' : 'field-fail') : ''}`} value={answers[blank.id]} onChange={event=>handleChange(blank.id,event.target.value)} placeholder={`blank ${part.index+1}`} aria-label={`Blank ${part.index+1}: ${blank.hint}`} title={blank.hint}/>;
            })}</pre>
            <ol>{blanks.map(blank=><li key={blank.id} className="field-hint">{blank.hint}</li>)}</ol>
          </div>

          <div className="blanks-actions">
            <button className="btn btn-primary" onClick={handleCheck}>
              Check Code
            </button>
            <button className="btn btn-secondary" onClick={handleFillAll}>
              Fill Answers
            </button>
          </div>

          {checked && (
            <div className={`pybe-feedback-box ${allCorrect ? 'feedback-correct' : 'feedback-hint'}`}>
              <span className="feedback-status-title">
                {allCorrect ? '✓ Excellent work!' : '💡 Check the blanks:'}
              </span>
              <p>
                {allCorrect
                  ? 'All 4 keywords placed correctly. Notice how else only runs on success, while finally always runs.'
                  : 'Make sure you type: try, except, else, and finally.'}
              </p>
            </div>
          )}

          {checked && allCorrect && (
            <div className="reveal-action-center" style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  sound.playSuccess();
                  if (onContinue) onContinue();
                }}
              >
                Try it in the interactive lab &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
