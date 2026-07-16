import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Compass, Eye, ListChecks, Target } from 'lucide-react';
import GuidedQuestions from './GuidedQuestions';
import LearnerWorkspace from './LearnerWorkspace';
import FeedbackPanel from './FeedbackPanel';
import ReflectionForm from './ReflectionForm';
import OfficialSolution from './OfficialSolution';
import AIExplanationPanel from './AIExplanationPanel';
import CodeReviewPanel from './CodeReviewPanel';
import { getResponse, submitResponse, submitReflection, updateProgressStep } from '../api/client';

// Maps a saved response's `step` (backend) to the local UI flow step.
const RESPONSE_STEP_TO_FLOW_STEP = {
  workspace: 'workspace',
  submitted: 'feedback',
  revealed: 'solution',
  completed: 'completed'
};

/**
 * Full scenario page implementing the Phase 2 guided learning flow:
 * Read Scenario -> Answer Guided Questions -> Write Your Reasoning ->
 * Submit -> Receive Feedback -> Reveal Official Solution -> Compare ->
 * Reflection. The official solution is never shown before the learner
 * submits their own reasoning, unless they've already completed this
 * scenario before.
 */
function ScenarioDetails({ scenario, onBack }) {
  const [flowStep, setFlowStep] = useState('intro');
  const [existingResponse, setExistingResponse] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [submittingWorkspace, setSubmittingWorkspace] = useState(false);
  const [submittingReflection, setSubmittingReflection] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingResume(true);
    setFlowStep('intro');
    setFeedback(null);

    getResponse(scenario._id)
      .then((response) => {
        if (cancelled) return;
        setExistingResponse(response);
        if (response?.feedback) setFeedback(response.feedback);
        if (response?.step && RESPONSE_STEP_TO_FLOW_STEP[response.step]) {
          setFlowStep(RESPONSE_STEP_TO_FLOW_STEP[response.step]);
        }
      })
      .catch(() => { if (!cancelled) setExistingResponse(null); })
      .finally(() => { if (!cancelled) setLoadingResume(false); });

    updateProgressStep(scenario._id, 'reading').catch(() => {});

    return () => { cancelled = true; };
  }, [scenario._id]);

  function goToWorkspace() {
    updateProgressStep(scenario._id, 'questions').catch(() => {});
    setFlowStep('workspace');
  }

  function handleSaveDraft(draftFields) {
    submitResponse(scenario._id, { ...draftFields, step: 'workspace' }).catch(() => {});
  }

  async function handleWorkspaceSubmit(fields) {
    setSubmittingWorkspace(true);
    try {
      const response = await submitResponse(scenario._id, { ...fields, step: 'submitted' });
      setExistingResponse(response);
      setFeedback(response.feedback);
      setFlowStep('feedback');
    } finally {
      setSubmittingWorkspace(false);
    }
  }

  function revealSolution() {
    submitResponse(scenario._id, { step: 'revealed' }).catch(() => {});
    setFlowStep('solution');
  }

  async function handleReflectionSubmit(answers) {
    setSubmittingReflection(true);
    try {
      await submitReflection(scenario._id, answers);
      setFlowStep('completed');
    } finally {
      setSubmittingReflection(false);
    }
  }

  return (
    <div className="scenario-details">
      <button type="button" className="back-button" onClick={onBack}>
        <ArrowLeft size={16} /> Back to scenarios
      </button>

      <header className="scenario-details-header">
        <span className={`difficulty-badge difficulty-${scenario.difficulty?.toLowerCase()}`}>
          {scenario.difficulty}
        </span>
        <h1>{scenario.title}</h1>
        <div className="concept-tags">
          {scenario.concepts?.map((concept) => <span key={concept} className="concept-tag">{concept}</span>)}
        </div>
      </header>

      {flowStep === 'completed' && (
        <div className="flow-banner completed">
          <CheckCircle2 size={18} /> You've completed this scenario. Your reflection has been saved.
        </div>
      )}

      <section className="panel">
        <div className="section-title"><Compass size={20} /><h2>Scenario</h2></div>
        <p className="context">{scenario.context}</p>

        <div className="detail-columns">
          <div>
            <h3><ListChecks size={16} /> Learning objectives</h3>
            <ul>
              {scenario.objectives?.map((objective) => <li key={objective}>{objective}</li>)}
            </ul>
          </div>
          <div>
            <h3><Target size={16} /> Expected outcome</h3>
            <p>{scenario.expectedOutcome}</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-title"><h2>Guided reasoning</h2></div>
        <p className="section-subtitle">Work through these questions, then write your own reasoning below.</p>
        <GuidedQuestions questions={scenario.guidedQuestions} />
        <AIExplanationPanel concept={scenario.concepts?.[0] || scenario.title} scenarioId={scenario._id} />

        {flowStep === 'intro' && !loadingResume && (
          <button type="button" className="primary flow-continue-button" onClick={goToWorkspace}>
            Continue to my workspace
          </button>
        )}
      </section>

      {(flowStep === 'workspace' || flowStep === 'feedback' || flowStep === 'solution') && (
        <section className="panel">
          <div className="section-title"><h2>My workspace</h2></div>
          <p className="section-subtitle">
            Write your own thinking first. The official solution stays hidden until you submit.
          </p>
          <LearnerWorkspace
            scenario={scenario}
            initialValues={existingResponse}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleWorkspaceSubmit}
            submitting={submittingWorkspace}
          />
        </section>
      )}

      {(flowStep === 'feedback' || flowStep === 'solution') && feedback && (
        <section className="panel">
          <div className="section-title"><h2>Feedback on your reasoning</h2></div>
          <FeedbackPanel feedback={feedback} />

          {flowStep === 'feedback' && (
            <button type="button" className="primary flow-continue-button" onClick={revealSolution}>
              <Eye size={16} /> Reveal official solution
            </button>
          )}
        </section>
      )}

      {(flowStep === 'solution' || flowStep === 'completed') && (
        <>
          <OfficialSolution scenario={scenario} />

          {existingResponse && (
            <section className="panel">
              <div className="section-title"><h2>Compare your solution</h2></div>
              <div className="compare-grid">
                <div>
                  <h3>Your reasoning</h3>
                  <p>{existingResponse.reasoning || '(not answered)'}</p>
                </div>
                <div>
                  <h3>Your computational thinking</h3>
                  <p>{existingResponse.computationalThinking || '(not answered)'}</p>
                </div>
              </div>
            </section>
          )}

          {flowStep === 'solution' && (
            <section className="panel">
              <div className="section-title"><h2>Try writing your own code</h2></div>
              <p className="section-subtitle">Write your own version and get an AI code review before reflecting.</p>
              <CodeReviewPanel scenarioId={scenario._id} />
            </section>
          )}

          {flowStep === 'solution' && (
            <section className="panel">
              <div className="section-title"><h2>Reflection</h2></div>
              <ReflectionForm onSubmit={handleReflectionSubmit} submitting={submittingReflection} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default ScenarioDetails;
