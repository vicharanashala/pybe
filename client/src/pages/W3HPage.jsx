import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/TopNavigation';
import { W3H } from '../components/SharedComponents';

export function W3HPage({ result, onTakeQuiz, onViewDashboard }) {
  if (!result) {
    return (
      <div className="page w3h-page">
        <div className="empty-state">
          <p>No W\u00b3H data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page w3h-page">
      <PageHeader
        title="W\u00b3H Learning Guide"
        subtitle="Understand your learning from four perspectives"
      >
        <button className="secondary" onClick={onViewDashboard}>Go to Dashboard <ChevronRight size={16} /></button>
      </PageHeader>

      <div className="w3h-layout">
        <div className="w3h-main">
          <W3H result={result} />
        </div>

        <div className="w3h-actions">
          <button className="primary quiz-cta" onClick={onTakeQuiz}>
            <Sparkles size={18} /> Take Quiz
          </button>
          <button className="secondary" onClick={onViewDashboard}>
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}