import React from 'react';
import { Sparkles, Code2, BookOpen, Lightbulb, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/TopNavigation';

export function MentorPage({ result, selected, onViewW3H, onTakeQuiz }) {
  if (!result) {
    return (
      <div className="page mentor-page">
        <div className="empty-state">
          <p>No mentor analysis available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page mentor-page">
      <PageHeader
        title="AI Mentor Analysis"
        subtitle={`Deep dive into your ${result.abstractionMap?.[0]?.pythonConcept || 'learning'} understanding`}
      >
        <button className="secondary" onClick={onViewW3H}>View W\u00b3H Guide <ChevronRight size={16} /></button>
      </PageHeader>

      <div className="mentor-layout">
        <div className="panel mentor-insights">
          <div className="section-title"><Sparkles size={20} /><h2>Mentor Insights</h2></div>

          <div className="mentor-score">
            <div className="score"><span>{result.promptScore}</span><small>Prompt Maturity</small></div>
          </div>

          {result.abstractionMap?.map((item) => (
            <article className="mapping" key={item.pattern}>
              <strong>{item.pattern}</strong>
              <span>{item.pythonConcept}</span>
              <p>{item.explanation}</p>
            </article>
          ))}

          <div className="code-block">
            <div><Code2 size={18} /> Generated Python</div>
            <pre>{result.generatedCode}</pre>
            <p>{result.codeExplanation}</p>
          </div>

          <ul className="feedback">
            {result.promptFeedback?.map((item) => <li key={item}>{item}</li>)}
          </ul>

          {result.misconceptions?.length > 0 && (
            <div className="note misconception-note">
              <strong>Misconception Watch</strong>
              {result.misconceptions.map((item) => <p key={item}>{item}</p>)}
            </div>
          )}
        </div>

        <div className="mentor-actions">
          <button className="primary" onClick={onViewW3H}>
            <BookOpen size={18} /> Explore W\u00b3H Guide
          </button>
          <button className="primary quiz-cta" onClick={onTakeQuiz}>
            <Sparkles size={18} /> Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}