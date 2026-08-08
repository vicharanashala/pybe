import React, { useState, useEffect } from 'react';
import { ChevronRight, Code2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

export default function CaseStudyView({ learnerName, onComplete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);

  const [caseStageIndex, setCaseStageIndex] = useState(0);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqFeedback, setMcqFeedback] = useState(null);
  const [mcqAttempts, setMcqAttempts] = useState(0);
  const [conceptRevealIndex, setConceptRevealIndex] = useState(0);

  const [stage3Selected, setStage3Selected] = useState(null);
  const [stage3Feedback, setStage3Feedback] = useState(null);
  const [stage3Attempts, setStage3Attempts] = useState(0);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/modules`);
        if (res.ok) {
          const data = await res.json();
          const targetModule = data.find(m => m.id === id);
          if (targetModule) setSelectedModule(targetModule);
        }
      } catch (err) {
        console.error('Failed to load modules:', err);
      }
    };
    fetchModules();
  }, [id]);

  const renderCaseStudy = () => {
    if (!selectedModule?.interactive_case_study) return null;
    const cs = selectedModule.interactive_case_study;
    const stages = cs.stages || [];
    const currentStage = stages[caseStageIndex];
    if (!currentStage) return null;

    return (
      <div className="cs-view">
        {/* Top bar */}
        <div className="cs-topbar">
          <button className="btn-ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          <span className="cs-topbar__title">{cs.title}</span>
          <div className="cs-progress">
            {stages.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`cs-progress__dot ${
                  i < caseStageIndex ? 'cs-progress__dot--done'
                  : i === caseStageIndex ? 'cs-progress__dot--active'
                  : ''
                }`} />
                {i < stages.length - 1 && (
                  <div className={`cs-progress__line ${i < caseStageIndex ? 'cs-progress__line--done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="cs-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={caseStageIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cs-stage-label">
                Step {currentStage.stage_number} of {stages.length} · {currentStage.title}
              </div>

              {currentStage.type === 'mcq' && renderMCQStage(currentStage)}
              {currentStage.type === 'companion_lesson' && renderCompanionLesson(currentStage)}
              {currentStage.type === 'fill_in_blank' && renderFillInBlank(currentStage)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderMCQStage = (stage) => (
    <div>
      <p className="cs-narrative">{stage.narrative}</p>
      <h2 className="cs-question">{stage.question}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
        {stage.options.map((opt, i) => (
          <button
            key={i}
            disabled={mcqFeedback?.correct === true}
            onClick={() => {
              setMcqSelected(i);
              if (i === stage.correct_index) {
                setMcqFeedback({ correct: true, text: stage.companion_response_correct });
              } else {
                setMcqAttempts(prev => prev + 1);
                setMcqFeedback({ correct: false, text: stage.companion_response_incorrect });
              }
            }}
            className={`option-btn ${
              mcqSelected === i
                ? (i === stage.correct_index ? 'option-btn--correct' : 'option-btn--wrong')
                : mcqFeedback?.correct && i === stage.correct_index ? 'option-btn--correct' : ''
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {mcqFeedback && (
        <div className={`feedback-panel ${mcqFeedback.correct ? 'feedback-panel--correct' : 'feedback-panel--wrong'}`}>
          <h4 className={`feedback-panel__title ${mcqFeedback.correct ? 'feedback-panel__title--correct' : 'feedback-panel__title--wrong'}`}>
            {mcqFeedback.correct ? 'Correct!' : 'Not quite'}
          </h4>
          <p className="feedback-panel__text">{mcqFeedback.text}</p>
        </div>
      )}

      {mcqFeedback?.correct && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
          <button
            className="btn-primary"
            onClick={() => {
              setCaseStageIndex(prev => prev + 1);
              setMcqSelected(null);
              setMcqFeedback(null);
              setMcqAttempts(0);
              setConceptRevealIndex(0);
            }}
          >
            Continue
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const renderCompanionLesson = (stage) => {
    const sections = stage.sections || [];
    const revealed = sections.slice(0, conceptRevealIndex + 1);
    const hasMore = conceptRevealIndex < sections.length - 1;

    return (
      <div>
        {revealed.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="lesson-section"
          >
            <h3 className="lesson-section__title">{section.companion_title}</h3>
            <p className="lesson-section__text">{section.text}</p>
          </motion.div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
          {hasMore ? (
            <button className="btn-secondary" onClick={() => setConceptRevealIndex(prev => prev + 1)}>
              Continue Reading
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => {
                setCaseStageIndex(prev => prev + 1);
                setStage3Selected(null);
                setStage3Feedback(null);
                setStage3Attempts(0);
              }}
            >
              Continue
              <Code2 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderFillInBlank = (stage) => {
    const isCorrect = stage3Feedback?.correct;

    let displayCode = stage.code || '';
    if (isCorrect) {
      if (Array.isArray(stage.correct_answer)) {
        stage.correct_answer.forEach(ans => {
          displayCode = displayCode.replace(/_{4,}/, ans);
        });
      } else {
        displayCode = displayCode.replace(/_{4,}/, stage.correct_answer);
      }
    }

    return (
      <div>
        <p className="cs-narrative">{stage.narrative}</p>

        <div className="code-display">
          {displayCode.split('\n').map((line, idx) => {
            if (isCorrect) {
              const answers = Array.isArray(stage.correct_answer) ? stage.correct_answer : [stage.correct_answer];
              let elements = [line];
              answers.forEach((ans, ansIdx) => {
                const newElements = [];
                elements.forEach(el => {
                  if (typeof el === 'string' && el.includes(ans)) {
                    const parts = el.split(ans);
                    parts.forEach((part, i) => {
                      newElements.push(part);
                      if (i < parts.length - 1) {
                        newElements.push(<span key={ans + i + ansIdx} className="highlight">{ans}</span>);
                      }
                    });
                  } else {
                    newElements.push(el);
                  }
                });
                elements = newElements;
              });

              return (
                <div key={idx} style={{ lineHeight: '1.7' }}>
                  {elements.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>)}
                </div>
              );
            }
            return <div key={idx} style={{ lineHeight: '1.7' }}>{line}</div>;
          })}
        </div>

        {!isCorrect && (
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'center' }}>
              Choose the correct answer
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {(stage.options || []).map((opt, i) => (
                <button
                  key={i}
                  disabled={isCorrect}
                  onClick={() => {
                    setStage3Selected(i);
                    if (i === stage.correct_index) {
                      setStage3Feedback({ correct: true, text: stage.explanation, title: 'Well done!' });
                    } else {
                      const hintArray = stage.hints || [];
                      const hintIndex = Math.min(stage3Attempts, hintArray.length - 1);
                      const hintMsg = hintArray[hintIndex] || 'That\'s not right. Try again.';
                      setStage3Attempts(prev => prev + 1);
                      setStage3Feedback({ correct: false, text: hintMsg, title: 'Try Again' });
                    }
                  }}
                  className={`option-btn ${
                    stage3Selected === i
                      ? (i === stage.correct_index ? 'option-btn--correct' : 'option-btn--wrong')
                      : ''
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage3Feedback && (
          <div className={`feedback-panel ${stage3Feedback.correct ? 'feedback-panel--correct' : 'feedback-panel--wrong'}`}>
            <h4 className={`feedback-panel__title ${stage3Feedback.correct ? 'feedback-panel__title--correct' : 'feedback-panel__title--wrong'}`}>
              {stage3Feedback.title}
            </h4>
            <p className="feedback-panel__text">{stage3Feedback.text}</p>
          </div>
        )}

        {isCorrect && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
            <button
              className="btn-primary"
              onClick={() => {
                if (!onComplete) return;
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                fetch(`${API_URL}/modules`)
                  .then(res => res.json())
                  .then(data => {
                    const currentIndex = data.findIndex(m => m.id === id);
                    const nextModule = currentIndex >= 0 && currentIndex < data.length - 1 ? data[currentIndex + 1] : null;
                    onComplete(id, nextModule ? nextModule.id : null);
                  })
                  .catch(() => onComplete(id, null));
              }}
            >
              <CheckCircle size={18} />
              Complete Chapter
            </button>
          </div>
        )}
      </div>
    );
  };

  return <>{renderCaseStudy()}</>;
}
