import React, { useState, useEffect, useRef } from 'react';
import { LESSON_STEPS, MACRO_STAGE_LABELS } from './lessonData.js';
import {
  StoryView,
  QuestionView,
  MappingVisualView,
  DiscoveryView,
  RetrievalView,
  RevealView,
  MentalModelView,
  SyntaxView,
  AssessmentView,
  ReflectionView
} from './StepViews.jsx';
import CodingStep from './CodingStep.jsx';
import './lesson.css';

const AUTO_COMPLETE_TYPES = ["story", "mapping-visual", "reveal", "mental-model", "syntax"];

// ─── The lesson shell (port of lessonEngine + renderer + navigation) ──────────
export default function LessonPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [completion, setCompletion] = useState({});
  const [responses, setResponses] = useState({});
  const cardRef = useRef(null);

  const step = LESSON_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === LESSON_STEPS.length - 1;
  const isCoding = step.type === 'coding';

  // ── engine helpers ──
  const markComplete = (id) => setCompletion((c) => ({ ...c, [id]: true }));
  const markIncomplete = (id) => setCompletion((c) => ({ ...c, [id]: false }));
  const isStepComplete = (id) => !!completion[id];
  const saveResponse = (id, value) => setResponses((r) => ({ ...r, [id]: value }));
  const getResponse = (id) => responses[id];

  // Auto-complete types are marked complete as soon as the step is shown
  useEffect(() => {
    const s = LESSON_STEPS[stepIndex];
    if (AUTO_COMPLETE_TYPES.includes(s.type)) markComplete(s.id);
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const canGoNext = isStepComplete(step.id);

  const goNext = () => {
    if (!canGoNext || isLast) return;
    setStepIndex(stepIndex + 1);
  };

  const goBack = () => {
    if (isFirst) return;
    setStepIndex(stepIndex - 1);
  };

  const checkAllAnswered = (questions, answers) => {
    const all = questions.every((q) => answers[q.id] !== undefined);
    if (all) markComplete(step.id); else markIncomplete(step.id);
  };

  // ── step renderer (port of renderer.RENDERERS) ──
  function renderStep() {
    switch (step.type) {
      case 'story':
        return <StoryView step={step} />;

      case 'question':
        return (
          <QuestionView
            step={step}
            saved={getResponse(step.id)}
            onAnswer={(index) => {
              saveResponse(step.id, index);
              markComplete(step.id);
            }}
          />
        );

      case 'mapping-visual':
        return <MappingVisualView step={step} />;

      case 'discovery':
        return (
          <DiscoveryView
            step={step}
            saved={getResponse(step.id)}
            onAnswer={(qid, index) => {
              const current = getResponse(step.id) || {};
              current[qid] = index;
              saveResponse(step.id, current);
              checkAllAnswered(step.questions, current);
            }}
          />
        );

      case 'retrieval-activity':
        return (
          <RetrievalView
            step={step}
            saved={getResponse(step.id)}
            onProgress={(roundIndex) => {
              saveResponse(step.id, { roundIndex });
              if (roundIndex >= step.rounds.length) markComplete(step.id);
              else markIncomplete(step.id);
            }}
          />
        );

      case 'reveal':
        return <RevealView step={step} />;

      case 'mental-model':
        return <MentalModelView step={step} />;

      case 'syntax':
        return <SyntaxView step={step} />;

      case 'coding':
        return (
          <CodingStep
            key={step.id}
            step={step}
            saved={getResponse(step.id)}
            isStepComplete={isStepComplete(step.id)}
            saveState={(value) => saveResponse(step.id, value)}
            markComplete={markComplete}
            markIncomplete={markIncomplete}
            notify={() => {}}
          />
        );

      case 'assessment':
        return (
          <AssessmentView
            step={step}
            saved={getResponse(step.id)}
            onAnswer={(qid, index) => {
              const current = getResponse(step.id) || {};
              current[qid] = index;
              saveResponse(step.id, current);
              checkAllAnswered(step.questions, current);
            }}
          />
        );

      case 'reflection':
        return (
          <ReflectionView
            step={step}
            saved={getResponse(step.id)}
            onChange={(i, value) => {
              const current = getResponse(step.id) || {};
              current[i] = value;
              saveResponse(step.id, current);
              markComplete(step.id);
            }}
          />
        );

      default:
        return <p>Unknown step type: {step.type}</p>;
    }
  }

  return (
    <div className="pb-page">
      <div className={'pb-lesson' + (isCoding ? ' pb-lesson--wide' : '')}>
        {/* Progress bar */}
        <div className="pb-progress">
          {MACRO_STAGE_LABELS.map((label, index) => (
            <div
              key={label}
              className={
                'pb-pseg' +
                (index < step.macroIndex ? ' pb-pseg--done' : index === step.macroIndex ? ' pb-pseg--live' : '')
              }
              title={label}
            />
          ))}
        </div>

        {/* Header */}
        <div className="pb-head">
          <div className="pb-brand">
            <span className="pb-logo">🐒</span>
            <span className="pb-title">PyBe</span>
            <span className="pb-name">, The Monkey and the Crocodile</span>
          </div>
          <span className="pb-stepno">Step {stepIndex + 1} of {LESSON_STEPS.length}</span>
        </div>

        {/* Card body */}
        <div className="pb-body" ref={cardRef}>
          <div className="pb-content">
            {renderStep()}
          </div>
        </div>

        {/* Footer */}
        <div className="pb-foot">
          <div className="pb-actions">
            <button type="button" className="pb-btn" disabled={isFirst} onClick={goBack}>← Back</button>
            <button type="button" className="pb-btn pb-btn--go" disabled={isLast || !canGoNext} onClick={goNext}>
              {isLast ? '🏁 End of Lesson' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
