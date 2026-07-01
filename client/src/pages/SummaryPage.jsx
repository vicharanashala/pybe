import React from 'react';
import { Brain, Code2, MessageSquareText, Lightbulb, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/TopNavigation';

export function SummaryPage({ result, selected, onViewMentor, onTakeQuiz, onChangeScenario }) {
  if (!result) {
    return (
      <div className="page summary-page">
        <div className="empty-state">
          <p>No session data available. Please complete a learning session first.</p>
          <button className="primary" onClick={onChangeScenario}>Choose a Scenario</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page summary-page">
      <PageHeader
        title="Session Summary"
        subtitle={`You completed: ${selected?.title}`}
      >
        <button className="secondary" onClick={onChangeScenario}>Change Scenario</button>
      </PageHeader>

      <div className="summary-layout">
        <div className="summary-main">
          <div className="panel summary-score-panel">
            <div className="summary-score">
              <span className="score-big">{result.promptScore}</span>
              <small>Prompt Maturity Score</small>
            </div>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-num">{result.abstractionMap?.length || 0}</span>
                <small>Concepts Mapped</small>
              </div>
              <div className="summary-stat">
                <span className="stat-num">{result.earnedXp || 0}</span>
                <small>XP Earned</small>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="section-title"><Brain size={20} /><h2>Abstraction Map</h2></div>
            {result.abstractionMap?.map((item) => (
              <article className="mapping" key={item.pattern}>
                <strong>{item.pattern}</strong>
                <span>{item.pythonConcept}</span>
                <p>{item.explanation}</p>
              </article>
            ))}
          </div>

          <div className="panel">
            <div className="section-title"><Code2 size={20} /><h2>Generated Python Code</h2></div>
            <div className="code-block">
              <pre>{result.generatedCode}</pre>
            </div>
            <p>{result.codeExplanation}</p>
          </div>

          <div className="panel">
            <div className="section-title"><MessageSquareText size={20} /><h2>Prompt Feedback</h2></div>
            <ul className="feedback">
              {result.promptFeedback?.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="summary-actions">
          <button className="primary" onClick={onViewMentor}>
            <Lightbulb size={18} /> View AI Mentor Analysis
          </button>
          <button className="primary quiz-cta" onClick={onTakeQuiz}>
            <Sparkles size={18} /> Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}